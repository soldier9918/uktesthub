## Goal

Stop the admin from falsely flagging True/False (and string-answer image) questions as "no answers" / "invalid-correct-answer" when their `correctAnswer` is stored as a string label that matches an option, instead of an index/boolean.

## Background

Live quiz already accepts these forms — they render correctly. Only the admin validators reject them.

Two validators flag the same shape:

1. `hasBrokenAnswers` in `src/routes/admin-kb20.questions.$topic.tsx` (drives the orange "no answers" badge).
2. `validateTopicBank` in `src/lib/admin/validator.ts` (drives the validation report and the import blocker).

Both currently demand:
- `mcq` / `image-question` → numeric `correctAnswer` index
- `true-false` → boolean `correctAnswer`
- `multiple-response` → numeric `correctAnswers[]`

But real data also stores:
- `true-false` with `correctAnswer: "True"` / `"False"` (string)
- `mcq` / `image-question` with `correctAnswer: "<option label text>"` (string matching one of the options)

## Changes

### 1. `src/routes/admin-kb20.questions.$topic.tsx` — `hasBrokenAnswers`

Treat as VALID when:
- `mcq` / `image-question`: `correctAnswer` is a string that case-insensitively equals one of `options`.
- `true-false`: `correctAnswer` is a string equal (case-insensitive) to `"true"` or `"false"`, OR equals one of the options.

Existing numeric/boolean checks stay as the primary path; string match is an additional fallback.

### 2. `src/lib/admin/validator.ts` — `invalid-correct-answer` rule

Mirror the same fallback in the three branches (mcq/image-question, true-false, multiple-response stays index-only). Only emit the finding when neither numeric/boolean form NOR a matching string label is present.

### 3. No data migration

Leave existing rows alone. This is a pure validator fix — no DB writes, no CSV/export changes, no live-quiz changes.

## Out of scope

- Normalizing string answers to indices on export/import.
- Changing the editor UI (it already works for the canonical numeric/boolean form).
- Other validator rules (missing-explanation, missing-image, duplicate-id, etc.).

## Verification

After change:
- Question shown in screenshot (Mock 17 · Q16, true-false with `correctAnswer: "False"`) no longer shows the orange "no answers" badge.
- Validation report no longer lists `invalid-correct-answer` for true-false rows whose answer is the string `"True"`/`"False"`, or for mcq rows whose answer matches an option label exactly.
- Genuinely broken rows (e.g. `correctAnswer: ""`, or a string that matches no option) still get flagged.
