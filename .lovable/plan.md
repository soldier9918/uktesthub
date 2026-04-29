## Goal

On `/category/driving` (and every other category page), replace the current 2x2 grid of test tiles with a **two-column "Guide + Test" layout**. Each row pairs:

- **Left column** — a guide tile (e.g. "Driving Theory Test Guide") that opens a full article page with tips, tricks, exam info, and a "Start Driving Theory Test" CTA at the bottom.
- **Right column** — the existing test tile (e.g. "Driving Theory Test") that goes straight to the mock tests.

Starting with `/category/driving`, then applied to all 19 other categories.

```text
┌─────────────────────────┬─────────────────────────┐
│ Driving Theory Guide    │ Driving Theory Test     │
├─────────────────────────┼─────────────────────────┤
│ Hazard Perception Guide │ Hazard Perception Test  │
├─────────────────────────┼─────────────────────────┤
│ Road Signs Guide        │ Road Signs Test         │
├─────────────────────────┼─────────────────────────┤
│ Motorcycle Theory Guide │ Motorcycle Theory Test  │
└─────────────────────────┴─────────────────────────┘
```

## Changes

### 1. New route: `src/routes/guide.$slug.tsx`

A new article page at `/guide/:topicSlug` (e.g. `/guide/driving-theory`).

Layout matches the existing category page article styling (same eyebrow chip, H2 with coral underline, numbered sections, FAQ accordion, breadcrumbs, ad slots) so it feels native.

Page sections:
- Hero with breadcrumb (Home › Category › Topic Guide), topic title + "Test Guide" badge, intro paragraph
- Long-form article: intro, 5–6 numbered sections (What's on the test, Format & timing, Study tips, Common mistakes, How to practise, Booking & fees)
- 5–8 topic-specific FAQs with JSON-LD FAQ schema
- Sticky-ish CTA card at the bottom: **"Ready to start? → Start [Topic Title]"** linking to `/topic/:slug`
- `<head>` meta with topic-specific title, description, canonical, OG image (uses category hero), breadcrumb schema

### 2. New data file: `src/data/topic-seo.ts`

Mirrors the shape of `category-seo.ts`:

```ts
export type TopicSeo = {
  title: string;          // <head> title
  description: string;    // <head> description
  intro: string[];        // 1–2 lead paragraphs
  sections: { heading: string; body: string[] }[]; // 5–6 sections
  faqs: { q: string; a: string }[];                // 5–8 FAQs
};
export const topicSeo: Record<string, TopicSeo> = { ... };
```

Populated for **all 70+ topics** across the 20 categories (every `topic.slug` in `categories.ts`). Each entry ~600–800 words written in the same UK-English voice as the existing category SEO, with real exam specifics (pass marks, fees, awarding bodies — DVSA, SIA, CITB, NMC, TfL, AAT, etc.).

Because this is a lot of content, the file will be split into per-category sub-objects merged into one export to keep it maintainable.

### 3. Update `src/routes/category.$slug.tsx`

Change the "Choose a test" grid:
- Replace the `sm:grid-cols-2` 2x2 grid with a 2-column row layout (`grid-cols-1 md:grid-cols-2 gap-5`) where for each topic two adjacent cards are rendered: the **Guide card** (left) and the **Test card** (right).
- Guide card: book icon, "Test Guide" eyebrow, topic title + " Guide", short blurb ("Tips, format & how to pass"), CTA "Read the guide →" linking to `/guide/:slug`.
- Test card: existing styling preserved (mock count, "Start [Topic] →" linking to `/topic/:slug`).
- Section heading copy updated: "Choose a guide or jump into a test" (subtitle: "Read the guide for tips and exam info, or start practising straight away.")
- Layout stays even/symmetrical for any number of topics (already even on every category).

### 4. Sitemap

Add `/guide/:slug` URLs for every topic to `src/routes/sitemap[.]xml.ts` and `src/routes/sitemap.tsx` so guides are crawlable.

## Out of scope

- No changes to `/topic/:slug` (mock list) or `/quiz/:slug` (runner).
- Category-level "About this exam" article and FAQs at the bottom of each category page stay as-is.
- No new images — guide pages reuse the category hero image.

## Notes

Because adding 70+ ~700-word guide entries is substantial, the guide content will be drafted in one pass per category (driving first so you can review the pattern), grouped into logical chunks within `topic-seo.ts`. If any guide entry is missing at runtime, the guide route will gracefully fall back to a short generic intro plus the CTA, so links are never broken.
