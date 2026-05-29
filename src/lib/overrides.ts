import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

let cache: Map<string, QuestionOverride> | null = null;
let inflight: Promise<Map<string, QuestionOverride>> | null = null;

function key(topic: string, qid: string) {
  return `${topic}::${qid}`;
}

export async function loadOverrides(): Promise<Map<string, QuestionOverride>> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const map = new Map<string, QuestionOverride>();
    const PAGE = 1000;
    let from = 0;
    // Paginate to bypass Supabase's default 1000-row cap.
    while (true) {
      const { data, error } = await supabase
        .from("question_overrides")
        .select("topic,question_id,question,options,correct_answer,explanation,image,image_alt,type,disabled")
        .order("topic", { ascending: true })
        .order("question_id", { ascending: true })
        .range(from, from + PAGE - 1);
      if (error || !data) break;
      for (const row of data) {
        map.set(key(row.topic, row.question_id), row as unknown as QuestionOverride);
      }
      if (data.length < PAGE) break;
      from += PAGE;
    }
    cache = map;
    inflight = null;
    return map;
  })();
  return inflight;
}

export function invalidateOverrides() {
  cache = null;
  inflight = null;
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

export function applyOverrideToQuestionRecord<T extends Record<string, unknown>>(
  question: T,
  override: QuestionOverride | undefined,
): T {
  if (!override) return question;
  const next: Record<string, unknown> = { ...question };
  const hasContentOverride =
    override.question != null ||
    Array.isArray(override.options) ||
    override.correct_answer != null ||
    override.explanation != null ||
    override.type != null;
  if (override.type != null) next.type = override.type;
  if (override.question != null) {
    if ("template" in next && !("question" in next)) next.template = override.question;
    else if ("prompt" in next && !("question" in next)) next.prompt = override.question;
    else next.question = override.question;
  }
  if (Array.isArray(override.options)) next.options = override.options;
  if (override.correct_answer != null) {
    const t = next.type;
    if ((t === "multiple-response" || t === "multiple_response") && Array.isArray(override.correct_answer)) {
      next.correctAnswers = override.correct_answer;
      delete next.correctAnswer;
    } else {
      next.correctAnswer = override.correct_answer;
      if (!Array.isArray(override.correct_answer)) delete next.correctAnswers;
    }
  }
  if (override.explanation != null) next.explanation = override.explanation;
  if (override.image != null) {
    next.image = override.image;
  } else if (hasContentOverride) {
    delete next.image;
    if (next.type === "image_question" || next.type === "image-question") next.type = "mcq";
  }
  if (override.image_alt != null) next.imageAlt = override.image_alt;
  else if (hasContentOverride && override.image == null) delete next.imageAlt;
  return next as T;
}

export function applyOverrides<T extends AnyQuiz>(quiz: T, map: Map<string, QuestionOverride>): T {
  let mutated = false;
  const nextQuestions: typeof quiz.questions = [];
  for (const q of quiz.questions) {
    const srcId = (q as { sourceId?: string }).sourceId;
    const o =
      (srcId ? map.get(key(quiz.topic, srcId)) : undefined) ??
      map.get(key(quiz.topic, String(q.id)));
    if (!o) {
      nextQuestions.push(q);
      continue;
    }
    if (o.disabled) {
      mutated = true;
      continue; // skip disabled question entirely from live quiz
    }
    mutated = true;
    nextQuestions.push(hideRoadSignAnswerInPrompt(quiz.topic, applyOverrideToQuestionRecord(q, o)));
  }
  if (!mutated) return quiz;
  return { ...quiz, questions: nextQuestions } as T;
}

export function useOverrides() {
  const [map, setMap] = useState<Map<string, QuestionOverride> | null>(cache);
  useEffect(() => {
    let mounted = true;
    const refresh = () => loadOverrides().then((m) => {
      if (mounted) setMap(new Map(m));
    });
    // Always force a fresh DB fetch on mount so other tabs / external edits
    // can't leave the page showing a stale module-level cache.
    cache = null;
    inflight = null;
    refresh();
    window.addEventListener("question-overrides-invalidated", refresh);
    return () => {
      mounted = false;
      window.removeEventListener("question-overrides-invalidated", refresh);
    };
  }, []);
  return map;
}
