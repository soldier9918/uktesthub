I confirmed the backend row for `road-signs / rs-im-0062` already contains the regenerated smart motorway red-X question, so the issue is not the regeneration save itself.

Plan:

1. Fix the admin topic editor override refresh path
   - Make `useOverrides()` always clear any in-memory cache before loading when the page mounts or receives the override invalidation event.
   - This prevents `/admin-kb20/questions/road-signs` from reusing stale overrides after regenerating in another admin page.

2. Make the topic editor show a clear “edited” source of truth
   - Keep the existing edited badge, but ensure the displayed question/options/explanation are rebuilt from the fresh override map.
   - Preserve the existing search, filters, pagination, edit dialog, and admin route behavior.

3. Verify with the exact case
   - Open `/admin-kb20/questions/road-signs?q=rs-im-0062` in the preview.
   - Confirm it displays: “You are on a smart motorway and see an overhead gantry...” instead of the original circular 30 speed limit question.
   - Also confirm the old image can still remain visually separate if not changed, without causing the text to revert.