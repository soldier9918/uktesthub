## Changes to `src/routes/index.tsx`

1. **Show all 8 categories** in the Popular Categories grid:
   - Replace `categories.slice(0, 7).map(...)` with `categories.map(...)`.
   - Change grid to `lg:grid-cols-4 xl:grid-cols-4` so the 8 tiles wrap as a clean 4×2 layout (no awkward 7-up row).

2. **Light tinted page background**:
   - Change the homepage wrapper from `bg-background` (pure white) to `bg-[oklch(0.97_0.01_250)]` — a soft cool off-white that matches the reference screenshot and makes the white tiles pop.
   - The hero (navy), white tiles, and "Why us" navy band are unaffected and will sit nicely against the new tint.

No other files change. No data, routing, or component changes.
