## Goal

Use the uploaded London skyline image as the homepage hero, and make the hero text feel more premium.

## Changes

**1. Add the new hero image**
- Copy `user-uploads://ChatGPT_Image_May_26_2026_12_47_21_PM.png` → `src/assets/hero-london-skyline.jpg`.

**2. `src/routes/index.tsx` — hero section only (lines ~28, ~127–191)**
- Replace `import heroUk from "@/assets/hero-uk.jpg"` with `import heroLondon from "@/assets/hero-london-skyline.jpg"` and use it as the `<img>` source. Update alt text to "London skyline with Big Ben, St Paul's, the Shard and Tower Bridge".
- Adjust the dark overlay so the skyline reads clearly while text stays legible: stronger left-side scrim, lighter right side — e.g. `bg-gradient-to-r from-navy-deep/85 via-navy-deep/60 to-navy-deep/15` plus a subtle top-to-bottom `from-navy-deep/40 to-transparent` layer.

**3. Premium text treatment (same hero block)**
- Replace the oversized "Pass your" eyebrow with a refined eyebrow row: a short coral rule (`h-px w-10 bg-coral`) + small uppercase label "Pass your UK tests, first time" in tracking-[0.3em] text-xs/sm, gold-tinted.
- Headline: keep `UK Tests / First Time` but switch to a tighter, more editorial treatment — `font-display` (Cinzel, already loaded) for "UK Tests", italic serif accent for "First Time" in a warm gold (`text-[#e8c07a]`) with subtle text-shadow for depth. Slightly reduce the desktop size from `lg:text-9xl` to `lg:text-8xl` so it breathes against the image.
- Sub-copy: keep the three lines but tighten leading and use a thin divider dot between fragments; promote the "96,000+" and "110+" stats with a small gold pill rather than inline bold.
- CTA buttons: keep structure; add a soft gold ring on the secondary "Browse All Tests" button on hover and a subtle inner highlight on the coral primary for a more premium finish.
- Feature row icons: swap the flat coral ticks for small gold-on-navy circular badges to match the premium tone.

**4. Out of scope**
- No changes to the popular-tests side panel structure (just inherits the new background).
- No changes to any other section, route, or component.
- Old `hero-uk.jpg` asset left in place (still referenced nowhere else after this change; safe to leave).

## Technical notes

- Image saved as `.jpg` even though source is `.png` — the photo has no transparency and JPEG keeps the bundle smaller.
- All color values use existing tokens (`navy-deep`, `coral`, `navy-foreground`) plus the already-used gold hex `#d4af37` / `#e8c07a`. No new design tokens introduced.
- Typography uses fonts already loaded in `__root.tsx` (Cinzel, DM Sans) — no new font imports.
