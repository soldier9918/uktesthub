import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AdminGate } from "@/components/AdminGate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/categories";
import {
  type BankBlankFinding,
  findLiveBadFragments,
  LIVE_BAD_FRAGMENTS,
  scanBankForBlankOptionIssues,
} from "@/lib/admin/blank-options";
import { repairTopicBlankOptions } from "@/lib/admin/blank-options.functions";

export const Route = createFileRoute("/admin-kb20/blank-options-health")({
  head: () => ({
    meta: [
      { title: "Blank Options Health — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <BlankOptionsHealthPage />
    </AdminGate>
  ),
});

type TopicScan = {
  topic: string;
  title: string;
  cat: string;
  ok: boolean;
  error?: string;
  findings: BankBlankFinding[];
};

function BlankOptionsHealthPage() {
  const allTopics = useMemo(
    () =>
      categories.flatMap((c) =>
        c.topics.map((t) => ({ slug: t.slug, title: t.title, cat: c.title })),
      ),
    [],
  );

  const [scans, setScans] = useState<TopicScan[]>([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [ielts, setIelts] = useState<{ ok: boolean; hits: string[] } | null>(null);
  const [repairResult, setRepairResult] = useState<string | null>(null);
  const [repairing, setRepairing] = useState<string | null>(null);

  const repairFn = useServerFn(repairTopicBlankOptions);

  const scanAll = async () => {
    setScanning(true);
    setScans([]);
    setProgress({ done: 0, total: allTopics.length });
    const out: TopicScan[] = [];
    // Sequential with small batching to avoid overwhelming the dev server.
    const batchSize = 8;
    for (let i = 0; i < allTopics.length; i += batchSize) {
      const batch = allTopics.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (t): Promise<TopicScan> => {
          try {
            const res = await fetch(`/mocks/${t.slug}.json`, { cache: "no-store" });
            if (!res.ok) {
              return { topic: t.slug, title: t.title, cat: t.cat, ok: false, error: `HTTP ${res.status}`, findings: [] };
            }
            const json = (await res.json()) as { bank?: unknown[] };
            const bank = Array.isArray(json.bank) ? json.bank : [];
            const findings = scanBankForBlankOptionIssues(bank);
            return { topic: t.slug, title: t.title, cat: t.cat, ok: true, findings };
          } catch (e) {
            return { topic: t.slug, title: t.title, cat: t.cat, ok: false, error: (e as Error).message, findings: [] };
          }
        }),
      );
      out.push(...results);
      setScans([...out]);
      setProgress({ done: out.length, total: allTopics.length });
    }
    setScanning(false);
  };

  const verifyIelts = async () => {
    setIelts(null);
    try {
      const res = await fetch(`/mocks/ielts.json`, { cache: "no-store" });
      const txt = await res.text();
      const hits = findLiveBadFragments(txt);
      setIelts({ ok: hits.length === 0, hits });
    } catch (e) {
      setIelts({ ok: false, hits: [(e as Error).message] });
    }
  };

  const repair = async (topic: string) => {
    setRepairing(topic);
    setRepairResult(null);
    try {
      const r = await repairFn({ data: { topic } });
      setRepairResult(
        r.committed
          ? `${topic}: committed. Cleaned ${r.optionsFixed}, removed ${r.optionsRemoved}. Re-scan in ~1 min after deploy.`
          : `${topic}: ${r.message}`,
      );
    } catch (e) {
      setRepairResult(`${topic}: ${(e as Error).message}`);
    } finally {
      setRepairing(null);
    }
  };

  const dirtyTopics = scans.filter((s) => s.findings.length > 0);
  const totalFindings = scans.reduce((n, s) => n + s.findings.length, 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Blank Options Health</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Scans every <code>dropdown-blanks</code> / <code>drag-drop-blanks</code> question across
        all topics for malformed options (JSON-key or template leaks like{" "}
        <code>{`}},explanation`}</code>). Dropdown options must come only from clean{" "}
        <code>blanks[].options[]</code> values — never from splitting raw text. Question types are
        never changed by repair.
      </p>

      <section className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-5">
        <Button onClick={scanAll} disabled={scanning}>
          {scanning ? `Scanning ${progress.done}/${progress.total}…` : "Scan all topics"}
        </Button>
        <Button variant="outline" onClick={verifyIelts}>
          Scan live JSON for malformed dropdown options (IELTS)
        </Button>
        {scans.length > 0 && !scanning && (
          <span className="text-sm text-muted-foreground">
            {scans.length} topics scanned · {dirtyTopics.length} with issues · {totalFindings} total
            findings
          </span>
        )}
      </section>

      {ielts && (
        <div
          className={`mt-4 rounded-xl border p-3 text-sm ${
            ielts.ok
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-rose-500/40 bg-rose-500/10"
          }`}
        >
          {ielts.ok ? (
            <>
              <strong>Live ielts.json is clean.</strong> Zero matches for{" "}
              {LIVE_BAD_FRAGMENTS.map((f) => `"${f}"`).join(", ")}.
            </>
          ) : (
            <>
              <strong>Live ielts.json still contains malformed fragments:</strong>{" "}
              {ielts.hits.join(", ")}
            </>
          )}
        </div>
      )}

      {repairResult && (
        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3 text-sm">
          {repairResult}
        </div>
      )}

      {dirtyTopics.length > 0 && (
        <section className="mt-6 space-y-4">
          {dirtyTopics.map((s) => (
            <div key={s.topic} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-semibold">
                    {s.cat} — {s.title}
                  </h2>
                  <div className="text-xs text-muted-foreground">
                    <code>{s.topic}</code> · {s.findings.length} findings
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => repair(s.topic)}
                  disabled={repairing !== null}
                >
                  {repairing === s.topic ? "Repairing…" : "Repair & commit"}
                </Button>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-3">Question</th>
                      <th className="py-2 pr-3">Field</th>
                      <th className="py-2 pr-3">Current</th>
                      <th className="py-2 pr-3">Suggested</th>
                      <th className="py-2 pr-3">Fix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.findings.slice(0, 100).map((f, i) => (
                      <tr key={i} className="border-t border-border align-top">
                        <td className="py-2 pr-3 font-mono text-xs">
                          {f.questionId}
                          <div className="text-[10px] text-muted-foreground">{f.type}</div>
                        </td>
                        <td className="py-2 pr-3 text-xs">
                          blank {f.blankIndex} · opt {f.optionIndex}
                        </td>
                        <td className="py-2 pr-3 text-xs">
                          <code className="break-all text-rose-700">{f.currentValue}</code>
                        </td>
                        <td className="py-2 pr-3 text-xs">
                          <code className="break-all text-emerald-700">
                            {f.suggestedValue || "(remove)"}
                          </code>
                        </td>
                        <td className="py-2 pr-3">
                          <Badge
                            variant="secondary"
                            className={
                              f.autoFix
                                ? "bg-emerald-500/20 text-emerald-700"
                                : "bg-amber-500/20 text-amber-700"
                            }
                          >
                            {f.autoFix ? "auto" : "manual"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {s.findings.length > 100 && (
                      <tr>
                        <td colSpan={5} className="py-2 text-xs text-muted-foreground">
                          … and {s.findings.length - 100} more
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      )}

      {!scanning && scans.length > 0 && dirtyTopics.length === 0 && (
        <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm">
          <strong>All clean.</strong> No malformed dropdown options found across {scans.length}{" "}
          topics.
        </div>
      )}
    </main>
  );
}
