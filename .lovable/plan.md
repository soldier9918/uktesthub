## Goal

Generate full 45-mock sets for four categories:

| Category | Topics | Existing | To generate (≈) |
|---|---|---|---|
| career | numerical, verbal, logical, sjt | 0 | 180 |
| professional | food-hygiene, first-aid, fire-safety, manual-handling, health-safety-awareness, gdpr-awareness | 0 | 270 |
| nhs | nhs-numeracy, nhs-literacy, nhs-values, nmc-cbt | 0 | 180 |
| taxi-private-hire | 15 topics, mostly 1/45 each | ~17 | ~658 |

Total ≈ 1,288 mocks (~31,000 questions).

## Approach

Reuse `scripts/generate_mocks.py` — resumable, writes incrementally per mock. Run topic-by-topic in foreground calls; if a 600s timeout hits, re-run the same command and it skips finished mocks.

Order: career → professional → nhs → taxi-private-hire (in the order listed in `src/data/categories.ts`).

Command pattern:
```
python scripts/generate_mocks.py --topics <topic> --start 1 --end 45 --delay 1.5
```
