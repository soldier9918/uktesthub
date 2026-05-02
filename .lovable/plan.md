# Fix missing images on image-based questions (Practice + Exam)

## What's actually wrong

The user's screenshot ("What does this blue circular sign indicate to drivers?" with no picture) is one example of a wider data issue:

- **1,220 questions** across **30 topics** are typed `image_question` (or their wording references "this sign / this image / this diagram / shown above") but have **no `image` field set**.
- The mock loader (`src/data/mocks/index.ts` → `rawToQuestion`) silently degrades any `image_question` without an `image` URL into a plain MCQ. So the user sees an image-dependent question with no image, four answers, and no way to know what's being asked.
- This affects both Practice and Exam mode equally — they share the same question rendering pipeline (`QuizRunner.tsx`). Practice/Exam logic itself is fine; the data + the silent fallback are the bug.

Worst-affected topics:

```text
road-signs           456
topographical        455
hazard-perception    424
rya-day-skipper      234
police-search        228
ppl-meteorology      195
citb-hse / fire-safety / first-aid / ipaf-pasma /
microsoft-fundamentals / sia-cctv / comptia-a-plus /
cscs-operative       162 each
motorcycle-theory    131
firefighter-nfsat / health-safety-awareness /
manual-handling      130 each
…30 topics in total
```

The only topics that already have working image artwork are `driving-theory` (16 imgs) and `bmat`. `public/road-signs/page-1..8.png` exist but are full Highway Code reference sheets (1103×2067) containing ~25 signs each — they cannot be used as-is, individual signs must be cropped out.

## Fix plan

### 1. Stop the silent fallback (loader)

`src/data/mocks/index.ts` currently does this for `image_question` with no `image`:

```ts
// Degrade to MCQ until a real image URL is wired in.
return { type: "mcq", ... };
```

Change behaviour so it never silently strips the image dependency:

- If the question text references an image (or type is `image_question`) and there is no resolvable image, mark the question with `imageMissing: true` and pass it through as `image-question`.
- `QuizRunner.tsx` `ImageQuestionView` (lines ~430–460) renders a clear placeholder with the question's `imageDescription` text instead of pretending the question is text-only. This stops the misleading screen the user reported even before all artwork is in place.

### 2. Add a road-signs image library and wire it up

For all UK driving / road-sign questions (`road-signs`, `driving-theory` extra signs, `motorcycle-theory`, `hazard-perception` sign-only items):

1. Run a one-off cropping script (`scripts/crop_road_signs.py`, ImageMagick + manual cell grid per page) that splits `public/road-signs/page-1..8.png` into individual sign PNGs at `public/road-signs/signs/{slug}.png` (e.g. `no-entry.png`, `give-way.png`, `max-speed-30.png`, `national-speed-limit.png`, `school-crossing-patrol.png`, …). Each page is a regular grid so the crop boxes are deterministic.
2. Build `public/road-signs/signs/index.json` mapping slug → file + human label + a list of keywords ("blue circular", "no entry", "national speed limit", "30 mph", "give way", …).
3. Run a matching script that, for every affected question in `road-signs.json`, `motorcycle-theory.json`, `hazard-perception.json`, and the relevant `driving-theory.json` items, picks the best sign by matching the keywords from `imageDescription` / `imageAlt` / question text against the sign index. Write the resolved path into the question's `image` field.
4. Anything that doesn't get a confident match keeps `imageMissing: true` and shows the placeholder from step 1 — never the misleading "MCQ with no image" screen.

### 3. Handle non-driving image topics

Topics like `citb-hse`, `fire-safety`, `first-aid`, `ipaf-pasma`, `food-hygiene`, `manual-handling`, `sia-cctv`, `firefighter-nfsat`, `border-force`, `comptia-a-plus`, `microsoft-fundamentals`, `topographical`, `ppl-meteorology`, `rya-day-skipper`, `atpl-basics`, `bmat`, `police-search` reference diagrams and hazard pictograms we don't have artwork for. For these:

- Run a script (`scripts/rewrite_image_questions.py`) that, for any `image_question` without an `image`, rewrites the question text so it stops referring to a missing image. It uses the existing `imageDescription` to turn:
  > "What hazard does this warning sign identify?" (image: missing)

  into:
  > "A yellow triangular warning sign showing a black falling-rocks icon. What hazard does this sign identify?"

  and changes `type` to `multiple_choice`. The answer/options/explanation are unchanged, so correctness is preserved. This converts the question into a self-contained text question instead of a broken image question.
- Re-run `scripts/rebalance_mocks.py` afterward so per-mock weight compliance is preserved (these conversions move questions from `image_question` into `multiple_choice` and the weights for these topics already cap `image_question` at low percentages — the rebalancer will handle the redistribution).

### 4. Verify Practice + Exam parity

- After the data fixes, run a small audit script that walks every mock in every topic and asserts: no question is rendered with a "this image / this sign / shown above" wording unless either (a) `image` resolves to an existing file in `public/`, or (b) the question text has been rewritten to be self-contained.
- Browser-test:
  - `/quiz/road-signs-mock-1` Practice mode and Exam mode — confirm sign images render.
  - `/quiz/driving-theory-mock-1` — confirm existing driving-theory images still work.
  - `/quiz/citb-hse-mock-1` — confirm rewritten questions read sensibly with no "this sign" reference left dangling.

## Technical notes

- Loader change is a one-line behaviour swap in `rawToQuestion` plus a small JSX block in `ImageQuestionView` for the placeholder.
- All data scripts are deterministic and idempotent. They live in `scripts/` and write JSON in place. No schema migration.
- Cropping uses `nix run nixpkgs#imagemagick -- convert page-N.png -crop WxH+X+Y signs/slug.png`. Crop boxes are derived once from the regular grid layout of each Highway Code page.
- Keyword matcher uses simple lowercased token overlap with a small synonyms map ("circular" ↔ "circle", "30 mph" ↔ "30mph"); ties broken by longest match. Uncertain matches are left for the placeholder fallback — we never guess.
- No changes to QuizRunner mode logic (Practice vs Exam already share rendering); only the image placeholder UI is added.

## Files touched

- `src/data/mocks/index.ts` — remove silent MCQ fallback for `image_question`, add `imageMissing` passthrough.
- `src/components/QuizRunner.tsx` — `ImageQuestionView` placeholder when `imageMissing`.
- `scripts/crop_road_signs.py` (new), `scripts/match_road_signs.py` (new), `scripts/rewrite_image_questions.py` (new), `scripts/audit_image_questions.py` (new).
- `public/road-signs/signs/*.png` (new, generated), `public/road-signs/signs/index.json` (new).
- ~30 mock JSON files in `src/data/mocks/` — `image` fields populated where matched, image-only questions rewritten to self-contained text where not.
