## Plan

### 1. Replace 3 category icons
Regenerate the illustrated PNGs (same flat coloured silhouette style as the rest of the icon set) and overwrite in place — no code changes needed since `CategoryIcon.tsx` already imports these paths:

- `src/assets/icon-security.png` — new icon for **Security & Door Supervision** (e.g. door supervisor figure with earpiece + shield, or a stewarding badge — clearer than the current generic shield).
- `src/assets/icon-professional.png` — new icon for **Workplace Compliance & Safety** (e.g. hard-hat + clipboard / safety checklist — currently reads as a generic tick badge).
- `src/assets/icon-teaching.png` — new icon for **Teaching & QTS** (e.g. teacher at a chalkboard / mortarboard with pointer — currently a plain open book that overlaps with the Education category).

### 2. Ad slot above "Featured Mock Tests"
In `src/routes/index.tsx`, the existing `<AdSlot size="leaderboard" className="my-14" />` already sits between the categories grid and the Featured Mock Tests heading (line 322). Looking at the page, it's there but spacing reads tight. Action: confirm it renders and bump it to a more prominent leaderboard placement with clearer label so it's visually distinct as an ad break between the two sections.

### 3. Level the "Explore" label across all category tiles
Cause: each tile uses `flex flex-col` but the chips row has variable height (1 or 2 lines depending on chip count), pushing "Explore" down inconsistently.

Fix in `src/routes/index.tsx` (Popular Categories grid, ~line 287–315):
- Add `mt-auto` to the "Explore" `<span>` so it pins to the bottom of the flex column.
- Ensure the parent `<Link>` already has `h-full flex flex-col` (it does).

Result: "Explore" sits on the same baseline across every tile regardless of chip wrapping.

### 4. All-Exams page with category + type filters
The page already exists at `src/routes/all-tests.tsx` with search + category filter. Extend it:
- Add a second filter row for **Type**, with chips: All / Theory / Aptitude & Reasoning / Practical & Skills / Compliance & Safety / Language / Citizenship.
- Derive `type` per category by mapping the existing 25 categories to one of those buckets (lookup table in the route file, no schema change).
- Combine with existing category + search filter logic.
- Add a footer link in `SiteFooter` if not already present (it points to `/all-tests` from the homepage browse button).

### Technical notes
- Icons are generated via `imagegen--generate_image` at 1024×1024, transparent background false, matching existing style: flat illustrated PNG, soft palette, square framing.
- No data layer change for the type filter — bucket map lives inside `all-tests.tsx`.
- Ad slot uses existing `<AdSlot size="leaderboard" />` component.
