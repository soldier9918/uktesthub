## Current state (verified by reading files)

Most schema is already in place — I'll only add what's missing:

| Schema | Page | Status |
|---|---|---|
| Organization + WebSite | sitewide via `__root.tsx` | ✅ already present (need to add `contactPoint`) |
| BreadcrumbList | `/category/*` | ✅ present |
| BreadcrumbList + FAQPage | `/guide/*` | ✅ present |
| BreadcrumbList + Article | `/blog/*` | ✅ present |
| Quiz | `/quiz/*` | ✅ present, ❌ no breadcrumb |
| Breadcrumb | `/topic/*` | ❌ missing |
| FAQPage | `/faq` | ❌ missing |

## Changes

### 1. `src/routes/faq.tsx`
Add `scripts` to `head()` with a `FAQPage` JSON-LD built from the visible `groups` array. Flatten Q/A across all 6 groups; for ReactNode answers (the ones containing `<Link>`), extract plain text by walking the children — answers stay 1:1 with what's visible. Also add a `BreadcrumbList` (Home › FAQ).

### 2. `src/routes/topic.$slug.tsx`
Switch from hand-rolled `meta`/`links` to use `pageMeta()` from `@/lib/seo` (matches the other routes) and add `scripts` with a `BreadcrumbList`:
Home › {category.title} › {topic.title}

### 3. `src/routes/quiz.$slug.tsx`
Resolve the parent topic from the quiz slug (strip trailing `-mock-N`, look up via `findTopic`) and add a `BreadcrumbList` next to the existing Quiz schema:
Home › {category.title} › {topic.title} › {q.quizTitle}
Skip if topic can't be resolved (defensive — keeps existing Quiz schema intact).

### 4. `src/lib/seo.ts` — `organizationSchema()`
Add `contactPoint`:
```
contactPoint: {
  "@type": "ContactPoint",
  contactType: "customer support",
  email: "support@uktesthub.com"
}
```
Logo already wired to `/favicon.png`.

### 5. Safety rules honored
- No schema added to admin/auth pages (admin-kb20.*, signin, signup, account, dashboard, reset/forgot-password) — leaving them untouched.
- No "official provider" wording, no affiliation claims — schema stays factual (name, breadcrumb, FAQ text from the page).
- Sitemap admin URLs: not touched.
- All FAQ entries mirror visible page content exactly; no hidden Q&As.

## Out of scope
No visible UI changes. No content rewrites. Existing canonical/OG meta untouched on routes that already work.
