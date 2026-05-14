// English Language Tests — structured catalogue.
//
// Drill-down hierarchy:
//   test type  ->  skill  ->  CEFR level  ->  45 mock tests
//
// IELTS / ESOL / TOEFL share the same 4 skills (listening, reading,
// writing, speaking) × 6 CEFR levels (A1–C2) = 24 level banks each.
// SELT splits into two pathways (speaking-listening A1/A2/B1 and
// four-skills B1/B2/C1/C2) = 7 level banks.
//
// Each (test, skill, level) bank holds 45 mocks × 24 unique questions.
// Bank JSON lives at public/english-mocks/{test}/{skill}/{level}.json.

export type TestSlug = "ielts" | "esol" | "toefl" | "selt";
export type SkillSlug =
  | "listening"
  | "reading"
  | "writing"
  | "speaking"
  | "speaking-listening"
  | "four-skills";
export type LevelSlug = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export const ENGLISH_TOTAL_MOCKS = 45;
export const ENGLISH_QUESTIONS_PER_MOCK = 24;

export type SkillConfig = {
  slug: SkillSlug;
  title: string; // e.g. "Listening Practice"
  shortTitle: string; // "Listening"
  description: string;
  icon: string;
  levels: LevelSlug[];
};

export type TestConfig = {
  slug: TestSlug;
  title: string; // e.g. "IELTS-style Practice"
  shortTitle: string; // "IELTS"
  tagline: string;
  description: string;
  studyGuideSlug?: string;
  icon: string;
  colourTheme: "coral" | "navy" | "gold" | "success";
  skills: SkillConfig[];
};

const ALL_LEVELS: LevelSlug[] = ["a1", "a2", "b1", "b2", "c1", "c2"];

export const LEVEL_LABEL: Record<LevelSlug, string> = {
  a1: "A1 (Beginner)",
  a2: "A2 (Elementary)",
  b1: "B1 (Intermediate)",
  b2: "B2 (Upper-Intermediate)",
  c1: "C1 (Advanced)",
  c2: "C2 (Proficient)",
};

export const LEVEL_SHORT: Record<LevelSlug, string> = {
  a1: "A1",
  a2: "A2",
  b1: "B1",
  b2: "B2",
  c1: "C1",
  c2: "C2",
};

export const LEVEL_DESCRIPTION: Record<LevelSlug, string> = {
  a1: "Beginner — simple words, short sentences, everyday objects, numbers and introductions.",
  a2: "Elementary — shopping, travel, work, family, weather, directions and short notices.",
  b1: "Intermediate — opinions, explanations, workplace situations and common grammar.",
  b2: "Upper-Intermediate — detailed texts, opinions, arguments and formal/informal language.",
  c1: "Advanced — complex grammar, academic vocabulary, inference, tone and detailed reading.",
  c2: "Proficient — nuance, idioms, advanced vocabulary, complex reading and formal style.",
};

const FOUR_SKILLS: SkillConfig[] = [
  {
    slug: "listening",
    title: "Listening Practice",
    shortTitle: "Listening",
    description:
      "Transcript-style listening questions — conversations, announcements and instructions you’d hear in everyday situations.",
    icon: "Headphones",
    levels: ALL_LEVELS,
  },
  {
    slug: "reading",
    title: "Reading Practice",
    shortTitle: "Reading",
    description:
      "Short passages, signs, notices, emails and article snippets followed by comprehension questions.",
    icon: "BookOpen",
    levels: ALL_LEVELS,
  },
  {
    slug: "writing",
    title: "Writing Practice",
    shortTitle: "Writing",
    description:
      "Choose the best sentence, fix grammar, pick the right email response or formal/informal wording.",
    icon: "PenLine",
    levels: ALL_LEVELS,
  },
  {
    slug: "speaking",
    title: "Speaking Practice",
    shortTitle: "Speaking",
    description:
      "Speaking-style prompts — pick the most natural spoken response for everyday conversations.",
    icon: "Mic",
    levels: ALL_LEVELS,
  },
];

const SHARED_GUIDE = "english-language-tests-explained";

export const englishTests: TestConfig[] = [
  {
    slug: "ielts",
    title: "IELTS-style Practice",
    shortTitle: "IELTS",
    tagline: "IELTS Practice",
    description:
      "Practise IELTS-style listening, reading, writing and speaking questions across all CEFR levels.",
    studyGuideSlug: SHARED_GUIDE,
    icon: "GraduationCap",
    colourTheme: "coral",
    skills: FOUR_SKILLS,
  },
  {
    slug: "esol",
    title: "ESOL-style Practice",
    shortTitle: "ESOL",
    tagline: "ESOL Practice",
    description:
      "Practical UK English for ESOL learners — everyday life, work, appointments, transport, shopping and community.",
    studyGuideSlug: SHARED_GUIDE,
    icon: "Users",
    colourTheme: "navy",
    skills: FOUR_SKILLS,
  },
  {
    slug: "toefl",
    title: "TOEFL-style Practice",
    shortTitle: "TOEFL",
    tagline: "TOEFL Practice",
    description:
      "Academic English practice for TOEFL — campus life, lectures, reading passages and vocabulary in context.",
    studyGuideSlug: SHARED_GUIDE,
    icon: "BookOpen",
    colourTheme: "gold",
    skills: FOUR_SKILLS,
  },
  {
    slug: "selt",
    title: "SELT-style Practice",
    shortTitle: "SELT",
    tagline: "SELT Practice",
    description:
      "Secure English Language Test-style practice for UK visa, settlement and citizenship contexts.",
    studyGuideSlug: SHARED_GUIDE,
    icon: "ShieldCheck",
    colourTheme: "success",
    skills: [
      {
        slug: "speaking-listening",
        title: "SELT Speaking & Listening Practice",
        shortTitle: "Speaking & Listening",
        description:
          "Practice for SELT Speaking & Listening — used for many UK visa and settlement applications at A1, A2 and B1.",
        icon: "Mic",
        levels: ["a1", "a2", "b1"],
      },
      {
        slug: "four-skills",
        title: "SELT Four Skills Practice",
        shortTitle: "Four Skills",
        description:
          "Full SELT four-skills practice (reading, writing, speaking, listening) at B1, B2, C1 and C2.",
        icon: "BookOpen",
        levels: ["b1", "b2", "c1", "c2"],
      },
    ],
  },
];

export function getTest(slug: string): TestConfig | undefined {
  return englishTests.find((t) => t.slug === slug);
}

export function getSkill(
  test: TestConfig,
  slug: string,
): SkillConfig | undefined {
  return test.skills.find((s) => s.slug === slug);
}

export function hasLevel(skill: SkillConfig, level: string): level is LevelSlug {
  return (skill.levels as string[]).includes(level);
}

export function bankPath(
  test: TestSlug,
  skill: SkillSlug,
  level: LevelSlug,
): string {
  return `/english-mocks/${test}/${skill}/${level}.json`;
}

/** All valid (test, skill, level) combinations. Used by sitemap + scripts. */
export function allEnglishLevelTriples(): Array<{
  test: TestSlug;
  skill: SkillSlug;
  level: LevelSlug;
}> {
  const out: Array<{ test: TestSlug; skill: SkillSlug; level: LevelSlug }> = [];
  for (const t of englishTests) {
    for (const s of t.skills) {
      for (const l of s.levels) {
        out.push({ test: t.slug, skill: s.slug, level: l });
      }
    }
  }
  return out;
}
