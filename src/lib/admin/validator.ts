// Shared question-bank validator used by /admin-kb20/validator and import/export.

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
    | "suspicious-characters";
  message: string;
  /** For suspicious-characters: which field, sample, and detected scripts. */
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

    if (type === "mcq" || type === "multiple_choice" || type === "image-question" || type === "image_question") {
      const opts = q.options as unknown[] | undefined;
      const ans = q.correctAnswer as number | undefined;
      if (!Array.isArray(opts) || typeof ans !== "number" || ans < 0 || ans >= opts.length) {
        findings.push({
          topic, questionId: id, questionIndex: idx, questionText: snippet(qText),
          rule: "invalid-correct-answer",
          message: "correctAnswer out of range or options missing",
        });
      }
    } else if (type === "true-false" || type === "true_false") {
      if (typeof q.correctAnswer !== "boolean") {
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

