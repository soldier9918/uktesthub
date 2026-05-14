## What's broken

**1. Duplicate `<title>` / `<meta>` tags from the root route**
`src/routes/__root.tsx` declares page-level meta (`title`, `description`, `og:title`, `og:description`, `og:image`, `og:image:width/height/alt`, `twitter:title`, `twitter:description`, `twitter:image`, `og:url`). Pages that use the `pageMeta()` helper or inline meta override the same keys, but TanStack Router's `<title>` rendering and `links` array are not always reliably deduped — and even where dedupe works, the root-level page-content tags are wrong by design (they're not sitewide defaults).

**2. `og:image:alt` ends in "— UK Test Hub — UK Test Hub"**
`src/lib/seo.ts` `pageMeta()` builds the default alt as `` `${title} — ${SITE_NAME}` ``. Titles already end in `| UK Test Hub`, so the alt becomes `"… | UK Test Hub — UK Test Hub"`.

**3. `/guide/road-signs` (and siblings) title still verbose**
Current: `UK Road Signs Test Guide | UK Test Hub`. User wants `Road Signs Test Guide | UK Test Hub`. Same simplification pattern should apply to every entry in `src/data/topic-seo.ts` (the source of all `/guide/*` titles).

**4. Footer placeholder social icons**
`src/components/SiteFooter.tsx` renders Facebook/Twitter/Youtube/Instagram icons all linking to `href="#"`. No real accounts exist.

## Changes

### A. Strip page-content meta from `__root.tsx`
Keep only true sitewide defaults:
- `charSet`, `viewport`, `author`, `google-site-verification`
- `og:type: website`, `og:site_name: UK Test Hub`, `twitter:card: summary_large_image`
- A single fallback `title: "UK Test Hub"` (TanStack treats `title` specially and the child route's title wins via dedupe — but this fallback covers the rare unmatched route)
- Keep `links` (stylesheet, fonts, icons) and `scripts` (organizationSchema + websiteSchema)

Remove from root:
- `description`, `og:title`, `og:description`, `og:url`
- `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`
- `twitter:title`, `twitter:image`

Rationale: every public route already provides its own page-specific values (verified across prior turns — homepage, all-tests, category.english inline; everything else uses `pageMeta()`; the 21 utility/legal routes all have their own head with `og:url` + canonical). After this change, each page emits exactly one of each tag.

### B. Fix `pageMeta()` `og:image:alt` default
In `src/lib/seo.ts`, change the default from `` `${title} — ${SITE_NAME}` `` to just `title` (titles already include the site name, so no extra suffix is needed). Callers can still pass an explicit `imageAlt` override.

### C. Shorten guide titles further in `src/data/topic-seo.ts`
Rename to drop noisy prefixes/suffixes and standardise on `[Keyword] Guide | UK Test Hub`:
- `"UK Road Signs Test Guide | UK Test Hub"` → `"Road Signs Test Guide | UK Test Hub"`
- `"British Citizenship Test Guide | UK Test Hub"` → keep (already short)
- `"UK Laws & Rights Quiz Guide | UK Test Hub"` → `"UK Laws & Rights Guide | UK Test Hub"`
- `"UK Geography Test Guide | UK Test Hub"` → keep
- `"English Grammar & Vocab Guide | UK Test Hub"` → keep
- All other entries already match the pattern and are under 60 chars — leave alone.

Also update `road-signs` description to the user's suggested copy:
`"Learn UK road signs for the theory test, including shapes, colours, markings and common exam questions. Practise free mock tests."`

### D. Hide footer social icons
In `src/components/SiteFooter.tsx`, remove the `<div className="mt-6 flex gap-2">…</div>` block and the now-unused `lucide-react` icon imports (`Facebook`, `Twitter`, `Youtube`, `Instagram`). Leave the rest of the footer (logo, blurb, legal links, disclaimer) untouched. This keeps the design clean and makes it trivial to re-introduce icons once real URLs exist.

## Verification

After the edits, view-source on three pages and confirm exactly one of each tag:
1. `/` — title `Free UK Mock Tests | UK Test Hub`, single canonical, single og:url
2. `/guide/road-signs` — title `Road Signs Test Guide | UK Test Hub`, og:image:alt has no doubled site name
3. `/all-tests` — title `All UK Mock Tests | UK Test Hub`

No public page is noindexed; canonicals and og:url remain self-referencing on every leaf.

## Files touched
- `src/routes/__root.tsx` — remove page-content meta, keep sitewide defaults
- `src/lib/seo.ts` — fix default `og:image:alt`
- `src/data/topic-seo.ts` — rename `road-signs` + `uk-laws-rights` titles; update road-signs description
- `src/components/SiteFooter.tsx` — remove placeholder social icons + unused icon imports
