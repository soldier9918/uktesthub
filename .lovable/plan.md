## Goal

Replace the current "correct answer" sound (a 2-note E5→A5 sine beep) with a **premium, satisfying success chime** — the kind of warm bell/glockenspiel "ding" used in polished apps (Duolingo, Apple Pay confirmation, iOS notification success).

## Approach

Keep it self-contained in `src/lib/quiz-sounds.ts` using the existing WebAudio setup — no external assets, no network, works offline, identical mute behaviour. Upgrade the `tone()` helper just enough to support a richer voice, then rewrite `sounds.correct()`.

### 1. Extend the synthesis helper

Add an optional second oscillator + a short attack/decay envelope so notes sound like a soft mallet/bell rather than a raw beep. New optional fields on the `opts` param:

- `type2?: OscillatorType` — second oscillator layered an octave up at lower gain (adds shimmer)
- `attack?: number` (default 0.005) and `release?: number` (default the duration) for a snappier, bell-like envelope using `setTargetAtTime` for natural exponential decay
- Keep existing call sites working (defaults preserve current behaviour for `click`, `next`, `wrong`, `fanfare`).

### 2. Rewrite `sounds.correct()`

Play a clean **major arpeggio** with bell-like timbre: C5 → E5 → G5 (a confident major triad rising), each note ~180 ms, 70 ms apart, layered sine + triangle one octave higher at ~30% gain for sparkle. Slightly longer release on the final note so it "rings out".

Approximate shape:

```
chime(523.25, delay 0.00, dur 0.35)  // C5
chime(659.25, delay 0.07, dur 0.35)  // E5
chime(783.99, delay 0.14, dur 0.55)  // G5, longer ring
```

Where `chime(freq, delay, dur)` uses sine + triangle one octave up, gain ~0.09 / 0.03, 5 ms attack, exponential release.

### 3. Leave everything else untouched

`wrong`, `click`, `next`, `fanfare`, the mute toggle, and `useSoundMuted` stay exactly as they are. No other files change.

## Why not ElevenLabs / mp3 assets

A synthesised chime is instant (no fetch, no decode), <1 KB of code, no API key, and matches the existing audio pipeline. ElevenLabs SFX would only be worth it if you wanted a long branded jingle — overkill for a per-question feedback sound.

If you'd prefer a real recorded chime instead, say the word and I'll swap in an `<audio>` element with a bundled mp3 instead.