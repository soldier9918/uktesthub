## Process the attached 4-sign batch

The uploaded image is a clean horizontal row of 4 signs on white tiles, evenly spaced. I'll split it into 4 individual sign images and put them on the Show & Tell board as signs 01–04.

### Steps

1. **Delete old rough crops** for signs 01–05 in `public/road-signs/show-and-tell/` (the previous grid-guess crops).
2. **Slice the attached image** into 4 equal horizontal pieces using ImageMagick, saving as:
   - `sign-01.png` — Cattle grid
   - `sign-02.png` — Agricultural vehicles (tractor)
   - `sign-03.png` — Ford
   - `sign-04.png` — Try your brakes
3. **Trim white space** around each sliced tile so the sign sits nicely centred in the flip card.
4. **Update `src/data/show-and-tell-signs.ts`** — replace the existing 5 entries with these 4, using official UK Highway Code wording for `name` and `meaning`.

### Sign meanings (Highway Code)

- **Cattle grid** — Warning: a cattle grid crosses the road ahead. Slow down; the metal bars can be slippery, especially when wet.
- **Agricultural vehicles** — Warning: slow-moving agricultural vehicles likely to be on or crossing the road. Be ready to slow down or stop.
- **Ford** — Warning: a ford (shallow river crossing) ahead. Check the depth gauge and drive through slowly in a low gear.
- **Try your brakes** — Plate sign found after a ford or wash: test your brakes gently to dry them out before continuing at normal speed.

### After this batch

Board will show 4 signs live. Send the next batch of 4–5 the same way (clean row, white background) and I'll keep going up to 19.
