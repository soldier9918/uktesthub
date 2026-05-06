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
  const [view, setView] = useState<"pairs" | "clusters">("pairs");
  const [typeMap, setTypeMap] = useState<Map<string, string>>(new Map());
  const [typeFilter, setTypeFilter] = useState<string>("__all__");
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState("");
  const bulkCancelRef = useRef(false);
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
    const tmap = new Map<string, string>();
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
        const t = (q as { type?: string }).type;
        if (t) tmap.set(`${topic}::${String(id)}`, t);
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
    setTypeMap(tmap);
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

  // Core regenerate-as-unique for a single (topic, id). Returns true on success.
  const regenerateOne = async (topic: string, id: string): Promise<{ ok: boolean; needsReview?: boolean; error?: string }> => {
    const k = `${topic}::${id}`;
    const overrides = await loadOverrides();
    const file = await loadTopicFileForAdmin(topic);
    if (!file) return { ok: false, error: "topic file missing" };
    const isV2 = (file as { version?: number }).version === 2;
    const rawBank: AnyQ[] = isV2
      ? ((file as { bank: AnyQ[] }).bank ?? [])
      : ((file as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap((t) => t.questions ?? []);
    const sourceRaw = rawBank.find((q) => String(q.id) === id);
    if (!sourceRaw) return { ok: false, error: "source not found" };
    const source = applyOverrideToQuestionRecord(sourceRaw, overrides.get(k));
    const existingBlobs = rawBank
      .filter((q) => String(q.id) !== id)
      .map((raw) => {
        const q = applyOverrideToQuestionRecord(raw, overrides.get(`${topic}::${raw.id}`));
        return buildBlob(q as Parameters<typeof buildBlob>[0]);
      });
    const meta = topicTitleMap.get(topic);
    const { data: sess } = await supabase.auth.getSession();
    const accessToken = sess.session?.access_token ?? "";
    const res = await regenerateUniqueQuestion({
      data: {
        accessToken,
        topic,
        topicTitle: meta?.title ?? topic,
        categoryTitle: meta?.cat ?? "",
        source: {
          id,
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
    if (res.error || !res.generated) return { ok: false, error: res.error ?? "unknown error" };
    invalidateOverrides();
    setDiffs((prev) => ({
      ...prev,
      [k]: { topic, id, before: source as AnyQ, after: res.generated as AnyQ, sim: res.similarityMax, needsReview: res.needsReview },
    }));
    return { ok: true, needsReview: res.needsReview };
  };

  // Core complete-regenerate for a single (topic, id).
  const completeRegenerateOne = async (topic: string, id: string): Promise<{ ok: boolean; needsReview?: boolean; error?: string }> => {
    const k = `${topic}::${id}`;
    const meta = topicTitleMap.get(topic);
    if (!meta) return { ok: false, error: "topic meta missing" };
    const cat = categories.find((c) => c.slug === meta.catSlug);
    if (!cat) return { ok: false, error: "category missing" };
    const overrides = await loadOverrides();
    const sourceFile = await loadTopicFileForAdmin(topic);
    if (!sourceFile) return { ok: false, error: "topic file missing" };
    const isV2Src = (sourceFile as { version?: number }).version === 2;
    const sourceBank: AnyQ[] = isV2Src
      ? ((sourceFile as { bank: AnyQ[] }).bank ?? [])
      : ((sourceFile as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap((t) => t.questions ?? []);
    const sourceRaw = sourceBank.find((q) => String(q.id) === id);
    if (!sourceRaw) return { ok: false, error: "source not found" };
    const source = applyOverrideToQuestionRecord(sourceRaw, overrides.get(k));
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
        if (t.slug === topic && String(raw.id) === id) continue;
        const q = applyOverrideToQuestionRecord(raw, overrides.get(`${t.slug}::${raw.id}`));
        categoryBlobs.push(buildBlob(q as Parameters<typeof buildBlob>[0]));
      }
    }
    const { data: sess } = await supabase.auth.getSession();
    const accessToken = sess.session?.access_token ?? "";
    const res = await completeRegenerateQuestion({
      data: {
        accessToken,
        topic,
        topicTitle: meta.title,
        categoryTitle: meta.cat,
        source: {
          id,
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
    if (res.error || !res.generated) return { ok: false, error: res.error ?? "unknown error" };
    invalidateOverrides();
    setDiffs((prev) => ({
      ...prev,
      [k]: {
        topic, id, before: source as AnyQ, after: res.generated as AnyQ, sim: res.similarityMax,
        needsReview: res.needsReview, mode: "complete", concept: res.concept ?? undefined,
      },
    }));
    return { ok: true, needsReview: res.needsReview };
  };

  const regenerate = async (p: EnrichedPair, side: "a" | "b") => {
    const target = side === "a" ? p.a : p.b;
    const k = `${target.topic}::${target.id}`;
    setBusyKey(k);
    try {
      const r = await regenerateOne(target.topic, target.id);
      if (!r.ok) setProgress(`Regeneration failed: ${r.error}`);
    } finally {
      setBusyKey(null);
    }
  };

  const completeRegenerate = async (p: EnrichedPair, side: "a" | "b") => {
    const target = side === "a" ? p.a : p.b;
    const k = `${target.topic}::${target.id}`;
    setBusyKey(k);
    try {
      const r = await completeRegenerateOne(target.topic, target.id);
      if (!r.ok) setProgress(`Complete regeneration failed: ${r.error}`);
      else setProgress(`Fresh question created.`);
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

  const availableTypes = useMemo(() => {
    const s = new Set<string>();
    for (const p of pairs) {
      if (p.hidden) continue;
      const ta = typeMap.get(`${p.a.topic}::${p.a.id}`);
      const tb = typeMap.get(`${p.b.topic}::${p.b.id}`);
      if (ta) s.add(ta);
      if (tb) s.add(tb);
    }
    return Array.from(s).sort();
  }, [pairs, typeMap]);

  const visiblePairs = pairs.filter((p) => {
    if (p.hidden) return false;
    if (typeFilter === "__all__") return true;
    const ta = typeMap.get(`${p.a.topic}::${p.a.id}`);
    const tb = typeMap.get(`${p.b.topic}::${p.b.id}`);
    return ta === typeFilter && tb === typeFilter;
  });

  // Compute duplicate counts and partners per question
  const dupInfo = useMemo(() => {
    const count = new Map<string, number>();
    const partners = new Map<string, Array<{ topic: string; id: string; text: string }>>();
    for (const p of visiblePairs) {
      const ka = `${p.a.topic}::${p.a.id}`;
      const kb = `${p.b.topic}::${p.b.id}`;
      count.set(ka, (count.get(ka) ?? 0) + 1);
      count.set(kb, (count.get(kb) ?? 0) + 1);
      if (!partners.has(ka)) partners.set(ka, []);
      if (!partners.has(kb)) partners.set(kb, []);
      partners.get(ka)!.push({ topic: p.b.topic, id: p.b.id, text: p.b.text });
      partners.get(kb)!.push({ topic: p.a.topic, id: p.a.id, text: p.a.text });
    }
    return { count, partners };
  }, [visiblePairs]);

  // Union-find clusters
  const clusters = useMemo(() => {
    const parent = new Map<string, string>();
    const find = (x: string): string => {
      const p = parent.get(x);
      if (!p || p === x) {
        parent.set(x, x);
        return x;
      }
      const r = find(p);
      parent.set(x, r);
      return r;
    };
    const union = (a: string, b: string) => {
      const ra = find(a);
      const rb = find(b);
      if (ra !== rb) parent.set(ra, rb);
    };
    for (const p of visiblePairs) {
      const ka = `${p.a.topic}::${p.a.id}`;
      const kb = `${p.b.topic}::${p.b.id}`;
      find(ka);
      find(kb);
      union(ka, kb);
    }
    const groups = new Map<string, { members: Set<string>; pairs: EnrichedPair[] }>();
    for (const p of visiblePairs) {
      const root = find(`${p.a.topic}::${p.a.id}`);
      if (!groups.has(root)) groups.set(root, { members: new Set(), pairs: [] });
      const g = groups.get(root)!;
      g.members.add(`${p.a.topic}::${p.a.id}`);
      g.members.add(`${p.b.topic}::${p.b.id}`);
      g.pairs.push(p);
    }
    return Array.from(groups.values()).sort((a, b) => b.members.size - a.members.size);
  }, [visiblePairs]);

  const uniqueQuestions = dupInfo.count.size;
  const bigClusters = clusters.filter((c) => c.members.size >= 3).length;

  // Sort visible pairs so high-duplicate questions surface first
  const sortedPairs = useMemo(() => {
    return [...visiblePairs].sort((a, b) => {
      const sa = Math.max(
        dupInfo.count.get(`${a.a.topic}::${a.a.id}`) ?? 0,
        dupInfo.count.get(`${a.b.topic}::${a.b.id}`) ?? 0,
      );
      const sb = Math.max(
        dupInfo.count.get(`${b.a.topic}::${b.a.id}`) ?? 0,
        dupInfo.count.get(`${b.b.topic}::${b.b.id}`) ?? 0,
      );
      return sb - sa;
    });
  }, [visiblePairs, dupInfo]);

  // Keeper = least connected member (lowest dup count, lex tie-break).
  const pickKeeper = (members: Set<string>): string => {
    const arr = Array.from(members);
    arr.sort((a, b) => {
      const ca = dupInfo.count.get(a) ?? 0;
      const cb = dupInfo.count.get(b) ?? 0;
      if (ca !== cb) return ca - cb;
      return a < b ? -1 : 1;
    });
    return arr[0];
  };

  const runBulk = async (
    targets: Array<{ topic: string; id: string }>,
    mode: "rewrite" | "complete",
    label: string,
  ) => {
    setBulkRunning(true);
    bulkCancelRef.current = false;
    let ok = 0;
    let needsReview = 0;
    let failed = 0;
    for (let i = 0; i < targets.length; i++) {
      if (bulkCancelRef.current) {
        setBulkProgress(`Cancelled at ${i}/${targets.length}. ${ok} ok, ${needsReview} need review, ${failed} failed.`);
        setBulkRunning(false);
        return;
      }
      const t = targets[i];
      setBulkProgress(`${label}: ${i + 1}/${targets.length} (${t.topic}/${t.id})…`);
      try {
        const r = mode === "rewrite"
          ? await regenerateOne(t.topic, t.id)
          : await completeRegenerateOne(t.topic, t.id);
        if (r.ok) {
          ok++;
          if (r.needsReview) needsReview++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }
    setBulkProgress(`Done — ${ok} succeeded${needsReview ? ` (${needsReview} need review)` : ""}${failed ? `, ${failed} failed` : ""}.`);
    setBulkRunning(false);
  };

  const bulkAllTargets = (): Array<{ topic: string; id: string }> => {
    const out: Array<{ topic: string; id: string }> = [];
    for (const cluster of clusters) {
      const keeper = pickKeeper(cluster.members);
      for (const m of cluster.members) {
        if (m === keeper) continue;
        const [topic, id] = m.split("::");
        out.push({ topic, id });
      }
    }
    return out;
  };

  const clusterTargets = (cluster: { members: Set<string> }): Array<{ topic: string; id: string }> => {
    const keeper = pickKeeper(cluster.members);
    const out: Array<{ topic: string; id: string }> = [];
    for (const m of cluster.members) {
      if (m === keeper) continue;
      const [topic, id] = m.split("::");
      out.push({ topic, id });
    }
    return out;
  };

  const totalBulkCount = clusters.reduce((s, c) => s + Math.max(0, c.members.size - 1), 0);

  const confirmAndRunAll = (mode: "rewrite" | "complete") => {
    const targets = bulkAllTargets();
    if (targets.length === 0) return;
    const label = mode === "rewrite" ? "Fix all (unique)" : "Fix all (complete)";
    const mins = Math.ceil((targets.length * 15) / 60);
    if (!window.confirm(`${label}: regenerate ${targets.length} questions across ${clusters.length} cluster${clusters.length === 1 ? "" : "s"} (one keeper preserved per cluster). Estimated ~${mins} min. Continue?`)) return;
    void runBulk(targets, mode, label);
  };

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
          <span className="block font-semibold">Question type</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            disabled={!scanned || availableTypes.length === 0}
          >
            <option value="__all__">All types{scanned ? "" : " (run scan first)"}</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {t}
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

      {scanned && visiblePairs.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {visiblePairs.length} similar pair{visiblePairs.length === 1 ? "" : "s"} remaining
          </Badge>
          <Badge variant="outline" className="text-xs">
            {uniqueQuestions} unique question{uniqueQuestions === 1 ? "" : "s"}
          </Badge>
          {bigClusters > 0 && (
            <Badge variant="destructive" className="text-xs">
              {bigClusters} cluster{bigClusters === 1 ? "" : "s"} with 3+ duplicates
            </Badge>
          )}
          {pairs.length !== visiblePairs.length && (
            <span className="text-xs text-muted-foreground">
              ({pairs.length - visiblePairs.length} marked not duplicate)
            </span>
          )}
          <div className="ml-auto flex items-center gap-1 rounded-md border border-border p-0.5">
            <button
              type="button"
              onClick={() => setView("pairs")}
              className={`rounded px-2 py-1 text-xs ${view === "pairs" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Pairs
            </button>
            <button
              type="button"
              onClick={() => setView("clusters")}
              className={`rounded px-2 py-1 text-xs ${view === "clusters" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Clusters ({clusters.length})
            </button>
          </div>
        </div>
      )}

      {scanned && clusters.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-border bg-card p-3">
          <span className="text-xs font-semibold">Bulk fix all clusters:</span>
          <Button size="sm" disabled={bulkRunning || totalBulkCount === 0} onClick={() => confirmAndRunAll("rewrite")}>
            Fix all (unique) — {totalBulkCount}
          </Button>
          <Button size="sm" variant="secondary" disabled={bulkRunning || totalBulkCount === 0} onClick={() => confirmAndRunAll("complete")}>
            Fix all (complete) — {totalBulkCount}
          </Button>
          {bulkRunning && (
            <Button size="sm" variant="outline" onClick={() => (bulkCancelRef.current = true)}>
              Cancel
            </Button>
          )}
          {bulkProgress && <span className="text-xs text-muted-foreground">{bulkProgress}</span>}
          <span className="ml-auto text-xs text-muted-foreground">
            One keeper preserved per cluster · sequential to respect rate limits
          </span>
        </div>
      )}

      {scanned && view === "pairs" && (
        <div className="mt-4 space-y-3">
          {sortedPairs.map((p) => {
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
                    dupCount={dupInfo.count.get(`${p.a.topic}::${p.a.id}`) ?? 0}
                    partners={dupInfo.partners.get(`${p.a.topic}::${p.a.id}`) ?? []}
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
                    dupCount={dupInfo.count.get(`${p.b.topic}::${p.b.id}`) ?? 0}
                    partners={dupInfo.partners.get(`${p.b.topic}::${p.b.id}`) ?? []}
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
      )}

      {scanned && view === "clusters" && (
        <div className="mt-4 space-y-3">
          {clusters.map((cluster, ci) => {
            const memberKeys = Array.from(cluster.members);
            const sevClass =
              cluster.members.size >= 4
                ? "border-destructive/60"
                : cluster.members.size === 3
                ? "border-amber-500/60"
                : "border-border";
            const keeper = pickKeeper(cluster.members);
            const targets = clusterTargets(cluster);
            return (
              <div key={ci} className={`rounded-md border-2 bg-card p-3 ${sevClass}`}>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant={cluster.members.size >= 3 ? "destructive" : "secondary"}>
                    Cluster of {cluster.members.size} questions
                  </Badge>
                  <span className="text-muted-foreground">
                    {cluster.pairs.length} pair{cluster.pairs.length === 1 ? "" : "s"}
                  </span>
                  <div className="ml-auto flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      disabled={bulkRunning || targets.length === 0}
                      onClick={() => void runBulk(targets, "rewrite", `Cluster ${ci + 1} (unique)`)}
                    >
                      Regenerate cluster ({targets.length}) as unique
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={bulkRunning || targets.length === 0}
                      onClick={() => void runBulk(targets, "complete", `Cluster ${ci + 1} (complete)`)}
                    >
                      Complete-regenerate cluster ({targets.length})
                    </Button>
                  </div>
                </div>
                <ul className="mt-2 space-y-2">
                  {memberKeys.map((mk) => {
                    const [topic, id] = mk.split("::");
                    const partners = dupInfo.partners.get(mk) ?? [];
                    const sample = partners[0]?.text ?? "";
                    const text =
                      cluster.pairs.find((p) => `${p.a.topic}::${p.a.id}` === mk)?.a.text ??
                      cluster.pairs.find((p) => `${p.b.topic}::${p.b.id}` === mk)?.b.text ??
                      sample;
                    const dupCount = dupInfo.count.get(mk) ?? 0;
                    const diff = diffs[mk];
                    const isKeeper = mk === keeper;
                    return (
                      <li key={mk} className={`rounded border bg-background/50 p-2 ${isKeeper ? "border-success/60" : "border-border"}`}>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {isKeeper && <Badge variant="outline" className="border-success text-success">keeper</Badge>}
                          <Badge variant={dupCount >= 3 ? "destructive" : dupCount === 2 ? "secondary" : "outline"}>
                            {dupCount} duplicate{dupCount === 1 ? "" : "s"}
                          </Badge>
                          <Link
                            to="/admin-kb20/questions/$topic"
                            params={{ topic }}
                            search={{ q: id, from: "validator" }}
                            className="font-mono hover:underline"
                          >
                            {topic} / {id}
                          </Link>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm">{text}</p>
                        {diff && (
                          <p className="mt-1 text-xs text-success">
                            ✓ regenerated (sim {(diff.sim * 100).toFixed(0)}%)
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  Keeper is preserved; the other {targets.length} will be regenerated. Switch to Pairs view for individual control.
                </p>
              </div>
            );
          })}
        </div>
      )}
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
  dupCount,
  partners,
  onRegenerate,
  onCompleteRegenerate,
  onRevert,
}: {
  side: "A" | "B";
  topic: string;
  id: string;
  text: string;
  diff?: { before: AnyQ; after: AnyQ; sim: number; needsReview: boolean; mode?: "rewrite" | "complete"; concept?: string };
  busy: boolean;
  dupCount: number;
  partners: Array<{ topic: string; id: string; text: string }>;
  onRegenerate: () => void;
  onCompleteRegenerate: () => void;
  onRevert: () => void;
}) {
  const [showPartners, setShowPartners] = useState(false);
  return (
    <div className="rounded border border-border bg-background/50 p-2">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{side}</Badge>
        {dupCount >= 2 && (
          <button
            type="button"
            onClick={() => setShowPartners((v) => !v)}
            className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
              dupCount >= 3 ? "bg-destructive/15 text-destructive" : "bg-amber-500/15 text-amber-700"
            }`}
            title="Click to see all duplicates"
          >
            {dupCount} duplicates {showPartners ? "▴" : "▾"}
          </button>
        )}
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
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={onRegenerate} disabled={busy}>
          {busy ? "Working…" : "Regenerate as unique"}
        </Button>
        <Button size="sm" variant="secondary" onClick={onCompleteRegenerate} disabled={busy} title="Generate a brand-new question and check uniqueness across the whole category">
          {busy ? "Working…" : "Complete Regeneration"}
        </Button>
        {diff && (
          <Button size="sm" variant="outline" onClick={onRevert}>
            Revert
          </Button>
        )}
      </div>
      {showPartners && partners.length > 0 && (
        <ul className="mt-2 space-y-1 rounded bg-muted/30 p-2 text-xs">
          {partners.map((pr, i) => (
            <li key={i} className="flex gap-2">
              <Link
                to="/admin-kb20/questions/$topic"
                params={{ topic: pr.topic }}
                search={{ q: pr.id, from: "validator" }}
                className="font-mono text-muted-foreground hover:underline shrink-0"
              >
                {pr.topic}/{pr.id}
              </Link>
              <span className="line-clamp-1">{pr.text}</span>
            </li>
          ))}
        </ul>
      )}
      {diff && (
        <div className="mt-2 rounded bg-muted/40 p-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={diff.needsReview ? "destructive" : "secondary"}>
              new · sim {(diff.sim * 100).toFixed(0)}%{diff.needsReview ? " · needs review" : ""}
            </Badge>
            {diff.mode === "complete" && <Badge variant="outline">complete · category-wide</Badge>}
            {diff.concept && <span className="text-muted-foreground">concept: {diff.concept}</span>}
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
