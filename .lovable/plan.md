## Why answers come up blank after a CSV re-upload

I traced the bug to the CSV import handler in `src/routes/admin-kb20.questions.$topic.tsx` (lines ~424–525) combined with how overrides are applied in `src/lib/overrides.ts`.

### What's happening

1. You export to CSV, edit some rows in Excel/Sheets, save, re-upload.
2. Excel happily writes empty cells as empty strings (`""`) for any column you didn't touch — especially `optionA..D`, `correctAnswer`, `correctAnswers`, `explanation`, `image`, `imageAlt`.
3. The importer currently does:
   - `question: r.question ?? null` → an empty cell becomes `""`, not `null`.
   - `options: hasOpts ? opts : undefined` → if all 4 option columns are blank, options goes through as `undefined`/`null` (this part is OK), but if even one option cell has whitespace it falls through with the other 3 as empty strings.
   - `correct_answer` is built from `correctAnswer`/`correctAnswers`. If both cells are empty/`null`/`[]`, it writes `null`.
4. Then in `applyOverrideToQuestionRecord` (overrides.ts):
   - `if (override.question != null)` — empty string passes this check, so the live question text becomes `""` → blank.
   - For options, the array `["", "", "", ""]` (or partial) overwrites the real options → blank answer choices.
   - There's also a side effect: when ANY content override is present and `image` is null, the importer strips the original image and forces `type: "mcq"`. So an image-only edit elsewhere can wipe the picture from a question that originally had one.

That matches your screenshot: question 15 in mock 16 renders the shell but the question/answers area is empty because the override row stored empty strings on top of the real content.

### The fix (one file)

Edit only `src/routes/admin-kb20.questions.$topic.tsx`, in `handleImportFile`:

1. **Treat empty CSV cells as "no change", not "blank it out"**. Helper:
   ```ts
   const cell = (j: number) => (j >= 0 ? (rows[r][j] ?? "").trim() : "");
   const orUndef = (s: string) => (s.length > 0 ? s : undefined);
   ```
   Use `orUndef(cell(iQ))` for `question`, `explanation`, `image`, `imageAlt`.

2. **Options**: only include them if at least one option cell is non-empty AND keep the original count. If all four are empty → `options: undefined` (don't touch). If some are empty but others aren't, send all four as-is (that's an intentional edit). Today's `.filter((v, i, a) => i < a.length)` is a no-op and can be removed.

3. **correctAnswer / correctAnswers**: if the cell is empty, leave as `undefined` instead of `null`. Also accept string answers (some image questions store the option label, not an index) — fall back to the raw string when `Number(ca)` is `NaN` and it isn't `true`/`false`.

4. **Upsert payload**: change every line from `?? null` to `?? undefined` for the content fields so Supabase doesn't overwrite existing override values with `null`. (`question`, `options`, `correct_answer`, `explanation`, `image`, `image_alt` should only be sent when the CSV actually had a value.)

5. **JSON branch**: apply the same "empty → undefined" rule so a JSON re-upload behaves the same.

6. **Small UX add**: after import, show a second line in `importMsg` like "X rows had no editable changes and were left untouched." so it's obvious nothing got nuked.

### What this does NOT change

- Export format stays identical, so any CSV you've already downloaded still works.
- No DB schema change, no other files touched.
- Existing override rows that were already blanked by the previous import are still blank — you'll need to either (a) delete those override rows for the affected questions, or (b) re-upload the CSV with the correct text in those cells. I can add a "Reset to original" button per question in a follow-up if you want.

### Optional follow-up (ask me if you want it)

Add a one-click "Clear bad overrides" tool that deletes any `question_overrides` row where `question = ''` or `options` is an array of empty strings — that would un-blank already-affected questions in one shot.
