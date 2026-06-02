# Driving Theory — real exam mode

Only the **Exam mode** button (on every Driving Theory mock card 1–45) changes. The 45 numbered Mock Tests themselves and their Practice mode stay exactly as they are today.

## What changes for the user

When the user clicks **Exam mode** on any Driving Theory mock:

- 50 questions drawn at random from the full driving-theory bank (~1,302 questions).
- All 50 are unique (no repeats within a session).
- 57-minute countdown timer.
- Pass mark = 43/50 (86%) — shown on screen and used for the pass/fail badge at the end.
- A fresh random set is picked every time the user starts the exam.

The "Start exam" card on the intro screen will show "50 questions · 57 min · Pass 43/50" so it's obvious.

## What does NOT change

- Mock Test 1..45 cards, titles, and order — untouched.
- Practice mode on every mock still runs the fixed 24 questions for that mock with explanations.
- All other topics (Hazard Perception, Motorcycle, LGV, HGV, PCV, ADR, Driver CPC, etc.) — completely untouched.
- The CSV import / question bank / admin tools — untouched.

## Technical plan

1. **`src/data/mocks/index.ts`** — add `buildRandomExamQuiz(topicSlug, { count, timeLimitSec, passMarkPct, title, description })`:
   - Calls existing `loadTopicFile(topic)`, requires v2 (bank) shape.
   - Fisher-Yates shuffles `bank`, takes the first `count` entries → guaranteed unique.
   - Maps each through the existing `rawToQuestion` converter and attaches `sourceId` (same pattern as `mockToQuiz`).
   - Returns a `Quiz` with `slug: "${topic}-exam"`, the requested `timeLimit` and `passMark`, and a synthetic title.
   - Falls back to `undefined` if the topic isn't v2 or has fewer than `count` bank questions.

2. **`src/components/QuizRunner.tsx`** — extend the exam launch flow:
   - When the user clicks "Start exam" AND `quiz.topic === "driving-theory"`, call `buildRandomExamQuiz("driving-theory", { count: 50, timeLimitSec: 57 * 60, passMarkPct: 86, title: "Driving Theory Exam", description: "Real-test format — 50 questions, 57 minutes, pass 43/50." })`.
   - Swap the active quiz to the returned exam quiz (new local state `activeQuiz`, defaulting to the prop `quiz`).
   - Re-initialise `answers`, `revealed`, `timeLeft`, `current`, `finished` to match the new quiz length / timeLimit.
   - All other topics keep the existing behaviour (exam mode = the mock's 24 questions, timed).
   - The percent-based pass check (`percent >= quiz.passMark`) already lines up: 43/50 = 86%, exam quiz carries `passMark: 86`.

3. **`ModeSelect` UI** — when `quiz.topic === "driving-theory"`, replace the Exam mode subtitle/chips with the real-exam stats ("50 questions · 57 min · Pass 43/50"). Practice card and Mock Test 1..45 lists are unchanged.

4. **Result screen** — already shows `score / quiz.questions.length` and the pass/fail badge from `quiz.passMark`, so it will read "43 / 50" and "Pass" / "Fail" correctly with no extra work.

## Out of scope (confirmed)

- No changes to mocks 2..45 content, order, or shuffling.
- No changes to any non-driving-theory topic.
- No DB or admin changes.
