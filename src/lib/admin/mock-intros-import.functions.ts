/**
 * Per-Mock Intros CSV Import → GitHub.
 *
 * Mirrors src/lib/admin/csv-import.functions.ts but targets the static
 * data file `src/data/per-mock-intros.ts`. Supports two CSV shapes,
 * auto-detected by the presence of a `topic_slug` column:
 *
 *   1. Single topic (topic chosen via UI dropdown):
 *      mock,difficulty,covers,common_mistakes[,topics_included,who_this_mock_is_for,
 *      faq_question_1,faq_answer_1,faq_question_2,faq_answer_2,faq_question_3,faq_answer_3]
 *
 *   2. All topics in one CSV (topic dropdown ignored):
 *      topic_slug,mock,difficulty,covers,common_mistakes[,...same optional cols]
 *
 * `common_mistakes` and `topics_included` are pipe (`|`) separated lists.
 *
 * Missing optional fields fall back to safe, mock-number-aware defaults
 * generated server-side so two mocks never share an identical fallback.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Papa from "papaparse";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { commitFile, getBlob, getFile, nudgeSync } from "@/lib/admin/github.server";
import { categories } from "@/data/categories";
import {
  type PerMockIntro,
  type PerMockFaq,
  type Difficulty,
  type RelatedGuide,
} from "@/data/per-mock-intros";

// The data source of truth is the JSON file. The TS file is a thin
// re-export that imports the JSON and adds types — we never touch it
// from the importer. Reading and writing JSON means we always merge
// against the LIVE file content fetched from GitHub, not a stale
// in-memory snapshot bundled into the worker.
const FILE_PATH = "src/data/per-mock-intros.json";
const HISTORY_TOPIC = "_per_mock_intros_";
const HISTORY_KIND = "mock_intros";

type IntrosFileShape = {
  intros: Record<string, Record<string, PerMockIntro>>;
  related: Record<string, RelatedGuide>;
};

/** Parse the JSON file content fetched from GitHub. Returns null on parse failure. */
function parseIntrosFile(content: string): IntrosFileShape | null {
  try {
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== "object") return null;
    const intros = (parsed.intros && typeof parsed.intros === "object") ? parsed.intros : {};
    const related = (parsed.related && typeof parsed.related === "object") ? parsed.related : {};
    return { intros, related };
  } catch {
    return null;
  }
}

/** Coerce JSON shape (string mock keys) to in-memory shape (number mock keys). */
function jsonToIntrosMap(intros: Record<string, Record<string, PerMockIntro>>): IntrosMap {
  const out: IntrosMap = {};
  for (const [topic, byMock] of Object.entries(intros)) {
    out[topic] = {};
    for (const [mockStr, intro] of Object.entries(byMock)) {
      const n = Number(mockStr);
      if (Number.isInteger(n)) out[topic][n] = intro;
    }
  }
  return out;
}

const LIVE_ORIGIN = "https://www.uktesthub.com";
const VERIFY_MAX_ROWS = 20;
const VERIFY_TIMEOUT_MS = 12_000;

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

function splitPipeList(raw: string): string[] {
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// -------- Fallback generators (used when optional CSV cols are missing) --------

/**
 * Hash a string to a small non-negative integer. Used so two mocks with
 * different covers produce different fallback topic permutations.
 */
function smallHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const FALLBACK_TOPIC_POOL = [
  "Road signs and signals",
  "Hazard awareness in mixed conditions",
  "Safe speed and stopping distances",
  "Junction priority and observation",
  "Vulnerable road user awareness",
  "Lane discipline and road positioning",
  "Reading road markings",
  "Defensive driver decisions",
  "Vehicle safety and routine checks",
  "Reading the full scenario before answering",
  "Adapting to weather and visibility",
  "Mirrors, signals and manoeuvres",
];

function fallbackTopics(mockNumber: number, difficulty: Difficulty, covers: string): string[] {
  const seed = smallHash(`${mockNumber}|${difficulty}|${covers}`);
  const pool = [...FALLBACK_TOPIC_POOL];
  // Deterministic rotation so each mock starts the list at a different index.
  const start = seed % pool.length;
  const rotated = pool.slice(start).concat(pool.slice(0, start));

  const stagePrefix =
    difficulty === "Beginner"
      ? `Beginner-stage focus: foundations`
      : difficulty === "Intermediate"
        ? `Intermediate-stage focus: mixed scenarios`
        : `Exam-ready focus: timed accuracy`;

  return [`${stagePrefix} (Mock Test ${mockNumber})`, ...rotated.slice(0, 4)];
}

function fallbackWhoFor(mockNumber: number, difficulty: Difficulty): string {
  // Slight per-mock variation via a small phrase pool keyed by the mock number.
  const variants = [
    "build confidence",
    "check accuracy",
    "spot weak topics",
    "rehearse under quiz pressure",
    "consolidate earlier revision",
  ];
  const phrase = variants[mockNumber % variants.length];
  if (difficulty === "Beginner") {
    return `Mock Test ${mockNumber} suits learners starting their theory revision who want to ${phrase} with basic rules, signs and safe driving decisions before moving on to harder mocks.`;
  }
  if (difficulty === "Intermediate") {
    return `Mock Test ${mockNumber} suits learners who already know the basics and want to ${phrase} with mixed-topic, scenario-style practice.`;
  }
  return `Mock Test ${mockNumber} suits learners close to test day who want to ${phrase} across mixed Driving Theory topics under timed conditions.`;
}

function parseFaqsFromRow(r: Record<string, string>): PerMockFaq[] {
  const faqs: PerMockFaq[] = [];
  for (let i = 1; i <= 3; i++) {
    const q = (r[`faq_question_${i}`] ?? "").trim();
    const a = (r[`faq_answer_${i}`] ?? "").trim();
    if (q && a) faqs.push({ q, a });
  }
  return faqs;
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

    const commonMistakes = splitPipeList(r.common_mistakes ?? "");
    if (commonMistakes.length === 0) {
      errors.push({ csvLine, message: 'Empty "common_mistakes" (provide a pipe-separated list).' });
      return;
    }
    if (commonMistakes.length > 12) {
      errors.push({ csvLine, message: `Too many "common_mistakes" items (${commonMistakes.length}, max 12).` });
      return;
    }

    // Optional fields with fallbacks.
    const topicsCsv = splitPipeList(r.topics_included ?? "");
    if (topicsCsv.length > 12) {
      errors.push({ csvLine, message: `Too many "topics_included" items (${topicsCsv.length}, max 12).` });
      return;
    }
    const topicsIncluded =
      topicsCsv.length > 0 ? topicsCsv : fallbackTopics(mockNum, difficulty, covers);

    const whoForCsv = (r.who_this_mock_is_for ?? "").trim();
    if (whoForCsv.length > 800) {
      errors.push({
        csvLine,
        message: `"who_this_mock_is_for" is too long (${whoForCsv.length} chars, max 800).`,
      });
      return;
    }
    const whoFor = whoForCsv || fallbackWhoFor(mockNum, difficulty);

    const faqs = parseFaqsFromRow(r);

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
      intro: {
        difficulty,
        covers,
        commonMistakes,
        topicsIncluded,
        whoFor,
        ...(faqs.length > 0 ? { faqs } : {}),
      },
    });
  });

  return { rows, errors, hasTopicColumn };
}

/**
 * Detect identical content across mocks within the same topic.
 * Returns a list of human-readable warnings — does NOT block the upload.
 */
export type DuplicateWarning = { message: string; topicSlug: string; field: string; mocks: number[] };

function detectDuplicateContent(next: IntrosMap, affectedTopics: Set<string>): DuplicateWarning[] {
  const warnings: DuplicateWarning[] = [];
  const fields: Array<{
    key: keyof PerMockIntro;
    label: string;
    extract: (i: PerMockIntro) => string;
  }> = [
    { key: "covers", label: "covers", extract: (i) => i.covers.trim().toLowerCase() },
    {
      key: "topicsIncluded",
      label: "topics_included",
      extract: (i) =>
        (i.topicsIncluded ?? []).map((s) => s.trim().toLowerCase()).join("|"),
    },
    {
      key: "whoFor",
      label: "who_this_mock_is_for",
      extract: (i) => (i.whoFor ?? "").trim().toLowerCase(),
    },
    {
      key: "commonMistakes",
      label: "common_mistakes",
      extract: (i) => i.commonMistakes.map((s) => s.trim().toLowerCase()).join("|"),
    },
  ];

  for (const topic of affectedTopics) {
    const byMock = next[topic] ?? {};
    for (const f of fields) {
      const buckets = new Map<string, number[]>();
      for (const [mockStr, intro] of Object.entries(byMock)) {
        const sig = f.extract(intro);
        if (!sig) continue;
        const arr = buckets.get(sig) ?? [];
        arr.push(Number(mockStr));
        buckets.set(sig, arr);
      }
      for (const [, mocks] of buckets) {
        if (mocks.length >= 2) {
          warnings.push({
            topicSlug: topic,
            field: f.label,
            mocks: mocks.sort((a, b) => a - b),
            message: `${topic}: "${f.label}" is identical across mocks ${mocks
              .sort((a, b) => a - b)
              .join(", ")}. Pages may look template-like.`,
          });
        }
      }
    }
  }
  return warnings;
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

// -------- File serializer (JSON) --------

/**
 * Serialize the in-memory intros map back to the JSON-on-disk shape.
 * Keys are sorted for deterministic diffs.
 */
function serializePerMockIntrosFile(
  intros: IntrosMap,
  related: Record<string, RelatedGuide>,
): string {
  const sortedIntros: Record<string, Record<string, PerMockIntro>> = {};
  for (const topic of Object.keys(intros).sort()) {
    const byMock = intros[topic] ?? {};
    const mockNums = Object.keys(byMock)
      .map((n) => Number(n))
      .filter((n) => Number.isInteger(n))
      .sort((a, b) => a - b);
    const inner: Record<string, PerMockIntro> = {};
    for (const n of mockNums) inner[String(n)] = byMock[n];
    sortedIntros[topic] = inner;
  }
  const sortedRelated: Record<string, RelatedGuide> = {};
  for (const t of Object.keys(related).sort()) sortedRelated[t] = related[t];

  return JSON.stringify({ intros: sortedIntros, related: sortedRelated }, null, 2) + "\n";
}

/**
 * Fetch + parse the LIVE intros JSON from GitHub. This is the merge base
 * for every preview and commit — never use the bundled PER_MOCK_INTROS
 * import, because that is whatever was baked into the deployed worker
 * and goes stale after every CSV import.
 *
 * Returns { current, related, existing } so callers can also reuse the
 * GitHub blob `sha` for optimistic concurrency on commit.
 */
async function loadLiveIntros(): Promise<{
  current: IntrosMap;
  related: Record<string, RelatedGuide>;
  existing: { content: string; sha: string };
}> {
  const existing = await getFile(FILE_PATH);
  if (!existing) {
    throw new Error(
      `File not found in repo: ${FILE_PATH}. ` +
        `The source of truth must exist before imports can run.`,
    );
  }
  const parsed = parseIntrosFile(existing.content);
  if (!parsed) {
    throw new Error(
      `Could not parse ${FILE_PATH} as JSON. Refusing to import — ` +
        `the file may have been hand-edited or corrupted.`,
    );
  }
  return {
    current: jsonToIntrosMap(parsed.intros),
    related: parsed.related,
    existing,
  };
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
          duplicateWarnings: [] as DuplicateWarning[],
        };
      }

      const mode = data.mode ?? "patch";
      const parsed = parseIntrosCsv(data.csvText, data.topicSlug ?? null);
      // Fetch the LIVE file from GitHub and use that as the merge base.
      // Never use the bundled PER_MOCK_INTROS — it goes stale after every
      // deployment and was the cause of the old "imports wipe other topics"
      // bug.
      const { current, existing } = await loadLiveIntros();
      const affectedTopics = new Set(parsed.rows.map((r) => r.topicSlug));
      const next = applyRows(current, parsed.rows, mode, affectedTopics);
      const diff = diffIntros(current, next, parsed.rows);
      const duplicateWarnings = detectDuplicateContent(next, affectedTopics);

      return {
        error: null as string | null,
        parseErrors: parsed.errors,
        rowCount: parsed.rows.length,
        hasTopicColumn: parsed.hasTopicColumn,
        diff,
        existingSha: existing.sha,
        filePath: FILE_PATH,
        mode,
        affectedTopics: Array.from(affectedTopics).sort(),
        duplicateWarnings,
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
        duplicateWarnings: [] as DuplicateWarning[],
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
      // Always merge against the LIVE GitHub file, never the bundled
      // snapshot. loadLiveIntros() also fetches the SHA we'll use for
      // the optimistic-concurrency check on commit.
      const { current, related, existing } = await loadLiveIntros();
      if (data.expectedSha && data.expectedSha !== existing.sha) {
        throw new Error("This file changed after preview. Refresh and preview again.");
      }

      const affectedTopics = new Set(parsed.rows.map((r) => r.topicSlug));
      const next = applyRows(current, parsed.rows, mode, affectedTopics);

      // SAFETY: no commit may ever silently drop a topic that wasn't
      // part of this CSV. Compare topic sets before/after; the only
      // allowed difference is *new* topics from the CSV.
      const currentTopics = new Set(Object.keys(current));
      const nextTopics = new Set(Object.keys(next));
      const dropped: string[] = [];
      for (const t of currentTopics) {
        if (!nextTopics.has(t)) dropped.push(t);
      }
      if (dropped.length > 0) {
        throw new Error(
          `Refusing to commit: ${dropped.length} topic(s) would be removed ` +
            `that were not part of this CSV: ${dropped.slice(0, 10).join(", ")}${
              dropped.length > 10 ? `, …(+${dropped.length - 10})` : ""
            }. This is the bug-guard for stale-snapshot wipes.`,
        );
      }
      // In replace mode, applyRows already restricts the wipe to
      // affectedTopics only — but assert it just in case the caller
      // somehow widens the affected set.
      if (mode === "replace") {
        for (const t of affectedTopics) {
          if (!nextTopics.has(t) || Object.keys(next[t] ?? {}).length === 0) {
            // This means the CSV produced no rows for a topic it claimed
            // to affect — block rather than ship an empty topic.
            throw new Error(
              `Refusing to commit: replace-mode CSV produced no rows for topic "${t}".`,
            );
          }
        }
      }

      const newContent = serializePerMockIntrosFile(next, related);

      const topicList = Array.from(affectedTopics).sort().join(", ");
      const commitMessage = `Update per-mock intros (${parsed.rows.length} row${parsed.rows.length === 1 ? "" : "s"}, ${affectedTopics.size} topic${affectedTopics.size === 1 ? "" : "s"}: ${topicList}) from admin CSV`;

      const { commitSha, commitUrl } = await commitFile({
        filePath: FILE_PATH,
        content: newContent,
        message: commitMessage,
        sha: existing.sha,
      });

      // Force Lovable's GitHub sync to re-fire (see nudgeSync docs).
      await nudgeSync(`mock-intros import: ${parsed.rows.length} rows, ${affectedTopics.size} topic(s)`);

      const { data: hist, error } = await supabase
        .from("question_import_history")
        .insert({
          topic: HISTORY_TOPIC,
          filename: data.filename,
          // Store the literal source so rollback is exact.
          // Store only blob sha references — the JSON file is ~3.7 MB and
          // inserting it inline times out Postgres. Rollback fetches by sha.
          previous_json: { kind: HISTORY_KIND, blobSha: existing.sha, path: FILE_PATH } as never,
          new_json: { kind: HISTORY_KIND, commitSha, path: FILE_PATH } as never,
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

      const verificationRows: VerifyRowInput[] = parsed.rows.map((r) => ({
        topicSlug: r.topicSlug,
        mock: r.mock,
        snippet: snippetForCovers(r.intro.covers),
      }));

      return {
        commitSha,
        commitUrl,
        historyId: hist.id,
        filePath: FILE_PATH,
        rowCount: parsed.rows.length,
        affectedTopics: Array.from(affectedTopics).sort(),
        mode,
        deploymentNote: "Changes committed to GitHub main. Deployment may take a few minutes — the live site is verified separately below.",
        verificationRows,
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
    const prev = row.previous_json as { kind?: string; source?: string; blobSha?: string } | null;
    if (!prev?.source && !prev?.blobSha) throw new Error("This import has no snapshot to roll back to");
    if ((row.status === "rolled_back" || row.status === "failed") && !data.force) {
      throw new Error(
        row.status === "rolled_back"
          ? "Already rolled back. Confirm again to roll back a second time."
          : "Previous rollback failed. Confirm again to retry.",
      );
    }

    try {
      // Resolve the previous file content: either inline (legacy rows) or
      // by fetching the git blob via sha (current rows).
      const prevSource = prev.source ?? (prev.blobSha ? await getBlob(prev.blobSha) : "");
      // GUARD: history rows from before the JSON migration stored the
      // old TypeScript file source. Reject if it isn't JSON.
      if (!parseIntrosFile(prevSource)) {
        throw new Error(
          "This history snapshot pre-dates the JSON migration and " +
            "cannot be rolled back to the new JSON source of truth. " +
            "Re-import the CSV instead.",
        );
      }
      const existing = await getFile(FILE_PATH);
      const { commitSha, commitUrl } = await commitFile({
        filePath: FILE_PATH,
        content: prevSource,
        message: `Rollback per-mock intros to commit ${String(row.commit_sha ?? "").slice(0, 7)}`,
        sha: existing?.sha,
      });

      await nudgeSync(`mock-intros rollback of ${String(row.commit_sha ?? "").slice(0, 7)}`);



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
        new_json: { kind: HISTORY_KIND, commitSha, path: FILE_PATH } as never,
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
      if (auth.error || !auth.supabase) return { rows: [], error: auth.error ?? "Not signed in" };
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

// -------- Live verification --------

export type VerifyRowInput = {
  topicSlug: string;
  mock: number;
  /** Short snippet of the `covers` text that MUST appear on the live page. */
  snippet: string;
};

export type VerifyRowResult = {
  topicSlug: string;
  mock: number;
  url: string;
  status: "verified" | "stale" | "error";
  httpStatus?: number;
  message?: string;
};

function buildLiveMockUrl(topicSlug: string, mock: number): string {
  // Cache-bust so we never read a stale CDN/browser cached HTML.
  const cb = Date.now().toString(36);
  return `${LIVE_ORIGIN}/quiz/${topicSlug}-mock-${mock}?_cb=${cb}`;
}

function snippetForCovers(covers: string): string {
  // Use first ~80 chars after trimming, stripping smart quotes/whitespace
  // so the substring match is stable across SSR HTML.
  const clean = covers.replace(/\s+/g, " ").trim();
  return clean.slice(0, 80);
}

async function checkOneLiveUrl(input: VerifyRowInput): Promise<VerifyRowResult> {
  const url = buildLiveMockUrl(input.topicSlug, input.mock);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Cache-Control": "no-cache",
        "User-Agent": "uktesthub-admin-verifier",
      },
    });
    const httpStatus = res.status;
    if (!res.ok) {
      return {
        topicSlug: input.topicSlug,
        mock: input.mock,
        url,
        status: "error",
        httpStatus,
        message: `HTTP ${httpStatus}`,
      };
    }
    const body = await res.text();
    const normalisedBody = body.replace(/\s+/g, " ");
    const normalisedSnippet = input.snippet.replace(/\s+/g, " ").trim();
    if (normalisedSnippet && normalisedBody.includes(normalisedSnippet)) {
      return { topicSlug: input.topicSlug, mock: input.mock, url, status: "verified", httpStatus };
    }
    return {
      topicSlug: input.topicSlug,
      mock: input.mock,
      url,
      status: "stale",
      httpStatus,
      message: "Uploaded text not yet on live page",
    };
  } catch (e) {
    return {
      topicSlug: input.topicSlug,
      mock: input.mock,
      url,
      status: "error",
      message: e instanceof Error ? e.message : String(e),
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Sample down to VERIFY_MAX_ROWS so a 45-row import doesn't take 90s. */
function sampleRowsForVerification(rows: VerifyRowInput[]): VerifyRowInput[] {
  if (rows.length <= VERIFY_MAX_ROWS) return rows;
  const step = rows.length / VERIFY_MAX_ROWS;
  const out: VerifyRowInput[] = [];
  for (let i = 0; i < VERIFY_MAX_ROWS; i++) {
    out.push(rows[Math.floor(i * step)]);
  }
  return out;
}

const VerifyInput = z.object({
  rows: z
    .array(
      z.object({
        topicSlug: z.string().min(1).max(80),
        mock: z.number().int().min(1).max(45),
        snippet: z.string().min(1).max(500),
      }),
    )
    .min(1)
    .max(5000),
});

export const verifyMockIntrosLive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => VerifyInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sample = sampleRowsForVerification(data.rows);
    // Run in small parallel batches so we don't hammer the origin.
    const results: VerifyRowResult[] = [];
    const batchSize = 4;
    for (let i = 0; i < sample.length; i += batchSize) {
      const batch = sample.slice(i, i + batchSize);
      const settled = await Promise.all(batch.map(checkOneLiveUrl));
      results.push(...settled);
    }
    const verified = results.filter((r) => r.status === "verified").length;
    const stale = results.filter((r) => r.status === "stale").length;
    const errors = results.filter((r) => r.status === "error").length;
    return {
      checkedAt: new Date().toISOString(),
      totalRequested: data.rows.length,
      totalChecked: results.length,
      verified,
      stale,
      errors,
      results,
    };
  });

export { snippetForCovers };
