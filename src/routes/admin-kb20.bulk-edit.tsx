import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdminGate } from "@/components/AdminGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/categories";
import { loadTopicFileForAdmin } from "@/data/mocks";
import { supabase } from "@/integrations/supabase/client";
import { invalidateOverrides, loadOverrides } from "@/lib/overrides";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin-kb20/bulk-edit")({
  head: () => ({
    meta: [
      { title: "Bulk edit — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <BulkEditPage />
    </AdminGate>
  ),
});

type RawQ = Record<string, unknown> & {
  id?: string;
  type?: string;
  question?: string;
  template?: string;
  prompt?: string;
  options?: string[];
  correctAnswer?: number | boolean;
  correctAnswers?: number[];
  explanation?: string;
  image?: string;
  imageAlt?: string;
};

type V2 = {
  version: 2;
  topic: string;
  bank: (RawQ & { id: string })[];
  mocks: { mockNumber: number; title: string; questionIds: string[] }[];
};
type V1 = {
  topic: string;
  tests: { mockNumber: number; questions: RawQ[] }[];
};
type AnyFile = V1 | V2;

type FlatBankItem = {
  id: string;
  question: string;
  options?: string[];
  explanation?: string;
};

function flatten(file: AnyFile): FlatBankItem[] {
  if ((file as V2).version === 2 && Array.isArray((file as V2).bank)) {
    return (file as V2).bank.map((q) => ({
      id: q.id,
      question: (q.question || q.template || q.prompt || "") as string,
      options: q.options,
      explanation: q.explanation,
    }));
  }
  // v1 fallback — synthesise an id matching the runtime sourceId fallback
  const v1 = file as V1;
  const out: FlatBankItem[] = [];
  v1.tests.forEach((t) => {
    t.questions.forEach((q, i) => {
      out.push({
        id: q.id ?? `${file.topic}-mock-${t.mockNumber}-q${i + 1}`,
        question: (q.question || q.template || q.prompt || "") as string,
        options: q.options,
        explanation: q.explanation,
      });
    });
  });
  return out;
}

const ALL_TOPICS = categories.flatMap((c) =>
  c.topics.map((t) => ({ slug: t.slug, title: `${c.title} — ${t.title}` })),
);

// Allowed character set: printable ASCII (incl. punctuation) plus a few common
// extended Latin / typographic punctuation marks. Anything else is "weird".
const ALLOWED_RE =
  /^[\u0020-\u007E\u00A0-\u017F\u2010-\u2015\u2018-\u201D\u2026\u20AC\n\r\t]*$/;
function hasWeirdChars(s: string): boolean {
  return !ALLOWED_RE.test(s);
}
function stripWeird(s: string): string {
  return Array.from(s)
    .filter((ch) => ALLOWED_RE.test(ch))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

type Change = {
  id: string;
  field: "question" | "options" | "explanation";
  before: string;
  after: string;
  // For options, we rewrite the entire array.
  newOptions?: string[];
  newQuestion?: string;
  newExplanation?: string;
};

function applyFindReplace(
  items: FlatBankItem[],
  find: string,
  replace: string,
  scope: { question: boolean; options: boolean; explanation: boolean },
  matchCase: boolean,
  wholeWord: boolean,
): Change[] {
  if (!find) return [];
  const flags = matchCase ? "g" : "gi";
  const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
  const re = new RegExp(pattern, flags);

  const changes: Change[] = [];
  for (const it of items) {
    let qNew = it.question;
    let oNew = it.options ? [...it.options] : undefined;
    let eNew = it.explanation ?? "";
    let mutated = false;

    if (scope.question && re.test(it.question)) {
      qNew = it.question.replace(re, replace);
      mutated = mutated || qNew !== it.question;
    }
    re.lastIndex = 0;
    if (scope.options && oNew) {
      oNew = oNew.map((opt) => {
        re.lastIndex = 0;
        return re.test(opt) ? opt.replace(re, replace) : opt;
      });
      mutated = mutated || JSON.stringify(oNew) !== JSON.stringify(it.options);
    }
    re.lastIndex = 0;
    if (scope.explanation && it.explanation && re.test(it.explanation)) {
      eNew = it.explanation.replace(re, replace);
      mutated = mutated || eNew !== it.explanation;
    }
    re.lastIndex = 0;

    if (mutated) {
      const before = JSON.stringify({
        q: it.question,
        o: it.options,
        e: it.explanation,
      });
      const after = JSON.stringify({ q: qNew, o: oNew, e: eNew });
      changes.push({
        id: it.id,
        field: "question",
        before,
        after,
        newQuestion: qNew !== it.question ? qNew : undefined,
        newOptions:
          oNew && JSON.stringify(oNew) !== JSON.stringify(it.options)
            ? oNew
            : undefined,
        newExplanation: eNew !== (it.explanation ?? "") ? eNew : undefined,
      });
    }
  }
  return changes;
}

function applyStripWeird(items: FlatBankItem[]): Change[] {
  const changes: Change[] = [];
  for (const it of items) {
    const qDirty = hasWeirdChars(it.question);
    const oDirty = (it.options ?? []).some(hasWeirdChars);
    const eDirty = it.explanation ? hasWeirdChars(it.explanation) : false;
    if (!qDirty && !oDirty && !eDirty) continue;
    const qNew = qDirty ? stripWeird(it.question) : it.question;
    const oNew = it.options
      ? it.options.map((o) => (hasWeirdChars(o) ? stripWeird(o) : o))
      : undefined;
    const eNew = eDirty && it.explanation ? stripWeird(it.explanation) : it.explanation;
    changes.push({
      id: it.id,
      field: "question",
      before: JSON.stringify({ q: it.question, o: it.options, e: it.explanation }),
      after: JSON.stringify({ q: qNew, o: oNew, e: eNew }),
      newQuestion: qDirty ? qNew : undefined,
      newOptions:
        oNew && JSON.stringify(oNew) !== JSON.stringify(it.options) ? oNew : undefined,
      newExplanation: eDirty ? eNew : undefined,
    });
  }
  return changes;
}

function BulkEditPage() {
  const { user } = useAuth();
  const [topic, setTopic] = useState<string>(ALL_TOPICS[0]?.slug ?? "");
  const [items, setItems] = useState<FlatBankItem[]>([]);
  const [loadingTopic, setLoadingTopic] = useState(false);

  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [scopeQ, setScopeQ] = useState(true);
  const [scopeO, setScopeO] = useState(true);
  const [scopeE, setScopeE] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  const [preview, setPreview] = useState<Change[]>([]);
  const [applying, setApplying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const loadTopic = async (slug: string) => {
    setTopic(slug);
    setItems([]);
    setPreview([]);
    setResult(null);
    setErr(null);
    setLoadingTopic(true);
    try {
      const file = (await loadTopicFileForAdmin(slug)) as AnyFile | undefined;
      if (!file) {
        setErr("Could not load topic file.");
        return;
      }
      setItems(flatten(file));
    } finally {
      setLoadingTopic(false);
    }
  };

  // Auto-load first topic on mount
  useMemo(() => {
    if (topic && items.length === 0 && !loadingTopic) void loadTopic(topic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runPreview = () => {
    setResult(null);
    setErr(null);
    const changes = applyFindReplace(
      items,
      find,
      replace,
      { question: scopeQ, options: scopeO, explanation: scopeE },
      matchCase,
      wholeWord,
    );
    setPreview(changes);
  };

  const runStripWeird = () => {
    setResult(null);
    setErr(null);
    setPreview(applyStripWeird(items));
  };

  const apply = async () => {
    if (preview.length === 0) return;
    setApplying(true);
    setErr(null);
    setResult(null);
    try {
      // Load existing overrides so we merge instead of clobbering other fields
      const existing = await loadOverrides();
      const rows = preview.map((c) => {
        const prev = existing.get(`${topic}::${c.id}`);
        const item = items.find((i) => i.id === c.id);
        return {
          topic,
          question_id: c.id,
          question: c.newQuestion ?? prev?.question ?? item?.question ?? null,
          options: c.newOptions ?? prev?.options ?? item?.options ?? null,
          correct_answer: prev?.correct_answer ?? null,
          explanation:
            c.newExplanation ?? prev?.explanation ?? item?.explanation ?? null,
          image: prev?.image ?? null,
          image_alt: prev?.image_alt ?? null,
          updated_by: user?.id ?? null,
        };
      });

      // Upsert in batches of 50
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
      setResult(`Wrote ${written} override${written === 1 ? "" : "s"}.`);
      setPreview([]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4">
          <Link to="/admin-kb20" className="text-sm text-coral hover:underline">
            ← Back to admin
          </Link>
        </div>
        <h1 className="font-display text-2xl font-bold">Bulk find & replace</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Run a find-and-replace across an entire topic's question bank, or strip
          non-Latin / control characters from every question in one click. Each
          changed question is saved as a per-question override that takes effect
          on the live site immediately (no republish needed).
        </p>

        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <label className="block text-sm font-semibold">Topic</label>
          <select
            value={topic}
            onChange={(e) => loadTopic(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm"
          >
            {ALL_TOPICS.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title} ({t.slug})
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-muted-foreground">
            {loadingTopic
              ? "Loading…"
              : `${items.length} questions in this topic's bank.`}
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <h2 className="font-display text-lg font-semibold">Find & replace</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Find</label>
              <Input value={find} onChange={(e) => setFind(e.target.value)} placeholder="text to find" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Replace with</label>
              <Input value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="replacement text (leave blank to delete)" />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={scopeQ} onChange={(e) => setScopeQ(e.target.checked)} />
              Question text
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={scopeO} onChange={(e) => setScopeO(e.target.checked)} />
              Options
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={scopeE} onChange={(e) => setScopeE(e.target.checked)} />
              Explanation
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)} />
              Match case
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={wholeWord} onChange={(e) => setWholeWord(e.target.checked)} />
              Whole word
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={runPreview} variant="outline" disabled={!find || items.length === 0}>
              Preview matches
            </Button>
            <Button onClick={runStripWeird} variant="outline" disabled={items.length === 0}>
              Strip non-Latin / control characters
            </Button>
          </div>
        </div>

        {preview.length > 0 && (
          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                Preview ({preview.length} change{preview.length === 1 ? "" : "s"})
              </h2>
              <Button onClick={apply} disabled={applying}>
                {applying ? "Applying…" : `Apply to ${preview.length}`}
              </Button>
            </div>
            <ul className="mt-3 max-h-[480px] divide-y divide-border overflow-auto text-sm">
              {preview.slice(0, 200).map((c) => {
                const item = items.find((i) => i.id === c.id);
                return (
                  <li key={c.id} className="py-3">
                    <div className="font-mono text-xs text-muted-foreground">{c.id}</div>
                    {c.newQuestion !== undefined && (
                      <div className="mt-1">
                        <div className="text-xs font-semibold uppercase text-muted-foreground">Question</div>
                        <div className="text-destructive line-through">{item?.question}</div>
                        <div className="text-emerald-700">{c.newQuestion}</div>
                      </div>
                    )}
                    {c.newOptions && (
                      <div className="mt-1">
                        <div className="text-xs font-semibold uppercase text-muted-foreground">Options</div>
                        {c.newOptions.map((opt, i) => (
                          <div key={i}>
                            {opt !== item?.options?.[i] ? (
                              <>
                                <span className="text-destructive line-through">
                                  {String.fromCharCode(65 + i)}. {item?.options?.[i]}
                                </span>
                                <span className="ml-2 text-emerald-700">→ {opt}</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">
                                {String.fromCharCode(65 + i)}. {opt}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {c.newExplanation !== undefined && (
                      <div className="mt-1">
                        <div className="text-xs font-semibold uppercase text-muted-foreground">Explanation</div>
                        <div className="text-destructive line-through">{item?.explanation}</div>
                        <div className="text-emerald-700">{c.newExplanation}</div>
                      </div>
                    )}
                  </li>
                );
              })}
              {preview.length > 200 && (
                <li className="py-3 text-xs text-muted-foreground">
                  …and {preview.length - 200} more. All will be applied.
                </li>
              )}
            </ul>
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
            <p className="font-semibold text-emerald-800">{result}</p>
            <p className="mt-1 text-emerald-700">
              Overrides apply to the live site on next page load.{" "}
              <Link to="/admin-kb20/validator" className="underline">
                Open the validator
              </Link>{" "}
              to verify.
            </p>
          </div>
        )}
        {err && (
          <p className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {err}
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
