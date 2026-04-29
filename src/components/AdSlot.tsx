import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * AdSense configuration.
 *
 * When AdSense is approved, set these via Vite env vars:
 *   VITE_ADSENSE_CLIENT_ID = "ca-pub-XXXXXXXXXXXXXXXX"
 *   VITE_ADSENSE_ENABLED   = "true"
 *
 * Until then, AdSlot renders nothing in production (collapses cleanly,
 * no empty grey boxes, no layout shift since slots are display:none).
 *
 * In dev mode, a subtle dashed outline is shown so layout placement
 * can be verified without polluting the live UI.
 */
const ADSENSE_CLIENT_ID =
  (import.meta as any).env?.VITE_ADSENSE_CLIENT_ID ?? "";
const ADSENSE_ENABLED =
  ((import.meta as any).env?.VITE_ADSENSE_ENABLED ?? "") === "true" &&
  Boolean(ADSENSE_CLIENT_ID);
const IS_DEV = (import.meta as any).env?.DEV === true;

type AdSize =
  | "leaderboard"
  | "rectangle"
  | "skyscraper"
  | "in-feed"
  | "sidebar"
  | "sticky-bottom";

type Props = {
  /** Optional accessible label */
  label?: string;
  /** Reserved size hint — used only when an ad is actually rendered */
  size?: AdSize;
  /** AdSense ad slot ID (data-ad-slot). Required for live ads. */
  slotId?: string;
  /** Display format: auto (responsive) by default */
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  /** Whether the ad is responsive */
  responsive?: boolean;
  /** Lazy load when scrolled near viewport */
  lazy?: boolean;
  className?: string;
};

const sizeStyles: Record<AdSize, string> = {
  leaderboard: "min-h-[90px] md:min-h-[110px]",
  rectangle: "min-h-[250px]",
  skyscraper: "min-h-[600px]",
  "in-feed": "min-h-[120px]",
  sidebar: "min-h-[600px] w-full max-w-[300px]",
  "sticky-bottom": "min-h-[60px]",
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

let adsenseScriptLoaded = false;
function loadAdsenseScript() {
  if (adsenseScriptLoaded || typeof window === "undefined") return;
  if (!ADSENSE_ENABLED) return;
  adsenseScriptLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
  document.head.appendChild(s);
}

/**
 * AdSlot — renders nothing when AdSense is not configured (production).
 * Renders a subtle dashed placeholder in development for layout review.
 * Renders a real <ins class="adsbygoogle"> when AdSense is enabled.
 */
export function AdSlot({
  label = "Advertisement",
  size = "leaderboard",
  slotId,
  format = "auto",
  responsive = true,
  lazy = true,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(!lazy);
  const [filled, setFilled] = useState(false);

  // Lazy-load via IntersectionObserver
  useEffect(() => {
    if (!lazy || visible) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [lazy, visible]);

  // Push to AdSense queue once visible
  useEffect(() => {
    if (!ADSENSE_ENABLED || !visible || !slotId) return;
    loadAdsenseScript();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore
    }
    // Detect fill — if AdSense fills the slot it sets data-ad-status
    const node = ref.current?.querySelector("ins.adsbygoogle") as
      | HTMLElement
      | null;
    if (!node) return;
    const check = () => {
      const status = node.getAttribute("data-ad-status");
      if (status === "filled") setFilled(true);
      else if (status === "unfilled") setFilled(false);
    };
    const mo = new MutationObserver(check);
    mo.observe(node, { attributes: true, attributeFilter: ["data-ad-status"] });
    const t = window.setTimeout(check, 1500);
    return () => {
      mo.disconnect();
      window.clearTimeout(t);
    };
  }, [visible, slotId]);

  // Production, no AdSense configured → render nothing (collapse cleanly)
  if (!ADSENSE_ENABLED) {
    if (!IS_DEV) return null;
    // Dev preview: subtle dashed outline so layout can be verified
    return (
      <div
        aria-hidden
        className={`flex w-full items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-3 text-[10px] uppercase tracking-widest text-muted-foreground/60 ${sizeStyles[size]} ${className}`}
      >
        ad slot · {size}
        {slotId ? ` · ${slotId}` : ""}
      </div>
    );
  }

  // Missing slotId in production → render nothing
  if (!slotId) return null;

  return (
    <div
      ref={ref}
      aria-label={label}
      role="complementary"
      className={`${filled ? sizeStyles[size] : ""} ${className}`}
      style={!filled ? { minHeight: 0 } : undefined}
    >
      {visible && (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      )}
    </div>
  );
}

/**
 * Dismissible sticky bottom ad. Renders nothing unless AdSense is
 * enabled AND a slot ID is provided. Also hidden after dismissal.
 */
export function StickyAdSlot({ slotId }: { slotId?: string } = {}) {
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
  if (!ADSENSE_ENABLED || !slotId) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur print:hidden"
      role="region"
      aria-label="Advertisement region"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 md:px-6">
        <AdSlot size="sticky-bottom" slotId={slotId} className="flex-1" />
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
