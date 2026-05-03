## Add a question bank browser route

Add a new route `/admin/questions/$topic` that lists every question in a topic's bank (currently `road-signs`, plus `seru` etc. as they exist in `src/data/mocks/*.json`).

### Page features
- Topic selector at top (links to each topic that has a JSON file).
- Summary stats: total questions, # with images, # text-only, # used across mocks vs orphaned.
- Filter controls:
  - Search box (matches question text / explanation).
  - Type filter (mcq, image-question, true-false, fill-blanks, etc.).
  - "Has image" toggle.
- Paginated table/list, each row showing:
  - ID
  - Question text
  - Type badge
  - Thumbnail image (if any) with broken-image indicator
  - Correct answer highlighted
  - Explanation (collapsible)
  - Which mock test numbers reference it

### Implementation
- New file `src/routes/admin.questions.$topic.tsx`.
  - Loader reads the topic's JSON via the same `import.meta.glob` pattern used in `src/data/mocks/index.ts`.
  - Reuse the V2 bank shape directly (no need to expand into mocks).
  - Compute the "used in mocks" map from `mocks[].questionIds`.
- New index route `src/routes/admin.questions.tsx` listing all available topics with counts.
- Use existing UI primitives (`Table`, `Badge`, `Input`, `Pagination`, `ScrollArea`) — already in the codebase.
- No auth gate (matches current project — everything is public). If you want it gated, say so and I'll add a simple password env-var check.

### Out of scope
- Editing questions from the UI (read-only browser).
- Persisting filter state in the URL (can add later if useful).

After approval I'll implement the two route files.