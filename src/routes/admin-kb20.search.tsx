import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { categories } from "@/data/categories";
import { loadTopicFileForAdmin } from "@/data/mocks";
import { applyOverrideToQuestionRecord, loadOverrides } from "@/lib/overrides";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin-kb20/search")({
  head: () => ({
    meta: [
      { title: "Search Questions — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <SearchPage />
    </AdminGate>
  ),
});

type AnyQ = Record<string, unknown> & { id?: string };
type Hit = {
  topic: string;
  id: string;
  question: string;
  options: string[];
  correct?: number | number[] | boolean;
  explanation?: string;
  matchedIn: string[];
};

function textOf(q: AnyQ): string {
  return (
    (q.question as string | undefined) ??
    (q.template as string | undefined) ??
    (q.prompt as string | undefined) ??
    ""
  );
}

function SearchPage() {
  const [categorySlug, setCategorySlug] = useState<string>("__all__");
  const [topicSlug, setTopicSlug] = useState<string>("__all__");
  const [query, setQuery] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hits, setHits] = useState<Hit[]>([]);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [searched, setSearched] = useState(false);

  const topicsForCategory = useMemo(() => {
    if (categorySlug === "__all__") {
      return categories.flatMap((c) => c.topics.map((t) => ({ ...t, cat: c.title })));
    }
    const cat = categories.find((c) => c.slug === categorySlug);
    return cat ? cat.topics.map((t) => ({ ...t, cat: cat.title })) : [];
  }, [categorySlug]);

  const targetTopics = useMemo(() => {
    if (topicSlug !== "__all__") return [topicSlug];
    return topicsForCategory.map((t) => t.slug);
  }, [topicSlug, topicsForCategory]);

  const toggleOpen = (key: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const run = async () => {
    const q = query.trim();
    if (!q) return;
    setRunning(true);
    setHits([]);
    setProgress(0);
    setSearched(true);
    setOpenIds(new Set());

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$1");
    const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
    const re = new RegExp(pattern, caseSensitive ? "g" : "gi");

    const overrides = await loadOverrides();
    const out: Hit[] = [];
    let done = 0;
    for (const topic of targetTopics) {
      const file = await loadTopicFileForAdmin(topic);
      if (file) {
        const isV2 = (file as { version?: number }).version === 2;
        const rawBank: AnyQ[] = isV2
          ? ((file as { bank: AnyQ[] }).bank ?? [])
          : ((file as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap(
              (t) => t.questions ?? [],
            );
        for (const raw of rawBank) {
          const id = raw.id;
          if (!id) continue;
          const q2 = applyOverrideToQuestionRecord(raw, overrides.get(`${topic}::${id}`));
          const qText = textOf(q2);
          const opts = Array.isArray(q2.options)
            ? (q2.options as unknown[]).map((o) => (typeof o === "string" ? o : String(o)))
            : [];
          const exp = (q2.explanation as string | undefined) ?? "";
          const matchedIn: string[] = [];
          re.lastIndex = 0;
          if (re.test(qText)) matchedIn.push("question");
          opts.forEach((o, i) => {
            re.lastIndex = 0;
            if (re.test(o)) matchedIn.push(`option ${i + 1}`);
          });
          re.lastIndex = 0;
          if (re.test(exp)) matchedIn.push("explanation");
          if (matchedIn.length > 0) {
            out.push({
              topic,
              id,
              question: qText,
              options: opts,
              correct: q2.correctAnswer as Hit["correct"] ?? (q2.correctAnswers as Hit["correct"]),
              explanation: exp,
              matchedIn,
            });
          }
        }
      }
      done += 1;
      setProgress(done);
    }
    setHits(out);
    setRunning(false);
  };

  const highlight = (text: string): React.ReactNode => {
    const q = query.trim();
    if (!q) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$1");
    const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
    const re = new RegExp(`(${pattern})`, caseSensitive ? "g" : "gi");
    const parts = text.split(re);
    return parts.map((p, i) =>
      re.test(p) ? (
        <mark key={i} className="rounded bg-amber-200 px-0.5 text-amber-900">
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      ),
    );
  };

  const isCorrect = (hit: Hit, idx: number): boolean => {
    if (typeof hit.correct === "number") return hit.correct === idx;
    if (Array.isArray(hit.correct)) return hit.correct.includes(idx);
    return false;
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Search Questions</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Find every question containing a word or phrase. Scope it to a category and/or topic, then
        click any result to reveal the answer choices and the correct answer.
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
            <option value="__all__">All topics in this category</option>
            {topicsForCategory.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="block font-semibold">Search text</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim() && !running) void run();
            }}
            placeholder='e.g. "in this" or "national speed limit"'
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4 text-sm sm:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            Case sensitive
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
            />
            Whole word
          </label>
          <button
            type="button"
            onClick={() => void run()}
            disabled={running || !query.trim()}
            className="ml-auto rounded-xl bg-gradient-coral px-4 py-2 text-sm font-semibold text-coral-foreground disabled:opacity-50"
          >
            {running ? `Searching… ${progress}/${targetTopics.length}` : "Search"}
          </button>
        </div>
      </div>

      {searched && !running && (
        <p className="mt-4 text-sm text-muted-foreground">
          {hits.length === 0
            ? "No matches."
            : `${hits.length} match${hits.length === 1 ? "" : "es"} across ${
                new Set(hits.map((h) => h.topic)).size
              } topic(s).`}
        </p>
      )}

      <div className="mt-4 space-y-2">
        {hits.map((h) => {
          const key = `${h.topic}::${h.id}`;
          const open = openIds.has(key);
          return (
            <div key={key} className="rounded-md border border-border bg-card">
              <button
                type="button"
                onClick={() => toggleOpen(key)}
                className="flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-muted/50"
              >
                <Badge variant="secondary" className="shrink-0 font-mono text-[10px]">
                  {h.topic}
                </Badge>
                <span className="flex-1 text-sm">{highlight(h.question)}</span>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {h.matchedIn.join(", ")}
                </span>
                <span className="shrink-0 text-xs text-coral">{open ? "Hide" : "Show"}</span>
              </button>
              {open && (
                <div className="space-y-2 border-t border-border px-3 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{h.id}</span>
                    <Link
                      to="/admin-kb20/questions/$topic"
                      params={{ topic: h.topic }}
                      search={{ q: h.id, from: "search" }}
                      className="ml-auto text-xs font-semibold text-coral hover:underline"
                    >
                      Open in editor →
                    </Link>
                  </div>
                  {h.options.length > 0 && (
                    <ol className="list-decimal space-y-1 pl-5">
                      {h.options.map((opt, i) => (
                        <li
                          key={i}
                          className={
                            isCorrect(h, i)
                              ? "rounded bg-success/10 px-1 font-semibold text-success"
                              : ""
                          }
                        >
                          {highlight(opt)}
                          {isCorrect(h, i) && (
                            <span className="ml-2 text-[10px] uppercase">✓ correct</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                  {typeof h.correct === "boolean" && (
                    <p className="text-xs">
                      Correct answer: <strong>{h.correct ? "True" : "False"}</strong>
                    </p>
                  )}
                  {h.explanation && (
                    <div className="rounded bg-muted/50 p-2 text-xs">
                      <span className="font-semibold">Explanation: </span>
                      {highlight(h.explanation)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
