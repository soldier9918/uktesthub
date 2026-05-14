// English Language Tests — category catalogue.
//
// 20 categories grouped by `type`:
//   - test-type: IELTS, ESOL, TOEFL, SELT
//   - cefr-level: A1–C2
//   - skill: Listening, Reading, Writing, Speaking
//   - topic: Grammar, Vocabulary, Everyday/Work/Study/UK Life English
//
// Each category exposes 45 mocks × 24 questions. Question banks live as
// static JSON under public/english-mocks/<slug>.json (lazy-loaded — see
// ./mocks.ts). Categories without a bank file render as "coming soon".

export type EnglishCategoryType =
  | "test-type"
  | "cefr-level"
  | "skill"
  | "topic";

export type EnglishCategory = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  type: EnglishCategoryType;
  /** lucide-react icon name */
  icon: string;
  /** UK Test Hub accent token */
  colourTheme: "coral" | "navy" | "gold" | "success";
  /** /blog/<slug> for the related study guide, if any */
  studyGuideSlug?: string;
  totalMockTests: number;
  questionsPerMockTest: number;
};

export const ENGLISH_TOTAL_MOCKS = 45;
export const ENGLISH_QUESTIONS_PER_MOCK = 24;

const SHARED_GUIDE = "english-language-tests-explained";

export const englishCategories: EnglishCategory[] = [
  // -------- Test type --------
  {
    id: "ielts",
    slug: "ielts",
    title: "IELTS Practice",
    shortTitle: "IELTS",
    description:
      "Practise IELTS-style listening, reading, writing and speaking questions for both Academic and General Training.",
    type: "test-type",
    icon: "GraduationCap",
    colourTheme: "coral",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "esol",
    slug: "esol",
    title: "ESOL Practice",
    shortTitle: "ESOL",
    description:
      "Practical UK English for ESOL learners — everyday life, work, appointments, transport, shopping and community.",
    type: "test-type",
    icon: "Users",
    colourTheme: "navy",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "toefl",
    slug: "toefl",
    title: "TOEFL Practice",
    shortTitle: "TOEFL",
    description:
      "Academic English practice for TOEFL — campus life, lectures, reading passages and vocabulary in context.",
    type: "test-type",
    icon: "BookOpen",
    colourTheme: "gold",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "selt",
    slug: "selt",
    title: "SELT Practice",
    shortTitle: "SELT",
    description:
      "UK visa and citizenship-style English practice — speaking, listening and everyday communication scenarios.",
    type: "test-type",
    icon: "ShieldCheck",
    colourTheme: "success",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },

  // -------- CEFR --------
  {
    id: "a1",
    slug: "a1",
    title: "A1 English Practice",
    shortTitle: "A1",
    description:
      "Beginner English. Simple words, short sentences, introductions, numbers, times and everyday objects.",
    type: "cefr-level",
    icon: "Sparkles",
    colourTheme: "success",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "a2",
    slug: "a2",
    title: "A2 English Practice",
    shortTitle: "A2",
    description:
      "Elementary English. Shopping, travel, work, family, weather, directions and short notices.",
    type: "cefr-level",
    icon: "Sparkles",
    colourTheme: "success",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "b1",
    slug: "b1",
    title: "B1 English Practice",
    shortTitle: "B1",
    description:
      "Intermediate English. Opinions, explanations, short texts, workplace situations, UK life, common grammar and vocabulary.",
    type: "cefr-level",
    icon: "TrendingUp",
    colourTheme: "coral",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "b2",
    slug: "b2",
    title: "B2 English Practice",
    shortTitle: "B2",
    description:
      "Upper-intermediate English. Detailed texts, opinions, arguments, formal/informal language, work and study.",
    type: "cefr-level",
    icon: "TrendingUp",
    colourTheme: "coral",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "c1",
    slug: "c1",
    title: "C1 English Practice",
    shortTitle: "C1",
    description:
      "Advanced English. Complex grammar, academic vocabulary, inference, tone and detailed reading.",
    type: "cefr-level",
    icon: "Award",
    colourTheme: "navy",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "c2",
    slug: "c2",
    title: "C2 English Practice",
    shortTitle: "C2",
    description:
      "Proficient English. Nuance, idioms, advanced vocabulary, complex reading and formal style.",
    type: "cefr-level",
    icon: "Award",
    colourTheme: "navy",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },

  // -------- Skills --------
  {
    id: "listening",
    slug: "listening",
    title: "Listening Practice",
    shortTitle: "Listening",
    description:
      "Transcript-style listening scenarios — conversations, announcements and instructions you’d hear in UK life.",
    type: "skill",
    icon: "Headphones",
    colourTheme: "navy",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "reading",
    slug: "reading",
    title: "Reading Practice",
    shortTitle: "Reading",
    description:
      "Short passages, signs, notices, emails and article snippets followed by comprehension questions.",
    type: "skill",
    icon: "BookOpen",
    colourTheme: "coral",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "writing",
    slug: "writing",
    title: "Writing Practice",
    shortTitle: "Writing",
    description:
      "Choose the best sentence, fix grammar, pick the right email response or formal/informal wording.",
    type: "skill",
    icon: "PenLine",
    colourTheme: "gold",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "speaking",
    slug: "speaking",
    title: "Speaking Practice",
    shortTitle: "Speaking",
    description:
      "Speaking-style prompts — choose the most natural spoken response for everyday UK conversations.",
    type: "skill",
    icon: "Mic",
    colourTheme: "success",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },

  // -------- Topics --------
  {
    id: "grammar",
    slug: "grammar",
    title: "Grammar Practice",
    shortTitle: "Grammar",
    description:
      "Tenses, prepositions, articles, modal verbs, sentence order, conditionals and subject-verb agreement.",
    type: "topic",
    icon: "Brackets",
    colourTheme: "navy",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "vocabulary",
    slug: "vocabulary",
    title: "Vocabulary Practice",
    shortTitle: "Vocabulary",
    description:
      "Common words, synonyms, phrasal verbs, collocations, idioms and UK English phrases.",
    type: "topic",
    icon: "BookA",
    colourTheme: "gold",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "everyday-english",
    slug: "everyday-english",
    title: "Everyday English Practice",
    shortTitle: "Everyday English",
    description:
      "Real-life situations — shops, GP appointments, buses, trains, neighbours, school, work and phone calls.",
    type: "topic",
    icon: "Coffee",
    colourTheme: "coral",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "work-english",
    slug: "work-english",
    title: "Work English Practice",
    shortTitle: "Work English",
    description:
      "Emails, meetings, interviews, workplace signs, polite requests and professional vocabulary.",
    type: "topic",
    icon: "Briefcase",
    colourTheme: "navy",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "study-english",
    slug: "study-english",
    title: "Study English Practice",
    shortTitle: "Study English",
    description:
      "Classroom language, college and university situations, assignments, lectures, library and academic vocabulary.",
    type: "topic",
    icon: "GraduationCap",
    colourTheme: "gold",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
  {
    id: "uk-life-english",
    slug: "uk-life-english",
    title: "UK Life English Practice",
    shortTitle: "UK Life English",
    description:
      "Council services, NHS, transport, housing, bills, banking, post office, job centre and community services.",
    type: "topic",
    icon: "Landmark",
    colourTheme: "success",
    studyGuideSlug: SHARED_GUIDE,
    totalMockTests: ENGLISH_TOTAL_MOCKS,
    questionsPerMockTest: ENGLISH_QUESTIONS_PER_MOCK,
  },
];

export function getEnglishCategory(slug: string): EnglishCategory | undefined {
  return englishCategories.find((c) => c.slug === slug);
}

export function englishCategoriesByType(type: EnglishCategoryType) {
  return englishCategories.filter((c) => c.type === type);
}

export const ENGLISH_TYPE_LABELS: Record<EnglishCategoryType, string> = {
  "test-type": "Test Types",
  "cefr-level": "CEFR Levels",
  skill: "Skills",
  topic: "Topics",
};
