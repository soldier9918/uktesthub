
-- Analytics events
create table public.quiz_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in (
    'page_view','quiz_start','quiz_complete','quiz_abandon','question_answered'
  )),
  topic_slug text,
  mock_slug text,
  question_id text,
  path text,
  user_id uuid,
  session_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index quiz_events_type_time_idx on public.quiz_events (event_type, created_at desc);
create index quiz_events_topic_idx on public.quiz_events (topic_slug, created_at desc);
alter table public.quiz_events enable row level security;
create policy "Anyone can record events"
  on public.quiz_events for insert to public with check (true);
create policy "Admins can read events"
  on public.quiz_events for select to authenticated
  using (public.has_role(auth.uid(), 'admin'::app_role));
create policy "Admins can delete events"
  on public.quiz_events for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'::app_role));

-- Ad slots
create table public.ad_slots (
  id uuid primary key default gen_random_uuid(),
  slot_key text not null unique,
  label text not null,
  placement text not null,
  size text,
  ad_slot_id text,
  enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
alter table public.ad_slots enable row level security;
create policy "Anyone can read ad slots"
  on public.ad_slots for select to public using (true);
create policy "Admins manage ad slots"
  on public.ad_slots for all to authenticated
  using (public.has_role(auth.uid(), 'admin'::app_role))
  with check (public.has_role(auth.uid(), 'admin'::app_role));
create trigger trg_ad_slots_touch before update on public.ad_slots
  for each row execute function public.touch_updated_at();

-- Seed default ad slot definitions
insert into public.ad_slots (slot_key, label, placement, size, enabled) values
  ('header-leaderboard','Header leaderboard','Top of page','leaderboard', false),
  ('in-quiz-rectangle','In-quiz rectangle','Between questions','rectangle', false),
  ('results-rectangle','Results page rectangle','After quiz results','rectangle', false),
  ('sidebar-skyscraper','Sidebar skyscraper','Sidebar (desktop)','skyscraper', false),
  ('sticky-bottom','Sticky bottom','Mobile sticky bottom','sticky-bottom', false)
on conflict do nothing;

-- Admin settings (key/value)
create table public.admin_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
alter table public.admin_settings enable row level security;
create policy "Anyone can read settings"
  on public.admin_settings for select to public using (true);
create policy "Admins manage settings"
  on public.admin_settings for all to authenticated
  using (public.has_role(auth.uid(), 'admin'::app_role))
  with check (public.has_role(auth.uid(), 'admin'::app_role));
create trigger trg_admin_settings_touch before update on public.admin_settings
  for each row execute function public.touch_updated_at();

insert into public.admin_settings (key, value) values
  ('hide_ads_globally', 'false'::jsonb),
  ('preview_without_ads', 'false'::jsonb),
  ('adsense_client_id', '""'::jsonb),
  ('default_meta_description', '"UK Test Hub — free practice tests for UK driving theory, life in the UK, citizenship and more."'::jsonb),
  ('default_og_image', '""'::jsonb)
on conflict do nothing;

-- Admin allowlist
create table public.admin_allowlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  note text,
  created_at timestamptz not null default now(),
  created_by uuid
);
alter table public.admin_allowlist enable row level security;
create policy "Admins manage allowlist"
  on public.admin_allowlist for all to authenticated
  using (public.has_role(auth.uid(), 'admin'::app_role))
  with check (public.has_role(auth.uid(), 'admin'::app_role));

-- Admin audit log
create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_email text,
  action text not null,
  target text,
  detail jsonb,
  created_at timestamptz not null default now()
);
create index admin_audit_log_time_idx on public.admin_audit_log (created_at desc);
alter table public.admin_audit_log enable row level security;
create policy "Admins read audit log"
  on public.admin_audit_log for select to authenticated
  using (public.has_role(auth.uid(), 'admin'::app_role));
create policy "Admins insert audit log"
  on public.admin_audit_log for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'::app_role));

-- Page SEO overrides
create table public.page_seo_overrides (
  path text primary key,
  title text,
  description text,
  og_image text,
  noindex boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
alter table public.page_seo_overrides enable row level security;
create policy "Anyone can read seo"
  on public.page_seo_overrides for select to public using (true);
create policy "Admins manage seo"
  on public.page_seo_overrides for all to authenticated
  using (public.has_role(auth.uid(), 'admin'::app_role))
  with check (public.has_role(auth.uid(), 'admin'::app_role));
create trigger trg_page_seo_touch before update on public.page_seo_overrides
  for each row execute function public.touch_updated_at();
