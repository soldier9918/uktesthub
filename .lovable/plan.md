## Goal

Replace the homepage hero so the uploaded image *is* the hero. Since the image already contains "Pass your / UK Tests / First Time", the paragraph copy, and the four feature pills (96,000+ Questions, Realistic Exam Format, Instant Results, Updated for 2026), we remove those text overlays from the code. We keep only:

1. The **Start Practice** and **Browse All Tests** buttons (left side, positioned over the dark area of the image).
2. The **Popular Mock Tests** panel on the right (unchanged, with its **Browse all tests** button).

## Changes

**1. Add the asset**
- Copy `user-uploads://d5fe83d3823a4cc49989ea350583e2a7.jpeg` → `src/assets/hero-uk-tests.jpg`.
- Import it in `src/routes/index.tsx` (replacing the current `heroUk` import for the hero section).

**2. Rework hero section in `src/routes/index.tsx` (lines ~127–240)**
- Background `<img>` swapped to the new asset; keep `object-cover object-center`.
- Remove the dark gradient overlay (the uploaded image already has its own dark left side baked in) — or soften it to `from-navy-deep/20 to-transparent` only on small screens where the image crops differently.
- Delete the "Pass your" eyebrow, the `<h1>` "UK Tests / First Time", the descriptive paragraph, and the feature `<ul>` (CheckCircle2 / FileCheck / Timer / CalendarCheck). These are all in the image now.
- Keep the **Start Practice** (anchor to `#popular-categories`) and **Browse All Tests** (`/all-tests`) buttons. Position them in the lower-left area of the hero so they sit roughly under the baked-in feature pills.
- Keep the right-side `<aside>` Popular Mock Tests panel exactly as is.
- Provide a visually-hidden `<h1>` for SEO/a11y (since the displayed H1 is now part of the image): `<h1 className="sr-only">Pass your UK tests first time — practice-style questions, mock tests, instant results</h1>`. The `alt` text on the hero image is also updated to describe the headline.

**3. Responsive behaviour**
- On mobile, the image's text sits on the left third. We keep the buttons stacked below an `aspect-ratio` framed image so nothing important is cropped. On `lg:` the buttons overlay the lower-left of the image and the Popular Mock Tests aside sits on the right as today.

## Out of scope
- No copy changes anywhere else on the homepage.
- No changes to categories, blog, footer, or any other section.
- No changes to consent / banner logic.
