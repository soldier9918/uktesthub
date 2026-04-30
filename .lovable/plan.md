## Goal

Fill every "Soon" slot in the **Driving & Transport** category — 45 mocks per topic, 24 questions per mock.

## Scope

| Topic | Existing | To generate |
|---|---|---|
| driving-theory | 21 | 24 |
| hazard-perception | 0 | 45 |
| road-signs | 0 | 45 |
| motorcycle-theory | 0 | 45 |
| **Total** | **21** | **159 mocks (≈3,816 questions)** |

## Approach

Use the existing `scripts/generate_mocks.py` as-is. It is already configured for these four topics, calls the Lovable AI Gateway with `google/gemini-3-flash-preview`, writes per-mock JSON incrementally to `src/data/mocks/<topic>.json`, and is fully resumable. The mocks loader picks up new files via Vite glob, so each new mock removes its "Soon" badge automatically — no UI changes needed.

## Steps

1. Confirm `LOVABLE_API_KEY` is present in the sandbox.
2. Launch the generator in the background, logging to `/tmp/gen-driving.log`:
   ```
   python scripts/generate_mocks.py \
     --topics driving-theory hazard-perception road-signs motorcycle-theory \
     --start 1 --end 45 --delay 1.5 \
     > /tmp/gen-driving.log 2>&1 &
   ```
3. Verify it has started (PID alive, log shows first request).
4. Poll progress sparingly (count tests per JSON file) to keep build-credit overhead low.
5. Report back when complete, or sooner if the run halts on 402 (credits) or persistent 429 (rate limit).
6. If it halts on 402: tell you exactly how many mocks landed, and the exact one-line resume command after you top up Cloud & AI balance.

## Caveats

- **Hazard perception** mocks will be text MCQs about anticipating developing hazards — useful revision, not a replacement for the real video-clip test.
- **Road signs** mocks will be text-only (the prompt forbids image references). An image-based variant is a separate feature.
- **AI cost:** ~159 generations on the cheapest Flash-tier model. Likely small; may be partly or fully absorbed by your $1/month free AI balance. Real spend visible at **Settings → Cloud & AI balance**.
- **Runtime:** roughly 30–60 minutes unattended.
- **Failure mode:** any halt is non-destructive — saved mocks stay saved, resuming is one command.

## Out of scope

- All other categories — they continue to show "Soon".
- Image-based road-signs quizzes, real hazard-perception video clips, UI changes.