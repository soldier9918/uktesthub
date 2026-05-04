## Goal
Make UK Test Hub consistent, trustworthy and AdSense-ready. Single sweep across emails, branding, claim language, sitemap, and content.

## 1. Email + domain consistency
Replace every `@uktesthub.co.uk` address with the single canonical `support@uktesthub.com`.

Files to update:
- `src/routes/contact.tsx` — `hello@`, `partners@` → `support@uktesthub.com` (collapse to one address)
- `src/routes/privacy.tsx` — `privacy@` → `support@`
- `src/routes/accessibility.tsx` — `accessibility@` (×2) → `support@`
- `src/routes/feedback.tsx` — `feedback@`, `accessibility@` → `support@`
- `src/routes/report.tsx` — `reports@` → `support@`

## 2. Remove "Pro" branding
- `src/components/Logo.tsx` — remove the coral "Pro" badge span entirely. Keep "UK TEST HUB" wordmark.
- Grep confirmed no other UI/meta uses "Pro" branding.

## 3. Safer claim language + global disclaimer
Tone down marketing claims so we don't imply official status:
- `src/routes/index.tsx` hero (line 150): "Real exam questions" → "Practice-style questions"; feature chip "Real Exam Format" → "Realistic Exam Format"
- `src/data/topic-seo.ts` line 29: "mirrors the real exam style" → "reflects the exam format"
- Audit other "real exam" / "official" / "aligned with" phrasing in topic-seo and category-seo and soften where it implies endorsement (keep neutral references to DVSA/NHS as the body that runs the real test — that's factual).
- Add a one-line disclaimer line under the hero subtext on the homepage and ensure footer disclaimer (already present) reads:
  > "UK Test Hub is not affiliated with any official exam body. All questions are for practice purposes only."
  Update `src/components/SiteFooter.tsx` disclaimer block to lead with this exact sentence.

## 4. Homepage mock-test question count
The featured grid in `src/routes/index.tsx` (lines 80–87) currently mixes counts (24, 8, 10). Per request, normalise the **mock tests** to 24 questions:
- Driving Theory Mock 1 — already 24 ✓
- Life in the UK Test 2026 — already 24 ✓
- IELTS Listening Practice — 8 → 24
- 11+ Maths Practice Test — 10 → 24
- UK Geography Test — 10 → 24
- Road Signs Test — 8 → 24

Update the matching `minutes` to 24 too so card metadata is consistent. (Note: this only changes the displayed count on the homepage tile; the underlying quiz length is set elsewhere and unchanged.)

If you'd prefer to only change the labels for tiles that are genuinely "mock tests" (Driving + Life in UK) and leave the shorter practice tiles as-is, say the word and I'll restrict the change.

## 5. Homepage cleanup (UX + AdSense)
- Add vertical breathing room between major sections (consistent `py-16 md:py-20`).
- Ensure no two `<AdSlot>` components sit back-to-back without 200px+ of original content between them (AdSense policy).
- Tighten the hero stat row spacing on mobile.
- Verify mobile (416px) layout: cards stack cleanly, no horizontal overflow.

## 6 + 7. Sitemap + robots cleanup
Remove admin / dashboard / account / auth routes from indexable surfaces.

- `src/routes/sitemap[.]xml.ts` — keep only: `/`, all `/category/*`, `/all-tests`, `/blog`, `/blog/*`, all `/topic/*` and `/guide/*`, plus core info pages (`/about`, `/contact`, `/faq`, `/privacy`, `/cookies`, `/terms`, `/disclaimer`, `/accessibility`, `/sitemap`). Remove any account/dashboard/admin entries (none currently listed, but I'll re-audit and explicitly skip them).
- `public/sitemap.xml` — same treatment (this static one is shipped). Will be regenerated to match the dynamic version (and we'll keep the dynamic `/sitemap.xml` as the source of truth referenced in robots).
- `src/routes/sitemap.tsx` (HTML sitemap page) — remove any account/dashboard/admin links if present (currently it doesn't list them — confirm and leave as is).
- `public/robots.txt` and `src/routes/robots[.]txt.ts` — add explicit `Disallow:` rules:
  ```
  Disallow: /account
  Disallow: /dashboard
  Disallow: /bookmarks
  Disallow: /signin
  Disallow: /signup
  Disallow: /forgot-password
  Disallow: /reset-password
  Disallow: /admin-kb20
  Disallow: /admin
  ```
- Add `noindex` head meta to `src/routes/account.tsx`, `dashboard.tsx`, `bookmarks.tsx`, `signin.tsx`, `signup.tsx`, `forgot-password.tsx`, `reset-password.tsx` so even direct hits are excluded.

## 8. Content quality boost (AdSense)
- **Category pages** (`src/routes/category.$slug.tsx` + `src/data/category-seo.ts`): audit each entry; ensure 300+ words of unique intro/body content per category. Top up the shortest entries with extra paragraphs covering: who the tests are for, how to prepare, common pitfalls, and a "what's included" list.
- **Topic pages** (`src/routes/topic.$slug.tsx` + `src/data/topic-seo.ts`): ensure each topic has the three sections requested — *Explanation of the test*, *Who it's for*, *Tips*. Most longform entries already have FAQ + tips; the `generic(...)` topics in `topic-seo.ts` (NHS, ADR, etc.) are thin and will be expanded with a small standardised template (3 short paragraphs + 3 tips) so no topic page is under ~300 words.

This is the largest chunk of work — I'll do it in one pass per file rather than per topic to keep the edit clean.

## 9. Trust signals
- `src/routes/about.tsx` — verify it states mission + ownership clearly. If thin, add a short "Who runs UK Test Hub" paragraph and a contact line pointing to `support@uktesthub.com`.
- `src/routes/contact.tsx` — already covered in step 1; keep a single clear `support@uktesthub.com` address and a short response-time note.

## 10. Final checks
- Re-run grep for `co.uk`, `Pro` branding, `real exam`, `official exam` to confirm zero stragglers.
- Visually scan homepage at 416px (current viewport) and at desktop for spacing/AdSlot density.
- Confirm no console errors after edits.
- All `<Link>` targets verified against existing routes (no broken links introduced).

## Out of scope
- Sending real email from `support@uktesthub.com` (requires email infrastructure setup — separate task; let me know if you want me to wire up Lovable Cloud email + DNS now).
- Any pricing / paid-tier work (deferred until the real Pro product is ready).

Ready to implement on approval.