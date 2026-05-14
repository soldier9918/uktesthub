// English Language Tests — mock loader.
//
// Mirrors src/data/mocks/index.ts but for the English Language Tests
// section. Per-category banks live as static JSON under
// public/english-mocks/<category>.json (v2 bank shape). Categories
// without a bank file render as "coming soon" — both
// `categoryHasBank` and `loadEnglishMockBySlug` resolve to undefined
// without throwing.

import type {
  Quiz,
  Question,
  MCQQuestion,
  FillBlanksQuestion,
  MultipleResponseQuestion,
} from "@/data/quizzes";
import {
  englishCategories,
  ENGLISH_QUESTIONS_PER_MOCK,
  ENGLISH_TOTAL_MOCKS,
  getEnglishCategory,
} from "./categories";

type RawMcq = {
  id: string;
  type?: "mcq";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type RawMultipleResponse = {
  id: string;
  type: "multiple-response";
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
};

type RawBlanks = {
  id: string;
  type: "fill-blanks" | "dropdown-blanks";
  template: string;
  prompt?: string;
  blanks: { options: string[]; correctIndex: number }[];
  explanation: string;
};

type RawBankItem = RawMcq | RawMultipleResponse | RawBlanks;

type V2File = {
  version: 2;
  category: string; // slug
  bank: RawBankItem[];
  mocks: { mockNumber: number; title: string; questionIds: string[] }[];
};

const slugSet = new Set(englishCategories.map((c) => c.slug));

const fileCache = new Map<string, Promise<V2File | undefined>>();

function resolveUrl(path: string): string {
  if (typeof window !== "undefined") return path;
  const g = globalThis as { __MOCK_BASE_URL__?: string };
  const base =
    g.__MOCK_BASE_URL__ ||
    (typeof process !== "undefined" && process.env?.SITE_URL) ||
    "https://www.uktesthub.com";
  return new URL(path, base).toString();
}

async function loadCategoryFile(slug: string): Promise<V2File | undefined> {
  if (!slugSet.has(slug)) return undefined;
  const cached = fileCache.get(slug);
  if (cached) return cached;
  const url = resolveUrl(`/english-mocks/${slug}.json`);
  const promise = (async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) return undefined;
      return (await res.json()) as V2File;
    } catch {
      fileCache.delete(slug);
      return undefined;
    }
  })();
  fileCache.set(slug, promise);
  return promise;
}

export type EnglishMockSlot = {
  mockNumber: number;
  slug: string; // e.g. "ielts-mock-1" — only used internally for keys
  routeNumber: number; // mock-test-N number used in URLs
  title: string;
  available: boolean;
  questionsCount: number;
};

/**
 * Synchronous metadata: returns 45 slots regardless of whether the bank
 * exists. Availability is determined lazily when the user opens a mock
 * (the file fetch resolves to undefined → "coming soon" UI).
 */
export function listEnglishMockSlots(categorySlug: string): EnglishMockSlot[] {
  if (!slugSet.has(categorySlug)) return [];
  return Array.from({ length: ENGLISH_TOTAL_MOCKS }, (_, i) => {
    const n = i + 1;
    return {
      mockNumber: n,
      routeNumber: n,
      slug: `${categorySlug}-mock-${n}`,
      title: `Mock Test ${n}`,
      available: false, // optimistic: client will resolve real availability when opened
      questionsCount: ENGLISH_QUESTIONS_PER_MOCK,
    };
  });
}

/**
 * Returns the count of mocks whose questions are ready (24 questions
 * present in the bank). 0 if no bank file exists.
 */
export async function countReadyEnglishMocks(
  categorySlug: string,
): Promise<number> {
  const file = await loadCategoryFile(categorySlug);
  if (!file) return 0;
  const bankIds = new Set(file.bank.map((q) => q.id));
  return file.mocks.filter(
    (m) =>
      m.questionIds.length === ENGLISH_QUESTIONS_PER_MOCK &&
      m.questionIds.every((id) => bankIds.has(id)),
  ).length;
}

/**
 * Lazy bank-presence check. Cached after first call.
 */
export async function categoryHasBank(categorySlug: string): Promise<boolean> {
  const file = await loadCategoryFile(categorySlug);
  return Boolean(file && file.bank.length > 0);
}

function rawToMcq(raw: RawMcq, idx: number): MCQQuestion {
  return {
    type: "mcq",
    id: idx + 1,
    question: raw.question,
    options: raw.options,
    correctAnswer: raw.correctAnswer,
    explanation: raw.explanation,
  };
}

/**
 * Load a single mock and adapt it to the `Quiz` shape used by
 * QuizRunner. Returns undefined if the bank is missing, the mock
 * number is out of range, or the mock is incomplete.
 */
export async function loadEnglishMockBySlug(
  categorySlug: string,
  mockNumber: number,
): Promise<Quiz | undefined> {
  const cat = getEnglishCategory(categorySlug);
  if (!cat) return undefined;
  if (mockNumber < 1 || mockNumber > ENGLISH_TOTAL_MOCKS) return undefined;
  const file = await loadCategoryFile(categorySlug);
  if (!file) return undefined;
  const m = file.mocks.find((x) => x.mockNumber === mockNumber);
  if (!m) return undefined;
  const bankById = new Map(file.bank.map((q) => [q.id, q]));
  const questions: Question[] = [];
  for (const qid of m.questionIds) {
    const q = bankById.get(qid);
    if (q) questions.push(rawToMcq(q, questions.length));
  }
  if (questions.length === 0) return undefined;
  return {
    slug: `english-${categorySlug}-mock-${mockNumber}`,
    category: "english",
    topic: categorySlug,
    quizTitle: `${cat.shortTitle} — ${m.title}`,
    description: `${cat.shortTitle} mock test ${mockNumber} — ${questions.length} questions with explanations.`,
    timeLimit: questions.length * 60,
    difficulty: "Medium",
    passMark: 75,
    questions,
  };
}
