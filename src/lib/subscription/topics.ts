/**
 * The list of purchasable Exam Pro topics. An English test (e.g. IELTS) counts
 * as ONE topic covering every skill and level inside it.
 */
import { categories, findTopic } from "@/data/categories";
import { englishTests, getTest } from "@/data/english/categories";

export type PurchasableTopic = {
  slug: string;
  title: string;
  group: string;
};

export function listPurchasableTopics(): PurchasableTopic[] {
  const fromCategories = categories.flatMap((category) =>
    category.topics.map((topic) => ({
      slug: topic.slug,
      title: topic.title,
      group: category.title,
    })),
  );
  const fromEnglish = englishTests.map((test) => ({
    slug: test.slug,
    title: test.shortTitle ?? test.tagline,
    group: "English Language Tests",
  }));
  const seen = new Set<string>();
  return [...fromEnglish, ...fromCategories]
    .filter((t) => (seen.has(t.slug) ? false : (seen.add(t.slug), true)))
    .sort((a, b) => a.title.localeCompare(b.title, "en-GB"));
}

export function isValidTopicSlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return Boolean(findTopic(slug) || getTest(slug));
}

export function topicTitle(slug: string | null | undefined): string {
  if (!slug) return "";
  const test = getTest(slug);
  if (test) return test.shortTitle ?? test.tagline;
  return findTopic(slug)?.topic.title ?? slug;
}
