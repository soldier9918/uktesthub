/**
 * Stripe webhook — the ONLY place that grants or removes paid access.
 * Signature-verified, and each event ID is recorded once so a repeated
 * delivery can never create a duplicate subscription.
 */
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  fetchStripeSubscription,
  isCancelling,
  planForPriceId,
  verifyStripeSignature,
  type StripeSubscription,
} from "@/lib/subscription/stripe.server";
import { isValidTopicSlug } from "@/lib/subscription/topics";

type Status = "active" | "past_due" | "cancelled" | "expired" | "incomplete";

function mapStatus(stripeStatus: string): Status {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
      return "expired";
    case "incomplete":
    case "incomplete_expired":
      return "incomplete";
    default:
      return "incomplete";
  }
}

const iso = (seconds?: number | null) =>
  seconds ? new Date(seconds * 1000).toISOString() : null;

async function resolveUserId(sub: StripeSubscription): Promise<string | null> {
  const fromMetadata = sub.metadata?.["supabase_user_id"];
  if (fromMetadata) return fromMetadata;
  if (!sub.customer) return null;
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("provider_customer_id", sub.customer)
    .maybeSingle();
  return data?.user_id ?? null;
}

async function applySubscription(sub: StripeSubscription) {
  const userId = await resolveUserId(sub);
  if (!userId) {
    console.error("[stripe-webhook] no user for subscription", sub.id);
    return;
  }

  const priceId = sub.items?.data?.[0]?.price?.id ?? null;
  const interval = sub.items?.data?.[0]?.price?.recurring?.interval ?? null;
  const plan = planForPriceId(priceId) ?? (sub.metadata?.["plan_code"] as never) ?? null;
  const status = mapStatus(sub.status);
  // Newer Stripe API versions carry the billing period on the subscription item.
  const item = sub.items?.data?.[0];
  const periodStart = iso(sub.current_period_start ?? item?.current_period_start);
  // A scheduled cancellation date is the true end of access when present.
  const cancelling = isCancelling(sub);
  const periodEnd = iso(
    (cancelling ? sub.cancel_at : null) ?? sub.current_period_end ?? item?.current_period_end,
  );

  const { data: existing } = await supabaseAdmin
    .from("subscriptions")
    .select("topic_slug,scheduled_topic_slug,current_period_start,cancelled_at")
    .eq("user_id", userId)
    .maybeSingle();

  // Exam Pro topic: metadata wins on first purchase; on renewal any scheduled
  // topic change takes effect for the new billing period.
  const metadataTopic = sub.metadata?.["topic_slug"] || null;
  let topicSlug = existing?.topic_slug ?? null;
  let scheduledTopic = existing?.scheduled_topic_slug ?? null;
  if (metadataTopic && isValidTopicSlug(metadataTopic)) topicSlug = metadataTopic;
  const renewed =
    Boolean(periodStart) &&
    Boolean(existing?.current_period_start) &&
    periodStart !== existing?.current_period_start;
  if (renewed && scheduledTopic && isValidTopicSlug(scheduledTopic)) {
    topicSlug = scheduledTopic;
    scheduledTopic = null;
  }
  if (plan !== "exam_pro") {
    topicSlug = null;
    scheduledTopic = null;
  }

  const row = {
    user_id: userId,
    provider: "stripe",
    provider_customer_id: sub.customer,
    provider_subscription_id: sub.id,
    plan_code: (plan ?? "free") as never,
    status: status as never,
    topic_slug: topicSlug,
    scheduled_topic_slug: scheduledTopic,
    billing_interval: interval,
    current_period_start: periodStart,
    current_period_end: periodEnd,
    cancel_at_period_end: cancelling,
    // Keep the timestamp we already recorded if Stripe doesn't send one back.
    cancelled_at: iso(sub.canceled_at ?? null) ?? (cancelling ? (existing?.cancelled_at ?? null) : null),
  };

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(row, { onConflict: "user_id" });
  if (error) console.error("[stripe-webhook] upsert failed", error.message);
}

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const signature = request.headers.get("stripe-signature");

        if (!verifyStripeSignature(rawBody, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: { id: string; type: string; data: { object: Record<string, unknown> } };
        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        // Duplicate-delivery protection: a second insert of the same event ID
        // hits the unique index and we stop before touching access.
        const { error: dupeError } = await supabaseAdmin.from("billing_events").insert({
          provider: "stripe",
          event_id: event.id,
          event_type: event.type,
        });
        if (dupeError) {
          if (dupeError.code === "23505") return new Response("ok (duplicate)");
          console.error("[stripe-webhook] event log failed", dupeError.message);
        }

        try {
          switch (event.type) {
            case "checkout.session.completed": {
              const session = event.data.object as {
                subscription?: string;
                metadata?: Record<string, string>;
              };
              if (session.subscription) {
                const sub = await fetchStripeSubscription(session.subscription);
                sub.metadata = { ...(session.metadata ?? {}), ...(sub.metadata ?? {}) };
                await applySubscription(sub);
              }
              break;
            }
            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
              const object = event.data.object as StripeSubscription;
              const sub = await fetchStripeSubscription(object.id);
              await applySubscription(sub);
              break;
            }
            case "invoice.payment_succeeded":
            case "invoice.payment_failed": {
              const invoice = event.data.object as { subscription?: string };
              if (invoice.subscription) {
                await applySubscription(await fetchStripeSubscription(invoice.subscription));
              }
              break;
            }
            default:
              break;
          }
        } catch (e) {
          console.error("[stripe-webhook] handler error", e);
          return new Response("Handler error", { status: 500 });
        }

        return new Response("ok");
      },
    },
  },
});
