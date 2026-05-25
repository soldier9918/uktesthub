## Goal
Make the `SectionTitle` (crown + heading + crown) feel balanced across mobile, tablet, and desktop, shrink the crown, and add a soft shadow behind the orange diamond.

## Changes (single file: `src/routes/index.tsx`, `SectionTitle` component, lines ~99–112)

**1. Smaller, responsive crown sizing**
Current: `h-20 w-20 md:h-24 md:w-24` (80px / 96px).
New tiered scale so the crown reads as a flanking accent, not competing with the title:
- mobile: `h-10 w-10` (40px)
- tablet (`md:`): `h-12 w-12` (48px)
- desktop (`lg:`): `h-14 w-14` (56px)

**2. Tighter, responsive spacing between crown and text**
Current: fixed `gap-4`.
New: `gap-2 md:gap-3 lg:gap-4` so the crowns sit closer to the title on small screens.

**3. Responsive heading size for better balance**
Current: `text-2xl md:text-3xl`.
New: `text-xl md:text-3xl lg:text-4xl` — keeps mobile compact, gives desktop more presence so the crowns don't overpower it.

**4. Drop shadow behind the orange diamond**
Apply a Tailwind drop-shadow utility directly to the `<img>` so the shadow follows the diamond's transparent silhouette (not a square box):
`drop-shadow-[0_6px_14px_rgba(234,88,12,0.35)]`
Warm orange-tinted shadow, soft and offset downward — matches the gold/coral palette already used on the page.

**5. Underline spacing tweak**
Current: `mt-4`. Change to `mt-3 md:mt-4` so the gap under the smaller mobile title doesn't look oversized.

## Out of scope
- No changes to the crown image asset itself.
- No changes to category tile icons or other crown usages (e.g. the `<Crown>` lucide icon on line 458).
- No changes to colors, fonts, or section layout outside `SectionTitle`.
