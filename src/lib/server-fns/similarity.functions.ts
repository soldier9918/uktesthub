import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function verifyAdmin(accessToken: string): Promise<string | null> {
  if (!accessToken) return null;
  const { data: userRes, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !userRes?.user) return null;
  const userId = userRes.user.id;
  const { data: roleRow } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!roleRow) return null;
  return userId;
}

// ---------- AI pair verdict ----------

type Pair = { aText: string; bText: string };

type Verdict = { verdict: "duplicate" | "near-duplicate" | "distinct"; confidence: number; reason: string };

export const aiVerdictPairs = createServerFn({ method: "POST" })
  .inputValidator((d: { accessToken: string; pairs: Pair[] }) => d)
  .handler(
    async ({
      data,
    }): Promise<{
      verdicts: Array<{ verdict: "duplicate" | "near-duplicate" | "distinct"; confidence: number; reason: string }>;
      error: string | null;
    }> => {
      const userId = await verifyAdmin(data.accessToken);
      if (!userId) return { verdicts: [], error: "Unauthorized" };
      const apiKey = process.env.LOVABLE_API_KEY;
      if (!apiKey) return { verdicts: [], error: "LOVABLE_API_KEY not configured" };
      if (!data.pairs?.length) return { verdicts: [], error: null };

      const numbered = data.pairs
        .map(
          (p, i) =>
            `Pair ${i + 1}:\nA: ${p.aText.slice(0, 800)}\nB: ${p.bText.slice(0, 800)}`,
        )
        .join("\n\n");

      const body = {
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You compare pairs of UK exam practice questions. For each pair return a verdict: 'duplicate' (same question, ignoring wording), 'near-duplicate' (tests the same fact with trivial differences), or 'distinct' (tests different facts even if topic overlaps). Be strict: cosmetic phrasing changes are duplicates.",
          },
          {
            role: "user",
            content: `Classify these ${data.pairs.length} pairs:\n\n${numbered}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_verdicts",
              description: "Return one verdict per pair, in input order.",
              parameters: {
                type: "object",
                properties: {
                  verdicts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        verdict: {
                          type: "string",
                          enum: ["duplicate", "near-duplicate", "distinct"],
                        },
                        confidence: { type: "number" },
                        reason: { type: "string" },
                      },
                      required: ["verdict", "confidence", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["verdicts"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_verdicts" } },
      };

      const resp = await fetch(AI_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        return { verdicts: [], error: `AI gateway ${resp.status}: ${txt.slice(0, 200)}` };
      }
      const json = (await resp.json()) as {
        choices?: Array<{ message?: { tool_calls?: Array<{ function?: { arguments?: string } }> } }>;
      };
      const argsStr = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      if (!argsStr) return { verdicts: [], error: "No tool call in response" };
      try {
        const parsed = JSON.parse(argsStr) as { verdicts: typeof aiVerdictPairs._returnType.verdicts };
        return { verdicts: parsed.verdicts ?? [], error: null };
      } catch (e) {
        return { verdicts: [], error: `Parse error: ${(e as Error).message}` };
      }
    },
  );

// ---------- Regeneration ----------

type SourceQuestion = {
  id: string;
  type?: string;
  question?: string;
  template?: string;
  prompt?: string;
  options?: string[];
  correctAnswer?: number | boolean;
  correctAnswers?: number[];
  explanation?: string;
  image?: string;
  imageAlt?: string;
};

export const regenerateUniqueQuestion = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      accessToken: string;
      topic: string;
      topicTitle: string;
      categoryTitle: string;
      source: SourceQuestion;
      existingBlobs: string[]; // normalised question texts in same topic for similarity check
    }) => d,
  )
  .handler(
    async ({
      data,
    }): Promise<{
      generated: SourceQuestion | null;
      similarityMax: number;
      attempts: number;
      needsReview: boolean;
      auditId: string | null;
      error: string | null;
    }> => {
      const userId = await verifyAdmin(data.accessToken);
      if (!userId) {
        return { generated: null, similarityMax: 0, attempts: 0, needsReview: false, auditId: null, error: "Unauthorized" };
      }
      const apiKey = process.env.LOVABLE_API_KEY;
      if (!apiKey) {
        return { generated: null, similarityMax: 0, attempts: 0, needsReview: false, auditId: null, error: "LOVABLE_API_KEY not configured" };
      }

      const { source } = data;
      const type = (source.type ?? "mcq").replace(/_/g, "-");
      const supportsMulti = type === "multiple-response";

      // Lazy import similarity to keep this server-only.
      const { trigrams, jaccard, normalizeForSimilarity } = await import("@/lib/admin/similarity");
      const existingTri = data.existingBlobs.map((b) => trigrams(b));

      const sysPrompt = `You write UK exam practice questions for "${data.categoryTitle} — ${data.topicTitle}".
Rules:
- Generate a COMPLETELY NEW question on the same underlying concept as the source.
- Do NOT paraphrase. New wording, new structure, new example/scenario.
- Use UK English and UK-specific context (e.g. £, miles, MOT, NHS, DVSA where relevant).
- Match this question type: "${type}".
- Preserve approximate difficulty.
- Provide a unique explanation (1–3 sentences) of why the correct answer is right.
- Exactly one correct answer unless the type is "multiple-response".
- For MCQ-style: 4 plausible options, distractors must be realistic but clearly wrong.
- Keep the same answer count as the source where possible.
- Do NOT reuse phrases or distinctive wording from the source.`;

      const userPrompt = `Source question (DO NOT REUSE WORDING):
${JSON.stringify(
        {
          question: source.question ?? source.template ?? source.prompt,
          options: source.options,
          correctAnswer: source.correctAnswer,
          correctAnswers: source.correctAnswers,
          explanation: source.explanation,
        },
        null,
        2,
      )}`;

      const tool = {
        type: "function" as const,
        function: {
          name: "emit_question",
          description: "Emit one new question.",
          parameters: {
            type: "object",
            properties: {
              question: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correctAnswer: { type: "number" },
              correctAnswers: { type: "array", items: { type: "number" } },
              explanation: { type: "string" },
            },
            required: ["question", "options", "explanation"],
            additionalProperties: false,
          },
        },
      };

      const SIM_REJECT = 0.8;
      const MAX_ATTEMPTS = 3;
      let best: { gen: SourceQuestion; sim: number } | null = null;
      let attempts = 0;
      let lastError: string | null = null;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        attempts = attempt;
        const resp = await fetch(AI_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-pro",
            messages: [
              { role: "system", content: sysPrompt },
              { role: "user", content: userPrompt },
              ...(attempt > 1
                ? [{ role: "user", content: `Previous attempt was too similar to an existing question (Jaccard ${best?.sim.toFixed(2)}). Try again with completely different wording, structure, and example.` }]
                : []),
            ],
            tools: [tool],
            tool_choice: { type: "function", function: { name: "emit_question" } },
          }),
        });
        if (!resp.ok) {
          const txt = await resp.text();
          lastError = `AI gateway ${resp.status}: ${txt.slice(0, 200)}`;
          if (resp.status === 429 || resp.status === 402) break;
          continue;
        }
        const json = (await resp.json()) as {
          choices?: Array<{ message?: { tool_calls?: Array<{ function?: { arguments?: string } }> } }>;
        };
        const argsStr = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
        if (!argsStr) {
          lastError = "No tool call in response";
          continue;
        }
        let parsed: {
          question: string;
          options: string[];
          correctAnswer?: number;
          correctAnswers?: number[];
          explanation: string;
        };
        try {
          parsed = JSON.parse(argsStr);
        } catch (e) {
          lastError = `Parse error: ${(e as Error).message}`;
          continue;
        }

        // Randomise correct-answer position (mcq / image-question only).
        let options = [...(parsed.options ?? [])];
        let correctAnswer = parsed.correctAnswer;
        let correctAnswers = parsed.correctAnswers;
        if (!supportsMulti && typeof correctAnswer === "number" && options[correctAnswer]) {
          const correctText = options[correctAnswer];
          for (let k = options.length - 1; k > 0; k--) {
            const j = Math.floor(Math.random() * (k + 1));
            [options[k], options[j]] = [options[j], options[k]];
          }
          correctAnswer = options.indexOf(correctText);
        }

        const gen: SourceQuestion = {
          id: source.id,
          type: source.type,
          question: parsed.question,
          options,
          correctAnswer: supportsMulti ? undefined : correctAnswer,
          correctAnswers: supportsMulti ? correctAnswers : undefined,
          explanation: parsed.explanation,
          image: source.image,
          imageAlt: source.imageAlt,
        };

        // Similarity check vs existing topic blobs.
        const candBlob =
          (gen.question ?? "") +
          " | " +
          (gen.options ?? []).join(" | ") +
          " | " +
          (gen.explanation ?? "");
        const candTri = trigrams(candBlob);
        let maxSim = 0;
        for (const t of existingTri) {
          const s = jaccard(candTri, t);
          if (s > maxSim) maxSim = s;
        }
        // Also avoid being too similar to source itself.
        const srcBlob =
          (source.question ?? source.template ?? source.prompt ?? "") +
          " | " +
          (source.options ?? []).join(" | ") +
          " | " +
          (source.explanation ?? "");
        const srcSim = jaccard(candTri, trigrams(srcBlob));
        if (srcSim > maxSim) maxSim = srcSim;

        if (!best || maxSim < best.sim) best = { gen, sim: maxSim };
        if (maxSim < SIM_REJECT) {
          break;
        }
        // else loop and retry
        lastError = `similarity ${maxSim.toFixed(2)} too high`;
      }

      if (!best) {
        return {
          generated: null,
          similarityMax: 0,
          attempts,
          needsReview: false,
          auditId: null,
          error: lastError ?? "Generation failed",
        };
      }

      const needsReview = best.sim >= 0.8;

      // Save override.
      const overridePayload = {
        topic: data.topic,
        question_id: source.id,
        question: best.gen.question ?? null,
        options: best.gen.options ?? null,
        correct_answer:
          best.gen.correctAnswers !== undefined
            ? best.gen.correctAnswers
            : best.gen.correctAnswer ?? null,
        explanation: best.gen.explanation ?? null,
        image: null,
        image_alt: null,
        updated_by: userId,
      };
      const { error: upErr } = await supabaseAdmin
        .from("question_overrides")
        .upsert(overridePayload, { onConflict: "topic,question_id" });
      if (upErr) {
        return {
          generated: best.gen,
          similarityMax: best.sim,
          attempts,
          needsReview,
          auditId: null,
          error: `Save failed: ${upErr.message}`,
        };
      }

      const { data: auditRow, error: audErr } = await supabaseAdmin
        .from("question_regenerations")
        .insert({
          topic: data.topic,
          question_id: source.id,
          source_question: source as unknown as Record<string, unknown>,
          generated_question: best.gen as unknown as Record<string, unknown>,
          similarity_max: best.sim,
          attempts,
          needs_review: needsReview,
          model: "google/gemini-2.5-pro",
          created_by: userId,
        })
        .select("id")
        .maybeSingle();

      // Avoid unused-variable on the normaliser import (used for parity with client).
      void normalizeForSimilarity;

      return {
        generated: best.gen,
        similarityMax: best.sim,
        attempts,
        needsReview,
        auditId: auditRow?.id ?? null,
        error: audErr?.message ?? null,
      };
    },
  );

