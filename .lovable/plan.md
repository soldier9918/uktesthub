## Problem

`public/mocks/seru.json` only contains a 14-question bank, so every one of the 45 SERU mocks resolves to 14 questions instead of the standard 24 (the runtime drops missing IDs, so each mock silently shrinks).

## Fix

1. **Grow the SERU bank** to ~260 questions covering authentic TfL SERU topics:
   - London geography & landmarks (English comprehension style)
   - Safety, equality & disability awareness (Equality Act 2010, assistance dogs, wheelchair users)
   - Customer service & professional conduct
   - PHV licensing rules (badge/disc display, insurance, MOT, hire & reward)
   - Route planning, congestion charge, ULEZ, bus lanes
   - Safeguarding (children & vulnerable adults)
   - Map reading and signage comprehension
   - Numeracy (fares, time, distance)
   
   Reuse the existing question types already in the file (`dropdown_blanks`, `multiple_choice`) plus `true_false` and `multiple_response` where appropriate. Keep IDs sequential: `s-mc-0001…`, `s-db-0001…`, `s-tf-0001…`, `s-mr-0001…`.

2. **Rebuild the 45 mocks** with exactly 24 questions each via round-robin sampling from the expanded bank so each mock has a balanced mix of types and no mock repeats the same question twice.

3. **Verify** by re-reading the file and asserting `len(mock.questionIds) == 24` for all 45 mocks and that every referenced ID exists in the bank.

## Technical notes

- File: `public/mocks/seru.json` (v2 shape: `{ version, topic, bank, mocks }`)
- Loader: `src/data/mocks/index.ts` — silently skips question IDs that aren't in the bank, which is why the shortage was invisible.
- No code changes needed; data-only fix.
- Written via a Python script run from `scripts/` (not committed) so the JSON is deterministic.
