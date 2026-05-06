## Goal
Add a **question type filter** to the Similar Questions admin page so you can narrow the clusters/pairs view to a single question type (e.g. `multiple_choice`, `true_false`, `image_question`) and run bulk regeneration only within that subset.

## UI changes (`src/routes/admin-kb20.similar.tsx` only)

### 1. New "Type" filter dropdown
Add a `<select>` in the existing filter toolbar (next to Category/Topic), with options:
- **All types** (default)
- One option per detected type, populated dynamically from the loaded questions (so we don't hard-code and miss types). Detected so far in the data: `multiple_choice`, `true_false`, `multiple_response`, `image_question`, `hot_spot`, `numeric_entry`, `drag_drop_blanks`, `dropdown_blanks`.

State: `const [typeFilter, setTypeFilter] = useState<string>("__all__")`.

### 2. Capture `type` on each item during scan
In the scan loop where `SimItem`s are built, also store the question's `type` field (already accessed elsewhere as `source.type`). Either:
- extend the local items array with `type`, OR
- build a `Map<string, string>` keyed by `topic::id` → `type` so we don't have to change the shared `SimItem` type in `src/lib/admin/similarity.ts`.

Preferred: **side map** to keep `similarity.ts` untouched.

### 3. Apply the filter to displayed pairs and clusters
After scan completes, derive `visiblePairs` from `pairs` by:
- If `typeFilter === "__all__"` → show all.
- Else → keep only pairs where **both** `a` and `b` have `type === typeFilter` (so a cluster you act on is homogeneous and bulk regen stays safe).

Re-derive clusters from `visiblePairs` (the existing cluster builder already works off a pair list — just feed it the filtered list).

### 4. Bulk actions respect the filter automatically
Because the global "Fix all clusters" and per-cluster bulk buttons operate on the currently-rendered clusters, filtering the pair list naturally scopes bulk regeneration to the chosen type. Confirmation dialog will show the filtered count, e.g. *"This will regenerate 14 questions across 5 clusters (type: multiple_choice)."*

### 5. Visible counts
Update the results header to show both totals when a filter is active:
- `42 similar pairs found · showing 14 (type: multiple_choice)`
- Cluster count line gets the same treatment.

### 6. Type badge on each pair/cluster row
Small muted badge next to each question id showing its type, so the filter result is visually obvious and mixed-type clusters (when filter = All) are easy to spot.

## Out of scope
- No changes to `similarity.functions.ts`, `similarity.ts`, or the database.
- Filter does not change which topics are scanned — the scan still uses the Category/Topic selectors as today; type filter only narrows what you see and act on after the scan.
- No persistence of the filter across reloads.

## Files to edit
- `src/routes/admin-kb20.similar.tsx` (only file touched)
