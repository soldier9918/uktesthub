## Goal

After a signed-in user finishes a mock test, its card on the topic page shows their **best score** and **how many times they've attempted it**, with the progress bar filled to that percentage. Half-finished attempts (since quizzes now reset to question 1 on re-entry) do not count — only completed attempts.

## Current state

`MockCard` in `src/routes/topic.$slug.tsx` already shows a "Best score" line and progress bar, but it reads only from `localStorage` (`uk-test-hub:best:<slug>`). This is per-device, doesn't follow the user across devices, and has no attempt count.

A `quiz_attempts` table already exists with `user_id`, `mock_slug`, `score`, `total`, `percent`, `completed_at` — and `QuizRunner` already inserts a row on every completion. We just need to read from it.

## Changes

**`src/routes/topic.$slug.tsx` — `MockCard`**

1. Use `useAuth()` to get the current user.
2. When signed in and available, fetch from `quiz_attempts` for this `mock_slug`:
   - `max(score)` → best score
   - `count(*)` → number of completed attempts
   Single grouped query per card, or one batched query at the parent and pass results down (preferred — one round-trip instead of N).
3. Display:
   - Top line: `Best 18 / 24 · 75%` (coral) with label `Best score` — same as today
   - New small line underneath the progress bar: `Attempted 3 times` (or `Attempted once`)
   - CTA stays `Retake test` / `Start test` as today
4. When signed out OR no completed attempts → keep current "Not attempted yet" state.
5. Remove the `localStorage`-based best score read (replaced by DB).

**Parent (`TopicPage`) — batched fetch**

Add one `useEffect` that, for signed-in users, runs a single query:
```ts
supabase
  .from('quiz_attempts')
  .select('mock_slug, score')
  .eq('user_id', user.id)
  .eq('topic_slug', topic.slug)
```
Aggregate in JS into `Map<mockSlug, { best: number; attempts: number }>` and pass each card its entry as a prop. RLS already restricts to own rows.

## Out of scope

- Signed-out tracking (explicitly skipped per your answer).
- Showing an "In progress" state (skipped — quizzes reset on re-entry).
- Changing the English-tests mock list page (no progress UI there today; can be a follow-up if you want parity).

## Visual

```text
┌─────────────────────────────────┐
│ Mock Test 1                     │
│ 24 questions · ~24 min          │
│                                 │
│ Best score      18/24 · 75%     │
│ ████████████████░░░░░░░         │
│ Attempted 3 times               │
│                                 │
│ [ Retake test → ]               │
└─────────────────────────────────┘
```
