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

type Verdict = {
  verdict: "duplicate" | "near-duplicate" | "distinct";
  confidence: number;
  reason: string;
};

export const aiVerdictPairs = createServerFn({ method: "POST" })
  .inputValidator((d: { accessToken: string; pairs: Pair[] }) => d)
  .handler(
    async ({
      data,
    }): Promise<{
      verdicts: Array<{
        verdict: "duplicate" | "near-duplicate" | "distinct";
        confidence: number;
        reason: string;
      }>;
      error: string | null;
    }> => {
      const userId = await verifyAdmin(data.accessToken);
      if (!userId) return { verdicts: [], error: "Unauthorized" };
      const apiKey = process.env.LOVABLE_API_KEY;
      if (!apiKey) return { verdicts: [], error: "LOVABLE_API_KEY not configured" };
      if (!data.pairs?.length) return { verdicts: [], error: null };

      const numbered = data.pairs
        .map((p, i) => `Pair ${i + 1}:\nA: ${p.aText.slice(0, 800)}\nB: ${p.bText.slice(0, 800)}`)
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
        console.error(`[ai] verdicts gateway ${resp.status}:`, txt.slice(0,500)); return { verdicts: [], error: "AI service unavailable, please retry" };
      }
      const json = (await resp.json()) as {
        choices?: Array<{
          message?: { tool_calls?: Array<{ function?: { arguments?: string } }> };
        }>;
      };
      const argsStr = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      if (!argsStr) return { verdicts: [], error: "No tool call in response" };
      try {
        const parsed = JSON.parse(argsStr) as { verdicts: Verdict[] };
        return { verdicts: parsed.verdicts ?? [], error: null };
      } catch (e) {
        console.error("[ai] verdicts parse error:", e); return { verdicts: [], error: "Unexpected AI response format" };
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

function questionTextOnly(blobOrQuestion: string): string {
  return (blobOrQuestion ?? "").split("|")[0]?.trim() ?? "";
}

/**
 * Strip stray image markers/descriptions the model sometimes hallucinates,
 * e.g. "...at this junction? [IMAGE] An inverted triangle with a red border..."
 * We remove [IMAGE]/[image]/[picture]/[diagram] tokens and drop any trailing
 * sentence that follows such a marker (it is always a description, not part
 * of the actual question).
 */
function sanitizeGeneratedQuestion(text: string): string {
  if (!text) return text;
  let t = text;
  // Cut anything from a bracketed image marker onwards.
  t = t.replace(/\s*[\[\(]\s*(image|picture|diagram|photo|sign shown|figure)[^\]\)]*[\]\)].*$/i, "");
  // Also handle bare markers like "IMAGE:" or "[IMAGE]" without trailing text.
  t = t.replace(/\s*\b(image|picture|diagram)\s*:.*$/i, "");
  return t.trim();
}

function openingSlice(blobOrQuestion: string, words = 18): string {
  return questionTextOnly(blobOrQuestion)
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, words)
    .join(" ");
}

async function loadSavedOverrideBlobs(): Promise<string[]> {
  const out: string[] = [];
  const PAGE = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabaseAdmin
      .from("question_overrides")
      .select("question,options,explanation,disabled")
      .range(from, from + PAGE - 1);
    if (error || !data) break;
    for (const row of data as Array<{
      question: string | null;
      options: string[] | null;
      explanation: string | null;
      disabled?: boolean | null;
    }>) {
      if (row.disabled || !row.question) continue;
      out.push(`${row.question} | ${(row.options ?? []).join(" | ")} | ${row.explanation ?? ""}`);
    }
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return out;
}

function hasRepeatedOpening(
  candidateQuestion: string,
  comparisonBlobs: string[],
  trigramsFn: (s: string) => Set<string>,
  jaccardFn: (a: Set<string>, b: Set<string>) => number,
): { repeated: boolean; score: number; matchedOpening: string } {
  const candidateOpening = openingSlice(candidateQuestion);
  if (!candidateOpening) return { repeated: false, score: 0, matchedOpening: "" };
  const candidateTri = trigramsFn(candidateOpening);
  let score = 0;
  let matchedOpening = "";
  for (const blob of comparisonBlobs) {
    const opening = openingSlice(blob);
    if (!opening || opening === candidateOpening) continue;
    const s = jaccardFn(candidateTri, trigramsFn(opening));
    if (s > score) {
      score = s;
      matchedOpening = opening;
    }
  }
  return { repeated: score >= 0.48, score, matchedOpening };
}

export const regenerateUniqueQuestion = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      accessToken: string;
      topic: string;
      topicTitle: string;
      category?: string;
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
        return {
          generated: null,
          similarityMax: 0,
          attempts: 0,
          needsReview: false,
          auditId: null,
          error: "Unauthorized",
        };
      }
      const apiKey = process.env.LOVABLE_API_KEY;
      if (!apiKey) {
        return {
          generated: null,
          similarityMax: 0,
          attempts: 0,
          needsReview: false,
          auditId: null,
          error: "LOVABLE_API_KEY not configured",
        };
      }

      const { source } = data;
      const type = (source.type ?? "mcq").replace(/_/g, "-");
      const supportsMulti = type === "multiple-response";

      // Lazy import similarity to keep this server-only.
      const { trigrams, jaccard, normalizeForSimilarity } = await import("@/lib/admin/similarity");
      const allSavedOverrideBlobs = await loadSavedOverrideBlobs();
      const comparisonBlobs = [...data.existingBlobs, ...allSavedOverrideBlobs];
      const existingTri = comparisonBlobs.map((b) => trigrams(b));
      const repeatedOpenings = Array.from(
        new Set(comparisonBlobs.map((b) => openingSlice(b, 14)).filter(Boolean)),
      )
        .slice(0, 60)
        .map((s, i) => `${i + 1}. ${s}`)
        .join("\n");

      const isDriving = data.category === "driving" || data.category === "taxi-private-hire";
      const sysPrompt = `You write UK exam practice questions for "${data.categoryTitle} — ${data.topicTitle}".
Rules:
- Generate a COMPLETELY NEW question on the same underlying concept as the source.
- Do NOT paraphrase. New wording, new structure, new example/scenario.
- Use UK English and UK-specific context (e.g. £, miles, MOT, NHS, DVSA where relevant).
- The new question MUST stay strictly within the topic "${data.topicTitle}" (category "${data.categoryTitle}"). Do NOT cross over into another subject.${
        isDriving
          ? ""
          : `
- Do NOT introduce driving, vehicles, cars, car parks, road signs, motorways, learner drivers, or road scenarios — this topic is NOT about driving.`
      }
- Match this question type: "${type}".
- Preserve approximate difficulty.
- Provide a unique explanation (1–3 sentences) of why the correct answer is right.
- Exactly one correct answer unless the type is "multiple-response".
- For MCQ-style: 4 plausible options, distractors must be realistic but clearly wrong.
- Keep the same answer count as the source where possible.
- Do NOT reuse phrases or distinctive wording from the source.
- The opening sentence MUST have a different rhythm and setup from existing regenerated questions. Do NOT start with repeated stock setups such as "While driving...", "You are driving along...", "You are driving away from...", or any similar "You are [verb] ... and see..." formula.
- Output ONLY the question text. Do NOT include image placeholders like "[IMAGE]", "[picture]", "[diagram]", "(image:...)", or any description of an image, sign, or figure. The question must read naturally without referring to an embedded image.
- Vary perspective and structure: sometimes ask directly about a rule, a consequence, a sign meaning, a responsibility, a calculation, or a short realistic case. Never rely on the same scenario template twice.`;

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

      const openingAvoidancePrompt = repeatedOpenings
        ? `\n\nExisting question openings across the bank. Your new question must NOT sound like these openings:\n${repeatedOpenings}`
        : "";

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
              { role: "user", content: `${userPrompt}${openingAvoidancePrompt}` },
              ...(attempt > 1
                ? [
                    {
                      role: "user",
                      content: `Previous attempt was too similar to an existing question (Jaccard ${best?.sim.toFixed(2)}). Try again with a completely different opening, sentence structure, wording, and example.`,
                    },
                  ]
                : []),
            ],
            tools: [tool],
            tool_choice: { type: "function", function: { name: "emit_question" } },
          }),
        });
        if (!resp.ok) {
          const txt = await resp.text();
          console.error(`[ai] gateway ${resp.status}:`, txt.slice(0,500)); lastError = "AI service unavailable, please retry";
          if (resp.status === 429 || resp.status === 402) break;
          continue;
        }
        const json = (await resp.json()) as {
          choices?: Array<{
            message?: { tool_calls?: Array<{ function?: { arguments?: string } }> };
          }>;
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
          console.error("[ai] parse error:", e); lastError = "Unexpected AI response format";
          continue;
        }

        // Randomise correct-answer position (mcq / image-question only).
        const options = [...(parsed.options ?? [])];
        let correctAnswer = parsed.correctAnswer;
        const correctAnswers = parsed.correctAnswers;
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
          question: sanitizeGeneratedQuestion(parsed.question),
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

        const openingCheck = hasRepeatedOpening(
          gen.question ?? "",
          comparisonBlobs,
          trigrams,
          jaccard,
        );

        if (!best || maxSim < best.sim) best = { gen, sim: maxSim };
        if (maxSim < SIM_REJECT && !openingCheck.repeated) {
          break;
        }
        // else loop and retry
        lastError = openingCheck.repeated
          ? `opening too similar (${openingCheck.score.toFixed(2)}): ${openingCheck.matchedOpening}`
          : `similarity ${maxSim.toFixed(2)} too high`;
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
            : (best.gen.correctAnswer ?? null),
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

      const { data: auditRow, error: audErr } = await (
        supabaseAdmin.from("question_regenerations" as never) as unknown as {
          insert: (row: Record<string, unknown>) => {
            select: (cols: string) => {
              maybeSingle: () => Promise<{
                data: { id: string } | null;
                error: { message: string } | null;
              }>;
            };
          };
        }
      )
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

// ---------- Complete Regeneration (brand-new question, hides source from AI) ----------

const GENERIC_ANGLES = [
  "everyday real-world scenario",
  "common misconception people get wrong",
  "edge case the textbook glosses over",
  "practical application in daily life",
  "workplace or community context",
  "exam-style scenario testing recall",
  "decision-making under time pressure",
  "comparing two similar concepts",
];

const SCENARIO_ANGLES_BY_CATEGORY: Record<string, string[]> = {
  driving: [
    "urban street with parked cars",
    "rural country lane",
    "motorway in heavy traffic",
    "night-time driving in poor visibility",
    "wet weather and slippery roads",
    "approaching a busy junction",
    "near a school or pedestrian area",
    "with a learner driver or new licence holder",
  ],
  "taxi-private-hire": [
    "picking up a passenger in central London",
    "late-night fare with a vulnerable passenger",
    "airport transfer with luggage",
    "wheelchair-accessible vehicle scenario",
    "dispute over fare or route",
    "ULEZ or congestion charge situation",
  ],
  citizenship: [
    "everyday life in modern UK",
    "interacting with public services",
    "historical event shaping UK today",
    "rights and responsibilities at work",
    "voting or civic participation",
    "UK geography or cultural tradition",
  ],
  english: [
    "spoken conversation in a shop or office",
    "writing a short formal message",
    "understanding a public notice",
    "grammar choice in a sentence",
    "vocabulary in everyday context",
    "listening for key information",
  ],
  nhs: [
    "ward handover scenario",
    "patient safety incident",
    "infection control in clinical setting",
    "consent and capacity scenario",
    "safeguarding concern",
    "communication with a distressed family",
  ],
  security: [
    "venue entry search scenario",
    "conflict de-escalation with an aggressive customer",
    "lone working incident",
    "fire or evacuation event",
    "suspect package or hostile reconnaissance",
    "handover and incident reporting",
  ],
  hospitality: [
    "busy service with an unhappy guest",
    "allergen disclosure at the table",
    "cash handling and till discrepancy",
    "stock rotation and food safety",
    "team handover at shift change",
  ],
  construction: [
    "working at height scenario",
    "manual handling on site",
    "PPE check before a task",
    "near-miss reporting",
    "site induction for a new worker",
  ],
  finance: [
    "client risk profile scenario",
    "AML or KYC red flag",
    "regulatory disclosure obligation",
    "calculation of fees or interest",
    "ethical conflict of interest",
  ],
  "it-tech": [
    "incident triage scenario",
    "secure password or access scenario",
    "data backup and recovery",
    "phishing email evaluation",
    "code or config review choice",
  ],
  "healthcare-entry": [
    "personal care scenario with a service user",
    "moving and handling situation",
    "infection control basics",
    "safeguarding observation",
    "documentation at end of shift",
  ],
  teaching: [
    "managing a disruptive class",
    "differentiation for mixed ability",
    "safeguarding disclosure",
    "parent communication scenario",
    "assessment for learning moment",
  ],
  legal: [
    "client interview scenario",
    "ethical duty conflict",
    "court etiquette situation",
    "drafting choice in a contract clause",
    "evidence handling decision",
  ],
  "military-emergency": [
    "incident response under pressure",
    "team leadership in the field",
    "first aid casualty scenario",
    "communications protocol decision",
  ],
  "maritime-aviation": [
    "pre-departure safety check",
    "weather-related decision",
    "emergency procedure scenario",
    "navigation or routing choice",
  ],
  government: [
    "policy interpretation scenario",
    "FOI or data protection request",
    "stakeholder consultation situation",
    "procurement compliance choice",
  ],
};

export const completeRegenerateQuestion = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      accessToken: string;
      topic: string;
      topicTitle: string;
      category?: string;
      categoryTitle: string;
      source: SourceQuestion;
      categoryBlobs: string[]; // normalised question texts across the WHOLE category
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
      concept: string | null;
      error: string | null;
    }> => {
      const userId = await verifyAdmin(data.accessToken);
      if (!userId) {
        return {
          generated: null,
          similarityMax: 0,
          attempts: 0,
          needsReview: false,
          auditId: null,
          concept: null,
          error: "Unauthorized",
        };
      }
      const apiKey = process.env.LOVABLE_API_KEY;
      if (!apiKey) {
        return {
          generated: null,
          similarityMax: 0,
          attempts: 0,
          needsReview: false,
          auditId: null,
          concept: null,
          error: "LOVABLE_API_KEY not configured",
        };
      }

      const { source } = data;
      const type = (source.type ?? "mcq").replace(/_/g, "-");
      const supportsMulti = type === "multiple-response";

      const { trigrams, jaccard } = await import("@/lib/admin/similarity");
      const allSavedOverrideBlobs = await loadSavedOverrideBlobs();
      const comparisonBlobs = [...data.categoryBlobs, ...allSavedOverrideBlobs];
      const categoryTri = comparisonBlobs.map((b) => trigrams(b));
      const repeatedOpenings = Array.from(
        new Set(comparisonBlobs.map((b) => openingSlice(b, 14)).filter(Boolean)),
      )
        .slice(0, 80)
        .map((s, i) => `${i + 1}. ${s}`)
        .join("\n");

      // ---- Build avoid-list from WHOLE category (top 20 most similar stems) ----
      const sourceBlob =
        (source.question ?? source.template ?? source.prompt ?? "") +
        " | " +
        (source.options ?? []).join(" | ") +
        " | " +
        (source.explanation ?? "");
      const sourceTri = trigrams(sourceBlob);
      const ranked = comparisonBlobs
        .map((b, i) => ({ b, score: jaccard(sourceTri, categoryTri[i]) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)
        .map((x) => x.b.slice(0, 220));
      const avoidList = ranked.length
        ? ranked.map((s, i) => `${i + 1}. ${s}`).join("\n")
        : "(no similar questions in bank yet)";

      // ---- Step A: pick a DIFFERENT concept within the topic ----
      // We deliberately do NOT extract the source question's concept. Instead
      // we ask the model to propose a fresh sub-topic that still belongs to
      // the topic but is NOT already covered by existing questions.
      let concept = "";
      try {
        const conceptResp = await fetch(AI_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content:
                  "You propose UK exam question sub-topics. Return ONLY a 3-8 word concept label (no punctuation, no quotes). The concept MUST be different from every already-covered sub-topic listed, but still belong to the given topic.",
              },
              {
                role: "user",
                content: `Topic: ${data.topicTitle}\nCategory: ${data.categoryTitle}\n\nAlready-covered questions (pick a DIFFERENT sub-topic from these):\n${avoidList}\n\nReturn one fresh concept label.`,
              },
            ],
          }),
        });
        if (conceptResp.ok) {
          const cj = (await conceptResp.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          concept = (cj.choices?.[0]?.message?.content ?? "")
            .trim()
            .replace(/^["']|["']$/g, "")
            .slice(0, 120);
        }
      } catch {
        // non-fatal
      }
      if (!concept) concept = `${data.topicTitle} — fresh angle`;

      // ---- Step B: generate fresh question ----
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

      const SIM_REJECT = 0.65;
      const MAX_ATTEMPTS = 5;
      let best: { gen: SourceQuestion; sim: number } | null = null;
      let attempts = 0;
      let lastError: string | null = null;

      const angles =
        (data.category && SCENARIO_ANGLES_BY_CATEGORY[data.category]) || GENERIC_ANGLES;
      const isDriving = data.category === "driving";
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        attempts = attempt;
        const angle = angles[(attempt - 1) % angles.length];

        const sysPrompt = `You write UK exam practice questions for "${data.categoryTitle} — ${data.topicTitle}".
You are creating a BRAND-NEW question that tests a DIFFERENT piece of knowledge from anything in the AVOID list.
The new question must be on the concept: "${concept}" — which is a different sub-topic from the existing questions.
You have NOT seen any original question. Do not attempt to reproduce one.
Rules:
- The new question MUST stay strictly within the topic "${data.topicTitle}" (category "${data.categoryTitle}"). Do NOT cross over into another subject.${
          isDriving
            ? ""
            : `
- Do NOT introduce driving, vehicles, cars, car parks, parked cars, road signs, motorways, learner drivers, or road scenarios — this topic is NOT about driving.`
        }
- The new question must test DIFFERENT factual knowledge — not the same fact reworded.
- Use UK English and UK-specific context (£, miles, MOT, NHS, DVSA where relevant to this topic).
- Match this question type: "${type}".
- For MCQ-style: provide exactly 4 plausible options with one correct answer.
- Distractors must be realistic but clearly wrong to a knowledgeable test-taker.
- Provide a unique explanation (1-3 sentences).
- Do NOT reuse phrases, scenarios, numbers, subject matter, or distinctive wording from the AVOID list below.
- Do NOT use repeated stock openings or formulaic setups from the OPENING AVOID list. Avoid patterns like "While driving...", "You are driving along...", "You are driving away from...", "You are on... and see...", and equivalent templates in every category.
- Make the first 12-18 words structurally unique compared with existing questions: vary sentence length, grammar, perspective, and whether it starts with the rule, object, consequence, person, document, calculation, or scenario.
- Output ONLY the question text. Do NOT include image placeholders like "[IMAGE]", "[picture]", "[diagram]", "(image:...)", or any description of an image, sign, or figure. The question must read naturally without referring to an embedded image.
- Frame the scenario around: ${angle}.`;

        const userPrompt = `Concept: ${concept}
Topic: ${data.topicTitle}
Category: ${data.categoryTitle}
Scenario angle: ${angle}

AVOID list (existing questions in this category — do NOT replicate their wording, scenarios, or numbers):
${avoidList}

OPENING AVOID list (do not make the start of the new question sound like these):
${repeatedOpenings || "(none)"}

Now write a completely fresh question.`;

        const resp = await fetch(AI_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-pro",
            messages: [
              { role: "system", content: sysPrompt },
              { role: "user", content: userPrompt },
              ...(attempt > 1 && best
                ? [
                    {
                      role: "user",
                      content: `Previous attempt was too similar to existing content (Jaccard ${best.sim.toFixed(2)}). Pick a different opening, sentence structure, scenario, numbers, and framing.`,
                    },
                  ]
                : []),
            ],
            tools: [tool],
            tool_choice: { type: "function", function: { name: "emit_question" } },
          }),
        });
        if (!resp.ok) {
          const txt = await resp.text();
          console.error(`[ai] gateway ${resp.status}:`, txt.slice(0,500)); lastError = "AI service unavailable, please retry";
          if (resp.status === 429 || resp.status === 402) break;
          continue;
        }
        const json = (await resp.json()) as {
          choices?: Array<{
            message?: { tool_calls?: Array<{ function?: { arguments?: string } }> };
          }>;
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
          console.error("[ai] parse error:", e); lastError = "Unexpected AI response format";
          continue;
        }

        // Randomise correct-answer position for single-correct types.
        const options = [...(parsed.options ?? [])];
        let correctAnswer = parsed.correctAnswer;
        const correctAnswers = parsed.correctAnswers;
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
          question: sanitizeGeneratedQuestion(parsed.question),
          options,
          correctAnswer: supportsMulti ? undefined : correctAnswer,
          correctAnswers: supportsMulti ? correctAnswers : undefined,
          explanation: parsed.explanation,
          image: source.image,
          imageAlt: source.imageAlt,
        };

        // Similarity vs whole category + source
        const candBlob =
          (gen.question ?? "") +
          " | " +
          (gen.options ?? []).join(" | ") +
          " | " +
          (gen.explanation ?? "");
        const candTri = trigrams(candBlob);
        let maxSim = 0;
        for (const t of categoryTri) {
          const s = jaccard(candTri, t);
          if (s > maxSim) maxSim = s;
        }
        const srcSim = jaccard(candTri, sourceTri);
        if (srcSim > maxSim) maxSim = srcSim;

        const openingCheck = hasRepeatedOpening(
          gen.question ?? "",
          comparisonBlobs,
          trigrams,
          jaccard,
        );

        if (!best || maxSim < best.sim) best = { gen, sim: maxSim };
        if (maxSim < SIM_REJECT && !openingCheck.repeated) break;
        lastError = openingCheck.repeated
          ? `opening too similar (${openingCheck.score.toFixed(2)}): ${openingCheck.matchedOpening}`
          : `similarity ${maxSim.toFixed(2)} too high`;
      }

      if (!best) {
        return {
          generated: null,
          similarityMax: 0,
          attempts,
          needsReview: false,
          auditId: null,
          concept,
          error: lastError ?? "Generation failed",
        };
      }

      const needsReview = best.sim >= SIM_REJECT;

      const overridePayload = {
        topic: data.topic,
        question_id: source.id,
        question: best.gen.question ?? null,
        options: best.gen.options ?? null,
        correct_answer:
          best.gen.correctAnswers !== undefined
            ? best.gen.correctAnswers
            : (best.gen.correctAnswer ?? null),
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
          concept,
          error: `Save failed: ${upErr.message}`,
        };
      }

      const { data: auditRow, error: audErr } = await (
        supabaseAdmin.from("question_regenerations" as never) as unknown as {
          insert: (row: Record<string, unknown>) => {
            select: (cols: string) => {
              maybeSingle: () => Promise<{
                data: { id: string } | null;
                error: { message: string } | null;
              }>;
            };
          };
        }
      )
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
          mode: "complete",
          concept,
          scope: "category",
        })
        .select("id")
        .maybeSingle();

      return {
        generated: best.gen,
        similarityMax: best.sim,
        attempts,
        needsReview,
        auditId: auditRow?.id ?? null,
        concept,
        error: audErr?.message ?? null,
      };
    },
  );
