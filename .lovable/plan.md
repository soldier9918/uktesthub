
# Admin Panel — Phase 1

Build the 5 highest-impact modules now. Modules 3, 4, 5, 6 (partial), 7 (partial), 10, 12 are deferred to a later phase and tracked in the admin home as "Coming next".

Existing admin lives at `/admin-kb20` and is gated by `AdminGate` + `has_role(admin)`. We extend that, not replace it.

## What gets built

### 1. Mock Test Manager — `/admin-kb20/mocks`
- Lists all categories → topics (from `src/data/categories.ts`) with mock count and per-mock question count, sourced from the existing `public/mocks/diagnostics.json` + per-topic JSON.
- Per-mock row: title, question count, status badge, "Disable / Enable" toggle.
- Disabled state stored in new `mock_overrides` table (`topic_slug`, `mock_slug`, `disabled bool`). Quiz routes already filter via a small helper — we add a check against this table.

### 8. Reported Questions — `/admin-kb20/reports`
- New `question_reports` table: `id, question_id, topic_slug, mock_slug, reason, details, status (open|fixed|dismissed), reporter_user_id (nullable), created_at, resolved_at, resolved_by`.
- Add a "Report this question" button inside the quiz UI (`src/routes/quiz.$slug.tsx`) → modal with reason dropdown (wrong answer / typo / broken image / other) + free text. Logged-in users tracked; anonymous allowed.
- Admin queue: list with filters (open/all/fixed), each row links to `/admin-kb20/questions/{topic}?focus={questionId}` for one-click edit, plus "Mark fixed" / "Dismiss" actions.

### 2. Question Bank Validator — `/admin-kb20/validator`
- Client-side scan over the same mock JSON the diagnostics page already loads. Flags:
  - Duplicate question IDs and duplicate question text within a topic.
  - Missing/empty `explanation`.
  - Invalid `correctAnswer` index (out of range / wrong type for question type).
  - Image referenced but missing from `image-inventory.json`.
  - Type field missing or unrecognised.
- Grouped by topic with counts; each row links to the question editor.
- "Download report" button → JSON file of all findings (feeds module 9).

### 9. Import / Export — `/admin-kb20/import-export`
- Export: pick a topic → download the merged JSON (bank + mocks) currently served. Also "Download validation report" button (reuses validator output).
- Import: upload a JSON file matching the v2 bank shape. Validate against the same rules as the validator before accepting; on success, write entries to `question_overrides` so changes apply immediately without redeploy. Show a dry-run diff (added / changed / unchanged) before committing.

### 11. System Health — `/admin-kb20/system`
- Build version: read `import.meta.env.VITE_BUILD_SHA` (set via Vite define) + build timestamp baked at build time.
- Last deploy time: same source.
- Worker errors: last 50 entries from existing `runtime_logs` table where level in (error, warn).
- Sitemap status: HEAD `/sitemap.xml` and `/robots.txt`, show status code + last-modified.
- Broken routes: hits the existing missing-image diagnostics + a small static list of expected top-level routes pinged via `fetch(..., { method: 'HEAD' })`.

### Admin home update
Update `/admin-kb20` to surface the new sections plus a "Phase 2 (planned)" list naming the deferred modules so nothing looks missing.

## Database changes (one migration)

```sql
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
create policy "Admins can write mock overrides" on public.mock_overrides
  for all to authenticated
  using (has_role(auth.uid(), 'admin')) with check (has_role(auth.uid(), 'admin'));

create table public.question_reports (
  id uuid primary key default gen_random_uuid(),
  question_id text not null,
  topic_slug text not null,
  mock_slug text,
  reason text not null,
  details text,
  status text not null default 'open',  -- open | fixed | dismissed
  reporter_user_id uuid,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid
);
alter table public.question_reports enable row level security;
create policy "Anyone can file a report" on public.question_reports
  for insert with check (true);
create policy "Admins read reports" on public.question_reports
  for select to authenticated using (has_role(auth.uid(), 'admin'));
create policy "Admins update reports" on public.question_reports
  for update to authenticated
  using (has_role(auth.uid(), 'admin')) with check (has_role(auth.uid(), 'admin'));
create index on public.question_reports (status, created_at desc);
```

A status-trigger sets `resolved_at` / `resolved_by` automatically when an admin moves a report out of `open`.

## Files (new)

```text
src/routes/admin-kb20.mocks.tsx
src/routes/admin-kb20.reports.tsx
src/routes/admin-kb20.validator.tsx
src/routes/admin-kb20.import-export.tsx
src/routes/admin-kb20.system.tsx
src/components/ReportQuestionButton.tsx     // shown on quiz pages
src/lib/admin/validator.ts                  // shared scan logic
src/lib/admin/mock-status.ts                // reads mock_overrides for runtime gate
```

Touched: `src/routes/admin-kb20.index.tsx` (new tiles + planned list), `src/routes/quiz.$slug.tsx` (Report button), `vite.config.ts` (inject build SHA/time), one new migration.

## Out of scope (Phase 2 — call out on admin home only)

3 Image Asset Manager · 4 SEO Manager · 5 Blog Manager · 6 Analytics Dashboard (needs `quiz_events` table — confirmed) · 7 User Progress Dashboard · 10 AdSense Manager · 12 Security Settings (allowlist + path stays as-is per your answer).
