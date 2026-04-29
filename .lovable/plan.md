## Goal

Make the "What is UK Test Hub?" section on the homepage more presentable with a stronger visual hierarchy: a clear eyebrow label, a larger display heading, a stand-out lead paragraph, well-spaced supporting paragraphs, and the secondary categories (GCSE, CSCS, NHS, professional) lifted out of a long run-on sentence into a tidy 2-column chip list.

## Changes — `src/routes/index.tsx` (lines 378–452)

Replace the current `prose`-based markup with a structured layout:

**Left column (main content):**
- Coral pill eyebrow: "About the platform"
- Large `font-display` H2 (3xl → 4xl) "What is UK Test Hub?"
- Lead paragraph (`text-lg md:text-xl`, muted) — concise pitch about free, no-account practice
- Two body paragraphs (base size, relaxed leading) covering:
  - The core exams (Driving Theory, Life in the UK, IELTS/ESOL) — keep existing inline links, restyled as coral/medium
  - Mobile-friendly, refreshed, instant marking
- Replace the third run-on paragraph with a 2-column grid of link chips for the remaining categories: GCSE & 11+, CSCS & SIA, NHS numeracy & literacy, Professional licensing — each a card with a coral check icon and right arrow

**Right column (aside):**
- Add a green "Why it works" eyebrow pill
- Promote the heading to `text-xl md:text-2xl`
- Keep the two existing paragraphs and the blog CTA, with slightly tighter spacing

No new dependencies. `CheckCircle2` and `ArrowRight` are already imported. Pure presentation change — no data, route, or behaviour changes.
