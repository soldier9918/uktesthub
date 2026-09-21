# Homepage copy update: reflect the free + paid subscription model

Copy-only changes in `src/routes/index.tsx`. No pricing page, Stripe, entitlement, auth, content or analytics changes.

## Current state (verified)

Pricing page already states the correct model: first three mocks per topic free, account needed only to subscribe and to keep progress across devices. The homepage still makes absolute claims in four places.

## Changes (all in src/routes/index.tsx)

1. **"What is UK Test Hub?" intro (lines 592–594)** — replace
   "UK Test Hub is a free, independent practice platform built to help learners across Britain prepare for UK tests and assessments — no accounts, no paywalls, no surprises."
   with the exact wording supplied by the user:
   "UK Test Hub is an independent practice platform built to help learners across Britain prepare for UK tests and assessments. The first three mock tests in every topic are free, with no account or payment required. Optional subscriptions unlock the complete question bank, saved progress across devices and advert-free practice."

2. **Second paragraph of the same section (lines 599–615)** — the sentence ends "…you can practise here for free, on any device, without ever creating an account." Rewrite to align: practise free with the first three mock tests in every topic, no account or payment needed to start; an account unlocks full-topic access, cross-device progress and advert-free practice.

3. **Accessibility paragraph (lines 796–803)** — replace
   "And it's free — genuinely free, supported by unobtrusive advertising rather than locked-down paid tiers."
   with the second supplied wording:
   "Everyone can try the first three mock tests in every topic free, supported by unobtrusive advertising. Optional paid plans unlock the remaining mock tests, cross-device progress and an advert-free experience."

4. **UK pride strip (line 1030)** — "Free practice questions, mock exams, instant results and detailed explanations." implies everything is free. Change to something like "Start free in every topic — mock exams, instant results and detailed explanations — with paid plans for the full question bank."

5. **Teachers paragraph (line 840)** — "a free homework resource" softened to "a free-to-start homework resource" so it doesn't imply the whole site is free.

6. **Sweep** — re-search the whole homepage file for "paywall", "genuinely", "everything is free", "no account", "free, forever" and similar absolutes and fix any remaining hit in the same spirit.

## Left unchanged (intentional)

- Meta title "Free UK Mock Tests" and the meta description — they describe the free mocks, which do exist; no absolute claim.
- "avoids … forced sign-ups" (line 800) — still true; free practice needs no sign-up.
- All links, layout, styling, section order, stats and structured data.

## Verification

- Diff shows only copy changes in src/routes/index.tsx.
- Grep confirms no "no paywalls" / "genuinely free" / "no accounts" wording remains on the homepage.
- Read the final homepage text side-by-side against the pricing page's Free Practice card and FAQ to confirm both describe the same offering.
- Then publish so https://www.uktesthub.com shows the updated copy.
