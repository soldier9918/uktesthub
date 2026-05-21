## Goal
Add a third chart to the GA Analytics admin page showing pageviews for the entire current year (Jan 1 → today), aggregated by month, beneath the existing "last 30 days" chart.

## Changes

### 1. `src/lib/server-fns/ga-analytics.functions.ts`
- Add a new GA `runReport` call alongside the existing ones:
  - dateRange: `{ startDate: "{currentYear}-01-01", endDate: "today" }`
  - dimension: `yearMonth` (returns `YYYYMM`)
  - metric: `screenPageViews`
  - ordered ascending
- Parse rows into `{ month: "YYYY-MM", pageviews: number }[]`
- Extend `GaDashboard` type with `monthly: { month: string; pageviews: number }[]` and `pageviewsYTD: number`
- Return them in the handler response

### 2. `src/routes/admin-kb20.ga-analytics.tsx`
- Add a new `<Card>` beneath the "last 30 days" card titled "Pageviews — this year (monthly)"
- Use Recharts `BarChart` with `data.monthly`, x-axis tick formatter showing month short name (e.g. `Jan`, `Feb`), same `var(--primary)` color
- Optionally add a sixth KPI `Pageviews (YTD)` to the KPI row

No other behaviour changes (auth, OAuth, realtime, refresh interval, etc. all unchanged).
