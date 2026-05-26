import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  acceptAllFallback,
  getConsent,
  OPEN_SETTINGS_EVENT,
  rejectNonEssential,
  setConsent,
  subscribe,
  type ConsentState,
} from "@/lib/consent";
import { setAnalyticsConsent } from "@/lib/analytics-ga";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type Toggles = Pick<ConsentState, "analytics" | "functional">;

// Selectors that indicate Google's Funding Choices CMP has actually rendered
// its consent UI (as opposed to just the invisible `googlefcPresent` signal
// iframe we inject ourselves).
const CMP_RENDERED_SELECTORS = [
  'iframe[src*="fundingchoicesmessages.google.com"]',
  ".fc-consent-root",
  ".fc-dialog-container",
  ".fc-ab-dialog",
];

type TcfApi = (
  command: string,
  version: number,
  cb: (data: { cmpStatus?: string; eventStatus?: string } | null, success: boolean) => void,
) => void;

function isGoogleCmpRendered(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as { __tcfapi?: TcfApi };
  if (typeof w.__tcfapi === "function") return true;
  for (const sel of CMP_RENDERED_SELECTORS) {
    if (document.querySelector(sel)) return true;
  }
  return false;
}

function tryShowGoogleRevocation(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as {
    googlefc?: {
      callbackQueue?: Array<unknown>;
      showRevocationMessage?: () => void;
    };
  };
  const gfc = w.googlefc;
  if (!gfc) return false;
  try {
    if (typeof gfc.showRevocationMessage === "function") {
      gfc.showRevocationMessage();
      return true;
    }
    if (Array.isArray(gfc.callbackQueue)) {
      gfc.callbackQueue.push(() => {
        try {
          (window as unknown as { googlefc?: { showRevocationMessage?: () => void } })
            .googlefc?.showRevocationMessage?.();
        } catch {
          // ignore
        }
      });
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

export function CookieConsent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toggles, setToggles] = useState<Toggles>({
    analytics: false,
    functional: false,
  });

  useEffect(() => {
    setMounted(true);
    const c = getConsent();
    if (c) {
      setToggles({ analytics: c.analytics, functional: c.functional });
      setAnalyticsConsent(c.analytics === true);
      setShowBanner(false);
    }

    // Always keep the fallback hidden whenever Google CMP becomes available,
    // even after we may have shown it (preview domains, late CMP load, etc.).
    let cancelled = false;
    const hideIfCmpAppears = () => {
      if (cancelled) return;
      if (isGoogleCmpRendered()) {
        setShowBanner(false);
        return true;
      }
      return false;
    };

    // MutationObserver: hide our fallback the moment Google injects its UI.
    const observer = new MutationObserver(() => {
      hideIfCmpAppears();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Subscribe to __tcfapi once available — any TCF event means Google CMP
    // has taken over consent collection.
    let tcfPoll: number | undefined;
    const trySubscribeTcf = () => {
      const w = window as unknown as { __tcfapi?: TcfApi };
      if (typeof w.__tcfapi === "function") {
        try {
          w.__tcfapi!("addEventListener", 2, (data, success) => {
            if (!success || !data) return;
            const evt = data.eventStatus;
            if (
              data.cmpStatus === "loaded" ||
              evt === "tcloaded" ||
              evt === "useractioncomplete" ||
              evt === "cmpuishown"
            ) {
              setShowBanner(false);
            }
          });
        } catch {
          // ignore
        }
        return true;
      }
      return false;
    };
    if (!trySubscribeTcf()) {
      tcfPoll = window.setInterval(() => {
        if (trySubscribeTcf()) {
          if (tcfPoll) window.clearInterval(tcfPoll);
          tcfPoll = undefined;
        }
      }, 500);
    }

    // If we have no decision yet, give Google CMP up to 1.5s before showing
    // the in-house fallback banner.
    if (!c) {
      const start = Date.now();
      const tick = () => {
        if (cancelled) return;
        if (getConsent() !== null) return;
        if (hideIfCmpAppears()) return;
        if (Date.now() - start >= 1500) {
          // Only show fallback if Google CMP still hasn't appeared.
          if (!isGoogleCmpRendered()) setShowBanner(true);
          return;
        }
        window.setTimeout(tick, 200);
      };
      tick();
    }

    const unsub = subscribe((next) => {
      if (next) {
        setToggles({ analytics: next.analytics, functional: next.functional });
        setShowBanner(false);
      }
      setAnalyticsConsent(next?.analytics === true);
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      if (tcfPoll) window.clearInterval(tcfPoll);
      unsub();
    };
  }, []);

  useEffect(() => {
    const onOpen = () => {
      const c = getConsent();
      if (c) setToggles({ analytics: c.analytics, functional: c.functional });
      setShowModal(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  if (!mounted) return null;
  if (pathname.startsWith("/admin-kb20")) return null;

  const handleAcceptAll = () => {
    acceptAllFallback();
    setShowBanner(false);
    setShowModal(false);
  };

  const handleRejectAll = () => {
    rejectNonEssential();
    setShowBanner(false);
    setShowModal(false);
  };

  const handleSaveChoices = () => {
    setConsent(
      { analytics: toggles.analytics, functional: toggles.functional },
      { source: "fallback" },
    );
    setShowModal(false);
  };

  const openSettings = () => {
    const c = getConsent();
    if (c) setToggles({ analytics: c.analytics, functional: c.functional });
    setShowModal(true);
  };

  const handleManageAds = () => {
    if (!tryShowGoogleRevocation()) {
      // Google CMP unavailable — nothing else we can offer here. Leave the
      // modal open so the user can still adjust analytics/functional.
    }
  };

  return (
    <>
      {showBanner && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 px-4 py-4 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/80"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground">
              We use cookies to run UK Test Hub, measure usage, and manage your
              choices. Advertising cookies will be controlled through Google's
              consent system where required. You can accept all, reject
              non-essential, or manage your choices. See our{" "}
              <Link to="/privacy" className="underline underline-offset-2 hover:text-primary">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/cookies" className="underline underline-offset-2 hover:text-primary">
                Cookie Policy
              </Link>.
            </p>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <Button variant="outline" size="sm" onClick={openSettings}>
                Cookie settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleRejectAll}>
                Reject non-essential
              </Button>
              <Button size="sm" onClick={handleAcceptAll}>
                Accept all
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Choose which optional cookies UK Test Hub may use. You can change
              these at any time from "Cookie Settings" in the footer.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-4">
            <PrefRow
              title="Strictly necessary"
              body="Required for site security, login, admin protection and core functionality. Always on."
              checked
              disabled
              onChange={() => {}}
            />
            <PrefRow
              title="Analytics"
              body="Helps us understand how visitors use the site so we can improve it (Google Analytics)."
              checked={toggles.analytics}
              onChange={(v) => setToggles((t) => ({ ...t, analytics: v }))}
            />
            <PrefRow
              title="Functional"
              body="Remembers preferences such as theme, saved settings and progress features."
              checked={toggles.functional}
              onChange={(v) => setToggles((t) => ({ ...t, functional: v }))}
            />
            <div className="rounded-lg border border-border p-3">
              <p className="font-display text-sm font-semibold text-foreground">
                Advertising
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Advertising consent is managed by Google's consent system, not
                by this panel. If Google's consent banner is available on your
                device, you can re-open it below.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handleManageAds}
              >
                Manage advertising consent
              </Button>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleRejectAll}>Reject non-essential</Button>
            <Button variant="outline" onClick={handleSaveChoices}>Save choices</Button>
            <Button onClick={handleAcceptAll}>Accept all</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PrefRow({
  title,
  body,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
      <div className="flex-1">
        <p className="font-display text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{body}</p>
      </div>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </div>
  );
}
