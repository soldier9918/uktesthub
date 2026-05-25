
# Fix: cookie banner missing — restore fallback, keep Google CMP as primary

## What I verified live on uktesthub.com

Loaded `https://www.uktesthub.com/?fc=alwaysshow&fctype=gdpr` in a clean browser session:

- The Funding Choices loader (`fundingchoicesmessages.google.com/i/pub-7445296424475191?ers=1`) loads successfully.
- The message config (`/f/AGSKWxX…`) is fetched.
- Two telemetry POSTs to `/el/AGSKWxX…` fire (impression + dismiss).
- DOM observe finds NO CMP iframe and NO consent dialog.
- Our previous fix removed the in-house banner entirely.

Net result for the user: no consent UI visible anywhere. That's a UK GDPR/PECR problem, not just a UX one.

## Root cause of "no banner"

The Google Funding Choices CMP is **not reliably rendering** on uktesthub.com, even with `fc=alwaysshow&fctype=gdpr`. Likely contributors:
1. The message was published in AdSense but Google's renderer is treating the visit as a non-GDPR region or as already-consented (the second `/el/` POST is the auto-dismiss).
2. Even when it DOES render for genuine UK visitors, the previous bug (flash-then-disappear) was never actually proven to be caused by our in-house banner — that was a hypothesis. Removing the in-house banner did not bring the CMP back.

We can't fully fix the Google CMP from our code — its rendering is controlled server-side by Google. What we CAN do is make sure a working banner always appears.

## Plan

### A. `src/components/CookieConsent.tsx` — restore the in-house banner as the source of truth

Bring back the bottom-sheet banner, but with smarter gating so it doesn't race the Google CMP when the CMP does render:

1. Re-introduce `showBanner` state. Initial value `false`.
2. On mount, if `getConsent() === null`:
   - Start a 1500 ms timer.
   - While the timer runs, poll every 200 ms for either `window.__tcfapi` being a function OR a DOM element matching `iframe[src*="fundingchoicesmessages.google.com"]`, `.fc-consent-root`, `.fc-dialog-container`, or `[id^="googlefcPresent"]` (the Google CMP's actual rendered iframe — distinct from the `googlefcPresent` signal iframe we inject).
   - If the CMP is detected → `setShowBanner(false)` and stop polling. Google owns this consent decision.
   - If the timer expires with no CMP detected → `setShowBanner(true)`. Our banner is now the sole consent UI.
3. Subscribe to consent changes (already in place) and hide the banner once any decision is recorded.
4. The bottom-sheet UI (Accept all / Reject non-essential / Cookie settings) is the same one that was there before — buttons call `acceptAll()`, `rejectNonEssential()`, and dispatch `OPEN_SETTINGS_EVENT` to open the existing preferences modal.
5. Keep the modal (`Dialog`) as-is for the footer "Cookie Settings" entry point.
6. Continue suppressing on `/admin-kb20*`.

This makes the in-house banner a deterministic fallback: if Google's CMP shows up in time, we step aside; otherwise we guarantee a visible, compliant consent UI.

### B. `src/routes/__root.tsx` — leave the Funding Choices loader as-is

No changes here. The single FC loader (and the `signalGooglefcPresent` shim) is the correct way to give Google's CMP a chance to render. We already removed the duplicate `adsbygoogle.js` injection, which is the right call regardless.

### C. No changes to `src/lib/consent.ts` or `src/lib/analytics-ga.ts`

GA is already strictly gated on `getConsent()?.analytics === true`. The banner controls write to consent, which the analytics layer already subscribes to.

## Out of scope

- No attempt to forcibly re-render Google's CMP — that's controlled by Google's servers and the AdSense Privacy & messaging dashboard. If the CMP keeps not rendering after this fix, the next step is to publish a fresh message in AdSense or remove the FC loader entirely. We'll evaluate that after confirming the in-house banner works.
- No changes to AdSlot / advertising loading. AdSense loads on demand only after `consent.advertising === true`.

## QA checklist after implementing

1. Hard reload `https://www.uktesthub.com` in incognito (no `?fc=alwaysshow`). A consent banner MUST be visible within ~2 seconds. Either the Google CMP or our bottom-sheet — never neither.
2. Click "Accept all" on the in-house banner → it disappears, and reloading the page does NOT show it again (consent persisted to `localStorage`).
3. Click "Reject non-essential" → same persistence behaviour, and `getConsent().analytics === false`.
4. From the footer, click "Cookie Settings" → preferences modal opens (independent of whether the banner is visible).
5. Clear `localStorage` and load `?fc=alwaysshow&fctype=gdpr`. If Google's CMP renders, our bottom-sheet must NOT also appear. If Google's CMP does not render within 1.5 s, our bottom-sheet appears.
6. No duplicate consent UI ever visible at the same time.
