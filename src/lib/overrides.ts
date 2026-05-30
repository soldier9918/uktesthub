import { useEffect, useState } from "react";

export type QuestionOverride = {
  topic: string;
  question_id: string;
  question: string | null;
  options: string[] | null;
  correct_answer: number | number[] | boolean | null;
  explanation: string | null;
  image: string | null;
  image_alt: string | null;
  type?: string | null;
  disabled?: boolean | null;
};

const EMPTY_MAP = new Map<string, QuestionOverride>();

export async function loadOverrides(): Promise<Map<string, QuestionOverride>> {
  return EMPTY_MAP;
}

export function invalidateOverrides() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("question-overrides-invalidated"));
  }
}

type AnyQuiz = { topic: string; questions: Array<Record<string, unknown> & { id: number | string }> };

function hideRoadSignAnswerInPrompt<T extends Record<string, unknown>>(quizTopic: string, question: T): T {
  if (quizTopic !== "road-signs") return question;
  if (question.type !== "image-question" && question.type !== "image_question") return question;
  if (typeof question.image !== "string" || !question.image) return question;
  return { ...question, question: "What does this road sign mean?" };
}

// Kept for backwards compatibility with any caller that still imports it.
export function applyOverrideToQuestionRecord<T extends Record<string, unknown>>(
  question: T,
  _override: QuestionOverride | undefined,
): T {
  return question;
}

export function applyOverrides<T extends AnyQuiz>(quiz: T, _map: Map<string, QuestionOverride>): T {
  return {
    ...quiz,
    questions: quiz.questions.map((q) => hideRoadSignAnswerInPrompt(quiz.topic, q)),
  } as T;
}

export function useOverrides() {
  // Returns a stable empty map so existing callers keep working.
  const [map] = useState<Map<string, QuestionOverride>>(EMPTY_MAP);
  useEffect(() => {
    // No-op: overrides system is disabled.
  }, []);
  return map;
}
