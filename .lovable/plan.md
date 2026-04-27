## What we're building

Four small fixes that improve navigation consistency and content quality on UK Test Hub's info pages.

### 1. Redirect SERU TfL "Start Mock" link to topic page

In `src/routes/seru-tfl.tsx`, the "▶ Start the SERU TfL Mock Test 1" link currently points to a single legacy quiz slug. Change it to link to `/topic/seru` so users land on the 45 mock test grid (matching the new topic-based architecture).

### 2. Fix SIA Security Test footer link

In `src/components/SiteFooter.tsx`, the "SIA Security Test" link points to `/category/professional` (the category hub). Re-point it directly to `/topic/sia` so it lands on the 45 SIA mock tests, consistent with how SERU/CSCS users expect deep links to behave. Also re-point CSCS, IELTS, ESOL, 11+, and SERU TfL footer links to their respective `/topic/$slug` pages for consistency:
- CSCS Card Test → `/topic/cscs`
- SIA Security Test → `/topic/sia`
- SERU TfL Test → `/topic/seru`
- IELTS Practice → `/topic/ielts`
- ESOL Practice → `/topic/esol`
- 11+ Practice → `/topic/eleven-plus`
- Driving Theory Test → `/topic/driving-theory`
- Life in the UK Test → `/topic/life-in-the-uk`

### 3. Expand content on /about, /faq, /help, /terms

Make these pages substantially longer with more useful sub-sections:

- **/about** — add sections: "Our story", "What makes us different", "How we build our questions", "Editorial standards", "Our values", "Looking ahead"
- **/faq** — expand from 7 to ~20 questions, grouped under sub-headings: "Getting started", "About our content", "Account & privacy", "Technical & device", "Exams & results"
- **/help** — add sections: "Choosing the right test", "Tips for effective practice", "Understanding your results", "Common issues & fixes", "Accessibility help", "Contacting support"
- **/terms** — expand into proper legal sections: "Acceptance of terms", "Eligibility & accounts", "Acceptable use", "Intellectual property", "User-generated content", "Third-party content & links", "Disclaimers & warranties", "Limitation of liability", "Indemnification", "Changes to the service", "Changes to these terms", "Governing law", "Contact"

### 4. Improve typography & structure on all info pages

The pages below currently render as long paragraphs without enough visual hierarchy. Restructure each so it uses clear `<h2>` sub-headers, short paragraphs, bulleted lists where appropriate, and a consistent intro/body/closing pattern. PageLayout already provides Tailwind `prose` styling — we just need to feed it well-structured semantic HTML.

Pages to restyle:
- /about, /faq, /help, /report, /feedback, /exam-updates, /privacy, /cookies, /terms, /disclaimer, /accessibility

Where pages are already partially structured (e.g. /accessibility, /disclaimer), we'll add additional sub-headings, break long paragraphs, and add summary/closing call-out blocks. Where pages are very thin (e.g. /privacy, /cookies, /report, /feedback), we'll add more sections with proper headings.

### Technical notes

- All edits stay within existing `PageLayout` + `prose` styling — no new components needed.
- No new routes or data files.
- Links use TanStack Router's typed `<Link to="/topic/$slug" params={{ slug: "..." }}>` pattern.
- No build-time data generation required.

### Files to edit

- `src/routes/seru-tfl.tsx` (link fix)
- `src/components/SiteFooter.tsx` (link fixes)
- `src/routes/about.tsx` (expand + restructure)
- `src/routes/faq.tsx` (expand + restructure)
- `src/routes/help.tsx` (expand + restructure)
- `src/routes/terms.tsx` (expand + restructure)
- `src/routes/report.tsx` (restructure)
- `src/routes/feedback.tsx` (restructure)
- `src/routes/exam-updates.tsx` (restructure)
- `src/routes/privacy.tsx` (restructure)
- `src/routes/cookies.tsx` (restructure)
- `src/routes/disclaimer.tsx` (restructure)
- `src/routes/accessibility.tsx` (restructure)
