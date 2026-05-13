/**
 * Lazy Google Analytics 4 loader, gated by user consent.
 * No script is injected until analytics consent is granted.
 */
import { getConsent, subscribe } from "./consent";

const GA_ID = "G-P2CME6M6GE";
let gaLoaded = false;
let initialised = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

function disableGA(disable: boolean) {
  if (typeof window === "undefined") return;
  window[`ga-disable-${GA_ID}`] = disable;
}

function loadGAScript() {
  if (gaLoaded || typeof window === "undefined") return;
  gaLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
  if (import.meta.env.DEV) console.log("GA4 loaded: G-P2CME6M6GE");
}

let initialPageViewSent = false;
function sendInitialPageView() {
  if (initialPageViewSent || typeof window === "undefined") return;
  initialPageViewSent = true;
  window.gtag?.("event", "page_view", {
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
    page_title: typeof document !== "undefined" ? document.title : undefined,
  });
}

/** Initialise the consent listener exactly once on the client. */
export function initGA() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  const apply = () => {
    const c = getConsent();
    if (c?.analytics) {
      disableGA(false);
      loadGAScript();
    } else {
      disableGA(true);
    }
  };
  apply();
  subscribe(apply);
}

/** Send a GA event only if analytics consent is granted. */
export function trackGAEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const c = getConsent();
  if (!c?.analytics) return;
  loadGAScript();
  window.gtag?.("event", event, params);
}
