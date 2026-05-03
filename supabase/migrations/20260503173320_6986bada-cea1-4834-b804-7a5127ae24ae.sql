
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Admins can read roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Question overrides
create table public.question_overrides (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  question_id text not null,
  question text,
  options jsonb,
  correct_answer jsonb,
  explanation text,
  image text,
  image_alt text,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (topic, question_id)
);

alter table public.question_overrides enable row level security;

create policy "Anyone can read overrides"
  on public.question_overrides for select
  to anon, authenticated
  using (true);

create policy "Admins can insert overrides"
  on public.question_overrides for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update overrides"
  on public.question_overrides for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete overrides"
  on public.question_overrides for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger question_overrides_touch
before update on public.question_overrides
for each row execute function public.touch_updated_at();

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('question-images', 'question-images', true);

create policy "Public can view question images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'question-images');

create policy "Admins can upload question images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'question-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update question images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'question-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete question images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'question-images' and public.has_role(auth.uid(), 'admin'));
