import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminGate } from "@/components/AdminGate";
import { QuestionEditDialog } from "@/components/QuestionEditDialog";
import { applyOverrideToQuestionRecord, useOverrides, invalidateOverrides } from "@/lib/overrides";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

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

type MockUsage = { mockNumber: number; slot: number; sourceQid?: string };

function fingerprintQuestion(r: RawQuestion): string {
  const norm = (s: unknown) =>
    (s == null ? "" : String(s)).replace(/\s+/g, " ").trim().toLowerCase();
  const q = norm(r.question || r.template || r.prompt);
  const opts = Array.isArray(r.options) ? r.options.map(norm).join("|") : "";
  const ca = Array.isArray(r.correctAnswers)
    ? r.correctAnswers.slice().sort().join(",")
    : r.correctAnswer != null
      ? String(r.correctAnswer)
      : "";
  const img = norm(r.image);
  return `${q}::${opts}::${ca}::${img}`;
}

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

function hasBrokenAnswers(r: RawQuestion): boolean {
  const t = normaliseType(r.type);
  if (t === "mcq" || t === "image-question") {
    if (!Array.isArray(r.options) || r.options.length < 2) return true;
    if (typeof r.correctAnswer !== "number" || r.correctAnswer < 0 || r.correctAnswer >= r.options.length) return true;
    return false;
  }
  if (t === "true-false") return typeof r.correctAnswer !== "boolean";
  if (t === "multiple-response") {
    if (!Array.isArray(r.options) || r.options.length < 2) return true;
    if (!Array.isArray(r.correctAnswers) || r.correctAnswers.length === 0) return true;
    return false;
  }
  return false;
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

type EditorSearch = { q?: string; from?: "validator" | "reports"; edit?: string };

export const Route = createFileRoute("/admin-kb20/questions/$topic")({
  validateSearch: (raw: Record<string, unknown>): EditorSearch => ({
    q: typeof raw.q === "string" && raw.q.length > 0 ? raw.q : undefined,
    from: raw.from === "validator" ? "validator" : raw.from === "reports" ? "reports" : undefined,
    edit: typeof raw.edit === "string" && raw.edit.length > 0 ? raw.edit : undefined,
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
  const { q: initialQ, from, edit: editId } = Route.useSearch();
  const { user } = useAuth();
  const initialSearch = initialQ ?? "";
  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState<string>("all");
  const [imageFilter, setImageFilter] = useState<"all" | "with" | "without">("all");
  const [usageFilter, setUsageFilter] = useState<"all" | "used" | "unused">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [healthFilter, setHealthFilter] = useState<"all" | "broken">("all");
  const [mockFilter, setMockFilter] = useState<string>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<FlatQuestion | null>(null);
  const scrollRestoreRef = useRef<number | null>(null);
  const [bump, setBump] = useState(0);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overrides = useOverrides();
  void bump;
  const highlightId = initialSearch;
  const effectiveQuestions = useMemo<FlatQuestion[]>(() => {
    const base = (questions as FlatQuestion[]).map((q) => {
      const override = overrides?.get(`${topic}::${q.id}`);
      if (!override) return q;
      const raw = applyOverrideToQuestionRecord(q.raw, override);
      return {
        ...q,
        raw,
        question: describeQuestion(raw),
        explanation: (raw.explanation || "").toString(),
        image: raw.image,
        imageAlt: raw.imageAlt,
        options: raw.options,
        correctText: describeCorrect(raw),
      };
    });
    // Group slots across the topic by content fingerprint so duplicated
    // questions (same content, different ids via bulk-duplicate) all show
    // the full set of mocks they appear in.
    const groups = new Map<string, MockUsage[]>();
    for (const q of base) {
      const fp = fingerprintQuestion(q.raw);
      const arr = groups.get(fp) ?? [];
      for (const u of q.usedInMocks) {
        arr.push({ mockNumber: u.mockNumber, slot: u.slot, sourceQid: q.id });
      }
      groups.set(fp, arr);
    }
    return base.map((q) => {
      const fp = fingerprintQuestion(q.raw);
      const merged = groups.get(fp) ?? q.usedInMocks;
      const seen = new Set<string>();
      const dedup: MockUsage[] = [];
      for (const u of merged) {
        const k = `${u.mockNumber}:${u.slot}`;
        if (seen.has(k)) continue;
        seen.add(k);
        dedup.push(u);
      }
      dedup.sort((a, b) => a.mockNumber - b.mockNumber || a.slot - b.slot);
      return { ...q, usedInMocks: dedup };
    });
  }, [overrides, questions, topic]);

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

  // Auto-open the edit dialog when ?edit=<questionId> is present (e.g. from Reports).
  useEffect(() => {
    if (!editId) return;
    const target = effectiveQuestions.find((q) => q.id === editId);
    if (target) setEditing(target);
  }, [editId, effectiveQuestions]);

  const types = useMemo(() => {
    const s = new Set<string>();
    effectiveQuestions.forEach((q: FlatQuestion) => s.add(q.type));
    return ["all", ...Array.from(s).sort()];
  }, [effectiveQuestions]);

  const filtered = useMemo<FlatQuestion[]>(() => {
    const s = search.trim().toLowerCase();
    return effectiveQuestions.filter((q: FlatQuestion) => {
      if (type !== "all" && q.type !== type) return false;
      if (imageFilter === "with" && !q.image) return false;
      if (imageFilter === "without" && q.image) return false;
      if (usageFilter === "used" && q.usedInMocks.length === 0) return false;
      if (usageFilter === "unused" && q.usedInMocks.length > 0) return false;
      const isDisabled = !!overrides?.get(`${topic}::${q.id}`)?.disabled;
      if (statusFilter === "enabled" && isDisabled) return false;
      if (statusFilter === "disabled" && !isDisabled) return false;
      if (healthFilter === "broken" && !hasBrokenAnswers(q.raw)) return false;
      if (
        s &&
        !q.question.toLowerCase().includes(s) &&
        !q.explanation.toLowerCase().includes(s) &&
        !q.id.toLowerCase().includes(s)
      )
        return false;
      return true;
    });
  }, [effectiveQuestions, search, type, imageFilter, usageFilter, statusFilter, healthFilter, overrides, topic]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const visible = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const stats = useMemo(() => {
    const withImg = effectiveQuestions.filter((q: FlatQuestion) => q.image).length;
    const orphan = effectiveQuestions.filter((q: FlatQuestion) => q.usedInMocks.length === 0).length;
    return {
      total: effectiveQuestions.length,
      withImg,
      withoutImg: effectiveQuestions.length - withImg,
      orphan,
    };
  }, [effectiveQuestions]);

  const exportData = (format: "json" | "csv") => {
    const rows = filtered.map((q) => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options ?? [],
      correctAnswer: q.raw.correctAnswer ?? null,
      correctAnswers: q.raw.correctAnswers ?? null,
      explanation: q.explanation,
      image: q.image ?? "",
      imageAlt: q.imageAlt ?? "",
    }));
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === "json") {
      const blob = new Blob([JSON.stringify({ topic, exportedAt: new Date().toISOString(), count: rows.length, questions: rows }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${topic}-questions-${stamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const esc = (v: unknown) => {
        const s = v == null ? "" : typeof v === "string" ? v : JSON.stringify(v);
        return `"${s.replace(/"/g, '""')}"`;
      };
      const headers = ["id", "type", "question", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "correctAnswers", "explanation", "image", "imageAlt"];
      const lines = [headers.join(",")];
      for (const r of rows) {
        const opts = r.options;
        lines.push([
          esc(r.id), esc(r.type), esc(r.question),
          esc(opts[0] ?? ""), esc(opts[1] ?? ""), esc(opts[2] ?? ""), esc(opts[3] ?? ""),
          esc(r.correctAnswer), esc(r.correctAnswers),
          esc(r.explanation), esc(r.image), esc(r.imageAlt),
        ].join(","));
      }
      const blob = new Blob([lines.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${topic}-questions-${stamp}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Minimal CSV parser (handles quoted fields with embedded quotes & commas)
  const parseCsv = (text: string): string[][] => {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let inQ = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQ) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQ = false;
        } else field += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === ",") { row.push(field); field = ""; }
        else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
        else if (c === "\r") { /* skip */ }
        else field += c;
      }
    }
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    return rows.filter((r) => r.length > 1 || (r[0] ?? "").length > 0);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      type ImportRow = { id: string; question?: string; options?: string[]; correctAnswer?: number | boolean | null; correctAnswers?: number[] | null; explanation?: string; image?: string; imageAlt?: string };
      let parsed: ImportRow[] = [];
      if (file.name.toLowerCase().endsWith(".json")) {
        const json = JSON.parse(text);
        const arr = Array.isArray(json) ? json : (json.questions ?? json.bank ?? []);
        parsed = arr.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          question: r.question as string | undefined,
          options: Array.isArray(r.options) ? (r.options as string[]) : undefined,
          correctAnswer: (r.correctAnswer as number | boolean | null | undefined) ?? null,
          correctAnswers: (r.correctAnswers as number[] | null | undefined) ?? null,
          explanation: r.explanation as string | undefined,
          image: r.image as string | undefined,
          imageAlt: r.imageAlt as string | undefined,
        }));
      } else {
        const rows = parseCsv(text);
        if (rows.length < 2) throw new Error("CSV is empty");
        const header = rows[0].map((h) => h.trim());
        const idx = (name: string) => header.indexOf(name);
        const iId = idx("id"), iQ = idx("question"),
              iA = idx("optionA"), iB = idx("optionB"), iC = idx("optionC"), iD = idx("optionD"),
              iCA = idx("correctAnswer"), iCAs = idx("correctAnswers"),
              iE = idx("explanation"), iImg = idx("image"), iAlt = idx("imageAlt");
        if (iId < 0) throw new Error("CSV missing 'id' column");
        for (let r = 1; r < rows.length; r++) {
          const row = rows[r];
          if (!row[iId]) continue;
          const opts = [iA, iB, iC, iD].map((j) => (j >= 0 ? row[j] : "")).filter((v, i, a) => i < a.length);
          const hasOpts = opts.some((o) => o && o.length > 0);
          const ca = iCA >= 0 ? row[iCA] : "";
          const cas = iCAs >= 0 ? row[iCAs] : "";
          let correctAnswer: number | boolean | null = null;
          let correctAnswers: number[] | null = null;
          if (ca && ca !== "null") {
            const n = Number(ca);
            if (!Number.isNaN(n)) correctAnswer = n;
            else if (ca === "true") correctAnswer = true;
            else if (ca === "false") correctAnswer = false;
          }
          if (cas && cas !== "null" && cas !== "[]") {
            try { correctAnswers = JSON.parse(cas); } catch { /* ignore */ }
          }
          parsed.push({
            id: row[iId],
            question: iQ >= 0 ? row[iQ] : undefined,
            options: hasOpts ? opts : undefined,
            correctAnswer,
            correctAnswers,
            explanation: iE >= 0 ? row[iE] : undefined,
            image: iImg >= 0 ? row[iImg] : undefined,
            imageAlt: iAlt >= 0 ? row[iAlt] : undefined,
          });
        }
      }
      if (parsed.length === 0) throw new Error("No rows found");

      // Build a set of valid IDs in this topic to skip strangers
      const validIds = new Set(effectiveQuestions.map((q) => q.id));
      const usable = parsed.filter((r) => validIds.has(r.id));
      const skipped = parsed.length - usable.length;

      const upsertRows = usable.map((r) => ({
        topic,
        question_id: r.id,
        question: r.question ?? null,
        options: (r.options ?? null) as unknown as import("@/integrations/supabase/types").Json,
        correct_answer: (r.correctAnswers && r.correctAnswers.length > 0
          ? r.correctAnswers
          : r.correctAnswer) as unknown as import("@/integrations/supabase/types").Json,
        explanation: r.explanation ?? null,
        image: r.image && r.image.length > 0 ? r.image : null,
        image_alt: r.imageAlt && r.imageAlt.length > 0 ? r.imageAlt : null,
        updated_by: user?.id ?? null,
      }));

      let written = 0;
      for (let i = 0; i < upsertRows.length; i += 100) {
        const batch = upsertRows.slice(i, i + 100);
        const { error } = await supabase
          .from("question_overrides")
          .upsert(batch, { onConflict: "topic,question_id" });
        if (error) throw error;
        written += batch.length;
      }
      invalidateOverrides();
      setBump((n) => n + 1);
      setImportMsg(`Imported ${written} question${written === 1 ? "" : "s"}.${skipped > 0 ? ` Skipped ${skipped} unknown ID${skipped === 1 ? "" : "s"}.` : ""}`);
    } catch (err) {
      setImportMsg(`Import failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleDisabled = async (q: FlatQuestion) => {
    setTogglingId(q.id);
    try {
      const existing = overrides?.get(`${topic}::${q.id}`);
      const nextDisabled = !(existing?.disabled);
      const { error } = await supabase
        .from("question_overrides")
        .upsert(
          {
            topic,
            question_id: q.id,
            disabled: nextDisabled,
            updated_by: user?.id ?? null,
          },
          { onConflict: "topic,question_id" },
        );
      if (error) throw error;
      invalidateOverrides();
      setBump((n) => n + 1);
    } catch (err) {
      setImportMsg(`Toggle failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setTogglingId(null);
    }
  };

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
          <select
            value={usageFilter}
            onChange={(e) => {
              setUsageFilter(e.target.value as "all" | "used" | "unused");
              setPage(1);
            }}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="all">All usage</option>
            <option value="used">Used in mocks</option>
            <option value="unused">Unused in mocks</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "all" | "enabled" | "disabled");
              setPage(1);
            }}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="all">All status</option>
            <option value="enabled">Enabled only</option>
            <option value="disabled">Disabled only</option>
          </select>
          <select
            value={healthFilter}
            onChange={(e) => {
              setHealthFilter(e.target.value as "all" | "broken");
              setPage(1);
            }}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            title="Show only questions that are missing answer options"
          >
            <option value="all">All health</option>
            <option value="broken">Needs answers</option>
          </select>
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} matching
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 p-3">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Bulk export / import</span>
          <Button size="sm" variant="outline" onClick={() => exportData("csv")} disabled={filtered.length === 0}>
            Export CSV ({filtered.length})
          </Button>
          <Button size="sm" variant="outline" onClick={() => exportData("json")} disabled={filtered.length === 0}>
            Export JSON ({filtered.length})
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json,application/json,text/csv"
            className="hidden"
            onChange={handleImportFile}
          />
          <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={importing}>
            {importing ? "Importing…" : "Import CSV / JSON"}
          </Button>
          <span className="text-xs text-muted-foreground">
            Edit the exported file and re-upload — matching IDs are saved as overrides.
          </span>
          {importMsg && (
            <span className="basis-full text-xs font-medium">{importMsg}</span>
          )}
        </div>

        <ol className="mt-4 space-y-3">
          {visible.map((q: FlatQuestion, idx: number) => {
            const ov = overrides?.get(`${topic}::${q.id}`);
            const isDisabled = !!ov?.disabled;
            const isToggling = togglingId === q.id;
            return (
            <li
              key={q.id}
              data-qid={q.id}
              className={`rounded-xl border bg-card p-4 ${q.id === highlightId ? "border-coral ring-2 ring-coral/30" : "border-border"} ${isDisabled ? "opacity-60" : ""}`}
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
                    {ov && !ov.disabled && (
                      <Badge className="bg-emerald-600 text-white">edited</Badge>
                    )}
                    {isDisabled && (
                      <Badge className="bg-destructive text-destructive-foreground">disabled</Badge>
                    )}
                    {hasBrokenAnswers(q.raw) && (
                      <Badge className="bg-amber-500 text-white" title="This question is missing valid answer options">
                        no answers
                      </Badge>
                    )}
                    {q.usedInMocks.length > 0 ? (
                      <span className="flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
                        Live in ({q.usedInMocks.length}):
                        {q.usedInMocks.map(({ mockNumber, slot, sourceQid }) => {
                          const isDup = sourceQid && sourceQid !== q.id;
                          return (
                          <a
                            key={`${mockNumber}-${slot}-${sourceQid ?? q.id}`}
                            href={`/quiz/${topic}-mock-${mockNumber}${slot ? `#q${slot}` : ""}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`rounded border px-1.5 py-0.5 font-mono text-[10px] hover:border-coral hover:bg-coral/5 ${isDup ? "border-dashed border-coral/40 bg-coral/5 text-coral" : "border-border bg-background text-coral"}`}
                            title={
                              isDup
                                ? `Mock ${mockNumber} · Q${slot} — duplicate content (id: ${sourceQid})`
                                : slot
                                ? `Open Mock Test ${mockNumber}, Question ${slot} on the live site (new tab)`
                                : `Open Mock Test ${mockNumber} on the live site (new tab)`
                            }
                          >
                            Mock {mockNumber}{slot ? ` · Q${slot}` : ""}{isDup ? "*" : ""}
                          </a>
                          );
                        })}
                      </span>
                    ) : (
                      <Badge variant="secondary">unused — not in any mock</Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-auto h-7"
                      onClick={() => {
                        scrollRestoreRef.current = window.scrollY;
                        setEditing(q);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant={isDisabled ? "default" : "outline"}
                      className="h-7"
                      disabled={isToggling}
                      onClick={() => toggleDisabled(q)}
                      title={isDisabled ? "Re-enable this question (will appear in mocks again)" : "Disable this question (hidden from live mocks)"}
                    >
                      {isToggling ? "…" : isDisabled ? "Enable" : "Disable"}
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
            );
          })}
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
      {editing && (() => {
        const first = editing.usedInMocks[0];
        const liveLink = first
          ? `https://www.uktesthub.com/quiz/${topic}-mock-${first.mockNumber}#q${first.slot}`
          : undefined;
        return (
          <QuestionEditDialog
            topic={topic}
            questionId={editing.id}
            defaults={{
              type: editing.type,
              question: editing.question,
              options: editing.options,
              correctAnswer: editing.raw.correctAnswer as number | boolean | undefined,
              correctAnswers: editing.raw.correctAnswers,
              explanation: editing.explanation,
              image: editing.image,
              imageAlt: editing.imageAlt,
            }}
            liveLink={liveLink}
            onClose={() => {
              const editedId = editing.id;
              setEditing(null);
              requestAnimationFrame(() => {
                const el = document.querySelector(`[data-qid="${CSS.escape(editedId)}"]`);
                if (el && "scrollIntoView" in el) {
                  (el as HTMLElement).scrollIntoView({ behavior: "auto", block: "center" });
                } else if (scrollRestoreRef.current != null) {
                  window.scrollTo({ top: scrollRestoreRef.current, behavior: "auto" });
                }
                scrollRestoreRef.current = null;
              });
            }}
            onSaved={() => {
              invalidateOverrides();
              setBump((n) => n + 1);
            }}
          />
        );
      })()}
      <SiteFooter />
    </div>
  );
}
