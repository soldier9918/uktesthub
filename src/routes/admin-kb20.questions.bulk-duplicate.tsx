import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ImagePicker } from "@/components/ImagePicker";
import { categories } from "@/data/categories";
import { loadTopicFileForAdmin } from "@/data/mocks";
import { supabase } from "@/integrations/supabase/client";
import {
  applyOverrideToQuestionRecord,
  invalidateOverrides,
  loadOverrides,
  type QuestionOverride,
} from "@/lib/overrides";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin-kb20/questions/bulk-duplicate")({
  head: () => ({
    meta: [
      { title: "Bulk duplicate questions — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <BulkDuplicatePage />
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

type FlatItem = {
  topic: string;
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  image?: string;
  imageAlt?: string;
  mocks: number[];
  hasOverride: boolean;
};

const ALL_TOPICS = categories.flatMap((c) =>
  c.topics.map((t) => ({ slug: t.slug, title: `${c.title} — ${t.title}` })),
);

function flatten(file: AnyFile, overrides: Map<string, QuestionOverride>): FlatItem[] {
  const usage = new Map<string, number[]>();
  let bankWithIds: (RawQ & { id: string })[] = [];

  if ((file as V2).version === 2 && Array.isArray((file as V2).bank)) {
    const v2 = file as V2;
    bankWithIds = v2.bank;
    for (const m of v2.mocks) {
      for (const qid of m.questionIds) {
        const arr = usage.get(qid) ?? [];
        arr.push(m.mockNumber);
        usage.set(qid, arr);
      }
    }
  } else {
    const v1 = file as V1;
    v1.tests.forEach((t) => {
      t.questions.forEach((q, i) => {
        const id = q.id ?? `${file.topic}-mock-${t.mockNumber}-q${i + 1}`;
        bankWithIds.push({ ...q, id });
        const arr = usage.get(id) ?? [];
        arr.push(t.mockNumber);
        usage.set(id, arr);
      });
    });
  }

  return bankWithIds.map((raw) => {
    const o = overrides.get(`${file.topic}::${raw.id}`);
    const merged = applyOverrideToQuestionRecord(raw, o) as RawQ & { id: string };
    return {
      topic: file.topic,
      id: raw.id,
      question: (merged.question || merged.template || merged.prompt || "") as string,
      options: merged.options,
      correctAnswer:
        typeof merged.correctAnswer === "number" ? merged.correctAnswer : undefined,
      explanation: merged.explanation,
      image: merged.image,
      imageAlt: merged.imageAlt,
      mocks: usage.get(raw.id) ?? [],
      hasOverride: !!o,
    };
  });
}

type Template = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  image: string;
  imageAlt: string;
};

const EMPTY_TEMPLATE: Template = {
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
  image: "",
  imageAlt: "",
};

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function BulkDuplicatePage() {
  const { user } = useAuth();
  const [topic, setTopic] = useState<string>(ALL_TOPICS[0]?.slug ?? "");
  const [items, setItems] = useState<FlatItem[]>([]);
  const [loadingTopic, setLoadingTopic] = useState(false);
  const [search, setSearch] = useState("");
  const [mockFilter, setMockFilter] = useState<string>("all");

  // Source: either a question id from any topic, or a custom one.
  const [mode, setMode] = useState<"source" | "custom">("source");
  const [sourceTopic, setSourceTopic] = useState<string>(ALL_TOPICS[0]?.slug ?? "");
  const [sourceId, setSourceId] = useState("");
  const [template, setTemplate] = useState<Template>(EMPTY_TEMPLATE);
  const [sourceLoaded, setSourceLoaded] = useState(false);
  const [sourceErr, setSourceErr] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Selected targets: keyed by `${topic}::${id}` -> meta.
  const [selected, setSelected] = useState<Map<string, { topic: string; id: string; preview: string }>>(
    new Map(),
  );

  const [confirming, setConfirming] = useState(false);
  const [applying, setApplying] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const loadTopic = async (slug: string) => {
    setTopic(slug);
    setItems([]);
    setLoadingTopic(true);
    setErr(null);
    try {
      const file = (await loadTopicFileForAdmin(slug)) as AnyFile | undefined;
      if (!file) {
        setErr("Could not load topic file.");
        return;
      }
      const overrides = await loadOverrides();
      setItems(flatten(file, overrides));
    } finally {
      setLoadingTopic(false);
    }
  };

  useEffect(() => {
    if (topic) void loadTopic(topic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSource = async () => {
    setSourceErr(null);
    setSourceLoaded(false);
    if (!sourceId.trim()) {
      setSourceErr("Enter a question id.");
      return;
    }
    const file = (await loadTopicFileForAdmin(sourceTopic)) as AnyFile | undefined;
    if (!file) {
      setSourceErr("Could not load source topic.");
      return;
    }
    const overrides = await loadOverrides();
    const flat = flatten(file, overrides);
    const found = flat.find((q) => q.id === sourceId.trim());
    if (!found) {
      setSourceErr(`Question id "${sourceId}" not found in ${sourceTopic}.`);
      return;
    }
    setTemplate({
      question: found.question,
      options: found.options && found.options.length ? [...found.options] : ["", "", "", ""],
      correctAnswer: found.correctAnswer ?? 0,
      explanation: found.explanation ?? "",
      image: found.image ?? "",
      imageAlt: found.imageAlt ?? "",
    });
    setSourceLoaded(true);
  };

  const uploadImage = async (file: File) => {
    setErr(null);
    const ext = file.name.split(".").pop() || "png";
    const path = `bulk/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("question-images")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      setErr(error.message);
      return;
    }
    const { data } = supabase.storage.from("question-images").getPublicUrl(path);
    setTemplate((t) => ({ ...t, image: data.publicUrl }));
  };

  const mockNumbers = useMemo(() => {
    const s = new Set<number>();
    items.forEach((i) => i.mocks.forEach((n) => s.add(n)));
    return Array.from(s).sort((a, b) => a - b);
  }, [items]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return items.filter((it) => {
      if (mockFilter !== "all" && !it.mocks.includes(parseInt(mockFilter, 10))) return false;
      if (
        s &&
        !it.id.toLowerCase().includes(s) &&
        !it.question.toLowerCase().includes(s)
      )
        return false;
      return true;
    });
  }, [items, search, mockFilter]);

  const toggleOne = (it: FlatItem, on: boolean) => {
    setSelected((prev) => {
      const next = new Map(prev);
      const key = `${it.topic}::${it.id}`;
      if (on) next.set(key, { topic: it.topic, id: it.id, preview: it.question });
      else next.delete(key);
      return next;
    });
  };

  const selectAllVisible = () => {
    setSelected((prev) => {
      const next = new Map(prev);
      for (const it of filtered) {
        next.set(`${it.topic}::${it.id}`, { topic: it.topic, id: it.id, preview: it.question });
      }
      return next;
    });
  };

  const clearVisible = () => {
    setSelected((prev) => {
      const next = new Map(prev);
      for (const it of filtered) next.delete(`${it.topic}::${it.id}`);
      return next;
    });
  };

  const clearAll = () => setSelected(new Map());

  const sourceKey = mode === "source" && sourceLoaded ? `${sourceTopic}::${sourceId.trim()}` : null;
  const targetEntries = Array.from(selected.values()).filter(
    (s) => `${s.topic}::${s.id}` !== sourceKey,
  );

  const canApply =
    targetEntries.length > 0 &&
    template.question.trim().length > 0 &&
    (mode === "custom" || sourceLoaded);

  const apply = async () => {
    setApplying(true);
    setErr(null);
    setResultMsg(null);
    try {
      const cleanOptions = template.options.map((o) => o.trim()).filter(Boolean);
      const rows = targetEntries.map((t) => ({
        topic: t.topic,
        question_id: t.id,
        question: template.question,
        options: cleanOptions.length ? cleanOptions : null,
        correct_answer: cleanOptions.length ? template.correctAnswer : null,
        explanation: template.explanation || null,
        image: template.image || null,
        image_alt: template.imageAlt || null,
        updated_by: user?.id ?? null,
      }));

      for (const batch of chunk(rows, 100)) {
        const { error } = await supabase
          .from("question_overrides")
          .upsert(batch, { onConflict: "topic,question_id" });
        if (error) throw error;
      }

      // Audit log (best effort).
      try {
        const topicsTouched = Array.from(new Set(targetEntries.map((t) => t.topic)));
        await supabase.from("admin_audit_log").insert({
          action: "bulk_duplicate_questions",
          actor_user_id: user?.id ?? null,
          actor_email: user?.email ?? null,
          target: topicsTouched.join(","),
          detail: {
            count: targetEntries.length,
            topics: topicsTouched,
            source: mode === "source" ? sourceKey : "custom",
          },
        });
      } catch {
        // ignore audit failure
      }

      invalidateOverrides();
      setResultMsg(`Applied identical content to ${targetEntries.length} question${targetEntries.length === 1 ? "" : "s"}.`);
      setSelected(new Map());
      setConfirming(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to apply overrides.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Bulk duplicate questions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Apply one question + answers + image to many existing question slots so the same
            question appears across multiple mocks.
          </p>
        </div>
        <Link to="/admin-kb20/questions" className="text-sm underline">
          ← Back to Questions
        </Link>
      </div>

      {/* STEP 1: source */}
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold">1. Choose the content to duplicate</h2>
        <div className="mt-3 flex gap-2 text-sm">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={mode === "source"}
              onChange={() => setMode("source")}
            />
            Copy from existing question
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={mode === "custom"}
              onChange={() => {
                setMode("custom");
                setSourceLoaded(false);
              }}
            />
            Write custom question
          </label>
        </div>

        {mode === "source" && (
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <select
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              value={sourceTopic}
              onChange={(e) => setSourceTopic(e.target.value)}
            >
              {ALL_TOPICS.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.title}
                </option>
              ))}
            </select>
            <Input
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              placeholder="Question id (e.g. rs-im-0062)"
            />
            <Button onClick={loadSource} variant="outline">
              Load source
            </Button>
            {sourceErr && (
              <p className="sm:col-span-3 text-sm text-destructive">{sourceErr}</p>
            )}
          </div>
        )}

        <div className="mt-4 space-y-3 rounded-lg border border-border/60 bg-muted/30 p-3">
          <label className="block text-sm font-medium">Question text</label>
          <Textarea
            rows={3}
            value={template.question}
            onChange={(e) => setTemplate({ ...template, question: e.target.value })}
            placeholder="The question that will appear in every selected slot…"
          />

          <div>
            <label className="block text-sm font-medium">Options (pick the correct one)</label>
            <div className="mt-1 space-y-2">
              {template.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={template.correctAnswer === i}
                    onChange={() => setTemplate({ ...template, correctAnswer: i })}
                  />
                  <span className="w-6 text-sm">{String.fromCharCode(65 + i)}.</span>
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const next = [...template.options];
                      next[i] = e.target.value;
                      setTemplate({ ...template, options: next });
                    }}
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Leave all options blank to write a non-MCQ override (text only).
              </p>
            </div>
          </div>

          <label className="block text-sm font-medium">Explanation</label>
          <Textarea
            rows={2}
            value={template.explanation}
            onChange={(e) => setTemplate({ ...template, explanation: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium">Image</label>
            <div className="mt-1 flex items-start gap-3">
              {template.image && (
                <img
                  src={template.image}
                  alt=""
                  className="h-24 w-24 rounded-md border border-border bg-white object-contain p-1"
                />
              )}
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={template.image}
                    onChange={(e) => setTemplate({ ...template, image: e.target.value })}
                    placeholder="Image URL or browse/upload"
                  />
                  <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
                    Browse
                  </Button>
                </div>
                <Input
                  value={template.imageAlt}
                  onChange={(e) => setTemplate({ ...template, imageAlt: e.target.value })}
                  placeholder="Image alt text"
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="text-xs"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void uploadImage(f);
                  }}
                />
                {template.image && (
                  <button
                    type="button"
                    onClick={() => setTemplate({ ...template, image: "" })}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2: targets */}
      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">2. Pick the questions to overwrite</h2>
          <div className="text-sm">
            <span className="font-semibold">{selected.size}</span>{" "}
            <span className="text-muted-foreground">selected</span>
            {selected.size > 0 && (
              <button onClick={clearAll} className="ml-3 text-xs underline">
                clear all
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_1fr]">
          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={topic}
            onChange={(e) => loadTopic(e.target.value)}
          >
            {ALL_TOPICS.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
          <Input
            placeholder="Search id or question text…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={mockFilter}
            onChange={(e) => setMockFilter(e.target.value)}
          >
            <option value="all">All mocks</option>
            {mockNumbers.map((n) => (
              <option key={n} value={String(n)}>
                Mock {n}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="outline" onClick={selectAllVisible}>
            Select all visible ({filtered.length})
          </Button>
          <Button size="sm" variant="ghost" onClick={clearVisible}>
            Deselect visible
          </Button>
        </div>

        <div className="mt-3 max-h-[420px] overflow-auto rounded-md border border-border">
          {loadingTopic ? (
            <p className="p-4 text-sm text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No matching questions.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="w-8 px-2 py-2"></th>
                  <th className="px-2 py-2 text-left">ID</th>
                  <th className="px-2 py-2 text-left">Question</th>
                  <th className="px-2 py-2 text-left">Mocks</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => {
                  const key = `${it.topic}::${it.id}`;
                  const isSel = selected.has(key);
                  const isSource = key === sourceKey;
                  return (
                    <tr key={key} className="border-t border-border/60 align-top">
                      <td className="px-2 py-2">
                        <Checkbox
                          checked={isSel}
                          disabled={isSource}
                          onCheckedChange={(v) => toggleOne(it, !!v)}
                        />
                      </td>
                      <td className="px-2 py-2 font-mono text-xs">
                        {it.id}
                        {it.hasOverride && (
                          <Badge variant="outline" className="ml-1 text-[10px]">
                            edited
                          </Badge>
                        )}
                        {isSource && (
                          <Badge variant="outline" className="ml-1 text-[10px]">
                            source
                          </Badge>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        <div className="line-clamp-2">{it.question}</div>
                      </td>
                      <td className="px-2 py-2 text-xs text-muted-foreground">
                        {it.mocks.length ? it.mocks.join(", ") : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* STEP 3: apply */}
      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold">3. Apply</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {targetEntries.length === 0
            ? "Select at least one target question above."
            : `Will overwrite ${targetEntries.length} question${targetEntries.length === 1 ? "" : "s"} with the content above.`}
        </p>
        {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
        {resultMsg && (
          <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {resultMsg}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <Button onClick={() => setConfirming(true)} disabled={!canApply || applying}>
            Apply to {targetEntries.length} question{targetEntries.length === 1 ? "" : "s"}
          </Button>
        </div>
      </section>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
            <h3 className="font-display text-lg font-semibold">Confirm bulk overwrite</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You are about to write the same question, options, image and explanation to{" "}
              <strong>{targetEntries.length}</strong> question slot
              {targetEntries.length === 1 ? "" : "s"}. Each slot keeps its own ID and stays in
              its current mock(s). You can reset any one of them later from the per-question
              edit dialog.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirming(false)}
                disabled={applying}
              >
                Cancel
              </Button>
              <Button onClick={apply} disabled={applying}>
                {applying ? "Applying…" : "Yes, apply"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {pickerOpen && (
        <ImagePicker
          selected={template.image}
          onSelect={(p) => setTemplate({ ...template, image: p })}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </main>
  );
}
