## Problem

GA4 is wired up correctly (`G-P2CME6M6GE`, gated by consent, no admin tracking, deduped via `gaLoaded` flag, SPA `PageViewTracker` is mounted globally), but **no `page_view` is ever sent for the very first page after a visitor accepts cookies**:

- `PageViewTracker` runs its `useEffect` on mount with the current pathname.
- At that moment consent is still `null`, so `trackGAEvent` early-returns and nothing is sent.
- The user then clicks "Accept all". `initGA` loads the GA script, but `gtag('config', …, { send_page_view: false })` suppresses GA's automatic initial hit, and `PageViewTracker` will not fire again until the pathname actually changes.
- Result: in GA Realtime the visit never shows up unless the user navigates to a second route.

Two smaller gaps from the requirements:
- No dev-only debug log when GA initialises.
- When consent is later revoked and re-granted in the same session, no page_view is sent for the current route either (same root cause).

## Fix

Edit only `src/lib/analytics-ga.ts`. No UI/visual changes.

1. After the GA script is loaded **and** consent is granted, send a manual `page_view` for the current location so the first visit registers in Realtime:
   ```ts
   window.gtag('event', 'page_view', {
     page_path: location.pathname + location.search,
     page_location: location.href,
     page_title: document.title,
   });
   ```
   Do this inside the consent `apply()` path in `initGA` (so it covers both "consent already granted on load" and "user just clicked Accept"), guarded so it only fires once per script load to avoid duplicates with `PageViewTracker`'s subsequent route-change events.

2. Add a dev-only debug log the first time the script is injected:
   ```ts
   if (import.meta.env.DEV) console.log('GA4 loaded: G-P2CME6M6GE');
   ```
   Placed inside `loadGAScript`, after the `gaLoaded = true` guard so it only logs once.

3. Leave everything else intact:
   - Measurement ID stays `G-P2CME6M6GE`.
   - `gaLoaded` guard continues to prevent duplicate `<script>` injection.
   - `CookieConsent.tsx` already calls `initGA()` on mount and `subscribe()` already re-runs `apply()` when the user accepts → script loads immediately on accept.
   - `PageViewTracker` already skips `/admin-kb20/*` and continues to handle SPA route changes.
   - Consent is persisted in `localStorage` (`uktesthub_cookie_consent`), so on future visits `apply()` sees `analytics: true`, loads GA, and fires the initial page_view automatically.

## Verification

After deploy, in incognito on https://www.uktesthub.com:
1. Open the site → cookie banner appears, no `googletagmanager.com/gtag/js` request yet.
2. Click "Accept all" → `gtag/js?id=G-P2CME6M6GE` loads, console shows `GA4 loaded: G-P2CME6M6GE` (dev only), and a `collect?...&en=page_view` request fires.
3. GA4 Realtime → 1 active user on `/`.
4. Navigate to another page → second `page_view` fires via `PageViewTracker`.
5. Visit `/admin-kb20/...` → no GA hit.
