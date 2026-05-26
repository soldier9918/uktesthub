## Hero Redesign — Cinematic Editorial

Rebuild the HERO `<section>` in `src/routes/index.tsx` (lines ~127–240) to match the selected prototype. All other sections of the homepage stay untouched.

### Layout
- Full-width navy background (`bg-navy-deep`), no background photo behind the whole hero. Soft radial glow on the right side (red→transparent) for depth.
- Two-column grid on `lg+` (`grid-cols-2`, `gap-12`, max-w-7xl, centered). Stacks on mobile.

### Left column — Editorial intro
- Small eyebrow: red bar + uppercase tracked label "Accredited UK Exam Preparation".
- Headline in three lines, very tight leading: **PASS YOUR / UK TESTS (coral) / FIRST TIME**, using the existing `font-display` (Archivo Black is the heading already in the design system; if not, fall back to the current `font-sans font-black`).
- Subhead: "Master over **96,000+ realistic questions** across **110+ topics**. The definitive revision platform for UK certification." (white emphasis spans).
- CTA row: primary coral "Start Practice" (keeps existing smooth-scroll handler to `#popular-categories`); secondary outlined "Browse All Tests" → `Link to="/all-tests"`.
- Trust row as a 4-column grid divided by a faint top border. Each cell: bold value + tiny uppercase label. Items: `96,000+ / Questions`, `Realistic / Exam Format`, `Instant / Results`, `2026 / Updated`.

### Right column — Cinematic visual + floating panel
- Tall rounded container (`lg:h-[700px]`, `rounded-2xl`, subtle white/5 border, large shadow).
- Inside: existing `heroUk` Big Ben image as `<img>` covering the container; navy gradient overlay from bottom (`from-navy-deep via-navy-deep/20 to-transparent`) so it fades into the page.
- Floating "Popular Mock Tests" panel pinned to the right inside the image: `absolute inset-y-8 right-8 w-72`, navy/90 + `backdrop-blur-md`, white/10 border, rounded-xl.
  - Heading: coral uppercase "Popular Mock Tests".
  - Same 10 topic links currently in the aside, preserving `<Link to="/topic/$slug" params={{slug}}>`. Hover: subtle white/5 row + red arrow appears on the right.
  - Footer CTA inside panel: coral "Browse all tests" → `/all-tests`.
- Decorative L-shape corner accent (`border-l-2 border-b-2 border-coral/50`) at bottom-left of the visual container.

### Implementation notes
- Keep all existing imports and link destinations (no business logic changes). Reuse `heroUk`, `ArrowRight`, `CheckCircle2`, `FileCheck`, `Timer`, `CalendarCheck`, `Link`.
- Use semantic tokens where they already exist (`bg-navy-deep`, `text-navy-foreground`, `text-coral`, `shadow-coral`). For the small accent reds/glows, use `coral` token rather than raw hex so the prototype's `#C8102E` maps to the existing palette.
- Mobile: image container becomes `h-[480px]`; floating panel becomes a normal block below the headline (not absolute) so it remains usable on small screens.
- No changes to `SiteHeader`, any section below the hero, or to data files.

### Out of scope
- Header, sections below the hero, routing, fonts pipeline, or token definitions in `styles.css`.
