
## 1. Mock test start page — add intro + FAQ above "More mock tests"

The mock start screen (`-mock-N` quiz pages) currently shows just the title, meta chips and the green/red Practice/Exam buttons. We'll add an "About this mock" block immediately below those buttons, and keep the existing "More mock tests" grid where it already lives.

### What appears on the start screen

- **Intro paragraph** (~150–250 words) — what this mock covers, written for the specific topic.
- **3–5 bullet points** — topics included in this mock.
- **"Who this mock is for"** — one short paragraph.
- **"How to use Practice mode"** — one short paragraph.
- **"How to use Exam mode"** — one short paragraph.
- **FAQ** (4–6 Q&As) — only for major test categories (Driving Theory, Life in the UK, CSCS, SERU, SIA, NHS numeracy, CompTIA A+, English language tests, 11+). Other topics fall back to a shared generic FAQ.

The block disappears the moment the user clicks Practice or Exam, so it never interferes with the running test.

The existing **"More mock tests"** section already renders under the quiz on `src/routes/quiz.$slug.tsx`, so it will sit naturally below the new intro block. No change to that grid.

### Files

- **New: `src/data/mock-intros.ts`** — a `MOCK_INTROS: Record<topicSlug, MockIntro>` map plus a `getMockIntro(topicSlug, topicTitle)` helper that returns a sensible default if the topic isn't in the map. Seed entries for the major categories listed above; others get an auto-generated default ("This <Topic> mock test gives you 24 practice-style questions…").
- **Edit: `src/components/QuizRunner.tsx`** — extend `ModeSelect` so that when `quiz.slug.includes("-mock-")` it renders the intro/bullets/who-for/how-to-use/FAQ block directly under the two mode buttons. Use the existing shadcn `Accordion` for the FAQ. Pull data via `getMockIntro(quiz.topic, quiz.quizTitle)`.
- **Edit: `src/routes/quiz.$slug.tsx`** — add `FAQPage` JSON-LD to `head().scripts` for mock pages that have FAQ entries, so the new content also benefits SEO. Reuse the existing `faqSchema()` helper from `src/lib/seo.ts`.

No layout reshuffle: order on screen is Title → chips → Practice/Exam buttons → About this mock → topics covered → who it's for → how to use each mode → FAQ → leaderboard ad → "More mock tests" (unchanged).

## 2. Cookie banner — current state and recommended path

### Current state

`src/components/CookieConsent.tsx` is a **custom in-house cookie banner**, not a Google-certified CMP. It writes our own `consent` object to localStorage and toggles `gtag('consent', ...)` for GA, but it does **not** implement the IAB TCF v2.2 `__tcfapi` that AdSense expects in the EEA/UK. The file already has a TODO marker for swapping it out.

For UK AdSense, Google's own guidance is to use a certified CMP — the simplest and free option is **Google's own "Privacy & messaging" consent message (Funding Choices)** inside the AdSense account, which is IAB TCF v2.2 certified.

### Recommended change

- **Enable Google's AdSense consent message** in the AdSense dashboard (user action — outside the code). Configure it for the UK/EEA, IAB TCF v2.2, with a Reject button.
- **Inject the Funding Choices loader** in `src/routes/__root.tsx` head scripts, alongside the AdSense loader, using the publisher ID. This is what makes Google's banner appear and registers the `__tcfapi`.
- **Hide our custom banner when a TCF CMP is present.** In `CookieConsent.tsx`, on mount detect `window.__tcfapi`; if found, skip rendering the banner (the Cookie Settings link in the footer can call the CMP's "show again" hook instead). The modal stays for users on routes where the CMP doesn't run (e.g. admin pages).
- **Set ads to non-personalised until consent is granted.** In `src/components/AdSlot.tsx`, gate `adsbygoogle.push({})` on TCF consent if available, otherwise push `{ google_tag_params: { restrict_data_processing: true } }` style request-non-personalised-ads behaviour. This keeps us compliant if a visitor lands before the CMP has resolved.
- **Keep our consent store for GA only.** Analytics consent remains controlled by the in-house banner/modal where the CMP isn't loaded (admin, dev), so GA toggling still works.

This brings the setup to: Google-certified CMP for ads (covers UK/EEA legal requirement), with our existing UI as a fallback for non-CMP routes and for granular GA control.

### Files

- **Edit: `src/routes/__root.tsx`** — add the Funding Choices script tag with the AdSense client ID.
- **Edit: `src/components/CookieConsent.tsx`** — detect `__tcfapi` on mount; suppress banner when present; keep modal available via `OPEN_SETTINGS_EVENT`.
- **Edit: `src/components/AdSlot.tsx`** — request non-personalised ads until TCF consent is signalled.
- **Edit: `src/components/SiteFooter.tsx`** (if it has the "Cookie Settings" link) — when CMP is present, dispatch the CMP's reopen instead of `OPEN_SETTINGS_EVENT`. (Will confirm exact wiring when implementing.)

### One thing I need from you before shipping part 2

The Funding Choices loader needs your **AdSense publisher ID** (e.g. `ca-pub-XXXXXXXXXXXXXXXX`). I can read it from the existing AdSense script if it's already in the repo — I'll grab it during implementation and only ask if it's missing.

## Out of scope

- No design changes to the existing Practice/Exam buttons or "More mock tests" grid.
- No changes to quiz logic or scoring.
- Not building a third-party CMP integration (Cookiebot, OneTrust, etc.) — Google's free certified message is the lowest-friction option and matches what you asked for.
