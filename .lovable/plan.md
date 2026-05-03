## Goal

Finish the admin system so:
1. `samyhussain123@gmail.com` is granted the `admin` role.
2. Edits made in the admin question editor appear in live mock tests / quizzes for all users.
3. The Diagnostics panel shows real recent server runtime logs (not just client activity).

## 1. Grant admin role

Via a one-off insert into `user_roles`:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'samyhussain123@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

Requires the user to have signed up at `/admin/login` first. If no row exists in `auth.users` for that email, surface a clear message asking them to sign up, then re-run.

## 2. Wire overrides into QuizRunner

Today `src/lib/overrides.ts` loads override rows from `question_overrides` but nothing applies them to live questions. Plan:

- Add a helper `applyOverrides(quiz, map)` in `src/lib/overrides.ts` that returns a new `Quiz` with each question's `question`, `options`, `correctAnswer`, `explanation`, `image`, `imageAlt` swapped in when an override exists for `(quiz.topic, question.id)`.
- In `src/components/QuizRunner.tsx`:
  - Call `useOverrides()` at the top.
  - Memoize `effectiveQuiz = useMemo(() => map ? applyOverrides(quiz, map) : quiz, [quiz, map])`.
  - Use `effectiveQuiz` everywhere instead of the raw `quiz` prop.
- Confirm the override row shape matches each question type (MCQ index, true/false bool, multi-response array). For types we don't yet edit in the admin UI (numeric, hot-spot, fill-blanks), only override fields that are present and leave the rest untouched.
- After a successful save in `QuestionEditDialog`, call `invalidateOverrides()` so subsequent loads refetch.

## 3. Diagnostics: real server/runtime logs

Add a TanStack server function `getRecentServerLogs` (admin-gated via `requireSupabaseAuth` + `has_role` check) in `src/server/diagnostics.functions.ts` that proxies the host's worker logs. Since we cannot directly read Cloudflare logs from inside the Worker, the practical implementation is:

- Maintain a lightweight `runtime_logs` table (id, level, message, context jsonb, created_at) with admin-only RLS.
- Add a tiny `logServer(level, message, context?)` helper used inside server functions and route handlers to insert log rows for warnings and errors.
- The server function returns the latest 100 rows, newest first.
- The Diagnostics page replaces the current "Recent activity" client log with a tab showing these server log rows, plus the existing client-side activity log as a second tab.

Frontend changes:
- `src/routes/admin.diagnostics.tsx`: add a "Server logs" section that calls `getRecentServerLogs` and renders timestamp + level + message + collapsible context.

## 4. Files

Created:
- `src/server/diagnostics.functions.ts`
- `src/server/diagnostics.server.ts` (logger helper)
- migration: `runtime_logs` table + RLS

Edited:
- `src/lib/overrides.ts` (add `applyOverrides`)
- `src/components/QuizRunner.tsx` (consume overrides)
- `src/components/QuestionEditDialog.tsx` (call `invalidateOverrides` after save)
- `src/routes/admin.diagnostics.tsx` (server logs tab)

Migration also runs the admin role grant for `samyhussain123@gmail.com`.

## Out of scope

- Live build logs from the hosting platform (not accessible from inside the Worker). The `runtime_logs` table is the practical replacement.
- Editing UI for non-MCQ question types beyond what already exists.
