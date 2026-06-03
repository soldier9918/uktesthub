## Goal

Add a new admin tool: **Per-Mock Intros CSV Import** at `/admin-kb20/mock-intros-import`. Upload a CSV of "What this mock covers" + "Common mistakes" content for any topic across any category, preview the diff, then commit the changes to `src/data/per-mock-intros.ts` on GitHub `main` (same flow as the existing CSV Import → GitHub feature).

## CSV format

Auto-detect single-topic vs. all-topics by column presence.

**Single topic** (no `topic_slug` column — topic chosen via dropdown in UI):
```
mock,difficulty,covers,common_mistakes
1,Beginner,"Driving Theory Mock Test 1 covers...","Rushing | Missing words | Confusing signs | Guessing"
2,Beginner,"...","..."
```

**All topics** (includes `topic_slug` column — topic dropdown ignored):
```
topic_slug,mock,difficulty,covers,common_mistakes
driving-theory,1,Beginner,"...","..."
life-in-the-uk,1,Beginner,"...","..."
seru,1,Intermediate,"...","..."
```

- `mock`: integer 1–45
- `difficulty`: `Beginner | Intermediate | Exam-ready` (matches existing `Difficulty` type)
- `covers`: free text paragraph
- `common_mistakes`: pipe (`|`) separated list, 3–6 items recommended
- `topic_slug` (optional): any slug from `src/data/categories.ts`; validates against the known list

## UI (mirrors `/admin-kb20/csv-import`)

1. Topic picker (searchable, populated from `categories.ts`, all categories + subtopics) — disabled if CSV contains `topic_slug`
2. File upload + textarea paste
3. Mode toggle: **Patch** (merge with existing) or **Replace** (overwrite topic block)
4. **Preview** button — shows per-row diff: added / changed / unchanged, with validation errors highlighted
5. **Commit to GitHub** button — writes new `per-mock-intros.ts`, pushes to `main` with a descriptive commit message, returns commit URL
6. Recent commits list with rollback (reuses existing `listImportHistory` / `rollbackImport` pattern)

## Implementation

**New file `src/lib/admin/mock-intros-import.functions.ts`** — three server fns following the pattern in `src/lib/admin/csv-import.functions.ts`:
- `previewMockIntrosImport({ csvText, topicSlug, mode })` → parses CSV, validates rows, diffs against current `per-mock-intros.ts`, returns `{ rows, errors, summary }`
- `commitMockIntrosImport({ csvText, topicSlug, mode })` → regenerates the full `per-mock-intros.ts` source, commits via GitHub API using `GITHUB_TOKEN` secret, logs to `question_import_history` with a new `kind='mock_intros'` marker
- `rollbackMockIntrosImport({ historyId })` → reverts to previous file SHA

Server fns will:
- Import current intros via dynamic `await import("@/data/per-mock-intros.ts")` inside `.handler()`
- Re-serialize the full TS file with a stable formatter (preserve `RELATED_GUIDE_BY_TOPIC`, `Difficulty` type, and existing topic blocks not in the CSV)
- Reuse the existing GitHub commit helper used by `csv-import.functions.ts`

**New file `src/routes/admin-kb20.mock-intros-import.tsx`** — page UI wrapped in `<AdminGate>`, copies the structure and styling of `admin-kb20.csv-import.tsx`.

**Edit `src/routes/admin-kb20.index.tsx`** — add a new `<Tile>` under the **Content** section:
```
<Tile to="/admin-kb20/mock-intros-import" title="Mock Intros CSV Import"
  desc="Upload CSV of per-mock difficulty, 'What this mock covers' and 'Common mistakes' for any topic. Commits to per-mock-intros.ts on GitHub." />
```

**Edit `src/data/per-mock-intros.ts`** — no schema changes; the data structure already supports `Record<string, Record<number, PerMockIntro>>` for all categories.

## Out of scope (this plan)

- Editing `RELATED_GUIDE_BY_TOPIC` via CSV (kept manual; small dataset)
- A separate UI for editing single rows (admins can re-upload CSVs)
- Bulk Mock Test Manager integration (separate page already exists at `/admin-kb20/mocks`)

## Estimated changes

- 2 new files (~600 LOC total, mostly mirroring existing CSV import patterns)
- 1 small edit to admin index (1 new tile)
- No DB migrations, no new dependencies
