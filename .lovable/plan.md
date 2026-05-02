# Plan: Dropdown styling, post-results navigation, and per-mock weight compliance

## 1. Inline dropdown styling (`/quiz/grammar-mock-1` and all `dropdown_blanks` / `drag_drop_blanks`)

**File:** `src/components/QuizRunner.tsx` — `FillBlanksQuestionView` (≈ lines 718–757)

Problem: the sentence wrapper is a `<p>` with `text-base leading-[2.4]`. The `<select>` element renders, but on some flex/grid parents inherits full row width. Even though it has `inline-block`, several browsers compute `<select>` width based on content + browser min-width that can stretch.

Changes:
- Replace the `<p>` with a `<div>` that uses `leading-[2.4]` and explicit inline flow (no flex). Keep prose readable.
- On the `<select>`: add `w-auto max-w-full min-w-[6rem] align-middle` and remove `block`-promoting utilities. Set `style={{ width: 'auto' }}` defensively to override any inherited stretch.
- Wrap each `<select>` in an `<span className="inline-flex align-baseline">` so the surrounding text continues to flow inline.
- Apply the same fix path to `DragDropBlanksView` (it delegates to `FillBlanksQuestionView`, so a single change covers both).

## 2. Post-results "More mock tests" navigation does nothing

**File:** `src/routes/quiz.$slug.tsx`

Root cause: `<QuizRunner quiz={quiz} />` has no `key`. When the user clicks a related mock link, the URL/`slug` param changes and `quiz` updates, but React keeps the previous `QuizRunner` instance mounted with its `finished=true` state, so the user keeps seeing the old Results screen.

Fix: add `key={quiz.slug}` to `<QuizRunner>` so it remounts on slug change, resetting `mode`, `answers`, `finished`, `timeLeft`.

Also: the "More tests" / "More mock tests" cards already use `<Link to="/quiz/$slug" params={{ slug: r.slug }}>` which is correct — no change needed there.

## 3. Per-mock weight compliance

The audit shows 11 topics where most/all mocks ignore the configured type weights. Worst offenders are sentence/literacy topics that ended up with 100% one type:

| Topic | Current (mock 1) | Required weights |
|---|---|---|
| grammar | dropdown 24 | dropdown 0.40 / drag-drop 0.25 / mcq 0.25 / true-false 0.10 |
| nhs-literacy | mcq 24 | mcq 0.55 / dropdown 0.30 / true-false 0.15 |
| toefl | mcq 24 | mcq 0.50 / dropdown 0.25 / drag-drop 0.15 / true-false 0.10 |
| uk-geography | mcq 24 | mcq 0.60 / image 0.25 / drag-drop 0.15 |
| uk-laws-rights | mcq 24 | mcq 0.65 / true-false 0.25 / dropdown 0.10 |
| ph-hmrc-tax-check | mcq 24 | mcq 0.80 / true-false 0.20 |
| ph-london-regulations | mcq 24 | mcq 0.60 / true-false 0.20 / multi-response 0.20 |
| ph-passenger-safety | mcq 24 | mcq 0.55 / multi-response 0.30 / true-false 0.15 |
| esol | mcq 17 / dropdown 7 | mcq 0.45 / dropdown 0.30 / drag-drop 0.15 / true-false 0.10 |
| verbal | mcq 18 / dropdown 6 | mcq 0.60 / dropdown 0.25 / true-false 0.15 |
| logical | mcq 18 / drag-drop 6 | mcq 0.60 / drag-drop 0.25 / hot-spot 0.15 |

Approach (script in `scripts/`):

1. For each non-compliant topic, compute target counts per type for a 24-question mock via `round(weight * 24)`, then top-up with the highest-weight type so total = 24.
2. Group the existing question bank by normalized type. Where a required type is missing entirely from the bank (e.g. grammar has zero `multiple_choice`/`drag_drop_blanks`/`true_false`, nhs-literacy has no `dropdown_blanks`/`true_false`), generate the missing questions deterministically:
   - Convert a subset of existing dropdown_blanks → drag_drop_blanks (same data shape, only `type` differs) for grammar.
   - Synthesize the remaining types from each topic's existing question texts using a small templated generator (e.g. true/false statements derived from MCQ correct answers; MCQ from dropdown sentences turned into "Which word completes the sentence?"). Keep explanations meaningful.
3. Re-pack each mock by sampling per-type counts from the bank with a stable seed per `mockNumber` so the 45 mocks remain deterministic and each mock individually matches the weights (±1 question rounding).
4. Re-run the audit script as a check; fail loudly if any mock is off.
5. Spot-verify in the browser: open one mock from each fixed topic and confirm the question types vary as expected.

Other 78 topics already pass the audit and will not be modified.

## Technical notes

- Audit logic: `round(weight * questionsPerMock)` per type; allow ±2 tolerance per type and reject any extra type that isn't in the weights map.
- Type normalization: `type.replace('-', '_')`; treat missing `type` as `multiple_choice`.
- Mock files use both v1 (`tests[].questions`) and v2 (`bank` + `mocks[].questionIds`); the rebuild script must handle both, preserving existing IDs in v2.
- No schema changes — only data and the two component edits above.
