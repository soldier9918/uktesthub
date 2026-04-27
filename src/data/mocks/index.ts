// Aggregates all per-topic mock JSON files. New topic JSON files added under
// src/data/mocks/<topic-slug>.json are picked up automatically via Vite glob.
import type { Quiz } from "@/data/quizzes";

type RawQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};
type MockTest = {
  slug: string; // e.g. "life-in-the-uk-mock-1"
  topic: string; // topic slug
  mockNumber: number; // 1..45
  title: string; // e.g. "Life in the UK Test 1"
  questions: RawQuestion[];
};
type MockFile = { topic: string; tests: MockTest[] };

// Eagerly load all JSON mock files at build time.
const modules = import.meta.glob<MockFile>("./*.json", {
  eager: true,
  import: "default",
});

const byTopic = new Map<string, MockTest[]>();
const bySlug = new Map<string, MockTest>();

for (const file of Object.values(modules)) {
  if (!file?.topic || !Array.isArray(file.tests)) continue;
  const sorted = [...file.tests].sort((a, b) => a.mockNumber - b.mockNumber);
  byTopic.set(file.topic, sorted);
  for (const t of sorted) bySlug.set(t.slug, t);
}

export const TOTAL_MOCKS_PER_TOPIC = 45;
export const QUESTIONS_PER_MOCK = 24;

export function getMocksByTopic(topicSlug: string): MockTest[] {
  return byTopic.get(topicSlug) ?? [];
}

export function getMockBySlug(slug: string): MockTest | undefined {
  return bySlug.get(slug);
}

/**
 * Returns the mock if available, otherwise an empty placeholder so the UI
 * can still render the slot ("0 / 24" with a "Coming soon" hint).
 */
export function listMockSlots(topicSlug: string) {
  const real = getMocksByTopic(topicSlug);
  const realByNum = new Map(real.map((m) => [m.mockNumber, m]));
  return Array.from({ length: TOTAL_MOCKS_PER_TOPIC }, (_, i) => {
    const n = i + 1;
    const m = realByNum.get(n);
    return {
      mockNumber: n,
      slug: m?.slug ?? `${topicSlug}-mock-${n}`,
      title: m?.title ?? `Test ${n}`,
      available: Boolean(m),
      questionsCount: QUESTIONS_PER_MOCK,
    };
  });
}

export function mockToQuiz(category: string, mock: MockTest): Quiz {
  return {
    slug: mock.slug,
    category,
    topic: mock.topic,
    quizTitle: mock.title,
    description: `Mock test ${mock.mockNumber} — ${mock.questions.length} questions.`,
    timeLimit: mock.questions.length * 60, // 1 min/question
    difficulty: "Medium",
    passMark: 75,
    questions: mock.questions.map((q, idx) => ({
      id: idx + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    })),
  };
}
