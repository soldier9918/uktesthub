/** Google Analytics 4 loader. */

const GA_ID = "G-P2CME6M6GE";
let gaLoaded = false;
let initialised = false;
let initialPageViewSent = false;

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

function isAdminPath(pathname = typeof window !== "undefined" ? window.location.pathname : "") {
  return pathname.startsWith("/admin-kb20");
}

function loadGAScript() {
  if (gaLoaded || typeof window === "undefined") return;
  gaLoaded = true;
  disableGA(false);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  // Let gtag.js handle the initial page_view automatically — it includes
  // session_id and engagement params required for realtime activeUsers.
  window.gtag("config", GA_ID, { send_page_view: true });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  console.log("GA4 loaded: G-P2CME6M6GE");
}

function sendInitialPageView() {
  // gtag config above already sends the initial page_view with proper session
  // context. We just guard against duplicates from initGA being called twice.
  if (initialPageViewSent || typeof window === "undefined" || isAdminPath()) return;
  initialPageViewSent = true;
}

/** Initialise the consent listener exactly once on the client. */
export function initGA() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  if (isAdminPath()) return;
  loadGAScript();
  sendInitialPageView();
}

/** Send a GA event. */
export function trackGAEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (isAdminPath()) return;
  loadGAScript();
  const eventParams = event === "page_view" ? { send_to: GA_ID, ...params } : params;
  window.gtag?.("event", event, eventParams);
  if (event === "page_view") {
    const path = typeof params.page_path === "string" ? params.page_path : window.location.pathname;
    console.log(`GA4 route page_view sent: ${path}`);
  }
}
