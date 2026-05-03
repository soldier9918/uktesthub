## Add 5 new test categories

Bringing the homepage from 19 → 24 cards. HGV/LGV goes in first; the other four follow in the same pass so the grid stays balanced.

### New categories & topics

**1. HGV / LGV & Logistics** (`hgv-logistics`)
- Driver CPC Module 2 (Case Studies)
- Driver CPC Module 4 (Practical Demonstration Theory)
- ADR Dangerous Goods Awareness
- Forklift Truck Theory (RTITB / ITSSAR)
- Transport Manager CPC Practice

**2. Care & Social Work** (`care-social-work`)
- Care Certificate (15 Standards)
- Level 2 Adult Social Care
- Safeguarding Adults
- Medication Awareness in Care
- Social Work England Readiness

**3. Beauty & Wellbeing** (`beauty-wellbeing`)
- Level 2 Beauty Therapy Theory
- Barbering Level 2 Theory
- Nail Technician Theory
- Infection Control for Beauty
- Hairdressing Level 2 Theory

**4. Retail & Customer Service** (`retail-customer-service`)
- Retail Level 2 Knowledge
- ABTA Travel Agent Practice
- Customer Service Level 2
- Visual Merchandising Basics
- Age-Restricted Sales (Challenge 25)

**5. Animal Care & Veterinary** (`animal-care`)
- RVN Pre-Registration Theory
- Dog Grooming Theory
- Animal First Aid
- Canine Behaviour Basics
- Equine Care Theory

### What gets created per category

For each of the 5 categories:
- Flat illustrated PNG icon (`src/assets/icon-{slug}.png`) matching the existing premium style
- Hero JPG (`src/assets/cat-hero-{slug}.jpg`) for the category page
- Entry in `src/data/categories.ts` with description, topics, icon key, accent colour
- Lucide icon key registered in `src/components/CategoryIcon.tsx`
- Topic SEO entries in `src/data/topic-seo.ts` for each topic slug
- Category SEO entry in `src/data/category-seo.ts`
- Stub mock JSON files in `src/data/mocks/` so practice/exam mode loads cleanly (initially small bank — full assembly via `scripts/generate_mocks.py` follow-up)
- Topic requirements added to `scripts/topic-requirements.json` so the mock generator knows the target counts

### Order of execution

1. HGV/LGV & Logistics — full build first, verified end-to-end (homepage card → category page → topic → quiz → practice/exam mode)
2. Care & Social Work
3. Beauty & Wellbeing
4. Retail & Customer Service
5. Animal Care & Veterinary

### Out of scope (separate follow-up)

- Filling each new mock to its full 45-mock target (handled by the existing `generate_mocks.py` pipeline once the requirements + raw question banks are in place)
- Image-question road sign work (already in flight on a separate track)

### Technical notes

- Accents will be distributed across `coral / gold / navy / success` so adjacent cards on the grid don't clash
- Icon keys use new lucide names (`Truck`, `HandHeart`, `Scissors`, `ShoppingBag`, `PawPrint`) added to the `iconMap` in `CategoryIcon.tsx`
- Hero images generated at 1600×900 to match existing assets
- Each topic gets a route automatically via the existing `/topic/$slug` and `/quiz/$slug` dynamic routes — no new route files needed
