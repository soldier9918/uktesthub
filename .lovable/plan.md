## Goal
Add bulk "Regenerate as unique" and "Complete Regeneration" actions so the admin can fix entire clusters (or all detected duplicates) in one click instead of going question-by-question.

## Strategy
For each cluster of N duplicate questions, we only need to regenerate **N − 1** of them — leaving one "keeper" makes the rest unique against it. This avoids unnecessary AI calls and preserves one original per cluster.

## UI changes (`src/routes/admin-kb20.similar.tsx`)

### 1. Per-cluster bulk buttons (Clusters view)
Each cluster card gets two new buttons in its header:
- **"Regenerate cluster as unique"** — runs `regenerateUniqueQuestion` on every member except the first (keeper).
- **"Complete-regenerate cluster"** — runs `completeRegenerateQuestion` on every member except the first.

Show inline progress: `Regenerating 2/4…`. Disable both buttons while running. Mark the keeper member with a "keeper" badge.

### 2. Global bulk buttons (top of results, both views)
Two buttons next to the view toggle:
- **"Fix all clusters (unique)"** — runs unique-regen across every cluster, skipping one keeper per cluster.
- **"Fix all clusters (complete)"** — same with complete-regeneration.

Confirmation dialog showing the total question count to be regenerated and rough time estimate (~10–20s per question). Live progress: `Regenerating 5/12 across 4 clusters…`. Cancel button to stop after the current question finishes.

### 3. Execution behavior
- Process **sequentially** (one question at a time) to respect AI gateway rate limits and avoid 429s.
- After each successful regeneration: call `invalidateOverrides()`, update the local `diffs` state so the user sees results stream in.
- On any single failure: log the error in the progress line, skip that question, continue with the rest. Show a final summary: `Done — 10 succeeded, 2 need review, 1 failed`.
- Re-use the existing `regenerate(p, side)` and `completeRegenerate(p, side)` logic by extracting the core into a reusable helper that takes `(topic, id)` directly instead of a pair + side.

### 4. Keeper selection
For each cluster, the keeper is the member with the **lowest duplicate count** (least connected — least likely to still clash after others are rewritten). Tie-break by `topic::id` ascending so it's deterministic.

## Out of scope
- No changes to `similarity.functions.ts` server logic or the database.
- No re-scan after bulk regen — the user can click "Run scan" again to verify.
- No parallel/concurrent AI calls (sequential only, to stay under rate limits).

## Files to edit
- `src/routes/admin-kb20.similar.tsx` (only file touched)
