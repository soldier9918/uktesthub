## Goal

Add the 30 SEO article titles from your brief as fully-written blog posts in `src/data/blog.tsx`, each following the structure you specified:

1. Intro (100–150 words)
2. Practice Questions (10–20)
3. Answers + explanations
4. Tips to pass
5. CTA: "👉 Take full mock test here" linking to a `/quiz/...` slug
6. Internal links to the relevant `/category/...` and `/topic/...` pages

These will appear automatically on `/blog` (the index already maps `getAllPosts()`) and at `/blog/$slug`. No route, layout, or component changes needed.

## What gets added

All 30 articles, written in full (intro + practice Qs + answers + tips + CTA), grouped by section:

**Driving Theory (10)** — hero: `cat-hero-driving.jpg`, category `"Driving"`
1. `uk-driving-theory-questions-2026` — UK Driving Theory Questions 2026 (Free Practice Test)
2. `50-uk-road-signs-you-must-know` — 50 UK Road Signs You Must Know (With Meanings)
3. `driving-theory-test-uk-complete-guide` — Driving Theory Test UK: Complete Guide to Pass First Time
4. `hardest-uk-driving-theory-questions` — Hardest UK Driving Theory Questions (With Answers)
5. `uk-hazard-perception-test-tips` — UK Hazard Perception Test Tips to Pass Easily
6. `driving-theory-mock-test-uk` — Driving Theory Mock Test UK (Real Exam Questions)
7. `uk-road-signs-quiz-100-percent` — UK Road Signs Quiz: Can You Get 100%?
8. `most-common-driving-theory-mistakes` — Most Common Driving Theory Mistakes (UK Learners)
9. `uk-driving-theory-pass-mark-explained` — UK Driving Theory Pass Mark Explained (2026 Update)
10. `free-driving-theory-practice-test-uk` — Free Driving Theory Practice Test UK (Updated 2026)

**Life in the UK (10)** — hero: `cat-hero-citizenship.jpg`, category `"Citizenship"`
11. `life-in-the-uk-test-questions-and-answers-2026`
12. `50-life-in-the-uk-questions-you-must-know`
13. `hardest-life-in-the-uk-test-questions`
14. `life-in-the-uk-test-practice-free`
15. `uk-citizenship-test-guide-pass-first-time`
16. `life-in-the-uk-test-pass-mark-explained`
17. `british-citizenship-test-questions-2026`
18. `how-to-pass-life-in-the-uk-test-quickly`
19. `life-in-the-uk-mock-test-2026-edition`
20. `common-life-in-the-uk-test-mistakes-to-avoid`

**CSCS / Job Tests (5)** — hero: `cat-hero-career.jpg`, category `"Careers"`
21. `cscs-test-questions-and-answers-2026`
22. `cscs-mock-test-free-uk`
23. `how-to-pass-cscs-test-first-time`
24. `most-common-cscs-test-questions-explained`
25. `cscs-card-test-practice-questions-uk`

**NHS / Careers (3)** — hero: `cat-hero-nhs.jpg`, category `"NHS"`
26. `nhs-numeracy-test-questions-and-answers`
27. `nhs-interview-questions-and-answers-uk-guide`
28. `nhs-literacy-test-practice-with-answers`

**IELTS / English (2)** — hero: `cat-hero-english.jpg`, category `"English"`
29. `ielts-listening-practice-test-free`
30. `ielts-grammar-test-questions-beginner-to-advanced`

## Article structure (applied to every post)

Each post body uses this exact skeleton so the SEO recipe from your brief is consistent:

```text
<intro 100–150 words, with primary keyword in first sentence>

<h2>Practice Questions</h2>
<ol> 10–15 numbered MCQs with 3–4 options each </ol>

<h2>Answers & Explanations</h2>
<ol> matching numbered answers, each with a 1–3 sentence explanation </ol>

<h2>Tips to Pass</h2>
<ul> 5–7 actionable tips </ul>

<h2>Take the full mock test</h2>
👉 <Link to /quiz/...-mock-1> Take full mock test here </Link>

<p>See more in <C slug="driving">Driving & Transport</C> · <T slug="driving-theory">all driving theory tests</T></p>
```

## Internal linking (per your strategy)

Every article links to:
- the relevant **category** page via `<C slug="...">` (driving, citizenship, english, careers, nhs, education)
- the relevant **topic** page via `<T slug="...">` (driving-theory, road-signs, hazard-perception, life-in-the-uk, ielts, etc.)
- a real **mock quiz** via `<Link to="/quiz/$slug" params={{ slug: "driving-theory-mock-1" }}>` for the CTA
- 1–2 sibling **blog** posts via `<B slug="...">` for topical clusters (e.g. the 10 driving articles cross-link)

I'll only link to quiz slugs that exist in `src/data/mocks/` (currently `seru.json`; for driving/life-in-uk/cscs/etc. I'll point to the canonical `*-mock-1` slug shape that `listMockSlots` already generates — these resolve through the existing quiz route once the JSON is added; until then, the link still renders, just like other topic links).

## Metadata for each post

Every post gets:
- `description` — 150–160 chars, keyword-rich (used for `<meta>` and OG)
- `excerpt` — short hook for blog index cards
- `datePublished` — staggered across late April / early May 2026
- `readingMinutes` — calculated from body length (typically 6–10)
- `tags` — 2–4 relevant tags
- `category` — one of the existing strings already used in `blog.tsx`
- `hero` — reused category hero image (no new assets needed)

The existing `pageMeta` + `articleSchema` JSON-LD on `/blog/$slug` will pick all of this up automatically.

## Files changed

- `src/data/blog.tsx` — append 30 new entries to the `blogPosts` array. No other files touched. No new assets, no new routes, no new dependencies.

## Out of scope (call out explicitly)

- I will **not** generate the 30 underlying mock JSON files for driving/life-in-uk/cscs/etc. — those are large data sets and a separate task. The articles will link to the canonical `-mock-1` slug for each topic so the CTA pattern is in place for when each mock dataset lands.
- I will **not** redesign the blog index or post layout — only content is added.

After approval I'll write all 30 articles in one pass.
