## Confirmations from the code audit

1. **Live quiz source — `public/mocks/*.json` only.**
   `QuizRunner` (`src/components/QuizRunner.tsx:119`) wraps the raw quiz with `applyOverrides`, but after the last change `applyOverrides` in `src/lib/overrides.ts:38` returns the quiz unchanged, and `loadOverrides` returns an empty map. No runtime read of `question_overrides` happens in the player path.

2. **Topic admin page source of truth — `public/mocks/<topic>.json`.**
   `admin-kb20.questions.$topic.tsx` loads questions via `loadTopicFileForAdmin` (in `src/data/mocks/index.ts`), which fetches `public/mocks/<topic>.json` from raw GitHub with a cache-buster (falling back to the deployed static asset). The CSV commit pipeline writes back to the same path.

3. **`question_import_history` — history & rollback only.**
   Only used inside `src/lib/admin/csv-import.functions.ts`: insert on commit, insert+update on rollback, select for the history list. No code path reads it to serve quiz content.

4. **Legacy `question_overrides` table is still wired into many admin routes**
   (`bulk-edit`, `search`, `similar`, `validator`, `diagnostics`, `category-check`, `bulk-duplicate`, `import-export`, `images`, `ImagePicker`, `QuestionEditDialog`, plus the `toggleDisabled`/`Clear bad overrides` handlers in this topic page). The runtime no longer reads any of it, but admin pages still write to it. Those are out of scope for this turn — flag only.

## Change in this turn

Hide the "Clear bad overrides" button on the topic page so it can't be triggered, and mark its handler as deprecated. I'll keep the handler code in place (commented as deprecated) so we have an easy revert if any of the other admin routes still need a one-off cleanup, but the button is removed from the UI.

Files:
- `src/routes/admin-kb20.questions.$topic.tsx`
  - Remove the `<Button>...Clear bad overrides</Button>` block (lines ~779–787) from the toolbar.
  - Add a short comment above `cleanBadOverrides` noting it is deprecated because `question_overrides` is no longer the live source.

## Verification
1. Visit `/admin-kb20/questions/road-signs` — "Clear bad overrides" button is gone; Export CSV / Export JSON / Import CSV remain.
2. Run a CSV import → live quiz reflects the new wording (already confirmed previously).
3. No new TypeScript errors; `cleaning` state and helper still compile (kept for now).

## Out of scope (flag for follow-up)
A full removal of `question_overrides` reads/writes across `bulk-edit`, `search`, `similar`, `validator`, `diagnostics`, `category-check`, `bulk-duplicate`, `import-export`, `images`, `ImagePicker`, and `QuestionEditDialog`, plus dropping the `toggleDisabled` upsert on this page, should be a separate dedicated pass — happy to do it next if you want a clean CSV-only admin.
