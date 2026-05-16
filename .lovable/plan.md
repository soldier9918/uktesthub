## Goal

Finish Phase 1 mock generation by running it in **small batches** that fit within a single tool-call timeout, so each batch completes synchronously before I hand control back. You say "continue" to advance to the next batch.

## Current state

- ✅ `hgv-theory-test` — bank + 45 mocks complete, published to `public/mocks/`.
- ✅ English PTE + Duolingo — 48 bank files written under `public/english-mocks/`.
- 🔄 `lgv-theory-test` — partial bank (~400/600 questions), no mocks yet.
- ⏳ 11 topics not started: `pcv-theory-test`, `driver-cpc-module-1`, `transport-manager-cpc-passenger-transport`, `adr-core-module-practice`, `adr-tanks-practice`, `adr-packages-practice`, `nhs-situational-judgement-test`, `sssts-practice-test`, `smsts-practice-test`, `aws-cloud-practitioner`, `az-900-azure-fundamentals`.

## Batch plan (12 topics remaining, 1 topic per batch)

Each batch runs **one topic end-to-end** in the foreground using the existing resumable pipeline:

```text
python3 scripts/generate_mocks.py bank     --topic <slug> --delay 1
python3 scripts/generate_mocks.py assemble --topic <slug>
python3 scripts/generate_mocks.py validate --topic <slug>
cp src/data/mocks/<slug>.json public/mocks/<slug>.json
```

The `bank` step is the long one (~600 AI calls, ~20–25 min per topic). It's resumable, so if a single call times out at the 10-min cap I just re-invoke and it tops up where it left off — that's the "continue" you'd send.

### Proposed batch order

1. `lgv-theory-test` (resume — already partial)
2. `pcv-theory-test`
3. `driver-cpc-module-1`
4. `transport-manager-cpc-passenger-transport`
5. `adr-core-module-practice`
6. `adr-tanks-practice`
7. `adr-packages-practice`
8. `nhs-situational-judgement-test`
9. `sssts-practice-test`
10. `smsts-practice-test`
11. `aws-cloud-practitioner`
12. `az-900-azure-fundamentals`

### After each batch I'll report

- Bank questions written (target ~600).
- Mocks assembled (target 45 × 24).
- Validation result.
- Confirmation it's published to `public/mocks/`.

## Notes

- No source code or schema changes — just running the existing generator.
- Mock-index and sitemap already include all 13 slugs from earlier work; no edits needed unless validation flags a gap.
- If a single `bank` call hits the per-call timeout mid-topic, you just say "continue" and I re-run the same command (it resumes).

Ready to start with batch 1 (`lgv-theory-test`) on your approval.
