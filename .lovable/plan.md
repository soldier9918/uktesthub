## Goal

Get UK Test Hub to a clean AdSense-approval state without showing any ad placeholders before approval, while making consent + analytics fully compliant with UK GDPR / PECR.

## Findings (current state)

- `src/components/CookieConsent.tsx` already implements a 4-category banner (necessary / analytics / advertising / functional) with Accept all, Reject non-essential, Manage choices, links to Privacy + Cookie Policy, and a footer "Cookie Settings" trigger. **Bug**: it calls `initGA()` on mount unconditionally, so GA loads before/regardless of consent.
- `src/lib/analytics-ga.ts` loads GA4 immediately when `initGA()` runs and has no consent gate (ignores `analytics` choice).
- `src/components/AdSlot.tsx` is already safe: returns `null` unless `VITE_ADSENSE_ENABLED=true` + a client ID + slot ID. No empty boxes in production. But it does **not** check advertising consent before pushing to `adsbygoogle`, and there are no semantic wrappers (`InContentAd`, `SidebarAd`, `BottomAd`, `MobileAd`).
- `src/routes/privacy.tsx` mentions AdSense only briefly. No dedicated "Advertising and Google AdSense" section, no personalised vs non-personalised ads explanation.
- `src/routes/cookies.tsx` has the right structure but the AdSense section is one paragraph — needs a proper Google AdSense subsection per the request.
- Footer already has all required legal links + Cookie Settings.
- All required pages exist (`/about`, `/contact`, `/privacy`, `/cookies`, `/terms`, `/disclaimer`, `/accessibility`, `/sitemap`).

## Plan

### 1. Gate GA on analytics consent (`src/lib/analytics-ga.ts` + `CookieConsent.tsx` + `PageViewTracker.tsx`)

- Add an internal `consentGranted` flag in `analytics-ga.ts`. Export `setAnalyticsConsent(granted: boolean)`.
- `initGA()` becomes a no-op until `setAnalyticsConsent(true)` has been called. `trackGAEvent` short-circuits when consent is not granted.
- In `CookieConsent.tsx`, replace the unconditional `initGA()` with: read consent on mount, call `setAnalyticsConsent(c?.analytics === true)`, and re-call it inside the `subscribe` listener whenever consent changes. So GA only loads after the user accepts analytics, and stops firing if they later reject.
- No change needed to `PageViewTracker` — `trackGAEvent` will self-gate.

### 2. AdSense loader + consent gate (`src/components/AdSlot.tsx`)

- Add a `getConsent().advertising` check before `loadAdsenseScript()` and before `(window.adsbygoogle).push({})`. If advertising consent is missing, render `null`.
- Keep the existing `VITE_ADSENSE_ENABLED` + `VITE_ADSENSE_CLIENT_ID` env switch and admin kill-switches.
- Add a top-of-file comment block documenting the central AdSense config (env vars, how to enable, that no script loads when disabled, that ads respect advertising consent).
- Add thin semantic wrappers exported from the same file (zero new layout, just preset sizes + safe spacing classes):
  - `InContentAd` — `size="leaderboard"`, used between content blocks on guides.
  - `SidebarAd` — `size="sidebar"`, used in desktop sidebars.
  - `BottomAd` — `size="leaderboard"`, used before footer / FAQ.
  - `MobileAd` — `size="rectangle"`, mobile in-content.
- All wrappers inherit the existing "render nothing when not enabled / no consent" behaviour, so no blank boxes appear pre-approval.

### 3. Privacy Policy expansion (`src/routes/privacy.tsx`)

- Replace section 5a with a dedicated **"Advertising and Google AdSense"** section using the wording in the brief (Google AdSense, third-party vendors, advertising cookies, personalised vs non-personalised ads, link to Cookie Policy, link to Cookie Settings button that dispatches `uktesthub:open-cookie-settings`).
- Keep existing sections; add cross-links to `/cookies` and the Cookie Settings opener.

### 4. Cookie Policy expansion (`src/routes/cookies.tsx`)

- Restructure to the 10-section layout in the brief: What are cookies / How we use them / Necessary / Analytics / Advertising / Google Analytics / Google AdSense / Managing preferences / Browser controls / Contact.
- Google AdSense subsection covers: third-party vendor cookies, personalised ads (consent), non-personalised ads still using cookies for fraud prevention / frequency capping / reporting, link to Cookie Settings.

### 5. AdSense central config

- Document the single source of truth in code comments at the top of `AdSlot.tsx`: `VITE_ADSENSE_ENABLED`, `VITE_ADSENSE_CLIENT_ID`, plus admin DB switches `hide_ads_globally` and `preview_without_ads`. No new env file needed (project uses Vite env).
- Add a TODO comment block in `CookieConsent.tsx` marking the spot where a Google-certified IAB TCF CMP script (e.g. Funding Choices) can be inserted later, without ripping out the current banner.

### 6. No-touch areas

- Footer — already complete.
- Existing `/about`, `/contact`, `/disclaimer`, `/accessibility`, `/terms` — leave content as-is unless review finds gaps after the privacy + cookies edits.
- Quiz / category / topic / guide pages — **no ad insertions yet**. Wrappers are created so they can be dropped in after AdSense approval; placing them now would just render `null` everywhere.
- Sitemap, robots, SEO copy on category/guide pages — not in scope of this pass (existing content is already substantial; user can flag specific thin pages separately).

## Technical notes

- GA gating uses a module-level `consentGranted` boolean; `loadGAScript` early-returns when false. When consent flips off after grant, set `window['ga-disable-G-P2CME6M6GE'] = true` via the existing `disableGA()` helper.
- AdSlot consent check imports `getConsent` from `@/lib/consent` (already used by the banner). Subscribing to consent changes inside AdSlot is unnecessary since it only mounts where ads might render and re-evaluates on each render via React state in the parent flow.
- No DB migration, no new routes, no new dependencies.
- A future certified CMP swap is a one-file change: delete the in-house banner, drop the CMP loader script in `__root.tsx`, replace `getConsent()` reads with the CMP's TCF API. The plan keeps this clean by isolating consent reads to `consent.ts` + `CookieConsent.tsx`.

## Files touched

- `src/lib/analytics-ga.ts` — add consent gate
- `src/components/CookieConsent.tsx` — wire consent → `setAnalyticsConsent`, add CMP-swap TODO comment
- `src/components/AdSlot.tsx` — add advertising-consent gate, add `InContentAd` / `SidebarAd` / `BottomAd` / `MobileAd` wrappers, expand config doc comment
- `src/routes/privacy.tsx` — add "Advertising and Google AdSense" section
- `src/routes/cookies.tsx` — restructure to 10-section layout
