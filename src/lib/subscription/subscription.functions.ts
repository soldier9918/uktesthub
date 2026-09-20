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

/**
 * Keeps our own plain-English messages, but never leaks a payment-provider
 * response (status codes, JSON, request-log URLs) to a customer.
 */
function friendly(e: unknown, fallback: string): string {
  const message = e instanceof Error ? e.message : "";
  return message === "Please sign in again to continue." ? message : fallback;
}

const PaidPlan = z.enum(["exam_pro", "premium_monthly", "premium_annual"]);

const CheckoutSchema = z.object({
  accessToken: z.string().min(20).max(4096),
  plan: PaidPlan,
  topicSlug: z.string().min(1).max(120).nullable().optional(),
  origin: z.string().max(200).nullable().optional(),
});

/** The payment mode the server is currently configured for ("test" or "live"). */
async function currentMode(): Promise<"test" | "live"> {
  const { stripeMode } = await import("./stripe.server");
  return stripeMode();
}

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
    .eq("stripe_mode", await currentMode())
    .maybeSingle();
  if (row?.provider_customer_id) return row.provider_customer_id;

  const customer = await stripeRequest<{ id: string }>("/customers", {
    method: "POST",
    body: { email, metadata: { supabase_user_id: userId } },
  });

  await supabaseAdmin
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        provider: "stripe",
        stripe_mode: await currentMode(),
        provider_customer_id: customer.id,
      },
      { onConflict: "user_id,stripe_mode" },
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

      // One subscription per customer: an existing paying subscriber must change
      // plan on the subscription they already have, never buy a second one.
      const { data: current } = await supabaseAdmin
        .from("subscriptions")
        .select("status,provider_subscription_id")
        .eq("user_id", userId)
    .eq("stripe_mode", await currentMode())
        .maybeSingle();
      if (
        current?.provider_subscription_id &&
        (current.status === "active" || current.status === "past_due")
      ) {
        return {
          url: null,
          error:
            "You already have an active subscription. Please change your plan from your account page so you are only charged the difference.",
        };
      }

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
      console.error("[subscription] createCheckoutSession", e);
      return { url: null, error: friendly(e, "Checkout could not be started. Please try again.") };
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
      console.error("[subscription] createBillingPortalSession", e);
      return {
        url: null,
        error: friendly(e, "The billing portal is unavailable right now. Please try again shortly."),
      };
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
    .eq("stripe_mode", await currentMode())
        .maybeSingle();
      if (!row || row.plan_code !== "exam_pro") {
        return { ok: false, error: "Topic changes apply to Exam Pro subscriptions only." };
      }
      const { error } = await supabaseAdmin
        .from("subscriptions")
        .update({ scheduled_topic_slug: data.topicSlug })
        .eq("user_id", userId)
    .eq("stripe_mode", await currentMode());
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
    .eq("stripe_mode", await currentMode())
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
        .eq("user_id", userId)
    .eq("stripe_mode", await currentMode());
      return { ok: true, error: null };
    } catch (e) {
      console.error("[subscription] cancelSubscription", e);
      return {
        ok: false,
        error: "We couldn't cancel your subscription. Please try again or use Manage billing.",
      };
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
    .eq("stripe_mode", await currentMode())
        .maybeSingle();
      if (!row?.provider_subscription_id) {
        return { ok: false, error: "No subscription to resume." };
      }
      const { resumeStripeSubscription } = await import("./stripe.server");
      const sub = await resumeStripeSubscription(row.provider_subscription_id);
      const item = sub.items?.data?.[0];
      const periodEndSeconds = sub.current_period_end ?? item?.current_period_end ?? null;
      await supabaseAdmin
        .from("subscriptions")
        .update({
          cancel_at_period_end: false,
          cancelled_at: null,
          status: "active" as never,
          ...(periodEndSeconds
            ? { current_period_end: new Date(periodEndSeconds * 1000).toISOString() }
            : {}),
        })
        .eq("user_id", userId)
    .eq("stripe_mode", await currentMode());
      return { ok: true, error: null };
    } catch (e) {
      console.error("[subscription] resumeSubscription", e);
      return {
        ok: false,
        error: "We couldn't resume your subscription. Please try again or use Manage billing.",
      };
    }
  });

/** Plan changes applied in place on an existing subscription. */
const ChangeTarget = z.enum(["premium_monthly", "premium_annual"]);

const UpgradeSchema = z.object({
  accessToken: z.string().min(20).max(4096),
  plan: ChangeTarget.optional(),
});

type UpgradePreview = {
  ok: boolean;
  plan: "premium_monthly" | "premium_annual" | null;
  amountDue: number | null;
  credit: number | null;
  currency: string | null;
  renewalDate: string | null;
  intervalChanges: boolean;
  error: string | null;
};

const PAID_STATUSES = new Set(["active", "past_due"]);

/**
 * Loads the caller's subscription and checks the requested plan change is a
 * valid in-place move on the subscription they already have.
 */
async function loadChangeContext(accessToken: string, target: "premium_monthly" | "premium_annual") {
  const { userId, supabaseAdmin } = await requireUser(accessToken);
  const { data: row } = await supabaseAdmin
    .from("subscriptions")
    .select("provider_subscription_id,plan_code,status")
    .eq("user_id", userId)
    .eq("stripe_mode", await currentMode())
    .maybeSingle();

  if (!row?.provider_subscription_id || !PAID_STATUSES.has(String(row.status))) {
    throw new Error("You do not have an active subscription to change.");
  }
  if (row.plan_code === target) {
    throw new Error("This is already your current plan.");
  }
  return { userId, supabaseAdmin, subscriptionId: row.provider_subscription_id };
}

/** Read-only: what changing to the requested plan costs today. */
export const previewUpgrade = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => UpgradeSchema.parse(d))
  .handler(async ({ data }): Promise<UpgradePreview> => {
    const target = data.plan ?? "premium_monthly";
    const empty = {
      plan: null,
      amountDue: null,
      credit: null,
      currency: null,
      renewalDate: null,
      intervalChanges: false,
    };
    try {
      const { subscriptionId } = await loadChangeContext(data.accessToken, target);
      const {
        fetchStripeSubscription,
        previewPlanChange,
        priceIdForPlan,
        subscriptionInterval,
      } = await import("./stripe.server");

      const sub = await fetchStripeSubscription(subscriptionId);
      const targetInterval = target === "premium_annual" ? "year" : "month";
      const intervalChanges = subscriptionInterval(sub) !== targetInterval;
      const anchor = intervalChanges ? "now" : "unchanged";

      const { amountDue, credit, currency } = await previewPlanChange(
        sub,
        priceIdForPlan(target),
        anchor,
      );

      const item = sub.items?.data?.[0];
      const periodEnd = sub.current_period_end ?? item?.current_period_end ?? null;
      const renewal = intervalChanges
        ? (() => {
            const d = new Date();
            d.setFullYear(d.getFullYear() + (targetInterval === "year" ? 1 : 0));
            if (targetInterval === "month") d.setMonth(d.getMonth() + 1);
            return d.toISOString();
          })()
        : periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : null;

      return {
        ok: true,
        plan: target,
        amountDue,
        credit,
        currency,
        renewalDate: renewal,
        intervalChanges,
        error: null,
      };
    } catch (e) {
      console.error("[subscription] previewUpgrade", e);
      return {
        ok: false,
        ...empty,
        error: friendly(
          e,
          "We couldn't work out your new price right now. Please try again shortly.",
        ),
      };
    }
  });

/**
 * Moves the existing subscription onto the requested plan. Access is NOT granted
 * here — the webhook applies it once the prorated payment succeeds.
 */
export const confirmUpgrade = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => UpgradeSchema.parse(d))
  .handler(async ({ data }): Promise<{ ok: boolean; pending: boolean; error: string | null }> => {
    const target = data.plan ?? "premium_monthly";
    try {
      const { userId, subscriptionId } = await loadChangeContext(data.accessToken, target);
      const {
        fetchStripeSubscription,
        changeSubscriptionPrice,
        priceIdForPlan,
        subscriptionInterval,
      } = await import("./stripe.server");

      const sub = await fetchStripeSubscription(subscriptionId);
      const targetInterval = target === "premium_annual" ? "year" : "month";
      const anchor = subscriptionInterval(sub) !== targetInterval ? "now" : "unchanged";

      const updated = await changeSubscriptionPrice(
        sub,
        priceIdForPlan(target),
        { supabase_user_id: userId, plan_code: target, topic_slug: "" },
        `change:${userId}:${target}:${sub.id}`,
        anchor,
      );
      const paid = updated.status === "active" || updated.status === "trialing";
      return { ok: true, pending: !paid, error: null };
    } catch (e) {
      console.error("[subscription] confirmUpgrade", e);
      return {
        ok: false,
        pending: false,
        error: friendly(
          e,
          "We couldn't complete your plan change. Please try again or use Manage billing.",
        ),
      };
    }
  });

export type PaidPlanCode = Exclude<PlanCode, "free">;

/**
 * Non-secret: which payment mode the site is running in, so the interface can
 * ignore records belonging to the other mode. No keys are ever exposed.
 */
export const getPaymentMode = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ mode: "test" | "live" }> => ({ mode: await currentMode() }),
);
