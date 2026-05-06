## Goal

Add a second action button **"Complete Regeneration"** next to the existing **"Regenerate as unique"** on the Similar Questions page. It should:

1. Generate a **completely new** question on the same concept — without showing the source to the AI (so it's not a reword).
2. Check uniqueness against **every question in the whole category** (all sibling topics), not just the current topic.
3. Save as an override + audit log, same persistence as today.

The existing "Regenerate as unique" button stays unchanged (rewrite-style, topic-scoped check).

## Behaviour comparison

| | Regenerate as unique (existing) | Complete Regeneration (new) |
|---|---|---|
| AI sees source? | Yes, told "don't paraphrase" | No — only concept label + avoid-list |
| Uniqueness check | Same topic only | Whole category (all topics in category) |
| Reject threshold | Jaccard ≥ 0.80 | Jaccard ≥ 0.65 (stricter) |
| Max attempts | 3 | 5 |
| Output | Override + audit row | Override + audit row (mode = "complete") |

## Implementation outline

### 1. Server function — new `completeRegenerateQuestion`

`src/lib/server-fns/similarity.functions.ts`:
- Accepts: `accessToken`, `topic`, `topicTitle`, `categoryTitle`, `source`, `categoryBlobs[]` (replaces `existingBlobs`).
- Step A — extract concept: quick `gemini-2.5-flash` call returning a 3–8 word concept label from the source.
- Step B — generate fresh: `gemini-2.5-pro` prompt that **only** receives the concept label + category/topic + a small "avoid" list (the 15 most lexically similar existing question stems in the category). Source question/options/explanation are NOT in the prompt.
- Step C — uniqueness gate: Jaccard against all `categoryBlobs`; reject ≥ 0.65; rotate scenario angle (urban/rural/motorway/night/weather/learner/etc.) per attempt; up to 5 attempts.
- Step D — save override + insert audit row with `mode = "complete"`.

### 2. Client — new button + category loader

`src/routes/admin-kb20.similar.tsx`:
- Add **"Complete Regeneration"** button (variant `secondary`) next to existing button on each pair row.
- Before calling, build `categoryBlobs` by loading every topic file in the same category (reuse the same loader the page already uses for the current topic, iterating over `category.topics`).
- Show progress toast ("Scanning {N} questions across category…") while building blobs.
- On success: show diff, Approve / Revert (same UX as existing).

### 3. DB — small migration

Add to `question_regenerations`:
- `mode text default 'rewrite'` — values: `rewrite` | `complete`
- `concept text` — extracted concept label, useful for audit/diff display
- `scope text default 'topic'` — values: `topic` | `category`

### 4. Audit display

Show mode + concept + scope on the post-regenerate diff so you can confirm it stayed on-topic.

## Out of scope

- Cross-category uniqueness (would need to load entire bank).
- Embedding-based similarity (still trigram Jaccard).
- Bulk "Complete Regenerate" across many pairs at once.
