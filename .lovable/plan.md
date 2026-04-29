## Goals

1. Show more recommended mock tests at the bottom of a quiz page.
2. Make recommendation tiles uniformly sized (no taller "wrap" tiles like the SERU example).
3. Replace the "Finish early" link with a "Back" button so users can step back through questions.

## Changes

### 1. `src/routes/quiz.$slug.tsx` — better recommendations

- When the current quiz is a mock (slug contains `-mock-`), build the related list from `listMockSlots(quiz.topic)`:
  - Filter to `available` mocks only
  - Exclude the current slug
  - Take up to 8 (was 4)
- Otherwise keep current category-based fallback, but raise the cap to 8.
- Rename the section heading to "More mock tests" when in mock context, else keep "More in {category}".
- Show as `Mock {n}` with `{questionsCount} Qs` subtext for mock recommendations (consistent label, no long wrapping titles).

### 2. Equal-size tiles

Update the `<ul>` grid:
- Use `grid gap-3 sm:grid-cols-2 lg:grid-cols-4` (unchanged columns) but add `auto-rows-fr` on the grid and `h-full flex flex-col justify-between` on the card so every tile fills the row height.
- Truncate long titles with `line-clamp-2 min-h-[2.5rem]` so single-line and two-line titles produce the same card height (fixes the SERU "Mock Test 1" wrapping issue in screenshot 2).

### 3. `src/components/QuizRunner.tsx` — Back button instead of "Finish early"

In the question card footer (around line 194-220):
- Replace the "Finish early" `<button>` with a "Back" button:
  - Disabled when `current === 0`
  - On click: `setCurrent((c) => Math.max(0, c - 1))`
  - Style: ghost/outline button matching the existing Next button family (`inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed`) with a left chevron icon.
- Keep "Check answer" (for fill-blanks practice) and the primary "Next / Finish" button on the right.
- Add `ChevronLeft` to the lucide imports.

No data/schema changes. No new files. Three files touched: the route, the runner component, and (no third — only two).
