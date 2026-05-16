## Goal

Two fixes for all practice/exam tests:

1. **Strip the "<Test Name> practice question N: " prefix** from every stub question and ensure the remaining sentence starts with a capital letter.
2. **Show the test name as a bold centered label** between the "Question X of Y" counter (left) and the Report button (right) inside the quiz runner header, so users always see which test they're on.

## Files affected

### 1. Clean question text (stub mocks)

Run a one-off script over these 7 files that contain the prefixed stub questions:

- `public/mocks/d1-minibus-theory-test.json`
- `public/mocks/driver-cpc.json`
- `public/mocks/gmat-practice.json`
- `public/mocks/gre-practice.json`
- `public/mocks/nhs-psychometric-tests.json`
- `public/mocks/professional-skills-teachers.json`
- `public/mocks/transport-manager-cpc-road-haulage.json`

For every `bank[].question` (and any `tests[].questions[].question` in v1 files), apply:

```
re.sub(r'^.*?practice question\s*\d+\s*:\s*', '', text, flags=re.IGNORECASE)
```

then uppercase the first character. Example outcome:

- Before: `"D1 Minibus Theory practice question 2: full revision content for this topic is being prepared. Which option best reflects safe, lawful UK practice for this topic area?"`
- After:  `"Full revision content for this topic is being prepared. Which option best reflects safe, lawful UK practice for this topic area?"`

Explanations are not prefixed, so they are left alone.

### 2. Show test name in quiz header

In `src/components/QuizRunner.tsx`, around line 316–339:

- Resolve the display title from `quiz.topic` by looking it up in `categories.ts` (find the topic whose `slug === quiz.topic` and use its `title`). Fall back to a prettified slug if not found.
- Update the header row to a 3-column layout: `Question N of M` on the left, the bold test title centered, and the Report button + practice/exam badge on the right. On narrow viewports the title wraps below.

```text
[ Question 3 of 24 ]   [ **D1 Minibus Theory Test Practice** ]   [ Report  •  Practice mode ]
```

Implementation: small helper `getTopicDisplayTitle(slug)` exported from `src/data/categories.ts` (iterates `categories.flatMap(c => c.topics)` once) so the runner doesn't duplicate lookup logic.

No data/auth/SEO changes — purely content cleanup and a presentational tweak to one component.

## Verification

- Reload `/quiz/d1-minibus-theory-test-mock-1`: question 1 should read `"Full revision content for this topic is being prepared. …"` and the header should show **D1 Minibus Theory Test Practice** centered in bold.
- Spot-check one mock from each of the other 6 affected JSON files.
- `rg "practice question \d+:" public/mocks/` should return zero matches afterwards.
