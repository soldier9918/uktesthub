## Plan

Replace the homepage hero image with the uploaded neon UK/Big Ben image.

### Steps
1. Copy `user-uploads://ChatGPT_Image_May_25_2026_08_33_09_PM.png` into `src/assets/hero-uk-neon.png`.
2. Update `src/routes/index.tsx` to import and use the new image in place of the current `hero-uk.jpg` (line 28 import, line 134 usage).
3. Keep the existing layout, overlay, and text positioning — the image has empty dark space on the left which suits the existing left-aligned headline.

### Notes
- The old `hero-uk.jpg` file is left in place so you can easily revert by changing the import back.
- No other pages or components are affected.