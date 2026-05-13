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
  console.log("GA4 loaded: G-P2CME6M6GE");
}

function sendInitialPageView() {
  if (initialPageViewSent || typeof window === "undefined" || isAdminPath()) return;
  initialPageViewSent = true;
  window.gtag?.("event", "page_view", {
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
    page_title: typeof document !== "undefined" ? document.title : undefined,
  });
  console.log("GA4 initial page_view sent");
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
  window.gtag?.("event", event, params);
  if (event === "page_view") {
    const path = typeof params.page_path === "string" ? params.page_path : window.location.pathname;
    console.log(`GA4 route page_view sent: ${path}`);
  }
}
