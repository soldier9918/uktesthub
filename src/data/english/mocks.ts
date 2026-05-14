// English Language Tests — mock loader for the (test, skill, level) tree.
//
// Banks live at public/english-mocks/{test}/{skill}/{level}.json (v2 shape).
// Missing banks resolve to undefined → UI shows "coming soon".

import type {
  Quiz,
  Question,
  MCQQuestion,
  FillBlanksQuestion,
  MultipleResponseQuestion,
  TrueFalseQuestion,
} from "@/data/quizzes";
import {
  ENGLISH_QUESTIONS_PER_MOCK,
  ENGLISH_TOTAL_MOCKS,
  LEVEL_SHORT,
  bankPath,
  getSkill,
  getTest,
  type LevelSlug,
  type SkillSlug,
  type TestSlug,
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

type RawTrueFalse = {
  id: string;
  type: "true-false";
  question: string;
  correctAnswer: boolean;
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

type RawBankItem = RawMcq | RawMultipleResponse | RawTrueFalse | RawBlanks;

type V2File = {
  version: 2;
  test: TestSlug;
  skill: SkillSlug;
  level: LevelSlug;
  bank: RawBankItem[];
  mocks: { mockNumber: number; title: string; questionIds: string[] }[];
};

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

function cacheKey(test: TestSlug, skill: SkillSlug, level: LevelSlug): string {
  return `${test}/${skill}/${level}`;
}

async function loadBankFile(
  test: TestSlug,
  skill: SkillSlug,
  level: LevelSlug,
): Promise<V2File | undefined> {
  const key = cacheKey(test, skill, level);
  const cached = fileCache.get(key);
  if (cached) return cached;
  const url = resolveUrl(bankPath(test, skill, level));
  const promise = (async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) return undefined;
      return (await res.json()) as V2File;
    } catch {
      fileCache.delete(key);
      return undefined;
    }
  })();
  fileCache.set(key, promise);
  return promise;
}

export type EnglishMockSlot = {
  mockNumber: number;
  title: string;
  questionsCount: number;
};

/** 45 synchronous slot placeholders. */
export function listEnglishMockSlots(): EnglishMockSlot[] {
  return Array.from({ length: ENGLISH_TOTAL_MOCKS }, (_, i) => ({
    mockNumber: i + 1,
    title: `Mock Test ${i + 1}`,
    questionsCount: ENGLISH_QUESTIONS_PER_MOCK,
  }));
}

export async function countReadyEnglishMocks(
  test: TestSlug,
  skill: SkillSlug,
  level: LevelSlug,
): Promise<number> {
  const file = await loadBankFile(test, skill, level);
  if (!file) return 0;
  const bankIds = new Set(file.bank.map((q) => q.id));
  return file.mocks.filter(
    (m) =>
      m.questionIds.length === ENGLISH_QUESTIONS_PER_MOCK &&
      m.questionIds.every((id) => bankIds.has(id)),
  ).length;
}

function rawToQuestion(raw: RawBankItem, idx: number): Question {
  const id = idx + 1;
  if (raw.type === "multiple-response") {
    const q: MultipleResponseQuestion = {
      type: "multiple-response",
      id,
      question: raw.question,
      options: raw.options,
      correctAnswers: raw.correctAnswers,
      explanation: raw.explanation,
    };
    return q;
  }
  if (raw.type === "fill-blanks" || raw.type === "dropdown-blanks") {
    const q: FillBlanksQuestion = {
      type: "fill-blanks",
      id,
      template: raw.template,
      prompt: raw.prompt,
      blanks: raw.blanks,
      explanation: raw.explanation,
    };
    return q;
  }
  const m = raw as RawMcq;
  const q: MCQQuestion = {
    type: "mcq",
    id,
    question: m.question,
    options: m.options,
    correctAnswer: m.correctAnswer,
    explanation: m.explanation,
  };
  return q;
}

export async function loadEnglishMock(
  testSlug: string,
  skillSlug: string,
  levelSlug: string,
  mockNumber: number,
): Promise<Quiz | undefined> {
  const test = getTest(testSlug);
  if (!test) return undefined;
  const skill = getSkill(test, skillSlug);
  if (!skill) return undefined;
  if (!(skill.levels as string[]).includes(levelSlug)) return undefined;
  if (mockNumber < 1 || mockNumber > ENGLISH_TOTAL_MOCKS) return undefined;
  const level = levelSlug as LevelSlug;
  const file = await loadBankFile(test.slug, skill.slug, level);
  if (!file) return undefined;
  const m = file.mocks.find((x) => x.mockNumber === mockNumber);
  if (!m) return undefined;
  const bankById = new Map(file.bank.map((q) => [q.id, q]));
  const questions: Question[] = [];
  for (const qid of m.questionIds) {
    const q = bankById.get(qid);
    if (q) questions.push(rawToQuestion(q, questions.length));
  }
  if (questions.length === 0) return undefined;
  return {
    slug: `english-${test.slug}-${skill.slug}-${level}-mock-${mockNumber}`,
    category: "english",
    topic: `${test.slug}-${skill.slug}-${level}`,
    quizTitle: `${test.shortTitle} ${skill.shortTitle} ${LEVEL_SHORT[level]} — ${m.title}`,
    description: `${test.shortTitle} ${skill.shortTitle} mock test ${mockNumber} at ${LEVEL_SHORT[level]} level — ${questions.length} questions with explanations.`,
    timeLimit: questions.length * 60,
    difficulty: "Medium",
    passMark: 75,
    questions,
  };
}
