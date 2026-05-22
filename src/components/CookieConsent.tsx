import { useEffect, useState } from "react";
import { useRouterState, Link } from "@tanstack/react-router";
import {
  acceptAll,
  getConsent,
  OPEN_SETTINGS_EVENT,
  rejectNonEssential,
  setConsent,
  subscribe,
  type ConsentState,
} from "@/lib/consent";
import { setAnalyticsConsent } from "@/lib/analytics-ga";

/**
 * TODO (certified CMP swap): When integrating a Google-certified IAB TCF v2.2
 * CMP (e.g. Google Funding Choices), inject its loader script in
 * src/routes/__root.tsx and replace the local consent reads here with the
 * CMP's TCF API (__tcfapi). The banner UI below is the in-house fallback.
 */
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

type Toggles = Pick<ConsentState, "analytics" | "advertising" | "functional">;

export function CookieConsent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mounted, setMounted] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cmpPresent, setCmpPresent] = useState(false);
  const [toggles, setToggles] = useState<Toggles>({
    analytics: false,
    advertising: false,
    functional: false,
  });


  // Initial mount — read consent client-side only.
  useEffect(() => {
    setMounted(true);
    const c = getConsent();
    console.log(
      `Consent state on load: ${c === null ? "no decision" : JSON.stringify({ analytics: c.analytics, advertising: c.advertising, functional: c.functional })}`,
    );
    setHasConsent(c !== null);
    setShowBanner(c === null);
    if (c) setToggles({ analytics: c.analytics, advertising: c.advertising, functional: c.functional });
    setAnalyticsConsent(c?.analytics === true);
    const unsub = subscribe((next) => {
      setHasConsent(next !== null);
      if (next) {
        setToggles({ analytics: next.analytics, advertising: next.advertising, functional: next.functional });
      }
      setAnalyticsConsent(next?.analytics === true);
    });
    return unsub;
  }, []);

  // Listen for "open settings" requests from elsewhere (footer link).
  useEffect(() => {
    const onOpen = () => {
      const c = getConsent();
      if (c) setToggles({ analytics: c.analytics, advertising: c.advertising, functional: c.functional });
      setShowModal(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  // Detect a certified IAB TCF v2.2 CMP (Google Funding Choices). If
  // present, suppress our in-house banner — the CMP owns ad consent.
  useEffect(() => {
    const check = () => {
      const w = window as unknown as { __tcfapi?: unknown; googlefc?: unknown };
      if (w.__tcfapi || w.googlefc) setCmpPresent(true);
    };
    check();
    const id = window.setInterval(check, 500);
    const stop = window.setTimeout(() => window.clearInterval(id), 6000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, []);

  if (!mounted) return null;
  // Don't show on admin routes.
  if (pathname.startsWith("/admin-kb20")) return null;


  const handleAcceptAll = () => {
    acceptAll();
    setShowBanner(false);
    setShowModal(false);
  };

  const handleRejectAll = () => {
    rejectNonEssential();
    setShowBanner(false);
    setShowModal(false);
  };

  const handleSaveChoices = () => {
    setConsent(toggles);
    setShowBanner(false);
    setShowModal(false);
  };

  return (
    <>
      {showBanner && !hasConsent && !cmpPresent && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 shadow-elevated backdrop-blur supports-[backdrop-filter]:bg-card/85"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:px-6">
            <p className="flex-1 text-sm leading-relaxed text-foreground">
              We use cookies to improve your experience, understand how the site is used,
              and support future advertising. You can accept all cookies, reject non-essential
              cookies, or manage your choices. See our{" "}
              <Link to="/cookies" className="font-semibold text-coral underline-offset-2 hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-2 md:flex-nowrap">
              <Button variant="outline" size="sm" onClick={() => setShowModal(true)} className="flex-1 md:flex-none">
                Manage choices
              </Button>
              <Button variant="outline" size="sm" onClick={handleRejectAll} className="flex-1 md:flex-none">
                Reject non-essential
              </Button>
              <Button size="sm" onClick={handleAcceptAll} className="flex-1 md:flex-none">
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
              Choose which optional cookies UK Test Hub may use. You can change these
              at any time from "Cookie Settings" in the footer.
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
              title="Advertising"
              body="Reserved for future Google AdSense and ad personalisation. Currently no ads are loaded."
              checked={toggles.advertising}
              onChange={(v) => setToggles((t) => ({ ...t, advertising: v }))}
            />
            <PrefRow
              title="Functional"
              body="Remembers preferences such as theme, saved settings and progress features."
              checked={toggles.functional}
              onChange={(v) => setToggles((t) => ({ ...t, functional: v }))}
            />
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
