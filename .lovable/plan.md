# Add "Back to all mock tests" link while taking a quiz

Right now, once a user opens a mock test there's no way to return to the list of 45 mocks for that category without finishing the quiz or using the browser back button. The existing "All mock tests" button only appears on the results screen.

## Change

Add a small back link rendered at the top of `QuizRunner`, above the question header row, visible the whole time the user is taking the test (both practice and exam modes, every question, plus the results screen).

- Label: `← Back to all mock tests`
- Style: subtle text link (muted foreground, hover coral), left-aligned, small — not a big CTA, so it doesn't compete with the quiz UI
- Behaviour: standard `<Link>`, no confirm dialog (matches the user's request to simply be able to go back)

## Destination

`QuizRunner` is used by two route families, so the link target is computed per-quiz:

1. **Standard mocks** (`/quiz/$slug` where slug ends in `-mock-N`):
   Strip `-mock-N` and link to `/topic/$slug` — same logic already used by `ResultsCtas` (`parseMockNumber` + `fallbackTopic`).

2. **English language mocks** (`/english-language-tests/$test/$skill/$level/mock-test-$num`):
   The topic slug isn't a `/topic/$slug` route. Add an optional `backTo` prop to `QuizRunner`. The English route file (`src/routes/english-language-tests.$test.$skill.$level.mock-test{-$num}.tsx`) passes `backTo={{ to: "/english-language-tests/$test/$skill/$level", params: { test, skill, level } }}`. When `backTo` is provided, `QuizRunner` uses it; otherwise it falls back to the `/topic/$slug` derivation.

3. **Non-mock quizzes** (rare — the slug has no `-mock-N`): hide the link (nothing meaningful to go back to other than the homepage).

## Files touched

- `src/components/QuizRunner.tsx` — add optional `backTo` prop on the component, render the back link at the top of the returned JSX (and keep showing it on the results screen header area). Reuse `parseMockNumber` for the default.
- `src/routes/english-language-tests.$test.$skill.$level.mock-test{-$num}.tsx` — pass `backTo` into `<QuizRunner>`.

No changes to `/quiz/$slug` route file needed — the default derivation handles it. No new dependencies, no backend changes, no styling token changes.
