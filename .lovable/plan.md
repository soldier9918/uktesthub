## Goal
Make it obvious on the **Similar Questions** admin page when a single question is part of more than one duplicate pair (i.e. belongs to a cluster of 3+).

## Current behavior
- `findSimilarPairs` returns flat A↔B pairs.
- Each pair renders as its own card. A question that matches 3 others appears in 3 separate cards with no cross-reference.
- Nothing tells the admin "this question has N duplicates".

## Proposed UI changes (frontend only, in `src/routes/admin-kb20.similar.tsx`)

1. **Compute duplicate counts per question** from `visiblePairs`:
   - Build a `Map<topic::id, number>` counting how many visible pairs each question appears in.
   - Build a `Map<topic::id, Array<{topic,id,text}>>` of all its partners for the expandable list.

2. **Add a "duplicate count" badge on each PairSide**:
   - Next to the A/B label, show e.g. `3 duplicates` (red if ≥3, amber if =2, hidden if =1).
   - Clicking the badge expands a small list of all the OTHER questions it's similar to, with quick links to each.

3. **Add a "Cluster view" toggle** at the top of the results (next to the remaining-count badge):
   - **Pairs view** (default, current): one card per pair.
   - **Cluster view**: group all pairs that share a question into a single card. The card shows the "hub" question once, then lists all its duplicates underneath with regenerate/mark-not-dup buttons per partner. Uses a simple union-find over visible pairs.

4. **Add a summary line** under the remaining-count badge:
   - e.g. `12 pairs · 8 unique questions · 2 clusters with 3+ duplicates`.

5. **Sort order**: in both views, push questions/clusters with the highest duplicate count to the top so the worst offenders surface first.

## Out of scope
- No changes to similarity detection, regeneration logic, or DB.
- No changes to `similarity.functions.ts` or migrations.

## Files to edit
- `src/routes/admin-kb20.similar.tsx` (only file touched)
