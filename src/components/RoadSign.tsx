import React from "react";
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

// All signs are drawn to UK Highway Code conventions:
//   - Circles with red ring = orders/prohibitions
//   - Solid blue circles = positive instructions
//   - Red equilateral triangles (point up) = warnings
//   - Inverted red/white triangle = give way
//   - Octagonal red = stop
//   - Blue rectangle / blue circle = information / direction

const SIGNS: Record<string, React.ReactElement> = {
  // -------- ORDERS --------
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
        y="60"
        textAnchor="middle"
        fontFamily="Arial Black, sans-serif"
        fontSize="24"
        fontWeight="900"
        fill="white"
      >
        STOP
      </text>
    </svg>
  ),
  giveWay: (
    // Inverted red/white triangle — no text on the sign itself
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <polygon
        points="50,92 6,14 94,14"
        fill="white"
        stroke="#c8102e"
        strokeWidth="9"
        strokeLinejoin="round"
      />
    </svg>
  ),
  noEntry: (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <circle cx="50" cy="50" r="46" fill="#c8102e" />
      <rect x="20" y="44" width="60" height="12" fill="white" />
    </svg>
  ),
  speed20: (
    <RedCircle>
      <text x="50" y="64" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="38" fontWeight="900" fill="#111">20</text>
    </RedCircle>
  ),
  speed30: (
    <RedCircle>
      <text x="50" y="64" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="38" fontWeight="900" fill="#111">30</text>
    </RedCircle>
  ),
  speed40: (
    <RedCircle>
      <text x="50" y="64" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="38" fontWeight="900" fill="#111">40</text>
    </RedCircle>
  ),
  nationalSpeedLimit: (
    // White circle, black diagonal line (top-right to bottom-left)
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <circle cx="50" cy="50" r="46" fill="white" stroke="#111" strokeWidth="4" />
      <line x1="20" y1="80" x2="80" y2="20" stroke="#111" strokeWidth="6" strokeLinecap="round" />
    </svg>
  ),
  noOvertaking: (
    // UK: red car on LEFT, black car on RIGHT, side-by-side inside red ring
    <RedCircle>
      <g>
        {/* red car (left) */}
        <rect x="20" y="50" width="28" height="14" rx="3" fill="#c8102e" />
        <path d="M24 50 L28 42 L42 42 L46 50 Z" fill="#c8102e" />
        <circle cx="26" cy="66" r="3" fill="#111" />
        <circle cx="42" cy="66" r="3" fill="#111" />
        {/* black car (right) — slightly higher to show overtaking */}
        <rect x="52" y="38" width="28" height="14" rx="3" fill="#111" />
        <path d="M56 38 L60 30 L74 30 L78 38 Z" fill="#111" />
        <circle cx="58" cy="54" r="3" fill="#111" />
        <circle cx="74" cy="54" r="3" fill="#111" />
      </g>
    </RedCircle>
  ),
  noUTurn: (
    <RedCircle>
      <path
        d="M30 70 L30 45 a18 18 0 0 1 36 0 L66 60"
        fill="none"
        stroke="#111"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <polygon points="58,60 74,60 66,74" fill="#111" />
      {/* diagonal red bar */}
      <line x1="20" y1="80" x2="80" y2="20" stroke="#c8102e" strokeWidth="8" strokeLinecap="round" />
    </RedCircle>
  ),

  // -------- POSITIVE INSTRUCTIONS (blue circles) --------
  turnLeft: (
    // "Turn left ahead": vertical shaft turning left with arrowhead
    <BlueCircle>
      <path
        d="M55 78 L55 50 L36 50 L36 38 L20 54 L36 70 L36 58 L47 58 L47 78 Z"
        fill="white"
      />
    </BlueCircle>
  ),
  keepLeft: (
    // "Keep left" — bold left-pointing horizontal arrow
    <BlueCircle>
      <path
        d="M58 30 L58 42 L78 42 L78 58 L58 58 L58 70 L22 50 Z"
        fill="white"
      />
    </BlueCircle>
  ),
  aheadOnly: (
    <BlueCircle>
      <path
        d="M44 78 L44 42 L32 42 L50 18 L68 42 L56 42 L56 78 Z"
        fill="white"
      />
    </BlueCircle>
  ),
  miniRoundabout: (
    // Three curved arrows forming a circle (clockwise)
    <BlueCircle>
      <g fill="none" stroke="white" strokeWidth="6" strokeLinecap="round">
        <path d="M50 22 A28 28 0 0 1 74 36" />
        <path d="M78 50 A28 28 0 0 1 64 74" />
        <path d="M50 78 A28 28 0 0 1 26 64" />
        <path d="M22 50 A28 28 0 0 1 36 26" />
      </g>
      {/* arrowheads */}
      <polygon points="74,30 80,38 70,40" fill="white" />
      <polygon points="68,72 60,80 58,70" fill="white" />
      <polygon points="32,68 24,60 34,58" fill="white" />
      <polygon points="38,28 28,30 32,38" fill="white" />
    </BlueCircle>
  ),

  // -------- WARNINGS (red triangles) --------
  schoolWarning: (
    // Two child silhouettes — taller leading shorter
    <RedTriangle>
      <g fill="#111">
        {/* taller child (left) */}
        <circle cx="40" cy="42" r="5" />
        <path d="M35 48 Q35 60 36 72 L40 72 L40 60 L42 60 L42 72 L46 72 Q47 60 47 48 Z" />
        {/* shorter child (right) */}
        <circle cx="58" cy="48" r="4.5" />
        <path d="M53 53 Q53 64 54 74 L57 74 L57 64 L59 64 L59 74 L62 74 Q63 64 63 53 Z" />
        {/* hand-link */}
        <line x1="46" y1="62" x2="54" y2="62" stroke="#111" strokeWidth="2" />
      </g>
    </RedTriangle>
  ),
  crossroadsWarning: (
    <RedTriangle>
      <rect x="44" y="30" width="12" height="50" fill="#111" />
      <rect x="22" y="50" width="56" height="12" fill="#111" />
    </RedTriangle>
  ),
  slipperyRoad: (
    // Car (top) with two wavy skid marks behind it
    <RedTriangle>
      <g fill="#111" stroke="#111">
        {/* car body */}
        <rect x="38" y="32" width="24" height="12" rx="2" />
        <path d="M40 32 L44 26 L56 26 L60 32 Z" />
        <circle cx="43" cy="46" r="3" />
        <circle cx="57" cy="46" r="3" />
      </g>
      {/* two skid wave lines */}
      <path d="M36 56 Q44 62 36 68 Q44 74 36 80" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <path d="M64 56 Q56 62 64 68 Q56 74 64 80" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
    </RedTriangle>
  ),
  roundaboutWarning: (
    // Triangle warning version of roundabout: 3 arrows in a circle
    <RedTriangle>
      <g fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round">
        <path d="M50 36 A14 14 0 0 1 62 44" />
        <path d="M64 54 A14 14 0 0 1 54 68" />
        <path d="M44 68 A14 14 0 0 1 36 54" />
      </g>
      <polygon points="62,40 66,46 58,48" fill="#111" />
      <polygon points="55,70 49,72 50,64" fill="#111" />
      <polygon points="36,52 32,46 40,46" fill="#111" />
    </RedTriangle>
  ),
  pedestrianCrossing: (
    // Walking pedestrian on zebra
    <RedTriangle>
      <g fill="#111">
        <circle cx="50" cy="34" r="4" />
        {/* body and stride */}
        <path d="M50 38 L46 52 L42 64 L46 64 L50 54 L54 64 L58 64 L54 52 Z" />
        {/* zebra stripes */}
        <rect x="34" y="72" width="6" height="6" />
        <rect x="44" y="72" width="6" height="6" />
        <rect x="54" y="72" width="6" height="6" />
        <rect x="64" y="72" width="6" height="6" />
      </g>
    </RedTriangle>
  ),
  twoWayTraffic: (
    // Two vertical arrows — left arrow points down, right arrow points up
    <RedTriangle>
      <g fill="#111">
        {/* left arrow down */}
        <rect x="40" y="34" width="6" height="32" />
        <polygon points="36,62 50,62 43,76" />
        {/* right arrow up */}
        <rect x="54" y="34" width="6" height="32" />
        <polygon points="50,38 64,38 57,24" />
      </g>
    </RedTriangle>
  ),
  roadWorks: (
    // Worker silhouette digging
    <RedTriangle>
      <g fill="#111">
        <circle cx="50" cy="34" r="4.5" />
        {/* body */}
        <path d="M50 39 L44 56 L48 56 L48 70 L52 70 L52 56 L56 56 Z" />
        {/* shovel */}
        <line x1="40" y1="44" x2="68" y2="64" stroke="#111" strokeWidth="3" />
        <polygon points="64,60 74,64 68,72" />
      </g>
    </RedTriangle>
  ),
  levelCrossingNoGate: (
    // Saint Andrew's cross (X) inside red triangle = level crossing without barrier
    <RedTriangle>
      <line x1="28" y1="42" x2="72" y2="76" stroke="#111" strokeWidth="6" strokeLinecap="round" />
      <line x1="72" y1="42" x2="28" y2="76" stroke="#111" strokeWidth="6" strokeLinecap="round" />
    </RedTriangle>
  ),
  steepHillDownward: (
    // Triangle showing a downward gradient with percentage
    <RedTriangle>
      <line x1="22" y1="40" x2="78" y2="76" stroke="#111" strokeWidth="5" strokeLinecap="round" />
      <line x1="22" y1="76" x2="78" y2="76" stroke="#111" strokeWidth="3" />
      <text x="50" y="62" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111">10%</text>
    </RedTriangle>
  ),
  endOfRestrictions: (
    // White circle with diagonal black bars across (end of all restrictions)
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <circle cx="50" cy="50" r="46" fill="white" stroke="#111" strokeWidth="3" />
      <g stroke="#111" strokeWidth="4" strokeLinecap="round">
        <line x1="22" y1="78" x2="78" y2="22" />
        <line x1="28" y1="80" x2="80" y2="28" />
        <line x1="20" y1="72" x2="72" y2="20" />
      </g>
    </svg>
  ),
};

