## The bug

`validateImported()` (line 412 in `src/lib/admin/csv-import.functions.ts`) always flags any repeated `id` as a blocking error — it runs before the explicit-allocation logic and doesn't know that repeats up to 2 are intentional when `mockNumber` is supplied.

That's why your CSV — which correctly uses `gre-q005` twice (once per mock) — gets 540 "Duplicate id" errors even though the new explicit-mode rules would accept it.

## Fix

Make the per-row duplicate check aware of explicit allocation.

1. **`validateImported(...)` signature** — add a `useExplicit: boolean` parameter.
2. **Inside the row loop (line 431–437)**:
   - If `useExplicit` is **false** → behavior unchanged (any repeat = error, as today).
   - If `useExplicit` is **true** → do NOT push a generic "Duplicate id" error. The explicit-mode rules already cover this correctly:
     - Rule: max 2 uses per id across mocks (blocks 3+ uses)
     - Rule: no duplicate id within a single mock
     - Rule: repeated rows must have identical content
3. **Two call sites** (lines 1311 and 1395) — compute `useExplicit = mockMetaByRow.some(m => m.mockNumber != null)` (same expression already used elsewhere in the file) and pass it in.

No UI changes, no schema changes, no changes to the explicit-mode validator. Patch mode without `mockNumber` keeps the strict "no duplicate ids" behavior.

## Result with your CSV

- 1,080 rows, 540 unique ids, each used exactly twice, allocated across 45 mocks of 24 → passes validation.
- A CSV with an id used 3+ times still gets blocked (by the explicit max-2 rule).
- A CSV with the same id twice in the same mock still gets blocked (by the within-mock rule).
- A CSV with no `mockNumber` column behaves exactly as it does today.