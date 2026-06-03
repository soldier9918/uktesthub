import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TaskSchema = z.object({
  prompt: z.string().min(1).max(4000),
  answer: z.string().min(1).max(8000),
});

const MarkInput = z.object({
  variant: z.enum(["academic", "general"]),
  task1: TaskSchema,
  task2: TaskSchema,
});

export type IeltsCriterion = {
  band: number;
  explanation: string;
};

export type IeltsTaskFeedback = {
  taskResponse: IeltsCriterion;
  coherenceCohesion: IeltsCriterion;
  lexicalResource: IeltsCriterion;
  grammaticalRange: IeltsCriterion;
  summary: string;
  commonMistakes: string[];
  modelAnswer: string;
};

export type IeltsMarkingResult = {
  task1: IeltsTaskFeedback;
  task2: IeltsTaskFeedback;
  task1Band: number;
  task2Band: number;
  overallBand: number;
  overallFeedback: string;
  whatWentWell: string[];
  whatToImprove: string[];
  nextSteps: string[];
  whyThisScore: string;
  howToReachNextBand: string;
};

function roundHalf(n: number): number {
  const clamped = Math.max(0, Math.min(9, n));
  return Math.round(clamped * 2) / 2;
}

function avgBands(t: IeltsTaskFeedback): number {
  return roundHalf(
    (t.taskResponse.band +
      t.coherenceCohesion.band +
      t.lexicalResource.band +
      t.grammaticalRange.band) /
      4,
  );
}

const MARKING_MODEL = "google/gemini-3.1-flash-lite-preview";
const MARKING_TIMEOUT_MS = 24_000;

export const markIeltsWriting = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => MarkInput.parse(data))
  .handler(async ({ data }): Promise<IeltsMarkingResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const variantLabel = data.variant === "academic" ? "Academic" : "General Training";
    const task1Type =
      data.variant === "academic"
        ? "Academic Task 1 — a report describing visual information (graph, chart, table, diagram). At least 150 words."
        : "General Training Task 1 — a letter (formal, semi-formal or informal depending on the situation). At least 150 words.";
    const task2Type =
      "Task 2 — a discursive essay responding to the question prompt. At least 250 words. Task 2 is weighted twice as heavily as Task 1.";

    const systemPrompt = `You are an experienced writing tutor providing PRACTICE feedback using IELTS-style writing criteria (Task Response / Task Achievement, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy). Score each criterion from 0 to 9 in 0.5 steps. Be honest and calibrated — do not inflate scores. Keep the response concise so it can be returned quickly.

For each task, return:
- band score for each of the four criteria (0–9, 0.5 steps)
- a short plain-English explanation for each criterion (one sentence) referencing the candidate's actual writing
- a short summary (2 sentences)
- 3 common-mistake bullets specific to this candidate's answer
- a concise model answer (about 130 words for Task 1, about 190 words for Task 2) that would score around Band 8

Also return, across both tasks combined:
- whatWentWell: 3 concise strength bullets
- whatToImprove: 3 concise improvement bullets
- nextSteps: exactly 3 practical actions before the next attempt
- whyThisScore: short plain-English paragraph explaining the estimated band and what stopped it reaching the next band
- howToReachNextBand: short paragraph naming the next half-band and the specific changes needed to reach it
- overallFeedback: 2 sentence overall summary

Do not use the phrases "AI examiner", "official score", "official IELTS band", "same as the real exam", or "guaranteed". This is practice feedback only.

Variant: IELTS ${variantLabel}.
${task1Type}
${task2Type}`;

    const userPrompt = `TASK 1 PROMPT:\n${data.task1.prompt}\n\nTASK 1 CANDIDATE ANSWER:\n${data.task1.answer}\n\n---\n\nTASK 2 PROMPT:\n${data.task2.prompt}\n\nTASK 2 CANDIDATE ANSWER:\n${data.task2.answer}\n\nMark both tasks now using the submit_ielts_marking tool.`;

    const criterionSchema = {
      type: "object",
      properties: {
        band: { type: "number", minimum: 0, maximum: 9 },
        explanation: { type: "string" },
      },
      required: ["band", "explanation"],
      additionalProperties: false,
    };

    const taskSchema = {
      type: "object",
      properties: {
        taskResponse: criterionSchema,
        coherenceCohesion: criterionSchema,
        lexicalResource: criterionSchema,
        grammaticalRange: criterionSchema,
        summary: { type: "string" },
        commonMistakes: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
        modelAnswer: { type: "string" },
      },
      required: [
        "taskResponse",
        "coherenceCohesion",
        "lexicalResource",
        "grammaticalRange",
        "summary",
        "commonMistakes",
        "modelAnswer",
      ],
      additionalProperties: false,
    };

    const body = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "submit_ielts_marking",
            description: "Return IELTS-style practice band scores and feedback for both tasks.",
            parameters: {
              type: "object",
              properties: {
                task1: taskSchema,
                task2: taskSchema,
                whatWentWell: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
                whatToImprove: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
                nextSteps: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
                whyThisScore: { type: "string" },
                howToReachNextBand: { type: "string" },
                overallFeedback: { type: "string" },
              },
              required: [
                "task1",
                "task2",
                "whatWentWell",
                "whatToImprove",
                "nextSteps",
                "whyThisScore",
                "howToReachNextBand",
                "overallFeedback",
              ],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: { name: "submit_ielts_marking" },
      },
    };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error("RATE_LIMIT");
      }
      if (res.status === 402) {
        throw new Error("PAYMENT_REQUIRED");
      }
      const t = await res.text();
      console.error("IELTS marking gateway error:", res.status, t);
      throw new Error("AI_GATEWAY_ERROR");
    }

    const json = (await res.json()) as {
      choices?: Array<{
        message?: {
          content?: string | null;
          tool_calls?: Array<{
            function?: { name?: string; arguments?: string };
          }>;
        };
      }>;
    };

    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    const argsRaw = call?.function?.arguments;
    const contentRaw = json.choices?.[0]?.message?.content ?? "";

    function extractJson(raw: string): string | null {
      const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      const start = cleaned.search(/[{[]/);
      if (start === -1) return null;
      const openChar = cleaned[start];
      const closeChar = openChar === "[" ? "]" : "}";
      const end = cleaned.lastIndexOf(closeChar);
      if (end === -1 || end < start) return null;
      return cleaned.substring(start, end + 1);
    }

    type RawCriterion = { band: number; explanation: string };
    type RawTask = {
      taskResponse: RawCriterion;
      coherenceCohesion: RawCriterion;
      lexicalResource: RawCriterion;
      grammaticalRange: RawCriterion;
      summary: string;
      commonMistakes: string[];
      modelAnswer: string;
    };
    let parsed: {
      task1: RawTask;
      task2: RawTask;
      whatWentWell: string[];
      whatToImprove: string[];
      nextSteps: string[];
      whyThisScore: string;
      howToReachNextBand: string;
      overallFeedback: string;
    };
    try {
      if (argsRaw) {
        parsed = JSON.parse(argsRaw);
      } else {
        const extracted = extractJson(contentRaw);
        if (!extracted) {
          console.error("IELTS marking: no tool call or JSON content", JSON.stringify(json));
          throw new Error("AI_PARSE_ERROR");
        }
        parsed = JSON.parse(extracted);
      }
    } catch (e) {
      console.error("IELTS marking parse error:", e, "raw:", argsRaw ?? contentRaw);
      throw new Error("AI_PARSE_ERROR");
    }

    function normaliseCriterion(c: RawCriterion): IeltsCriterion {
      return {
        band: roundHalf(Number(c?.band ?? 0)),
        explanation: String(c?.explanation ?? ""),
      };
    }

    function normaliseTask(t: RawTask): IeltsTaskFeedback {
      return {
        taskResponse: normaliseCriterion(t.taskResponse),
        coherenceCohesion: normaliseCriterion(t.coherenceCohesion),
        lexicalResource: normaliseCriterion(t.lexicalResource),
        grammaticalRange: normaliseCriterion(t.grammaticalRange),
        summary: String(t.summary ?? ""),
        commonMistakes: Array.isArray(t.commonMistakes) ? t.commonMistakes.map(String) : [],
        modelAnswer: String(t.modelAnswer ?? ""),
      };
    }

    const task1 = normaliseTask(parsed.task1);
    const task2 = normaliseTask(parsed.task2);
    const task1Band = avgBands(task1);
    const task2Band = avgBands(task2);
    // IELTS weighting: Task 2 counts double.
    const overallBand = roundHalf((task1Band + 2 * task2Band) / 3);

    return {
      task1,
      task2,
      task1Band,
      task2Band,
      overallBand,
      overallFeedback: String(parsed.overallFeedback ?? ""),
      whatWentWell: Array.isArray(parsed.whatWentWell) ? parsed.whatWentWell.map(String) : [],
      whatToImprove: Array.isArray(parsed.whatToImprove) ? parsed.whatToImprove.map(String) : [],
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps.map(String) : [],
      whyThisScore: String(parsed.whyThisScore ?? ""),
      howToReachNextBand: String(parsed.howToReachNextBand ?? ""),
    };
  });
