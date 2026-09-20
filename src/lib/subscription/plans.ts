/**
 * Subscription plan catalogue — client-safe copy and pricing.
 * Prices here are display-only; the real amounts live in Stripe price objects.
 */

export type PlanCode = "free" | "exam_pro" | "premium_monthly" | "premium_annual";

export type SubscriptionStatus =
  | "free"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired"
  | "incomplete";

/** Mock tests 1–3 of every topic are free for everyone. */
export const FREE_MOCKS_PER_TOPIC = 3;

export const PLAN_PRICES: Record<Exclude<PlanCode, "free">, number> = {
  exam_pro: 14.99,
  premium_monthly: 24.99,
  premium_annual: 199.99,
};

export const PLAN_LABELS: Record<PlanCode, string> = {
  free: "Free Practice",
  exam_pro: "Exam Pro",
  premium_monthly: "Premium All Access (Monthly)",
  premium_annual: "Premium All Access (Annual)",
};

export const FREE_FEATURES = [
  "No payment required",
  "No account required",
  "Access to the first 3 mock tests under every test topic",
  "Full-length mock tests",
  "Instant results",
  "Detailed answer explanations",
  "Best scores saved locally on your device",
  "Advertisements displayed",
  "All remaining mock tests shown with a lock icon",
];

export const EXAM_PRO_FEATURES = [
  "Unlimited access to every mock test within one selected test topic",
  "Access to the first 3 free mock tests in all other topics",
  "Detailed answer explanations",
  "Timed exam mode",
  "Progress saved across devices",
  "Test history and best scores",
  "Performance analysis for your selected topic",
  "Weak-area identification",
  "Bookmark questions",
  "Review and retry incorrect answers",
  "No advertisements while your subscription is active",
  "Cancel anytime",
];

export const PREMIUM_FEATURES = [
  "Unlimited access to every test and topic",
  "All existing mock tests",
  "All newly added tests",
  "No advertisements anywhere",
  "Detailed answer explanations",
  "Timed exam mode",
  "Progress saved across devices",
  "Complete test history and best scores",
  "Performance breakdown by topic",
  "Weak-area identification",
  "Personalised revision recommendations",
  "Bookmark questions",
  "Review and retry incorrect answers",
  "Cancel anytime",
];

export const RENEWAL_COPY: Record<Exclude<PlanCode, "free">, string> = {
  exam_pro: "£14.99 per month. Renews monthly until cancelled.",
  premium_monthly: "£24.99 per month. Renews monthly until cancelled.",
  premium_annual:
    "£199.99 charged annually. Renews automatically each year until cancelled.",
};

export function planLabel(plan: PlanCode) {
  return PLAN_LABELS[plan];
}

export function isPremiumPlan(plan: PlanCode) {
  return plan === "premium_monthly" || plan === "premium_annual";
}
