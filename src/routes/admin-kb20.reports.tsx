import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { loadMockBySlug } from "@/data/mocks";

type Report = {
  id: string;
  question_id: string;
  topic_slug: string;
  mock_slug: string | null;
  reason: string;
  details: string | null;
  status: string;
  reporter_user_id: string | null;
  created_at: string;
  resolved_at: string | null;
};

type ReportRow = Report & {
  editQuestionId: string;
  reportedQuestionNumber?: number;
};

async function resolveEditQuestionId(report: Report): Promise<ReportRow> {
  const numericQuestion = Number(report.question_id);
  if (!report.mock_slug || !Number.isInteger(numericQuestion) || numericQuestion < 1) {
    return { ...report, editQuestionId: report.question_id };
  }

  const mock = await loadMockBySlug(report.mock_slug);
  const raw = mock?.questions[numericQuestion - 1] as { id?: string } | undefined;

  return {
    ...report,
    editQuestionId: raw?.id ?? report.question_id,
    reportedQuestionNumber: numericQuestion,
  };
}

export const Route = createFileRoute("/admin-kb20/reports")({
  head: () => ({
    meta: [
      { title: "Reported Questions — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <Reports />
    </AdminGate>
  ),
});

function Reports() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"open" | "all" | "fixed" | "dismissed">("open");
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("question_reports").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    const reports = (data ?? []) as Report[];
    setRows(await Promise.all(reports.map(resolveEditQuestionId)));
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const setStatus = async (id: string, status: "open" | "fixed" | "dismissed") => {
    await supabase
      .from("question_reports")
      .update({ status, resolved_by: status === "open" ? null : user?.id ?? null })
      .eq("id", id);
    void load();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Reported Questions</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Review and resolve user reports.
      </p>

      <div className="mt-4 flex gap-2 text-xs">
        {(["open", "all", "fixed", "dismissed"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 font-semibold ${
              filter === f
                ? "border-coral bg-coral/10 text-coral"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">When</th>
              <th className="px-3 py-2 text-left">Topic</th>
              <th className="px-3 py-2 text-left">Question</th>
              <th className="px-3 py-2 text-left">Reason</th>
              <th className="px-3 py-2 text-left">Details</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-6 text-muted-foreground" colSpan={7}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-3 py-6 text-muted-foreground" colSpan={7}>No reports.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-border/60 align-top">
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-xs">{r.topic_slug}</td>
                  <td className="px-3 py-2 text-xs">
                    <Link
                      to="/admin-kb20/questions/$topic"
                      params={{ topic: r.topic_slug }}
                      search={{ q: r.editQuestionId, edit: r.editQuestionId, from: "reports" }}
                      className="font-mono text-coral hover:underline"
                    >
                      {r.question_id}
                    </Link>
                    {r.editQuestionId !== r.question_id && (
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        Opens bank ID <code>{r.editQuestionId}</code>
                      </div>
                    )}
                    {r.mock_slug && (
                      <div className="mt-1">
                        <Link
                          to="/quiz/$slug"
                          params={{ slug: r.mock_slug }}
                          className="text-muted-foreground hover:underline"
                        >
                          {r.mock_slug}
                        </Link>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs">{r.reason}</td>
                  <td className="px-3 py-2 text-xs max-w-xs">{r.details ?? "—"}</td>
                  <td className="px-3 py-2">
                    <Badge variant={r.status === "open" ? "destructive" : "secondary"}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <Link
                      to="/admin-kb20/questions/$topic"
                      params={{ topic: r.topic_slug }}
                      search={{ q: r.editQuestionId, edit: r.editQuestionId, from: "reports" }}
                      className="mr-2 inline-flex rounded-lg border border-coral bg-coral/10 px-2 py-1 text-xs font-semibold text-coral hover:bg-coral/15"
                    >
                      Edit question
                    </Link>
                    {r.status !== "fixed" && (
                      <button
                        onClick={() => setStatus(r.id, "fixed")}
                        className="mr-2 rounded-lg border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
                      >
                        Mark fixed
                      </button>
                    )}
                    {r.status !== "dismissed" && (
                      <button
                        onClick={() => setStatus(r.id, "dismissed")}
                        className="mr-2 rounded-lg border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
                      >
                        Dismiss
                      </button>
                    )}
                    {r.status !== "open" && (
                      <button
                        onClick={() => setStatus(r.id, "open")}
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
                      >
                        Re-open
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
