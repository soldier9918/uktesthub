import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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

// Heuristic: rank topic slugs against a question id so we probe the most
// likely topic file first when looking an id up. Higher = more likely.
function scoreGuess(topicSlug: string, id: string): number {
  const lid = id.toLowerCase();
  const lts = topicSlug.toLowerCase();
  if (lid.startsWith(`${lts}-`)) return 100;
  const firstSeg = lid.split("-")[0];
  if (!firstSeg) return 0;
  if (lts === firstSeg) return 80;
  if (lts.startsWith(firstSeg)) return 40;
  // Initials match: e.g. "sa" matches "safe-awareness".
  const initials = lts.split(/[-_]/).map((p) => p[0]).join("");
  if (initials === firstSeg) return 60;
  return 0;
}

const RULE_LABEL: Record<Finding["rule"], string> = {
  "duplicate-id": "Duplicate ID",
  "duplicate-text": "Duplicate text",
  "missing-explanation": "Missing explanation",
  "invalid-correct-answer": "Bad correct answer",
  "missing-image": "Missing image",
  "unknown-type": "Unknown type",
  "suspicious-characters": "Suspicious characters",
};

function Validator() {
  const allTopics = useMemo(
    () => categories.flatMap((c) => c.topics.map((t) => t.slug)),
    [],
  );
  const [findings, setFindings] = useState<Finding[]>([]);
  const [scanned, setScanned] = useState(0);
  const [running, setRunning] = useState(false);
  const [publicImages, setPublicImages] = useState<Set<string>>(new Set());
  const [ruleFilter, setRuleFilter] = useState<Finding["rule"] | "all">("all");
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);
  const [lookupId, setLookupId] = useState("");
  const [lookupBusy, setLookupBusy] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const navigate = useNavigate();

  const CACHE_KEY = "admin-validator-results-v1";

  // Restore previous results on mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          findings: Finding[];
          scanned: number;
          ruleFilter?: Finding["rule"] | "all";
          at?: string;
        };
        setFindings(parsed.findings ?? []);
        setScanned(parsed.scanned ?? 0);
        if (parsed.ruleFilter) setRuleFilter(parsed.ruleFilter);
        if (parsed.at) setLastRunAt(parsed.at);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // topic -> (questionId -> mockNumbers[])
  const [usageByTopic, setUsageByTopic] = useState<Map<string, Map<string, number[]>>>(
    new Map(),
  );

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
    const usage = new Map<string, Map<string, number[]>>();
    for (const topic of allTopics) {
      const file = await loadTopicFileForAdmin(topic);
      if (file) {
        const isV2 = (file as { version?: number }).version === 2;
        const bank: AnyQ[] = isV2
          ? ((file as { bank: AnyQ[] }).bank ?? [])
          : ((file as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap(
              (t) => t.questions ?? [],
            );
        out.push(...validateTopicBank(topic, bank, publicImages));

        // Build id -> [mockNumbers] for this topic.
        const topicUsage = new Map<string, number[]>();
        if (isV2) {
          const mocks =
            (file as { mocks?: { mockNumber: number; questionIds: string[] }[] }).mocks ?? [];
          for (const m of mocks) {
            for (const qid of m.questionIds) {
              const arr = topicUsage.get(qid) ?? [];
              arr.push(m.mockNumber);
              topicUsage.set(qid, arr);
            }
          }
        }
        usage.set(topic, topicUsage);
      }
      setScanned((n) => n + 1);
    }
    setFindings(out);
    setUsageByTopic(usage);
    setRunning(false);
    const at = new Date().toISOString();
    setLastRunAt(at);
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ findings: out, scanned: allTopics.length, ruleFilter, at }),
      );
    } catch {
      /* ignore quota errors */
    }
  };

  const clearCache = () => {
    sessionStorage.removeItem(CACHE_KEY);
    setFindings([]);
    setScanned(0);
    setLastRunAt(null);
  };

  // Resolve any question id (e.g. "sa-mc-0017") to its topic and jump to the editor.
  // First tries to match the id prefix against known topic slugs (fast path),
  // then falls back to scanning all topic files until a match is found.
  const lookupById = async () => {
    const raw = lookupId.trim();
    if (!raw) return;
    setLookupBusy(true);
    setLookupError(null);
    try {
      // Fast path: id prefix matches a topic slug or its first segment.
      const guesses = allTopics
        .map((t) => ({ topic: t, score: scoreGuess(t, raw) }))
        .filter((g) => g.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((g) => g.topic);
      const ordered = [...new Set([...guesses, ...allTopics])];

      for (const topic of ordered) {
        const file = await loadTopicFileForAdmin(topic);
        if (!file) continue;
        const bank: AnyQ[] =
          (file as { version?: number }).version === 2
            ? ((file as { bank: AnyQ[] }).bank ?? [])
            : ((file as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap(
                (t) => t.questions ?? [],
              );
        if (bank.some((q) => q.id === raw)) {
          await navigate({
            to: "/admin-kb20/questions/$topic",
            params: { topic },
            search: { q: raw, from: "validator" },
          });
          return;
        }
      }
      setLookupError(`No question found with id "${raw}".`);
    } finally {
      setLookupBusy(false);
    }
  };

  const ruleCounts = useMemo(() => {
    const m = new Map<Finding["rule"], number>();
    for (const f of findings) m.set(f.rule, (m.get(f.rule) ?? 0) + 1);
    return m;
  }, [findings]);

  const filtered = useMemo(
    () => (ruleFilter === "all" ? findings : findings.filter((f) => f.rule === ruleFilter)),
    [findings, ruleFilter],
  );

  const grouped = useMemo(() => {
    const m = new Map<string, Finding[]>();
    for (const f of filtered) {
      const arr = m.get(f.topic) ?? [];
      arr.push(f);
      m.set(f.topic, arr);
    }
    return Array.from(m.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

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
        Click any finding to open the question in the editor. Duplicates show every ID involved.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="rounded-xl bg-gradient-coral px-4 py-2 text-sm font-semibold text-coral-foreground disabled:opacity-50"
        >
          {running
            ? `Scanning… ${scanned}/${allTopics.length}`
            : findings.length > 0
              ? "Re-run validation"
              : "Run validation"}
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
          <button
            type="button"
            onClick={clearCache}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
          >
            Clear results
          </button>
        )}
        {findings.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {filtered.length} of {findings.length} findings · {grouped.length} topics
            {lastRunAt && (
              <> · last run {new Date(lastRunAt).toLocaleTimeString()}</>
            )}
          </span>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card/50 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void lookupById();
          }}
          className="flex flex-wrap items-center gap-2"
        >
          <label htmlFor="id-lookup" className="text-sm font-semibold">
            Find by ID
          </label>
          <input
            id="id-lookup"
            type="text"
            value={lookupId}
            onChange={(e) => {
              setLookupId(e.target.value);
              if (lookupError) setLookupError(null);
            }}
            placeholder="e.g. sa-mc-0017"
            className="min-w-[220px] flex-1 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-sm"
          />
          <button
            type="submit"
            disabled={lookupBusy || !lookupId.trim()}
            className="rounded-md bg-foreground px-3 py-1.5 text-sm font-semibold text-background disabled:opacity-50"
          >
            {lookupBusy ? "Searching…" : "Open"}
          </button>
          <span className="text-xs text-muted-foreground">
            Paste any question id to jump straight to it in the editor.
          </span>
        </form>
        {lookupError && (
          <p className="mt-2 text-xs text-destructive">{lookupError}</p>
        )}
      </div>

      {findings.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip active={ruleFilter === "all"} onClick={() => setRuleFilter("all")}>
            All ({findings.length})
          </FilterChip>
          {(Object.keys(RULE_LABEL) as Finding["rule"][]).map((r) => {
            const n = ruleCounts.get(r) ?? 0;
            if (n === 0) return null;
            return (
              <FilterChip
                key={r}
                active={ruleFilter === r}
                onClick={() => setRuleFilter(r)}
              >
                {RULE_LABEL[r]} ({n})
              </FilterChip>
            );
          })}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {grouped.map(([topic, list]) => (
          <details key={topic} className="rounded-xl border border-border bg-card p-4" open>
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
            <ul className="mt-3 space-y-2 text-sm">
              {list.map((f, i) => (
                <FindingRow
                  key={i}
                  finding={f}
                  usage={usageByTopic.get(f.topic)}
                />
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

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs ${
        active
          ? "border-coral bg-coral/10 text-coral"
          : "border-border bg-background hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

function FindingRow({
  finding,
  usage,
}: {
  finding: Finding;
  usage?: Map<string, number[]>;
}) {
  const isDuplicate = finding.rule === "duplicate-id" || finding.rule === "duplicate-text";
  const mocks =
    finding.questionId && usage ? (usage.get(finding.questionId) ?? []) : [];
  return (
    <li className="rounded-md border border-border/60 bg-background/50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{RULE_LABEL[finding.rule]}</Badge>
        {finding.questionId && (
          <Link
            to="/admin-kb20/questions/$topic"
            params={{ topic: finding.topic }}
            search={{ q: finding.questionId, from: "validator" }}
            className="font-mono text-xs text-coral hover:underline"
          >
            {finding.questionId} →
          </Link>
        )}
        <span className="text-xs text-muted-foreground">{finding.message}</span>
      </div>
      {finding.questionId && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
          {mocks.length === 0 ? (
            <span className="italic">Not used in any mock test (orphan)</span>
          ) : (
            <>
              <span>Live in:</span>
              {mocks.map((n) => (
                <a
                  key={n}
                  href={`/quiz/${finding.topic}-mock-${n}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-coral hover:border-coral hover:bg-coral/5"
                  title={`Open ${finding.topic} Mock Test ${n} on the live site (new tab)`}
                >
                  Mock {n}
                </a>
              ))}
            </>
          )}
        </div>
      )}
      {finding.questionText && (
        <p className="mt-2 text-sm text-foreground">{finding.questionText}</p>
      )}
      {finding.sample && (
        <div className="mt-2 rounded border border-amber-500/40 bg-amber-500/10 p-2">
          <div className="text-[10px] uppercase tracking-wide text-amber-700 dark:text-amber-400">
            Offending snippet{finding.field ? ` · ${finding.field}` : ""}
          </div>
          <p className="mt-1 break-all font-mono text-xs">{finding.sample}</p>
        </div>
      )}
      {isDuplicate && finding.relatedIds && finding.relatedIds.length > 0 && (
        <div className="mt-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            All occurrences
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {finding.relatedIds.map((id, i) => (
              <Link
                key={`${id}-${i}`}
                to="/admin-kb20/questions/$topic"
                params={{ topic: finding.topic }}
                search={{ q: id, from: "validator" }}
                className="rounded border border-border bg-card px-2 py-0.5 font-mono text-[11px] hover:border-coral hover:text-coral"
              >
                {id}
              </Link>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}
