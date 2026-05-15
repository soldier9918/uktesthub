## Goal

Deliver a single `.xlsx` file listing every URL on uktesthub.com, with a yellow fill on rows for URLs Google currently shows in Search Console.

## Decisions (defaulted since you skipped the questions)

- **Detection method**: Search Analytics API — pull every URL that received ≥1 impression in the last 16 months. This is the fastest reliable proxy for "indexed and visible in search" (~1 minute, no quota issues). The URL Inspection API would be definitive but takes ~2 days at 2,000 calls/day for 4,000+ URLs. We can run that as a follow-up if you want exact statuses.
- **Scope**: All URLs currently in `/sitemap.xml` (~4,000) — English mocks, whitelisted quizzes, topics, blog, categories, SEO landings, static pages. This matches what we actually want Google to index. The ~5,000 non-whitelisted quiz mocks are intentionally excluded from the sitemap, so flagging them as "not indexed" would be misleading.

## Steps

1. Build the URL list in Node by importing the same sources `src/routes/sitemap[.]xml.ts` uses (categories, English triples, blog posts, mock index, whitelist) — guarantees the file matches the live sitemap.
2. Call Google Search Console Search Analytics via the connector gateway:
   - Property: `https://www.uktesthub.com/`
   - Dimension: `page`, range: last 16 months, rowLimit: 25,000, paginated.
   - Build a `Set<string>` of indexed URLs (normalize trailing slashes).
3. Generate xlsx with `openpyxl` (Python):
   - Columns: `URL`, `Section`, `Indexed in Google?`, `Impressions (16mo)`, `Clicks (16mo)`.
   - Yellow fill (`FFFF00`) on the entire row when `Indexed = Yes`.
   - Frozen header row, bold header, autofilter, column widths sized for readability.
   - Sort: section, then URL.
4. Save to `/mnt/documents/uktesthub-urls-indexed.xlsx` and surface as a downloadable artifact.

## Notes

- The "Indexed" column is based on having received search impressions — covers ~all genuinely indexed pages but may miss a tiny number of indexed-but-never-shown URLs. Acceptable trade-off vs. a 2-day inspection job.
- If you'd like the definitive URL Inspection version after, I can kick that off as a follow-up and update the file.