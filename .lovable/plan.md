# Live-mode preflight: results and one required fix

Read-only checks only. Nothing was created, charged, changed or published.

## What passed

**Live key accepted.** The restricted live key (`rk_live_…`) is accepted by the server-side payment code and satisfies the live/test consistency guard, which still refuses a live key while the site is in test mode and vice versa.

**All three live prices are correct, active and live-mode:**

| Plan | Amount | Billing | Active |
|---|---|---|---|
| Exam Pro Monthly | GBP 14.99 | monthly | yes |
| Premium All Access Monthly | GBP 24.99 | monthly | yes |
| Premium All Access Annual | GBP 199.99 | yearly | yes |

Each is mapped to the matching plan in the live configuration.

**Live webhook endpoint** at `https://www.uktesthub.com/api/public/stripe-webhook` is enabled and listens for exactly the six events: checkout completed, subscription created, updated, deleted, invoice paid, invoice payment failed. It will be verified with the live signing secret automatically as soon as live mode is on, because signature checking always reads the currently selected mode's secret.

**Single mode everywhere.** Checkout, billing portal, upgrades, monthly/annual switches, cancellation, resumption, failed-payment handling and webhook verification all go through one shared request helper that reads only the active mode's key and prices. There is no second code path.

**Mode cannot be set from the browser.** The mode is a server-only setting; it is never sent to the browser, never in the site's public configuration, and never in code.

**No keys or provider errors reach customers.** Provider failures are logged on the server only; customers see short plain messages.

**Idempotency** is unchanged: every notification ID is recorded once, repeats are ignored, unsigned requests are rejected.

## The one problem found

Subscription records carry no indication of which payment mode created them. Three sandbox records exist today, two of them active:

- your account — sandbox Premium All Access (Annual)
- a disposable test account — sandbox Premium Monthly
- one expired sandbox Exam Pro record

With live mode on, those sandbox records would still grant full paid access, and their sandbox customer/subscription IDs would be sent to the live account by "Manage billing", cancel and upgrade actions. This must be fixed before switching.

## Fix to apply

1. Add a mode field to subscription records and to the notification log, defaulting to sandbox, and mark all three existing records as sandbox.
2. Record the current mode on every record the webhook writes.
3. Make every access check, account page and billing action ignore records from the other mode: an account with no genuine record for the active mode reads as Free Practice, and no billing action can be aimed at the wrong account.
4. Restrict plan-from-price matching to the active mode's prices.
5. Move the browser's plan lookup onto the existing server check so the page never decides from an unscoped record.
6. Leave progress, scores, bookmarks and attempts completely untouched — they live in separate tables and are never read through this path. Sandbox records stay in place and become live again for sandbox testing whenever the site is switched back.

## Technical notes

- Migration: `alter table public.subscriptions add column stripe_mode text not null default 'test'`, same on `billing_events`, plus an index on `(user_id, stripe_mode)`; existing rows backfill to `test` by the default.
- `src/routes/api/public/stripe-webhook.ts`: write `stripe_mode: stripeMode()`; upsert conflict target becomes `(user_id, stripe_mode)` with a matching unique index replacing `subscriptions_user_id_key`.
- `src/lib/subscription/subscription.functions.ts`: add `.eq("stripe_mode", stripeMode())` to all subscription reads and guard each billing action on it.
- `src/lib/subscription/stripe.server.ts`: `planForPriceId` matches only `stripeConfig().prices`, with subscription metadata as fallback for historic rows.
- `src/lib/subscription/use-entitlement.tsx`: replace the direct table query with the existing server entitlement function.
- Verify after the change: in test mode your account still reads Premium Annual and paid mocks open; with the mode flipped locally, the same account reads Free Practice, mock 4 locks, and progress/bookmarks are unchanged.

## Safety verdict

Safe for one controlled real-payment test **after** the mode-scoping fix above is applied and verified. Without it, sandbox subscriptions would grant live access.
