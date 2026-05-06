// Lexical similarity helpers for the admin "Similar Questions" tool.
// Trigram Jaccard with an inverted-index candidate generation step so we can
// scan thousands of questions in the browser without doing N^2 comparisons.

const STOPWORDS = new Set([
  "the","a","an","and","or","of","to","in","on","at","for","with","is","are",
  "was","were","be","been","being","by","from","as","that","this","these",
  "those","it","its","you","your","i","we","they","them","he","she","his","her",
  "what","which","who","whom","when","where","why","how","do","does","did","not",
  "no","yes","but","if","then","than","so","such","may","can","could","should",
  "would","will","shall","must","might","also","into","over","under","about",
  "before","after","between","through","during","without","within","while",
];

export function normalizeForSimilarity(s: string): string {
  return (s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w))
    .join(" ");
}

export function trigrams(s: string): Set<string> {
  const norm = normalizeForSimilarity(s);
  const padded = `  ${norm} `;
  const out = new Set<string>();
  if (padded.length < 3) return out;
  for (let i = 0; i <= padded.length - 3; i++) {
    out.add(padded.slice(i, i + 3));
  }
  return out;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const t of small) if (large.has(t)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

export type SimItem = {
  topic: string;
  id: string;
  blob: string;
  trigrams: Set<string>;
};

export type SimPair = {
  a: { topic: string; id: string; text: string };
  b: { topic: string; id: string; text: string };
  score: number;
};

/**
 * Find pairs whose trigram-Jaccard similarity is >= threshold.
 * Uses an inverted index over trigrams to avoid the full N^2 sweep.
 * `crossTopic` controls whether pairs from different topics are eligible.
 */
export function findSimilarPairs(
  items: SimItem[],
  threshold: number,
  crossTopic: boolean,
  onProgress?: (done: number, total: number) => void,
): SimPair[] {
  // Inverted index: trigram -> indices that contain it.
  const index = new Map<string, number[]>();
  items.forEach((it, i) => {
    for (const t of it.trigrams) {
      const arr = index.get(t);
      if (arr) arr.push(i);
      else index.set(t, [i]);
    }
  });

  const seen = new Set<number>(); // packed pair key
  const pairs: SimPair[] = [];
  const N = items.length;

  for (let i = 0; i < N; i++) {
    const a = items[i];
    if (a.trigrams.size === 0) continue;
    // Count shared trigrams to find candidates with enough overlap.
    const counts = new Map<number, number>();
    for (const t of a.trigrams) {
      const arr = index.get(t);
      if (!arr) continue;
      for (const j of arr) {
        if (j <= i) continue;
        counts.set(j, (counts.get(j) ?? 0) + 1);
      }
    }
    for (const [j, shared] of counts) {
      if (shared < 3) continue; // cheap prefilter
      const b = items[j];
      if (!crossTopic && a.topic !== b.topic) continue;
      // Quick upper bound: shared / max(|a|,|b|) >= threshold * something.
      // Compute exact Jaccard.
      const union = a.trigrams.size + b.trigrams.size - shared;
      const score = union === 0 ? 0 : shared / union;
      if (score < threshold) continue;
      const packed = i * N + j;
      if (seen.has(packed)) continue;
      seen.add(packed);
      pairs.push({
        a: { topic: a.topic, id: a.id, text: a.blob },
        b: { topic: b.topic, id: b.id, text: b.blob },
        score,
      });
    }
    if (onProgress && (i % 50 === 0 || i === N - 1)) onProgress(i + 1, N);
  }

  pairs.sort((x, y) => y.score - x.score);
  return pairs;
}

export function buildBlob(q: {
  question?: string;
  template?: string;
  prompt?: string;
  options?: unknown;
  explanation?: string;
}): string {
  const text =
    (q.question ?? q.template ?? q.prompt ?? "") +
    (Array.isArray(q.options)
      ? " | " + (q.options as unknown[]).map((o) => String(o)).join(" | ")
      : "") +
    (q.explanation ? " | " + q.explanation : "");
  return text;
}
