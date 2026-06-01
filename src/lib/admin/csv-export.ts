// Shared CSV export helpers for the admin question banks.
//
// Produces rows in the exact column layout the CSV importer expects, so
// exported files round-trip cleanly through `previewCsvImport` /
// `commitCsvImport` (including blanks-type questions where the importer
// rebuilds `blanks[0]` from optionA-D + correctAnswer in Full replacement mode).

export type RawQuestion = Record<string, unknown> & {
  id?: string;
  type?: string;
  question?: string;
  template?: string;
  prompt?: string;
  explanation?: string;
  image?: string;
  imageAlt?: string;
  options?: string[];
  correctAnswer?: unknown;
  correctAnswers?: unknown;
  blanks?: { options: string[]; correctIndex: number }[];
};

type V2 = {
  version: 2;
  topic: string;
  bank: (RawQuestion & { id: string })[];
  mocks?: unknown;
};
type V1 = {
  topic: string;
  tests: { questions: RawQuestion[] }[];
};
export type AnyTopicFile = V1 | V2;

export const CSV_HEADERS = [
  "id",
  "type",
  "question",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctAnswer",
  "correctAnswers",
  "explanation",
  "image",
  "imageAlt",
] as const;

const BLANK_TYPES = new Set([
  "fill-blanks",
  "fill_blanks",
  "drop-down-blanks",
  "dropdown_blanks",
  "dropdown-blanks",
  "drag-drop-blanks",
  "drag_drop_blanks",
]);

function normaliseType(t: unknown): string {
  if (typeof t !== "string" || !t) return "mcq";
  const x = t.replace(/_/g, "-");
  return x === "multiple-choice" ? "mcq" : x;
}

export function extractBank(file: AnyTopicFile): RawQuestion[] {
  if ((file as V2).version === 2 && Array.isArray((file as V2).bank)) {
    return (file as V2).bank;
  }
  const v1 = file as V1;
  const out: RawQuestion[] = [];
  for (const t of v1.tests ?? []) {
    for (const q of t.questions ?? []) out.push(q);
  }
  return out;
}

/**
 * Flatten a raw question into a CSV-importer-compatible row.
 * For blanks questions, projects blanks[0] into optionA-D + correctAnswer
 * (index) so Full replacement mode can rebuild the blanks array.
 */
export function questionToCsvRow(q: RawQuestion, fallbackId: string) {
  const type = normaliseType(q.type);
  const isBlank = BLANK_TYPES.has(type) || BLANK_TYPES.has(String(q.type ?? ""));
  let options: string[] = Array.isArray(q.options) ? (q.options as string[]) : [];
  let correctAnswer: unknown = q.correctAnswer ?? null;

  if (isBlank && Array.isArray(q.blanks) && q.blanks.length > 0) {
    const b = q.blanks[0];
    if (b && Array.isArray(b.options)) {
      options = b.options;
      if (typeof b.correctIndex === "number") correctAnswer = b.correctIndex;
    }
  }

  return {
    id: (q.id as string | undefined) ?? fallbackId,
    type,
    question: (q.question as string | undefined) ?? (q.template as string | undefined) ?? (q.prompt as string | undefined) ?? "",
    optionA: options[0] ?? "",
    optionB: options[1] ?? "",
    optionC: options[2] ?? "",
    optionD: options[3] ?? "",
    correctAnswer,
    correctAnswers: q.correctAnswers ?? null,
    explanation: (q.explanation as string | undefined) ?? "",
    image: (q.image as string | undefined) ?? "",
    imageAlt: (q.imageAlt as string | undefined) ?? "",
  };
}

function csvEscape(v: unknown): string {
  const s = v == null ? "" : typeof v === "string" ? v : JSON.stringify(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export function rowsToCsv(rows: ReturnType<typeof questionToCsvRow>[], extraLeadingCols?: { name: string; value: string }[]): string {
  const headers = [
    ...(extraLeadingCols?.map((c) => c.name) ?? []),
    ...CSV_HEADERS,
  ];
  const lines = [headers.join(",")];
  for (const r of rows) {
    const cells = [
      ...(extraLeadingCols?.map((c) => csvEscape(c.value)) ?? []),
      csvEscape(r.id),
      csvEscape(r.type),
      csvEscape(r.question),
      csvEscape(r.optionA),
      csvEscape(r.optionB),
      csvEscape(r.optionC),
      csvEscape(r.optionD),
      csvEscape(r.correctAnswer),
      csvEscape(r.correctAnswers),
      csvEscape(r.explanation),
      csvEscape(r.image),
      csvEscape(r.imageAlt),
    ];
    lines.push(cells.join(","));
  }
  return lines.join("\n");
}

/** Build the CSV string for a single topic file. */
export function buildTopicCsv(file: AnyTopicFile): { csv: string; count: number } {
  const bank = extractBank(file);
  const rows = bank.map((q, i) => questionToCsvRow(q, `row-${i + 1}`));
  return { csv: rowsToCsv(rows), count: rows.length };
}

/** Build a combined CSV with category + topic columns prepended. */
export function buildCombinedCsv(
  entries: { category: string; topic: string; file: AnyTopicFile }[],
): { csv: string; count: number } {
  const headers = ["category", "topic", ...CSV_HEADERS];
  const lines = [headers.join(",")];
  let total = 0;
  for (const e of entries) {
    const bank = extractBank(e.file);
    for (let i = 0; i < bank.length; i++) {
      const r = questionToCsvRow(bank[i], `${e.topic}-${i + 1}`);
      lines.push(
        [
          csvEscape(e.category),
          csvEscape(e.topic),
          csvEscape(r.id),
          csvEscape(r.type),
          csvEscape(r.question),
          csvEscape(r.optionA),
          csvEscape(r.optionB),
          csvEscape(r.optionC),
          csvEscape(r.optionD),
          csvEscape(r.correctAnswer),
          csvEscape(r.correctAnswers),
          csvEscape(r.explanation),
          csvEscape(r.image),
          csvEscape(r.imageAlt),
        ].join(","),
      );
      total++;
    }
  }
  return { csv: lines.join("\n"), count: total };
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
