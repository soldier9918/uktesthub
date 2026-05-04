## Problem

Edits saved in the admin panel never appear on the live site. Root cause confirmed:

- Overrides in the DB are keyed by the **bank ID** (e.g. `sa-mc-0017`).
- But `src/data/mocks/index.ts` → `rawToQuestion(raw, idx)` builds the runtime `Question` with `id: idx + 1` (a number 1..24), **dropping the original bank id**.
- At runtime `applyOverrides` looks up `topic::1`, `topic::2`, ... and never matches `topic::sa-mc-0017`. So the strange `控制` character (and any other admin edit) keeps showing on the live mock.

RLS on `question_overrides` is correct (anon read allowed), so this is purely a data-mapping bug.

## Plan

### 1. Fix override application (the real bug)

**`src/data/mocks/index.ts`**
- In `rawToQuestion`, also carry the source bank id onto the runtime question:
  - Add `sourceId: (raw as { id?: string }).id` to every returned question shape (extra field, doesn't break the `Question` union since consumers ignore unknown fields).
- For v1 files where raw questions have no `id`, fall back to a deterministic synthesised id (e.g. the topic prefix + slot number) so we still have a stable key.

**`src/lib/overrides.ts`**
- In `applyOverrides`, look up by `sourceId` first, then fall back to numeric `id` for backward compatibility:
  ```ts
  const srcId = (q as { sourceId?: string }).sourceId;
  const o = (srcId && map.get(key(quiz.topic, srcId))) || map.get(key(quiz.topic, String(q.id)));
  ```

### 2. Verification helper in admin

In `QuestionEditDialog` after a successful save, show a green confirmation line with the live deep link (`/quiz/<topic>-mock-<n>#q<slot>`) for the **first** mock the question is used in, plus a "View on live site" button. This gives an immediate one-click verification that the edit took effect.

### 3. Bulk edit feature

**New route: `src/routes/admin-kb20.bulk-edit.tsx`** (linked from `admin-kb20.questions.$topic.tsx`)

Workflow:
1. Pick a topic (dropdown of all topics).
2. Loads the topic file and runs the same flatten step used by the topic editor.
3. **Find & replace panel**:
   - "Find" text input
   - "Replace with" text input
   - Scope checkboxes: question text, options, explanation
   - "Match case" toggle, "Whole word" toggle
   - "Preview matches" button — lists every question that would change with a side-by-side diff (before → after).
   - "Apply to N questions" button — upserts one `question_overrides` row per affected question (using the bank id we now preserve from step 1) in batches of 50.
4. **Specific character cleanup quick-action**: a one-click button "Strip non-Latin / control chars" that scans options + question text for any character outside the printable ASCII + common punctuation set and proposes removals (this directly fixes the `控制` style issue across the whole bank).
5. Result toast shows how many overrides were written and a link back to the validator.

Saves invalidate the overrides cache so the next live page load reflects the change.

### 4. Remove Lovable references from product code

Strip every user-facing or non-essential mention of "Lovable" from app code. Files touched:

- `src/integrations/supabase/client.ts`, `src/integrations/supabase/client.server.ts`, `src/integrations/supabase/auth-middleware.ts` — change error message `"Connect Supabase in Lovable Cloud."` → `"Backend is not configured."`.
- `src/routes/signup.tsx`, `src/routes/signin.tsx` — these import `lovable` from `@/integrations/lovable` for Google OAuth. Replace with `supabase.auth.signInWithOAuth({ provider: "google" })` directly so no `lovable` import is needed in product routes.
- `src/integrations/lovable/index.ts` — leave the file in place (it's auto-generated and used by the platform) but remove all imports of it from product code.
- `src/routes/lovable/email/queue/process.ts` — internal queue processor; rename references in comments/strings only where they are user-visible. The package import `@lovable.dev/email-js` stays (it's the email SDK), but UI strings like log labels are scrubbed.
- `src/routeTree.gen.ts` — auto-generated, not edited.

Will also grep the whole `src/` tree one more time during implementation to catch anything missed.

### 5. Republish reminder

Steps 1, 2, 4 are frontend changes — the user must click **Publish → Update** for them to appear on `uktesthub.com`. Step 3 (admin route) is also frontend. No DB migrations needed.

## Technical notes

```text
runtime question shape after fix
─────────────────────────────────
{ id: 5,                  // slot in this mock (1..24)
  sourceId: "sa-mc-0017", // ← new: stable bank id used by overrides
  type: "mcq", ... }

override lookup
─────────────────────────────────
1. try map.get("safeguarding-adults::sa-mc-0017")  ← matches
2. else map.get("safeguarding-adults::5")          ← legacy fallback
```

Files to create/edit:
- edit `src/data/mocks/index.ts`
- edit `src/lib/overrides.ts`
- edit `src/components/QuestionEditDialog.tsx`
- create `src/routes/admin-kb20.bulk-edit.tsx`
- edit `src/routes/admin-kb20.index.tsx` (add nav link to bulk edit)
- edit `src/routes/signin.tsx`, `src/routes/signup.tsx`
- edit `src/integrations/supabase/client.ts`, `client.server.ts`, `auth-middleware.ts`
