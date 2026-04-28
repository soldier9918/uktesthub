# SEO + AdSense Upgrade Plan

Goal: make every page content-rich, add a blog, wire up JSON-LD schema, and tighten meta tags — all without touching existing visual design, components, or quiz functionality.

## 1. Category pages — add long-form content + FAQs

Extend `src/data/categories.ts` (additive only — current `Category` fields stay):
- `seo.title` (≤60 chars), `seo.description` (150–160 chars)
- `seo.intro` (1–2 paragraphs)
- `seo.sections`: array of `{ heading, body }` covering "What you'll learn", "Tips to pass", "Why practice tests work", "About the exam"
- `seo.faqs`: 6–8 `{ q, a }` per category

Update `src/routes/category.$slug.tsx`:
- Use `seo.title` / `seo.description` in `head()`
- Add a new `<section>` BELOW the existing test grid (does not touch hero or cards) containing the long-form content (~600–900 words) using `prose` styling already in `PageLayout`
- Add an FAQ block (plain `<details>`/accordion-styled markup, no new dependency) at the bottom
- Inject FAQPage JSON-LD via `head().scripts` built from `seo.faqs`
- Sprinkle in-paragraph internal links to `/topic/$slug` quizzes and to `/blog/...` articles
- Add one extra in-content `<AdSlot size="in-feed">` between long-form content and the FAQ

## 2. New shared SEO helpers

Create `src/lib/seo.ts`:
- `SITE_URL = "https://www.uktesthub.com"`
- `organizationSchema()`, `websiteSchema()`, `faqSchema(faqs)`, `articleSchema(post)`, `breadcrumbSchema(items)`
- `canonical(path)` helper

Update `src/routes/__root.tsx`:
- Add Organization + WebSite JSON-LD via `scripts`
- Add a default `link[rel=canonical]` (each child route can override)
- Remove the duplicate `description` meta currently set twice

## 3. Blog system

New route files:
- `src/routes/blog.tsx` — index listing all posts (cards grid, matches existing card styling), with head() + ItemList JSON-LD
- `src/routes/blog.$slug.tsx` — dynamic post page using `PageLayout`-style hero + `prose` body, breadcrumb, related posts, internal links, in-content AdSlot, Article JSON-LD

Content store: `src/data/blog.ts`
- `Post = { slug, title, description, excerpt, datePublished, dateModified, author, readingMinutes, category, tags, hero, body }`
- `body` authored as React nodes (not MDX — keeps build simple) inside `src/data/blog/<slug>.tsx`
- 10 posts (1000–1500 words each), UK English, with H2/H3, internal links to category + topic pages:
  1. how-to-pass-driving-theory-test
  2. life-in-the-uk-test-guide
  3. top-uk-road-signs-explained
  4. ielts-tips-for-beginners
  5. gcse-maths-revision-guide
  6. cscs-test-practice-guide
  7. seru-tfl-test-guide
  8. nhs-numeracy-test-tips
  9. uk-general-knowledge-quiz-guide
  10. how-to-study-for-exams-fast

Add "Blog" link to `SiteHeader` nav and to `SiteFooter` Company column.

## 4. Homepage content additions

In `src/routes/index.tsx`, add three new `<section>` blocks BELOW the existing "Featured Mock Tests" / "Practice by topic" sections, ABOVE the "Why us" band. No existing markup is changed.
- "What is UK Test Hub?" (~400 words) with internal links to top categories
- "How to Pass UK Tests First Time" — tip cards (re-uses existing card styling)
- "Why Practice Tests Work" (~300 words, evidence-led)
- A "Latest from the Blog" strip linking to 3 newest posts
- Update home `head()` title to: `UK Practice Tests 2026 (Driving, IELTS, Life in UK, CSCS & More)`

## 5. Internal-link copy improvements

Replace generic CTA text where it appears, keeping all classes/layout identical:
- Featured cards: "Start Test" → context-aware label derived from quiz title (e.g. "Start Driving Theory Mock 1")
- Category cards: "Start practising" stays, but `aria-label` adds the category name
- Topic mock cards keep "Test N" but get a descriptive `aria-label`

## 6. Sitemap + robots

Extend `src/routes/sitemap[.]xml.ts` to include `/blog` and every `/blog/<slug>` derived from `src/data/blog.ts`. `robots.txt` already correct.

## 7. Meta + canonical pass

Audit every existing route (`about`, `contact`, `faq`, `privacy`, `cookies`, `terms`, `disclaimer`, `accessibility`, `help`, `report`, `feedback`, `exam-updates`, `sitemap`, `seru-tfl`, `topic.$slug`, `quiz.$slug`) and ensure each `head()` has:
- Unique title (≤60 chars, ends with "— UK Test Hub")
- Unique description (150–160 chars)
- og:title, og:description
- canonical link to `https://www.uktesthub.com<path>`

For `topic.$slug` and `quiz.$slug`, derive these from loader data.

## 8. AdSense layout readiness

`AdSlot` already exists. Additions:
- Add a sticky-bottom variant: new prop `size="sticky-bottom"` rendering a fixed bottom bar (hidden on print, dismissible) — used once per page via a new `<StickyAdSlot />` mounted in `__root.tsx`
- Add a `size="sidebar"` skyscraper variant already supported
- Insert in-content slots between sections on category, topic, blog index, and blog post pages (spacing matches existing rhythm)
- Reserve fixed heights to prevent CLS (already done in `AdSlot`)

No real AdSense script is added yet (project isn't approved); placeholders remain visually unchanged.

## 9. Performance / hygiene

- Add `loading="lazy"` + explicit `width`/`height` on any blog/category images that lack it
- Add `prefers-reduced-motion` guard is unnecessary (no new animations)
- No new npm dependencies

## Technical notes (for implementation)

- All JSON-LD goes through `head().scripts` with `type: "application/ld+json"` and stringified JSON.
- Blog post bodies live in `src/data/blog/<slug>.tsx` exporting a React component; `blog.ts` registers metadata + lazy import.
- FAQ accordion uses native `<details><summary>` styled with Tailwind to avoid pulling in Radix Accordion in route bodies.
- Canonical URLs: each route's `head()` returns `links: [{ rel: "canonical", href: SITE_URL + path }]`. Root sets a fallback to `SITE_URL + "/"`.
- All new files are additive; existing components (`SiteHeader`, `SiteFooter`, `PageLayout`, `AdSlot`, quiz components, category data shape) keep their current exports and props — only `categories` gets new optional fields.

## Out of scope (will not change)

- Hero layouts, colours, fonts, card styles
- Quiz engine, mock data, scoring, localStorage keys
- Auth / "Sign In" button behaviour
- Routing for existing pages (only adding `/blog` + `/blog/$slug`)

## Deliverable order

1. `src/lib/seo.ts` + root JSON-LD + canonical
2. Categories data extension + category page content + FAQ schema
3. Blog data + 10 posts + `/blog` + `/blog/$slug`
4. Homepage content sections + nav/footer Blog links
5. Sitemap regeneration
6. Per-route meta/canonical audit
7. Sticky ad slot + extra in-content placements
