// Shared text-cleanup helpers used by both the bulk editor and the validator
// so they always agree on what counts as "dirty" text.

// Allowed character set: printable ASCII (incl. punctuation) plus a few common
// extended Latin / typographic punctuation marks. Anything else is "weird".
const ALLOWED_RE =
  /^[\u0020-\u007E\u00A0-\u017F\u2010-\u2015\u2018-\u201D\u2026\u20AC\n\r\t]*$/;

export function hasWeirdChars(s: string): boolean {
  return !ALLOWED_RE.test(s);
}

export function stripWeird(s: string): string {
  return Array.from(s)
    .filter((ch) => ALLOWED_RE.test(ch))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

// JSON / code artifacts that leak from the data generation pipeline, e.g.
//   "Higher speed limits],question"
//   "September 2001Array],question"
//   'Foo"," bar' / trailing '],', '"},', '"]', etc.
export const ARTIFACT_PATTERNS: RegExp[] = [
  // Trailing JSON-keyword leaks: "...],question", "...],options", etc.
  /\s*(?:Array)?\s*[\]}"',]*\s*\]\s*,?\s*(?:question|options?|explanation|answer|correctAnswer|correctAnswers)\b.*$/i,
  /\s*[\]}"',]+\s*(?:question|options?|explanation|answer|correctAnswer|correctAnswers)\b.*$/i,
  // Stray "Array" suffix before bracket
  /\s*Array\s*\]?\s*$/,
  // Trailing structural junk
  /\s*[\]}"]+\s*,\s*$/,
  /\s*[\]}]+\s*$/,
  /\s*",\s*"$/,
  /\s*",$/,
  // Stray leading/trailing quote characters
  /^\s*"+/,
  /"+\s*$/,
];

export function stripArtifacts(s: string): string {
  let out = s;
  let prev: string;
  do {
    prev = out;
    for (const re of ARTIFACT_PATTERNS) out = out.replace(re, "");
  } while (out !== prev);
  return out.trim();
}

export function hasArtifacts(s: string): boolean {
  return stripArtifacts(s) !== s.trim();
}
