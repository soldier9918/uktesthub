I checked the current validator and bulk editor logic. The main issue is that the validator restores cached results from `sessionStorage`, but it does not reliably invalidate/re-run after overrides change, and its suspicious-character rule only catches non-Latin/control characters. It does not catch JSON/code fragments like `],question`, so those can stay on the validator page even after bulk edits or appear as a separate class of anomaly.

I also verified the database currently has clean overrides for the recently fixed driving-theory items, while the original static files still contain artifacts. So the validator must validate the effective text after overrides and must force fresh results when overrides are updated.

Plan:

1. Make validator re-run truly fresh
   - Clear both old validator cache keys before every validation run.
   - Invalidate and reload the overrides cache before scanning, so it does not use stale in-memory override data.
   - Add a listener for `question-overrides-invalidated` on the validator page that clears the displayed findings and cached results, so fixed items do not remain on screen after admin edits or bulk edits.
   - Add clearer status text such as “Results cleared after edits — run validation again” instead of showing old findings.

2. Add validator detection for JSON/code artifacts
   - Extend `src/lib/admin/validator.ts` with a new rule, likely `json-code-artifact`, for text fragments like:
     - `],question`
     - `], question`
     - `Array],question`
     - trailing `],`, `"},`, or leaked JSON field names such as `options`, `question`, `explanation`, `correctAnswer`
   - Check `question`, `options`, `explanation`, and `imageAlt`, the same fields the existing suspicious-character scanner checks.
   - Keep this separate from “Suspicious characters” so the admin page shows exactly what needs the “Strip JSON/code artifacts” bulk tool.

3. Share the cleanup logic between bulk editor and validator
   - Move the artifact regex/cleaning logic out of `admin-kb20.bulk-edit.tsx` into a shared helper, e.g. `src/lib/admin/text-cleanup.ts`.
   - Use that helper in both:
     - bulk edit preview/apply
     - validator detection
   - This prevents the validator and bulk edit feature from disagreeing about what is “fixed”.

4. Fix bulk apply cache handling
   - After bulk apply, clear validator cache and dispatch override invalidation as it does now, but also reload the current topic from the fresh effective bank so pressing the cleanup button again shows zero changes if the overrides are clean.
   - Ensure bulk edits merge with existing overrides without reintroducing old dirty static values.

5. Improve the validator page controls
   - Keep “Run validation” / “Re-run validation”, but make the button always start from a clean cache.
   - Add a small “cache cleared after edits” message when relevant.
   - Ensure finding keys are stable enough that React does not keep stale rows visually after a re-run.

6. Optional direct data cleanup pass, if approved
   - Since a read-only scan found many static source files still contain `],question` artifacts across multiple topics, I can also update the source mock JSON files directly so the base files are clean, not only overridden in the database.
   - This would reduce reliance on overrides and stop the validator from finding the same raw-file artifacts again if overrides are cleared.

Files expected to change:
- `src/lib/admin/validator.ts`
- `src/routes/admin-kb20.validator.tsx`
- `src/routes/admin-kb20.bulk-edit.tsx`
- new shared helper such as `src/lib/admin/text-cleanup.ts`
- optionally affected `public/mocks/*.json` files if we clean the source data too

Outcome:
- “Re-run validation” will actually refresh from current overrides.
- Fixed/bulk-fixed questions will be removed from the validator results after re-run.
- Weird answer artifacts like `],question` will be detected and bulk-fixable consistently.
- The validator page will stop showing stale results after fixes.