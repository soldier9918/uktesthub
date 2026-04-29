## Add 7 new categories to the homepage

Bringing the total from **12 → 19 categories**. Grid will reflow nicely (4 cols × 5 rows on lg, with the last row partially filled — or 3 cols × 7 rows on md).

### New categories

1. **Finance & Accounting** (icon: Calculator, accent: navy)
   - AAT Level 2 Bookkeeping
   - ACCA Foundations (FIA)
   - CFA-Style Aptitude
   - Financial Awareness Quiz

2. **IT & Tech Certifications** (icon: Cpu, accent: success)
   - CompTIA A+ Practice
   - ITIL 4 Foundation
   - Microsoft Fundamentals (MS-900 / AZ-900)
   - Cyber Security Awareness

3. **Healthcare Entry Exams** (icon: Stethoscope, accent: coral)
   - UCAT Practice
   - BMAT Practice
   - OET (Healthcare English)
   - PLAB 1 Sample Questions

4. **Teaching & QTS** (icon: BookOpen, accent: gold)
   - QTS Numeracy Skills Test
   - QTS Literacy Skills Test
   - Professional Skills for Teachers
   - Safeguarding in Schools

5. **Legal & Law** (icon: Scale, accent: navy)
   - SQE1 FLK1 Practice
   - SQE1 FLK2 Practice
   - LNAT Multiple Choice
   - UK Legal System Quiz

6. **Military & Emergency Services** (icon: Siren, accent: coral)
   - Army BARB Test
   - Police PIRT (Initial Recruitment)
   - Police SEARCH Assessment
   - Firefighter NFSAT

7. **Maritime & Aviation** (icon: Plane, accent: success)
   - PPL Air Law
   - PPL Meteorology
   - RYA Day Skipper Theory
   - ATPL Basics Practice

### Files to create

**Hero images (1024×640 JPG, premium photographic style matching existing heroes):**
- `src/assets/cat-hero-finance.jpg`
- `src/assets/cat-hero-it-tech.jpg`
- `src/assets/cat-hero-healthcare-entry.jpg`
- `src/assets/cat-hero-teaching.jpg`
- `src/assets/cat-hero-legal.jpg`
- `src/assets/cat-hero-military.jpg`
- `src/assets/cat-hero-maritime-aviation.jpg`

**Icon PNGs (matching the existing `icon-*.png` flat style):**
- `src/assets/icon-finance.png`
- `src/assets/icon-it-tech.png`
- `src/assets/icon-healthcare-entry.png`
- `src/assets/icon-teaching.png`
- `src/assets/icon-legal.png`
- `src/assets/icon-military.png`
- `src/assets/icon-maritime-aviation.png`

### Files to edit

- **`src/data/categories.ts`** — import the 7 new hero images and append 7 new `Category` entries with the slugs/topics above.
- **`src/components/CategoryIcon.tsx`** — register the 7 new icon keys (`Calculator`, `Cpu`, `Stethoscope`, `BookOpen`, `Scale`, `Siren`, `Plane`) in `iconMap`, mapped to their PNGs.

### Notes

- Slugs are URL-safe and unique; topic slugs follow the existing kebab-case convention so existing routing/quiz lookup logic (`getCategory`, `findTopic`) keeps working with no changes.
- Accents are distributed across the 4 existing tokens (coral / gold / navy / success) so the grid stays visually balanced.
- No homepage layout changes needed — the existing 4-col responsive grid handles 19 tiles cleanly.
- No route file changes needed — categories render dynamically from the data file.