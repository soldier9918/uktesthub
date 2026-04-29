# Cap category chips to 4

In `src/routes/index.tsx` Popular Categories tiles, only render the first 4 topic chips per category (currently all are shown, which makes the Taxi & Private Hire tile much taller than the others).

- Slice `c.topics` to the first 4 before mapping into chip labels.
- If there are more, append a single coral `+N more` chip so users know there's extra content behind the Explore button.
- All four tiles will line up at roughly the same height again.

One file changes: `src/routes/index.tsx`.