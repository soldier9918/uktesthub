## 1. Fix broken links in `/blog/uk-general-knowledge-quiz-guide`

The blog post links to:
- `/category/fun` (C slug="fun")
- `/topic/daily` (T slug="daily")
- `/topic/how-british` (T slug="how-british")

The `fun` category was previously removed from `src/data/categories.ts`, but the quizzes (`general-knowledge-daily`, `how-british-are-you`) in `src/data/quizzes.ts` still reference `category: "fun"` with topics `daily` and `how-british`. Without the category entry, `findTopic()` returns nothing and `/topic/daily`, `/topic/how-british`, and `/category/fun` all 404.

**Fix:** Re-add a `fun` category to `src/data/categories.ts`:

```ts
{
  slug: "fun",
  title: "Fun & Viral Quizzes",
  short: "British general knowledge & light-hearted trivia",
  description:
    "Light-hearted British trivia and general knowledge quizzes — perfect for pub quiz prep or a quick brain break.",
  icon: "Sparkles",
  accent: "coral",
  heroImage: heroCitizenship, // reuse existing asset, no new image needed
  topics: [
    { slug: "daily", title: "General Knowledge Daily" },
    { slug: "how-british", title: "How British Are You?" },
  ],
},
```

This automatically restores `/category/fun`, `/topic/daily`, `/topic/how-british`, and the sitemap entries (sitemap auto-generates from `categories`).

No changes needed to the existing homepage `/category/fun` link (line 607) — it'll start working again.

## 2. Add space between "Browse All Categories" and "Featured Mock Tests"

In `src/routes/index.tsx`, the `<AdSlot>` between the Categories section and Featured Mock Tests returns `null` while AdSense is disabled, so the two sections sit flush. Add `mt-16` to the Featured Mock Tests `<section>` (line 347) so it has breathing room regardless of whether the ad renders.

## Files touched
- `src/data/categories.ts` — add Fun category entry
- `src/routes/index.tsx` — add `className="mt-16"` to Featured Mock Tests section
