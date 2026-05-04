import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminGate } from "@/components/AdminGate";
import { QuestionEditDialog } from "@/components/QuestionEditDialog";
import { useOverrides, invalidateOverrides } from "@/lib/overrides";

type RawQuestion = Record<string, unknown> & {
  id?: string;
  type?: string;
  question?: string;
  template?: string;
  prompt?: string;
  explanation?: string;
  image?: string;
  imageAlt?: string;
  options?: string[];
  correctAnswer?: number | boolean;
  correctAnswers?: number[];
  blanks?: { options: string[]; correctIndex: number }[];
  spots?: { id: string; label: string }[];
  correctSpotId?: string;
};

type V2 = {
  version: 2;
  topic: string;
  bank: (RawQuestion & { id: string })[];
  mocks: { mockNumber: number; title: string; questionIds: string[] }[];
};
type V1 = {
  topic: string;
  tests: { mockNumber: number; title: string; questions: RawQuestion[] }[];
};
type AnyFile = V1 | V2;

import { loadTopicFileForAdmin } from "@/data/mocks";

type MockUsage = { mockNumber: number; slot: number };

type FlatQuestion = {
  id: string;
  type: string;
  question: string;
  explanation: string;
  image?: string;
  imageAlt?: string;
  options?: string[];
  correctText?: string;
  usedInMocks: MockUsage[];
  raw: RawQuestion;
};

function normaliseType(t: string | undefined): string {
  if (!t) return "mcq";
  const x = t.replace(/_/g, "-");
  return x === "multiple-choice" ? "mcq" : x;
}

function describeQuestion(r: RawQuestion): string {
  return (r.question || r.template || r.prompt || "").toString();
}

function describeCorrect(r: RawQuestion): string | undefined {
  const t = normaliseType(r.type);
  if (t === "true-false") return r.correctAnswer ? "True" : "False";
  if (t === "multiple-response" && r.options && Array.isArray(r.correctAnswers))
    return r.correctAnswers.map((i) => r.options![i]).join(" • ");
  if (
    (t === "mcq" || t === "image-question") &&
    r.options &&
    typeof r.correctAnswer === "number"
  )
    return r.options[r.correctAnswer];
  if ((t === "fill-blanks" || t === "drag-drop-blanks") && r.blanks)
    return r.blanks.map((b) => b.options[b.correctIndex]).join(" / ");
  if (t === "hot-spot" && r.spots && r.correctSpotId)
    return r.spots.find((s) => s.id === r.correctSpotId)?.label;
  if (t === "numeric-entry" && typeof r.correctAnswer === "number")
    return String(r.correctAnswer);
  return undefined;
}

function flatten(file: AnyFile): FlatQuestion[] {
  if ((file as V2).version === 2 && Array.isArray((file as V2).bank)) {
    const v2 = file as V2;
    const usage = new Map<string, MockUsage[]>();
    for (const m of v2.mocks) {
      m.questionIds.forEach((qid, idx) => {
        const arr = usage.get(qid) ?? [];
        arr.push({ mockNumber: m.mockNumber, slot: idx + 1 });
        usage.set(qid, arr);
      });
    }
    return v2.bank.map((q) => ({
      id: q.id,
      type: normaliseType(q.type),
      question: describeQuestion(q),
      explanation: (q.explanation || "").toString(),
      image: q.image,
      imageAlt: q.imageAlt,
      options: q.options,
      correctText: describeCorrect(q),
      usedInMocks: usage.get(q.id) ?? [],
      raw: q,
    }));
  }
  const v1 = file as V1;
  const out: FlatQuestion[] = [];
  v1.tests.forEach((t) => {
    t.questions.forEach((q, i) => {
      out.push({
        id: q.id ?? `${t.mockNumber}-${i + 1}`,
        type: normaliseType(q.type),
        question: describeQuestion(q),
        explanation: (q.explanation || "").toString(),
        image: q.image,
        imageAlt: q.imageAlt,
        options: q.options,
        correctText: describeCorrect(q),
        usedInMocks: [{ mockNumber: t.mockNumber, slot: i + 1 }],
        raw: q,
      });
    });
  });
  return out;
}

type EditorSearch = { q?: string; from?: "validator" };

export const Route = createFileRoute("/admin-kb20/questions/$topic")({
  validateSearch: (raw: Record<string, unknown>): EditorSearch => ({
    q: typeof raw.q === "string" && raw.q.length > 0 ? raw.q : undefined,
    from: raw.from === "validator" ? "validator" : undefined,
  }),
  loader: async ({ params }) => {
    const file = (await loadTopicFileForAdmin(params.topic)) as AnyFile | undefined;
    if (!file) throw notFound();
    return { topic: params.topic, questions: flatten(file) };
  },
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm">
      Failed to load topic: {error instanceof Error ? error.message : "unknown error"}
    </div>
  ),
  head: ({ params }) => ({
    meta: [
      { title: `Questions — ${params.topic} — UK Test Hub` },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <QuestionsBrowser />
    </AdminGate>
  ),
  notFoundComponent: () => (
    <div className="p-8">
      Topic not found.{" "}
      <Link to="/admin-kb20/questions" className="underline">
        Back
      </Link>
    </div>
  ),
});

const PAGE_SIZE = 25;

function QuestionsBrowser() {
  const { topic, questions } = Route.useLoaderData();
  const { q: initialQ, from } = Route.useSearch();
  const initialSearch = initialQ ?? "";
  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState<string>("all");
  const [imageFilter, setImageFilter] = useState<"all" | "with" | "without">("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<FlatQuestion | null>(null);
  const [bump, setBump] = useState(0);
  const overrides = useOverrides();
  void bump;
  const highlightId = initialSearch;

  // Scroll to and highlight the deep-linked question once.
  useEffect(() => {
    if (!highlightId) return;
    const t = window.setTimeout(() => {
      const el = document.querySelector(`[data-qid="${CSS.escape(highlightId)}"]`);
      if (el && "scrollIntoView" in el) {
        (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 60);
    return () => window.clearTimeout(t);
  }, [highlightId]);

  const types = useMemo(() => {
    const s = new Set<string>();
    (questions as FlatQuestion[]).forEach((q: FlatQuestion) => s.add(q.type));
    return ["all", ...Array.from(s).sort()];
  }, [questions]);

  const filtered = useMemo<FlatQuestion[]>(() => {
    const s = search.trim().toLowerCase();
    return (questions as FlatQuestion[]).filter((q: FlatQuestion) => {
      if (type !== "all" && q.type !== type) return false;
      if (imageFilter === "with" && !q.image) return false;
      if (imageFilter === "without" && q.image) return false;
      if (
        s &&
        !q.question.toLowerCase().includes(s) &&
        !q.explanation.toLowerCase().includes(s) &&
        !q.id.toLowerCase().includes(s)
      )
        return false;
      return true;
    });
  }, [questions, search, type, imageFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const visible = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const stats = useMemo(() => {
    const withImg = (questions as FlatQuestion[]).filter((q: FlatQuestion) => q.image).length;
    const orphan = (questions as FlatQuestion[]).filter((q: FlatQuestion) => q.usedInMocks.length === 0).length;
    return {
      total: questions.length,
      withImg,
      withoutImg: questions.length - withImg,
      orphan,
    };
  }, [questions]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            {from === "validator" ? (
              <Link
                to="/admin-kb20/validator"
                className="inline-flex items-center gap-1 text-xs font-semibold text-coral hover:underline"
              >
                ← Back to validator
              </Link>
            ) : (
              <Link
                to="/admin-kb20/questions"
                className="text-xs text-muted-foreground hover:underline"
              >
                ← All topics
              </Link>
            )}
            <h1 className="font-display text-2xl font-bold">{topic}</h1>
            <p className="text-xs text-muted-foreground">
              {stats.total} questions · {stats.withImg} with images ·{" "}
              {stats.withoutImg} text-only · {stats.orphan} unused in mocks
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search question, explanation or ID…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={imageFilter}
            onChange={(e) => {
              setImageFilter(e.target.value as "all" | "with" | "without");
              setPage(1);
            }}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="all">All</option>
            <option value="with">With image</option>
            <option value="without">Text only</option>
          </select>
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} matching
          </span>
        </div>

        <ol className="mt-4 space-y-3">
          {visible.map((q: FlatQuestion, idx: number) => (
            <li
              key={q.id}
              data-qid={q.id}
              className={`rounded-xl border bg-card p-4 ${q.id === highlightId ? "border-coral ring-2 ring-coral/30" : "border-border"}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-xs text-muted-foreground w-12 shrink-0">
                  #{(pageSafe - 1) * PAGE_SIZE + idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{q.type}</Badge>
                    <code className="text-[10px] text-muted-foreground">
                      {q.id}
                    </code>
                    {overrides?.has(`${topic}::${q.id}`) && (
                      <Badge className="bg-emerald-600 text-white">edited</Badge>
                    )}
                    {q.usedInMocks.length > 0 ? (
                      <span className="flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
                        Live in:
                        {q.usedInMocks.map(({ mockNumber, slot }) => (
                          <a
                            key={`${mockNumber}-${slot}`}
                            href={`/quiz/${topic}-mock-${mockNumber}${slot ? `#q${slot}` : ""}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-coral hover:border-coral hover:bg-coral/5"
                            title={
                              slot
                                ? `Open Mock Test ${mockNumber}, Question ${slot} on the live site (new tab)`
                                : `Open Mock Test ${mockNumber} on the live site (new tab)`
                            }
                          >
                            Mock {mockNumber}{slot ? ` · Q${slot}` : ""}
                          </a>
                        ))}
                      </span>
                    ) : (
                      <Badge variant="secondary">unused — not in any mock</Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-auto h-7"
                      onClick={() => setEditing(q)}
                    >
                      Edit
                    </Button>
                  </div>
                  <p className="mt-2 font-medium">{q.question}</p>
                  {q.options && (
                    <ul className="mt-2 space-y-1 text-sm">
                      {q.options.map((opt: string, i: number) => {
                        const isCorrect =
                          (typeof q.raw.correctAnswer === "number" &&
                            q.raw.correctAnswer === i) ||
                          (Array.isArray(q.raw.correctAnswers) &&
                            q.raw.correctAnswers.includes(i));
                        return (
                          <li
                            key={i}
                            className={
                              isCorrect
                                ? "text-emerald-700 dark:text-emerald-400 font-medium"
                                : "text-muted-foreground"
                            }
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                            {isCorrect && " ✓"}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {!q.options && q.correctText && (
                    <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
                      Answer: {q.correctText}
                    </p>
                  )}
                  {q.explanation && (
                    <details className="mt-2 text-sm text-muted-foreground">
                      <summary className="cursor-pointer">Explanation</summary>
                      <p className="mt-1">{q.explanation}</p>
                    </details>
                  )}
                </div>
                {q.image && (
                  <img
                    src={q.image}
                    alt={q.imageAlt ?? ""}
                    className="h-48 w-48 shrink-0 rounded-md border border-border object-contain bg-white p-2"
                    loading="lazy"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.outline = "2px solid red";
                      el.title = `Missing: ${q.image}`;
                    }}
                  />
                )}
              </div>
            </li>
          ))}
        </ol>

        {filtered.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            No questions match the filters.
          </p>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pageSafe <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pageSafe} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pageSafe >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </main>
      {editing && (
        <QuestionEditDialog
          topic={topic}
          questionId={editing.id}
          defaults={{
            question: editing.question,
            options: editing.options,
            correctAnswer: editing.raw.correctAnswer as number | undefined,
            explanation: editing.explanation,
            image: editing.image,
            imageAlt: editing.imageAlt,
          }}
          onClose={() => setEditing(null)}
          onSaved={() => {
            invalidateOverrides();
            setBump((n) => n + 1);
          }}
        />
      )}
      <SiteFooter />
    </div>
  );
}
