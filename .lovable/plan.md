## Goal

Add the same rich "About this exam" SEO section (intro, 5–6 numbered sections, FAQ block) to the 11 category pages that don't yet have one, matching the writing style, tone, font and structure used on `/category/taxi-private-hire`, `/category/driving`, `/category/professional`, etc.

## Current state

`src/data/category-seo.ts` already contains long-form entries for: `driving`, `citizenship`, `english`, `education`, `career`, `professional`, `nhs`, `fun`, `taxi-private-hire`. The category route (`src/routes/category.$slug.tsx`) automatically renders the SEO block whenever an entry exists for that slug, so once the data is added, the new sections appear with the same typography and layout as the existing pages.

`fun` is in the SEO file but the `fun` category itself was removed last turn from `src/data/categories.ts`, so its SEO entry is dormant. Per the user's list, `/category/fun` is mentioned but no longer exists — I'll skip it (no action needed).

## What needs adding

Add a new `CategorySeo` entry in `src/data/category-seo.ts` for each of these 11 slugs, matching the structure of existing entries (title, description, intro of 2 paragraphs, 5–6 numbered sections, 6–8 FAQs):

1. `security` — SIA Door Supervisor / CCTV / Close Protection / Top-Up
2. `hospitality` — APLH Personal Licence, Allergen Awareness, HACCP Level 2, Customer Service
3. `construction` — CSCS Operative, CSCS Gold, CITB HSE, IPAF/PASMA
4. `finance` — AAT Level 2, ACCA Foundations, CFA Aptitude, Financial Awareness
5. `it-tech` — CompTIA A+, ITIL 4, Microsoft Fundamentals, Cyber Security Awareness
6. `healthcare-entry` — UCAT, BMAT, OET, PLAB 1
7. `teaching` — QTS Numeracy, QTS Literacy, Professional Skills, Safeguarding in Schools
8. `legal` — SQE1 FLK1/FLK2, LNAT, UK Legal System
9. `military-emergency` — Army BARB, Police PIRT, Police SEARCH, Firefighter NFSAT
10. `maritime-aviation` — PPL Air Law, PPL Meteorology, RYA Day Skipper, ATPL Basics
11. `government` — Civil Service Judgement (CSJT), CS Verbal, CS Numerical, Border Force

Each entry will follow the established style:
- UK English, plain language, ~800–1,100 words total
- Sections: "What the test actually involves", "What's tested / covered", "How to study and pass first time", "Common mistakes to avoid", "Why active practice testing works", and where relevant "Booking, fees and what to expect on the day"
- 6–8 plain-language FAQs covering pass marks, fees, validity, format and a "are these free?" closer
- Real UK exam facts (pass marks, fees, awarding bodies, governing legislation) — no fabricated stats

## Files

- `src/data/category-seo.ts` — single edit, append 11 new entries inside the existing `categorySeo` record

No route, component or styling changes are needed. The category page template already renders the SEO block, breadcrumb schema and FAQ schema for any slug that has an entry.
