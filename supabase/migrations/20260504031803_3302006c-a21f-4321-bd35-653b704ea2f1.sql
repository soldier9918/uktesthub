
create table public.mock_overrides (
  id uuid primary key default gen_random_uuid(),
  topic_slug text not null,
  mock_slug text not null,
  disabled boolean not null default false,
  updated_by uuid,
  updated_at timestamptz not null default now(),
  unique (topic_slug, mock_slug)
);
alter table public.mock_overrides enable row level security;
create policy "Anyone can read mock overrides" on public.mock_overrides
  for select using (true);
create policy "Admins can insert mock overrides" on public.mock_overrides
  for insert to authenticated with check (has_role(auth.uid(), 'admin'));
create policy "Admins can update mock overrides" on public.mock_overrides
  for update to authenticated using (has_role(auth.uid(), 'admin')) with check (has_role(auth.uid(), 'admin'));
create policy "Admins can delete mock overrides" on public.mock_overrides
  for delete to authenticated using (has_role(auth.uid(), 'admin'));
create trigger mock_overrides_touch_updated_at before update on public.mock_overrides
  for each row execute function public.touch_updated_at();

create table public.question_reports (
  id uuid primary key default gen_random_uuid(),
  question_id text not null,
  topic_slug text not null,
  mock_slug text,
  reason text not null,
  details text,
  status text not null default 'open',
  reporter_user_id uuid,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid
);
alter table public.question_reports enable row level security;
create policy "Anyone can file a report" on public.question_reports
  for insert with check (true);
create policy "Admins can read reports" on public.question_reports
  for select to authenticated using (has_role(auth.uid(), 'admin'));
create policy "Admins can update reports" on public.question_reports
  for update to authenticated using (has_role(auth.uid(), 'admin')) with check (has_role(auth.uid(), 'admin'));
create policy "Admins can delete reports" on public.question_reports
  for delete to authenticated using (has_role(auth.uid(), 'admin'));
create index question_reports_status_created_at_idx on public.question_reports (status, created_at desc);

create or replace function public.stamp_question_report_resolution()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status then
    if new.status <> 'open' then
      new.resolved_at := coalesce(new.resolved_at, now());
      new.resolved_by := coalesce(new.resolved_by, auth.uid());
    else
      new.resolved_at := null;
      new.resolved_by := null;
    end if;
  end if;
  return new;
end $$;
create trigger question_reports_stamp_resolution before update on public.question_reports
  for each row execute function public.stamp_question_report_resolution();
