// SVG renderings of common UK road signs.
// Pure SVG so no asset pipeline / image hosting is needed and they scale crisply.

type Props = { type: string; className?: string; title?: string };

export function RoadSign({ type, className, title }: Props) {
  const sign = SIGNS[type];
  if (!sign) return null;
  return (
    <div
      className={
        "mx-auto flex aspect-square w-40 items-center justify-center rounded-2xl bg-white p-3 shadow-soft md:w-48 " +
        (className ?? "")
      }
      role="img"
      aria-label={title ?? type}
    >
      {sign}
    </div>
  );
}

// Reusable building blocks
const RedCircle = ({ children }: { children?: React.ReactNode }) => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    <circle cx="50" cy="50" r="44" fill="white" stroke="#c8102e" strokeWidth="9" />
    {children}
  </svg>
);

const BlueCircle = ({ children }: { children?: React.ReactNode }) => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    <circle cx="50" cy="50" r="46" fill="#0033a0" />
    {children}
  </svg>
);

const RedTriangle = ({ children }: { children?: React.ReactNode }) => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    <polygon points="50,8 94,86 6,86" fill="white" stroke="#c8102e" strokeWidth="7" strokeLinejoin="round" />
    {children}
  </svg>
);

const SIGNS: Record<string, JSX.Element> = {
  stop: (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <polygon
        points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30"
        fill="#c8102e"
        stroke="white"
        strokeWidth="4"
      />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontFamily="Arial Black, sans-serif"
        fontSize="26"
        fontWeight="900"
        fill="white"
      >
        STOP
      </text>
    </svg>
  ),
  giveWay: (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <polygon points="50,92 6,14 94,14" fill="white" stroke="#c8102e" strokeWidth="8" strokeLinejoin="round" />
      <text x="50" y="48" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111">GIVE</text>
      <text x="50" y="64" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111">WAY</text>
    </svg>
  ),
  noEntry: (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <circle cx="50" cy="50" r="46" fill="#c8102e" />
      <rect x="20" y="44" width="60" height="12" fill="white" />
    </svg>
  ),
  speed30: (
    <RedCircle>
      <text
        x="50"
        y="64"
        textAnchor="middle"
        fontFamily="Arial Black, sans-serif"
        fontSize="38"
        fontWeight="900"
        fill="#111"
      >
        30
      </text>
    </RedCircle>
  ),
  speed40: (
    <RedCircle>
      <text
        x="50"
        y="64"
        textAnchor="middle"
        fontFamily="Arial Black, sans-serif"
        fontSize="38"
        fontWeight="900"
        fill="#111"
      >
        40
      </text>
    </RedCircle>
  ),
  noOvertaking: (
    <RedCircle>
      <rect x="32" y="28" width="14" height="44" rx="2" fill="#c8102e" />
      <rect x="54" y="28" width="14" height="44" rx="2" fill="#111" />
    </RedCircle>
  ),
  turnLeft: (
    <BlueCircle>
      <path
        d="M62 30 L62 50 L40 50 L40 38 L22 56 L40 74 L40 62 L74 62 L74 30 Z"
        fill="white"
      />
    </BlueCircle>
  ),
  miniRoundabout: (
    <BlueCircle>
      <path
        d="M50 22 a28 28 0 1 1 -19 8"
        fill="none"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <polygon points="28,32 38,28 36,42" fill="white" />
    </BlueCircle>
  ),
  schoolWarning: (
    <RedTriangle>
      <g transform="translate(50 60)" fill="#111">
        <circle cx="-10" cy="-8" r="5" />
        <rect x="-14" y="-3" width="8" height="14" />
        <circle cx="10" cy="-8" r="5" />
        <rect x="6" y="-3" width="8" height="14" />
      </g>
    </RedTriangle>
  ),
  crossroadsWarning: (
    <RedTriangle>
      <rect x="44" y="32" width="12" height="48" fill="#111" />
      <rect x="22" y="50" width="56" height="12" fill="#111" />
    </RedTriangle>
  ),
  slipperyRoad: (
    <RedTriangle>
      <rect x="40" y="32" width="20" height="44" rx="3" fill="#111" />
      <path
        d="M30 50 Q50 40 70 50 T70 70"
        stroke="#111"
        strokeWidth="4"
        fill="none"
      />
    </RedTriangle>
  ),
};
