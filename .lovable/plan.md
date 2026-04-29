# Replace "And many many more" with "Browse all tests" button → new `/all-tests` page

## What changes on the homepage

In the **Popular Mock Tests** panel, the current italic "AND MANY MANY MORE" caption is replaced by a coral CTA button:

```text
┌──────────────────────────────────┐
│ POPULAR MOCK TESTS               │
│  …13 tests with badges…          │
├──────────────────────────────────┤
│      [ Browse all tests → ]      │
└──────────────────────────────────┘
```

The button links to a new route `/all-tests`.

## New page: `/all-tests`

A full directory of every mock test on the site, grouped by category and clearly searchable.

**Layout**
- Standard `SiteHeader` + `SiteFooter`.
- Hero strip: title "All UK Mock Tests", short intro, total test count.
- Sticky search box + category filter chips (All, Driving, Citizenship, English, Taxi & Private Hire, NHS, Construction, Security, …).
- For each category: a section header with the category name and short description, then a responsive grid of test cards. Each card shows:
  - Stylised brand badge (`TestBadge` — same component already in use)
  - Test title
  - Question count + time limit (when the quiz exists in `getQuiz`)
  - Subtle "View test →" affordance
- Cards link to `/topic/$slug` (the existing topic page) so deep-linking already works.

**Data source**
- Iterate `categories` from `src/data/categories.ts` and flatten each category's `topics` array. This is the existing single source of truth, so the page automatically stays in sync as new tests are added (e.g. SERU, Topographical, ULEZ, CSCS, NMC, etc.).
- Use `badgeForSlug` from `src/data/test-logos.ts` for each badge.
- Use `getQuiz(slug)` from `src/data/quizzes.ts` to display question count + duration when available.

**Search**
- Client-side filter on `title` + category name, no extra deps. Empty state: "No tests match '…'".

**SEO (`head()`)**
- Title: "All UK Mock Tests — Free Practice for DVSA, TfL, IELTS, CSCS, NMC & more | UK Test Hub"
- Description: lists the main bodies covered.
- Own og:title / og:description (no copying from index).

## Files

- new: `src/routes/all-tests.tsx` — the directory page
- edit: `src/routes/index.tsx` — replace the "And many many more" `<p>` in the Popular Mock Tests aside with a `<Link to="/all-tests">` styled as a coral button
- edit: `src/components/SiteFooter.tsx` — add "All Tests" to the footer links (small win for discoverability)
- edit: `public/sitemap.xml` and `src/routes/sitemap[.]xml.ts` — add `/all-tests`

No data files change. No new dependencies.