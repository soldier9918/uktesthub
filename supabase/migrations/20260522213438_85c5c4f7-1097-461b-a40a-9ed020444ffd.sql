
-- 1) Remove hardcoded auto-admin backdoor
DROP TRIGGER IF EXISTS on_auth_user_grant_admin ON auth.users;
DROP FUNCTION IF EXISTS public.grant_admin_on_signup();

-- 2) Restrict avatars bucket SELECT to the owning user (folder == auth.uid())
DROP POLICY IF EXISTS "Users can read their own avatar" ON storage.objects;
CREATE POLICY "Users can read their own avatar"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3) runtime_logs: add INSERT policy restricted to admins
DROP POLICY IF EXISTS "Admins can insert runtime logs" ON public.runtime_logs;
CREATE POLICY "Admins can insert runtime logs"
ON public.runtime_logs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
