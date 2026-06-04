import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Papa from "papaparse";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { GITHUB_REPO, commitFile, getFile, listDir, nudgeSync, testConnection } from "@/lib/admin/github.server";
import { findOptionIssues, type OptionIssue } from "@/lib/admin/blank-options";

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

type Issue = {
  rowIndex: number | null; // 1-based CSV row (data row, not header). null = file-level.
  id: string | null;
  field: string | null;
  message: string;
};
type ValidationResult = { errors: Issue[]; warnings: Issue[] };

function emptyValidation(): ValidationResult {
  return { errors: [], warnings: [] };
}

function emptyPreview(error: string, parseErrors: string[] = []) {
  return {
    error,
    parseErrors,
    rowCount: 0,
    diff: { addedCount: 0, changedCount: 0, removedCount: 0, added: [], changed: [], removed: [] },
    oldBankSize: 0,
    newBankSize: 0,
    oldMockCount: 0,
    newMockCount: 0,
    unusedQuestionCount: 0,
    replaceTargets: null as null | { mockCount: number; questionsPerMock: number; totalSlots: number; uniqueQuestions: number; maxUsesPerQuestion: number },
    validation: emptyValidation(),
    existingSha: undefined as string | undefined,
    filePath: "",
    topic: "",
    mode: undefined as "patch" | "replace" | undefined,
    branch: GITHUB_REPO.branch,
  };
}

type MockMeta = { mockNumber: number | null; questionNumber: number | null };

/** Parse a CSV string into question patch rows.
 *
 * Modes:
 *  - "patch"   (default): missing/blank cells are IGNORED — existing JSON values
 *              are preserved. Use the literal cell value `__CLEAR__` to remove
 *              a field from the JSON.
 *  - "replace": blank cells REMOVE the corresponding field from the JSON.
 *              `__CLEAR__` still works and is equivalent.
 */
const CLEAR_MARKER = "__CLEAR__";

function parseCsv(csvText: string, mode: "patch" | "replace" = "patch"): {
  rows: AnyQ[];
  rowLines: number[];
  presentByRow: Set<string>[];
  clearByRow: Set<string>[];
  mockMetaByRow: MockMeta[];
  errors: string[];
} {
  const out = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  const errors = out.errors.map((e) => `Row ${e.row}: ${e.message}`);
  const headers = new Set((out.meta.fields ?? []).map((h) => h.trim()));
  const has = (col: string) => headers.has(col);

  type CellResult =
    | { kind: "clear" }
    | { kind: "blank" }
    | { kind: "value"; value: string };
  const readCell = (raw: string): CellResult => {
    const trimmed = (raw ?? "").trim();
    if (trimmed === CLEAR_MARKER) return { kind: "clear" };
    if (trimmed === "") return { kind: "blank" };
    return { kind: "value", value: raw };
  };

  const pickOption = (
    r: Record<string, string>,
    letter: "A" | "B" | "C" | "D",
  ): CellResult | null => {
    const variants = [
      `option${letter}`,
      letter,
      `options.${letter}`,
      `options.${letter.toLowerCase()}`,
      `option_${letter.toLowerCase()}`,
    ];
    for (const v of variants) {
      if (has(v)) return readCell(r[v] ?? "");
    }
    return null;
  };
  const optionColumnsPresent =
    has("optionA") || has("A") || has("options.A") || has("option_a") ||
    has("optionB") || has("B") || has("options.B") || has("option_b") ||
    has("optionC") || has("C") || has("options.C") || has("option_c") ||
    has("optionD") || has("D") || has("options.D") || has("option_d");

  const rows: AnyQ[] = [];
  const rowLines: number[] = [];
  const presentByRow: Set<string>[] = [];
  const clearByRow: Set<string>[] = [];
  const mockMetaByRow: MockMeta[] = [];

  const readIntCell = (v: string | undefined): number | null => {
    const s = (v ?? "").trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) && Number.isInteger(n) ? n : null;
  };

  const scalarFields: Array<{
    col: string;
    key: string;
    transform?: (raw: string) => unknown;
  }> = [
    { col: "type", key: "type", transform: (s) => s.trim() },
    { col: "question", key: "question" },
    { col: "explanation", key: "explanation" },
    { col: "image", key: "image", transform: (s) => s.trim() },
    { col: "imageAlt", key: "imageAlt", transform: (s) => s.trim() },
  ];

  out.data.forEach((r, i) => {
    const csvLine = i + 2;
    const id = (r.id ?? "").trim();
    if (!id) {
      errors.push(`Row ${csvLine}: missing required "id" — row skipped.`);
      return;
    }
    const q: AnyQ = { id };
    const present = new Set<string>(["id"]);
    const clear = new Set<string>();

    const applyCell = (
      cell: CellResult,
      key: string,
      onValue: () => void,
    ) => {
      if (cell.kind === "clear") {
        clear.add(key);
        present.add(key);
        return;
      }
      if (cell.kind === "blank") {
        if (mode === "replace") {
          clear.add(key);
          present.add(key);
        }
        return;
      }
      onValue();
      present.add(key);
    };

    for (const f of scalarFields) {
      if (!has(f.col)) continue;
      const cell = readCell(r[f.col] ?? "");
      applyCell(cell, f.key, () => {
        const raw = (cell as { value: string }).value;
        q[f.key] = f.transform ? f.transform(raw) : raw;
      });
    }

    if (optionColumnsPresent) {
      const opts: string[] = [];
      let anyValue = false;
      let anyCleared = false;
      let anyBlank = false;
      for (const L of ["A", "B", "C", "D"] as const) {
        const cell = pickOption(r, L);
        if (cell === null) {
          opts.push("");
          continue;
        }
        if (cell.kind === "value") {
          opts.push(cell.value);
          anyValue = true;
        } else if (cell.kind === "clear") {
          opts.push("");
          anyCleared = true;
        } else {
          opts.push("");
          anyBlank = true;
        }
      }
      while (opts.length && opts[opts.length - 1] === "") opts.pop();
      if (opts.length > 0) {
        q.options = opts;
        present.add("options");
      } else if (anyCleared || (mode === "replace" && anyBlank && !anyValue)) {
        clear.add("options");
        present.add("options");
      }
    } else if (has("options")) {
      const cell = readCell(r.options ?? "");
      applyCell(cell, "options", () => {
        const opts = (cell as { value: string }).value
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean);
        if (opts.length) q.options = opts;
      });
    }

    if (has("correctAnswers")) {
      const cell = readCell(r.correctAnswers ?? "");
      applyCell(cell, "correctAnswers", () => {
        const raw = (cell as { value: string }).value.trim();
        if (raw.toLowerCase() === "null") return;
        let arr: number[] | null = null;
        if (raw.startsWith("[")) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              arr = parsed.map((n) => Number(n)).filter((n) => Number.isFinite(n));
            }
          } catch { /* fall through */ }
        }
        if (!arr) {
          arr = raw.split(/[|,]/).map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
        }
        if (arr.length > 0) q.correctAnswers = arr;
      });
    }

    if (has("correctAnswer")) {
      const cell = readCell(r.correctAnswer ?? "");
      applyCell(cell, "correctAnswer", () => {
        const raw = (cell as { value: string }).value;
        const s = raw.trim();
        if (s.toLowerCase() === "null") return;
        const lower = s.toLowerCase();
        if (lower === "true" || lower === "false") {
          q.correctAnswer = lower === "true";
        } else if (/^-?\d+(\.\d+)?$/.test(s)) {
          q.correctAnswer = Number(s);
        } else {
          q.correctAnswer = s;
        }
      });
    }

    rows.push(q);
    rowLines.push(csvLine);
    presentByRow.push(present);
    clearByRow.push(clear);
    // Mock assignment hints — optional CSV columns.
    const mockNumber =
      readIntCell(r.mockNumber) ?? readIntCell(r.mockTest) ?? readIntCell(r.mock_number) ?? readIntCell(r.mock);
    const questionNumber =
      readIntCell(r.questionNumber) ?? readIntCell(r.question_number) ?? readIntCell(r.qNumber);
    mockMetaByRow.push({ mockNumber, questionNumber });
  });

  return { rows, rowLines, presentByRow, clearByRow, mockMetaByRow, errors };
}

/* ----------------- Validation ----------------- */

const KNOWN_TYPES = new Set([
  "mcq", "multiple_choice", "multiple-choice",
  "true_false", "true-false", "tf",
  "multiple_response", "multiple-response",
  "image_question", "image-question",
  "fill-blanks", "dropdown_blanks", "drag-drop-blanks", "drag_drop_blanks",
  "numeric-entry", "numeric_entry",
  "hot-spot", "hot_spot",
]);

function canonType(v: unknown): string {
  const s = String(v ?? "").toLowerCase().replace(/[-\s]+/g, "_");
  if (s === "mcq") return "multiple_choice";
  if (s === "tf" || s === "truefalse") return "true_false";
  return s;
}

function isImagePathLikely(s: string): boolean {
  if (!s) return false;
  if (/^https?:\/\//i.test(s)) return true;
  if (s.startsWith("/")) return true;
  return false;
}

/** Infer a question type from available fields when neither CSV row nor
 * existing question carries one. Returns "" if undetermined. */
function inferType(q: AnyQ): string {
  if (Array.isArray(q.correctAnswers) && q.correctAnswers.length > 0) return "multiple_response";
  if (typeof q.correctAnswer === "boolean") return "true_false";
  if (Array.isArray(q.options) && q.options.length >= 2) {
    if (q.image) return "image_question";
    return "multiple_choice";
  }
  if (q.image) return "image_question";
  return "";
}

/** Normalize correctAnswer to a usable form against options. Accepts:
 *   - number (0-based or 1-based when 1-based clearly indicates overflow)
 *   - letter "A".."Z"
 *   - exact answer text matching an option (case-insensitive)
 * Returns the normalized value, or the input unchanged if no normalization applies. */
function normalizeCorrectAnswer(ca: unknown, options: unknown[]): unknown {
  if (ca == null || ca === "") return ca;
  const optsLen = Array.isArray(options) ? options.length : 0;
  if (typeof ca === "number") {
    if (Number.isInteger(ca) && optsLen > 0 && ca >= 1 && ca === optsLen) {
      // ambiguous: treat as 1-based only when it exactly equals options.length and is out of 0-based range
      return ca - 1;
    }
    return ca;
  }
  if (typeof ca === "string") {
    const s = ca.trim();
    if (s === "") return ca;
    if (/^[A-Za-z]$/.test(s) && optsLen > 0) {
      const idx = s.toUpperCase().charCodeAt(0) - 65;
      if (idx >= 0 && idx < optsLen) return idx;
    }
    if (/^-?\d+$/.test(s)) {
      const n = Number(s);
      if (optsLen > 0 && n >= 1 && n === optsLen) return n - 1;
      return n;
    }
    if (optsLen > 0) {
      const i = options.findIndex(
        (o) => typeof o === "string" && o.trim().toLowerCase() === s.toLowerCase(),
      );
      if (i >= 0) return i;
    }
    return s;
  }
  return ca;
}

/** Extract significant keywords from a road-signs image filename for semantic
 *  comparison against question text. e.g. "/road-signs/give_way_to_traffic.png"
 *  → ["give","way","traffic"]. Skips very short and noise tokens. */
const RS_STOPWORDS = new Set([
  "the","a","an","of","to","on","in","and","or","for","with","at","by","is",
  "are","be","road","sign","signs","png","jpg","jpeg","webp","svg",
  "1","2","3","4","5","6","7","8","9","0",
]);
function roadSignKeywords(imagePath: string): string[] {
  const base = imagePath.replace(/^.*\//, "").replace(/\.[a-z0-9]+$/i, "");
  return base
    .toLowerCase()
    .split(/[_\-\s]+/)
    .filter((w) => w.length >= 3 && !RS_STOPWORDS.has(w));
}

function validateImported(
  mergedById: Map<string, AnyQ>,
  rowIds: string[],
  rowLines: number[],
  newFile: MockFile,
  topic: string,
  roadSignFiles: Set<string> | null,
  useExplicit: boolean = false,
): ValidationResult {

  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const seen = new Map<string, number>();

  rowIds.forEach((id, i) => {
    const line = rowLines[i] ?? null;
    const q = mergedById.get(id) ?? { id };
    const push = (arr: Issue[], field: string | null, message: string) =>
      arr.push({ rowIndex: line, id: id || null, field, message });

    if (id) {
      if (seen.has(id)) {
        if (!useExplicit) {
          push(errors, "id", `Duplicate id "${id}" (also on row ${seen.get(id)}).`);
        }
      } else {
        seen.set(id, line ?? 0);
      }
    }

    // Determine effective type: explicit > inferred. Only block if unresolvable.
    let typeStr = q.type ? String(q.type) : "";
    if (!typeStr) {
      const inferred = inferType(q);
      if (inferred) {
        typeStr = inferred;
        warnings.push({ rowIndex: line, id, field: "type", message: `Type missing — inferred "${inferred}".` });
      } else {
        push(errors, "type", "Missing type and could not be inferred.");
      }
    } else if (!KNOWN_TYPES.has(typeStr.toLowerCase()) && !KNOWN_TYPES.has(canonType(typeStr))) {
      push(errors, "type", `Unknown question type "${typeStr}".`);
    }
    const t = canonType(typeStr);

    const usesTemplate = t === "fill_blanks" || t === "dropdown_blanks" || t === "drag_drop_blanks";
    const promptText = (q.question ?? q.template ?? q.prompt ?? "").toString().trim();
    if (!promptText) {
      push(errors, usesTemplate ? "template" : "question", "Question text is empty after merge.");
    }
    if (!String(q.explanation ?? "").trim()) {
      push(warnings, "explanation", "Explanation is empty.");
    }

    const options: unknown[] = Array.isArray(q.options) ? q.options : [];

    if (t === "multiple_choice" || t === "image_question") {
      if (options.length < 2) {
        push(errors, "options", `Multiple-choice needs at least 2 options after merge; got ${options.length}.`);
      }
      const ca = normalizeCorrectAnswer(q.correctAnswer, options);
      if (ca === undefined || ca === null || ca === "") {
        push(errors, "correctAnswer", "Correct answer is missing after merge.");
      } else if (typeof ca === "number") {
        if (!Number.isInteger(ca) || ca < 0 || ca >= options.length) {
          push(errors, "correctAnswer", `Correct answer index ${ca} is out of range (0–${Math.max(0, options.length - 1)}).`);
        }
      } else if (typeof ca === "string") {
        if (!options.map(String).includes(ca)) {
          push(errors, "correctAnswer", `Correct answer "${ca}" does not match any option after merge.`);
        }
      }
    }

    if (t === "multiple_response") {
      if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
        push(errors, "correctAnswers", "Multi-select requires correctAnswers after merge.");
      } else {
        for (const idx of q.correctAnswers as number[]) {
          if (!Number.isInteger(idx) || idx < 0 || idx >= options.length) {
            push(errors, "correctAnswers", `correctAnswers index ${idx} is out of range (0–${Math.max(0, options.length - 1)}).`);
          }
        }
      }
      if (options.length < 2) {
        push(errors, "options", `Multi-select needs ≥2 options; got ${options.length}.`);
      }
    }

    if (t === "true_false") {
      if (typeof q.correctAnswer !== "boolean") {
        push(errors, "correctAnswer", "True/False requires correctAnswer of true or false.");
      }
    }

    if (t === "image_question") {
      if (!q.image || typeof q.image !== "string" || !q.image.trim()) {
        push(errors, "image", "Image question requires an image path.");
      } else if (!isImagePathLikely(q.image)) {
        push(warnings, "image", `Image path "${q.image}" should be a URL or start with "/".`);
      }
      if (!q.imageAlt || typeof q.imageAlt !== "string" || !q.imageAlt.trim()) {
        push(warnings, "imageAlt", "Image question should have imageAlt text.");
      }
    }

    if (usesTemplate) {
      if (!Array.isArray(q.blanks) || q.blanks.length === 0) {
        push(warnings, "blanks", "Fill/dropdown/drag types need a `blanks` array — edit JSON directly.");
      } else if (t === "dropdown_blanks" || t === "drag_drop_blanks") {
        // Block any malformed dropdown option (JSON-key/template leak).
        for (let bi = 0; bi < (q.blanks as { options?: unknown[] }[]).length; bi++) {
          const opts = Array.isArray((q.blanks as { options?: unknown[] }[])[bi].options)
            ? ((q.blanks as { options?: unknown[] }[])[bi].options as unknown[])
            : [];
          for (let oi = 0; oi < opts.length; oi++) {
            const issues = findOptionIssues(opts[oi]);
            if (issues.length > 0) {
              push(
                errors,
                "blanks",
                `Blank ${bi} option ${oi} is malformed (${issues.map((x) => x.fragment).join(", ")}). Dropdown options must be clean words only — never JSON/template fragments.`,
              );
            }
          }
        }
      }
    }

    // ----- Road Signs topic-specific protection -----
    if (topic === "road-signs" && typeof q.image === "string" && q.image.trim()) {
      const img = q.image.trim();
      const isValidPrefix = img.startsWith("/road-signs/") || img.startsWith("/motorway-rules/");
      if (!isValidPrefix) {
        push(errors, "image", `Road Signs image path must start with "/road-signs/" or "/motorway-rules/" — got "${img}".`);
      } else if (roadSignFiles) {
        const prefix = img.startsWith("/road-signs/") ? "/road-signs/" : "/motorway-rules/";
        const name = img.replace(new RegExp(`^${prefix.replace("/", "\\/")}`), "").split("?")[0].split("#")[0];
        if (!roadSignFiles.has(name)) {
          push(errors, "image", `Road Signs image file not found in repo: public${prefix}${name}.`);
        }
      }
      if (!q.imageAlt || typeof q.imageAlt !== "string" || !q.imageAlt.trim()) {
        push(warnings, "imageAlt", "Road Signs image is missing imageAlt text.");
      }
      // Semantic mismatch: keywords from filename should appear in question/explanation/imageAlt.
      const kws = roadSignKeywords(img);
      if (kws.length > 0) {
        const haystack = [
          q.question, q.explanation, q.imageAlt,
          Array.isArray(q.options) ? q.options.join(" ") : "",
          typeof q.correctAnswer === "string" ? q.correctAnswer : "",
        ].map((s) => String(s ?? "").toLowerCase()).join(" \n ");
        const hit = kws.some((w) => haystack.includes(w));
        if (!hit) {
          push(warnings, "image",
            `Possible mismatch: image "${img}" suggests [${kws.join(", ")}] but none of those words appear in the question text, explanation, options, or imageAlt. Review before commit.`);
        }
      }
    }
  });


  // JSON validity (blocking)
  try {
    JSON.parse(JSON.stringify(newFile));
  } catch (e) {
    errors.push({ rowIndex: null, id: null, field: null, message: `Generated JSON is invalid: ${e instanceof Error ? e.message : String(e)}` });
  }

  // Topic mismatch is blocking; mock-structure counts are warnings only.
  if ((newFile as V2File).version === 2) {
    const v2 = newFile as V2File;
    if (v2.topic && v2.topic !== topic) {
      errors.push({ rowIndex: null, id: null, field: "topic", message: `File topic "${v2.topic}" does not match URL topic "${topic}".` });
    }
    for (const m of v2.mocks ?? []) {
      if (Array.isArray(m.questionIds) && m.questionIds.length !== 24) {
        warnings.push({ rowIndex: null, id: null, field: "mocks", message: `Mock ${m.mockNumber} has ${m.questionIds.length} questions (expected 24).` });
      }
    }
    if ((v2.mocks?.length ?? 0) < 45) {
      warnings.push({ rowIndex: null, id: null, field: "mocks", message: `Topic has ${v2.mocks?.length ?? 0} mock tests (expected 45).` });
    }
  } else if ((newFile as V1File).tests) {
    const v1 = newFile as V1File;
    if (v1.topic && v1.topic !== topic) {
      errors.push({ rowIndex: null, id: null, field: "topic", message: `File topic "${v1.topic}" does not match URL topic "${topic}".` });
    }
    for (const t of v1.tests ?? []) {
      if (t.questions.length !== 24) {
        warnings.push({ rowIndex: null, id: null, field: "tests", message: `Mock ${t.mockNumber} has ${t.questions.length} questions (expected 24).` });
      }
    }
    if ((v1.tests?.length ?? 0) < 45) {
      warnings.push({ rowIndex: null, id: null, field: "tests", message: `Topic has ${v1.tests?.length ?? 0} mock tests (expected 45).` });
    }
  }

  return { errors, warnings };
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
    const canonType = (v: unknown) => {
      const s = String(v ?? "").toLowerCase().replace(/[-\s]+/g, "_");
      if (s === "mcq") return "multiple_choice";
      if (s === "tf" || s === "truefalse") return "true_false";
      return s;
    };
    for (const key of Object.keys(q)) {
      let a = prev[key];
      let b = q[key];
      if (key === "type") {
        a = canonType(a);
        b = canonType(b);
      }
      if (!valuesEqual(a, b)) fields.push(key);
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

/** Remove fields that are incompatible with the question's effective type.
 * Runs after every per-row merge so type changes (e.g. mcq → true_false)
 * leave clean JSON without stale MCQ fields. */
function applyTypeCleanup(q: AnyQ): AnyQ {
  const t = canonType(q.type);
  const out: AnyQ = { ...q };
  // Strip the per-letter helper fields no matter the type — they're CSV-only.
  delete out.optionA; delete out.optionB; delete out.optionC; delete out.optionD;
  delete out.A; delete out.B; delete out.C; delete out.D;

  if (t === "true_false") {
    delete out.options;
    delete out.correctAnswers;
    if (typeof out.correctAnswer === "string") {
      const l = out.correctAnswer.toLowerCase();
      if (l === "true") out.correctAnswer = true;
      else if (l === "false") out.correctAnswer = false;
    } else if (typeof out.correctAnswer === "number") {
      out.correctAnswer = out.correctAnswer !== 0;
    }
  } else if (t === "multiple_choice" || t === "image_question") {
    delete out.correctAnswers;
  } else if (t === "multiple_response") {
    delete out.correctAnswer;
  } else if (t === "numeric_entry") {
    delete out.options;
    delete out.correctAnswers;
  } else if (t === "hot_spot") {
    delete out.options;
    delete out.correctAnswer;
    delete out.correctAnswers;
  } else if (t === "fill_blanks" || t === "drag_drop_blanks" || t === "dropdown_blanks") {
    // Rebuild the nested blanks[] from the flat CSV columns whenever the row
    // supplies clean optionA-D values. This guarantees that "Full replacement"
    // mode actually replaces stale/broken nested data (e.g. a previously leaked
    // `monotonous]}],explanation` option) instead of preserving it.
    const flatOpts: unknown[] = Array.isArray(out.options) ? out.options : [];
    const hasFlatOpts = flatOpts.length > 0;
    const ca = out.correctAnswer;
    if (hasFlatOpts) {
      let correctIndex = 0;
      if (typeof ca === "number" && Number.isFinite(ca)) {
        correctIndex = Math.max(0, Math.min(flatOpts.length - 1, Math.trunc(ca)));
      } else if (typeof ca === "string") {
        const trimmed = ca.trim();
        const asNum = Number(trimmed);
        if (Number.isFinite(asNum) && /^-?\d+$/.test(trimmed)) {
          correctIndex = Math.max(0, Math.min(flatOpts.length - 1, asNum));
        } else {
          const idx = flatOpts.findIndex(
            (o) => typeof o === "string" && o.trim().toLowerCase() === trimmed.toLowerCase(),
          );
          if (idx >= 0) correctIndex = idx;
        }
      }
      const cleanOpts = flatOpts.map((o) => (typeof o === "string" ? o : String(o ?? "")));
      out.blanks = [{ correctIndex, options: cleanOpts }];
    }
    // Mirror question → template (frontend prefers `template` for blank types).
    if (typeof out.question === "string" && out.question.trim() && !out.template) {
      out.template = out.question;
    }
    delete out.options;
    delete out.correctAnswer;
    delete out.correctAnswers;
  }
  return out;
}

/** Apply a single patch row to an existing question. CSV-present keys are
 * merged in; keys listed in `clears` are deleted from the result. Then
 * type-specific cleanup strips fields incompatible with the final type. */
function applyPatch(prev: AnyQ | undefined, patch: AnyQ, clears: Set<string>): AnyQ {
  const base: AnyQ = { ...(prev ?? {}), ...patch };
  for (const key of clears) {
    if (key === "id") continue;
    delete base[key];
  }
  return applyTypeCleanup(base);
}

/** Merge CSV rows onto the existing bank. CSV rows REPLACE matching ids;
 * unmatched existing questions are kept as-is. New ids are appended. */
function mergeIntoFile(file: MockFile, rows: AnyQ[], clearByRow?: Set<string>[]): MockFile {
  const isV2 = (file as V2File).version === 2 && Array.isArray((file as V2File).bank);
  const clearsById = new Map<string, Set<string>>();
  rows.forEach((r, i) => {
    clearsById.set(String(r.id), clearByRow?.[i] ?? new Set());
  });
  if (isV2) {
    const v2 = file as V2File;
    const byId = new Map(v2.bank.filter((q) => q.id).map((q) => [String(q.id), q]));
    for (const r of rows) {
      const id = String(r.id);
      byId.set(id, applyPatch(byId.get(id), r, clearsById.get(id) ?? new Set()));
    }
    const newBank = Array.from(byId.values());
    return { ...v2, bank: newBank };
  }
  const v1 = file as V1File;
  const byId = new Map<string, AnyQ>();
  for (const r of rows) byId.set(String(r.id), r);
  const matched = new Set<string>();
  const tests = v1.tests.map((t) => ({
    ...t,
    questions: t.questions.map((q) => {
      if (q.id && byId.has(String(q.id))) {
        const id = String(q.id);
        matched.add(id);
        return applyPatch(q, byId.get(id)!, clearsById.get(id) ?? new Set());
      }
      return q;
    }),
  }));
  const unmatched = rows
    .filter((r) => !matched.has(String(r.id)))
    .map((r) => applyPatch(undefined, r, clearsById.get(String(r.id)) ?? new Set()));
  if (unmatched.length && tests[0]) tests[0].questions.push(...unmatched);
  return { ...v1, tests };
}

/** FULL REPLACEMENT: discard the existing bank/mocks entirely and rebuild from
 * the CSV rows. The bank becomes exactly the imported rows (in CSV order,
 * after type cleanup). Mocks are rebuilt using either explicit mockNumber/
 * questionNumber columns or by grouping every 24 rows into one mock. */
function replaceIntoFile(
  file: MockFile,
  rows: AnyQ[],
  clearByRow: Set<string>[],
  mockMetaByRow: MockMeta[],
  questionsPerMock = 24,
): MockFile {
  const cleanedRows = rows.map((r, i) =>
    applyPatch(undefined, r, clearByRow[i] ?? new Set()),
  );

  const useExplicit = mockMetaByRow.some((m) => m.mockNumber != null);

  // Bank = unique question records by id. In explicit mode the same id may
  // appear in up to N rows (allocated to multiple mocks); first occurrence
  // wins for the canonical bank entry. Validation enforces that repeats
  // share identical content.
  const bankById = new Map<string, AnyQ>();
  for (const q of cleanedRows) {
    const id = String(q.id ?? "");
    if (!id) continue;
    if (!bankById.has(id)) bankById.set(id, q);
  }
  const bank = useExplicit ? Array.from(bankById.values()) : cleanedRows;

  // Group rows into mocks.
  const groups = new Map<number, { id: string; questionNumber: number | null; idx: number }[]>();
  if (useExplicit) {
    cleanedRows.forEach((q, i) => {
      const m = mockMetaByRow[i]?.mockNumber;
      if (m == null) return;
      const list = groups.get(m) ?? [];
      list.push({ id: String(q.id), questionNumber: mockMetaByRow[i]?.questionNumber ?? null, idx: i });
      groups.set(m, list);
    });
  } else {
    cleanedRows.forEach((q, i) => {
      const mockNumber = Math.floor(i / questionsPerMock) + 1;
      const list = groups.get(mockNumber) ?? [];
      list.push({ id: String(q.id), questionNumber: (i % questionsPerMock) + 1, idx: i });
      groups.set(mockNumber, list);
    });
  }

  // Sort each group by questionNumber (fallback: csv row order).
  for (const list of groups.values()) {
    list.sort((a, b) => {
      const an = a.questionNumber ?? a.idx;
      const bn = b.questionNumber ?? b.idx;
      return an - bn;
    });
  }
  const sortedMockNumbers = Array.from(groups.keys()).sort((a, b) => a - b);

  const isV2 = (file as V2File).version === 2 && Array.isArray((file as V2File).bank);
  if (isV2) {
    const v2 = file as V2File;
    const mocks = sortedMockNumbers.map((n) => ({
      mockNumber: n,
      title: `Mock ${n}`,
      questionIds: groups.get(n)!.map((e) => e.id),
    }));
    return { ...v2, bank, mocks };
  }
  const v1 = file as V1File;
  const tests = sortedMockNumbers.map((n) => ({
    mockNumber: n,
    title: `Mock ${n}`,
    slug: `mock-${n}`,
    questions: groups.get(n)!.map((e) => bankById.get(e.id)!).filter(Boolean),
  }));
  return { ...v1, tests };
}

function bankOf(file: MockFile): AnyQ[] {
  const isV2 = (file as V2File).version === 2 && Array.isArray((file as V2File).bank);
  if (isV2) return (file as V2File).bank;
  return (file as V1File).tests.flatMap((t) => t.questions);
}

function mockCountOf(file: MockFile): number {
  const isV2 = (file as V2File).version === 2 && Array.isArray((file as V2File).bank);
  if (isV2) return ((file as V2File).mocks ?? []).length;
  return ((file as V1File).tests ?? []).length;
}

function unusedQuestionCount(file: MockFile): number {
  const isV2 = (file as V2File).version === 2 && Array.isArray((file as V2File).bank);
  if (!isV2) return 0;
  const v2 = file as V2File;
  const used = new Set<string>();
  for (const m of v2.mocks ?? []) for (const id of m.questionIds ?? []) used.add(String(id));
  return v2.bank.filter((q) => q.id && !used.has(String(q.id))).length;
}

const TopicSchema = z.string().min(1).max(120).regex(/^[a-z0-9-]+$/);




/** For topic === "road-signs" load directory listings for both image dirs. */
async function loadRoadSignFiles(topic: string): Promise<Set<string> | null> {
  if (topic !== "road-signs") return null;
  try {
    const [rsNames, mwNames] = await Promise.all([
      listDir("public/road-signs"),
      listDir("public/motorway-rules"),
    ]);
    const set = new Set<string>();
    (rsNames ?? []).forEach((n) => set.add(n));
    (mwNames ?? []).forEach((n) => set.add(n));
    return set;
  } catch (e) {
    console.warn("loadRoadSignFiles failed:", e);
    return null;
  }
}


const ImportModeSchema = z.enum(["patch", "replace"]).optional();

const PLACEHOLDER_PHRASE = "Full revision content for this topic is being prepared";
const FULL_REPLACEMENT_MOCK_COUNT = 45;
const FULL_REPLACEMENT_QUESTIONS_PER_MOCK = 24;
const FULL_REPLACEMENT_BANK_SIZE = FULL_REPLACEMENT_MOCK_COUNT * FULL_REPLACEMENT_QUESTIONS_PER_MOCK;

function replaceAssertionIssue(field: string | null, message: string, id: string | null = null): Issue {
  return { rowIndex: null, id, field, message };
}

function replacementMockLengths(file: MockFile): Array<{ mockNumber: number | string; length: number }> {
  const isV2 = (file as V2File).version === 2 && Array.isArray((file as V2File).bank);
  if (isV2) {
    return ((file as V2File).mocks ?? []).map((m) => ({
      mockNumber: m.mockNumber,
      length: Array.isArray(m.questionIds) ? m.questionIds.length : 0,
    }));
  }
  return ((file as V1File).tests ?? []).map((t) => ({
    mockNumber: t.mockNumber,
    length: Array.isArray(t.questions) ? t.questions.length : 0,
  }));
}

/** Derive expected replace targets from the CSV itself when explicit
 * mockNumber columns are present. Returns null if the CSV is not using
 * explicit allocation. */
type ReplaceTargets = {
  mockCount: number;
  questionsPerMock: number;
  totalSlots: number;
  uniqueQuestions: number;
  maxUsesPerQuestion: number; // observed max
};
const MAX_USES_PER_QUESTION = 2;

function deriveReplaceTargets(
  rows: AnyQ[],
  mockMetaByRow: MockMeta[],
): ReplaceTargets | null {
  const useExplicit = mockMetaByRow.some((m) => m.mockNumber != null);
  if (!useExplicit) return null;

  const sizes = new Map<number, number>();
  for (let i = 0; i < rows.length; i++) {
    const m = mockMetaByRow[i]?.mockNumber;
    if (m == null) continue;
    sizes.set(m, (sizes.get(m) ?? 0) + 1);
  }
  const mockNumbers = Array.from(sizes.keys()).sort((a, b) => a - b);
  const mockCount = mockNumbers.length === 0 ? 0 : mockNumbers[mockNumbers.length - 1];
  // Most common per-mock size (mode). Used as the expected uniform size.
  const counts = new Map<number, number>();
  for (const s of sizes.values()) counts.set(s, (counts.get(s) ?? 0) + 1);
  let questionsPerMock = 0;
  let best = -1;
  for (const [size, freq] of counts) {
    if (freq > best) { best = freq; questionsPerMock = size; }
  }
  const totalSlots = Array.from(sizes.values()).reduce((a, b) => a + b, 0);

  const idUses = new Map<string, number>();
  for (let i = 0; i < rows.length; i++) {
    if (mockMetaByRow[i]?.mockNumber == null) continue;
    const id = String(rows[i]?.id ?? "");
    if (!id) continue;
    idUses.set(id, (idUses.get(id) ?? 0) + 1);
  }
  const uniqueQuestions = idUses.size;
  let maxUses = 0;
  for (const n of idUses.values()) if (n > maxUses) maxUses = n;

  return { mockCount, questionsPerMock, totalSlots, uniqueQuestions, maxUsesPerQuestion: maxUses };
}

function assertReplacementJson(
  file: MockFile,
  topic: string,
  targets: ReplaceTargets | null,
): {
  errors: Issue[];
  bankSize: number;
  mockCount: number;
  unusedQuestionCount: number;
  firstBankIds: string[];
} {
  const errors: Issue[] = [];
  const bank = bankOf(file);
  const mockCount = mockCountOf(file);
  const unused = unusedQuestionCount(file);
  const firstBankIds = bank.slice(0, 3).map((q) => String(q.id ?? ""));

  // Targets: CSV-derived when explicit, otherwise fall back to legacy 45×24.
  const expectedMockCount = targets?.mockCount ?? FULL_REPLACEMENT_MOCK_COUNT;
  const expectedPerMock = targets?.questionsPerMock ?? FULL_REPLACEMENT_QUESTIONS_PER_MOCK;
  const expectedBankSize = targets?.uniqueQuestions ?? FULL_REPLACEMENT_BANK_SIZE;

  if (bank.length !== expectedBankSize) {
    errors.push(replaceAssertionIssue(null, `Full replacement output must contain exactly ${expectedBankSize} bank questions; got ${bank.length}.`));
  }

  const stubIds = bank
    .map((q) => String(q.id ?? ""))
    .filter((id) => id.includes("-stub-") || id.startsWith(`${topic}-stub-`));
  if (stubIds.length > 0) {
    errors.push(replaceAssertionIssue("id", `Full replacement output still contains old stub IDs: ${stubIds.slice(0, 10).join(", ")}${stubIds.length > 10 ? ` (+${stubIds.length - 10} more)` : ""}.`, stubIds[0]));
  }

  const placeholderIds = bank
    .filter((q) => String(q.question ?? q.template ?? q.prompt ?? "").includes(PLACEHOLDER_PHRASE))
    .map((q) => String(q.id ?? "(missing id)"));
  if (placeholderIds.length > 0) {
    errors.push(replaceAssertionIssue("question", `Full replacement output still contains placeholder text in: ${placeholderIds.slice(0, 10).join(", ")}${placeholderIds.length > 10 ? ` (+${placeholderIds.length - 10} more)` : ""}.`, placeholderIds[0] ?? null));
  }

  if (mockCount !== expectedMockCount) {
    errors.push(replaceAssertionIssue("mocks", `Full replacement output must contain exactly ${expectedMockCount} mocks; got ${mockCount}.`));
  }

  for (const m of replacementMockLengths(file)) {
    if (m.length !== expectedPerMock) {
      errors.push(replaceAssertionIssue("mocks", `Mock ${m.mockNumber} has ${m.length} question IDs (expected ${expectedPerMock}).`));
    }
  }

  if (unused !== 0) {
    errors.push(replaceAssertionIssue("mocks", `Full replacement output has ${unused} unused bank question(s); expected 0.`));
  }

  // The legacy GMAT-specific first-IDs check only makes sense for the original
  // sequential 24-row allocation. With manual mockNumber allocation the first
  // bank ids can be anything, so skip it in explicit mode.
  if (topic === "gmat-practice" && !targets) {
    const expectedFirstIds = ["gmat-mock-01-q01", "gmat-mock-01-q02", "gmat-mock-01-q03"];
    const wrong = expectedFirstIds.some((id, i) => firstBankIds[i] !== id);
    if (wrong) {
      errors.push(replaceAssertionIssue("id", `GMAT replacement output must start with ${expectedFirstIds.join(", ")}; got ${firstBankIds.join(", ") || "(no bank ids)"}.`, firstBankIds[0] ?? null));
    }
  }

  return { errors, bankSize: bank.length, mockCount, unusedQuestionCount: unused, firstBankIds };
}

/** Preflight checks unique to Full replacement mode. Blocking issues. */
function validateReplaceMode(
  rows: AnyQ[],
  rowLines: number[],
  mockMetaByRow: MockMeta[],
  _topic: string,
  questionsPerMock = 24,
): Issue[] {
  const out: Issue[] = [];

  rows.forEach((r, i) => {
    const text = String(r.question ?? r.template ?? r.prompt ?? "");
    if (text.includes(PLACEHOLDER_PHRASE)) {
      out.push({
        rowIndex: rowLines[i] ?? null,
        id: String(r.id ?? "") || null,
        field: "question",
        message: `Placeholder text found in CSV: "${PLACEHOLDER_PHRASE}". Replace with real content before import.`,
      });
    }
  });

  const useExplicit = mockMetaByRow.some((m) => m.mockNumber != null);

  if (!useExplicit) {
    // Legacy sequential mode: every N rows = 1 mock. Keep the old guard
    // requiring exact 45×24 totals so partial imports don't slip through.
    const groups = new Map<number, string[]>();
    rows.forEach((q, i) => {
      const n = Math.floor(i / questionsPerMock) + 1;
      const list = groups.get(n) ?? [];
      list.push(String(q.id));
      groups.set(n, list);
    });
    for (const [mockNumber, ids] of groups) {
      if (ids.length !== questionsPerMock) {
        out.push({ rowIndex: null, id: null, field: "mocks", message: `Mock ${mockNumber} has ${ids.length} questions (expected ${questionsPerMock}).` });
      }
      const seen = new Set<string>();
      for (const id of ids) {
        if (seen.has(id)) {
          out.push({ rowIndex: null, id, field: "mocks", message: `Duplicate question id "${id}" inside mock ${mockNumber}.` });
        }
        seen.add(id);
      }
    }
    if (rows.length !== FULL_REPLACEMENT_BANK_SIZE) {
      out.push({
        rowIndex: null,
        id: null,
        field: null,
        message: `Full replacement expects exactly ${FULL_REPLACEMENT_BANK_SIZE} rows (${FULL_REPLACEMENT_MOCK_COUNT} mocks × ${FULL_REPLACEMENT_QUESTIONS_PER_MOCK} questions). Got ${rows.length}.`,
      });
    }
    return out;
  }

  // ---------- Explicit allocation (mockNumber column present) ----------

  // Every row must declare a mockNumber.
  rows.forEach((r, i) => {
    if (mockMetaByRow[i]?.mockNumber == null) {
      out.push({
        rowIndex: rowLines[i] ?? null,
        id: String(r.id ?? "") || null,
        field: "mockNumber",
        message: `Row is missing mockNumber. In explicit allocation mode every row must specify mockNumber.`,
      });
    }
  });

  // Group by mock, tracking (id, questionNumber, rowIndex).
  type Slot = { id: string; qn: number | null; rowIndex: number | null };
  const groups = new Map<number, Slot[]>();
  rows.forEach((q, i) => {
    const m = mockMetaByRow[i]?.mockNumber;
    if (m == null) return;
    const list = groups.get(m) ?? [];
    list.push({ id: String(q.id ?? ""), qn: mockMetaByRow[i]?.questionNumber ?? null, rowIndex: rowLines[i] ?? null });
    groups.set(m, list);
  });

  // Determine uniform per-mock size (mode of group sizes).
  const sizeCounts = new Map<number, number>();
  for (const list of groups.values()) sizeCounts.set(list.length, (sizeCounts.get(list.length) ?? 0) + 1);
  let expectedPerMock = 0;
  let best = -1;
  for (const [size, freq] of sizeCounts) {
    if (freq > best) { best = freq; expectedPerMock = size; }
  }

  // Rule 2: every mock must have the same size.
  for (const [mockNumber, list] of groups) {
    if (list.length !== expectedPerMock) {
      out.push({
        rowIndex: null,
        id: null,
        field: "mocks",
        message: `Mock ${mockNumber} has ${list.length} questions but other mocks have ${expectedPerMock}. All mocks must contain the same number of questions.`,
      });
    }
  }

  // Rule 1: no gaps in mockNumber 1..max.
  const mockNumbers = Array.from(groups.keys()).sort((a, b) => a - b);
  const maxMock = mockNumbers[mockNumbers.length - 1] ?? 0;
  const present = new Set(mockNumbers);
  const missing: number[] = [];
  for (let n = 1; n <= maxMock; n++) if (!present.has(n)) missing.push(n);
  if (missing.length > 0) {
    out.push({
      rowIndex: null,
      id: null,
      field: "mockNumber",
      message: `Missing mock numbers (must be contiguous 1..${maxMock}): ${missing.slice(0, 20).join(", ")}${missing.length > 20 ? `, +${missing.length - 20} more` : ""}.`,
    });
  }

  // Rules 3 + 4: per-mock unique questionNumber and unique id.
  for (const [mockNumber, list] of groups) {
    const seenQn = new Map<number, number>(); // qn -> count
    const seenId = new Map<string, number>();
    for (const slot of list) {
      if (slot.qn != null) seenQn.set(slot.qn, (seenQn.get(slot.qn) ?? 0) + 1);
      if (slot.id) seenId.set(slot.id, (seenId.get(slot.id) ?? 0) + 1);
    }
    for (const [qn, c] of seenQn) {
      if (c > 1) {
        out.push({
          rowIndex: null,
          id: null,
          field: "questionNumber",
          message: `Mock ${mockNumber} has duplicate questionNumber ${qn} (appears ${c} times).`,
        });
      }
    }
    for (const [id, c] of seenId) {
      if (c > 1) {
        out.push({
          rowIndex: null,
          id,
          field: "mocks",
          message: `Duplicate question id "${id}" inside mock ${mockNumber} (appears ${c} times).`,
        });
      }
    }
  }

  // Rule 5: each id used at most MAX_USES_PER_QUESTION times across all mocks.
  const usesById = new Map<string, { mocks: number[] }>();
  rows.forEach((q, i) => {
    const m = mockMetaByRow[i]?.mockNumber;
    if (m == null) return;
    const id = String(q.id ?? "");
    if (!id) return;
    const entry = usesById.get(id) ?? { mocks: [] };
    entry.mocks.push(m);
    usesById.set(id, entry);
  });
  for (const [id, entry] of usesById) {
    if (entry.mocks.length > MAX_USES_PER_QUESTION) {
      out.push({
        rowIndex: null,
        id,
        field: "mocks",
        message: `Question id "${id}" appears ${entry.mocks.length} times across mocks (max ${MAX_USES_PER_QUESTION}). Mocks: ${entry.mocks.slice(0, 10).join(", ")}.`,
      });
    }
  }

  // Rule 6: repeated rows for the same id must have identical content.
  const COMPARED_FIELDS = ["type", "question", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "correctAnswers", "explanation", "image", "imageAlt"];
  const firstRowById = new Map<string, { row: AnyQ; rowIndex: number | null }>();
  rows.forEach((q, i) => {
    const id = String(q.id ?? "");
    if (!id) return;
    const seen = firstRowById.get(id);
    if (!seen) {
      firstRowById.set(id, { row: q, rowIndex: rowLines[i] ?? null });
      return;
    }
    const conflicting: string[] = [];
    for (const f of COMPARED_FIELDS) {
      const a = seen.row[f];
      const b = q[f];
      const aN = a == null ? "" : String(a);
      const bN = b == null ? "" : String(b);
      if (aN !== bN) conflicting.push(f);
    }
    if (conflicting.length > 0) {
      out.push({
        rowIndex: rowLines[i] ?? null,
        id,
        field: conflicting[0] ?? null,
        message: `Repeated rows for id "${id}" disagree on field(s): ${conflicting.join(", ")}. Row ${rowLines[i] ?? "?"} vs row ${seen.rowIndex ?? "?"}. Repeated rows must be identical except for mockNumber/questionNumber.`,
      });
    }
  });

  // Rule 7: unique pool must be large enough to cover all slots given max-2 reuse.
  const uniqueIds = usesById.size;
  const totalSlots = Array.from(groups.values()).reduce((a, b) => a + b.length, 0);
  const minRequired = Math.ceil(totalSlots / MAX_USES_PER_QUESTION);
  if (uniqueIds < minRequired) {
    out.push({
      rowIndex: null,
      id: null,
      field: null,
      message: `CSV has ${uniqueIds} unique questions but needs at least ${minRequired} to fill ${totalSlots} slots with max ${MAX_USES_PER_QUESTION} uses per question.`,
    });
  }

  return out;
}

export const previewCsvImport = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      topic: TopicSchema,
      csvText: z.string().min(1).max(20_000_000),
      mode: ImportModeSchema,
    }).parse(input),
  )
  .handler(async ({ data }) => {
    try {
      const auth = await getAuthenticatedAdminClient();
      if (auth.error) return emptyPreview(auth.error);
      const mode = data.mode ?? "patch";
      console.log("previewCsvImport received mode:", mode, "topic:", data.topic);
      const { rows, rowLines, clearByRow, mockMetaByRow, errors } = parseCsv(data.csvText, mode);
      const existing = await getFile(filePathFor(data.topic));
      if (!existing) return emptyPreview(`Topic file not found in repo: ${filePathFor(data.topic)}`, errors);
      const oldFile = JSON.parse(existing.content) as MockFile;
      const oldBank = bankOf(oldFile);
      const newFile =
        mode === "replace"
          ? (console.log("previewCsvImport using replaceIntoFile branch for", data.topic), replaceIntoFile(oldFile, rows, clearByRow, mockMetaByRow))
          : mergeIntoFile(oldFile, rows, clearByRow);
      const newBank = bankOf(newFile);

      const diff = diffBanks(oldBank, newBank);
      const mergedById = new Map(newBank.filter((q) => q.id).map((q) => [String(q.id), q]));
      const rowIds = rows.map((r) => String(r.id));
      const roadSignFiles = await loadRoadSignFiles(data.topic);
      const useExplicitForValidation = mockMetaByRow.some((m) => m.mockNumber != null);
      const validation = validateImported(mergedById, rowIds, rowLines, newFile, data.topic, roadSignFiles, useExplicitForValidation);
      const targets = mode === "replace" ? deriveReplaceTargets(rows, mockMetaByRow) : null;
      if (mode === "replace") {
        validation.errors.push(...validateReplaceMode(rows, rowLines, mockMetaByRow, data.topic));
        const assertions = assertReplacementJson(newFile, data.topic, targets);
        validation.errors.push(...assertions.errors);
        console.log("previewCsvImport replace output:", {
          topic: data.topic,
          bankSize: assertions.bankSize,
          mockCount: assertions.mockCount,
          unusedQuestionCount: assertions.unusedQuestionCount,
          firstBankIds: assertions.firstBankIds,
          targets,
        });
      }

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
        oldMockCount: mockCountOf(oldFile),
        newMockCount: mockCountOf(newFile),
        unusedQuestionCount: unusedQuestionCount(newFile),
        replaceTargets: targets,
        validation,
        existingSha: existing.sha,
        filePath: filePathFor(data.topic),
        topic: data.topic,
        mode,
        branch: GITHUB_REPO.branch,
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
      expectedSha: z.string().min(1).max(120).optional(),
      mode: ImportModeSchema,
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabase, userId } = context;
    const mode = data.mode ?? "patch";
    console.log("commitCsvImport received mode:", mode, "topic:", data.topic, "branch:", GITHUB_REPO.branch);
    const { rows, rowLines, clearByRow, mockMetaByRow, errors } = parseCsv(data.csvText, mode);
    if (rows.length === 0) throw new Error("No valid rows found in CSV");

    const path = filePathFor(data.topic);
    try {
      const existing = await getFile(path);
      if (!existing) throw new Error(`Topic file not found in repo: ${path}`);
      if (data.expectedSha && data.expectedSha !== existing.sha) {
        throw new Error(
          "This topic JSON changed after preview. Please refresh and preview again.",
        );
      }
      const oldFile = JSON.parse(existing.content) as MockFile;
      const newFile =
        mode === "replace"
          ? (console.log("commitCsvImport using replaceIntoFile branch for", data.topic), replaceIntoFile(oldFile, rows, clearByRow, mockMetaByRow))
          : mergeIntoFile(oldFile, rows, clearByRow);

      const mergedById = new Map(bankOf(newFile).filter((q) => q.id).map((q) => [String(q.id), q]));
      const rowIds = rows.map((r) => String(r.id));
      const roadSignFiles = await loadRoadSignFiles(data.topic);
      const useExplicitForValidation = mockMetaByRow.some((m) => m.mockNumber != null);
      const validation = validateImported(mergedById, rowIds, rowLines, newFile, data.topic, roadSignFiles, useExplicitForValidation);
      const commitTargets = mode === "replace" ? deriveReplaceTargets(rows, mockMetaByRow) : null;
      if (mode === "replace") {
        validation.errors.push(...validateReplaceMode(rows, rowLines, mockMetaByRow, data.topic));
        const assertions = assertReplacementJson(newFile, data.topic, commitTargets);
        validation.errors.push(...assertions.errors);
        console.log("commitCsvImport replace output before GitHub commit:", {
          topic: data.topic,
          path,
          branch: GITHUB_REPO.branch,
          bankSize: assertions.bankSize,
          mockCount: assertions.mockCount,
          unusedQuestionCount: assertions.unusedQuestionCount,
          firstBankIds: assertions.firstBankIds,
          targets: commitTargets,
        });
      }

      if (validation.errors.length > 0) {
        const first = validation.errors.slice(0, 5).map((e) => `• ${e.id ? `[${e.id}] ` : ""}${e.message}`).join("\n");
        const more = validation.errors.length > 5 ? `\n…and ${validation.errors.length - 5} more.` : "";
        throw new Error(`Validation failed (${validation.errors.length} error${validation.errors.length === 1 ? "" : "s"}). Fix the CSV and retry:\n${first}${more}`);
      }
      const diff = diffBanks(bankOf(oldFile), bankOf(newFile));
      const changedIds = diff.changed.map((c) => c.id);
      const addedIds = diff.added.map((q) => String(q.id ?? ""));
      const removedIds = diff.removed.map((q) => String(q.id ?? ""));
      if (mode === "replace") {
        const oldStubIds = bankOf(oldFile).map((q) => String(q.id ?? "")).filter((id) => id.includes("-stub-") || id.startsWith(`${data.topic}-stub-`));
        const removedStubIds = oldStubIds.filter((id) => removedIds.includes(id));
        console.log("commitCsvImport replace diff before GitHub commit:", {
          topic: data.topic,
          path,
          branch: GITHUB_REPO.branch,
          oldStubCount: oldStubIds.length,
          removedStubCount: removedStubIds.length,
          firstRemovedStubIds: removedStubIds.slice(0, 5),
        });
        if (oldStubIds.length > 0 && removedStubIds.length !== oldStubIds.length) {
          throw new Error(
            `Full replacement safety check failed: expected GitHub diff to remove ${oldStubIds.length} old stub IDs, but it removes ${removedStubIds.length}. Commit blocked.`,
          );
        }
      }
      const newContent = JSON.stringify(newFile, null, 2) + "\n";

      // Standardized commit message format.
      const commitMessage = `Update ${data.topic} mock questions from admin CSV import`;
      const { commitSha, commitUrl } = await commitFile({
        filePath: path,
        content: newContent,
        message: commitMessage,
        sha: existing.sha,
      });

      // Force Lovable's GitHub sync to re-fire after the content commit.
      await nudgeSync(`csv import: ${data.topic}`);

      // Post-commit verification: re-read the just-committed file from GitHub
      // and scan for any blank-options leak fragments. Reported back to the
      // caller (admin) but does not block — the commit has already landed.
      let postCommitWarning: string | null = null;
      try {
        const verify = await getFile(path);
        if (verify) {
          const hits: string[] = [];
          for (const frag of ["}},explanation", "}},", "{{0)", "{{1)", "[object Object]"]) {
            if (verify.content.includes(frag)) hits.push(frag);
          }
          if (hits.length > 0) {
            postCommitWarning = `Post-commit scan still found malformed fragments in ${path}: ${hits.join(", ")}. Open Blank Options Health and run Repair & commit.`;
          }
          if (mode === "replace") {
            const verifiedFile = JSON.parse(verify.content) as MockFile;
            const verified = assertReplacementJson(verifiedFile, data.topic, commitTargets);
            console.log("commitCsvImport post-commit replace verification:", {
              topic: data.topic,
              path,
              branch: GITHUB_REPO.branch,
              bankSize: verified.bankSize,
              mockCount: verified.mockCount,
              unusedQuestionCount: verified.unusedQuestionCount,
              firstBankIds: verified.firstBankIds,
              errorCount: verified.errors.length,
            });
            if (verified.errors.length > 0) {
              postCommitWarning = `Post-commit replacement verification failed for ${path}: ${verified.errors.slice(0, 3).map((e) => e.message).join(" | ")}`;
            }
          }
        }
      } catch (e) {
        postCommitWarning = `Post-commit verification could not re-read ${path}: ${(e as Error).message}`;
      }

      // Save BOTH snapshots (previous + new) for rollback. Status is only
      // set to "committed" AFTER the GitHub commit succeeds.
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
          validation_log: { parseErrors: errors, changedIds, addedIds, removedIds, mode, branch: GITHUB_REPO.branch, path } as never,
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
        parseErrors: errors,
        filePath: path,
        topic: data.topic,
        rowCount: rows.length,
        changedCount: changedIds.length,
        addedCount: addedIds.length,
        removedCount: removedIds.length,
        deploymentNote: "Changes committed to GitHub main. Deployment may take a few minutes.",
        postCommitWarning,
        mode,
        branch: GITHUB_REPO.branch,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Log a failed attempt with NO snapshots and NO commit sha. Status is
      // "failed", so it never counts as a successful import.
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
  .inputValidator((input) =>
    z.object({
      historyId: z.string().uuid(),
      // Required when re-rolling-back an already rolled_back or failed entry.
      force: z.boolean().optional(),
    }).parse(input),
  )
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
    if ((row.status === "rolled_back" || row.status === "failed") && !data.force) {
      throw new Error(
        row.status === "rolled_back"
          ? "This import was already rolled back. Confirm again to roll back a second time."
          : "Previous rollback for this import failed. Confirm again to retry.",
      );
    }

    const path = filePathFor(row.topic);
    try {
      const existing = await getFile(path);
      const content = JSON.stringify(row.previous_json, null, 2) + "\n";
      const { commitSha, commitUrl } = await commitFile({
        filePath: path,
        content,
        message: `Rollback ${row.topic} mock questions import`,
        sha: existing?.sha,
      });

      await nudgeSync(`csv rollback: ${row.topic}`);

      // Mark the original import as rolled_back.
      await supabase
        .from("question_import_history")
        .update({
          status: "rolled_back",
          rolled_back_at: new Date().toISOString(),
          rolled_back_to_commit_sha: commitSha,
          error_log: null,
        })
        .eq("id", row.id);

      // Audit row for the rollback commit itself.
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
      return {
        commitSha,
        commitUrl,
        filePath: path,
        topic: row.topic,
        rolledBackAt: new Date().toISOString(),
        status: "rolled_back" as const,
        deploymentNote: "Rollback committed to GitHub main. Deployment may take a few minutes.",
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Mark the rollback as failed with the error message.
      await supabase
        .from("question_import_history")
        .update({ status: "failed", error_log: `Rollback failed: ${message}` })
        .eq("id", row.id);
      throw err;
    }
  });

/** Diagnostic: verify GitHub token, repo, branch, and Contents:write
 *  permission. The token itself is never returned. */
export const testGithubConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    try {
      return await testConnection();
    } catch (e) {
      return {
        ok: false,
        token: { present: !!process.env.GITHUB_TOKEN },
        repo: { ok: false, full: "", error: e instanceof Error ? e.message : String(e) },
        branch: { ok: false, name: "" },
        contentsWrite: { ok: false },
      };
    }
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
        .select("id, topic, filename, commit_sha, commit_url, row_count, status, error_log, created_at, created_by, rolled_back_at, validation_log")
        .order("created_at", { ascending: false })
        .limit(data.limit);
      if (data.topic) q = q.eq("topic", data.topic);
      const { data: rows, error } = await q;
      if (error) return { rows: [], error: error.message };
      const enriched = (rows ?? []).map((r) => {
        const vl = (r.validation_log ?? {}) as { changedIds?: string[]; addedIds?: string[]; removedIds?: string[] };
        return {
          ...r,
          changed_ids: Array.isArray(vl.changedIds) ? vl.changedIds : [],
          added_ids: Array.isArray(vl.addedIds) ? vl.addedIds : [],
          removed_ids: Array.isArray(vl.removedIds) ? vl.removedIds : [],
        };
      });
      return { rows: enriched, error: null as string | null };
    } catch (err) {
      console.error("listImportHistory failed:", err);
      return { rows: [], error: err instanceof Error ? err.message : "Unknown error" };
    }
  });

/* =====================================================================
 * Self-test / round-trip / schema / live-verify
 * ===================================================================== */

/** Reproduce the exact CSV the topic page export button emits, on the
 *  server, from a bank array. Used by the round-trip self-test. */
function exportBankAsCsv(bank: AnyQ[]): string {
  const esc = (v: unknown) => {
    const s = v == null ? "" : typeof v === "string" ? v : JSON.stringify(v);
    return `"${String(s).replace(/"/g, '""')}"`;
  };
  const headers = [
    "id","type","question","optionA","optionB","optionC","optionD",
    "correctAnswer","correctAnswers","explanation","image","imageAlt",
  ];
  const lines = [headers.join(",")];
  for (const q of bank) {
    const opts = Array.isArray(q.options) ? q.options : [];
    lines.push([
      esc(q.id), esc(q.type ?? ""), esc(q.question ?? ""),
      esc(opts[0] ?? ""), esc(opts[1] ?? ""), esc(opts[2] ?? ""), esc(opts[3] ?? ""),
      esc(q.correctAnswer ?? null), esc(q.correctAnswers ?? null),
      esc(q.explanation ?? ""), esc(q.image ?? ""), esc(q.imageAlt ?? ""),
    ].join(","));
  }
  return lines.join("\n");
}

/** Schema check for public/mocks/<topic>.json. Verifies that no required
 *  field has gone missing in the on-disk file. Returns blocking errors
 *  (structural) and warnings (per-question soft issues). */
function schemaCheckFile(file: MockFile, topic: string): { ok: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isV2 = (file as V2File).version === 2;
  if (isV2) {
    const v2 = file as V2File;
    if (!Array.isArray(v2.bank)) errors.push("V2 file is missing `bank` array.");
    if (!Array.isArray(v2.mocks)) errors.push("V2 file is missing `mocks` array.");
    if (v2.topic && v2.topic !== topic) errors.push(`Topic mismatch: file.topic="${v2.topic}" vs url="${topic}".`);
    const ids = new Set<string>();
    (v2.bank ?? []).forEach((q, i) => {
      if (!q.id) errors.push(`bank[${i}] is missing id.`);
      else if (ids.has(String(q.id))) errors.push(`Duplicate bank id "${q.id}".`);
      else ids.add(String(q.id));
      if (!q.type) warnings.push(`bank[${i}] (id=${q.id ?? "?"}) is missing type.`);
      const text = (q.question ?? q.template ?? q.prompt ?? "").toString().trim();
      if (!text) warnings.push(`bank[${i}] (id=${q.id ?? "?"}) has empty question text.`);
    });
    (v2.mocks ?? []).forEach((m) => {
      if (typeof m.mockNumber !== "number") errors.push(`Mock has invalid mockNumber: ${JSON.stringify(m.mockNumber)}.`);
      if (!Array.isArray(m.questionIds)) errors.push(`Mock ${m.mockNumber}: questionIds is not an array.`);
      else m.questionIds.forEach((qid) => {
        if (!ids.has(String(qid))) errors.push(`Mock ${m.mockNumber}: questionId "${qid}" not found in bank.`);
      });
    });
  } else {
    const v1 = file as V1File;
    if (!Array.isArray(v1.tests)) errors.push("V1 file is missing `tests` array.");
    if (v1.topic && v1.topic !== topic) errors.push(`Topic mismatch: file.topic="${v1.topic}" vs url="${topic}".`);
    (v1.tests ?? []).forEach((t) => {
      if (!Array.isArray(t.questions)) errors.push(`Mock ${t.mockNumber}: missing questions array.`);
      (t.questions ?? []).forEach((q, i) => {
        if (!q.id) warnings.push(`Mock ${t.mockNumber} q[${i}] is missing id.`);
      });
    });
  }
  return { ok: errors.length === 0, errors, warnings };
}

export const runImportSelfTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ topic: TopicSchema }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabase } = context;
    const topic = data.topic;
    const path = filePathFor(topic);
    type Check = { name: string; ok: boolean; detail?: string };
    const checks: Check[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roundTripMismatches: { id: string; field: string; before: any; after: any }[] = [];

    // 1. GitHub connection
    let gh: Awaited<ReturnType<typeof testConnection>> | null = null;
    try {
      gh = await testConnection();
      checks.push({ name: "GitHub token present", ok: gh.token.present });
      checks.push({ name: `Repo ${gh.repo.full} accessible`, ok: gh.repo.ok, detail: gh.repo.error });
      checks.push({ name: `Branch ${gh.branch.name} accessible`, ok: gh.branch.ok, detail: gh.branch.error });
      checks.push({ name: "Contents read/write permission", ok: gh.contentsWrite.ok, detail: gh.contentsWrite.error });
    } catch (e) {
      checks.push({ name: "GitHub connection", ok: false, detail: e instanceof Error ? e.message : String(e) });
    }

    // 2. File exists in GitHub
    let oldFile: MockFile | null = null;
    let existingSha: string | null = null;
    try {
      const existing = await getFile(path);
      if (!existing) {
        checks.push({ name: `File exists at ${path}`, ok: false, detail: "Not found in repo." });
      } else {
        existingSha = existing.sha;
        checks.push({ name: `File exists at ${path}`, ok: true, detail: `sha ${existing.sha.slice(0, 7)}` });
        try {
          oldFile = JSON.parse(existing.content) as MockFile;
          checks.push({ name: "Topic JSON parses successfully", ok: true });
        } catch (e) {
          checks.push({ name: "Topic JSON parses successfully", ok: false, detail: e instanceof Error ? e.message : String(e) });
        }
      }
    } catch (e) {
      checks.push({ name: `File exists at ${path}`, ok: false, detail: e instanceof Error ? e.message : String(e) });
    }

    // 3. Schema check
    if (oldFile) {
      const sc = schemaCheckFile(oldFile, topic);
      checks.push({
        name: "JSON matches quiz schema",
        ok: sc.ok,
        detail: sc.ok
          ? sc.warnings.length ? `${sc.warnings.length} soft warning(s).` : "all required fields present"
          : sc.errors.slice(0, 3).join(" | ") + (sc.errors.length > 3 ? ` (+${sc.errors.length - 3} more)` : ""),
      });
    }

    // 4. Export works
    let csvText = "";
    let bank: AnyQ[] = [];
    if (oldFile) {
      try {
        bank = bankOf(oldFile);
        csvText = exportBankAsCsv(bank);
        checks.push({ name: "Export CSV works", ok: csvText.length > 0, detail: `${bank.length} rows · ${csvText.length} chars` });
      } catch (e) {
        checks.push({ name: "Export CSV works", ok: false, detail: e instanceof Error ? e.message : String(e) });
      }
    }

    // 5. Round-trip: parse + merge + validate + diff (expect 0 changes, 0 errors)
    let unchangedImportOk = false;
    if (oldFile && csvText) {
      try {
        const parsed = parseCsv(csvText);
        const merged = mergeIntoFile(oldFile, parsed.rows, parsed.clearByRow);
        const mergedById = new Map(bankOf(merged).filter((q) => q.id).map((q) => [String(q.id), q]));
        const rowIds = parsed.rows.map((r) => String(r.id));
        const roadSignFiles = await loadRoadSignFiles(topic);
        const validation = validateImported(mergedById, rowIds, parsed.rowLines, merged, topic, roadSignFiles);
        const diff = diffBanks(bank, bankOf(merged));
        unchangedImportOk = validation.errors.length === 0 && diff.changed.length === 0 && diff.added.length === 0 && diff.removed.length === 0;
        checks.push({
          name: "Unchanged CSV re-import → 0 errors, 0 changes",
          ok: unchangedImportOk,
          detail: `errors=${validation.errors.length} changed=${diff.changed.length} added=${diff.added.length} removed=${diff.removed.length}`,
        });
        // Capture field-level mismatches for the "Round-trip" panel.
        const beforeById = new Map(bank.filter((q) => q.id).map((q) => [String(q.id), q]));
        for (const c of diff.changed) {
          const before = beforeById.get(c.id) ?? {};
          for (const f of c.changedFields) {
            roundTripMismatches.push({ id: c.id, field: f, before: before[f], after: c.after?.[f] });
          }
        }
      } catch (e) {
        checks.push({ name: "Unchanged CSV re-import → 0 errors, 0 changes", ok: false, detail: e instanceof Error ? e.message : String(e) });
      }
    }

    // 6. Rollback snapshot exists for the last successful commit
    try {
      const { data: hist } = await supabase
        .from("question_import_history")
        .select("id, commit_sha, previous_json, created_at")
        .eq("topic", topic)
        .eq("status", "committed")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!hist) {
        checks.push({ name: "Rollback snapshot exists for latest commit", ok: true, detail: "no commits yet — nothing to roll back" });
      } else {
        checks.push({
          name: "Rollback snapshot exists for latest commit",
          ok: !!hist.previous_json,
          detail: hist.previous_json ? `commit ${String(hist.commit_sha ?? "").slice(0, 7)}` : "missing previous_json",
        });
      }
    } catch (e) {
      checks.push({ name: "Rollback snapshot exists for latest commit", ok: false, detail: e instanceof Error ? e.message : String(e) });
    }

    const okAll = checks.every((c) => c.ok);
    return {
      ok: okAll,
      topic,
      filePath: path,
      existingSha,
      bankSize: bank.length,
      checks,
      roundTrip: {
        ok: unchangedImportOk,
        mismatchCount: roundTripMismatches.length,
        mismatches: roundTripMismatches.slice(0, 50),
      },
      ranAt: new Date().toISOString(),
    };
  });

const DEFAULT_LIVE_BASE_URLS = [
  "https://uktesthub.com",
  "https://uk-test-mastery.lovable.app",
];

export const verifyLiveJson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      topic: TopicSchema,
      baseUrl: z.string().url().max(300).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const path = filePathFor(data.topic);
    const live = `/mocks/${data.topic}.json`;
    const bases = data.baseUrl ? [data.baseUrl] : DEFAULT_LIVE_BASE_URLS;
    const checkedAt = new Date().toISOString();

    let expectedJson: unknown = null;
    let expectedSha: string | null = null;
    try {
      const existing = await getFile(path);
      if (!existing) {
        return {
          ok: false,
          checkedAt,
          filePath: path,
          livePath: live,
          expectedSha: null,
          attempts: [],
          error: `File not found in repo: ${path}`,
        };
      }
      expectedSha = existing.sha;
      expectedJson = JSON.parse(existing.content);
    } catch (e) {
      return {
        ok: false,
        checkedAt,
        filePath: path,
        livePath: live,
        expectedSha: null,
        attempts: [],
        error: e instanceof Error ? e.message : String(e),
      };
    }

    const expectedSerialized = JSON.stringify(expectedJson);
    const attempts: { url: string; status: number | null; updated: boolean; error?: string }[] = [];
    let anyMatch = false;

    for (const base of bases) {
      const url = `${base.replace(/\/$/, "")}${live}?_=${Date.now()}`;
      try {
        const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
        if (!res.ok) {
          attempts.push({ url, status: res.status, updated: false, error: res.statusText });
          continue;
        }
        const text = await res.text();
        let parsed: unknown;
        try { parsed = JSON.parse(text); } catch (e) {
          attempts.push({ url, status: res.status, updated: false, error: e instanceof Error ? e.message : String(e) });
          continue;
        }
        const match = JSON.stringify(parsed) === expectedSerialized;
        if (match) anyMatch = true;
        attempts.push({ url, status: res.status, updated: match });
      } catch (e) {
        attempts.push({ url, status: null, updated: false, error: e instanceof Error ? e.message : String(e) });
      }
    }

    return {
      ok: anyMatch,
      checkedAt,
      filePath: path,
      livePath: live,
      expectedSha,
      attempts,
      error: null as string | null,
    };
  });

