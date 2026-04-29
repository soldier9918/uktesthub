// Long-form SEO + study guide content for each individual test (topic).
// Rendered by /guide/:slug. We keep entries terse-but-substantive (5–6
// sections, 5–8 FAQs each) and let the route apply consistent styling.

export type TopicFaq = { q: string; a: string };
export type TopicSection = { heading: string; body: string[] };
export type TopicSeo = {
  title: string;        // <head> title
  description: string;  // <head> description
  tagline: string;      // short hero subtitle
  intro: string[];      // 1–2 lead paragraphs
  sections: TopicSection[];
  faqs: TopicFaq[];
};

// Helper to build a generic-but-personalised guide entry. Used as a fallback
// for topics where we haven't yet hand-written full content. Every guide page
// always renders something useful, so links are never broken.
const generic = (
  topicTitle: string,
  awarder: string,
  context: string,
): TopicSeo => ({
  title: `${topicTitle} Guide — Tips, Format & How to Pass — UK Test Hub`,
  description: `Free study guide for the ${topicTitle}. Format, syllabus, study tips, common mistakes and FAQs, plus unlimited mock tests.`,
  tagline: `Everything you need to know about the ${topicTitle} before you book.`,
  intro: [
    `The ${topicTitle} is ${context}. This guide walks you through the format, what's actually tested, the most common mistakes candidates make, and how to use practice tests to pass first time.`,
    `When you're ready, jump into our free mock papers — each one mirrors the real exam style with full answer explanations so you learn the reasoning, not just the letter.`,
  ],
  sections: [
    {
      heading: "What the test involves",
      body: [
        `${topicTitle} is set by ${awarder}. Questions are multiple-choice and delivered on a computer at an approved test centre. You'll see a mix of straight-recall items and applied-knowledge scenarios that ask you to choose the safest, most appropriate or most legally correct response.`,
        `Read every question twice — wording like "should" versus "must" or "first" versus "next" changes the right answer. The on-screen prompt always tells you exactly how many options to pick.`,
      ],
    },
    {
      heading: "Format and timing",
      body: [
        `Expect a fixed time limit and a fixed pass mark. You won't get extra time for re-reading, so the best strategy is one quick pass through the whole paper, flagging anything you're unsure of, then a second pass for the flagged items at the end.`,
        `Most candidates who fail run out of time in the last quarter of the paper because they spent too long on early questions. Pace yourself from question one.`,
      ],
    },
    {
      heading: "How to study and pass first time",
      body: [
        `Start at least three to four weeks before your test date. Short, daily sessions of 20–30 minutes beat weekend cram marathons every time — spaced repetition is the single best predictor of long-term recall.`,
        `Take a full mock paper at the start of week one to get a baseline. Whatever you score, review every wrong answer in detail before doing the next mock. The "review" is where the learning happens, not the mock itself.`,
        `In the final week, switch to timed mocks under exam conditions: phone off, no notes, single sitting. This trains pace and focus, which are just as important as knowledge on the day.`,
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        `The biggest pitfall is treating the practice tests as a memorisation exercise. The real exam pulls from a much larger question bank — if you only memorise our wording, you'll be lost when the real paper rephrases the same concept.`,
        `Other common mistakes: skim-reading questions, second-guessing correct first instincts, and panicking in the last 10 minutes. Trust your preparation and use every minute available.`,
      ],
    },
    {
      heading: "Why active practice testing works",
      body: [
        `Active recall — testing yourself rather than re-reading notes — is one of the most evidence-backed study techniques in cognitive science. Repeated mock papers expose gaps you didn't know you had, and the instant feedback after each question rewires memory faster than passive revision.`,
        `Mocks also dismantle exam anxiety. The first time you see a real-style question shouldn't be at the test centre. By the time you've completed five to ten mocks, the format feels familiar and you can focus your mental energy on the content.`,
      ],
    },
    {
      heading: "Booking and on the day",
      body: [
        `Book directly through the official ${awarder} portal where possible — third-party booking sites usually charge a markup for the same slot. Bring photo ID and arrive at least 15 minutes early; latecomers usually forfeit the fee.`,
        `You won't be allowed phones, watches or notes in the test room. Most centres provide lockers in the waiting area.`,
      ],
    },
  ],
  faqs: [
    { q: `Who sets the ${topicTitle}?`, a: `The ${topicTitle} is set and regulated by ${awarder}.` },
    { q: `How many questions are on the ${topicTitle}?`, a: `Question counts vary by exam version — check the official ${awarder} guidance for your specific sitting. Our mocks reflect the typical format.` },
    { q: `What is the pass mark?`, a: `Most awarding bodies set the pass mark at around 70–80%. Confirm the current mark on the official ${awarder} site before your sitting.` },
    { q: `How many times can I retake the ${topicTitle}?`, a: `There's usually no lifetime cap, but you'll pay the full fee each time and may have to wait a minimum number of days between attempts.` },
    { q: `Are your mock tests free?`, a: `Yes — every mock on UK Test Hub is free, with full answer explanations. No sign-up required.` },
    { q: `How long should I study for?`, a: `Most candidates need three to four weeks of consistent practice (20–30 minutes per day) plus a couple of full timed mocks in the final week.` },
  ],
});

// ------------------------------------------------------------------
// Hand-written, exam-specific guides for every topic. Where a topic
// is highly generic we fall back to the helper above so the page is
// never empty.
// ------------------------------------------------------------------

export const topicSeo: Record<string, TopicSeo> = {
  // -------- DRIVING ---------------------------------------------------
  "driving-theory": {
    title: "Driving Theory Test Guide 2026 — Format, Pass Mark & Tips — UK Test Hub",
    description:
      "Complete UK Driving Theory Test guide for 2026. DVSA format, 50-question pass mark, hazard perception, study plan and common mistakes — with free mock tests.",
    tagline: "Everything you need to pass the DVSA Driving Theory Test first time.",
    intro: [
      "The DVSA Driving Theory Test is the gateway to your provisional pass certificate and, ultimately, your full UK driving licence. It's split into 50 multiple-choice questions and 14 hazard perception clips, and you must pass both parts at the same sitting. Roughly half of all candidates fail on their first attempt, almost always because they under-prepared on hazard perception or skim-read the multiple-choice paper.",
      "This guide walks you through exactly what the DVSA tests, how to study efficiently in three to four weeks, and the small habits that separate first-time passes from repeat bookings. When you're ready, take a free mock test below — every question has a written explanation linked to the Highway Code.",
    ],
    sections: [
      {
        heading: "What the test actually involves",
        body: [
          "You'll sit at a Pearson VUE workstation with headphones for around 90 minutes from check-in to printed result slip. The test runs in two parts back-to-back: 50 multiple-choice questions in 57 minutes, an optional three-minute break, then 14 video clips containing 15 developing hazards.",
          "The pass mark is 43 out of 50 on multiple choice and 44 out of 75 on hazard perception. Fail one part and you fail the whole test — there's no part-credit and you'll need to rebook the full £23 fee.",
        ],
      },
      {
        heading: "What's covered in the syllabus",
        body: [
          "Each mock paper covers the full DVSA syllabus: alertness, attitude, safety and your vehicle, safety margins, hazard awareness, vulnerable road users, other types of vehicle, vehicle handling, motorway rules, rules of the road, road and traffic signs, documents, accidents, and vehicle loading.",
          "Some questions have a single correct answer; others ask you to select two or three options. The on-screen wording always tells you how many to pick — read it carefully or you'll lose easy marks.",
        ],
      },
      {
        heading: "How to pass hazard perception",
        body: [
          "Hazard perception trips up more candidates than the written section. You'll see 14 clips of around one minute each. Most clips contain one developing hazard (worth up to 5 marks); one clip contains two. Click once when you first spot the hazard developing, then again as it becomes more serious.",
          "Don't click constantly or in a rhythm — the system flags this as cheating and gives you zero for that clip. Practise on a laptop, not a phone: the clip windows are wider than your phone screen and you'll miss peripheral movement.",
        ],
      },
      {
        heading: "Study plan that actually works",
        body: [
          "Start four weeks before your test date. Week 1: read the Highway Code start to finish (about three evenings). Week 2: take one mock per day, reviewing every wrong answer against the Highway Code rule it tested. Week 3: drill weak topic areas (most people struggle with safe stopping distances and motorway rules). Week 4: timed full mocks, no notes, phone off.",
          "The DVSA loves to test attention with subtle wording like 'should' versus 'must'. Read every question twice. When you get one wrong, look up the rule it tested rather than just memorising the answer.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "Confusing the 'two-second rule' (dry weather), the 'four-second rule' (wet) and the 'ten-second rule' (icy). Misreading triangular warning signs as circular order signs. Forgetting that motorway speed limits differ from dual carriageway limits when towing.",
          "Rushing the multiple-choice and then losing focus for hazard perception. Pace yourself: 57 minutes for 50 questions is more than a minute per question — use it.",
        ],
      },
      {
        heading: "Booking and on the day",
        body: [
          "Book only via gov.uk. The fee is £23 in 2026 and slots are usually available within two to four weeks. Avoid third-party 'fast booking' sites that add a £20–£40 markup for the same slot.",
          "Bring your provisional licence as photo ID. No phone, no watch, no bag, no notes inside the test room — there are lockers in the waiting area. Arrive 15 minutes early; latecomers forfeit the fee.",
        ],
      },
    ],
    faqs: [
      { q: "What is the UK driving theory pass mark?", a: "43 out of 50 on multiple choice and 44 out of 75 on hazard perception. You must pass both at the same sitting." },
      { q: "How many questions are in the driving theory test?", a: "50 multiple-choice questions, then 14 hazard perception video clips containing 15 developing hazards in total." },
      { q: "How long is the driving theory test?", a: "57 minutes for multiple choice and around 20 minutes for hazard perception, plus an optional three-minute break in between." },
      { q: "How much does the driving theory test cost in 2026?", a: "£23, booked directly via gov.uk." },
      { q: "How long should I study for the theory test?", a: "Most candidates need three to four weeks of consistent practice — 20–30 minutes a day plus a few full timed mocks in the final week." },
      { q: "Can I take notes into the test?", a: "No. Phones, watches, bags and notes must go in the lockers in the waiting area." },
      { q: "How soon can I retake if I fail?", a: "You must wait at least three working days, then rebook on gov.uk and pay the £23 fee again." },
    ],
  },
  "hazard-perception": {
    title: "Hazard Perception Test Guide 2026 — Scoring, Clips & Tips — UK Test Hub",
    description:
      "Free Hazard Perception Test guide. Learn how the DVSA scoring works, how to spot developing hazards early, and avoid the cheat-flag — with practice clips.",
    tagline: "Master the DVSA hazard perception scoring window before test day.",
    intro: [
      "Hazard perception is the second half of the DVSA Driving Theory Test and the part most candidates underestimate. It uses 14 short clips of real-world driving and scores you on how early you spot 15 developing hazards. Click too early and you score nothing. Click in a rhythm and the system flags you for cheating. Click at exactly the right moment and you can pick up the full five marks per hazard.",
      "This guide explains the scoring window, the most common hazard types, and the small technique tweaks that take candidates from a failing 35/75 to a comfortable 50+.",
    ],
    sections: [
      {
        heading: "How the scoring window works",
        body: [
          "Each developing hazard has a five-second scoring window. Click in the first second and you get 5 marks; second second 4 marks; third 3; fourth 2; fifth 1. Click before the window opens or after it closes and you score zero for that hazard.",
          "There are 15 hazards across 14 clips (one clip has two), so the maximum score is 75. The pass mark is 44.",
        ],
      },
      {
        heading: "What counts as a 'developing' hazard",
        body: [
          "A developing hazard is something on the road that would force you to change speed or direction. A parked car is just a feature; a parked car with brake lights coming on is a developing hazard. A child on the pavement is a feature; a child stepping off the kerb is a hazard.",
          "Train your eyes to look at the whole frame, not just the centre of the road. Most missed hazards happen at the edges — wing mirrors of parked vehicles, side roads, pedestrians stepping out from between vans.",
        ],
      },
      {
        heading: "The cheat-flag rule",
        body: [
          "The DVSA system detects rhythmic or excessive clicking and gives you zero for that clip. Never click more than three or four times per clip and never click in a steady rhythm.",
          "The safe technique: one click when you first spot the hazard developing, a second click as it becomes more serious. That's it. Resist the urge to keep clicking 'just in case'.",
        ],
      },
      {
        heading: "How to practise effectively",
        body: [
          "Use a laptop or tablet, not a phone. The clip is letterboxed and you'll miss peripheral movement on a small screen. Sit at a desk in a quiet room — distraction kills your reaction time.",
          "Watch each clip twice: first for the experience, second to see exactly when the hazard becomes 'developing'. That second view trains your eye for the real test.",
        ],
      },
      {
        heading: "Common hazards in the real test",
        body: [
          "Pedestrians stepping out from behind parked cars. Cyclists drifting toward the door zone of parked vehicles. Cars pulling out of side roads without looking. Oncoming vehicles drifting across the centre line on rural roads. Children near schools or ice-cream vans.",
          "Less common but high-scoring: animals in the road, slow-moving farm vehicles cresting a hill, pedestrians walking in the road where there's no pavement.",
        ],
      },
    ],
    faqs: [
      { q: "What is the hazard perception pass mark?", a: "44 out of 75. You also need to pass the multiple-choice section (43/50) at the same sitting." },
      { q: "How many clips are in the hazard perception test?", a: "14 clips. 13 contain one developing hazard, one contains two — 15 hazards in total." },
      { q: "What happens if I click too much?", a: "The system flags rhythmic or excessive clicking as cheating and gives you zero for that clip. Stick to one or two well-timed clicks per hazard." },
      { q: "Can I practise hazard perception on my phone?", a: "You can, but it's not recommended. The clip is letterboxed and you'll miss peripheral hazards on a small screen." },
      { q: "Do I get to redo a clip?", a: "No — each clip plays once and your clicks are recorded as you watch." },
    ],
  },
  "road-signs": {
    title: "UK Road Signs Test Guide — Shapes, Meanings & Practice — UK Test Hub",
    description:
      "Master UK road signs for the DVSA theory test. Learn the shape and colour rules, the 100 most-tested signs, and take free mock tests with answer explanations.",
    tagline: "The shape-and-colour shortcut to learning every UK road sign.",
    intro: [
      "Road signs make up roughly 15% of the DVSA Driving Theory Test, and they're the easiest marks to lose if you've never learned the shape-and-colour code. Once you know that triangles warn, circles order and rectangles inform, you can decode signs you've never seen before.",
      "This guide covers the full sign system and the 100 signs the DVSA tests most often. Every mock test on UK Test Hub draws from this same bank.",
    ],
    sections: [
      {
        heading: "The shape-and-colour code",
        body: [
          "Triangular signs warn — they tell you something is ahead. Circular signs order — they give you a command you must obey. Rectangular signs inform — speed limits, route information, parking rules.",
          "Red borders mean prohibition (you must not). Blue circles mean compulsion (you must). Green rectangles mean primary route information. Brown rectangles indicate tourist destinations.",
        ],
      },
      {
        heading: "The signs that catch people out",
        body: [
          "The 'no entry' sign (red circle with white horizontal bar) versus 'no vehicles' (red circle, blank white centre). The national speed limit sign (white circle with diagonal black line) — many candidates think this means 'end of speed limit'.",
          "Octagonal STOP signs are the only octagonal signs on UK roads — and the only signs you must legally come to a complete stop at, even if the road is clear.",
        ],
      },
      {
        heading: "Road markings as signs",
        body: [
          "Markings on the road are also tested. White lines down the centre: short broken = hazard ahead, long broken = warning of hazard, double white = no overtaking unless one line is broken on your side.",
          "Yellow lines at the kerb: single = restricted parking (times on a sign), double = no parking at any time. Zigzag yellow lines outside a school = no parking or stopping.",
        ],
      },
      {
        heading: "Motorway and direction signs",
        body: [
          "Blue background = motorway. Green background = primary A-road route. White background = non-primary routes. Brown = tourist. The colour tells you the road class without reading the destination.",
          "Motorway lane signs and matrix signs: red X means lane closed (do not enter); amber speed limit means temporary mandatory limit; arrow with red ring means leave this lane.",
        ],
      },
      {
        heading: "Study tips",
        body: [
          "Don't try to memorise individual signs. Learn the system first (shape + colour = meaning) then drill the specific signs that don't follow the rule (STOP, give way, no entry, national speed limit).",
          "Use free flashcard apps for the 30 most-tested signs in the final week. Then take three full mocks under timed conditions to lock everything in.",
        ],
      },
    ],
    faqs: [
      { q: "How many road signs are tested in the DVSA exam?", a: "Around 7–10 of the 50 multiple-choice questions involve signs or road markings." },
      { q: "Are road signs tested in hazard perception?", a: "Indirectly — you need to read signs in the clips to anticipate hazards (e.g. a school sign tells you children may be present)." },
      { q: "Is the Road Signs Test a separate exam?", a: "No — it's part of the standard DVSA Driving Theory Test, not a separate sitting. Our 'Road Signs Test' is a focused practice paper." },
      { q: "Do learner motorcyclists need to know the same signs?", a: "Yes, plus a few additional signs specific to motorcycles and bus lanes." },
    ],
  },
  "motorcycle-theory": {
    title: "Motorcycle Theory Test Guide 2026 — Module 1 & 2 — UK Test Hub",
    description:
      "Free Motorcycle Theory Test guide for 2026. Format, syllabus, CBT context, hazard perception and study plan — with unlimited mock papers.",
    tagline: "Pass the DVSA Motorcycle Theory Test before your Module 1 booking.",
    intro: [
      "The Motorcycle Theory Test is identical in format to the car theory — 50 multiple choice plus 14 hazard perception clips — but the question bank is biased toward two-wheel hazards: lifesaver checks, gear, group riding, and the specific vulnerabilities of motorcyclists in traffic.",
      "You need to pass theory before you can book Modules 1 and 2 (the practical tests). This guide covers the syllabus, the bike-specific topics that catch car drivers out, and the most efficient study plan for the four-week run-up.",
    ],
    sections: [
      {
        heading: "Format and pass mark",
        body: [
          "50 multiple-choice questions in 57 minutes (43 to pass) and 14 hazard perception clips with 15 developing hazards (44/75 to pass). Same fee as the car theory: £23 via gov.uk.",
          "You must pass both parts at the same sitting. Pass and the certificate is valid for two years — book Modules 1 and 2 inside that window or you'll need to retake the theory.",
        ],
      },
      {
        heading: "Bike-specific topics to learn",
        body: [
          "Lifesaver checks: the over-shoulder glance before changing direction. PPE: helmet standards (UNECE 22.06 from 2024), jacket and glove abrasion ratings, hi-vis legality. Group riding: staggered formation, marker system at junctions.",
          "Vulnerability in traffic: SMIDSY ('sorry mate, I didn't see you'), positioning to be seen, white-line slip in the wet, diesel spills at roundabouts.",
        ],
      },
      {
        heading: "How CBT relates to theory",
        body: [
          "Your Compulsory Basic Training (CBT) certificate lets you ride a 125cc bike with L plates for two years, but only after you've completed the on-road element. CBT is not a substitute for theory — you still need to pass theory before Module 1.",
          "If you let your CBT expire without passing your full test, you must retake the whole CBT. Theory passes are also two years and must be in date when you sit Modules 1 and 2.",
        ],
      },
      {
        heading: "Study plan",
        body: [
          "Week 1: read the Highway Code with focus on chapters covering motorcyclists, junctions, roundabouts and overtaking. Week 2: one mock per day, reviewing every wrong answer. Week 3: drill weak areas (most riders struggle with motorway rules and other-vehicle questions). Week 4: timed full mocks under exam conditions.",
        ],
      },
    ],
    faqs: [
      { q: "Is the Motorcycle Theory Test different from the car theory?", a: "Same format and fee, but a different question bank weighted toward bike-specific hazards and rules." },
      { q: "How long is my theory pass valid?", a: "Two years. You must pass Modules 1 and 2 inside that window or retake the theory." },
      { q: "Do I need a CBT before booking theory?", a: "No — you can sit theory at any time once you're 16 (moped) or 17 (motorcycle), but you'll need a CBT to ride on the road." },
      { q: "What's the helmet standard from 2024 onwards?", a: "UNECE 22.06 is the current standard. Helmets to the older 22.05 are still legal but newly-sold helmets must meet 22.06." },
    ],
  },

  // -------- CITIZENSHIP -----------------------------------------------
  "life-in-the-uk": {
    title: "Life in the UK Test Guide 2026 — Format, Pass Mark & Tips",
    description:
      "Complete Life in the UK Test guide for 2026. Home Office format, 24-question pass mark, study handbook, history and government topics — with free mocks.",
    tagline: "The official Home Office test for ILR and British citizenship — explained.",
    intro: [
      "The Life in the UK Test is the Home Office's check that you understand British history, traditions, government and law. You need it for Indefinite Leave to Remain (ILR / settlement) and for British citizenship. It's 24 multiple-choice questions in 45 minutes, all drawn from the official handbook 'Life in the United Kingdom: A Guide for New Residents' (3rd edition).",
      "The pass mark is 75% — that's 18 out of 24. Around a quarter of candidates fail their first attempt, almost always because they relied on free online lists instead of reading the official handbook.",
    ],
    sections: [
      {
        heading: "Format and pass mark",
        body: [
          "24 questions in 45 minutes at a Home Office-approved test centre. Pass mark 18/24 (75%). Fee £50, booked at gov.uk/life-in-the-uk-test.",
          "Question types: pick one of four; pick two correct from four; true/false; pick the correct statement from two. The on-screen prompt always tells you which type.",
        ],
      },
      {
        heading: "What's in the handbook",
        body: [
          "Five chapters: The values and principles of the UK; What is the UK; A long and illustrious history; A modern, thriving society; The UK government, the law and your role. Roughly half the questions come from the history chapter — the longest and most detailed.",
          "Buy the official 3rd edition handbook (around £13) directly from TSO. Avoid PDF copies online — they're often outdated and miss the questions that actually appear on the test.",
        ],
      },
      {
        heading: "How to study and pass first time",
        body: [
          "Read the handbook cover to cover at least once before you take any mocks. The history chapter is dense — break it into 30-minute sessions and make a personal timeline as you go.",
          "Then drill mocks for two to three weeks. After every wrong answer, find the relevant page in the handbook and re-read the surrounding paragraph. The Home Office sometimes phrases questions in ways no online practice site has — only the handbook covers everything.",
        ],
      },
      {
        heading: "Hardest topics",
        body: [
          "Specific dates in British history (when did the Romans leave, when was the Magna Carta signed). Names of British historical figures (Bagehot, Boudicca, Brunel). Patron saints and their feast days. Devolved powers of the Scottish Parliament, Welsh Senedd and Northern Ireland Assembly. The role of the monarch, Prime Minister and Lord Chancellor.",
          "Sport, art and literature questions are deceptively hard — the handbook lists specific authors, painters and architects you're expected to recognise.",
        ],
      },
      {
        heading: "Booking and what to bring",
        body: [
          "Book at gov.uk and pay £50. You need a valid passport (or BRP) as ID. Take it with you on the day along with proof of address dated within the last three months (utility bill, bank statement, council tax).",
          "Arrive 15 minutes early. No phones, no notes, no bags in the test room. Result is on screen straight away and you'll get a confirmation letter to use with your ILR or citizenship application.",
        ],
      },
    ],
    faqs: [
      { q: "What is the Life in the UK Test pass mark?", a: "18 out of 24 (75%)." },
      { q: "How much does the Life in the UK Test cost?", a: "£50, booked through gov.uk/life-in-the-uk-test." },
      { q: "How long is the test?", a: "45 minutes for 24 multiple-choice questions." },
      { q: "What ID do I need?", a: "Valid passport or BRP, plus proof of address dated within the last three months." },
      { q: "How soon can I rebook if I fail?", a: "After seven days. There's no limit on retakes but you'll pay £50 each time." },
      { q: "Do I need the official handbook?", a: "Yes — many questions are drawn from specific paragraphs not summarised on free online sites." },
      { q: "Is the test accepted for both ILR and citizenship?", a: "Yes, the same pass certificate is valid for both." },
    ],
  },
  "british-citizenship": {
    title: "British Citizenship Test Guide 2026 — Naturalisation, Ceremony & Oath",
    description:
      "Free British Citizenship guide for 2026. Naturalisation rules, residency requirements, the Life in the UK Test, the citizenship ceremony and oath — with practice questions.",
    tagline: "From ILR to British passport — the naturalisation route explained.",
    intro: [
      "British citizenship by naturalisation is the final step for most adult migrants who already hold Indefinite Leave to Remain (ILR). Once granted, you can hold a British passport, vote in all UK elections, stand for public office and pass citizenship to your children born outside the UK. The Home Office charges £1,630 in 2026 (adult application) and decisions usually take three to six months.",
      "This guide covers exactly what the Home Office checks, the residency maths most applicants get wrong, and what happens at the citizenship ceremony. Use the practice questions below to lock in the facts you'll need both for the Life in the UK Test and for any interview the Home Office may request.",
    ],
    sections: [
      {
        heading: "Who qualifies for naturalisation",
        body: [
          "You must be 18 or over, of sound mind and 'good character' (no recent unspent convictions, no immigration breaches, paid taxes). You'll normally need ILR or settled status held for at least 12 months — unless you're married to a British citizen, in which case there's no 12-month wait.",
          "Residency: at least five years lawfully in the UK before the application date (three if married to a British citizen), with no more than 450 days outside the UK in those five years (270 if the three-year route) and no more than 90 days outside in the final 12 months.",
        ],
      },
      {
        heading: "Knowledge of life and language",
        body: [
          "You must pass the Life in the UK Test (24 questions, 18 to pass, £50). You also need to prove English at CEFR B1 or above — usually with a Secure English Language Test (SELT) certificate or a degree taught in English. People over 65 are exempt from both.",
          "Both certificates are kept by you and uploaded with the AN form. They have no expiry for citizenship purposes once issued.",
        ],
      },
      {
        heading: "The application — Form AN",
        body: [
          "Apply online at gov.uk using Form AN. You'll need two referees (one professional, one British citizen who has known you 3+ years), your passport, BRP, Life in the UK certificate, English evidence and a complete travel history for the qualifying period — to the day.",
          "The biggest cause of refusal is missing or wrong absence dates. Get them from your passport stamps, airline emails and the new ETA / EES record before you start. A single overlooked trip can fail the residency requirement.",
        ],
      },
      {
        heading: "The citizenship ceremony and oath",
        body: [
          "If approved, you have 90 days to attend a ceremony at your local council. You take an Oath of Allegiance to the King (or a non-religious Affirmation) and a Pledge to the UK, then receive your naturalisation certificate. Only after the ceremony can you apply for a British passport.",
          "Ceremonies are usually small group events; you can bring two guests. Smart dress is expected. The council fee (£80) is included in the £1,630 application charge.",
        ],
      },
      {
        heading: "Common reasons for refusal",
        body: [
          "Failing the good-character test (recent driving offences, unpaid council tax, undeclared cash work). Exceeding absence limits. Incorrect referee details. Forgetting to update HMRC after a name or address change. The Home Office cross-checks DWP, HMRC and police records — declare everything.",
          "If refused you can request a reconsideration (£372) within 28 days. Most successful reconsiderations turn on new evidence rather than legal argument.",
        ],
      },
    ],
    faqs: [
      { q: "How long does British citizenship take?", a: "Three to six months from a complete application. Complex cases (criminal record, long absences) can take 12 months." },
      { q: "How much does it cost in 2026?", a: "£1,630 for an adult application, including the £80 ceremony fee. Children pay £1,214." },
      { q: "Do I need to give up my old citizenship?", a: "The UK allows dual nationality, but check your home country's rules — some (India, China, Singapore) automatically revoke citizenship if you naturalise elsewhere." },
      { q: "What's the absence limit?", a: "No more than 450 days outside the UK in the five years before applying, and no more than 90 days in the final 12 months." },
      { q: "Can I apply before I get ILR?", a: "Only if married to a British citizen and already settled. Everyone else needs ILR plus 12 months." },
      { q: "What happens at the ceremony?", a: "You take the Oath (or Affirmation) and Pledge in front of a council registrar, then receive your naturalisation certificate. Two guests welcome." },
    ],
  },
  "uk-laws-rights": {
    title: "UK Laws & Rights Quiz Guide — Everyday Law for Residents",
    description:
      "Free guide to UK everyday laws and rights. Equality Act, employment rights, consumer protection, criminal vs civil law, police powers — with practice questions.",
    tagline: "The laws every UK resident is expected to know — explained simply.",
    intro: [
      "Everyone living in the UK — citizen, settled migrant or visa holder — is expected to follow British law and know their basic rights. Many of these rules also appear on the Life in the UK Test, the SIA security exams and most professional licensing tests.",
      "This guide summarises the laws and rights you encounter day to day: at work, when shopping, when stopped by police, and when something goes wrong. Use the practice quiz to check what you've learned.",
    ],
    sections: [
      {
        heading: "Equality and human rights",
        body: [
          "The Equality Act 2010 makes it illegal to discriminate against anyone because of nine 'protected characteristics': age, disability, gender reassignment, marriage and civil partnership, pregnancy and maternity, race, religion or belief, sex, and sexual orientation.",
          "The Human Rights Act 1998 brings the European Convention on Human Rights into UK law. Key rights include the right to life, to a fair trial, to private and family life, and freedom of expression. These apply to everyone in the UK regardless of immigration status.",
        ],
      },
      {
        heading: "Employment rights",
        body: [
          "From day one of work you have the right to a written statement of terms, the National Minimum Wage (£11.44+ for 21 and over in 2024/25, rising annually), protection from unlawful discrimination, and itemised payslips. Statutory sick pay starts after four days off sick.",
          "After two years' continuous service you gain protection from unfair dismissal and the right to statutory redundancy pay. Holiday entitlement is 5.6 weeks per year (28 days for a five-day week, including bank holidays).",
        ],
      },
      {
        heading: "Consumer protection",
        body: [
          "The Consumer Rights Act 2015 says goods must be of satisfactory quality, fit for purpose and as described. You can reject faulty goods for a full refund within 30 days. After that, the seller gets one chance to repair or replace.",
          "Online and distance purchases give you 14 days to change your mind under the Consumer Contracts Regulations — no reason needed. Doorstep sales have the same 14-day cooling-off period.",
        ],
      },
      {
        heading: "Criminal vs civil law",
        body: [
          "Criminal law deals with offences against the state — theft, assault, fraud, driving offences. Cases are brought by the Crown Prosecution Service in the Magistrates' Court (less serious) or Crown Court (jury trial). The standard of proof is 'beyond reasonable doubt'.",
          "Civil law deals with disputes between individuals or organisations — contract breaches, debt, family matters, negligence. Cases are heard in the County Court or High Court and the standard is 'balance of probabilities'.",
        ],
      },
      {
        heading: "Police powers and your rights",
        body: [
          "Police can stop and search you under PACE 1984 if they have reasonable grounds to suspect you're carrying stolen or prohibited items. They must tell you their name, station, and the reason for the search, and give you a written record on request.",
          "If arrested you have the right to free legal advice, to have someone informed of your arrest, and to see the codes of practice. You can normally be held for up to 24 hours without charge (96 with magistrates' approval).",
        ],
      },
    ],
    faqs: [
      { q: "What are the nine protected characteristics?", a: "Age, disability, gender reassignment, marriage/civil partnership, pregnancy/maternity, race, religion or belief, sex, and sexual orientation." },
      { q: "What's the UK minimum wage in 2026?", a: "Updated each April. From April 2025 the National Living Wage applies to all workers aged 21 and over. Check gov.uk/national-minimum-wage-rates for the current figure." },
      { q: "How long can I be held without charge?", a: "Normally 24 hours, extendable to 36 by a senior officer and to 96 by a magistrate. Terrorism cases can be longer." },
      { q: "What's the difference between civil and criminal court?", a: "Criminal courts decide if someone broke the law and punish them. Civil courts decide private disputes and order remedies like compensation." },
      { q: "Can I get a refund on a faulty item?", a: "Yes — full refund within 30 days under the Consumer Rights Act 2015. After that the seller can offer repair or replacement first." },
      { q: "Do these rights apply to non-citizens?", a: "Most do. The Equality Act, Human Rights Act, employment rights and consumer rights apply to everyone lawfully in the UK." },
    ],
  },
  "uk-geography": {
    title: "UK Geography Test Guide — Nations, Capitals, Rivers & Landmarks",
    description:
      "Free UK Geography quiz guide. Four nations, capital cities, mountains, rivers, regions and landmarks — perfect alongside the Life in the UK Test.",
    tagline: "The places, regions and landmarks every UK resident should recognise.",
    intro: [
      "UK geography appears throughout the Life in the UK Test, school SATs, GCSE Geography and many quiz nights. Beyond exams, knowing the nations, capitals and major regions helps you navigate news, weather forecasts and everyday conversation in Britain.",
      "This guide covers the four nations, the major cities, mountains, rivers and the cultural landmarks that define each part of the UK. Use the practice quiz to test recall.",
    ],
    sections: [
      {
        heading: "The four nations",
        body: [
          "The United Kingdom is made up of four countries: England (capital London), Scotland (Edinburgh), Wales (Cardiff) and Northern Ireland (Belfast). Together they form 'the UK' — but 'Great Britain' refers only to England, Scotland and Wales (the largest island).",
          "The British Isles is a wider geographical term that also includes the Republic of Ireland, the Isle of Man and the Channel Islands. The Republic of Ireland is an independent country, not part of the UK.",
        ],
      },
      {
        heading: "Capital cities and population centres",
        body: [
          "London is the UK capital and by far the largest city (around 9 million). Other major English cities: Birmingham, Manchester, Liverpool, Leeds, Sheffield, Bristol, Newcastle. Scotland's largest city is Glasgow (capital is Edinburgh). Wales: Cardiff and Swansea. Northern Ireland: Belfast and Derry/Londonderry.",
          "England has nine official regions, including London, the South East, North West and Yorkshire & the Humber. Scotland is divided into 32 council areas; Wales into 22 principal areas; Northern Ireland into 11 districts.",
        ],
      },
      {
        heading: "Mountains, rivers and coast",
        body: [
          "Highest peaks: Ben Nevis in Scotland (1,345 m — highest in the UK), Snowdon / Yr Wyddfa in Wales (1,085 m), Scafell Pike in England (978 m), Slieve Donard in Northern Ireland (850 m).",
          "Longest rivers: Severn (354 km — flows from Wales through England), Thames (346 km — through London), Trent, Great Ouse, Wye. The Lake District (England) and Loch Lomond (Scotland) are the most famous lakes; Loch Ness is the deepest.",
        ],
      },
      {
        heading: "Famous landmarks",
        body: [
          "Stonehenge (Wiltshire), Hadrian's Wall (Northumberland), the Tower of London, Buckingham Palace, Big Ben (the Elizabeth Tower), Edinburgh Castle, Snowdonia / Eryri National Park, the Giant's Causeway (Northern Ireland), the White Cliffs of Dover, the Angel of the North (Gateshead).",
          "Many appear in Life in the UK Test questions — learn at least one famous landmark per nation and the era it dates from.",
        ],
      },
      {
        heading: "Patron saints and national symbols",
        body: [
          "Each nation has a patron saint and a feast day: St George (England, 23 April), St Andrew (Scotland, 30 November), St David (Wales, 1 March), St Patrick (Northern Ireland, 17 March).",
          "National flowers: rose (England), thistle (Scotland), daffodil/leek (Wales), shamrock (Northern Ireland). The Union Jack combines the crosses of St George, St Andrew and St Patrick — Wales is not represented because it was already part of the Kingdom of England when the flag was designed.",
        ],
      },
    ],
    faqs: [
      { q: "What's the difference between the UK and Great Britain?", a: "Great Britain = England, Scotland, Wales (the main island). The UK = Great Britain plus Northern Ireland." },
      { q: "What is the highest mountain in the UK?", a: "Ben Nevis in Scotland, at 1,345 metres." },
      { q: "What is the longest river in the UK?", a: "The River Severn at 354 km, rising in Wales and flowing through England to the Bristol Channel." },
      { q: "When are the patron saints' days?", a: "St David 1 March (Wales), St Patrick 17 March (NI), St George 23 April (England), St Andrew 30 November (Scotland)." },
      { q: "Why isn't Wales on the Union Jack?", a: "Wales was already united with England when the flag was created, so it wasn't shown as a separate kingdom." },
    ],
  },

  // -------- ENGLISH ---------------------------------------------------

  // -------- ENGLISH ---------------------------------------------------
  ielts: {
    title: "IELTS Practice Guide — Listening, Reading, Writing & Speaking",
    description:
      "Free IELTS practice guide. Academic vs General Training, band scoring, the four sections explained, and study plan — with unlimited practice questions.",
    tagline: "The four-skill English test used for UK visas, university and PR worldwide.",
    intro: [
      "IELTS (International English Language Testing System) is the most widely accepted English test in the UK and Commonwealth. It's used for student visas (CAS), skilled worker visas, university entry, and Australian/Canadian/New Zealand PR. There are two versions: Academic (for university and professional registration) and General Training (for visas and immigration).",
      "Each version tests four skills — Listening, Reading, Writing, Speaking — scored band 0 to 9. Most UK universities ask for an overall 6.5 with no band below 6.0. UKVI Skilled Worker visas ask for B1 (band 4.0+).",
    ],
    sections: [
      {
        heading: "Academic vs General Training",
        body: [
          "Listening and Speaking are the same in both versions. Reading and Writing differ: Academic uses university-style passages and asks for an essay analysing data; General Training uses everyday and workplace texts and asks for a letter plus an opinion essay.",
          "Pick General Training for UK visas and immigration. Pick Academic if you're applying to a UK university or for professional registration (NMC for nurses, GMC for doctors).",
        ],
      },
      {
        heading: "How band scores work",
        body: [
          "Each skill is scored 0–9 in 0.5 increments. Your overall band is the average of the four, rounded to the nearest 0.5 (so 6.25 rounds to 6.5; 6.125 rounds to 6.0).",
          "Band 6 = competent user. Band 7 = good user. Band 8 = very good. Most UK Master's programmes want 6.5 overall with 6.0 minimum in each. Pre-registration NMC nursing wants 7.0 overall with 7.0 in Speaking, Listening and Reading and 6.5 in Writing.",
        ],
      },
      {
        heading: "Section-by-section",
        body: [
          "Listening: 30 minutes, 40 questions across four recordings (a social conversation, a monologue, an academic discussion, a lecture). Headphones supplied.",
          "Reading: 60 minutes, 40 questions, three long passages. Academic uses journal and textbook style; General uses adverts, notices, manuals.",
          "Writing: 60 minutes, two tasks. Task 2 (essay) is worth twice as much as Task 1 — start with Task 2.",
          "Speaking: 11–14 minute face-to-face interview with a certified examiner. Three parts: introduction, long-turn (you talk for 1–2 minutes), discussion.",
        ],
      },
      {
        heading: "Study plan",
        body: [
          "Allow eight weeks if you're around band 5 and aiming for band 6.5. Spend half your time on Writing — it's the section that holds most candidates back. Get a tutor or marker to grade at least three full essays so you can target weaknesses.",
          "Listening and Reading respond fastest to practice. Drill timed papers daily and review every wrong answer to find the keyword you missed.",
        ],
      },
      {
        heading: "Booking and on the day",
        body: [
          "Book through the British Council, IDP, or Cambridge English. Computer-delivered IELTS gives results in 3–5 days; paper IELTS in 13. The fee is £210–£250 depending on test centre and version.",
          "Bring your passport (the same one you used to book). Arrive 30 minutes early. Speaking may be on the same day or up to seven days later — check your booking confirmation.",
        ],
      },
    ],
    faqs: [
      { q: "What is the IELTS pass mark?", a: "There's no fixed pass mark — institutions set their own minimum band. Most UK universities require 6.5 overall." },
      { q: "How much does IELTS cost?", a: "£210–£250 depending on test centre and version. Computer-delivered is the same price as paper but results come faster." },
      { q: "How long are IELTS results valid?", a: "Two years for most purposes. UKVI Life Skills English certificates have no expiry but the test report does." },
      { q: "What's the difference between IELTS and IELTS for UKVI?", a: "Same test, but UKVI versions are at Home Office-approved centres and can be used for UK visa applications. Always book the UKVI version if your purpose is a visa." },
      { q: "Can I retake just one section?", a: "Yes — IELTS One Skill Retake lets you retake Listening, Reading, Writing or Speaking once within 60 days, for a fee, if you took computer-delivered IELTS." },
    ],
  },
  esol: generic("ESOL Practice", "an Ofqual-regulated awarding body (Trinity, City & Guilds, Pearson)", "a regulated English for Speakers of Other Languages qualification used for UK visas, settlement and citizenship at A1, A2, B1, B2, C1 or C2 level"),
  toefl: generic("TOEFL Practice", "ETS (Educational Testing Service)", "an internet-based English test (TOEFL iBT) used worldwide for university admission, scored 0–120 across reading, listening, speaking and writing"),
  grammar: generic("Grammar & Vocabulary", "no single awarding body — used for general English improvement", "a focused practice set on tenses, prepositions, articles, collocations and academic vocabulary, useful as warm-up before IELTS, TOEFL or ESOL"),

  // -------- EDUCATION -------------------------------------------------
  "eleven-plus": generic("11+ Exam Practice", "GL Assessment, CEM and individual grammar schools", "the entrance exam for UK grammar schools and many independent secondaries, sat in Year 6, covering verbal reasoning, non-verbal reasoning, English and maths"),
  "gcse-maths": generic("GCSE Maths", "AQA, Edexcel, OCR and WJEC", "the Foundation or Higher tier GCSE Maths exam, sat at the end of Year 11 and graded 1–9 (with 4 a standard pass and 5 a strong pass)"),
  "gcse-english": generic("GCSE English", "AQA, Edexcel, OCR and WJEC", "the GCSE English Language and Literature exams, graded 1–9, with English Language a hard requirement for most UK colleges, apprenticeships and jobs"),
  sats: generic("SATs KS1 / KS2", "the Standards & Testing Agency", "the national curriculum tests sat at the end of Year 2 (KS1) and Year 6 (KS2), covering reading, grammar, punctuation, spelling and maths"),

  // -------- CAREER ----------------------------------------------------
  numerical: generic("Numerical Reasoning", "SHL, Cubiks, Talent Q, Kenexa and Saville", "a timed test of your ability to interpret tables, charts and percentages — used by graduate schemes, finance, consulting and the Civil Service"),
  verbal: generic("Verbal Reasoning", "SHL, Cubiks, Talent Q and Saville", "a timed comprehension test where you mark statements True / False / Cannot Say based on a short business passage"),
  logical: generic("Logical Reasoning", "SHL, Cubiks, Saville and Kenexa", "a non-verbal test (also called inductive or abstract reasoning) where you spot patterns in shape sequences"),
  sjt: generic("Situational Judgement", "individual employers and assessment houses", "a workplace-scenario test where you rank or pick the most effective response — heavily used in NHS, Civil Service, police and graduate schemes"),

  // -------- PROFESSIONAL ----------------------------------------------
  "food-hygiene": generic("Food Hygiene Level 2", "Highfield, RSPH, CIEH and other Ofqual-recognised bodies", "the legally-expected entry-level food safety qualification for anyone handling open food in the UK — covers HACCP basics, personal hygiene, cross-contamination and temperature control"),
  "first-aid": generic("First Aid Theory", "the FAA, Qualsafe, Highfield and St John Ambulance", "the theory portion of regulated first aid qualifications including Emergency First Aid at Work (EFAW) and First Aid at Work (FAW)"),
  "fire-safety": generic("Fire Safety Awareness", "the Institute of Fire Safety Managers and Highfield", "a Level 1/2 awareness qualification on fire prevention, the fire triangle, extinguisher classes and the duties under the Regulatory Reform (Fire Safety) Order 2005"),
  "manual-handling": generic("Manual Handling Awareness", "RoSPA, Highfield and IOSH", "training in safe lifting and the Manual Handling Operations Regulations 1992, required for most warehouse, care, hospitality and construction roles"),
  "health-safety-awareness": generic("Health & Safety Awareness", "IOSH, NEBOSH and CITB", "a general workplace H&S overview covering the Health and Safety at Work Act 1974, risk assessment, RIDDOR and PPE"),
  "gdpr-awareness": generic("GDPR / Data Protection Awareness", "the BCS and IAPP", "an awareness-level qualification on UK GDPR and the Data Protection Act 2018 — covering lawful bases, data subject rights and breach reporting to the ICO"),

  // -------- NHS -------------------------------------------------------
  "nhs-numeracy": generic("NHS Numeracy Test", "individual NHS Trusts (often using SHL or Capp tests)", "the numerical reasoning test used in NHS recruitment for nursing, midwifery, healthcare assistant and admin roles — drug calculations, percentages and shift-pattern maths"),
  "nhs-literacy": generic("NHS Literacy Test", "individual NHS Trusts", "the verbal reasoning and written-English test used at NHS interview stage to check comprehension and clear written communication"),
  "nhs-values": generic("NHS Values-Based Recruitment", "Health Education England", "a situational judgement test rooted in the six NHS Constitution values — used at shortlisting for almost every NHS clinical and non-clinical role"),
  "nmc-cbt": generic("NMC CBT (Nurses)", "the Nursing and Midwifery Council, delivered by Pearson VUE", "the Computer Based Test for international nurses and midwives applying for NMC registration — a 115-question multiple-choice paper covering professional values and clinical practice"),

  // -------- TAXI / PRIVATE HIRE ---------------------------------------
  seru: {
    title: "SERU TfL Mock Test Guide — Private Hire Driver Test — UK Test Hub",
    description:
      "Complete TfL SERU assessment guide. Format, pass mark, the 10 syllabus areas and study tips — with free mock tests reflecting the real TfL exam.",
    tagline: "The TfL Safety, Equality and Regulatory Understanding test for London PHV drivers.",
    intro: [
      "The TfL SERU assessment is mandatory for every new London private hire driver since October 2021. It's a 1-hour, 60-question multiple-choice test taken at a TfL-approved centre and you must pass it before TfL will issue your PHV licence.",
      "The pass mark is 36 out of 60 (60%). Roughly 40% of candidates fail their first attempt, almost always on the safeguarding and equality sections. This guide covers every syllabus area and the most efficient way to prepare.",
    ],
    sections: [
      {
        heading: "Format and pass mark",
        body: [
          "60 multiple-choice questions in 60 minutes at a TfL-approved centre. Pass mark 36/60. Fee around £36 each attempt. Up to three attempts in any 18-month period before TfL pause your application.",
          "Questions are scenario-based: 'A passenger asks you to do X — what do you do?' The right answer is almost always the safest, most legally compliant and most respectful option. Common-sense alone won't get you 60% — you need to know the specific TfL rules.",
        ],
      },
      {
        heading: "The 10 syllabus areas",
        body: [
          "(1) Driver behaviour and conduct. (2) Driving standards. (3) Vehicle safety, security and roadworthiness. (4) Passenger safety, including disabilities and assistance dogs. (5) Equality. (6) Safeguarding. (7) Legislative requirements (Equality Act 2010, Children Act 1989). (8) Notifying TfL of changes. (9) Insurance, MOT, hire and reward. (10) Routes and London geography basics.",
          "Safeguarding and equality usually account for 15+ of the 60 questions. Drill these areas hardest.",
        ],
      },
      {
        heading: "Safeguarding — the make-or-break section",
        body: [
          "Know the categories of abuse (physical, sexual, emotional, neglect, financial, modern slavery, child sexual exploitation, domestic abuse). Know the four Rs: Recognise, Respond, Report, Record.",
          "If you suspect a child or vulnerable adult is at immediate risk, call 999. For non-immediate concerns, report to the local council safeguarding team and notify TfL. Never investigate yourself, never confront the suspected abuser, never promise confidentiality to the victim.",
        ],
      },
      {
        heading: "Equality and assistance dogs",
        body: [
          "You must accept assistance dogs at no extra charge. Refusal is a criminal offence under the Equality Act 2010 unless you have a TfL-issued medical exemption certificate (and the certificate must be displayed in your vehicle).",
          "You must accept passengers in wheelchairs at no extra charge if your vehicle is wheelchair accessible. You may not charge extra for assistance, loading time, or for guide-dog passengers.",
        ],
      },
      {
        heading: "How to study",
        body: [
          "Read the official TfL Private Hire Driver's Handbook (free PDF on tfl.gov.uk) cover to cover. Then drill the SERU mocks on UK Test Hub for two to three weeks. After every wrong answer, find the rule in the handbook.",
          "Most failed candidates skip the handbook and go straight to mocks. Don't — the handbook contains specific phrases TfL test on.",
        ],
      },
      {
        heading: "Booking and on the day",
        body: [
          "Book through your TfL applicant portal. Bring photo ID (passport or driving licence). Arrive 15 minutes early. No phones, no notes, no bags in the test room.",
          "Result is on screen at the end. Pass certificates go straight to TfL automatically — you don't need to send anything in.",
        ],
      },
    ],
    faqs: [
      { q: "What is the SERU pass mark?", a: "36 out of 60 (60%)." },
      { q: "How much does the SERU cost?", a: "Around £36 per attempt at a TfL-approved centre." },
      { q: "How many attempts do I get?", a: "Three attempts within any 18-month rolling window. After three fails TfL will pause your application." },
      { q: "Can I retake just the parts I failed?", a: "No — every retake is the full 60-question paper." },
      { q: "Do I need the Topographical Test as well?", a: "Yes — both SERU and Topographical are mandatory before TfL issues a new PHV licence." },
      { q: "How long does my SERU pass stay valid?", a: "It's valid for the duration of your PHV application and licence — you don't need to retake it at renewal." },
    ],
  },
  topographical: generic("Topographical Assessment Practice", "Transport for London (TfL)", "the London map-reading and route-planning assessment for new PHV drivers, taken at a TfL-approved centre"),
  "phv-licence": generic("Private Hire Driver Licence Knowledge Test", "your local licensing authority (council)", "the council-set knowledge check that most non-London PHV drivers must pass before being licensed — covering local geography, byelaws, and Equality Act duties"),
  "ph-safety-equality": generic("Safety, Equality & Regulatory Awareness Test", "Transport for London", "a focused practice paper on the safety, equality and regulatory portions of the TfL SERU syllabus"),
  "ph-safeguarding": generic("Safeguarding Awareness Practice Test", "Transport for London and the Department for Education guidance", "a focused practice paper on the safeguarding section of the SERU — types of abuse, the four Rs, and reporting routes"),
  "ph-english": generic("English Language Requirement Practice", "TfL (UK Government English requirement B1)", "the SCELA (Speaking and Listening English Language Assessment) practice for London PHV drivers — equivalent to CEFR B1"),
  "ph-speaking-listening": generic("Speaking & Listening Practice", "TfL and the Pearson SCELA assessment", "the speaking and listening element of the TfL English requirement, with role-play scenarios mirroring real passenger interactions"),
  "congestion-charge": generic("Congestion Charge Quiz", "Transport for London", "the rules of the Central London Congestion Charge zone — hours, fee, exemptions, residents' discount and PHV exemption rules"),
  ulez: generic("Ultra Low Emission Zone Quiz", "Transport for London", "the rules of the London-wide ULEZ — emissions standards (Euro 4 petrol, Euro 6 diesel), daily charge, exemptions and grace periods"),
  "ph-dbs-licensing": generic("DBS & Licensing Rules Quiz", "the DBS and individual licensing authorities", "the enhanced DBS check and licensing rules for PHV drivers — what disclosures must be reported and when"),
  "ph-badge-rules": generic("Private Hire Driver Badge Rules Quiz", "Transport for London and your council", "the rules on wearing, displaying and looking after your PHV driver badge and vehicle disc"),
  "ph-assistance-dogs": generic("Assistance Dogs & Accessibility Duties Quiz", "the Equality Act 2010", "your legal duties to assistance-dog owners and disabled passengers — including the medical exemption process and penalties for refusal"),
  "ph-passenger-safety": generic("Passenger Safety & Driver Conduct Quiz", "Transport for London", "the conduct rules for PHV drivers — fares, route choice, lost property, complaints handling and TfL reporting duties"),
  "ph-hmrc-tax-check": generic("HMRC Tax Check Awareness Quiz", "HM Revenue & Customs and licensing authorities", "the mandatory HMRC tax check at every PHV licence renewal since 2022 — what it asks, the 9-character code and how it's submitted"),
  "ph-london-regulations": generic("London Private Hire Regulations Quiz", "Transport for London", "the wider London PHV regulations — bookings, operator-driver duties, vehicle livery, signage and pre-booking rules"),

  // -------- SECURITY --------------------------------------------------
  "sia-door-supervisor": generic("SIA Door Supervisor Test", "the Security Industry Authority (SIA), assessed by Highfield, Industry Qualifications and other Ofqual-regulated bodies", "the licence-linked qualification you need to work as a door supervisor in licensed premises in England, Wales and Northern Ireland — covering conflict management, physical intervention and the Private Security Industry Act 2001"),
  "sia-cctv": generic("SIA CCTV Operator Test", "the SIA via Highfield, IQ and other awarding bodies", "the SIA licence-linked qualification for public space surveillance (CCTV) operators — covering operating procedures, the Data Protection Act 2018 and incident management"),
  "sia-close-protection": generic("SIA Close Protection Test", "the SIA via Highfield and IQ", "the SIA licence-linked qualification for close protection officers (bodyguards) — a 14-day course with written exams covering threat assessment, route planning and law"),
  "sia-top-up": generic("SIA Door Supervisor Top-Up Test", "the SIA", "the mandatory top-up for existing door supervisors at first renewal since 2021 — covering terror threat awareness (ACT), first aid response and emergency procedures"),

  // -------- HOSPITALITY ----------------------------------------------
  "aplh-personal-licence": generic("Personal Licence (APLH) Test", "Highfield, BIIAB and other Ofqual-regulated bodies", "the Award for Personal Licence Holders — the qualification you need to apply for a Personal Licence under the Licensing Act 2003, allowing you to authorise alcohol sales"),
  "allergen-awareness": generic("Allergen Awareness Test", "Highfield, RSPH and CIEH", "a Level 2 qualification covering the 14 named food allergens, Natasha's Law, cross-contamination control and customer communication"),
  "haccp-level-2": generic("HACCP Level 2 Test", "Highfield, RSPH and CIEH", "the Level 2 qualification in the principles of HACCP — the seven principles, critical control points, monitoring and record-keeping for food businesses"),
  "customer-service": generic("Customer Service Practice", "City & Guilds, Highfield and CIEH", "general customer-service practice questions useful for hospitality, retail and front-of-house roles — communication, complaint handling and service recovery"),

  // -------- CONSTRUCTION ---------------------------------------------
  "cscs-operative": generic("CSCS Operative Test", "CITB on behalf of CSCS", "the CITB Health, Safety and Environment Test for operatives — the test you need to pass to apply for a green CSCS Labourer card and work on most UK building sites"),
  "cscs-gold": generic("CSCS Gold (Supervisor) Test", "CITB on behalf of CSCS", "the CITB Health, Safety and Environment Test for supervisors — required for the Gold Skilled Worker / Supervisor CSCS card"),
  "citb-hse": generic("CITB Health, Safety & Environment Test", "CITB", "the underlying CITB HSE test that sits behind every CSCS card application — 50 multiple-choice questions in 45 minutes, pass mark 45/50"),
  "ipaf-pasma": generic("IPAF / PASMA Working at Height Test", "IPAF (mobile elevating work platforms) and PASMA (mobile access towers)", "the working-at-height tickets required to operate MEWPs and mobile towers on UK construction sites"),

  // -------- FINANCE --------------------------------------------------
  "aat-bookkeeping": generic("AAT Level 2 Bookkeeping", "the Association of Accounting Technicians (AAT)", "the entry-level AAT qualification covering double-entry bookkeeping, sales and purchase ledgers, VAT basics and trial balance preparation"),
  "acca-foundations": generic("ACCA Foundations (FIA) Practice", "the Association of Chartered Certified Accountants (ACCA)", "the Foundations in Accountancy / FIA suite — Diploma and Certificate level papers that build into the full ACCA qualification"),
  "cfa-aptitude": generic("CFA-Style Aptitude Test", "the CFA Institute (style-based; the full CFA exams are separate)", "a numerical and quantitative aptitude practice in the style of CFA Level 1 — useful for investment banking, asset management and graduate finance applications"),
  "financial-awareness": generic("Financial Awareness Quiz", "no single body — used in graduate schemes and Civil Service Fast Stream", "a general financial-awareness practice covering accounting basics, financial markets, central banks and key economic indicators"),

  // -------- IT / TECH ------------------------------------------------
  "comptia-a-plus": generic("CompTIA A+ Practice", "CompTIA", "the entry-level IT support certification — two exams (Core 1 220-1101 and Core 2 220-1102) covering hardware, networking, mobile, security and operating systems"),
  "itil-4": generic("ITIL 4 Foundation Practice", "PeopleCert on behalf of AXELOS", "the ITIL 4 Foundation exam — 40 multiple-choice questions in 60 minutes, pass mark 65% (26/40), covering the service value system and seven guiding principles"),
  "microsoft-fundamentals": generic("Microsoft Fundamentals (MS-900 / AZ-900)", "Microsoft Learn / Pearson VUE", "the Microsoft Fundamentals certifications — MS-900 (Microsoft 365) and AZ-900 (Azure) — entry-level cloud and productivity exams scored out of 1000 with a 700 pass mark"),
  "cyber-awareness": generic("Cyber Security Awareness", "the National Cyber Security Centre (NCSC)", "an awareness-level practice on phishing, password hygiene, multi-factor authentication, ransomware and the NCSC Cyber Essentials controls"),

  // -------- HEALTHCARE ENTRY -----------------------------------------
  ucat: generic("UCAT Practice", "the UCAT Consortium", "the University Clinical Aptitude Test for medical and dental school applicants — five sections (verbal, decision making, quantitative, abstract, situational judgement) sat at Pearson VUE"),
  bmat: generic("BMAT Practice", "Cambridge Assessment Admissions Testing (note: BMAT was withdrawn in 2024 — practice retained for legacy training)", "the Biomedical Admissions Test — three sections covering aptitude, scientific knowledge and a writing task. Many universities have moved to UCAT; check current requirements"),
  oet: generic("OET (Healthcare English)", "Cambridge Boxhill Language Assessment", "the Occupational English Test — the healthcare-specific English test accepted by the NMC, GMC, GDC and HCPC as proof of English proficiency"),
  "plab-1": generic("PLAB 1 Sample Questions", "the General Medical Council (GMC)", "the Professional and Linguistic Assessments Board Part 1 — a 180-question SBA exam in 3 hours, the first stage of GMC registration for international medical graduates"),

  // -------- TEACHING -------------------------------------------------
  "qts-numeracy": generic("QTS Numeracy Skills Test", "the Department for Education (legacy)", "the Professional Skills Test in Numeracy for trainee teachers (withdrawn 2020 but commonly requested as practice for current ITT applicants and the new ITT framework)"),
  "qts-literacy": generic("QTS Literacy Skills Test", "the Department for Education (legacy)", "the Professional Skills Test in Literacy — spelling, punctuation, grammar and comprehension practice for trainee teachers"),
  "professional-skills-teachers": generic("Professional Skills for Teachers", "the Department for Education and individual ITT providers", "general professional skills practice for trainee teachers — Teachers' Standards, behaviour management and safeguarding"),
  "safeguarding-schools": generic("Safeguarding in Schools", "the Department for Education (Keeping Children Safe in Education)", "a knowledge check on KCSIE — the statutory safeguarding guidance for everyone working in schools and colleges"),

  // -------- LEGAL ----------------------------------------------------
  "sqe1-flk1": generic("SQE1 FLK1 Practice", "the Solicitors Regulation Authority (SRA)", "Functioning Legal Knowledge 1 of the Solicitors Qualifying Examination — 180 single best answer questions covering business law, dispute resolution, contract, tort and legal system"),
  "sqe1-flk2": generic("SQE1 FLK2 Practice", "the SRA", "Functioning Legal Knowledge 2 — 180 single best answer questions covering property practice, wills, trusts, criminal law and ethics"),
  lnat: generic("LNAT Multiple Choice", "LNAT Consortium / Pearson VUE", "the National Admissions Test for Law — Section A is 42 multiple-choice questions in 95 minutes; Section B is an essay"),
  "uk-legal-system": generic("UK Legal System Quiz", "no single body — used as background revision for SQE, LNAT and Civil Service Fast Stream", "a general knowledge quiz on the UK courts, sources of law, judicial appointments and devolved legal systems in Scotland and Northern Ireland"),

  // -------- MILITARY / EMERGENCY -------------------------------------
  "army-barb": generic("Army BARB Test", "the British Army", "the British Army Recruit Battery — a touch-screen aptitude test covering reasoning, letter checking, number distance, odd-one-out and symbol rotation, used to determine which Army roles you qualify for"),
  "police-pirt": generic("Police PIRT (Initial Recruitment)", "the College of Policing", "the Police Initial Recruitment Test — situational judgement, behavioural style questionnaire and online competency-based interview as part of the police constable application"),
  "police-search": generic("Police SEARCH Assessment", "the College of Policing", "the SEARCH assessment centre — interactive role-plays, written exercises and a competency-based interview. Sat after the online stages"),
  "firefighter-nfsat": generic("Firefighter NFSAT", "the National Fire Chiefs Council", "the National Firefighter Selection Ability Tests — working with numbers, understanding information and situational awareness, sat as part of every UK fire and rescue service application"),

  // -------- MARITIME / AVIATION --------------------------------------
  "ppl-air-law": generic("PPL Air Law", "the Civil Aviation Authority (CAA)", "the Air Law exam for the UK Private Pilot Licence — covers the Air Navigation Order, airspace classifications, ATC procedures and licensing rules"),
  "ppl-meteorology": generic("PPL Meteorology", "the CAA", "the Meteorology exam for the UK PPL — atmospheric pressure, weather systems, METAR and TAF interpretation, icing and turbulence"),
  "rya-day-skipper": generic("RYA Day Skipper Theory", "the Royal Yachting Association (RYA)", "the shore-based Day Skipper theory course — chartwork, tides, COLREGs, basic meteorology and passage planning"),
  "atpl-basics": generic("ATPL Basics Practice", "the CAA / EASA", "the entry-level practice for the Airline Transport Pilot Licence theory — 13 subjects required for a frozen ATPL, the standard route into commercial aviation"),

  // -------- GOVERNMENT -----------------------------------------------
  csjt: generic("Civil Service Judgement Test (CSJT)", "the Cabinet Office Civil Service Recruitment", "the Civil Service Judgement Test — situational judgement scenarios mapped to the Success Profiles behaviours, sat early in most Civil Service applications"),
  "cs-verbal": generic("Civil Service Verbal Reasoning", "the Civil Service Recruitment team", "the verbal reasoning test used in Civil Service Fast Stream, Fast Track and many departmental recruitment routes"),
  "cs-numerical": generic("Civil Service Numerical Reasoning", "the Civil Service Recruitment team", "the numerical reasoning test used at most Civil Service grade-7 and Fast Stream applications"),
  "border-force": generic("Border Force Recruitment Test", "Home Office Border Force", "the Border Force entry assessment — situational judgement, behavioural style and competency-based interview, sat as part of the Border Force Officer application"),
};

export const getTopicSeo = (slug: string): TopicSeo | undefined =>
  topicSeo[slug];
