import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { logAdminAction } from "@/lib/admin/audit";
import { toast } from "sonner";

type AllowRow = {
  id: string;
  email: string;
  note: string | null;
  created_at: string;
};

type AuditRow = {
  id: string;
  actor_email: string | null;
  action: string;
  target: string | null;
  detail: unknown;
  created_at: string;
};

export const Route = createFileRoute("/admin-kb20/security")({
  head: () => ({
    meta: [
      { title: "Security — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <Security />
    </AdminGate>
  ),
});

function Security() {
  const [allow, setAllow] = useState<AllowRow[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [a, l] = await Promise.all([
      supabase.from("admin_allowlist").select("*").order("created_at", { ascending: false }),
      supabase
        .from("admin_audit_log")
        .select("id,actor_email,action,target,detail,created_at")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    setAllow((a.data ?? []) as AllowRow[]);
    setAudit((l.data ?? []) as AuditRow[]);
    setLoading(false);
  };
  useEffect(() => {
    void load();
  }, []);

  const add = async () => {
    const e = email.trim().toLowerCase();
    if (!e) return;
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("admin_allowlist")
      .insert([{ email: e, note: note || null, created_by: u?.user?.id ?? null }]);
    if (error) {
      toast.error(error.message);
      return;
    }
    await logAdminAction("security.allowlist.add", e, { note });
    setEmail("");
    setNote("");
    void load();
  };

  const remove = async (row: AllowRow) => {
    if (!confirm(`Remove ${row.email} from allowlist?`)) return;
    const { error } = await supabase.from("admin_allowlist").delete().eq("id", row.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await logAdminAction("security.allowlist.remove", row.email);
    void load();
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Security</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Admin email allowlist (informational) and the action audit log. The actual admin role is
        granted via the user_roles table; the allowlist here documents who is approved.
      </p>

      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold">Admin email allowlist</h2>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <div className="flex-1 min-w-[200px]">
            <div className="mb-1 text-xs text-muted-foreground">Email</div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="someone@example.com"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="mb-1 text-xs text-muted-foreground">Note (optional)</div>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Co-founder, support manager…"
            />
          </div>
          <Button onClick={add}>Add</Button>
        </div>

        <ul className="mt-4 divide-y divide-border">
          {allow.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <div className="min-w-0">
                <div className="font-medium">{r.email}</div>
                {r.note && <div className="text-xs text-muted-foreground">{r.note}</div>}
              </div>
              <button
                type="button"
                onClick={() => remove(r)}
                className="text-xs text-destructive hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
          {!loading && allow.length === 0 && (
            <li className="py-3 text-sm text-muted-foreground">No emails on the allowlist yet.</li>
          )}
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold">Activity log (latest 100)</h2>
        {loading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
        ) : audit.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No admin actions recorded yet. Actions are logged automatically as you use the admin
            tools.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border text-sm">
            {audit.map((r) => (
              <li key={r.id} className="py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{r.action}</Badge>
                  {r.target && <code className="text-xs text-muted-foreground">{r.target}</code>}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  by {r.actor_email ?? "unknown"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
