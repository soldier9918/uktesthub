## Add "Mock #" filter to admin Questions page

### What changes
On `/admin-kb20/questions/$topic`, add a new dropdown next to the existing filters (search, type, image, usage, status, health) labeled **"All mocks"** with options:
- All mocks (default)
- Mock 1, Mock 2, … through Mock 45 (built dynamically from the topic's `mocks` array, so it works for every topic, not just Life in the UK)

### Behaviour
- When a specific mock is selected, the list collapses to only the questions whose `usedInMocks` includes that mock number.
- Results are sorted by **slot order** (Q1 → Q24) within that mock so the list mirrors the live test order, instead of the default ID order.
- The "650 matching" counter and pagination update accordingly.
- Selecting a mock resets to page 1 (same pattern as other filters).
- Combines with the other filters (e.g. "Mock 1 + image only" still works).

### Where in the file
Single file: `src/routes/admin-kb20.questions.$topic.tsx`
- Add `mockFilter` state (default `"all"`).
- Add the `<select>` in the filter row after the health filter.
- Add the filter+sort step in the existing `effectiveQuestions` / filter pipeline.

No backend, no schema, no other files affected.
