// Aggregates all per-topic mock JSON files. Supports two on-disk formats:
//
//   v1 (legacy "baked"):
//     { topic, tests: [ { slug, mockNumber, title, questions: RawQuestion[] } ] }
//
//   v2 (bank + slots):
//     { version: 2, topic, bank: RawQuestion[], mocks: [ { mockNumber, title, questionIds: string[] } ] }
//
// Both produce the same MockTest shape downstream so existing routes keep working.
import type { Quiz, Question } from "@/data/quizzes";

// ---------- Raw on-disk question shapes (one per supported type) ----------

type RawMcq = {
  type?: "mcq" | "multiple_choice";
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  image?: string;
  imageAlt?: string;
};
type RawFillBlanks = {
  type: "fill-blanks" | "dropdown_blanks";
  id?: string;
  template: string;
  prompt?: string;
  blanks: { options: string[]; correctIndex: number }[];
  explanation: string;
};
type RawDragDrop = {
  type: "drag-drop-blanks" | "drag_drop_blanks";
  id?: string;
  template: string;
  prompt?: string;
  blanks: { options: string[]; correctIndex: number }[];
  explanation: string;
};
type RawTrueFalse = {
  type: "true-false" | "true_false";
  id?: string;
  question: string;
  correctAnswer: boolean;
  explanation: string;
  image?: string;
  imageAlt?: string;
};
type RawMultiResponse = {
  type: "multiple-response" | "multiple_response";
  id?: string;
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  image?: string;
  imageAlt?: string;
};
type RawNumeric = {
  type: "numeric-entry" | "numeric_entry";
  id?: string;
  question: string;
  correctAnswer: number;
  tolerance?: number;
  unit?: string;
  explanation: string;
};
type RawImage = {
  type: "image-question" | "image_question";
  id?: string;
  question: string;
  image?: string;
  imageAlt: string;
  imageDescription?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};
type RawHotSpot = {
  type: "hot-spot" | "hot_spot";
  id?: string;
  question: string;
  image: string;
  imageAlt: string;
  spots: { id: string; label: string; x: number; y: number; w: number; h: number }[];
  correctSpotId: string;
  explanation: string;
};

type RawQuestion =
  | RawMcq
  | RawFillBlanks
  | RawDragDrop
  | RawTrueFalse
  | RawMultiResponse
  | RawNumeric
  | RawImage
  | RawHotSpot;

// ---------- Internal mock shape consumed by routes ----------

type MockTest = {
  slug: string;
  topic: string;
  mockNumber: number;
  title: string;
  questions: RawQuestion[];
};

// ---------- File shapes ----------

type V1File = { topic: string; tests: MockTest[] };
type V2File = {
  version: 2;
  topic: string;
  bank: (RawQuestion & { id: string })[];
  mocks: { mockNumber: number; title: string; questionIds: string[] }[];
};
type MockFile = V1File | V2File;

// ---------- Load all JSON files at build time ----------

const modules = import.meta.glob<MockFile>("./*.json", {
  eager: true,
  import: "default",
});

const byTopic = new Map<string, MockTest[]>();
const bySlug = new Map<string, MockTest>();

function isV2(file: MockFile): file is V2File {
  return (file as V2File).version === 2 && Array.isArray((file as V2File).bank);
}

function expandV2(file: V2File): MockTest[] {
  const bankById = new Map(file.bank.map((q) => [q.id, q]));
  const out: MockTest[] = [];
  for (const m of file.mocks) {
    const questions: RawQuestion[] = [];
    for (const qid of m.questionIds) {
      const q = bankById.get(qid);
      if (q) questions.push(q);
    }
    out.push({
      slug: `${file.topic}-mock-${m.mockNumber}`,
      topic: file.topic,
      mockNumber: m.mockNumber,
      title: m.title,
      questions,
    });
  }
  return out;
}

for (const file of Object.values(modules)) {
  if (!file?.topic) continue;
  let tests: MockTest[];
  if (isV2(file)) {
    tests = expandV2(file);
  } else if (Array.isArray((file as V1File).tests)) {
    tests = (file as V1File).tests;
  } else {
    continue;
  }
  const sorted = [...tests].sort((a, b) => a.mockNumber - b.mockNumber);
  byTopic.set(file.topic, sorted);
  for (const t of sorted) bySlug.set(t.slug, t);
}

export const TOTAL_MOCKS_PER_TOPIC = 45;
export const QUESTIONS_PER_MOCK = 24;

export function getMocksByTopic(topicSlug: string): MockTest[] {
  return byTopic.get(topicSlug) ?? [];
}

export function getMockBySlug(slug: string): MockTest | undefined {
  return bySlug.get(slug);
}

export function listMockSlots(topicSlug: string) {
  const real = getMocksByTopic(topicSlug);
  const realByNum = new Map(real.map((m) => [m.mockNumber, m]));
  return Array.from({ length: TOTAL_MOCKS_PER_TOPIC }, (_, i) => {
    const n = i + 1;
    const m = realByNum.get(n);
    return {
      mockNumber: n,
      slug: m?.slug ?? `${topicSlug}-mock-${n}`,
      title: m?.title ?? `Test ${n}`,
      available: Boolean(m),
      questionsCount: QUESTIONS_PER_MOCK,
    };
  });
}

// ---------- Raw → typed Question converter ----------

function normaliseType(raw: RawQuestion): string {
  const t = (raw as { type?: string }).type;
  if (!t) return "mcq";
  // Underscore variants from the spreadsheet/AI → hyphen variants the runtime uses.
  return t.replace(/_/g, "-");
}

function rawToQuestion(raw: RawQuestion, idx: number): Question {
  const id = idx + 1;
  const t = normaliseType(raw);

  switch (t) {
    case "fill-blanks":
    case "dropdown-blanks": {
      const r = raw as RawFillBlanks;
      return {
        type: "fill-blanks",
        id,
        template: r.template,
        prompt: r.prompt,
        blanks: r.blanks,
        explanation: r.explanation,
      };
    }
    case "drag-drop-blanks": {
      const r = raw as RawDragDrop;
      return {
        type: "drag-drop-blanks",
        id,
        template: r.template,
        prompt: r.prompt,
        blanks: r.blanks,
        explanation: r.explanation,
      };
    }
    case "true-false": {
      const r = raw as RawTrueFalse;
      return {
        type: "true-false",
        id,
        question: r.question,
        correctAnswer: r.correctAnswer,
        explanation: r.explanation,
        image: r.image,
        imageAlt: r.imageAlt,
      };
    }
    case "multiple-response": {
      const r = raw as RawMultiResponse;
      return {
        type: "multiple-response",
        id,
        question: r.question,
        options: r.options,
        correctAnswers: r.correctAnswers,
        explanation: r.explanation,
        image: r.image,
        imageAlt: r.imageAlt,
      };
    }
    case "numeric-entry": {
      const r = raw as RawNumeric;
      return {
        type: "numeric-entry",
        id,
        question: r.question,
        correctAnswer: r.correctAnswer,
        tolerance: r.tolerance,
        unit: r.unit,
        explanation: r.explanation,
      };
    }
    case "image-question": {
      const r = raw as RawImage & { imageDescription?: string };
      // No image URL — fold the description into the question text so the
      // question is self-contained instead of misleadingly referring to a
      // missing image.
      if (!r.image) {
        const desc = r.imageDescription || r.imageAlt || "";
        const cleanedQ = (r.question || "")
          .replace(
            /this (mandatory blue|blue circular|red triangular|yellow|warning|prohibition|circular|mandatory|hazard|safety)? ?sign/gi,
            "the sign",
          )
          .replace(/this (image|picture|diagram|illustration)/gi, "the $1")
          .replace(/shown (above|here|below)/gi, "")
          .replace(/\s+/g, " ")
          .trim();
        const composed = desc
          ? `${desc.replace(/\s*\.?\s*$/, ".")} ${cleanedQ}`
          : cleanedQ;
        return {
          type: "mcq",
          id,
          question: composed,
          options: r.options,
          correctAnswer: r.correctAnswer,
          explanation: r.explanation,
        };
      }
      return {
        type: "image-question",
        id,
        question: r.question,
        image: r.image,
        imageAlt: r.imageAlt,
        options: r.options,
        correctAnswer: r.correctAnswer,
        explanation: r.explanation,
      };
    }
    case "hot-spot": {
      const r = raw as RawHotSpot & { imageDescription?: string };
      // Hot-spot without an image URL can't be rendered — skip in a safe way
      // by converting to a basic MCQ if options exist; otherwise return a
      // placeholder MCQ so the mock still has the right number of questions.
      if (!r.image) {
        return {
          type: "mcq",
          id,
          question: r.question,
          options: r.spots.map((s) => s.label),
          correctAnswer: Math.max(
            0,
            r.spots.findIndex((s) => s.id === r.correctSpotId),
          ),
          explanation: r.explanation,
        };
      }
      return {
        type: "hot-spot",
        id,
        question: r.question,
        image: r.image,
        imageAlt: r.imageAlt,
        spots: r.spots,
        correctSpotId: r.correctSpotId,
        explanation: r.explanation,
      };
    }
    case "mcq":
    case "multiple-choice":
    default: {
      const r = raw as RawMcq;
      return {
        type: "mcq",
        id,
        question: r.question,
        options: r.options,
        correctAnswer: r.correctAnswer,
        explanation: r.explanation,
        image: r.image,
        imageAlt: r.imageAlt,
      };
    }
  }
}

export function mockToQuiz(category: string, mock: MockTest): Quiz {
  return {
    slug: mock.slug,
    category,
    topic: mock.topic,
    quizTitle: mock.title,
    description: `Mock test ${mock.mockNumber} — ${mock.questions.length} questions.`,
    timeLimit: mock.questions.length * 60,
    difficulty: "Medium",
    passMark: 75,
    questions: mock.questions.map((raw, idx) => rawToQuestion(raw, idx)),
  };
}
