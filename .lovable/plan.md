
# Plan: Question-bank pipeline + 8 question types, driven by the spreadsheet

The spreadsheet has 89 topics across 16 categories. Every topic needs a **650-question pool** that gets rotated across **45 mocks of 24 questions** (1,080 slots per topic, ~1.66× reuse). Each topic specifies its own mix of **up to 8 question types** with weighting.

The current app only supports two types (`mcq` + `fill-blanks`) and stores fully-baked mocks. This plan rebuilds the pipeline around a **per-topic question bank** and adds runtime support for all 8 types — without throwing away the 30+ mock JSON files we've already generated.

---

## 1. Save the spreadsheet as the source of truth

Convert the spreadsheet into `scripts/topic-requirements.json`:

```json
{
  "fire-safety": {
    "category": "professional",
    "title": "Fire Safety Awareness",
    "subject": "...existing prompt subject...",
    "poolSize": 650,
    "mocks": 45,
    "questionsPerMock": 24,
    "weights": { "multiple_choice": 0.60, "image_question": 0.25, "true_false": 0.15 }
  },
  ...
}
```

Generated once from the XLSX so the spreadsheet is the single source of truth. The existing `TOPICS` array in `scripts/generate_mocks.py` becomes a fallback for prompt subjects only.

---

## 2. Add the 8 question types end-to-end

Extend `src/data/quizzes.ts` `Question` union and `QuizRunner.tsx` to support every type from the sheet:

| Type | Storage shape | UI |
|---|---|---|
| `multiple_choice` | question, 4 options, correctIndex | radio list (existing) |
| `image_question` | + `image: "/images/<topic>/<file>.png"`, `alt` | image above options |
| `true_false` | statement, correct: true/false | two big buttons |
| `dropdown_blanks` | template with `[[1]]` markers, blanks: `[{options, correctIndex}]` | inline `<select>` (we already do this for `fill-blanks` — keep `fill-blanks` as alias) |
| `drag_drop_blanks` | template + word bank | drag on desktop, **tap-to-select on mobile** (per spec) |
| `multiple_response` | options + `correctIndices[]` (≥2) | checkbox list, all-or-nothing scoring |
| `hot_spot` | `image`, `hotspots: [{x,y,w,h, label?}]`, `correctIndex` | click image, coords stored as 0–1 ratios so it's responsive |
| `numeric_entry` | `answer: number`, optional `tolerance` or `acceptableRange:[min,max]`, optional `unit` | number input |

All types must carry `explanation`, `questionType`, and image questions must carry `alt`. The Results / Review pages get a small switch so every type renders correctly.

---

## 3. New per-topic file format: `bank` + `mockSlots`

Replace the current `src/data/mocks/<topic>.json` with:

```jsonc
{
  "topic": "fire-safety",
  "version": 2,
  "bank": [
    { "id": "fs-0001", "type": "multiple_choice", "question": "...", "options": [...], "correctAnswer": 1, "explanation": "..." },
    { "id": "fs-0002", "type": "image_question", "image": "/images/fire-safety/extinguisher-co2.png", "alt": "...", ... },
    ...
  ],
  "mocks": [
    { "mockNumber": 1, "title": "Fire Safety Awareness Test 1", "questionIds": ["fs-0001", "fs-0457", ...] },
    ...
  ]
}
```

Rules baked into the assembler:
- **No duplicate question inside a single mock.**
- Each question is reused across mocks **only after the rest of the bank in its weight slot has been used** (round-robin per type).
- Each mock matches the topic's weighting (e.g. fire-safety mock = 14 mcq + 6 image + 4 true_false).
- Option order is **shuffled deterministically per mock** (seeded by mock number) so the correct index is recomputed safely — never lost.

`src/data/mocks/index.ts` is updated to read either v1 (legacy baked mocks) or v2 (bank + slots) and produce the same `Quiz` shape, so existing routes keep working.

---

## 4. Generator rewrite (`scripts/generate_mocks.py`)

New subcommands:

- `python scripts/generate_mocks.py bank --topic fire-safety` — fills the 650-question bank for one topic, batched by type. Resumable: writes incrementally, skips types already at quota.
- `python scripts/generate_mocks.py assemble --topic fire-safety` — pure local script (no AI calls), shuffles bank into 45 mock slots respecting all rules above.
- `python scripts/generate_mocks.py validate --topic fire-safety` — produces the validation report the spec asks for: total questions, total mocks, per-mock counts, type distribution, duplicate warnings, missing explanations / images / alts, invalid answers.
- `python scripts/generate_mocks.py migrate-legacy` — for the topics already generated (driving-theory, fire-safety, life-in-the-uk, etc.), pulls existing 1,080 questions into a v2 bank file, dedupes, then tops up with AI to reach 650 unique items per type and re-assembles. Per spec line 123: *"For mocks already completed, just change some questions to reflect the weighting requirements."*

The AI prompt is generated **per question type** with a strict tool schema for that type, so Gemini returns correctly-shaped JSON every time.

Cost estimate: 650 questions × 89 topics ÷ 24-per-call ≈ **~2,400 AI calls total**. At today's ~$0.009/call on Gemini 3 Flash that's ~$22 across the whole platform — much cheaper than the current ~$0.40 × 89 = $36 path, with **6× more variety** per topic.

---

## 5. Image-question pipeline

Per spec:
- Folder structure: `public/images/<topic>/<slug>.png`
- Filenames must match JSON references exactly
- Every image question carries `alt`

For topics that need real photos/signs (road-signs, fire-safety, hazard-perception, topographical, ipaf-pasma, etc.) the generator writes a **manifest of needed images** to `scripts/image-manifest/<topic>.json` listing `{filename, alt, description}`. We then either:
- Reuse what's already in `src/data/road-sign-gallery.ts` / `road-markings-gallery.ts` for road signs, **or**
- Fetch high-res CC0/public-domain images via web search and store them under `public/images/<topic>/`.

Hot-spot images get an extra `hotspots` array with normalised 0–1 coordinates so we don't break responsiveness.

---

## 6. Rollout order

I'll execute in this order so we can ship value quickly and stop at any point:

1. **Foundation** — generate `topic-requirements.json` from the XLSX, extend the `Question` type union, add renderers for the 6 new types in `QuizRunner`, update the Results / Review pages.
2. **Bank format** — make `src/data/mocks/index.ts` understand v2 (bank + slots) alongside v1.
3. **Generator rewrite** — `bank` / `assemble` / `validate` subcommands, with per-type tool schemas.
4. **Pilot one category end-to-end** — `fire-safety` (already partly done): migrate legacy → top up bank → assemble → validate → eyeball in preview.
5. **Roll across all 89 topics**, in priority order: Driving → Citizenship → Professional → English → Education → Career → NHS → Taxi & Private Hire → Security → Hospitality → Construction → Finance → IT → Healthcare Entry → Teaching → Legal → Military → Maritime → Government.
6. **Image fetching + hotspot authoring** done as a final pass per topic that needs it (so text-only topics ship first).
7. **Disclaimer banner** on the quiz page: *"Practice-style questions, not official exam questions."*

---

## Open questions before I start

1. **Cost ceiling** — building all 89 banks will spend ~$20–25 of AI credits. Want me to (a) do all 89 in one go, (b) do it category-by-category and stop after each for your approval, or (c) start with a specific category?
2. **Images** — for topics that need photos (fire extinguishers, road signs, scaffolding, etc.), are you happy for me to source CC0 / public-domain images from the web and store them in `public/images/<topic>/`? Otherwise I can keep it text-only and skip `image_question` weighting until you supply images.
3. **Existing baked mocks** — for the 5–6 topics already completed (driving-theory, life-in-the-uk, etc.) I'll migrate them into the new bank format, dedupe, and top up rather than regenerate from scratch. OK?
4. **Spreadsheet typo** — row 4 has `motorcyclce-theory` (extra "c"). I'll normalise it to `motorcycle-theory` (matches the existing topic slug). OK?
5. **Legacy `mockNumber` URLs** — the existing slugs like `fire-safety-mock-1` will continue to work (the v2 assembler still produces 45 numbered mocks). Confirmed no need to change URLs.

Once you answer these (especially #1 and #2), I'll start at step 1 and work through.
