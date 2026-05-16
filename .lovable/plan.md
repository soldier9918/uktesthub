## Goal

Finish populating real question banks and assembled 45‑mock sets for every Phase 1 topic added previously. The earlier background run started but stalled after the first BANK call on `hgv-theory-test` (276/650 questions, 0 mocks assembled, nothing copied to `public/mocks/`). Nothing else has been generated yet.

## Scope

13 net‑new topic banks (each: pool ~650 questions → 45 mocks × 24 questions):

```
hgv-theory-test, lgv-theory-test, pcv-theory-test,
driver-cpc-module-1, transport-manager-cpc-passenger-transport,
adr-core-module-practice, adr-tanks-practice, adr-packages-practice,
nhs-situational-judgement-test, sssts-practice-test, smsts-practice-test,
aws-cloud-practitioner, az-900-azure-fundamentals
```

2 new English test families via `scripts/generate_all_english_mocks.py` extended to include:

```
pte-academic-ukvi  → 4 skills × 6 CEFR levels = 24 banks
duolingo-english-test → 4 skills × 6 CEFR levels = 24 banks
```

(written under `public/english-mocks/{test}/{skill}/{level}.json`)

## Execution plan

1. **Extend the English generator** — add `pte-academic-ukvi` and `duolingo-english-test` to the `TRIPLES` list in `scripts/generate_all_english_mocks.py` and add base‑content variants in `generate_english_mocks.build_bank()` so each test has appropriately flavoured stems.
2. **Resume topic banks** — rerun `scripts/generate_mocks.py bank --topic <slug>` for all 13 topics. The bank generator is resumable and tops up each type bucket to quota, so the existing 276 HGV questions are preserved.
3. **Assemble mocks** — `scripts/generate_mocks.py assemble --topic <slug>` for each topic to produce the 45 × 24 rotation.
4. **Publish** — copy each `src/data/mocks/<slug>.json` to `public/mocks/<slug>.json` so the live site serves them (matches how other topics are served).
5. **Run English generation** — `python3 scripts/generate_all_english_mocks.py` to emit the 48 new English bank files.
6. **Validate** — run `scripts/generate_mocks.py validate --topic <slug>` per topic; spot‑check a couple of English JSON files; confirm `src/data/mocks/mock-index.json` still lists every slug and that `sitemap.xml` includes the URLs.

## How it runs

This is a long job (~700+ AI Gateway calls for topic banks + ~48 for English × multiple internal calls). I'll launch it with `nohup` in the background and stream per‑topic logs into `/tmp/genlogs/`, then poll log tails to confirm completion. I won't block the chat on the full run; I'll report progress and final counts when done.

## Risk / cost note

This will consume a meaningful amount of Lovable AI Gateway credits (rough order: 6–8k completions). The generator is idempotent and resumable, so partial failures are safe to retry.

## Out of scope

- Phase 2 topics (the remaining ~70 from the original brief).
- Any UI / styling changes.
- Re‑generating banks that already exist for other topics.

After your approval I'll launch the background generation and report counts of bank questions, assembled mocks, and English bank files written.
