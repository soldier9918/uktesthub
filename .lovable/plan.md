## English Language Tests — granular category system

Building a full English Language Tests section with 20 categories (4 test types + 6 CEFR levels + 4 skills + 6 topics), each with 45 mock tests × 24 questions, mirroring the existing UK Test Hub mock-test architecture.

### Scope & realism note

20 categories × 45 mocks × 24 questions = **21,600 questions**. Even the "priority 6" subset is ~6,480 questions. Generating that volume of genuinely unique, high-quality, hand-written questions in a single chat turn is not feasible — and template-stamping them ("Question 1: Choose the correct word…") would just create junk that hurts SEO and user trust.

I'll therefore split the work into two phases. Phase 1 (this turn) builds the full structure, routing, UI, SEO, sitemap, and a working data pipeline so every page is live and clickable. Phase 2 (subsequent turns) generates real question content category by category — same pattern your existing `/mocks/*.json` files use.

### Phase 1 — structure, routes, UI (this turn)

**Data layer** (`src/data/english/`)
- `categories.ts` — the 20 `EnglishTestCategory` records (id, slug, title, description, type, icon, colourTheme, studyGuideSlug, totalMockTests: 45, questionsPerMockTest: 24).
- `manifest.ts` — synchronous metadata helpers (mirrors `src/data/mocks/index.ts`): `listEnglishCategories()`, `listEnglishMockSlots(slug)`, `loadEnglishMockBySlug(slug)`. Lazy-fetches per-category JSON from `/english-mocks/<slug>.json` (static asset, never bundled).
- Per-category JSON files in `public/english-mocks/<slug>.json` — same v2 bank shape as existing topics. Phase 1 ships **placeholder files with `coming-soon: true`** for all 20 categories so routes resolve.

**Routes** (TanStack file-based, flat dot convention)
- `src/routes/english-language-tests.tsx` — layout (Outlet).
- `src/routes/english-language-tests.index.tsx` — main landing, hero, tabs (All / Test Types / CEFR / Skills / Topics), search, grouped cards.
- `src/routes/english-language-tests.$category.tsx` — category page: title, description, study-guide link (when present), 45 mock cards with availability state.
- `src/routes/english-language-tests.$category.mock-test-$num.tsx` — mock runner. Reuses the existing `QuizRunner` component + `mockToQuiz` adapter so it gets question-by-question UI, progress bar, explanations, score screen, retry, next-mock, back-to-category for free.

**SEO**
- Per-route `head()` with unique title/description, canonical, og tags.
- Add all 20 category pages + 45 mock pages each (when available) to `src/routes/sitemap[.]xml.ts`.
- BreadcrumbList JSON-LD on category and mock pages.

**Disclaimer**
- Shown on the main landing page and each category page footer.

**Existing IELTS/ESOL/TOEFL surfaces**
- Old broad cards on `/all-tests` (or wherever they appear) updated to link into the new `/english-language-tests/<slug>` pages. Old `/topic/ielts`, `/topic/esol`, `/topic/toefl` left in place to avoid breaking links — the new section becomes the canonical home for English practice.

### Phase 2 — question generation (separate turns, 1 category at a time)

Generated server-side via `scripts/generate_english_mocks.py` (mirrors `scripts/generate_mocks.py`). Each run produces one category's `<slug>.json` with 1,080 unique questions following the per-category content rules you specified (IELTS / ESOL / SELT / CEFR-level / skill / topic).

Priority order you gave: B1 → IELTS → ESOL → SELT → Listening → Reading. After Phase 1 ships, tell me which category to generate first and I'll run the script for that one.

### What you'll see after this turn

- `/english-language-tests` live with hero, filter tabs, search, all 20 cards.
- Every category page reachable, showing 45 mock cards.
- Each mock card opens the runner; placeholder categories show a clear "Questions coming soon" state instead of an empty quiz.
- All pages indexable, in sitemap, with unique SEO.
- Disclaimer present.
- Ready for me to fill in real questions one category at a time.

### Technical notes

- Mock data served as static `/english-mocks/*.json` assets (not bundled into the Worker) — same pattern as `public/mocks/*.json`, keeps the bundle small and pages fast.
- `QuizRunner` is reused, no new quiz UI code.
- No question text is hardcoded into route components.
- SSR-safe: lazy fetch uses `resolveMockUrl` pattern from `src/data/mocks/index.ts`.
