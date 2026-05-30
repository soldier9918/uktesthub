## Problem

In `public/mocks/road-signs.json`, mocks 8, 21, and 34 each have only 23 entries in their `questionIds` array (expected 24). No ids are missing from the bank and no duplicates — the arrays are just short by one.

The bank contains 1,027 questions; 518 of them are currently used in zero mocks, so there's plenty of unused inventory to top up from.

## Fix

For each of the three short mocks, append one additional question id chosen from the unused pool, matching the existing mock's character:

- **Mock 8** — predominantly `rs-im-*` (image sign) questions → pick an unused `rs-im-*` id
- **Mock 21** — mix of `rs-im-*` and `rs-mc-*` → pick an unused id from the same families
- **Mock 34** — predominantly `rs-im-*` → pick an unused `rs-im-*` id

Selection rule (deterministic):
1. Build the set of bank ids never referenced by any mock.
2. Filter to ids whose prefix matches the dominant family of the target mock.
3. Pick the first id in sorted order so the change is reproducible.
4. Append to that mock's `questionIds` array.

After the edit, re-run the check to confirm every mock has exactly 24 ids and no missing/duplicate references.

## Files touched

- `public/mocks/road-signs.json` — append one id to `mocks[7].questionIds`, `mocks[20].questionIds`, `mocks[33].questionIds`.

No code changes; the build manifest will regenerate diagnostics automatically on next build.
