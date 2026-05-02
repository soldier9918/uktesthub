## Goal

Make every mock test in the app match the `REQUIREMENTS.xlsx` spec for image_question weighting, with a real PNG for every image question.

## Current state vs spec

The spreadsheet defines, per topic: total questions per mock (1,080), number of mocks (45), and an `image_question[X%]` weighting. From that, the expected number of image questions per topic ranges from 108 (border-force, 10%) to 756 (road-signs, 70%). Total across 28 topics: **~7,830 image questions**.

Today the mock JSONs contain ~4,929 questions with an `imageDescription` field, and only 3 actual PNG files exist (bmat pilot). So we have two gaps:

- **Content gap**: ~2,900 image questions that need to be authored to hit the spec'd weighting in each mock
- **Image gap**: ~7,827 PNGs to generate and wire into the JSON `image` field

## Plan

### Phase 1 — Audit per-mock weighting (read-only, ~5 min)

Walk every `src/data/mocks/<topic>.json`, count image questions per mock against `expected_per_mock = mock_size * (img_pct/100)`, write a CSV report to `/mnt/documents/image_question_audit.csv`. This shows you exactly where each mock is short before any writes happen.

### Phase 2 — Author missing image questions (text only, no PNGs yet)

For every mock that's short of its image quota, generate new questions via Lovable AI (text gateway, cheap & fast) with:
- `type: "image_question"`
- A detailed `imageDescription` field (what the PNG should depict)
- 4 options + correct answer + explanation
- Topic-appropriate content drawn from existing questions as style examples

Save after each topic so timeouts don't lose work. Estimated ~2,900 new questions.

### Phase 3 — Generate PNGs in topic batches

For each topic, generate one PNG per image question to `public/quiz-images/<topic>/<questionId>.png` and set `q.image` to that path. Use **Nano Banana 2** (`google/gemini-3.1-flash-image-preview`) by default — it gives noticeably cleaner diagrams than Nano Banana 1, which matters for circuits, signs, anatomy, etc. Batch with per-image checkpointing.

**Important caveat I want you to acknowledge before I start Phase 3**: AI cannot reliably reproduce legally precise UK road signs, real London street maps (topographical), or DVSA hazard-perception stills. For these four topics — `road-signs`, `motorcyclce-theory` (note the typo in the spec), `topographical`, `hazard-perception` — the generated images will be plausible approximations, not exam-accurate. Recommended options:
- (a) Generate anyway and accept approximations
- (b) Skip image generation for these four; rewrite their image questions as self-contained text
- (c) You source official assets later and we wire them in

### Phase 4 — Verify

Spot-check 3 random images per topic via the preview, run a script that confirms every `imageDescription` question now has a working `image` path and the file exists on disk.

## Scope & cost reality check

- ~2,900 text questions: small AI cost, fast (~30 min wall clock with checkpoints)
- ~7,800 PNGs at Nano Banana 2 rates: this is the expensive part. Roughly ~3–5s per image plus rate limits, so 6–12 hours of wall clock spread over many sandbox turns. Material credit spend — please confirm you're OK with this before Phase 3 starts.

## Order of execution

1. Phase 1 audit, share CSV with you
2. **Pause for your approval** on (a) whether to top up the content to spec or accept current counts, (b) which model, (c) what to do about the four "risky" topics
3. Phase 2 across all approved topics
4. Phase 3 in priority order you choose (suggest: driving-theory first since that's what you've been spot-checking)
5. Phase 4 verification

## Technical notes

- Question authoring uses `google/gemini-3-flash-preview` via the AI gateway (text), structured tool-calling for clean JSON
- Image generation uses `google/gemini-3.1-flash-image-preview` by default (Nano Banana 2)
- Per-image and per-topic checkpointing — sandbox timeouts won't lose progress
- All edits go to `src/data/mocks/*.json`; PNGs to `public/quiz-images/<topic>/`
- Note spec typo: `motorcyclce-theory` in spreadsheet vs `motorcycle-theory` in JSON. I'll match by best fit.
- `uk-geography` is severely underpopulated (296 of 1,080 questions). Authoring will need to fill the topic broadly, not just image questions, if you want it spec-compliant.
