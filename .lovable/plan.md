# Sitemap final cleanup plan

The current `src/routes/sitemap[.]xml.ts` already meets most requirements. This plan makes only the remaining fixes.

## Findings from exploration

- **No `/category/fun` route exists.** `src/data/categories.ts` has no category with `slug: "fun"`. Per the user's instruction ("only add if the route exists"), this URL will NOT be added. Will mention this in the response.
- **`lastmod` already emits as proper XML.** The current code wraps `lastmod` in real `<lastmod>…</lastmod>` tags via `renderUrl()`. The "flat text" the user saw is just the browser's default rendering of XML without a stylesheet (Chrome shows tag content as a stream of text). The actual response is valid XML — no fix needed in the generator. To make `view-source:` / browser preview look structured, we'll add an `<?xml-stylesheet?>` PI pointing to a tiny XSL file (optional polish that also confirms validity to the user).
- **Quiz whitelist already matches** the 11 priority topics requested.
- **Private routes already excluded** (`/admin*`, `/signin`, `/signup`, `/forgot-password`, `/reset-password`, `/account`, `/dashboard`, `/bookmarks`, `/report`, `/feedback`, `/robots.txt`, `/sitemap.xml`).
- **`public/robots.txt` and `src/routes/robots[.]txt.ts`** already match the requested exact contents.

## Changes

1. **`src/routes/sitemap[.]xml.ts`**
   - No content changes to the URL list (already correct).
   - Add `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>` after the XML declaration so the browser preview renders a readable table (purely cosmetic; crawlers ignore it).
   - Add a short header comment documenting the whitelist + exclusions.

2. **`public/sitemap.xsl`** (new, ~40 lines)
   - Minimal XSLT that lists `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>` in an HTML table. Resolves the "looks like plain text in the browser" complaint without changing what Googlebot sees.

3. **No changes** to:
   - `public/robots.txt` (already correct)
   - `src/routes/robots[.]txt.ts` (already correct)
   - `scripts/build_mock_manifest.mjs` / `mock-index.json` (already wired)
   - Quiz whitelist (already the 11 requested topics)

## What stays excluded

`/admin`, `/admin-kb20/*`, `/signin`, `/signup`, `/forgot-password`, `/reset-password`, `/account`, `/dashboard`, `/bookmarks`, `/report`, `/feedback`, `/robots.txt`, `/sitemap.xml`.

## Validation after change

- Fetch `/sitemap.xml` and run it through an XML parser locally to confirm well-formedness.
- Confirm `/sitemap.xml` returns `Content-Type: application/xml`.
- Spot-check that `/category/fun` is not present and that whitelisted quiz URLs are.

## Note for the user

`/category/fun` does not currently exist as a route or in `src/data/categories.ts`, so it will be skipped (per your "only add if it exists" rule). If you'd like that category created, say the word and I'll add it to the categories data and the sitemap together.
