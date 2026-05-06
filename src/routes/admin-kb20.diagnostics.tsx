import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRecentServerLogs } from "@/lib/server-fns/diagnostics.functions";
import { loadTopicFileForAdmin, listAllTopics } from "@/data/mocks";
import { loadOverrides, applyOverrideToQuestionRecord } from "@/lib/overrides";

type TopicStat = {
  topic: string;
  total: number;
  withImage: number;
  byType: Record<string, number>;
  imagePaths: string[];
};

function fileExists(path: string, publicImages: Set<string>): boolean {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  if (publicImages.has(normalised)) return true;
  if (/^https?:\/\//.test(path)) return true;
  return false;
}

export const Route = createFileRoute("/admin-kb20/diagnostics")({
  head: () => ({ meta: [{ title: "Diagnostics — Admin — UK Test Hub" }, { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" }] }),
  component: () => (
    <AdminGate>
      <Diagnostics />
    </AdminGate>
  ),
});

function Diagnostics() {
  const [stats, setStats] = useState<TopicStat[]>([]);
  const [publicImages, setPublicImages] = useState<Set<string>>(new Set());
  const [assetError, setAssetError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/mocks/diagnostics.json").then((r) => (r.ok ? r.json() : Promise.reject(new Error("diagnostics failed")))),
      fetch("/mocks/image-inventory.json").then((r) => (r.ok ? r.json() : Promise.reject(new Error("image inventory failed")))),
    ])
      .then(([diagnostics, images]) => {
        setStats(
          Object.values(diagnostics as Record<string, TopicStat>).sort((a, b) =>
            a.topic.localeCompare(b.topic),
          ),
        );
        setPublicImages(new Set(images as string[]));
      })
      .catch((e) => setAssetError(String(e?.message ?? e)));
  }, []);

  const allReferenced = useMemo(() => {
    const s = new Set<string>();
    for (const t of stats) for (const p of t.imagePaths) s.add(p);
    return s;
  }, [stats]);

  const missing = useMemo(() => {
    const out: { topic: string; path: string }[] = [];
    for (const t of stats)
      for (const p of t.imagePaths) if (!fileExists(p, publicImages)) out.push({ topic: t.topic, path: p });
    return out;
  }, [stats, publicImages]);

  const orphans = useMemo(() => {
    const out: string[] = [];
    for (const rel of publicImages) {
      if (!allReferenced.has(rel)) out.push(rel);
    }
    return out.sort();
  }, [allReferenced, publicImages]);

  const totals = useMemo(() => {
    const total = stats.reduce((n, s) => n + s.total, 0);
    const withImg = stats.reduce((n, s) => n + s.withImage, 0);
    return { total, withImg, topics: stats.length };
  }, [stats]);

  const [recent, setRecent] = useState<
    { topic: string; question_id: string; updated_at: string }[]
  >([]);
  useEffect(() => {
    supabase
      .from("question_overrides")
      .select("topic,question_id,updated_at")
      .order("updated_at", { ascending: false })
      .limit(25)
      .then(({ data }) => setRecent(data ?? []));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold">Diagnostics</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Question bank stats, missing question images, orphaned assets, and
        recent admin edits.
      </p>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Card label="Topics" value={totals.topics} />
        <Card label="Total questions" value={totals.total} />
        <Card label="With images" value={totals.withImg} />
      </section>

      <Section title={`Missing question images (${missing.length})`}>
        {missing.length === 0 ? (
          <Empty>All referenced images resolve.</Empty>
        ) : (
          <ul className="mt-2 max-h-96 divide-y divide-border overflow-auto rounded-md border border-border bg-card text-sm">
            {missing.map((m, i) => (
              <li key={i} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="truncate font-mono text-xs">{m.path}</span>
                <Badge variant="outline">{m.topic}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`Orphaned images in /public (${orphans.length})`}>
        {orphans.length === 0 ? (
          <Empty>No orphaned images.</Empty>
        ) : (
          <ul className="mt-2 max-h-96 divide-y divide-border overflow-auto rounded-md border border-border bg-card text-xs font-mono">
            {orphans.slice(0, 500).map((p) => (
              <li key={p} className="px-3 py-1.5 truncate">{p}</li>
            ))}
            {orphans.length > 500 && (
              <li className="px-3 py-2 text-muted-foreground">
                …and {orphans.length - 500} more
              </li>
            )}
          </ul>
        )}
      </Section>

      <Section title="Per-topic stats">
        <div className="mt-2 overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase">
              <tr>
                <th className="px-3 py-2 text-left">Topic</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-right">With image</th>
                <th className="px-3 py-2 text-left">Types</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.topic} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{s.topic}</td>
                  <td className="px-3 py-2 text-right">{s.total}</td>
                  <td className="px-3 py-2 text-right">{s.withImage}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {Object.entries(s.byType)
                      .map(([k, v]) => `${k}:${v}`)
                      .join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={`Recent admin edits (${recent.length})`}>
        {recent.length === 0 ? (
          <Empty>No edits yet.</Empty>
        ) : (
          <ul className="mt-2 divide-y divide-border rounded-md border border-border bg-card text-sm">
            {recent.map((r, i) => (
              <li key={i} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="font-mono text-xs">
                  {r.topic} / {r.question_id}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.updated_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <IncompleteQuestions />
      <ServerLogs />
    </main>
  );
}

type Incomplete = { topic: string; id: string; type: string; question: string; reason: string };

function IncompleteQuestions() {
  const [rows, setRows] = useState<Incomplete[] | null>(null);
  const [scanning, setScanning] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const scan = async () => {
    setScanning(true);
    setErr(null);
    try {
      const overrides = await loadOverrides();
      const topics = listAllTopics();
      const out: Incomplete[] = [];
      for (const t of topics) {
        const file = await loadTopicFileForAdmin(t.topic);
        if (!file) continue;
        const bank = (file as { bank?: Record<string, unknown>[]; tests?: { questions: Record<string, unknown>[] }[] }).bank
          ?? (file as { tests?: { questions: Record<string, unknown>[] }[] }).tests?.flatMap((x) => x.questions)
          ?? [];
        for (const rawQ of bank) {
          const id = String((rawQ as { id?: string }).id ?? "");
          if (!id) continue;
          const ov = overrides.get(`${t.topic}::${id}`);
          if (ov?.disabled) continue;
          const q = applyOverrideToQuestionRecord(rawQ, ov) as Record<string, unknown>;
          const type = String(q.type ?? "");
          const reason = checkIncomplete(type, q);
          if (reason) {
            out.push({
              topic: t.topic,
              id,
              type,
              question: String(q.question ?? q.template ?? q.prompt ?? "").slice(0, 140),
              reason,
            });
          }
        }
      }
      setRows(out);
    } catch (e) {
      setErr(String(e instanceof Error ? e.message : e));
    } finally {
      setScanning(false);
    }
  };

  return (
    <Section title={`Incomplete questions${rows ? ` (${rows.length})` : ""}`}>
      <p className="mt-1 text-xs text-muted-foreground">
        Scans every question (with overrides applied) for missing answers, options, blanks or hot-spot data.
      </p>
      <div className="mt-2 flex items-center gap-2">
        <Button size="sm" onClick={scan} disabled={scanning}>
          {scanning ? "Scanning…" : rows ? "Re-scan" : "Scan all topics"}
        </Button>
        {err && <span className="text-xs text-destructive">{err}</span>}
      </div>
      {rows && rows.length === 0 && <Empty>No incomplete questions found.</Empty>}
      {rows && rows.length > 0 && (
        <ul className="mt-3 max-h-[28rem] divide-y divide-border overflow-auto rounded-md border border-border bg-card text-sm">
          {rows.map((r) => (
            <li key={`${r.topic}::${r.id}`} className="px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{r.topic}</Badge>
                <code className="text-[10px] text-muted-foreground">{r.id}</code>
                <Badge variant="secondary">{r.type}</Badge>
                <Badge variant="destructive">{r.reason}</Badge>
                <Link
                  to="/admin-kb20/questions/$topic"
                  params={{ topic: r.topic }}
                  search={{ edit: r.id }}
                  className="ml-auto text-xs font-semibold text-coral hover:underline"
                >
                  Fix →
                </Link>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{r.question}</p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function checkIncomplete(type: string, q: Record<string, unknown>): string | null {
  const t = type.replace(/_/g, "-");
  const opts = q.options as unknown[] | undefined;
  const ca = q.correctAnswer;
  const cas = q.correctAnswers as unknown[] | undefined;
  if (t === "true-false") {
    if (typeof ca !== "boolean") return "no answer";
    return null;
  }
  if (t === "multiple-response") {
    if (!Array.isArray(opts) || opts.length < 2) return "missing options";
    if (!Array.isArray(cas) || cas.length === 0) return "no answer";
    return null;
  }
  if (t === "numeric-entry") {
    if (typeof ca !== "number") return "no answer";
    return null;
  }
  if (t === "fill-blanks" || t === "drag-drop-blanks" || t === "dropdown-blanks") {
    const blanks = q.blanks as { options?: unknown[]; correctIndex?: number }[] | undefined;
    if (!Array.isArray(blanks) || blanks.length === 0) return "no blanks";
    for (const b of blanks) {
      if (!Array.isArray(b.options) || b.options.length < 2) return "blank missing options";
      if (typeof b.correctIndex !== "number") return "blank missing answer";
    }
    return null;
  }
  if (t === "hot-spot") {
    const spots = q.spots as { id?: string }[] | undefined;
    if (!Array.isArray(spots) || spots.length === 0) return "no spots";
    if (!q.correctSpotId) return "no answer";
    return null;
  }
  // mcq, image-question, multiple-choice, default
  if (!Array.isArray(opts) || opts.length < 2) return "missing options";
  if (typeof ca !== "number") return "no answer";
  if (ca < 0 || ca >= opts.length) return "answer out of range";
  return null;
}

type ServerLog = { id: string; level: string; message: string; context: unknown; created_at: string };

function ServerLogs() {
  const [logs, setLogs] = useState<ServerLog[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = () => {
    setLoading(true);
    getRecentServerLogs()
      .then((r) => {
        setLogs(((r.logs ?? []) as unknown) as ServerLog[]);
        setErr(r.error);
      })
      .catch((e) => setErr(String(e?.message ?? e)))
      .finally(() => setLoading(false));
  };
  useEffect(() => { refresh(); }, []);
  return (
    <Section title={`Recent server/runtime logs (${logs.length})`}>
      <div className="mb-2 flex items-center gap-2">
        <button
          onClick={refresh}
          className="rounded-md border border-border bg-background px-3 py-1 text-xs hover:bg-muted"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
        {err && <span className="text-xs text-destructive">{err}</span>}
      </div>
      {logs.length === 0 ? (
        <Empty>No server logs captured yet.</Empty>
      ) : (
        <ul className="mt-2 max-h-96 divide-y divide-border overflow-auto rounded-md border border-border bg-card text-xs">
          {logs.map((l) => (
            <li key={l.id} className="px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={l.level === "error" ? "destructive" : "outline"}>{l.level}</Badge>
                <span className="text-muted-foreground">{new Date(l.created_at).toLocaleString()}</span>
              </div>
              <div className="mt-1 font-mono">{l.message}</div>
              {l.context ? (
                <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-2 text-[10px]">
                  {JSON.stringify(l.context, null, 2)}
                </pre>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">
      {children}
    </p>
  );
}
