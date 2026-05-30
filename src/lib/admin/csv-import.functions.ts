import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Papa from "papaparse";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { commitFile, getFile } from "@/lib/admin/github.server";

// Use `any` for question records — the on-disk schema is too polymorphic to
// type fully here, and TanStack's serializer rejects `unknown` index sigs.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyQ = Record<string, any> & { id?: string; type?: string };
type V2File = {
  version: 2;
  topic: string;
  bank: AnyQ[];
  mocks?: { mockNumber: number; title: string; questionIds: string[] }[];
};
type V1File = {
  topic: string;
  tests: { slug?: string; mockNumber: number; title: string; questions: AnyQ[] }[];
};
type MockFile = V1File | V2File;

function filePathFor(topic: string) {
  return `public/mocks/${topic}.json`;
}

async function assertAdmin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden: admin role required");
}

async function getAuthenticatedAdminClient() {
  const { getRequestHeader } = await import("@tanstack/react-start/server");
  const { createClient } = await import("@supabase/supabase-js");
  const authHeader = getRequestHeader("authorization") ?? getRequestHeader("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return { error: "Not signed in" } as const;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) return { error: "Backend environment is not configured" } as const;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const token = authHeader.replace("Bearer ", "");
  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData?.user) return { error: "Not signed in" } as const;
  const { data: isAdmin, error: roleErr } = await supabase.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "admin",
  });
  if (roleErr) return { error: roleErr.message } as const;
  if (!isAdmin) return { error: "Forbidden: admin role required" } as const;
  return { supabase, userId: userData.user.id, error: null } as const;
}

function emptyPreview(error: string, parseErrors: string[] = []) {
  return {
    error,
    parseErrors,
    rowCount: 0,
    diff: { addedCount: 0, changedCount: 0, removedCount: 0, added: [], changed: [], removed: [] },
    oldBankSize: 0,
    newBankSize: 0,
  };
}

/** Parse a CSV string into question rows. Accepts the same column shape used
 * by the existing export/import: id, type, question, options (|-separated),
 * correctAnswer, correctAnswers (|-separated indices), explanation, image, imageAlt.
 */
function parseCsv(csvText: string): { rows: AnyQ[]; errors: string[] } {
  const out = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  const errors = out.errors.map((e) => `Row ${e.row}: ${e.message}`);
  const rows: AnyQ[] = [];
  for (const r of out.data) {
    const id = (r.id ?? "").trim();
    if (!id) continue;
    const type = (r.type ?? "mcq").trim() || "mcq";
    const options = (r.options ?? "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
    const q: AnyQ = {
      id,
      type,
      question: (r.question ?? "").trim(),
      explanation: (r.explanation ?? "").trim(),
    };
    if (options.length) q.options = options;
    if (r.correctAnswers) {
      q.correctAnswers = r.correctAnswers
        .split("|")
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n));
    } else if (r.correctAnswer != null && r.correctAnswer !== "") {
      const n = Number(r.correctAnswer);
      const s = r.correctAnswer.trim().toLowerCase();
      if (Number.isFinite(n)) q.correctAnswer = n;
      else if (s === "true" || s === "false") q.correctAnswer = s === "true";
      else q.correctAnswer = r.correctAnswer.trim();
    }
    if (r.image && r.image.trim()) q.image = r.image.trim();
    if (r.imageAlt && r.imageAlt.trim()) q.imageAlt = r.imageAlt.trim();
    rows.push(q);
  }
  return { rows, errors };
}

function normalizeValue(v: unknown): unknown {
  if (v == null) return null;
  if (Array.isArray(v)) return v.map(normalizeValue);
  if (typeof v === "string") {
    const s = v.trim();
    if (s === "") return null;
    if (/^-?\d+(\.\d+)?$/.test(s)) {
      const n = Number(s);
      if (Number.isFinite(n)) return n;
    }
    const l = s.toLowerCase();
    if (l === "true") return true;
    if (l === "false") return false;
    return s;
  }
  return v;
}

function valuesEqual(a: unknown, b: unknown): boolean {
  const na = normalizeValue(a);
  const nb = normalizeValue(b);
  if (na === nb) return true;
  if (Array.isArray(na) && Array.isArray(nb)) {
    if (na.length !== nb.length) return false;
    return na.every((x, i) => valuesEqual(x, nb[i]));
  }
  return false;
}

function diffBanks(oldBank: AnyQ[], newRows: AnyQ[]) {
  const oldById = new Map(oldBank.filter((q) => q.id).map((q) => [String(q.id), q]));
  const newById = new Map(newRows.filter((q) => q.id).map((q) => [String(q.id), q]));
  const added: AnyQ[] = [];
  const changed: { id: string; before: AnyQ; after: AnyQ; changedFields: string[] }[] = [];
  const removed: AnyQ[] = [];
  for (const [id, q] of newById) {
    const prev = oldById.get(id);
    if (!prev) {
      added.push(q);
      continue;
    }
    const fields: string[] = [];
    for (const key of Object.keys(q)) {
      if (!valuesEqual(prev[key], q[key])) fields.push(key);
    }
    if (fields.length > 0) {
      changed.push({ id, before: prev, after: { ...prev, ...q }, changedFields: fields });
    }
  }
  for (const [id, q] of oldById) {
    if (!newById.has(id)) removed.push(q);
  }
  return { added, changed, removed };
}

/** Merge CSV rows onto the existing bank. CSV rows REPLACE matching ids;
 * unmatched existing questions are kept as-is. New ids are appended. */
function mergeIntoFile(file: MockFile, rows: AnyQ[]): MockFile {
  const isV2 = (file as V2File).version === 2 && Array.isArray((file as V2File).bank);
  if (isV2) {
    const v2 = file as V2File;
    const byId = new Map(v2.bank.filter((q) => q.id).map((q) => [String(q.id), q]));
    for (const r of rows) byId.set(String(r.id), { ...byId.get(String(r.id)), ...r });
    const newBank = Array.from(byId.values());
    return { ...v2, bank: newBank };
  }
  // v1: apply to every test that contains a matching id; append new ids to first test
  const v1 = file as V1File;
  const byId = new Map<string, AnyQ>();
  for (const r of rows) byId.set(String(r.id), r);
  const matched = new Set<string>();
  const tests = v1.tests.map((t) => ({
    ...t,
    questions: t.questions.map((q) => {
      if (q.id && byId.has(String(q.id))) {
        matched.add(String(q.id));
        return { ...q, ...byId.get(String(q.id))! };
      }
      return q;
    }),
  }));
  const unmatched = rows.filter((r) => !matched.has(String(r.id)));
  if (unmatched.length && tests[0]) tests[0].questions.push(...unmatched);
  return { ...v1, tests };
}

function bankOf(file: MockFile): AnyQ[] {
  const isV2 = (file as V2File).version === 2 && Array.isArray((file as V2File).bank);
  if (isV2) return (file as V2File).bank;
  return (file as V1File).tests.flatMap((t) => t.questions);
}

const TopicSchema = z.string().min(1).max(120).regex(/^[a-z0-9-]+$/);

export const previewCsvImport = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      topic: TopicSchema,
      csvText: z.string().min(1).max(20_000_000),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    try {
      const auth = await getAuthenticatedAdminClient();
      if (auth.error) return emptyPreview(auth.error);
      const { rows, errors } = parseCsv(data.csvText);
      const existing = await getFile(filePathFor(data.topic));
      if (!existing) return emptyPreview(`Topic file not found in repo: ${filePathFor(data.topic)}`, errors);
      const oldFile = JSON.parse(existing.content) as MockFile;
      const oldBank = bankOf(oldFile);
      const newFile = mergeIntoFile(oldFile, rows);
      const newBank = bankOf(newFile);
      const diff = diffBanks(oldBank, newBank);
      return {
        error: null as string | null,
        parseErrors: errors,
        rowCount: rows.length,
        diff: {
          addedCount: diff.added.length,
          changedCount: diff.changed.length,
          removedCount: diff.removed.length,
          added: diff.added,
          changed: diff.changed,
          removed: diff.removed,
        },
        oldBankSize: oldBank.length,
        newBankSize: newBank.length,
      };
    } catch (err) {
      console.error("previewCsvImport failed:", err);
      return emptyPreview(err instanceof Error ? err.message : "Preview failed");
    }
  });

export const commitCsvImport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      topic: TopicSchema,
      csvText: z.string().min(1).max(20_000_000),
      filename: z.string().min(1).max(255),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabase, userId } = context;
    const { rows, errors } = parseCsv(data.csvText);
    if (rows.length === 0) throw new Error("No valid rows found in CSV");

    const path = filePathFor(data.topic);
    try {
      const existing = await getFile(path);
      if (!existing) throw new Error(`Topic file not found in repo: ${path}`);
      const oldFile = JSON.parse(existing.content) as MockFile;
      const newFile = mergeIntoFile(oldFile, rows);
      const newContent = JSON.stringify(newFile, null, 2) + "\n";
      const { commitSha, commitUrl } = await commitFile({
        filePath: path,
        content: newContent,
        message: `chore(${data.topic}): import ${rows.length} questions from ${data.filename}`,
        sha: existing.sha,
      });
      const { data: hist, error } = await supabase
        .from("question_import_history")
        .insert({
          topic: data.topic,
          filename: data.filename,
          previous_json: oldFile as never,
          new_json: newFile as never,
          commit_sha: commitSha,
          commit_url: commitUrl,
          row_count: rows.length,
          validation_log: { parseErrors: errors } as never,
          status: "committed",
          created_by: userId,
        })
        .select("id")
        .single();
      if (error) throw new Error(`History insert failed: ${error.message}`);
      return { commitSha, commitUrl, historyId: hist.id, parseErrors: errors };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await supabase.from("question_import_history").insert({
        topic: data.topic,
        filename: data.filename,
        row_count: rows.length,
        status: "failed",
        error_log: message,
        validation_log: { parseErrors: errors } as never,
        created_by: userId,
      });
      throw err;
    }
  });

export const rollbackImport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ historyId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("question_import_history")
      .select("id, topic, previous_json, commit_sha, status")
      .eq("id", data.historyId)
      .single();
    if (error || !row) throw new Error("Import history row not found");
    if (!row.previous_json) throw new Error("This import has no snapshot to roll back to");
    if (row.status === "rolled_back") throw new Error("Already rolled back");
    const path = filePathFor(row.topic);
    const existing = await getFile(path);
    const content = JSON.stringify(row.previous_json, null, 2) + "\n";
    const { commitSha, commitUrl } = await commitFile({
      filePath: path,
      content,
      message: `revert(${row.topic}): rollback to state before commit ${String(row.commit_sha ?? "").slice(0, 7)}`,
      sha: existing?.sha,
    });
    await supabase
      .from("question_import_history")
      .update({
        status: "rolled_back",
        rolled_back_at: new Date().toISOString(),
        rolled_back_to_commit_sha: commitSha,
      })
      .eq("id", row.id);
    await supabase.from("question_import_history").insert({
      topic: row.topic,
      filename: `[rollback of ${String(row.commit_sha ?? "").slice(0, 7)}]`,
      previous_json: null,
      new_json: row.previous_json,
      commit_sha: commitSha,
      commit_url: commitUrl,
      row_count: null,
      status: "committed",
      created_by: userId,
    });
    return { commitSha, commitUrl };
  });

export const listImportHistory = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z.object({
      topic: TopicSchema.optional(),
      limit: z.number().min(1).max(200).default(50),
    }).parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    try {
      // Inline auth so unauthenticated callers get a structured response
      // instead of the middleware throwing a raw 401 Response.
      const { getRequestHeader } = await import("@tanstack/react-start/server");
      const { createClient } = await import("@supabase/supabase-js");
      const authHeader = getRequestHeader("authorization") ?? getRequestHeader("Authorization");
      if (!authHeader) return { rows: [], error: "Not signed in" };

      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_PUBLISHABLE_KEY!,
        { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } },
      );
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) return { rows: [], error: "Not signed in" };

      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (!isAdmin) return { rows: [], error: "Forbidden: admin role required" };

      let q = supabase
        .from("question_import_history")
        .select("id, topic, filename, commit_sha, commit_url, row_count, status, error_log, created_at, created_by, rolled_back_at")
        .order("created_at", { ascending: false })
        .limit(data.limit);
      if (data.topic) q = q.eq("topic", data.topic);
      const { data: rows, error } = await q;
      if (error) return { rows: [], error: error.message };
      return { rows: rows ?? [], error: null as string | null };
    } catch (err) {
      console.error("listImportHistory failed:", err);
      return { rows: [], error: err instanceof Error ? err.message : "Unknown error" };
    }
  });
