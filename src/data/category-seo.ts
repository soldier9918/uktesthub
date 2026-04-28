// Long-form SEO content + FAQs for each category page.
// Kept separate from categories.ts to keep that data lean; the category route
// merges these by slug. Content is UK English, ~600-900 words per category.

export type Faq = { q: string; a: string };
export type SeoSection = { heading: string; body: string[] };
export type CategorySeo = {
  title: string;
  description: string;
  intro: string[];
  sections: SeoSection[];
  faqs: Faq[];
  related?: { label: string; href: string }[];
};

export const categorySeo: Record<string, CategorySeo> = {
  driving: {
    title: "Driving Theory Practice Test UK 2026 | Mock Exams & Questions",
    description:
      "Free UK Driving Theory practice tests for 2026. Realistic DVSA-style questions, hazard perception, road signs and motorcycle theory with full explanations.",
    intro: [
      "Passing the UK Driving Theory Test on the first attempt takes more than memorising answers. The DVSA exam is split into 50 multiple-choice questions and a hazard perception clip section, and you need to do well on both to get your provisional pass certificate. Our free Driving Theory practice tests mirror the real exam format so you can practise with confidence.",
      "Whether you're booking your first test, retaking after a near miss, or preparing for the Motorcycle Theory or Road Signs Test, you'll find unlimited mock exams, instant scoring and detailed explanations for every question. All questions are updated for 2026 and reflect the latest Highway Code revisions.",
    ],
    sections: [
      {
        heading: "What you'll learn in our driving theory tests",
        body: [
          "Each mock paper covers the full DVSA syllabus: alertness, attitude, safety and your vehicle, safety margins, hazard awareness, vulnerable road users, other types of vehicle, vehicle handling, motorway rules, rules of the road, road and traffic signs, documents, accidents, and vehicle loading. Questions are written in plain UK English and follow the same multi-choice style you'll see on test day.",
          "The hazard perception practice helps you spot developing hazards earlier, while the road signs quizzes drill the most commonly misidentified signs. If you're a learner motorcyclist, the dedicated Motorcycle Theory section covers gear, lifesaver checks, and CBT-relevant content.",
        ],
      },
      {
        heading: "Tips to pass the UK Driving Theory Test first time",
        body: [
          "Read each question twice. The DVSA loves to test your attention with subtle wording like 'should' versus 'must'. Don't assume — read the question and every option fully before answering.",
          "Practise in timed mocks. The real exam gives you 57 minutes for 50 questions. Build the habit of pacing so you have time to flag and revisit tricky questions.",
          "Use a current edition of the Highway Code alongside your mocks. When you get a question wrong, read the rule the question was testing — not just the answer.",
          "Don't skip the hazard perception. Many learners pass the multiple-choice section but fail the hazard clips. Practise spotting movement at the periphery and clicking as soon as a hazard begins to develop, not when it's already obvious.",
        ],
      },
      {
        heading: "Why practice tests work",
        body: [
          "Active recall — testing yourself rather than re-reading notes — is one of the most evidence-backed study techniques. Repeated mock papers expose gaps you didn't know you had, and instant feedback rewires your memory faster than passive revision.",
          "Mocks also reduce exam anxiety. The first time you see a real DVSA-style question shouldn't be at the test centre. By the time you've completed 5 to 10 mocks, the format feels familiar and you can focus on the content.",
        ],
      },
    ],
    faqs: [
      { q: "What is the UK driving theory pass mark?", a: "You need 43 out of 50 on the multiple-choice section and 44 out of 75 on the hazard perception section. You must pass both parts at the same sitting." },
      { q: "How many questions are in the UK driving theory test?", a: "There are 50 multiple-choice questions, followed by 14 hazard perception video clips containing 15 developing hazards in total." },
      { q: "How long is the UK driving theory test?", a: "You get 57 minutes for the multiple-choice section and around 20 minutes for hazard perception, plus a short optional break in between." },
      { q: "How much does the UK driving theory test cost in 2026?", a: "The DVSA fee is £23. Always book directly via gov.uk to avoid unofficial booking fees." },
      { q: "How do I prepare for hazard perception?", a: "Watch the official sample clips, then practise spotting hazards as soon as they begin to develop. Click once when you first see the hazard, then again as it becomes more serious — don't click constantly or you'll be flagged." },
      { q: "How long is a driving theory pass certificate valid?", a: "Two years. You must pass your practical driving test within two years of your theory pass, otherwise you'll have to retake the theory." },
      { q: "Can I take the theory test in another language?", a: "No. Since 2014 the DVSA test is in English (or Welsh in Wales) and voiceovers in other languages are no longer offered." },
      { q: "Are these mock tests free?", a: "Yes. Every Driving Theory, Hazard Perception, Road Signs and Motorcycle Theory mock on UK Test Hub is free to use, with no sign-up required." },
    ],
  },

  citizenship: {
    title: "Life in the UK Test Practice 2026 | Free Mock Exams & Questions",
    description:
      "Free Life in the UK Test practice for 2026. Official handbook coverage, British history, traditions and government with realistic 24-question mocks.",
    intro: [
      "The Life in the UK Test is a 45-minute, 24-question exam that you must pass to apply for British citizenship or Indefinite Leave to Remain. The questions are drawn from the official Home Office handbook, Life in the United Kingdom: A Guide for New Residents, and you need to score at least 75% — that's 18 out of 24 — to pass.",
      "Our free Life in the UK practice tests follow the official format exactly. Use them alongside the handbook to memorise dates, monarchs, traditions and the structure of UK government with confidence.",
    ],
    sections: [
      {
        heading: "What's covered in the Life in the UK Test",
        body: [
          "The handbook is divided into five chapters: The values and principles of the UK; What is the UK; A long and illustrious history; A modern, thriving society; and The UK government, the law and your role. Expect questions on Stonehenge, the Romans, the Tudors, World Wars, devolution, the monarchy, the courts and key British traditions.",
          "Some questions ask for a single fact, others ask which of two statements is true, and a few are multiple-select. Our mocks cover all four official question styles.",
        ],
      },
      {
        heading: "Tips to pass the Life in the UK Test",
        body: [
          "Read the official handbook end to end at least twice. The test only draws from this book — no outside knowledge is needed and outside knowledge will not help.",
          "Make a one-page timeline. The dates that trip people up most are 1066 (Norman conquest), 1215 (Magna Carta), 1707 (Act of Union), 1801 (UK formed) and 1928 (women got the vote on equal terms).",
          "Practise mocks in 45-minute sittings. Build the habit of moving on from any question you're not sure about and returning at the end.",
          "On test day, bring two original ID documents and arrive 30 minutes early. Late arrivals lose their fee and have to rebook.",
        ],
      },
      {
        heading: "Who needs to take the Life in the UK Test",
        body: [
          "You must take and pass the test if you are applying for Indefinite Leave to Remain (settlement) or for British citizenship by naturalisation. Children under 18 and adults over 65 are usually exempt, as are people with a long-term physical or mental condition that prevents them from taking the test.",
          "If you've already passed the test for ILR, you do not need to take it again for citizenship.",
        ],
      },
    ],
    faqs: [
      { q: "What is the Life in the UK Test pass mark?", a: "75%. You must answer at least 18 of the 24 questions correctly within the 45-minute time limit." },
      { q: "How much does the Life in the UK Test cost in 2026?", a: "The Home Office fee is £50. You can only book through the official gov.uk service." },
      { q: "How many questions are in the Life in the UK Test?", a: "24 multiple-choice questions, randomly drawn from a question bank based on the official handbook." },
      { q: "How long is the Life in the UK Test certificate valid?", a: "Indefinitely. Once you pass, you can use the certificate for both ILR and citizenship applications without retaking." },
      { q: "Do I need to memorise the entire handbook?", a: "Yes — the test only draws from the official handbook, so reading it cover to cover at least twice is essential." },
      { q: "Where can I take the Life in the UK Test?", a: "At one of around 30 approved test centres across the UK. You choose your nearest centre when booking." },
      { q: "What ID do I need for the test?", a: "Two pieces of ID: one with your photo (passport, BRP or driving licence) and one showing your current address (utility bill or bank statement, less than three months old)." },
      { q: "Can I retake the test if I fail?", a: "Yes, as many times as you need, but you must pay the £50 fee each time and wait at least seven days between attempts." },
    ],
  },

  english: {
    title: "Free IELTS, TOEFL & ESOL Practice Tests UK 2026 | UK Test Hub",
    description:
      "Free IELTS, TOEFL, ESOL and English grammar practice tests. Realistic listening, reading and writing exercises with instant marking and explanations.",
    intro: [
      "If English isn't your first language, the IELTS, TOEFL and ESOL exams open the doors to UK study, work and visas. Our free English practice tests cover IELTS Academic and General Training, TOEFL iBT-style questions, ESOL Skills for Life and a library of grammar and vocabulary drills.",
      "Whether you need a Band 6.5 for a UK university or a CEFR B1 for the spouse visa, regular practice in exam conditions is the fastest way to lift your score.",
    ],
    sections: [
      {
        heading: "What's in our English practice library",
        body: [
          "IELTS practice covers Listening (40 questions across 4 sections), Reading (40 questions, 3 passages), and Writing Task 1 and 2 prompts with model bands. TOEFL practice mirrors the iBT structure with reading passages and integrated speaking-style prompts. ESOL drills focus on everyday UK English at Entry 1, Entry 2, Entry 3, Level 1 and Level 2.",
          "The grammar section is built for learners who plateau around B1. Each set focuses on a single sticking point — present perfect versus past simple, articles, prepositions of time, conditionals — with short explanations and 10-question quizzes.",
        ],
      },
      {
        heading: "How to lift your IELTS or TOEFL score",
        body: [
          "Practise daily, even if it's only 20 minutes. Steady exposure beats weekend cram sessions for language learning.",
          "Read English news (BBC, Guardian, Reuters) every day. The IELTS and TOEFL reading passages are written in a similar register, and exposure to formal English speeds up your reading rate.",
          "Record yourself answering speaking prompts on your phone. Listening back is uncomfortable but reveals fillers, hesitation and grammar errors you don't notice in real time.",
          "For Writing Task 2, learn 5 reusable structures (problem-solution, two-sided opinion, compare-contrast) so you don't waste time planning under pressure.",
        ],
      },
      {
        heading: "Why test-style practice beats textbook study",
        body: [
          "Textbooks teach English. Mock tests teach the exam. Both matter, but candidates who only study textbooks usually under-score by a full band or level because they aren't used to the time pressure or question styles. Use mocks to expose your weak skill (often listening or writing), then drill that skill with focused exercises.",
        ],
      },
    ],
    faqs: [
      { q: "What IELTS score do I need for a UK university?", a: "Most universities ask for an overall Band 6.5 with no skill below 6.0. Top universities and competitive courses (medicine, law) often require 7.0 or 7.5." },
      { q: "What's the difference between IELTS Academic and General Training?", a: "Academic is for university and professional registration. General Training is for UK work visas, immigration and secondary school applications. The Listening and Speaking sections are identical." },
      { q: "What CEFR level do I need for a UK spouse visa?", a: "A1 for the initial visa and A2 for extension after 2.5 years. For Indefinite Leave to Remain and citizenship you need B1, plus a Life in the UK Test pass." },
      { q: "How is IELTS scored?", a: "Each of the four skills gets a band score from 0 to 9, and your overall score is the average rounded to the nearest 0.5." },
      { q: "How long is an IELTS certificate valid?", a: "Two years from the date of your test. Most UK visa categories require an in-date certificate at the point of application." },
      { q: "Can I use TOEFL for a UK visa?", a: "TOEFL is widely accepted by UK universities but is not on the Home Office Secure English Language Test (SELT) list, so for visa purposes you need IELTS for UKVI, Trinity SELT or Pearson PTE Academic UKVI." },
      { q: "Are these English tests free?", a: "Yes — every IELTS, TOEFL, ESOL and grammar practice on UK Test Hub is free, with explanations after every question." },
    ],
  },

  education: {
    title: "11+, GCSE & SATs Practice Tests 2026 | Free UK School Mocks",
    description:
      "Free 11+ Exam, GCSE Maths, GCSE English and KS1/KS2 SATs practice tests. UK curriculum-aligned questions with instant marking and worked solutions.",
    intro: [
      "From the 11+ entrance exam to GCSE finals, our free school practice tests are aligned to the UK national curriculum and the major exam boards (AQA, Edexcel, OCR, CEM and GL). Each mock is timed and gives instant feedback so children — and parents — can see exactly what to revise next.",
      "Whether you're prepping for a grammar school place, a Year 6 SATs paper, or counting down to GCSE results day, regular short mocks beat long revision marathons every time.",
    ],
    sections: [
      {
        heading: "What you'll find here",
        body: [
          "11+ practice covers verbal reasoning, non-verbal reasoning, English comprehension and maths in both GL and CEM styles. GCSE Maths drills foundation and higher tier topics including algebra, geometry, statistics and number. GCSE English questions cover language analysis, creative writing and the literature anthology. SATs practice is split into KS1 (Year 2) and KS2 (Year 6) reading, SPaG and arithmetic.",
        ],
      },
      {
        heading: "Tips for pupils and parents",
        body: [
          "Short, frequent practice beats long Sunday sessions. Aim for 20–30 minutes a day, four to five days a week.",
          "After every mock, mark together and rewrite one question the child got wrong — explaining it back is the fastest way to lock learning in.",
          "Time the mocks. Many bright children lose marks not because they don't know the answer but because they run out of time. Practise pacing.",
          "Don't skip past papers. The wording style of GL, CEM, AQA and Edexcel is distinctive and pupils who've seen 5 or more past papers in their target style outperform those who haven't.",
        ],
      },
      {
        heading: "Why practice tests work for school exams",
        body: [
          "School exams reward two things: knowing the content and knowing the format. Most pupils have plenty of content from school but very little experience of the format under time pressure. Mock tests fix that gap, and they also build the calm confidence that prevents silly mistakes on the day.",
        ],
      },
    ],
    faqs: [
      { q: "What is the 11+ pass mark?", a: "It varies by region and school. Most grammar schools set the cut-off at a standardised score of around 121, but some over-subscribed schools require 130 or above." },
      { q: "When are GCSEs taken?", a: "GCSE exams are sat in May and June of Year 11. Results are published on the third Thursday of August." },
      { q: "What's the difference between GCSE foundation and higher tier?", a: "Foundation tier maxes out at grade 5 and covers grades 1–5. Higher tier covers grades 4–9. Pupils are entered for one or the other, not both." },
      { q: "What are SATs?", a: "Standardised Assessment Tests taken at the end of Year 2 (KS1) and Year 6 (KS2). KS2 results are reported as scaled scores; 100 is the expected standard." },
      { q: "How long should an 11+ child revise per day?", a: "30–45 minutes a day in Year 5, building to 60 minutes by the start of Year 6, is plenty if it's consistent." },
      { q: "Are these tests aligned to the new national curriculum?", a: "Yes — all KS1, KS2 and GCSE content reflects the 2014 national curriculum and the latest exam-board specifications." },
      { q: "Are the practice tests free?", a: "Yes, every 11+, GCSE and SATs mock on UK Test Hub is free." },
    ],
  },

  career: {
    title: "Aptitude & Psychometric Test Practice 2026 | Free UK Job Mocks",
    description:
      "Free numerical, verbal, logical reasoning and Situational Judgement Test practice. Prepare for graduate schemes, civil service and corporate UK assessments.",
    intro: [
      "Most UK employers — from the Civil Service Fast Stream to the Big Four, banks, consultancies and the NHS graduate scheme — use psychometric and aptitude tests as an early sift. Our free practice library covers numerical reasoning, verbal reasoning, logical (inductive and deductive) reasoning and Situational Judgement Tests so you can walk into your assessment fluent in the formats.",
    ],
    sections: [
      {
        heading: "What types of test will I face",
        body: [
          "Numerical reasoning tests give you a table or chart and ask you to perform percentage, ratio and trend calculations under time pressure (typically 60–90 seconds per question). Verbal reasoning tests give you a passage and ask whether statements are True, False or Cannot Say based only on the passage. Logical reasoning uses shape sequences. Situational Judgement Tests put you in a workplace scenario and ask which response is most and least effective.",
          "The biggest providers are SHL, Cubiks, Saville, Korn Ferry, Talent Q and Cut-e (Aon). Question styles overlap heavily between providers.",
        ],
      },
      {
        heading: "Tips to pass aptitude tests",
        body: [
          "Practise with a stopwatch. Speed is at least as important as accuracy on most numerical and verbal tests.",
          "On Cannot Say questions, only use information stated in the passage — never bring in real-world knowledge.",
          "For SJTs, choose the response that fits the company's published values (almost every employer publishes them on their careers page).",
          "Re-do every test you score below 70% on. Pattern recognition builds quickly with repetition.",
        ],
      },
      {
        heading: "Why practice tests work for psychometrics",
        body: [
          "Psychometric tests are deliberately unfamiliar — employers want to see how you cope with novelty under pressure. Practice removes the novelty so your real performance reflects your actual reasoning ability rather than your test-taking experience. Candidates who do 20+ mocks before a real assessment routinely score 1–2 standard deviations higher than first-timers.",
        ],
      },
    ],
    faqs: [
      { q: "What is a good score on an aptitude test?", a: "Most graduate schemes set the pass mark at the 50th–70th percentile of their candidate pool, depending on competitiveness. Top consultancies and investment banks often require the 80th percentile or above." },
      { q: "How long do I have per question?", a: "Numerical: 60–90 seconds. Verbal: 45–60 seconds. Logical: 45–75 seconds. SJTs are usually untimed but expect 30 minutes total." },
      { q: "Can I use a calculator on numerical reasoning tests?", a: "Yes — almost all providers allow a basic on-screen or physical calculator. Practise with one to build speed." },
      { q: "What is a Situational Judgement Test?", a: "A workplace scenario test where you rank or rate possible responses to challenging situations — used to measure judgement, values fit and resilience." },
      { q: "How can I prepare for SHL or Cubiks tests?", a: "Practise their question styles specifically. Our library labels each mock with the closest provider style so you can target your prep." },
      { q: "Do employers know if I've practised?", a: "Practising is expected and encouraged. Employers measure your performance, not your prep — but if your scores leap dramatically between sittings, some firms will ask you to retake under supervision." },
    ],
  },

  professional: {
    title: "CSCS, SIA, SERU & Food Hygiene Test Practice 2026 | Free Mocks",
    description:
      "Free practice tests for CSCS Card, SIA Door Supervisor, SERU TfL, Food Hygiene Level 2 and First Aid. Realistic UK-format questions with explanations.",
    intro: [
      "Whether you're starting on a UK construction site, working in security, driving for TfL, or going into hospitality, you'll need a professional certification test pass. Our free CSCS, SIA, SERU TfL, Food Hygiene Level 2 and First Aid Theory mocks mirror the real exam format and give you instant explanations so you walk into your assessment ready.",
    ],
    sections: [
      {
        heading: "What's covered",
        body: [
          "CSCS practice covers the operatives and specialist test syllabus including high-risk activities, working at height, plant and equipment, and emergency procedures. SIA mocks cover the Door Supervisor and Security Guard licence-linked exams. SERU TfL practice prepares you for the 36-question Safety, Equality and Regulatory Understanding assessment for private hire drivers. Food Hygiene Level 2 follows the standard CIEH/RSPH syllabus. First Aid mocks cover Emergency First Aid at Work theory.",
        ],
      },
      {
        heading: "Tips to pass professional certification tests",
        body: [
          "Don't underestimate them. The CSCS and SERU pass marks are high (80% and above) and rushed candidates fail more often than uninformed ones.",
          "For SERU TfL, learn TfL terminology exactly — 'private hire' versus 'taxi', 'driver' versus 'operator'. Wording matters.",
          "For Food Hygiene, memorise the temperature danger zone (8°C to 63°C) and the four Cs: Cleaning, Cooking, Chilling, Cross-contamination.",
          "For First Aid, the order DRSABC (Danger, Response, Shout, Airway, Breathing, Circulation) is tested almost every time.",
        ],
      },
      {
        heading: "Why practice tests work",
        body: [
          "Professional tests are pass/fail with no second chance the same day. Practising the real format eliminates the surprise element and lets you focus on the content. Candidates who complete 3–5 full mocks before a real CSCS or SERU sitting pass at roughly twice the rate of unprepared candidates.",
        ],
      },
    ],
    faqs: [
      { q: "What is the CSCS test pass mark?", a: "47 out of 50 (94%) on the latest operatives test. The standards are deliberately high because the test covers life-safety knowledge." },
      { q: "How long is a CSCS card valid?", a: "Up to 5 years, depending on the card type. Renewal requires a fresh CSCS test pass." },
      { q: "What is the SERU TfL test pass mark?", a: "30 out of 36 (about 83%). You must pass to be licensed as a TfL private hire driver in London." },
      { q: "How long is the SIA Door Supervisor course?", a: "Six days (around 36 hours) of training plus three exams. Once passed, you apply to the SIA for your licence." },
      { q: "What does Food Hygiene Level 2 cover?", a: "Personal hygiene, allergens, the four Cs, temperature control, pests, cleaning and the law (the Food Safety Act 1990 and the Food Standards Agency)." },
      { q: "How long is a First Aid at Work certificate valid?", a: "Three years. You should also do an annual refresher to stay competent and meet HSE recommendations." },
      { q: "Are these professional mocks free?", a: "Yes — CSCS, SIA, SERU, Food Hygiene and First Aid mocks are all free on UK Test Hub." },
    ],
  },

  nhs: {
    title: "NHS & NMC CBT Practice Tests 2026 | Free Numeracy & Literacy Mocks",
    description:
      "Free NHS numeracy, literacy, values-based recruitment and NMC CBT practice tests for nurses. Realistic UK healthcare assessment questions with explanations.",
    intro: [
      "The NHS is the UK's largest employer and uses a battery of recruitment assessments — numeracy and literacy tests, values-based interviews, and the NMC CBT for overseas-trained nurses. Our free NHS practice tests cover all four so you can apply with confidence whether you're a school leaver, an internationally educated nurse, or a returning healthcare professional.",
    ],
    sections: [
      {
        heading: "What's tested",
        body: [
          "NHS numeracy assessments cover drug calculations (mg/kg, IV infusions, drops per minute), basic arithmetic and percentages. NHS literacy tests cover comprehension, spelling and grammar. Values-Based Recruitment uses scenarios mapped to the NHS Constitution (compassion, respect, dignity, working together, commitment to quality of care). The NMC CBT for nurses contains 115 questions across four professional domains.",
        ],
      },
      {
        heading: "Tips to pass NHS assessments",
        body: [
          "For drug calculations, always write out the formula (Required dose ÷ Stock dose × Stock volume) and double-check your decimal place.",
          "For values-based questions, anchor every answer in patient safety and the 6Cs (Care, Compassion, Competence, Communication, Courage, Commitment).",
          "For the NMC CBT, focus revision on UK-specific practice (NICE guidelines, the Mental Capacity Act, safeguarding) — overseas nurses usually find the clinical content easier than the UK legal and ethical context.",
          "Bring a calculator to drug-calc tests if permitted. The NMC CBT does not allow calculators on numeracy questions, so practise mental maths.",
        ],
      },
      {
        heading: "Why practice tests work for NHS recruitment",
        body: [
          "NHS recruitment is high-volume and time-pressured for both candidates and hiring panels. Mocks help you avoid the most common reasons for rejection: a careless drug-calc error, a values answer that prioritises the team over the patient, or a mistimed CBT attempt. Twenty hours of mock practice typically lifts NMC CBT first-attempt pass rates from around 70% to over 85%.",
        ],
      },
    ],
    faqs: [
      { q: "What is the NMC CBT pass mark?", a: "There's no single percentage — the NMC sets the pass mark per domain using a modified Angoff method, but candidates who score above 70% across all four professional domains generally pass." },
      { q: "How many questions are in the NMC CBT?", a: "115 multiple-choice questions across four domains: Professional Values, Communication and Interpersonal Skills, Nursing Practice and Decision-Making, and Leadership, Management and Team Working." },
      { q: "How long is the NMC CBT?", a: "Four hours, including a tutorial and a numeracy section." },
      { q: "What are NHS Values-Based Recruitment questions like?", a: "Workplace scenarios mapped to the NHS Constitution. You'll be asked which response best reflects NHS values, or to rank responses from most to least appropriate." },
      { q: "What level of maths is on NHS numeracy tests?", a: "Roughly GCSE Foundation level, with a heavy focus on drug calculations, percentages, ratios and unit conversions." },
      { q: "Can overseas nurses take the NMC CBT in their home country?", a: "Yes — the CBT is delivered worldwide via Pearson VUE test centres. The Objective Structured Clinical Examination (OSCE) must be taken in the UK." },
      { q: "Are these NHS mocks free?", a: "Yes, every NHS numeracy, literacy, values and NMC CBT mock on UK Test Hub is free." },
    ],
  },

  fun: {
    title: "Fun UK Quizzes 2026 | How British Are You? & UK Slang Tests",
    description:
      "Light-hearted UK quizzes: How British Are You, UK slang quiz and a fresh general knowledge daily quiz. Test your UK culture knowledge for free.",
    intro: [
      "Not every quiz needs to be life-or-death. Our fun UK quiz library is for the days when you want to test your slang, your sense of British humour, or just see if you really do know your queue etiquette. Quick, free and a little bit silly.",
    ],
    sections: [
      {
        heading: "What's in the fun quiz library",
        body: [
          "How British Are You? is a 10-question lifestyle quiz covering tea, weather small talk, queueing and Bank Holidays. UK Slang Quiz tests your knowledge of regional vocabulary from 'mardy' (Midlands) to 'bairn' (North East and Scotland). The General Knowledge Daily Quiz refreshes every 24 hours so you've always got something new to play.",
        ],
      },
      {
        heading: "Why fun quizzes are good for your brain",
        body: [
          "Short, low-stakes quizzes are great for taking a screen break without going full-on doom-scroll. They activate the same active-recall pathways as exam revision, but with no pressure. Perfect for a coffee break or the bus home.",
        ],
      },
    ],
    faqs: [
      { q: "Are the fun quizzes really free?", a: "Yes — no sign-up, no payment, no email required." },
      { q: "How often does the daily quiz change?", a: "Every 24 hours, so you can play once a day with fresh questions." },
      { q: "Can I share my score?", a: "Yes — at the end of each quiz you can copy a shareable summary to send to friends." },
      { q: "Are these quizzes suitable for children?", a: "Yes — content is family-friendly and contains no profanity." },
      { q: "Do I need an account to play?", a: "No. Your best scores are stored locally on your device." },
    ],
  },
};
