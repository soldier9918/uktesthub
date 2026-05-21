import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getGoogleAccessToken } from "./google-jwt.server";

const PROPERTY_ID = "466514625";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

const InputSchema = z.object({
  accessToken: z.string().min(20).max(4096),
});

export type GaDashboard = {
  realtime: { activeUsers: number; pageviews: number };
  realtimeRaw: { activeUsersResponse: string; pageviewsResponse: string };
  pageviews30d: number;
  pageviews24h: number;
  visitors24h: number;
  pageviewsYTD: number;
  hourly: { hour: string; pageviews: number; users: number }[];
  daily: { date: string; pageviews: number }[];
  monthly: { month: string; pageviews: number }[];
  fetchedAt: string;
};

async function gaFetch(path: string, body: unknown, token: string) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:${path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GA ${path} ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json() as Promise<{
    rows?: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }[];
  }>;
}

export const getGaDashboard = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<{ data: GaDashboard | null; error: string | null }> => {
    // Auth: verify token + admin role
    const { data: userRes, error: userErr } = await supabaseAdmin.auth.getUser(data.accessToken);
    if (userErr || !userRes?.user) return { data: null, error: "Unauthorized" };
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userRes.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return { data: null, error: "Forbidden" };

    try {
      const token = await getGoogleAccessToken(SCOPE);

      // Realtime: TWO separate runRealtimeReport calls (one per metric) per spec.
      // No caching, no runReport fallback for live cards.
      const currentYear = new Date().getUTCFullYear();
      const yearStart = `${currentYear}-01-01`;
      const [activeUsersRt, pageviewsRt, daily30, hourlyViews, hourlyUsers, monthlyYTD] = await Promise.all([
        gaFetch("runRealtimeReport", { metrics: [{ name: "activeUsers" }] }, token),
        gaFetch("runRealtimeReport", { metrics: [{ name: "screenPageViews" }] }, token),
        gaFetch(
          "runReport",
          {
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            dimensions: [{ name: "date" }],
            metrics: [{ name: "screenPageViews" }],
            orderBys: [{ dimension: { dimensionName: "date" } }],
            limit: 100,
          },
          token,
        ),
        gaFetch(
          "runReport",
          {
            dateRanges: [{ startDate: "yesterday", endDate: "today" }],
            dimensions: [{ name: "dateHour" }],
            metrics: [{ name: "screenPageViews" }],
            orderBys: [{ dimension: { dimensionName: "dateHour" } }],
            limit: 100,
          },
          token,
        ),
        gaFetch(
          "runReport",
          {
            dateRanges: [{ startDate: "yesterday", endDate: "today" }],
            dimensions: [{ name: "dateHour" }],
            metrics: [{ name: "activeUsers" }],
            orderBys: [{ dimension: { dimensionName: "dateHour" } }],
            limit: 100,
          },
          token,
        ),
        gaFetch(
          "runReport",
          {
            dateRanges: [{ startDate: yearStart, endDate: "today" }],
            dimensions: [{ name: "yearMonth" }],
            metrics: [{ name: "screenPageViews" }],
            orderBys: [{ dimension: { dimensionName: "yearMonth" } }],
            limit: 24,
          },
          token,
        ),
      ]);

      // Realtime totals — strictly from runRealtimeReport responses
      const realtimeData = {
        activeUsers: Number(activeUsersRt.rows?.[0]?.metricValues?.[0]?.value ?? 0),
        pageviews: Number(pageviewsRt.rows?.[0]?.metricValues?.[0]?.value ?? 0),
      };
      const realtimeRaw = {
        activeUsersResponse: JSON.stringify(activeUsersRt),
        pageviewsResponse: JSON.stringify(pageviewsRt),
      };

      // Daily (30 days)
      const daily = (daily30.rows ?? [])
        .map((r) => {
          const d = r.dimensionValues?.[0]?.value ?? ""; // YYYYMMDD
          const date = d.length === 8 ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` : d;
          return { date, pageviews: Number(r.metricValues?.[0]?.value ?? 0) };
        })
        .sort((a, b) => a.date.localeCompare(b.date));
      const pageviews30d = daily.reduce((s, x) => s + x.pageviews, 0);

      // Hourly: build a map keyed by ISO hour, then slice last 24
      const viewsMap = new Map<string, number>();
      for (const r of hourlyViews.rows ?? []) {
        const dh = r.dimensionValues?.[0]?.value ?? ""; // YYYYMMDDHH
        if (dh.length !== 10) continue;
        const iso = `${dh.slice(0, 4)}-${dh.slice(4, 6)}-${dh.slice(6, 8)}T${dh.slice(8, 10)}:00:00Z`;
        viewsMap.set(iso, Number(r.metricValues?.[0]?.value ?? 0));
      }
      const usersMap = new Map<string, number>();
      for (const r of hourlyUsers.rows ?? []) {
        const dh = r.dimensionValues?.[0]?.value ?? "";
        if (dh.length !== 10) continue;
        const iso = `${dh.slice(0, 4)}-${dh.slice(4, 6)}-${dh.slice(6, 8)}T${dh.slice(8, 10)}:00:00Z`;
        usersMap.set(iso, Number(r.metricValues?.[0]?.value ?? 0));
      }

      // GA returns hours in property timezone; treat them as opaque labels and
      // take the most recent 24 from the union of keys.
      const allKeys = Array.from(new Set([...viewsMap.keys(), ...usersMap.keys()])).sort();
      const last24Keys = allKeys.slice(-24);
      const hourly = last24Keys.map((k) => ({
        hour: k.slice(0, 13).replace("T", " ") + ":00",
        pageviews: viewsMap.get(k) ?? 0,
        users: usersMap.get(k) ?? 0,
      }));
      const pageviews24h = hourly.reduce((s, x) => s + x.pageviews, 0);
      const visitors24h = hourly.reduce((s, x) => s + x.users, 0);

      // Monthly (YTD) — pre-fill all 12 months of the current year with 0
      const monthlyMap = new Map<string, number>();
      for (let m = 1; m <= 12; m++) {
        monthlyMap.set(`${currentYear}-${String(m).padStart(2, "0")}`, 0);
      }
      for (const r of monthlyYTD.rows ?? []) {
        const ym = r.dimensionValues?.[0]?.value ?? ""; // YYYYMM
        if (ym.length !== 6) continue;
        const key = `${ym.slice(0, 4)}-${ym.slice(4, 6)}`;
        if (monthlyMap.has(key)) {
          monthlyMap.set(key, Number(r.metricValues?.[0]?.value ?? 0));
        }
      }
      const monthly = Array.from(monthlyMap.entries())
        .map(([month, pageviews]) => ({ month, pageviews }))
        .sort((a, b) => a.month.localeCompare(b.month));
      const pageviewsYTD = monthly.reduce((s, x) => s + x.pageviews, 0);

      return {
        data: {
          realtime: realtimeData,
          realtimeRaw,
          pageviews30d,
          pageviews24h,
          visitors24h,
          pageviewsYTD,
          hourly,
          daily,
          monthly,
          fetchedAt: new Date().toISOString(),
        },
        error: null,
      };
    } catch (e) {
      console.error("getGaDashboard failed", e);
      return { data: null, error: e instanceof Error ? e.message : "Unknown error" };
    }
  });
