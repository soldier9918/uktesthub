// IELTS Writing prompts — used by the IELTS Writing Exam Mode.
// Each set has two tasks. Task 1 ~150 words, Task 2 ~250 words.

export type WritingVariant = "academic" | "general";

export type WritingTask = {
  /** Markdown-supported prompt. Tables allowed via simple HTML when needed. */
  prompt: string;
  /** Optional structured table to render alongside the prompt (Task 1 charts). */
  table?: {
    headers: string[];
    rows: string[][];
  };
  minWords: number;
  minutesGuidance: number;
};

export type WritingQuestionSet = {
  id: string;
  task1: WritingTask;
  task2: WritingTask;
};

export const IELTS_WRITING_PROMPTS: Record<WritingVariant, WritingQuestionSet[]> = {
  academic: [
    {
      id: "acad-1",
      task1: {
        prompt:
          "The table below shows the percentage of adults in the UK who used different online services in 2015, 2020 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: {
          headers: ["Online Service", "2015", "2020", "2025"],
          rows: [
            ["Online banking", "52%", "68%", "81%"],
            ["Online shopping", "61%", "76%", "88%"],
            ["Online learning", "18%", "42%", "67%"],
            ["Video streaming", "35%", "70%", "84%"],
          ],
        },
        minWords: 150,
        minutesGuidance: 20,
      },
      task2: {
        prompt:
          "Some people believe that online learning is better than classroom learning, while others think traditional classrooms are still more effective.\n\nDiscuss both views and give your own opinion.",
        minWords: 250,
        minutesGuidance: 40,
      },
    },
    {
      id: "acad-2",
      task1: {
        prompt:
          "The chart below shows how people in one city travelled to work in 2010 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: {
          headers: ["Transport Method", "2010", "2025"],
          rows: [
            ["Car", "48%", "35%"],
            ["Bus", "22%", "25%"],
            ["Train", "15%", "21%"],
            ["Bicycle", "5%", "12%"],
            ["Walking", "10%", "7%"],
          ],
        },
        minWords: 150,
        minutesGuidance: 20,
      },
      task2: {
        prompt:
          "In many countries, fewer young people are choosing to learn practical skills such as cooking, budgeting and basic home repairs.\n\nWhy is this happening, and what problems can it cause?",
        minWords: 250,
        minutesGuidance: 40,
      },
    },
  ],
  general: [
    {
      id: "gen-1",
      task1: {
        prompt:
          "You recently bought a product online, but it arrived damaged.\n\nWrite a letter to the company. In your letter:\n\n- explain what you bought\n- describe the problem\n- say what you would like the company to do",
        minWords: 150,
        minutesGuidance: 20,
      },
      task2: {
        prompt:
          "Some people think children should be taught how to manage money at school.\n\nTo what extent do you agree or disagree?",
        minWords: 250,
        minutesGuidance: 40,
      },
    },
    {
      id: "gen-2",
      task1: {
        prompt:
          "You are planning to move to a new city for work. Write a letter to a friend who lives there.\n\nIn your letter:\n\n- explain why you are moving\n- ask for advice about finding accommodation\n- suggest meeting when you arrive",
        minWords: 150,
        minutesGuidance: 20,
      },
      task2: {
        prompt:
          "Many people now work from home instead of travelling to an office every day.\n\nDo the advantages of working from home outweigh the disadvantages?",
        minWords: 250,
        minutesGuidance: 40,
      },
    },
  ],
};

export function pickRandomSet(variant: WritingVariant): WritingQuestionSet {
  const sets = IELTS_WRITING_PROMPTS[variant];
  return sets[Math.floor(Math.random() * sets.length)];
}
