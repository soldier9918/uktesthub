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
    | "unknown-type";
  message: string;
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
  const idCount = new Map<string, number>();
  const textCount = new Map<string, number>();

  bank.forEach((q, idx) => {
    const id = q.id;
    if (id) idCount.set(id, (idCount.get(id) ?? 0) + 1);
    const text = (q.question as string | undefined) ?? (q.template as string | undefined);
    if (text) {
      const key = text.trim().toLowerCase();
      textCount.set(key, (textCount.get(key) ?? 0) + 1);
    }

    const type = q.type ?? "mcq";
    if (!KNOWN_TYPES.has(type)) {
      findings.push({
        topic,
        questionId: id,
        questionIndex: idx,
        rule: "unknown-type",
        message: `Unknown question type "${type}"`,
      });
    }

    const explanation = q.explanation as string | undefined;
    if (!explanation || !explanation.trim()) {
      findings.push({
        topic,
        questionId: id,
        questionIndex: idx,
        rule: "missing-explanation",
        message: "Explanation is empty",
      });
    }

    // Correct-answer sanity per type
    if (type === "mcq" || type === "multiple_choice" || type === "image-question" || type === "image_question") {
      const opts = q.options as unknown[] | undefined;
      const ans = q.correctAnswer as number | undefined;
      if (!Array.isArray(opts) || typeof ans !== "number" || ans < 0 || ans >= opts.length) {
        findings.push({
          topic,
          questionId: id,
          questionIndex: idx,
          rule: "invalid-correct-answer",
          message: "correctAnswer out of range or options missing",
        });
      }
    } else if (type === "true-false" || type === "true_false") {
      if (typeof q.correctAnswer !== "boolean") {
        findings.push({
          topic,
          questionId: id,
          questionIndex: idx,
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
          topic, questionId: id, questionIndex: idx,
          rule: "invalid-correct-answer",
          message: "multiple-response correctAnswers invalid",
        });
      }
    }

    // Image checks
    const img = q.image as string | undefined;
    if (img) {
      const norm = img.startsWith("/") ? img : `/${img}`;
      if (!/^https?:\/\//.test(img) && !publicImages.has(norm)) {
        findings.push({
          topic, questionId: id, questionIndex: idx,
          rule: "missing-image",
          message: `Image not found in public assets: ${img}`,
        });
      }
    }
  });

  for (const [id, count] of idCount) {
    if (count > 1) {
      findings.push({
        topic, questionId: id,
        rule: "duplicate-id",
        message: `Question id "${id}" appears ${count} times`,
      });
    }
  }
  for (const [key, count] of textCount) {
    if (count > 1) {
      findings.push({
        topic,
        rule: "duplicate-text",
        message: `Duplicate question text x${count}: "${key.slice(0, 80)}…"`,
      });
    }
  }

  return findings;
}
