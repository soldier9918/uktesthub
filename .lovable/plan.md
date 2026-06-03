# IELTS Writing Exam Mode

The current IELTS Writing "exam mode" reuses the MCQ runner, which doesn't fit how Writing actually works. Writing needs a separate typed-essay experience with its own timer, word counts, and AI-based band score at the end.

## What changes the user sees

On every IELTS Writing level page (A1–C2), the Exam Mode card opens a Writing-specific intro screen with the supplied copy and a **Start IELTS Writing Exam** button. Before starting, the user picks one option:

- IELTS Academic Writing
- IELTS General Training Writing

The exam then opens a full-screen writing workspace:

```text
┌─────────────────────────────────────────────────────────┐
│  IELTS Writing Exam · [Academic | General]    ⏱ 59:42  │
├─────────────────────────────────────────────────────────┤
│  [ Task 1 (20 min) ] [ Task 2 (40 min) ]                │
├─────────────────────────────────────────────────────────┤
│  Task 1 prompt (table / chart / letter brief)           │
│  Write at least 150 words.                              │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ <textarea>                                      │    │
│  │                                                 │    │
│  └─────────────────────────────────────────────────┘    │
│  Words: 132 / 150 min                ⚠ below target     │
├─────────────────────────────────────────────────────────┤
│           [ Save draft ]   [ Finish & Mark ]            │
└─────────────────────────────────────────────────────────┘
```

- Single 60-minute master timer (the 20/40 split is guidance shown in the tab labels and intro, not enforced — that matches real IELTS).
- Live word counter per task, with target threshold (150 / 250) and a "below target" hint.
- Drafts auto-saved to `localStorage` keyed by topic + set, so refresh / accidental navigation doesn't lose work.
- "Save draft" is a manual confirm; "Finish & Mark" submits both answers for AI marking. Timer hitting 0 auto-submits.
- One randomly selected question set per attempt, drawn from the bank for that variant (Academic or General).

## Results screen

No pass/fail. Shown after AI marking returns:

> **Your Writing Practice is Complete.**
> You have completed your IELTS Writing practice test. Review your answers carefully and check your work for task response, structure, vocabulary, grammar, spelling and clarity.
>
> *Estimated self-review only — IELTS Writing is officially marked by trained examiners.*

Then the AI band card:

- **Estimated IELTS Writing Band Score: 6.5 / 9**
- Per-task breakdown:
  - Task 1 — Band X.X
    - Task Achievement — Band X
    - Coherence & Cohesion — Band X
    - Lexical Resource — Band X
    - Grammatical Range & Accuracy — Band X
    - Examiner-style feedback (2–4 sentences)
  - Task 2 — same shape
- Overall = round to nearest 0.5 of `(Task1 + 2*Task2) / 3` (Task 2 is weighted double, per IELTS).
- Disclaimer: *This is a practice estimate only. Official IELTS Writing scores are awarded by trained IELTS examiners using the official band descriptors.*
- The user's own answers are shown below each task for review, alongside the prompt.

## Where the questions live

Seed both variants with the two question sets you provided, and structure the file so more can be added later without code changes:

```
src/data/english/ielts-writing-prompts.ts
  export const IELTS_WRITING_PROMPTS = {
    academic: [
      { id: "acad-1", task1: {...}, task2: {...} },
      { id: "acad-2", task1: {...}, task2: {...} },
    ],
    general: [
      { id: "gen-1",  task1: {...}, task2: {...} },
      { id: "gen-2",  task1: {...}, task2: {...} },
    ],
  }
```

Each task = `{ prompt: string, minWords: 150 | 250, minutesGuidance: 20 | 40 }`. Task 1 prompts can include simple table data rendered as a real `<table>` (the Academic Set 1 prompt uses one).

## AI marking

Use the Lovable AI Gateway (already wired in this project) via a TanStack server function — no extra API key needed.

- New file: `src/lib/ielts-writing.functions.ts` exporting `markIeltsWriting` (`createServerFn`).
- Input: `{ variant: "academic" | "general", task1: { prompt, answer }, task2: { prompt, answer } }` validated with Zod (answer max ~5000 chars).
- Calls `https://ai.gateway.lovable.dev/v1/chat/completions` with `google/gemini-2.5-pro` (Writing assessment benefits from the stronger reasoning model), `stream: false`, using tool-calling to force a structured JSON return.
- Tool schema returns `{ task1: { taskResponse, coherenceCohesion, lexicalResource, grammaticalRange, feedback }, task2: {...same...}, overallFeedback }` with each criterion in 0–9, half-band steps.
- Server adds the IELTS band-descriptor system prompt and the variant ("Academic Task 1 = report; General Task 1 = letter; Task 2 = essay") so the model marks against the right rubric.
- Compute overall band on the server: `round_to_half((t1_avg + 2 * t2_avg) / 3)` where each task average is the mean of its 4 criteria rounded to nearest 0.5.
- Surface 429 ("Too many requests — please try again in a moment") and 402 ("AI credits exhausted") as friendly toasts on the client.

## Components

- New `src/components/IeltsWritingExam.tsx` owns the whole flow: variant picker → 2-task workspace → submitting state → results.
- New `src/components/IeltsWritingResults.tsx` renders the band card + per-criterion breakdown + answers.
- `QuizRunner.tsx` change is minimal: when `examConfig.kind === "english"` and `english.skill === "writing"`, render `<IeltsWritingExam level={...} />` instead of building/loading an MCQ exam quiz. The existing `ExamIntroScreen` shows the supplied Writing intro copy (Writing-specific `intro`, `heading`, `buttonLabel`, `timeLabel: "2 tasks · 60 minutes"`).

## Out of scope

- Persisting attempts/scores to the database (results stay local for now).
- Editing or extending the question banks beyond the 2 seed sets per variant — easy to add later.
- Other IELTS skills (Listening, Reading, Speaking) — those keep the existing MCQ exam runner.

## Open question

You only listed Academic and General writing prompts together. Do you want users to **choose Academic vs General Training on the intro screen** (one Writing exam mode covers both, user picks at start) — or do you want **separate "IELTS Academic Writing" and "IELTS General Training Writing" sections** in the site nav with their own pages? The plan above assumes the first (single intro → variant chooser), which is simpler and matches the rest of the IELTS structure on the site today. Tell me if you'd rather split them into separate routes and I'll adjust.
