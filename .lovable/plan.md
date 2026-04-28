# Fix: Blog post pages don't open

## What's broken

Clicking a guide on `/blog` doesn't open the article. The cards do navigate to `/blog/<slug>`, but the page renders the blog **index** (or nothing) instead of the post.

## Root cause

TanStack Router's flat file convention treats `blog.tsx` + `blog.$slug.tsx` as a **layout/child** pair:

- `src/routes/blog.tsx` becomes the layout for `/blog`
- `src/routes/blog.$slug.tsx` becomes its child at `/blog/$slug`

Confirmed in `src/routeTree.gen.ts`:
```
'/blog': typeof BlogRouteWithChildren
```

But `src/routes/blog.tsx` was written as a **leaf page** (the index listing) and does not render an `<Outlet />`. So when you navigate to `/blog/how-to-pass-driving-theory-test`, the parent renders the listing UI and the child post never gets mounted.

## Fix

Rename so the index and the dynamic post page are siblings, not parent/child:

- `src/routes/blog.tsx` → `src/routes/blog.index.tsx`
  - Update its route declaration: `createFileRoute("/blog")` → `createFileRoute("/blog/")`
- Leave `src/routes/blog.$slug.tsx` exactly as-is

After this:
- `/blog` → renders the index listing (leaf, no outlet needed)
- `/blog/<slug>` → renders the post page directly

The router plugin will regenerate `routeTree.gen.ts` automatically.

## Why not add an `<Outlet />` to blog.tsx instead?

That would also work, but it would force the blog index listing UI to render **above every post page** (header, cards, ad slot), which is not the intended design. The sibling-leaf approach matches how the rest of the site is structured (e.g. `category.$slug.tsx` has no `category.tsx` parent).

## Verification after implementation

1. `/blog` still shows the 10 guide cards
2. Clicking any card opens the full article at `/blog/<slug>`
3. Direct URL `/blog/how-to-pass-driving-theory-test` works on refresh
4. Sitemap (`/sitemap.xml`) still lists all blog URLs (no change needed — it reads from `src/data/blog.tsx`)
