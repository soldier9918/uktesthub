import heroDriving from "@/assets/cat-hero-driving.jpg";
import heroCitizenship from "@/assets/cat-hero-citizenship.jpg";
import heroEnglish from "@/assets/cat-hero-english.jpg";
import heroEducation from "@/assets/cat-hero-education.jpg";
import heroCareer from "@/assets/cat-hero-career.jpg";
import heroProfessional from "@/assets/cat-hero-professional.jpg";
import heroNhs from "@/assets/cat-hero-nhs.jpg";
import heroFun from "@/assets/cat-hero-fun.jpg";
import heroTaxi from "@/assets/cat-hero-taxi-private-hire.jpg";

export type Category = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  accent: "coral" | "gold" | "navy" | "success";
  heroImage: string;
  topics: { slug: string; title: string }[];
};

export const categories: Category[] = [
  {
    slug: "driving",
    title: "Driving & Transport",
    short: "Driving theory, hazard perception & road signs",
    description:
      "Free practice for the UK Driving Theory Test, Hazard Perception, Road Signs and Motorcycle Theory. DVSA-style questions with explanations.",
    icon: "Car",
    accent: "coral",
    heroImage: heroDriving,
    topics: [
      { slug: "driving-theory", title: "Driving Theory Test" },
      { slug: "hazard-perception", title: "Hazard Perception Test" },
      { slug: "road-signs", title: "Road Signs Test" },
      { slug: "motorcycle-theory", title: "Motorcycle Theory Test" },
    ],
  },
  {
    slug: "citizenship",
    title: "UK Citizenship & Life",
    short: "Life in the UK, British citizenship & laws",
    description:
      "Pass the Life in the UK Test first time. Practice questions on history, traditions, government and the law.",
    icon: "Crown",
    accent: "gold",
    heroImage: heroCitizenship,
    topics: [
      { slug: "life-in-the-uk", title: "Life in the UK Test" },
      { slug: "british-citizenship", title: "British Citizenship Practice" },
      { slug: "uk-laws-rights", title: "UK Laws & Rights Quiz" },
      { slug: "uk-geography", title: "UK Geography Test" },
    ],
  },
  {
    slug: "english",
    title: "English Language Tests",
    short: "IELTS, TOEFL, ESOL, grammar & vocabulary",
    description:
      "Improve your English with IELTS Listening, Reading and Writing, TOEFL practice, ESOL exercises and grammar drills.",
    icon: "Languages",
    accent: "navy",
    heroImage: heroEnglish,
    topics: [
      { slug: "ielts", title: "IELTS Practice" },
      { slug: "esol", title: "ESOL Practice" },
      { slug: "toefl", title: "TOEFL Practice" },
      { slug: "grammar", title: "Grammar & Vocabulary" },
    ],
  },
  {
    slug: "education",
    title: "Education & School",
    short: "11+, GCSE, SATs KS1 & KS2",
    description:
      "Free practice tests for the 11+ Exam, GCSE Maths, GCSE English and Key Stage SATs.",
    icon: "GraduationCap",
    accent: "success",
    heroImage: heroEducation,
    topics: [
      { slug: "eleven-plus", title: "11+ Exam Practice" },
      { slug: "gcse-maths", title: "GCSE Maths" },
      { slug: "gcse-english", title: "GCSE English" },
      { slug: "sats", title: "SATs KS1 / KS2" },
    ],
  },
  {
    slug: "career",
    title: "Job & Career Tests",
    short: "Aptitude, psychometric & SJT",
    description:
      "Prepare for job assessments: numerical, verbal and logical aptitude tests, psychometric and Situational Judgement Tests.",
    icon: "Briefcase",
    accent: "navy",
    heroImage: heroCareer,
    topics: [
      { slug: "numerical", title: "Numerical Reasoning" },
      { slug: "verbal", title: "Verbal Reasoning" },
      { slug: "logical", title: "Logical Reasoning" },
      { slug: "sjt", title: "Situational Judgement" },
    ],
  },
  {
    slug: "professional",
    title: "Professional Certification",
    short: "CSCS, SIA, SERU TfL, Food Hygiene, First Aid",
    description:
      "Pass the CSCS Card Test, SIA Security Test, SERU TfL Assessment, Food Hygiene Level 2 and First Aid Theory exams.",
    icon: "ShieldCheck",
    accent: "coral",
    heroImage: heroProfessional,
    topics: [
      { slug: "cscs", title: "CSCS Card Test" },
      { slug: "sia", title: "SIA Security Test" },
      { slug: "seru", title: "SERU TfL Assessment" },
      { slug: "food-hygiene", title: "Food Hygiene Level 2" },
      { slug: "first-aid", title: "First Aid Theory" },
    ],
  },
  {
    slug: "nhs",
    title: "NHS & Healthcare Tests",
    short: "NHS numeracy, literacy, CBT & values-based recruitment",
    description:
      "Practice for NHS recruitment and healthcare assessments — numeracy, literacy, situational judgement, values-based interviews and the NMC CBT for nurses.",
    icon: "HeartPulse",
    accent: "success",
    heroImage: heroNhs,
    topics: [
      { slug: "nhs-numeracy", title: "NHS Numeracy Test" },
      { slug: "nhs-literacy", title: "NHS Literacy Test" },
      { slug: "nhs-values", title: "NHS Values-Based Recruitment" },
      { slug: "nmc-cbt", title: "NMC CBT (Nurses)" },
    ],
  },
  {
    slug: "fun",
    title: "Fun & Viral Quizzes",
    short: "How British are you? UK slang & daily quiz",
    description:
      "Light-hearted quizzes: How British Are You, UK Slang and a fresh General Knowledge Daily Quiz.",
    icon: "Sparkles",
    accent: "gold",
    heroImage: heroFun,
    topics: [
      { slug: "how-british", title: "How British Are You?" },
      { slug: "uk-slang", title: "UK Slang Quiz" },
      { slug: "daily", title: "General Knowledge Daily" },
    ],
  },
];

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const getTopic = (categorySlug: string, topicSlug: string) =>
  getCategory(categorySlug)?.topics.find((t) => t.slug === topicSlug);

export const findTopic = (topicSlug: string) => {
  for (const c of categories) {
    const t = c.topics.find((x) => x.slug === topicSlug);
    if (t) return { category: c, topic: t };
  }
  return null;
};
