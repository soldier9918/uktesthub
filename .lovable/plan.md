## 1. Unify blog & guide fonts

**Problem:** Blog hero uses `font-display` (Space Grotesk uppercase) for the H1, but inside the article body H2/H3 also use `font-display` uppercase — while paragraphs use DM Sans. The mismatch between bold uppercase display headings inside long-form prose looks inconsistent with the rest of the guides.

**Fix in `src/styles.css` (`.blog-article`):**
- Use the body font (`--font-sans`, DM Sans) for `h2`, `h3`, `h4` inside `.blog-article` so all article text shares one family.
- Remove `text-transform: uppercase` from `.blog-article h2`.
- Keep weight (700/800) and the coral left-border accent for hierarchy.
- Apply the same to the static guide pages (`PageLayout` / routes like `seru-tfl.tsx`) by using the same `.blog-article` class or a shared `.guide-prose` class.

**Also in `src/routes/blog.$slug.tsx` and `src/routes/blog.index.tsx`:**
- Switch the hero `<h1>` from `font-display ... uppercase` to the body font, sentence case, keeping bold weight, so the hero title matches the article body.

Result: every guide/blog page uses one consistent typeface (DM Sans) at varied weights/sizes — no mixed display/sans look.

## 2. Fix misleading "X Tests" tile labels on the homepage

**Problem:** Each category tile shows `{c.topics.length} Tests` (e.g. "4 Tests"), but each topic actually contains up to 45 mock tests, plus other quizzes. The number is misleading.

**Fix in `src/routes/index.tsx` (Popular Categories grid, ~line 213):**
- Replace `{c.topics.length} Tests` with the topic names themselves, e.g. a small list/chips:
  - For Driving & Transport tile: `Theory · Hazard · Road Signs · Motorcycle`
  - For Professional tile: `CSCS · SIA · SERU · Food Hygiene · First Aid`
- Render as a comma- or dot-separated single line under the description, or as small pill chips, instead of the misleading count badge.
- Keep the CTA affordance by changing the bottom button text to `Explore →` (no number).

This removes the wrong count and makes each tile genuinely different by surfacing the real topics.

## 3. Full-width quiz layout, ad moved below questions

**Problem:** In `src/routes/quiz.$slug.tsx` the quiz uses a 2-column grid (`lg:grid-cols-[1fr_300px]`) with a sidebar ad, and a leaderboard ad sits ABOVE the question. Questions feel cramped and require scrolling past the ad.

**Fix in `src/routes/quiz.$slug.tsx`:**
- Remove the top `<AdSlot size="leaderboard" className="mb-8" />` above the QuizRunner.
- Remove the 2-column grid; render the QuizRunner full-width inside a wider container.
- Widen the QuizRunner container in `src/components/QuizRunner.tsx` from `max-w-3xl` to `max-w-5xl` so questions stretch comfortably across the screen.
- Add a `useEffect` in `QuizRunner` that calls `window.scrollTo({ top: 0, behavior: 'smooth' })` whenever `current` changes (and when entering Results), so each new question/results screen starts at the top.
- After the quiz card, render the moved ad: a leaderboard `AdSlot` below the question card, plus the existing related-quizzes panel as a horizontal section below (not a sidebar).

Result: question takes the full reading width, advert sits below the fold, and every question scrolls to the top.

## 4. SERU dropdown "fill-the-blanks" question type

**Goal:** Add a new question format where a sentence has 1–3 blanks, each filled by selecting a word from a per-blank dropdown (matching the PCO-Direct sample shown in the screenshot). Used inside SERU mock tests alongside multiple-choice questions.

### Data model changes (`src/data/quizzes.ts` and `src/data/mocks/index.ts`)

Extend the `Question` type with a discriminated union:

```ts
type MCQ = {
  type?: "mcq"; // default
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  signType?: string;
};

type FillBlanks = {
  type: "fill-blanks";
  id: number;
  // Sentence with placeholders like: "Ridesharing is {{0}} people who do not {{1}} each other ..."
  template: string;
  prompt?: string; // e.g. "Select the words from the dropdowns to complete the sentence."
  blanks: { options: string[]; correctIndex: number }[];
  explanation: string;
};

export type Question = MCQ | FillBlanks;
```

Update `mockToQuiz` in `src/data/mocks/index.ts` to pass through fill-blanks questions unchanged.

### JSON authoring

Create `src/data/mocks/seru.json` with the topic `seru` and 45 tests. Each test mixes MCQs and fill-blank questions, e.g.:

```json
{
  "type": "fill-blanks",
  "template": "Ridesharing is {{0}} people who do not {{1}} each other pay separate fares and travel together in the same {{2}}.",
  "prompt": "Select the words from the dropdowns to complete the sentence.",
  "blanks": [
    { "options": ["where", "when", "if"], "correctIndex": 0 },
    { "options": ["know", "like", "trust"], "correctIndex": 0 },
    { "options": ["vehicle", "queue", "office"], "correctIndex": 0 }
  ],
  "explanation": "TfL defines ridesharing as separate fares paid by people who don't know each other travelling in the same vehicle."
}
```

For the first delivery: seed ~5 real fill-blank SERU questions per test (plus existing MCQs to reach 24/test). Remaining 44 tests can use the same generator pattern as `scripts/generate_mocks.py`.

### Renderer changes (`src/components/QuizRunner.tsx`)

- Detect `q.type === "fill-blanks"` and render a `FillBlankQuestion` sub-component:
  - Parse `template` and split on `{{n}}` markers, interleaving text spans with `<select>` dropdowns styled like the screenshot (rounded border, navy ring on focus).
  - Track per-blank selections in component state (`number[]`), persisted into `answers[current]` as either a JSON string or a new parallel array.
  - In Practice mode: after all blanks chosen, mark correct/incorrect per dropdown (green/red border) and show explanation.
  - In Exam mode: only store answers, evaluate at end.
- Update `score` calculation: a fill-blanks question is correct only when ALL blanks match `correctIndex`.
- Update Results review to show the chosen vs correct word for each blank.

### Storage shape

Change `answers` state from `(number | null)[]` to `(number | number[] | null)[]` to hold either a single MCQ index or an array of dropdown indices.

## Files to change

- `src/styles.css` — unify article fonts, drop uppercase H2.
- `src/routes/blog.$slug.tsx`, `src/routes/blog.index.tsx` — non-uppercase hero H1 in body font.
- `src/components/PageLayout.tsx` — apply same `.blog-article`/`.guide-prose` class so static guides match.
- `src/routes/index.tsx` — replace "X Tests" with topic chip list / different CTA.
- `src/routes/quiz.$slug.tsx` — remove top ad, drop sidebar grid, ad+related below.
- `src/components/QuizRunner.tsx` — wider container, scroll-to-top on question change, fill-blanks renderer & scoring.
- `src/data/quizzes.ts` — extend `Question` union with `FillBlanks`.
- `src/data/mocks/index.ts` — pass-through fill-blanks in `mockToQuiz`.
- `src/data/mocks/seru.json` (new) — initial SERU mocks with mixed question types.
- `scripts/generate_mocks.py` — extend to optionally emit fill-blank items (follow-up).
