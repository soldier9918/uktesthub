
-- Pin search_path on touch_updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Restrict has_role execute to authenticated only (still callable from RLS via SECURITY DEFINER)
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

-- Replace broad public listing on question-images with admin-only listing.
-- The bucket is public, so file URLs still work via CDN without needing a SELECT policy.
drop policy if exists "Public can view question images" on storage.objects;

create policy "Admins can list question images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'question-images' and public.has_role(auth.uid(), 'admin'));
