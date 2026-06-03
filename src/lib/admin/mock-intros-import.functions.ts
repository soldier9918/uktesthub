/**
 * Per-Mock Intros CSV Import → GitHub.
 *
 * Mirrors src/lib/admin/csv-import.functions.ts but targets the static
 * data file `src/data/per-mock-intros.ts`. Supports two CSV shapes,
 * auto-detected by the presence of a `topic_slug` column:
 *
 *   1. Single topic (topic chosen via UI dropdown):
 *      mock,difficulty,covers,common_mistakes
 *
 *   2. All topics in one CSV (topic dropdown ignored):
 *      topic_slug,mock,difficulty,covers,common_mistakes
 *
 * `common_mistakes` is a pipe (`|`) separated list of bullet items.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Papa from "papaparse";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { commitFile, getFile } from "@/lib/admin/github.server";
import { categories } from "@/data/categories";
import {
  PER_MOCK_INTROS,
  RELATED_GUIDE_BY_TOPIC,
  type PerMockIntro,
  type Difficulty,
  type RelatedGuide,
} from "@/data/per-mock-intros";

const FILE_PATH = "src/data/per-mock-intros.ts";
const HISTORY_TOPIC = "_per_mock_intros_";
const HISTORY_KIND = "mock_intros";

const DIFFICULTIES = ["Beginner", "Intermediate", "Exam-ready"] as const;
const ImportModeSchema = z.enum(["patch", "replace"]).optional();

// -------- Auth helpers (mirrors csv-import.functions.ts) --------

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

// -------- Known topic slugs --------

function knownTopicSlugs(): Set<string> {
  const set = new Set<string>();
  for (const c of categories) for (const t of c.topics) set.add(t.slug);
  return set;
}

// -------- CSV parsing --------

export type ParsedIntroRow = {
  csvLine: number;          // 1-based CSV row (excluding header)
  topicSlug: string;
  mock: number;
  intro: PerMockIntro;
};

export type ParseIssue = {
  csvLine: number | null;
  message: string;
};

function normaliseDifficulty(raw: string): Difficulty | null {
  const v = raw.trim().toLowerCase();
  if (!v) return null;
  if (v === "beginner") return "Beginner";
  if (v === "intermediate") return "Intermediate";
  if (v === "exam-ready" || v === "exam ready" || v === "examready") return "Exam-ready";
  return null;
}

function splitCommonMistakes(raw: string): string[] {
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function parseIntrosCsv(
  csvText: string,
  fallbackTopicSlug: string | null,
): { rows: ParsedIntroRow[]; errors: ParseIssue[]; hasTopicColumn: boolean } {
  const out = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const errors: ParseIssue[] = out.errors.map((e) => ({
    csvLine: typeof e.row === "number" ? e.row + 2 : null,
    message: e.message,
  }));

  const headers = new Set((out.meta.fields ?? []).map((h) => h.trim().toLowerCase()));
  const hasTopicColumn = headers.has("topic_slug");

  const required = ["mock", "difficulty", "covers", "common_mistakes"];
  for (const h of required) {
    if (!headers.has(h)) {
      errors.push({ csvLine: null, message: `Missing required column: "${h}"` });
    }
  }
  if (errors.some((e) => e.csvLine === null && e.message.startsWith("Missing required column"))) {
    return { rows: [], errors, hasTopicColumn };
  }
  if (!hasTopicColumn && !fallbackTopicSlug) {
    errors.push({
      csvLine: null,
      message: 'CSV has no "topic_slug" column. Either pick a topic in the dropdown or add a topic_slug column.',
    });
    return { rows: [], errors, hasTopicColumn };
  }

  const known = knownTopicSlugs();
  const rows: ParsedIntroRow[] = [];
  const seen = new Set<string>(); // topic|mock dedupe

  out.data.forEach((r, i) => {
    const csvLine = i + 2;
    const topicSlug = (hasTopicColumn ? r.topic_slug : fallbackTopicSlug ?? "").trim();
    if (!topicSlug) {
      errors.push({ csvLine, message: "Missing topic_slug." });
      return;
    }
    if (!known.has(topicSlug)) {
      errors.push({
        csvLine,
        message: `Unknown topic_slug "${topicSlug}" (not found in categories.ts).`,
      });
      return;
    }

    const mockRaw = (r.mock ?? "").trim();
    const mockNum = Number(mockRaw);
    if (!Number.isInteger(mockNum) || mockNum < 1 || mockNum > 45) {
      errors.push({ csvLine, message: `Invalid "mock" value "${mockRaw}" (must be integer 1–45).` });
      return;
    }

    const difficulty = normaliseDifficulty(r.difficulty ?? "");
    if (!difficulty) {
      errors.push({
        csvLine,
        message: `Invalid "difficulty" value "${r.difficulty}" (must be ${DIFFICULTIES.join(" | ")}).`,
      });
      return;
    }

    const covers = (r.covers ?? "").trim();
    if (!covers) {
      errors.push({ csvLine, message: "Empty \"covers\" field." });
      return;
    }
    if (covers.length > 2000) {
      errors.push({ csvLine, message: `"covers" is too long (${covers.length} chars, max 2000).` });
      return;
    }

    const commonMistakes = splitCommonMistakes(r.common_mistakes ?? "");
    if (commonMistakes.length === 0) {
      errors.push({ csvLine, message: 'Empty "common_mistakes" (provide a pipe-separated list).' });
      return;
    }
    if (commonMistakes.length > 12) {
      errors.push({ csvLine, message: `Too many "common_mistakes" items (${commonMistakes.length}, max 12).` });
      return;
    }

    const dedupeKey = `${topicSlug}|${mockNum}`;
    if (seen.has(dedupeKey)) {
      errors.push({ csvLine, message: `Duplicate row for ${topicSlug} mock ${mockNum}.` });
      return;
    }
    seen.add(dedupeKey);

    rows.push({
      csvLine,
      topicSlug,
      mock: mockNum,
      intro: { difficulty, covers, commonMistakes },
    });
  });

  return { rows, errors, hasTopicColumn };
}

// -------- Merge + diff --------

type IntrosMap = Record<string, Record<number, PerMockIntro>>;

function cloneIntros(src: IntrosMap): IntrosMap {
  const copy: IntrosMap = {};
  for (const [topic, byMock] of Object.entries(src)) {
    copy[topic] = { ...byMock };
  }
  return copy;
}

function applyRows(
  current: IntrosMap,
  rows: ParsedIntroRow[],
  mode: "patch" | "replace",
  affectedTopics: Set<string>,
): IntrosMap {
  const next = cloneIntros(current);
  if (mode === "replace") {
    for (const topic of affectedTopics) {
      next[topic] = {};
    }
  }
  for (const r of rows) {
    if (!next[r.topicSlug]) next[r.topicSlug] = {};
    next[r.topicSlug][r.mock] = r.intro;
  }
  return next;
}

export type IntroDiffRow = {
  topicSlug: string;
  mock: number;
  status: "added" | "changed" | "unchanged";
};

function diffIntros(
  current: IntrosMap,
  next: IntrosMap,
  rows: ParsedIntroRow[],
): { rows: IntroDiffRow[]; addedCount: number; changedCount: number; unchangedCount: number } {
  const result: IntroDiffRow[] = [];
  let added = 0;
  let changed = 0;
  let unchanged = 0;
  for (const r of rows) {
    const before = current[r.topicSlug]?.[r.mock];
    const after = next[r.topicSlug]?.[r.mock];
    let status: IntroDiffRow["status"];
    if (!before) {
      status = "added";
      added++;
    } else if (JSON.stringify(before) !== JSON.stringify(after)) {
      status = "changed";
      changed++;
    } else {
      status = "unchanged";
      unchanged++;
    }
    result.push({ topicSlug: r.topicSlug, mock: r.mock, status });
  }
  return { rows: result, addedCount: added, changedCount: changed, unchangedCount: unchanged };
}

// -------- File serializer --------

function serializePerMockIntrosFile(
  intros: IntrosMap,
  related: Record<string, RelatedGuide>,
): string {
  const j = (v: unknown) => JSON.stringify(v);

  const topicEntries = Object.keys(intros).sort();
  const intrasBody = topicEntries
    .map((topicSlug) => {
      const byMock = intros[topicSlug] ?? {};
      const mockNums = Object.keys(byMock)
        .map((n) => Number(n))
        .filter((n) => Number.isInteger(n))
        .sort((a, b) => a - b);
      const inner = mockNums
        .map((n) => {
          const v = byMock[n];
          const mistakes = v.commonMistakes
            .map((m) => `        ${j(m)},`)
            .join("\n");
          return `    ${n}: {
      difficulty: ${j(v.difficulty)},
      covers: ${j(v.covers)},
      commonMistakes: [
${mistakes}
      ],
    },`;
        })
        .join("\n");
      return `  ${j(topicSlug)}: {
${inner}
  },`;
    })
    .join("\n");

  const relatedEntries = Object.keys(related).sort();
  const relatedBody = relatedEntries
    .map((topicSlug) => {
      const r = related[topicSlug];
      return `  ${j(topicSlug)}: {
    label: ${j(r.label)},
    href: ${j(r.href)},
    intro: ${j(r.intro)},
  },`;
    })
    .join("\n");

  return `/**
 * Per-mock intro content shown on individual mock test start pages.
 * Keyed by topic slug then mock number. Used to give each mock page
 * unique body content for SEO and learner guidance.
 *
 * THIS FILE IS GENERATED by the admin "Mock Intros CSV Import" tool.
 * Edits made by hand will be overwritten on the next CSV commit unless
 * exported back through CSV first.
 */

export type Difficulty = "Beginner" | "Intermediate" | "Exam-ready";

export type PerMockIntro = {
  difficulty: Difficulty;
  covers: string;
  commonMistakes: string[];
};

export type RelatedGuide = { label: string; href: string; intro: string };

export const RELATED_GUIDE_BY_TOPIC: Record<string, RelatedGuide> = {
${relatedBody}
};

export const PER_MOCK_INTROS: Record<string, Record<number, PerMockIntro>> = {
${intrasBody}
};

export function getPerMockIntro(
  topicSlug: string,
  mockNumber: number,
): PerMockIntro | undefined {
  return PER_MOCK_INTROS[topicSlug]?.[mockNumber];
}

export function getRelatedGuide(topicSlug: string): RelatedGuide | undefined {
  return RELATED_GUIDE_BY_TOPIC[topicSlug];
}
`;
}

// -------- Server functions --------

const PreviewInput = z.object({
  topicSlug: z.string().min(1).max(80).optional(),
  csvText: z.string().min(1).max(5_000_000),
  mode: ImportModeSchema,
});

const CommitInput = z.object({
  topicSlug: z.string().min(1).max(80).optional(),
  csvText: z.string().min(1).max(5_000_000),
  filename: z.string().min(1).max(255),
  expectedSha: z.string().min(1).max(120).optional(),
  mode: ImportModeSchema,
});

export const previewMockIntrosImport = createServerFn({ method: "POST" })
  .inputValidator((input) => PreviewInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const auth = await getAuthenticatedAdminClient();
      if (auth.error) {
        return {
          error: auth.error,
          parseErrors: [] as ParseIssue[],
          rowCount: 0,
          hasTopicColumn: false,
          diff: { addedCount: 0, changedCount: 0, unchangedCount: 0, rows: [] as IntroDiffRow[] },
          existingSha: undefined as string | undefined,
          filePath: FILE_PATH,
          mode: "patch" as "patch" | "replace",
          affectedTopics: [] as string[],
        };
      }

      const mode = data.mode ?? "patch";
      const parsed = parseIntrosCsv(data.csvText, data.topicSlug ?? null);
      const existing = await getFile(FILE_PATH);

      const current = cloneIntros(PER_MOCK_INTROS as IntrosMap);
      const affectedTopics = new Set(parsed.rows.map((r) => r.topicSlug));
      const next = applyRows(current, parsed.rows, mode, affectedTopics);
      const diff = diffIntros(current, next, parsed.rows);

      return {
        error: null as string | null,
        parseErrors: parsed.errors,
        rowCount: parsed.rows.length,
        hasTopicColumn: parsed.hasTopicColumn,
        diff,
        existingSha: existing?.sha,
        filePath: FILE_PATH,
        mode,
        affectedTopics: Array.from(affectedTopics).sort(),
      };
    } catch (err) {
      console.error("previewMockIntrosImport failed:", err);
      return {
        error: err instanceof Error ? err.message : "Preview failed",
        parseErrors: [] as ParseIssue[],
        rowCount: 0,
        hasTopicColumn: false,
        diff: { addedCount: 0, changedCount: 0, unchangedCount: 0, rows: [] as IntroDiffRow[] },
        existingSha: undefined as string | undefined,
        filePath: FILE_PATH,
        mode: "patch" as "patch" | "replace",
        affectedTopics: [] as string[],
      };
    }
  });

export const commitMockIntrosImport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => CommitInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabase, userId } = context;

    const mode = data.mode ?? "patch";
    const parsed = parseIntrosCsv(data.csvText, data.topicSlug ?? null);
    if (parsed.errors.length > 0) {
      const first = parsed.errors.slice(0, 5).map((e) => `• ${e.csvLine ? `row ${e.csvLine}: ` : ""}${e.message}`).join("\n");
      const more = parsed.errors.length > 5 ? `\n…and ${parsed.errors.length - 5} more.` : "";
      throw new Error(`CSV has ${parsed.errors.length} error${parsed.errors.length === 1 ? "" : "s"}:\n${first}${more}`);
    }
    if (parsed.rows.length === 0) throw new Error("No valid rows found in CSV.");

    try {
      const existing = await getFile(FILE_PATH);
      if (!existing) throw new Error(`File not found in repo: ${FILE_PATH}`);
      if (data.expectedSha && data.expectedSha !== existing.sha) {
        throw new Error("This file changed after preview. Refresh and preview again.");
      }

      const current = cloneIntros(PER_MOCK_INTROS as IntrosMap);
      const affectedTopics = new Set(parsed.rows.map((r) => r.topicSlug));
      const next = applyRows(current, parsed.rows, mode, affectedTopics);

      const newContent = serializePerMockIntrosFile(
        next,
        RELATED_GUIDE_BY_TOPIC as Record<string, RelatedGuide>,
      );

      const topicList = Array.from(affectedTopics).sort().join(", ");
      const commitMessage = `Update per-mock intros (${parsed.rows.length} row${parsed.rows.length === 1 ? "" : "s"}, ${affectedTopics.size} topic${affectedTopics.size === 1 ? "" : "s"}: ${topicList}) from admin CSV`;

      const { commitSha, commitUrl } = await commitFile({
        filePath: FILE_PATH,
        content: newContent,
        message: commitMessage,
        sha: existing.sha,
      });

      const { data: hist, error } = await supabase
        .from("question_import_history")
        .insert({
          topic: HISTORY_TOPIC,
          filename: data.filename,
          // Store the literal source so rollback is exact.
          previous_json: { kind: HISTORY_KIND, source: existing.content } as never,
          new_json: { kind: HISTORY_KIND, source: newContent } as never,
          commit_sha: commitSha,
          commit_url: commitUrl,
          row_count: parsed.rows.length,
          validation_log: {
            kind: HISTORY_KIND,
            mode,
            affectedTopics: Array.from(affectedTopics).sort(),
            hasTopicColumn: parsed.hasTopicColumn,
          } as never,
          status: "committed",
          created_by: userId,
        })
        .select("id")
        .single();
      if (error) throw new Error(`History insert failed: ${error.message}`);

      return {
        commitSha,
        commitUrl,
        historyId: hist.id,
        filePath: FILE_PATH,
        rowCount: parsed.rows.length,
        affectedTopics: Array.from(affectedTopics).sort(),
        mode,
        deploymentNote: "Changes committed to GitHub main. Deployment may take a few minutes.",
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await supabase.from("question_import_history").insert({
        topic: HISTORY_TOPIC,
        filename: data.filename,
        row_count: parsed.rows.length,
        status: "failed",
        error_log: message,
        validation_log: { kind: HISTORY_KIND, mode } as never,
        created_by: userId,
      });
      throw err;
    }
  });

export const rollbackMockIntrosImport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      historyId: z.string().uuid(),
      force: z.boolean().optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabase, userId } = context;

    const { data: row, error } = await supabase
      .from("question_import_history")
      .select("id, topic, previous_json, commit_sha, status, validation_log")
      .eq("id", data.historyId)
      .single();
    if (error || !row) throw new Error("Import history row not found");
    if (row.topic !== HISTORY_TOPIC) throw new Error("This history entry is not a mock-intros import.");
    const prev = row.previous_json as { kind?: string; source?: string } | null;
    if (!prev?.source) throw new Error("This import has no snapshot to roll back to");
    if ((row.status === "rolled_back" || row.status === "failed") && !data.force) {
      throw new Error(
        row.status === "rolled_back"
          ? "Already rolled back. Confirm again to roll back a second time."
          : "Previous rollback failed. Confirm again to retry.",
      );
    }

    try {
      const existing = await getFile(FILE_PATH);
      const { commitSha, commitUrl } = await commitFile({
        filePath: FILE_PATH,
        content: prev.source,
        message: `Rollback per-mock intros to commit ${String(row.commit_sha ?? "").slice(0, 7)}`,
        sha: existing?.sha,
      });

      await supabase
        .from("question_import_history")
        .update({
          status: "rolled_back",
          rolled_back_at: new Date().toISOString(),
          rolled_back_to_commit_sha: commitSha,
          error_log: null,
        })
        .eq("id", row.id);

      await supabase.from("question_import_history").insert({
        topic: HISTORY_TOPIC,
        filename: `[rollback of ${String(row.commit_sha ?? "").slice(0, 7)}]`,
        previous_json: null,
        new_json: { kind: HISTORY_KIND, source: prev.source } as never,
        commit_sha: commitSha,
        commit_url: commitUrl,
        row_count: null,
        status: "committed",
        created_by: userId,
        validation_log: { kind: HISTORY_KIND, rollback: true } as never,
      });

      return {
        commitSha,
        commitUrl,
        filePath: FILE_PATH,
        rolledBackAt: new Date().toISOString(),
        status: "rolled_back" as const,
        deploymentNote: "Rollback committed to GitHub main. Deployment may take a few minutes.",
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await supabase
        .from("question_import_history")
        .update({ status: "failed", error_log: `Rollback failed: ${message}` })
        .eq("id", row.id);
      throw err;
    }
  });

export const listMockIntrosImportHistory = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z.object({ limit: z.number().min(1).max(200).default(50) }).parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    try {
      const auth = await getAuthenticatedAdminClient();
      if (auth.error) return { rows: [], error: auth.error };
      const { supabase } = auth;

      const { data: rows, error } = await supabase
        .from("question_import_history")
        .select("id, filename, commit_sha, commit_url, row_count, status, error_log, created_at, validation_log, rolled_back_at")
        .eq("topic", HISTORY_TOPIC)
        .order("created_at", { ascending: false })
        .limit(data.limit);
      if (error) return { rows: [], error: error.message };

      const enriched = (rows ?? []).map((r) => {
        const vl = (r.validation_log ?? {}) as { affectedTopics?: string[]; mode?: string };
        return {
          ...r,
          affected_topics: Array.isArray(vl.affectedTopics) ? vl.affectedTopics : [],
          mode: vl.mode ?? null,
        };
      });
      return { rows: enriched, error: null as string | null };
    } catch (err) {
      console.error("listMockIntrosImportHistory failed:", err);
      return { rows: [], error: err instanceof Error ? err.message : "Failed to load history" };
    }
  });
