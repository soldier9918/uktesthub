import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin-kb20/system")({
  head: () => ({
    meta: [
      { title: "System Health — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <SystemHealth />
    </AdminGate>
  ),
});

type LogRow = {
  id: string;
  level: string;
  message: string;
  created_at: string;
};

const ROUTES_TO_PROBE = [
  "/", "/about", "/contact", "/privacy", "/terms", "/sitemap.xml", "/robots.txt", "/blog",
];

type Probe = { url: string; status?: number; ok: boolean; error?: string; lastModified?: string | null };

function SystemHealth() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [probes, setProbes] = useState<Probe[]>([]);
  const [loading, setLoading] = useState(true);

  const buildSha = (import.meta.env.VITE_BUILD_SHA as string | undefined) ?? "unknown";
  const buildTime = (import.meta.env.VITE_BUILD_TIME as string | undefined) ?? "unknown";

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("runtime_logs")
        .select("id,level,message,created_at")
        .in("level", ["error", "warn"])
        .order("created_at", { ascending: false })
        .limit(50);
      setLogs((data ?? []) as LogRow[]);

      const out: Probe[] = [];
      for (const url of ROUTES_TO_PROBE) {
        try {
          const res = await fetch(url, { method: "HEAD" });
          out.push({
            url,
            status: res.status,
            ok: res.ok,
            lastModified: res.headers.get("last-modified"),
          });
        } catch (e) {
          out.push({ url, ok: false, error: (e as Error).message });
        }
      }
      setProbes(out);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">System Health</h1>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs uppercase text-muted-foreground">Build version</div>
          <div className="mt-1 font-mono text-sm">{buildSha}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs uppercase text-muted-foreground">Build time</div>
          <div className="mt-1 font-mono text-sm">{buildTime}</div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold">Route & sitemap probes</h2>
        {loading ? (
          <p className="mt-2 text-sm text-muted-foreground">Probing…</p>
        ) : (
          <table className="mt-3 w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left">URL</th>
                <th className="text-left">Status</th>
                <th className="text-left">Last-Modified</th>
              </tr>
            </thead>
            <tbody>
              {probes.map((p) => (
                <tr key={p.url} className="border-t border-border/60">
                  <td className="py-1.5 font-mono text-xs">{p.url}</td>
                  <td className="py-1.5">
                    {p.ok ? (
                      <Badge variant="secondary">{p.status}</Badge>
                    ) : (
                      <Badge variant="destructive">{p.status ?? "ERR"}</Badge>
                    )}
                  </td>
                  <td className="py-1.5 text-xs text-muted-foreground">
                    {p.lastModified ?? p.error ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold">Recent worker errors / warnings</h2>
        {logs.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No recent errors.</p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm">
            {logs.map((l) => (
              <li key={l.id} className="border-t border-border/60 py-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant={l.level === "error" ? "destructive" : "secondary"}>
                    {l.level}
                  </Badge>
                  <span>{new Date(l.created_at).toLocaleString()}</span>
                </div>
                <div className="mt-0.5 break-words">{l.message}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
