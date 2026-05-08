## Problem

Some questions in the bank (e.g. `rs-im-0331-tf6`) have **no options array** and a malformed shape — for example `type: "image_question"` with `correctAnswer: true` (boolean) and zero answer choices. The runtime can't render answers for them, and the current admin editor (`QuestionEditDialog`) only shows the options block when `options.length > 0`, so there's no way to add answers from the UI. The editor also hides the question type, so admins can't tell what's wrong or convert between types.

## Fix (admin-only, frontend changes)

Upgrade `src/components/QuestionEditDialog.tsx` so any broken question can be repaired without touching JSON.

### 1. Show + change question type

Add a small **Type** select at the top of the dialog with these options:
- Multiple choice (`mcq`)
- Image question (`image_question`)
- True / False (`true_false`)
- Multiple response (`multiple_response`)

Default to the question's existing `type` (passed through from the topic page). When the user changes type, adapt local state:
- → `true_false`: clear options, set `correctAnswer` to a boolean (default `true`)
- → `mcq`/`image_question`: ensure at least 2 empty option rows, numeric `correctAnswer`
- → `multiple_response`: same, but `correctAnswers` is `number[]`

### 2. Always allow editing answers (banner when missing)

Remove the `options.length > 0` gate. Instead:
- If the question is MCQ/image and has 0 options, show an amber banner **"This question has no answers — add at least 2 options below"** plus an **Add option** button that seeds 4 empty rows.
- Each option row gets an **Add** / **Remove** control (min 2, max 6). The radio still picks the correct one.
- For `true_false`, render a **True / False** radio pair instead of options.
- For `multiple_response`, swap the radio for a checkbox per option, storing `correctAnswers` as `number[]`.

### 3. Persist type + answer fields

Extend the upsert payload in `save()` to also write the new `type` and the appropriate answer field:
- `correct_answer` for `mcq`/`image_question` (number) and `true_false` (boolean)
- `correct_answers` (jsonb `number[]`) for `multiple_response`

If `question_overrides` doesn't yet have a `type` or `correct_answers` column, add a small migration that introduces them as nullable. The runtime override merge already falls through to original fields when null, so existing rows stay safe.

### 4. Surface broken questions in the topic list

In `src/routes/admin-kb20.questions.$topic.tsx`, add a red **"No answers"** badge next to any flat question where:
- `type` is `mcq`/`image_question` and `options` is missing/empty, OR
- `type` is `mcq`/`image_question` and `correctAnswer` isn't a valid index, OR
- `type` is `true_false` and `correctAnswer` isn't a boolean.

Add a "Needs answers" filter chip above the list so admins can jump straight to the broken ones.

### Out of scope

- No bulk-fix flow (the existing **Bulk duplicate questions** page already covers replacing many at once if needed).
- No changes to mock JSON files or the validator rules — the validator already flags these as `invalid-correct-answer`.
- No quiz runtime changes.

### Files touched

- `src/components/QuestionEditDialog.tsx` — type selector, dynamic options editor, true/false + multi-response support, save payload.
- `src/routes/admin-kb20.questions.$topic.tsx` — "No answers" badge + filter, pass `type` into the dialog defaults.
- `supabase/migrations/<new>.sql` — add `type text` and `correct_answers jsonb` to `question_overrides` if they don't exist.
- `src/lib/overrides.ts` — extend the merge to apply overridden `type` / `correct_answers`.
