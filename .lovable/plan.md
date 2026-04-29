## Goal

Tidy the "What is UK Test Hub?" homepage section so:
1. All body text uses the same font and consistent sizes.
2. Each heading (H2 + the four H3s on the left, plus the H3 on the right aside) gets a vertical red bar to its left, matching the "Answers & Explanations" reference style.

No content changes, no layout changes — purely typographic + a small visual accent.

## Changes (all in `src/routes/index.tsx`, lines 419–719)

### 1. Unify body font and size

The section currently mixes `font-display` (headings) and the default body font (paragraphs), and has three different paragraph sizes (`text-lg`/`md:text-xl` for the lead, `text-base` for the body, `text-sm` for the aside).

Standardise to a single body family and two sizes:

- **Lead paragraph** (line 429): change `text-lg leading-relaxed text-muted-foreground md:text-xl` → `text-base leading-relaxed text-muted-foreground md:text-lg` (slightly smaller so it doesn't tower over the body).
- **All left-column body paragraphs** (lines 435, 458, 556, 588, 621): keep `text-base leading-relaxed text-muted-foreground` (already consistent — no change).
- **Right aside paragraphs** (lines 680, 687, 692, 701): change `text-sm leading-relaxed` → `text-base leading-relaxed` so the aside matches the left column.
- **Headings**: keep `font-display` on H2 + H3s (that's the brand display font and matches the rest of the homepage like "Featured Mock Tests"). Normalise the four left-column H3s and the aside H3 to the same size: `font-display text-xl font-bold text-foreground md:text-2xl` (the four left H3s currently use `text-lg md:text-xl`, the aside H3 uses `text-xl md:text-2xl` — pick the larger pair so all H3s match).
- **H2** (line 426): keep `font-display text-3xl font-bold leading-tight md:text-4xl` — unchanged, it's the section title.

Result: one display font for headings, one body font for all prose, two body sizes (lead `text-base md:text-lg`, body `text-base`), and all H3s identical.

### 2. Red vertical bar before each heading

Reference image shows a thick vertical red line flush-left of the heading text with a small gap. Implement as a left border + left padding on each heading element so there's no extra markup:

```tsx
className="... border-l-4 border-coral pl-4"
```

Apply to:
- H2 "What is UK Test Hub?" (line 426)
- H3 "What we cover" (line 455)
- H3 "How our mock tests work" (line 553)
- H3 "Built for British learners" (line 585)
- H3 "Who uses UK Test Hub" (line 618)
- H3 "Why Practice Tests Work" in the right aside (line 677)

`border-coral` already exists in the theme (used throughout the homepage for coral accents — same colour as the existing `bg-coral` underline beneath the hero). The bar will be 4px wide with a `pl-4` (1rem) gap before the text, matching the proportions in the uploaded reference.

### Notes

- The existing eyebrow chips ("About the platform", "Why it works") above the H2 and aside H3 stay as-is.
- The decorative `mt-3 h-1 w-16 rounded-full bg-coral` underlines used elsewhere on the page are not added here — the new vertical bar replaces that visual cue for this section so we don't double up.
- No new imports, no new components, no layout shift.
