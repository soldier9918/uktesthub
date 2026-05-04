import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";

/** Records a page_view event whenever the route pathname changes. */
export function PageViewTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (!pathname) return;
    // Don't track admin internals.
    if (pathname.startsWith("/admin-kb20")) return;
    void trackEvent({ event_type: "page_view", path: pathname });
  }, [pathname]);
  return null;
}
