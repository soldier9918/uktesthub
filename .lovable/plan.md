## Goal
Sort categories alphabetically by `title` on `/all-tests` by default.

## Change
In `src/routes/all-tests.tsx`, inside the `filteredCategories` useMemo:
- After the existing `.filter` chain and before `.map`, sort a copy of categories alphabetically by `title` (case-insensitive, `localeCompare`).
- Keep the category filter dropdown order untouched (only the listing section is sorted).
- Topics within each category remain in their existing order.

No other files change.