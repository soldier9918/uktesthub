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
  title: `${topicTitle} Guide | UK Test Hub`,
  description: `Free study guide for the ${topicTitle}. Format, syllabus, study tips, common mistakes and FAQs, plus unlimited mock tests.`,
  tagline: `Everything you need to know about the ${topicTitle} before you book.`,
  intro: [
    `The ${topicTitle} is ${context}. This guide walks you through the format, what's actually tested, the most common mistakes candidates make, and how to use practice tests to pass first time.`,
    `When you're ready, jump into our free mock papers — each one is designed to reflect the exam format with full answer explanations so you learn the reasoning, not just the letter.`,
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
        `The biggest pitfall is treating the practice tests as a memorisation exercise. The official exam pulls from a much larger question bank — if you only memorise our wording, you'll be lost when the real paper rephrases the same concept.`,
        `Other common mistakes: skim-reading questions, second-guessing correct first instincts, and panicking in the last 10 minutes. Trust your preparation and use every minute available.`,
      ],
    },
    {
      heading: "Why active practice testing works",
      body: [
        `Active recall — testing yourself rather than re-reading notes — is one of the most evidence-backed study techniques in cognitive science. Repeated mock papers expose gaps you didn't know you had, and the instant feedback after each question rewires memory faster than passive revision.`,
        `Mocks also dismantle exam anxiety. The first time you see a DVSA-style practice question shouldn't be at the test centre. By the time you've completed five to ten mocks, the format feels familiar and you can focus your mental energy on the content rather than the interface. Completing several mock tests before the real exam can make the format feel more familiar and help you spot weak areas before test day.`,
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
    title: "Driving Theory Test Guide 2026 | UK Test Hub",
    description:
      "Complete UK Driving Theory Test guide for 2026. DVSA format, 50-question pass mark, hazard perception, study plan and common mistakes — with free mock tests.",
    tagline: "Everything you need to pass the DVSA Driving Theory Test first time.",
    intro: [
      "The DVSA Driving Theory Test is the gateway to your provisional pass certificate and, ultimately, your full UK driving licence. It's split into 50 multiple-choice questions and 14 hazard perception clips, and you must pass both parts at the same sitting. Roughly half of all candidates fail on their first attempt, almost always because they under-prepared on hazard perception or skim-read the multiple-choice paper.",
      "This guide walks you through exactly what the DVSA tests, how to study efficiently in three to four weeks, and the small habits that separate first-time passes from repeat bookings. You can also browse [our full Road Signs guide](/guide/road-signs) to see every sign that appears in the theory test. When you're ready, take a free mock test below — every question has a written explanation linked to the Highway Code.",
    ],
    sections: [
      {
        heading: "What the test actually involves",
        body: [
          "You'll sit at a Pearson VUE workstation with headphones for around 90 minutes from check-in to printed result slip. The test runs in two parts back-to-back: 50 multiple-choice questions in 57 minutes, an optional three-minute break, then 14 video clips containing 15 developing hazards.",
          "The multiple-choice section is drawn from a large question bank, so candidates may see different papers. The pass mark is 43 out of 50. Hazard perception is scored from 0–5 per developing hazard depending on how early you identify it, with a pass mark of 44 out of 75. You must pass both parts at the same sitting — if you fail one part, you fail the whole theory test.",
          "On this site you can choose a DVSA-style mini mock test — 24 questions for quick practice — or switch to EXAM MODE, which mirrors the real test-day pressure with 50 questions, 57 minutes and the same 43/50 pass mark.",
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
      {
        heading: "What happens after you pass",
        body: [
          "You'll get a printed pass certificate at the test centre. The certificate number is needed when you book your practical driving test through gov.uk. Keep both the printout and a photo of it on your phone — the DVSA loses certificates surprisingly often and a photo speeds up replacement.",
          "Your theory pass is valid for two years. You must take and pass the practical driving test within that window or you'll have to retake the theory. The waiting list for practical tests in 2026 is 8–24 weeks depending on test centre, so book your practical the same day you pass theory.",
          "Between theory and practical, keep practising hazard perception clips and re-read the Highway Code chapters on motorways and rural roads — examiners on the practical often ask 'show me, tell me' questions that mirror the theory syllabus.",
        ],
      },
    ],
    faqs: [
      { q: "What is the UK driving theory pass mark?", a: "The multiple-choice section is drawn from a large question bank, so candidates may see different papers. The pass mark is 43 out of 50. Hazard perception is scored from 0–5 per developing hazard depending on how early you identify it, with a pass mark of 44 out of 75. You must pass both parts at the same sitting — if you fail one part, you fail the whole theory test." },
      { q: "How many questions are in the driving theory test?", a: "50 multiple-choice questions, then 14 hazard perception video clips containing 15 developing hazards in total." },
      { q: "How long is the driving theory test?", a: "57 minutes for multiple choice and around 20 minutes for hazard perception, plus an optional three-minute break in between." },
      { q: "How much does the driving theory test cost in 2026?", a: "£23, booked directly via gov.uk." },
      { q: "How long should I study for the theory test?", a: "Most candidates need three to four weeks of consistent practice — 20–30 minutes a day plus a few full timed mocks in the final week." },
      { q: "Can I take notes into the test?", a: "No. Phones, watches, bags and notes must go in the lockers in the waiting area." },
      { q: "How soon can I retake if I fail?", a: "You must wait at least three working days, then rebook on gov.uk and pay the £23 fee again." },
    ],
  },
  "hazard-perception": {
    title: "Hazard Perception Test Guide 2026 | UK Test Hub",
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
      {
        heading: "Reading the road like an examiner",
        body: [
          "Hazard perception is really 'commentary driving' in disguise. Trained driving instructors talk through the developing scene out loud as they drive: 'parked van on the left… could a child run out… cyclist ahead, leaving room… brake lights on the car at the junction'. Practise that habit on real journeys (as a passenger, not a driver) and you'll spot hazards 1–2 seconds earlier on the test, which is the difference between 3 marks and 5.",
          "Watch for early cues: a head turning at a junction, a wheel turning slightly, brake lights flickering, a pedestrian's body weight shifting toward the kerb. The DVSA programmer marked the hazard 'developing' the moment that cue appears — not when it becomes obvious.",
        ],
      },
      {
        heading: "What to do if you fail hazard perception",
        body: [
          "Failing only the hazard perception part still means failing the whole theory test — you'll need to rebook the £23 fee and resit both parts (after a minimum three working days).",
          "Diagnose the cause before resitting. If you scored under 30/75 you probably clicked too late or missed the developing cues; do twenty more practice clips with the commentary technique. If you scored 35–43, you're spotting hazards but mistiming clicks; one or two well-paced clicks per hazard, in the second the cue appears, will lift you over the line.",
        ],
      },
      {
        heading: "Equipment and test-room conditions",
        body: [
          "At the test centre you'll wear over-ear headphones supplied by Pearson VUE. Volume is set during the brief practice clip — set it loud enough to hear engine and tyre cues without it being uncomfortable. The mouse on the desk is a standard wired optical mouse; you can use either button to click.",
          "Don't grip the mouse the entire time — your hand cramps and reaction time slips. Rest fingers loosely on the buttons and breathe normally between clips. There's a short forced gap between each clip; use it to relax your hand and reset focus.",
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
    title: "Road Signs Test Guide | UK Test Hub",
    description:
      "Learn UK road signs for the theory test, including shapes, colours, markings and common exam questions. Practise free mock tests.",
    tagline: "The shape-and-colour shortcut to learning every UK road sign.",
    intro: [
      "Road signs make up roughly 15% of the DVSA Driving Theory Test, and they're the easiest marks to lose if you've never learned the shape-and-colour code. Once you know that triangles warn, circles order and rectangles inform, you can decode signs you've never seen before.",
    ],
    sections: [
      {
        heading: "What this test involves",
        body: [
          "There isn't a standalone DVSA 'Road Signs Test' — sign questions sit inside the standard Driving Theory Test (50 multiple-choice questions in 57 minutes, 43 needed to pass) plus the 14-clip hazard perception section. Roughly 7–10 of the multiple-choice questions show a sign, a road marking, or a junction layout and ask what it means or what action you should take.",
          "Our focused Road Signs mock papers pull only the sign-and-marking questions from the official DVSA-style bank so you can drill the topic in short sittings instead of waiting for them to appear in a full mock.",
        ],
      },
      {
        heading: "What's covered in the syllabus",
        body: [
          "Warning signs (red triangles), order signs (red and blue circles), information and direction signs (rectangles), motorway-specific signs (blue), primary route signs (green), and temporary works signs (yellow). You'll also be tested on road markings — give-way lines, stop lines, lane arrows, box junctions, hatched areas and yellow box rules.",
          "Expect questions on traffic-light sequences, level crossings, zebra and pelican crossings, school-warning patrols, and the supplementary plates that sit underneath signs (distance, time, vehicle type).",
        ],
      },
      {
        heading: "How to pass the test",
        body: [
          "Learn the shape-and-colour code first: triangles warn, circles order (red = prohibition, blue = mandatory), rectangles inform. Once that's locked in you can decode unfamiliar signs by shape alone, which covers about 80% of the bank without rote memorisation.",
          "Then drill the high-frequency exceptions — the octagonal STOP sign, the inverted triangle GIVE WAY, the diagonal end-of-restriction signs, and the blue-and-red 'no entry' sign that breaks the colour rule. These are the ones examiners reuse repeatedly.",
        ],
      },
      {
        heading: "Recommended study plan",
        body: [
          "Week 1: read Highway Code pages 102–138 once and learn the shape rules. Week 2: take one Road Signs mock per day, reviewing every miss against the official sign in our gallery (linked from the full reference article). Week 3: combine signs with road markings and traffic-light sequences. Week 4: sit timed full theory mocks so signs appear mixed in with hazards, alertness and vehicle handling questions.",
          "Most learners need 6–10 hours of sign-specific study spread across 3–4 weeks. Cramming the night before is the single biggest cause of avoidable losses on this topic.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "Confusing 'no overtaking' (red car + black car in a red circle) with 'end of overtaking restriction' (the same image with a diagonal line through it). Misreading the national speed limit sign (white circle with a black diagonal) as 'derestricted' — it's 60 mph on single carriageways and 70 mph on dual carriageways and motorways for cars.",
          "Confusing the red-bordered triangle 'children crossing' warning with the circular school-crossing-patrol order. Forgetting that a yellow box junction means you cannot enter unless your exit is clear, even when the lights are green.",
        ],
      },
      {
        heading: "Who this test is for",
        body: [
          "Anyone preparing for the car, motorcycle, LGV, PCV or ADI theory test — every category uses the same sign bank, with a small number of additions for larger vehicles. Pedestrians, cyclists and approved-driving-instructor candidates also benefit because the rules are the same on the road.",
          "It's especially useful for drivers who passed years ago and want a refresher before towing, hiring abroad, or taking a Pass Plus / advanced course.",
        ],
      },
      {
        heading: "Why it matters",
        body: [
          "Signs and markings are the single largest topic in the multiple-choice section, and they're the easiest marks to bank because every answer is unambiguous — the sign means exactly one thing. Losing four or five sign questions through guesswork is the most common reason candidates fall just below the 43/50 pass mark.",
          "Beyond the test, fluent sign reading is what lets you drive smoothly in unfamiliar areas, react to roadworks safely, and avoid the £100 + 3-point penalties that come with ignoring mandatory signs.",
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
    title: "Motorcycle Theory Test Guide 2026 | UK Test Hub",
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
      {
        heading: "Module 1 and Module 2 — what theory unlocks",
        body: [
          "Theory pass opens the door to Module 1, the off-road manoeuvres test at a Multi-Purpose Test Centre (MPTC). It includes the slalom, figure-of-eight, slow ride, U-turn, controlled stop, hazard avoidance (the 'swerve test') and an emergency stop. The hazard avoidance is taken at 50 km/h (31 mph) for an A2 or full A licence — fail this and you can't progress.",
          "Module 2 is the on-road ride: 30–40 minutes including independent riding using sat nav or signs, plus questions on safety and pillion passengers. Both modules use a radio earpiece so the examiner can give directions while you're moving.",
        ],
      },
      {
        heading: "Licence categories and age restrictions",
        body: [
          "AM (16+): mopeds up to 50cc and 28 mph. A1 (17+): light motorcycles up to 125cc and 11kW. A2 (19+): bikes up to 35kW (47 bhp), restricted from a higher-powered bike. A (24+ direct, or 21+ via two years on A2): full unrestricted licence.",
          "The route most riders take: CBT at 17, ride a 125 with L plates while studying for theory, then take A2 at 19 or A at 24. Direct Access (DAS) at 24+ skips the A2 step but requires a 'big bike' Module 1 and 2 on a 595cc+ machine.",
        ],
      },
      {
        heading: "Gear, weather and visibility",
        body: [
          "Theory questions often test PPE. Helmets must meet UNECE 22.06 (or 22.05 for older stock). Gloves and jacket should carry CE EN 13594 and EN 17092 ratings. Hi-vis isn't legally required in the UK but examiners and the IAM strongly recommend it for visibility — most SMIDSY collisions happen in good daylight, not at night.",
          "In wet weather, double your stopping distance. White lines, manhole covers, painted markings and diesel spills become slippery — brake on the un-painted tarmac wherever possible. In cold weather watch for shaded patches that may still be icy after sunny stretches have thawed.",
        ],
      },
      {
        heading: "Highway Code Rules 83–88: general guidance for motorcyclists",
        body: [
          "Rule 83 — Helmets. On every journey the rider and any pillion passenger on a motorcycle, scooter or moped MUST wear a protective helmet that complies with the Regulations and is fastened securely. The only exemption is a follower of the Sikh religion wearing a turban. Riders and passengers of motor tricycles and quadricycles (quadbikes) should also wear a helmet. Check your visor is clean and in good condition before every ride. (Laws RTA 1988 sects 16 & 17 & MC(PH)R reg 4.)",
          "Rule 84 — Eye and other protection. It is also advisable to wear eye protectors that comply with the Regulations. Scratched or poorly fitting eye protectors limit your view, especially in bright sunshine and at night. Consider ear protection, and wear strong boots, gloves and suitable clothing to help protect you in a collision. (Laws RTA sect 18 & MC(EP)R reg 4.)",
          "Rule 85 — Pillion passengers. You MUST NOT carry more than one pillion passenger, who MUST sit astride the machine on a proper seat with both feet on the footrests, facing forward. You MUST NOT carry a pillion passenger unless your motorcycle is designed to do so. Provisional licence holders MUST NOT carry a pillion passenger at all. (Laws RTA 1988 sect 23, MV(DL)R 1999 reg 16(6) & CUR 1986 reg 102.)",
          "Rule 86 — Daylight riding. Make yourself as visible as possible from the side as well as the front and rear. Wear a light or brightly coloured helmet and fluorescent clothing or strips. Dipped headlights, even in good daylight, can also make you more conspicuous — but remember that other drivers may still not have seen you, or may have misjudged your speed and distance, especially at junctions.",
          "Rule 87 — Riding in the dark. Wear reflective clothing or strips so headlamps from other vehicles pick you up from a longer distance. See Highway Code rules 113–116 for lighting requirements.",
          "Rule 88 — Manoeuvring. Be aware of what is behind and to the sides before manoeuvring: look behind you and use mirrors if fitted. In traffic queues watch for pedestrians crossing between vehicles and for vehicles emerging from junctions or changing lanes. Position yourself so that drivers in front can see you in their mirrors, and keep your speed low when filtering in slow-moving traffic. Remember: Observation – Signal – Manoeuvre.",
        ],
      },
      {
        heading: "Motorcycle and moped licence requirements (Highway Code, pages 50–53)",
        body: [
          "Provisional licence and CBT. With a provisional motorcycle licence you MUST satisfactorily complete a Compulsory Basic Training (CBT) course. You can then ride a motorcycle up to 125 cc with a power output not exceeding 11 kW on the public road, with L plates (D plates, L plates, or both in Wales), for up to two years. Under direct access you can practise on a larger machine provided you meet the minimum age, are accompanied at all times by a qualified approved trainer on another motorcycle and in radio contact, wear fluorescent or reflective safety clothing, and display red L plates (D plates in Wales). To obtain a full licence you MUST pass a motorcycle theory test and then a practical test. (Law MV(DL)R regs 16 & 68.)",
          "A1 licence (17+). Tested on a motorcycle without sidecar of 120–125 cc. Pass and you may ride a motorcycle up to 125 cc with power output up to 11 kW, or a motor tricycle with power not exceeding 15 kW.",
          "A2 licence (19+). Tested on a motorcycle without sidecar of at least 395 cc with a power output of at least 25 kW but not exceeding 35 kW. Pass and you may ride any motorcycle not exceeding 35 kW and with a power-to-weight ratio not exceeding 0.2 kW/kg.",
          "Full A licence. Test taken on a motorcycle without sidecar of at least 595 cc and at least 40 kW. This gives full access to all motorcycles and motor tricycles. You can take it via progressive access from age 21 (if you have held an A2 licence for at least two years — no further theory or CBT needed) or via direct access from age 24 (CBT, theory test and practical test all required). Passing the practical on a bike of at least 40 kW (53.6 bhp) gives immediate access to all sizes of motorcycle.",
          "Trailers and pillions on a provisional. You MUST NOT carry a pillion passenger or pull a trailer until you have passed your test. See Highway Code rule 253 for vehicles prohibited from motorways. (Law MV(DL)R reg 16.)",
          "Moped licence. A moped MUST have an engine capacity not exceeding 50 cc, weigh no more than 250 kg and be designed for a maximum speed not exceeding 28 mph (45 km/h). To learn on a moped you MUST be 16 or over, hold a provisional moped licence and complete CBT. You MUST then pass the motorcycle theory test followed by the moped practical test for a full moped licence. If you passed your car driving test before 1 February 2001 you can ride a moped without L plates (D plates in Wales), although CBT is recommended. If you passed your car test on or after that date you MUST complete CBT before riding a moped on the road. (Laws RTA 1988 sects 97(e) & 101 & MV(DL)R regs 38(4) & 43.)",
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
    title: "Life in the UK Test Guide 2026 | UK Test Hub",
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
          "On this site you can choose a Home Office-style mini mock test — 24 questions for quick practice — or switch to EXAM MODE, which mirrors the real test-day pressure with 24 questions, 45 minutes and the same 18/24 pass mark.",
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
      {
        heading: "Chapter-by-chapter focus",
        body: [
          "Chapter 1 (Values and Principles): democracy, rule of law, individual liberty, tolerance of those with different faiths and beliefs. Short — read once and remember the four core values.",
          "Chapter 2 (What is the UK): the four nations, capital cities, currencies, languages (English, Welsh, Gaelic, Scots, Irish). A handful of geography questions per test.",
          "Chapter 3 (A long and illustrious history): the longest chapter and around 50% of test questions. Cover Stone Age to Iron Age, the Romans, the Anglo-Saxons, the Norman Conquest 1066, Magna Carta 1215, the Black Death, the Wars of the Roses, the Reformation, the Civil War, the Glorious Revolution, the Industrial Revolution, the Empire, both World Wars, post-war Britain, devolution.",
          "Chapter 4 (A modern, thriving society): sport, music, art, literature, festivals, religion, food, places to visit. Memorise specific names: Bobby Moore, Andy Murray, Vivienne Westwood, Henry Moore, Dylan Thomas.",
          "Chapter 5 (Government, law and your role): Parliament, the monarch, the PM, devolved governments, elections, the courts, civic duties. Learn how a Bill becomes an Act and the difference between criminal and civil law.",
        ],
      },
      {
        heading: "Date and name memorisation",
        body: [
          "The handbook lists dozens of specific dates. The DVSA — sorry, Home Office — favours these in questions: 1066 Norman Conquest, 1215 Magna Carta, 1314 Bannockburn, 1455–87 Wars of the Roses, 1534 Church of England formed, 1588 Spanish Armada defeated, 1605 Gunpowder Plot, 1707 Act of Union with Scotland, 1801 Act of Union with Ireland, 1832 Reform Act, 1914–18 First World War, 1918 women over 30 get the vote, 1928 equal voting age, 1939–45 Second World War, 1948 NHS founded, 1973 UK joins EEC, 1999 devolution, 2016 EU referendum.",
          "Names to learn for the sport, art and culture sections: Roger Bannister (4-min mile), Sir Steve Redgrave (5 Olympic golds), Bradley Wiggins, Jessica Ennis-Hill, Damon Hill (F1 champion son of Graham Hill), Dame Kelly Holmes. For arts: William Hogarth, Joseph Turner, John Constable, Henry Moore, Lucian Freud, David Hockney.",
        ],
      },
      {
        heading: "Pitfalls and timing strategy",
        body: [
          "45 minutes for 24 questions is generous — that's nearly two minutes per question. Don't rush. Read every question twice; many include the words 'NOT' or 'except' that flip the meaning.",
          "Most candidates who fail did so because they relied on free PDF question dumps online instead of the official handbook. The Home Office regularly retires and replaces questions, and the bank changes when a new edition is published. Always read the current handbook — the 3rd edition (2013) is still current as of 2026.",
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
    title: "British Citizenship Test Guide | UK Test Hub",
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
      {
        heading: "Documents and evidence checklist",
        body: [
          "Before you start the AN form, gather: a current passport (and every previous passport covering the qualifying period), your BRP or eVisa share code, the original Life in the UK pass letter, your B1 English certificate or a degree certificate with transcript, three months of council tax or utility bills as proof of address, and a payslip or HMRC tax summary covering the qualifying years.",
          "If you've changed name (marriage, deed poll), include the legal change document plus any old passports in the previous name. Missing documents are the second-biggest cause of refusal after absence miscalculations — caseworkers will not chase you, they simply refuse.",
          "Spend an evening cross-checking your travel history against passport stamps, e-gate records, airline emails and bank card transactions abroad. The Home Office runs the same cross-check; even a forgotten three-day weekend in Dublin counts toward the 450-day absence limit.",
        ],
      },
      {
        heading: "Costs, timelines and what happens next",
        body: [
          "Total realistic spend: £1,630 application + £50 Life in the UK Test + £150–£200 SELT English test + £25–£35 biometrics enrolment at a UKVCAS service point. Budget around £1,900 end to end. Children added under 18 cost £1,214 each.",
          "After submission you book a biometrics appointment within 45 days. Most decisions land in three to six months by email. If approved, the Home Office sends an invitation to the citizenship ceremony at your local council; you must attend within 90 days. Your naturalisation certificate is issued at the ceremony — keep it safe, it's the only document HM Passport Office accepts to issue your first British passport (£94.50 in 2026).",
          "You become a British citizen the moment you take the Oath, not the moment the Home Office approves the application. Until the ceremony you're still on ILR.",
        ],
      },
      {
        heading: "Practising for the citizenship interview",
        body: [
          "Most adult naturalisation applications are decided on paper. A small number — usually where the caseworker has questions about character, identity or residency — are called for an interview at a regional Home Office centre. Questions are conversational and cover your application content: dates of trips abroad, employment history, family details, and basic Life in the UK material.",
          "Use our practice questions to refresh the Life in the UK content in the months between passing the test and submitting the AN form. Caseworkers occasionally drop in informal questions like 'who is the current monarch?' or 'when is St George's Day?' to confirm the test was your own work, so don't let that knowledge fade.",
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
    title: "UK Laws & Rights Guide | UK Test Hub",
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
      {
        heading: "Driving, road and motoring law",
        body: [
          "You must hold a valid licence, valid insurance, MOT (for vehicles over three years old) and pay vehicle tax to drive on UK roads. Driving without insurance is a strict-liability offence: six penalty points, an unlimited fine and possible disqualification.",
          "The drink-drive limit in England, Wales and Northern Ireland is 80mg of alcohol per 100ml of blood. Scotland is lower at 50mg. Drug-driving uses zero-tolerance limits for illegal drugs. Using a hand-held phone while driving is six points and a £200 fine even when stopped at lights.",
          "New drivers (within two years of passing) lose their licence at six points, not 12. Speed-awareness courses can be offered for low-level speeding instead of points, but only once every three years.",
        ],
      },
      {
        heading: "Housing, tenancies and council tax",
        body: [
          "Most private tenants in England hold an Assured Shorthold Tenancy (AST). Landlords must protect your deposit in a government-approved scheme within 30 days, give you a 'How to Rent' guide, and provide a gas safety certificate, EPC and electrical safety report.",
          "From the Renters' Rights Act 2024–25, Section 21 'no-fault' evictions are being phased out — landlords must now give a specific legal reason to end a tenancy. Tenants must give one month's notice on a periodic tenancy.",
          "Council tax is paid by the occupier (tenant), not the landlord, on most lets. Single occupants get a 25% discount; full-time students are exempt. Non-payment can lead to bailiffs and, ultimately, prison — though prison is rare and reserved for wilful refusal to pay.",
        ],
      },
      {
        heading: "Family law and children",
        body: [
          "Marriage in England and Wales is legal at 18 (raised from 16 in 2023). Civil partnerships are open to same-sex and opposite-sex couples. Divorce since 2022 is no-fault: one party simply states the marriage has irretrievably broken down, with a 20-week reflection period before the conditional order.",
          "Both parents named on a UK birth certificate (registered after December 2003) automatically have parental responsibility. Child maintenance is calculated by the Child Maintenance Service using a formula based on the paying parent's gross income.",
          "It's illegal to smack a child in Scotland and Wales. In England and Northern Ireland, 'reasonable chastisement' remains a defence to common assault — but anything leaving a mark is criminal.",
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
    title: "UK Geography Test Guide | UK Test Hub",
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
      {
        heading: "Climate, weather and time",
        body: [
          "The UK has a temperate maritime climate: mild winters, cool summers, rain spread throughout the year. The west (Cornwall, Wales, west Scotland) is wetter; the east (East Anglia, Lincolnshire) is the driest. The Lake District and west Highlands get over 3,000mm of rain a year — enough to support temperate rainforest.",
          "Standard time is Greenwich Mean Time (GMT, UTC+0). The clocks go forward one hour on the last Sunday of March (British Summer Time, BST, UTC+1) and back on the last Sunday of October. The Meridian line runs through Greenwich in south-east London — the basis of world time zones.",
        ],
      },
      {
        heading: "Crown Dependencies and Overseas Territories",
        body: [
          "The Isle of Man, Jersey and Guernsey are Crown Dependencies — self-governing possessions of the Crown, not part of the UK or EU. They have their own parliaments, currencies (pegged to sterling) and tax systems. British citizens have the right to live and work there but need permission for permanent residency.",
          "Fourteen British Overseas Territories include Gibraltar, the Falkland Islands, Bermuda, the Cayman Islands and the British Virgin Islands. They are not part of the UK but residents can apply for British Overseas Territories citizenship and, in most cases, full British citizenship.",
        ],
      },
      {
        heading: "Devolution and how the nations are governed",
        body: [
          "Since 1999, Scotland, Wales and Northern Ireland have devolved governments with powers over health, education, transport and (in Scotland) some taxes. England has no separate parliament — its laws are made at Westminster. The Senedd (Welsh Parliament) sits in Cardiff Bay; the Scottish Parliament at Holyrood, Edinburgh; the Northern Ireland Assembly at Stormont, Belfast.",
          "Reserved matters — defence, foreign affairs, immigration, monetary policy — remain at Westminster for all four nations. The UK Parliament can in theory legislate on any matter, but by convention does not legislate on devolved areas without consent.",
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
    title: "IELTS Practice Guide | UK Test Hub",
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
      {
        heading: "Writing — Task 1 and Task 2 in detail",
        body: [
          "Academic Task 1 (20 minutes, 150 words): describe a chart, table, graph, map or process diagram. Use a four-paragraph structure: introduction (paraphrase the title), overview (the 2–3 most striking trends, no numbers), body 1 (detail with figures), body 2 (detail with figures). The overview is the single biggest scoring factor.",
          "General Task 1 (20 minutes, 150 words): a letter — formal, semi-formal or informal. Always include the three bullet-point requirements from the prompt.",
          "Task 2 (40 minutes, 250 words, both versions): an essay. Common types: opinion ('to what extent do you agree?'), discussion ('discuss both views'), problem-solution, two-part question. Plan five minutes, write thirty, proofread five. Aim for four paragraphs: introduction with a clear thesis, two body paragraphs with topic sentence + reason + example, conclusion that restates the thesis.",
        ],
      },
      {
        heading: "Speaking — what examiners reward",
        body: [
          "IELTS Speaking is judged on four equal criteria: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation. The single biggest fluency killer is unnatural pauses while you search for a 'big' word — examiners would rather hear simple, fluent English than fancy stumbling.",
          "Part 2 (long turn): you get one minute to plan, then talk for 1–2 minutes on a card prompt like 'describe a memorable journey'. Use the planning time to scribble a four-bullet outline (when, where, who, why memorable). The examiner will not interrupt during the long turn — keep going until they stop you.",
          "Part 3: thematic discussion related to Part 2. The examiner pushes for opinions, comparisons and predictions. Practise extending each answer with 'because… for example… on the other hand…'.",
        ],
      },
      {
        heading: "One Skill Retake and result strategy",
        body: [
          "Since 2023 IELTS One Skill Retake lets candidates who took computer-delivered IELTS resit a single skill (Listening, Reading, Writing or Speaking) within 60 days, for around £170. This is a game-changer for candidates who hit their target overall but missed a single sub-score (e.g. NMC nursing requires Writing 6.5 — many band-7 candidates hit that with a retake).",
          "Plan strategically: aim for your overall target on the first sitting and treat One Skill Retake as the safety net for the section that historically holds you back. Many UK universities now accept One Skill Retake; always confirm with the admissions office before relying on it.",
        ],
      },
      {
        heading: "Choosing the right SELT provider",
        body: [
          "Trinity GESE is the cheapest SELT for A1, A2 and B1 levels (around £150) and tests Speaking & Listening only — ideal if Reading and Writing aren't your strongest skills and you're applying for a visa that doesn't need them. Test centres are in most major UK cities.",
          "LanguageCert IESOL covers all four skills, costs slightly more (£200–£260) and is accepted across the same visa categories. Pearson PTE Home is fully computer-based with results in 2–3 days — the fastest option for time-pressured applications.",
          "IELTS for UKVI (Life Skills A1, A2, B1) is the option chosen by most candidates who already have IELTS prep materials at home. The Life Skills version costs around £170 and tests only Speaking & Listening, like Trinity.",
          "Whichever you pick, book at a Home Office-approved centre — only the UKVI versions count. A standard IELTS or LanguageCert taken outside the SELT network will be rejected by the visa caseworker no matter how high your score.",
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
  esol: {
    title: "ESOL Practice Guide | UK Test Hub",
    description:
      "Free ESOL guide. Trinity, City & Guilds and LanguageCert tests for UK visas, settlement and citizenship. Levels, format and study tips with practice questions.",
    tagline: "The regulated English test route for visas, ILR and citizenship.",
    intro: [
      "ESOL — English for Speakers of Other Languages — is the umbrella term for Ofqual-regulated English qualifications used for UK immigration and everyday study. Trinity College London, City & Guilds, LanguageCert and Pearson all run Home Office-approved ESOL Skills for Life (SfL) and SELT exams. The right level depends on what you're applying for.",
      "This guide breaks down each CEFR level (A1 to C2), the test formats, and which qualification matches each visa or settlement route.",
    ],
    sections: [
      {
        heading: "CEFR levels explained",
        body: [
          "A1 = beginner (introduce yourself, basic phrases). Required for spouse/partner visa entry and 2.5-year extension. A2 = elementary (simple everyday topics). Required for the 2.5-year spouse/partner extension after entry.",
          "B1 = intermediate (handle most travel and work situations). Required for ILR and British citizenship. B2 = upper-intermediate. C1 = advanced. C2 = proficiency. Most universities accept B2 or C1.",
        ],
      },
      {
        heading: "Which test for which purpose",
        body: [
          "For UK visas, settlement and citizenship you need a SELT (Secure English Language Test) from a Home Office-approved provider: Trinity GESE, IELTS for UKVI, LanguageCert IESOL or Pearson PTE Home. The list of approved tests changes — always check gov.uk before booking.",
          "For college and adult education funding, ESOL Skills for Life is the standard qualification — it covers Speaking & Listening, Reading and Writing as separate units.",
        ],
      },
      {
        heading: "Test format",
        body: [
          "Trinity GESE is a face-to-face Speaking & Listening interview only — no reading or writing. Around 6–10 minutes for entry levels, 18 minutes for higher grades. Topics are chosen by you in advance for B1 and above.",
          "LanguageCert and Pearson are computer-based with all four skills. IELTS for UKVI uses the same format as standard IELTS but at a Home Office centre.",
        ],
      },
      {
        heading: "Study plan",
        body: [
          "Most adults at A2 reach B1 in 8–12 weeks of structured study (3–5 hours per week plus daily practice). Speaking is usually the limiting factor — find a conversation partner or tutor early.",
          "Practise the exam format, not just the language. The B1 SELT speaking test has a strict structure (introductory conversation, topic discussion, listening tasks). Knowing the format halves your test-day nerves.",
        ],
      },
      {
        heading: "Booking and on the day",
        body: [
          "Book directly with the provider (Trinity, LanguageCert, Pearson). Fees are usually £150–£200 for SELT levels A1–B1. Take your in-date passport — the same one you'll use for your visa or citizenship application.",
          "Results come within 7 days. The certificate has no expiry for citizenship purposes, but UKVI usually wants it dated within two years of the visa application.",
        ],
      },
      {
        heading: "How the speaking test really works",
        body: [
          "For Trinity GESE B1 you'll have an 8–10 minute one-to-one conversation with a Trinity examiner. Part 1: short conversational questions about you, your family, your work or studies. Part 2: a topic chosen by you in advance — bring a one-page topic form with five points you want to talk about. Part 3: listening tasks where you respond to spoken prompts and then ask the examiner two questions of your own.",
          "Examiners listen for fluency, accurate grammar, range of vocabulary, and appropriate interaction — including asking clear questions back. Most candidates who fail at B1 fail because they answer in single sentences instead of extending their answers with reasons, examples and feelings.",
        ],
      },
      {
        heading: "Reading and writing for higher SELT levels",
        body: [
          "B2, C1 and C2 SELTs add Reading and Writing papers. Reading typically tests skim and scan skills (matching headings, gap-fill, multiple choice) on three short passages of increasing difficulty. Writing tasks include a formal letter or email and a longer opinion essay of around 200–300 words.",
          "For Writing, examiners reward clear paragraph structure, accurate linking phrases (however, therefore, on the other hand) and a range of tenses. Don't try to use rare vocabulary you're not sure of — accurate B1 English scores higher than ambitious-but-broken C1.",
        ],
      },
      {
        heading: "Spouse and partner visa English requirements",
        body: [
          "For the partner / spouse visa initial entry you need A1 English. To extend after 2.5 years you need A2. To switch to ILR after five years you need B1. Each step uses a SELT certificate, so plan your test bookings around your visa renewal dates.",
          "The English requirement is waived if you're aged 65+, have a long-term physical or mental condition that prevents you taking the test, or if you're a national of a majority-English-speaking country. Always check the current Home Office exemption list before paying for a test.",
        ],
      },
      {
        heading: "Free and low-cost study resources",
        body: [
          "ETS publishes free TOEFL practice materials, including a full sample test, on its website. Khan Academy partners with ETS for guided lessons across all four sections — completely free. The Magoosh and Kaplan blogs publish hundreds of model essays and Speaking responses you can use as benchmarks.",
          "For Listening practice, watch academic lectures on YouTube channels like CrashCourse, MIT OpenCourseware or TED-Ed — they mirror the academic register and pacing of TOEFL recordings. For Reading, read Scientific American or The Atlantic articles and time yourself: 700 words in 7 minutes is the TOEFL benchmark.",
          "Two paid resources are worth the spend if your university requires 100+: the Official TOEFL iBT Tests Volume 1 and 2 from ETS (real retired tests) and the TPO (TOEFL Practice Online) packs. Avoid generic 'TOEFL prep' apps that use rewritten or scraped questions — the wording differs and you'll over-prepare for the wrong style.",
        ],
      },
    ],
    faqs: [
      { q: "What ESOL level do I need for British citizenship?", a: "B1 (CEFR), proven by a SELT from a Home Office-approved provider, or a degree taught in English." },
      { q: "What's the cheapest UK visa English test?", a: "Trinity GESE Grade 5 (B1) is one of the lowest-cost SELTs at around £150 and tests Speaking & Listening only." },
      { q: "Is IELTS the same as ESOL?", a: "IELTS is one form of ESOL test. For UK visas you must book the 'IELTS for UKVI' version, not standard IELTS." },
      { q: "Can I use my college ESOL certificate for a visa?", a: "Only if it was a SELT taken at a Home Office-approved centre. Standard ESOL Skills for Life from college does not qualify for visas." },
      { q: "How long is the certificate valid?", a: "No expiry for citizenship and ILR. UKVI normally requires it dated within two years for visa applications." },
    ],
  },
  toefl: {
    title: "TOEFL iBT Test Guide | UK Test Hub",
    description:
      "Free TOEFL iBT guide. Reading, Listening, Speaking and Writing format, 0–120 scoring, university requirements and study tips with practice questions.",
    tagline: "The internet-based English test for university admission worldwide.",
    intro: [
      "TOEFL iBT (Test of English as a Foreign Language, internet-based) is run by ETS and accepted by 12,000+ universities in 160 countries. In the UK it's most commonly used for postgraduate admission alongside IELTS. The test is delivered fully online at a test centre or, in many countries, at home with proctoring.",
      "The full test is around two hours of testing across four sections, scored 0–30 each for a total of 0–120.",
    ],
    sections: [
      {
        heading: "The four sections",
        body: [
          "Reading: 20 questions on two academic passages, 35 minutes. Listening: 28 questions on lectures and conversations, 36 minutes. Speaking: 4 tasks, 16 minutes (you record answers into a microphone). Writing: 2 tasks, 29 minutes.",
          "The 2023 'Enhanced TOEFL' format dropped the unscored experimental section and reduced overall test time to about two hours.",
        ],
      },
      {
        heading: "How scoring works",
        body: [
          "Each section is scored 0–30; the total is 0–120. Most UK universities want 80–100 overall with at least 20 in each section. Top postgraduate programmes (Oxford, Cambridge, LSE) often want 100+ with 25+ per section.",
          "Speaking and Writing are scored by a combination of AI and human raters. Reading and Listening are auto-marked.",
        ],
      },
      {
        heading: "TOEFL vs IELTS",
        body: [
          "TOEFL is fully computer-based and uses American English. IELTS has a face-to-face Speaking interview and uses British English (Academic version is most common for UK universities). Both are accepted by virtually all UK universities — pick the format that suits you.",
          "TOEFL is generally cheaper outside the UK and faster to book. IELTS is more accessible inside the UK and is the only one of the two accepted for UK visas.",
        ],
      },
      {
        heading: "Study plan",
        body: [
          "Allow 6–8 weeks if you're already at IELTS 6.0 / B2 level. Use the official ETS practice tests — third-party material varies in quality. Drill Speaking by recording yourself and timing exactly to the on-screen prompts.",
          "Writing tasks are template-friendly — learn one solid 5-paragraph structure for the Independent Writing task and you'll save time on test day.",
        ],
      },
      {
        heading: "Booking and on the day",
        body: [
          "Book at ets.org/toefl. Fee is around £200–£250 in the UK. Choose Test Center or TOEFL iBT Home Edition (proctored online — needs a clean room, webcam and quiet environment).",
          "Bring your passport. Results arrive in 4–8 days. Scores are valid for two years.",
        ],
      },
      {
        heading: "Section-by-section strategy",
        body: [
          "Reading: skim the passage in 90 seconds before reading any questions. Note paragraph topics in the margin. Most question types map to a single paragraph — find the right paragraph first, then read it carefully. Insert-text and prose-summary questions test whole-passage understanding and are worth more marks each.",
          "Listening: take structured notes using a T-chart (main idea on the left, examples on the right). Headphones supplied at the test centre — adjust volume during the equipment check, not mid-question. Each lecture is played once only.",
          "Speaking: stick to a clear template. Independent task: state your opinion in one sentence, give two reasons with one example each, brief conclusion. Integrated tasks: paraphrase the reading first, then summarise how the lecture relates. Speak for the full time allowed — short answers cap your score.",
          "Writing: Integrated task asks you to compare a reading passage with a lecture; aim for 150–225 words, four short paragraphs. Independent / Academic Discussion task is a forum-style response in 100+ words — give a clear opinion and one developed reason.",
        ],
      },
      {
        heading: "Computer adaptive scoring and TOEFL MyBest",
        body: [
          "Reading and Listening are not classical adaptive (you can review and change answers within a section), but the test draws from a graded item bank — getting questions right gives access to higher-difficulty items that are worth more marks.",
          "TOEFL MyBest Scores combine your highest section scores from any TOEFL tests in the last two years. Most US universities and many UK ones accept MyBest, which means a weak Speaking on one sitting can be replaced by a strong Speaking on a later one. Always check the institution's policy.",
        ],
      },
      {
        heading: "Common pitfalls",
        body: [
          "Speaking too quietly or unclearly into the microphone — the scorer cannot ask you to repeat. Always do a mic check and aim slightly louder than feels natural.",
          "Running long on Speaking integrated tasks. The recording stops at the time limit mid-sentence and the unfinished idea scores nothing. Practise hitting the conclusion with five seconds to spare.",
          "Memorising essay templates word-for-word — TOEFL's AI rater detects template use and downgrades the score. Use a flexible structure, not pre-written paragraphs.",
        ],
      },
      {
        heading: "Common errors that block band 7",
        body: [
          "Subject–verb agreement with collective nouns: 'the government has decided' (singular in British English) but 'the team are arguing' is also accepted. Pick one register and stay consistent throughout an essay.",
          "Countable vs uncountable nouns: 'information', 'advice', 'research', 'equipment', 'furniture', 'news' are all uncountable. Never say 'an information' or 'three researches'. Use 'a piece of information', 'some advice', 'three research projects' instead.",
          "Word order in indirect questions: direct 'Where is the station?' becomes indirect 'Could you tell me where the station is?' — note the verb moves back. Examiners hear the wrong order constantly: 'Could you tell me where is the station?'",
          "Linking words misused: 'although' starts a clause, not a sentence. 'However' starts a sentence and takes a comma. 'Despite' takes a noun ('despite the rain'); 'although' takes a clause ('although it rained'). Drilling these five rules alone lifts most students from band 6 to 6.5.",
        ],
      },
    ],
    faqs: [
      { q: "What TOEFL score do UK universities want?", a: "Most undergraduate programmes ask for 80–100 with section minimums of 20. Top postgraduate programmes ask for 100+." },
      { q: "Can I use TOEFL for a UK visa?", a: "No — only Home Office-approved SELTs (IELTS for UKVI, Trinity GESE, LanguageCert, Pearson PTE Home) are accepted for visas." },
      { q: "How long is TOEFL valid?", a: "Two years from the test date." },
      { q: "Can I take TOEFL at home?", a: "Yes — TOEFL iBT Home Edition is available in most countries with online proctoring." },
      { q: "How much does TOEFL cost?", a: "£200–£250 in the UK, depending on test centre. Home Edition is the same price." },
    ],
  },
  grammar: {
    title: "English Grammar & Vocab Guide | UK Test Hub",
    description:
      "Free English grammar and vocabulary practice guide. Tenses, articles, prepositions, collocations and academic vocab — perfect warm-up for IELTS, TOEFL and ESOL.",
    tagline: "Tighten the grammar gaps that cost easy marks on every English test.",
    intro: [
      "Most English test failures aren't caused by complex grammar — they're caused by tiny errors in tenses, articles and prepositions that learners stop noticing. Examiners do notice, and one or two slips per paragraph can drag a Writing score from band 7 down to band 6.",
      "This guide focuses on the high-frequency rules and word choices that show up most often on IELTS, TOEFL, ESOL and Cambridge English exams. Drill them with the practice questions and your accuracy will rise without learning a single new tense.",
    ],
    sections: [
      {
        heading: "Tenses that examiners watch for",
        body: [
          "Present perfect vs past simple is the single biggest tense problem. Use present perfect for unfinished time ('I have lived in London for three years' — still living there). Use past simple for finished time ('I lived in London for three years' — not any more).",
          "Present perfect continuous emphasises duration and is often used with 'for' and 'since'. Past perfect ('I had eaten') sets one past event before another — only use it when the order matters.",
        ],
      },
      {
        heading: "Articles: a, an, the and zero",
        body: [
          "Use 'the' when both speaker and listener know which one ('the kitchen', 'the moon'). Use 'a/an' for one of many ('a teacher'). Use no article for plural and uncountable nouns in general statements ('teachers are underpaid', 'water is essential').",
          "Speakers of Slavic, Russian, Chinese and Japanese languages often skip articles entirely. If you're one of them, slow down and check every noun in your essay before submitting.",
        ],
      },
      {
        heading: "Prepositions you'll meet on every paper",
        body: [
          "Time: in (months, years, parts of day) — 'in July', 'in 2026', 'in the morning'. On (days, dates) — 'on Monday', 'on 5 June'. At (clock times, festivals) — 'at 7pm', 'at Christmas'.",
          "Place: in (enclosed) — 'in London', 'in the box'. On (surface) — 'on the table', 'on the wall'. At (specific point) — 'at the bus stop', 'at the door'.",
        ],
      },
      {
        heading: "Collocations and word choice",
        body: [
          "Native English uses fixed pairings that learners often miss. 'Make a decision' (not 'do a decision'). 'Take a photo' (not 'make a photo'). 'Strong tea / heavy rain / fast food / quick lunch'. Use a learner's dictionary (Oxford, Cambridge, Longman) and note the example sentences, not just the meaning.",
          "Academic Writing also rewards specific verbs: 'demonstrate' instead of 'show', 'examine' instead of 'look at', 'highlight' instead of 'point out'.",
        ],
      },
      {
        heading: "Practice strategy",
        body: [
          "Don't study grammar in isolation — apply it the same day. After a 20-minute lesson on present perfect, write five true sentences about your own life using the structure. The next day, write five more.",
          "For vocabulary, learn words in chunks of 4–8 in a single topic (e.g. environment, technology, education) so they reinforce each other. Re-test yourself after one day, three days and one week.",
        ],
      },
      {
        heading: "Punctuation that lifts a Writing score",
        body: [
          "Commas: separate items in a list (apples, pears and bananas), set off non-essential clauses (London, the capital of England, is...), and after fronted adverbials (However, the data shows...). Don't use a comma to join two complete sentences — that's the comma splice, the single most-marked error in IELTS Writing.",
          "Semicolons join two closely related complete sentences ('It was raining; the picnic was cancelled'). Colons introduce a list, an explanation or a quotation. Apostrophes show possession (the student's book) or contraction (don't, it's). 'Its' (possessive) has no apostrophe; 'it's' always means 'it is' or 'it has'.",
        ],
      },
      {
        heading: "Sentence structures examiners reward",
        body: [
          "Three structures lift a band 6 piece to band 7. Conditionals: 'If house prices fell, more first-time buyers could enter the market.' Relative clauses: 'Students who live with their parents save thousands.' Cleft sentences: 'What concerns most parents is screen time, not homework.'",
          "Use them sparingly — one or two of each per essay is enough. Sprinkling complex structures over weak grammar fundamentals (article, agreement, tense) doesn't fool examiners.",
        ],
      },
      {
        heading: "Building academic vocabulary",
        body: [
          "Learn the Academic Word List (AWL) — 570 word families that appear across academic subjects in English. Key examples: analyse, approach, area, assess, available, benefit, concept, consist, context, contract, create, data, define, derive, distribute, economy, environment, establish, estimate, evaluate, evidence, factor, function, identify, income, indicate, individual, interpret, involve, issue, labour, legal, legislate, major, method, occur, percent, period, policy, principle, process, require, research, respond, role, section, sector, significant, similar, source, specific, structure, theory, vary.",
          "Look up each word in a learner's dictionary, note one example sentence, and use the word in two written sentences of your own. Recycle each word at least three times in the next two weeks for it to stick.",
        ],
      },
    ],
    faqs: [
      { q: "Is grammar enough to pass IELTS?", a: "No — but poor grammar is the most common reason for a band 6.0 ceiling in Writing and Speaking. Strong grammar lifts every other skill with you." },
      { q: "Which tenses are most important?", a: "Present simple, past simple, present perfect, future with 'will' and 'going to'. These cover 80% of everyday and academic English." },
      { q: "Do I need to learn all phrasal verbs?", a: "No — focus on the 100 most common (look up, find out, give up, carry on). Phrasal verbs are tested heavily in Cambridge B2/C1 but less so in IELTS." },
      { q: "How long should I study grammar?", a: "20–30 minutes a day for 6–8 weeks alongside Reading and Listening practice. Sudden grammar marathons don't stick." },
    ],
  },

  // -------- EDUCATION -------------------------------------------------
  "eleven-plus": {
    title: "11+ Exam Guide | UK Test Hub",
    description:
      "Free 11+ exam guide for UK grammar schools. GL Assessment vs CEM, the four sections, study plan and tips for parents — with practice questions.",
    tagline: "The grammar school entrance exam — what to study and when to start.",
    intro: [
      "The 11+ is the entrance exam for UK state grammar schools and many independent secondary schools. Children sit it in September of Year 6 (age 10–11), with results used for September Year 7 entry. There's no national 11+ — each region uses either GL Assessment, CEM, or a school-specific paper, and content varies.",
      "This guide explains the formats, what's tested in each section, and a realistic 6–12 month preparation plan for parents. Use the practice questions to gauge where your child currently stands.",
    ],
    sections: [
      {
        heading: "GL Assessment vs CEM vs ISEB",
        body: [
          "GL Assessment is used in Kent, Lincolnshire, Buckinghamshire and many partial-selective areas. It tests four separate papers: Verbal Reasoning, Non-Verbal Reasoning, Maths and English.",
          "CEM (Centre for Evaluation and Monitoring) was used in Birmingham, Wirral and a few others, but most CEM regions have switched to GL since 2023. ISEB Common Pre-Test is used by independent schools, taken in Year 6 or 7, computer-adaptive.",
        ],
      },
      {
        heading: "What each section tests",
        body: [
          "Verbal Reasoning: word puzzles, codes, analogies, finding the odd one out. Heavy on vocabulary — the strongest predictor of a high VR score is wide reading from age 7+.",
          "Non-Verbal Reasoning: shape sequences, mirror images, matrices. Less coachable but improves with practice. Maths: KS2 curriculum plus quick mental arithmetic. English: comprehension, grammar, punctuation, sometimes a short writing task.",
        ],
      },
      {
        heading: "When to start preparing",
        body: [
          "Most families start formal 11+ prep 12 months before the test (start of Year 5). Earlier 'enrichment' through reading and puzzles is fine, but heavy tutoring before Year 5 is rarely cost-effective.",
          "Aim for 30–45 minutes of focused practice, four or five days a week, building to one full timed paper each weekend in the final two months.",
        ],
      },
      {
        heading: "Tips for parents",
        body: [
          "Read aloud to and with your child every day — it builds vocabulary faster than any tutor. Encourage at least 30 minutes of independent reading from age 7, gradually moving toward classic and challenging texts.",
          "Don't over-tutor. Children who arrive at the exam exhausted or anxious underperform. Build in proper rest days and stop all 11+ talk the day before the test.",
        ],
      },
      {
        heading: "On the day",
        body: [
          "The exam is held at a local grammar school or test centre on a Saturday morning in September. It's usually two papers in the morning with a short break.",
          "Results are released in mid-October. Most areas use the score for school allocation in March via the standard secondary school application (CAF) — your child's catchment school remains as a backup.",
        ],
      },
      {
        heading: "Question types in detail",
        body: [
          "Verbal Reasoning: 21 question types in the GL bank. The most common are word codes (substitute letters using a key), letter sequences, hidden words inside sentences, antonyms, synonyms, and 'cloze' (fill-in-the-blank) passages. Vocabulary depth matters — children should know words like 'placid', 'meander', 'reluctant' and 'feasible' by Year 5.",
          "Non-Verbal Reasoning: shape rotation, mirror images, find-the-odd-one-out, complete-the-matrix and code-the-shape. The trick is methodical elimination, not pattern guessing. Encourage your child to explain their reasoning out loud — it dramatically reduces careless errors.",
          "Maths: focus areas are fractions, decimals, percentages, ratio, area, perimeter, time and pure word problems. Answer is sometimes multiple-choice, sometimes a free-text number — practise both formats.",
        ],
      },
      {
        heading: "How school allocation actually works",
        body: [
          "Pass the 11+ and your child qualifies for grammar school admission — but does not automatically get a place. Allocation depends on each grammar school's oversubscription rules: catchment area, sibling priority, distance to school, sometimes Pupil Premium priority.",
          "You apply through your local authority's Common Application Form (CAF), naming up to six schools in preference order, by the 31 October deadline. Always include a non-selective backup — most LAs will not allocate any place if all your preferences are full and you haven't named a fallback.",
          "Appeals: if your child narrowly misses the qualifying score or doesn't get an offer at a school they qualified for, you can appeal in writing. Successful appeals usually rely on evidence of illness on the test day, an obvious anomaly in the score, or breach of the admission policy.",
        ],
      },
      {
        heading: "Wellbeing during 11+ year",
        body: [
          "11+ pressure on a 10-year-old is real. Watch for signs of stress: poor sleep, appetite changes, withdrawal from friends, frequent stomach aches before practice sessions. If they appear, scale back not up.",
          "Build in genuine downtime — at least one whole evening a week with no 11+ work, plus weekend family time. Sport, music, drama and free play protect concentration during the actual test more than another worksheet does. Whatever the result, your child should know that the family will love them and back the school they end up at, grammar or comprehensive.",
        ],
      },
    ],
    faqs: [
      { q: "What's the 11+ pass mark?", a: "Most areas use a 'standardised score' rather than a fixed pass mark — typically 121+ out of 141 to qualify for grammar school admission. Selective areas like Kent set their own thresholds." },
      { q: "Is the 11+ the same everywhere?", a: "No — content and format vary by region. Always check whether your local school uses GL, CEM or ISEB and prepare with matching past papers." },
      { q: "Can I get tutoring through the council?", a: "No — 11+ tutoring is private. Families with low income can apply for bursaries at some independent schools after passing the entrance exam." },
      { q: "Do private schools accept the same 11+?", a: "Many use ISEB Common Pre-Test instead. A few accept the GL paper. Check each school's admission policy." },
      { q: "Can my child resit the 11+?", a: "Generally no — it's a one-shot exam in Year 6. Some schools have a Year 7 'late entry' test but spaces are very limited." },
    ],
  },
  "gcse-maths": {
    title: "GCSE Maths Guide | UK Test Hub",
    description:
      "Free GCSE Maths guide. AQA, Edexcel and OCR format, Foundation vs Higher tier, the new 1–9 grading and study tips — with practice questions.",
    tagline: "Pass GCSE Maths first time — the tier choice that decides your grade ceiling.",
    intro: [
      "GCSE Mathematics is sat at the end of Year 11 (age 15–16) and is a hard requirement for sixth form, college, apprenticeships and most jobs. A grade 4 is a 'standard pass' (the old C); grade 5 is a 'strong pass'. Without a grade 4, students must keep retaking until age 18.",
      "This guide covers the tier choice (Foundation vs Higher), the three exam papers, the topic split and a realistic 6-month study plan for students aiming to pass or push for grade 7+.",
    ],
    sections: [
      {
        heading: "Foundation vs Higher tier",
        body: [
          "Foundation tier is graded 1–5. Higher tier is graded 4–9 (with a safety net grade 3). Choose Foundation if you're working at grade 4 or below in mock exams — you'll have more time per question and better chance of a strong pass.",
          "Choose Higher if you're consistently scoring grade 5+ in mocks and aiming for sixth-form A-level Maths (most schools require grade 6 or 7). Higher includes topics that don't appear at Foundation: trigonometry beyond the basics, vectors, advanced algebra, circle theorems.",
        ],
      },
      {
        heading: "The three papers",
        body: [
          "All boards use three 90-minute papers (80 marks each). Paper 1 is non-calculator; Papers 2 and 3 are calculator. Total 240 marks across the three papers.",
          "Don't leave the calculator papers to chance — they have specific topics (statistics, probability, complex algebra) that benefit from calculator work. Practise with the exact calculator you'll use on the day (Casio fx-83 or fx-85 are the standards).",
        ],
      },
      {
        heading: "Topic weightings",
        body: [
          "Foundation: Number 25%, Algebra 20%, Ratio & Proportion 25%, Geometry 15%, Statistics & Probability 15%. Higher: Number 15%, Algebra 30%, Ratio & Proportion 20%, Geometry 20%, Statistics & Probability 15%.",
          "At Higher, algebra is the single biggest area and the topic that separates grade 6 from grade 8. Master quadratics, simultaneous equations, functions and graph transformations.",
        ],
      },
      {
        heading: "Study plan",
        body: [
          "Six-month plan: Months 1–2 work through a topic-by-topic revision guide (CGP, Collins) doing every example. Months 3–4 drill past papers by topic. Months 5–6 full timed past papers — at least one a week, marked against the official mark scheme.",
          "Past papers are the single most important resource. Each board publishes 5+ years of past papers free on their website. Aim to complete 12+ full papers before the real exam.",
        ],
      },
      {
        heading: "Common pitfalls",
        body: [
          "Showing no working on calculator papers — even right answers can lose method marks. Misreading the question (especially negatives, units and rounding instructions). Spending too long on one question instead of moving on.",
          "Calculator slips: forgetting BIDMAS / order of operations, mis-typing fractions, leaving the calculator in degrees mode for radian questions (or vice versa).",
        ],
      },
      {
        heading: "Topics most students lose marks on",
        body: [
          "Surds and indices: simplifying √48, rationalising 1/√2, fractional and negative powers. These appear on every Higher paper and are worth easy marks if you've drilled the rules.",
          "Compound and reverse percentages: '£2,400 after a 20% increase — what was the original?' Most candidates divide by 1.2; many forget. Practise until the method is automatic.",
          "Vectors and circle theorems: typically the hardest Higher questions, worth 4–6 marks each. Learn the eight named circle theorems (angle at centre, angle in semicircle, alternate segment, etc.) and the column-vector arithmetic for parallel and collinear questions.",
          "On Foundation, the killer topics are area/perimeter of compound shapes, ratio sharing, and time-table reading. None are conceptually hard — they need slow, careful reading.",
        ],
      },
      {
        heading: "Formulas given vs formulas you must learn",
        body: [
          "Each board provides a small formula sheet at the front of the exam (since 2022). It includes the quadratic formula, sine and cosine rules, area of a trapezium, volume of cone/sphere, and the kinematics SUVAT equations.",
          "You still must memorise: area and circumference of a circle, area of a triangle (½ × base × height), Pythagoras, the standard trigonometric ratios (SOH-CAH-TOA), exact trig values (sin/cos/tan of 0°, 30°, 45°, 60°, 90°), and the equation y = mx + c. Make a one-page formula card and review it daily for the last two weeks.",
        ],
      },
      {
        heading: "Resit options and life after GCSE",
        body: [
          "If you don't get a grade 4 in summer, you can resit in November (Edexcel and AQA both offer a November series for English Language and Maths only). Otherwise the next sitting is the following June.",
          "Functional Skills Level 2 in Maths is accepted by most apprenticeship providers, employers and many colleges as an equivalent to GCSE grade 4. It's a different style of exam — entirely applied, no algebra — and many resit students find it a faster route to a pass than a GCSE retake.",
          "Universities and competitive sixth forms usually still want GCSE Maths grade 4 (sometimes 5 or 6 for STEM A-levels). If university is in the picture, prioritise the GCSE retake over Functional Skills.",
        ],
      },
    ],
    faqs: [
      { q: "What's a pass in GCSE Maths?", a: "Grade 4 is a 'standard pass'; grade 5 is a 'strong pass'. Most colleges and sixth forms accept grade 4." },
      { q: "Can I switch tier after starting?", a: "Yes — schools choose the entry, and tier can change up until a few weeks before the exam. Discuss it with your maths teacher in mock season." },
      { q: "Do I need a calculator?", a: "Yes for Papers 2 and 3. A Casio fx-83 or fx-85 scientific calculator is the standard and is allowed by all boards." },
      { q: "What if I don't get a grade 4?", a: "Students under 18 must keep resitting GCSE Maths (in November and the next June) as a condition of college funding. Functional Skills Level 2 Maths is sometimes accepted as an alternative." },
      { q: "How many past papers should I do?", a: "Aim for at least 12 full papers from your specific exam board, mixed across topics and years. Mark every paper carefully — the review is where the learning happens." },
    ],
  },
  "gcse-english": {
    title: "GCSE English Guide | UK Test Hub",
    description:
      "Free GCSE English guide. AQA, Edexcel and OCR format, English Language vs Literature, set texts and study plan — with practice questions.",
    tagline: "Pass GCSE English Language and unlock sixth form, apprenticeships and most UK jobs.",
    intro: [
      "GCSE English is split into two separate qualifications: English Language and English Literature. Both are sat at the end of Year 11 and graded 1–9. English Language is the one that matters most for college, apprenticeships and employment — without a grade 4 you'll need to resit until age 18.",
      "This guide explains the two qualifications, the exam papers, the set texts you'll likely study, and how to revise efficiently in the final six months.",
    ],
    sections: [
      {
        heading: "English Language vs Literature",
        body: [
          "English Language tests reading and writing skills using unseen texts — typically a 19th-century non-fiction extract paired with a 20th- or 21st-century one. There's also a Spoken Language endorsement (a presentation, marked separately as Pass/Merit/Distinction).",
          "English Literature tests your study of set texts: usually a Shakespeare play, a 19th-century novel, a modern play or novel, and a poetry anthology. AQA Power & Conflict and Love & Relationships are the most common poetry clusters.",
        ],
      },
      {
        heading: "The exam papers",
        body: [
          "Language: two 1h45 papers. Paper 1 is fiction (a 20th- or 21st-century extract); Paper 2 is non-fiction (two contrasting texts).",
          "Literature: two papers, both closed-book (no texts allowed in the exam). Paper 1 covers Shakespeare and the 19th-century novel; Paper 2 covers modern texts and poetry.",
        ],
      },
      {
        heading: "Set texts you'll likely meet",
        body: [
          "Shakespeare: Macbeth, Romeo and Juliet, The Merchant of Venice. 19th-century novel: A Christmas Carol, Jekyll and Hyde, Great Expectations.",
          "Modern: An Inspector Calls (J.B. Priestley) — by far the most common; Blood Brothers, Animal Farm, Lord of the Flies. Poetry: AQA Power & Conflict (Ozymandias, Bayonet Charge), Love & Relationships (Sonnet 29, Mother Any Distance).",
        ],
      },
      {
        heading: "Study plan",
        body: [
          "Six-month plan: Months 1–3 deep-read every set text twice, building a quote bank of 10–15 quotes per text with one-line analysis. Months 4–5 essay practice — one essay a week marked against the mark scheme. Month 6 timed full papers and quote memorisation.",
          "For Language papers, drill the question types: 'list four things' (Q1), 'how does the writer use language' (Q2), 'structure' (Q3), 'evaluate' (Q4) and the writing question. Each has a specific mark scheme.",
        ],
      },
      {
        heading: "Quote memorisation that actually works",
        body: [
          "Don't memorise long quotes. Aim for 8–10 short quotes per text (3–6 words each) covering the main themes and characters. Use spaced repetition (Anki, Quizlet) and self-test daily.",
          "Examiners reward accurate short quotes far more than paraphrasing or long mis-remembered passages.",
        ],
      },
      {
        heading: "Language Paper question-by-question",
        body: [
          "Paper 1 Q1 'list four things': straight retrieval from a specified part of the text. Don't analyse, don't add — just lift four facts. Worth 4 marks; should take 4 minutes.",
          "Q2 'how does the writer use language': pick two or three quotations, identify the technique (metaphor, simile, sensory imagery, sentence structure) and explain the effect on the reader. Worth 8 marks; spend 10 minutes.",
          "Q3 'structure': how the writer has organised the text — opening focus, shifts in perspective, contrasts, ending. Most-overlooked question on the paper. Worth 8 marks; 10 minutes.",
          "Q4 'evaluate' a statement about the text: agree, partly agree or disagree, with quotations and analysis. Worth 20 marks; 25 minutes.",
          "Q5 writing: descriptive or narrative (Paper 1) or transactional/persuasive (Paper 2). Worth 40 marks (24 for content, 16 for technical accuracy). Spend the full 45 minutes — five planning, 35 writing, five proofreading.",
        ],
      },
      {
        heading: "How to plan an essay in five minutes",
        body: [
          "For Literature essays, use a simple structure: introduction with a thesis sentence, three main paragraphs (theme, character, context), conclusion that returns to the question. Each main paragraph = point, evidence (short quote), analysis (zoom in on a word), link to context (Jacobean society, Victorian poverty, post-war disillusionment).",
          "Plan in bullets only — full sentences in the plan waste minutes. Aim for four short bullets per paragraph and you'll have 35 minutes left to write each 1.5–2 page response.",
        ],
      },
      {
        heading: "Reading widely and the Spoken Language endorsement",
        body: [
          "Wide reading is the single biggest predictor of a high English Language grade. Mix fiction (modern novels, classic short stories) with non-fiction (long-form journalism in the Guardian, BBC News, the Atlantic). Twenty pages a day is enough.",
          "The Spoken Language endorsement (Pass / Merit / Distinction) is a 5–10 minute presentation to your class on a topic of your choice, followed by Q&A. It doesn't affect the 1–9 grade but appears on your certificate and matters for sixth-form English applications. Pick a topic you genuinely care about and rehearse out loud, not in your head.",
        ],
      },
      {
        heading: "Context — the marks examiners give for free",
        body: [
          "Literature mark schemes reward 'context' (Assessment Objective 3): the social, historical or literary background of the text. For An Inspector Calls, that means 1912 vs 1945 (Priestley wrote it post-war but set it pre-war to critique Edwardian capitalism). For A Christmas Carol, the Poor Laws and the Victorian workhouse system. For Macbeth, the Jacobean fear of regicide and witchcraft under James I.",
          "Learn three or four key context points per text and weave one into each paragraph. Don't write a separate 'context paragraph' — that's how candidates lose AO3 marks. Embed the context inside your analysis: 'Dickens, writing in the wake of Edwin Chadwick's 1842 sanitary report, presents Scrooge's transformation as proof…'.",
          "Examiner reports consistently note that strong AO3 distinguishes grade 7+ scripts from grade 5 scripts that otherwise have similar quote work.",
        ],
      },
    ],
    faqs: [
      { q: "Which GCSE English do I need to pass?", a: "English Language. Literature is required for some sixth forms and degrees but not for college funding or most jobs." },
      { q: "What's a grade 4 worth?", a: "A 'standard pass' — equivalent to the old grade C. Grade 5 is a 'strong pass'." },
      { q: "Can I take a calculator into the exam?", a: "No — there's no maths in English. You can take pens, pencils, and a clear water bottle." },
      { q: "Are the texts the same for every school?", a: "Each school chooses its set texts from the exam board's prescribed list. Always check what your school is teaching before buying revision guides." },
      { q: "Do I need to resit if I get a grade 3?", a: "Yes — students under 18 must keep resitting English Language as a condition of college funding until they reach grade 4 or turn 18." },
    ],
  },
  sats: {
    title: "SATs Guide | UK Test Hub",
    description:
      "Free SATs guide for parents. KS1 (Year 2) and KS2 (Year 6) format, what's tested, study tips and practice questions for reading, grammar and maths.",
    tagline: "What KS1 and KS2 SATs really test — and how parents can help.",
    intro: [
      "SATs (Standard Assessment Tests) are the national curriculum tests sat at the end of Key Stage 1 (Year 2, age 6–7) and Key Stage 2 (Year 6, age 10–11) in state primary schools in England. Wales, Scotland and Northern Ireland do not sit SATs.",
      "KS1 SATs were made optional from 2023 onwards. KS2 SATs remain compulsory and the results are used for school accountability, transition to secondary and as a baseline for KS3.",
    ],
    sections: [
      {
        heading: "What KS2 SATs cover",
        body: [
          "Three subjects across six papers: English Reading (1 paper, 60 minutes), English Grammar Punctuation & Spelling (2 papers — GPS and a spelling test), Maths (3 papers — arithmetic plus two reasoning).",
          "Science is sampled — only some schools sit it each year. Writing is teacher-assessed, not externally tested.",
        ],
      },
      {
        heading: "How scoring works",
        body: [
          "Raw scores are converted to a 'scaled score' between 80 and 120. A scaled score of 100 is the 'expected standard'. 110+ is the 'higher standard'.",
          "Roughly 60% of pupils meet the expected standard in all three subjects. Schools (not individual children) are judged on how many reach 100+ in reading, writing and maths combined.",
        ],
      },
      {
        heading: "Reading paper tips",
        body: [
          "The reading paper has three texts of increasing difficulty. Children often run out of time on the third text — practise pacing so the easier texts don't eat the clock.",
          "Underline key words in each question, then scan the text for evidence. 'Find and copy' questions need an exact word or phrase from the text — paraphrasing loses the mark.",
        ],
      },
      {
        heading: "Maths paper tips",
        body: [
          "Paper 1 (arithmetic) is 30 minutes of pure calculation — speed matters. Practise mental arithmetic and column methods until they're automatic.",
          "Papers 2 and 3 (reasoning) include word problems where the maths is hidden inside a story. Teach children to underline the question and the numbers, then plan before calculating.",
        ],
      },
      {
        heading: "How parents can help",
        body: [
          "Read with your child every day, even in Year 6. Ten minutes of shared reading does more for SATs than an hour of worksheets. Discuss the text — what happened, what might happen next, what does this word mean.",
          "For maths, focus on times tables (up to 12×12 by Year 4) and confident column methods. Free resources from BBC Bitesize, White Rose Maths and the official gov.uk past papers cover everything you need.",
        ],
      },
      {
        heading: "GPS paper — what's actually tested",
        body: [
          "The Grammar, Punctuation and Spelling paper has 50 short questions in 45 minutes. Topics include word classes (noun, verb, adjective, adverb, preposition, conjunction, determiner, pronoun), subordinate clauses, modal verbs, the subjunctive ('if I were'), expanded noun phrases, fronted adverbials, parenthesis (using brackets, dashes or commas), apostrophes for possession and contraction, and direct vs reported speech.",
          "The 20-question spelling test is read aloud by the teacher — children fill the missing word into a sentence on the answer sheet. Common spelling rules tested: 'i before e except after c', double-consonant before -ing, silent letters, and prefix/suffix changes (happy → happiness).",
        ],
      },
      {
        heading: "Year 4 Multiplication Check and the Phonics Screening",
        body: [
          "Beyond SATs, two other statutory checks happen in primary school. The Phonics Screening Check is in Year 1 (June): 40 words including 20 'pseudo-words' (alien words like 'voo' or 'glimp') to test pure phonic decoding. The pass mark is usually 32/40.",
          "The Multiplication Tables Check is in Year 4 (June): 25 questions on times tables up to 12×12, six seconds per question, on a laptop or tablet. There's no formal pass mark but the school's average score is reported. Daily Times Tables Rock Stars practice from Year 3 makes a big difference.",
        ],
      },
      {
        heading: "Wellbeing and the school's role",
        body: [
          "SATs week can feel pressured even when your child is well-prepared. Schools usually provide a breakfast club, calm classrooms and limited 'normal' lessons that week. At home, keep evenings normal: regular bedtime, no late-night cramming, the same TV and screen-time rules. Anxious children sleep poorly and underperform.",
          "Remember: SATs are mainly about school accountability. They don't appear on any future CV, university application or job. Your child's report card and teacher assessments matter far more for secondary school than any SATs scaled score.",
        ],
      },
    ],
    faqs: [
      { q: "When are SATs taken?", a: "KS2 SATs are sat in mid-May of Year 6. KS1 SATs (now optional) are taken in May of Year 2." },
      { q: "Are SATs compulsory?", a: "KS2 SATs are compulsory in England's state schools. KS1 SATs are optional from 2023. Independent schools and schools in Wales, Scotland and Northern Ireland don't sit SATs." },
      { q: "What's the SATs pass mark?", a: "There's no formal pass — children are assessed against the 'expected standard' (scaled score 100) and 'higher standard' (110+)." },
      { q: "Do SATs affect secondary school placement?", a: "No — secondary places are allocated through the Common Application Form before SATs results are released. SATs are mainly for school accountability." },
      { q: "Should I tutor my child for SATs?", a: "Most children don't need tutoring. Daily reading, times tables, and the free past papers from gov.uk are usually enough." },
    ],
  },

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
  "nmc-cbt": generic("NMC CBT (Nurses)", "the Nursing and Midwifery Council, delivered by Pearson VUE", "the Computer Based Test for international nurses and midwives applying for NMC registration — 115 questions over 3 hours with Part A numeracy (15 questions, 30 minutes) and Part B clinical multiple-choice (100 questions, 2 hours 30 minutes)"),

  // -------- TAXI / PRIVATE HIRE ---------------------------------------
  seru: {
    title: "SERU TfL Mock Test Guide | UK Test Hub",
    description:
      "Complete TfL SERU assessment guide. Format, pass mark, the 10 syllabus areas and study tips — with free mock tests reflecting the real TfL exam.",
    tagline: "The TfL Safety, Equality and Regulatory Understanding assessment for London private hire drivers, based on the PHV Driver's Handbook.",
    intro: [
      "The TfL SERU assessment is mandatory for every new London private hire driver since October 2021. It covers safety, equality and regulatory understanding and is based on the Private Hire Driver's Handbook. TfL does not publish a fixed percentage pass mark — they judge whether you give the safest, most legally correct response. You must pass it before TfL will issue your PHV licence.",
      "Each of our mocks is a 24-question SERU practice mock with multiple-choice and missing-word style questions. We set a practice target of 75% — that extra margin builds the confidence you need for the real assessment. Roughly 40% of candidates fail their first attempt, almost always on the safeguarding and equality sections.",
      "Use the mocks to drill the syllabus areas TfL focus on, then read the official PHV Driver's Handbook alongside them.",
    ],
    sections: [
      {
        heading: "Format and what to expect",
        body: [
          "SERU is sat at a TfL-approved centre and includes multiple-choice and missing-word / sentence-completion questions drawn from the PHV Driver's Handbook. TfL does not publish a fixed percentage pass mark — the focus is on giving the safest, most legally correct response to each scenario.",
          "Questions are scenario-based: 'A passenger asks you to do X — what do you do?' The right answer is almost always the safest, most legally compliant and most respectful option. Common-sense alone is not enough — you need to know the specific TfL rules from the PHV Driver's Handbook.",
          "On UK Test Hub each mock is a 24-question SERU practice mock with a practice target of 75%. The practice target is set higher than typical pass thresholds on purpose, to give you a safety margin on the day.",
        ],
      },
      {
        heading: "What SERU covers",
        body: [
          "TfL bases SERU on the PHV Driver's Handbook and groups the content into five core areas: (1) Safety — safeguarding, passenger safety, vehicle safety and roadworthiness. (2) Equality — protected characteristics, reasonable adjustments and the Equality Act 2010. (3) Regulatory understanding — TfL licensing conditions, notification duties, insurance and MOT for hire and reward. (4) Passenger protection — assistance dogs, wheelchair accessibility, vulnerable passengers and how to report concerns. (5) Driver conduct — professional behaviour, lost property, fares and routes.",
          "Safeguarding and equality usually carry the most weight. Drill these areas hardest.",
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
      { q: "What pass mark does SERU use?", a: "TfL does not publish a fixed percentage pass mark — SERU is judged on whether you give the safest, most legally correct response to each scenario, based on the PHV Driver's Handbook. On UK Test Hub we set a practice target of 75% so you can measure progress and build a safety margin for the real assessment." },
      { q: "What kind of questions does SERU use?", a: "A mix of multiple-choice and missing-word / sentence-completion questions, all drawn from the PHV Driver's Handbook." },
      { q: "How much does the SERU cost?", a: "Around £36 per attempt at a TfL-approved centre — check the current fee on tfl.gov.uk before you book." },
      { q: "How many attempts do I get?", a: "TfL allow a limited number of attempts in a rolling window before they pause your application. Check your applicant portal for current limits." },
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
  "comptia-a-plus": generic("CompTIA A+ Practice", "CompTIA", "the entry-level IT support certification — two exams (Core 1 220-1201 and Core 2 220-1202, the current V15 series) covering hardware, networking, mobile, security and operating systems"),
  "itil-4": generic("ITIL 4 Foundation Practice", "PeopleCert on behalf of AXELOS", "the ITIL 4 Foundation exam — 40 multiple-choice questions in 60 minutes, pass mark 65% (26/40), covering the service value system and seven guiding principles"),
  "microsoft-fundamentals": generic("Microsoft Azure & 365 Fundamentals (AZ-900 / MS-900)", "Microsoft Learn / Pearson VUE", "the entry-level Microsoft Azure Fundamentals (AZ-900) cloud certification and the Microsoft 365 Fundamentals (MS-900) productivity certification — both Microsoft Azure and Microsoft 365 exams are scored out of 1000 with a 700 pass mark and cover Azure cloud concepts, Azure services, Azure pricing, security and compliance"),
  "cyber-awareness": generic("Cyber Security Awareness", "the National Cyber Security Centre (NCSC)", "an awareness-level practice on phishing, password hygiene, multi-factor authentication, ransomware and the NCSC Cyber Essentials controls"),

  // -------- HEALTHCARE ENTRY -----------------------------------------
  ucat: generic("UCAT Practice", "the UCAT Consortium", "the University Clinical Aptitude Test for medical and dental school applicants — three cognitive subtests (Verbal Reasoning, Decision Making and Quantitative Reasoning) plus Situational Judgement, sat at Pearson VUE. Abstract Reasoning was removed from UCAT from 2025"),
  bmat: generic("BMAT Legacy Practice", "Cambridge Assessment Admissions Testing (BMAT was discontinued from the 2024 application cycle for 2025 entry onwards — these questions are historical practice only)", "historical biomedical admissions-style practice. BMAT is no longer used for current UK medicine admissions; former BMAT universities have moved to other admissions tests, mainly UCAT. Use this for general aptitude and science practice only — for current applications, prepare with UCAT"),
  oet: generic("OET (Healthcare English)", "Cambridge Boxhill Language Assessment", "the Occupational English Test — the healthcare-specific English test accepted by the NMC, GMC, GDC and HCPC as proof of English proficiency"),
  "plab-1": generic("PLAB 1 Sample Questions", "the General Medical Council (GMC)", "the Professional and Linguistic Assessments Board Part 1 — a 180-question SBA exam in 3 hours, the first stage of GMC registration for international medical graduates"),

  // -------- TEACHING -------------------------------------------------
  "qts-numeracy": generic("QTS Numeracy Skills Test (Legacy)", "the Department for Education (discontinued from 1 April 2020)", "the now-discontinued Professional Skills Test in Numeracy for trainee teachers. The official QTS professional skills tests were withdrawn from 1 April 2020 and test centres closed in 2020 — teacher training providers now assess fundamental English and maths skills themselves. Retained here as legacy practice"),
  "qts-literacy": generic("QTS Literacy Skills Test (Legacy)", "the Department for Education (discontinued from 1 April 2020)", "the now-discontinued Professional Skills Test in Literacy — spelling, punctuation, grammar and comprehension. The official QTS professional skills tests were withdrawn from 1 April 2020 and test centres closed in 2020 — teacher training providers now assess fundamental English and maths skills themselves. Retained here as legacy practice"),
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

  // -------- HGV / LGV & LOGISTICS ------------------------------------
  "driver-cpc-module-2": generic("Driver CPC Module 2 (Case Studies)", "the DVSA", "the Driver CPC Module 2 case studies test — 7 on-screen scenarios with multiple-choice questions, required to drive professionally for a living in a lorry, bus or coach"),
  "driver-cpc-module-4": generic("Driver CPC Module 4 (Practical Demonstration Theory)", "the DVSA", "the underpinning theory for Driver CPC Module 4 — vehicle safety, securing loads, emergency procedures and the daily walkaround check"),
  "adr-dangerous-goods": generic("ADR Dangerous Goods Awareness", "SQA / City & Guilds on behalf of the DVSA", "the ADR driver training assessment — required to carry packaged or tanker dangerous goods on UK and European roads. Covers the nine UN classes, documentation and emergency response"),
  
  "transport-manager-cpc": generic("Transport Manager CPC Practice", "OCR on behalf of the Traffic Commissioners", "the Transport Manager CPC (Road Haulage) — multiple-choice and case-study exam required to be the named transport manager on a UK Operator Licence"),

  // -------- CARE & SOCIAL WORK --------------------------------------
  "care-certificate": generic("Care Certificate (15 Standards)", "Skills for Care, Skills for Health and Health Education England", "the 15-standard induction framework for new health and social care workers in England — covers duty of care, safeguarding, person-centred values and infection prevention"),
  "adult-social-care": generic("Level 2 Adult Social Care", "City & Guilds, Highfield and NCFE CACHE", "the Level 2 Diploma in Adult Care knowledge test — communication, equality and diversity, safeguarding, health and safety in care settings"),
  "safeguarding-adults": generic("Safeguarding Adults", "Skills for Care and the Care Quality Commission (CQC)", "Level 2 / 3 safeguarding adults practice — types of abuse, the Care Act 2014, mental capacity and how to raise a safeguarding alert"),
  "medication-awareness": generic("Medication Awareness in Care", "Skills for Care and NICE guidance NG67", "safe handling and administration of medicines in social care — the six rights, controlled drugs, MAR charts and reporting errors"),
  "social-work-england": generic("Social Work England Readiness", "Social Work England", "a knowledge primer for newly-qualified social workers — the SWE professional standards, ASYE programme and fitness to practise framework"),

  // -------- BEAUTY & WELLBEING --------------------------------------
  "beauty-therapy-level-2": generic("Level 2 Beauty Therapy Theory", "VTCT, City & Guilds and ITEC", "the Level 2 Diploma in Beauty Therapy underpinning knowledge — anatomy and physiology, skin analysis, contraindications and salon health and safety"),
  "barbering-level-2": generic("Barbering Level 2 Theory", "VTCT and City & Guilds", "the Level 2 Diploma in Barbering theory — consultation, cutting techniques, beard shaping, shaving and salon hygiene"),
  "nail-technician": generic("Nail Technician Theory", "VTCT and ITEC", "the Level 2 / 3 nail services theory — nail anatomy, manicure and pedicure procedures, gel and acrylic enhancements and contraindications"),
  "infection-control-beauty": generic("Infection Control for Beauty", "the Hair and Beauty Industry Authority (HABIA) and CIEH", "infection prevention and control for hair, beauty and aesthetics professionals — sterilisation, single-use tools, blood-spillage protocols and HTM 01-05"),
  "hairdressing-level-2": generic("Hairdressing Level 2 Theory", "VTCT, City & Guilds and ITEC", "the Level 2 Diploma in Hairdressing theory — consultation, cutting, colouring, shampooing and salon health and safety"),

  // -------- RETAIL & CUSTOMER SERVICE -------------------------------
  "retail-level-2": generic("Retail Level 2 Knowledge", "City & Guilds and Highfield", "the Level 2 Certificate in Retail Knowledge — customer service, stock handling, loss prevention, visual merchandising and selling techniques"),
  "abta-travel-agent": generic("ABTA Travel Agent Practice", "ABTA — The Travel Association", "knowledge tests for travel agents — Package Travel Regulations, ABTA Code of Conduct, ATOL protection and IATA basics"),
  "customer-service-level-2": generic("Customer Service Level 2", "City & Guilds, Highfield and CIEH", "the Level 2 Certificate in Customer Service Knowledge — communication, complaint handling, service recovery and consumer rights"),
  "visual-merchandising": generic("Visual Merchandising Basics", "City & Guilds and ABC Awards", "introductory visual merchandising knowledge — store layout, planograms, window displays, lighting and colour theory"),
  "age-restricted-sales": generic("Age-Restricted Sales (Challenge 25)", "the Trading Standards Institute and Highfield", "Challenge 25 awareness — alcohol, tobacco, vapes, knives and fireworks. Covers acceptable ID, refusal logs and the Licensing Act 2003"),

  // -------- ANIMAL CARE & VETERINARY --------------------------------
  "rvn-pre-registration": generic("RVN Pre-Registration Theory", "the Royal College of Veterinary Surgeons (RCVS)", "the Day One Competences and Skills List for student veterinary nurses preparing for RCVS registration"),
  "dog-grooming-theory": generic("Dog Grooming Theory", "iPET Network and City & Guilds", "the Level 2 / 3 Diploma in Professional Dog Grooming theory — coat types, breed standards, salon hygiene and handling"),
  "animal-first-aid": generic("Animal First Aid", "iPET Network and the Canine First Aid Association", "first aid for cats and dogs — CPR, choking, bleeding, poisoning, heatstroke and when to call the vet"),
  "canine-behaviour": generic("Canine Behaviour Basics", "the Animal Behaviour and Training Council (ABTC)", "introductory canine behaviour and training knowledge — body language, learning theory, socialisation and common problem behaviours"),
  "equine-care": generic("Equine Care Theory", "BHS (British Horse Society) and City & Guilds", "the Level 2 Diploma in Horse Care theory — feeding, watering, grooming, tack fitting, stable management and equine first aid"),

  // -------- NEW: PROFESSIONAL DRIVING & TRANSPORT ------------------
  "transport-manager-cpc-road-haulage": {
    title: "Transport Manager CPC Practice Test | UK Test Hub",
    description:
      "Practise Transport Manager CPC Road Haulage questions online with UK Test Hub. Get free mock tests, instant results and clear answer explanations.",
    tagline: "Independent practice-style questions for road haulage transport manager revision.",
    intro: [
      "Our Transport Manager CPC Road Haulage practice covers the topics most candidates revise for the OCR Certificate of Professional Competence — goods vehicle operations, operator licensing, compliance, drivers' hours, tachographs, vehicle maintenance, safety and transport regulations.",
      "Questions are independent practice-style only. Use them alongside an OCR-approved training provider and the official syllabus, then check current rules on GOV.UK before sitting the real exam.",
    ],
    sections: [
      { heading: "What revision typically covers", body: ["Operator licensing, drivers' hours and EU/AETR rules, tachograph use and records, vehicle maintenance and the daily walkaround, road traffic law, transport safety, vocational training, environmental rules and freight documentation."] },
      { heading: "How candidates usually study", body: ["Most candidates work through an OCR-approved CPC course over 4–10 weeks, combine reading with timed practice questions, and sit the Multiple Choice and Case Study papers at a Pearson VUE test centre."] },
    ],
    faqs: [
      { q: "Is this the official Transport Manager CPC?", a: "No — UK Test Hub is independent. Questions are practice-style. Book the real exam through OCR (an awarding body of the Cambridge University Press and Assessment group) via your training provider." },
      { q: "Do I need this to be a transport manager?", a: "To hold a standard operator licence in Great Britain you must name a CPC-qualified transport manager. Check the current rules on GOV.UK and with the Traffic Commissioners' Office." },
    ],
  },
  "driver-cpc": {
    title: "Driver CPC Practice Test | UK Test Hub",
    description:
      "Practise Driver CPC questions online with UK Test Hub. Get free mock tests, instant results and clear answer explanations.",
    tagline: "Independent practice-style questions for professional LGV, PCV and coach drivers.",
    intro: [
      "Our Driver CPC practice covers the kinds of topics professional lorry, bus and coach drivers revise — Module 2 case studies, safety, regulations, hazard awareness and professional driving responsibilities.",
      "These are practice-style questions, not real exam content. Check the current Driver CPC requirements on GOV.UK and book official tests through the DVSA.",
    ],
    sections: [
      { heading: "What revision typically covers", body: ["EU drivers' hours and tachograph use, vehicle safety and walkaround checks, defensive driving, eco-driving, securing loads, passenger safety on PCVs, fatigue management, drugs and alcohol rules, accident and incident response."] },
      { heading: "How candidates usually prepare", body: ["Combine an approved Driver CPC training course (35 hours of periodic training every 5 years for existing holders) with revision questions and DVSA learning materials. Sit Module 2 and Module 4 at official test centres."] },
    ],
    faqs: [
      { q: "Is Driver CPC set by UK Test Hub?", a: "No. Driver CPC is set and run by the DVSA. UK Test Hub provides independent practice-style revision only." },
      { q: "How long is the Driver CPC card valid?", a: "Driver Qualification Cards last 5 years. You must complete 35 hours of approved periodic training in each 5-year cycle. Confirm the current rules on GOV.UK." },
    ],
  },
  "forklift-flt-theory-test": {
    title: "Forklift Theory Test Practice | UK Test Hub",
    description:
      "Practise forklift and FLT theory test questions online with UK Test Hub. Cover safety checks, load handling, stability, hazards and operator responsibilities.",
    tagline: "RTITB / ITSSAR-style practice for forklift truck and FLT operator theory revision.",
    intro: [
      "Practise forklift and FLT theory test questions with UK Test Hub. This section is designed for learners and operators preparing for forklift truck theory knowledge, including safety checks, load handling, stability, workplace hazards, PPE, signs, operator responsibilities and safe working procedures.",
      "All questions are independent practice-style. UK Test Hub is not affiliated with RTITB, ITSSAR, AITT, NPORS, HSE or any official awarding body — always check your training provider's official requirements before taking a real assessment.",
    ],
    sections: [
      { heading: "What is a Forklift / FLT theory test?", body: ["The forklift theory element is the underpinning knowledge an operator needs to work a counterbalance, reach or rough-terrain truck safely. In the UK there is no single national exam — the theory is delivered and assessed by your accredited training provider, typically working to RTITB, ITSSAR, AITT or NPORS standards. This page gives you RTITB / ITSSAR-style practice you can use alongside (not instead of) an accredited course."] },
      { heading: "Who this practice is for", body: ["New operators preparing for a Basic course, experienced operators getting ready for refresher training, warehouse and logistics staff brushing up before a workplace assessment, and anyone revising for an FLT operator theory element. Useful whether you're training on counterbalance, reach, side-loader or pivot-steer trucks."] },
      { heading: "Common forklift safety topics", body: ["Site rules and segregation of vehicles and pedestrians, speed limits, blind spots, refuelling and battery charging safety, working at height (cages and order pickers), lone-working risks, and the role of HSE guidance L117 (Rider-operated lift trucks: operator training and safe use)."] },
      { heading: "Pre-use checks", body: ["Daily walkaround and pre-shift inspection: tyres, forks and heel wear, mast chains, hydraulic hoses for leaks, horn, lights and reversing beepers, seat belt, hand and foot brakes, data plate and capacity rating, battery condition or fuel level. Reporting and tagging-out defective trucks."] },
      { heading: "Load handling and stability", body: ["The stability triangle and how the centre of gravity shifts with the load, load centre distance, residual capacity at height and reach, picking up and setting down loads correctly, tilt and side-shift use, travelling with the load tilted back and at a safe height, ramps and inclines."] },
      { heading: "Workplace hazards", body: ["Pedestrians and other vehicles, racking damage and the safe stop reporting cycle, spills and contamination, overhead obstructions, loading bays and dock edges, weather conditions for outdoor work, recovering a tipped truck, near-miss reporting."] },
      { heading: "PPE and safety signs", body: ["Hi-vis, safety boots, head protection in designated areas, gloves and eye protection for battery work, hearing protection where required. Recognising statutory signs (prohibition, mandatory, warning, safe condition) and site-specific markings — pedestrian walkways, racking labels, capacity plates."] },
      { heading: "Operator responsibilities", body: ["Only operate trucks you are trained and authorised on, keep certificates and refresher training current, follow site rules and the safe system of work, report defects, never let untrained colleagues drive, and stop work if conditions become unsafe."] },
      { heading: "Common mistakes to avoid", body: ["Travelling with the forks raised, exceeding the rated capacity for the load centre and height, sharp turns at speed, ignoring tyre or mast damage, charging batteries in unventilated areas, removing or bypassing the seat belt, and assuming a refresher isn't needed because the truck 'feels familiar'."] },
      { heading: "FAQs", body: ["See the questions and answers below for the points learners ask most often before booking a course or refresher."] },
    ],
    faqs: [
      { q: "Is there one official 'FLT theory test'?", a: "No single national exam. Different accrediting bodies (RTITB, ITSSAR, AITT, NPORS) issue their own assessments, delivered through approved training providers. Check which standard your employer or course provider uses." },
      { q: "Does my forklift licence expire?", a: "There's no formal expiry, but HSE guidance recommends refresher training every 3–5 years, after any incident or near-miss, when you change to a different truck type, or if your duties change. Always follow your employer's policy." },
      { q: "Can I pass an FLT test using these questions alone?", a: "No. Forklift operator certification requires accredited classroom and practical training. Use UK Test Hub for RTITB / ITSSAR-style revision alongside your official course." },
      { q: "What is HSE guidance L117?", a: "L117 is the HSE's Approved Code of Practice on rider-operated lift trucks — it sets out the standard for operator training, supervision and safe use in UK workplaces." },
      { q: "Is UK Test Hub affiliated with RTITB or ITSSAR?", a: "No. UK Test Hub is an independent practice and study website. We are not affiliated with RTITB, ITSSAR, AITT, NPORS, HSE or any official awarding body. Always confirm requirements with your accredited training provider." },
    ],
  },
  "d1-minibus-theory-test": {
    title: "D1 Minibus Theory Test Practice | UK Test Hub",
    description:
      "Practise D1 Minibus Theory Test questions online with UK Test Hub. Get free mock tests, instant results and clear answer explanations.",
    tagline: "Independent practice-style questions for D1 minibus driving revision.",
    intro: [
      "Our D1 Minibus practice covers the kinds of topics candidates revise before sitting the DVSA D1 theory test — passenger safety, stopping distances, road signs, vehicle checks, legal responsibilities and safe driving.",
      "Questions are independent practice-style only. Always check the current Highway Code and DVSA guidance on GOV.UK before booking the real test.",
    ],
    sections: [
      { heading: "What revision typically covers", body: ["Passenger safety and supervision, vehicle daily walkaround checks, drivers' hours and tachograph basics where relevant, stopping distances when loaded, Highway Code for larger vehicles, accessibility and PSVAR awareness."] },
      { heading: "How candidates usually study", body: ["Combine the DVSA Highway Code with the official LGV/PCV theory learning materials and timed mock papers. Sit the theory test (multiple choice plus hazard perception) at a DVSA centre before progressing to the practical."] },
    ],
    faqs: [
      { q: "Do I need a D1 entitlement to drive a minibus?", a: "It depends on the vehicle weight, seating, whether driving is for hire or reward, and when you passed your car test. Check the current rules on GOV.UK." },
      { q: "Is this the official DVSA test?", a: "No. UK Test Hub is independent. The official D1 theory test is set and run by the DVSA." },
    ],
  },

  // -------- NEW: NHS PSYCHOMETRIC ------------------------------------
  "nhs-psychometric-tests": {
    title: "NHS Psychometric Tests Practice | UK Test Hub",
    description:
      "Practise NHS Psychometric Tests questions online with UK Test Hub. Get free mock tests, instant results and clear answer explanations.",
    tagline: "Independent practice-style questions for NHS recruitment assessments.",
    intro: [
      "Our NHS Psychometric practice covers the kinds of assessments candidates see during NHS recruitment — numerical reasoning, verbal reasoning, situational judgement, logical reasoning and workplace scenario questions.",
      "Questions are independent practice-style only. The exact tests vary by NHS trust, role and supplier (for example SHL, Saville, Talogy). Always check the assessment information in your application invitation.",
    ],
    sections: [
      { heading: "What revision typically covers", body: ["Numerical reasoning with tables and charts, verbal reasoning passages, NHS-style situational judgement scenarios mapped to the NHS People Promise, logical and inductive reasoning patterns, basic accuracy and data checking."] },
      { heading: "How candidates usually prepare", body: ["Practise timed mock papers daily for 1–2 weeks, review every wrong answer, and read the NHS Constitution and NHS Values so situational judgement choices feel natural. The day before, focus on rest, not new questions."] },
    ],
    faqs: [
      { q: "Does every NHS job involve psychometric tests?", a: "No. They're most common for graduate schemes, leadership and some clinical training routes. Your application invitation will tell you exactly which assessments to expect." },
      { q: "Are these the real NHS tests?", a: "No. UK Test Hub is independent and not affiliated with NHS England, NHS Scotland, HSC Northern Ireland or any test supplier. Use these as practice only." },
    ],
  },

  // -------- NEW: ADMISSIONS (GRE / GMAT) -----------------------------
  "gre-practice": {
    title: "GRE Practice Tests | UK Test Hub",
    description:
      "Practise GRE questions online with UK Test Hub. Get free mock tests, instant results and clear answer explanations.",
    tagline: "Independent practice-style questions for GRE preparation.",
    intro: [
      "Our GRE practice covers the kinds of items candidates revise for the GRE General Test — verbal reasoning, quantitative reasoning and analytical writing preparation, including vocabulary, reading comprehension, text completion, maths reasoning and essay planning.",
      "These are independent practice-style questions and are not affiliated with ETS, who own and administer the GRE. Always use official ETS materials for final preparation.",
    ],
    sections: [
      { heading: "What revision typically covers", body: ["Verbal: text completion, sentence equivalence, reading comprehension. Quantitative: arithmetic, algebra, geometry, data interpretation. Analytical writing: analyse an issue and analyse an argument tasks."] },
      { heading: "How candidates usually prepare", body: ["Build a 6–10 week plan, study high-frequency GRE vocabulary, do timed sections under exam conditions, and review every wrong answer in detail. Sit at least two full ETS-published practice tests before test day."] },
    ],
    faqs: [
      { q: "Is the GRE accepted in the UK?", a: "Many UK master's and PhD programmes accept the GRE, especially in business, economics, sciences and engineering. Always check each course's specific entry requirements." },
      { q: "Is UK Test Hub affiliated with ETS?", a: "No. UK Test Hub is independent and not affiliated with ETS, who own and administer the GRE. Our questions are practice-style only." },
    ],
  },
  "gmat-practice": {
    title: "GMAT Practice Tests | UK Test Hub",
    description:
      "Practise GMAT questions online with UK Test Hub. Get free mock tests, instant results and clear answer explanations.",
    tagline: "Independent practice-style questions for GMAT preparation.",
    intro: [
      "Our GMAT practice covers the kinds of items candidates revise for the GMAT Focus Edition — quantitative reasoning, verbal reasoning and data insights, including problem solving, critical reasoning, reading comprehension and data interpretation.",
      "These are independent practice-style questions and are not affiliated with GMAC, who own and administer the GMAT. Always use official GMAC materials for final preparation.",
    ],
    sections: [
      { heading: "What revision typically covers", body: ["Quantitative: problem solving with arithmetic, algebra and word problems. Verbal: reading comprehension and critical reasoning. Data insights: data sufficiency, multi-source reasoning, table analysis, graphics interpretation."] },
      { heading: "How candidates usually prepare", body: ["Build an 8–12 week plan, work through GMAC's Official Guide, do timed sections under exam conditions, and review every wrong answer. Sit at least two GMAC-published mock exams before test day."] },
    ],
    faqs: [
      { q: "Is the GMAT used by UK business schools?", a: "Yes — most UK MBA programmes and many specialist master's in finance, management and analytics accept GMAT scores. Check each programme's specific entry requirements." },
      { q: "Is UK Test Hub affiliated with GMAC?", a: "No. UK Test Hub is independent and not affiliated with GMAC, who own and administer the GMAT. Our questions are practice-style only." },
    ],
  },
  // ------------------------------------------------------------------
  // Phase 1 expansion (Nov 2026) — new practice topics across HGV/LGV,
  // NHS, Construction safety and IT/Tech. Each uses the `generic()`
  // helper for the long-form study guide; the topic page itself reads
  // from this entry for SEO title/description.
  // ------------------------------------------------------------------
  "hgv-theory-test": generic(
    "HGV Theory Test",
    "DVSA",
    "the UK theory test for heavy goods vehicle (LGV category C / C+E) drivers, covering hazard perception, traffic signs, vehicle safety, drivers' hours and load security",
  ),
  "lgv-theory-test": generic(
    "LGV Theory Test",
    "DVSA",
    "the UK theory test for large goods vehicle drivers (category C and C+E), covering Highway Code, hazard perception, drivers' hours, vehicle handling and tachograph rules",
  ),
  "pcv-theory-test": generic(
    "PCV Theory Test",
    "DVSA",
    "the UK theory test for passenger carrying vehicle drivers (categories D and D+E), covering passenger safety, accessibility, Highway Code, hazard perception and drivers' hours",
  ),
  "driver-cpc-module-1": generic(
    "Driver CPC Module 1 Theory Test",
    "DVSA",
    "Module 1 of the Driver Certificate of Professional Competence — the two-part theory test covering multiple-choice questions and hazard perception for LGV and PCV professional drivers",
  ),
  "transport-manager-cpc-passenger-transport": generic(
    "Transport Manager CPC Passenger Transport",
    "OCR / DVSA",
    "the Certificate of Professional Competence for transport managers operating passenger transport (PSV) operations, covering law, financial management, technical standards and road safety",
  ),
  "adr-core-module-practice": generic(
    "ADR Core Module Practice",
    "SQA / DVSA",
    "the Core module of the ADR Driver Training Certificate for transporting dangerous goods by road — general requirements, labelling, documentation, vehicle equipment and emergency action",
  ),
  "adr-tanks-practice": generic(
    "ADR Tanks Practice",
    "SQA / DVSA",
    "the ADR Tanks specialisation for drivers carrying dangerous goods in tank vehicles — tank construction, loading and unloading procedures, surge effects and emergency response",
  ),
  "adr-packages-practice": generic(
    "ADR Packages Practice",
    "SQA / DVSA",
    "the ADR Packages specialisation for drivers transporting dangerous goods in packages — package marking, segregation rules, load security and emergency procedures",
  ),
  "nhs-situational-judgement-test": generic(
    "NHS Situational Judgement Test",
    "the NHS",
    "the NHS Situational Judgement Test used for recruitment into clinical and non-clinical NHS roles — workplace scenarios testing communication, professionalism, teamwork and patient focus",
  ),
  "sssts-practice-test": generic(
    "SSSTS Practice Test",
    "CITB",
    "the Site Supervisors' Safety Training Scheme (SSSTS) — a two-day CITB course for first-line supervisors covering legal duties, risk assessment, method statements, toolbox talks and accident reporting",
  ),
  "smsts-practice-test": generic(
    "SMSTS Practice Test",
    "CITB",
    "the Site Management Safety Training Scheme (SMSTS) — a five-day CITB course for site managers covering CDM 2015, occupational health, working at height, confined spaces and leadership in safety",
  ),
  "aws-cloud-practitioner": generic(
    "AWS Cloud Practitioner Practice",
    "Amazon Web Services",
    "the entry-level AWS Certified Cloud Practitioner (CLF-C02) exam — foundational understanding of AWS cloud concepts, core services, security, architecture, pricing and support",
  ),
  "az-900-azure-fundamentals": generic(
    "AZ-900 Azure Fundamentals",
    "Microsoft",
    "the Microsoft AZ-900 Azure Fundamentals exam — cloud concepts, core Azure services, security, privacy, compliance, Azure pricing and SLAs for non-technical and entry-level candidates",
  ),
  "ucas-application-knowledge": {
    title: "UCAS Application Knowledge Test Guide | UK Test Hub",
    description:
      "Free study guide for the UCAS Application Knowledge Test. Deadlines, course choices, personal statements, references, offers, Clearing, student finance and 45 free mock papers.",
    tagline:
      "Everything you need to know about the UK UCAS application process before you submit.",
    intro: [
      "The UCAS Application Knowledge Test on UK Test Hub is a focused, exam-style way to make sure you understand every stage of the UK university application before you actually click 'submit'. UCAS — the Universities and Colleges Admissions Service — is the central body that processes almost every undergraduate application in the UK, and the rules around deadlines, course limits, personal statements, references and offers are surprisingly easy to get wrong. A single missed date or misunderstood term can cost you your firm choice, push you into Clearing or even invalidate your application altogether.",
      "Each of our 45 mock papers contains 24 multiple-choice questions covering the full UCAS journey: the application timeline, course choices, personal statement rules, references, conditional and unconditional offers, replying via the UCAS Hub, Clearing, deferred entry, Tariff points, admissions tests (UCAT, LNAT, PAT, TMUA, ESAT), tuition fee caps and how Student Finance England, SAAS, Student Finance Wales and Student Finance NI actually work. Every question comes with a written explanation so you finish the mock knowing not just the right answer, but the reasoning behind it.",
    ],
    sections: [
      {
        heading: "What the UCAS Application Knowledge Test covers",
        body: [
          "The questions in this practice test mirror the kind of knowledge real applicants need: the UCAS application opens in May for the following autumn cycle, and you can begin submitting from early September. The headline deadlines are 15 October (Oxford, Cambridge and most medicine, dentistry and veterinary courses) and 29 January at 18:00 UK time (the equal-consideration deadline for almost every other course). After 30 June, your application automatically rolls into Clearing.",
          "You can list up to five course choices on a standard application, with a maximum of four in medicine, dentistry or veterinary medicine/science. A single application fee covers all five choices, you can apply to multiple courses at the same university, but you generally cannot apply to both Oxford and Cambridge in the same cycle. These specific numbers, dates and limits make up around a quarter of the questions in our mocks, because admissions tutors expect you to know them cold.",
        ],
      },
      {
        heading: "Personal statement, reference and predicted grades",
        body: [
          "The personal statement is capped at 4,000 characters or 47 lines, whichever comes first. It is sent in identical form to every university you apply to, which is why generic statements rarely impress — admissions tutors at competitive courses read tens of thousands and can spot a template at a glance. UCAS has begun rolling out a structured set of questions in place of one open essay for some cycles, so always check the format for the year you are applying in.",
          "Most school-leavers receive one reference from a teacher or tutor; independent applicants arrange their own from a professional who knows their academic ability or character — never a family member or friend. References usually include predicted grades, and even an unconditional offer doesn't make your final grades irrelevant: scholarships, alternative courses, postgraduate study and graduate employers all still care about what you actually achieved.",
          "UCAS uses similarity-detection software on every personal statement. If it flags excessive overlap with another applicant or with AI-generated content, your chosen universities are notified — and that can sink an otherwise strong application. Write in your own words about your motivation, relevant reading, work or volunteering experience and the skills that make you ready for degree-level study.",
        ],
      },
      {
        heading: "Offers, replies and the firm / insurance system",
        body: [
          "Once your decisions are in, you reply through the UCAS Hub. You can hold at most one firm choice (the one you most want) and one insurance choice (a backup with lower entry requirements). Everything else is declined. UCAS sets a reply deadline once all your decisions arrive — miss it and the system declines your offers automatically.",
          "A conditional offer depends on meeting specific exam results; an unconditional offer doesn't. If you meet your firm conditions on results day, that place is confirmed; if you miss them but meet your insurance, you go to your insurance. Miss both and you enter Clearing — the matching service that pairs applicants without a place to courses with vacancies. Clearing runs from early July until mid-October.",
          "UCAS Extra is a separate service that lets you add one more course at a time, free of charge, if you have used all five choices and are not holding any offers. It runs in the spring between the January deadline and Clearing.",
        ],
      },
      {
        heading: "Tariff points, admissions tests and qualifications",
        body: [
          "The UCAS Tariff converts qualifications into points so universities can compare candidates across different exam systems. An A-level A* is worth 56 points, an A is 48, a B is 40 and so on. BTECs, T Levels, Scottish Highers, the International Baccalaureate, the Extended Project Qualification (EPQ) and Access to HE Diplomas all carry Tariff points, though not every university uses the Tariff — many list grade-specific entry requirements instead.",
          "Selective courses add admissions tests on top. Most UK medical schools require the UCAT (University Clinical Aptitude Test). Several leading law schools require the LNAT (Law National Aptitude Test). Oxford Physics uses the PAT. Cambridge has moved a number of subjects to the TMUA and ESAT. International applicants from non-English-speaking backgrounds almost always need IELTS, TOEFL or an equivalent and a UK Student visa (formerly Tier 4) supported by a CAS (Confirmation of Acceptance for Studies) issued by their university.",
        ],
      },
      {
        heading: "Fees, finance and the wider application",
        body: [
          "For English-domiciled home students, tuition is currently capped at around £9,250 per year. Student Finance England provides Tuition Fee Loans paid directly to the university and means-tested Maintenance Loans for living costs, with higher amounts available for students studying in London or living away from the parental home. Repayments only begin in the April after you graduate, once your income passes the threshold for your loan plan.",
          "Scottish students use SAAS (Student Awards Agency Scotland), Welsh students Student Finance Wales, and Northern Irish students Student Finance NI. International student fees are not capped and are set by individual universities.",
          "Other practical details often missed: the UCAS Hub is where you do everything (apply, track decisions, accept/decline offers); the 'buzzword' links your application to your school or college so the reference attaches correctly; care-experienced and disabled applicants can declare their status to access targeted support, including Disabled Students' Allowance (DSA); and offer holder days let you visit campus once you have an offer to help you decide between your firm and insurance.",
        ],
      },
      {
        heading: "How to use these mocks to prepare",
        body: [
          "Treat the first mock as a baseline — score yourself honestly, then read every explanation before moving on. Most candidates lose marks on three areas: exact deadline dates, the difference between firm/insurance/Clearing/Extra, and the rules around personal statements and similarity detection. If those topics come up wrong, target them with two more mocks before tackling something new.",
          "Aim to complete five to ten mocks before you start drafting your real UCAS application. By the time you open the UCAS Hub for real, the terminology should feel familiar, the timeline should be second nature, and you should be focused entirely on writing the strongest possible personal statement and choosing the right five courses — not on figuring out what 'deferred entry', 'CAS' or 'Adjustment' means.",
        ],
      },
    ],
    faqs: [
      { q: "How many course choices can I make on UCAS?", a: "Up to five on a standard Undergraduate application, with a maximum of four in medicine, dentistry, veterinary medicine or veterinary science." },
      { q: "What is the main UCAS deadline?", a: "29 January at 18:00 UK time for most courses (the equal-consideration deadline). 15 October applies to Oxford, Cambridge and most medicine, dentistry and veterinary courses." },
      { q: "Can I apply to both Oxford and Cambridge?", a: "Generally no — in the same UCAS cycle you can apply to one or the other, with very limited exceptions (e.g. organ scholarships)." },
      { q: "How long can the personal statement be?", a: "Up to 4,000 characters or 47 lines, whichever comes first. It is sent in identical form to every university you apply to." },
      { q: "What is Clearing?", a: "A UCAS matching service that runs from early July to mid-October. It connects applicants without a place to courses with vacancies." },
      { q: "What is the difference between a firm and insurance choice?", a: "Your firm is your first-choice offer that you want most. Your insurance is a backup, usually with lower entry requirements, in case you miss your firm's conditions." },
      { q: "Is UK Test Hub affiliated with UCAS?", a: "No. UK Test Hub is independent. UCAS is a registered trademark of the Universities and Colleges Admissions Service. Our practice questions are not official UCAS materials." },
    ],
  },
  "workplace-health-safety-awareness": {
    title: "Workplace Health & Safety Awareness Test Guide | UK Test Hub",
    description:
      "Free study guide for the UK Workplace Health & Safety Awareness Test. HSWA 1974, risk assessment, RIDDOR, COSHH, PPE, manual handling, fire safety and 45 mock papers.",
    tagline:
      "Everything you need to know about UK workplace health and safety before you sit the test.",
    intro: [
      "A Workplace Health & Safety Awareness Test is the entry-level competency check most UK employers expect every new starter to pass — from offices and warehouses to construction sites, care homes and hospitality kitchens. It demonstrates that you understand the core legal framework set by the Health and Safety at Work etc. Act 1974, that you can recognise hazards and risks, and that you know what to do when something goes wrong. Passing it is rarely about memorising obscure detail; it is about showing that you genuinely think safely.",
      "Each of our 45 free mock papers contains 24 multiple-choice questions drawn from the same syllabus that NEBOSH, IOSH, CITB, RoSPA and most online H&S awareness providers use. You will cover the Health and Safety at Work Act 1974, the Management of Health and Safety at Work Regulations 1999, RIDDOR, COSHH, PUWER, LOLER, manual handling, work at height, DSE, PPE, fire safety, first aid, asbestos, noise, vibration, electrical safety, confined spaces, lone working, workplace transport and the duties placed on employers, employees, contractors and the self-employed.",
    ],
    sections: [
      {
        heading: "The legal foundation: HSWA 1974 and key regulations",
        body: [
          "The Health and Safety at Work etc. Act 1974 (HSWA) is the umbrella piece of UK legislation that sits above almost every other H&S regulation. Section 2 places a duty on employers to ensure, so far as is reasonably practicable, the health, safety and welfare of their employees. Section 3 extends that duty to people who are not employees but might be affected — visitors, contractors, the public. Section 7 places a duty on every employee to take reasonable care for their own safety and that of others, and to cooperate with their employer. Both employers and employees can be prosecuted personally for serious breaches.",
          "Underneath HSWA sit the regulations you will see again and again on the test: MHSWR 1999 (the management regulations that require risk assessment and competent persons), PUWER 1998 (work equipment), LOLER 1998 (lifting), the Manual Handling Operations Regulations 1992, the Work at Height Regulations 2005, COSHH 2002 (hazardous substances), RIDDOR 2013 (reporting), the Control of Noise at Work Regulations 2005, the Control of Vibration at Work Regulations 2005, the Regulatory Reform (Fire Safety) Order 2005 and the Health and Safety (First-Aid) Regulations 1981. You don't need to recite every section, but you should recognise what each one covers.",
        ],
      },
      {
        heading: "Hazards, risks and the hierarchy of control",
        body: [
          "A hazard is anything with the potential to cause harm — a trailing cable, a hot oven, a heavy box, a noisy machine, a flammable solvent. A risk is the likelihood that someone will actually be harmed combined with how serious the harm could be. A wet floor is a hazard; the risk depends on whether anyone walks across it, whether the area is signed, and whether they are carrying something or moving fast. Getting this distinction right is one of the most-tested concepts on the paper.",
          "The HSE risk-assessment model has five steps: identify the hazards, decide who could be harmed and how, evaluate the risks and decide on controls, record the findings and implement them, and review when things change. Controls should be applied in order of effectiveness — the hierarchy of control. Eliminate the hazard if you can, substitute it with something safer, engineer controls (guards, extraction), put administrative controls in place (training, signs, safe systems of work) and only then rely on PPE. PPE is the last line of defence, not the first, and it must be provided free of charge by the employer.",
        ],
      },
      {
        heading: "Manual handling, work at height and DSE",
        body: [
          "The Manual Handling Operations Regulations 1992 follow a simple three-step approach: avoid the task if reasonably practicable, assess what cannot be avoided, then reduce the risk to the lowest reasonably practicable level. Lower-back injuries are the most common manual handling outcome, so technique matters: stable stance, bent knees, straight back, load close to the body, no twisting.",
          "The Work at Height Regulations 2005 use the same logic — avoid, prevent, minimise. Falls from height remain one of the biggest causes of workplace fatalities, so any work above ground level needs planning, supervision and the right equipment. The DSE Regulations 1992 cover habitual computer users: short, frequent breaks away from the screen, suitable workstations and free eye tests on request.",
        ],
      },
      {
        heading: "Fire safety, first aid and emergency response",
        body: [
          "Fire needs three things — heat, fuel and oxygen — and removing any one will put it out. Different fires need different extinguishers: water on Class A solids, foam on flammable liquids, CO2 on electrical equipment, and wet chemical on cooking oils and fats. If you discover a fire, raise the alarm first, evacuate by the nearest safe exit, never use the lifts, and assemble at the designated point. Only tackle a small fire if you are trained, it is safe, and your escape is clear.",
          "First aid arrangements are set by a workplace-specific needs assessment under the Health and Safety (First-Aid) Regulations 1981 — there is no fixed number of first aiders mandated by law. A standard first-aid kit contains plasters, sterile dressings, eye pads and disposable gloves but no medication. Adult CPR is delivered at 100 to 120 compressions per minute, an AED should be used as soon as available, and the recovery position is for an unconscious casualty who is still breathing normally. For anything life-threatening, dial 999 or 112 immediately.",
        ],
      },
      {
        heading: "Reporting, signs and the role of the HSE",
        body: [
          "RIDDOR 2013 — the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations — requires specified injuries (such as fractures other than to fingers, thumbs or toes), over-7-day absences, dangerous occurrences and certain work-related diseases to be reported to the HSE without delay. The accident book records workplace injuries and, because the entries contain personal data, completed pages must be removed and stored securely under UK data protection law. Near misses — events that could have caused harm but didn't — should also be reported because they are a free early warning.",
          "Safety signs follow a consistent visual language across the UK. Red circles with a diagonal bar mean prohibition (you must not). Blue circles mean mandatory (you must). Yellow triangles mean warning (be careful). Green rectangles mean safe condition (this way out, first aid here). The GHS / CLP pictograms on chemicals — flame, exclamation mark, skull, corrosion, health hazard — extend the same idea to substances.",
          "The Health and Safety Executive (HSE) is the main GB regulator. Inspectors can enter premises without notice, take samples and require information. They can issue improvement notices, which set a deadline to fix a breach, or prohibition notices, which stop an activity immediately because it carries a risk of serious personal injury. Serious cases can lead to prosecution, unlimited fines and prison sentences for individuals.",
        ],
      },
      {
        heading: "How to pass the test first time",
        body: [
          "Start with one mock to see where you stand, then read every explanation — that is where the real learning happens. Pay particular attention to the things candidates routinely confuse: hazard vs risk, the order of the hierarchy of control, the difference between an improvement notice and a prohibition notice, who pays for PPE (always the employer), and which extinguisher goes on which fire. Two or three short sessions a week beats one long cram, and a final timed mock the day before the real test will confirm your pacing.",
          "Above all, remember the message that runs through every UK H&S syllabus: health and safety is a shared responsibility. Employers must plan, assess and control. Employees must take reasonable care, cooperate, follow the safe system of work and report problems. Stop and ask if you don't know how to do a task safely — section 7 of HSWA explicitly requires it, and 'I wasn't sure' is never an acceptable answer after an accident.",
        ],
      },
    ],
    faqs: [
      { q: "Which Act is the foundation of UK workplace health and safety law?", a: "The Health and Safety at Work etc. Act 1974 (HSWA) is the primary legislation; almost every other regulation sits underneath it." },
      { q: "Who is responsible for workplace health and safety?", a: "Everyone. Employers have the primary duty under HSWA section 2 and section 3, but section 7 also requires employees to take reasonable care and cooperate." },
      { q: "What does RIDDOR cover?", a: "Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013 — specified injuries, over-7-day absences, certain work-related diseases and dangerous occurrences must be reported to HSE." },
      { q: "Who pays for PPE at work?", a: "The employer, free of charge, under the PPE at Work Regulations 1992. PPE is the last line of defence in the hierarchy of control, not the first." },
      { q: "What is the pass mark for the test?", a: "It varies by provider — most workplace H&S awareness tests use a pass mark of around 70 to 80 percent. Check with whoever is administering your sitting." },
      { q: "Is UK Test Hub an accredited H&S training provider?", a: "No. UK Test Hub is an independent practice site. For accredited certificates, sit a course with an awarding body such as NEBOSH, IOSH, CITB or RoSPA. Our mocks are designed to help you prepare." },
    ],
  },
};

export const getTopicSeo = (slug: string): TopicSeo | undefined =>
  topicSeo[slug];
