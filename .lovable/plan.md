## Goal

Two things on every category page (e.g. `/category/driving`, `/category/citizenship`, `/category/professional`, `/category/nhs`, `/category/english`, `/category/education`, `/category/career`, `/category/fun`):

1. **Expand the long-form SEO content to ~1200 words per category** (currently 600–900). The "About the …" section is too thin.
2. **Improve visual presentation** of those paragraphs — clearer headings, real spacing between sections, better hierarchy, and pull-out elements so it doesn't read as one slab of text.

## Scope

Edit only:
- `src/data/category-seo.ts` — rewrite/expand the `intro` and `sections` for all 8 categories to land at **~1200 words each** (±50). FAQs are already strong; I'll leave them alone.
- `src/routes/category.$slug.tsx` — improve the `<article>` block that renders `seo.intro` and `seo.sections` so the typography reads as a proper editorial article, not a wall of text.

No other files, no new routes, no new dependencies.

## Content expansion (per category, target ~1200 words)

I'll keep the existing voice and facts and add depth, not filler. For each of the 8 categories I'll grow `intro` to 2 short paragraphs (~180 words) and expand `sections` from 3 to **5 sections**, each with 2–3 paragraphs:

1. **What the test actually involves** — exam structure, format, timing, marking
2. **What's covered (syllabus / topics)** — full breakdown
3. **How to study and pass first time** — actionable tips, study plan
4. **Common mistakes and pitfalls** — what trips most candidates up
5. **Why active practice testing works** — the "method" section, evidence-based

Word budget per category, roughly:
```text
Intro            ~180 words
5 sections × 2-3 paras = ~1000 words
Total            ~1200 words ✓
```

All UK English. All facts already in the file are preserved; I only add depth (e.g. for Driving I'll expand on Highway Code chapters, hazard perception scoring mechanics, and re-test rules; for Life in the UK I'll add more on the handbook chapters, exempt categories, and what to do if you fail).

## Visual presentation changes (`src/routes/category.$slug.tsx`)

Current rendering is one `<article class="prose">` block with `<h2>`, `<h3>`, `<p>` flowing top to bottom. Problems: section breaks aren't strong enough, intro doesn't stand apart, and at 1200 words it'll feel heavy.

Changes inside the existing SEO `<section>`:

- **Lead intro block**: render `seo.intro` as a styled lead paragraph — larger font (`text-lg md:text-xl`), looser line height, muted-foreground colour, sitting under an "About this exam" eyebrow chip (matches the home-page treatment we used previously).
- **Sectioned cards**: render each `seo.sections` entry as its own block with:
  - A small numbered badge (01, 02, …)
  - The heading as `font-display text-xl md:text-2xl` with extra top margin (`mt-12`)
  - A thin coral underline accent (matches existing brand)
  - Body paragraphs at `text-base md:text-[17px] leading-relaxed` with `mt-4` between paragraphs (so the "nice paragraphs and spacing" the user asked for is real, not just `prose` defaults).
- **Reading metadata**: a tiny "8 min read · Updated April 2026" line under the H2 so the section feels like an article, not boilerplate.
- **Keep** the existing "Ready to start?" CTA paragraph and the FAQ block underneath — both already work.

Layout stays the same `lg:grid-cols-[1fr_280px]` (article + skyscraper ad), so nothing reflows on the page.

### Technical notes

- I'll drop the `prose` class on this block in favour of explicit Tailwind utilities, because `prose` caps line length and makes the numbered-section visual hard to control. The blog post page (`/blog/$slug`) keeps `prose` — only the category page changes.
- No new imports beyond what's already in the file.
- The `seo` shape (`intro: string[]`, `sections: { heading, body: string[] }[]`) doesn't change, so types and the FAQ JSON-LD continue to work.

## Out of scope

- FAQ copy and schema (already good)
- Topic pages, blog pages, home page
- New images or icons (using existing brand tokens only)

After approval I'll do the rewrite + the route refactor in one pass.