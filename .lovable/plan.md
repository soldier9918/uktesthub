## Task 1 — Remove Lovable badge

Call `publish_settings--set_badge_visibility` with `hide_badge: true` to remove the "Edit with Lovable" badge from the published site (uktesthub.com / uk-test-mastery.lovable.app). Requires Pro plan or higher on the workspace; if the workspace isn't Pro, the call will fail and I'll surface that to you.

No code changes needed for this.

---

## Task 2 — Populate all "Coming soon" mock tests

### Current state
- 32 topics × 45 mocks each = **1,440 total mocks expected**
- Only `driving-theory` has data, with 21 of 45 mocks
- Missing: **1,419 mocks**, each containing 24 questions = **~34,000 AI-generated MCQs**
- Each mock requires one Lovable AI Gateway call returning a structured tool-call payload (already wired in `scripts/generate_mocks.py`)

### How it will run
1. Use the existing `scripts/generate_mocks.py` script (already configured: model `google/gemini-3-flash-preview`, 24 Qs/mock, structured tool-call output, resumable per-topic JSON files in `src/data/mocks/<topic>.json`).
2. Run it in batches per topic via `code--exec` so progress is saved incrementally and any interruption is resumable.
3. Topic files are auto-aggregated by `src/data/mocks/index.ts` (Vite glob), so newly written JSON files appear in the UI automatically — no code changes required.
4. After generation, the "Coming soon" badge in `src/routes/topic.$slug.tsx` will disappear for every populated mock since `available` becomes `true`.

### Important caveats (please read)
- **This will consume a significant amount of Lovable AI credits.** ~1,419 gateway requests using `gemini-3-flash-preview`. If you run out of credits mid-run the script exits cleanly on HTTP 402 and you can top up + resume.
- **It will take a long time.** At ~3–6 seconds per request plus a 1.5s delay, expect roughly **2–4 hours of wall-clock generation**. Each `code--exec` call has a 10-minute hard cap, so I'll have to invoke generation many times in sequence (one topic batch per call, ~10–15 mocks per call).
- **Rate limits (429)** are auto-handled with backoff. Persistent rate limits will slow things further.
- **Quality**: Auto-generated questions are plausible practice content but not officially endorsed by DVSA/Home Office/SIA/etc. The existing disclaimer pages already cover this.

### Suggested approach options
- **A. Full run now** — I generate all 1,419 mocks in sequence over many tool calls. Best result, slowest, most credits.
- **B. Priority topics first** — I generate the most-trafficked topics first (e.g. `driving-theory` to 45, `life-in-the-uk`, `hazard-perception`, `road-signs`, `cscs`, `sia`, `seru`) and you decide whether to continue with the rest.
- **C. Smaller mock count** — Reduce `TOTAL_MOCKS_PER_TOPIC` from 45 → e.g. 10 per topic (32 × 10 = 320 mocks total, ~45 min, far cheaper) and expand later.

### Files affected
- New: `src/data/mocks/<topic-slug>.json` × 31 (one per missing topic), plus appended entries to `driving-theory.json`
- No source code edits needed (aggregation is automatic)
- Possibly a small tweak to `scripts/generate_mocks.py` only if we change the per-topic count

### What I need from you
1. Confirm to **hide the Lovable badge** (Pro plan required).
2. Pick approach **A**, **B**, or **C** for mock generation. If B, confirm the priority topic list. If C, confirm the new per-topic count.