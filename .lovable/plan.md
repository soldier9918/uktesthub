## Goal

Finish the Driving & Transport category by generating the remaining three topics back-to-back:

| Topic | Existing | To generate |
|---|---|---|
| hazard-perception | 0 | 45 |
| road-signs | 0 | 45 |
| motorcycle-theory | 0 | 45 |
| **Total** | **0** | **135 mocks (3,240 questions)** |

`driving-theory` is already complete (45/45) so it's excluded.

## Approach

Reuse `scripts/generate_mocks.py` exactly as before — it's resumable, writes per-mock JSON incrementally to `src/data/mocks/<topic>.json`, and the Vite glob loader picks up new files automatically (no UI changes).

Because the sandbox kills background processes when a tool call ends, run the script in the **foreground** in sequential calls, one topic per call. Each call writes mocks incrementally to disk, so if any call hits the 60s/600s timeout, the next call resumes where it left off.

## Steps

1. Run hazard-perception (1–45) in the foreground with a 600s timeout.
2. If it didn't finish in one call, re-run with the same args — it skips already-saved mocks.
3. Repeat for road-signs (1–45).
4. Repeat for motorcycle-theory (1–45).
5. After each topic, count `tests` in the JSON to confirm 45/45.
6. Final report: per-topic counts + total questions generated.

Command pattern (one per call):
```
python scripts/generate_mocks.py --topics <topic> --start 1 --end 45 --delay 1.5
```

## Halt conditions

- **402 (out of credits)**: stop, report exactly how many mocks landed across the three topics, give you the one-line resume command.
- **Persistent 429 (rate limit)**: the script already sleeps 30/60/90s and retries; if it still fails I'll bump `--delay` to 3s and resume.
- **Any other failure**: non-destructive — saved mocks stay saved, resume is one command.

## Caveats (same as before)

- Hazard-perception mocks are text MCQs about anticipating developing hazards — useful revision, not a replacement for the real video-clip test.
- Road-signs mocks are text-only (the prompt forbids image references). Image-based variant is a separate feature.
- Estimated runtime: 25–50 minutes of wall-clock across multiple sequential calls.
- Estimated AI cost: ~135 Flash-tier generations, well within your $10 top-up.

## Out of scope

- Other categories (still show "Soon").
- Image-based road-signs or video-clip hazard perception.
- UI changes.