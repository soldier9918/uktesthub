
-- 1. Profiles: lock down to owner-only reads
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2. question_reports: require auth and bind reporter_user_id
DROP POLICY IF EXISTS "Anyone can file a report" ON public.question_reports;
CREATE POLICY "Authed users file reports"
  ON public.question_reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_user_id = auth.uid());

-- 3. quiz_events: bind user_id to caller (allow anonymous events with null user_id)
DROP POLICY IF EXISTS "Anyone can record events" ON public.quiz_events;
CREATE POLICY "Users record own events"
  ON public.quiz_events FOR INSERT
  TO public
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- 4. Storage: remove broad public listing on avatars (direct URL fetch still works on public bucket)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- 5. Lock down SECURITY DEFINER pgmq wrappers — only service role should call these
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM anon, authenticated;

-- 6. Pin search_path on the pgmq wrappers (linter: function_search_path_mutable)
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public;
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public;
