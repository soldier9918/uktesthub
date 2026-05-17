## Goal

Add the Google AdSense verification script to the site `<head>` so Google can review UKTestHub, without rendering any ad placements yet.

## Change

**File:** `src/routes/__root.tsx`

In the root route's `head()` `scripts` array, add an entry for the AdSense loader:

```ts
{
  async: true,
  src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7445296424475191",
  crossOrigin: "anonymous",
}
```

This emits the exact tag Google requires, site-wide, via TanStack Start's `HeadContent` (already wired in `RootShell`). It loads on every page so the AdSense crawler sees it during review.

## What stays unchanged (matches your requirements)

- `VITE_ADSENSE_ENABLED` stays unset/false in `.env`, so `ADSENSE_ENABLED` in `src/components/AdSlot.tsx` stays `false`.
- All `AdSlot`, `InContentAd`, `SidebarAd`, `BottomAd`, `MobileAd`, and `StickyAdSlot` wrappers already early-return `null` when `ADSENSE_ENABLED` is false → no blank boxes, no layout gaps.
- Consent gating in `AdSlot.tsx` already blocks ad rendering until advertising consent is granted, satisfying UK GDPR / PECR. The existing `CookieConsent` banner is untouched.
- No ad components are added near quiz controls, Start/Next buttons, nav, or filters — no UI changes at all.
- The AdSense loader script itself is what Google requires for site review; it does not render ads until matching `<ins class="adsbygoogle">` slots exist (which we are deliberately not adding yet).

## Post-approval follow-up (not part of this change)

When AdSense approves the site:
1. Set `VITE_ADSENSE_ENABLED=true` and confirm `VITE_ADSENSE_CLIENT_ID=ca-pub-7445296424475191` via secrets.
2. Configure a Google-certified CMP (e.g. Google's own AdSense consent message) for UK/EEA/CH personalised-ads consent.
3. Enable specific slots in the admin `ad_slots` table and place `InContentAd` / `SidebarAd` / `BottomAd` in approved spots only (away from quiz interactions).
