# Fix the "Upgrade to Premium All Access" flow

## The problem

An Exam Pro subscriber who clicks "Upgrade to Premium All Access" is sent to the
pricing page, which starts a brand-new £24.99 checkout with the full amount due
today. That can leave one customer paying for two subscriptions at once.

## What the upgrade should do instead

1. The customer sees exactly what they will be charged **before** confirming:
   the prorated amount due today for the rest of the current period, and the
   £24.99 per month that follows, with the renewal date unchanged.
2. Confirming swaps the plan on the **existing** subscription: Premium replaces
   Exam Pro on the same subscription, the Exam Pro price is removed, the renewal
   date stays the same, and only the prorated difference is charged now.
3. Premium access is applied only once that prorated payment succeeds.
4. The account record then shows Premium All Access, with the single-topic
   restriction removed, every topic unlocked and adverts still off.
5. Nobody can end up with two subscriptions: an existing paying subscriber who
   tries to buy another plan is routed to the upgrade instead of a new checkout.
6. If the payment provider refuses, the customer sees a short friendly message
   and the technical detail stays in the server logs only.

## Where it changes

- **Account page (`SubscriptionPanel.tsx`)** — "Upgrade to Premium All Access"
  no longer links to pricing. It opens an in-page confirmation showing the
  prorated charge due today, the new monthly price and the unchanged renewal
  date, with "Confirm upgrade" and "Not now". Success message confirms every
  topic is now unlocked. Busy and error states match the existing panel style.
- **Pricing page (`pricing.tsx`)** — for a signed-in Exam Pro subscriber, the
  Premium buttons point to the account page upgrade rather than checkout, so the
  double-subscription route is closed off at the source too.

## Technical detail

New server functions in `src/lib/subscription/subscription.functions.ts`:

- `previewUpgrade` — verifies the session, loads the user's
  `provider_subscription_id`, reads the live subscription and its item, then asks
  Stripe for an invoice preview with the Premium price substituted
  (`proration_behavior: always_invoice`). Returns amount due now, currency,
  renewal date, the target plan's recurring price and the current interval. No
  write happens.
- `confirmUpgrade` — same verification, then a single
  `POST /subscriptions/{id}` with `items[0][id]` set to the existing item and
  `items[0][price]` set to the Premium price (replacing the item, so the Exam Pro
  price is removed), `proration_behavior: always_invoice`,
  `payment_behavior: pending_if_incomplete`, `billing_cycle_anchor: unchanged`
  and an idempotency key derived from user + target plan. Metadata is rewritten
  to `plan_code: premium_monthly` with an empty `topic_slug`.
  It does **not** grant access; it returns `{ ok, pending }` and the UI polls
  entitlement refresh.

Guards and access:

- `createCheckoutSession` rejects a new paid checkout when the caller already has
  an `active` or `past_due` Stripe subscription, returning a message that points
  them at the account-page upgrade. This is the server-side guarantee against two
  concurrent subscriptions.
- The webhook remains the only thing that grants access. `applySubscription`
  already maps the price ID to the plan and clears `topic_slug` /
  `scheduled_topic_slug` whenever the plan is not `exam_pro`, so the
  `customer.subscription.updated` + `invoice.payment_succeeded` events from the
  upgrade move the record to Premium and unlock all topics with no change needed.
  Ads stay off because that follows `entitlement.isPaid`.
- Errors: both new functions log the raw provider failure with `console.error`
  and return the existing `friendly(...)` fallback text.
- Annual Premium is out of scope for the in-place upgrade (an interval change
  resets the billing period); the annual option stays on the pricing page and
  goes through the billing portal for existing subscribers.

## Verification

Against the sandbox Exam Pro subscription (`ielts`, renewal 20 October 2026):

1. Load the account page, confirm the preview shows a prorated amount and the
   unchanged renewal date.
2. Confirm the upgrade, then check in Stripe that the subscription has exactly
   one item at the Premium price, the renewal date is still 20 October 2026, and
   the customer has exactly **one** active subscription.
3. Check the local record reads `premium_monthly` with no topic, a previously
   locked non-IELTS paid mock now opens, and the account page shows Premium.
4. Confirm a second checkout attempt for a paid plan is refused with the
   friendly upgrade message.
