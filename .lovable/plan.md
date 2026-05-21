## Bug

The auto-reveal `useEffect` I added sits **after** two early returns (`if (!mode) return …` and `if (finished) return …`) in `src/components/QuizRunner.tsx`. That violates the Rules of Hooks — on the first render the early return fires and the hook is skipped; once `mode` is set the hook runs, so React sees a different hook count and throws "Rendered more hooks than during the previous render".

## Fix

Move the auto-reveal `useEffect` block (currently lines 316–323) **above** the `if (!mode) return …` early return (i.e. up near the other `useEffect`s, around line 264). It must reference `quiz.questions[current]` and `answers[current]` directly instead of the `q` / `selected` locals that are computed after the early returns.

Concretely, place this just after the existing finish-effect:

```tsx
useEffect(() => {
  if (mode !== "practice") return;
  if (revealed[current]) return;
  const q = quiz.questions[current];
  const selected = answers[current];
  if (!isAnswered(q, selected)) return;
  const r = [...revealed];
  r[current] = true;
  setRevealed(r);
  if (isCorrect(q, selected ?? null)) sounds.correct();
  else sounds.wrong();
}, [mode, current, answers, revealed, quiz]);
```

Then delete the misplaced block at lines 316–323. No other changes needed.