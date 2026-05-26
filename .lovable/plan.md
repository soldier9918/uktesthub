## Goal
Use your two uploaded button images (gold gradient bars) as the visuals for the hero's two CTAs on the homepage, while keeping them as real, clickable, accessible buttons.

## What changes

In `src/routes/index.tsx` (hero, lines ~175–199), replace the two existing CTA elements:

1. **"Start Practice"** (currently coral pill) → uses `start-practice.png`
   - Links to `#popular-categories` (smooth scroll) — same behaviour as today.
2. **"Browse All Tests"** (currently white outlined pill) → uses `browse-all-tests1.png`
   - Links to `/all-tests` — same as today.

## How it's built (so it stays clickable + responsive)

- Copy both uploads into `src/assets/` and import them.
- Render each as an `<a>` / `<Link>` with the image as its only child (`<img>` inside the link). The whole gold bar is the clickable target.
- Set a fixed display height (~56px desktop, ~48px mobile) with `width: auto` so the buttons keep their proportions and don't pixelate.
- Add `alt="Start Practice"` / `alt="Browse all tests"` for accessibility.
- Add a subtle hover lift (`hover:-translate-y-0.5`) + slight brightness bump (`hover:brightness-110`) so they feel interactive — no separate hover image needed.
- Keep the existing flex-wrap container so they stack nicely on mobile.

## What it will NOT do
- No text/arrows rendered as HTML on top of the images — the words and arrow are already baked into your PNGs, so overlaying would double them up.
- Other buttons elsewhere on the site (e.g. SeoLanding, category cards) are untouched.

## Risk / fit check
The two PNGs are roughly the same height and same gold treatment, so they'll sit cleanly side-by-side at ~56px tall. They'll look right on this hero (dark navy background — the gold pops). If on mobile the "BROWSE ALL TESTS" wordmark feels too small at 48px height, we can bump to 52px.

Approve and I'll implement.