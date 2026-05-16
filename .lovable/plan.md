## 1. Replace Featured Mock Test images with premium-quality photography

The six current `feat-*.jpg` images look flat/stock. Regenerate each with `imagegen` at premium quality (4:3 aspect, 1024×768), keeping the same file paths so no imports change:

| File | New prompt |
|---|---|
| `src/assets/feat-driving.jpg` | Cinematic dusk shot of a UK motorway with red brake-light trails, soft golden sky, shallow depth of field, premium editorial photography |
| `src/assets/feat-flag.jpg` | Crisp Union Jack flag waving against a clear blue British sky, fine fabric detail, bright natural light, premium stock photography |
| `src/assets/feat-headphones.jpg` | Premium over-ear black studio headphones on a warm neutral linen surface, soft window light, minimalist editorial product photography |
| `src/assets/feat-calculator.jpg` | Sleek modern calculator beside a sharpened pencil and open notepad on a clean white desk, top-down flat lay, soft natural light, premium editorial |
| `src/assets/feat-tower-bridge.jpg` | Tower Bridge London at golden-hour sunset reflecting on the Thames, warm cinematic light, sharp architectural detail, premium travel photography |
| `src/assets/feat-road-signs.jpg` | Cluster of real UK road signs (30mph, warning triangles, directional arrows) against a clear blue sky, sharp detail, premium documentary photography |

No code changes — just asset replacement. Each at quality "standard" (premium realistic photography) — premium tier only if needed for legibility.

## 2. Make London skyline banner visible in "Proudly helping learners…" strip

In `src/routes/index.tsx` line 920, the skyline `<img>` is set to `opacity-30`, making it nearly invisible. Increase to `opacity-80` and remove the `bg-royal/10` background tint on the section (line 915) so the skyline reads cleanly. Also widen the strip slightly with extra vertical padding so the skyline silhouette has room to show.

Specifically:
- Line 915: `bg-royal/10` → `bg-gradient-to-b from-sky-100 to-sky-50` (or similar light sky tone) so the skyline sits against sky, not lavender
- Line 920: `opacity-30` → `opacity-80`
- Line 922: `py-10` → `py-14 md:py-16`

## Files touched
- `src/assets/feat-driving.jpg`, `feat-flag.jpg`, `feat-headphones.jpg`, `feat-calculator.jpg`, `feat-tower-bridge.jpg`, `feat-road-signs.jpg` (regenerated)
- `src/routes/index.tsx` (skyline visibility)
