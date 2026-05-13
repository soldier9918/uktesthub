/** Google Analytics 4 loader. */

const GA_ID = "G-P2CME6M6GE";
const GA_COLLECT_URL = "https://www.google-analytics.com/g/collect";
const CLIENT_ID_KEY = "uktesthub_ga_client_id";
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
  const url = `${GA_COLLECT_URL}?${params.toString()}`;
  void fetch(url, { mode: "no-cors", keepalive: true });
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
  window.gtag("config", GA_ID, { send_page_view: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  console.log("GA4 loaded: G-P2CME6M6GE");
}

function sendInitialPageView() {
  if (initialPageViewSent || typeof window === "undefined" || isAdminPath()) return;
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
  const eventParams = event === "page_view" ? { send_to: GA_ID, ...params } : params;
  window.gtag?.("event", event, eventParams);
  if (event === "page_view") {
    const path = typeof params.page_path === "string" ? params.page_path : window.location.pathname;
    const href = typeof params.page_location === "string" ? params.page_location : window.location.href;
    const title = typeof params.page_title === "string" ? params.page_title : document.title;
    sendCollectPageView(path, href, title);
    console.log(`GA4 route page_view sent: ${path}`);
  }
}
