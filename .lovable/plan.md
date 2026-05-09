## Goal
Reposition the /blog section as "UK Test Hub Study Guides" — feels educational, not a casual blog — with unique hero imagery on the index.

## 1. Branding & copy (small, low-risk edits)

- **Navbar** (`src/components/SiteHeader.tsx`): change the `Articles` nav item label to `Study Guides`. Keep `to: "/blog"`.
- **Blog index** (`src/routes/blog.index.tsx`):
  - H1: `UK Test Hub Study Guides`
  - Subtitle: `Free guides, tips and study plans for UK tests, licences and exams.`
  - Breadcrumb label: `Study Guides` (currently `Blog`)
  - SEO `head()`: title `Study Guides — UK Test Hub | Free UK Exam Guides & Study Plans`; description updated to match new framing.
- **Blog post page** (`src/routes/blog.$slug.tsx`): breadcrumb link text `Blog` → `Study Guides` (URL still `/blog`). Article schema is already `Article`-typed via `articleSchema()` in `src/lib/seo.ts` — no change needed.
- URL stays `/blog`. No route renames, no redirects needed.

## 2. Unique hero image per post (52 posts)

Currently `src/data/blog.tsx` reuses 9 shared category hero images across all 52 posts (e.g. every Driving post uses `cat-hero-driving.jpg`). The articles index grid therefore looks repetitive.

Approach:
- Generate **52 unique hero images**, one per post, using `imagegen` (`fast` tier, 1280×720, JPG) saved under `src/assets/blog/<slug>.jpg`.
- Each prompt is derived from the post's title + category so imagery is topical (e.g. road-signs post → UK road signs scene; SERU post → London private-hire driver; NHS numeracy → clinical drug calculation desk).
- Maintain a consistent visual style across all 52 so the grid feels cohesive: editorial photography, soft natural light, UK setting, no on-image text, 16:9 — matches the existing card aesthetic.
- Update `src/data/blog.tsx`: replace the 9 `import heroX from "@/assets/cat-hero-*.jpg"` with 52 per-post imports, and set each post's `hero:` to its own image. Drop the now-unused category hero imports.

This only changes the displayed/og image per post; copy, schema, and routing stay intact.

## Out of scope
- Renaming the URL from `/blog` to `/study-guides` (explicitly kept).
- Restructuring post content, categories, or related-posts logic.
- Changing the per-post Article schema (already correct).

## Technical notes
- 52 image generations will be issued in parallel batches via `imagegen--generate_image`.
- Files placed in `src/assets/blog/` so Vite fingerprints them and they ship through the normal asset pipeline (same as today's category heroes).
- No DB, no server-fn, no migrations.
