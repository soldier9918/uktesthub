## Goal
Make the illustrated category icons render larger on the homepage category cards and on the category/topic detail page headers, without changing the icon images themselves or the surrounding layouts.

## Changes

**1. `src/routes/index.tsx` — homepage category cards (~line 285–298)**
- Illustrated-icon branch: `h-12 w-12` → `h-16 w-16` (and keep `shrink-0 object-contain` + existing drop-shadow).
- Lucide-fallback branch: bump container `h-12 w-12` → `h-16 w-16` and inner icon `h-9 w-9` → `h-12 w-12` so both branches stay visually consistent.

**2. `src/routes/category.$slug.tsx`**
- Header icon (line 78): `h-7 w-7` → `h-10 w-10`.
- In-page card icon (line 171): `h-10 w-10` → `h-14 w-14`.

**3. `src/routes/topic.$slug.tsx`**
- Header icon (line 196): `h-7 w-7` → `h-10 w-10`.

## Out of scope
- `guide.$slug.tsx` only uses the icon as a tiny inline bullet (`h-3.5 w-3.5`) inside link text — leave it alone.
- No image regeneration. No changes to `CategoryIcon.tsx` itself.
- No layout/spacing changes beyond the size classes.