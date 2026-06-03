## Why you don't see it

The IELTS Exam Mode config I added earlier is read by `QuizRunner` via `EXAM_CONFIGS[quiz.topic]`. That only fires when a quiz's `topic` field equals `"ielts"`, which is the `/topic/ielts` page.

The IELTS pages you're actually using live under `/english-language-tests/ielts/<skill>/<level>/...`. Their mock quizzes have `topic = "ielts-<skill>-<level>"` (e.g. `ielts-speaking-a1`), so the lookup misses and no Exam button appears. Also, the exam builder reads from `/mocks/<slug>.json`, but English banks live at `/english-mocks/<test>/<skill>/<level>.json` — a different loader entirely. So even with a matching key, the current builder couldn't load the questions.

## Goal

Show an "IELTS Exam Mode" entry on every IELTS skill+level mock test (Listening, Reading, Writing, Speaking × A1–C2 = 24 combinations), with the intro screen and button copy you supplied, launching a fresh randomised exam pulled from that level's bank (each bank has ~1,000+ questions).

## Changes

### 1. New exam builder for English banks
`src/data/mocks/index.ts` — add `buildRandomEnglishExamQuiz(test, skill, level, opts)`:
- Calls `loadBankFile(test, skill, level)` (from `src/data/english/mocks.ts`).
- Same Fisher–Yates shuffle, take first N.
- Returns a `Quiz` with `topic = "<test>-<skill>-<level>"`, `slug = "<test>-<skill>-<level>-exam"`, `category = "english"`, supplied title/description/time/pass mark.

### 2. Dynamic Exam Config resolution
`src/components/QuizRunner.tsx`:
- Replace `EXAM_CONFIGS[baseQuiz.topic]` with `getExamConfig(baseQuiz.topic)`.
- `getExamConfig` first checks the static map; otherwise matches `^ielts-(listening|reading|writing|speaking)-(a1|a2|b1|b2|c1|c2)$` and returns a dynamically built `ExamConfig` with:
  - `kind: "english"`, `english: { test, skill, level }`
  - Per-skill count + time:
    - Listening: 40Q / 30 min
    - Reading: 40Q / 60 min
    - Writing: 40Q / 60 min (MCQ practice in real Writing duration)
    - Speaking: 40Q / 14 min (matches real Speaking)
  - `passMarkPct: 60`, `passLabel: "Band 0–9 (no fixed pass mark)"`, `timeLabel: <skill-specific>`
  - `heading: "IELTS <Skill> Exam Mode"`, `buttonLabel: "Start IELTS Exam Mode"`
  - `intro`: the 5-paragraph copy you provided (kept identical across skills/levels; the format list lines up with the real test).
- Extend the `ExamConfig` type with optional `kind` + `english` fields.
- In `handleStartExam`, branch on `examConfig.kind`:
  - `"english"` → call `buildRandomEnglishExamQuiz`.
  - otherwise → existing `buildRandomExamQuiz`.

### 3. No UI restructuring needed
`ModeSelect` and `ExamIntroScreen` already render whatever `examConfig` they receive. Once `getExamConfig` returns a value for english topics, the Exam Mode card + intro screen + Start button will appear automatically on every IELTS mock test page.

## Out of scope
- ESOL, TOEFL, LanguageCert, Pearson, etc. (also under `/english-language-tests/`). Only IELTS, per your request.
- Changing the existing `/topic/ielts` config — that stays as-is.
- Real Writing/Speaking task formats (the bank is MCQ; we surface that as MCQ practice within real-test timings).
