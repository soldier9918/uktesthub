/**
 * Stylised brand badges for UK test issuing bodies.
 *
 * IMPORTANT: These are deliberately stylised initial-tiles, NOT the official
 * trademarks of DVSA, TfL, NHS, the Home Office, IELTS, CSCS, NMC, SIA, etc.
 * UK Test Hub is independent and not affiliated with any of those bodies.
 */

type BadgeKey =
  | "tfl"
  | "dvsa"
  | "dvla"
  | "home-office"
  | "ielts"
  | "cscs"
  | "nmc"
  | "sia"
  | "nhs"
  | "esol"
  | "food-hygiene"
  | "first-aid"
  | "generic";

type BadgeStyle = {
  label: string;
  bg: string;
  fg: string;
  ring?: string;
  /** override for the small chip size */
  fontSize?: string;
};

const STYLES: Record<BadgeKey, BadgeStyle> = {
  tfl: { label: "TfL", bg: "#1C3F94", fg: "#FFFFFF" },
  dvsa: { label: "DVSA", bg: "#0B6B3A", fg: "#FFFFFF", fontSize: "0.55rem" },
  dvla: { label: "DVLA", bg: "#0B6B3A", fg: "#FFFFFF", fontSize: "0.55rem" },
  "home-office": { label: "HM", bg: "#0B0C0C", fg: "#E8B53A" },
  ielts: { label: "IELTS", bg: "#A6192E", fg: "#FFFFFF", fontSize: "0.5rem" },
  cscs: { label: "CSCS", bg: "#FFD200", fg: "#0B0C0C", fontSize: "0.55rem" },
  nmc: { label: "NMC", bg: "#005EB8", fg: "#FFFFFF" },
  sia: { label: "SIA", bg: "#1B1F3A", fg: "#FFFFFF" },
  nhs: { label: "NHS", bg: "#005EB8", fg: "#FFFFFF" },
  esol: { label: "ESOL", bg: "#5B2A86", fg: "#FFFFFF", fontSize: "0.55rem" },
  "food-hygiene": { label: "FH", bg: "#157A3B", fg: "#FFFFFF" },
  "first-aid": { label: "+", bg: "#C8102E", fg: "#FFFFFF", fontSize: "1rem" },
  generic: { label: "UK", bg: "#6B7280", fg: "#FFFFFF" },
};

export const BODY_NAMES: Record<BadgeKey, string> = {
  tfl: "Transport for London",
  dvsa: "Driver & Vehicle Standards Agency",
  dvla: "Driver & Vehicle Licensing Agency",
  "home-office": "UK Home Office",
  ielts: "IELTS",
  cscs: "CSCS",
  nmc: "Nursing & Midwifery Council",
  sia: "Security Industry Authority",
  nhs: "NHS",
  esol: "ESOL",
  generic: "UK Test",
};

interface TestBadgeProps {
  badge: BadgeKey;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "h-6 w-6 text-[0.55rem]",
  md: "h-8 w-8 text-[0.65rem]",
  lg: "h-10 w-10 text-xs",
};

export function TestBadge({ badge, size = "md", className = "" }: TestBadgeProps) {
  const s = STYLES[badge] ?? STYLES.generic;
  return (
    <span
      role="img"
      aria-label={`${s.label} — ${BODY_NAMES[badge]} (stylised)`}
      className={`inline-flex shrink-0 items-center justify-center rounded-md font-display font-extrabold tracking-tight shadow-sm ring-1 ring-black/10 ${SIZE_MAP[size]} ${className}`}
      style={{
        background: s.bg,
        color: s.fg,
        fontSize: s.fontSize,
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}
    >
      {s.label}
    </span>
  );
}

export type { BadgeKey };
