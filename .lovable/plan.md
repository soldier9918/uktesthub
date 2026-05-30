
## Goal

`public/mocks/*.json` becomes the only live source of quiz data. Admin CSV uploads commit directly to GitHub `main`, which auto-deploys. The database is used only for import history, rollback snapshots, and logs.

## Step 1 — One-time migration of existing overrides

Before disabling the override system, merge every row in `question_overrides` into the matching `public/mocks/<topic>.json` so no admin edits are lost.

1. Script (`scripts/migrate_overrides_to_json.mjs`) connects to Supabase, pages through all overrides, and for each topic:
   - Loads the topic JSON file.
   - Applies overrides field-by-field (mirroring `applyOverrideToQuestionRecord`) onto each matching question.
   - Drops questions where `disabled = true`.
   - Writes the file back.
2. Run it once locally in this sandbox — the modified JSONs commit through the normal Lovable flow.

## Step 2 — New database tables

Single new table `question_import_history` (rollback snapshots live here):

| column | purpose |
|---|---|
| `id` uuid pk | |
| `topic` text | which topic file was changed |
| `filename` text | uploaded CSV filename |
| `previous_json` jsonb | snapshot of the file before this import (used for rollback) |
| `new_json` jsonb | snapshot committed |
| `commit_sha` text | GitHub commit sha |
| `commit_url` text | direct link to the commit |
| `row_count` int | number of questions in the new file |
| `validation_log` jsonb | warnings / non-blocking findings |
| `error_log` text | populated only if the commit failed |
| `status` text | `committed`, `failed`, `rolled_back` |
| `rolled_back_at` timestamptz nullable | |
| `rolled_back_to_commit_sha` text nullable | |
| `created_by` uuid | admin user |
| `created_at` timestamptz | |

Admin-only RLS (existing `has_role(auth.uid(), 'admin')` pattern). `question_overrides` table is kept for reference but no longer read at runtime.

## Step 3 — Server functions (`src/lib/admin/csv-import.functions.ts`)

All `createServerFn` + `requireSupabaseAuth`, gated by `has_role('admin')`. GitHub access uses the new `GITHUB_TOKEN` secret against `soldier9918/uktesthub @ main` via the GitHub Contents REST API (fetch-based, Worker-safe).

- `previewCsvImport({ topic, csvText })` — parses CSV, runs `validateTopicBank`, returns `{ oldBank, newBank, findings, diff }` for the preview UI. No writes.
- `commitCsvImport({ topic, csvText, filename })`:
  1. Re-validate; block on hard errors.
  2. Fetch current `public/mocks/<topic>.json` from GitHub (to get its sha).
  3. Build the new JSON in the existing v2 shape (`{ topic, bank, tests }`), preserving the existing `tests` structure where possible.
  4. PUT to `/repos/soldier9918/uktesthub/contents/public/mocks/<topic>.json` with the new content + base64.
  5. Insert `question_import_history` row with snapshots + commit url.
  6. Return `{ commitUrl, commitSha, historyId }`.
- `rollbackImport({ historyId })` — loads `previous_json` from history, PUTs it back to GitHub as a new commit, marks the history row `rolled_back`, inserts a new history row for the revert commit.
- `listImportHistory({ topic?, limit })` — paginated history view.

## Step 4 — Remove runtime override system

- `src/lib/overrides.ts`: gut `applyOverrides` so it becomes a no-op pass-through (keeps existing call-sites working without churn). `useOverrides` returns `null`. This makes JSON files the only source.
- Keep the `applyOverrideToQuestionRecord` export only inside the migration script (copy it there) and delete from runtime.
- The existing admin "Import / Export" page that writes to `question_overrides` is replaced by the new flow.

## Step 5 — New admin UI

Route: `/admin-kb20/csv-import` (linked from `/admin-kb20/categories`).

Flow on one page:
1. Pick topic → drop CSV file.
2. Live preview table: side-by-side **Current question** vs **New question**, with added/removed/changed badges and any validation findings.
3. "Commit to GitHub" button → calls `commitCsvImport`, shows commit URL + success toast.
4. "Import history" panel below: table of past imports with commit links and a **Rollback** button per row.

## Step 6 — Deploy

GitHub commit on `main` triggers your existing Lovable GitHub auto-deploy. No extra wiring needed.

## Out of scope (intentional)

- I will not touch Road Signs' special-case logic in `overrides.ts` separately — once overrides are a no-op, road signs are already locked to static JSON, which is exactly the desired behaviour.
- No migration of the `question_overrides` table schema beyond stopping reads.

## Technical notes

- GitHub Contents API is fetch-based and runs fine in Cloudflare Worker SSR (no Node-only deps).
- CSV parsing: use `papaparse` (already pure JS, Worker-safe). Need to `bun add papaparse @types/papaparse`.
- All large JSON snapshots stored as `jsonb` — fine up to a few MB per row, well within Postgres limits for these files.
- `GITHUB_TOKEN` is server-only; read inside `.handler()` via `process.env.GITHUB_TOKEN`.
