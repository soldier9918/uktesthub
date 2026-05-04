import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { categories } from "@/data/categories";
import { loadTopicFileForAdmin } from "@/data/mocks";
import { validateTopicBank, type Finding } from "@/lib/admin/validator";
import { applyOverrideToQuestionRecord, invalidateOverrides, loadOverrides } from "@/lib/overrides";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { hasArtifacts, hasWeirdChars, stripArtifacts, stripWeird } from "@/lib/admin/text-cleanup";

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
type UsageEntry = { mockNumber: number; slot: number };

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
  "json-code-artifact": "JSON/code artifact",
};

function Validator() {
  const { user } = useAuth();
  const [bulkBusyTopic, setBulkBusyTopic] = useState<string | null>(null);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);
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

  const CACHE_KEY = "admin-validator-results-v3";
  const IGNORE_KEY = "admin-validator-ignored-v1";
  const [staleNotice, setStaleNotice] = useState(false);
  const [ignored, setIgnored] = useState<Set<string>>(new Set());
  const [showIgnored, setShowIgnored] = useState(false);

  // Load ignored signatures
  useEffect(() => {
    try {
      const raw = localStorage.getItem(IGNORE_KEY);
      if (raw) setIgnored(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);

  const persistIgnored = (next: Set<string>) => {
    setIgnored(new Set(next));
    try {
      localStorage.setItem(IGNORE_KEY, JSON.stringify(Array.from(next)));
    } catch {
      /* ignore */
    }
  };

  const toggleIgnore = (sig: string) => {
    const next = new Set(ignored);
    if (next.has(sig)) next.delete(sig);
    else next.add(sig);
    persistIgnored(next);
  };

  const clearIgnored = () => persistIgnored(new Set());

  const ignoreAllInTopic = (topic: string) => {
    const sigs = findings
      .filter((f) => f.topic === topic && !ignored.has(findingSig(f)))
      .map((f) => findingSig(f));
    if (sigs.length === 0) return;
    if (!window.confirm(`Ignore all ${sigs.length} finding(s) in "${topic}"? They will be hidden as false positives.`)) return;
    const next = new Set(ignored);
    for (const s of sigs) next.add(s);
    persistIgnored(next);
  };

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
          usage?: Record<string, Record<string, number[]>>;
        };
        setFindings(parsed.findings ?? []);
        setScanned(parsed.scanned ?? 0);
        if (parsed.ruleFilter) setRuleFilter(parsed.ruleFilter);
        if (parsed.at) setLastRunAt(parsed.at);
        if (parsed.usage) {
          const m = new Map<string, Map<string, UsageEntry[]>>();
          for (const [topic, ids] of Object.entries(parsed.usage)) {
            // Back-compat: older cache stored number[] (mock numbers only).
            const inner = new Map<string, UsageEntry[]>();
            for (const [qid, val] of Object.entries(ids as Record<string, unknown>)) {
              if (Array.isArray(val) && val.length > 0 && typeof val[0] === "number") {
                inner.set(
                  qid,
                  (val as number[]).map((mockNumber) => ({ mockNumber, slot: 0 })),
                );
              } else {
                inner.set(qid, val as UsageEntry[]);
              }
            }
            m.set(topic, inner);
          }
          setUsageByTopic(m);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Mark stale and clear cached results whenever overrides change elsewhere
  // (admin edit dialog save, bulk edit apply, etc.) so the user knows the
  // current findings no longer reflect the database.
  useEffect(() => {
    const onInvalidate = () => {
      // Keep previous results visible so the user can continue working through
      // the list after editing a question. Just flag them as stale.
      setStaleNotice(true);
    };
    window.addEventListener("question-overrides-invalidated", onInvalidate);
    return () => window.removeEventListener("question-overrides-invalidated", onInvalidate);
  }, []);

  // topic -> (questionId -> [{mockNumber, slot}])
  const [usageByTopic, setUsageByTopic] = useState<Map<string, Map<string, UsageEntry[]>>>(
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
    setStaleNotice(false);
    // Always re-fetch overrides from the DB at the start of every run so a
    // re-run actually reflects the latest admin edits / bulk fixes.
    invalidateOverrides();
    const out: Finding[] = [];
    const usage = new Map<string, Map<string, UsageEntry[]>>();
    const overrides = await loadOverrides();
    for (const topic of allTopics) {
      const file = await loadTopicFileForAdmin(topic);
      if (file) {
        const isV2 = (file as { version?: number }).version === 2;
        const rawBank: AnyQ[] = isV2
          ? ((file as { bank: AnyQ[] }).bank ?? [])
          : ((file as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap(
              (t) => t.questions ?? [],
            );
        const bank = rawBank.map((q) => {
          const id = q.id;
          return id ? applyOverrideToQuestionRecord(q, overrides.get(`${topic}::${id}`)) : q;
        });
        out.push(...validateTopicBank(topic, bank, publicImages));

        // Build id -> [{mockNumber, slot}] for this topic. `slot` is 1-indexed
        // and matches "Question N of M" shown in the live quiz UI.
        const topicUsage = new Map<string, UsageEntry[]>();
        if (isV2) {
          const mocks =
            (file as { mocks?: { mockNumber: number; questionIds: string[] }[] }).mocks ?? [];
          for (const m of mocks) {
            m.questionIds.forEach((qid, idx) => {
              const arr = topicUsage.get(qid) ?? [];
              arr.push({ mockNumber: m.mockNumber, slot: idx + 1 });
              topicUsage.set(qid, arr);
            });
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
      const usageJson: Record<string, Record<string, UsageEntry[]>> = {};
      for (const [topic, m] of usage.entries()) {
        usageJson[topic] = Object.fromEntries(m);
      }
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          findings: out,
          scanned: allTopics.length,
          ruleFilter,
          at,
          usage: usageJson,
        }),
      );
    } catch {
      /* ignore quota errors */
    }
  };

  const clearCache = () => {
    sessionStorage.removeItem(CACHE_KEY);
    setFindings([]);
    setScanned(0);
    setUsageByTopic(new Map());
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

  // Bulk-clean: for every finding in `topic` whose rule is suspicious-characters
  // or json-code-artifact, reload the source question, strip the dirty bits from
  // question/options/explanation, and upsert an override. Then re-run validation.
  const bulkCleanTopic = async (topic: string) => {
    const targets = findings.filter(
      (f) =>
        f.topic === topic &&
        (f.rule === "suspicious-characters" || f.rule === "json-code-artifact"),
    );
    if (targets.length === 0) return;
    if (
      !window.confirm(
        `Strip suspicious characters and JSON artifacts from ${targets.length} question(s) in "${topic}"?\n\nThis writes per-question overrides and updates the live site immediately.`,
      )
    )
      return;

    setBulkBusyTopic(topic);
    setBulkMessage(null);
    try {
      const file = await loadTopicFileForAdmin(topic);
      if (!file) throw new Error("Could not load topic file");
      const isV2 = (file as { version?: number }).version === 2;
      const rawBank: AnyQ[] = isV2
        ? ((file as { bank: AnyQ[] }).bank ?? [])
        : ((file as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap(
            (t) => t.questions ?? [],
          );
      const overrides = await loadOverrides();
      const merged = rawBank.map((q) =>
        q.id ? applyOverrideToQuestionRecord(q, overrides.get(`${topic}::${q.id}`)) : q,
      );
      const byId = new Map<string, AnyQ>();
      for (const q of merged) if (q.id) byId.set(q.id as string, q);

      const ids = Array.from(new Set(targets.map((t) => t.questionId).filter(Boolean) as string[]));
      const clean = (s: unknown): string | undefined => {
        if (typeof s !== "string") return undefined;
        let out = s;
        if (hasArtifacts(out)) out = stripArtifacts(out);
        if (hasWeirdChars(out)) out = stripWeird(out);
        return out;
      };

      type Row = {
        topic: string;
        question_id: string;
        question: string | null;
        options: string[] | null;
        correct_answer: number | number[] | boolean | null;
        explanation: string | null;
        image: string | null;
        image_alt: string | null;
        updated_by: string | null;
      };
      const rows: Row[] = [];
      for (const id of ids) {
        const q = byId.get(id);
        if (!q) continue;
        const prev = overrides.get(`${topic}::${id}`);
        const qText =
          (q.question as string | undefined) ??
          (q.template as string | undefined) ??
          (q.prompt as string | undefined);
        const newQ = clean(qText);
        const opts = q.options as unknown[] | undefined;
        const newOpts: string[] | null = Array.isArray(opts)
          ? opts.map((o) => (typeof o === "string" ? clean(o) ?? o : String(o)))
          : Array.isArray(prev?.options)
            ? (prev?.options as string[])
            : null;
        const newExp = clean(q.explanation);

        rows.push({
          topic,
          question_id: id,
          question: newQ ?? prev?.question ?? qText ?? null,
          options: newOpts,
          correct_answer: prev?.correct_answer ?? null,
          explanation: newExp ?? prev?.explanation ?? (q.explanation as string | undefined) ?? null,
          image: prev?.image ?? null,
          image_alt: prev?.image_alt ?? null,
          updated_by: user?.id ?? null,
        });
      }

      let written = 0;
      for (let i = 0; i < rows.length; i += 50) {
        const batch = rows.slice(i, i + 50);
        const { error } = await supabase
          .from("question_overrides")
          .upsert(batch, { onConflict: "topic,question_id" });
        if (error) throw error;
        written += batch.length;
      }
      invalidateOverrides();
      setBulkMessage(`Cleaned ${written} question(s) in "${topic}". Re-running validation…`);
      // Re-run a full scan so the cleaned items disappear from the list.
      await run();
      setBulkMessage(`Cleaned ${written} question(s) in "${topic}". Findings refreshed.`);
    } catch (e) {
      setBulkMessage(
        `Bulk-clean failed for "${topic}": ${e instanceof Error ? e.message : "Unknown error"}`,
      );
    } finally {
      setBulkBusyTopic(null);
    }
  };

  const findingSig = (f: Finding) =>
    `${f.topic}|${f.rule}|${f.questionId ?? ""}|${f.field ?? ""}|${(f.relatedIds ?? []).join(",")}`;

  const visibleFindings = useMemo(
    () => (showIgnored ? findings : findings.filter((f) => !ignored.has(findingSig(f)))),
    [findings, ignored, showIgnored],
  );

  const ruleCounts = useMemo(() => {
    const m = new Map<Finding["rule"], number>();
    for (const f of visibleFindings) m.set(f.rule, (m.get(f.rule) ?? 0) + 1);
    return m;
  }, [visibleFindings]);

  const filtered = useMemo(
    () => (ruleFilter === "all" ? visibleFindings : visibleFindings.filter((f) => f.rule === ruleFilter)),
    [visibleFindings, ruleFilter],
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
        {ignored.size > 0 && (
          <>
            <button
              type="button"
              onClick={() => setShowIgnored((v) => !v)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-muted"
            >
              {showIgnored ? "Hide ignored" : `Show ignored (${ignored.size})`}
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Un-ignore all ${ignored.size} finding(s)?`)) clearIgnored();
              }}
              className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Reset ignored
            </button>
          </>
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

      {staleNotice && (
        <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800">
          Question overrides changed since the last scan — previous results have been cleared. Click <strong>Run validation</strong> to refresh.
        </p>
      )}
      {bulkMessage && (
        <p className="mt-3 rounded-md border border-coral/40 bg-coral/5 p-2 text-xs text-coral">
          {bulkMessage}
        </p>
      )}

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
        {grouped.map(([topic, list]) => {
          const cleanableCount = list.filter(
            (f) => f.rule === "suspicious-characters" || f.rule === "json-code-artifact",
          ).length;
          return (
          <details key={topic} className="rounded-xl border border-border bg-card p-4" open>
            <summary className="flex cursor-pointer items-center justify-between gap-3">
              <Link
                to="/admin-kb20/questions/$topic"
                params={{ topic }}
                className="font-semibold hover:underline"
              >
                {topic}
              </Link>
              <div className="flex items-center gap-2">
                {cleanableCount > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      void bulkCleanTopic(topic);
                    }}
                    disabled={bulkBusyTopic === topic || running}
                    className="rounded-md border border-coral/40 bg-coral/5 px-2 py-1 text-xs font-semibold text-coral hover:bg-coral/10 disabled:opacity-50"
                    title="Strip suspicious characters and JSON artifacts from every flagged question in this topic"
                  >
                    {bulkBusyTopic === topic
                      ? "Cleaning…"
                      : `Bulk-clean ${cleanableCount}`}
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    ignoreAllInTopic(topic);
                  }}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted"
                  title="Mark every finding in this topic as a false positive and hide them"
                >
                  Ignore all {list.length}
                </button>
                <Badge variant="destructive">{list.length}</Badge>
              </div>
            </summary>
            <ul className="mt-3 space-y-2 text-sm">
              {list.map((f, i) => {
                const sig = findingSig(f);
                return (
                  <FindingRow
                    key={i}
                    finding={f}
                    usage={usageByTopic.get(f.topic)}
                    ignored={ignored.has(sig)}
                    onToggleIgnore={() => toggleIgnore(sig)}
                  />
                );
              })}
            </ul>
          </details>
          );
        })}
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
  ignored,
  onToggleIgnore,
}: {
  finding: Finding;
  usage?: Map<string, UsageEntry[]>;
  ignored: boolean;
  onToggleIgnore: () => void;
}) {
  const isDuplicate = finding.rule === "duplicate-id" || finding.rule === "duplicate-text";
  const mocks =
    finding.questionId && usage ? (usage.get(finding.questionId) ?? []) : [];
  return (
    <li className={`rounded-md border border-border/60 bg-background/50 p-3 ${ignored ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{RULE_LABEL[finding.rule]}</Badge>
        {ignored && <Badge variant="outline">Ignored</Badge>}
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
        <button
          type="button"
          onClick={onToggleIgnore}
          className="ml-auto rounded border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-muted-foreground hover:bg-muted"
          title={ignored ? "Restore this finding to the active list" : "Mark as false positive — hide from results"}
        >
          {ignored ? "Un-ignore" : "Ignore"}
        </button>
      </div>
      {finding.questionId && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
          {mocks.length === 0 ? (
            <span className="italic">Not used in any mock test (orphan)</span>
          ) : (
            <>
              <span>Live in:</span>
              {mocks.map(({ mockNumber, slot }) => (
                <a
                  key={`${mockNumber}-${slot}`}
                  href={`/quiz/${finding.topic}-mock-${mockNumber}${slot ? `#q${slot}` : ""}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-coral hover:border-coral hover:bg-coral/5"
                  title={
                    slot
                      ? `Open Mock Test ${mockNumber}, Question ${slot} on the live site (new tab)`
                      : `Open Mock Test ${mockNumber} on the live site (new tab)`
                  }
                >
                  Mock {mockNumber}{slot ? ` · Q${slot}` : ""}
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
