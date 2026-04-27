## Changes

### 1. Solid white navbar (`src/components/SiteHeader.tsx`)
Replace the translucent header background:
- From: `bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75`
- To: `bg-white` (fully opaque, no backdrop-blur), keep the bottom border for separation.

This ensures content scrolling underneath is no longer visible through the sticky header.

### 2. British-themed homepage background (`src/routes/index.tsx`)
Replace the current flat off-white wrapper (`bg-[oklch(0.97_0.01_250)]`) with a subtle, premium British-inspired background applied to the main content area (between hero and footer bands):

- **Base tint**: very soft cream/off-white with a faint warm paper feel (`bg-[#f7f5f0]`) — evokes classic British stationery.
- **Decorative overlay** (pointer-events-none, low opacity ~6-8%):
  - A faint repeating Union Jack pattern OR a soft radial wash using brand navy (#012169) and coral/red (#C8102E) at the corners.
  - Implemented via inline `style={{ backgroundImage: ... }}` with two radial gradients (top-left navy blush, bottom-right red blush) over the cream base.
- The hero (navy), Why-Us band (navy), and UK Pride strip already have their own backgrounds and remain unaffected.
- White category tiles and featured cards will pop nicely against the warm cream + subtle color washes.

No new assets, no new dependencies. Pure CSS/Tailwind changes to two existing files.