# Pricing page: correct buttons for existing subscribers

## The problem

You are on Premium All Access (Monthly), but the pricing page still offers plan actions that either
make no sense or could start a second subscription:

- Premium card says "Upgrade from your account" even though Premium is the plan you already have.
- Exam Pro still says "Choose your topic" and would open a new checkout.
- Switching the toggle to Annual offers a fresh annual subscription instead of moving your existing one.

## What the pricing page will do instead

For a signed-in customer with an active (or past-due) subscription:

| Card | Your plan | What the button says |
| --- | --- | --- |
| Free Practice | any paid plan | "Included in your plan" (disabled) |
| Exam Pro | Premium monthly or annual | "Manage your plan" → Account page |
| Premium (matching your plan and billing period) | that plan | "Current plan" (disabled) |
| Premium Annual | Premium Monthly | "Switch to annual" → in-page confirmation |
| Premium Monthly | Premium Annual | "Manage your plan" → Account page |
| Exam Pro card | Exam Pro | "Current plan" (disabled) |
| Premium card | Exam Pro | "Upgrade to Premium" → Account page (existing upgrade flow) |

No button on the page can start a checkout while a subscription is active. The topic picker is
hidden for paying customers. Signed-out and free users see today's page unchanged.

## Monthly to annual switch

Chosen on the pricing page, confirmed on the Account page using the subscription you already have —
no second subscription, no new checkout. Before confirming you see:

- the credit for the unused part of your current month,
- the amount charged today after that credit,
- the new renewal date (one year from today),
- and that your plan stays Premium All Access throughout.

Premium access continues without interruption; the change is applied to the existing subscription and
the record is updated when the payment is confirmed.

## Safeguards against a second subscription

- The server already refuses any new paid checkout when the customer has an active or past-due
  subscription; that stays and is the backstop.
- Plan changes go only through the change-price action on the existing subscription.
- Every plan change is sent with an idempotency key, so a double click cannot bill twice.

## Technical notes

- Generalise the existing upgrade pair in `src/lib/subscription/subscription.functions.ts`:
  `previewUpgrade`/`confirmUpgrade` become `previewPlanChange`/`confirmPlanChange` taking a target
  plan (`exam_pro` | `premium_monthly` | `premium_annual`), validating the move against the current
  `plan_code` (same plan rejected; Exam Pro topic requirement respected). Keep the old exports as thin
  wrappers so nothing else breaks.
- `stripe.server.ts`: `changeSubscriptionPrice` currently forces `billing_cycle_anchor: unchanged`,
  which Stripe rejects for an interval change. Pass the anchor as an argument — `unchanged` for
  same-interval moves, `now` when the interval changes (monthly to annual) — keeping
  `proration_behavior: always_invoice` and `payment_behavior: pending_if_incomplete`. Return the new
  `current_period_end` so the confirmation can show the new renewal date.
- `previewPlanChange` in `stripe.server.ts`: also surface the proration credit (sum of negative
  invoice lines) alongside `amount_due` so the annual confirmation can show credit and charge.
- `src/routes/pricing.tsx`: derive button state from `useEntitlement()` (`isPaid`, `plan`,
  `cancelAtPeriodEnd`). Paid customers get disabled "Current plan" / "Included in your plan" or a
  `Link to="/account"`; `useCheckout().start` is only reachable for free/unsubscribed visitors.
  Annual selection by a monthly Premium customer links to `/account?change=premium_annual`.
- `src/components/subscription/SubscriptionPanel.tsx`: reuse the existing confirmation panel for any
  plan change, reading the `change` search param to open it pre-selected, showing credit, amount due
  today and the new renewal date.
- Access is still granted only by the verified webhook, never by the confirmation screen.

## Verification

Against your Premium Monthly sandbox account: check every card's button state, confirm no card can
reach checkout, run the monthly-to-annual switch end to end, then verify Stripe holds exactly one
active subscription with a single annual item and that the account record reads Premium All Access
(Annual) with the new renewal date. Then publish.
