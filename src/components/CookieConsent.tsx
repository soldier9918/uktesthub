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
  const [showModal, setShowModal] = useState(false);
  const [toggles, setToggles] = useState<Toggles>({
    analytics: false,
    advertising: false,
    functional: false,
  });

  // Initial mount — read consent client-side only.
  // The certified Google Funding Choices CMP (loaded from __root.tsx) is the
  // authoritative GDPR consent surface for UK/EEA visitors. This in-house
  // banner is intentionally NOT auto-shown anymore — it would race with the
  // Google CMP and cause the CMP to flash-then-disappear. The preferences
  // <Dialog> below is still reachable via the footer "Cookie Settings" link.
  useEffect(() => {
    setMounted(true);
    const c = getConsent();
    console.log(
      `Consent state on load: ${c === null ? "no decision" : JSON.stringify({ analytics: c.analytics, advertising: c.advertising, functional: c.functional })}`,
    );
    setHasConsent(c !== null);
    if (c) {
      setToggles({ analytics: c.analytics, advertising: c.advertising, functional: c.functional });
      setAnalyticsConsent(c.analytics === true);
    }
    // Do NOT call setAnalyticsConsent(false) when c === null — that would
    // log a misleading "rejected" message before the user has answered the
    // Google CMP. GA stays inert by default until consent is explicitly set.
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

  if (!mounted) return null;
  // Don't show on admin routes.
  if (pathname.startsWith("/admin-kb20")) return null;
  // Silence unused-var warning while preserving hasConsent for future use.
  void hasConsent;


  const handleAcceptAll = () => {
    acceptAll();
    setShowModal(false);
  };

  const handleRejectAll = () => {
    rejectNonEssential();
    setShowModal(false);
  };

  const handleSaveChoices = () => {
    setConsent(toggles);
    setShowModal(false);
  };

  return (
    <>

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
