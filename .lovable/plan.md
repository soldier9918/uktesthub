## 1. Expand all Study Guides to ~1200 words and add mock-1 CTAs

**Scope:** Every post in `src/data/blog.tsx` (~46 posts). Current word counts range 700–900. Target ~1200 words per post (range 1150–1300), reading naturally — not padded.

**Per-post additions:**
- Add 2–3 new prose sections (e.g. "Why this test matters", "How to study smart in 2026", "Common myths", "What to do on test day") tailored to the topic. No keyword stuffing.
- Ensure every post contains exactly one prominent **"Start Mock Test 1"** CTA card linking to mock 1 of its category. Most Driving/Citizenship/CSCS/NHS posts already have this — audit and add where missing (notably the older posts before line ~1000 and the Taxi & Private Hire posts).
- Bump `readingMinutes` to match new length (≈6 min).

**Category → mock-1 slug map:**

| Blog category | Mock-1 slug |
|---|---|
| Driving | `driving-theory-mock-1` |
| Citizenship | `life-in-the-uk-mock-1` |
| Professional (CSCS) | `cscs-mock-1` |
| NHS | `nhs-numeracy-mock-1` |
| English (IELTS) | `ielts-listening-mock-1` |
| Taxi & Private Hire | `seru-tfl-mock-1` |
| Education | `gcse-maths-warmup` (closest existing mock) |
| Fun | `general-knowledge-daily` |
| Security (new) | `sia-door-supervisor-mock-1` |
| IT & Tech (new) | `comptia-a-plus-mock-1` |

## 2. Add Security & IT & Tech Study Guides

Create **3 posts per missing category** (6 new posts total) added to `src/data/blog.tsx` with new hero images via `imagegen` into `src/assets/blog/`, and add the two new sections to `CATEGORY_SECTIONS` in `src/routes/blog.index.tsx`.

**Security & Door Supervision** (`category: "Security"`):
1. `sia-door-supervisor-test-guide-2026` — full SIA DS overview, syllabus, pass criteria, how to revise.
2. `sia-door-supervisor-mock-questions-explained` — sample question types with worked answers.
3. `how-to-pass-sia-door-supervisor-first-time` — study plan + exam-day tips.

**IT & Tech** (`category: "IT & Tech"`):
1. `comptia-a-plus-uk-study-guide` — exam structure, domains, revision plan.
2. `cyber-security-awareness-test-guide` — what UK employers test, common topics.
3. `itil-4-foundation-practice-guide` — syllabus, sample questions, study tips.

Each new post: ~1200 words, FAQ block, JSON-LD via existing `articleSchema`, mock-1 CTA, hero image. Add the two new category section entries to `CATEGORY_SECTIONS` and to the footer "Popular Tests" list if appropriate (no — keep footer untouched unless asked).

## 3. UK GDPR / PECR cookie consent system

### 3a. New components
- `src/lib/consent.ts` — typed consent store with helpers: `getConsent()`, `setConsent(partial)`, `subscribe(cb)`, `clearConsent()`, constant `CONSENT_VERSION = 1`, localStorage key `uktesthub_cookie_consent`. Schema:
  ```ts
  { acceptedAt: string; analytics: boolean; advertising: boolean; functional: boolean; version: 1 }
  ```
- `src/components/CookieConsent.tsx` — banner + manage-choices modal in one component. Reads/writes via `consent.ts`. Pre-ticked = false for all optional categories. Buttons "Accept all", "Reject non-essential", "Manage choices" given equal visual weight (same size, same variant). Modal uses shadcn `Dialog` + `Switch`. Mounted once in `__root.tsx` next to `PageViewTracker`.
- `src/lib/analytics-ga.ts` — lazy GA4 loader. Exports `loadGA()` (injects gtag with measurement ID `G-P2CME6M6GE`, only once) and `trackGAEvent(name, params)`. Subscribes to consent changes; if analytics revoked, sets `window['ga-disable-G-P2CME6M6GE'] = true`.
- Update `src/components/PageViewTracker.tsx` to additionally call `trackGAEvent('page_view', {...})` only when analytics consent is granted.
- Update `src/components/QuizRunner.tsx` (and any quiz_start/quiz_complete trackers) to also dispatch GA events guarded by consent.

### 3b. Footer integration
- Add a "Cookie Settings" link in `SiteFooter.tsx` legal column; clicking dispatches a `window.dispatchEvent(new Event('open-cookie-settings'))`. The `CookieConsent` component listens and opens the manage-choices modal.

### 3c. Page content updates
- Rewrite `src/routes/cookies.tsx` to describe the four categories (strictly necessary, analytics, advertising, functional), how to change choices via "Cookie Settings", and `support@uktesthub.com`.
- Append paragraphs to `src/routes/privacy.tsx` clarifying that GA only runs after analytics consent and AdSense will only run after advertising consent; users can change preferences any time.

### 3d. AdSense readiness
- No AdSense script is currently loaded — keep that. Add a guarded helper `loadAdsense()` in `src/lib/ads.ts` that does nothing today but is structured to be activated when consent.advertising is true.

### 3e. Admin & route exclusions
- Banner is suppressed on routes starting with `/admin-kb20`.

## Technical notes

- Consent store is SSR-safe (guards `typeof window`). Initial state on the server = "no banner rendered" until hydration to avoid layout shift.
- All optional toggles default OFF; banner shows on missing consent or when `version !== CONSENT_VERSION`.
- No GA, no AdSense, no third-party script loads at module top-level — all gated behind consent.
- Tailwind tokens only; banner uses `bg-card`, `border-border`, `text-foreground`, coral primary; bottom-anchored sticky with safe-area padding.
- No changes to admin routes, robots.txt, sitemap, or auth flows.

## Out of scope

- Rewriting question banks for new SIA/IT mocks (mocks already exist in `public/mocks/`).
- Real AdSense activation — wiring only.
- Consent Mode v2 advanced flags beyond the GA4 disable toggle.
