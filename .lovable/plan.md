## Show and Tell — Interactive Road Signs

A new study guide page where each road sign is a 3D flip card. Click → card flips → reveals the sign name and meaning.

### 1. New route
- Create `src/routes/blog.show-and-tell-road-signs.tsx` (lives under the existing blog/study-guides system, same shell as other guides like `complete-uk-road-signs-reference`).
- Slug: `/blog/show-and-tell-road-signs`.
- Title: **Show and Tell — UK Road Signs (Interactive)**.
- SEO meta + breadcrumb + ItemList JSON-LD for the 19 signs.

### 2. Page layout
- Hero strip with title, short intro ("Tap any sign to reveal what it means"), and a "Reset all" button.
- Responsive grid: 2 cols mobile / 3 tablet / 4 desktop.
- 19 `<SignFlipCard>` tiles.
- Below the grid: short FAQ + CTA linking to the Driving Theory practice tests.

### 3. The flip card component
- New file: `src/components/SignFlipCard.tsx`.
- 3D flip on click using Tailwind `[transform-style:preserve-3d]` + `[backface-visibility:hidden]` + `rotate-y-180` utilities (added as small inline style; no Tailwind config changes needed).
- Front: white card, the sign image centered, subtle shadow, "Tap to reveal" hint.
- Back: dark navy card, large bold sign name, 1–2 sentence meaning, small "Tap to flip back" hint.
- Keyboard accessible (button element, Enter/Space toggles, `aria-pressed`, `aria-label` describing the sign).
- ~600ms ease-out flip animation.

### 4. Data
- New file: `src/data/show-and-tell-signs.ts` exporting an array of 19 entries:
  ```ts
  { id, image, name, meaning, category }
  ```
- Images live in `public/road-signs/show-and-tell/sign-01.png` … `sign-19.png` (added as you upload them in batches of 5).
- I will populate `name` + `meaning` for each sign you send, using official UK Highway Code wording.

### 5. Linking it in
- Add a tile under **Study Guides** on the homepage (`src/routes/index.tsx`) pointing to the new page.
- Add a prominent callout inside the existing **Road Signs Reference** guide (`src/data/blog-content/road-signs-reference.tsx`) — a card near the top saying "Try the interactive Show & Tell board →".

### 6. Build process (so you can upload in batches)
1. I implement the page shell, flip card, data file (empty array), homepage tile, and road-signs-guide callout — all working with placeholder cards.
2. You upload batch 1 (5 images) → I save them to `public/road-signs/show-and-tell/`, write names + meanings, push them into the data array.
3. Repeat for batches 2, 3, 4 (4 images in the last batch) until all 19 are live.

### Technical notes
- Pure frontend, no backend/DB needed.
- No new dependencies — flip uses Tailwind transforms + CSS only.
- Uses existing design tokens (navy/coral/cream) so it matches the rest of the site.
- Images served from `/public` (already how `road-signs/page-1.png` etc. work).
