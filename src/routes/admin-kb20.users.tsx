import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { listAdminUsers, type AdminUserRow } from "@/lib/server-fns/users.functions";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin-kb20/users")({
  head: () => ({ meta: [{ title: "Users — Admin — UK Test Hub" }, { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" }] }),
  component: () => (
    <AdminGate>
      <UsersAdmin />
    </AdminGate>
  ),
});

function UsersAdmin() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data: sess } = await supabase.auth.getSession();
        const accessToken = sess.session?.access_token;
        if (!accessToken) {
          setError("Not signed in");
          return;
        }
        const r = await listAdminUsers({ data: { accessToken } });
        setRows(r.users);
        setError(r.error);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = rows.filter((r) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      r.email?.toLowerCase().includes(s) ||
      r.display_name?.toLowerCase().includes(s) ||
      r.id.toLowerCase().includes(s)
    );
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} registered {rows.length === 1 ? "user" : "users"}.
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by email or name…"
          className="w-64 rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-coral"
        />
      </div>

      {error && (
        <div className="mt-4 rounded border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Exams taken</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Tier</th>
              <th className="px-3 py-2">Attempts</th>
              <th className="px-3 py-2">Best %</th>
              <th className="px-3 py-2">Joined</th>
              <th className="px-3 py-2">Last sign-in</th>
              <th className="px-3 py-2">Confirmed</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
                  No users.
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-border align-top">
                <td className="px-3 py-2">
                  <div className="font-medium">{u.email ?? "(no email)"}</div>
                  <div className="text-xs text-muted-foreground">
                    {u.display_name ?? "—"} {u.is_admin && <Badge className="ml-1">admin</Badge>}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">{u.id}</div>
                </td>
                <td className="px-3 py-2">
                  {u.topics.length === 0 ? (
                    <span className="text-xs text-muted-foreground">—</span>
                  ) : (
                    <div className="flex max-w-[260px] flex-wrap gap-1">
                      {u.topics.map((t) => (
                        <Badge key={t} variant="outline" className="text-[10px] font-normal">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-xs">{u.provider ?? "—"}</td>
                <td className="px-3 py-2 text-xs">{u.subscription_tier}</td>
                <td className="px-3 py-2 tabular-nums">{u.attempts}</td>
                <td className="px-3 py-2 tabular-nums">{u.best_percent ?? "—"}</td>
                <td className="px-3 py-2 text-xs">{fmt(u.created_at)}</td>
                <td className="px-3 py-2 text-xs">{fmt(u.last_sign_in_at)}</td>
                <td className="px-3 py-2 text-xs">{u.email_confirmed_at ? "✓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function fmt(s: string | null) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return s;
  }
}
