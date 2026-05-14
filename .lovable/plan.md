## Idea: show users their estimated English level

When a user finishes an English mock test, we already know three things: which **CEFR level** they were practising at (A1–C2), how many of the 24 questions they got right, and which **skill** (listening / reading / writing / speaking / four-skills / speaking-listening). We can turn that into a friendly competency readout instead of just a raw score.

### 1. End-of-test "Your English level" result card

When a user finishes an English mock, replace (or augment) the generic results screen with a **CEFR result card** that shows:

- A big estimated level badge (e.g. **B1 — Intermediate**) with the same contrast colours used on the level picker (A1 red → C2 deep purple).
- The score (e.g. 19 / 24 = 79 %) and a short plain-English description ("You can handle most everyday situations and express opinions on familiar topics").
- A "next step" CTA:
  - **≥ 85 %** → "You're ready to try **{nextLevel}**" with a Link to the next CEFR level's mock list.
  - **60–84 %** → "Keep practising at **{thisLevel}** — try Mock {n+1}".
  - **< 60 %** → "Try **{prevLevel}** first to build confidence" (or "Start at A1" if already A1).
- A small per-question-type breakdown (MCQ x/8, True/False x/2, Fill blanks x/6, Dropdown x/4, Multiple response x/4) so users see *which question style* tripped them up.

Scoring rule for the estimate (simple, transparent):

```text
this level achieved      score ≥ 85% on the level they sat
this level partial       60% ≤ score < 85%
below this level         score < 60%   → suggest level - 1
above this level         score ≥ 85% AND user has passed 3 mocks at this level
                          → suggest level + 1
```

This is purely a frontend/presentation change inside `QuizRunner` (or a small wrapper that detects English mocks via the quiz id prefix `{test}-{skill}-{level}-…`). No backend work required for the basic version.

### 2. Optional: a persistent "My English level" panel

For signed-in users we can persist results so the level estimate isn't lost when they close the tab.

- New table `english_level_attempts` (user_id, test, skill, level, mock_num, score, total, taken_at) with RLS so users only see their own rows.
- After each mock, insert a row (only when `useAuth()` returns a user — anon users still see the result card, just nothing is stored).
- On `/category/english` (and on each test/skill page) show a small **"Your estimated level: B1"** chip per skill, computed as: highest level where the user has ≥ 2 mocks scored ≥ 70 %.
- Optional later: a tiny "Level progress" bar on the level picker showing how many of the 45 mocks at each level the user has cleared.

This is a clean additive feature — no changes to existing routes' behaviour.

### 3. Optional later polish (only if you want it)

- A **"Take a 10-minute placement test"** entry point on `/category/english` that pulls 2 questions from each of A1, A2, B1, B2, C1, C2 of a chosen skill and recommends a starting level — better first-time UX than asking "which level am I?".
- A shareable / printable **"CEFR level certificate"** (just an HTML card the user can screenshot) — light touch, no real accreditation claims, with a clear disclaimer that it's a self-assessment estimate, not an official CEFR certificate.

### Recommended scope for the first pass

Do **#1 only** first — it's the highest-value change, fits in `QuizRunner`'s results screen, needs zero schema work, and immediately answers "what level am I?" for every user including anonymous ones. We can layer #2 and #3 on later if you like the result.

### Technical notes (for the implementation pass)

- Detect English mocks by quiz id prefix (`ielts-`, `esol-`, `toefl-`, `selt-`) so other categories' results screens are untouched.
- Reuse the level palette already defined for the level picker so the result badge matches the picker colours.
- Per-type breakdown comes from iterating `quiz.questions` with the existing `isCorrect()` helper grouped by `q.type`.
- Disclaimer line under the badge: *"Estimated level based on this mock — not an official CEFR assessment."*

### Question for you

Want me to build **#1 (end-of-test CEFR result card)** now, or do you also want **#2 (persisted "My English level" per skill on the dashboard / English landing page)** in the same pass?