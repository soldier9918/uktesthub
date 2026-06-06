// Short, unique guide-card subtitles shown on category pages.
// Falls back to a generic line if a slug is missing.

export const GUIDE_DESCRIPTIONS: Record<string, string> = {
  // Driving & Transport
  "driving-theory":
    "DVSA theory format, 50-question pass mark, hazard perception and study plan.",
  "hazard-perception":
    "DVSA scoring window, developing hazards, cheat-flag rule and click technique.",
  "road-signs":
    "Warning, regulatory and informational signs explained with revision tips.",
  "motorcycle-theory":
    "Bike-specific theory and hazard perception with rider safety scenarios.",

  // UK Citizenship & Life
  "life-in-the-uk":
    "Handbook chapters, 75% pass mark, key dates and Home Office test-day rules.",
  "british-citizenship":
    "Citizenship eligibility, ILR routes and the knowledge expected of new citizens.",
  "uk-laws-rights":
    "UK laws, civic rights, responsibilities and everyday legal essentials.",
  "uk-geography":
    "Countries, capitals, regions, landmarks and physical geography of the UK.",

  // English
  ielts:
    "IELTS Listening, Reading, Writing and Speaking format, band scores and timing.",
  esol:
    "ESOL skills practice across reading, writing, speaking and listening levels.",
  toefl:
    "TOEFL iBT structure, integrated tasks, scoring and timing strategy.",
  grammar:
    "Core grammar rules, vocabulary building and common UK English mistakes.",

  // Education
  "eleven-plus":
    "11+ verbal, non-verbal, English and maths reasoning with grammar-school tips.",
  "gcse-maths":
    "GCSE Maths topics, number, algebra, geometry, statistics and revision plan.",
  "gcse-english":
    "GCSE English reading, writing, language analysis and exam paper strategy.",
  sats:
    "KS1 and KS2 SATs format, reading, SPaG and maths reasoning preparation.",

  // Career
  numerical:
    "Numerical reasoning techniques, percentages, ratios, tables and graph reading.",
  verbal:
    "Verbal reasoning passages, true/false/cannot say and inference technique.",
  logical:
    "Inductive, deductive and abstract reasoning patterns with worked examples.",
  sjt:
    "Situational Judgement scenarios, ranking, most/least effective and rationale.",

  // Workplace Compliance
  "food-hygiene":
    "Food safety, hazards, temperatures, allergens and Level 2 exam essentials.",
  "first-aid":
    "Primary survey, CPR, recovery position and workplace first aid scenarios.",
  "fire-safety":
    "Fire triangle, extinguishers, evacuation and workplace fire-safety duties.",
  "manual-handling":
    "Safe lifting technique, TILE, posture and injury prevention essentials.",
  "health-safety-awareness":
    "Workplace risk, PPE, RIDDOR and Health & Safety at Work Act basics.",
  "gdpr-awareness":
    "Data protection principles, lawful bases, breaches and individual rights.",

  // Health & Safety
  "workplace-health-safety-awareness":
    "HSWA 1974, risk assessment, RIDDOR, COSHH and accident reporting essentials.",

  // NHS
  "nhs-numeracy":
    "Drug calculations, conversions, percentages and NHS-style data interpretation.",
  "nhs-literacy":
    "NHS literacy comprehension, written communication and report-style questions.",
  "nhs-values":
    "NHS values-based interviews, Constitution principles and behavioural examples.",
  "nmc-cbt":
    "NMC CBT format, Part A theory, Part B numeracy and English nurse calculations.",
  "nhs-psychometric-tests":
    "NHS aptitude, verbal, numerical and behavioural assessments for recruitment.",
  "nhs-situational-judgement-test":
    "NHS SJT scenarios, patient care priorities and professional decision-making.",

  // Taxi & Private Hire
  seru:
    "TfL safety, equality and regulatory understanding explained with missing-word examples.",
  topographical:
    "Map reading, route planning, London landmarks and common topographical mistakes.",
  "phv-licence":
    "PHV licensing rules, driver responsibilities, bookings, badges and operator standards.",
  "ph-safety-equality":
    "Safety duties, equality rules, accessibility scenarios and regulatory awareness practice.",
  "ph-safeguarding":
    "Safeguarding red flags, vulnerable passenger scenarios and correct reporting actions.",
  "ph-english":
    "TfL English language expectations, reading, writing, speaking and listening preparation.",
  "ph-speaking-listening":
    "Practical speaking and listening scenarios for driver-passenger communication.",
  "congestion-charge":
    "London Congestion Charge rules, operating times, exemptions and driver responsibilities.",
  ulez:
    "ULEZ standards, charge rules, exemptions and common London compliance questions.",
  "ph-dbs-licensing":
    "DBS checks, fit-and-proper requirements, renewal rules and licensing conditions.",
  "ph-badge-rules":
    "PHV badge display, driver identification, licence checks and TfL compliance rules.",
  "ph-assistance-dogs":
    "Assistance dog duties, wheelchair support, exemptions and Equality Act scenarios.",
  "ph-passenger-safety":
    "Professional conduct, safe journeys, complaints, incidents and passenger care.",
  "ph-hmrc-tax-check":
    "HMRC tax check rules, renewal codes, deadlines and PHV licensing requirements.",
  "ph-london-regulations":
    "London PHV regulations, bookings, operators, driver conduct and TfL enforcement rules.",

  // Security
  "sia-door-supervisor":
    "Door supervisor roles, conflict management, physical intervention and SIA licensing.",
  "sia-cctv":
    "CCTV operator duties, codes of practice, data handling and surveillance law.",
  "sia-close-protection":
    "Close protection threat assessment, reconnaissance and personal safety practice.",
  "sia-top-up":
    "Door Supervisor top-up content — terrorism awareness, first aid and physical intervention.",

  // Hospitality
  "aplh-personal-licence":
    "Licensing Act 2003, four objectives, designated premises and personal licence duties.",
  "allergen-awareness":
    "14 allergens, cross-contamination, Natasha's Law and customer-facing duties.",
  "haccp-level-2":
    "HACCP principles, hazards, critical control points and food production checks.",
  "customer-service":
    "Service standards, complaint handling and communication skills for UK roles.",

  // Construction
  "cscs-operative":
    "CITB HS&E test for the green operative card — site safety and welfare basics.",
  "cscs-gold":
    "Supervisor-level CITB HS&E content — leadership, risk and behavioural safety.",
  "citb-hse":
    "Full CITB Health, Safety & Environment Test format with sample question topics.",
  "ipaf-pasma":
    "Working at height with MEWPs and mobile towers — IPAF and PASMA essentials.",
  "sssts-practice-test":
    "Site Supervisor Safety Training Scheme — supervisor duties and CDM essentials.",
  "smsts-practice-test":
    "Site Management Safety Training Scheme — H&S law, planning and site control.",

  // Finance
  "aat-bookkeeping":
    "Double-entry, day books, control accounts and AAT Level 2 exam-style practice.",
  "acca-foundations":
    "ACCA Foundations (FIA) accounting, business and financial reporting basics.",
  "cfa-aptitude":
    "CFA-style numerical reasoning, ratios and financial data interpretation drills.",
  "financial-awareness":
    "Personal finance, banking, tax, credit and everyday money management quiz.",

  // IT & Tech
  "comptia-a-plus":
    "CompTIA A+ Core 1 and Core 2 hardware, OS, security and troubleshooting topics.",
  "itil-4":
    "ITIL 4 Foundation service value system, guiding principles and key practices.",

  // Healthcare Entry
  ucat:
    "UCAT timing, verbal reasoning, decision making, quantitative reasoning and SJT strategy.",
  bmat:
    "Legacy biomedical admissions-style questions for historical practice and revision.",
  oet:
    "Healthcare English reading, listening, writing and speaking practice for clinical settings.",
  "plab-1":
    "UK clinical single-best-answer practice with NICE-style explanations and exam timing tips.",

  // Teaching
  "qts-numeracy":
    "Legacy teacher-training numeracy practice covering mental maths, data and percentages.",
  "qts-literacy":
    "Legacy literacy practice covering grammar, spelling, punctuation and comprehension.",
  "professional-skills-teachers":
    "Teacher professionalism, classroom judgement, communication and school scenarios.",
  "safeguarding-schools":
    "Safeguarding duties, reporting concerns, pupil welfare and school safety scenarios.",

  // Legal
  "sqe1-flk1":
    "SQE1 FLK1 multiple-choice practice on constitutional, contract, tort and criminal law.",
  "sqe1-flk2":
    "SQE1 FLK2 multiple-choice practice on property, wills, trusts and business law.",
  lnat:
    "LNAT Section A multiple-choice argument analysis and reading comprehension practice.",
  "uk-legal-system":
    "UK courts, sources of law, legal personnel and constitutional basics quiz.",

  // Military & Emergency
  "army-barb":
    "British Army BARB Test format — reasoning, sequences and selection-day timing.",
  "police-pirt":
    "Police initial recruitment test — numerical, verbal and behavioural exercises.",
  "police-search":
    "Police SEARCH Assessment — written, interactive and competency-based stages.",
  "firefighter-nfsat":
    "Firefighter NFSAT working with numbers, understanding information and situational test.",

  // Maritime & Aviation
  "ppl-air-law":
    "PPL Air Law — rules of the air, airspace, licensing and aviation regulation.",
  "ppl-meteorology":
    "PPL Meteorology — pressure systems, clouds, fronts and aviation weather hazards.",
  "rya-day-skipper":
    "RYA Day Skipper Theory — navigation, tides, pilotage and safety at sea.",
  "atpl-basics":
    "Foundational ATPL topics for those starting the commercial pilot training path.",

  // Government & Civil Service
  csjt:
    "Civil Service Judgement Test scenarios, behaviours and Success Profiles practice.",
  "cs-verbal":
    "Civil Service verbal reasoning passages, inference and policy-style comprehension.",
  "cs-numerical":
    "Civil Service numerical reasoning with tables, percentages and data analysis.",
  "border-force":
    "Border Force recruitment test — judgement, knowledge and behavioural questions.",

  // HGV / LGV & Logistics
  "hgv-theory-test":
    "HGV theory multiple choice and hazard perception with vehicle-specific topics.",
  "lgv-theory-test":
    "LGV theory format, case studies and large vehicle safety and handling rules.",
  "pcv-theory-test":
    "PCV theory for bus and coach drivers — passenger safety, accessibility and rules.",
  "driver-cpc-module-1":
    "Driver CPC Module 1 — initial theory and hazard perception for professional drivers.",
  "driver-cpc-module-2":
    "Driver CPC Module 2 case studies covering real-world driving and compliance.",
  "driver-cpc-module-4":
    "Driver CPC Module 4 practical demonstration theory — vehicle safety and checks.",
  "driver-cpc":
    "Driver CPC overview — modules, periodic training and professional driver duties.",
  "adr-dangerous-goods":
    "ADR dangerous goods awareness — classification, packaging and emergency action.",
  "adr-core-module-practice":
    "ADR core module — drivers' duties, documentation and general dangerous goods law.",
  "adr-tanks-practice":
    "ADR tanks — filling, surge, static electricity and tanker-specific safety rules.",
  "adr-packages-practice":
    "ADR packages — packaging types, segregation, labelling and loading procedures.",
  "forklift-flt-theory-test":
    "Forklift theory — stability, load handling, attachments and site safety basics.",
  "transport-manager-cpc-road-haulage":
    "Transport Manager CPC road haulage — operator licensing, finance and compliance.",
  "transport-manager-cpc-passenger-transport":
    "Transport Manager CPC passenger transport — PSV licensing, drivers' hours and duties.",
  "d1-minibus-theory-test":
    "D1 minibus theory — passenger safety, vehicle limits and category-specific rules.",

  // Care & Social Work
  "care-certificate":
    "Care Certificate 15 standards — duty of care, safeguarding and person-centred care.",
  "adult-social-care":
    "Level 2 Adult Social Care — values, communication, safeguarding and wellbeing.",
  "safeguarding-adults":
    "Adult safeguarding — types of abuse, indicators, reporting and Mental Capacity Act.",
  "medication-awareness":
    "Safe medication handling in care — administration, storage, records and errors.",
  "social-work-england":
    "Social Work England readiness — professional standards and ethical practice.",

  // Beauty & Wellbeing
  "beauty-therapy-level-2":
    "Level 2 beauty therapy theory — anatomy, contraindications and treatment safety.",
  "barbering-level-2":
    "Level 2 barbering theory — consultation, cutting, hygiene and client care.",
  "nail-technician":
    "Nail technician theory — anatomy, products, contraindications and sanitation.",
  "infection-control-beauty":
    "Infection control for beauty — pathogens, sterilisation and PPE practice.",
  "hairdressing-level-2":
    "Level 2 hairdressing theory — consultation, chemistry, cutting and colour basics.",

  // Retail & Customer Service
  "retail-level-2":
    "Retail Level 2 — customer service, sales, stock, legal duties and team work.",
  "abta-travel-agent":
    "ABTA travel agent knowledge — bookings, regulations, destinations and complaints.",
  "customer-service-level-2":
    "Customer service Level 2 — communication, complaints and service standards.",
  "visual-merchandising":
    "Visual merchandising basics — displays, layout, signage and customer flow.",
  "age-restricted-sales":
    "Age-restricted sales and Challenge 25 — ID checks, refusals and legal duties.",

  // Animal Care
  "rvn-pre-registration":
    "RVN pre-registration theory — anatomy, nursing care, anaesthesia and pharmacy.",
  "dog-grooming-theory":
    "Dog grooming theory — coat types, handling, equipment and breed standards.",
  "animal-first-aid":
    "Animal first aid — primary survey, CPR, wounds, shock and emergency response.",
  "canine-behaviour":
    "Canine behaviour basics — body language, socialisation and behavioural triggers.",
  "equine-care":
    "Equine care theory — feeding, husbandry, stable management and welfare basics.",

  // Graduate & Business Admissions
  "gre-practice":
    "GRE verbal, quantitative and analytical writing practice with timing strategy.",
  "gmat-practice":
    "GMAT problem solving, critical reasoning and data insights practice questions.",

  // University Admissions
  "ucas-application-knowledge":
    "UCAS application process — deadlines, choices, references, offers and Clearing.",

  // Cloud & Cyber
  "aws-cloud-practitioner":
    "AWS Cloud Practitioner — core services, pricing, security and the well-architected basics.",
  "microsoft-fundamentals":
    "AZ-900 and MS-900 — cloud concepts, Azure services and Microsoft 365 fundamentals.",
  "cyber-awareness":
    "Cyber security awareness — phishing, passwords, malware and safe working practice.",

  // Fun & Viral
  daily:
    "Daily general knowledge quiz — British trivia, geography, history and culture.",
  "how-british":
    "Light-hearted Britishness quiz — culture, customs and quirks of UK life.",
};

export const getGuideDescription = (slug: string): string =>
  GUIDE_DESCRIPTIONS[slug] ?? "Format, tips and how to pass first time";
