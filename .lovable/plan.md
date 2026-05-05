## Goal

On `/guide/road-signs`, keep only the opening paragraph of the article. Everything from the second intro line "This guide covers the full sign system…" through to the end of section 8 of the Highway Code motorway rules ("…sharp bends, so slow down.") moves into a brand-new long-form blog post under `/blog`. The rest of the guide page (hero, breadcrumb, FAQs, sidebar, mock-test CTA, ad slots, footer) stays exactly as it is.

## Scope of content being moved

Currently the road-signs guide renders, in order:

1. Lead intro paragraphs from `topic-seo.ts` → `road-signs.intro` (2 paragraphs).
2. "The signing system" panel — shapes primer + colour rules (guide.$slug.tsx lines 163–331).
3. "Sign shapes explained" — circular / triangular / rectangular write-ups (lines 333–429).
4. "Every UK road sign — Highway Code reference" gallery using `ROAD_SIGN_PAGES` (lines 431–483).
5. The numbered SEO sections (`topic-seo.ts` → `road-signs.sections`, 9 sections including "The shape-and-colour code", "The signs that catch people out", "Road markings as signs", "Motorway and direction signs", "Study tips", "Warning signs", "Order signs", "Information signs", "Road markings to learn alongside the signs").
6. Inline Highway Code motorway-rules sub-article that renders after the "Motorway and direction signs" section (lines 510–669, sections 1–8).
7. Road-markings reference gallery using `ROAD_MARKING_PAGES` (lines 671–695).

Items 2–7 plus intro paragraph #2 will be relocated.

## What stays on `/guide/road-signs`

- Hero, breadcrumb, "About this exam" header, reading-time stamp.
- Only the first intro paragraph: "Road signs make up roughly 15% of the DVSA Driving Theory Test…"
- A short link/CTA pointing at the new blog article (e.g. "Read the full visual guide → The Complete UK Road Signs Reference").
- The existing FAQ block, sidebar, ad slots, and "Ready to start?" mocks CTA.

## What changes

### 1. `src/data/topic-seo.ts`
- `road-signs.intro`: drop the second sentence ("This guide covers the full sign system…").
- `road-signs.sections`: empty the array (or remove it). All numbered section content moves to the blog post.
- FAQs untouched.

### 2. `src/routes/guide.$slug.tsx`
- Remove the four `topic.slug === "road-signs"` blocks that render the signing system, sign shapes, official sign gallery, motorway rules, and road markings gallery (lines 163–331, 333–429, 431–483, 510–669, 671–695).
- Drop the now-unused imports `ROAD_SIGN_PAGES` and `ROAD_MARKING_PAGES`.
- Just below the lead intro, add a small in-page CTA card visible only when `topic.slug === "road-signs"`, linking to the new blog post slug.

### 3. New blog article
Add a new entry at the **top** of `blogPosts` in `src/data/blog.tsx`:

- `slug`: `complete-uk-road-signs-reference`
- `title`: "The Complete UK Road Signs Reference (2026)"
- `description`: ~155-char SEO summary covering shapes, colours, official Highway Code plates, motorway rules and road markings.
- `excerpt`: one short hook line.
- `category`: "Driving"
- `tags`: ["road signs", "highway code", "driving theory", "motorway"]
- `hero`: existing `heroDriving` import (already in the file).
- `body`: a `() => ReactNode` that contains, in order:
  1. The dropped second intro paragraph as the opening line.
  2. "The signing system" — same shape-primer SVGs and colour-rule blocks (ported from the guide JSX as-is, restyled lightly to fit the blog article CSS).
  3. "Sign shapes explained" — circular/triangular/rectangular sub-sections.
  4. "Every UK road sign — Highway Code reference" — iterates `ROAD_SIGN_PAGES` (import moved to `blog.tsx`).
  5. The 9 numbered sections from `topic-seo.ts` rewritten as `<h2>` / `<p>` blocks inline in the JSX.
  6. After the "Motorway and direction signs" heading, embed the full Highway Code motorway-rules block (sections 1–8 with their images), exactly the data array currently in `guide.$slug.tsx`.
  7. After "Road markings as signs", iterate `ROAD_MARKING_PAGES`.
  8. Closing paragraph linking back to `<T slug="road-signs">free Road Signs practice tests</T>`.

`getAllPosts` already sorts by `datePublished` desc, so set `datePublished` to today's date (2026-05-05) so the new post appears first on `/blog`.

### 4. No other route or sitemap changes required
- The blog index (`/blog`) auto-lists from `getAllPosts()`.
- The blog detail route (`/blog/$slug`) already renders any slug returned by `getPostBySlug`.
- `routeTree.gen.ts` is auto-generated — no manual edits.

## Technical details

- All image paths (`/road-signs/page-*.png`, `/road-markings/...`, `/motorway-rules/...`) keep working from the blog article because they resolve from `public/`.
- SVG shape primers (circle/triangle/rectangle/STOP/give-way) are pure inline JSX, port over with no logic changes.
- The motorway-rules block uses a local data array + `.map(...)`; that array moves into the blog post's `body()` function unchanged.
- No new dependencies, no DB changes, no edge functions.
- Build-time guarantee: import `ROAD_SIGN_PAGES` and `ROAD_MARKING_PAGES` in `blog.tsx`; remove them from `guide.$slug.tsx`. Both files already exist under `src/data/`.

## Out of scope

- No changes to `/topic/road-signs`, mock tests, the admin panel, or any other guide page.
- No SEO redirect needed — the guide URL still works and now links into the blog post.
