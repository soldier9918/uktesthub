
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.grant_admin_on_signup() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.stamp_question_report_resolution() FROM anon, authenticated, public;
