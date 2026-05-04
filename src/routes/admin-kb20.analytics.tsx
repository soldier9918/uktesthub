import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

type Row = {
  event_type: string;
  topic_slug: string | null;
  mock_slug: string | null;
  path: string | null;
  created_at: string;
};

export const Route = createFileRoute("/admin-kb20/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <Analytics />
    </AdminGate>
  ),
});

function Analytics() {
  const [rows, setRows] = useState<Row[]>([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const since = new Date(Date.now() - days * 86_400_000).toISOString();
    supabase
      .from("quiz_events")
      .select("event_type,topic_slug,mock_slug,path,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000)
      .then(({ data }) => {
        setRows(((data ?? []) as Row[]));
        setLoading(false);
      });
  }, [days]);

  const totals = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(r.event_type, (m.get(r.event_type) ?? 0) + 1);
    return m;
  }, [rows]);

  const topPages = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) {
      if (r.event_type !== "page_view" || !r.path) continue;
      m.set(r.path, (m.get(r.path) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 25);
  }, [rows]);

  const topMocks = useMemo(() => {
    type Stat = { starts: number; completes: number };
    const m = new Map<string, Stat>();
    for (const r of rows) {
      if (!r.mock_slug) continue;
      const s = m.get(r.mock_slug) ?? { starts: 0, completes: 0 };
      if (r.event_type === "quiz_start") s.starts++;
      if (r.event_type === "quiz_complete") s.completes++;
      m.set(r.mock_slug, s);
    }
    return Array.from(m.entries())
      .map(([slug, s]) => ({
        slug,
        ...s,
        dropOff: s.starts ? Math.round(((s.starts - s.completes) / s.starts) * 100) : 0,
      }))
      .sort((a, b) => b.starts - a.starts)
      .slice(0, 25);
  }, [rows]);

  const series = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const r of rows) {
      if (r.event_type !== "page_view") continue;
      const day = r.created_at.slice(0, 10);
      buckets.set(day, (buckets.get(day) ?? 0) + 1);
    }
    return Array.from(buckets.entries()).sort();
  }, [rows]);
  const max = Math.max(1, ...series.map(([, n]) => n));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        >
          <option value={1}>Last 24 hours</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          <section className="mt-6 grid gap-3 sm:grid-cols-4">
            <Card label="Page views" value={totals.get("page_view") ?? 0} />
            <Card label="Quiz starts" value={totals.get("quiz_start") ?? 0} />
            <Card label="Quiz completes" value={totals.get("quiz_complete") ?? 0} />
            <Card
              label="Completion rate"
              value={
                totals.get("quiz_start")
                  ? `${Math.round(
                      ((totals.get("quiz_complete") ?? 0) / (totals.get("quiz_start") ?? 1)) * 100,
                    )}%`
                  : "—"
              }
            />
          </section>

          <section className="mt-6 rounded-xl border border-border bg-card p-4">
            <h2 className="font-semibold">Page views per day</h2>
            <div className="mt-3 flex items-end gap-1 h-32">
              {series.map(([day, n]) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-coral/70"
                    style={{ height: `${(n / max) * 100}%`, minHeight: 2 }}
                    title={`${day}: ${n}`}
                  />
                  <span className="text-[9px] text-muted-foreground">{day.slice(5)}</span>
                </div>
              ))}
              {series.length === 0 && (
                <p className="text-sm text-muted-foreground">No page-view events yet.</p>
              )}
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="font-semibold">Top pages</h2>
              <ul className="mt-2 divide-y divide-border text-sm">
                {topPages.map(([p, n]) => (
                  <li key={p} className="flex items-center justify-between gap-2 py-1.5">
                    <code className="truncate text-xs">{p}</code>
                    <Badge variant="outline">{n}</Badge>
                  </li>
                ))}
                {topPages.length === 0 && (
                  <li className="py-3 text-muted-foreground">No data</li>
                )}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="font-semibold">Top mocks (start → complete)</h2>
              <ul className="mt-2 divide-y divide-border text-sm">
                {topMocks.map((m) => (
                  <li key={m.slug} className="flex items-center justify-between gap-2 py-1.5">
                    <code className="truncate text-xs">{m.slug}</code>
                    <span className="text-xs text-muted-foreground">
                      {m.starts} → {m.completes}
                      <Badge variant="secondary" className="ml-2">
                        {m.dropOff}% drop
                      </Badge>
                    </span>
                  </li>
                ))}
                {topMocks.length === 0 && (
                  <li className="py-3 text-muted-foreground">No data</li>
                )}
              </ul>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function Card({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}
