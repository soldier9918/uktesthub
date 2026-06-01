
## Goal

Let you upload a CSV like `…, mockNumber, questionNumber` where the same question id can appear up to **2 times** across mocks (manually allocated by you). The importer honors your allocation, but **blocks** the commit if any rule is broken.

## What changes for you

The CSV stays exactly the same as you described:

```
id, type, question, optionA, optionB, optionC, optionD, correctAnswer, correctAnswers, explanation, image, imageAlt, mockNumber, questionNumber
```

- A question id may appear in up to **2 different rows** (one per mock it belongs to). The question text/options/etc. on those rows must be identical.
- `mockNumber` + `questionNumber` together must be unique (one question per slot).
- For Full Replacement, totals must hit your declared targets exactly.

The two existing modes stay as they are:
- **Patch** — partial updates, no allocation change
- **Full Replacement** — wipes and rebuilds bank + mocks from the CSV

No new mode, no new UI inputs. Targets come from the CSV itself.

## Validation rules (block commit on any failure)

In Full Replacement when `mockNumber` is present:

1. **Mock count** = max(mockNumber). Every integer from 1 to that max must exist (no gaps).
2. **Each mock has exactly N questions** where N = the most common per-mock count in the CSV (must be the same for every mock — error if mocks have different sizes).
3. **No duplicate questionNumber** within a single mock.
4. **No duplicate question id** within a single mock.
5. **Each question id used ≤ 2 times** across all mocks. List every offender (id + the mocks it appears in).
6. **Repeated rows for the same id must be identical** on text/options/correctAnswer/etc. — otherwise the bank would be ambiguous. Error lists conflicting fields.
7. **Unique question pool ≥ (mocks × questionsPerMock) / 2.** With 45×24 that's 540. If you upload 650 unique questions allocated to 1,080 slots, this passes.
8. Existing checks stay: no placeholder text, no stub IDs, no unused bank questions.

For Patch mode, only rules 3, 4, 6 apply (we don't know the full picture).

## How the bank + mocks get built

- **Bank** = the set of **unique** question ids from the CSV (de-duped on id, first occurrence wins for canonical fields after rule 6 confirms they all match).
- **Mocks** = grouped by `mockNumber`, ordered by `questionNumber`. Each mock stores `questionIds` referencing the bank.
- Result for your 650-question CSV: bank has 650 entries, 45 mocks each with 24 ids, total 1,080 references, no mock has a duplicate, no id used more than twice.

## Preview UI

Add three more badges to the existing preview block:

- **Unique questions: 650**
- **Total slots: 1080**
- **Max uses per question: 2** (green if ≤2, red if >2)

Validation errors render in the existing red error list — your existing "Blocked by errors" button state already handles this, so nothing else changes in the UI.

## Technical notes

File: `src/lib/admin/csv-import.functions.ts`

1. Drop the hardcoded `FULL_REPLACEMENT_MOCK_COUNT = 45` / `_QUESTIONS_PER_MOCK = 24` / `_BANK_SIZE = 1080`. Compute these from the CSV when `useExplicit` is true:
   - `mockCount = max(mockNumber)`
   - `questionsPerMock = mode(group size)` with an error if groups disagree
   - `bankSize = unique ids count`
2. Extend `validateReplaceMode` (around line 994) with rules 5, 6, 7. Add a helper `validateRepeatLimits(rows, mockMetaByRow, maxUses = 2)` that returns Issues.
3. Update `assertReplacementSucceeded` (around line 950) so its post-commit assertions also use the CSV-derived targets, not constants.
4. Update the mock-building section (around line 815) so when `useExplicit` is true and an id appears multiple times, we de-dupe into the bank but keep both mock references.
5. The GMAT-specific `expectedFirstIds` check at line 982 is brittle for the new flow — gate it behind a check that the CSV's first id actually is `gmat-mock-01-q01`, otherwise skip.

File: `src/routes/admin-kb20.csv-import.tsx`

6. Add the three new badges (Unique / Slots / Max uses) sourced from new fields on the `PreviewResult`.
7. Update the "Expected columns" hint text to include `mockNumber, questionNumber`.

No DB migration. No changes to `public/mocks/*.json` schema. No changes to the quiz runner.

## Out of scope

- Auto-distribution / round-robin allocation (you said you'll allocate manually)
- Raising the cap above 2 uses (strict max 2)
- A separate third "distribute" mode
