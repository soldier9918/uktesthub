// Union Jack flag — SVG, decorative.
type Props = { className?: string };

export function UnionJack({ className }: Props) {
  return (
    <svg
      viewBox="0 0 60 30"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Blue ground */}
      <rect width="60" height="30" fill="#012169" />

      {/* White diagonals (St Andrew's saltire) */}
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="white" strokeWidth="6" />

      {/* Red diagonals (St Patrick's saltire), offset, with clipping handled visually */}
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2.5" />

      {/* White cross (St George) background */}
      <path d="M30,0 v30 M0,15 h60" stroke="white" strokeWidth="10" />

      {/* Red cross (St George) */}
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}
