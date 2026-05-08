## Problem

On the admin questions page, each question's "Live in: Mock X · Q Y" pills only list mock slots that reference that question's exact `id`. When you use **Bulk duplicate questions** to push the same content/answers/image into other question IDs, those target slots render identical content at runtime — but the source question's "Live in" list still shows only the original 2 (or however many) IDs that literally match.

So a question that visually appears in, say, 6 mocks looks like it only lives in 2.

## Fix

Change the `flatten()` logic in `src/routes/admin-kb20.questions.$topic.tsx` so "Live in" is computed from **effective content** (after overrides) instead of only by `question_id`.

### Approach

1. Load `question_overrides` for the current topic (already available via `useOverrides()` in the page).
2. Build a **content fingerprint** for every question in the bank, after applying its override:
   - normalized question text + options (joined) + correct answer + image path
   - hash to a short stable key
3. Build a map: `fingerprint -> [{ mockNumber, slot, sourceQid }]` by walking every mock slot, looking up the question it references, applying its override, computing its fingerprint, and pushing the slot.
4. For each `FlatQuestion`, set `usedInMocks` to the union of:
   - slots whose `question_id` literally equals this question's id (existing behavior — keeps unused/disabled IDs honest), AND
   - slots whose effective fingerprint matches this question's fingerprint.
5. De-duplicate by `mockNumber + slot`.

### UI tweaks (small)

- When a slot is "live" because of content match (different underlying qid), keep the same pill style but add a subtle title tooltip: `"Mock 7 · Q12 — duplicate content (id: dt-0421)"`.
- Add a small count next to "Live in:" e.g. `Live in (6):` so it's obvious at a glance.

### Out of scope

- No schema changes.
- No changes to bulk-duplicate flow or to mock JSON files.
- "Unused — not in any mock" badge logic stays the same (based on real id usage), so genuinely orphaned bank entries still surface.

### Why this works

Bulk-duplicate writes override rows for target `(topic, question_id)` pairs with identical content. After this change, the admin UI groups slots by what the user *actually sees* on the live site, so the count matches reality.

### Files touched

- `src/routes/admin-kb20.questions.$topic.tsx` — extend `flatten()` to accept the overrides map and compute fingerprint-based usage; update the "Live in" render to show count + tooltip.

No other files, no DB migration, no edge function work.
