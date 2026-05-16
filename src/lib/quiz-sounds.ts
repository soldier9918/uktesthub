import { useSyncExternalStore } from "react";

const STORAGE_KEY = "uk-test-hub:sound-muted";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  } catch {
    return null;
  }
  return ctx;
}

function isMutedNow(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function tone(
  freq: number,
  duration: number,
  opts: { type?: OscillatorType; gain?: number; delay?: number } = {},
) {
  if (isMutedNow()) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  const start = c.currentTime + (opts.delay ?? 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(freq, start);
  const peak = opts.gain ?? 0.08;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(peak, start + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(g).connect(c.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export const sounds = {
  click() {
    tone(1000, 0.05, { type: "sine", gain: 0.05 });
  },
  next() {
    tone(600, 0.07, { type: "triangle", gain: 0.06 });
  },
  correct() {
    tone(659.25, 0.12, { type: "sine", gain: 0.08 }); // E5
    tone(880, 0.18, { type: "sine", gain: 0.09, delay: 0.1 }); // A5
  },
  wrong() {
    tone(180, 0.22, { type: "square", gain: 0.05 });
  },
  fanfare(passed: boolean) {
    if (passed) {
      tone(523.25, 0.14, { type: "triangle", gain: 0.08 }); // C5
      tone(659.25, 0.14, { type: "triangle", gain: 0.08, delay: 0.13 }); // E5
      tone(783.99, 0.28, { type: "triangle", gain: 0.09, delay: 0.26 }); // G5
    } else {
      tone(440, 0.18, { type: "sine", gain: 0.07 }); // A4
      tone(349.23, 0.28, { type: "sine", gain: 0.07, delay: 0.16 }); // F4
    }
  },
};

// ---- React hook for the mute toggle ----

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): boolean {
  return isMutedNow();
}

function getServerSnapshot(): boolean {
  return false;
}

export function useSoundMuted(): [boolean, () => void] {
  const muted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = () => {
    try {
      const next = !isMutedNow();
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      listeners.forEach((l) => l());
    } catch {
      /* ignore */
    }
  };
  return [muted, toggle];
}
