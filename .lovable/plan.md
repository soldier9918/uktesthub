## Replace road sign gallery with high-res PNGs from your PDF

I've confirmed the uploaded PDF renders cleanly at 250 DPI — page 1 is sharp and shows exactly the right Highway Code artwork. Here's what I'll do once you approve:

### Steps

1. **Render all 8 PDF pages to PNG at 250 DPI** (1103×2067 px each, ~250 KB per file) and save to `public/road-signs/page-1.png` … `page-8.png`, replacing the current low-res `.jpg` files.
2. **Update `src/data/road-sign-gallery.ts`** — switch the 8 `src` paths from `.jpg` → `.png`.
3. **Update `src/routes/guide.$slug.tsx`** — bump the gallery image's max width from `max-w-3xl` → `max-w-4xl` so the sharper artwork displays larger, and add explicit `width={1103} height={2067}` attributes to prevent layout shift while loading.

### Why PNG, not JPG

The signs are flat-colour vector artwork rendered from a PDF. PNG keeps the red/blue edges crisp with no JPEG ringing artefacts, and at this resolution it's actually similar file size (~250 KB/page) to a quality-matched JPG.

### What stays the same

- The 8 page titles, intros, alts and Open Government Licence attribution in `road-sign-gallery.ts` are already accurate — no copy changes needed.
- The conditional rendering on `/guide/road-signs` and the source PDF download link stay as-is.

Approve and I'll switch to build mode and apply the three changes above.