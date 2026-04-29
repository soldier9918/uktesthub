# Add Real Test/Body Logos to Popular Mock Tests

## What you'll see

Each row in the **Popular Mock Tests** panel (right side of the homepage hero) will get a small square logo to the left of the test name — e.g. DVSA next to Driving Theory, Home Office crown next to Life in the UK, IELTS, CSCS, TfL next to SERU/Topographical/PHV/Congestion Charge/ULEZ, NMC, SIA, NHS, etc.

```text
┌──────────────────────────────────┐
│ POPULAR MOCK TESTS               │
├──────────────────────────────────┤
│ [TfL]   SERU Tests             › │
│ [TfL]   Topographical Tests    › │
│ [TfL]   Private Hire Licence   › │
│ [TfL]   Congestion Charge      › │
│ [TfL]   ULEZ Tests             › │
│ [DVSA]  Driving Theory Tests   › │
│ [HO]    Life in the UK Tests   › │
│ [IELTS] IELTS Tests            › │
│ [CSCS]  CSCS Tests             › │
│ [NMC]   NMC CBT Tests          › │
└──────────────────────────────────┘
       AND MANY MANY MORE
```

The same logos will also be reused on the **Featured Mock Tests** cards and the **Popular Categories** tiles where the matching test appears, so branding is consistent across the page.

## Important — trademark / legal note (please read)

DVSA, DVLA, TfL, NHS, Home Office, IELTS, CSCS, NMC, SIA, etc. are registered trade marks of those organisations. UK Test Hub is **independent** and not affiliated with any of them. Embedding the actual official logos can:

- breach each body's brand/trademark guidelines (TfL roundel, NHS identity, Home Office crown, IELTS, CSCS and SIA brands all explicitly forbid third-party use without a licence), and
- imply endorsement, which is the exact thing your existing independence disclaimer is there to prevent.

To keep the visual benefit without the legal risk, I recommend **stylised brand badges** instead of pixel-perfect official logos: a coloured square/rounded tile with the body's initials in its recognisable colour (e.g. red square "DVSA", blue "TfL", red cross "NHS", navy "IELTS", yellow/black "CSCS"). They read instantly as "the DVSA test", "the TfL test", etc., without copying the protected marks.

I'll need you to pick one of these before I build:

- **A. Stylised badges (recommended, safe):** I generate clean coloured initial-tiles for each body and use them site-wide. No trademark risk.
- **B. Real official logos:** I source the official SVG/PNG of each logo and embed them. Faster visual recognition, but you accept the trademark risk and the possibility of takedown requests. I'll add a stronger "not affiliated / all trademarks property of their respective owners" line under the panel and in the footer.

If you don't tell me otherwise, I'll proceed with **A**.

## Implementation

1. **Logo asset set** — create `src/assets/logos/` containing one small square asset per body: `dvsa`, `dvla`, `tfl`, `home-office`, `ielts`, `cscs`, `nmc`, `sia`, `nhs`, `esol`, `motorcycle` (DVSA), plus a generic fallback. Under option A these are generated coloured SVGs; under option B these are the official files.
2. **Mapping** — add a small `src/data/test-logos.ts` that maps each test slug (`seru`, `topographical`, `phv-licence`, `congestion-charge`, `ulez`, `driving-theory`, `life-in-the-uk`, `ielts`, `cscs`, `nmc-cbt`, `sia`, `esol`, `motorcycle`, `numerical`, …) to its logo + alt text + the issuing body's name. Single source of truth.
3. **Popular Mock Tests panel** (`src/routes/index.tsx` lines ~184–207) — render the mapped logo as a 28×28 rounded tile to the left of each label, with `alt` text like "TfL — Transport for London". Keep the existing hover and arrow.
4. **Featured Mock Tests cards** (~line 284) — add the same logo as a small badge in the card header so the brand is reinforced.
5. **Popular Categories tiles** (~line 222) — show up to 3 logo chips per tile representing the bodies inside that category.
6. **Disclaimer** — add a one-line note under the Popular Mock Tests panel and in the footer: *"All third-party names and logos are trademarks of their respective owners. UK Test Hub is independent and not affiliated with DVSA, TfL, the Home Office, NHS, IELTS, CSCS, NMC, SIA or any other listed body."*
7. **Accessibility** — every logo gets descriptive `alt`; decorative duplicates use `alt=""`.

## Files touched

- new: `src/assets/logos/*` (one asset per body)
- new: `src/data/test-logos.ts`
- edit: `src/routes/index.tsx` (Popular Mock Tests, Featured Mock Tests, Popular Categories)
- edit: `src/components/SiteFooter.tsx` (trademark disclaimer line)

Reply **A** (stylised badges) or **B** (real official logos) and I'll implement.