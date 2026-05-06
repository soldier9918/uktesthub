import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/categories";
import { loadTopicFileForAdmin } from "@/data/mocks";
import { applyOverrideToQuestionRecord, invalidateOverrides, loadOverrides } from "@/lib/overrides";
import { supabase } from "@/integrations/supabase/client";
import {
  buildBlob,
  findSimilarPairs,
  jaccard,
  trigrams,
  type SimItem,
  type SimPair,
} from "@/lib/admin/similarity";
import {
  aiVerdictPairs,
  completeRegenerateQuestion,
  regenerateUniqueQuestion,
} from "@/lib/server-fns/similarity.functions";

export const Route = createFileRoute("/admin-kb20/similar")({
  head: () => ({
    meta: [
      { title: "Similar Questions — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <SimilarPage />
    </AdminGate>
  ),
});

type AnyQ = Record<string, unknown> & { id?: string };
type Verdict = "duplicate" | "near-duplicate" | "distinct";
type EnrichedPair = SimPair & {
  verdict?: Verdict;
  confidence?: number;
  reason?: string;
  hidden?: boolean;
};

type SuppressionRow = { topic_a: string; qid_a: string; topic_b: string; qid_b: string };

function pairKey(p: SimPair): string {
  const a = `${p.a.topic}::${p.a.id}`;
  const b = `${p.b.topic}::${p.b.id}`;
  return a < b ? `${a}||${b}` : `${b}||${a}`;
}

async function loadSuppressed(): Promise<Set<string>> {
  const { data } = await supabase
    .from("similarity_suppressions" as never)
    .select("topic_a,qid_a,topic_b,qid_b");
  const set = new Set<string>();
  for (const row of (data as SuppressionRow[] | null) ?? []) {
    const a = `${row.topic_a}::${row.qid_a}`;
    const b = `${row.topic_b}::${row.qid_b}`;
    set.add(a < b ? `${a}||${b}` : `${b}||${a}`);
  }
  return set;
}

function SimilarPage() {
  const [categorySlug, setCategorySlug] = useState("__all__");
  const [topicSlug, setTopicSlug] = useState("__all__");
  const [threshold, setThreshold] = useState(0.72);
  const [crossTopic, setCrossTopic] = useState(true);
  const [useAi, setUseAi] = useState(true);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState("");
  const [pairs, setPairs] = useState<EnrichedPair[]>([]);
  const [scanned, setScanned] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [diffs, setDiffs] = useState<Record<string, { topic: string; id: string; before: AnyQ; after: AnyQ; sim: number; needsReview: boolean; mode?: "rewrite" | "complete"; concept?: string }>>({});
  const cancelRef = useRef(false);

  const topicsForCategory = useMemo(() => {
    if (categorySlug === "__all__") {
      return categories.flatMap((c) => c.topics.map((t) => ({ ...t, cat: c.title, catSlug: c.slug })));
    }
    const cat = categories.find((c) => c.slug === categorySlug);
    return cat ? cat.topics.map((t) => ({ ...t, cat: cat.title, catSlug: cat.slug })) : [];
  }, [categorySlug]);

  const targetTopics = useMemo(() => {
    if (topicSlug !== "__all__") return [topicSlug];
    return topicsForCategory.map((t) => t.slug);
  }, [topicSlug, topicsForCategory]);

  const topicTitleMap = useMemo(() => {
    const m = new Map<string, { title: string; cat: string; catSlug: string }>();
    for (const c of categories) for (const t of c.topics) m.set(t.slug, { title: t.title, cat: c.title, catSlug: c.slug });
    return m;
  }, []);

  const run = async () => {
    setRunning(true);
    cancelRef.current = false;
    setPairs([]);
    setScanned(false);
    setProgress("Loading question banks…");

    const overrides = await loadOverrides();
    const items: SimItem[] = [];
    for (let ti = 0; ti < targetTopics.length; ti++) {
      const topic = targetTopics[ti];
      setProgress(`Loading ${topic} (${ti + 1}/${targetTopics.length})…`);
      const file = await loadTopicFileForAdmin(topic);
      if (!file) continue;
      const isV2 = (file as { version?: number }).version === 2;
      const rawBank: AnyQ[] = isV2
        ? ((file as { bank: AnyQ[] }).bank ?? [])
        : ((file as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap((t) => t.questions ?? []);
      for (const raw of rawBank) {
        const id = raw.id;
        if (!id) continue;
        const q = applyOverrideToQuestionRecord(raw, overrides.get(`${topic}::${id}`));
        const blob = buildBlob(q as Parameters<typeof buildBlob>[0]);
        items.push({ topic, id: String(id), blob, trigrams: trigrams(blob) });
      }
      if (cancelRef.current) {
        setRunning(false);
        return;
      }
    }
    setProgress(`Comparing ${items.length} questions…`);
    const allPairs = findSimilarPairs(items, threshold, crossTopic, (done, total) => {
      if (done % 200 === 0) setProgress(`Comparing ${done}/${total}…`);
    });

    const suppressed = await loadSuppressed();
    let filtered: EnrichedPair[] = allPairs.filter((p) => !suppressed.has(pairKey(p)));

    if (useAi && filtered.length > 0) {
      setProgress(`AI verdicts (0/${filtered.length})…`);
      const { data: sess } = await supabase.auth.getSession();
      const accessToken = sess.session?.access_token ?? "";
      const BATCH = 10;
      for (let i = 0; i < filtered.length; i += BATCH) {
        if (cancelRef.current) break;
        const batch = filtered.slice(i, i + BATCH);
        const res = await aiVerdictPairs({
          data: {
            accessToken,
            pairs: batch.map((p) => ({ aText: p.a.text, bText: p.b.text })),
          },
        });
        if (res.error) {
          setProgress(`AI error: ${res.error}`);
          break;
        }
        res.verdicts.forEach((v, j) => {
          batch[j].verdict = v.verdict;
          batch[j].confidence = v.confidence;
          batch[j].reason = v.reason;
        });
        filtered = [...filtered];
        setPairs(filtered);
        setProgress(`AI verdicts (${Math.min(i + BATCH, filtered.length)}/${filtered.length})…`);
      }
    }

    setPairs(filtered);
    setScanned(true);
    setRunning(false);
    setProgress(`${filtered.length} similar pair${filtered.length === 1 ? "" : "s"} found.`);
  };

  const markNotDuplicate = async (p: EnrichedPair) => {
    const a = `${p.a.topic}::${p.a.id}`;
    const b = `${p.b.topic}::${p.b.id}`;
    const [ta, qa, tb, qb] = a < b ? [p.a.topic, p.a.id, p.b.topic, p.b.id] : [p.b.topic, p.b.id, p.a.topic, p.a.id];
    await supabase
      .from("similarity_suppressions" as never)
      .insert({ topic_a: ta, qid_a: qa, topic_b: tb, qid_b: qb } as never);
    setPairs((prev) => prev.map((x) => (pairKey(x) === pairKey(p) ? { ...x, hidden: true } : x)));
  };

  const regenerate = async (p: EnrichedPair, side: "a" | "b") => {
    const target = side === "a" ? p.a : p.b;
    const k = `${target.topic}::${target.id}`;
    setBusyKey(k);
    try {
      const overrides = await loadOverrides();
      const file = await loadTopicFileForAdmin(target.topic);
      if (!file) {
        setBusyKey(null);
        return;
      }
      const isV2 = (file as { version?: number }).version === 2;
      const rawBank: AnyQ[] = isV2
        ? ((file as { bank: AnyQ[] }).bank ?? [])
        : ((file as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap((t) => t.questions ?? []);
      const sourceRaw = rawBank.find((q) => String(q.id) === target.id);
      if (!sourceRaw) {
        setBusyKey(null);
        return;
      }
      const source = applyOverrideToQuestionRecord(sourceRaw, overrides.get(k));
      const existingBlobs = rawBank
        .filter((q) => String(q.id) !== target.id)
        .map((raw) => {
          const q = applyOverrideToQuestionRecord(raw, overrides.get(`${target.topic}::${raw.id}`));
          return buildBlob(q as Parameters<typeof buildBlob>[0]);
        });

      const meta = topicTitleMap.get(target.topic);
      const { data: sess } = await supabase.auth.getSession();
      const accessToken = sess.session?.access_token ?? "";

      const res = await regenerateUniqueQuestion({
        data: {
          accessToken,
          topic: target.topic,
          topicTitle: meta?.title ?? target.topic,
          categoryTitle: meta?.cat ?? "",
          source: {
            id: target.id,
            type: source.type as string | undefined,
            question: source.question as string | undefined,
            template: source.template as string | undefined,
            prompt: source.prompt as string | undefined,
            options: source.options as string[] | undefined,
            correctAnswer: source.correctAnswer as number | boolean | undefined,
            correctAnswers: source.correctAnswers as number[] | undefined,
            explanation: source.explanation as string | undefined,
            image: source.image as string | undefined,
            imageAlt: source.imageAlt as string | undefined,
          },
          existingBlobs,
        },
      });

      if (res.error || !res.generated) {
        setProgress(`Regeneration failed: ${res.error ?? "unknown error"}`);
        setBusyKey(null);
        return;
      }

      invalidateOverrides();
      setDiffs((prev) => ({
        ...prev,
        [k]: {
          topic: target.topic,
          id: target.id,
          before: source as AnyQ,
          after: res.generated as AnyQ,
          sim: res.similarityMax,
          needsReview: res.needsReview,
        },
      }));
    } finally {
      setBusyKey(null);
    }
  };

  const completeRegenerate = async (p: EnrichedPair, side: "a" | "b") => {
    const target = side === "a" ? p.a : p.b;
    const k = `${target.topic}::${target.id}`;
    setBusyKey(k);
    try {
      const meta = topicTitleMap.get(target.topic);
      if (!meta) {
        setBusyKey(null);
        return;
      }
      const cat = categories.find((c) => c.slug === meta.catSlug);
      if (!cat) {
        setBusyKey(null);
        return;
      }
      setProgress(`Loading category "${meta.cat}" (${cat.topics.length} topic${cat.topics.length === 1 ? "" : "s"})…`);
      const overrides = await loadOverrides();

      // Load source from its topic
      const sourceFile = await loadTopicFileForAdmin(target.topic);
      if (!sourceFile) {
        setBusyKey(null);
        return;
      }
      const isV2Src = (sourceFile as { version?: number }).version === 2;
      const sourceBank: AnyQ[] = isV2Src
        ? ((sourceFile as { bank: AnyQ[] }).bank ?? [])
        : ((sourceFile as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap((t) => t.questions ?? []);
      const sourceRaw = sourceBank.find((q) => String(q.id) === target.id);
      if (!sourceRaw) {
        setBusyKey(null);
        return;
      }
      const source = applyOverrideToQuestionRecord(sourceRaw, overrides.get(k));

      // Build category-wide blob list (excluding the target itself)
      const categoryBlobs: string[] = [];
      for (const t of cat.topics) {
        const f = await loadTopicFileForAdmin(t.slug);
        if (!f) continue;
        const isV2 = (f as { version?: number }).version === 2;
        const bank: AnyQ[] = isV2
          ? ((f as { bank: AnyQ[] }).bank ?? [])
          : ((f as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap((tt) => tt.questions ?? []);
        for (const raw of bank) {
          if (!raw.id) continue;
          if (t.slug === target.topic && String(raw.id) === target.id) continue;
          const q = applyOverrideToQuestionRecord(raw, overrides.get(`${t.slug}::${raw.id}`));
          categoryBlobs.push(buildBlob(q as Parameters<typeof buildBlob>[0]));
        }
      }
      setProgress(`Generating fresh question (checking against ${categoryBlobs.length} questions in category)…`);

      const { data: sess } = await supabase.auth.getSession();
      const accessToken = sess.session?.access_token ?? "";

      const res = await completeRegenerateQuestion({
        data: {
          accessToken,
          topic: target.topic,
          topicTitle: meta.title,
          categoryTitle: meta.cat,
          source: {
            id: target.id,
            type: source.type as string | undefined,
            question: source.question as string | undefined,
            template: source.template as string | undefined,
            prompt: source.prompt as string | undefined,
            options: source.options as string[] | undefined,
            correctAnswer: source.correctAnswer as number | boolean | undefined,
            correctAnswers: source.correctAnswers as number[] | undefined,
            explanation: source.explanation as string | undefined,
            image: source.image as string | undefined,
            imageAlt: source.imageAlt as string | undefined,
          },
          categoryBlobs,
        },
      });

      if (res.error || !res.generated) {
        setProgress(`Complete regeneration failed: ${res.error ?? "unknown error"}`);
        setBusyKey(null);
        return;
      }

      invalidateOverrides();
      setDiffs((prev) => ({
        ...prev,
        [k]: {
          topic: target.topic,
          id: target.id,
          before: source as AnyQ,
          after: res.generated as AnyQ,
          sim: res.similarityMax,
          needsReview: res.needsReview,
          mode: "complete",
          concept: res.concept ?? undefined,
        },
      }));
      setProgress(`Fresh question created (similarity ${(res.similarityMax * 100).toFixed(0)}% across category).`);
    } finally {
      setBusyKey(null);
    }
  };

  const revert = async (k: string) => {
    const d = diffs[k];
    if (!d) return;
    await supabase.from("question_overrides").delete().eq("topic", d.topic).eq("question_id", d.id);
    invalidateOverrides();
    setDiffs((prev) => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  const visiblePairs = pairs.filter((p) => !p.hidden);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Similar Questions</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Find duplicate or near-duplicate questions across the bank, then regenerate any of them
        into a brand-new unique question with an automatic similarity check.
      </p>

      <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="block font-semibold">Category</span>
          <select
            value={categorySlug}
            onChange={(e) => {
              setCategorySlug(e.target.value);
              setTopicSlug("__all__");
            }}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          >
            <option value="__all__">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block font-semibold">Topic</span>
          <select
            value={topicSlug}
            onChange={(e) => setTopicSlug(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          >
            <option value="__all__">All topics in this scope</option>
            {topicsForCategory.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block font-semibold">
            Lexical threshold: {threshold.toFixed(2)}
          </span>
          <input
            type="range"
            min={0.5}
            max={0.95}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="mt-1 w-full"
          />
        </label>
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={crossTopic} onChange={(e) => setCrossTopic(e.target.checked)} />
            Include cross-topic pairs
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useAi} onChange={(e) => setUseAi(e.target.checked)} />
            AI confirmation (recommended)
          </label>
        </div>
        <div className="sm:col-span-2 flex items-center gap-3">
          <Button onClick={() => void run()} disabled={running}>
            {running ? "Scanning…" : "Run scan"}
          </Button>
          {running && (
            <Button variant="outline" onClick={() => (cancelRef.current = true)}>
              Cancel
            </Button>
          )}
          {progress && <span className="text-xs text-muted-foreground">{progress}</span>}
        </div>
      </div>

      {scanned && visiblePairs.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">No similar pairs found at this threshold.</p>
      )}

      <div className="mt-6 space-y-3">
        {visiblePairs.map((p) => {
          const k = pairKey(p);
          const diffA = diffs[`${p.a.topic}::${p.a.id}`];
          const diffB = diffs[`${p.b.topic}::${p.b.id}`];
          const verdictColor =
            p.verdict === "duplicate"
              ? "bg-destructive/15 text-destructive"
              : p.verdict === "near-duplicate"
              ? "bg-amber-500/15 text-amber-700"
              : "bg-muted text-muted-foreground";
          return (
            <div key={k} className="rounded-md border border-border bg-card p-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="secondary">Lexical {(p.score * 100).toFixed(0)}%</Badge>
                {p.verdict && (
                  <span className={`rounded px-2 py-0.5 ${verdictColor}`}>
                    AI: {p.verdict}
                    {typeof p.confidence === "number" && ` (${(p.confidence * 100).toFixed(0)}%)`}
                  </span>
                )}
                <span className="ml-auto text-muted-foreground">{p.reason}</span>
              </div>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <PairSide
                  side="A"
                  topic={p.a.topic}
                  id={p.a.id}
                  text={p.a.text}
                  diff={diffA}
                  busy={busyKey === `${p.a.topic}::${p.a.id}`}
                  onRegenerate={() => void regenerate(p, "a")}
                  onCompleteRegenerate={() => void completeRegenerate(p, "a")}
                  onRevert={() => void revert(`${p.a.topic}::${p.a.id}`)}
                />
                <PairSide
                  side="B"
                  topic={p.b.topic}
                  id={p.b.id}
                  text={p.b.text}
                  diff={diffB}
                  busy={busyKey === `${p.b.topic}::${p.b.id}`}
                  onRegenerate={() => void regenerate(p, "b")}
                  onCompleteRegenerate={() => void completeRegenerate(p, "b")}
                  onRevert={() => void revert(`${p.b.topic}::${p.b.id}`)}
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => void markNotDuplicate(p)}>
                  Mark as not duplicate
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function PairSide({
  side,
  topic,
  id,
  text,
  diff,
  busy,
  onRegenerate,
  onRevert,
}: {
  side: "A" | "B";
  topic: string;
  id: string;
  text: string;
  diff?: { before: AnyQ; after: AnyQ; sim: number; needsReview: boolean };
  busy: boolean;
  onRegenerate: () => void;
  onRevert: () => void;
}) {
  return (
    <div className="rounded border border-border bg-background/50 p-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{side}</Badge>
        <Link
          to="/admin-kb20/questions/$topic"
          params={{ topic }}
          search={{ q: id, from: "validator" }}
          className="font-mono hover:underline"
        >
          {topic} / {id}
        </Link>
      </div>
      <p className="mt-1 line-clamp-3 text-sm">{text}</p>
      <div className="mt-2 flex items-center gap-2">
        <Button size="sm" onClick={onRegenerate} disabled={busy}>
          {busy ? "Regenerating…" : "Regenerate as unique"}
        </Button>
        {diff && (
          <Button size="sm" variant="outline" onClick={onRevert}>
            Revert
          </Button>
        )}
      </div>
      {diff && (
        <div className="mt-2 rounded bg-muted/40 p-2 text-xs">
          <div className="flex items-center gap-2">
            <Badge variant={diff.needsReview ? "destructive" : "secondary"}>
              new · sim {(diff.sim * 100).toFixed(0)}%{diff.needsReview ? " · needs review" : ""}
            </Badge>
          </div>
          <p className="mt-1 font-semibold">{String(diff.after.question ?? "")}</p>
          {Array.isArray(diff.after.options) && (
            <ol className="mt-1 list-decimal pl-4">
              {(diff.after.options as string[]).map((o, i) => (
                <li
                  key={i}
                  className={
                    (typeof diff.after.correctAnswer === "number" && diff.after.correctAnswer === i) ||
                    (Array.isArray(diff.after.correctAnswers) && (diff.after.correctAnswers as number[]).includes(i))
                      ? "font-semibold text-success"
                      : ""
                  }
                >
                  {o}
                </li>
              ))}
            </ol>
          )}
          {diff.after.explanation ? (
            <p className="mt-1 text-muted-foreground">{String(diff.after.explanation)}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

void jaccard;
void useEffect;
