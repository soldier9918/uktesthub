/**
 * AdSense readiness helper. Currently inert — wired so we can flip on
 * later without re-architecting consent. No script is loaded today.
 */
import { getConsent } from "./consent";

export function canShowPersonalisedAds(): boolean {
  return Boolean(getConsent()?.advertising);
}

export function loadAdsense() {
  // Intentionally empty — AdSense is not yet activated on UK Test Hub.
  // When activated, gate the script injection on canShowPersonalisedAds().
}
