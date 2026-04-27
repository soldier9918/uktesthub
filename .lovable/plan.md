## Heads up — direction change

The reference image is **strongly UK-themed**: Union Jack waving in hero, Big Ben, Beefeater guard, red post box, "Pass Your UK Tests First Time", and a Union Jack motif in the footer.

Last turn we agreed to drop the UK focus and go international. **This image goes the opposite way** — it doubles down on the UK. I'll proceed by matching the image (back to UK-only branding, keeping the existing UK categories) since you sent it as the design target. If you actually want international scope with this *visual style*, say so and I'll swap UK imagery for a more neutral global motif instead.

---

## What will change

### 1. Header (`SiteHeader.tsx`)
- Logo: small Union Jack square + bold "UK TEST HUB" wordmark with red "PRO" pill, tagline "PASS YOUR TEST FIRST TIME" underneath.
- Nav: Home, Driving, UK Life, English, Education, Jobs, Professional, More (dropdown for NHS/Fun) — underlined active state in red.
- Right side: search icon, dark-mode toggle icon, red "Sign In" button.

### 2. Hero (`routes/index.tsx`)
- Full-bleed dark navy background with an AI-generated **Union Jack + Big Ben at dusk** hero image (generated via Nano Banana, saved to `src/assets/hero-uk.jpg`).
- Big stacked headline: "PASS YOUR" / "UK TESTS" (white) / "FIRST TIME" (red/coral).
- Subhead: "Real exam questions. Mock tests. Instant results. Study anytime, anywhere."
- Two CTAs: red "Start Practice →" and outlined "Take a Mock Test".
- 4 inline stat chips below: 1000+ Questions · Real Exam Format · Instant Results · Updated for 2026.
- Right side: floating "DAILY CHALLENGE" card with crown icon, Union Jack circle, "Can you score 10/10 on today's UK Knowledge Quiz?", red "Start Daily Quiz" button.

### 3. Popular Categories section
- Centered title "POPULAR CATEGORIES" flanked by small crown icons, red underline accent.
- 7-column responsive grid of category cards (current 8 cats — I'll keep all 8, wrapping to a second row on smaller screens; or hide "Fun" on desktop to match the 7-up image).
- Each card: large coloured icon (red car / blue crown / book / red graduation cap / blue briefcase / shield / smiley), bold title, 2–3 line description, pill button at bottom showing "N Tests" (alternating red outline / blue outline).

### 4. Featured Mock Tests section
- "FEATURED MOCK TESTS" title + "View all tests →" link.
- Horizontal row of 6 cards each with a thumbnail image (cars on motorway, Union Jack, headphones, calculator, Tower Bridge, road signs collage), title, "X Questions · Y Mins" meta row, full-width "Start Test" button (alternating red / blue / navy).
- Thumbnails: AI-generated for the ones not covered by existing assets.

### 5. "Why us" strip
- Dark navy band with Beefeater guard illustration on left and red post box illustration on right.
- 4 columns: Real Exam Experience, Instant Results, Track Progress, Study Anywhere — each with icon + heading + 2-line copy.

### 6. UK pride strip
- Lighter blue band with Union Jack icon + "Proudly helping learners across the UK and worldwide" + subline. UK skyline silhouette behind (AI-generated SVG-style image).

### 7. Footer (`SiteFooter.tsx`)
- Restructure to match: Popular Tests, Company, Support, Legal columns + a 5th brand column on the right with mini-logo, "Subscribe for exam updates and tips" + email input + red Subscribe button + social icons (FB / X / YT / IG, decorative links).
- Bottom bar: "© 2026 UK Test Hub. All rights reserved." | disclaimer | small Union Jack icon.

### 8. Design tokens (`styles.css`)
- Tighten coral toward true British red `oklch(0.62 0.22 25)` to match the vivid red in the reference.
- Add a deeper navy `--navy-deep` for hero/footer bands.
- Add a "british-blue" accent matching the royal blue used on category icons.

### 9. AI-generated imagery
Generate via Nano Banana (`google/gemini-2.5-flash-image`) and save to `src/assets/`:
- `hero-uk.jpg` — Big Ben at dusk with translucent Union Jack overlay.
- `feat-driving.jpg` — UK motorway at dusk.
- `feat-union-flag.jpg` — Waving Union Jack.
- `feat-tower-bridge.jpg` — Tower Bridge.
- `feat-road-signs.jpg` — Collage of UK road signs.
- `band-guard.png` — Stylised Beefeater (transparent).
- `band-postbox.png` — Stylised red post box (transparent).
- `band-skyline.png` — UK skyline silhouette (transparent, very light).

(Headphones and calculator featured images can use simple emoji/icon tiles to save generations.)

### 10. Apply design language elsewhere
- `PageLayout.tsx` hero band: switch gradient to navy + thin red underline accent on the H1.
- Buttons globally: red primary, navy secondary, blue outline tertiary.
- Category page (`category.$slug.tsx`) and quiz pages inherit the new red/navy/blue button variants — no structural changes.

---

## Files I'll touch

- create `src/assets/hero-uk.jpg`, `feat-*.jpg`, `band-*.png` (AI-generated)
- create `src/components/Logo.tsx` (Union Jack mark + wordmark + PRO pill)
- create `src/components/DailyChallengeCard.tsx`
- edit `src/components/SiteHeader.tsx` (full restyle, new nav, sign-in button)
- edit `src/components/SiteFooter.tsx` (5-column with newsletter, restyled)
- edit `src/components/PageLayout.tsx` (hero band restyle)
- edit `src/routes/index.tsx` (rebuild to match reference 1:1)
- edit `src/styles.css` (red/navy/blue tokens)
- edit `src/components/CategoryIcon.tsx` (colour mapping per reference)

No route additions, no data changes, no breaking changes to quiz logic.

---

## What I will NOT do (unless you say so)
- Add real authentication for the "Sign In" button (it'll be a styled link to a placeholder `/signin` route with a "coming soon" message, or just visual).
- Wire the footer newsletter form to a backend (visual only with disabled-on-submit toast).
- Implement the dark-mode toggle in the header (icon only).
- Re-internationalise content — sticking with UK to match the image. Tell me if you want global scope kept and I'll adapt.
