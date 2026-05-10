import heroDriving from "@/assets/cat-hero-driving.jpg";
import heroCitizenship from "@/assets/cat-hero-citizenship.jpg";
import heroEnglish from "@/assets/cat-hero-english.jpg";
import heroEducation from "@/assets/cat-hero-education.jpg";
import heroCareer from "@/assets/cat-hero-career.jpg";
import heroProfessional from "@/assets/cat-hero-professional.jpg";
import heroNhs from "@/assets/cat-hero-nhs.jpg";

import heroTaxi from "@/assets/cat-hero-taxi-private-hire.jpg";
import heroSecurity from "@/assets/cat-hero-security.jpg";
import heroHospitality from "@/assets/cat-hero-hospitality.jpg";
import heroConstruction from "@/assets/cat-hero-construction.jpg";
import heroFinance from "@/assets/cat-hero-finance.jpg";
import heroItTech from "@/assets/cat-hero-it-tech.jpg";
import heroHealthcareEntry from "@/assets/cat-hero-healthcare-entry.jpg";
import heroTeaching from "@/assets/cat-hero-teaching.jpg";
import heroLegal from "@/assets/cat-hero-legal.jpg";
import heroMilitary from "@/assets/cat-hero-military.jpg";
import heroMaritimeAviation from "@/assets/cat-hero-maritime-aviation.jpg";
import heroGovernment from "@/assets/cat-hero-government.jpg";
import heroHgvLogistics from "@/assets/cat-hero-hgv-logistics.jpg";
import heroCareSocialWork from "@/assets/cat-hero-care-social-work.jpg";
import heroBeautyWellbeing from "@/assets/cat-hero-beauty-wellbeing.jpg";
import heroRetailCustomerService from "@/assets/cat-hero-retail-customer-service.jpg";
import heroAnimalCare from "@/assets/cat-hero-animal-care.jpg";

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
    title: "Workplace Compliance & Safety",
    short: "Food Hygiene, First Aid, Fire Safety, Manual Handling, H&S, GDPR",
    description:
      "Free practice for the workplace compliance certifications most UK employers require — Food Hygiene Level 2, First Aid Theory, Fire Safety Awareness, Manual Handling, Health & Safety Awareness and GDPR / Data Protection Awareness.",
    icon: "ShieldCheck",
    accent: "coral",
    heroImage: heroProfessional,
    topics: [
      { slug: "food-hygiene", title: "Food Hygiene Level 2" },
      { slug: "first-aid", title: "First Aid Theory" },
      { slug: "fire-safety", title: "Fire Safety Awareness" },
      { slug: "manual-handling", title: "Manual Handling Awareness" },
      { slug: "health-safety-awareness", title: "Health & Safety Awareness" },
      { slug: "gdpr-awareness", title: "GDPR / Data Protection Awareness" },
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
    slug: "taxi-private-hire",
    title: "Taxi & Private Hire",
    short: "TfL SERU, Topographical, PHV licence, ULEZ & Congestion Charge",
    description:
      "Free practice tests for London private hire and taxi drivers — TfL SERU, Topographical Assessment, PHV licence knowledge, ULEZ, Congestion Charge, safeguarding and accessibility duties.",
    icon: "Taxi",
    accent: "coral",
    heroImage: heroTaxi,
    topics: [
      { slug: "seru", title: "SERU TfL Mock Test" },
      { slug: "topographical", title: "Topographical Assessment Practice" },
      { slug: "phv-licence", title: "Private Hire Driver Licence Knowledge Test" },
      { slug: "ph-safety-equality", title: "Safety, Equality & Regulatory Awareness Test" },
      { slug: "ph-safeguarding", title: "Safeguarding Awareness Practice Test" },
      { slug: "ph-english", title: "English Language Requirement Practice" },
      { slug: "ph-speaking-listening", title: "Speaking & Listening Practice" },
      { slug: "congestion-charge", title: "Congestion Charge Quiz" },
      { slug: "ulez", title: "Ultra Low Emission Zone Quiz" },
      { slug: "ph-dbs-licensing", title: "DBS & Licensing Rules Quiz" },
      { slug: "ph-badge-rules", title: "Private Hire Driver Badge Rules Quiz" },
      { slug: "ph-assistance-dogs", title: "Assistance Dogs & Accessibility Duties Quiz" },
      { slug: "ph-passenger-safety", title: "Passenger Safety & Driver Conduct Quiz" },
      { slug: "ph-hmrc-tax-check", title: "HMRC Tax Check Awareness Quiz" },
      { slug: "ph-london-regulations", title: "London Private Hire Regulations Quiz" },
    ],
  },
  
  {
    slug: "security",
    title: "Security & Door Supervision",
    short: "SIA Door Supervisor, CCTV, Close Protection & Top-Up",
    description:
      "Practice for the SIA licence-linked qualifications: Door Supervisor, CCTV Operator, Close Protection and the Door Supervisor Top-Up. Real exam-style questions with explanations.",
    icon: "Shield",
    accent: "navy",
    heroImage: heroSecurity,
    topics: [
      { slug: "sia-door-supervisor", title: "SIA Door Supervisor Test" },
      { slug: "sia-cctv", title: "SIA CCTV Operator Test" },
      { slug: "sia-close-protection", title: "SIA Close Protection Test" },
      { slug: "sia-top-up", title: "SIA Door Supervisor Top-Up Test" },
    ],
  },
  {
    slug: "hospitality",
    title: "Hospitality & Catering",
    short: "Personal Licence (APLH), Allergens, HACCP & Service",
    description:
      "Free practice for hospitality qualifications — Award for Personal Licence Holders (APLH), Allergen Awareness, HACCP Level 2 and customer service essentials.",
    icon: "ChefHat",
    accent: "gold",
    heroImage: heroHospitality,
    topics: [
      { slug: "aplh-personal-licence", title: "Personal Licence (APLH) Test" },
      { slug: "allergen-awareness", title: "Allergen Awareness Test" },
      { slug: "haccp-level-2", title: "HACCP Level 2 Test" },
      { slug: "customer-service", title: "Customer Service Practice" },
    ],
  },
  {
    slug: "construction",
    title: "Construction & Trade",
    short: "CSCS Operative & Gold, CITB HSE, IPAF / PASMA",
    description:
      "Prepare for life on a UK building site — CSCS Operative and Supervisor (Gold), the CITB Health, Safety and Environment Test, plus IPAF and PASMA working-at-height practice.",
    icon: "HardHat",
    accent: "coral",
    heroImage: heroConstruction,
    topics: [
      { slug: "cscs-operative", title: "CSCS Operative Test" },
      { slug: "cscs-gold", title: "CSCS Gold (Supervisor) Test" },
      { slug: "citb-hse", title: "CITB Health, Safety & Environment Test" },
      { slug: "ipaf-pasma", title: "IPAF / PASMA Working at Height Test" },
    ],
  },
  {
    slug: "finance",
    title: "Finance & Accounting",
    short: "AAT, ACCA, CFA-style aptitude & financial awareness",
    description:
      "Free practice for finance and accounting qualifications — AAT Level 2 Bookkeeping, ACCA Foundations (FIA), CFA-style numerical aptitude and a general financial awareness quiz.",
    icon: "Calculator",
    accent: "navy",
    heroImage: heroFinance,
    topics: [
      { slug: "aat-bookkeeping", title: "AAT Level 2 Bookkeeping" },
      { slug: "acca-foundations", title: "ACCA Foundations (FIA) Practice" },
      { slug: "cfa-aptitude", title: "CFA-Style Aptitude Test" },
      { slug: "financial-awareness", title: "Financial Awareness Quiz" },
    ],
  },
  {
    slug: "it-tech",
    title: "IT & Tech Certifications",
    short: "CompTIA A+, ITIL 4, Microsoft Fundamentals & Cyber",
    description:
      "Prepare for entry-level IT certifications — CompTIA A+, ITIL 4 Foundation, Microsoft MS-900 / AZ-900 Fundamentals and a cyber security awareness primer.",
    icon: "Cpu",
    accent: "success",
    heroImage: heroItTech,
    topics: [
      { slug: "comptia-a-plus", title: "CompTIA A+ Practice" },
      { slug: "itil-4", title: "ITIL 4 Foundation Practice" },
      { slug: "microsoft-fundamentals", title: "Microsoft Fundamentals (MS-900 / AZ-900)" },
      { slug: "cyber-awareness", title: "Cyber Security Awareness" },
    ],
  },
  {
    slug: "healthcare-entry",
    title: "Healthcare Entry Exams",
    short: "UCAT, BMAT, OET & PLAB sample questions",
    description:
      "Practice for medical and healthcare admissions — UCAT, BMAT, the OET (Occupational English Test) for healthcare professionals and PLAB 1 sample questions.",
    icon: "Stethoscope",
    accent: "coral",
    heroImage: heroHealthcareEntry,
    topics: [
      { slug: "ucat", title: "UCAT Practice" },
      { slug: "bmat", title: "BMAT Practice" },
      { slug: "oet", title: "OET (Healthcare English)" },
      { slug: "plab-1", title: "PLAB 1 Sample Questions" },
    ],
  },
  {
    slug: "teaching",
    title: "Teaching & QTS",
    short: "QTS Numeracy, Literacy, Professional Skills & Safeguarding",
    description:
      "Prepare for teacher training and QTS — QTS Numeracy and Literacy Skills Tests, Professional Skills for Teachers and Safeguarding in Schools practice.",
    icon: "BookOpen",
    accent: "gold",
    heroImage: heroTeaching,
    topics: [
      { slug: "qts-numeracy", title: "QTS Numeracy Skills Test" },
      { slug: "qts-literacy", title: "QTS Literacy Skills Test" },
      { slug: "professional-skills-teachers", title: "Professional Skills for Teachers" },
      { slug: "safeguarding-schools", title: "Safeguarding in Schools" },
    ],
  },
  {
    slug: "legal",
    title: "Legal & Law",
    short: "SQE1 FLK1 & FLK2, LNAT & UK legal system",
    description:
      "Free practice for aspiring solicitors and law students — SQE1 FLK1 and FLK2 multiple choice, LNAT practice and a UK legal system quiz.",
    icon: "Scale",
    accent: "navy",
    heroImage: heroLegal,
    topics: [
      { slug: "sqe1-flk1", title: "SQE1 FLK1 Practice" },
      { slug: "sqe1-flk2", title: "SQE1 FLK2 Practice" },
      { slug: "lnat", title: "LNAT Multiple Choice" },
      { slug: "uk-legal-system", title: "UK Legal System Quiz" },
    ],
  },
  {
    slug: "military-emergency",
    title: "Military & Emergency Services",
    short: "Army BARB, Police PIRT & SEARCH, Firefighter NFSAT",
    description:
      "Practice for the British Army, Police and Fire & Rescue selection — Army BARB Test, Police PIRT (Initial Recruitment), Police SEARCH Assessment and Firefighter NFSAT.",
    icon: "Siren",
    accent: "coral",
    heroImage: heroMilitary,
    topics: [
      { slug: "army-barb", title: "Army BARB Test" },
      { slug: "police-pirt", title: "Police PIRT (Initial Recruitment)" },
      { slug: "police-search", title: "Police SEARCH Assessment" },
      { slug: "firefighter-nfsat", title: "Firefighter NFSAT" },
    ],
  },
  {
    slug: "maritime-aviation",
    title: "Maritime & Aviation",
    short: "PPL Air Law & Met, RYA Day Skipper, ATPL basics",
    description:
      "Practice for pilots and skippers — PPL Air Law, PPL Meteorology, RYA Day Skipper Theory and ATPL Basics for those starting their commercial pilot path.",
    icon: "Plane",
    accent: "success",
    heroImage: heroMaritimeAviation,
    topics: [
      { slug: "ppl-air-law", title: "PPL Air Law" },
      { slug: "ppl-meteorology", title: "PPL Meteorology" },
      { slug: "rya-day-skipper", title: "RYA Day Skipper Theory" },
      { slug: "atpl-basics", title: "ATPL Basics Practice" },
    ],
  },
  {
    slug: "government",
    title: "Government & Civil Service",
    short: "CSJT, Civil Service Verbal & Numerical, Border Force",
    description:
      "Free practice for UK Civil Service and government recruitment — Civil Service Judgement Test (CSJT), Verbal and Numerical Reasoning and the Border Force entry test.",
    icon: "Landmark",
    accent: "gold",
    heroImage: heroGovernment,
    topics: [
      { slug: "csjt", title: "Civil Service Judgement Test (CSJT)" },
      { slug: "cs-verbal", title: "Civil Service Verbal Reasoning" },
      { slug: "cs-numerical", title: "Civil Service Numerical Reasoning" },
      { slug: "border-force", title: "Border Force Recruitment Test" },
    ],
  },
  {
    slug: "hgv-logistics",
    title: "HGV / LGV & Logistics",
    short: "Driver CPC, ADR, Forklift & Transport Manager CPC",
    description:
      "Free practice for UK professional driving and logistics qualifications — Driver CPC Module 2 and Module 4, ADR dangerous goods awareness, forklift truck theory and Transport Manager CPC.",
    icon: "Truck",
    accent: "navy",
    heroImage: heroHgvLogistics,
    topics: [
      { slug: "driver-cpc-module-2", title: "Driver CPC Module 2 (Case Studies)" },
      { slug: "driver-cpc-module-4", title: "Driver CPC Module 4 (Practical Demonstration Theory)" },
      { slug: "adr-dangerous-goods", title: "ADR Dangerous Goods Awareness" },
      { slug: "forklift-theory", title: "Forklift Truck Theory (RTITB / ITSSAR)" },
      { slug: "transport-manager-cpc", title: "Transport Manager CPC Practice" },
    ],
  },
  {
    slug: "care-social-work",
    title: "Care & Social Work",
    short: "Care Certificate, Adult Social Care, Safeguarding & Medication",
    description:
      "Free practice for the UK adult social care workforce — the Care Certificate 15 standards, Level 2 Adult Social Care, Safeguarding Adults, Medication Awareness and Social Work England readiness.",
    icon: "HandHeart",
    accent: "coral",
    heroImage: heroCareSocialWork,
    topics: [
      { slug: "care-certificate", title: "Care Certificate (15 Standards)" },
      { slug: "adult-social-care", title: "Level 2 Adult Social Care" },
      { slug: "safeguarding-adults", title: "Safeguarding Adults" },
      { slug: "medication-awareness", title: "Medication Awareness in Care" },
      { slug: "social-work-england", title: "Social Work England Readiness" },
    ],
  },
  {
    slug: "beauty-wellbeing",
    title: "Beauty & Wellbeing",
    short: "Beauty Therapy, Barbering, Nails, Hair & Infection Control",
    description:
      "Free practice for UK beauty, hair and wellbeing qualifications — Level 2 Beauty Therapy, Barbering, Nail Technician, Hairdressing theory and Infection Control for beauty professionals.",
    icon: "Scissors",
    accent: "gold",
    heroImage: heroBeautyWellbeing,
    topics: [
      { slug: "beauty-therapy-level-2", title: "Level 2 Beauty Therapy Theory" },
      { slug: "barbering-level-2", title: "Barbering Level 2 Theory" },
      { slug: "nail-technician", title: "Nail Technician Theory" },
      { slug: "infection-control-beauty", title: "Infection Control for Beauty" },
      { slug: "hairdressing-level-2", title: "Hairdressing Level 2 Theory" },
    ],
  },
  {
    slug: "retail-customer-service",
    title: "Retail & Customer Service",
    short: "Retail Level 2, Travel Agent, Customer Service & Age-Restricted Sales",
    description:
      "Free practice for UK retail and customer-facing roles — Retail Level 2 Knowledge, ABTA travel agent practice, Customer Service Level 2, visual merchandising and age-restricted sales (Challenge 25).",
    icon: "ShoppingBag",
    accent: "success",
    heroImage: heroRetailCustomerService,
    topics: [
      { slug: "retail-level-2", title: "Retail Level 2 Knowledge" },
      { slug: "abta-travel-agent", title: "ABTA Travel Agent Practice" },
      { slug: "customer-service-level-2", title: "Customer Service Level 2" },
      { slug: "visual-merchandising", title: "Visual Merchandising Basics" },
      { slug: "age-restricted-sales", title: "Age-Restricted Sales (Challenge 25)" },
    ],
  },
  {
    slug: "animal-care",
    title: "Animal Care & Veterinary",
    short: "RVN, Dog Grooming, Animal First Aid, Behaviour & Equine Care",
    description:
      "Free practice for UK animal care and veterinary qualifications — RVN pre-registration theory, dog grooming, animal first aid, canine behaviour basics and equine care.",
    icon: "PawPrint",
    accent: "success",
    heroImage: heroAnimalCare,
    topics: [
      { slug: "rvn-pre-registration", title: "RVN Pre-Registration Theory" },
      { slug: "dog-grooming-theory", title: "Dog Grooming Theory" },
      { slug: "animal-first-aid", title: "Animal First Aid" },
      { slug: "canine-behaviour", title: "Canine Behaviour Basics" },
      { slug: "equine-care", title: "Equine Care Theory" },
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
