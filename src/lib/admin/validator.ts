// Shared question-bank validator used by /admin-kb20/validator and import/export.
import { hasArtifacts, stripArtifacts } from "@/lib/admin/text-cleanup";

export type Finding = {
  topic: string;
  questionId?: string;
  questionIndex?: number;
  questionText?: string;
  /** For duplicate-id / duplicate-text: list of all question IDs sharing the value. */
  relatedIds?: string[];
  rule:
    | "duplicate-id"
    | "duplicate-text"
    | "missing-explanation"
    | "invalid-correct-answer"
    | "missing-image"
    | "unknown-type"
    | "suspicious-characters"
    | "json-code-artifact";
  message: string;
  /** For suspicious-characters / json-code-artifact: which field, sample, and detected scripts. */
  field?: string;
  sample?: string;
};

const KNOWN_TYPES = new Set([
  "mcq",
  "multiple_choice",
  "fill-blanks",
  "dropdown_blanks",
  "drag-drop-blanks",
  "drag_drop_blanks",
  "true-false",
  "true_false",
  "multiple-response",
  "multiple_response",
  "numeric-entry",
  "numeric_entry",
  "image-question",
  "image_question",
  "hot-spot",
  "hot_spot",
]);

type AnyQ = Record<string, unknown> & { id?: string; type?: string };

export function validateTopicBank(
  topic: string,
  bank: AnyQ[],
  publicImages: Set<string>,
): Finding[] {
  const findings: Finding[] = [];
  const idsByValue = new Map<string, string[]>();
  const idsByText = new Map<string, string[]>();
  const textPreview = new Map<string, string>();

  const textOf = (q: AnyQ): string | undefined =>
    (q.question as string | undefined) ??
    (q.template as string | undefined) ??
    (q.prompt as string | undefined);

  const snippet = (s: string | undefined, n = 140) =>
    s ? (s.length > n ? `${s.slice(0, n)}…` : s) : undefined;

  // Detect non-Latin scripts and other suspicious characters.
  // Allowed: basic Latin + Latin-1 Supplement + Latin Extended (covers UK English,
  // accented names, £, €, °, etc.), common punctuation, symbols, whitespace.
  const SCRIPT_RANGES: { name: string; re: RegExp }[] = [
    { name: "Arabic", re: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/ },
    { name: "Hebrew", re: /[\u0590-\u05FF]/ },
    { name: "Cyrillic", re: /[\u0400-\u04FF\u0500-\u052F]/ },
    { name: "Greek", re: /[\u0370-\u03FF]/ },
    { name: "CJK", re: /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF]/ },
    { name: "Devanagari", re: /[\u0900-\u097F]/ },
    { name: "Thai", re: /[\u0E00-\u0E7F]/ },
    { name: "Armenian", re: /[\u0530-\u058F]/ },
    { name: "Georgian", re: /[\u10A0-\u10FF]/ },
  ];
  const REPLACEMENT_CHAR = /\uFFFD/;
  const ZERO_WIDTH = /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/;
  const PRIVATE_USE = /[\uE000-\uF8FF]/;

  const detectSuspicious = (s: string | undefined): { scripts: string[]; sample: string } | null => {
    if (!s) return null;
    const hits: string[] = [];
    for (const { name, re } of SCRIPT_RANGES) if (re.test(s)) hits.push(name);
    if (REPLACEMENT_CHAR.test(s)) hits.push("Replacement char (�)");
    if (ZERO_WIDTH.test(s)) hits.push("Zero-width / bidi");
    if (PRIVATE_USE.test(s)) hits.push("Private-use");
    if (hits.length === 0) return null;
    // Surface a window around the first offending char.
    const allRe = new RegExp(
      [
        ...SCRIPT_RANGES.map((r) => r.re.source),
        REPLACEMENT_CHAR.source,
        ZERO_WIDTH.source,
        PRIVATE_USE.source,
      ].join("|"),
    );
    const m = allRe.exec(s);
    const i = m ? m.index : 0;
    const start = Math.max(0, i - 30);
    const end = Math.min(s.length, i + 30);
    const sample = (start > 0 ? "…" : "") + s.slice(start, end) + (end < s.length ? "…" : "");
    return { scripts: hits, sample };
  };

  const checkSuspicious = (q: AnyQ, id: string | undefined, idx: number, qText: string | undefined) => {
    const fields: { name: string; value: unknown }[] = [
      { name: "question", value: textOf(q) },
      { name: "explanation", value: q.explanation },
      { name: "imageAlt", value: (q as Record<string, unknown>).imageAlt },
    ];
    const opts = q.options as unknown[] | undefined;
    if (Array.isArray(opts)) {
      opts.forEach((o, i) => fields.push({ name: `option[${i}]`, value: o }));
    }
    for (const f of fields) {
      if (typeof f.value !== "string") continue;
      const found = detectSuspicious(f.value);
      if (found) {
        findings.push({
          topic, questionId: id, questionIndex: idx, questionText: snippet(qText),
          rule: "suspicious-characters",
          field: f.name,
          sample: found.sample,
          message: `Non-Latin / suspicious chars in ${f.name}: ${found.scripts.join(", ")}`,
        });
      }
      if (hasArtifacts(f.value)) {
        const cleaned = stripArtifacts(f.value);
        findings.push({
          topic, questionId: id, questionIndex: idx, questionText: snippet(qText),
          rule: "json-code-artifact",
          field: f.name,
          sample: `"${f.value}" → "${cleaned}"`,
          message: `JSON/code artifact in ${f.name} (use bulk "Strip JSON/code artifacts")`,
        });
      }
    }
  };

  bank.forEach((q, idx) => {
    const id = q.id;
    const qText = textOf(q);
    if (id) {
      const arr = idsByValue.get(id) ?? [];
      arr.push(id);
      idsByValue.set(id, arr);
    }
    if (qText) {
      const key = qText.trim().toLowerCase();
      const arr = idsByText.get(key) ?? [];
      if (id) arr.push(id);
      idsByText.set(key, arr);
      if (!textPreview.has(key)) textPreview.set(key, qText);
    }

    const type = q.type ?? "mcq";
    if (!KNOWN_TYPES.has(type)) {
      findings.push({
        topic, questionId: id, questionIndex: idx, questionText: snippet(qText),
        rule: "unknown-type",
        message: `Unknown question type "${type}"`,
      });
    }

    const explanation = q.explanation as string | undefined;
    if (!explanation || !explanation.trim()) {
      findings.push({
        topic, questionId: id, questionIndex: idx, questionText: snippet(qText),
        rule: "missing-explanation",
        message: "Explanation is empty",
      });
    }

    const matchesLabel = (ans: unknown, opts: unknown): boolean => {
      if (typeof ans !== "string" || !ans.trim() || !Array.isArray(opts)) return false;
      const a = ans.trim().toLowerCase();
      return opts.some((o) => typeof o === "string" && o.trim().toLowerCase() === a);
    };

    if (type === "mcq" || type === "multiple_choice" || type === "image-question" || type === "image_question") {
      const opts = q.options as unknown[] | undefined;
      const ans = q.correctAnswer as unknown;
      const validIndex = Array.isArray(opts) && typeof ans === "number" && ans >= 0 && ans < opts.length;
      if (!validIndex && !matchesLabel(ans, opts)) {
        findings.push({
          topic, questionId: id, questionIndex: idx, questionText: snippet(qText),
          rule: "invalid-correct-answer",
          message: "correctAnswer out of range or options missing",
        });
      }
    } else if (type === "true-false" || type === "true_false") {
      const ans = q.correctAnswer as unknown;
      let ok = typeof ans === "boolean";
      if (!ok && typeof ans === "string") {
        const s = ans.trim().toLowerCase();
        ok = s === "true" || s === "false" || matchesLabel(ans, q.options);
      }
      if (!ok) {
        findings.push({
          topic, questionId: id, questionIndex: idx, questionText: snippet(qText),
          rule: "invalid-correct-answer",
          message: "true-false requires boolean correctAnswer",
        });
      }
    } else if (type === "multiple-response" || type === "multiple_response") {
      const opts = q.options as unknown[] | undefined;
      const arr = q.correctAnswers as number[] | undefined;
      if (!Array.isArray(opts) || !Array.isArray(arr) || arr.length === 0 ||
        arr.some((i) => typeof i !== "number" || i < 0 || i >= opts.length)) {
        findings.push({
          topic, questionId: id, questionIndex: idx, questionText: snippet(qText),
          rule: "invalid-correct-answer",
          message: "multiple-response correctAnswers invalid",
        });
      }
    }

    const img = q.image as string | undefined;
    if (img) {
      const norm = img.startsWith("/") ? img : `/${img}`;
      if (!/^https?:\/\//.test(img) && !publicImages.has(norm)) {
        findings.push({
          topic, questionId: id, questionIndex: idx, questionText: snippet(qText),
          rule: "missing-image",
          message: `Image not found in public assets: ${img}`,
        });
      }
    }

    checkSuspicious(q, id, idx, qText);
  });

  // Build per-id occurrence list (need actual ids, but idsByValue stored same id repeated).
  // Collect index positions to give back distinct duplicate occurrences with their text.
  const idOccurrences = new Map<string, { id: string; text?: string }[]>();
  bank.forEach((q) => {
    if (!q.id) return;
    const arr = idOccurrences.get(q.id) ?? [];
    arr.push({ id: q.id, text: snippet(textOf(q)) });
    idOccurrences.set(q.id, arr);
  });

  for (const [id, occ] of idOccurrences) {
    if (occ.length > 1) {
      findings.push({
        topic, questionId: id, questionText: occ[0]?.text,
        relatedIds: occ.map((o) => o.id),
        rule: "duplicate-id",
        message: `Question id "${id}" appears ${occ.length} times`,
      });
    }
  }

  for (const [key, ids] of idsByText) {
    if (ids.length > 1) {
      findings.push({
        topic, questionText: snippet(textPreview.get(key)),
        relatedIds: ids,
        rule: "duplicate-text",
        message: `Duplicate question text x${ids.length}`,
      });
    }
  }

  return findings;
}

