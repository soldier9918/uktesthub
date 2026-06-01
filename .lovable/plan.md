# Bulk CSV export for all topics

Today CSVs can only be exported one topic at a time from `/admin-kb20/questions/$topic` (the "Export CSV" button). There's no way to grab them all at once.

## What to add

A new section on `/admin-kb20/import-export` (and a tile on `/admin-kb20`) called **Bulk CSV export** with three actions:

1. **Download all topics as ZIP** — produces `uktesthub-csv-export-YYYYMMDD.zip` containing one `<category-slug>/<topic-slug>.csv` per topic, plus a top-level `MANIFEST.csv` listing `category, topic, slug, question_count, filename`.
2. **Download a single category as ZIP** — same structure but filtered to one category, via a category dropdown.
3. **Download one combined CSV** — every question from every topic in a single flat file with two extra leading columns: `category`, `topic`.

All three reuse the exact same CSV column layout the per-topic Export CSV button already produces (so files round-trip cleanly through the existing CSV importer):
`id, type, question, options, correctAnswer, correctAnswers, explanation, image, imageAlt`.

For `drop-down-blanks` / `drag-drop-blanks` / `fill-blanks`, the row is flattened from `blanks[0]` into `optionA-D` + `correctAnswer` the same way the importer expects, so re-import via Full replacement rebuilds the `blanks` array correctly (matches the fix already in `csv-import.functions.ts`).

## How it works

- Pure client-side: iterates `categories` from `src/data/categories.ts`, calls the existing `loadTopicFileForAdmin(slug)` for each topic, runs the same row-builder used by `exportData("csv")` in `admin-kb20.questions.$topic.tsx`.
- Extract that row-builder into `src/lib/admin/csv-export.ts` so both the per-topic page and the new bulk page share one implementation (no drift between single and bulk exports).
- ZIP via the `jszip` package (tiny, browser-safe). Add it with `bun add jszip`.
- Progress UI: shows `Exporting 23 / 84 topics…` while it loops, with a per-topic error list at the end (e.g. "topic X: file not found") so missing mocks don't silently disappear.

## Files

- new `src/lib/admin/csv-export.ts` — shared `buildTopicCsv(topic, file)` and `flattenBlanksRow(q)` helpers.
- edit `src/routes/admin-kb20.questions.$topic.tsx` — replace its inline CSV builder with the shared helper (no behavior change).
- edit `src/routes/admin-kb20.import-export.tsx` — add the "Bulk CSV export" section with the three buttons + category select + progress.
- edit `src/routes/admin-kb20.index.tsx` — add a tile linking to the bulk export.
- `package.json` — add `jszip`.

## Out of scope

- No server function / GitHub commit — this is download-only.
- No schema changes.
- Per-topic Export CSV button stays exactly where it is.
