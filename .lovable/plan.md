## What I checked

### 1. Homepage "Popular Mock Tests" panel (`src/routes/index.tsx` lines 207–221)

Current slugs, each verified against `src/data/categories.ts` and the English tests list:

| Link label | Slug | Route resolved | Status |
|---|---|---|---|
| SERU Tests | `seru` | `/topic/seru` | ✅ |
| Driving Theory Tests | `driving-theory` | `/topic/driving-theory` | ✅ |
| Life in the UK Tests | `life-in-the-uk` | `/topic/life-in-the-uk` | ✅ |
| IELTS Tests | `ielts` | redirects to `/english-language-tests/ielts` | ✅ |
| CSCS Tests | `cscs-operative` | `/topic/cscs-operative` | ✅ |
| NMC CBT Tests | `nmc-cbt` | `/topic/nmc-cbt` | ✅ (was broken as `nmc`, fixed last turn) |
| SIA Tests | `sia-door-supervisor` | `/topic/sia-door-supervisor` | ✅ |
| ESOL Tests | `esol` | redirects to `/english-language-tests/esol` | ✅ |
| Food Hygiene Tests | `food-hygiene` | `/topic/food-hygiene` | ✅ |
| First Aid Tests | `first-aid` | `/topic/first-aid` | ✅ |

All 10 popular-test links now resolve. No 404s remain in that list.

### 2. Sitemap (`src/routes/sitemap[.]xml.ts`)

The sitemap is already generated dynamically from the same data sources the routes use, so new URLs are picked up automatically:

- `categoryEntries` — every category in `categories.ts` → `/category/{slug}`
- `topicEntries` — every topic in `categories.ts` → `/topic/{slug}` + `/guide/{slug}`
- `quizEntries` — every mock in `mock-index.json` → `/quiz/{topic}-mock-{n}`
- `englishEntries` — every English test, skill, and level triple
- `englishMockEntries` — all 45 mocks per English level triple
- `blogEntries` — every post in `blogPosts`
- `seoLandings` — all bespoke SEO landing routes
- `staticEntries` — home, all-tests, blog index, about, contact, faq, help, exam-updates, sitemap, legal pages

No URL is missing. The NMC fix from last turn is already in the sitemap via `topicEntries` (`/topic/nmc-cbt`).

## Proposed action

**No code changes needed.** The earlier NMC fix resolved the only broken link, and the sitemap already enumerates every topic, category, English test, mock, blog post, and SEO landing automatically from data.

If you'd like, I can additionally:
- (a) add a small dev-only assertion that fails the build if any hard-coded slug in the homepage panel doesn't exist in `categories.ts` / English tests (prevents future 404s of this kind), or
- (b) leave it as-is.