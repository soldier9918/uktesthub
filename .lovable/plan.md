I found two likely causes of the preview appearing stuck:

1. The admin page can remain on `Loading…` if authentication/session resolution hangs.
2. The dev server has previously failed when the mock-manifest predev script could not be found, so startup needs a safer fallback.

Plan:

1. **Add an auth loading timeout**
   - Update the auth provider so `loading` cannot stay `true` forever.
   - If session lookup fails or takes too long, it will safely clear loading and let admin routes redirect/show the correct state instead of hanging.
   - Keep admin security unchanged: no user still redirects to the admin login; non-admin users remain blocked.

2. **Make admin loading state self-recovering**
   - Update `AdminGate` so if it is still loading after a short grace period it shows a retry/refresh option instead of an endless `Loading…` screen.
   - If the auth provider recovers, the admin panel loads normally.

3. **Harden preview startup**
   - Replace direct `node scripts/build_mock_manifest.mjs` startup calls with a small safe script that checks the manifest builder exists before running it.
   - This prevents the preview server from failing completely if that generated/support script is temporarily missing during workspace restore.

4. **Verify**
   - Restart/check the preview route `/admin-kb20` and confirm it no longer stays indefinitely on `Loading…`.
   - Check logs for startup errors after the change.