// Shared validator + repair logic for dropdown / drag-drop blank questions.
// Used by:
//  - csv-import preview (blocks dirty options)
//  - /admin-kb20/blank-options-health (scan + repair UI)
//
// Schema (v2 bank entries):
//   { id, type: "drop-down-blanks" | "drag-drop-blanks" | "dropdown-blanks",
//     question, blanks: [{ correctIndex, options: string[] }], explanation, ... }
//
// Dropdown options must come ONLY from clean strings — never from splitting raw
// JSON/CSV/template text. Anything that looks like a JSON-key leak ("explanation",
// "correctAnswer", "optionA"…) or template artefact (`}}`, `{{0)`, `[object Object]`)
// is treated as malformed.

export const BLANK_TYPES = new Set([
  "drop-down-blanks",
  "drag-drop-blanks",
  "dropdown-blanks",
]);

// JSON/template artefact fragments — always bad, never a legitimate vocab word.
const ARTIFACT_FRAGMENTS: RegExp[] = [
  /\}\}/, // raw `}}` from JSON serialisation leak
  /\{\{[0-9]+\)/, // `{{0)` template artefact
  /\[object Object\]/i,
  /\bundefined\b/,
  /\bnull\b/,
  /\]\}\]/, // `]}]` JSON-tail leak
];

// JSON-key names that have leaked into options. We only flag these when the
// option is *exactly* one of these strings, or when it is appended after junk
// (e.g. `monotonous]}],explanation`). A real vocab word "explanation" is
// extremely unlikely in our banks, but we restrict to exact-match to avoid
// false positives like "promptly".
const SCHEMA_KEY_LEAKS = new Set([
  "explanation",
  "correctAnswer",
  "correctAnswers",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "template",
  // NB: "prompt" is NOT here — it is a legitimate vocab word in IELTS banks.
  // It is only flagged when it appears alongside other clear leaks (handled
  // in repairOptions by trimming trailing schema-key leaks).
]);

export type OptionIssue = {
  kind: "artifact" | "key-leak" | "empty";
  fragment: string;
};

/** Returns the list of issues found in a single option string. */
export function findOptionIssues(opt: unknown): OptionIssue[] {
  if (typeof opt !== "string") {
    return [{ kind: "artifact", fragment: "[non-string option]" }];
  }
  const s = opt.trim();
  if (!s) return [{ kind: "empty", fragment: "" }];
  const issues: OptionIssue[] = [];
  for (const re of ARTIFACT_FRAGMENTS) {
    const m = s.match(re);
    if (m) issues.push({ kind: "artifact", fragment: m[0] });
  }
  if (SCHEMA_KEY_LEAKS.has(s)) {
    issues.push({ kind: "key-leak", fragment: s });
  }
  return issues;
}

export function isDirtyOption(opt: unknown): boolean {
  return findOptionIssues(opt).length > 0;
}

/** Best-effort cleanup of a single option string. May return "" if unsalvageable. */
export function cleanOption(opt: string): string {
  let s = opt;
  // Strip everything from the first `]}],...` onwards (JSON-tail leak).
  s = s.replace(/_*\s*\]\}\],?.*$/i, "");
  // Strip trailing schema-key leak attached without separator, e.g. `wordexplanation`.
  s = s.replace(/(explanation|correctAnswers?|option[ABCD]|template)$/i, "");
  // Strip stray `}}` and `{{N)` template artefacts.
  s = s.replace(/\}\}+/g, "").replace(/\{\{\d+\)/g, "");
  // Strip wrapping quotes and trailing underscores/whitespace.
  s = s.replace(/^["'\s]+|["'\s_]+$/g, "");
  return s.trim();
}

export type RepairedBlank = {
  options: string[];
  correctIndex: number;
  removedIndices: number[];
};

/** Repair the options array of one blank. Removes trailing schema-key-leak
 *  options ("template", standalone "explanation"…) and cleans dirty strings.
 *  Adjusts `correctIndex` if leading options were removed. */
export function repairBlankOptions(
  options: unknown[],
  correctIndex: number,
): RepairedBlank {
  // Step 1: clean each option in place.
  const cleaned: string[] = options.map((o) =>
    typeof o === "string" ? cleanOption(o) : "",
  );

  // Step 2: drop trailing options that are pure schema-key leaks or empty,
  // since these are JSON-key leaks tacked onto the end during parsing.
  const removedIndices: number[] = [];
  while (cleaned.length > 0) {
    const last = cleaned[cleaned.length - 1];
    const lastLower = last.toLowerCase();
    const isLeak = SCHEMA_KEY_LEAKS.has(last) || lastLower === "template";
    if (!last || isLeak) {
      removedIndices.push(cleaned.length - 1);
      cleaned.pop();
    } else {
      break;
    }
  }

  // Step 3: clamp correctIndex.
  let ci = correctIndex;
  if (ci >= cleaned.length) ci = Math.max(0, cleaned.length - 1);
  if (ci < 0) ci = 0;

  return { options: cleaned, correctIndex: ci, removedIndices };
}

export type BankBlankFinding = {
  questionId: string;
  type: string;
  blankIndex: number;
  optionIndex: number;
  field: "options";
  currentValue: string;
  suggestedValue: string;
  issues: OptionIssue[];
  autoFix: boolean;
};

type BankQ = {
  id?: string;
  type?: string;
  blanks?: Array<{ options?: unknown[]; correctIndex?: number }>;
  question?: unknown;
  explanation?: unknown;
};

/** Walk a topic bank and return all blank-option findings. */
export function scanBankForBlankOptionIssues(bank: unknown[]): BankBlankFinding[] {
  const out: BankBlankFinding[] = [];
  for (const raw of bank ?? []) {
    if (!raw || typeof raw !== "object") continue;
    const q = raw as BankQ;
    if (!q.type || !BLANK_TYPES.has(q.type)) continue;
    const id = String(q.id ?? "");
    const blanks = Array.isArray(q.blanks) ? q.blanks : [];
    for (let bi = 0; bi < blanks.length; bi++) {
      const opts = Array.isArray(blanks[bi].options) ? blanks[bi].options! : [];
      for (let oi = 0; oi < opts.length; oi++) {
        const issues = findOptionIssues(opts[oi]);
        if (issues.length === 0) continue;
        const current = typeof opts[oi] === "string" ? (opts[oi] as string) : String(opts[oi]);
        const suggested = cleanOption(current);
        out.push({
          questionId: id,
          type: q.type,
          blankIndex: bi,
          optionIndex: oi,
          field: "options",
          currentValue: current,
          suggestedValue: suggested,
          issues,
          // Auto-fixable when the cleaned value is a non-empty plain word.
          autoFix: !!suggested && /^[A-Za-z][A-Za-z\s_-]{0,40}$/.test(suggested),
        });
      }
    }
  }
  return out;
}

/** Apply repairs in place to a bank. Returns count of options changed and
 *  trailing options removed. */
export function repairBankBlanks(bank: unknown[]): {
  optionsFixed: number;
  optionsRemoved: number;
} {
  let fixed = 0;
  let removed = 0;
  for (const raw of bank ?? []) {
    if (!raw || typeof raw !== "object") continue;
    const q = raw as BankQ;
    if (!q.type || !BLANK_TYPES.has(q.type)) continue;
    const blanks = Array.isArray(q.blanks) ? q.blanks : [];
    for (const b of blanks) {
      const opts = Array.isArray(b.options) ? (b.options as unknown[]) : [];
      const before = opts.map((o) => (typeof o === "string" ? o : ""));
      const rep = repairBlankOptions(opts, b.correctIndex ?? 0);
      b.options = rep.options;
      b.correctIndex = rep.correctIndex;
      for (let i = 0; i < rep.options.length; i++) {
        if (rep.options[i] !== before[i]) fixed++;
      }
      removed += rep.removedIndices.length;
    }
  }
  return { optionsFixed: fixed, optionsRemoved: removed };
}

/** Bad fragments used by the live-JSON verification button. */
export const LIVE_BAD_FRAGMENTS = [
  "}},explanation",
  "{{0)",
  "{{1)",
  "undefined",
  "[object Object]",
] as const;

/** Search any text for any of the LIVE_BAD_FRAGMENTS. Returns the matches found. */
export function findLiveBadFragments(text: string): string[] {
  const hits: string[] = [];
  for (const frag of LIVE_BAD_FRAGMENTS) {
    if (text.includes(frag)) hits.push(frag);
  }
  return hits;
}
