/**
 * Entitlement rules — shared by the browser (for UI state) and the server
 * (for the authoritative access checks). Pure functions, no imports of
 * anything server-only, so both sides use identical logic.
 */
import {
  FREE_MOCKS_PER_TOPIC,
  isPremiumPlan,
  type PlanCode,
  type SubscriptionStatus,
} from "./plans";

export type SubscriptionRow = {
  plan_code: PlanCode;
  status: SubscriptionStatus;
  topic_slug: string | null;
  scheduled_topic_slug: string | null;
  billing_interval: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  provider_customer_id?: string | null;
  provider_subscription_id?: string | null;
};

export type Entitlement = {
  plan: PlanCode;
  status: SubscriptionStatus;
  /** True when every topic is unlocked (Premium monthly or annual). */
  allTopics: boolean;
  /** The single unlocked topic for Exam Pro, otherwise null. */
  topicSlug: string | null;
  scheduledTopicSlug: string | null;
  adFree: boolean;
  isPaid: boolean;
  billingInterval: string | null;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

export const FREE_ENTITLEMENT: Entitlement = {
  plan: "free",
  status: "free",
  allTopics: false,
  topicSlug: null,
  scheduledTopicSlug: null,
  adFree: false,
  isPaid: false,
  billingInterval: null,
  periodEnd: null,
  cancelAtPeriodEnd: false,
};

/**
 * A subscription still counts as paid while it is active, while a failed
 * payment is being retried, and after cancellation until the paid period ends.
 */
export function subscriptionIsLive(row: SubscriptionRow, now = new Date()): boolean {
  if (row.plan_code === "free") return false;
  if (!["active", "past_due", "cancelled"].includes(row.status)) return false;
  if (!row.current_period_end) return row.status === "active";
  return new Date(row.current_period_end).getTime() > now.getTime();
}

export function entitlementFromRow(
  row: SubscriptionRow | null | undefined,
  now = new Date(),
): Entitlement {
  if (!row) return FREE_ENTITLEMENT;
  if (!subscriptionIsLive(row, now)) {
    return {
      ...FREE_ENTITLEMENT,
      status: row.status === "free" ? "free" : "expired",
      scheduledTopicSlug: null,
    };
  }
  const premium = isPremiumPlan(row.plan_code);
  return {
    plan: row.plan_code,
    status: row.status,
    allTopics: premium,
    topicSlug: premium ? null : (row.topic_slug ?? null),
    scheduledTopicSlug: row.scheduled_topic_slug ?? null,
    adFree: true,
    isPaid: true,
    billingInterval: row.billing_interval ?? null,
    periodEnd: row.current_period_end ?? null,
    cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
  };
}

/** Mock tests 1–3 of every topic are open to everyone, signed in or not. */
export function isFreeMock(mockNumber: number): boolean {
  return mockNumber >= 1 && mockNumber <= FREE_MOCKS_PER_TOPIC;
}

export function canAccessMock(
  entitlement: Entitlement,
  topicSlug: string,
  mockNumber: number,
): boolean {
  if (isFreeMock(mockNumber)) return true;
  if (!entitlement.isPaid) return false;
  if (entitlement.allTopics) return true;
  return Boolean(entitlement.topicSlug) && entitlement.topicSlug === topicSlug;
}

/** Human-readable reason used by upgrade prompts. */
export function lockReason(entitlement: Entitlement): "signed_out_or_free" | "wrong_topic" {
  return entitlement.isPaid && !entitlement.allTopics ? "wrong_topic" : "signed_out_or_free";
}
