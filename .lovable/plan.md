# Fix duplicated blog bodies + GCSE warmup quiz redirect

## Root cause (important)

This is **not** a template bug. `src/routes/blog.$slug.tsx` renders `post.body()` exactly once. The duplication lives **inside the data** in `src/data/blog.tsx`: every post that has the generic CTA + revision tips block was authored as `[original body] → disclaimer → CTA card → "Quick study plan" → "Common myths to ignore" → "What to do on test day" → [ENTIRE ORIGINAL BODY PASTED AGAIN] → disclaimer`.

55+ posts are affected (every post containing `<h2>Common myths to ignore</h2>` — confirmed 55 matches across the file). The 5 URLs you listed are a sample; the rest of the blog has the same bug.

## Part 1 — Blog body deduplication

### Approach

Write a one-off Node script (`scripts/dedupe_blog_bodies.mjs`, run once with `bun`) that edits `src/data/blog.tsx` in place. For each `body: () => ( <> ... </> )` block:

1. Locate the `<h2>What to do on test day</h2>` heading and the `</p>` that closes its paragraph (the generic "Plan to arrive 15–20 minutes early…" copy).
2. From that point, delete everything up to **but not including** the final `<p className="text-xs italic text-muted-foreground">…Disclaimer…</p>` (or, if the post has no disclaimer, up to the closing `</>`).
3. Leave the first disclaimer (already present after the original body, before the CTA card) untouched — it now becomes the only disclaimer.

Net result per post:
- Original body (once)
- Original disclaimer
- CTA card
- Quick study plan
- Common myths to ignore
- What to do on test day
- (duplicate body + duplicate disclaimer removed)

### Why a script, not 55 manual edits

- 55 posts × ~50 lines deleted each = ~2,750 lines. A script is faster, auditable in one diff, and guarantees identical handling.
- Posts without the duplicated block (none of the 55 matches, but defensively) are skipped because the script only triggers when both the `What to do on test day` marker **and** a second occurrence of the post's opening paragraph exist after it.

### Verification after running

1. `rg -c "Common myths to ignore" src/data/blog.tsx` → expect unchanged count (55).
2. `rg -c "What to do on test day" src/data/blog.tsx` → expect unchanged count.
3. `rg -c "text-xs italic text-muted-foreground" src/data/blog.tsx` → expect **halved** (each post should now have one disclaimer, not two).
4. Spot-check 3 URLs in the preview (topographical, seru, life-in-the-uk) — confirm body renders once, no repeated H2s.
5. `curl` each `/blog/<slug>` and grep duplicate H2s programmatically:
   ```bash
   for slug in topographical-assessment-guide seru-assessment-guide ...; do
     curl -s "$PREVIEW/blog/$slug" | grep -oE '<h2[^>]*>[^<]+</h2>' | sort | uniq -d
   done
   ```
   Expect empty output for every slug.

### Template (no change needed)

`src/routes/blog.$slug.tsx` already renders the body once, followed by an `AdSlot`, related articles, and footer. No edits to the template required — the user-requested correct order is already what the template produces; only the duplicated source data is wrong.

## Part 2 — `/quiz/gcse-maths-warmup`

`src/data/quizzes.ts` defines `gcse-maths-warmup` as a normal quiz under topic `gcse-maths` (and lists it in the public quiz index at line 1283). Since you want it off the public surface, the cleanest fix is a 301 redirect to the topic hub.

### Change

In `src/routes/quiz.$slug.tsx` loader, add a one-off redirect **before** the `LEGACY_SLUG_REDIRECTS` loop:

```ts
if (params.slug === "gcse-maths-warmup") {
  throw redirect({ to: "/topic/$slug", params: { slug: "gcse-maths" } });
}
```

Also remove `"gcse-maths-warmup"` from the published quiz list at `src/data/quizzes.ts:1283` so it stops appearing on listing pages and in the sitemap.

(Keeping the quiz definition itself in the file is harmless — it's just no longer linked anywhere and the URL 301s away.)

### Verification

- `curl -I $PREVIEW/quiz/gcse-maths-warmup` → expect 301/302 to `/topic/gcse-maths`.
- `curl -s $PREVIEW/sitemap.xml | grep gcse-maths-warmup` → expect empty.

## Files touched

- `src/data/blog.tsx` (large diff: ~55 duplicate body blocks removed, via script)
- `scripts/dedupe_blog_bodies.mjs` (new, one-off)
- `src/routes/quiz.$slug.tsx` (add 4-line redirect)
- `src/data/quizzes.ts` (remove one string from the public index array)

## Out of scope

- No changes to the blog template, SEO helpers, or related-articles logic.
- No changes to the CTA card, "Quick study plan", "Common myths", or "What to do on test day" generic sections — they stay exactly where they are between the (now single) article body and the related-articles section the template appends.
