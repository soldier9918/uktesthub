## Goal

Redesign the exam-mode results "Review your answers" section in `src/components/QuizRunner.tsx` so each reviewed question shows the **full question text + all original options as cards** (green = correct, red = wrong selected, neutral = others), plus a clear status message and a styled Explanation box. Scoring, pass/fail and exam flow stay untouched — this is presentation-only.

## Scope

Only the `Results` component's review list (around lines 1114–1148 of `src/components/QuizRunner.tsx`). Everything else (timer, scoring, `isCorrect`, practice mode inline feedback, CTAs) is left alone.

## What changes

1. **Replace the current `<li>` row** (which only shows "Correct: …" / "Your answer: …") with a richer `ReviewCard` that renders, per question:
   - Header: `Question {i+1}` + correct/incorrect/unanswered badge with tick/cross icon.
   - Full question text via existing `describeQuestion(q)`.
   - All original options rendered as rounded option cards (matching quiz styling: rounded-2xl, border, A/B/C/D letter chip).
   - Status message under the options.
   - Explanation box: light `bg-muted/40` rounded panel labeled **Explanation**.

2. **Option coloring rules** (applied per question type):
   - Correct option(s): `border-success bg-success/10` + green `CheckCircle2` icon on the right.
   - User's wrong selected option(s): `border-destructive bg-destructive/10` + red `XCircle` + small "Your answer" label.
   - User's correct selection: green styling + "Your answer" label.
   - Everything else: neutral `border-border bg-card`.

3. **Status message** under options:
   - Correct (single or full multi): "✅ You selected the correct answer." (or "…all correct answers." for multi-response).
   - Wrong: "❌ Your answer was incorrect. The correct answer is highlighted in green."
   - Partial multi: "⚠️ You missed one or more correct answers."
   - Unanswered: "You did not answer this question. The correct answer is highlighted in green."

4. **Per question-type rendering** in the new `ReviewCard`:
   - **MCQ / Image / TrueFalse**: list `q.options` (TrueFalse uses `["True","False"]`), compare index to `q.correctAnswer` and the numeric user answer.
   - **MultipleResponse**: list `q.options`, correct set = `q.correctAnswers` (array), user set = `a as number[]`.
   - **Numeric**: show single "Correct answer" card (green) with `q.correctAnswer`; if user answered, show their value card (green if matches via existing tolerance logic from `isCorrect`, else red).
   - **FillBlanks / DragDrop**: show each blank as a row: correct token green, user token red if wrong, green if right.
   - **HotSpot**: keep existing text summary (no visual map in review) — render correct spot label as green card, user's pick as red card if wrong; "Outside any region" if `__miss__`.

5. **Helpers**: small local helpers inside `Results` (or just above it):
   - `optionState(q, a, idx)` → `"correct" | "wrong-selected" | "selected-correct" | "neutral"`.
   - `statusFor(q, a)` → `{ tone: "success"|"destructive"|"warning"|"muted", message: string }`.

6. **Styling tokens**: use existing semantic tokens already in the project — `success`, `destructive`, `muted`, `border`, `card`, `coral` — no new CSS variables needed. Mobile responsive via existing tailwind utilities (cards stack naturally; option rows use `flex items-start gap-3` with `text-sm md:text-base`).

7. **Imports**: `CheckCircle2`, `XCircle` already imported; add `AlertCircle` from lucide-react for the partial/unanswered state.

## Out of scope

- Scoring / pass logic / timer / answer capture — unchanged.
- Practice-mode per-question feedback (lines ~356–445) — unchanged.
- `answerSummary` helper can stay for any other callers; new review code uses its own per-type rendering.
- No new files, no design tokens added, no data-shape changes.

## Acceptance

On `/quiz/customer-service-mock-1` → finish in exam mode → review section shows each question with full text, all original options as cards (green correct / red wrong-selected / neutral others), a status line, and a styled Explanation box. Works for MCQ, true/false, multi-response, fill-blanks, drag-drop, numeric, hotspot, and unanswered questions. Quiz flow, scoring, and pass/fail behave exactly as before.
