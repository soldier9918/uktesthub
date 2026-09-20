# Failed-payment and recovery test (disposable test customer)

Goal: prove that a failed payment never grants access, that a payment problem is shown clearly and kindly, that access survives the retry window but ends if the payment is finally abandoned, and that recovery restores everything automatically. All of it on a throwaway test account — your Premium Annual test account is not touched.

## Gaps found before testing

Two things need fixing first, otherwise the test cannot pass:

1. **No visible payment warning.** A payment problem only appears as a small line of text in the Status row of the Subscription box. There is no warning panel and no obvious "Manage billing" call to action on the dashboard or account page.
2. **Abandoned payments keep access.** When the payment provider finally gives up on a subscription (marks it unpaid), the account is still recorded as "payment problem", so paid tests stay open until the paid period would have ended. It should lock immediately.

## Fixes to make

- Treat a finally-abandoned subscription as ended, so paid content locks straight away.
- Add a friendly amber payment warning shown on both the account page and the dashboard while a payment is being retried: plain wording ("We couldn't take your last payment. Your access stays open while we retry — please update your card."), the retry end date when known, and a "Manage billing" button. No provider error text, no log links.
- Keep the existing behaviour otherwise: cancelled keeps access until period end, active shows normal renewal wording.

## The test, step by step

Using a disposable test customer and a throwaway signed-in test account:

1. **Declined first payment** — start a subscription with a card the provider always declines. Check: no subscription record grants access, paid mock tests stay locked, the account still reads Free Practice.
2. **Failed renewal** — send a genuine signed renewal-failure event for the test customer. Check: the webhook accepts it, the account switches to the payment-problem state, and the warning with "Manage billing" appears.
3. **Access during retries** — open a paid mock test for the test account and confirm it still opens.
4. **Abandoned payment** — mark the test subscription unpaid/cancelled. Check: the account returns to Free Practice and paid tests lock.
5. **Recovery** — attach a working card, pay the outstanding invoice. Check: the account returns to Active on its own, the warning disappears and paid access still works.
6. **Duplicates** — re-send the same failure and recovery events. Check: they are accepted once and ignored the second time, with no change to the account.
7. **Clean up** — cancel and delete the test customer in the sandbox, delete the throwaway account and its subscription and billing rows. Confirm your Premium Annual test account is unchanged (plan, renewal date, one active subscription).

## Report

You get a pass/fail line for each of the seven points, what was fixed, and confirmation that only the disposable customer was affected — before anything is published.

## Technical notes

- `mapStatus` in `src/routes/api/public/stripe-webhook.ts`: map `unpaid` and `incomplete_expired` to `expired` instead of `past_due`; `past_due` stays as-is for the retry window.
- New `PaymentWarning` component driven by `useEntitlement()` (`status === "past_due"`), rendered in `SubscriptionPanel` and above the dashboard `PlanBanner`; uses existing `createBillingPortalSession` for the button.
- Test data: new auth user + disposable Stripe test customer; events signed with the real webhook secret and posted to the deployed `/api/public/stripe-webhook`; duplicate protection verified via the `billing_events` unique index.
- Cleanup: Stripe customer deleted, `subscriptions` / `billing_events` / auth rows for the throwaway user removed.
