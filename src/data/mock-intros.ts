/**
 * Per-topic intro content shown on every mock test start page
 * (above the "More mock tests" grid). Keyed by topic slug.
 *
 * If a topic isn't listed here, getMockIntro() falls back to a
 * sensible auto-generated default using the topic title.
 */

export type MockIntroFaq = { q: string; a: string };

export type MockIntro = {
  /** 150–250 words explaining what this mock covers. */
  description: string;
  /** 3–5 short bullets — topics included in this mock. */
  topics: string[];
  /** Who this mock is for. */
  whoFor: string;
  /** Optional FAQ (4–6 entries) — only for major categories. */
  faqs?: MockIntroFaq[];
};

const GENERIC_FAQS: MockIntroFaq[] = [
  {
    q: "Are these official questions?",
    a: "No. UK Test Hub is independent and not affiliated with any awarding body or exam provider. Our questions are practice-style and designed to reflect the format and difficulty of the real assessment.",
  },
  {
    q: "Is this mock free?",
    a: "Yes — every mock on UK Test Hub is completely free, with no signup required to start.",
  },
  {
    q: "How many questions are there?",
    a: "Most of our mocks contain 24 questions, sat against a typical test-day time limit. The exact count and pass mark are shown in the chips above the Practice/Exam buttons.",
  },
  {
    q: "Can I retake it?",
    a: "Yes, as many times as you like. Each retake reshuffles the question order so you don't simply memorise positions.",
  },
];

export const MOCK_INTROS: Record<string, MockIntro> = {
  "driving-theory": {
    description:
      "This Driving Theory mock test is exam-style practice covering the breadth of the car theory syllabus — road signs, hazard awareness, safety margins, motorway rules, vulnerable road users, alertness, attitude and vehicle handling. Questions use a multiple-choice format similar to the test format, with one correct answer per question and clear, plain-English explanations. Use it to find out which topics you've nailed and which still need work before you book your test. Sit it in Practice mode for instant explanations after each question, or in Exam mode for a timed dry run that helps you get used to working under pressure. Afterwards, review every explanation carefully — especially the questions you answered incorrectly — and come back to the topic-by-topic mini-quizzes if you want focused revision before retrying the full mock.",
    topics: [
      "Road signs, signals and markings",
      "Hazard awareness and safety margins",
      "Motorway and dual carriageway rules",
      "Vulnerable road users (cyclists, pedestrians, motorbikes)",
      "Vehicle handling, loading and documents",
    ],
    whoFor:
      "Anyone preparing for the car driving theory test, plus learners revising for their first attempt or retaking after a near miss.",
    faqs: [
      {
        q: "What is the pass mark for the real theory test?",
        a: "You need 43 out of 50 multiple-choice questions, then pass the separate hazard perception clip section in the same sitting.",
      },
      {
        q: "How close is this to the real theory test?",
        a: "This is independent practice material designed to reflect common theory test topics and a similar multiple-choice format. The actual exam questions are confidential — we don't reproduce them.",
      },
      {
        q: "How long should I revise before booking my test?",
        a: "Most learners sit the test after 20–30 hours of focused revision, including the Highway Code and several full-length mocks at 86%+.",
      },
      {
        q: "Does this cover the hazard perception part?",
        a: "No — hazard perception uses video clips. For that, use the dedicated Hazard Perception topic on UK Test Hub.",
      },
    ],
  },

  "life-in-the-uk": {
    description:
      "This Life in the UK mock test gives you a full 24-question, timed dry run of the format used by the Home Office Life in the UK Test, which is required for ILR and British citizenship applications. The questions cover British history, traditions, government, law, and everyday life — drawn from the same syllabus as the official handbook. Use Practice mode to get an explanation and reference after every question so you can build up your knowledge as you go, or use Exam mode to find out whether you are ready to pass the 75% threshold on test day. Pay particular attention to the questions you get wrong and the date-heavy history sections, as those are where most candidates lose marks.",
    topics: [
      "British history (Roman Britain to modern day)",
      "Government, law and the role of the monarch",
      "Traditions, sport and culture across the UK",
      "Religion, festivals and national days",
      "Rights, responsibilities and everyday UK life",
    ],
    whoFor:
      "Anyone applying for Indefinite Leave to Remain (ILR) or British citizenship who must pass the official Life in the UK Test.",
    faqs: [
      {
        q: "What is the pass mark for the real Life in the UK test?",
        a: "You need 75% — 18 out of 24 questions — within 45 minutes.",
      },
      {
        q: "Where can I take the official test?",
        a: "Only at an approved Home Office test centre. You must book it on the GOV.UK website and bring valid ID matching your booking exactly.",
      },
      {
        q: "How much does the real test cost?",
        a: "The current Home Office fee is £50, which you pay at the time of booking.",
      },
      {
        q: "What if I fail?",
        a: "You must wait 7 days before rebooking, and pay the £50 fee again each attempt. There is no cap on the number of attempts.",
      },
    ],
  },

  "cscs-operative": {
    description:
      "This CSCS Operative mock test is realistic, official-style practice for the CITB Health, Safety & Environment Test required for the green Labourer / Operative CSCS card. It uses a 50-question, multiple-choice format with a similar balance of topics to the real assessment: general responsibilities, health and welfare, working environment, plant and equipment, and high-risk activities. Use Practice mode to learn as you go, with an explanation after each question, or Exam mode for a fully timed run-through that helps simulate the conditions at a Pearson VUE centre. Aim for a clear margin above the pass mark before booking your real test — a comfortable practice score is a useful way to track your readiness and build test-day confidence.",
    topics: [
      "General health, safety and welfare responsibilities",
      "Manual handling and working at height",
      "Personal protective equipment (PPE) and signs",
      "Hazardous substances, fire and electrical safety",
      "Site-specific risks: plant, vehicles and excavations",
    ],
    whoFor:
      "Construction site labourers, operatives and apprentices preparing for the CITB HS&E test to get a green CSCS card.",
    faqs: [
      {
        q: "What is the pass mark?",
        a: "You need 45 out of 50 — 90% — in 45 minutes to pass the real CITB HS&E test.",
      },
      {
        q: "How much does the real test cost?",
        a: "The current CITB fee is £22.50. UK Test Hub mocks are free.",
      },
      {
        q: "Where do I sit the real test?",
        a: "At a Pearson VUE test centre. You book it through the CITB website and bring photo ID on the day.",
      },
      {
        q: "Is this the same as the Managers & Professionals test?",
        a: "No — that uses different scenario-based questions. We have a separate CSCS Gold / Supervisor mock for that.",
      },
    ],
  },

  seru: {
    description:
      "This SERU mock test helps you prepare for the Safety, Equality and Regulatory Understanding assessment that all new TfL private hire driver applicants must pass before getting their licence. The questions reflect the structure and difficulty of the live SERU assessment at a TfL-approved centre — short scenarios on safeguarding, equality, passenger experience, regulations, road safety and London-specific licensing rules. Use Practice mode to learn as you go, with explanations and references to TfL guidance after each question, or Exam mode for a timed 24-question dry run. Most candidates need several practice sittings at 80%+ before they're ready to book the real assessment.",
    topics: [
      "Safeguarding and child protection",
      "Equality Act duties and assistance dogs",
      "Customer service and disability awareness",
      "TfL licensing and driver conduct rules",
      "Road safety, fitness to drive and incident reporting",
    ],
    whoFor:
      "Applicants for a TfL London Private Hire Driver Licence who must pass the SERU assessment before being licensed.",
    faqs: [
      {
        q: "What is the SERU pass mark?",
        a: "Candidates need to demonstrate competence across all subject areas — the SERU is a competency assessment rather than a simple percentage, and you must pass each module.",
      },
      {
        q: "How long does the real SERU take?",
        a: "The Transport for London (TfL) SERU exam has a strict time limit of 45 minutes. However, you should expect to be at the testing centre for about 50 to 60 minutes in total, as the session includes a brief introduction and a few practice questions before the timer officially starts.",
      },
      {
        q: "What do I do if I fail SERU?",
        a: "You can re-sit, but TfL charges a re-test fee each attempt and may impose a waiting period. Use these mocks until you're consistently scoring well before rebooking.",
      },
      {
        q: "Is SERU the same as Topographical?",
        a: "No — Topographical tests map reading and London geography. SERU tests safety, equality and regulation knowledge. Most applicants must pass both.",
      },
    ],
  },

  topographical: {
    description:
      "This Topographical mock test helps you prepare for the Topographical Skills Assessment that all new London private hire drivers must pass. The questions cover similar areas to the live test at a TfL-approved centre — reading an A–Z style London street map, identifying postcode districts, planning sensible routes that avoid restricted roads, recognising major landmarks and using a compass. Use Practice mode to learn each question type as you go, with explanations after every question, or Exam mode for a timed run that helps simulate test-day conditions. Pair these mocks with hands-on time using a paper London A–Z — that's the single biggest factor in a first-time pass.",
    topics: [
      "Reading a London street atlas (A–Z style)",
      "Postcode districts: EC, WC, SW, E and beyond",
      "Route planning between two London addresses",
      "Major landmarks, stations, airports and bridges",
      "Compass direction and map keys",
    ],
    whoFor:
      "Applicants for a TfL London Private Hire Driver Licence preparing for the Topographical Skills Assessment.",
    faqs: [
      {
        q: "What is the Topographical pass mark?",
        a: "Most TfL-approved centres set a 60% overall pass mark, and you must pass each section. Always check the exact mark with your chosen centre.",
      },
      {
        q: "How long is the real Topographical test?",
        a: "Around 75 minutes for five sections, including six full route-planning questions.",
      },
      {
        q: "Can I use a sat nav?",
        a: "No. The assessment is specifically designed to prove you can plan and follow a route using a paper map, the A–Z index and London postcodes.",
      },
      {
        q: "Do I need to take this before SERU?",
        a: "Most applicants sit Topographical first, but the order depends on your TfL application — check your TfL email instructions.",
      },
    ],
  },

  "sia-door-supervisor": {
    description:
      "This SIA Door Supervisor mock test helps you prepare for the Level 2 Award for Working as a Door Supervisor — the qualification you need before applying for an SIA Door Supervisor licence to work in pubs, clubs, festivals and other licensed venues across England and Wales. The questions reflect the syllabus delivered by SIA-approved training providers: working in the private security industry, conflict management, physical intervention awareness, the law, terrorism awareness and door supervision-specific duties. Use Practice mode to learn as you go, or Exam mode for a timed dry run that mirrors test-day conditions at your training centre.",
    topics: [
      "Roles, responsibilities and the SIA licensing regime",
      "Conflict management and de-escalation",
      "Physical intervention skills and the law on use of force",
      "Drugs, alcohol, search procedures and incident response",
      "Counter-terrorism awareness (ACT) and emergency procedures",
    ],
    whoFor:
      "Anyone studying for the Level 2 Award for Working as a Door Supervisor before applying for an SIA Door Supervisor licence.",
    faqs: [
      {
        q: "What is the SIA Door Supervisor pass mark?",
        a: "Each unit is assessed separately, typically with a 70% pass mark per multiple-choice paper. You must pass every unit.",
      },
      {
        q: "How much does the SIA licence cost?",
        a: "The SIA licence application fee is £190 (2025), in addition to your training course fees and a DBS check.",
      },
      {
        q: "How long is the licence valid?",
        a: "Three years, after which you must complete a top-up course and reapply.",
      },
      {
        q: "Can I work as a security guard with this licence?",
        a: "Yes — a Door Supervisor licence covers both door supervision and security guarding roles.",
      },
    ],
  },

  "nhs-numeracy": {
    description:
      "This NHS Numeracy mock test helps you prepare for the numeracy elements that appear in NHS recruitment, nursing apprenticeship interviews and pre-registration assessments. The questions mirror the format used in NHS testing: drug calculations, dosage and infusion rate problems, conversions between units, percentages, ratios and simple data interpretation. Use Practice mode to see worked solutions after every question, or Exam mode for a timed run that mirrors what you'll face in an NHS assessment. Bring a calculator if the role you're applying for allows one — but always check the rules for your specific assessment.",
    topics: [
      "Drug dose and infusion rate calculations",
      "Unit conversions (mg ↔ g, mL ↔ L)",
      "Percentages, ratios and rounding",
      "Reading charts, graphs and observation data",
      "Time, fluid balance and basic statistics",
    ],
    whoFor:
      "Anyone preparing for an NHS recruitment numeracy test, including nursing, AHP and healthcare assistant applicants.",
    faqs: [
      {
        q: "What is the NHS numeracy pass mark?",
        a: "It varies by trust and role, but most NHS numeracy assessments require around 75–80%. Always check the brief for your specific role.",
      },
      {
        q: "Can I use a calculator?",
        a: "Some trusts allow a basic calculator; others require mental and written calculation only. The mocks let you practise both ways.",
      },
      {
        q: "Are these the same as the NMC CBT calculations?",
        a: "Similar in style, but NMC CBT has its own dedicated section. We have a separate NMC CBT topic for international nurses.",
      },
      {
        q: "How long should I spend per question?",
        a: "Aim for around 1 minute per question on average — fast enough to finish, slow enough to double-check your decimal places.",
      },
    ],
  },

  "comptia-a-plus": {
    description:
      "This CompTIA A+ mock test helps you prepare for the current V15 exams (Core 1 — 220-1201 and Core 2 — 220-1202). The questions cover the full CompTIA A+ syllabus: mobile devices, networking, hardware, virtualisation and cloud computing, hardware and network troubleshooting, operating systems, security, software troubleshooting and operational procedures. Question styles include multiple choice, multi-response and short scenarios that mirror the performance-based items in the real exams. Use Practice mode to learn each domain as you go, or Exam mode for a timed dry run. Use these mocks to find out which Core 1 and Core 2 domains you're weakest in before booking your Pearson VUE exam.",
    topics: [
      "Core 1: Mobile devices, networking and hardware",
      "Core 1: Virtualisation, cloud and hardware troubleshooting",
      "Core 2: Operating systems (Windows, macOS, Linux)",
      "Core 2: Security, software troubleshooting and operational procedures",
      "Scenario-style questions mirroring performance-based items",
    ],
    whoFor:
      "Aspiring IT support, help-desk and first-line technicians preparing for CompTIA A+ Core 1 (220-1201) and Core 2 (220-1202).",
    faqs: [
      {
        q: "What is the CompTIA A+ pass mark?",
        a: "Core 1 (220-1201): 675 out of 900. Core 2 (220-1202): 700 out of 900. You must pass both exams to be awarded the A+ certification.",
      },
      {
        q: "How much do the exams cost in the UK?",
        a: "Each Core exam is around £253 (2025 pricing at Pearson VUE in the UK). Both exams together cost roughly £500.",
      },
      {
        q: "How long are the real exams?",
        a: "Up to 90 questions in 90 minutes per Core exam, including drag-and-drop and performance-based items.",
      },
      {
        q: "How long should I revise?",
        a: "Most candidates need 80–150 hours of structured study and several full-length mocks at 80%+ before booking.",
      },
    ],
  },

  "eleven-plus": {
    description:
      "This 11+ mock test helps your child prepare for the 11+ exam used by grammar schools and many independent schools across the UK. The questions cover the four 11+ reasoning areas — verbal reasoning, non-verbal reasoning, English and maths — in the multiple-choice format used by GL Assessment and CEM-style papers. Use Practice mode for instant feedback and explanations after every question, ideal for at-home learning, or Exam mode for a timed dry run that mirrors test-day pressure. Sit several mocks across different weeks to build stamina, then review every mistake together to spot recurring patterns.",
    topics: [
      "Verbal reasoning (codes, analogies, word puzzles)",
      "Non-verbal reasoning (shapes, patterns, rotations)",
      "Maths (arithmetic, fractions, problem solving)",
      "English (comprehension, grammar, vocabulary)",
      "Timed multi-choice practice for GL/CEM-style papers",
    ],
    whoFor:
      "Year 5 and Year 6 pupils preparing for grammar school entrance or independent school 11+ assessments.",
    faqs: [
      {
        q: "What is the 11+ pass mark?",
        a: "There is no fixed national pass mark. Each grammar school sets a standardised threshold each year — typically around 121 on a scaled score, but it varies by region.",
      },
      {
        q: "GL or CEM style?",
        a: "Different regions use different boards. Our mocks include both styles so your child gets balanced practice. Check with your target school which format they use.",
      },
      {
        q: "How long should we revise for?",
        a: "Most families start structured 11+ prep 12–18 months before the test. The closer to the date, the more value full timed mocks add.",
      },
      {
        q: "Is the real test on paper or computer?",
        a: "Most grammar schools still use paper tests; some independent schools have moved to computer-based assessment. Practising on screen is still useful — comprehension is the same skill either way.",
      },
    ],
  },
};

/**
 * Returns the intro for a topic, or a sensible auto-generated default
 * if the topic isn't in MOCK_INTROS.
 */
export function getMockIntro(topicSlug: string, topicTitle: string): MockIntro {
  const found = MOCK_INTROS[topicSlug];
  if (found) return found;

  return {
    description: `This ${topicTitle} mock test gives you realistic, exam-style practice in a multiple-choice format similar to the real assessment. It draws from across the syllabus so you can spot which areas you're strong in and which still need more work before test day. Use Practice mode for instant feedback and explanations after every question, or Exam mode for a timed dry run that helps simulate test-day conditions. After finishing, review every explanation carefully — especially the questions you answered incorrectly — and come back to retake the mock until you're consistently scoring well above the pass mark. UK Test Hub is an independent practice platform and is not affiliated with any official exam body, government department, regulator or test provider. All questions are for practice and revision purposes only.`,
    topics: [
      "Core syllabus topics in multiple-choice format",
      "Realistic test-style wording and difficulty",
      "Explanations after every question (Practice mode)",
      "Timed sitting that mirrors test day (Exam mode)",
      "Mixed difficulty so weak areas surface quickly",
    ],
    whoFor: `Anyone preparing for the ${topicTitle} assessment and looking for free, realistic mock practice before booking the real exam.`,
    faqs: GENERIC_FAQS,
  };
}
