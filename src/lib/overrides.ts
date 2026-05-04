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
    const { data, error } = await supabase
      .from("question_overrides")
      .select("topic,question_id,question,options,correct_answer,explanation,image,image_alt");
    const map = new Map<string, QuestionOverride>();
    if (!error && data) {
      for (const row of data) {
        map.set(key(row.topic, row.question_id), row as unknown as QuestionOverride);
      }
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

export function applyOverrideToQuestionRecord<T extends Record<string, unknown>>(
  question: T,
  override: QuestionOverride | undefined,
): T {
  if (!override) return question;
  const next: Record<string, unknown> = { ...question };
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
    } else {
      next.correctAnswer = override.correct_answer;
    }
  }
  if (override.explanation != null) next.explanation = override.explanation;
  if (override.image != null) next.image = override.image;
  if (override.image_alt != null) next.imageAlt = override.image_alt;
  return next as T;
}

export function applyOverrides<T extends AnyQuiz>(quiz: T, map: Map<string, QuestionOverride>): T {
  let mutated = false;
  const nextQuestions = quiz.questions.map((q) => {
    // Bank id (e.g. "sa-mc-0017") is the canonical override key; fall back to
    // the runtime numeric id for backward compatibility.
    const srcId = (q as { sourceId?: string }).sourceId;
    const o =
      (srcId ? map.get(key(quiz.topic, srcId)) : undefined) ??
      map.get(key(quiz.topic, String(q.id)));
    if (!o) return q;
    mutated = true;
    return applyOverrideToQuestionRecord(q, o);
  });
  if (!mutated) return quiz;
  return { ...quiz, questions: nextQuestions } as T;
}

export function useOverrides() {
  const [map, setMap] = useState<Map<string, QuestionOverride> | null>(cache);
  useEffect(() => {
    let mounted = true;
    const refresh = () => loadOverrides().then((m) => {
      if (mounted) setMap(m);
    });
    refresh();
    window.addEventListener("question-overrides-invalidated", refresh);
    return () => {
      mounted = false;
      window.removeEventListener("question-overrides-invalidated", refresh);
    };
  }, []);
  return map;
}
