## 1. "Back to all tests" button

Add a prominent **"← Back to all tests"** link at the top of these pages (above the hero, on the same beige `bg-[#f7f5f0]` strip that contains the header):

- `src/routes/category.$slug.tsx` — `/category/:slug`
- `src/routes/topic.$slug.tsx` — `/topic/:slug`
- `src/routes/english-language-tests.$test.tsx` — `/english-language-tests/:test`
- `src/routes/english-language-tests.$test.$skill.tsx` — `/english-language-tests/:test/:skill`
- `src/routes/english-language-tests.$test.$skill.$level.index.tsx` — the level / mock-list page

Style: small pill button with an `ArrowLeft` icon, navy text on a white card, sits just under `SiteHeader` so it's the first thing users see when they land on any category/topic.

```text
┌───────────────────────────────────────────┐
│  SiteHeader                               │
├───────────────────────────────────────────┤
│  ← Back to all tests                      │
├───────────────────────────────────────────┤
│  HERO (existing)                          │
└───────────────────────────────────────────┘
```

Keep the existing breadcrumb (Home › Category › Topic) — the back button is in addition to it, because the breadcrumb currently links to Home, not to `/all-tests`.

## 2. Unify mock test tiles

The target design (per attached screenshot) is the tile already used on the English level pages:

- Title: **"Mock Test N"** (instead of the current "Test N")
- Subtitle: `24 questions · ⏱ ~24 min`
- Prominent coral **"Start test →"** button at the bottom
- Same card chrome (rounded-2xl, border, soft shadow, hover lift)

Apply this design to the main mock-test grid on `src/routes/topic.$slug.tsx` so every topic across the site looks identical to the English ones.

Changes inside `topic.$slug.tsx` only:

- Rewrite the `MockCard` component to mirror the English `MockCard` (in `english-language-tests.$test.$skill.$level.index.tsx`): heading "Mock Test N", `24 questions · ~24 min` line, coral "Start test" button, "Soon" pill for locked mocks.
- Remove the per-tile progress bar + "X / 24" score (it conflicts with the new layout). Best-score display can be added later in a follow-up if you want it preserved — confirm if you want to keep it.
- Update the grid call site to pass `mockNumber` instead of `title: "Test N"`.

No changes to data, routing, quizzes, or styles tokens. All new styles use existing tokens (`coral`, `border`, `card`, `muted`, etc.).

## Open question

The current topic tile shows your best score (`X / 24` with a progress bar). The target design has no progress bar. Confirm one:

- **A.** Drop the progress bar entirely (matches screenshot exactly).
- **B.** Keep the progress bar but place it below the "Start test" button, in a smaller muted style.

I'll default to **A** unless you say otherwise.
