import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { categories } from "@/data/categories";
import { loadTopicFileForAdmin } from "@/data/mocks";
import { applyOverrideToQuestionRecord, invalidateOverrides, loadOverrides } from "@/lib/overrides";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { buildBlob } from "@/lib/admin/similarity";
import {
  completeRegenerateQuestion,
  regenerateUniqueQuestion,
} from "@/lib/server-fns/similarity.functions";

export const Route = createFileRoute("/admin-kb20/category-check")({
  head: () => ({
    meta: [
      { title: "Category Check — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <CategoryCheckPage />
    </AdminGate>
  ),
});

// Category-aware forbidden term lists. Any question in one of these categories that
// contains one of the listed terms is flagged as off-topic for review.
// Driving / taxi categories are intentionally excluded — driving terms are on-topic there.
const FORBIDDEN_BY_CATEGORY: Record<string, string[]> = {
  // Default forbidden set used for any non-driving category unless overridden below.
  __default__: [
    "car park", "car parks", "parked car", "parked cars",
    "motorway", "motorways", "dual carriageway",
    "learner driver", "driving licence", "driving license",
    "road sign", "road signs", "speed limit",
    "highway code", "hazard perception",
    "MOT", "DVSA", "DVLA",
    "roundabout", "zebra crossing", "pelican crossing",
    "give way sign", "stopping distance", "braking distance",
  ],
};

const DRIVING_CATEGORIES = new Set(["driving", "taxi-private-hire", "hgv-logistics"]);

type AnyQ = Record<string, unknown> & { id?: string };

type Flag = {
  topic: string;
  topicTitle: string;
  catSlug: string;
  catTitle: string;
  id: string;
  question: string;
  options: string[];
  explanation: string;
  matchedTerms: string[];
  matchedIn: string[];
  hasOverride: boolean;
  overrideUpdatedAt?: string;
};

function textOf(q: AnyQ): string {
  return (
    (q.question as string | undefined) ??
    (q.template as string | undefined) ??
    (q.prompt as string | undefined) ??
    ""
  );
}

function buildRegex(terms: string[]): RegExp {
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
}

function CategoryCheckPage() {
  const allCats = categories;
  const [scope, setScope] = useState<"all-non-driving" | "single">("all-non-driving");
  const [singleCat, setSingleCat] = useState<string>("citizenship");
  const [onlyOverrides, setOnlyOverrides] = useState(true);
  const [extraTerms, setExtraTerms] = useState("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, label: "" });
  const [flags, setFlags] = useState<Flag[]>([]);
  const [scanned, setScanned] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkMsg, setBulkMsg] = useState("");

  const targetCategories = useMemo(() => {
    if (scope === "single") return allCats.filter((c) => c.slug === singleCat);
    return allCats.filter((c) => !DRIVING_CATEGORIES.has(c.slug));
  }, [scope, singleCat, allCats]);

  const toggleSel = (k: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  const run = async () => {
    setRunning(true);
    setFlags([]);
    setSelected(new Set());
    setScanned(true);

    const overrides = await loadOverrides();
    const extras = extraTerms
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const allTopics = targetCategories.flatMap((c) =>
      c.topics.map((t) => ({ ...t, catSlug: c.slug, catTitle: c.title })),
    );
    setProgress({ done: 0, total: allTopics.length, label: "" });

    const out: Flag[] = [];
    let done = 0;
    for (const topic of allTopics) {
      setProgress({ done, total: allTopics.length, label: `${topic.catTitle} → ${topic.title}` });
      const file = await loadTopicFileForAdmin(topic.slug);
      if (!file) {
        done++;
        setProgress({ done, total: allTopics.length, label: "" });
        continue;
      }
      const isV2 = (file as { version?: number }).version === 2;
      const rawBank: AnyQ[] = isV2
        ? ((file as { bank: AnyQ[] }).bank ?? [])
        : ((file as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap(
            (t) => t.questions ?? [],
          );

      const baseTerms =
        FORBIDDEN_BY_CATEGORY[topic.catSlug] ?? FORBIDDEN_BY_CATEGORY.__default__;
      const allTerms = [...baseTerms, ...extras];
      const re = buildRegex(allTerms);

      for (const raw of rawBank) {
        const id = raw.id;
        if (!id) continue;
        const ovKey = `${topic.slug}::${id}`;
        const ov = overrides.get(ovKey);
        if (onlyOverrides && !ov) continue;
        const q2 = applyOverrideToQuestionRecord(raw, ov);
        const qText = textOf(q2);
        const opts = Array.isArray(q2.options)
          ? (q2.options as unknown[]).map((o) => (typeof o === "string" ? o : String(o)))
          : [];
        const exp = (q2.explanation as string | undefined) ?? "";

        const matchedTerms = new Set<string>();
        const matchedIn: string[] = [];
        const scan = (label: string, text: string) => {
          re.lastIndex = 0;
          let m: RegExpExecArray | null;
          let any = false;
          while ((m = re.exec(text)) !== null) {
            matchedTerms.add(m[1].toLowerCase());
            any = true;
          }
          if (any) matchedIn.push(label);
        };
        scan("question", qText);
        opts.forEach((o, i) => scan(`option ${i + 1}`, o));
        scan("explanation", exp);

        if (matchedTerms.size > 0) {
          out.push({
            topic: topic.slug,
            topicTitle: topic.title,
            catSlug: topic.catSlug,
            catTitle: topic.catTitle,
            id: String(id),
            question: qText,
            options: opts,
            explanation: exp,
            matchedTerms: Array.from(matchedTerms),
            matchedIn,
            hasOverride: Boolean(ov),
            overrideUpdatedAt: undefined,
          });
        }
      }
      done++;
      setProgress({ done, total: allTopics.length, label: "" });
    }
    setFlags(out);
    setRunning(false);
  };

  const targetFlags = (): Flag[] => {
    if (selected.size === 0) return flags;
    return flags.filter((f) => selected.has(`${f.topic}::${f.id}`));
  };

  // Regenerate a single flagged question via AI (category-aware prompt).
  // mode "rewrite" = topic-only reword; "complete" = brand-new question on a fresh sub-topic.
  const regenerateFlag = async (f: Flag, mode: "rewrite" | "complete"): Promise<{ ok: boolean; error?: string }> => {
    const overrides = await loadOverrides();
    const file = await loadTopicFileForAdmin(f.topic);
    if (!file) return { ok: false, error: "topic file missing" };
    const isV2 = (file as { version?: number }).version === 2;
    const rawBank: AnyQ[] = isV2
      ? ((file as { bank: AnyQ[] }).bank ?? [])
      : ((file as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap((t) => t.questions ?? []);
    const sourceRaw = rawBank.find((q) => String(q.id) === f.id);
    if (!sourceRaw) return { ok: false, error: "source not found" };
    const source = applyOverrideToQuestionRecord(sourceRaw, overrides.get(`${f.topic}::${f.id}`));

    const { data: sess } = await supabase.auth.getSession();
    const accessToken = sess.session?.access_token ?? "";

    const sourcePayload = {
      id: f.id,
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
    };

    if (mode === "rewrite") {
      const existingBlobs = rawBank
        .filter((q) => String(q.id) !== f.id)
        .map((raw) => {
          const q = applyOverrideToQuestionRecord(raw, overrides.get(`${f.topic}::${raw.id}`));
          return buildBlob(q as Parameters<typeof buildBlob>[0]);
        });
      const res = await regenerateUniqueQuestion({
        data: {
          accessToken,
          topic: f.topic,
          topicTitle: f.topicTitle,
          category: f.catSlug,
          categoryTitle: f.catTitle,
          source: sourcePayload,
          existingBlobs,
        },
      });
      if (res.error || !res.generated) return { ok: false, error: res.error ?? "unknown error" };
      invalidateOverrides();
      return { ok: true };
    }

    const cat = categories.find((c) => c.slug === f.catSlug);
    if (!cat) return { ok: false, error: "category missing" };
    const categoryBlobs: string[] = [];
    for (const t of cat.topics) {
      const fileT = await loadTopicFileForAdmin(t.slug);
      if (!fileT) continue;
      const v2 = (fileT as { version?: number }).version === 2;
      const bank: AnyQ[] = v2
        ? ((fileT as { bank: AnyQ[] }).bank ?? [])
        : ((fileT as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap((tt) => tt.questions ?? []);
      for (const raw of bank) {
        if (!raw.id) continue;
        if (t.slug === f.topic && String(raw.id) === f.id) continue;
        const q = applyOverrideToQuestionRecord(raw, overrides.get(`${t.slug}::${raw.id}`));
        categoryBlobs.push(buildBlob(q as Parameters<typeof buildBlob>[0]));
      }
    }
    const res = await completeRegenerateQuestion({
      data: {
        accessToken,
        topic: f.topic,
        topicTitle: f.topicTitle,
        category: f.catSlug,
        categoryTitle: f.catTitle,
        source: sourcePayload,
        categoryBlobs,
      },
    });
    if (res.error || !res.generated) return { ok: false, error: res.error ?? "unknown error" };
    invalidateOverrides();
    return { ok: true };
  };

  const onSingleRegen = async (f: Flag, mode: "rewrite" | "complete") => {
    const k = `${f.topic}::${f.id}`;
    setBusyKey(k);
    const r = await regenerateFlag(f, mode);
    setBusyKey(null);
    if (!r.ok) {
      alert(`Failed: ${r.error}`);
      return;
    }
    // Remove from flag list — it's been rewritten on-topic.
    setFlags((prev) => prev.filter((x) => !(x.topic === f.topic && x.id === f.id)));
  };

  const onBulkRegen = async (mode: "rewrite" | "complete") => {
    const list = targetFlags();
    if (!list.length) return;
    const label = mode === "rewrite" ? "Reword" : "Complete regenerate";
    if (!confirm(`${label} ${list.length} flagged question(s) with a category-aware prompt? This may take a while.`)) return;
    setBulkRunning(true);
    let i = 0;
    let failed = 0;
    const fixed: { topic: string; id: string }[] = [];
    for (const f of list) {
      i++;
      setBulkMsg(`${label} ${i}/${list.length} — ${f.topic} ${f.id}`);
      const r = await regenerateFlag(f, mode);
      if (!r.ok) failed++;
      else fixed.push({ topic: f.topic, id: f.id });
    }
    setBulkRunning(false);
    setBulkMsg("");
    setFlags((prev) => prev.filter((x) => !fixed.some((y) => y.topic === x.topic && y.id === x.id)));
    setSelected(new Set());
    alert(failed === 0 ? `${label}: ${list.length} done.` : `${label}: ${list.length - failed} done, ${failed} failed.`);
  };

  const onBulkDisable = async () => {

    const list = targetFlags();
    if (!list.length) return;
    if (!confirm(`Disable ${list.length} flagged question(s)? They will be hidden from live quizzes.`)) return;
    setBulkRunning(true);
    let i = 0;
    let failed = 0;
    for (const f of list) {
      i++;
      setBulkMsg(`Disabling ${i}/${list.length}…`);
      const { error } = await supabase
        .from("question_overrides")
        .upsert(
          { topic: f.topic, question_id: f.id, disabled: true },
          { onConflict: "topic,question_id" },
        );
      if (error) failed++;
    }
    invalidateOverrides();
    setBulkRunning(false);
    setBulkMsg("");
    alert(failed === 0 ? `Disabled ${list.length} question(s).` : `Disabled with ${failed} failure(s).`);
  };

  const onBulkReset = async () => {
    const list = targetFlags().filter((f) => f.hasOverride);
    if (!list.length) {
      alert("No flagged items have an override to reset.");
      return;
    }
    if (!confirm(`Reset ${list.length} question(s) to original (delete override)?`)) return;
    setBulkRunning(true);
    let failed = 0;
    let i = 0;
    for (const f of list) {
      i++;
      setBulkMsg(`Resetting ${i}/${list.length}…`);
      const { error } = await supabase
        .from("question_overrides")
        .delete()
        .eq("topic", f.topic)
        .eq("question_id", f.id);
      if (error) failed++;
    }
    invalidateOverrides();
    setBulkRunning(false);
    setBulkMsg("");
    setFlags((prev) => prev.filter((f) => !list.some((x) => x.topic === f.topic && x.id === f.id)));
    alert(failed === 0 ? `Reset ${list.length} question(s).` : `Reset with ${failed} failure(s).`);
  };

  const grouped = useMemo(() => {
    const m = new Map<string, Flag[]>();
    for (const f of flags) {
      const k = `${f.catTitle} — ${f.topicTitle}`;
      const arr = m.get(k) ?? [];
      arr.push(f);
      m.set(k, arr);
    }
    return Array.from(m.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [flags]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Category Check</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Scans questions for off-topic terms based on their category. Driving-related
        terms (cars, car parks, motorway, road signs, MOT, DVSA, etc.) are flagged in
        any non-driving category — useful for catching AI regenerations that drifted
        off-topic.
      </p>

      <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="block font-semibold">Scope</span>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as "all-non-driving" | "single")}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          >
            <option value="all-non-driving">All non-driving categories</option>
            <option value="single">Single category…</option>
          </select>
        </label>
        {scope === "single" && (
          <label className="text-sm">
            <span className="block font-semibold">Category</span>
            <select
              value={singleCat}
              onChange={(e) => setSingleCat(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            >
              {allCats.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="text-sm sm:col-span-2">
          <span className="block font-semibold">Extra forbidden terms (comma-separated, optional)</span>
          <input
            value={extraTerms}
            onChange={(e) => setExtraTerms(e.target.value)}
            placeholder="e.g. petrol, diesel, lorry"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyOverrides}
            onChange={(e) => setOnlyOverrides(e.target.checked)}
          />
          Only check AI-regenerated (overrides), not original bank
        </label>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => void run()}
            disabled={running}
            className="rounded-xl bg-gradient-coral px-4 py-2 text-sm font-semibold text-coral-foreground disabled:opacity-50"
          >
            {running
              ? `Scanning ${progress.done}/${progress.total}${progress.label ? ` — ${progress.label}` : ""}`
              : "Run check"}
          </button>
        </div>
      </div>

      {scanned && !running && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {flags.length === 0
              ? "Clean — no off-topic flags."
              : `${flags.length} flagged question(s) across ${grouped.length} topic(s).`}
          </p>
          {flags.length > 0 && (
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {bulkRunning && <span className="text-xs text-muted-foreground">{bulkMsg}</span>}
              <span className="text-xs text-muted-foreground">
                {selected.size > 0 ? `${selected.size} selected` : "no selection (acts on all)"}
              </span>
              <button
                type="button"
                onClick={() => setSelected(new Set(flags.map((f) => `${f.topic}::${f.id}`)))}
                disabled={bulkRunning}
                className="rounded-md border border-border bg-card px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                disabled={bulkRunning || selected.size === 0}
                className="rounded-md border border-border bg-card px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => void onBulkRegen("rewrite")}
                disabled={bulkRunning}
                className="rounded-md border border-coral/50 bg-coral/10 px-3 py-1.5 text-xs font-semibold text-coral hover:bg-coral/20 disabled:opacity-50"
                title="AI rewrites each on-topic, keeping the same underlying concept"
              >
                Reword (AI)
              </button>
              <button
                type="button"
                onClick={() => void onBulkRegen("complete")}
                disabled={bulkRunning}
                className="rounded-xl bg-gradient-coral px-3 py-1.5 text-xs font-semibold text-coral-foreground disabled:opacity-50"
                title="AI generates a brand-new on-topic question on a fresh sub-topic"
              >
                Regenerate (AI)
              </button>
              <button
                type="button"
                onClick={() => void onBulkReset()}
                disabled={bulkRunning}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-50"
                title="Delete the AI override and restore the original bank text"
              >
                Reset to original
              </button>
              <button
                type="button"
                onClick={() => void onBulkDisable()}
                disabled={bulkRunning}
                className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-50"
                title="Hide these questions from live quizzes"
              >
                Disable
              </button>

            </div>
          )}
        </div>
      )}

      <div className="mt-4 space-y-4">
        {grouped.map(([groupKey, items]) => (
          <section key={groupKey} className="rounded-xl border border-border bg-card">
            <header className="flex items-center justify-between border-b border-border px-3 py-2">
              <h2 className="text-sm font-semibold">{groupKey}</h2>
              <Badge variant="secondary">{items.length} flagged</Badge>
            </header>
            <ul className="divide-y divide-border">
              {items.map((f) => {
                const k = `${f.topic}::${f.id}`;
                const busy = busyKey === k;
                return (
                  <li key={k} className="flex items-start gap-2 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selected.has(k)}
                      onChange={() => toggleSel(k)}
                      disabled={bulkRunning || busy}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground">{f.id}</span>
                        {f.hasOverride && (
                          <Badge variant="default" className="text-[10px]">AI override</Badge>
                        )}
                        {f.matchedTerms.map((t) => (
                          <Badge key={t} variant="destructive" className="text-[10px]">
                            {t}
                          </Badge>
                        ))}
                        <span className="text-[10px] uppercase text-muted-foreground">
                          in {f.matchedIn.join(", ")}
                        </span>
                        <div className="ml-auto flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => void onSingleRegen(f, "rewrite")}
                            disabled={busy || bulkRunning}
                            className="rounded-md border border-coral/50 bg-coral/10 px-2 py-1 text-[11px] font-semibold text-coral hover:bg-coral/20 disabled:opacity-50"
                            title="AI rewrites this question on-topic, keeping the underlying concept"
                          >
                            {busy ? "Working…" : "Reword"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void onSingleRegen(f, "complete")}
                            disabled={busy || bulkRunning}
                            className="rounded-md bg-gradient-coral px-2 py-1 text-[11px] font-semibold text-coral-foreground disabled:opacity-50"
                            title="AI generates a brand-new on-topic question"
                          >
                            Regenerate
                          </button>
                          <Link
                            to="/admin-kb20/questions/$topic"
                            params={{ topic: f.topic }}
                            search={{ q: f.id, from: "validator" }}
                            className="text-xs font-semibold text-muted-foreground hover:underline"
                          >
                            Open in editor →
                          </Link>
                        </div>

                      </div>
                      <p>{f.question}</p>
                      {f.options.length > 0 && (
                        <ol className="list-decimal pl-5 text-xs text-muted-foreground">
                          {f.options.map((o, i) => (
                            <li key={i}>{o}</li>
                          ))}
                        </ol>
                      )}
                      {f.explanation && (
                        <p className="rounded bg-muted/50 p-2 text-xs">
                          <span className="font-semibold">Explanation: </span>
                          {f.explanation}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
