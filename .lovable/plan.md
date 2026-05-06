# Similar Questions Detector + Unique Regenerator

Goal: find questions that overlap (exact or paraphrased) and let you regenerate any question into a brand-new, unique one — with semantic similarity check before saving, audit trail, and review queue.

## 1. New page: `/admin-kb20/similar`

File: `src/routes/admin-kb20.similar.tsx` (gated by `AdminGate`).

Controls:
- Scope: All categories / single category / single topic (matches Search page UX).
- Comparison field set: **Question + all options + explanation** (per your choice).
- Lexical similarity threshold slider (0.50–0.95, default 0.72).
- "Cross-topic" toggle (default on) — flag duplicates that span topics, not just within one topic.
- "Run scan" button with progress bar.

Output: a ranked list of **similarity pairs** (or clusters), each row showing:
- Topic + ID for both questions
- Side-by-side diff of question text (highlighted overlap)
- Lexical score, AI confidence score, AI verdict (`duplicate` / `near-duplicate` / `distinct`)
- Per-row actions: **Open in editor**, **Regenerate A**, **Regenerate B**, **Mark as not duplicate** (suppresses future flag)

## 2. Two-stage similarity detection

**Stage 1 — lexical (in-browser, fast):**
- Build a normalized text blob per question = `question + options.join(" | ") + explanation`, lowercased, punctuation stripped, stopwords removed.
- Compute trigram Jaccard similarity for every pair within scope. Use a token-prefix inverted index so we only score candidate pairs sharing ≥2 trigrams (keeps it tractable across thousands of questions).
- Keep pairs with score ≥ threshold.

**Stage 2 — AI confirmation (Lovable AI Gateway, batched):**
- For each surviving pair, call `google/gemini-2.5-flash` with a strict JSON-schema response: `{ verdict: "duplicate"|"near-duplicate"|"distinct", confidence: 0..1, reason: string }`.
- Batch ~20 pairs per request to control cost; show running cost estimate and let admin cancel.
- Store the AI verdict alongside the lexical score in component state (no DB persistence for scans — scan is on-demand).

## 3. "Mark as not duplicate" suppression list

New table `similarity_suppressions`:
- `id uuid pk`, `topic_a text`, `qid_a text`, `topic_b text`, `qid_b text`, `created_by uuid`, `created_at timestamptz`
- Unique index on the canonicalized (sorted) pair.
- RLS: admins manage; anyone can read (matches existing override pattern).
- Scan results filter out any pair in this list.

## 4. Regenerate-as-unique workflow

Per-row "Regenerate" button opens a confirmation drawer that shows the source question + a "Generate" action. On submit:

1. Build a context payload for the AI: topic name, subtopic/category, original question, options, correctAnswer, explanation, difficulty (if present), question type.
2. Call Lovable AI (`google/gemini-2.5-pro`) via a server function with system prompt enforcing your requirements:
   - Generate a completely new question on the same topic/concept.
   - Do NOT paraphrase the source. New wording, structure, and example.
   - Produce options matching the original `type` (mcq → 4 options + 1 correct; multiple-response → respect original count, etc.).
   - Single correct answer unless the type allows multiple.
   - UK-specific, exam-realistic tone.
   - Preserve difficulty.
   - Unique explanation.
   - Randomise the correct-answer index (server randomises after generation).
   - Return strict JSON via tool-calling schema.
3. **Server-side uniqueness gate** before saving:
   - Embed the candidate (`text-embedding`-style approach via Lovable AI; if not available, fall back to trigram Jaccard against the topic's full bank including overrides).
   - Compare against every question in the same topic (and optionally cross-topic).
   - If max similarity ≥ 0.80 → reject and re-generate (max 3 attempts).
   - If 3 attempts fail → return the best candidate flagged `low_confidence: true`.
4. Save:
   - Upsert into `question_overrides` (existing table) with the new question/options/correctAnswer/explanation/imageAlt — image is preserved from source.
   - Insert audit record into new table `question_regenerations` (see §5).
   - If `low_confidence`, also insert into a review queue flag (`needs_review = true` on the audit row).
5. UI shows the diff (old vs new) with **Approve**, **Regenerate again**, **Revert** buttons. "Revert" deletes the override row, restoring the original.

## 5. Audit trail table `question_regenerations`

- `id uuid pk`
- `topic text`, `question_id text`
- `source_question jsonb` (full original snapshot for audit)
- `generated_question jsonb` (full new snapshot)
- `similarity_max numeric` (highest similarity vs bank)
- `attempts int`
- `needs_review boolean default false`
- `model text`
- `created_by uuid`, `created_at timestamptz default now()`
- RLS: admins read/insert/update; nobody else.

A new tab on the page, **"Review queue"**, lists rows where `needs_review = true` with Approve / Reject / Regenerate-again actions.

## 6. Server function

`src/server/regenerate.functions.ts`:
- `scanSimilarPairs({topic?, category?, threshold, fields})` — optional server endpoint if browser-side perf becomes an issue (initial version stays client-side).
- `regenerateUniqueQuestion({ topic, questionId })` — runs the AI generation + uniqueness gate + override upsert + audit insert. Uses `requireSupabaseAuth` + admin role check.

Reads the source question from `loadTopicFileForAdmin` + `applyOverrideToQuestionRecord` (existing helpers).

## 7. Validator integration

Extend `src/lib/admin/validator.ts` with a new `similar-text` finding type that runs lexical-only (no AI) at a fixed 0.85 threshold so the existing Validator surfaces a count and links to `/admin-kb20/similar` for the full workflow.

## 8. Admin index nav

Add a "Similar Questions" tile in `src/routes/admin-kb20.index.tsx` next to "Search" and "Validator".

## Technical details

- **DB migrations**: `similarity_suppressions`, `question_regenerations` (with RLS).
- **AI usage**: Lovable AI Gateway (no extra keys). Models: `gemini-2.5-flash` for pairwise verdicts, `gemini-2.5-pro` for regeneration. Estimated cost surfaced in UI.
- **Performance**: with N≈10k questions, all-pairs is 50M comparisons — the trigram inverted index reduces candidates to ~1–5% before scoring. Web Worker can be added later if needed.
- **Concurrency**: regenerate is one-at-a-time per question (button disabled while in-flight); review queue and scan can run while a regeneration is pending.
- **No changes** to QuizRunner or any user-facing rendering — overrides flow through the existing override system.

## Out of scope (ask later)

- Auto-regenerating an entire batch unattended (current plan keeps a human in the loop).
- Embeddings caching across scans (can be added once we see real volume).
