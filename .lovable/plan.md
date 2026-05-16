# Quiz: extra navigation button + sounds

## 1. "Back to all mock tests" button on results screen

In `src/components/QuizRunner.tsx` → `ResultsCtas` (lines 1166–1201), add a third button alongside **Retake test** and **Next mock test**.

- Label: **All mock tests**
- Style: same outline look as Retake (neutral, not coral) so the coral "Next mock test" stays the primary CTA
- Icon: `List` (lucide-react)
- Link: `<Link to="/topic/$slug" params={{ slug: fallbackTopic }}>` — same destination as the existing fallback "Browse all mock tests", just always shown
- Order: Retake · All mock tests · Next mock test
- On the topic page the user lands on the existing list of mocks (the page that already shows all 45 mocks for that topic).

## 2. Quiz sound effects

Create `src/lib/quiz-sounds.ts` — a tiny WebAudio helper that synthesises short tones in-browser (no audio files needed, instant, zero network):

- `click()` — soft 1 kHz blip, 40 ms
- `correct()` — two-note rising chime (E5 → A5), ~180 ms
- `wrong()` — low buzz (180 Hz square), ~200 ms
- `next()` — neutral tick (600 Hz), 60 ms
- `fanfare(passed: boolean)` — passed: 3-note arpeggio C5–E5–G5; failed: gentle two-note descent A4 → F4
- Reads a `uk-test-hub:sound-muted` flag from `localStorage` and no-ops when muted
- Lazy-creates the `AudioContext` on first user interaction (browser autoplay rules)

### Wiring in `QuizRunner.tsx`

Practice mode (called "mock test" by the user — gives per-question feedback):
- On answer select → `click()`
- On reveal (when `revealed[current]` flips true) → `correct()` if right, `wrong()` if wrong
- On results screen mount → `fanfare(passed)`

Exam mode:
- On answer select → `click()`
- On **Next/Finish** button click → `next()`
- On results screen mount → `fanfare(passed)`

### Mute toggle in the quiz header

Add a small speaker icon button next to the existing timer / progress chips in the quiz header (around lines 320–340 where the mode chip and timer live):
- Uses `Volume2` / `VolumeX` from lucide-react
- Toggles `localStorage["uk-test-hub:sound-muted"]`
- Hook: `useSoundMuted()` in `quiz-sounds.ts` returns `[muted, toggle]` with a `useSyncExternalStore` so the icon updates instantly
- Preference persists across sessions and across all quizzes

## Files touched

- `src/components/QuizRunner.tsx` — add third button, wire sound calls, add mute toggle in header
- `src/lib/quiz-sounds.ts` — new, ~80 lines

No new dependencies. No backend changes.
