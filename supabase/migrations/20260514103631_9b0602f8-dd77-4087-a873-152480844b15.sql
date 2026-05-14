create table public.ga_oauth_tokens (
  id int primary key default 1,
  refresh_token text not null,
  scope text,
  google_email text,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  constraint singleton check (id = 1)
);
alter table public.ga_oauth_tokens enable row level security;
create policy "Admins read ga oauth tokens" on public.ga_oauth_tokens
  for select to authenticated using (has_role(auth.uid(),'admin'::app_role));
create policy "Admins manage ga oauth tokens" on public.ga_oauth_tokens
  for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));