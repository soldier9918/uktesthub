import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  previewCsvImport,
  commitCsvImport,
  rollbackImport,
  listImportHistory,
  testGithubConnection,
  runImportSelfTest,
  verifyLiveJson,
} from "@/lib/admin/csv-import.functions";

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

import { invalidateTopicFileCache, loadTopicFileForAdmin } from "@/data/mocks";

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

function describeQuestion(r: RawQuestion, _topic?: string): string {
  // Always show the real stored question text so admin matches the CSV.
  // The live quiz applies its own prompt override (see src/lib/overrides.ts).
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

function matchesOptionLabel(ans: unknown, options: unknown): boolean {
  if (typeof ans !== "string" || !ans.trim() || !Array.isArray(options)) return false;
  const a = ans.trim().toLowerCase();
  return options.some((o) => typeof o === "string" && o.trim().toLowerCase() === a);
}

function hasBrokenAnswers(r: RawQuestion): boolean {
  const t = normaliseType(r.type);
  if (t === "mcq" || t === "image-question") {
    if (!Array.isArray(r.options) || r.options.length < 2) return true;
    if (typeof r.correctAnswer === "number" && r.correctAnswer >= 0 && r.correctAnswer < r.options.length) return false;
    if (matchesOptionLabel(r.correctAnswer, r.options)) return false;
    return true;
  }
  if (t === "true-false") {
    const ca: unknown = r.correctAnswer;
    if (typeof ca === "boolean") return false;
    if (typeof ca === "string") {
      const s = ca.trim().toLowerCase();
      if (s === "true" || s === "false") return false;
      if (matchesOptionLabel(ca, r.options)) return false;
    }
    return true;
  }
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
      question: describeQuestion(q, v2.topic),
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
          question: describeQuestion(q, v1.topic),
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
  const [cleaning, setCleaning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState<string>("");
  const [csvFilename, setCsvFilename] = useState<string>("");
  const [preview, setPreview] = useState<Awaited<ReturnType<typeof previewCsvImport>> | null>(null);
  const [commitResult, setCommitResult] = useState<
    | {
        commitUrl: string;
        commitSha: string;
        filePath?: string;
        topic?: string;
        rowCount?: number;
        changedCount?: number;
        addedCount?: number;
        removedCount?: number;
        deploymentNote?: string;
        kind?: "commit" | "rollback";
      }
    | null
  >(null);
  const [ghTest, setGhTest] = useState<Awaited<ReturnType<typeof testGithubConnection>> | null>(null);
  const [ghTesting, setGhTesting] = useState(false);
  const [selfTest, setSelfTest] = useState<Awaited<ReturnType<typeof runImportSelfTest>> | null>(null);
  const [selfTesting, setSelfTesting] = useState(false);
  const [liveCheck, setLiveCheck] = useState<Awaited<ReturnType<typeof verifyLiveJson>> | null>(null);
  const [liveChecking, setLiveChecking] = useState(false);
  const previewFn = useServerFn(previewCsvImport);
  const commitFn = useServerFn(commitCsvImport);
  const rollbackFn = useServerFn(rollbackImport);
  const ghTestFn = useServerFn(testGithubConnection);
  const selfTestFn = useServerFn(runImportSelfTest);
  const verifyLiveFn = useServerFn(verifyLiveJson);
  const listFn = useServerFn(listImportHistory);
  const router = useRouter();
  const qc = useQueryClient();
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
        question: describeQuestion(raw, topic),
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
      for (const u of q.usedInMocks ?? []) {
        arr.push({ mockNumber: u.mockNumber, slot: u.slot, sourceQid: q.id });
      }
      groups.set(fp, arr);
    }
    return base.map((q) => {
      const fp = fingerprintQuestion(q.raw);
      const merged = groups.get(fp) ?? q.usedInMocks ?? [];
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

  const availableMocks = useMemo(() => {
    const s = new Set<number>();
    effectiveQuestions.forEach((q: FlatQuestion) =>
      (q.usedInMocks ?? []).forEach((u) => s.add(u.mockNumber)),
    );
    return Array.from(s).sort((a, b) => a - b);
  }, [effectiveQuestions]);

  const filtered = useMemo<FlatQuestion[]>(() => {
    const s = search.trim().toLowerCase();
    const mockNum = mockFilter === "all" ? null : Number(mockFilter);
    const list = effectiveQuestions.filter((q: FlatQuestion) => {
      if (type !== "all" && q.type !== type) return false;
      if (imageFilter === "with" && !q.image) return false;
      if (imageFilter === "without" && q.image) return false;
      if (usageFilter === "used" && (q.usedInMocks ?? []).length === 0) return false;
      if (usageFilter === "unused" && (q.usedInMocks ?? []).length > 0) return false;
      if (mockNum !== null && !(q.usedInMocks ?? []).some((u) => u.mockNumber === mockNum)) return false;
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
    if (mockNum !== null) {
      const slotOf = (q: FlatQuestion) =>
        (q.usedInMocks ?? []).find((u) => u.mockNumber === mockNum)?.slot ?? 9999;
      list.sort((a, b) => slotOf(a) - slotOf(b));
    }
    return list;
  }, [effectiveQuestions, search, type, imageFilter, usageFilter, mockFilter, statusFilter, healthFilter, overrides, topic]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const visible = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const stats = useMemo(() => {
    const withImg = effectiveQuestions.filter((q: FlatQuestion) => q.image).length;
    const orphan = effectiveQuestions.filter((q: FlatQuestion) => (q.usedInMocks ?? []).length === 0).length;
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

  // CSV → GitHub: stage file, preview the diff, then commit to main.
  const onCsvFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportMsg(null);
    setCommitResult(null);
    setPreview(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setImportMsg("Only .csv files are supported. Export the topic, edit, then re-upload as CSV.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const text = await file.text();
    setCsvFilename(file.name);
    setCsvText(text);
    if (fileInputRef.current) fileInputRef.current.value = "";
    previewMutation.mutate({ text });
  };

  const previewMutation = useMutation({
    mutationFn: (vars: { text: string }) => previewFn({ data: { topic, csvText: vars.text } }),
    onSuccess: (data) => {
      if (data.error) {
        setImportMsg(`Preview failed: ${data.error}`);
        setPreview(null);
        return;
      }
      setPreview(data);
      setImportMsg(null);
    },
    onError: (err: Error) => {
      setImportMsg(`Preview failed: ${err.message}`);
      setPreview(null);
    },
  });

  const commitMutation = useMutation({
    mutationFn: () => {
      const expectedSha = (preview as { existingSha?: string } | null)?.existingSha;
      return commitFn({
        data: { topic, csvText, filename: csvFilename || "upload.csv", expectedSha },
      });
    },
    onSuccess: (data) => {
      setCommitResult({
        commitUrl: data.commitUrl,
        commitSha: data.commitSha,
        filePath: data.filePath,
        topic: data.topic,
        rowCount: data.rowCount,
        changedCount: data.changedCount,
        addedCount: data.addedCount,
        removedCount: data.removedCount,
        deploymentNote: data.deploymentNote,
        kind: "commit",
      });
      setPreview(null);
      setCsvText("");
      setCsvFilename("");
      invalidateTopicFileCache(topic);
      setImportMsg(null);
      qc.invalidateQueries({ queryKey: ["import-history", topic] });
      router.invalidate();
    },
    onError: (err: Error) => setImportMsg(`Commit failed: ${err.message}`),
  });

  const rollbackMutation = useMutation({
    mutationFn: (vars: { historyId: string; force?: boolean }) =>
      rollbackFn({ data: { historyId: vars.historyId, force: vars.force } }),
    onSuccess: (data) => {
      setCommitResult({
        commitUrl: data.commitUrl,
        commitSha: data.commitSha,
        filePath: data.filePath,
        topic: data.topic,
        deploymentNote: data.deploymentNote,
        kind: "rollback",
      });
      invalidateTopicFileCache(topic);
      setImportMsg(null);
      qc.invalidateQueries({ queryKey: ["import-history", topic] });
      router.invalidate();
    },
    onError: (err: Error) => setImportMsg(`Rollback failed: ${err.message}`),
  });

  const runGithubTest = async () => {
    setGhTesting(true);
    setGhTest(null);
    try {
      const result = await ghTestFn({ data: undefined as never });
      setGhTest(result);
    } catch (e) {
      setGhTest({
        ok: false,
        token: { present: false },
        repo: { ok: false, full: "", error: e instanceof Error ? e.message : String(e) },
        branch: { ok: false, name: "" },
        contentsWrite: { ok: false },
      });
    } finally {
      setGhTesting(false);
    }
  };

  const runSelfTest = async () => {
    setSelfTesting(true);
    setSelfTest(null);
    try {
      const result = await selfTestFn({ data: { topic } });
      setSelfTest(result);
    } catch (e) {
      setImportMsg(`Self-test failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSelfTesting(false);
    }
  };

  const runVerifyLive = async () => {
    setLiveChecking(true);
    setLiveCheck(null);
    try {
      const result = await verifyLiveFn({ data: { topic } });
      setLiveCheck(result);
    } catch (e) {
      setImportMsg(`Live verify failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLiveChecking(false);
    }
  };

  const history = useQuery({
    queryKey: ["import-history", topic],
    queryFn: () => listFn({ data: { topic, limit: 20 } }),
    retry: false,
  });


  const cancelPreview = () => {
    setPreview(null);
    setCsvText("");
    setCsvFilename("");
  };


  const cleanBadOverrides = async () => {
    const ok = typeof window === "undefined"
      ? true
      : window.confirm(
          `Scan "${topic}" override rows and delete any with blank question text or empty answer options? Disabled flags and other override fields are preserved by re-saving the cleaned subset.`,
        );
    if (!ok) return;
    setCleaning(true);
    setImportMsg(null);
    try {
      const PAGE = 1000;
      let from = 0;
      type Row = {
        id: string;
        question_id: string;
        question: string | null;
        options: unknown;
        explanation: string | null;
        image: string | null;
        image_alt: string | null;
        correct_answer: unknown;
        disabled: boolean | null;
        type: string | null;
      };
      const all: Row[] = [];
      while (true) {
        const { data, error } = await supabase
          .from("question_overrides")
          .select("id,question_id,question,options,explanation,image,image_alt,correct_answer,disabled,type")
          .eq("topic", topic)
          .range(from, from + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        all.push(...(data as Row[]));
        if (data.length < PAGE) break;
        from += PAGE;
      }
      const isBlankStr = (s: unknown) => typeof s === "string" && s.trim().length === 0;
      const isBlankOpts = (o: unknown) =>
        Array.isArray(o) && (o.length === 0 || o.every((v) => v == null || (typeof v === "string" && v.trim().length === 0)));
      const bad = all.filter((r) => isBlankStr(r.question) || isBlankOpts(r.options));
      if (bad.length === 0) {
        setImportMsg("No bad overrides found in this topic.");
        return;
      }
      // Decide between deleting the whole row vs clearing only the bad fields:
      // if the row also carries useful state (disabled flag, real explanation,
      // image, type, or correct_answer override), keep it and just null out the
      // blank columns so we don't lose the user's other edits.
      const toDelete: string[] = [];
      const toClear: { id: string; question?: null; options?: null }[] = [];
      for (const r of bad) {
        const hasOtherSignal =
          r.disabled === true ||
          (typeof r.explanation === "string" && r.explanation.trim().length > 0) ||
          (typeof r.image === "string" && r.image.trim().length > 0) ||
          (typeof r.image_alt === "string" && r.image_alt.trim().length > 0) ||
          (typeof r.type === "string" && r.type.trim().length > 0) ||
          r.correct_answer != null;
        if (hasOtherSignal) {
          const patch: { id: string; question?: null; options?: null } = { id: r.id };
          if (isBlankStr(r.question)) patch.question = null;
          if (isBlankOpts(r.options)) patch.options = null;
          toClear.push(patch);
        } else {
          toDelete.push(r.id);
        }
      }
      let cleared = 0;
      for (const patch of toClear) {
        const { id, ...fields } = patch;
        const { error } = await supabase
          .from("question_overrides")
          .update({ ...fields, updated_by: user?.id ?? null })
          .eq("id", id);
        if (error) throw error;
        cleared++;
      }
      let deleted = 0;
      for (let i = 0; i < toDelete.length; i += 200) {
        const slice = toDelete.slice(i, i + 200);
        const { error } = await supabase.from("question_overrides").delete().in("id", slice);
        if (error) throw error;
        deleted += slice.length;
      }
      invalidateOverrides();
      setBump((n) => n + 1);
      setImportMsg(
        `Cleaned ${bad.length} bad override${bad.length === 1 ? "" : "s"}: deleted ${deleted}, cleared blank fields on ${cleared}.`,
      );
    } catch (err) {
      setImportMsg(`Cleanup failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setCleaning(false);
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
          <select
            value={mockFilter}
            onChange={(e) => {
              setMockFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            title="Show only questions used in a specific mock test (sorted by question slot)"
          >
            <option value="all">All mocks</option>
            {availableMocks.map((n) => (
              <option key={n} value={String(n)}>
                Mock {n}
              </option>
            ))}
          </select>
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} matching
          </span>
        </div>

        <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/20 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Bulk export / import (CSV → GitHub)
            </span>
            <Button size="sm" variant="outline" onClick={() => exportData("csv")} disabled={filtered.length === 0}>
              Export CSV ({filtered.length})
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportData("json")} disabled={filtered.length === 0}>
              Export JSON ({filtered.length})
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={onCsvFile}
            />
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={previewMutation.isPending || commitMutation.isPending}
            >
              {previewMutation.isPending ? "Reading…" : "Import CSV"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={runGithubTest}
              disabled={ghTesting}
              title="Check GitHub token, repo, branch, and Contents read/write permission."
            >
              {ghTesting ? "Testing…" : "Test GitHub connection"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={runSelfTest}
              disabled={selfTesting}
              title="Validate the topic JSON, GitHub access, export, round-trip re-import, schema, and rollback snapshot."
            >
              {selfTesting ? "Running…" : "Run import self-test"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={runVerifyLive}
              disabled={liveChecking}
              title="Fetch /mocks/<topic>.json from the live site and compare it with the latest committed JSON."
            >
              {liveChecking ? "Checking…" : "Verify live JSON"}
            </Button>
            {/* "Clear bad overrides" removed — `question_overrides` is no longer the live source.
                The live quiz reads only public/mocks/<topic>.json. A deprecated dev-only cleanup
                action is collapsed below the import history table. */}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Export the topic, edit the CSV, then re-upload — you'll see a preview before any changes
            are committed directly to <code>public/mocks/{topic}.json</code> on{" "}
            <code>main</code>. Auto-deploy picks the commit up in ~1–2 minutes.
          </p>
          {ghTest && (
            <div
              className={`mt-2 rounded-md border p-2 text-xs ${
                ghTest.ok
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-800"
              }`}
            >
              <div className="font-semibold">
                GitHub connection: {ghTest.ok ? "OK" : "Problem detected"}
              </div>
              <ul className="mt-1 space-y-0.5">
                <li>Token configured: {ghTest.token.present ? "✓" : "✗ missing"}</li>
                <li>
                  Repo {ghTest.repo.full || "(unknown)"}: {ghTest.repo.ok ? "✓ accessible" : `✗ ${ghTest.repo.error ?? "not accessible"}`}
                </li>
                <li>
                  Branch {ghTest.branch.name || "(unknown)"}: {ghTest.branch.ok ? "✓ accessible" : `✗ ${ghTest.branch.error ?? "not accessible"}`}
                </li>
                <li>
                  Contents read/write: {ghTest.contentsWrite.ok ? "✓ granted" : `✗ ${ghTest.contentsWrite.error ?? "not granted"}`}
                </li>
              </ul>
            </div>
          )}
          {selfTest && (
            <div
              className={`mt-2 rounded-md border p-2 text-xs ${
                selfTest.ok
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-800"
              }`}
            >
              <div className="font-semibold">
                Self-test: {selfTest.ok ? "all checks passed" : "issues detected"}
                <span className="ml-2 font-normal text-muted-foreground">
                  {selfTest.bankSize} questions · {selfTest.filePath} · {new Date(selfTest.ranAt).toLocaleTimeString()}
                </span>
              </div>
              <ul className="mt-1 space-y-0.5">
                {selfTest.checks.map((c, i) => (
                  <li key={i}>
                    {c.ok ? "✓" : "✗"} {c.name}
                    {c.detail && <span className="ml-1 text-muted-foreground">— {c.detail}</span>}
                  </li>
                ))}
              </ul>
              {selfTest.roundTrip.mismatchCount > 0 && (
                <details className="mt-2 rounded border border-rose-500/40 bg-rose-500/5 p-2">
                  <summary className="cursor-pointer font-semibold text-rose-700">
                    Round-trip mismatches ({selfTest.roundTrip.mismatchCount})
                  </summary>
                  <table className="mt-2 w-full text-[11px]">
                    <thead className="text-left uppercase text-muted-foreground">
                      <tr>
                        <th className="py-0.5 pr-2">Question ID</th>
                        <th className="py-0.5 pr-2">Field</th>
                        <th className="py-0.5 pr-2">Original (JSON)</th>
                        <th className="py-0.5 pr-2">Parsed-back (CSV)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selfTest.roundTrip.mismatches.map((m, i) => (
                        <tr key={i} className="border-t border-border align-top">
                          <td className="py-0.5 pr-2 font-mono">{m.id}</td>
                          <td className="py-0.5 pr-2 font-mono">{m.field}</td>
                          <td className="py-0.5 pr-2"><pre className="whitespace-pre-wrap break-all">{JSON.stringify(m.before)}</pre></td>
                          <td className="py-0.5 pr-2"><pre className="whitespace-pre-wrap break-all">{JSON.stringify(m.after)}</pre></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              )}
            </div>
          )}
          {liveCheck && (
            <div
              className={`mt-2 rounded-md border p-2 text-xs ${
                liveCheck.ok
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-800"
              }`}
            >
              <div className="font-semibold">
                Live JSON updated: {liveCheck.ok ? "yes" : "no — deployment/cache may still be propagating"}
              </div>
              <ul className="mt-1 space-y-0.5">
                <li>File path: <code>{liveCheck.filePath}</code></li>
                <li>Live path: <code>{liveCheck.livePath}</code></li>
                {liveCheck.expectedSha && (
                  <li>Expected latest commit (file SHA): <code className="font-mono">{liveCheck.expectedSha.slice(0, 12)}</code></li>
                )}
                <li>Last checked: {new Date(liveCheck.checkedAt).toLocaleString()}</li>
                {liveCheck.error && <li className="text-rose-700">Error: {liveCheck.error}</li>}
                {liveCheck.attempts.map((a, i) => (
                  <li key={i}>
                    {a.updated ? "✓" : "✗"} <a href={a.url} target="_blank" rel="noreferrer" className="break-all underline">{a.url}</a>
                    {a.status != null && <span className="ml-1 text-muted-foreground">(HTTP {a.status})</span>}
                    {a.error && <span className="ml-1 text-rose-700">— {a.error}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {commitResult && (
            <div className="mt-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-2 text-xs">
              <div className="font-semibold">
                {commitResult.kind === "rollback" ? "Rollback committed" : "Commit succeeded"}
              </div>
              <ul className="mt-1 space-y-0.5">
                <li>
                  Commit SHA:{" "}
                  <a href={commitResult.commitUrl} target="_blank" rel="noreferrer" className="font-mono underline">
                    {commitResult.commitSha.slice(0, 7)}
                  </a>{" "}
                  <span className="text-muted-foreground">({commitResult.commitSha})</span>
                </li>
                <li>
                  Commit URL:{" "}
                  <a href={commitResult.commitUrl} target="_blank" rel="noreferrer" className="break-all underline">
                    {commitResult.commitUrl}
                  </a>
                </li>
                {commitResult.filePath && <li>File: <code>{commitResult.filePath}</code></li>}
                {commitResult.topic && <li>Topic: <code>{commitResult.topic}</code></li>}
                {typeof commitResult.rowCount === "number" && <li>CSV rows: {commitResult.rowCount}</li>}
                {typeof commitResult.changedCount === "number" && (
                  <li>
                    Changed: {commitResult.changedCount}
                    {typeof commitResult.addedCount === "number" ? ` · Added: ${commitResult.addedCount}` : ""}
                    {typeof commitResult.removedCount === "number" ? ` · Removed: ${commitResult.removedCount}` : ""}
                  </li>
                )}
                {commitResult.deploymentNote && (
                  <li className="mt-1 italic text-muted-foreground">{commitResult.deploymentNote}</li>
                )}
                <li className="mt-1 italic text-muted-foreground">
                  Changes committed to GitHub main. Deployment may take a few minutes. If the live quiz still shows old data, wait for deployment/cache refresh.
                </li>
                <li className="mt-1 text-muted-foreground">
                  Reminder: open the live quiz or admin export and confirm the changed question appears.
                </li>
              </ul>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={runVerifyLive} disabled={liveChecking}>
                  {liveChecking ? "Checking…" : "Verify live JSON now"}
                </Button>
              </div>
            </div>
          )}
          {importMsg && (
            <p className="mt-2 text-xs font-medium text-amber-700">{importMsg}</p>
          )}
        </div>

        {preview && !preview.error && (() => {
          const v = (preview as { validation?: { errors: Array<{ rowIndex: number | null; id: string | null; field: string | null; message: string }>; warnings: Array<{ rowIndex: number | null; id: string | null; field: string | null; message: string }> } }).validation
            ?? { errors: [], warnings: [] };
          const blocked = v.errors.length > 0;
          const downloadReport = () => {
            const lines = ["severity,row,id,field,message"];
            const esc = (s: unknown) => `"${String(s ?? "").replace(/"/g, '""')}"`;
            for (const e of v.errors) lines.push(["error", e.rowIndex ?? "", e.id ?? "", e.field ?? "", e.message].map(esc).join(","));
            for (const w of v.warnings) lines.push(["warning", w.rowIndex ?? "", w.id ?? "", w.field ?? "", w.message].map(esc).join(","));
            const blob = new Blob([lines.join("\n")], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${topic}-validation-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          };
          return (
          <div className="mt-3 rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Preview: {csvFilename}</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={cancelPreview}>Cancel</Button>
                {(v.errors.length > 0 || v.warnings.length > 0) && (
                  <Button size="sm" variant="outline" onClick={downloadReport}>
                    Download report
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => {
                    const ok = window.confirm(
                      `You are about to commit changes directly to main for public/mocks/${topic}.json.\n\nProceed?`,
                    );
                    if (ok) commitMutation.mutate();
                  }}
                  disabled={commitMutation.isPending || blocked}
                  title={blocked ? "Fix validation errors before committing." : undefined}
                >
                  {commitMutation.isPending ? "Committing…" : blocked ? "Blocked by errors" : "Commit to main"}
                </Button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary">CSV rows: {preview.rowCount}</Badge>
              <Badge variant="secondary">Existing: {preview.oldBankSize}</Badge>
              <Badge variant="secondary">After: {preview.newBankSize}</Badge>
              <Badge className="bg-emerald-500/20 text-emerald-700">Added: {preview.diff.addedCount}</Badge>
              <Badge className="bg-amber-500/20 text-amber-700">Changed: {preview.diff.changedCount}</Badge>
              <Badge className="bg-rose-500/20 text-rose-700">Removed: {preview.diff.removedCount}</Badge>
              <Badge className="bg-rose-500/20 text-rose-700">Errors: {v.errors.length}</Badge>
              <Badge className="bg-amber-500/20 text-amber-700">Warnings: {v.warnings.length}</Badge>
            </div>
            {v.errors.length > 0 && (
              <details open className="mt-3 rounded border border-rose-500/40 bg-rose-500/5 p-2 text-xs">
                <summary className="cursor-pointer font-semibold text-rose-700">
                  Errors block commit ({v.errors.length})
                </summary>
                <ul className="mt-2 max-h-72 space-y-1 overflow-auto">
                  {v.errors.map((e, i) => (
                    <li key={i} className="text-rose-700">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {e.rowIndex ? `row ${e.rowIndex}` : "file"}{e.id ? ` · ${e.id}` : ""}{e.field ? ` · ${e.field}` : ""}
                      </span>{" "}
                      {e.message}
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {v.warnings.length > 0 && (
              <details className="mt-2 rounded border border-amber-500/40 bg-amber-500/5 p-2 text-xs">
                <summary className="cursor-pointer font-semibold text-amber-700">
                  Warnings — review but won't block ({v.warnings.length})
                </summary>
                <ul className="mt-2 max-h-72 space-y-1 overflow-auto">
                  {v.warnings.map((w, i) => (
                    <li key={i} className="text-amber-700">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {w.rowIndex ? `row ${w.rowIndex}` : "file"}{w.id ? ` · ${w.id}` : ""}{w.field ? ` · ${w.field}` : ""}
                      </span>{" "}
                      {w.message}
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {preview.parseErrors.length > 0 && (
              <ul className="mt-2 max-h-32 space-y-1 overflow-auto rounded bg-muted/40 p-2 text-xs text-amber-700">
                {preview.parseErrors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
            {preview.diff.changed.length > 0 && (
              <details className="mt-3 text-xs">
                <summary className="cursor-pointer font-semibold">
                  Changed ({preview.diff.changedCount})
                </summary>
                <div className="mt-2 max-h-[600px] space-y-2 overflow-auto">
                  {preview.diff.changed.map((c: any) => {
                    const fields: string[] = c.changedFields ?? Object.keys(c.after ?? {});
                    const isRoadSigns = topic === "road-signs";
                    const oldImg: string | undefined = c.before?.image;
                    const newImg: string | undefined = c.after?.image;
                    const oldAlt: string | undefined = c.before?.imageAlt;
                    const newAlt: string | undefined = c.after?.imageAlt;
                    const showRsPreview = isRoadSigns && (oldImg || newImg);
                    return (
                      <div key={c.id} className="rounded border border-border p-2">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-muted-foreground">{c.id}</span>
                          {fields.map((f) => (
                            <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                          ))}
                        </div>
                        {showRsPreview && (
                          <div className="mb-2 grid gap-2 rounded border border-amber-500/30 bg-amber-500/5 p-2 sm:grid-cols-2">
                            <div>
                              <div className="text-[10px] font-semibold text-rose-700">Before · image</div>
                              {oldImg ? (
                                <>
                                  <code className="block break-all text-[10px]">{oldImg}</code>
                                  <img src={oldImg} alt={oldAlt ?? ""} className="mt-1 h-24 w-auto rounded border border-border bg-white object-contain p-1" onError={(e) => ((e.currentTarget.style.display = "none"))} />
                                  <div className="mt-1 text-[10px] text-muted-foreground">alt: {oldAlt || <em>(empty)</em>}</div>
                                </>
                              ) : <em className="text-[10px] text-muted-foreground">(none)</em>}
                            </div>
                            <div>
                              <div className="text-[10px] font-semibold text-emerald-700">After · image</div>
                              {newImg ? (
                                <>
                                  <code className="block break-all text-[10px]">{newImg}</code>
                                  <img src={newImg} alt={newAlt ?? ""} className="mt-1 h-24 w-auto rounded border border-border bg-white object-contain p-1" onError={(e) => ((e.currentTarget.style.display = "none"))} />
                                  <div className="mt-1 text-[10px] text-muted-foreground">alt: {newAlt || <em>(empty)</em>}</div>
                                </>
                              ) : <em className="text-[10px] text-muted-foreground">(none)</em>}
                            </div>
                          </div>
                        )}
                        <div className="space-y-1">
                          {fields.map((f) => (
                            <div key={f} className="grid gap-2 sm:grid-cols-2">
                              <div>
                                <div className="text-[10px] font-semibold text-rose-700">Before · {f}</div>
                                <pre className="overflow-auto rounded bg-muted/40 p-2 whitespace-pre-wrap">{JSON.stringify(c.before?.[f], null, 2)}</pre>
                              </div>
                              <div>
                                <div className="text-[10px] font-semibold text-emerald-700">After · {f}</div>
                                <pre className="overflow-auto rounded bg-muted/40 p-2 whitespace-pre-wrap">{JSON.stringify(c.after?.[f], null, 2)}</pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                </div>
              </details>
            )}
            {preview.diff.added.length > 0 && (
              <details className="mt-3 text-xs">
                <summary className="cursor-pointer font-semibold">Added ({preview.diff.addedCount})</summary>
                <pre className="mt-2 max-h-80 overflow-auto rounded bg-muted/40 p-2">
                  {JSON.stringify(preview.diff.added, null, 2)}
                </pre>
              </details>
            )}
          </div>
          );
        })()}

        <details className="mt-3 rounded-lg border border-border bg-card p-3 text-sm">
          <summary className="cursor-pointer font-semibold">
            Import history for {topic}
            {history.data ? ` (${(history.data.rows ?? []).length})` : ""}
          </summary>
          {history.isLoading && <p className="mt-2 text-xs text-muted-foreground">Loading…</p>}
          {history.error && (
            <p className="mt-2 text-xs text-rose-700">
              Failed to load history: {history.error instanceof Error ? history.error.message : "unknown error"}
            </p>
          )}
          {history.data?.error && (
            <p className="mt-2 text-xs text-rose-700">{history.data.error}</p>
          )}
          {history.data && (history.data.rows ?? []).length === 0 && !history.data.error && (
            <p className="mt-2 text-xs text-muted-foreground">No imports yet for this topic.</p>
          )}
          {history.data && (history.data.rows ?? []).length > 0 && (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-left uppercase text-muted-foreground">
                  <tr>
                    <th className="py-1 pr-3">When</th>
                    <th className="py-1 pr-3">File</th>
                    <th className="py-1 pr-3">Rows</th>
                    <th className="py-1 pr-3">Changed</th>
                    <th className="py-1 pr-3">Commit</th>
                    <th className="py-1 pr-3">Status</th>
                    <th className="py-1 pr-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {(history.data.rows ?? []).map((r) => {
                    const changedIds: string[] = Array.isArray((r as { changed_ids?: string[] }).changed_ids)
                      ? (r as { changed_ids?: string[] }).changed_ids ?? []
                      : [];
                    return (
                    <tr key={r.id} className="border-t border-border align-top">
                      <td className="py-1 pr-3 text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                      <td className="py-1 pr-3">{r.filename ?? "—"}</td>
                      <td className="py-1 pr-3">{r.row_count ?? "—"}</td>
                      <td className="py-1 pr-3">
                        {changedIds.length === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span title={changedIds.join(", ")} className="font-mono">
                            {changedIds.length}
                            <span className="ml-1 text-muted-foreground">
                              ({changedIds.slice(0, 5).join(", ")}
                              {changedIds.length > 5 ? `, +${changedIds.length - 5} more` : ""})
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="py-1 pr-3">
                        {r.commit_url ? (
                          <a href={r.commit_url} target="_blank" rel="noreferrer" className="font-mono underline">
                            {String(r.commit_sha ?? "").slice(0, 7)}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-1 pr-3">
                        <Badge
                          variant="secondary"
                          className={
                            r.status === "committed"
                              ? "bg-emerald-500/20 text-emerald-700"
                              : r.status === "failed"
                                ? "bg-rose-500/20 text-rose-700"
                                : "bg-muted text-muted-foreground"
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                      <td className="py-1 pr-3">
                        {(r.status === "committed" || r.status === "rolled_back" || r.status === "failed") && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={rollbackMutation.isPending}
                            onClick={() => {
                              const warn = `This will restore the previous JSON file for this topic and commit it to GitHub main.\n\nFile: public/mocks/${topic}.json\n\nProceed?`;
                              if (!window.confirm(warn)) return;
                              const isRepeat = r.status === "rolled_back" || r.status === "failed";
                              if (isRepeat) {
                                const again = window.confirm(
                                  r.status === "rolled_back"
                                    ? "This import was already rolled back. Roll it back AGAIN?"
                                    : "The previous rollback for this import failed. Retry rollback?",
                                );
                                if (!again) return;
                              }
                              rollbackMutation.mutate({ historyId: r.id, force: isRepeat });
                            }}
                          >
                            {r.status === "rolled_back" ? "Rollback again" : r.status === "failed" ? "Retry rollback" : "Rollback"}
                          </Button>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </details>


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
                    {(q.usedInMocks ?? []).length > 0 ? (
                      <span className="flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
                        Live in ({(q.usedInMocks ?? []).length}):
                        {(q.usedInMocks ?? []).map(({ mockNumber, slot, sourceQid }) => {
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
