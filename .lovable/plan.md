## Problem

In `QuizRunner.tsx`, progress (current question index + answers) is saved to and restored from `quiz_progress` for any signed-in user, regardless of the selected mode. That means starting an exam picks up where the previous exam attempt left off — which defeats the point of exam mode (it should always be a fresh, timed run).

## Fix

Scope the resume + autosave behaviour to **practice mode only**.

In `src/components/QuizRunner.tsx`:

1. **Restore effect (lines ~190–215)** — add `mode !== "practice"` early return so exam mode never loads saved `current_index`/`answers`. Also gate on `mode` in the dependency array so it re-evaluates once the user picks a mode.

2. **Autosave effect (lines ~218–237)** — change the guard from `mode === null` to `mode !== "practice"`, so exam-mode progress is never written to `quiz_progress`.

3. **On entering exam mode** — when `mode` becomes `"exam"` and the user is signed in, delete any existing `quiz_progress` row for this `mock_slug` so a stale practice-mode row can't bleed into the exam UI either. (Small new effect, runs once per mode selection.)

4. Leave the existing completion-time delete (line 265) and the practice-mode behaviour untouched.

## Out of scope

- No DB schema changes.
- No changes to `quiz_attempts` logging — exam results should still be recorded on finish.
- Dashboard "Resume in progress" already only lists rows that exist in `quiz_progress`, so once exam rows stop being written it will naturally only show practice sessions.
