## Goals

1. Every mock test must show its real **24 questions** (not 10).
2. Each category page (Driving, UK Life, English, Education, Jobs, Professional, NHS, Fun) should first show its **topic cards** (e.g. Driving Theory Test, Hazard Perception Test, Road Signs Test, Motorcycle Theory Test). Only after picking a topic do the **45 mock test cards** appear.

## What's actually wrong with #1

There are two `driving-theory-mock-1` definitions:
- A legacy hand-written one in `src/data/quizzes.ts` with **10** questions.
- The new AI-generated one in `src/data/mocks/driving-theory.json` with **24** questions.

`getQuiz()` checks the static array first, so the 10-question version always wins. Card titles also render as "Driving Theory Test **Test** 1" because the topic title already contains "Test".

## Changes

### 1. Fix mock resolution (24 questions everywhere)
- `src/data/quizzes.ts`: remove the legacy mock entries whose slugs collide with the `<topic>-mock-N` pattern (`driving-theory-mock-1`, `life-in-the-uk-mock-1`, and any similar). Keep non-mock quizzes (road-signs identification, daily quiz, warm-ups, etc.) untouched.
- Result: `getQuiz("driving-theory-mock-1")` now resolves through `getMockBySlug` → 24 questions.

### 2. Add a topic-selection step per category

New route: `src/routes/topic.$slug.tsx` → `/topic/<topic-slug>`
- Loader looks up the topic via `findTopic(topicSlug)` from `src/data/categories.ts`.
- Renders the same hero style as the category page (uses the parent category's hero image + topic title).
- Shows the **45 mock test grid** (current `TopicMockSection` content), with breadcrumb: Home › {Category} › {Topic}.

Refactor `src/routes/category.$slug.tsx`:
- Remove the per-topic mock sections.
- Replace with a clean grid of **topic cards** (one card per `category.topics` item). Each card links to `/topic/$slug`.
- Card shows topic title, short description, and "45 mock tests" hint. Cards use the existing card/shadow styling and `accentClasses` for accent color.

### 3. Card labelling fix
- Mock cards display as `"Test {n}"` (not `"{Topic Title} Test {n}"`) — matches the example screenshot and avoids "Driving Theory Test Test 1".
- Section heading on the topic page already reads the topic title, so no context is lost.

### 4. Routing & navigation
- Add `/topic/$slug` to the file-based routes — TanStack Router auto-regenerates `routeTree.gen.ts`.
- Update breadcrumbs and any "More in {Category}" sidebar links on `quiz.$slug.tsx` to also offer a link back to the topic page.

## Files touched

- `src/data/quizzes.ts` — remove colliding legacy mock entries.
- `src/routes/category.$slug.tsx` — replace mock grid with topic-card grid.
- `src/routes/topic.$slug.tsx` — **new** — topic hero + 45-mock grid (extracted from current category page).
- `src/routes/quiz.$slug.tsx` — minor breadcrumb update to include topic link.

## Out of scope

- No changes to mock generation; the existing JSON files already contain 24 questions each.
- No changes to QuizRunner.
