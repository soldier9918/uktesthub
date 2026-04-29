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
    // Triangle showing a downward gradient — slope on right, "10%" on left
    <RedTriangle>
      <line x1="20" y1="42" x2="80" y2="78" stroke="#111" strokeWidth="5" strokeLinecap="round" />
      <text x="34" y="74" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111">10%</text>
    </RedTriangle>
  ),
  endOfRestrictions: (
    // White circle with several diagonal black bars (end of all restrictions)
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <circle cx="50" cy="50" r="46" fill="white" stroke="#111" strokeWidth="3" />
      <g stroke="#111" strokeWidth="3" strokeLinecap="round">
        <line x1="18" y1="82" x2="82" y2="18" />
        <line x1="26" y1="82" x2="82" y2="26" />
        <line x1="34" y1="82" x2="82" y2="34" />
        <line x1="18" y1="74" x2="74" y2="18" />
        <line x1="18" y1="66" x2="66" y2="18" />
      </g>
    </svg>
  ),

  // -------- ADDITIONAL ORDERS / PROHIBITIONS --------
  speed50: (
    <RedCircle>
      <text x="50" y="64" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="38" fontWeight="900" fill="#111">50</text>
    </RedCircle>
  ),
  speed60: (
    <RedCircle>
      <text x="50" y="64" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="38" fontWeight="900" fill="#111">60</text>
    </RedCircle>
  ),
  speed70: (
    <RedCircle>
      <text x="50" y="64" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="38" fontWeight="900" fill="#111">70</text>
    </RedCircle>
  ),
  minSpeed30: (
    // Blue circle with white "30" — minimum speed limit
    <BlueCircle>
      <text x="50" y="64" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="36" fontWeight="900" fill="white">30</text>
    </BlueCircle>
  ),
  endMinSpeed: (
    // Blue circle with white "30" and red diagonal bar — end of minimum speed
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <circle cx="50" cy="50" r="46" fill="#0033a0" />
      <text x="50" y="64" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="36" fontWeight="900" fill="white">30</text>
      <line x1="20" y1="80" x2="80" y2="20" stroke="#c8102e" strokeWidth="6" strokeLinecap="round" />
    </svg>
  ),
  noVehicles: (
    // Red circle, blank white centre
    <RedCircle />
  ),
  noMotorVehicles: (
    // Red circle with car and motorcycle silhouettes
    <RedCircle>
      <g fill="#111">
        <rect x="20" y="50" width="34" height="14" rx="3" />
        <path d="M24 50 L30 40 L48 40 L54 50 Z" />
        <circle cx="28" cy="66" r="3.5" />
        <circle cx="48" cy="66" r="3.5" />
        {/* small motorbike silhouette */}
        <circle cx="64" cy="64" r="6" fill="none" stroke="#111" strokeWidth="2.5" />
        <circle cx="78" cy="64" r="6" fill="none" stroke="#111" strokeWidth="2.5" />
        <path d="M64 64 L72 50 L78 64" fill="none" stroke="#111" strokeWidth="2.5" />
      </g>
    </RedCircle>
  ),
  noGoodsOver: (
    // Red circle with HGV silhouette and "7.5T"
    <RedCircle>
      <g fill="#111">
        <rect x="18" y="42" width="44" height="22" />
        <rect x="62" y="50" width="18" height="14" />
        <circle cx="28" cy="68" r="4" />
        <circle cx="50" cy="68" r="4" />
        <circle cx="72" cy="68" r="4" />
      </g>
      <text x="50" y="36" textAnchor="middle" fontSize="11" fontWeight="900" fill="#111">7.5T</text>
    </RedCircle>
  ),
  noPedestrians: (
    <RedCircle>
      <g fill="#111">
        <circle cx="50" cy="32" r="5" />
        <path d="M50 38 L44 56 L40 70 L44 70 L48 58 L52 58 L52 70 L56 70 L56 56 Z" />
      </g>
      <line x1="20" y1="80" x2="80" y2="20" stroke="#c8102e" strokeWidth="7" strokeLinecap="round" />
    </RedCircle>
  ),
  noCycling: (
    <RedCircle>
      <g fill="none" stroke="#111" strokeWidth="3">
        <circle cx="32" cy="62" r="10" />
        <circle cx="68" cy="62" r="10" />
        <path d="M32 62 L48 42 L60 42 L68 62" />
        <path d="M50 42 L42 30 L52 30" />
      </g>
      <line x1="20" y1="80" x2="80" y2="20" stroke="#c8102e" strokeWidth="7" strokeLinecap="round" />
    </RedCircle>
  ),
  noLeftTurn: (
    <RedCircle>
      <path d="M62 70 L62 50 L40 50 L40 38 L22 56 L40 74 L40 62 L52 62 L52 70 Z" fill="#111" />
      <line x1="20" y1="80" x2="80" y2="20" stroke="#c8102e" strokeWidth="6" strokeLinecap="round" />
    </RedCircle>
  ),
  noRightTurn: (
    <RedCircle>
      <path d="M38 70 L38 50 L60 50 L60 38 L78 56 L60 74 L60 62 L48 62 L48 70 Z" fill="#111" />
      <line x1="20" y1="80" x2="80" y2="20" stroke="#c8102e" strokeWidth="6" strokeLinecap="round" />
    </RedCircle>
  ),
  noWaiting: (
    // Blue circle with red ring and red diagonal — no waiting (single bar)
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <circle cx="50" cy="50" r="46" fill="#0033a0" stroke="#c8102e" strokeWidth="9" />
      <line x1="22" y1="78" x2="78" y2="22" stroke="#c8102e" strokeWidth="8" strokeLinecap="round" />
    </svg>
  ),
  noStopping: (
    // Clearway — blue disc with red ring and red cross
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <circle cx="50" cy="50" r="46" fill="#0033a0" stroke="#c8102e" strokeWidth="9" />
      <line x1="22" y1="22" x2="78" y2="78" stroke="#c8102e" strokeWidth="8" strokeLinecap="round" />
      <line x1="78" y1="22" x2="22" y2="78" stroke="#c8102e" strokeWidth="8" strokeLinecap="round" />
    </svg>
  ),
  weightLimit: (
    // Red circle with "7.5T" — weight limit
    <RedCircle>
      <text x="50" y="60" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900" fill="#111">7.5T</text>
    </RedCircle>
  ),
  heightLimit: (
    // Red circle with two arrows pointing in and "14&apos;6"
    <RedCircle>
      <g stroke="#111" strokeWidth="3" fill="#111">
        <polygon points="30,28 38,38 22,38" />
        <polygon points="30,72 22,62 38,62" />
        <line x1="30" y1="38" x2="30" y2="62" />
      </g>
      <text x="58" y="58" textAnchor="middle" fontSize="16" fontWeight="900" fill="#111">14'6</text>
    </RedCircle>
  ),
  widthLimit: (
    <RedCircle>
      <g stroke="#111" strokeWidth="3" fill="#111">
        <polygon points="22,32 32,40 32,24" />
        <polygon points="78,32 68,40 68,24" />
        <line x1="32" y1="32" x2="68" y2="32" />
      </g>
      <text x="50" y="68" textAnchor="middle" fontSize="16" fontWeight="900" fill="#111">6'6</text>
    </RedCircle>
  ),

  // -------- ADDITIONAL POSITIVE INSTRUCTIONS (blue) --------
  turnRight: (
    <BlueCircle>
      <path d="M45 78 L45 50 L64 50 L64 38 L80 54 L64 70 L64 58 L53 58 L53 78 Z" fill="white" />
    </BlueCircle>
  ),
  keepRight: (
    <BlueCircle>
      <path d="M42 30 L42 42 L22 42 L22 58 L42 58 L42 70 L78 50 Z" fill="white" />
    </BlueCircle>
  ),
  passEitherSide: (
    // Two arrows pointing down-left and down-right
    <BlueCircle>
      <g fill="white">
        <polygon points="30,30 50,30 50,55 60,55 40,75 20,55 30,55" />
        <polygon points="50,30 70,30 70,55 80,55 60,75 40,55 50,55" opacity="0" />
        <polygon points="50,30 70,30 70,55 80,55 60,75 40,55 50,55" />
      </g>
    </BlueCircle>
  ),
  aheadLeft: (
    // Ahead OR turn left
    <BlueCircle>
      <g fill="white">
        <path d="M44 78 L44 50 L34 50 L50 26 L66 50 L56 50 L56 78 Z" />
      </g>
    </BlueCircle>
  ),
  busLane: (
    // Blue rectangle with white "BUS LANE"
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="6" y="20" width="88" height="60" fill="#0033a0" />
      <text x="50" y="48" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="14" fontWeight="900" fill="white">BUS</text>
      <text x="50" y="66" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="14" fontWeight="900" fill="white">LANE</text>
    </svg>
  ),
  cycleRoute: (
    <BlueCircle>
      <g fill="none" stroke="white" strokeWidth="3">
        <circle cx="32" cy="62" r="10" />
        <circle cx="68" cy="62" r="10" />
        <path d="M32 62 L48 42 L60 42 L68 62" />
        <path d="M50 42 L42 30 L52 30" />
      </g>
    </BlueCircle>
  ),
  pedestriansOnly: (
    <BlueCircle>
      <g fill="white">
        <circle cx="42" cy="30" r="5" />
        <path d="M42 36 L36 54 L33 70 L37 70 L41 58 L43 58 L43 70 L47 70 L47 54 Z" />
        <circle cx="62" cy="36" r="4" />
        <path d="M62 41 L57 56 L55 70 L58 70 L61 60 L63 60 L63 70 L66 70 L66 56 Z" />
      </g>
    </BlueCircle>
  ),

  // -------- ADDITIONAL WARNINGS (red triangles) --------
  tJunction: (
    <RedTriangle>
      <rect x="22" y="48" width="56" height="10" fill="#111" />
      <rect x="45" y="58" width="10" height="22" fill="#111" />
    </RedTriangle>
  ),
  staggeredJunction: (
    <RedTriangle>
      <rect x="44" y="32" width="10" height="48" fill="#111" />
      <rect x="44" y="46" width="30" height="8" fill="#111" />
      <rect x="24" y="58" width="20" height="8" fill="#111" />
    </RedTriangle>
  ),
  bendRight: (
    <RedTriangle>
      <path d="M50 78 L50 56 Q50 38 64 38 L72 38" fill="none" stroke="#111" strokeWidth="6" strokeLinecap="round" />
      <polygon points="68,32 78,38 68,44" fill="#111" />
    </RedTriangle>
  ),
  bendLeft: (
    <RedTriangle>
      <path d="M50 78 L50 56 Q50 38 36 38 L28 38" fill="none" stroke="#111" strokeWidth="6" strokeLinecap="round" />
      <polygon points="32,32 22,38 32,44" fill="#111" />
    </RedTriangle>
  ),
  doubleBend: (
    <RedTriangle>
      <path d="M50 78 Q50 64 38 56 Q26 48 38 38 L46 32" fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round" />
      <polygon points="42,28 50,32 42,38" fill="#111" />
    </RedTriangle>
  ),
  roadNarrows: (
    // Road narrows on both sides
    <RedTriangle>
      <path d="M28 78 L42 38 L58 38 L72 78" fill="none" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
    </RedTriangle>
  ),
  roadNarrowsRight: (
    <RedTriangle>
      <line x1="40" y1="78" x2="40" y2="36" stroke="#111" strokeWidth="5" />
      <path d="M62 78 L52 36" stroke="#111" strokeWidth="5" strokeLinecap="round" />
    </RedTriangle>
  ),
  uneven: (
    // Bumpy road symbol — two small humps
    <RedTriangle>
      <path d="M22 70 Q34 50 46 70 Q58 50 70 70" fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round" />
    </RedTriangle>
  ),
  hump: (
    // Hump bridge — single arch
    <RedTriangle>
      <path d="M22 72 Q50 32 78 72" fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round" />
    </RedTriangle>
  ),
  steepHillUp: (
    <RedTriangle>
      <line x1="20" y1="78" x2="80" y2="42" stroke="#111" strokeWidth="5" strokeLinecap="round" />
      <text x="64" y="74" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111">10%</text>
    </RedTriangle>
  ),
  fallingRocks: (
    <RedTriangle>
      <line x1="26" y1="34" x2="64" y2="78" stroke="#111" strokeWidth="3" />
      <circle cx="40" cy="58" r="4" fill="#111" />
      <circle cx="52" cy="68" r="5" fill="#111" />
      <circle cx="62" cy="50" r="3" fill="#111" />
      <circle cx="46" cy="46" r="3" fill="#111" />
    </RedTriangle>
  ),
  wildAnimals: (
    // Deer silhouette
    <RedTriangle>
      <g fill="#111">
        <path d="M30 70 L34 56 L38 56 L40 64 L52 64 L54 56 L62 56 L64 50 L70 46 L66 50 L68 56 L66 70 L62 70 L60 60 L46 60 L44 70 L40 70 L38 64 L34 70 Z" />
        <path d="M62 50 L60 42 L66 44 M68 50 L70 40 L74 44" stroke="#111" strokeWidth="2" fill="none" />
      </g>
    </RedTriangle>
  ),
  cattle: (
    <RedTriangle>
      <g fill="#111">
        <ellipse cx="50" cy="60" rx="22" ry="10" />
        <rect x="32" y="60" width="4" height="14" />
        <rect x="44" y="60" width="4" height="14" />
        <rect x="56" y="60" width="4" height="14" />
        <rect x="64" y="60" width="4" height="14" />
        <ellipse cx="74" cy="56" rx="6" ry="5" />
      </g>
    </RedTriangle>
  ),
  cyclistsAhead: (
    <RedTriangle>
      <g fill="none" stroke="#111" strokeWidth="3">
        <circle cx="34" cy="64" r="8" />
        <circle cx="60" cy="64" r="8" />
        <path d="M34 64 L46 50 L56 50 L60 64" />
        <path d="M48 50 L42 40 L50 40" />
      </g>
      <circle cx="56" cy="42" r="3" fill="#111" />
    </RedTriangle>
  ),
  trafficSignals: (
    // Traffic lights
    <RedTriangle>
      <rect x="42" y="30" width="16" height="44" rx="2" fill="#111" />
      <circle cx="50" cy="38" r="4" fill="#c8102e" />
      <circle cx="50" cy="50" r="4" fill="#f5a623" />
      <circle cx="50" cy="62" r="4" fill="#2ecc71" />
    </RedTriangle>
  ),
  levelCrossingGate: (
    // Gate symbol — fence-like
    <RedTriangle>
      <g fill="#111">
        <rect x="26" y="60" width="48" height="6" />
        <rect x="28" y="44" width="4" height="22" />
        <rect x="68" y="44" width="4" height="22" />
        <rect x="32" y="50" width="36" height="4" />
      </g>
    </RedTriangle>
  ),
  tramsCrossing: (
    <RedTriangle>
      <g fill="#111">
        <rect x="36" y="32" width="28" height="34" rx="3" />
        <rect x="38" y="36" width="10" height="10" fill="white" />
        <rect x="52" y="36" width="10" height="10" fill="white" />
        <circle cx="42" cy="68" r="3" />
        <circle cx="58" cy="68" r="3" />
        <line x1="32" y1="78" x2="68" y2="78" stroke="#111" strokeWidth="3" />
      </g>
    </RedTriangle>
  ),
  lowFlyingAircraft: (
    <RedTriangle>
      <g fill="#111">
        <path d="M50 32 L54 56 L78 60 L54 64 L52 78 L48 78 L46 64 L22 60 L46 56 Z" />
      </g>
    </RedTriangle>
  ),
  sideWinds: (
    // Windsock
    <RedTriangle>
      <g fill="#111">
        <rect x="26" y="36" width="3" height="42" />
        <path d="M30 40 L70 50 L66 56 L60 56 L56 60 L48 60 L44 56 L38 56 L34 52 Z" />
      </g>
    </RedTriangle>
  ),
  fordDip: (
    // Wavy water lines
    <RedTriangle>
      <text x="50" y="50" textAnchor="middle" fontSize="11" fontWeight="700" fill="#111">Ford</text>
      <path d="M22 64 Q34 58 46 64 Q58 70 70 64 Q76 60 78 64" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 74 Q34 68 46 74 Q58 80 70 74" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
    </RedTriangle>
  ),
  queuesLikely: (
    // Three cars stacked
    <RedTriangle>
      <g fill="#111">
        <rect x="40" y="34" width="20" height="10" rx="2" />
        <rect x="40" y="50" width="20" height="10" rx="2" />
        <rect x="40" y="66" width="20" height="10" rx="2" />
      </g>
    </RedTriangle>
  ),
  oppositesPriority: (
    // Two arrows: thick black up, thin red down (priority over oncoming)
    <RedTriangle>
      <g>
        <polygon points="42,32 50,24 58,32 54,32 54,76 46,76 46,32" fill="#111" />
        <polygon points="62,68 70,76 78,68 74,68 74,38 66,38 66,68" fill="#c8102e" />
      </g>
    </RedTriangle>
  ),

  // -------- INFORMATION / DIRECTION (rectangles) --------
  motorwayBegins: (
    // Blue rectangle with white motorway symbol
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="6" y="20" width="88" height="60" fill="#0033a0" />
      <g fill="white" stroke="white" strokeWidth="2">
        <path d="M30 36 L40 60 L50 36 L50 70 M50 36 L60 60 L70 36 L70 70" fill="none" strokeWidth="4" />
      </g>
    </svg>
  ),
  endOfMotorway: (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="6" y="20" width="88" height="60" fill="#0033a0" />
      <g stroke="white" strokeWidth="4" fill="none">
        <path d="M30 36 L40 60 L50 36 L50 70 M50 36 L60 60 L70 36 L70 70" />
      </g>
      <line x1="14" y1="74" x2="86" y2="26" stroke="#c8102e" strokeWidth="5" />
    </svg>
  ),
  primaryRoute: (
    // Green rectangle with "A40" style
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="4" y="26" width="92" height="48" fill="#006633" />
      <text x="50" y="60" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900" fill="white">A40</text>
    </svg>
  ),
  nonPrimaryRoute: (
    // White rectangle, black border, "B4009"
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="4" y="26" width="92" height="48" fill="white" stroke="#111" strokeWidth="3" />
      <text x="50" y="60" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="20" fontWeight="900" fill="#111">B4009</text>
    </svg>
  ),
  touristSign: (
    // Brown rectangle with castle symbol
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="4" y="26" width="92" height="48" fill="#6b3a2a" />
      <g fill="white">
        <rect x="30" y="42" width="40" height="22" />
        <rect x="30" y="36" width="6" height="6" />
        <rect x="42" y="36" width="6" height="6" />
        <rect x="54" y="36" width="6" height="6" />
        <rect x="66" y="36" width="6" height="6" />
        <rect x="46" y="48" width="8" height="16" fill="#6b3a2a" />
      </g>
    </svg>
  ),
  ringRoad: (
    // Black rectangle with white ring symbol
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="4" y="26" width="92" height="48" fill="#111" />
      <text x="35" y="60" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">Ring</text>
      <circle cx="68" cy="50" r="11" fill="none" stroke="white" strokeWidth="3" />
    </svg>
  ),
  hospital: (
    // Blue rect with white H
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="4" y="26" width="92" height="48" fill="#0033a0" />
      <text x="50" y="64" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="32" fontWeight="900" fill="white">H</text>
    </svg>
  ),
  parking: (
    // Blue rect with white P
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="4" y="26" width="92" height="48" fill="#0033a0" />
      <text x="50" y="64" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="32" fontWeight="900" fill="white">P</text>
    </svg>
  ),
  cameraEnforcement: (
    // White rect with black camera
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="4" y="26" width="92" height="48" fill="white" stroke="#111" strokeWidth="3" />
      <g fill="#111">
        <rect x="26" y="40" width="38" height="22" rx="2" />
        <rect x="60" y="44" width="14" height="14" />
        <circle cx="40" cy="51" r="5" fill="white" />
      </g>
    </svg>
  ),
  diversion: (
    // Yellow square with black arrow — temporary diversion
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="6" y="6" width="88" height="88" fill="#f5d04a" stroke="#111" strokeWidth="2" />
      <path d="M22 60 L60 60 L60 46 L80 64 L60 82 L60 70 L22 70 Z" fill="#111" />
    </svg>
  ),

  // -------- ROAD WORKS (red triangle) --------
  roadWorksAhead: (
    <RedTriangle>
      <g fill="#111">
        <circle cx="50" cy="34" r="4.5" />
        <path d="M50 39 L44 56 L48 56 L48 70 L52 70 L52 56 L56 56 Z" />
        <line x1="40" y1="44" x2="68" y2="64" stroke="#111" strokeWidth="3" />
        <polygon points="64,60 74,64 68,72" />
      </g>
    </RedTriangle>
  ),
  loosCh: (
    // Loose chippings warning — falling stones
    <RedTriangle>
      <g fill="#111">
        <rect x="32" y="56" width="36" height="14" rx="2" />
        <circle cx="38" cy="48" r="3" />
        <circle cx="50" cy="44" r="3" />
        <circle cx="62" cy="50" r="3" />
        <circle cx="44" cy="40" r="2" />
        <circle cx="58" cy="38" r="2" />
      </g>
    </RedTriangle>
  ),
};

