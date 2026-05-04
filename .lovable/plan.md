## Goal
Let you wipe "weird characters" (CJK like 快速, zero-width, control chars, smart-quote noise, etc.) across an entire topic in one click — both from the **Bulk Edit** page and directly from the **Validator** results.

## What gets cleaned
Reuse the existing `src/lib/admin/text-cleanup.ts` utility and add a `stripSuspicious(text)` helper that removes:
- CJK ranges (Hiragana, Katakana, Han, Hangul) — e.g. `快速`, `カナ`
- Zero-width / BOM chars (`\u200B-\u200D`, `\uFEFF`)
- Control chars (`\u0000-\u001F` except `\n\t`)
- Replacement char `\uFFFD`
- Collapses any double spaces left behind and trims

The validator already detects these under "Suspicious characters", so the same regex set is the source of truth — no risk of fix/detect drift.

## UI changes

### 1. Bulk Edit page (`/admin-kb20/bulk-edit`)
Add a new button next to "Strip JSON/code artifacts":
- **"Strip suspicious characters (CJK, zero-width, control)"**
- Scans `question`, `options[]`, `explanation` for the selected topic
- Shows a diff preview (before → after) per question
- "Apply" writes overrides to Supabase, fires `question-overrides-invalidated`

### 2. Validator page (`/admin-kb20/validator`)
On each topic group header (e.g. `dog-grooming-theory · 74`), add a small action:
- **"Bulk-clean suspicious chars in this topic"**
- Same logic, scoped only to questions currently flagged in that group
- Same preview + apply flow, then auto re-runs validation so cleaned items disappear

## Technical details
- New helper in `src/lib/admin/text-cleanup.ts`:
  ```ts
  export const SUSPICIOUS_PATTERNS: RegExp[] = [
    /[\u3040-\u30FF\u31F0-\u31FF\u4E00-\u9FFF\uAC00-\uD7AF]/g, // CJK
    /[\u200B-\u200D\uFEFF]/g,                                   // zero-width
    /[\u0000-\u0008\u000B-\u001F\u007F]/g,                      // control
    /\uFFFD/g,                                                   // replacement
  ];
  export function stripSuspicious(input: string): string { ... }
  export function cleanAll(input: string): string { // artifact + suspicious }
  ```
- Bulk action in `admin-kb20.bulk-edit.tsx` mirrors the existing artifact-stripper, just calling `stripSuspicious`.
- Validator gets a `bulkCleanGroup(topic)` handler that walks `findings.filter(f => f.topic === topic && f.rule === 'suspicious-chars')`, builds an override per question, batch-saves, then calls `run()`.
- Saves go through the existing `saveOverride` path so RLS, change events, and history all keep working.

## Files to edit
- `src/lib/admin/text-cleanup.ts` (add patterns + helpers)
- `src/routes/admin-kb20.bulk-edit.tsx` (new button + action)
- `src/routes/admin-kb20.validator.tsx` (per-topic bulk-clean button)

## Out of scope
- Auto-translating CJK back to English (we just delete — your screenshot shows the English answer is already correct, the CJK is junk appended to it).
- Editing the source JSON in `public/mocks/`; everything stays as overrides like today.