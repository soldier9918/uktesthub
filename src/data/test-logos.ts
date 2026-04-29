import type { BadgeKey } from "@/components/TestBadge";

/**
 * Map test slugs → stylised brand badge for the issuing body.
 * Single source of truth used by Popular Mock Tests, Featured Mock Tests
 * and Popular Categories tiles.
 */
export const TEST_BADGES: Record<string, BadgeKey> = {
  // TfL family
  seru: "tfl",
  topographical: "tfl",
  "phv-licence": "tfl",
  "congestion-charge": "tfl",
  ulez: "tfl",
  "ph-safeguarding": "tfl",
  "ph-english": "tfl",
  "ph-speaking-listening": "tfl",
  "ph-london-regulations": "tfl",
  "ph-passenger-safety": "tfl",
  "ph-assistance-dogs": "tfl",
  "ph-badge-rules": "tfl",
  "ph-dbs-licensing": "tfl",
  "ph-hmrc-tax-check": "tfl",
  "ph-safety-equality": "tfl",

  // DVSA / DVLA
  "driving-theory": "dvsa",
  "hazard-perception": "dvsa",
  motorcycle: "dvsa",
  lgv: "dvsa",
  pcv: "dvsa",
  adi: "dvsa",
  "highway-code": "dvsa",

  // Home Office
  "life-in-the-uk": "home-office",

  // IELTS / English
  ielts: "ielts",
  "ielts-listening": "ielts",
  "ielts-reading": "ielts",
  esol: "esol",

  // CSCS
  cscs: "cscs",
  "cscs-green": "cscs",
  "cscs-gold": "cscs",

  // NMC / NHS
  "nmc-cbt": "nmc",
  "nmc-osce": "nmc",
  nhs: "nhs",

  // SIA
  sia: "sia",
  "sia-door": "sia",
  "sia-cctv": "sia",

  // Health & safety
  "food-hygiene": "food-hygiene",
  "first-aid": "first-aid",

  // Other
  numerical: "generic",
  "logical-reasoning": "generic",
};

/** Lookup with safe fallback. */
export function badgeForSlug(slug: string): BadgeKey {
  return TEST_BADGES[slug] ?? "generic";
}
