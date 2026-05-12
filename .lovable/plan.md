## Goal

Rebuild the sitemap so Google can discover every important SEO page (home, content hubs, all categories, topics, guides, study-guide blog posts, plus high-value quiz pages) while keeping private/auth/admin/thin pages out. Keep `robots.txt` pointed at the sitemap, and keep the sitemap generated dynamically from existing data.

## What's already in place

- `src/routes/sitemap[.]xml.ts` — dynamic server route. Will be the single source of truth (the static `public/sitemap.xml` is stale and will be removed so it doesn't shadow the route on the CDN).
- `src/data/categories.ts` — categories + nested topics (24 categories, 115 topics). Source for `/category/*`, `/topic/*`, `/guide/*`.
- `src/data/blog.tsx` — `blogPosts[]` (58 posts). Source for `/blog/*`.
- `public/robots.txt` — already references `https://www.uktesthub.com/sitemap.xml`. Will verify and leave as-is.
- `scripts/build_mock_manifest.mjs` — already scans `public/mocks/*.json` at build time. We'll extend it to emit a tiny per-topic mock-number list we can import.

## Inclusion / exclusion rules

Include:
- Static: `/`, `/all-tests`, `/blog`, `/about`, `/contact`, `/faq`, `/help`, `/exam-updates`, `/sitemap` (HTML sitemap), plus legal pages (`/privacy`, `/cookies`, `/terms`, `/disclaimer`, `/accessibility`).
- All categories: `/category/{slug}` from `categories`.
- All topics: `/topic/{slug}` and `/guide/{slug}` from `categories[].topics`.
- All blog study guides: `/blog/{slug}` from `blogPosts` (use `dateModified ?? datePublished` as `lastmod`).
- SEO landing pages: the per-topic landing routes that already exist as their own files (`/seru-test-practice`, `/topographical-test-london`, `/sia-door-supervisor-mock-test`, `/cscs-mock-test-free`, `/driving-theory-test-questions`, `/life-in-the-uk-test-practice`, `/uk-road-signs-test`, `/nhs-numeracy-test-practice`, `/seru-tfl`).
- Quiz pages **only** for this whitelist of money topics: `driving-theory`, `road-signs`, `life-in-the-uk`, `british-citizenship`, `uk-laws-rights`, `seru`, `topographical`, `cscs-operative`, `sia-door-supervisor`, `nhs-numeracy`, `ielts`. For each whitelisted topic, emit `/quiz/{topic}-mock-{n}` for every mock number that actually exists.

Exclude (never emit):
- `/admin`, `/admin-kb20/*`, and any other admin/secret route.
- Auth flows: `/signin`, `/signup`, `/forgot-password`, `/reset-password`.
- Personalised user areas: `/account`, `/dashboard`, `/bookmarks`.
- User-action pages: `/report`, `/feedback`.
- Infra: `/robots.txt`, `/sitemap.xml` (the file itself is not a URL inside the sitemap).
- All other ~5,000 quiz pages until they have unique titles, descriptions and crawlable content.

## Technical approach

1. **Extend `scripts/build_mock_manifest.mjs`** to also write `src/data/mocks/mock-index.json` with shape `{ "{topic}": [1,2,3,...] }` — just topic → list of mockNumbers. This file is small (~117 entries × handful of ints), bundles cleanly into the Worker, and stays in sync because the script already runs on every build.

2. **Rewrite `src/routes/sitemap[.]xml.ts`** to build entries from data instead of a hard-coded list:
   - `import { categories } from "@/data/categories"` → category, topic, guide URLs.
   - `import { blogPosts } from "@/data/blog"` → blog URLs with `lastmod`.
   - `import mockIndex from "@/data/mocks/mock-index.json"` → quiz URLs, but only for the whitelisted topics. Skip silently if a whitelisted topic has no mocks yet.
   - Keep a small `staticEntries` array for `/`, `/all-tests`, `/blog`, `/about`, `/contact`, `/faq`, `/help`, `/exam-updates`, `/sitemap`, legal pages, and the SEO landing pages.
   - Keep `Cache-Control: public, max-age=3600`.

3. **Delete `public/sitemap.xml`** so the static file doesn't shadow the dynamic route at the CDN edge.

4. **Verify `public/robots.txt`** still has `Sitemap: https://www.uktesthub.com/sitemap.xml` and `Allow: /` (it does — no change expected, will confirm).

## Output shape

```text
/                               (priority 1.0, daily)
/all-tests, /blog               (0.9, weekly)
/about, /contact, /faq, /help, /exam-updates, /sitemap   (0.6, monthly)
legal pages                     (0.3, yearly)
SEO landings                    (0.9, weekly)
/category/{slug}                (0.9, weekly)         × 24
/topic/{slug}                   (0.7, weekly)         × 115
/guide/{slug}                   (0.7, monthly)        × 115
/blog/{slug}  + lastmod         (0.7, monthly)        × 58
/quiz/{topic}-mock-{n}          (0.6, monthly)        whitelist only (~100–300)
```

Estimated total: ~450–600 URLs (vs current ~40), without leaking admin/auth pages or flooding Google with thin quiz shells.

## Out of scope

- Not adding the remaining ~5,000 quiz URLs. They can be added later in a follow-up once each quiz page has unique title/meta/content.
- Not splitting into a sitemap index — total stays well under the 50,000-URL single-sitemap limit.
- No changes to the actual page SEO (titles/meta) of quiz pages in this task.