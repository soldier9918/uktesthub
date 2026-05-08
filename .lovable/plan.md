## Security hardening plan

Based on the scan + your answers (lock down profiles fully, no client listing of buckets), here's the implementation order.

### 1. Database migration (single migration)

**Profiles — owner-only access**
```sql
DROP POLICY "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
```

**question_reports — require auth, bind reporter**
```sql
DROP POLICY "Anyone can file a report" ON public.question_reports;
CREATE POLICY "Authed users file reports" ON public.question_reports
  FOR INSERT TO authenticated
  WITH CHECK (reporter_user_id = auth.uid());
```

**quiz_events — bind user_id to caller (allow anon w/ null user_id)**
```sql
DROP POLICY "Anyone can record events" ON public.quiz_events;
CREATE POLICY "Users record own events" ON public.quiz_events
  FOR INSERT TO public
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
```

**Storage buckets — remove list, keep direct URL fetch**
Drop any broad SELECT policy on `storage.objects` for `question-images` / `avatars`. Public buckets still serve direct URLs without a SELECT policy when accessed via the public CDN path; only `list` requires a policy. Keep upload policies scoped to admins / owners as today.

**Lock down pgmq wrapper SECURITY DEFINER fns**
```sql
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text,int,int),
  public.delete_email(text,bigint),
  public.enqueue_email(text,jsonb),
  public.move_to_dlq(text,text,bigint,jsonb),
  public.stamp_question_report_resolution()
  FROM anon, authenticated;
```

**Set search_path on remaining mutable fns**
```sql
ALTER FUNCTION public.read_email_batch(text,int,int) SET search_path = public;
ALTER FUNCTION public.delete_email(text,bigint) SET search_path = public;
ALTER FUNCTION public.enqueue_email(text,jsonb) SET search_path = public;
ALTER FUNCTION public.move_to_dlq(text,text,bigint,jsonb) SET search_path = public;
```

### 2. Code changes after migration approves

- **`src/lib/auth-context.tsx`** — profile reads only run for the signed-in owner; no change needed (already filters by own id). Verify any other public profile reads (e.g. report pages, leaderboards) — if found, fix or remove.
- **Audit `from("profiles").select`** across the codebase; ensure none expect cross-user reads. If any do, switch to a SECURITY DEFINER function returning narrowed fields.
- **`src/lib/server-fns/users.functions.ts` + `similarity.functions.ts`** — refactor each `createServerFn` to use `.middleware([requireSupabaseAuth])`, remove `accessToken` from input + client callsites, derive `userId` from `context`.
- **Add Zod input validation** on `regenerateUniqueQuestion`, `completeRegenerateQuestion`, `aiVerdictPairs` (cap blob lengths/counts, strip control chars).
- **Sanitize error responses**:
  - `similarity.functions.ts`: `console.error` raw, return `"AI service unavailable"` / `"Unexpected AI response format"`.
  - `src/integrations/supabase/auth-middleware.ts`: log details server-side, return `"Internal server error"` body.
- **Quiz reporting / event recording client code** — ensure callers attach `reporter_user_id` / `user_id` from `auth.uid()`; gate report form behind sign-in.

### 3. Update `@security-memory`

Document accepted public-read tables (`ad_slots`, `mock_overrides`, `page_seo_overrides`, `similarity_suppressions`, `question_overrides`) as intentional, and confirm: profiles are owner-only, buckets are direct-URL only.

### Question before I implement

Are there any **public pages that show another user's display name or avatar** today (comments, public attempt pages, shared bookmark pages)? If yes I need to know which routes so they don't break when profiles becomes owner-only.
