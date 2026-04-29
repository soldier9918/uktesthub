# Remove brand badges and badge disclaimer

Remove every stylised brand badge (TfL, DVSA, Home Office, IELTS, CSCS, NMC, SIA, ESOL, Food Hygiene, First Aid, etc.) and the accompanying "Logos shown are stylised badges…" disclaimer.

## Edits

1. **`src/routes/index.tsx`**
   - Popular Mock Tests panel: remove the `<TestBadge>` from each row and the disclaimer paragraph below the "Browse all tests" button.
   - Featured Mock Tests cards: remove the `<TestBadge>` overlay in the top-right of the image.
   - Popular Categories tiles: remove the small badge row and its surrounding logic.
   - Drop the now-unused imports: `TestBadge`, `BadgeKey`, `badgeForSlug`, and the `badge` field from the `featured` array.

2. **`src/routes/all-tests.tsx`**
   - Replace each `<TestBadge>` in the test cards with the existing `<ListChecks>` arrow-style layout (no logo, just title + meta + "View test").
   - Remove the disclaimer paragraph at the bottom.
   - Drop unused imports.

3. **Delete files** (no longer referenced):
   - `src/components/TestBadge.tsx`
   - `src/data/test-logos.ts`

No other pages or copy change.