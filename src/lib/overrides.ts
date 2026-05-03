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
