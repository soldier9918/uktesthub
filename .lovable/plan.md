I checked the exact live URL you gave. The server response from `https://www.uktesthub.com/quiz/ph-badge-rules-mock-1` currently contains the new uploaded intro text, including:

- `Private Hire Badge Rules Mock 1 looks closely at driver badge during vehicle checks...`
- unique `Topics included`
- unique `Common mistakes`
- unique `Who this mock is for`

So the current custom-domain server output is updated, but what you saw can still happen because the CSV flow only says the GitHub/Lovable commit succeeded. It does not verify that the published custom-domain page is now serving the expected text to visitors.

Plan to prevent this confusion for every future intro CSV import:

1. Add post-import live verification
   - After a Mock Intros CSV commit succeeds, check the affected mock URLs on the published site.
   - Verify that each page contains the uploaded `covers` text, not just that GitHub accepted the commit.
   - Use cache-busted requests so the check does not reuse stale browser/CDN content.

2. Show clear status in the import UI
   - Replace the current simple `Committed` message with separate statuses:
     - `Committed to GitHub`
     - `Synced to Lovable preview`
     - `Published site verified`
   - If the published page is not updated yet, show a warning instead of implying everything is live.

3. Add a manual “Verify live pages” action
   - Let you re-check a recent intro import from the admin page without re-uploading the CSV.
   - Show which URLs passed/failed and the expected text snippet.

4. Improve the success message wording
   - Make it explicit that committing an intro CSV updates the code source first.
   - The import UI should not say or imply the real website is updated until the live URL has been checked.

5. Keep the existing GitHub sync nudge
   - Keep the source-file nudge because it helps Lovable notice GitHub commits.
   - Add verification on top because the nudge alone cannot prove the published custom domain is serving the new content.

Technical details:

- Update `src/lib/admin/mock-intros-import.functions.ts` to return verification metadata after commit.
- Add a server-side verifier that builds URLs like `/quiz/{topicSlug}-mock-{mockNumber}` and checks the live/custom-domain HTML for the expected `covers` text.
- Update `src/routes/admin-kb20.mock-intros-import.tsx` to display verification results and warnings.
- Keep existing CSV imports compatible; verification failure should not roll back a successful GitHub commit.