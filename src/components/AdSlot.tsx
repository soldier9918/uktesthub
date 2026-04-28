import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  label?: string;
  size?: "leaderboard" | "rectangle" | "skyscraper" | "in-feed" | "sidebar" | "sticky-bottom";
  className?: string;
};

/**
 * AdSense-ready placeholder slot.
 * Replace inner markup with real <ins class="adsbygoogle"> when AdSense is approved.
 *
 * Reserved heights prevent layout shift (CLS) for Core Web Vitals.
 */
export function AdSlot({ label = "Advertisement", size = "leaderboard", className = "" }: Props) {
  const sizes: Record<string, string> = {
    leaderboard: "h-24 md:h-28",
    rectangle: "h-64",
    skyscraper: "h-[600px]",
    "in-feed": "h-32",
    sidebar: "h-[600px] w-full max-w-[300px]",
    "sticky-bottom": "h-20",
  };

  return (
    <aside
      aria-label={label}
      role="complementary"
      className={`flex w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground ${sizes[size]} ${className}`}
    >
      {label}
    </aside>
  );
}

/**
 * Dismissible sticky bottom ad rendered once per page from __root.tsx.
 * Hidden after dismissal for the session and always hidden on print.
 */
export function StickyAdSlot() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("uk-test-hub:sticky-ad-dismissed") === "1") {
        setDismissed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  if (dismissed) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur print:hidden"
      role="region"
      aria-label="Advertisement region"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 md:px-6">
        <AdSlot size="sticky-bottom" className="flex-1" />
        <button
          type="button"
          aria-label="Dismiss advertisement"
          onClick={() => {
            try {
              sessionStorage.setItem("uk-test-hub:sticky-ad-dismissed", "1");
            } catch {
              // ignore
            }
            setDismissed(true);
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
