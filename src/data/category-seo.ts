// Long-form SEO content + FAQs for each category page.
// Kept separate from categories.ts to keep that data lean; the category route
// merges these by slug. Content is UK English, ~1200 words per category.

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
      "Passing the UK Driving Theory Test on the first attempt takes more than memorising answers. The DVSA exam is split into 50 multiple-choice questions and a hazard perception clip section, and you need to do well on both to walk away with a provisional pass certificate. Our free Driving Theory practice tests mirror the real exam format so you can train under realistic conditions, build pace, and learn the reasoning behind every answer rather than just the letter.",
      "Whether you're booking your first test, retaking after a near miss, or preparing for the Motorcycle Theory or Road Signs Test, you'll find unlimited mock exams, instant scoring and detailed explanations. All questions are updated for 2026 and reflect the latest Highway Code revisions, including the changes to the hierarchy of road users and the new rules on overtaking cyclists and horse riders.",
    ],
    sections: [
      {
        heading: "What the test actually involves",
        body: [
          "The DVSA Driving Theory Test runs for around 90 minutes from check-in to your printed result slip. You'll sit at a Pearson VUE workstation with headphones and complete two parts back to back: 50 multiple-choice questions in 57 minutes, then a short break, then 14 video clips containing 15 developing hazards.",
          "The multiple-choice section is computer-adaptive in style: questions are drawn from a much larger bank, so two candidates sitting next to each other will see very different papers. The pass mark is 43 out of 50. Hazard perception is scored 0–5 per developing hazard depending on how early you click, with a pass mark of 44 out of 75. You must pass both parts at the same sitting — fail one and you fail the whole test.",
          "Bring your provisional licence, arrive 15 minutes early, and switch your phone off completely. Late arrivals lose the £23 fee and have to rebook on gov.uk.",
        ],
      },
      {
        heading: "What's covered in the syllabus",
        body: [
          "Each mock paper covers the full DVSA syllabus: alertness, attitude, safety and your vehicle, safety margins, hazard awareness, vulnerable road users, other types of vehicle, vehicle handling, motorway rules, rules of the road, road and traffic signs, documents, accidents, and vehicle loading.",
          "Questions are written in plain UK English and follow the same multi-choice style you'll see on test day. Some questions have a single correct answer; others ask you to select two or three options. The on-screen wording will tell you exactly how many to pick — read it carefully.",
          "The hazard perception practice helps you spot developing hazards earlier — a parked van with brake lights coming on, a child running between cars, a cyclist drifting toward a parked door. If you're a learner motorcyclist, the dedicated Motorcycle Theory section adds questions on gear, lifesaver checks, and CBT-relevant content.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "Start at least four weeks before your test date and aim for 20–30 minutes of practice five days a week. Short, frequent sessions build long-term recall far more reliably than weekend cram marathons.",
          "Read each question twice. The DVSA loves to test your attention with subtle wording like 'should' versus 'must'. Use a current edition of the Highway Code alongside your mocks — when you get a question wrong, look up the rule the question was testing rather than just memorising the answer.",
          "Practise hazard perception on a laptop or tablet, not a phone. The clip windows are wider than your phone screen and you'll miss peripheral movement on a small display. Click once when you first spot a developing hazard, then again as it becomes more serious — but don't click constantly or in a rhythm, because the system flags this as cheating and gives you zero for that clip.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "The single biggest reason candidates fail is rushing the multiple-choice section and then running out of focus for hazard perception. Pace yourself: 57 minutes for 50 questions is more than a minute per question, so use it.",
          "Other common pitfalls: confusing the 'two-second rule' (dry weather) with the 'four-second rule' (wet) and the 'ten-second rule' (icy); misreading triangular warning signs as circular order signs; and forgetting that motorway rules differ from dual carriageway rules on speed limits for towing vehicles.",
          "If you fail, you must wait at least three working days before booking again, and you'll pay the full £23 fee each time. There's no limit on how many times you can sit it, but each fail adds delay before you can book your practical.",
        ],
      },
      {
        heading: "Why active practice testing works",
        body: [
          "Active recall — testing yourself rather than re-reading notes — is one of the most evidence-backed study techniques in cognitive science. Repeated mock papers expose gaps you didn't know you had, and the instant feedback after each question rewires your memory faster than passive revision ever can.",
          "Mocks also dismantle exam anxiety. The first time you see a real DVSA-style question shouldn't be at the test centre. By the time you've completed five to ten mocks, the format feels familiar and you can focus your mental energy on the content rather than the interface. Candidates who finish 10+ free mocks before sitting the real test pass at noticeably higher rates than those who only read the Highway Code.",
          "There's also a simple cost argument. The DVSA fee is £23 per attempt, plus the time off work and the stress of rebooking. If 10 hours of free practice raises your first-time pass probability from 50% to 75%, the expected saving is real money and several weeks of waiting list. Treat practice as a financial decision, not just an academic one.",
        ],
      },
      {
        heading: "Booking, fees and what to expect on the day",
        body: [
          "You can only book the official Driving Theory Test through gov.uk. The fee is £23 in 2026 and you can usually find a slot within two to four weeks at most centres, with same-week slots in larger cities. Avoid third-party 'fast booking' sites that charge a £20–£40 markup for the same slot.",
          "On the day, bring your provisional licence as photo ID. You're not allowed to take a phone, watch, bag or notes into the test room — there are lockers in the waiting area. Arrive at least 15 minutes before your slot; latecomers are turned away and the fee is forfeited.",
          "After the test, you'll get a printed result slip immediately. If you've passed, the slip is your theory pass certificate — keep it safe, because you'll need the number when you book your practical test on gov.uk.",
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
      "The Life in the UK Test is a 45-minute, 24-question exam that you must pass to apply for British citizenship or Indefinite Leave to Remain. The questions are drawn from the official Home Office handbook, Life in the United Kingdom: A Guide for New Residents, and you need to score at least 75% — that's 18 out of 24 — to pass. It sounds gentle on paper, but the dates, names and constitutional details trip up thousands of candidates every year.",
      "Our free Life in the UK practice tests follow the official format exactly, with the same four question styles, the same 45-minute clock and the same difficulty distribution as the real exam. Use them alongside the handbook to memorise dates, monarchs, traditions and the structure of UK government with real confidence rather than vague familiarity.",
    ],
    sections: [
      {
        heading: "What the test actually involves",
        body: [
          "You'll sit the test at one of around 30 approved centres across the UK. After ID verification you go straight to a workstation, work through a short tutorial, then begin the 45-minute exam. There's no break and no pause — once the timer starts, it runs until you submit or it expires.",
          "Questions appear one at a time. You can flag any question to come back to and review your full paper at the end before final submission. The result is on screen within minutes and a printed pass letter is handed to you the same day. If you fail, you don't see your score; you only see that you didn't pass and which broad chapters you struggled with.",
        ],
      },
      {
        heading: "What's covered in the handbook",
        body: [
          "The official handbook is divided into five chapters: The values and principles of the UK; What is the UK; A long and illustrious history; A modern, thriving society; and The UK government, the law and your role. The history chapter is the longest and the most heavily tested — expect questions on Stonehenge, the Romans, Anglo-Saxons, the Norman Conquest, the Tudors, the Civil War, the Industrial Revolution, both World Wars and post-war devolution.",
          "The government chapter is dense but predictable: the role of the monarch, the Prime Minister, Parliament, the devolved administrations, the courts, the police and your civic responsibilities (voting, jury service, paying tax).",
          "Some questions ask for a single fact, others ask which of two statements is true, and a few are multiple-select. Our mocks cover all four official question styles in the same proportion as the real test.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "Read the official handbook end to end at least twice. The test only draws from this book — outside knowledge will not help and can actively hurt, because UK culture as you experience it day to day doesn't always match the handbook's wording.",
          "Make a one-page timeline. The dates that trip people up most are 1066 (Norman conquest), 1215 (Magna Carta), 1707 (Act of Union with Scotland), 1801 (UK formed with Ireland) and 1928 (women got the vote on equal terms with men). Add 1066, 1215, 1314, 1485, 1534, 1649, 1707, 1801, 1832, 1918, 1928, 1948 and 1973 to a flashcard deck.",
          "Practise mocks in 45-minute sittings. Build the habit of moving on quickly from anything you're not sure about and returning at the end with the time you've banked.",
        ],
      },
      {
        heading: "Who needs to take it (and who is exempt)",
        body: [
          "You must take and pass the test if you are applying for Indefinite Leave to Remain (settlement) or for British citizenship by naturalisation. Children under 18 and adults over 65 are usually exempt, as are people with a long-term physical or mental condition that prevents them from taking the test — a GP letter is required for medical exemption.",
          "If you've already passed the test for ILR, you do not need to take it again for citizenship. Your pass certificate has no expiry date.",
          "On test day, bring two original ID documents: one with your photo (passport, BRP or driving licence) and one showing your current address (utility bill or bank statement, less than three months old). A scan or photo on your phone will not be accepted.",
        ],
      },
      {
        heading: "Why active practice testing works",
        body: [
          "The Life in the UK Test is fundamentally a memory test. Reading the handbook is necessary but not sufficient — you need to retrieve the facts under time pressure, in a slightly unfamiliar phrasing, with three plausible-looking distractors next to the correct answer. That retrieval skill only develops through testing.",
          "Mock papers also surface the chapters you've quietly skipped or skim-read. Most candidates feel confident on history and weak on government, then sit a mock and discover the opposite. Use your scores honestly: any chapter where you're scoring under 80% is your next study target.",
          "There is also a financial reason to take practice seriously. At £50 per attempt, two failed sittings costs as much as a year's worth of streaming subscriptions, and each fail also delays your ILR or citizenship application by at least a week. A few free mocks the night before is one of the cheapest insurance policies available in UK immigration.",
        ],
      },
      {
        heading: "Booking, fees and what to expect on the day",
        body: [
          "You can only book the Life in the UK Test through the official gov.uk service. The fee is £50 in 2026 and slots typically appear two to six weeks ahead, depending on your local test centre. The system will not let you book a slot less than three days away, so plan accordingly.",
          "On the day, arrive at least 30 minutes early — late arrivals lose the £50 fee with no refund. Bring two original ID documents: one with your photo (passport, BRP or driving licence) and one showing your current address (utility bill or bank statement, less than three months old). Photocopies and phone scans are not accepted.",
          "After the test, you'll be told whether you passed within minutes and a printed pass notification letter is handed to you the same day. Keep it safe — you'll need to send the original with your ILR or citizenship application.",
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
      "If English isn't your first language, the IELTS, TOEFL and ESOL exams open the doors to UK study, work and visas. Our free English practice tests cover IELTS Academic and General Training, TOEFL iBT-style questions, ESOL Skills for Life and a deep library of grammar and vocabulary drills — all written and marked to UK standards rather than American or international ones.",
      "Whether you need a Band 6.5 for a UK university place, a CEFR B1 for the spouse visa, or a Pass at ESOL Entry 3 for a particular employer, regular practice in real exam conditions is the fastest and most reliable way to lift your score. There is no shortcut around the four skills — but there is a smart way to train each one.",
    ],
    sections: [
      {
        heading: "What the tests actually involve",
        body: [
          "IELTS runs for 2 hours 45 minutes across four papers: Listening (30 minutes), Reading (60 minutes), Writing (60 minutes) and Speaking (11–14 minutes face-to-face or video). The Listening and Speaking sections are identical for Academic and General Training; only Reading and Writing differ.",
          "TOEFL iBT is a single 2-hour computer-based session covering the same four skills with integrated tasks (read–listen–speak, listen–speak, read–listen–write). ESOL Skills for Life is taken at the level you need (Entry 1, Entry 2, Entry 3, Level 1 or Level 2) and is split into Reading, Writing, and Speaking & Listening — each can be passed separately.",
        ],
      },
      {
        heading: "What's in our English practice library",
        body: [
          "IELTS practice covers Listening (40 questions across 4 sections), Reading (40 questions, 3 passages), and Writing Task 1 and 2 prompts with model bands and examiner-style comments on cohesion, lexical resource, grammatical range and task achievement.",
          "TOEFL practice mirrors the iBT structure with academic reading passages, lecture-style listening, and integrated speaking and writing prompts. ESOL drills focus on everyday UK English at Entry 1 through Level 2 — filling in a job application, reading a tenancy agreement, leaving a voicemail.",
          "The grammar section is built for learners who plateau around B1. Each set focuses on a single sticking point — present perfect versus past simple, articles, prepositions of time, conditionals, reported speech — with short explanations and 10-question quizzes that take five minutes each.",
        ],
      },
      {
        heading: "How to lift your IELTS or TOEFL score",
        body: [
          "Practise daily, even if it's only 20 minutes. Steady exposure beats weekend cram sessions for language learning — your brain consolidates vocabulary and grammar overnight, so daily contact compounds.",
          "Read English news (BBC, Guardian, Reuters) every day. The IELTS and TOEFL reading passages are written in a similar formal register, and exposure to UK formal English speeds up your reading rate, which is often the single biggest constraint on a high band score.",
          "Record yourself answering speaking prompts on your phone. Listening back is uncomfortable but reveals fillers, hesitation, and grammar errors you don't notice in real time. Aim for one recording per day in the two weeks before your test.",
          "For Writing Task 2, learn 5 reusable structures (problem-solution, two-sided opinion, compare-contrast, advantages-disadvantages, agree-disagree) so you don't waste planning time under pressure.",
        ],
      },
      {
        heading: "Choosing the right test for your goal",
        body: [
          "For a UK university, IELTS Academic is the safest choice — accepted everywhere. TOEFL is also widely accepted by universities but is not on the Home Office Secure English Language Test (SELT) list, so it cannot be used for a UK visa.",
          "For UK visas (work, family, settlement, citizenship), you need a SELT: IELTS for UKVI, Trinity SELT, or Pearson PTE Academic UKVI. The CEFR level you need depends on the visa: A1 for the initial spouse visa, A2 for extension after 2.5 years, and B1 for ILR and citizenship (paired with a Life in the UK Test pass).",
          "For employers asking only for 'good English', ESOL Skills for Life Level 1 or Level 2 is usually enough and is significantly cheaper than IELTS.",
        ],
      },
      {
        heading: "Why test-style practice beats textbook study",
        body: [
          "Textbooks teach English. Mock tests teach the exam. Both matter, but candidates who only study textbooks usually under-score by a full band or level, because they aren't used to the time pressure or the specific question styles. The IELTS Listening section, for example, is famous for paraphrasing — the answer in the audio is almost never the exact word in the question.",
          "Use mocks to expose your weak skill (often listening or writing), then drill that skill with focused exercises before returning to a full mock. Two weeks of this loop typically lifts an honest IELTS score by half a band.",
          "There's a financial dimension too. IELTS UKVI in the UK costs around £200 per sitting, and a re-sit isn't just inconvenient — it can delay a visa or university start by months. Treat free practice as the cheapest possible insurance against an avoidable re-sit.",
        ],
      },
      {
        heading: "Booking, fees and what to expect on test day",
        body: [
          "Book IELTS through the British Council, IDP or PSI websites. UK Academic and General sittings are widely available; UKVI sittings are restricted to a smaller list of approved centres because they're recorded for the Home Office. TOEFL is booked through ets.org and ESOL Skills for Life through approved centres listed on gov.uk.",
          "On IELTS test day, you'll sit Listening, Reading and Writing in one continuous session of around three hours. The Speaking interview may be on the same day or within a week, depending on your centre. Bring the same passport you used to book — any other ID will get you turned away.",
          "Results are released 3–5 days later for the computer-delivered version and 13 days later for paper-based IELTS. ESOL results vary by awarding body but are typically issued within four weeks of the speaking and listening session.",
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
      "From the 11+ entrance exam to GCSE finals, our free school practice tests are aligned to the UK national curriculum and the major exam boards (AQA, Edexcel, OCR, CEM and GL). Each mock is timed and gives instant feedback so children — and parents — can see exactly what to revise next, without having to mark anything by hand.",
      "Whether you're prepping for a grammar school place, a Year 6 SATs paper, or counting down to GCSE results day, regular short mocks beat long revision marathons every time. Our content is designed for use at home, on a tablet or laptop, in 20- to 45-minute sessions that fit around school and family life.",
    ],
    sections: [
      {
        heading: "What the exams actually involve",
        body: [
          "The 11+ varies dramatically by region. Most grammar schools use either the GL Assessment or CEM (Centre for Evaluation and Monitoring) test. GL papers test verbal reasoning, non-verbal reasoning, English and maths in clearly separated sections; CEM blends them. Both are sat in Year 6 and results are standardised by date of birth.",
          "KS1 SATs (Year 2) are now informal teacher-led assessments. KS2 SATs (Year 6) are formal written papers in reading, SPaG (spelling, punctuation and grammar) and maths, sat in May.",
          "GCSEs are sat in May and June of Year 11 across two or three papers per subject. Most subjects are assessed entirely by exam, with results on the third Thursday of August and grades from 9 (highest) to 1.",
        ],
      },
      {
        heading: "What you'll find here",
        body: [
          "11+ practice covers verbal reasoning, non-verbal reasoning, English comprehension and maths in both GL and CEM styles. We label every paper with the closest style so you can target your child's region.",
          "GCSE Maths drills foundation and higher tier topics including algebra, geometry, statistics and number, with worked solutions for every question. GCSE English questions cover language analysis, creative writing and the literature anthology (set texts including An Inspector Calls, A Christmas Carol and the Power and Conflict poems).",
          "SATs practice is split into KS1 (Year 2) and KS2 (Year 6) reading, SPaG and arithmetic, with the same time limits as the official papers.",
        ],
      },
      {
        heading: "Tips for pupils and parents",
        body: [
          "Short, frequent practice beats long Sunday sessions. Aim for 20–30 minutes a day, four to five days a week. Mark together immediately afterwards while the questions are still fresh.",
          "After every mock, rewrite one question the child got wrong — explaining it back to you in their own words is the fastest way to lock learning in. This single habit can lift a child's score by 10–15% over a term.",
          "Time the mocks. Many bright children lose marks not because they don't know the answer but because they run out of time. Practise pacing.",
          "Don't skip past papers. The wording style of GL, CEM, AQA and Edexcel is distinctive, and pupils who've seen 5 or more past papers in their target style consistently outperform those who haven't.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "On 11+, the most common avoidable error is leaving questions blank. There's no negative marking on most papers, so an educated guess is always better than a blank.",
          "On GCSE Maths, candidates routinely lose method marks by writing only the final answer. Show every step — even a wrong final answer with correct working can score 4 of 5 marks.",
          "On GCSE English, going under the word count on the creative writing task is the most expensive mistake: examiners can only mark what's on the page, and a 200-word answer caps at a low band regardless of quality.",
        ],
      },
      {
        heading: "Why practice tests work for school exams",
        body: [
          "School exams reward two things: knowing the content and knowing the format. Most pupils have plenty of content from school but very little experience of the format under time pressure. Mock tests fix that gap, and they also build the calm confidence that prevents silly mistakes on the day.",
          "Used well, mocks are also a diagnostic tool for parents. A consistent dip in non-verbal reasoning, or a pattern of running out of time on the second maths paper, tells you exactly where to focus the next two weeks of revision — far more usefully than a school report card.",
          "Cognitive scientists call this the 'testing effect': retrieving information strengthens the memory more than re-reading does. For pupils preparing for high-stakes exams, that means one practice paper can be worth three or four hours of passive revision — provided the wrong answers are reviewed honestly afterwards.",
        ],
      },
      {
        heading: "Booking and exam-day logistics for parents",
        body: [
          "11+ exams are booked directly with each grammar school or local authority, usually in the spring of Year 5 with a hard deadline in June or July. Miss the deadline and your child cannot sit the test that year. Most areas now use a single registration portal, but a few still require separate forms per school — always check your council website.",
          "SATs are administered by the school and require no booking from parents. GCSEs are entered through the school by the head of department; parents only need to confirm the entry and pay any private-candidate fees if applicable.",
          "On exam day, send your child in with two black ballpoint pens, a pencil, eraser, ruler and a clear pencil case. For maths, a calculator that has been used in practice (not a brand-new one) reduces fumbling. A bottle of water and a slow-release breakfast — porridge or eggs — outperform a sugary cereal for sustained concentration.",
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
      "Most UK employers — from the Civil Service Fast Stream to the Big Four, banks, consultancies and the NHS graduate scheme — use psychometric and aptitude tests as an early sift. A weak score here ends your application before a human ever reads your CV. Our free practice library covers numerical reasoning, verbal reasoning, logical (inductive and deductive) reasoning and Situational Judgement Tests so you can walk into your assessment fluent in the formats.",
      "These tests aren't measuring intelligence in any deep sense. They're measuring how quickly and accurately you can process unfamiliar information under pressure — which is a learnable skill. Every hour of focused practice typically lifts your percentile score, especially in the first 10–20 hours.",
    ],
    sections: [
      {
        heading: "What types of test you'll face",
        body: [
          "Numerical reasoning tests give you a table or chart and ask you to perform percentage, ratio and trend calculations under tight time pressure (typically 60–90 seconds per question). Verbal reasoning tests give you a passage and ask whether statements are True, False or Cannot Say based only on the passage — never on outside knowledge.",
          "Logical reasoning uses shape sequences (inductive) or rule-based puzzles (deductive). Situational Judgement Tests put you in a workplace scenario and ask which response is most and least effective.",
          "The biggest providers are SHL, Cubiks, Saville, Korn Ferry, Talent Q and Cut-e (Aon). Question styles overlap heavily between providers, so practice transfers — but each has stylistic quirks worth learning.",
        ],
      },
      {
        heading: "What employers are really measuring",
        body: [
          "Most graduate schemes set the pass mark at the 50th–70th percentile of their candidate pool, depending on competitiveness. Top consultancies and investment banks often require the 80th or even 90th percentile.",
          "Crucially, your score is normed against a comparison group — usually 'UK graduates' or 'professionals' — so a 'good' raw score (e.g. 24 out of 30) might still be a poor percentile if the comparison group averaged 26.",
          "Employers also look at your speed-to-accuracy ratio. Answering 28 of 30 questions correctly in the time limit usually scores higher than answering all 30 with 4 wrong — but answering only 15 with all correct scores poorly. Pace matters as much as accuracy.",
        ],
      },
      {
        heading: "How to study and pass",
        body: [
          "Practise with a stopwatch from day one. Speed is at least as important as accuracy on most numerical and verbal tests, and slow careful practice doesn't transfer to test-day conditions.",
          "On Cannot Say questions, only use information explicitly stated in the passage — never bring in real-world knowledge, even when the statement is obviously true in real life. This is the single most common mistake on verbal reasoning.",
          "For SJTs, choose the response that fits the company's published values (almost every employer publishes them on their careers page) and prioritise patient or customer outcomes over team comfort or speed.",
          "Re-do every test you score below 70% on. Pattern recognition builds quickly with repetition — most candidates plateau because they keep doing new tests instead of revisiting weak ones.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "The biggest mistake is treating practice tests as a self-esteem exercise rather than a training tool. Take your wrong answers seriously: write down why you got each one wrong and what you'd do differently.",
          "On numerical reasoning, candidates lose huge amounts of time on the first question by trying to read the entire data table. Skim the table briefly, read the question, then go back for the specific number you need.",
          "On SJTs, picking the 'nice' answer over the 'effective' answer is a classic trap. Employers don't reward excessive hand-holding — they reward decisive action that protects the customer and respects the rules.",
        ],
      },
      {
        heading: "Why practice tests work for psychometrics",
        body: [
          "Psychometric tests are deliberately unfamiliar — employers want to see how you cope with novelty under pressure. Practice removes the novelty so your real performance reflects your actual reasoning ability rather than your test-taking experience.",
          "Candidates who do 20+ mocks before a real assessment routinely score 1–2 standard deviations higher than first-timers. That's often the difference between a rejection email and a video interview invite.",
          "There's nothing dishonest about practising. Employers know candidates prepare and many provide official sample tests on their careers pages. What they're trying to identify is your ceiling under pressure, not your raw IQ — and that ceiling is genuinely raised by repetition.",
        ],
      },
      {
        heading: "Booking and what to expect on assessment day",
        body: [
          "Most aptitude tests are sent as an emailed link with a deadline of 5–10 days. You complete them remotely on a laptop, often unsupervised, with a single attempt recorded. Some employers — especially banks and consultancies — will then re-test you in a supervised assessment centre to confirm your remote score is genuine.",
          "Set yourself up properly: a quiet room, a charged laptop on the mains, a stable wired or strong Wi-Fi connection, a glass of water, and a printed scrap-paper pad with two pens. Disable notifications and close every other browser tab. Most providers lock you out if you switch tabs during the test.",
          "Read the instructions screen carefully — it tells you the number of questions, the time limit, the comparison group your score will be normed against, and whether you can flag and revisit questions. Once you click 'Start', the clock runs and there is no pause.",
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
    title: "Workplace Compliance & Safety Test Practice 2026 | Free Mocks",
    description:
      "Free practice for the workplace compliance certifications UK employers expect — Food Hygiene, First Aid, Fire Safety, Manual Handling, Health & Safety Awareness and GDPR / Data Protection.",
    intro: [
      "Almost every UK job comes with a short stack of compliance certificates: food hygiene if you handle food, first aid if you're the named first-aider, fire safety wherever there are colleagues to evacuate, manual handling if you lift anything heavier than a laptop, plus general health & safety awareness and GDPR / data protection refreshers. Our free mocks mirror the standard awarding-body formats so you walk in knowing exactly what to expect.",
      "These exams sit at the everyday end of UK compliance — not the high-stakes licence tests like CSCS, SIA or SERU (each of which now has its own dedicated category on UK Test Hub) — but they're still pass/fail with re-sit fees, and a fail can delay your start date or your shift rota.",
    ],
    sections: [
      {
        heading: "What each test actually involves",
        body: [
          "Food Hygiene Level 2 is typically a 30-question online exam with a 75% pass mark, set against the CIEH/RSPH syllabus.",
          "Emergency First Aid at Work theory is short but unforgiving — most providers test on the DRSABC sequence, the recovery position and CPR ratios in detail.",
          "Fire Safety Awareness, Manual Handling and Health & Safety Awareness are usually 15–25 multiple-choice questions following HSE guidance, with pass marks around 75–80%. GDPR / Data Protection Awareness mocks cover the UK GDPR principles, lawful bases for processing and personal-data breach handling.",
        ],
      },
      {
        heading: "What's covered",
        body: [
          "Food Hygiene Level 2 follows the standard syllabus: personal hygiene, allergens, the four Cs (Cleaning, Cooking, Chilling, Cross-contamination), temperature control, pests and the Food Safety Act 1990.",
          "First Aid covers DRSABC, the recovery position, adult and child CPR ratios, choking, bleeding and shock. Fire Safety covers fire triangle theory, extinguisher classes, evacuation procedures and the Regulatory Reform (Fire Safety) Order 2005.",
          "Manual Handling covers TILE/TILEO assessment, safe lifting technique and the Manual Handling Operations Regulations 1992. GDPR mocks cover the seven principles, data subject rights, lawful bases and the 72-hour breach notification rule to the ICO.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "For Food Hygiene, memorise the temperature danger zone (8°C to 63°C), core cooking temperature (75°C for 30 seconds or equivalent) and the four Cs.",
          "For First Aid, the order DRSABC is tested almost every time, alongside CPR ratios (30 compressions to 2 breaths for adults).",
          "For Fire Safety, learn the extinguisher colour codes (red = water, cream = foam, blue = dry powder, black = CO₂, yellow = wet chemical) and which class of fire each one is for.",
          "For GDPR, the seven principles (lawfulness, fairness, transparency, purpose limitation, data minimisation, accuracy, storage limitation, integrity & confidentiality, accountability) come up in almost every paper.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "On Food Hygiene, the most missed question is the difference between use-by and best-before dates: use-by is a safety date, best-before is a quality date.",
          "On Fire Safety, candidates wrongly use water on electrical or oil fires — water is for Class A (paper, wood, fabric) only.",
          "On GDPR, candidates conflate 'consent' with the only lawful basis for processing — there are six lawful bases, and consent is often the weakest one to rely on.",
        ],
      },
      {
        heading: "Why practice tests work",
        body: [
          "Compliance certificates are pass/fail and most charge a re-sit fee of £15–£40. Practising the real format eliminates the surprise element so you can focus on the content.",
          "Mocks build the procedural memory you need under pressure. By the third or fourth full paper, the temperature thresholds, extinguisher colours, lifting steps and lawful bases come back automatically.",
        ],
      },
    ],
    faqs: [
      { q: "What does Food Hygiene Level 2 cover?", a: "Personal hygiene, allergens, the four Cs, temperature control, pests, cleaning and the law (the Food Safety Act 1990 and the Food Standards Agency)." },
      { q: "How long is a First Aid at Work certificate valid?", a: "Three years. You should also do an annual refresher to stay competent and meet HSE recommendations." },
      { q: "Where can I find CSCS, SIA or SERU practice now?", a: "CSCS lives in our Construction & Trade category, SIA in Security & Door Supervision, and SERU in Taxi & Private Hire — each has its own dedicated mocks." },
      { q: "Is GDPR awareness training a legal requirement?", a: "The UK GDPR requires staff handling personal data to be appropriately trained. Most employers refresh awareness annually." },
      { q: "Are these workplace compliance mocks free?", a: "Yes — Food Hygiene, First Aid, Fire Safety, Manual Handling, H&S Awareness and GDPR mocks are all free on UK Test Hub." },
    ],
  },

  nhs: {
    title: "NHS & NMC CBT Practice Tests 2026 | Free Numeracy & Literacy Mocks",
    description:
      "Free NHS numeracy, literacy, values-based recruitment and NMC CBT practice tests for nurses. Realistic UK healthcare assessment questions with explanations.",
    intro: [
      "The NHS is the UK's largest employer and uses a battery of recruitment assessments — numeracy and literacy tests, values-based interviews, and the NMC Computer-Based Test (CBT) for overseas-trained nurses. A failed assessment can delay a career move by months or, for international nurses, delay a UK move by a full year.",
      "Our free NHS practice tests cover all four assessment types so you can apply with confidence whether you're a school leaver, an internationally educated nurse, or a returning healthcare professional. Every question is written to UK standards using NHS terminology, NICE guidelines and the NMC Code rather than US or Commonwealth nursing conventions.",
    ],
    sections: [
      {
        heading: "What the assessments actually involve",
        body: [
          "NHS numeracy and literacy assessments are usually delivered online before interview, with a 30–45 minute time limit. Drug calculations dominate the numeracy paper. Values-Based Recruitment is delivered either as a written scenario test or as part of a structured interview.",
          "The NMC CBT is the formal entry test for overseas-trained nurses applying to register in the UK. It runs for four hours, contains 115 multiple-choice questions across four domains, and is taken at a Pearson VUE centre worldwide. You must pass the CBT before you can sit the OSCE in the UK.",
        ],
      },
      {
        heading: "What's tested",
        body: [
          "NHS numeracy assessments cover drug calculations (mg/kg, IV infusions, drops per minute), basic arithmetic, percentages, fluid balance and unit conversions.",
          "NHS literacy tests cover comprehension, spelling, grammar and the ability to summarise written information accurately. Many tests include a passage-and-questions section based on a clinical scenario.",
          "Values-Based Recruitment uses scenarios mapped to the NHS Constitution (compassion, respect, dignity, working together, commitment to quality of care). The NMC CBT covers four professional domains: Professional Values, Communication and Interpersonal Skills, Nursing Practice and Decision-Making, and Leadership, Management and Team Working.",
        ],
      },
      {
        heading: "How to study and pass",
        body: [
          "For drug calculations, always write out the formula (Required dose ÷ Stock dose × Stock volume) and double-check your decimal place. Most failures come from misplaced decimals, not wrong formulas.",
          "For values-based questions, anchor every answer in patient safety and the 6Cs (Care, Compassion, Competence, Communication, Courage, Commitment). When in doubt, choose the answer that protects the patient first and the team second.",
          "For the NMC CBT, focus revision on UK-specific practice (NICE guidelines, the Mental Capacity Act, safeguarding, Duty of Candour) — overseas nurses usually find the clinical content easier than the UK legal and ethical context.",
          "Bring a calculator to drug-calc tests if permitted. The NMC CBT does not allow calculators on numeracy questions, so practise mental maths and long-division on paper.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "On numeracy, a careless decimal place is the single biggest cause of failure. Always double-check by estimating the answer first — a vial of 50mg in 5ml giving a 25mg dose should be 2.5ml, not 0.25ml or 25ml.",
          "On values questions, candidates often pick the answer that 'keeps the team happy' over the answer that protects the patient. Patient safety always wins, even if it means escalating against a colleague's wishes.",
          "On the NMC CBT, running out of time on the final 30 questions is common because candidates over-think the early ones. Aim for 90 seconds per question and flag anything that takes longer.",
        ],
      },
      {
        heading: "Why practice tests work for NHS recruitment",
        body: [
          "NHS recruitment is high-volume and time-pressured for both candidates and hiring panels. Mocks help you avoid the most common reasons for rejection: a careless drug-calc error, a values answer that prioritises the team over the patient, or a mistimed CBT attempt.",
          "Twenty hours of mock practice typically lifts NMC CBT first-attempt pass rates from around 70% to over 85% — and given a CBT re-sit costs £83 plus the Pearson VUE booking delay, that's a meaningful return on free practice.",
          "For internationally educated nurses, the gap between clinical competence and CBT pass rate is almost entirely down to UK-specific context: NICE, NMC Code, Mental Capacity Act, safeguarding, Duty of Candour. Practice tests built around UK terminology close that gap faster than re-reading nursing textbooks from your home country.",
        ],
      },
      {
        heading: "Booking and what to expect on the day",
        body: [
          "Book the NMC CBT through Pearson VUE once your NMC application has reached the right stage. The fee is £83 in 2026 and slots are available worldwide, usually within two weeks. NHS pre-employment numeracy and literacy tests are sent by the trust as an emailed link with a deadline of around five working days.",
          "On the day, arrive 30 minutes early with one piece of valid photo ID matching the name on your booking. Phones, watches and bags go into lockers. The CBT is taken on a Pearson VUE workstation; you can request earplugs and noise-cancelling headphones at check-in.",
          "Results for the CBT are emailed within 48 hours. NHS internal numeracy and literacy results are usually returned to the recruiting trust within three days; you'll typically hear back from the recruiter within a week.",
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
      "Not every quiz needs to be life-or-death. Our fun UK quiz library is for the days when you want to test your slang, your sense of British humour, or just see if you really do know your queue etiquette. Quick, free and a little bit silly — perfect for a coffee break, a long bus journey, or settling a debate with a flatmate.",
      "Behind the comedy, these quizzes are also genuinely good for your brain. Short, low-stakes recall is the same study technique that powers our serious test prep, just with sillier subject matter. You'll be surprised how much you actually know — and how much you confidently get wrong.",
    ],
    sections: [
      {
        heading: "What's in the fun quiz library",
        body: [
          "How British Are You? is a 10-question lifestyle quiz covering tea, weather small talk, queueing, Bank Holidays, biscuits and the unspoken rules of pub etiquette. UK Slang Quiz tests your knowledge of regional vocabulary from 'mardy' (Midlands) and 'minted' (general UK) to 'bairn' (North East and Scotland) and 'bevvy' (everywhere with a pub).",
          "The General Knowledge Daily Quiz refreshes every 24 hours so you've always got something new to play. Topics span UK history, geography, music, sport, telly and current affairs — calibrated to be fair to a thoughtful adult without being insulting to anyone who actually paid attention at school.",
        ],
      },
      {
        heading: "Who they're for",
        body: [
          "These quizzes are aimed at anyone who lives in the UK, has lived in the UK, or fancies the UK from afar. Family-friendly and free of profanity, they work for kids, grandparents, pub teams, classroom warm-ups and overseas friends curious about British culture.",
          "If you're studying for the Life in the UK Test, the General Knowledge Daily Quiz is also a low-pressure way to soak up cultural context that the official handbook doesn't cover.",
        ],
      },
      {
        heading: "How to play",
        body: [
          "Pick a quiz, work through the 10–24 questions at your own pace, and get a shareable score at the end. There's no time limit, no sign-up and no penalty for guessing.",
          "If you want to play with friends, copy the share link from the result page — they'll see the same questions in the same order so you can compare scores fairly.",
        ],
      },
      {
        heading: "Why fun quizzes are good for your brain",
        body: [
          "Short, low-stakes quizzes are great for taking a screen break without going full-on doom-scroll. They activate the same active-recall pathways as exam revision, but with no pressure and no marking. Perfect for a coffee break, the bus home, or a wind-down after work.",
          "Regular quiz play is also linked in the cognitive science literature to better long-term retention of general knowledge — your brain treats retrieval as a vote of importance for whatever it just dredged up. So the more pub trivia you do, the more pub trivia you'll know. Funny how that works.",
          "There's also the social side. Quizzes are one of the few digital activities that get better with people in the room rather than worse. Run one over Sunday lunch, on a long car journey, or in the staff kitchen on a slow Friday afternoon — they're cheap, quick and reliably get a laugh.",
        ],
      },
      {
        heading: "Ideas for using these quizzes",
        body: [
          "Use the daily General Knowledge quiz as a five-minute morning warm-up — many users tell us it wakes them up faster than the second cup of coffee. The How British Are You quiz is a great icebreaker for new arrivals, exchange students or international colleagues curious about UK culture.",
          "Teachers, ESOL tutors and community group leaders are welcome to use these quizzes in the classroom or at events. Everything is free, mobile-friendly and works without sign-up, so you can pull a quiz up on a projector or share the link in a group chat without anyone having to register.",
          "If you spot a question that's out of date, unfair or just wrong, send us a note via the contact page — we update the question bank regularly and reader reports are triaged within two working days.",
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

  "taxi-private-hire": {
    title: "TfL Taxi & Private Hire Practice 2026 | SERU, Topographical, ULEZ",
    description:
      "Free practice tests for London PHV and taxi drivers — TfL SERU, Topographical Assessment, PHV licence, ULEZ, Congestion Charge, safeguarding, English and accessibility.",
    intro: [
      "Driving a London private hire vehicle (PHV) or licensed taxi is one of the most regulated jobs on the road. Before you turn the wheel for fares, Transport for London expects you to demonstrate the right knowledge, judgement and language skills — and to keep proving them at every renewal. Our Taxi & Private Hire hub brings every assessment a London driver is likely to face into one free, browser-based practice library so you can revise the SERU, the Topographical Assessment, the PHV licence knowledge, ULEZ and Congestion Charge rules, safeguarding awareness and accessibility duties without juggling ten different sources.",
      "Everything below is written in plain UK English by a small team that has worked alongside London PHV applicants for years. UK Test Hub is fully independent and is not affiliated with TfL or the Mayor of London — we simply turn the official requirements into structured practice you can fit around shifts, family and study.",
    ],
    sections: [
      {
        heading: "What London PHV and taxi assessments cover",
        body: [
          "The licensing journey begins with proving you are a 'fit and proper person' to hold a TfL licence. That means an Enhanced DBS check, a DVLA Group 2 medical, evidence of your right to work in the UK and an HMRC tax check at every renewal. On top of that, applicants must show English language ability at CEFR B1 or above and pass the Safety, Equality and Regulatory Understanding (SERU) assessment.",
          "Most new private hire drivers also sit a Topographical Assessment to show they can read maps, plan sensible routes around London and identify major landmarks, postcodes and crossings. Black-cab drivers go much further with the Knowledge of London, but PHV applicants need solid practical orientation, which is exactly what our topographical practice tests rehearse.",
          "Once licensed, drivers must keep up to date with everyday rules: the Congestion Charge, Ultra Low Emission Zone (ULEZ), safeguarding obligations toward children and vulnerable adults, accessibility duties for wheelchair users and assistance dog owners, badge display requirements and how to handle conduct, complaints and incidents.",
        ],
      },
      {
        heading: "Why we built a dedicated SERU practice bank",
        body: [
          "The SERU assessment is the single biggest hurdle most London PHV applicants face. It is sat at a TfL service centre, includes around 70 questions in fill-the-gap and multiple-choice formats, and tests how well you understand safety, equality and the regulatory framework — not just whether you can recite facts.",
          "Our SERU mock tests follow the same wording style as the real paper: short scenarios, exact terminology and traps for candidates who guess. Every answer comes with an explanation that links the right behaviour back to the underlying law, such as the Equality Act 2010, the Private Hire Vehicles (London) Act 1998 or TfL's standards for drivers and operators.",
          "We strongly recommend taking each SERU mock at least twice — once cold to expose gaps, and once after revising — before you book the official assessment. TfL charges a fee for each attempt, and waiting times for resits can easily push your start date back by weeks.",
        ],
      },
      {
        heading: "Topographical, ULEZ and Congestion Charge practice",
        body: [
          "Topographical questions are practical: 'Which is the most direct route from A to B?', 'Which postcode covers Pimlico?', 'Which crossing connects Wapping to Rotherhithe?' Strong candidates use a paper A–Z and a digital map together when they revise. Our quick mocks repeat the most commonly tested junctions, bridges and London airports so the answers become automatic.",
          "ULEZ and Congestion Charge questions appear in SERU, in TfL's compliance materials and in any operator induction. Our dedicated quizzes cover the operating hours, exemptions, vehicle compliance standards (Euro 4 petrol / Euro 6 diesel for most cars) and what happens if you receive a Penalty Charge Notice. These are the questions passengers ask in the cab too — knowing them confidently is part of the job.",
        ],
      },
      {
        heading: "Safeguarding, accessibility and conduct",
        body: [
          "Modern PHV drivers are expected to recognise safeguarding red flags — child sexual exploitation, county lines, trafficking, vulnerable adults at risk — and to know how and when to report them. Our safeguarding awareness practice rehearses real scenarios you might face on a school run or late-night airport job.",
          "Accessibility duties are equally serious. Refusing an assistance dog without a medical exemption, or charging extra to a wheelchair user, is a criminal offence under the Equality Act 2010. Our assistance dogs and wheelchair-assistance quizzes cover the legal duties, the practical etiquette and the exemption process.",
          "Conduct, complaints and incident handling round out the picture. Every quiz emphasises de-escalation, professionalism and the legal responsibility to report road traffic collisions, suspected spiking and any safeguarding concern through the proper channels.",
        ],
      },
      {
        heading: "How to use this hub",
        body: [
          "Start with the SERU and Topographical mocks if you are pre-licence. Book the official assessments only when you are scoring 90%+ on the practice papers two attempts in a row.",
          "Already licensed? Use the rule-of-the-road quizzes — Congestion Charge, ULEZ, badge rules, HMRC tax check, London PH regulations — as a quick monthly refresher. Things change: the ULEZ expansion in August 2023, the introduction of HMRC tax checks in April 2022 and updates to the Equality Act guidance are recent examples.",
          "All our practice content is free, mobile-friendly and saves your best scores locally. There is no sign-up, no email required, and no paywall.",
        ],
      },
      {
        heading: "Independent and unaffiliated",
        body: [
          "UK Test Hub is an independent practice platform. We are not affiliated with Transport for London, the Mayor of London, the DVSA, the DVLA or HMRC. Official rules, fees, exam formats and policies are set by those bodies and may change — always confirm key details on tfl.gov.uk and gov.uk before booking. Where we summarise rules, we do so in our own words to avoid copying TfL text directly, and we update content as the rules evolve.",
        ],
      },
    ],
    faqs: [
      { q: "Do I need to pass SERU to drive a PHV in London?", a: "Yes. All new PHV applicants must pass the SERU assessment as part of the TfL licensing process." },
      { q: "Is there a Topographical Assessment for PHV drivers?", a: "Yes. Most new applicants must pass a Topographical Skills Assessment to show they can read maps and plan routes around London." },
      { q: "What English level do TfL require?", a: "TfL require evidence of English at CEFR B1 or higher, usually through a SELT or a qualifying UK qualification." },
      { q: "Are PHVs exempt from the Congestion Charge?", a: "Most PHVs are not exempt and must pay; only specific exemptions apply. Licensed London taxis are exempt." },
      { q: "Does ULEZ cover the whole of London?", a: "Yes. Since August 2023 the Ultra Low Emission Zone applies across all London boroughs." },
      { q: "Can I refuse an assistance dog if I'm allergic?", a: "Only with a TfL-approved medical exemption certificate displayed in the vehicle. Refusing without one is a criminal offence." },
      { q: "What is the HMRC tax check?", a: "Since April 2022, you must complete an HMRC tax check before TfL will renew your PHV licence. You receive a 9-character code valid for 120 days." },
      { q: "Are these tests the official TfL exam?", a: "No. We are an independent platform. Our tests are realistic practice papers; they are not affiliated with TfL." },
    ],
  },
};
