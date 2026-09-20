# UK Test Hub — Subscriptions

Add a three-plan subscription system to the existing site. No redesign: current URLs, test content, navigation, SEO, branding and disclaimers stay exactly as they are.

## Plans

| Plan | Price | Access |
| --- | --- | --- |
| Free Practice | £0 | Mock tests 1–3 in every topic, ads shown, scores kept on the device |
| Exam Pro ("Most Popular") | £14.99/month | Every mock test in one chosen topic + tests 1–3 everywhere else, ad-free |
| Premium All Access | £24.99/month or £199.99/year ("Save 33%", £16.67/month) | Everything, ad-free |

All paid plans renew automatically until cancelled. No free trial. Any £3.99/£7.99 one-off pass wording gets removed. Cancelling keeps access until the paid period ends, then the account returns to Free Practice with all past progress intact.

For Exam Pro, one topic means the whole test family — IELTS covers every skill and level. The chosen topic is fixed for the billing period; a change can be scheduled for the next renewal, and upgrading to Premium is immediate.

## How locking actually works

Today every topic's questions sit in one public file that anyone can download, so a lock icon alone would not protect paid tests. So:

- Each topic file is split into a small free slice (tests 1–3) that stays public and fast, and a paid bank kept in private storage.
- Paid tests load only through a server check that confirms the signed-in user's subscription covers that topic.
- Category and topic pages keep showing every test name, the total count and the descriptions, so search engines and visitors see the same content as now. Only the questions behind test 4+ are gated.

## Stage 1 — foundations, pricing and checkout

1. Stripe: you create the three prices in your own Stripe account (Exam Pro monthly, Premium monthly, Premium annual) and I store the keys and price IDs as secure server-side secrets. Everything is verified in test mode first, then switched to live.
2. Subscription records with row-level security so each person can only read their own: user, provider, customer and subscription IDs, plan code, chosen topic, status (free, active, past due, cancelled, expired, incomplete), billing interval, period start and end, cancellation flag, scheduled topic change, timestamps.
3. One server-side entitlement check used by every gated read.
4. New `/pricing` page in the existing design: heading "Choose the Right Plan for Your Test", the supporting line about three free mocks per topic, three responsive cards, monthly/annual toggle for Premium, feature comparison, renewal and cancel-anytime disclosures, secure-payment note, FAQs and the existing independent-platform disclaimer. British English, "practise" as the verb.
5. Checkout: topic picker before Exam Pro checkout, hosted Stripe checkout, success and cancelled pages, billing portal link. Access is granted only after Stripe's verified webhook confirms payment — never from landing on the success page. Webhooks are de-duplicated, and renewals, failed payments, cancellations and upgrades all update the record.
6. Logged-out visitors choosing a paid plan keep their plan and topic choice through sign-up or sign-in and land back in the right checkout.
7. Test splitting and gated loading as described above, plus lock icons and an upgrade modal on locked tests.
8. Ads: shown to free users, hidden for active paid users with no empty gaps left behind, returning when a subscription expires.

## Stage 2 — account area, prompts, tracking and legal

1. "My Account": current plan, status, chosen Exam Pro topic, renewal or cancellation date, saved progress, recent tests, best scores, bookmarks, incorrect-answer review, and buttons for Manage Billing, Change Topic at Next Renewal, Upgrade to Premium and Cancel.
2. Upgrade prompts on locked tests, at the end of a free mock, on free results pages and on the dashboard, with the wording you supplied and the two buttons. Dismissed prompts do not return in the same session (reusing the existing prompt throttling).
3. Progress tracking for paid users: attempts, scores, dates, time spent, answers, wrong questions, bookmarks, best score per test, topic performance — surfaced as average score, tests completed, strongest and weakest areas, recent activity and recommended revision.
4. Analytics: the full event list (pricing_page_viewed through upgrade_prompt_viewed) via the existing consent-aware tracking, with purchase conversions for GA4 and Google Ads fired only after confirmed payment, valued at £14.99, £24.99 and £199.99.
5. Pre-checkout disclosure of amount, frequency, renewal terms, how to cancel, what's included, chosen topic, when access starts and what happens after cancellation; plus Subscription Terms, Cancellation Policy, Refund Policy and updates to the Privacy and Cookie policies. No pass, job or certificate guarantees anywhere.

## Acceptance checks

Each stage ends with a run through your list: three free tests per topic for anonymous and free users, test 4+ locked with a prompt, Exam Pro unlocking only its topic, topic switching not abusable, both Premium options unlocking everything, ads on for free and off for paid, cancellation keeping access to period end, expiry returning to Free Practice with progress intact, webhooks not duplicating subscriptions, paid questions unreachable by tampering with the browser, conversions only after payment, checkout and account working on mobile, and existing tests, navigation, SEO and branding unchanged.

## Technical notes

- Auth already exists (email/password, reset, persistent sessions, protected routes) and will be reused; email verification settings get confirmed.
- Existing `quiz_attempts`, `quiz_progress` and `bookmarks` tables are reused rather than replaced; a new `subscriptions` table is added with RLS and explicit grants.
- Entitlements are resolved in server functions; gated mock payloads are served from a server route that verifies the session and subscription before returning questions. No secret keys reach the browser.
- Stripe webhooks land on a public API route with signature verification and an idempotency record per event ID.
- A build script generates the public free slices from the existing topic files, so the current mock authoring and admin tooling keeps working.
- The provider is abstracted behind an entitlement layer so PayPal can be added later without reworking access control.

## What I need from you

Your Stripe secret key, webhook signing secret and the three price IDs (test mode first). I'll ask for them securely when Stage 1 reaches checkout.
