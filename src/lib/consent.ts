/**
 * UK GDPR / PECR cookie consent store.
 *
 * Stored in localStorage under `uktesthub_cookie_consent`.
 * Optional categories default to OFF until explicitly accepted.
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

export function setConsent(partial: Partial<Omit<ConsentState, "version" | "acceptedAt">>) {
  if (typeof window === "undefined") return;
  const current = safeRead();
  const next: ConsentState = {
    analytics: false,
    advertising: false,
    functional: false,
    ...current,
    ...partial,
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

export function acceptAll() {
  setConsent({ analytics: true, advertising: true, functional: true });
}

export function rejectNonEssential() {
  setConsent({ analytics: false, advertising: false, functional: false });
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
