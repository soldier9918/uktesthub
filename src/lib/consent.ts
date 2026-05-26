/**
 * UK GDPR / PECR cookie consent store.
 *
 * Stored in localStorage under `uktesthub_cookie_consent`.
 * Optional categories default to OFF until explicitly accepted.
 *
 * IMPORTANT: `advertising: true` may ONLY be set via Google's AdSense
 * Privacy & Messaging (Funding Choices) CMP. The in-house fallback banner
 * must never grant advertising consent — calls to `setConsent` that try to
 * enable advertising without `source: "google-cmp"` are silently ignored.
 */

export const CONSENT_KEY = "uktesthub_cookie_consent";
export const CONSENT_VERSION = 1;

export type ConsentState = {
  acceptedAt: string;
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
  version: number;
};

type Listener = (c: ConsentState | null) => void;
const listeners = new Set<Listener>();

function safeRead(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (!parsed || parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getConsent(): ConsentState | null {
  return safeRead();
}

export function hasDecision(): boolean {
  return getConsent() !== null;
}

type SetConsentOptions = { source?: "google-cmp" | "fallback" | "user" };

export function setConsent(
  partial: Partial<Omit<ConsentState, "version" | "acceptedAt">>,
  options: SetConsentOptions = {},
) {
  if (typeof window === "undefined") return;
  const current = safeRead();
  // Guard: advertising:true may only be granted by Google CMP.
  const sanitized = { ...partial };
  if (sanitized.advertising === true && options.source !== "google-cmp") {
    sanitized.advertising = current?.advertising ?? false;
  }
  const next: ConsentState = {
    analytics: false,
    advertising: false,
    functional: false,
    ...current,
    ...sanitized,
    acceptedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l(next));
}

/**
 * Full "Accept all" — only safe to call when the user has been offered all
 * categories (including advertising) through an authorised flow. NOT for the
 * in-house fallback banner.
 */
export function acceptAll() {
  setConsent(
    { analytics: true, advertising: true, functional: true },
    { source: "google-cmp" },
  );
}

/**
 * Fallback "Accept all" — used by the in-house banner when Google CMP is
 * unavailable. Grants analytics + functional only; advertising stays off and
 * must be granted later via Google CMP.
 */
export function acceptAllFallback() {
  setConsent({ analytics: true, functional: true }, { source: "fallback" });
}

export function rejectNonEssential() {
  setConsent(
    { analytics: false, advertising: false, functional: false },
    { source: "user" },
  );
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    // ignore
  }
  listeners.forEach((l) => l(null));
}

export function subscribe(cb: Listener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export const OPEN_SETTINGS_EVENT = "uktesthub:open-cookie-settings";
