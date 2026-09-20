/**
 * Server functions for subscriptions: checkout, billing portal, topic changes
 * and cancellation. Every call verifies the caller's session server-side.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { PlanCode } from "./plans";
import { isValidTopicSlug } from "./topics";

const SITE_FALLBACK = "https://www.uktesthub.com";

function siteOrigin(origin?: string | null): string {
  if (origin && /^https?:\/\//.test(origin)) return origin.replace(/\/$/, "");
  return process.env["SITE_URL"]?.replace(/\/$/, "") || SITE_FALLBACK;
}

const PaidPlan = z.enum(["exam_pro", "premium_monthly", "premium_annual"]);

const CheckoutSchema = z.object({
  accessToken: z.string().min(20).max(4096),
  plan: PaidPlan,
  topicSlug: z.string().min(1).max(120).nullable().optional(),
  origin: z.string().max(200).nullable().optional(),
});

async function requireUser(accessToken: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data?.user) throw new Error("Please sign in again to continue.");
  return { userId: data.user.id, email: data.user.email ?? undefined, supabaseAdmin };
}

/** Creates (or reuses) the Stripe customer for a user. */
async function ensureCustomer(
  supabaseAdmin: Awaited<ReturnType<typeof requireUser>>["supabaseAdmin"],
  userId: string,
  email: string | undefined,
) {
  const { stripeRequest } = await import("./stripe.server");
  const { data: row } = await supabaseAdmin
    .from("subscriptions")
    .select("provider_customer_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (row?.provider_customer_id) return row.provider_customer_id;

  const customer = await stripeRequest<{ id: string }>("/customers", {
    method: "POST",
    body: { email, metadata: { supabase_user_id: userId } },
  });

  await supabaseAdmin
    .from("subscriptions")
    .upsert(
      { user_id: userId, provider: "stripe", provider_customer_id: customer.id },
      { onConflict: "user_id" },
    );
  return customer.id;
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CheckoutSchema.parse(d))
  .handler(async ({ data }): Promise<{ url: string | null; error: string | null }> => {
    try {
      if (data.plan === "exam_pro" && !isValidTopicSlug(data.topicSlug ?? null)) {
        return { url: null, error: "Please choose the test topic you want to unlock." };
      }
      const { userId, email, supabaseAdmin } = await requireUser(data.accessToken);
      const { stripeRequest, priceIdForPlan } = await import("./stripe.server");
      const customerId = await ensureCustomer(supabaseAdmin, userId, email);
      const origin = siteOrigin(data.origin);

      const session = await stripeRequest<{ id: string; url: string }>("/checkout/sessions", {
        method: "POST",
        body: {
          mode: "subscription",
          customer: customerId,
          "line_items[0][price]": priceIdForPlan(data.plan),
          "line_items[0][quantity]": 1,
          allow_promotion_codes: true,
          client_reference_id: userId,
          success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/checkout/cancelled`,
          metadata: {
            supabase_user_id: userId,
            plan_code: data.plan,
            topic_slug: data.plan === "exam_pro" ? (data.topicSlug ?? "") : "",
          },
          "subscription_data[metadata][supabase_user_id]": userId,
          "subscription_data[metadata][plan_code]": data.plan,
          "subscription_data[metadata][topic_slug]":
            data.plan === "exam_pro" ? (data.topicSlug ?? "") : "",
        },
      });
      return { url: session.url, error: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Checkout could not be started.";
      console.error("[subscription] createCheckoutSession", message);
      return { url: null, error: message };
    }
  });

const PortalSchema = z.object({
  accessToken: z.string().min(20).max(4096),
  origin: z.string().max(200).nullable().optional(),
  returnPath: z.string().max(200).optional(),
});

export const createBillingPortalSession = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PortalSchema.parse(d))
  .handler(async ({ data }): Promise<{ url: string | null; error: string | null }> => {
    try {
      const { userId, email, supabaseAdmin } = await requireUser(data.accessToken);
      const { stripeRequest } = await import("./stripe.server");
      const customerId = await ensureCustomer(supabaseAdmin, userId, email);
      const origin = siteOrigin(data.origin);
      const session = await stripeRequest<{ url: string }>("/billing_portal/sessions", {
        method: "POST",
        body: {
          customer: customerId,
          return_url: `${origin}${data.returnPath ?? "/account"}`,
        },
      });
      return { url: session.url, error: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : "The billing portal is unavailable.";
      console.error("[subscription] createBillingPortalSession", message);
      return { url: null, error: message };
    }
  });

const TopicChangeSchema = z.object({
  accessToken: z.string().min(20).max(4096),
  topicSlug: z.string().min(1).max(120),
});

/**
 * Queues a topic change for the next renewal. The live topic is never changed
 * mid-period, so topic switching cannot be used to unlock the whole library.
 */
export const scheduleTopicChange = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TopicChangeSchema.parse(d))
  .handler(async ({ data }): Promise<{ ok: boolean; error: string | null }> => {
    try {
      if (!isValidTopicSlug(data.topicSlug)) return { ok: false, error: "Unknown test topic." };
      const { userId, supabaseAdmin } = await requireUser(data.accessToken);
      const { data: row } = await supabaseAdmin
        .from("subscriptions")
        .select("plan_code,status,current_period_end")
        .eq("user_id", userId)
        .maybeSingle();
      if (!row || row.plan_code !== "exam_pro") {
        return { ok: false, error: "Topic changes apply to Exam Pro subscriptions only." };
      }
      const { error } = await supabaseAdmin
        .from("subscriptions")
        .update({ scheduled_topic_slug: data.topicSlug })
        .eq("user_id", userId);
      if (error) return { ok: false, error: error.message };
      return { ok: true, error: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : "The topic change could not be saved.";
      return { ok: false, error: message };
    }
  });

const CancelSchema = z.object({ accessToken: z.string().min(20).max(4096) });

/** Cancels at period end — access continues until the paid period finishes. */
export const cancelSubscription = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CancelSchema.parse(d))
  .handler(async ({ data }): Promise<{ ok: boolean; error: string | null }> => {
    try {
      const { userId, supabaseAdmin } = await requireUser(data.accessToken);
      const { data: row } = await supabaseAdmin
        .from("subscriptions")
        .select("provider_subscription_id")
        .eq("user_id", userId)
        .maybeSingle();
      if (!row?.provider_subscription_id) {
        return { ok: false, error: "No active subscription to cancel." };
      }
      const { stripeRequest } = await import("./stripe.server");
      await stripeRequest(`/subscriptions/${row.provider_subscription_id}`, {
        method: "POST",
        body: { cancel_at_period_end: true },
      });
      await supabaseAdmin
        .from("subscriptions")
        .update({ cancel_at_period_end: true, cancelled_at: new Date().toISOString() })
        .eq("user_id", userId);
      return { ok: true, error: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : "The cancellation could not be completed.";
      console.error("[subscription] cancelSubscription", message);
      return { ok: false, error: message };
    }
  });

/** Removes a scheduled cancellation so the subscription renews again. */
export const resumeSubscription = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CancelSchema.parse(d))
  .handler(async ({ data }): Promise<{ ok: boolean; error: string | null }> => {
    try {
      const { userId, supabaseAdmin } = await requireUser(data.accessToken);
      const { data: row } = await supabaseAdmin
        .from("subscriptions")
        .select("provider_subscription_id")
        .eq("user_id", userId)
        .maybeSingle();
      if (!row?.provider_subscription_id) {
        return { ok: false, error: "No subscription to resume." };
      }
      const { stripeRequest } = await import("./stripe.server");
      await stripeRequest(`/subscriptions/${row.provider_subscription_id}`, {
        method: "POST",
        body: { cancel_at_period_end: false, cancel_at: "" },
      });
      await supabaseAdmin
        .from("subscriptions")
        .update({ cancel_at_period_end: false, cancelled_at: null })
        .eq("user_id", userId);
      return { ok: true, error: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : "The subscription could not be resumed.";
      console.error("[subscription] resumeSubscription", message);
      return { ok: false, error: message };
    }
  });

export type PaidPlanCode = Exclude<PlanCode, "free">;
