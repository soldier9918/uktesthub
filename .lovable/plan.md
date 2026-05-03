## Goal
Build real user authentication (Option 2) plus saved progress, history, bookmarks and a personal dashboard (Option 3). Designed so Option 4 (paid tier) can later slot in via a `subscriptions` table without rework.

## 1. Database (Lovable Cloud migrations)

- `profiles` table — `id` (FK auth.users, cascade), `display_name`, `avatar_url`, `created_at`, `updated_at`. RLS: user reads/updates own row only.
- Trigger `handle_new_user()` on `auth.users` insert → auto-creates profile row.
- `quiz_attempts` table — `id`, `user_id`, `topic_slug`, `mock_slug`, `score`, `total`, `percent`, `duration_seconds`, `passed` (bool), `completed_at`. RLS: user reads/inserts own rows only.
- `quiz_progress` table — `id`, `user_id`, `mock_slug`, `current_index`, `answers` (jsonb), `started_at`, `updated_at`, unique `(user_id, mock_slug)`. RLS: user own only. Used to "resume later".
- `bookmarks` table — `id`, `user_id`, `topic_slug`, `created_at`, unique `(user_id, topic_slug)`. RLS: user own only.

## 2. Auth flow

- `src/lib/auth-context.tsx` already exists for admin — extend so the same provider is used for normal users (just exposes `user`, `session`, `loading`, `signOut`). No change to admin role logic.
- New routes:
  - `/signin` — email/password sign-in + Google OAuth button + "Forgot password?" link.
  - `/signup` — email/password sign-up + Google OAuth. Sets `emailRedirectTo: window.location.origin`.
  - `/forgot-password` — sends reset email via `resetPasswordForEmail` with `redirectTo: /reset-password`.
  - `/reset-password` — handles `type=recovery` hash, lets user set new password.
  - `/account` — protected; edit display name + avatar, sign out.
  - `/dashboard` — protected; user's stats and recent attempts (see §4).
- Configure Google OAuth provider in Lovable Cloud auth settings.

## 3. Header changes (`SiteHeader.tsx`)

- Replace fake "Sign In" CTA with auth-aware control:
  - Logged out → "Sign in" link (to `/signin`) + smaller "Sign up" outline button.
  - Logged in → avatar dropdown: My Dashboard, My Account, Bookmarks, Sign out.
- Mobile menu mirrors the same.

## 4. Quiz integration

- `QuizRunner.tsx`: when user is signed in,
  - On every answer, debounce-upsert into `quiz_progress` (so they can resume).
  - On finish, insert a row into `quiz_attempts` and delete the `quiz_progress` row.
  - Show "Resume" banner on quiz start if `quiz_progress` exists for that mock.
- Anonymous users keep the existing localStorage-only behaviour (no breakage).

## 5. Bookmarks

- Heart/star icon on topic cards (`/category/$slug`, `/all-tests`, `/topic/$slug`).
  - Logged out → tooltip "Sign in to save".
  - Logged in → toggles row in `bookmarks`.
- New `/bookmarks` route lists saved topics.

## 6. Dashboard (`/dashboard`)

- Welcome row with display name.
- Stat cards: total attempts, average %, pass rate, current streak (consecutive days with ≥1 attempt).
- Recent attempts table (last 20) with topic, score, date, "retake" link.
- Per-topic progress bars (best % per topic).
- "In progress" section listing `quiz_progress` rows with Resume buttons.
- Bookmarks shortcut.

## 7. Account page (`/account`)

- Edit display name, upload avatar (Lovable Cloud storage, new `avatars` bucket, public read, owner write).
- Change password (re-auth then `updateUser`).
- Sign out button.

## 8. Server functions (TanStack `createServerFn`)

- `getDashboardData` — protected by `requireSupabaseAuth`; returns aggregated stats + recent attempts in one call.
- `recordAttempt` — validates payload with Zod, inserts into `quiz_attempts`.
- `upsertProgress` / `clearProgress` — debounced from client.
- `toggleBookmark`, `listBookmarks`.
- All use the auth-middleware client so RLS enforces ownership.

## 9. Future-proofing for Option 4

- Add `subscription_tier` column on `profiles` defaulting to `'free'` (used later by paid tier; harmless now).
- All "premium" gates can later read `profile.subscription_tier`.

## 10. Out of scope for this round
- Stripe / paid plans (Option 4 — later).
- Social providers other than Google.
- Leaderboards, friends, sharing.

## Technical notes
- Use `onAuthStateChange` listener set up BEFORE `getSession()` (already correct in current `auth-context`).
- All forms validated with Zod (email format, password ≥ 8, display name ≤ 50).
- Avatars: max 2 MB, jpg/png/webp only, validated client + server.
- Add `/signin`, `/signup`, `/forgot-password`, `/reset-password`, `/account`, `/dashboard`, `/bookmarks` to sitemap exclusion (no SEO value).
- Will ship in two passes inside the same build: (a) DB migration + auth pages + header, (b) dashboard + bookmarks + quiz integration.