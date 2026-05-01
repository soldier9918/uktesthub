## Plan: Generate Fire Safety mocks

Run the existing resumable generator for the `fire-safety` topic to produce 45 mocks (24 questions each).

### Command

```
python scripts/generate_mocks.py --topics fire-safety --start 1 --end 45 --delay 1.5
```

### Notes

- Writes incrementally to `src/data/mocks/fire-safety.json`; safe to re-run if the 600s exec timeout hits partway through.
- Uses Gemini 3 Flash via Lovable AI Gateway. Estimated cost ~$0.40 for the full 45 mocks.
- Topic is already registered in `scripts/generate_mocks.py` under the `professional` category, so the mocks will be picked up automatically by `src/data/mocks/index.ts` and surfaced on the professional category page.
- If a 402 (out of credits) is returned, the script exits and I'll stop and tell you.

After completion I'll report how many mocks landed and flag any that failed so we can re-run to fill gaps.