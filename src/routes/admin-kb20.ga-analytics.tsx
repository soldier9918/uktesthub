import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { getGaDashboard, type GaDashboard } from "@/lib/server-fns/ga-analytics.functions";
import {
  getGaConnectionStatus,
  getGaOAuthStartUrl,
  disconnectGaOAuth,
} from "@/lib/server-fns/ga-oauth.functions";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/admin-kb20/ga-analytics")({
  head: () => ({
    meta: [
      { title: "GA Analytics — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <GaAnalytics />
    </AdminGate>
  ),
});

function GaAnalytics() {
  const [data, setData] = useState<GaDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [googleEmail, setGoogleEmail] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const getToken = async () => {
    const { data: sess } = await supabase.auth.getSession();
    return sess.session?.access_token ?? null;
  };

  const checkStatus = useMemo(
    () => async () => {
      const accessToken = await getToken();
      if (!accessToken) return;
      const s = await getGaConnectionStatus({ data: { accessToken } });
      setConnected(s.connected);
      setGoogleEmail(s.email);
      return s.connected;
    },
    [],
  );

  const load = useMemo(
    () => async () => {
      setRefreshing(true);
      try {
        const accessToken = await getToken();
        if (!accessToken) {
          setError("Not signed in");
          return;
        }
        const r = await getGaDashboard({ data: { accessToken } });
        if (r.error) setError(r.error);
        else setError(null);
        if (r.data) setData(r.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    (async () => {
      const isConnected = await checkStatus();
      if (isConnected) load();
      else setLoading(false);
    })();
  }, [checkStatus, load]);

  useEffect(() => {
    if (!autoRefresh || !connected) return;
    const id = setInterval(() => load(), 60_000);
    return () => clearInterval(id);
  }, [autoRefresh, connected, load]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const accessToken = await getToken();
      if (!accessToken) return;
      const { url } = await getGaOAuthStartUrl({
        data: { accessToken, origin: window.location.origin },
      });
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    const accessToken = await getToken();
    if (!accessToken) return;
    await disconnectGaOAuth({ data: { accessToken } });
    setConnected(false);
    setGoogleEmail(null);
    setData(null);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">GA4 Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Property 466514625 · Measurement ID G-P2CME6M6GE
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} id="auto" />
            <label htmlFor="auto" className="cursor-pointer text-muted-foreground">
              Auto-refresh 60s
            </label>
          </div>
          <Button onClick={() => load()} disabled={refreshing} size="sm">
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
        </div>
      </div>

      {data && (
        <p className="mt-2 text-xs text-muted-foreground">
          Last updated {new Date(data.fetchedAt).toLocaleTimeString()}
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="mt-8 text-sm text-muted-foreground">Loading GA4 data…</div>
      ) : data ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Kpi label="Active users (30 min)" value={data.realtime.activeUsers} live />
            <Kpi label="Pageviews (30 min)" value={data.realtime.pageviews} live />
            <Kpi label="Pageviews (24 h)" value={data.pageviews24h} />
            <Kpi label="Visitors (24 h)" value={data.visitors24h} />
            <Kpi label="Pageviews (30 d)" value={data.pageviews30d} />
          </div>

          <Card className="mt-6 p-4">
            <h2 className="text-sm font-semibold">Pageviews — last 24 hours</h2>
            <div className="mt-3 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.hourly}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(v: string) => v.slice(11, 13)}
                    fontSize={11}
                  />
                  <YAxis fontSize={11} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="pageviews" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="mt-4 p-4">
            <h2 className="text-sm font-semibold">Pageviews — last 30 days</h2>
            <div className="mt-3 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.daily}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v: string) => v.slice(5)}
                    fontSize={11}
                  />
                  <YAxis fontSize={11} allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="pageviews"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      ) : null}
    </main>
  );
}

function Kpi({ label, value, live }: { label: string; value: number; live?: boolean }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        {live && <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />}
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold tabular-nums">{value.toLocaleString()}</div>
    </Card>
  );
}
