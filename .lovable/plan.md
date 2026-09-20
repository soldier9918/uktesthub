# Switch to live payments and publish

## What changes

One server-side setting only: the payment mode switches from test to live. No other functional changes, no new payments, customers or subscriptions created, no sandbox data touched.

## Steps

1. Set the server-side mode value to live (stored securely with the other payment secrets; never displayed).
2. Publish the site.
3. Read-only verification after deployment:
   - Production responds in live mode (checkout/payment paths use the live key and the three live price IDs).
   - Your account, whose only record is a sandbox subscription, shows Free Practice on the published site — paid mocks locked.
   - Sandbox secrets, records and prices are untouched and become active again if the mode is ever switched back.
   - No keys, signing secrets or provider error text appear anywhere customer-facing.

## Technical details

- Mode value stored via the encrypted secret store as `STRIPE_MODE=live`; `stripeMode()` in `src/lib/subscription/stripe.server.ts` then selects `liveConfig()` (live key, live whsec_ signing secret, live price IDs) for checkout, billing portal, upgrades, cancel/resume, failed-payment handling and webhook verification.
- Mode-scoping fix from the preflight means existing sandbox rows (stripe_mode = 'test') no longer grant access once live mode is active; webhook writes rows with stripe_mode = 'live'.
- Verification: publish, then check the live site's behaviour server-side and in the browser (signed in as your account: Free Practice; signed-out: pricing/checkout still function against live prices).
- Report back when deployment and verification are complete so you can run the first controlled real-payment test yourself.
