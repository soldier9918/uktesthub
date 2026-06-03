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

export type IeltsCriterionScores = {
  taskResponse: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  feedback: string;
};

export type IeltsMarkingResult = {
  task1: IeltsCriterionScores;
  task2: IeltsCriterionScores;
  task1Band: number;
  task2Band: number;
  overallBand: number;
  overallFeedback: string;
};

function roundHalf(n: number): number {
  const clamped = Math.max(0, Math.min(9, n));
  return Math.round(clamped * 2) / 2;
}

function avgCriteria(c: IeltsCriterionScores): number {
  return roundHalf(
    (c.taskResponse + c.coherenceCohesion + c.lexicalResource + c.grammaticalRange) / 4,
  );
}

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

    const systemPrompt = `You are an experienced IELTS Writing examiner. Mark candidate responses strictly using the official IELTS Writing band descriptors (0–9, in half-band increments). Score each task on the four criteria: Task Response (Task Achievement for Task 1), Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. Give each criterion a band from 0 to 9 in 0.5 steps. Be honest and calibrated — do not inflate scores. Provide concise examiner-style feedback (2–4 sentences) per task pointing out strengths and the main improvement areas.

Variant: IELTS ${variantLabel}.
${task1Type}
${task2Type}`;

    const userPrompt = `TASK 1 PROMPT:\n${data.task1.prompt}\n\nTASK 1 CANDIDATE ANSWER:\n${data.task1.answer}\n\n---\n\nTASK 2 PROMPT:\n${data.task2.prompt}\n\nTASK 2 CANDIDATE ANSWER:\n${data.task2.answer}\n\nMark both tasks now using the submit_ielts_marking tool.`;

    const criterionSchema = {
      type: "object",
      properties: {
        taskResponse: { type: "number", minimum: 0, maximum: 9 },
        coherenceCohesion: { type: "number", minimum: 0, maximum: 9 },
        lexicalResource: { type: "number", minimum: 0, maximum: 9 },
        grammaticalRange: { type: "number", minimum: 0, maximum: 9 },
        feedback: { type: "string" },
      },
      required: [
        "taskResponse",
        "coherenceCohesion",
        "lexicalResource",
        "grammaticalRange",
        "feedback",
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
            description: "Return IELTS Writing band scores and feedback for both tasks.",
            parameters: {
              type: "object",
              properties: {
                task1: criterionSchema,
                task2: criterionSchema,
                overallFeedback: { type: "string" },
              },
              required: ["task1", "task2", "overallFeedback"],
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
          tool_calls?: Array<{
            function?: { name?: string; arguments?: string };
          }>;
        };
      }>;
    };

    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    const argsRaw = call?.function?.arguments;
    if (!argsRaw) {
      console.error("IELTS marking: no tool call in response", JSON.stringify(json));
      throw new Error("AI_PARSE_ERROR");
    }

    let parsed: {
      task1: IeltsCriterionScores;
      task2: IeltsCriterionScores;
      overallFeedback: string;
    };
    try {
      parsed = JSON.parse(argsRaw);
    } catch {
      throw new Error("AI_PARSE_ERROR");
    }

    const task1: IeltsCriterionScores = {
      taskResponse: roundHalf(parsed.task1.taskResponse),
      coherenceCohesion: roundHalf(parsed.task1.coherenceCohesion),
      lexicalResource: roundHalf(parsed.task1.lexicalResource),
      grammaticalRange: roundHalf(parsed.task1.grammaticalRange),
      feedback: String(parsed.task1.feedback ?? ""),
    };
    const task2: IeltsCriterionScores = {
      taskResponse: roundHalf(parsed.task2.taskResponse),
      coherenceCohesion: roundHalf(parsed.task2.coherenceCohesion),
      lexicalResource: roundHalf(parsed.task2.lexicalResource),
      grammaticalRange: roundHalf(parsed.task2.grammaticalRange),
      feedback: String(parsed.task2.feedback ?? ""),
    };

    const task1Band = avgCriteria(task1);
    const task2Band = avgCriteria(task2);
    // IELTS weighting: Task 2 counts double.
    const overallBand = roundHalf((task1Band + 2 * task2Band) / 3);

    return {
      task1,
      task2,
      task1Band,
      task2Band,
      overallBand,
      overallFeedback: String(parsed.overallFeedback ?? ""),
    };
  });
