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
}

type AnyQuiz = { topic: string; questions: Array<Record<string, unknown> & { id: number | string }> };

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
    const next: Record<string, unknown> = { ...q };
    if (o.question != null) next.question = o.question;
    if (Array.isArray(o.options)) next.options = o.options;
    if (o.correct_answer != null) {
      // Map to the right field based on question type
      const t = (q as { type?: string }).type;
      if (t === "true-false" && typeof o.correct_answer === "boolean") {
        next.correctAnswer = o.correct_answer;
      } else if (t === "multiple-response" && Array.isArray(o.correct_answer)) {
        next.correctAnswers = o.correct_answer;
      } else if (typeof o.correct_answer === "number") {
        next.correctAnswer = o.correct_answer;
      }
    }
    if (o.explanation != null) next.explanation = o.explanation;
    if (o.image != null) next.image = o.image;
    if (o.image_alt != null) next.imageAlt = o.image_alt;
    return next;
  });
  if (!mutated) return quiz;
  return { ...quiz, questions: nextQuestions } as T;
}

export function useOverrides() {
  const [map, setMap] = useState<Map<string, QuestionOverride> | null>(cache);
  useEffect(() => {
    let mounted = true;
    loadOverrides().then((m) => {
      if (mounted) setMap(m);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return map;
}
