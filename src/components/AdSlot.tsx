type Props = {
  label?: string;
  size?: "leaderboard" | "rectangle" | "skyscraper" | "in-feed";
  className?: string;
};

/**
 * AdSense-ready placeholder slot.
 * Replace inner markup with real <ins class="adsbygoogle"> when AdSense is approved.
 */
export function AdSlot({ label = "Advertisement", size = "leaderboard", className = "" }: Props) {
  const sizes: Record<string, string> = {
    leaderboard: "h-24 md:h-28",
    rectangle: "h-64",
    skyscraper: "h-[600px]",
    "in-feed": "h-32",
  };

  return (
    <aside
      aria-label={label}
      className={`flex w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground ${sizes[size]} ${className}`}
    >
      {label}
    </aside>
  );
}
