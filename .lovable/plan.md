## Problem

On `/admin-kb20/ga-analytics`, the 24-hour bar chart and 30-day line chart render axes but no data marks. The chart components pass `fill="hsl(var(--primary))"` / `stroke="hsl(var(--primary))"`, but in this project `--primary` is already a full `oklch(...)` color (see `src/styles.css` line 103/161), not an HSL triplet. Wrapping it in `hsl(...)` produces an invalid color string, so the bars/lines paint as transparent.

## Fix

In `src/routes/admin-kb20.ga-analytics.tsx`, swap the two Recharts color props to use the CSS variable directly:

- `<Bar dataKey="pageviews" fill="hsl(var(--primary))" />` → `fill="var(--primary)"`
- `<Line ... stroke="hsl(var(--primary))" ... />` → `stroke="var(--primary)"`

No other changes; data fetching, layout, and tokens stay as-is.
