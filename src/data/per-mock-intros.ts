/**
 * Per-mock intro content shown on individual mock test start pages.
 * Keyed by topic slug then mock number. Used to give each mock page
 * unique body content for SEO and learner guidance.
 *
 * THE DATA SOURCE OF TRUTH IS src/data/per-mock-intros.json.
 * This file only re-exports it (with types) so the rest of the app keeps
 * working. The admin "Mock Intros CSV Import" tool reads and writes the
 * JSON file directly via GitHub, NOT the bundled snapshot — that's how
 * we avoid the import-overwrites-everything bug.
 */

import data from "./per-mock-intros.json";

export type Difficulty = "Beginner" | "Intermediate" | "Exam-ready";

export type PerMockFaq = { q: string; a: string };

export type PerMockIntro = {
  difficulty: Difficulty;
  covers: string;
  commonMistakes: string[];
  /** Optional per-mock topic bullets. Falls back to the topic-level intro list. */
  topicsIncluded?: string[];
  /** Optional per-mock "Who this mock is for" wording. */
  whoFor?: string;
  /** Optional per-mock FAQs (prepended ahead of topic-level FAQs at render time). */
  faqs?: PerMockFaq[];
};

export type RelatedGuide = { label: string; href: string; intro: string };

type IntrosJson = {
  intros: Record<string, Record<string, PerMockIntro>>;
  related: Record<string, RelatedGuide>;
};

const json = data as IntrosJson;

/**
 * Note: JSON object keys are always strings, so the inner record keys are
 * numeric strings ("1", "2", ...). JS coerces numeric property access
 * (`obj[1]`) to a string lookup, so `PER_MOCK_INTROS[slug][1]` still works.
 * The type below intentionally widens the inner key to `number` so call
 * sites that index with numbers stay type-safe.
 */
export const PER_MOCK_INTROS: Record<string, Record<number, PerMockIntro>> =
  json.intros as unknown as Record<string, Record<number, PerMockIntro>>;

export const RELATED_GUIDE_BY_TOPIC: Record<string, RelatedGuide> = json.related;

export function getPerMockIntro(
  topicSlug: string,
  mockNumber: number,
): PerMockIntro | undefined {
  return PER_MOCK_INTROS[topicSlug]?.[mockNumber];
}

export function getRelatedGuide(topicSlug: string): RelatedGuide | undefined {
  return RELATED_GUIDE_BY_TOPIC[topicSlug];
}
