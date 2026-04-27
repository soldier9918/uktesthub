## Move Daily Challenge into "Practice by topic" section

### Changes to `src/routes/index.tsx`

**1. Remove from hero (lines ~125-159)**
Remove the Daily Challenge `<Link>` card from the hero grid. Change the hero grid wrapper from `lg:grid-cols-[1.3fr_1fr] lg:items-center` to a single-column layout so the headline content fills the hero cleanly.

**2. Restructure "Practice by topic" section (lines ~307-)**
Convert the section into a two-column layout on large screens:
- **Left/main column**: existing heading, intro paragraph, and the categories topic grid (now `md:grid-cols-2` instead of `lg:grid-cols-3` so it fits in the narrower column).
- **Right/sidebar column**: the Daily Challenge card, restyled to fit the lighter `bg-gradient-card` surface (swap `bg-navy-deep/80` for `bg-navy-deep` solid so the dark card pops against the light section background; keep the gold crown, Union Jack, score line, and coral "Start Daily Quiz" CTA).

Wrapper becomes:
```tsx
<section className="mt-20 rounded-3xl border border-border bg-gradient-card p-6 md:p-10">
  <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
    <div>
      {/* heading + intro + categories grid */}
    </div>
    <aside>
      {/* Daily Challenge card, sticky on lg: lg:sticky lg:top-24 */}
    </aside>
  </div>
</section>
```

On mobile/tablet the Daily Challenge stacks above the topic grid so it stays prominent.

**3. Cleanup**
- Keep the `getDailyQuiz()` import and call — just relocated.
- No other files need changes; no new components or routes.

### Files to edit
- `src/routes/index.tsx`
