import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

type AnyMockFile = {
  topic?: string;
  bank?: { id: string; image?: string; type?: string }[];
  tests?: { questions: { id?: string; image?: string; type?: string }[] }[];
};

const mockModules = import.meta.glob<AnyMockFile>("../data/mocks/*.json", {
  eager: true,
  import: "default",
});

const publicImages = import.meta.glob("/public/quiz-images/**/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

type TopicStat = {
  topic: string;
  total: number;
  withImage: number;
  byType: Record<string, number>;
  imagePaths: Set<string>;
};

function buildStats(): TopicStat[] {
  const out: TopicStat[] = [];
  for (const f of Object.values(mockModules)) {
    if (!f?.topic) continue;
    const qs: { id?: string; image?: string; type?: string }[] = [];
    if (Array.isArray(f.bank)) qs.push(...f.bank);
    else if (Array.isArray(f.tests))
      for (const t of f.tests) qs.push(...(t.questions ?? []));
    const byType: Record<string, number> = {};
    let withImage = 0;
    const imgs = new Set<string>();
    for (const q of qs) {
      const t = (q.type || "mcq").replace(/_/g, "-");
      byType[t] = (byType[t] || 0) + 1;
      if (q.image) {
        withImage++;
        imgs.add(q.image);
      }
    }
    out.push({
      topic: f.topic,
      total: qs.length,
      withImage,
      byType,
      imagePaths: imgs,
    });
  }
  return out.sort((a, b) => a.topic.localeCompare(b.topic));
}

function fileExists(path: string): boolean {
  // images referenced as e.g. "/quiz-images/foo.png" → check against bundled list as "/public/quiz-images/foo.png"
  const normalised = path.startsWith("/") ? `/public${path}` : `/public/${path}`;
  if (publicImages[normalised]) return true;
  // Also accept absolute http(s) URLs (e.g. uploaded via storage)
  if (/^https?:\/\//.test(path)) return true;
  return false;
}

export const Route = createFileRoute("/admin/diagnostics")({
  head: () => ({ meta: [{ title: "Diagnostics — Admin — UK Test Hub" }] }),
  component: () => (
    <AdminGate>
      <Diagnostics />
    </AdminGate>
  ),
});

function Diagnostics() {
  const stats = useMemo(buildStats, []);
  const allReferenced = useMemo(() => {
    const s = new Set<string>();
    for (const t of stats) for (const p of t.imagePaths) s.add(p);
    return s;
  }, [stats]);

  const missing = useMemo(() => {
    const out: { topic: string; path: string }[] = [];
    for (const t of stats)
      for (const p of t.imagePaths) if (!fileExists(p)) out.push({ topic: t.topic, path: p });
    return out;
  }, [stats]);

  const orphans = useMemo(() => {
    const out: string[] = [];
    for (const k of Object.keys(publicImages)) {
      const rel = k.replace(/^\/public/, "");
      if (!allReferenced.has(rel)) out.push(rel);
    }
    return out.sort();
  }, [allReferenced]);

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

      <p className="mt-8 text-xs text-muted-foreground">
        Note: live build/runtime server logs aren't accessible from inside the
        app. The "Recent admin edits" feed acts as an in-app activity log.
      </p>
    </main>
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
