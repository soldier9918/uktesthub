## Goal
Keep robots.txt minimal (no private URL disclosure) and ensure private/auth/system pages are excluded from search via per-page `noindex,nofollow` meta + removed from the HTML sitemap.

## Current state
- `robots.txt` (both `public/robots.txt` and `/robots.txt` route) already match the requested exact contents. **No change needed.**
- XML sitemap (`src/routes/sitemap[.]xml.ts`) already excludes admin/auth/account/dashboard/bookmarks/report/feedback. **No change needed.**
- Admin routes are already gated via `AdminGate` (login route exists separately) and `/admin` itself returns 404 with `noindex,nofollow`. **No change needed.**
- Pages already carrying `noindex` meta: `/admin`, all `/admin-kb20/*`, `/signin`, `/signup`, `/account`, `/dashboard`, `/bookmarks`, `/forgot-password`, `/reset-password`. **No change needed.**

## Changes needed
1. **`src/routes/report.tsx`** — add `{ name: "robots", content: "noindex,nofollow" }` to `head().meta`.
2. **`src/routes/feedback.tsx`** — same noindex,nofollow meta.
3. **`src/routes/sitemap.tsx`** (HTML sitemap) — remove the `<li>` links to `/report` and `/feedback` from the Support section so the public HTML sitemap matches the XML sitemap exclusions. Keep `/help` and `/exam-updates`.

## Out of scope (per user instruction)
- Do not edit `public/robots.txt` or `src/routes/robots[.]txt.ts`.
- Do not add admin paths anywhere public.
- Do not touch the XML sitemap.

## Validation
- `rg "noindex" src/routes/{report,feedback}.tsx` → both match.
- Visit `/sitemap` → no `/report` or `/feedback` links.
- `curl /robots.txt` → unchanged.
- `curl /sitemap.xml` → unchanged.