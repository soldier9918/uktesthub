## 1. Align "Explore" buttons across Popular Categories tiles

**Problem:** Tiles have varying content lengths (title wraps, `short` description wraps differently, chip lists differ in row count), so the `Explore` button sits at a different vertical position on each card.

**Fix in `src/routes/index.tsx` (lines 234–272):**
- Make the tile a flex column with `h-full` (already on parent grid, just need each `Link` to stretch).
- Add `flex flex-col h-full` to the tile `Link` (already has `flex flex-col` — add `h-full`).
- Wrap title + description + chips in a content block with `flex-1` so the spacer pushes the Explore button down.
- Add `mt-auto` to the `Explore` span so it always anchors to the bottom of the card.
- Lock the description to a consistent height with `min-h-[3.4em]` (covers up to 3 lines) so short descriptions don't make some tiles drastically shorter.

Result: all "Explore" buttons render at the same baseline regardless of how much text or how many chips appear above them. No visual restyle, just alignment.

## 2. Expand "What is UK Test Hub?" to ~1200 words

**Current:** ~150 words in the left column + ~120 words in the right "Why Practice Tests Work" aside (lines 417–520). Total ~270 words.

**Target:** ~1200 words for the whole section, kept in the same two-column layout so we don't break visual balance.

**Approach in `src/routes/index.tsx` (lines 417–520):**

Keep the existing structure (eyebrow + H2 + lead paragraph, body paragraphs with inline category links, 4-link grid, right-hand aside) and expand the body so it reads as a proper editorial "About" section, not filler.

**Left column (~900 words)** — replace the current 2-paragraph body with a richer flow, broken into clearly spaced paragraphs and a couple of small sub-headings so 900 words doesn't read as a wall of text:

- **Lead** (kept, lightly tightened): one-sentence positioning of UK Test Hub.
- **What we cover** (~250 words): expand the existing inline-link paragraph to walk through every major category — Driving Theory & Hazard Perception, Life in the UK, IELTS / ESOL / English language, GCSE & 11+, CSCS / SIA / professional licensing, NHS numeracy & literacy, plus the "fun" general knowledge tests. Each category gets one or two sentences explaining what it's for and who takes it. Keep the existing inline `<Link to="/category/$slug">` links and add the same pattern for the other categories.
- **Sub-heading: "How our mock tests work"** (~220 words): exam-format fidelity, question-count parity with the real exam, instant marking, per-question explanations, best-score tracking via localStorage, mobile-first design, no account required, no paywall.
- **Sub-heading: "Built for British learners"** (~220 words): UK English throughout, content reviewed against current DVSA/Home Office/Ofqual/awarding-body specifications, regularly refreshed when syllabuses change, accessible design, free forever.
- **Sub-heading: "Who uses UK Test Hub"** (~210 words): learner drivers, ILR/citizenship applicants, international students preparing for English certification, GCSE and 11+ students, jobseekers needing CSCS/SIA cards, NHS candidates, and casual quizzers — one short paragraph per audience.
- Keep the existing 4-link "GCSE & 11+ / CSCS & SIA / NHS / Professional licensing" grid below the prose (already there, no change).

**Right aside (~300 words)** — expand the current "Why Practice Tests Work" card from ~120 to ~300 words, still inside the same `<aside>` so the layout stays:
- Keep the eyebrow, H3, and existing two paragraphs about retrieval practice.
- Add two more short paragraphs: one on **spaced repetition** (drilling weak topics across multiple short sessions beats one long cram), and one on **exam-condition simulation** (timed mocks reduce test-day anxiety and surface pacing issues). Keep the existing "Read revision tips on the blog" CTA at the bottom.

**Word target check:**
```text
Lead                       ~40
What we cover             ~250
How our mock tests work   ~220
Built for British learners ~220
Who uses UK Test Hub      ~210
Right aside               ~300
Total                    ~1240 ✓
```

**Visual treatment:** keep `text-base leading-relaxed text-muted-foreground` for body paragraphs, `mt-8` between blocks, and add small `font-display text-lg font-bold text-foreground` sub-headings (matching the existing aside H3 style) before each new sub-section so 900 words on the left reads as scannable, not slab-text. No new components, no new imports.

## Out of scope

- Category SEO pages (separate plan in `.lovable/plan.md`)
- Hero, Featured Mock Tests, How to Pass, Blog sections
- Any restyle of the tiles beyond the alignment fix
