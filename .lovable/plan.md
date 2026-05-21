## Goal

Make the exam-mode "Review your answers" cards in `src/components/QuizRunner.tsx` visually more compact and neater, without changing functionality, logic, or any other section.

## Changes (presentation only)

All inside `ReviewCard`, `OptionRow`, and `FallbackReview` (lines ~1216–1417).

1. **Outer review wrapper** (`<ol>` at line 1118): reduce row gap `space-y-5` → `space-y-3`. Outer panel padding `p-6 md:p-8` → `p-4 md:p-6`.

2. **ReviewCard container** (line 1301):
   - Border `border-2` → `border` (1px), padding `p-4 md:p-5` → `p-3 md:p-4`, radius `rounded-2xl` → `rounded-xl`.

3. **Header row**:
   - "Question N" label: `text-xs` → `text-[11px]`.
   - Badge: `px-3 py-1 text-xs` → `px-2 py-0.5 text-[11px]`, icon `h-3.5 w-3.5` → `h-3 w-3`.

4. **Question text** (line 1314): `mt-3 text-base md:text-lg font-semibold` → `mt-2 text-sm md:text-base font-semibold leading-snug`.

5. **Options block** (line 1318): `mt-4 space-y-2` → `mt-3 space-y-1.5`.

6. **OptionRow** (line 1216):
   - Container: `gap-3 rounded-2xl border-2 p-3 md:p-4` → `gap-2.5 rounded-lg border p-2 md:p-2.5`, add `items-center`.
   - Letter chip: `h-7 w-7 text-xs` → `h-6 w-6 text-[11px]`.
   - Label: `text-sm md:text-base` → `text-sm leading-snug`.
   - Right cluster: keep icon + "Your answer" on a single horizontal line (`flex-row items-center gap-2`) instead of stacked column. Icon `h-5 w-5` → `h-4 w-4`. "Your answer" pill: keep `text-[10px]` but `px-2 py-0.5` → `px-1.5 py-0`.

7. **Status message box** (line 1334): `mt-4 p-3 text-sm rounded-xl border` → `mt-3 px-3 py-2 text-xs md:text-sm rounded-lg border`, icon `h-4 w-4` → `h-3.5 w-3.5`.

8. **Explanation panel** (line 1342): `mt-3 rounded-xl p-4` → `mt-2 rounded-lg p-3`, body `text-sm md:text-base` → `text-xs md:text-sm leading-relaxed`, header label `text-xs` → `text-[10px]`.

9. **FallbackReview blank rows**: inner `space-y-2` → `space-y-1.5`, "Blank N" label `text-xs` → `text-[10px]`.

## Out of scope

- No changes to logic, scoring, status messages, colors/tokens, question types, practice mode, timer, or layout structure.
- No changes outside `QuizRunner.tsx`.
- No new components or files.

## Acceptance

On `/quiz/customer-service-mock-2` exam-mode results: review cards are visibly more compact (less vertical space per card, smaller chips/icons/padding), the "Your answer" pill sits inline beside its icon, but all info (badge, question, options, status, explanation) still renders correctly across MCQ, true/false, multi-response, fill-blanks, drag-drop, numeric, hotspot, and unanswered states.
