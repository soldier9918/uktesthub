# Update Popular Mock Tests list (exact order + badges)

Replace the current Popular Mock Tests panel list on the homepage with the user's exact 13-item ordered list, each with its stylised brand badge:

| # | Label | Badge |
|---|-------|-------|
| 1 | SERU Tests | TfL |
| 2 | Driving Theory Tests | DVSA |
| 3 | Life in the UK Tests | Home Office |
| 4 | IELTS Tests | IELTS |
| 5 | CSCS Tests | CSCS |
| 6 | NMC | NMC |
| 7 | CBT Tests | NMC |
| 8 | SIA Tests | SIA |
| 9 | ESOL Tests | ESOL |
| 10 | Numerical Tests | generic UK |
| 11 | Logical Reasoning Tests | generic UK |
| 12 | Food Hygiene Tests | new green "FH" badge |
| 13 | First Aid Tests | new red "FA" badge |

## Files to change

1. **`src/components/TestBadge.tsx`** — add two new badge keys: `food-hygiene` (green tile, "FH") and `first-aid` (red tile with white cross effect, "FA").
2. **`src/data/test-logos.ts`** — map new slugs `food-hygiene → food-hygiene`, `first-aid → first-aid`, `logical-reasoning → generic`, plus standalone `nmc → nmc`.
3. **`src/routes/index.tsx`** — replace the 10-item array in the Popular Mock Tests panel with the 13-item ordered list above. Each row keeps the existing badge + label + arrow layout.

No other sections change.