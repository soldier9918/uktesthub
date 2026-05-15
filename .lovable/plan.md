## Findings — current state

**Route patterns (actual, not assumed)**
- Quiz mocks: `/quiz/{topic-slug}-mock-{n}` — NOT `/topic/{slug}/mock-test-{n}`.
- English mocks: `/english-language-tests/{test}/{skill}/{level}/mock-test-{n}`.

**True universe of public, indexable URLs**

| Section | Count |
|---|---|
| Static (home, /all-tests, /blog, /about, /contact, /faq, /help, /exam-updates, /sitemap, 5 legal) | 14 |
| SEO landing pages (seru, seru-tfl, topographical, sia, cscs, driving-theory, life-in-uk, road-signs, nhs-numeracy) | 9 |
| Categories (`/category/{slug}`) | 13 |
| Topics (`/topic/{slug}`) | 114 |
| Guides (`/guide/{slug}`) | 114 |
| Blog posts (`/blog/{slug}`) | 59 |
| Quiz mocks — 114 topics × 45 (`/quiz/{slug}-mock-{n}`) | **5,130** |
| English hub + category | 2 |
| English test pages (4) + skill pages (14) + level pages (79) | 97 |
| English mocks — 79 triples × 45 | **3,555** |
| **TOTAL public indexable URLs** | **~9,107** |

**Current sitemap.xml — 928 URLs.** It deliberately excludes:
- 4,635 quiz mocks across 103 non-whitelisted topics (only 11 "money" topics × 45 = 495 are included today).
- All 3,555 English mock URLs (only the 79 level landing pages are included).

That whitelist exists in `src/routes/sitemap[.]xml.ts` because, today, every quiz mock page renders the same templated SEO:
- Title: literal `"Mock Test {n}"` from the bundled manifest (e.g. "Mock Test 1" — no topic name).
- Description: `"Mock test {n} — 24 questions."` — identical wording across all topics.

Adding 4,635 mocks to the sitemap with that boilerplate would feed Google ~5k near-duplicate pages → soft-404 / "Crawled, not indexed" risk. So **content uniqueness must be fixed in the same change** as the sitemap expansion. English mocks already have unique titles, descriptions, and canonicals — they just need to be added to the sitemap.

**Auth / private routes already correctly excluded** from the sitemap: `/signin`, `/signup`, `/account`, `/dashboard`, `/bookmarks`, `/admin`, `/admin-kb20`, `/reset-password`, `/forgot-password`, `/feedback`, `/report`. No change needed.

## Plan

### 1. Make every quiz mock page SEO-unique
Update `src/routes/quiz.$slug.tsx` `head()` so that when the slug matches `{topic}-mock-{n}`:
- Title: `{Topic Title} Mock Test {n} | UK Test Hub` (truncated to ≤60 chars; fall back to `{Topic Title} Mock Test {n}` if long).
- Description: `Practise {Topic Title} Mock Test {n} with 24 questions, instant results and clear answer explanations.` (≤160 chars).
- Canonical: `https://www.uktesthub.com/quiz/{slug}` (already correct).
- Single H1 already comes from QuizRunner; no noindex.

The topic title is resolved via the existing `findTopic(topicSlug)` helper, so no data work is needed.

### 2. Expand the sitemap to include every indexable mock
Edit `src/routes/sitemap[.]xml.ts`:
- Replace the `QUIZ_WHITELIST` block with a loop over all 114 topics in `mock-index.json` → 5,130 quiz URLs.
- Add a new `englishMockEntries` block: for every `(test, skill, level)` triple, emit 45 `/english-language-tests/{test}/{skill}/{level}/mock-test-{n}` URLs → 3,555 URLs.

### 3. Sitemap split — NOT needed
The Google limit is 50,000 URLs / 50 MB per file. ~9,107 URLs fits comfortably in one `sitemap.xml` (~2.5 MB). Splitting into a sitemap index adds complexity for no SEO benefit at this scale, so we keep one file. (If the catalogue ever grows past ~30k URLs we can revisit.)

### 4. Verify and report
After the change, fetch the deployed `/sitemap.xml` and count `<loc>` to confirm. Run a spot check that 5 random mock pages (e.g. `/quiz/road-signs-mock-7`, `/quiz/sats-mock-22`, `/quiz/cscs-operative-mock-44`) return unique title + meta description in the rendered HTML.

## Final answer (after implementation)

| Metric | Before | After |
|---|---|---|
| Total public indexable URLs | 9,107 | 9,107 |
| URLs in sitemap.xml | 928 | **~9,107** |
| Quiz mocks added | — | **+4,635** (103 topics × 45) |
| English mocks added | — | **+3,555** (79 triples × 45) |
| Mock URL pattern (quizzes) | — | `/quiz/{topic-slug}-mock-{n}` |
| Mock URL pattern (English) | — | `/english-language-tests/{test}/{skill}/{level}/mock-test-{n}` |
| Sitemap split into multiple files | — | No (one file, well under 50k limit) |

## Files to edit

1. `src/routes/quiz.$slug.tsx` — rewrite `head()` to emit topic-aware title + description for `*-mock-N` slugs.
2. `src/routes/sitemap[.]xml.ts` — drop `QUIZ_WHITELIST`, iterate every topic in `mock-index.json`, add English mock loop.

No new files, no schema changes, no auth/admin pages touched.