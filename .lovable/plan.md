## AdSense Approval Cleanup Plan

### 1. Remove "Pro" branding
- Audit & strip "UK Test Hub Pro" / "Pro" badges across: `SiteHeader.tsx`, `SiteFooter.tsx`, `routes/about.tsx`, `routes/contact.tsx`, `routes/privacy.tsx`, `routes/terms.tsx`, `routes/disclaimer.tsx`, `routes/cookies.tsx`, `routes/index.tsx`, plus any auth/transactional email templates under `src/lib/email-templates/` (if present) and `src/routes/lovable/email/...`.
- Replace with plain "UK Test Hub". No premium/paid implication anywhere.

### 2. Email/domain cleanup
- Global find/replace: any `*@uktesthub.co.uk` (hello, partners, privacy, etc.) → `support@uktesthub.com`.
- Affected pages: Contact, Privacy, Terms, Cookies, Disclaimer, Help, Footer, About, FAQ, Report, Feedback, email templates.

### 3. Soften official-sounding wording
Run targeted rewrites across `src/data/category-seo.ts`, `src/data/topic-seo.ts`, `src/data/blog.tsx`, `src/data/quizzes.ts`, `src/data/categories.ts`, `src/components/SeoLanding.tsx`, `src/routes/index.tsx`, and the 8 `/blog/*` SEO landing pages:

| From | To |
|---|---|
| official UK exams | UK tests and assessments |
| real exam questions | practice-style questions |
| mirror the real exam format | designed to reflect common exam formats |
| same number of questions | similar question structure where appropriate |
| official pass mark | typical pass mark (or "published pass mark where applicable") |
| mapped to official DVSA learning outcomes | based on publicly available guidance |
| same format used by the Home Office | designed to reflect common Life in the UK test structure |
| real DVSA-style | DVSA-style practice |

Also remove implied affiliation language with DVSA, TfL, Home Office, NHS, SIA, CSCS, IELTS, ESOL, NMC, UCAT, BMAT, PLAB.

### 4. Visible disclaimer
- Update `SiteFooter.tsx` disclaimer block + the disclaimer line on Privacy/Terms/Disclaimer/About to the exact wording:
  > "UK Test Hub is an independent practice platform. We are not affiliated with any official exam body, government department, regulator or test provider. All questions are for practice and revision purposes only."

### 5. Rename Blog labels (URLs stay /blog)
In `src/routes/index.tsx`, `SiteFooter.tsx`, `routes/blog.index.tsx`, `routes/blog.$slug.tsx`, `SiteHeader.tsx`:
- "Blog" → "Study Guides"
- "Latest from the Blog" → "Latest Study Guides"
- "View all articles" → "View all study guides"
- "Read revision tips on the blog" → "Read revision tips in our study guides"
- Footer Company link "Blog" → "Study Guides"

### 6. Homepage category trimming
In `src/routes/index.tsx`, render only these 8 priority categories in the main grid (in order):
`driving`, `citizenship`, `taxi-private-hire`, `construction`, `nhs`, `security`, `english`, `it-tech`.
Add a "Browse All Categories" CTA below linking to `/all-tests` (or a categories index). All categories remain reachable, just not on the homepage hero grid.

### 7. Footer subscription form
Hide the subscribe form in `SiteFooter.tsx` (comment out or gate behind a flag) since no real mailing list / consent flow is wired. Keep the social icons and disclaimer.

### 8. Final QA pass
- `rg "uktesthub\.co\.uk"` → 0 results
- `rg -i "\bPro\b"` in components/routes → 0 brand hits (ignore unrelated words like "Profile")
- `public/robots.txt` and sitemap (server route + static) contain no `/admin*` URLs (already true; reconfirm)
- Spot-check 3 SEO blog pages + homepage on mobile width 375px for layout
- No empty `AdSlot` placeholders rendering visible boxes when ad disabled

### Files to touch (approx)
- Components: `SiteHeader.tsx`, `SiteFooter.tsx`, `SeoLanding.tsx`, `AdSlot.tsx` (verify hidden when empty)
- Routes: `index.tsx`, `about.tsx`, `contact.tsx`, `privacy.tsx`, `terms.tsx`, `cookies.tsx`, `disclaimer.tsx`, `help.tsx`, `faq.tsx`, `report.tsx`, `feedback.tsx`, `blog.index.tsx`, `blog.$slug.tsx`, the 8 `blog.<seo-slug>.tsx`
- Data: `categories.ts`, `category-seo.ts`, `topic-seo.ts`, `blog.tsx`, `quizzes.ts`
- Email templates if present under `src/routes/lovable/email/` or `src/lib/email-templates/`

No schema, auth, or routing changes. Pure content + presentation cleanup.