## Goal
Reorganize `/blog` (Study Guides) so posts are grouped under category headings, and add a search bar to filter guides.

## Scope
Single file: `src/routes/blog.index.tsx`. No data, route, or backend changes.

Note: the existing post categories are **Driving**, **Citizenship**, **English**, **Education**, **Professional**, **NHS**, **Fun**, **Taxi & Private Hire**. There are currently no Finance posts, so I'll group by these real categories (mapped to friendly section titles). If you want a different grouping (e.g. merge Driving + Taxi into "Driving & Transport"), tell me.

## Category → Section heading mapping (proposed)
- Driving → **Driving & Transport**
- Taxi & Private Hire → **Taxi & Private Hire (TfL/SERU)**
- Citizenship → **Life in the UK & Citizenship**
- English → **English & IELTS**
- Education → **Education & Exams**
- Professional → **Professional & Trade (CSCS)**
- NHS → **NHS & Healthcare**
- Fun → **General Knowledge & Fun**

Sections render in this order; empty sections are hidden.

## Changes to `src/routes/blog.index.tsx`
1. Add a client search bar (controlled `useState`, `<input>` with search icon) above the grid. Filters by title, excerpt, and category (case-insensitive).
2. Group `posts` by `category` using the mapping above.
3. Render each non-empty group as a `<section>` with:
   - An `<h2>` heading (display font, coral underline accent, post count badge).
   - The same card grid as today (3 cols desktop / 2 tablet / 1 mobile), so card design and unique hero images are preserved.
4. When search is active: hide section headings and show a single flat "Results" grid with a count + "Clear" button. If no matches, show an empty state.
5. Add an in-page anchor nav (sticky chip row) listing the category sections so users can jump to one — hidden while searching.
6. Keep hero, breadcrumb, AdSlot, SEO head, and footer unchanged.

## Out of scope
- Renaming the route, changing post data/categories, server-side search, or new image generation.
- Adding new categories (e.g. Finance) — none exist in the data.