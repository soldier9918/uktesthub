import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { categories } from "@/data/categories";
import { loadTopicFileForAdmin } from "@/data/mocks";
import { validateTopicBank, type Finding } from "@/lib/admin/validator";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin-kb20/validator")({
  head: () => ({
    meta: [
      { title: "Question Bank Validator — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <Validator />
    </AdminGate>
  ),
});

type AnyQ = Record<string, unknown> & { id?: string; type?: string };

function Validator() {
  const allTopics = useMemo(
    () => categories.flatMap((c) => c.topics.map((t) => t.slug)),
    [],
  );
  const [findings, setFindings] = useState<Finding[]>([]);
  const [scanned, setScanned] = useState(0);
  const [running, setRunning] = useState(false);
  const [publicImages, setPublicImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/mocks/image-inventory.json")
      .then((r) => r.json())
      .then((arr: string[]) => setPublicImages(new Set(arr)))
      .catch(() => {});
  }, []);

  const run = async () => {
    setRunning(true);
    setFindings([]);
    setScanned(0);
    const out: Finding[] = [];
    for (const topic of allTopics) {
      const file = await loadTopicFileForAdmin(topic);
      if (file) {
        const bank: AnyQ[] =
          (file as { version?: number }).version === 2
            ? ((file as { bank: AnyQ[] }).bank ?? [])
            : ((file as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap(
                (t) => t.questions ?? [],
              );
        out.push(...validateTopicBank(topic, bank, publicImages));
      }
      setScanned((n) => n + 1);
    }
    setFindings(out);
    setRunning(false);
  };

  const grouped = useMemo(() => {
    const m = new Map<string, Finding[]>();
    for (const f of findings) {
      const arr = m.get(f.topic) ?? [];
      arr.push(f);
      m.set(f.topic, arr);
    }
    return Array.from(m.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [findings]);

  const download = () => {
    const blob = new Blob([JSON.stringify(findings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `validation-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Question Bank Validator</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Scans every topic for duplicates, missing explanations, broken correct answers,
        missing images, and unknown question types.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="rounded-xl bg-gradient-coral px-4 py-2 text-sm font-semibold text-coral-foreground disabled:opacity-50"
        >
          {running ? `Scanning… ${scanned}/${allTopics.length}` : "Run validation"}
        </button>
        {findings.length > 0 && (
          <button
            type="button"
            onClick={download}
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Download report (.json)
          </button>
        )}
        {findings.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {findings.length} findings across {grouped.length} topics
          </span>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {grouped.map(([topic, list]) => (
          <details key={topic} className="rounded-xl border border-border bg-card p-4" open={list.length > 0}>
            <summary className="flex cursor-pointer items-center justify-between gap-3">
              <Link
                to="/admin-kb20/questions/$topic"
                params={{ topic }}
                className="font-semibold hover:underline"
              >
                {topic}
              </Link>
              <Badge variant="destructive">{list.length}</Badge>
            </summary>
            <ul className="mt-3 space-y-1 text-sm">
              {list.map((f, i) => (
                <li key={i} className="flex flex-wrap gap-2 border-t border-border/60 py-1.5">
                  <Badge variant="secondary">{f.rule}</Badge>
                  {f.questionId && <span className="font-mono text-xs text-muted-foreground">{f.questionId}</span>}
                  <span className="text-muted-foreground">{f.message}</span>
                </li>
              ))}
            </ul>
          </details>
        ))}
        {!running && findings.length === 0 && scanned > 0 && (
          <p className="rounded-xl border border-success/40 bg-success/10 p-4 text-sm text-success">
            All clean — no validation findings.
          </p>
        )}
      </div>
    </main>
  );
}
