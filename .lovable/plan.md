# Add 11 new practice topics + new "Admissions Tests" category

## Scope summary

| # | Topic | Slug | Lives under | Mocks | Questions |
|---|---|---|---|---|---|
| 1 | Transport Manager CPC | `transport-manager-cpc` (already exists in `hgv-logistics`) — also expose under `driving` | driving + hgv-logistics | 45 | 1,080 |
| 2 | Transport Manager CPC Road Haulage | `transport-manager-cpc-road-haulage` | driving | 45 | 1,080 |
| 3 | Driver CPC | `driver-cpc` | driving | 45 | 1,080 |
| 4 | Forklift / FLT Theory Test | `forklift-flt-theory-test` | driving | 45 | 1,080 |
| 5 | D1 Minibus Theory | `d1-minibus-theory-test` | driving | 45 | 1,080 |
| 6 | ADR Dangerous Goods | `adr-dangerous-goods-test` | driving | 45 | 1,080 |
| 7 | NHS Psychometric Tests | `nhs-psychometric-tests` | nhs | 45 | 1,080 |
| 8 | TOEFL iBT Practice | `english-language-tests/toefl-ibt` | english-language-tests (special) | English-test structure | — |
| 9 | PTE Academic Practice | `english-language-tests/pte-academic` | english-language-tests (special) | English-test structure | — |
| 10 | GRE Practice | `gre-practice` | new `admissions` category | 45 | 1,080 |
| 11 | GMAT Practice | `gmat-practice` | new `admissions` category | 45 | 1,080 |

**Total new standard mock questions: ~9,720** (for items 1–7, 10, 11). TOEFL iBT and PTE Academic reuse the existing English-tests skill/level pipeline.

Note on item 1: `transport-manager-cpc` already exists under `hgv-logistics`. I'll surface a link to it from the new Driving "Professional Driving & Transport" section rather than create a duplicate slug. If you want a distinct driving-category copy, say so.

## Important: this is a content-heavy task

Generating ~9,720 unique, factually correct questions with explanations is **not something I can produce inline in chat** — it needs the existing `scripts/generate_mocks.py` AI pipeline (which calls Lovable AI Gateway, costs credits, and runs for hours per topic). The plan below does the full code/SEO/structure work and **kicks off bank generation as a separate step you confirm before I burn credits**.

## Implementation plan

### 1. New category: Admissions Tests
- Add to `src/data/categories.ts`: `{ slug: "admissions", title: "Graduate & Business Admissions Tests", topics: [gre-practice, gmat-practice] }`, with a hero image (reuse `cat-hero-education.jpg` or generate one).
- Add corresponding entry in `src/data/category-seo.ts`.

### 2. Add topics to existing categories
- `src/data/categories.ts` — Driving category: append the 5 new driving topics (plus surface Transport Manager CPC). NHS category: append `nhs-psychometric-tests`. English category: nothing new (TOEFL iBT and PTE Academic use the `english-language-tests` tree, not the category topic list — but I'll add visible cards on `/category/english` linking to them).
- `src/data/topic-seo.ts` — Add entries for each new topic with the prescribed title/description/FAQs and independent-disclaimer copy.
- `src/data/category-seo.ts` — Update Driving description to mention "Professional Driving & Transport" section.

### 3. Category page UI tweak
- `src/routes/category.$slug.tsx` — Add an optional `sections` grouping on the Driving page so the 5 new topics render under a "Professional Driving & Transport Tests" heading instead of mixed with the consumer driving tests.

### 4. Topic + Guide + Mock pages
- These are already fully data-driven: once a topic is in `categories.ts` and `topic-seo.ts`, `/topic/$slug`, `/guide/$slug`, and `/quiz/$slug-mock-N` work automatically. The only requirement is the topic's JSON bank in `public/mocks/{slug}.json`.
- Add a placeholder/empty v2 bank file for each new topic so the topic page renders "coming soon" cards until the real bank is generated.

### 5. TOEFL iBT and PTE Academic
- Add `toefl-ibt` and `pte-academic` to `src/data/english/categories.ts` mirroring the existing `toefl`/`ielts` structure (skills × levels). Generate the 79-style triples via `scripts/generate_all_english_mocks.py` (extended to know the new test ids).
- No new route files needed — existing `english-language-tests.$test.*` routes handle them.

### 6. SEO requirements (per topic)
Applied via the existing `head()` in `topic.$slug.tsx`, `guide.$slug.tsx`, `quiz.$slug.tsx`:
- Title: `{Topic} Practice Test | UK Test Hub`
- Meta description: `Practise {Topic} questions online with UK Test Hub. Get free mock tests, instant results and clear answer explanations.`
- Self-referencing canonical + matching `og:url` (already implemented).
- Independent disclaimer block rendered on topic + guide + quiz pages — add a shared `<IndependentDisclaimer />` component in `src/components/` referencing GOV.UK / DVSA / DfT / SQA / ETS / Pearson / GMAC / NHS, dropped into the existing page layouts.

### 7. Sitemap
- `src/routes/sitemap[.]xml.ts` — already iterates `mockIndex` and all topics, so new topics + their 45 mocks each are picked up automatically once added to `categories.ts`. Verify count goes from 9,118 → ~13,438 (9 topics × 45 + 2 English tests × 180 + topic/guide pages + new category page).

### 8. Question bank generation (separate, gated step)
For items 1–7, 10, 11:
1. Add 9 entries to `scripts/topic-requirements.json` (or equivalent) with type-mix weights and a subject prompt.
2. Add 9 entries to `TOPIC_SUBJECTS` in `scripts/generate_mocks.py`.
3. Run `python scripts/generate_mocks.py bank --topic {slug}` then `assemble --topic {slug}` for each.
4. Validate with `validate --topic {slug}`.

For TOEFL iBT / PTE Academic: extend `scripts/generate_all_english_mocks.py` to include them, then run it.

**I will pause before step 8 and confirm with you** — it requires `LOVABLE_API_KEY` credits and runs for an extended period.

## What ships in the first pass (no AI generation needed)

- New `admissions` category live with GRE + GMAT topic stubs
- All 9 new standard topics visible in their categories
- `/topic/{slug}` and `/guide/{slug}` pages render with the requested SEO, disclaimer, FAQ, and CTAs
- TOEFL iBT and PTE Academic listed under English Language Tests landing
- Sitemap updated automatically
- Topic pages show "Mock tests coming soon" until banks are generated

## Open questions

1. **Transport Manager CPC duplication** — keep the existing `hgv-logistics/transport-manager-cpc` as the canonical URL and link to it from Driving, or create a second `transport-manager-cpc` topic under Driving (would need a different slug)? My default: reuse existing.
2. **Bank generation now or later?** I'd recommend shipping the structure first (so URLs/SEO go live today) and triggering generation as a follow-up since it consumes credits and takes hours per topic.
3. **Category name for GRE/GMAT** — you wrote "Professional or Education". I'm proposing a new **"Graduate & Business Admissions Tests"** category instead, to avoid muddying the existing Professional (workplace compliance) and Education (school-level) categories. OK?
