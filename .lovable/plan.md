## Problem

On `/category/:slug` pages, the right sidebar shows an invisible reserved ad space (`min-h-[250px]`) above the "Other categories" panel because Google AdSense isn't enabled. This pushes "Other categories" well below the top of the tile grid, making it look misaligned with the four tiles on the left.

This affects every category route since they all use the shared `src/routes/category.$slug.tsx` template — driving, citizenship, english, education, career, professional, nhs, taxi-private-hire, security, hospitality, construction, finance, it-tech, healthcare-entry, teaching, legal, military-emergency, maritime-aviation, government. (Note: `fun` was removed last turn, so it no longer applies.)

## Fix

Single edit in `src/routes/category.$slug.tsx`:

1. Reorder the right-column `<aside>` so the "Other categories" card comes **first** and the rectangle `AdSlot` comes **after** it.
2. The "Other categories" card will then sit flush with the top of the "Choose a test" heading / tile grid on the left, matching the layout shown in the screenshot.

The ad placeholder still reserves space below the categories list (preserving the layout for when AdSense is eventually enabled), but it no longer offsets the visible content.

No other files need to change — this single template renders all 19 category pages.

```text
Before:                          After:
┌──────────┬──────────┐          ┌──────────┬──────────┐
│  tile    │ [ad gap] │          │  tile    │  Other   │
│  tile    │          │          │  tile    │  cats    │
│──────────│  Other   │          │──────────│──────────│
│  tile    │  cats    │          │  tile    │ [ad gap] │
│  tile    │          │          │  tile    │          │
└──────────┴──────────┘          └──────────┴──────────┘
```
