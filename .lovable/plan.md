# Fix: Google CMP flashes then disappears on uktesthub.com

## Root causes (most → least likely)

**1. Two competing CMP loaders racing.**
`src/routes/__root.tsx` currently injects BOTH:
- the Funding Choices loader (`fundingchoicesmessages.google.com/i/pub-…`)
- the AdSense loader (`pagead2.googlesyndication.com/.../adsbygoogle.js?client=…`)

The AdSense tag already auto-loads Funding Choices for the same publisher. When both run, two CMP frames mount and one immediately closes/replaces the other — exactly the "appears briefly then disappears" symptom. The browser warning `AdSense head tag doesn't support data-adsense-loader attribute` is AdSense complaining about the second tag.

**2. The in-house `CookieConsent` overlay can sit on top of the Google CMP.**
`CookieConsent` shows its own bottom-sheet (`z-[60]`) whenever `getConsent() === null`. It only suppresses itself after polling and seeing `window.__tcfapi` / `window.googlefc` — that poll runs every 500 ms, so the in-house banner briefly renders over the CMP. Worse, on a fresh page the user may dismiss our banner thinking it's the CMP, and either way two consent UIs at once is what Google's CMP self-tests treat as "another script is interfering".

**3. (Verification only)** Nothing in the codebase writes a TCF string, calls `__tcfapi('setConsent', …)`, or auto-clicks a button. `PageViewTracker` only fires GA events; `AdSlot`/`StickyAdSlot` are gated on `ADSENSE_ENABLED` (env flag) and our local consent, so they don't touch the Google CMP. No route loader redirects or remounts the root.

## Changes

### A. `src/routes/__root.tsx` — load exactly ONE CMP path

Keep the Funding Choices loader (it's the certified GDPR message you published in AdSense → Privacy & messaging). Remove the manual `adsbygoogle.js` injection from `__root` — AdSense will be loaded on demand by `AdSlot.loadAdsenseScript()` when an ad actually renders (and only after consent), which is what `src/components/AdSlot.tsx` is already designed to do.

Concretely in `RootComponent`'s `useEffect`:
- Keep the `data-fc-loader` block (FC loader + `signalGooglefcPresent` iframe).
- Delete the `data-adsense-loader` block.

Rationale: the `<meta name="google-adsense-account">` tag in `RootShell` is enough for AdSense to associate the domain; the runtime script only needs to load when we're actually about to fill a slot.

### B. `src/components/CookieConsent.tsx` — retire the in-house banner

Since the certified Funding Choices CMP is now live and authoritative for GDPR on uktesthub.com, the in-house banner should never render. Do this without deleting the file (footer "Cookie Settings" link still opens the preferences modal):

1. Replace the `cmpPresent` polling + `showBanner` logic so the banner is always suppressed on production domains where the Google CMP runs. Treat the CMP as the source of truth.
2. Keep the `<Dialog>` "Cookie preferences" modal — it stays accessible via the footer link, but it no longer auto-opens and no longer writes consent on first visit.
3. Stop calling `setAnalyticsConsent(false)` on mount when consent is `null`. The current code logs `Consent rejected: analytics disabled` for a first-time visitor who has not yet answered the CMP — that's misleading and could be read as "we already recorded a rejection". Only react to explicit user choices made via the modal.
4. Leave the `OPEN_SETTINGS_EVENT` listener so the footer link still works.

Net effect: the only consent UI a first-time UK/EEA visitor sees is Google's certified CMP. Our modal stays available for users who want to fine-tune analytics/functional cookies after the fact.

### C. `src/lib/analytics-ga.ts` — no behavioural change, but sanity-check

GA is already strictly gated on `getConsent()?.analytics === true`, so removing the auto in-house banner does not silently enable GA. No edit required; just confirm in QA that `Consent state on load` log shows no analytics fetches until the user opts in via either the CMP (once we wire TCF → analytics) or our preferences modal.

## Out of scope (intentional)

- No changes to GA wiring or to TCF-aware analytics gating. That's a follow-up once we've confirmed the CMP renders cleanly.
- No edits to `AdSlot.tsx` — it already self-loads `adsbygoogle.js` on demand and is consent-gated.
- No CSS/z-index changes — once the duplicate loaders and overlay banner are gone, the CMP renders in its own top-layer iframe and nothing else competes for the viewport.

## QA checklist after implementing

1. Hard reload `https://www.uktesthub.com/?fc=alwaysshow&fctype=gdpr` in incognito.
2. The Google CMP must render and stay until the user clicks Consent / Manage options / Do not consent.
3. No second bottom-sheet banner from our app should appear at any point.
4. DevTools → Network: only ONE request to `fundingchoicesmessages.google.com`; no `adsbygoogle.js` request until an actual ad slot mounts.
5. Console: the `AdSense head tag doesn't support data-adsense-loader attribute` warning is gone.
6. After clicking "Manage options" → "Confirm choices", verify `window.__tcfapi('getTCData', 2, …)` returns a TC string and the CMP closes cleanly.
7. Footer → "Cookie Settings" still opens our in-house preferences modal (for analytics/functional fine-tuning).
