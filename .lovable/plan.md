## Goal

Let an admin pick many questions across the bank (within a topic, or across topics) and overwrite them all with one identical question — same text, same options, same correct answer, same explanation, and same image. This lets the same question be repeated across multiple mocks intentionally.

## Where it lives

New admin page: `/admin-kb20/questions/bulk-duplicate` (linked from the AdminGate nav bar and from the existing `Questions` index page).

It does NOT replace the existing single-question editor or the existing find/replace bulk-edit page — it sits alongside them.

## User flow

1. **Pick a source**
   - Option A: paste/type a question ID (e.g. `rs-im-0062`) and click "Load source". The page fetches that question (with overrides applied) and shows the resolved question text, options + correct answer, explanation, and image.
   - Option B: "Use a custom question" toggle. Reveals editable fields (question text, options A–D + correct radio, explanation, image URL + image picker + upload, image alt) so you can compose a brand-new question from scratch with no source.
   - Either way, the chosen content is the **template** that will be written to every selected target.

2. **Pick the targets**
   - Topic dropdown (same `ALL_TOPICS` list used in `bulk-edit.tsx`). Choosing a topic loads its question bank, with overrides applied, into a checklist table.
   - Search box filters by ID / question text / mock number, like the existing topic editor.
   - "Filter by mock" multi-select limits the list to questions used in specific mock numbers.
   - Each row has a checkbox plus the question id, current text snippet, and which mocks it appears in.
   - Bulk controls: select all visible, clear selection, invert. A persistent counter shows e.g. "12 questions selected across 4 mocks".
   - You can switch topics and keep adding selections — the selection set is global, keyed by `topic::question_id`.

3. **Preview**
   - Shows a table: target id, current question (truncated) → new question (truncated), mock usage. Highlights any rows where the source itself is included (skipped — can't overwrite source with itself).
   - Warns clearly: "This will write the same content to N questions. Each one keeps its existing question_id and stays in its current mocks. Original text/options/image are replaced via question_overrides and can be reset per question later."

4. **Apply**
   - Single confirm dialog with the count.
   - Performs an `upsert` into `question_overrides` for every selected `(topic, question_id)` with the template's `question`, `options`, `correct_answer`, `explanation`, `image`, `image_alt`, and `updated_by`.
   - Uses chunked upserts (e.g. 100 rows per request) to stay well under any payload limits.
   - Writes one entry to `admin_audit_log` summarising the operation (source id or "custom", target count, topics touched).
   - On success: shows "Applied to N questions" with a "View one of them on the live site" link, and calls `invalidateOverrides()` so the cached override map in other admin tabs refreshes.

## Safety + UX rules

- Skip targets where `topic::question_id` equals the source — never overwrite the source with itself.
- If a target already has an override, the upsert replaces it. Show a small "(currently overridden)" badge in the preview so the admin sees what they're overwriting.
- "Reset to original" still works per-question via the existing edit dialog (just delete the override row), so this operation is reversible one-by-one.
- Image handling reuses `ImagePicker` and the existing `question-images` storage bucket — same as `QuestionEditDialog`.
- Image type: when the source is text-only and the chosen image is empty, the override row writes `image: null`. When an image is supplied, downstream `applyOverrideToQuestionRecord` already promotes the question type correctly. No data-file mutations needed.
- The page is gated by `AdminGate` like every other `/admin-kb20/*` route, so only admins can reach it.

## Why this works with the current data model

- Mocks are defined in static topic files; each mock references question IDs from the topic's bank. Today the live quiz reads those IDs and applies any matching row from `question_overrides`.
- Writing identical override rows for many IDs makes those slots render identical content at runtime, exactly like the user wants — no schema change, no mock-file edits.
- This means the same "repeated" question keeps its own analytics/report identity per mock while presenting the same content.

## Technical details (for implementation)

- New route file: `src/routes/admin-kb20.questions.bulk-duplicate.tsx` (uses `AdminGate`, `loadTopicFileForAdmin`, `loadOverrides`, `applyOverrideToQuestionRecord`, `invalidateOverrides`, `supabase` client, `ImagePicker`, `Button`, `Input`, `Textarea`, `Checkbox`).
- Reuse the `flatten()` helper pattern from `bulk-edit.tsx` to enumerate `(id, question, options, mockUsage)` per topic, but extend it to also return per-question mock usage (already computed in `admin-kb20.questions.$topic.tsx` — extract that small helper to `src/lib/admin/topic-flatten.ts` and use it from both pages).
- Selection state: `Map<string, { topic: string; questionId: string; preview: string }>` keyed by `${topic}::${questionId}`; survives topic changes.
- Upsert payload shape matches the existing `QuestionEditDialog.save()` call, written in batches of ~100 with `upsert(rows, { onConflict: "topic,question_id" })`.
- Add a link to the new page from `AdminGate`'s top nav and from `admin-kb20.questions.index.tsx` ("Bulk duplicate questions →").

## Out of scope

- No changes to mock files, no new tables, no new RLS policies (existing `question_overrides` admin-only write policy already covers it).
- No changes to the public quiz runtime — it already honours overrides.
- No "merge into one canonical id" — we keep distinct IDs on purpose so analytics, bookmarks, and reports continue to track each slot independently.
