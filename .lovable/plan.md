## Overview

Two changes:
1. **Mock tests** — every topic across all 8 categories gets **45 mock tests × 24 questions**, generated via Lovable AI. Category pages get redesigned to look like the screenshot (clean grid of "Test 1, Test 2, …" cards with progress bar — no Easy/Medium/Hard).
2. **Category hero images** — each category page gets a unique themed photo behind the navy hero band.

---

## 1. Mock test generation

### Scope
~30 topics × 45 mocks × 24 questions = **~32,400 questions total**.

### Approach
Run a **one-off generation script** (not at runtime) using the AI Gateway skill, then commit the output as static JSON. Runtime stays fast and free; nothing depends on Lovable AI in production.

- For each topic, call `google/gemini-3-flash-preview` with a structured-output schema and a topic-specific system prompt (e.g. "You are an examiner writing UK Driving Theory questions in DVSA style…").
- Generate 45 mock tests per topic in batched calls (one mock per request → ~1,350 total requests, throttled with `--delay`).
- Write results to `src/data/mocks/<topic-slug>.json` (30 files, one per topic).
- Each mock = `{ slug, topic, mockNumber, title, questions: [{question, options[4], correctAnswer, explanation}] × 24 }`.

### Code changes
- **`src/data/quizzes.ts`**: remove the `difficulty` field from `Quiz` (or keep optional for backward compat). Add a loader that imports all 30 JSON files and exposes `getMocksByTopic(topicSlug)` returning the 45 mocks.
- **`src/routes/category.$slug.tsx`**: replace current quiz card grid with a **per-topic section** showing the 45 mocks in the screenshot's style:
  - 3-column grid of cards
  - Each card: title (e.g. "Driving Theory Test 1"), thin progress bar, "0 / 24" counter
  - No difficulty badges, no time/pass-mark chips
  - Persist completion state in `localStorage` keyed by mock slug so the progress bar reflects the user's best score
- **`src/routes/quiz.$slug.tsx`**: ensure it can load any of the new mock slugs (pattern: `<topic>-mock-<n>`, e.g. `life-in-the-uk-mock-7`).

### Cost / time note
~1,350 AI requests will take ~20–30 min and consume Lovable AI credits. If credits run low, generation will pause; we resume from where it stopped (script writes incrementally per topic).

---

## 2. Category hero background images

Generate one cinematic, on-brand photo per category using `google/gemini-3-pro-image-preview`, save to `src/assets/`, and use as the hero background on `category.$slug.tsx` (same treatment as the homepage hero: cover image + navy gradient overlay for text legibility).

| Category | Image concept |
|---|---|
| Driving | UK motorway at dusk, road signs, steering wheel POV |
| Citizenship | Union Jack draped over Westminster, warm light |
| English | Open dictionary + Big Ben in soft focus |
| Education | British schoolchildren in uniform / classroom with chalkboard |
| Career | Modern London office workers, glass skyline |
| Professional | Construction worker with hi-vis + hard hat on a London site |
| NHS | NHS nurse in scrubs, hospital corridor, soft blue tones |
| Fun | Colourful UK pop-culture collage, tea + biscuits, red phone box |

**Code change** — `category.$slug.tsx` hero section: swap the flat `bg-gradient-hero` for `<img src={categoryHero} className="absolute inset-0 ..."/>` + dark navy gradient overlay (mirror of `index.tsx` hero pattern). Add a `heroImage` field to each category in `src/data/categories.ts` mapping to the imported asset.

---

## File summary

**Created**
- `scripts/generate-mocks.ts` — one-off generator (run via `bun`)
- `src/data/mocks/<topic>.json` × 30
- `src/assets/cat-hero-driving.jpg` … `cat-hero-fun.jpg` × 8

**Edited**
- `src/data/quizzes.ts` — load JSON mocks, drop difficulty from card UI
- `src/data/categories.ts` — add `heroImage` per category
- `src/routes/category.$slug.tsx` — new mock-grid layout + photo hero
- `src/routes/quiz.$slug.tsx` — verify dynamic slug loading works

---

## Execution order
1. Generate the 8 hero images (fast, ~2 min).
2. Update `categories.ts` + `category.$slug.tsx` hero + new mock-grid layout (using mock-data fallback so UI is testable immediately).
3. Run the mock generation script in the background; topics light up as their JSON file lands.
4. Final pass: confirm all 1,350 mocks load and the quiz runner handles them.