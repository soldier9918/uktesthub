# Fix broken preview

## Problem
The preview shows: *"Failed to fetch dynamically imported module: …tanstack-start-client-entry"*.

Root cause is in `src/styles.css`. The Google Fonts `@import url(...)` is on line 7, **after** `@source "../src";` and `@custom-variant dark (...)`. CSS spec requires every `@import` to come before any other rule (except `@charset` / empty `@layer`). PostCSS rejects the file, the stylesheet fails, and TanStack's client entry can't hydrate — so the whole preview goes blank.

This is unrelated to the recent favicon / OG image / mock-test work — it's a small CSS ordering bug.

## Fix
Reorder the top of `src/styles.css` so all `@import` statements come first:

```text
@import "tailwindcss" source(none);
@import "tw-animate-css";
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:...&display=swap");
@source "../src";
@custom-variant dark (&:is(.dark *));
```

That's the only change — one file, ~3 lines moved. No other files need touching.

## Expected result
- PostCSS error disappears from the dev-server log.
- Vite serves the stylesheet, TanStack client entry loads, preview renders normally.
- Nothing else (mock data, favicon, OG image, badge state) is affected.

## After this
Once the preview is back, you can return to the mock-test generation question (Option A full 45/topic vs Option C 10/topic) whenever you've topped up credits.
