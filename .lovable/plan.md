## Goal

Make newly uploaded images appear in the Admin "Browse" picker reliably:
- Images committed to `public/road-signs/` (etc.) via GitHub appear after the next deploy.
- Images uploaded via Admin → Supabase Storage (`question-images` bucket) appear **instantly**.
- Add a manual "Refresh" button and an explanatory notice.

## Why it doesn't work today

The picker reads `/mocks/image-inventory.json`, which is generated **only at build time** by `scripts/build_mock_manifest.mjs`. There is no live watcher in production, and the picker doesn't read the Supabase Storage bucket at all. So pushing an image to GitHub does nothing visible until a new build runs, and even then a stale cached JSON can hide it.

## Changes

### 1. Ensure manifest builds on every deploy
- Verify `scripts/build_mock_manifest.mjs` runs as part of the build pipeline (check `package.json` `build` script — add it to a `prebuild` hook if missing).
- Output `public/mocks/image-inventory.json` is regenerated for every deploy.

### 2. Make the Image Picker merge two sources
Update `src/components/ImagePicker.tsx` to load and merge:

1. **Static manifest**: `/mocks/image-inventory.json` (existing) — covers `public/` images.
2. **Live Supabase Storage**: list all files in the `question-images` bucket via `supabase.storage.from('question-images').list('', { limit: 1000 })` and convert each to its public URL using `getPublicUrl`.

Combine both lists, dedupe by path, and tag each item with its source ("public" or "storage") shown as a small badge in the tile so admins can tell where an image lives.

### 3. Add a "Refresh" button
- Small button in the picker header next to the search input.
- Re-runs the loader (manifest fetch with cache-buster + storage list) and updates the grid.
- Already cache-busts the manifest with `?v=Date.now()`, so refresh will see the latest deployed manifest.

### 4. Add an explanatory notice in the picker
A subtle one-liner under the title:

> Images uploaded through Admin appear instantly. Images committed via GitHub appear after the next deploy.

### 5. Folder filter
Add a "Storage (uploaded)" virtual folder so admins can quickly filter to only Supabase-uploaded files.

## Files to edit

- `src/components/ImagePicker.tsx` — merge storage + manifest, refresh button, notice, source badge, new folder filter.
- `package.json` — ensure `node scripts/build_mock_manifest.mjs` runs in `prebuild` (or equivalent) so every deploy regenerates the inventory.

## Out of scope

- Moving existing `public/road-signs/*` images into Supabase Storage (can do later if you want fully instant updates without redeploys).
- Changing how `QuestionEditDialog` saves the chosen path (paths and public URLs both already work).

## After approval

I'll implement the above and you'll need to **publish** once so the updated picker (and the regenerated manifest build step) goes live.