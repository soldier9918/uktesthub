# Fix "Resume subscription" and hide technical errors from customers

## What is wrong (confirmed)

The resume action sends both cancellation parameters to the payment provider in one request (`cancel_at_period_end: false` and `cancel_at: ""`, in `src/lib/subscription/subscription.functions.ts` lines 215-218). The provider rejects that combination with HTTP 400 ("Received both cancel_at_period_end and cancel_at parameters"), so the scheduled cancellation is never removed.

Separately, the provider's raw error text is passed straight back to the page: `stripeRequest` throws `Stripe request failed [400]: {…}` (`src/lib/subscription/stripe.server.ts` line 80) and the account panel shows that message verbatim, including request-log URLs.

## Fix

### 1. Resume action

- Send only one parameter: clear the scheduled cancellation date (`cancel_at: ""`). Only fall back to `cancel_at_period_end: false` in a second request if the subscription still reports the legacy flag afterwards — never both in the same call.
- Re-read the subscription from the provider after the change and write the confirmed values locally (cancellation flag cleared, cancellation timestamp cleared, renewal date from the current period end) so the page is correct immediately, before the update notification arrives.
- The update notification then reconfirms the same record, as it already does.

### 2. Customer-facing error messages

- Keep the full provider response in server logs only.
- The error thrown out of the provider client carries a short, plain message (e.g. "Your payment provider rejected the request.") with no status codes, JSON or log URLs.
- Cancel, resume, topic change, checkout and billing-portal actions each return their own friendly sentence, for example: "We couldn't resume your subscription. Please try again or use Manage billing."

### 3. Resulting account page state after resume

- Status: "Active"; date label "Next renewal: 20 October 2026"; normal renewal wording restored.
- Topic-change section visible again.
- Button reads "Cancel subscription" again.
- IELTS paid access is never interrupted at any point in the flow.

## Verification (against the current cancelling sandbox subscription)

1. Click Resume and confirm it succeeds with no technical error text.
2. Confirm with the provider that the scheduled cancellation is gone.
3. Confirm the stored record shows active, not cancelling, renewal 20 October 2026.
4. Confirm the account page shows Active, Next renewal, renewal wording, topic change available, Cancel button.
5. Confirm an IELTS paid mock still opens.
6. Leave the subscription restored to active renewal.

## Technical notes

- `src/lib/subscription/stripe.server.ts`: `stripeRequest` logs the raw body and throws a sanitised `Error`; add a `resumeStripeSubscription(id)` helper that clears `cancel_at`, then re-fetches and only sends `cancel_at_period_end=false` if still set.
- `src/lib/subscription/subscription.functions.ts`: `resumeSubscription` uses that helper and writes `cancel_at_period_end: false`, `cancelled_at: null`, `status: 'active'`, `current_period_end` from the refreshed object.
- `src/components/subscription/SubscriptionPanel.tsx`: no structural change; messages come from the server's friendly strings.
