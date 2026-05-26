## Goal

Google's AdSense Privacy & Messaging (Funding Choices) CMP is the primary consent system for advertising cookies. The existing in-house banner stays only as a fallback for when Google CMP cannot render (preview domains, blockers, CMP outage). The fallback must never claim IAB TCF consent and must never grant personalised AdSense consent.

## Changes

### 1. `src/components/CookieConsent.tsx` — stricter fallback gating

- Keep the 1.5s wait, but extend the "CMP rendered" detection to also treat CMP as present when:
  - `window.googlefc?.ccpa` / `googlefc.callbackQueue` exists and is initialised, or
  - any `script[src*="fundingchoicesmessages.google.com"]` is in the DOM and still loading (not just rendered).
- After the initial 1.5s, keep polling: if Google CMP appears later, immediately hide the fallback banner.
- Add a `MutationObserver` for the lifetime of the fallback so that if Google injects its UI after we showed ours, we hide ours.
- Listen for `__tcfapi('addEventListener', ...)` once available and hide the fallback on any non-null TC string (Google has taken over).
- Remove the "Advertising" toggle row from the fallback `<Dialog>` entirely. Advertising consent must only come from Google CMP. The Cookie Settings modal launched from the footer should show a short note explaining that ad consent is managed by Google's banner and link to a button that re-triggers Google CMP via `window.googlefc.callbackQueue.push(() => window.googlefc.showRevocationMessage())` when available.
- Update banner copy to exactly:
  > "We use cookies to run UK Test Hub, measure usage, and manage your choices. Advertising cookies will be controlled through Google's consent system where required. You can accept all, reject non-essential, or manage your choices."
- Keep Privacy Policy and Cookie Policy links inline in the banner.

### 2. `src/lib/consent.ts` — fallback cannot set advertising

- `acceptAll()` in the fallback context grants `analytics: true, functional: true` only — never `advertising: true`. Rename internal callsite or pass an explicit scope so the fallback's "Accept all" maps to analytics + functional.
- Add a new helper `acceptAllFallback()` used by the fallback banner; keep `acceptAll()` available but only invoke it from places where the user has a full choice over all categories (e.g. when Google CMP is unavailable AND advertising is still off — which after this change means: never from the fallback).
- Document at the top of the file that `advertising: true` may only be set by Google CMP via the AdSense/Funding Choices flow. Add a runtime guard in `setConsent` that ignores `advertising: true` unless an explicit `source: "google-cmp"` flag is passed.

### 3. Root bootstrap (`src/routes/__root.tsx`) — no changes to Google CMP loading

The existing Funding Choices + AdSense bootstrap stays as-is (it already loads on every page). The fallback's role is purely cosmetic + analytics/functional consent.

### 4. Audit text on `src/routes/cookies.tsx`

Add one short paragraph in section 5 ("Advertising cookies") clarifying that advertising consent is collected and recorded by Google's consent system, not by the fallback banner. No structural change.

## Out of scope

- No changes to GA loading logic — analytics consent is still owned by the in-house store, which is fine (GA is not IAB TCF).
- No changes to ad slot rendering.

## Technical details

- Detection helpers in `CookieConsent.tsx` already use `CMP_RENDERED_SELECTORS` + `__tcfapi`. We extend with `MutationObserver` on `document.body` watching for those selectors and a `__tcfapi('addEventListener')` subscription that hides the fallback on `cmpStatus === 'loaded'` or any `eventStatus` of `tcloaded` / `useractioncomplete`.
- The `advertising: true` guard in `setConsent` prevents any future code path (or a stale localStorage value crafted by the old fallback) from accidentally enabling personalised ads without going through Google.

## User-visible result

- Live `uktesthub.com`: Google's CMP appears, fallback never shows.
- Preview / blockers: fallback shows with the new copy, no "Advertising" toggle, "Accept all" only enables analytics + functional.
- Cookie Settings (footer link): shows analytics + functional toggles plus a "Manage advertising consent" button that re-opens Google's CMP when available.
