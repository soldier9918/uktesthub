# English Language Tests — drill-down restructure

## New URL structure

```
/category/english                                        Main English hub
/english-language-tests/{test}                           Test overview + 4 skill cards
/english-language-tests/{test}/{skill}                   6 CEFR level cards
/english-language-tests/{test}/{skill}/{level}           45 mock test cards
/english-language-tests/{test}/{skill}/{level}/mock-test-{n}   Quiz runner
```

- `test`: `ielts | esol | toefl | selt`
- IELTS/ESOL/TOEFL skills: `listening | reading | writing | speaking`
- SELT skills: `speaking-listening` (levels A1/A2/B1) and `four-skills` (levels B1/B2/C1/C2)
- `level`: `a1 | a2 | b1 | b2 | c1 | c2` (restricted per test/skill where appropriate)
- `n`: 1–45

## File-based routes (TanStack flat naming)

New:
- `src/routes/category.english.tsx` — 4 test-type cards (IELTS / ESOL / TOEFL / SELT)
- `src/routes/english-language-tests.$test.tsx` — overview + skill cards (replaces today's mixed page)
- `src/routes/english-language-tests.$test.$skill.tsx` — CEFR level cards
- `src/routes/english-language-tests.$test.$skill.$level.tsx` — 45 mock cards
- `src/routes/english-language-tests.$test.$skill.$level.mock-test-$num.tsx` — quiz runner

Removed/retired:
- `src/routes/english-language-tests.$category.tsx` (mixed page)
- `src/routes/english-language-tests.$category.mock-test-$num.tsx` (old flat mock route)

`category.$slug.tsx` will redirect `slug === "english"` to `/category/english` for consistency (or we just rely on the new dedicated file — it takes precedence over the dynamic `$slug` for the literal `english` segment via TanStack matching).

The `/english-language-tests` index hub stays but is rewritten to show 4 test-type cards (drops the flat CEFR/skill/topic grids).

## Data model

Rewrite `src/data/english/categories.ts` into a structured catalogue:

```ts
type TestType = "ielts" | "esol" | "toefl" | "selt";
type Skill = "listening" | "reading" | "writing" | "speaking"
           | "speaking-listening" | "four-skills";
type Level = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

type TestConfig = {
  slug: TestType;
  title: string;            // "IELTS-style Practice"
  shortTitle: string;       // "IELTS"
  description: string;
  studyGuideSlug?: string;
  skills: SkillConfig[];
};
type SkillConfig = { slug: Skill; title: string; description: string; levels: Level[] };
```

- IELTS/ESOL/TOEFL: 4 skills × 6 levels = **24 level banks** per test
- SELT: `speaking-listening` (A1/A2/B1) + `four-skills` (B1/B2/C1/C2) = **7 level banks**

Bank file path becomes:
```
public/english-mocks/{test}/{skill}/{level}.json
```
(79 files total. Old flat `public/english-mocks/ielts.json` is removed.)

Loader (`src/data/english/mocks.ts`) is updated to fetch by `(test, skill, level)` triple. Same v2 file shape; same `loadEnglishMockBySlug` API but signature changes to `(test, skill, level, mockNumber)`.

## Question generation

Extend `scripts/generate_english_mocks.py` so each invocation generates one
`{test}/{skill}/{level}.json` file. Strategy:

- Reuse the existing combinatorial pools (vocabulary, grammar frames, sentence templates).
- Tag each pool item with CEFR levels it suits; filter by `level` when picking.
- Slant content by `skill`: listening = transcript snippets ("You hear…"), reading = short passages, writing = pick-best-sentence/grammar, speaking = "natural spoken reply".
- Same per-mock mix (10 MCQ + 6 fill / 4 dropdown / 4 multi-response = 24).
- Uniqueness enforced **within the file** (test+skill+level). Cross-file overlap is acceptable since the requirement is "no duplicate questions in the same test type + skill + level".

Run script across all 79 combinations in one batch (`for test in ...; for skill in ...; for level in ...; python ...`).

### Honest scope note

Generating 79 banks × 1,080 questions = **~85k questions** deterministically is feasible but the pools must be large enough to satisfy uniqueness per bank (1,080 unique items each). The existing IELTS generator already produces 1,080 unique items per call by stride-sampling from much larger pools — I'll keep that approach and add `(skill, level)` parameters that bias which slice of the pool is used. The text style per skill will be templated, not bespoke per question.

## Page content (high level)

- **Test page** (`/english-language-tests/ielts`): overview, study-guide button, 4 skill cards, disclaimer. No CEFR/topic/mock grids.
- **Skill page** (`/ielts/listening`): "IELTS Listening Practice" title, intro, 6 CEFR level cards.
- **Level page** (`/ielts/listening/b1`): "IELTS Listening Practice — B1 Level" title, 45 mock cards with ready/coming-soon state (using `countReadyEnglishMocks` adapted to the new tuple).
- **Mock page**: unchanged quiz runner; back link goes to the level page; "Next mock" links to mock-test-(n+1) on the same level.
- All pages keep the independent-practice disclaimer.

## Sitemap & redirects

- Update `src/routes/sitemap[.]xml.ts` to emit the new URL tree (test, skill, level, mock pages).
- `src/routes/topic.$slug.tsx` already redirects IELTS/ESOL/TOEFL/SELT topic slugs → `/english-language-tests/{slug}`. Keep it.
- Old `/english-language-tests/ielts/mock-test-1` style URLs become 404 (the new file route doesn't match). Acceptable since this section was only just shipped.

## Wording / disclaimer

- Replace "IELTS Practice" titles with "IELTS-style Practice" copy on body text (slug stays `ielts`).
- SELT page adds the explicit GOV.UK reminder.
- Site-wide footer disclaimer text stays unchanged.

## Out of scope for this turn

- Per-skill bespoke audio/passage assets (we keep templated text).
- Authoring 85k human-quality unique questions; the generator produces templated but unique items as the existing IELTS bank does today.
- Custom CEFR-graded vocabulary lists beyond what already exists in the script.
