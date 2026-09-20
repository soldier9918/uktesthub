/**
 * Minimal Stripe REST client (fetch based — no SDK, Worker friendly).
 * Every function here is server-only. Secret keys are read at call time.
 */
import { createHmac, timingSafeEqual } from "crypto";
import type { PlanCode } from "./plans";

const STRIPE_API = "https://api.stripe.com/v1";

export function stripeSecret(): string {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) throw new Error("Stripe is not configured yet (missing STRIPE_SECRET_KEY).");
  return key;
}

export function priceIdForPlan(plan: Exclude<PlanCode, "free">): string {
  const map: Record<Exclude<PlanCode, "free">, string | undefined> = {
    exam_pro: process.env["STRIPE_PRICE_EXAM_PRO_MONTHLY"],
    premium_monthly: process.env["STRIPE_PRICE_PREMIUM_MONTHLY"],
    premium_annual: process.env["STRIPE_PRICE_PREMIUM_ANNUAL"],
  };
  const price = map[plan];
  if (!price) throw new Error(`No Stripe price configured for plan "${plan}".`);
  return price;
}

export function planForPriceId(priceId: string | null | undefined): PlanCode | null {
  if (!priceId) return null;
  if (priceId === process.env["STRIPE_PRICE_EXAM_PRO_MONTHLY"]) return "exam_pro";
  if (priceId === process.env["STRIPE_PRICE_PREMIUM_MONTHLY"]) return "premium_monthly";
  if (priceId === process.env["STRIPE_PRICE_PREMIUM_ANNUAL"]) return "premium_annual";
  return null;
}

/** Flattens nested objects/arrays into Stripe's form-encoded shape. */
function encodeForm(data: Record<string, unknown>, prefix = ""): string[] {
  const parts: string[] = [];
  for (const [rawKey, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    const key = prefix ? `${prefix}[${rawKey}]` : rawKey;
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (item && typeof item === "object") {
          parts.push(...encodeForm(item as Record<string, unknown>, `${key}[${i}]`));
        } else {
          parts.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(item))}`);
        }
      });
    } else if (typeof value === "object") {
      parts.push(...encodeForm(value as Record<string, unknown>, key));
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts;
}

export async function stripeRequest<T = Record<string, unknown>>(
  path: string,
  init: { method?: "GET" | "POST"; body?: Record<string, unknown>; idempotencyKey?: string } = {},
): Promise<T> {
  const method = init.method ?? "GET";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${stripeSecret()}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (init.idempotencyKey) headers["Idempotency-Key"] = init.idempotencyKey;

  const body = init.body ? encodeForm(init.body).join("&") : undefined;
  const url = method === "GET" && body ? `${STRIPE_API}${path}?${body}` : `${STRIPE_API}${path}`;

  const res = await fetch(url, {
    method,
    headers,
    body: method === "POST" ? body : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`[stripe] ${method} ${path} failed [${res.status}]: ${text}`);
    throw new Error(`Stripe request failed [${res.status}]: ${text}`);
  }
  return JSON.parse(text) as T;
}

/** Verifies a Stripe webhook signature (t=…,v1=…) against the raw body. */
export function verifyStripeSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env["STRIPE_WEBHOOK_SECRET"];
  if (!secret || !signatureHeader) return false;

  const parts = signatureHeader.split(",").reduce<Record<string, string[]>>((acc, piece) => {
    const [k, v] = piece.split("=");
    if (!k || !v) return acc;
    (acc[k.trim()] ??= []).push(v.trim());
    return acc;
  }, {});

  const timestamp = parts["t"]?.[0];
  const signatures = parts["v1"] ?? [];
  if (!timestamp || signatures.length === 0) return false;

  // Reject anything older than five minutes (replay protection).
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  return signatures.some((sig) => {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

export type StripeSubscription = {
  id: string;
  customer: string;
  status: string;
  cancel_at_period_end?: boolean;
  cancel_at?: number | null;
  canceled_at?: number | null;
  cancellation_details?: { reason?: string | null } | null;
  current_period_start?: number;
  current_period_end?: number;
  metadata?: Record<string, string>;
  items?: {
    data: {
      current_period_start?: number;
      current_period_end?: number;
      price?: { id?: string; recurring?: { interval?: string } };
    }[];
  };
};

/**
 * Newer Stripe API versions report a scheduled cancellation as `cancel_at`
 * (a timestamp) and leave the legacy `cancel_at_period_end` flag false, so
 * both shapes must be considered.
 */
export function isCancelling(sub: StripeSubscription, now = Date.now()): boolean {
  if (sub.cancel_at_period_end) return true;
  if (sub.cancel_at && sub.cancel_at * 1000 > now) return true;
  return sub.cancellation_details?.reason === "cancellation_requested" && sub.status === "active";
}

export async function fetchStripeSubscription(id: string) {
  return stripeRequest<StripeSubscription>(`/subscriptions/${id}`, {
    method: "GET",
    body: { "expand[]": "items.data.price" },
  });
}
