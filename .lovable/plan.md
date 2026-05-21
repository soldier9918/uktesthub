## Problem

In `src/components/QuizRunner.tsx`, single-click question types (MCQ, true/false, image, hotspot) auto-reveal the correct answer as soon as the user clicks. But multi-step types (fill-in-the-blanks, drag-and-drop, multiple-response, numeric entry) require the user to press a separate **Check answer** button. This is inconsistent — some mock tests show it, some don't.

## Change

Make every question type behave the same: as soon as the answer is "complete" (all blanks filled / required number of options chosen / numeric value entered), automatically reveal correctness and the explanation. No Check answer button anywhere.

## Implementation (single file)

`src/components/QuizRunner.tsx`:

1. **Auto-reveal effect** — add a `useEffect` in the main runner component that, in practice mode, watches the current question's answer and calls `reveal()` once `isAnswered(q, selected)` becomes `true` and it isn't already revealed. This covers fill-blanks, drag-drop, multi-response and numeric without needing per-handler changes.

2. **Remove the button** — delete the `needsExplicitCheck` block (lines ~316–321 and ~452–459) and the surrounding `<div className="flex gap-2">` wrapper that only existed for it.

3. **Copy update** — in `src/routes/category.english.tsx` (line 243) drop the "/ Check answer" mention so the help text matches the new behaviour ("In practice mode, the **Reveal** button…" → simply "answers are revealed as soon as you complete the question").

## Notes for numeric / fill-blanks

`isAnswered` for numeric requires a non-empty string; for fill-blanks it requires every blank to have a value. That means reveal only fires once the user is actually done, so they won't be interrupted mid-typing for partial inputs. No data files or mock JSON change — this is purely a UI fix that applies to every mock test automatically.