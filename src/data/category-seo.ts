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
    title: "Driving Mock Tests | UK Test Hub",
    description:
      "Free UK Driving Theory practice tests for 2026. Realistic DVSA-style questions, hazard perception, road signs and motorcycle theory with full explanations.",
    intro: [
      "Passing the UK Driving Theory Test on the first attempt takes more than memorising answers. The DVSA exam is split into 50 multiple-choice questions and a hazard perception clip section, and you need to do well on both to walk away with a provisional pass certificate. Our free Driving Theory practice tests designed to reflect common exam formats so you can train under realistic conditions, build pace, and learn the reasoning behind every answer rather than just the letter.",
      "Whether you're booking your first test, retaking after a near miss, or preparing for the Motorcycle Theory or Road Signs Test, you'll find unlimited mock exams, instant scoring and detailed explanations. All questions are updated for 2026 and reflect the latest Highway Code revisions, including the changes to the hierarchy of road users and the new rules on overtaking cyclists and horse riders.",
    ],
    sections: [
      {
        heading: "What the test actually involves",
        body: [
          "The DVSA Driving Theory Test runs for around 90 minutes from check-in to your printed result slip. You'll sit at a Pearson VUE workstation with headphones and complete two parts back to back: 50 multiple-choice questions in 57 minutes, then a short break, then 14 video clips containing 15 developing hazards.",
          "The multiple-choice section is drawn from a large question bank, so candidates may see different papers. The pass mark is 43 out of 50. Hazard perception is scored from 0–5 per developing hazard depending on how early you identify it, with a pass mark of 44 out of 75. You must pass both parts at the same sitting — if you fail one part, you fail the whole theory test.",
          "Bring your provisional licence, arrive 15 minutes early, and switch your phone off completely. Late arrivals lose the £23 fee and have to rebook on gov.uk.",
        ],
      },
      {
        heading: "What's covered in the syllabus",
        body: [
          "The full Driving Theory question bank covers the DVSA syllabus: alertness, attitude, safety and your vehicle, safety margins, hazard awareness, vulnerable road users, other types of vehicle, vehicle handling, motorway rules, rules of the road, road and traffic signs, documents, accidents, and vehicle loading.",
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
          "Mocks also dismantle exam anxiety. The first time you see a DVSA-style practice question shouldn't be at the test centre. By the time you've completed five to ten mocks, the format feels familiar and you can focus your mental energy on the content rather than the interface. Completing several mock tests before the real exam can make the format feel more familiar and help you spot weak areas before test day.",
          "There's also a simple cost argument. The DVSA fee is £23 per attempt, plus the time off work and the stress of rebooking. Because the theory test fee and rebooking delay can add up, regular free practice is a sensible way to prepare before paying for another attempt. Treat practice as a financial decision, not just an academic one.",
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
    title: "Life in the UK Tests | UK Test Hub",
    description:
      "Free Life in the UK Test practice for 2026. Official handbook coverage, British history, traditions and government with realistic 24-question mocks.",
    intro: [
      "The Life in the UK Test is a 45-minute, 24-question exam that you must pass to apply for British citizenship or Indefinite Leave to Remain. The questions are drawn from the official Home Office handbook, Life in the United Kingdom: A Guide for New Residents, and you need to score at least 75% — that's 18 out of 24 — to pass. It sounds gentle on paper, but the dates, names and constitutional details trip up thousands of candidates every year.",
      "Our free Life in the UK practice tests are designed to reflect the format of the real exam, with four question styles, a 45-minute clock and a similar difficulty spread. Use them alongside the handbook to memorise dates, monarchs, traditions and the structure of UK government with real confidence rather than vague familiarity.",
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
    title: "English Language Tests | UK Test Hub",
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
    title: "11+, GCSE & SATs Mock Tests | UK Test Hub",
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
    title: "Aptitude & Psychometric Tests | UK Test Hub",
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
    title: "Workplace Compliance Tests | UK Test Hub",
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
    title: "NHS Mock Tests | UK Test Hub",
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
          "The NMC CBT is the formal entry test for overseas-trained nurses applying to register in the UK. The full test has 115 questions over 3 hours: 15 numeracy questions in Part A and 100 clinical multiple-choice questions in Part B. It is taken at a Pearson VUE centre worldwide. You must pass the CBT before you can sit the OSCE in the UK.",
        ],
      },
      {
        heading: "What's tested",
        body: [
          "NHS numeracy assessments cover drug calculations (mg/kg, IV infusions, drops per minute), basic arithmetic, percentages, fluid balance and unit conversions.",
          "NHS literacy tests cover comprehension, spelling, grammar and the ability to summarise written information accurately. Many tests include a passage-and-questions section based on a clinical scenario.",
          "Values-Based Recruitment uses scenarios mapped to the NHS Constitution (compassion, respect, dignity, working together, commitment to quality of care). The NMC CBT has two parts: Part A is a 15-mark numeracy assessment, and Part B is 100 four-option multiple-choice clinical questions covering Professional Values, Communication and Interpersonal Skills, Nursing Practice and Decision-Making, and Leadership, Management and Team Working.",
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
      { q: "What is the NMC CBT pass mark?", a: "You must pass both parts. Part A numeracy is pass/fail. Part B uses a modified Angoff method to set the pass mark; candidates who score above 70% across all four professional domains generally pass." },
      { q: "How many questions are in the NMC CBT?", a: "115 questions in total: 15 numeracy questions in Part A and 100 four-option multiple-choice clinical questions in Part B." },
      { q: "How long is the NMC CBT?", a: "3 hours in total: 30 minutes for Part A numeracy and 2 hours 30 minutes for Part B clinical." },
      { q: "What are NHS Values-Based Recruitment questions like?", a: "Workplace scenarios mapped to the NHS Constitution. You'll be asked which response best reflects NHS values, or to rank responses from most to least appropriate." },
      { q: "What level of maths is on NHS numeracy tests?", a: "Roughly GCSE Foundation level, with a heavy focus on drug calculations, percentages, ratios and unit conversions." },
      { q: "Can overseas nurses take the NMC CBT in their home country?", a: "Yes — the CBT is delivered worldwide via Pearson VUE test centres. The Objective Structured Clinical Examination (OSCE) must be taken in the UK." },
      { q: "Are these NHS mocks free?", a: "Yes, every NHS numeracy, literacy, values and NMC CBT mock on UK Test Hub is free." },
    ],
  },

  fun: {
    title: "Fun UK Quizzes | UK Test Hub",
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
    title: "Taxi & Private Hire Tests | UK Test Hub",
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
          "The SERU assessment is the single biggest hurdle most London PHV applicants face. It is sat at a TfL service centre and is based on the Private Hire Driver's Handbook, covering safety, equality and regulatory understanding. Questions are a mix of multiple-choice and missing-word / sentence-completion style — they test whether you can apply the rules to real passenger scenarios, not whether you can recite facts.",
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

  security: {
    title: "SIA Licence Tests | UK Test Hub",
    description:
      "Free SIA mock tests for 2026 — Door Supervisor, CCTV Operator, Close Protection and the Door Supervisor Top-Up. Realistic UK questions with explanations.",
    intro: [
      "The Security Industry Authority (SIA) licence is a legal requirement for anyone working in the UK private security industry. To get one, you must complete an approved training course and pass a series of multiple-choice exams set by an Ofqual-recognised awarding body such as Highfield, Pearson, Industry Qualifications or BIIAB. The pass mark is 70% on most papers and the exams are unforgiving — one missed regulatory point can be the difference between a job offer and another £200 on a re-sit.",
      "Our free SIA practice tests cover the four most common licence routes: Door Supervisor, CCTV Operator, Close Protection and the Door Supervisor Top-Up that existing licence holders need before renewal. Every question follows the current SIA specification, including the 2021 syllabus updates around terror awareness (ACT), emergency first aid and physical intervention, so you train on what's actually being tested today.",
    ],
    sections: [
      {
        heading: "What the tests actually involve",
        body: [
          "SIA exams are typically delivered on paper or on a tablet at the end of your training course. Door Supervisor sits four short multiple-choice papers — Working in the Private Security Industry, Working as a Door Supervisor, Conflict Management, and Physical Intervention Skills (theory). CCTV Operator sits two papers; Close Protection sits four. Each paper is 30–40 questions with a 30–45 minute time limit and a 70% pass mark.",
          "After passing, you apply to the SIA for the licence itself via gov.uk. The licence fee in 2026 is £190 and the licence lasts three years. You must also pass a Disclosure and Barring Service (DBS) check and confirm your right to work in the UK.",
          "The Top-Up qualification is a one-day course and short exam introduced in 2021 to update existing Door Supervisors on terror threat awareness, emergency first aid and the latest physical intervention guidance. You cannot renew your Door Supervisor licence without it.",
        ],
      },
      {
        heading: "What's covered in the syllabus",
        body: [
          "Door Supervisor covers the Private Security Industry Act 2001, the SIA's role, behavioural standards, search procedures, the Licensing Act 2003, drug awareness, crime scene preservation, queue and crowd management, conflict management (the LEAPS model), de-escalation, and the legal framework for using physical intervention as a last resort.",
          "CCTV Operator covers the Data Protection Act 2018 and UK GDPR, the Surveillance Camera Code of Practice, control room operation, target acquisition and tracking, evidence preservation and the powers and limitations of the operator.",
          "Close Protection covers threat and risk assessment, route reconnaissance, embus/debus drills, venue security, the law on the use of reasonable force, and the operational tactics used to keep a principal safe in public.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "Trust the official handbook your training provider gives you — the questions are written directly from it. Re-reading each chapter once and then drilling mock papers is faster than highlighting the book to death.",
          "Memorise the LEAPS conflict model (Listen, Empathise, Ask, Paraphrase, Summarise), the four conditions for using force (lawful, reasonable, proportionate, necessary), and the Door Supervisor's five legal powers of search.",
          "For CCTV, learn the seven UK GDPR principles and the difference between a 'data controller' and a 'data processor' — these come up in nearly every paper.",
          "Sit at least three full mocks under timed conditions before your real exam. Most candidates fail on pace, not on knowledge.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "Confusing 'reasonable force' with 'minimum force'. The legal test is whether the force was reasonable in the circumstances — proportionate, necessary and used as a last resort.",
          "Getting the Licensing Act 2003 age limits wrong: 16 for beer/wine/cider with a table meal accompanied by an adult, 18 for everything else off the premises.",
          "On CCTV, candidates often forget that any covert surveillance triggers RIPA / IPA considerations and needs documented authorisation, not just a verbal nod from a supervisor.",
        ],
      },
      {
        heading: "Why active practice testing works",
        body: [
          "SIA exams are short, dense and procedural. The questions reward exact recall of legal definitions and named models — exactly the kind of content that retrieval practice locks in faster than re-reading.",
          "Each re-sit costs £30–£60 depending on the awarding body, plus the inconvenience of returning to your training centre. Twenty minutes a day of free mocks for a week is one of the highest-return revision activities in UK vocational training.",
          "Mocks also normalise the dry, formal phrasing used in SIA papers. Once you've seen 'Which of the following best describes the role of the SIA?' five times, you stop second-guessing the question stem and answer it on instinct.",
        ],
      },
      {
        heading: "Applying for your SIA licence",
        body: [
          "Once you've passed your training exams, you apply for the licence on gov.uk. You'll need your training certificate reference number, a DBS check, proof of right to work, and a passport-style photo. The fee is £190 and applications are usually processed within six weeks.",
          "Your licence arrives as a credit-card-sized card that must be displayed on the outside of your clothing whenever you're working in a licensable role. Working without a valid SIA licence is a criminal offence carrying a fine of up to £5,000 or six months in prison.",
          "Renew at least four months before expiry. Late renewals mean you cannot legally work in the meantime, even if your application is sitting in the SIA's queue.",
        ],
      },
    ],
    faqs: [
      { q: "What is the pass mark for SIA exams?", a: "Most SIA exams require 70% to pass — that's typically 21 out of 30 or 28 out of 40 depending on the paper." },
      { q: "How much does an SIA Door Supervisor licence cost in 2026?", a: "The SIA application fee is £190. The training course itself usually costs £200–£350 on top of that." },
      { q: "How long does an SIA licence last?", a: "Three years from the date of issue. You must complete the Top-Up qualification before renewal." },
      { q: "Do I need a DBS check for an SIA licence?", a: "Yes — the SIA carries out an enhanced criminality check as part of every application. Recent unspent convictions can result in refusal." },
      { q: "Can I work while my SIA application is being processed?", a: "Only if you appear on the SIA's online register. Working without an in-date licence on display is a criminal offence." },
      { q: "What is the SIA Top-Up qualification?", a: "A one-day course covering terror awareness (ACT), emergency first aid and updated physical intervention guidance. It's mandatory for Door Supervisor renewals." },
      { q: "Are these SIA mocks free?", a: "Yes. Every Door Supervisor, CCTV, Close Protection and Top-Up mock on UK Test Hub is free to use." },
    ],
  },

  hospitality: {
    title: "Hospitality Tests | UK Test Hub",
    description:
      "Free practice tests for hospitality professionals — Personal Licence (APLH), Allergen Awareness, HACCP Level 2 and customer service. Realistic UK questions with explanations.",
    intro: [
      "Hospitality in the UK runs on certificates: a Personal Licence (APLH) to authorise alcohol sales, a Level 2 Award in Allergen Awareness to comply with Natasha's Law and the Food Information Regulations, HACCP Level 2 for any kitchen producing food at scale, and customer service training that increasingly forms part of pre-employment screening for hotels and chains. None of these exams are difficult, but each one stops you starting work until you've passed it.",
      "Our free hospitality mocks mirror the exact format used by the major awarding bodies — Highfield, BIIAB, RSPH and CIEH — so you can train against real exam wording, not generic study notes. UK English, current legislation, current pass marks and the same multiple-choice patterns you'll see on the day.",
    ],
    sections: [
      {
        heading: "What the tests actually involve",
        body: [
          "The Award for Personal Licence Holders (APLH) is a 40-question multiple-choice exam with a 70% pass mark, sat at the end of an accredited one-day course. You must pass APLH before you can apply to your local council for the Personal Licence itself.",
          "Allergen Awareness Level 2 and HACCP Level 2 are typically 20–30 question multiple-choice exams sat online or on paper at the end of training. Pass marks sit at 75% for most awarding bodies. Customer Service practice tests are used in chain pre-employment screening (hotels, contract caterers) and follow situational-judgement formats with no formal pass mark — recruiters rank candidates by overall score.",
        ],
      },
      {
        heading: "What's covered in the syllabus",
        body: [
          "APLH covers the Licensing Act 2003 in detail: the four licensing objectives, the role of the Designated Premises Supervisor, conditions on the premises licence, age verification (Challenge 25), drunkenness offences, and the legal duties of a Personal Licence Holder. Expect questions on the difference between an on-licence and an off-licence and on Temporary Event Notices.",
          "Allergen Awareness covers the 14 named allergens under FSA / EU 1169 rules, Natasha's Law (PPDS labelling), cross-contamination, customer information at point of sale and the legal consequences of getting it wrong.",
          "HACCP Level 2 covers the seven principles of HACCP, the temperature danger zone (8°C to 63°C), the four Cs (Cleaning, Cooking, Chilling, Cross-contamination), critical control points, monitoring and corrective actions.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "Memorise the four licensing objectives (prevention of crime and disorder, public safety, prevention of public nuisance, protection of children from harm). They appear in almost every APLH paper.",
          "Learn the 14 named allergens by heart for Allergen Awareness — celery, cereals containing gluten, crustaceans, eggs, fish, lupin, milk, molluscs, mustard, peanuts, sesame, soya, sulphur dioxide and sulphites, and tree nuts.",
          "For HACCP, learn the seven principles in order: hazard analysis, identify CCPs, set critical limits, monitor CCPs, corrective action, verification, documentation. The order matters — questions test it.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "On APLH, candidates confuse Challenge 21 (industry initiative) with Challenge 25 (the standard most councils now require). Always go with the higher number unless the question says otherwise.",
          "On Allergens, the most-missed point is that Natasha's Law applies specifically to PPDS food (prepacked for direct sale) — not to food made to order at the counter, which has separate rules.",
          "On HACCP, candidates confuse the temperature danger zone (8°C to 63°C) with the cooking core temperature (75°C for 30 seconds or equivalent). Both come up and they test different things.",
        ],
      },
      {
        heading: "Why practice tests work",
        body: [
          "Hospitality exams are pass/fail and a re-sit fee of £30–£80 plus another half-day of training quickly adds up. Mocks remove the surprise element so you focus on content, not format.",
          "These exams are also dense with named legislation and numbers — Licensing Act 2003, Food Safety Act 1990, Natasha's Law, the 14 allergens, the four Cs, the seven HACCP principles. Active recall in mock format is far more efficient than re-reading the handbook for the third time.",
        ],
      },
    ],
    faqs: [
      { q: "What is the pass mark for the APLH exam?", a: "70%, which is 28 out of 40 questions correct in the standard one-hour multiple-choice paper." },
      { q: "How much does a Personal Licence cost in the UK?", a: "The training and APLH exam typically cost £100–£180. The licence itself, paid to your local council, costs £37 in most areas." },
      { q: "How long is an APLH certificate valid?", a: "The qualification has no expiry, but the Personal Licence used to require renewal — that requirement was removed in 2015, so a current Personal Licence is now indefinite." },
      { q: "How many named food allergens must businesses declare?", a: "14 — including celery, gluten-containing cereals, crustaceans, eggs, fish, lupin, milk, molluscs, mustard, peanuts, sesame, soya, sulphites and tree nuts." },
      { q: "What is Natasha's Law?", a: "A 2021 UK law requiring full ingredient and allergen labelling on food prepacked for direct sale (PPDS) — sandwiches, salads and similar items made on site for the same-day shelf." },
      { q: "How long does HACCP Level 2 certification last?", a: "Three years is the industry-standard refresh cycle, although there is no statutory expiry on the qualification itself." },
      { q: "Are these hospitality mocks free?", a: "Yes. APLH, Allergen Awareness, HACCP and customer service mocks on UK Test Hub are all free to use." },
    ],
  },

  construction: {
    title: "CSCS & CITB Tests | UK Test Hub",
    description:
      "Free CSCS and CITB practice tests — CSCS Operative, CSCS Gold (Supervisor), CITB Health, Safety & Environment and IPAF / PASMA Working at Height mocks for UK sites.",
    intro: [
      "Almost every UK construction site requires a valid CSCS card before you set foot on it, and the CITB Health, Safety & Environment (HS&E) test is the gateway to getting one. The test is set by the Construction Industry Training Board, sat at a Pearson VUE centre, and uses the same format whether you're going for a green Labourer card, a blue Skilled Worker card or a gold Supervisor card. There are 50 multiple-choice questions, a 45-minute time limit and a 47-out-of-50 pass mark — strict by exam standards, and the reason a third of candidates fail at first attempt.",
      "Our free CSCS and CITB mocks mirror the official HS&E test format exactly, with the same five core sections, behavioural-case-study questions and a separate Working at Height bank for IPAF / PASMA tickets. Every question is written to current CITB syllabus and reflects the post-2024 revision adding mental health and respiratory awareness.",
    ],
    sections: [
      {
        heading: "What the test actually involves",
        body: [
          "The CITB HS&E test is a 50-question computer-based exam taken at a Pearson VUE test centre. You get 45 minutes, the pass mark is 47 out of 50, and 12 of the questions are behavioural case studies that test how you'd respond on site, not just what the rule book says.",
          "The Operative test is for green-card and lower-tier blue-card applicants. The Specialist test is for occupations like demolition, scaffolding or working at height. The Managers and Professionals (MAP) test is for gold and black cards and is harder, with deeper coverage of the Construction (Design and Management) Regulations 2015.",
          "Once you pass, you apply for the CSCS card itself — the fee in 2026 is £36 and the card lasts five years. You also need an in-date Level 1 Award in Health & Safety in a Construction Environment for green-card applicants who don't have an NVQ.",
        ],
      },
      {
        heading: "What's covered in the syllabus",
        body: [
          "The five core sections are: General responsibilities (your duties under the Health and Safety at Work etc. Act 1974); Accident reporting and emergency procedures (RIDDOR, first aid, fire); Health and welfare (noise, hand-arm vibration, dust, manual handling, mental health); Personal protective equipment; and Specialist activities (scaffolding, working at height, electrical safety, confined spaces).",
          "Behavioural case studies present a short site scenario and ask you to choose the response that best matches the CITB's safety-first culture. The 'right' answer is almost always the one that protects life and reports the issue, even if it slows the job down.",
          "IPAF and PASMA tests cover working at height legislation (Work at Height Regulations 2005), MEWP categories (1a, 1b, 3a, 3b), tower scaffold assembly (3T and AGR methods) and rescue planning.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "Buy or download the current CITB revision app — questions on the test are drawn from the same official bank, so practising the bank gives you the highest possible coverage.",
          "Drill the behavioural case studies separately. The format is unfamiliar to most candidates and they account for 12 of the 50 questions. Always answer in line with 'safety first, report up, never assume'.",
          "Memorise the noise action values (80 dB(A) lower / 85 dB(A) upper), HAV exposure action value (2.5 m/s² A(8)) and the trigger times for vibrating tool restrictions — these come up in nearly every paper.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "Treating behavioural questions like knowledge questions and second-guessing the obvious safe answer. The CITB wants you to choose the protective response — even if you wouldn't in real life.",
          "Confusing RIDDOR reporting timescales: 'over-7-day' incapacitation must be reported within 15 days, dangerous occurrences and fatalities without delay.",
          "Getting the order of the hierarchy of control wrong. It's: Eliminate, Substitute, Engineering controls, Administrative controls, PPE — in that order. PPE is always the last line of defence.",
        ],
      },
      {
        heading: "Why active practice testing works",
        body: [
          "The CITB test is famously dense and the 47/50 pass mark leaves no margin for error. Mocks let you see exactly which of the five sections is dragging your average down before you sit at Pearson VUE.",
          "Each re-sit costs £22.50 and adds at least a week of waiting — and many sites won't let you start until your card is in your hand. Free practice for a week is the cheapest insurance against another month of delay.",
        ],
      },
      {
        heading: "Booking, fees and what to expect on the day",
        body: [
          "Book the HS&E test through the official CITB website — the fee is £22.50 in 2026 and slots are available at Pearson VUE centres across the UK, usually within a week.",
          "On the day, arrive 15 minutes early with photo ID matching the name on your booking. Phones go in a locker. The test runs on a touch-screen workstation and you get your provisional result immediately on screen, with a printed confirmation handed over before you leave.",
          "Once you've passed, apply for your CSCS card via the CSCS Smart Check app or the CSCS website. Cards are usually issued within 10 working days.",
        ],
      },
    ],
    faqs: [
      { q: "What is the CITB HS&E test pass mark?", a: "47 out of 50 — one of the strictest pass marks in UK vocational testing." },
      { q: "How much does the CITB HS&E test cost in 2026?", a: "£22.50, booked through the official CITB website. Avoid third-party booking sites that add a markup." },
      { q: "How long does a CSCS card last?", a: "Five years from the date of issue. You'll need to retake the relevant CITB test before renewal." },
      { q: "What's the difference between the Operative and MAP tests?", a: "Operative is for green and lower-tier blue cards; MAP (Managers and Professionals) is for gold and black cards and tests deeper knowledge of CDM 2015 and supervisory responsibilities." },
      { q: "Do I need IPAF or PASMA as well as CSCS?", a: "If your job involves MEWPs (IPAF) or mobile tower scaffolds (PASMA), most main contractors require the relevant ticket on top of CSCS." },
      { q: "Can I take the CITB test in another language?", a: "Yes — the test is available with a voiceover in a range of languages and in British Sign Language, but you must request this when booking." },
      { q: "Are these CSCS / CITB mocks free?", a: "Yes. Every CSCS Operative, CSCS Gold, CITB HS&E and IPAF / PASMA mock on UK Test Hub is free to use." },
    ],
  },

  finance: {
    title: "Finance & Accounting Tests | UK Test Hub",
    description:
      "Free practice tests for AAT Level 2 Bookkeeping, ACCA Foundations (FIA), CFA-style aptitude and general financial awareness. Realistic UK exam-style questions with explanations.",
    intro: [
      "If you're starting a career in UK accounting or finance, the early exams open every door that follows. AAT Level 2 Bookkeeping is the most common first step, ACCA Foundations (FIA) is the alternative for those aiming straight at chartered status, and CFA-style aptitude tests dominate graduate scheme screening at investment banks and asset managers. A solid pass on any one of these can lift your starting salary by several thousand pounds.",
      "Our free finance mocks mirror the official AAT and ACCA computer-based assessment format and the timed numerical / verbal aptitude format used by the major City employers. UK English, UK accounting standards (FRS 102, FRS 105) and HMRC tax conventions throughout — not US GAAP.",
    ],
    sections: [
      {
        heading: "What the tests actually involve",
        body: [
          "AAT Level 2 Bookkeeping is delivered as a computer-based assessment (CBA) under exam conditions at an approved AAT venue. The two main units — Bookkeeping Transactions and Bookkeeping Controls — are each two hours long with a 70% pass mark.",
          "ACCA Foundations (FIA) papers are also computer-based, sat on demand at Pearson VUE centres. Each paper runs two hours and uses a 50% pass mark.",
          "CFA-style aptitude tests are typically 25–30 minute timed online assessments combining numerical reasoning (data tables, percentages, ratios), verbal reasoning and basic financial concepts. There's no formal pass mark — recruiters compare candidates against percentile benchmarks for the role.",
        ],
      },
      {
        heading: "What's covered",
        body: [
          "AAT Bookkeeping Transactions covers double-entry, books of prime entry, the trial balance, VAT on sales and purchases, and the principles of ethics. AAT Bookkeeping Controls covers control accounts, journals, the bank reconciliation, payroll postings and correction of errors.",
          "ACCA Foundations papers cover Recording Financial Transactions (FA1), Maintaining Financial Records (MA1) and Management Information (MA2) — the equivalents of AAT Levels 2 and 3 but with an IFRS-leaning syllabus.",
          "CFA-style aptitude papers focus on speed and accuracy with percentages, ratios, growth rates and chart interpretation. Expect 60–90 seconds per question.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "For AAT, drill the double-entry rules until they're automatic: debits increase assets and expenses; credits increase liabilities, equity and income. Memorise the standard VAT rate (20%), the reduced rate (5%) and the registration threshold (£90,000 from April 2024).",
          "For ACCA Foundations, work the official BPP or Kaplan question banks — exam questions are drawn from the same style and weighting.",
          "For aptitude tests, practise mental maths under a timer. The right answer with one second to spare is worth far more than the perfect calculation that takes too long.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "Confusing the gross / net / VAT relationship. If a sale is £120 inclusive of 20% VAT, the VAT element is £20 (gross ÷ 6), not £24 (£120 × 20%).",
          "Forgetting that a discount allowed is an expense to the seller and a discount received is an income to the buyer.",
          "On aptitude tests, spending too long on the first few questions and running out of clock for the easier ones at the end. Always scan the whole paper first if the format allows.",
        ],
      },
      {
        heading: "Why active practice testing works",
        body: [
          "Finance exams are pattern-matching exercises. Once you've drilled fifty mock VAT or double-entry questions, the unfamiliar wording in the real exam stops being unfamiliar — you recognise the pattern and answer in seconds.",
          "Each AAT and ACCA re-sit costs £70–£120 and adds at least a month before you can re-book, so practice is the highest-return revision activity in early-career finance.",
        ],
      },
      {
        heading: "Booking and what to expect",
        body: [
          "Book AAT exams through your training provider or directly via the AAT website once you're a registered student. ACCA Foundations exams book through Pearson VUE on demand, with slots usually available within two weeks.",
          "Aptitude tests are sent by recruiters as an emailed link — the deadline is typically five working days. You're free to use scrap paper and a calculator unless the test instructions say otherwise.",
        ],
      },
    ],
    faqs: [
      { q: "What is the pass mark for AAT Level 2 Bookkeeping?", a: "70%, applied across the two main computer-based assessments." },
      { q: "How much does an AAT Level 2 Bookkeeping exam cost?", a: "Around £70–£90 per assessment, plus the AAT student membership fee of around £172 a year (2026)." },
      { q: "What's the difference between AAT and ACCA Foundations?", a: "AAT is the UK industry-standard route for bookkeepers and accounting technicians. ACCA Foundations is a feeder qualification for full chartered ACCA status and uses an IFRS-leaning syllabus." },
      { q: "Do I need a degree for the CFA?", a: "Yes, or four years of relevant professional work experience, or a combination of education and experience totalling four years before you can register for Level 1." },
      { q: "How fast do I need to be on graduate aptitude tests?", a: "Plan for around 60–90 seconds per question. Speed matters as much as accuracy on numerical reasoning." },
      { q: "Are these finance mocks free?", a: "Yes. Every AAT, ACCA Foundations, CFA aptitude and financial awareness mock on UK Test Hub is free to use." },
    ],
  },

  "it-tech": {
    title: "IT & Tech Certification Tests | UK Test Hub",
    description:
      "Free practice tests for CompTIA A+, ITIL 4 Foundation, Microsoft Azure Fundamentals (AZ-900), Microsoft 365 Fundamentals (MS-900) and Cyber Security Awareness. Realistic exam-style questions with explanations covering Azure cloud concepts, Azure services, Azure pricing and Microsoft 365.",
    intro: [
      "Entry-level IT certifications are the cheapest career insurance you can buy. CompTIA A+ proves you can support hardware, networking and operating systems; ITIL 4 Foundation proves you understand modern service management; Microsoft Fundamentals (MS-900 for Microsoft 365, AZ-900 for Azure) opens the door to cloud roles; and Cyber Security Awareness is the baseline that almost every UK employer now requires before granting a network login.",
      "Our free IT and tech mocks mirror the official Pearson VUE and PSI exam formats — multiple-choice, drag-and-drop and short performance-based items — using current UK and global syllabuses. Question banks are refreshed when the official objectives change, so the wording and topic mix match what you'll actually face.",
    ],
    sections: [
      {
        heading: "What the tests actually involve",
        body: [
          "CompTIA A+ is delivered as two exams (Core 1 — 220-1201 and Core 2 — 220-1202, the current V15 series). Each runs 90 minutes with up to 90 questions, including performance-based items, and a scaled pass mark of 675–700 out of 900.",
          "ITIL 4 Foundation is a 60-minute, 40-question multiple-choice exam with a 65% pass mark (26 of 40). It can be taken online with proctoring or at a Pearson VUE centre.",
          "Microsoft MS-900 and AZ-900 are 45–60 minute exams with around 40–60 multiple-choice and case-study questions and a scaled pass mark of 700 out of 1000.",
          "Cyber Security Awareness mocks follow the format used by major UK employers' annual training tools — short multi-choice items with immediate feedback.",
        ],
      },
      {
        heading: "What's covered",
        body: [
          "CompTIA A+ Core 1 covers mobile devices, networking, hardware, virtualisation and cloud, and hardware/network troubleshooting. Core 2 covers operating systems, security, software troubleshooting and operational procedures.",
          "ITIL 4 Foundation covers the service value system, the four dimensions of service management, the seven guiding principles and the 34 ITIL practices (with seven of them tested in detail).",
          "MS-900 covers Microsoft 365 services, security, compliance and pricing. AZ-900 covers Azure cloud concepts, core services, governance, privacy and pricing.",
          "Cyber Security Awareness covers phishing, password hygiene, MFA, social engineering, the basics of GDPR and what to do when you click on something you shouldn't have.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "For CompTIA A+, treat the official objectives PDF as your checklist. Anything not on the list is unlikely to be tested; anything on the list almost certainly will be.",
          "For ITIL 4, memorise the seven guiding principles in order and the four dimensions — these dominate the exam.",
          "For MS-900 and AZ-900, focus on understanding the service categories rather than memorising prices; pricing tiers change but the structural map of Microsoft 365 / Azure is stable.",
          "Sit at least one full mock the night before your real exam under timed conditions — the pacing test is more important than the marginal study you'd do otherwise.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "Skipping performance-based items on CompTIA A+ to save time. They carry more marks per minute than multiple-choice and are easy to miss in the back-half of the paper.",
          "Confusing ITIL 4's 'four dimensions' (organisations & people, information & technology, partners & suppliers, value streams & processes) with the 'seven guiding principles'.",
          "On MS-900 and AZ-900, conflating Microsoft 365 services with the underlying Azure services — they overlap but the certifications test them separately.",
        ],
      },
      {
        heading: "Why active practice testing works",
        body: [
          "IT certifications are dense, factual and time-pressured. Mocks build the pace and pattern recognition that re-reading study guides cannot.",
          "Each re-sit costs $246 for CompTIA A+, around £170 for ITIL 4 Foundation and around £69 for MS-900 / AZ-900. A week of free practice protects a meaningful exam fee.",
        ],
      },
      {
        heading: "Booking and what to expect",
        body: [
          "Book all four exam families through Pearson VUE — either at a physical test centre or, increasingly, online with OnVUE proctoring from home. ITIL 4 can also be booked through PeopleCert.",
          "For online proctored exams, you'll need a quiet room, a webcam, a clear desk and a tidy ID document. Any phone in the room or anyone walking in mid-exam can void the session with no refund.",
        ],
      },
    ],
    faqs: [
      { q: "What is the pass mark for CompTIA A+?", a: "Scaled, 675 out of 900 for Core 1 (220-1201) and 700 out of 900 for Core 2 (220-1202)." },
      { q: "How much does ITIL 4 Foundation cost in 2026?", a: "Around £170–£250 depending on whether you book directly through PeopleCert or via an accredited training provider." },
      { q: "Is MS-900 worth it for non-technical staff?", a: "Yes — it's widely used by procurement, HR and operations staff who work with Microsoft 365 day to day and want a recognised credential." },
      { q: "How long are these certifications valid?", a: "CompTIA A+ is valid for three years and can be renewed via continuing education credits. ITIL 4 Foundation does not expire. Microsoft fundamentals certifications do not expire." },
      { q: "Can I take these exams online?", a: "Yes — all of them can be sat with online proctoring, subject to webcam, ID and quiet-room requirements." },
      { q: "Are these IT mocks free?", a: "Yes. CompTIA A+, ITIL 4, MS-900 / AZ-900 and Cyber Awareness mocks on UK Test Hub are all free to use." },
    ],
  },

  "healthcare-entry": {
    title: "UCAT, OET & PLAB Tests | UK Test Hub",
    description:
      "Free UCAT, OET and PLAB 1 practice for healthcare admissions and registration, plus BMAT legacy biomedical admissions-style practice. UK exam-style questions with full explanations.",
    intro: [
      "Practice for healthcare admissions and registration — UCAT, OET and PLAB 1, plus BMAT legacy biomedical admissions-style practice.",
      "Our free healthcare entry mocks mirror the official UCAT subtests, OET medicine sub-tests and PLAB 1 single-best-answer format — UK English, NICE-aligned scenarios and current syllabuses. Practice is the only proven lever for these tests; raw IQ matters far less than exam familiarity.",
    ],
    sections: [
      {
        heading: "What the tests actually involve",
        body: [
          "UCAT now has three cognitive subtests — Verbal Reasoning, Decision Making and Quantitative Reasoning — plus Situational Judgement. Abstract Reasoning was removed from the test from 2025. The cognitive subtests return scaled scores (300–900 each); SJT is reported as a band (1 to 4). The full sitting runs around two hours at Pearson VUE.",
          "OET (Healthcare English) is a four-skill test (Listening, Reading, Writing, Speaking) lasting around three hours. The Writing and Speaking sub-tests are profession-specific — doctors write referral letters, nurses write discharge summaries.",
          "PLAB 1 is a 180-question single-best-answer paper sat over three hours at British Council centres worldwide and at Pearson VUE in the UK. The pass mark is set per sitting using a modified Angoff method, typically around 60–65%.",
        ],
      },
      {
        heading: "What's covered",
        body: [
          "UCAT Verbal Reasoning tests reading speed and inference; Quantitative Reasoning tests data interpretation under time pressure; Decision Making tests logical and probabilistic thinking; Situational Judgement tests professional dilemmas mapped to GMC Good Medical Practice. (Abstract Reasoning was withdrawn from 2025 and is no longer part of UCAT.)",
          "OET Medicine covers clinical conversations, patient information leaflets, medical case notes and clinician-to-clinician referrals.",
          "PLAB 1 covers the full UK medical curriculum: cardiology, respiratory, gastroenterology, endocrinology, neurology, paediatrics, obstetrics & gynaecology, psychiatry, ethics and prescribing, all aligned to NICE / BNF guidance.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "For UCAT, drill timing first and content second. Most candidates can answer Verbal Reasoning correctly given enough time — the test is whether you can do it in 22 seconds per question.",
          "For OET, practise writing referral letters under a 45-minute timer. Candidates fail Writing more often than Listening, Reading or Speaking, almost always due to running out of time.",
          "For PLAB 1, work through the official GMC sample questions and a full bank like Plabable or Pastest. Anchor every answer in NICE guidance and the BNF — the GMC tests UK practice, not your home country's protocols.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "On UCAT, treating SJT like a personality test. The 'right' answer is the one that protects the patient first and the team second; pick the textbook professional response, not the diplomatic one.",
          "On OET Writing, exceeding the 180–200 word target on referral letters. Examiners penalise wordy letters even when the clinical content is correct.",
          "On PLAB 1, applying non-UK first-line treatments. If NICE says paracetamol first, choose paracetamol — even if your training elsewhere taught otherwise.",
        ],
      },
      {
        heading: "Why active practice testing works",
        body: [
          "These exams are speed tests as much as knowledge tests. Mocks build the timing reflexes that no amount of textbook reading can.",
          "PLAB fees change regularly. From 1 April 2026, the GMC lists PLAB 1 at £283 and PLAB 2 at £1,036, but candidates should always check the official GMC fees page before booking.",
        ],
      },
      {
        heading: "Booking and what to expect",
        body: [
          "UCAT books through the official Pearson VUE UCAT site between June and September each year. OET books through occupationalenglishtest.org with monthly sittings. PLAB 1 books through the GMC online services portal.",
          "On the day, bring photo ID matching the booking, arrive 30 minutes early and expect a strict no-phones policy. UCAT and PLAB 1 are computer-based; OET Speaking is delivered face-to-face or by video call.",
        ],
      },
    ],
    faqs: [
      { q: "What is a good UCAT score in 2026?", a: "A strong UCAT score depends on the current year’s cohort. Since 2025, UCAT has three cognitive subtests scored from 900–2700 in total, plus Situational Judgement reported as a band." },
      { q: "How much does PLAB 1 cost in 2026?", a: "PLAB fees change regularly. From 1 April 2026, the GMC lists PLAB 1 at £283 and PLAB 2 at £1,036, but candidates should always check the official GMC fees page before booking." },
      { q: "Is BMAT still required in 2026?", a: "BMAT has been discontinued and is included here only as legacy biomedical admissions-style practice. It is no longer used for current UK medicine admissions; former BMAT universities have moved to other admissions tests, mainly UCAT." },
      { q: "What OET grade do I need to register with the GMC?", a: "Grade B in all four sub-tests is the GMC's English language requirement, equivalent to IELTS 7.5." },
      { q: "Can UCAT be retaken?", a: "Only once per admissions cycle (and only if you didn't sit it earlier in the same year)." },
      { q: "Are these healthcare entry mocks free?", a: "Yes. UCAT, OET and PLAB 1 mocks on UK Test Hub are all free to use, plus BMAT legacy practice." },
    ],
  },

  teaching: {
    title: "Teaching Practice Tests | UK Test Hub",
    description:
      "Free practice for the QTS Numeracy and Literacy Skills tests, Professional Skills for Teachers and Safeguarding in Schools. Realistic UK exam-style questions with explanations.",
    intro: [
      "Although the formal QTS Skills Tests in numeracy and literacy were retired in 2020, providers, SCITTs and recruiting MATs increasingly run their own equivalents at interview. Add to that the school-side safeguarding awareness exams that every staff member sits annually, and the modern teacher's career still runs on a steady stream of short, high-stakes assessments.",
      "Our free teaching mocks recreate the QTS-style numeracy and literacy formats most ITT providers and trust schools still use, plus the standard safeguarding awareness format used by Educare, NSPCC Learning and most Local Authority safeguarding hubs.",
    ],
    sections: [
      {
        heading: "What the tests actually involve",
        body: [
          "QTS-style Numeracy tests run around 50 minutes and split into a mental arithmetic section (audio questions, no calculator, around 18 seconds per item) and a written section (data interpretation and calculator-allowed problems).",
          "QTS-style Literacy tests cover spelling, punctuation, grammar and comprehension across a 45-minute paper.",
          "Professional Skills mocks cover scenarios drawn from the Teachers' Standards (Standards 1–8 plus Personal and Professional Conduct).",
          "Safeguarding in Schools is typically a 20-question annual refresher with an 80% pass mark, mapped to the latest Keeping Children Safe in Education (KCSiE) guidance.",
        ],
      },
      {
        heading: "What's covered",
        body: [
          "Numeracy: percentages, fractions, ratios, conversions between units, time and timetable problems, basic statistics (mean, median, mode, range), and reading two- and three-axis charts.",
          "Literacy: spelling of common teaching vocabulary, comma and apostrophe usage, subject-verb agreement, and reading comprehension based on short education-themed passages.",
          "Professional Skills: planning and assessment, behaviour management, the SEND Code of Practice, working with parents, and statutory duties under the Equality Act 2010.",
          "Safeguarding: KCSiE Part 1, the four categories of abuse (physical, emotional, sexual, neglect), the role of the Designated Safeguarding Lead, FGM mandatory reporting duty, Prevent duty and online safety.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "For Numeracy, drill mental arithmetic against a metronome — the test gives you about 18 seconds per audio question and there is no replay.",
          "For Literacy, learn the comma rules cold (Oxford comma, comma splice, comma before coordinating conjunction) and the apostrophe rules for plurals vs possessives.",
          "For Safeguarding, read the latest KCSiE Part 1 in full each September. The test is updated annually to match.",
          "For Professional Skills, anchor every scenario answer in the Teachers' Standards and the principle 'always escalate to the DSL on safeguarding'.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "On Numeracy, mistaking a percentage of a number for a percentage point change. A score rising from 40% to 50% is a 25% increase, not a 10% increase.",
          "On Safeguarding, confusing the categories: a dirty uniform is more likely neglect than physical abuse; emotional abuse rarely leaves marks but is just as serious.",
          "On Professional Skills, picking the answer that pleases parents over the answer that protects children. Safeguarding always wins.",
        ],
      },
      {
        heading: "Why active practice testing works",
        body: [
          "Teaching assessments reward speed and pattern recognition far more than depth of knowledge. Mocks build the time discipline that the QTS-style formats demand.",
          "Safeguarding refreshers are annual and pass/fail in most trusts — failing them can put your right-to-work-with-children status at risk. Twenty minutes of mock practice is the lowest-risk way to keep that compliant.",
        ],
      },
    ],
    faqs: [
      { q: "Are the official QTS Skills Tests still required?", a: "No — the DfE retired the central tests in 2020. Many ITT providers and recruiting trusts still run their own equivalents at interview." },
      { q: "What is the pass mark for safeguarding refreshers?", a: "Most providers use 80%, with unlimited re-sits in the same session." },
      { q: "What is KCSiE?", a: "Keeping Children Safe in Education — the statutory safeguarding guidance issued by the Department for Education and updated every September." },
      { q: "Do I need to pass safeguarding tests every year?", a: "Yes — annual refresher training is a statutory expectation for all staff in regulated education settings." },
      { q: "What are the Teachers' Standards?", a: "Eight professional standards plus a section on Personal and Professional Conduct, set by the DfE and used to assess all qualified teachers in England." },
      { q: "Are these teaching mocks free?", a: "Yes. QTS Numeracy, QTS Literacy, Professional Skills and Safeguarding mocks on UK Test Hub are all free to use." },
    ],
  },

  legal: {
    title: "SQE & LNAT Practice Tests | UK Test Hub",
    description:
      "Free practice for SQE1 FLK1 and FLK2, the LNAT multiple-choice section and a UK Legal System knowledge quiz. Realistic single-best-answer questions with explanations.",
    intro: [
      "Becoming a solicitor in England and Wales now runs through the Solicitors Qualifying Examination (SQE), the standardised assessment that replaced the GDL/LPC route in 2021. SQE1 is two long single-best-answer papers (FLK1 and FLK2) testing functioning legal knowledge across the full curriculum. LNAT remains the front door for several leading law schools, and a working knowledge of the UK legal system is now expected at interview by any decent City or regional firm.",
      "Our free legal mocks mirror the official SRA format for SQE1, the National Admissions Test for Law (LNAT) multiple-choice format, and the kind of UK Legal System quizzes used by chambers and law firms at first-stage screening. UK English, current procedural rules and the Civil Procedure Rules 1998 throughout.",
    ],
    sections: [
      {
        heading: "What the tests actually involve",
        body: [
          "SQE1 is sat over two days. FLK1 and FLK2 each contain 180 single-best-answer questions over five hours (with a break in the middle). The pass mark is set per sitting using a modified Angoff method, typically around 55–60%.",
          "LNAT is in two parts: a 95-minute multiple-choice section with 42 questions across 12 passages, and a 40-minute essay. Universities use the multiple-choice score plus the essay quality to decide interview offers.",
          "UK Legal System quizzes used at firm screening are usually 20–30 short questions covering courts, sources of law, key statutes and basic procedural concepts.",
        ],
      },
      {
        heading: "What's covered",
        body: [
          "FLK1: business law and practice, dispute resolution, contract, tort, the legal system, constitutional law and the legal services regulatory framework.",
          "FLK2: property practice, wills and the administration of estates, solicitors accounts, land law, trusts, and criminal law and practice.",
          "LNAT: argument analysis, inference, assumptions and reasoning across passages from law, philosophy, ethics, science and current affairs.",
          "UK Legal System: the structure of the courts, civil and criminal jurisdiction, the doctrine of precedent, primary and secondary legislation, the role of the Supreme Court since 2009 and the Civil Procedure Rules 1998.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "For SQE1, practice under timed conditions is non-negotiable — 1 minute 40 seconds per question for 180 questions in one sitting tests stamina as much as knowledge.",
          "For LNAT, the multiple-choice section rewards careful reading. Always answer based strictly on what the passage says, never on what you happen to know to be true.",
          "For UK Legal System knowledge, learn the court hierarchy first — Magistrates and County (first instance), Crown and High Court (intermediate), Court of Appeal, Supreme Court (since October 2009).",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "Confusing the burden of proof in civil cases (balance of probabilities) with the criminal standard (beyond reasonable doubt).",
          "On SQE1, getting tripped up by single-best-answer phrasing. Often more than one option is technically correct — pick the one that is most precisely correct.",
          "Forgetting that the Supreme Court replaced the Appellate Committee of the House of Lords in October 2009 — older textbooks still refer to 'the Lords' as the apex court.",
        ],
      },
      {
        heading: "Why active practice testing works",
        body: [
          "SQE1 single-best-answer is a format most candidates have never sat before. Mocks build pattern recognition for the question style, not just the content.",
          "Each SQE1 sitting costs £2,108 in 2026, with a re-sit costing the full fee again. Free practice is one of the highest-return revision activities in UK legal training.",
          "For LNAT, raw IQ helps but practice helps more — most candidates who hit the top band have done at least three full mocks under timed conditions.",
        ],
      },
      {
        heading: "Booking and what to expect",
        body: [
          "SQE1 books through the SRA's online portal once or twice a year, typically January and July sittings, at Pearson VUE centres worldwide.",
          "LNAT books through the official LNAT site between August and June for the following admissions cycle. The fee is £75 in the UK / EU and £120 elsewhere.",
          "For SQE1, expect a long day with a strict break schedule. Phones, watches and any personal items go in lockers; only ID, water and Pearson VUE-issued scratch paper are allowed at the workstation.",
        ],
      },
    ],
    faqs: [
      { q: "What is the pass mark for SQE1?", a: "Set per sitting using a modified Angoff method — usually around 55–60% across all 180 single-best-answer questions per paper." },
      { q: "How much does SQE1 cost in 2026?", a: "£2,108 per sitting, paid to the SRA. SQE2 is around £2,956." },
      { q: "Do I still need a law degree to qualify as a solicitor?", a: "No — under the SQE route you need any UK degree (or equivalent), two years of qualifying work experience, and to pass SQE1 and SQE2." },
      { q: "Is the LNAT essay marked?", a: "Universities receive your essay alongside the multiple-choice score and use both to decide interview and offer outcomes. There is no formal essay grade." },
      { q: "How long are SQE results valid?", a: "There is no formal expiry, but firms typically expect SQE2 to be sat within a few years of SQE1." },
      { q: "Are these legal mocks free?", a: "Yes. SQE1 FLK1, FLK2, LNAT and UK Legal System mocks on UK Test Hub are all free to use." },
    ],
  },

  "military-emergency": {
    title: "Army, Police & Fire Tests | UK Test Hub",
    description:
      "Free practice for the Army BARB, Police PIRT (Initial Recruitment), Police SEARCH Assessment and Firefighter NFSAT. Realistic UK uniformed-service questions with explanations.",
    intro: [
      "The UK uniformed services run some of the toughest entry assessments in any sector. The British Army's BARB test, the Police PIRT and SEARCH assessments, and the Firefighter NFSAT all use bespoke formats designed to flush out candidates who can't handle pressure, poor pacing or unfamiliar question types. A good score doesn't just get you in — it widens the trade or rank options open to you.",
      "Our free military and emergency-services mocks are designed to reflect the format of each official test. Our practice content uses UK English and is reviewed against publicly available recruitment guidance where possible, including Army, police and fire-service assessment information.",
    ],
    sections: [
      {
        heading: "What the tests actually involve",
        body: [
          "BARB (British Army Recruit Battery) is a 30-minute computer-adaptive test taken at an Army Careers Centre. It has five sections: reasoning, letter checking, number distance, odd-one-out and symbol rotation. Your score determines the trades you're eligible for.",
          "Police PIRT covers verbal logical reasoning, numerical reasoning and a short situational judgement section. Forces use it as the first online sift before SEARCH.",
          "Police SEARCH (Structured Entrance Assessment for Recruiting Constables Holistically) is a half-day assessment centre with interactive role-plays, a written exercise and a competency-based interview.",
          "Firefighter NFSAT covers situational awareness, working with numbers and understanding information across three timed online assessments.",
        ],
      },
      {
        heading: "What's covered",
        body: [
          "BARB: pure aptitude — speed and accuracy on letter, number and shape problems. There's no syllabus to revise; the only useful preparation is timed practice.",
          "PIRT: verbal reasoning passages followed by true/false/cannot-say questions; numerical questions on percentages and tables; SJT scenarios mapped to the Code of Ethics for Policing.",
          "SEARCH: communication, public service, problem-solving, team-working and respect for diversity, all assessed against the Competency and Values Framework.",
          "NFSAT: scenario-based situational awareness questions, basic arithmetic and the ability to interpret simple operational documents.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "For BARB, drill speed under a clock — the adaptive engine pushes harder questions if you're getting them right, so steady accuracy beats fast guessing.",
          "For PIRT, treat verbal reasoning answers as 'true / false / cannot say from the passage alone' — your real-world knowledge is irrelevant.",
          "For SEARCH, learn the Competency and Values Framework off by heart and structure every interview answer using STAR (Situation, Task, Action, Result).",
          "For NFSAT, practise visualising spatial scenarios — 'who can see what from where' is a recurring question type.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "Treating BARB like a knowledge test. It isn't — there's no content to revise, only the format to get used to.",
          "On PIRT verbal reasoning, answering 'true' when the passage doesn't actually say it. The answer is 'cannot say' more often than candidates expect.",
          "On SEARCH role-plays, defaulting to confrontation. The College of Policing wants de-escalation, empathy and procedural fairness first; enforcement only when nothing else works.",
        ],
      },
      {
        heading: "Why active practice testing works",
        body: [
          "Uniformed-service tests are heavily formatted and lightly content-based. Candidates who've drilled the format consistently outscore brighter candidates who haven't.",
          "The recruitment cycle is long — a failed assessment can mean six to twelve months before re-applying. Free practice is the cheapest insurance against that delay.",
        ],
      },
    ],
    faqs: [
      { q: "What is a good BARB score?", a: "A score of 60+ opens most Army trades; 80+ unlocks the technical and intelligence roles. The maximum is around 90." },
      { q: "Can I retake BARB if I fail?", a: "Yes, but typically only after a 28-day waiting period." },
      { q: "What is the pass mark for Police PIRT?", a: "Forces set their own thresholds, but candidates scoring above the 60th percentile against the national benchmark are usually invited to SEARCH." },
      { q: "What does the SEARCH assessment include?", a: "Interactive role-plays, a written exercise and a competency-based interview, all assessed against the Competency and Values Framework." },
      { q: "Is the Firefighter NFSAT the same in every UK service?", a: "Most English fire and rescue services use NFSAT. Scotland and Wales use related but slightly different assessments." },
      { q: "Are these uniformed-service mocks free?", a: "Yes. BARB, PIRT, SEARCH and NFSAT mocks on UK Test Hub are all free to use." },
    ],
  },

  "maritime-aviation": {
    title: "PPL, ATPL & RYA Tests | UK Test Hub",
    description:
      "Free practice for PPL Air Law, PPL Meteorology, ATPL basics and the RYA Day Skipper theory. Realistic UK / EASA aviation and RYA maritime questions with explanations.",
    intro: [
      "Whether you're chasing a Private Pilot Licence, building hours toward an Airline Transport Pilot Licence, or sitting your RYA Day Skipper before chartering a yacht in the Solent, you'll need to pass a series of theory exams set by the CAA, EASA or RYA. The papers are short but technical — a single misread weather chart or misapplied rule of the road can be the difference between a pass and another exam fee.",
      "Our free aviation and maritime mocks mirror the official UK CAA / EASA syllabuses for PPL and ATPL theory and the standard RYA Day Skipper exam format. UK English, UK weather, UK airspace and UK COLREGS interpretations throughout.",
    ],
    sections: [
      {
        heading: "What the tests actually involve",
        body: [
          "PPL Air Law is a 16-question, 35-minute multiple-choice paper with a 75% pass mark. PPL Meteorology is a 20-question, 50-minute paper at the same pass mark. Both are computer-based and sat at an approved training organisation.",
          "ATPL theory comprises 14 papers ranging from 25 to 80 questions each, all at a 75% pass mark, sat at a CAA-approved centre.",
          "RYA Day Skipper Theory ends with a multi-part shore-based exam: chartwork, tidal calculations, COLREGS, buoyage, weather and passage planning, marked by the principal of the recognised RYA training centre.",
        ],
      },
      {
        heading: "What's covered",
        body: [
          "PPL Air Law: airspace classifications (A through G), VFR minima, the Rules of the Air Regulations 2015, ICAO Annex 2, licence privileges and limitations, and the duties of the pilot in command.",
          "PPL Meteorology: METARs, TAFs, surface analysis charts, cloud types, fog formation, icing, thunderstorms and the standard atmosphere.",
          "ATPL covers the same territory in much greater depth, plus advanced navigation, flight planning, mass and balance, performance and human factors.",
          "RYA Day Skipper covers chartwork (course to steer, EP, fix, ground track), tidal heights and streams, COLREGS (rules 5 to 19 in detail), the IALA-A buoyage system used in UK waters, basic weather forecasting and passage planning.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "For PPL Air Law, memorise the cloud-base and visibility VFR minima for each airspace class — these are the single most-tested topic.",
          "For PPL Meteorology, learn METAR and TAF abbreviations cold (BKN, OVC, CAVOK, BECMG, TEMPO, PROB30/40).",
          "For RYA Day Skipper, drill chartwork plotting under a timer. Most candidates' theoretical knowledge is solid; their plotting is too slow.",
          "Always work in true / magnetic / compass conversions in the same direction (TVMDC — True, Variation, Magnetic, Deviation, Compass) and add Easterly variation when going from True to Magnetic, subtract Westerly.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "On Air Law, confusing Class D and Class E airspace VFR minima. Class D requires clearance to enter; Class E does not for VFR.",
          "On Meteorology, misreading a METAR temperature/dewpoint spread and missing fog risk. A spread of 2°C or less should set off alarm bells.",
          "On RYA Day Skipper COLREGS, defaulting to 'starboard tack has right of way' for power-driven vessels. The rule is 'vessel on the other's starboard side gives way' — not the same thing.",
        ],
      },
      {
        heading: "Why active practice testing works",
        body: [
          "Aviation and maritime exams are heavily procedural. The questions reward exact recall of named rules, abbreviations and numerical thresholds — exactly the content that retrieval practice locks in faster than re-reading textbooks.",
          "PPL re-sit fees are around £35 per paper, ATPL re-sits run to £80 each, and missing an RYA Day Skipper sitting can mean an extra week's tuition fee. Free practice protects all of those.",
        ],
      },
    ],
    faqs: [
      { q: "What is the pass mark for UK PPL theory exams?", a: "75% on each of the nine PPL theory papers." },
      { q: "How much does the PPL theory cost in 2026?", a: "Each paper costs around £35–£45, plus the cost of training (typically £200–£500 for ground school)." },
      { q: "How long are PPL theory passes valid?", a: "Two years from the date of your first pass. You must complete the PPL skill test within that window." },
      { q: "Do I need to take ATPL theory in one sitting?", a: "No, but all 14 papers must be completed within an 18-month window from your first sitting, with a maximum of six attempts in total." },
      { q: "Is the RYA Day Skipper theory exam timed?", a: "Yes — the typical paper allows around three hours and is sat at the end of the shore-based course." },
      { q: "Are these aviation and maritime mocks free?", a: "Yes. PPL, ATPL and RYA Day Skipper mocks on UK Test Hub are all free to use." },
    ],
  },

  government: {
    title: "Civil Service Tests | UK Test Hub",
    description:
      "Free practice for the Civil Service Judgement Test (CSJT), Civil Service Verbal and Numerical Reasoning, and the Border Force Recruitment Test. UK exam-style questions with explanations.",
    intro: [
      "Civil Service recruitment is run almost entirely through Civil Service Jobs (gov.uk) and a small set of standardised online tests — the Civil Service Judgement Test (CSJT), Verbal Reasoning, Numerical Reasoning and the Border Force Recruitment Test for Border Force entry. They sit before any interview and are typically pass / fail with no second chance in the same campaign.",
      "Our free government recruitment mocks mirror the format used by the Cabinet Office Recruitment team and the Home Office's Border Force assessment, including the Success Profiles framework that underpins every Civil Service grade. UK English, gov.uk wording and current Success Profiles behaviours throughout.",
    ],
    sections: [
      {
        heading: "What the tests actually involve",
        body: [
          "CSJT is an untimed online situational judgement test of around 12 scenarios. For each scenario you're asked to choose the most and least effective response from four options. There's no 'correct' answer in the academic sense — your responses are scored against the Success Profiles behaviours expected at the grade.",
          "Civil Service Verbal Reasoning is a 20-minute, 25-question online test asking true / false / cannot say judgements based strictly on a short passage.",
          "Civil Service Numerical Reasoning is 25 minutes, around 18 questions, on data-table interpretation and basic percentages.",
          "Border Force Recruitment Test is a multi-stage online and assessment-day process covering judgement scenarios, written communication and a structured interview.",
        ],
      },
      {
        heading: "What's covered",
        body: [
          "CSJT scenarios are drawn from typical Civil Service workplace situations — managing competing deadlines, handling a difficult stakeholder, raising a concern about a colleague, supporting an inclusive team.",
          "Verbal Reasoning passages are short, gov.uk-style policy summaries followed by statements you must judge against the passage.",
          "Numerical Reasoning uses tables of public-sector data (population, expenditure, performance metrics) with short percentage and ratio calculations.",
          "Border Force assesses awareness of customs and immigration legislation, the Civil Service Code, and the Border Force Operating Mandate.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "For CSJT, read the Success Profiles behaviours for the grade you're applying to and anchor every 'most effective' answer in those behaviours. The 'least effective' is almost always the response that ignores process or excludes a colleague.",
          "For Verbal Reasoning, answer strictly from the passage. If the passage doesn't say it, the answer is 'cannot say' — even if you happen to know it's true.",
          "For Numerical Reasoning, drill mental percentage and ratio calculations against a 60-second clock.",
          "For Border Force, read the Civil Service Code and the Border Force Operating Mandate cover to cover before the assessment.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "On CSJT, picking the answer that 'just gets it done' over the answer that follows process. The Civil Service rewards process adherence and inclusivity, not lone heroics.",
          "On Verbal Reasoning, applying outside knowledge to override the passage. The test is reading comprehension, not general knowledge.",
          "On Border Force, confusing the Civil Service Code (impartiality, integrity, honesty, objectivity) with the Nolan Principles. The Code is the Civil Service's; the Nolan Principles are the wider Seven Principles of Public Life.",
        ],
      },
      {
        heading: "Why active practice testing works",
        body: [
          "Government recruitment tests are pass / fail and the Civil Service Recruitment Process is high-volume — campaigns can attract thousands of applicants for a handful of posts. Mocks lift you out of the bottom percentile faster than any other study activity.",
          "The CSJT and reasoning tests have an unfamiliar format for most applicants. A few free mocks the night before is the cheapest way to remove first-time-on-test anxiety.",
        ],
      },
      {
        heading: "Booking and what to expect",
        body: [
          "Every Civil Service campaign on Civil Service Jobs (gov.uk) sets out exactly which tests you'll need to take and in what order. Tests are sent by email link with deadlines typically five to ten working days from the application sift.",
          "Tests are sat at home on your own computer. Bring a calculator (allowed for Numerical Reasoning unless the test instructions say otherwise) and ensure a quiet, uninterrupted environment for the duration.",
        ],
      },
    ],
    faqs: [
      { q: "What is the pass mark for the CSJT?", a: "There's no headline pass mark — your answers are scored against the Success Profiles behaviours for the grade and ranked relative to other applicants." },
      { q: "How long do I have to complete Civil Service online tests?", a: "Typically five to ten working days from the link being sent, with each individual test taking 20–25 minutes." },
      { q: "Can I retake a Civil Service online test if I fail?", a: "Not within the same campaign. You can re-apply when the next vacancy at the relevant grade is advertised." },
      { q: "What are Success Profiles?", a: "The Civil Service recruitment framework, replacing the older competency framework. It assesses behaviours, strengths, ability, experience and technical skills." },
      { q: "Is Border Force part of the Civil Service?", a: "Yes — Border Force is part of the Home Office and is a Civil Service department." },
      { q: "Are these government recruitment mocks free?", a: "Yes. CSJT, CS Verbal, CS Numerical and Border Force mocks on UK Test Hub are all free to use." },
    ],
  },
  "hgv-logistics": {
    title: "HGV & Logistics Tests | UK Test Hub",
    description: "Free UK practice tests for Driver CPC Module 2 and Module 4, ADR dangerous goods, forklift theory and Transport Manager CPC. Realistic questions with full explanations.",
    intro: [
      "Working professionally in road haulage means passing more than the standard car or van licence. Whether you're starting your Driver CPC, adding ADR to your card, getting a forklift ticket or stepping up to Transport Manager, every qualification has a written knowledge test and the pass marks are tight. Our free HGV / LGV & Logistics mocks cover all of them.",
      "All mocks are written in plain UK English, designed to reflect common exam formats, and include detailed answer explanations so you understand the reasoning — not just the right letter.",
    ],
    sections: [
      { heading: "What's covered in this section", body: ["Driver CPC Module 2 (Case Studies), Driver CPC Module 4 underpinning theory, ADR Dangerous Goods Awareness, Forklift Truck theory (RTITB / ITSSAR) and Transport Manager CPC. Each topic has its own bank of questions and unlimited mock papers."] },
      { heading: "How to use these mocks", body: ["Start with one mock to set a baseline, review every wrong answer, then take a fresh mock the next day. Spaced repetition over two to three weeks beats cramming the night before every time."] },
    ],
    faqs: [
      { q: "Are these the official Driver CPC questions?", a: "No — the DVSA does not publish its live question bank. Our questions are written in the same style and difficulty so you train against realistic content." },
      { q: "Do I need Driver CPC if I only drive a van?", a: "No — Driver CPC applies to professional drivers of vehicles over 3.5 tonnes (Category C / C+E) or buses and coaches (Category D / D+E)." },
    ],
  },
  "care-social-work": {
    title: "Care & Social Work Tests | UK Test Hub",
    description: "Free UK practice tests for the Care Certificate 15 standards, Level 2 Adult Social Care, Safeguarding Adults, Medication Awareness and Social Work England readiness.",
    intro: [
      "Adult social care is one of the most regulated workforces in the UK, and every new starter has to demonstrate the Care Certificate's 15 standards within their first 12 weeks. Our free Care & Social Work mocks cover the Care Certificate, Level 2 Adult Social Care, Safeguarding Adults, safe handling of medication and the Social Work England standards for newly-qualified social workers.",
    ],
    sections: [
      { heading: "What's covered in this section", body: ["The Care Certificate 15 standards, Level 2 Adult Social Care, Safeguarding Adults (Care Act 2014, Mental Capacity Act, types of abuse), Medication Awareness (the six rights, MAR charts, controlled drugs) and Social Work England readiness (professional standards and ASYE)."] },
    ],
    faqs: [
      { q: "Is the Care Certificate a qualification?", a: "It's not a regulated qualification but it is an expected induction standard for new health and social care workers in England, and CQC inspectors check completion records." },
    ],
  },
  "beauty-wellbeing": {
    title: "Beauty & Wellbeing Tests | UK Test Hub",
    description: "Free UK practice tests for Level 2 Beauty Therapy, Barbering, Nail Technician, Hairdressing and Infection Control. Realistic questions with full explanations.",
    intro: [
      "From Level 2 Beauty Therapy to Barbering, Nail Tech and Hairdressing, every professional beauty and wellbeing qualification has an underpinning knowledge exam — anatomy, contraindications, infection control and salon health and safety. Our free Beauty & Wellbeing mocks help you walk into the assessment room calm and prepared.",
    ],
    sections: [
      { heading: "What's covered in this section", body: ["Level 2 Beauty Therapy theory, Barbering Level 2, Nail Technician theory, Infection Control for Beauty (HTM 01-05) and Hairdressing Level 2 theory."] },
    ],
    faqs: [
      { q: "Which awarding body sets these exams?", a: "Most are set by VTCT, City & Guilds or ITEC. Check with your training provider which awarding body your specific course uses." },
    ],
  },
  "retail-customer-service": {
    title: "Retail & Customer Service Tests | UK Test Hub",
    description: "Free UK practice tests for Retail Level 2, ABTA travel agent, Customer Service Level 2, Visual Merchandising and Age-Restricted Sales (Challenge 25).",
    intro: [
      "Whether you're new to the shop floor, training as a travel agent, or refreshing your Challenge 25 awareness for a licensing audit, our free Retail & Customer Service mocks cover the assessments most UK retailers and travel businesses require — all updated for 2026 and written in plain English.",
    ],
    sections: [
      { heading: "What's covered in this section", body: ["Retail Level 2 Knowledge, ABTA Travel Agent practice (Package Travel Regulations, ATOL, ABTA Code), Customer Service Level 2, Visual Merchandising basics and Age-Restricted Sales (Challenge 25 — alcohol, tobacco, vapes, knives, fireworks)."] },
    ],
    faqs: [
      { q: "Is Challenge 25 a legal requirement?", a: "Challenge 25 itself is not a law, but it's the industry standard recommended by the Home Office and Trading Standards to help meet the legal duty not to sell age-restricted products to underage buyers." },
    ],
  },
  "animal-care": {
    title: "Animal Care Tests | UK Test Hub",
    description: "Free UK practice tests for RVN pre-registration, dog grooming theory, animal first aid, canine behaviour and equine care theory.",
    intro: [
      "From student veterinary nurses preparing for RCVS registration to professional dog groomers and equine yard staff, our free Animal Care & Veterinary mocks cover the underpinning knowledge tests for the most common UK animal care qualifications.",
    ],
    sections: [
      { heading: "What's covered in this section", body: ["RVN Pre-Registration theory (RCVS Day One Competences), Dog Grooming theory (iPET / City & Guilds), Animal First Aid (CPR, choking, bleeding, poisoning), Canine Behaviour basics (ABTC) and Equine Care theory (BHS)."] },
    ],
    faqs: [
      { q: "Is the RVN exam done online?", a: "The RVN OSCE is sat in person at an RCVS-approved centre. The pre-registration knowledge tests our mocks support are typically done online during your training." },
    ],
  },
  admissions: {
    title: "GRE & GMAT Practice Tests | UK Test Hub",
    description:
      "Free practice-style questions for the GRE and GMAT — graduate and business school admissions tests. Verbal, quantitative, data insights and analytical writing revision with explanations.",
    intro: [
      "Applying to a graduate programme or business school usually means sitting either the GRE or the GMAT. UK Test Hub publishes independent practice-style questions for both — verbal reasoning, quantitative reasoning, data insights and analytical writing — so you can build pace and spot weak areas before booking the real exam.",
      "These are not official questions. The GRE is set and run by ETS; the GMAT is set and run by GMAC. We're not affiliated with either. Always use official ETS or GMAC materials for your final preparation.",
    ],
    sections: [
      { heading: "What's covered in this section", body: ["GRE Practice — verbal reasoning, quantitative reasoning and analytical writing. GMAT Practice — quantitative reasoning, verbal reasoning and the GMAT Focus data insights section."] },
      { heading: "How to use these mocks", body: ["Do one timed section a day rather than long marathon sittings. Review every wrong answer before moving on. In the final two weeks before your real exam, switch to full-length timed mocks under exam conditions."] },
    ],
    faqs: [
      { q: "Which is better, GRE or GMAT?", a: "It depends on the programme. Most UK MBAs accept both; specialist master's degrees vary. Check each programme's specific entry requirements." },
      { q: "Are these the official GRE and GMAT questions?", a: "No. UK Test Hub is independent and not affiliated with ETS or GMAC. Our questions are practice-style only — always use official materials for final preparation." },
    ],
  },
};
