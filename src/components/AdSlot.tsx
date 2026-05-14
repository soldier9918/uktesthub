import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAdSlot } from "@/lib/admin/ad-slots";
import { useAdminSettings } from "@/lib/admin/settings";
import { getConsent } from "@/lib/consent";

/**
 * AdSense central configuration.
 *
 * Single source of truth for enabling Google AdSense:
 *   VITE_ADSENSE_ENABLED   = "true"  (default: false)
 *   VITE_ADSENSE_CLIENT_ID = "ca-pub-XXXXXXXXXXXXXXXX"
 *
 * Admin-side kill switches (admin_settings table):
 *   hide_ads_globally     — force-hide every ad slot site-wide
 *   preview_without_ads   — temporarily disable ads in preview
 *
 * Behaviour guarantees (AdSense approval / UK GDPR / PECR):
 *   • If AdSense is not enabled → AdSlot returns null. No script loads,
 *     no empty boxes, no "Ad goes here" placeholders, no layout gaps.
 *   • If the user has not granted "advertising" consent → AdSlot returns
 *     null and no AdSense script or cookie is loaded.
 *   • Only when (enabled AND client ID AND slot ID AND advertising consent)
 *     is the adsbygoogle.js script injected and a real <ins> rendered.
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
  /** AdSense ad slot ID (data-ad-slot). Required for live ads if slotKey is not used. */
  slotId?: string;
  /** Look up enabled state and ad slot ID from the admin ad_slots table by key. */
  slotKey?: string;
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
  slotKey,
  format = "auto",
  responsive = true,
  lazy = true,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(!lazy);
  const [filled, setFilled] = useState(false);
  const settings = useAdminSettings();
  const slotRow = useAdSlot(slotKey ?? "");
  const effectiveSlotId = slotRow?.ad_slot_id || slotId;
  const slotEnabled = slotKey ? slotRow?.enabled === true : true;

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
    if (!ADSENSE_ENABLED || !visible || !effectiveSlotId) return;
    if (settings?.hide_ads_globally || settings?.preview_without_ads) return;
    if (slotKey && !slotEnabled) return;
    if (!getConsent()?.advertising) return;
    loadAdsenseScript();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore
    }
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
  }, [visible, effectiveSlotId, settings, slotKey, slotEnabled]);

  // Admin kill-switches
  if (settings?.hide_ads_globally) return null;
  if (settings?.preview_without_ads) return null;
  // Slot-level disable
  if (slotKey && !slotEnabled) return null;

  if (!ADSENSE_ENABLED) {
    return null;
  }

  if (!effectiveSlotId) return null;

  // Hard gate on advertising consent (UK GDPR / PECR).
  if (!getConsent()?.advertising) return null;

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
          data-ad-slot={effectiveSlotId}
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
  if (!getConsent()?.advertising) return null;

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

/**
 * Semantic ad placement wrappers. Each renders nothing until AdSense is
 * approved, configured (env vars), advertising consent has been granted,
 * AND the matching slot is enabled in the admin UI. Safe to drop into
 * pages today — they will stay invisible until everything lines up.
 *
 * Placement rules baked in:
 *   • Use `InContentAd` between content blocks on guides/articles only.
 *   • Use `SidebarAd` in desktop sidebars only (≥ lg).
 *   • Use `BottomAd` before the footer / FAQ / related-tests block.
 *   • Use `MobileAd` for in-content rectangles on mobile.
 * Never place these inside quiz answer lists, near Start/Submit/Next
 * buttons, or between a question and its options.
 */
type WrapProps = { slotKey?: string; slotId?: string; className?: string };

export function InContentAd(props: WrapProps) {
  return (
    <div className="my-8 flex justify-center">
      <AdSlot size="leaderboard" format="auto" {...props} />
    </div>
  );
}

export function SidebarAd(props: WrapProps) {
  return (
    <aside className="hidden lg:block">
      <AdSlot size="sidebar" format="vertical" {...props} />
    </aside>
  );
}

export function BottomAd(props: WrapProps) {
  return (
    <div className="my-10 flex justify-center">
      <AdSlot size="leaderboard" format="horizontal" {...props} />
    </div>
  );
}

export function MobileAd(props: WrapProps) {
  return (
    <div className="my-6 flex justify-center md:hidden">
      <AdSlot size="rectangle" format="rectangle" {...props} />
    </div>
  );
}
