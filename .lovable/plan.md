## Goal
Generate real questions for the English Language Tests section in priority order — IELTS → ESOL → SELT → TOEFL — with a balanced mix of question types and zero duplicates within each category (45 mocks × 24 questions = **1,080 unique questions per category**, **4,320 total** for the four priority categories).

## Question type mix (per mock, per category)

Each 24-question mock will use this fixed distribution so the experience feels varied:

| Type                  | Per mock | % of mock |
|-----------------------|---------:|----------:|
| Multiple choice       | 10       | ~42%      |
| Fill-in-the-blank     | 6        | 25%       |
| Dropdown blanks       | 4        | ~17%      |
| Multiple response     | 4        | ~17%      |

(Maps to existing QuizRunner types: `mcq`, `fill-blanks` (typed), `fill-blanks` (dropdown variant), `multiple-response`. `dropdown_blanks` and `fill-in-the-blank` both use the existing `fill-blanks` renderer — dropdown variant uses 3 options per blank; typed variant uses a single correct string with the input rendered as a free-text-style chip.)

## Bank shape (extend `public/english-mocks/<slug>.json`)

The current v2 schema only stores MCQs. Extend the `bank` union to support all four types (no breaking change — `type: "mcq"` remains the default):

```ts
type RawBankItem =
  | { id: string; type: "mcq"; question: string; options: string[]; correctAnswer: number; explanation: string }
  | { id: string; type: "multiple-response"; question: string; options: string[]; correctAnswers: number[]; explanation: string }
  | { id: string; type: "fill-blanks"; template: string; prompt?: string; blanks: { options: string[]; correctIndex: number }[]; explanation: string }
  | { id: string; type: "dropdown-blanks"; template: string; prompt?: string; blanks: { options: string[]; correctIndex: number }[]; explanation: string };
```

`mocks.ts` will be updated to map each variant onto the matching `Question` type (`dropdown-blanks` → `fill-blanks`).

## Generation approach (deterministic, template-driven)

A one-off Node script `scripts/generate_english_mocks.ts` will produce the JSON. For each category it composes questions from large curated content pools — no AI calls, fully deterministic, reviewable in source:

- **IELTS** — academic vocabulary, Academic Reading-style sentence completion, Listening-style "what does the speaker mean", grammar in academic register.
- **ESOL** — UK everyday life: GP, council, post office, transport, shops; SfL-style functional English.
- **SELT** — A1/A2/B1 visa-style speaking + listening prompts, polite requests, short conversational responses.
- **TOEFL** — campus life, lecture vocabulary, paraphrase choice, academic register.

Per category, the script holds **content pools** large enough to emit 1,080 unique items:
- ~400 sentence stems for fill-blanks / dropdown-blanks across grammar slots (tense, prep, article, modal, collocation).
- ~400 MCQ stems (vocabulary in context, paraphrase, gist, inference).
- ~280 multiple-response stems ("which TWO sentences are formal?", "select all true statements about the passage").

Uniqueness is enforced by hashing the `(template + correct-answer + distractors)` tuple and rejecting collisions while building the bank.

Each mock is then assembled by walking the bank in stride (mock N takes items at indices `N, N+45, N+90, …`) so every mock contains the full type mix and no two mocks share a question.

## Scope of THIS turn

Building all 4 categories in one turn is too large to land safely. This turn ships:

1. **Bank schema + loader extension** — `mocks.ts` maps the 4 new types onto QuizRunner's `Question` union; legacy `mcq`-only bank files keep working.
2. **Generator script** — `scripts/generate_english_mocks.ts` with the IELTS content pool fully populated. Produces `public/english-mocks/ielts.json` (1,080 questions, 45 mocks, mix verified, uniqueness verified).
3. **IELTS goes live** — `/english-language-tests/ielts` shows "45 of 45 ready" and every mock runs end-to-end.
4. **Plan file note** for follow-up turns: ESOL → SELT → TOEFL using the same generator, one category per turn, so each lands with a reviewable diff.

## Files

- edit `src/data/english/mocks.ts` — extend bank type, add mappers for `multiple-response`, `fill-blanks`, `dropdown-blanks`.
- create `scripts/generate_english_mocks.ts` — content pools + emitter, runnable with `bun scripts/generate_english_mocks.ts ielts`.
- create `public/english-mocks/ielts.json` — output of the script (committed).
- edit `.lovable/plan.md` — record the per-category rollout order.

## Disclaimers / compliance

No copy on the new pages claims UK Test Hub is an official IELTS / ESOL / SELT / TOEFL provider. The existing site-wide disclaimer on the English landing page already covers this; no copy changes needed.

## Out of scope this turn

- ESOL, SELT, TOEFL JSON files (next 3 turns).
- The 16 remaining categories (CEFR, skills, topics) — still "coming soon".
