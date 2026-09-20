# Fix cancel-at-period-end sync and account display

## What is wrong (confirmed)

I checked the test subscription with the payment provider and the stored record:

- The provider says the subscription is **scheduled to end on 20 October 2026** (it reports a "cancel at" date), but it also reports its older `cancel_at_period_end` flag as **false** and keeps the status as **active** until the date passes.
- Our webhook reads only that old flag, so when the cancellation notification arrived it **overwrote** the "cancelling" state we had just saved and set it back to false (stored record: cancel date present, cancel flag false, updated by the webhook 3 seconds after the cancellation).

That is why the account page still shows "Active", "Next renewal" and a "Cancel subscription" button.

## Fix

### 1. Webhook / provider reading (server side)

- Treat a subscription as cancelling when **any** of these is true: the old flag, a future "cancel at" date, or a recorded cancellation reason.
- Use that derived value when saving `cancel_at_period_end`, and take the access-end date from the cancel date when present (falling back to the current period end).
- Keep the cancellation timestamp instead of clearing it, and never downgrade an existing "cancelling" record to "not cancelling" unless the provider genuinely shows the cancellation was removed.
- Apply the same derivation in the cancel action so the value we write matches what the webhook will write moments later.

### 2. Account page display

When the subscription is cancelling:

- Status reads **"Cancels on 20 October 2026"** (access continues until then).
- The date label reads **"Access ends"**, never "Next renewal".
- The "Renews monthly / annually" sentence is hidden.
- "Cancel subscription" is replaced by **"Resume subscription"** (removes the scheduled cancellation with the provider and clears the flag), with "Manage billing" still available.
- The topic-change section is hidden, since there is no next renewal.

### 3. Access behaviour (unchanged rules, verified)

- Paid access (including IELTS) stays available while the period end is in the future, even while cancelling.
- When the end-of-period cancellation notification arrives, the record moves to expired and paid mocks lock again; free mocks 1–3 and the Fun & Viral topics stay open; progress, scores and bookmarks are untouched.

## Verification

Using this same test subscription:

1. Re-send the cancellation notification and confirm the stored record now shows cancelling with the 20 October access-end date.
2. Check the account page shows "Cancels on 20 October 2026", no renewal wording, and a Resume action.
3. Confirm an IELTS paid mock still opens.
4. Simulate the end-of-period deletion and confirm the account returns to Free Practice and paid mocks lock.
5. Resume, and confirm it returns to Active with renewal wording.

## Technical notes

- `src/routes/api/public/stripe-webhook.ts`: derive `cancelAtPeriodEnd` from `cancel_at_period_end || cancel_at || cancellation_details.reason`; `periodEnd = cancel_at ?? sub.current_period_end ?? items.data[0].current_period_end`; preserve `cancelled_at`.
- `src/lib/subscription/stripe.server.ts`: add `cancel_at` and `cancellation_details` to `StripeSubscription`; add a shared `isCancelling(sub)` helper.
- `src/lib/subscription/subscription.functions.ts`: add `resumeSubscription` (POST `cancel_at_period_end=false`, `cancel_at=''`) and clear the flag locally.
- `src/components/subscription/SubscriptionPanel.tsx`: cancelling-state copy, hide renewal copy and topic change, Resume button.
