# Add live payment settings alongside the existing test setup

Goal: store your five live values securely, keep the current test-mode values and behaviour completely untouched, and leave the published site on test mode until you decide to switch.

## How test and live stay separated

Today the payment code reads five settings by fixed names (the test ones you already saved). The live values will be saved under five new, separate names, so nothing existing is overwritten or removed:

- existing (test): secret key, webhook signing secret, three price IDs
- new (live): the same five, stored under distinct live names

A single mode setting decides which set the payment code uses. It defaults to test whenever it is absent, so:

- nothing changes for the site until the mode is explicitly set to live
- today's test-mode checkout, upgrades, cancellations and webhook all keep working exactly as now
- the live webhook address stays the same; it verifies against whichever signing secret matches the active mode, and accepts the live one once live mode is on

Safety rules built in: the code refuses to start a live charge if any live value is missing, and refuses to mix a live key with test prices (or the reverse). Keys are read only on the server, never sent to the browser, never written into code, and never printed in logs.

## Steps

1. Open five secure entry fields for the live values (secret key, webhook signing secret, Exam Pro monthly price, Premium monthly price, Premium annual price). Values go straight into encrypted storage — never into chat.
2. Update the payment layer to resolve the active set by mode, with the test set as the default and the mismatch/missing-value guards described above.
3. Update the webhook so it accepts events signed with the active mode's signing secret (test today, live after you switch), and continues rejecting anything unsigned.
4. Verify in the preview that test mode still behaves identically (checkout, account page, webhook accepted), without touching your Premium Annual test account.
5. Stop there. No publish, and the live switch stays off until you ask for it.

## Technical notes

- New secret names: `STRIPE_LIVE_SECRET_KEY`, `STRIPE_LIVE_WEBHOOK_SECRET`, `STRIPE_LIVE_PRICE_EXAM_PRO_MONTHLY`, `STRIPE_LIVE_PRICE_PREMIUM_MONTHLY`, `STRIPE_LIVE_PRICE_PREMIUM_ANNUAL`. Existing `STRIPE_*` names remain the test set.
- Mode flag `STRIPE_MODE` (`test` | `live`), read server-side inside handlers; absent/invalid = `test`.
- `src/lib/subscription/stripe.server.ts`: add a `stripeConfig()` resolver returning `{ secretKey, webhookSecret, prices, mode }`; `stripeSecret()`, `priceIdForPlan()` and `planForPriceId()` read from it. Guard: `sk_live_` key with a non-live price set (or `sk_test_` with live prices) throws a configuration error server-side.
- `verifyStripeSignature()` tries the active mode's signing secret; in test mode it also accepts the existing test secret so current behaviour is unchanged.
- Everything stays inside `*.server.ts` / server functions and `src/routes/api/public/stripe-webhook.ts`; no client-side exposure and no logging of secret values.
- Switching to live later is a one-line setting change plus a publish — no code edits.
