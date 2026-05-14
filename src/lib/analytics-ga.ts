/**
 * Google Analytics 4 loader — strict consent gating.
 *
 * Nothing here makes a network call until BOTH of the following are true:
 *   1. setAnalyticsConsent(true) has been called by CookieConsent, AND
 *   2. getConsent()?.analytics === true (re-checked at the network boundary)
 *
 * No cookieless / "consent mode" pings are sent. If consent is missing or
 * revoked, GA4 is fully disabled (window['ga-disable-...'] = true).
 */

import { getConsent } from "@/lib/consent";

const GA_ID = "G-P2CME6M6GE";
const GA_COLLECT_URL = "https://www.google-analytics.com/g/collect";
const CLIENT_ID_KEY = "uktesthub_ga_client_id";

let gaLoaded = false;
let initialPageViewSent = false;
let consentGranted = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

function isAdminPath(pathname = typeof window !== "undefined" ? window.location.pathname : "") {
  return pathname.startsWith("/admin-kb20");
}

/** Re-check the persisted consent record at every network boundary. */
function analyticsAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (!consentGranted) return false;
  return getConsent()?.analytics === true;
}

function disableGA(disable: boolean) {
  if (typeof window === "undefined") return;
  window[`ga-disable-${GA_ID}`] = disable;
}

/**
 * Called by CookieConsent whenever the user's analytics consent changes.
 * GA does nothing until this is true AND the persisted consent agrees.
 */
export function setAnalyticsConsent(granted: boolean) {
  consentGranted = granted;
  if (typeof window === "undefined") return;
  disableGA(!granted);
  if (granted) {
    console.log("Consent accepted: analytics enabled");
    if (!isAdminPath()) {
      loadGAScript();
      sendInitialPageView();
    }
  } else {
    console.log("Consent rejected: analytics disabled");
  }
}

function getClientId() {
  if (typeof window === "undefined") return "ssr";
  try {
    const existing = localStorage.getItem(CLIENT_ID_KEY);
    if (existing) return existing;
    const next = `${Date.now()}.${Math.floor(Math.random() * 1_000_000_000)}`;
    localStorage.setItem(CLIENT_ID_KEY, next);
    return next;
  } catch {
    return `${Date.now()}.${Math.floor(Math.random() * 1_000_000_000)}`;
  }
}

function sendCollectPageView(path: string, href: string, title?: string) {
  if (typeof window === "undefined") return;
  if (!analyticsAllowed()) {
    console.log("GA4 blocked because analytics consent is not granted");
    return;
  }
  const params = new URLSearchParams({
    v: "2",
    tid: GA_ID,
    cid: getClientId(),
    en: "page_view",
    dl: href,
    dp: path,
    dt: title ?? document.title,
    ul: navigator.language || "en-GB",
    sr: `${window.screen.width}x${window.screen.height}`,
    _p: String(Date.now()),
  });
  void fetch(`${GA_COLLECT_URL}?${params.toString()}`, { mode: "no-cors", keepalive: true });
}

function loadGAScript() {
  if (gaLoaded || typeof window === "undefined") return;
  if (!analyticsAllowed()) {
    console.log("GA4 blocked because analytics consent is not granted");
    return;
  }
  gaLoaded = true;
  disableGA(false);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  console.log("GA4 loaded: G-P2CME6M6GE");
}

function sendInitialPageView() {
  if (initialPageViewSent || typeof window === "undefined" || isAdminPath()) return;
  if (!analyticsAllowed()) {
    console.log("GA4 blocked because analytics consent is not granted");
    return;
  }
  initialPageViewSent = true;
  const path = window.location.pathname + window.location.search;
  const href = window.location.href;
  const title = typeof document !== "undefined" ? document.title : undefined;
  window.gtag?.("event", "page_view", {
    send_to: GA_ID,
    page_path: path,
    page_location: href,
    page_title: title,
  });
  sendCollectPageView(path, href, title);
  console.log(`GA4 page_view sent: ${path}`);
}

/**
 * Initialise GA — only takes effect if consent is already granted.
 * Safe to call multiple times.
 */
export function initGA() {
  if (typeof window === "undefined" || isAdminPath()) return;
  if (!analyticsAllowed()) {
    console.log("GA4 blocked because analytics consent is not granted");
    return;
  }
  loadGAScript();
  sendInitialPageView();
}

/** Send a GA event (route-change page_view, etc.). Strictly gated. */
export function trackGAEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || isAdminPath()) return;
  if (!analyticsAllowed()) {
    console.log("GA4 blocked because analytics consent is not granted");
    return;
  }
  loadGAScript();
  const eventParams = event === "page_view" ? { send_to: GA_ID, ...params } : params;
  window.gtag?.("event", event, eventParams);
  if (event === "page_view") {
    const path = typeof params.page_path === "string" ? params.page_path : window.location.pathname;
    const href = typeof params.page_location === "string" ? params.page_location : window.location.href;
    const title = typeof params.page_title === "string" ? params.page_title : document.title;
    sendCollectPageView(path, href, title);
    console.log(`GA4 page_view sent: ${path}`);
  }
}
