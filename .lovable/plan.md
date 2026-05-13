# Private GA4 Analytics Dashboard for UK Test Hub

A new admin-only page at `/admin-kb20/ga-analytics` that pulls live and historical data from your GA4 property (ID `466514625`) via a backend server function — credentials never touch the browser.

## What you'll see on the page

Top row — five KPI cards:

1. **Active users (last 30 min)** — from GA4 Realtime API
2. **Pageviews (last 30 min)** — from GA4 Realtime API
3. **Pageviews (last 30 days)** — `runReport` 30daysAgo → today
4. **Pageviews (rolling 24 hours)** — hourly data, server-side filtered to the last 24 full hours
5. **Visitors (rolling 24 hours)** — hourly `activeUsers`, same window

Below the cards:

- **Hourly chart** — pageviews per hour, last 24 h (line/bar)
- **Daily chart** — pageviews per day, last 30 days (line/bar)

Header controls:

- **Refresh** button
- **Auto-refresh every 60 s** (toggle on by default)
- **Last updated** timestamp

The page is gated by your existing admin auth (`AdminGate`) and includes `<meta name="robots" content="noindex,nofollow">` so it can't be indexed.

## Step 1 — You create a Google service account (one-time, ~5 min)

I'll guide you, you do the clicks. Here's exactly what to do:

1. Go to https://console.cloud.google.com → create a new project (or pick an existing one), e.g. "UKTestHub Analytics".
2. In that project: **APIs & Services → Library** → search **Google Analytics Data API** → **Enable**.
3. **APIs & Services → Credentials → Create credentials → Service account**.
   - Name: `uktesthub-ga-reader`
   - Role: leave blank (no GCP IAM role needed)
   - Click **Done**.
4. Open the new service account → **Keys** tab → **Add key → Create new key → JSON**. A `.json` file downloads. Keep it safe.
5. Open the JSON, copy the value of `client_email` (looks like `uktesthub-ga-reader@…iam.gserviceaccount.com`).
6. In **GA4 → Admin → Property access management** (property `466514625`), click **+ → Add users**, paste that email, role **Viewer**, **Add**.

Once you have the JSON file, I'll request two secrets via the secrets prompt:

- `GA_SERVICE_ACCOUNT_EMAIL` — the `client_email` value
- `GA_SERVICE_ACCOUNT_PRIVATE_KEY` — the `private_key` value (the long `-----BEGIN PRIVATE KEY-----…` block, newlines and all)

Splitting them into two secrets avoids JSON-escaping headaches and is a common pattern for Workers/edge runtimes.

The Property ID `466514625` is not secret and will be a constant in the server function.

## Step 2 — Backend (TanStack server function, runs on the edge)

New file `src/lib/server-fns/ga-analytics.functions.ts` exposes one server function `getGaDashboard()`:

- Mints a Google OAuth2 access token using the service account, signing a JWT with **Web Crypto** (no Node-only `google-auth-library` — it doesn't run in the Worker runtime).
- In parallel, calls:
  - `POST analyticsdata.googleapis.com/v1beta/properties/466514625:runRealtimeReport` × 1 (returns activeUsers + screenPageViews for last 30 min)
  - `POST …:runReport` × 3 (30-day daily, 48-hour hourly pageviews, 48-hour hourly users)
- Server-side, slices the hourly data to the most recent **rolling 24 hours** in Europe/London time.
- Returns a typed DTO:
  ```
  { realtime: { activeUsers, pageviews },
    pageviews30d: number,
    pageviews24h: number,
    visitors24h:  number,
    hourly:  [{ hour: "2026-05-13T22:00", pageviews }],
    daily:   [{ date: "2026-05-13",       pageviews }],
    fetchedAt: ISO }
  ```
- Wrapped in `requireSupabaseAuth` middleware **and** an internal `has_role('admin')` check, so even with a token, only admins can call it.
- Returns a friendly `{ error }` shape on Google API failures (no blank screens).

A small helper `src/lib/server-fns/google-jwt.server.ts` handles the JWT signing and token caching (in-memory, ~50 min lifetime to stay under Google's 1 h token expiry).

## Step 3 — Frontend page

New route `src/routes/admin-kb20.ga-analytics.tsx`:

- Wrapped in `<AdminGate>` (matches your other admin pages).
- `head()` sets title "GA Analytics — Admin" and `meta name=robots content=noindex,nofollow`.
- Uses TanStack Query: `useQuery({ queryKey: ['ga-dashboard'], queryFn: getGaDashboard, refetchInterval: autoRefresh ? 60_000 : false })`.
- Renders 5 KPI cards (shadcn `Card`), two charts using **Recharts** (already in the project via shadcn `chart.tsx`), the refresh button, the auto-refresh toggle, and "Last updated HH:mm:ss".
- Loading skeletons + an error banner if the server fn returns `{ error }`.

A small link is added to `src/routes/admin-kb20.index.tsx` so you can navigate there from the admin home.

## Files to create / change

Create:
- `src/lib/server-fns/google-jwt.server.ts`
- `src/lib/server-fns/ga-analytics.functions.ts`
- `src/routes/admin-kb20.ga-analytics.tsx`

Change:
- `src/routes/admin-kb20.index.tsx` — add a link card to the new page.

No DB migrations. No new npm dependencies (Web Crypto + `fetch` are sufficient; Recharts and shadcn `chart` are already installed).

## Security checklist

- Service account credentials live only as server secrets; never bundled into the client.
- Server fn requires authenticated **and** admin role; returns 403 otherwise.
- Page wrapped in `AdminGate` and marked `noindex,nofollow`.
- Auto-refresh pauses when the tab is hidden (`refetchIntervalInBackground: false` — Query default).

## After deploy — verification

1. Open `/admin-kb20/ga-analytics` while logged in as admin → cards populate, charts render.
2. Open in an incognito window without admin login → 404/redirect.
3. View page source → no service account email, no private key, no Google API URL.
4. Realtime card matches GA4 → Realtime within ~30 s.
