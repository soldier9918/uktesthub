## Goal
Make the live quiz display the exact `question` text from the CSV/JSON for every question, including road-sign image questions.

## Root cause
`src/lib/overrides.ts` has `hideRoadSignAnswerInPrompt` (lines 30–35), which is applied to every road-signs quiz in `applyOverrides`. For any `image-question` with an image, it overwrites the stored prompt with the hardcoded string `"What does this road sign mean?"` — so CSV edits to those question texts never appear on the live quiz.

## Change
In `src/lib/overrides.ts`:
- Delete the `hideRoadSignAnswerInPrompt` helper.
- Simplify `applyOverrides` to return the quiz unchanged (it currently only exists to apply that rewrite; the overrides map is already a no-op).

No other files need changes — `describeQuestion` in the admin panel was already fixed in the previous turn, and the CSV import / commit pipeline already writes the real text to JSON.

## Verification
1. Open a road-sign image question in the live quiz that has custom CSV wording (e.g. `rs-im-0022`) — prompt should match the CSV exactly.
2. Open the same id in the admin panel — same text shown.
3. Other topics (theory, hazard-perception, etc.) unaffected since the rewrite only fired for `road-signs`.
