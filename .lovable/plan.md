## Goal
Temporarily swap the hero background image with the uploaded London tin-art image and hide ALL hero text/CTAs so you can evaluate the image on its own. This is a test — easy to revert.

## Changes

**1. Add the uploaded image as an asset**
- Copy `user-uploads://ChatGPT_Image_May_25_2026_11_44_20_PM.png` → `src/assets/hero-uk-test.png`.

**2. `src/routes/index.tsx` — hero section only (lines 126–229ish)**
- Import the new image: `import heroUkTest from "@/assets/hero-uk-test.png";`
- Swap the `<img src={heroUk}>` on line 129 to `src={heroUkTest}`.
- Since the uploaded image already contains all the text/CTAs baked in, hide:
  - The dark gradient overlay (`<div ... bg-gradient-to-r ...>`) — comment out so the artwork shows uncovered.
  - The left text column (`<div>` containing "Pass your", `<h1>`, paragraph, buttons, feature list) — comment out.
  - The right "Popular Mock Tests" `<aside>` — comment out.
- Use the wider grid container so the image gets full width. Keep the section height reasonable by using `object-contain` on a tall-enough container so the full tin design is visible, OR keep `object-cover` if you want it to fill — I'll use `object-contain` with a min-height so the entire artwork is visible without cropping (the tin frame would be ruined by cropping).
- Background of the section stays `bg-navy-deep` so letterboxing matches the brand.

**3. Everything below the hero stays unchanged**
Header, categories, etc. are untouched.

## Revert path
Two ways:
- Click the revert button on this AI message in chat, or
- Tell me "revert the hero" and I'll uncomment the text blocks and switch the image back to `heroUk`.

## Out of scope
- No copy changes, no layout changes outside the hero, no asset edits to the uploaded image.
