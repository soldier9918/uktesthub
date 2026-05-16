## Problem

Five "professional driving" topics added recently are listed under **Driving & Transport** (car/motorcycle DVSA theory category), but **HGV/LGV & Logistics** already covers the same qualifications. Result: duplicate cards across categories and a misplaced section ("Driving & Transport" should stay focused on DVSA car/bike theory).

## Changes

### 1. `src/data/categories.ts` — Driving & Transport
Remove the five professional topics so the category contains only:
- `driving-theory`, `hazard-perception`, `road-signs`, `motorcycle-theory`

### 2. `src/data/categories.ts` — HGV/LGV & Logistics
Keep the existing 5 topics, and add the genuinely new ones (deduped):
- Keep: `driver-cpc-module-2`, `driver-cpc-module-4`, `adr-dangerous-goods`, `forklift-theory`, `transport-manager-cpc`
- Add: `transport-manager-cpc-road-haulage` (different to base Transport Manager CPC — road haulage specialism)
- Add: `d1-minibus-theory-test` (no existing equivalent)
- Add: `driver-cpc` (umbrella Driver CPC practice — distinct from Module 2 / Module 4 specific banks)

### 3. Dedupe — delete the redundant duplicate topics
These point at the same qualification as the existing HGV entries, so remove them entirely (data, SEO entries, stub mock JSON, sitemap will follow automatically):
- `forklift-flt-theory-test` → use existing `forklift-theory`
- `adr-dangerous-goods-test` → use existing `adr-dangerous-goods`

Keep `driver-cpc` and `transport-manager-cpc-road-haulage` because they target distinct keywords (general "Driver CPC practice" and "Transport Manager CPC Road Haulage" specifically) — both move to HGV/LGV.

### 4. Topic SEO + stub mocks
- Remove `src/data/topic-seo.ts` entries for the two deleted slugs.
- Delete `public/mocks/forklift-flt-theory-test.json` and `public/mocks/adr-dangerous-goods-test.json`.
- Remove the two slugs from `src/data/mocks/mock-index.json`.

### 5. No other category mismatches found
Audited remaining new topics:
- `nhs-psychometric-tests` → NHS category ✓
- `gre-practice`, `gmat-practice` → Admissions ✓
- `toefl-ibt`, `pte-academic` → English Language Tests ✓

## Net result
- Driving & Transport: back to 4 clean car/bike topics.
- HGV/LGV & Logistics: 8 topics (5 existing + 3 added).
- 2 duplicate topics removed; sitemap drops ~92 URLs (2 topics × (1 topic + 1 guide + 45 mocks)).

## Question
For `d1-minibus-theory-test` — D1 minibus is technically a licence category like car/bike, but in practice it's pursued by professional drivers (community transport, care work). I'm placing it in HGV/LGV alongside other commercial licences. Confirm or move it back to Driving & Transport?
