import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import heroDriving from "@/assets/cat-hero-driving.jpg";
import heroCitizenship from "@/assets/cat-hero-citizenship.jpg";
import heroEnglish from "@/assets/cat-hero-english.jpg";
import heroEducation from "@/assets/cat-hero-education.jpg";
import heroCareer from "@/assets/cat-hero-career.jpg";
import heroProfessional from "@/assets/cat-hero-professional.jpg";
import heroNhs from "@/assets/cat-hero-nhs.jpg";
import heroFun from "@/assets/cat-hero-fun.jpg";

export type BlogPost = {
  slug: string;
  title: string;
  description: string; // 150-160 chars
  excerpt: string;
  datePublished: string; // ISO
  dateModified?: string;
  author: string;
  readingMinutes: number;
  category: string;
  tags: string[];
  hero: string;
  // Render function so we can include typed <Link> components.
  body: () => ReactNode;
};

// Small helpers for inline links to category/topic/blog routes.
const C = ({ slug, children }: { slug: string; children: ReactNode }) => (
  <Link to="/category/$slug" params={{ slug }} className="font-semibold text-coral hover:underline">
    {children}
  </Link>
);
const T = ({ slug, children }: { slug: string; children: ReactNode }) => (
  <Link to="/topic/$slug" params={{ slug }} className="font-semibold text-coral hover:underline">
    {children}
  </Link>
);
const B = ({ slug, children }: { slug: string; children: ReactNode }) => (
  <Link to="/blog/$slug" params={{ slug }} className="font-semibold text-coral hover:underline">
    {children}
  </Link>
);

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-pass-driving-theory-test",
    title: "How to Pass the UK Driving Theory Test First Time (2026 Guide)",
    description:
      "A step-by-step 2026 guide to passing the UK Driving Theory Test first time, with revision tips, hazard perception advice and free mock tests.",
    excerpt:
      "Most learners who fail the UK Driving Theory Test fail by 1 or 2 marks. Here's how to make sure you're not one of them.",
    datePublished: "2026-01-12",
    author: "UK Test Hub Team",
    readingMinutes: 9,
    category: "Driving",
    tags: ["driving theory", "DVSA", "hazard perception"],
    hero: heroDriving,
    body: () => (
      <>
        <p>
          The UK Driving Theory Test sounds simple — 50 multiple-choice questions and a video clip exercise — but the
          DVSA's own statistics show only around 50% of candidates pass on their first attempt. The difference
          between pass and fail is rarely knowledge; it's preparation. This guide walks you through every part of
          the exam and shows exactly how to prepare for each one.
        </p>

        <h2>What's actually in the UK Driving Theory Test?</h2>
        <p>
          The test has two sections you must pass at the same sitting. First is the multiple-choice section: 50
          questions in 57 minutes, drawn from a bank covering 14 topics including alertness, attitude, safety
          margins, vulnerable road users and the rules of the road. The pass mark is 43 out of 50.
        </p>
        <p>
          Second is hazard perception. You'll watch 14 video clips containing 15 developing hazards and click your
          mouse (or tap a button on the touchscreen) the moment you see each hazard begin to develop. The pass
          mark here is 44 out of 75.
        </p>

        <h2>Step 1: Read the Highway Code from cover to cover</h2>
        <p>
          The single biggest mistake learners make is treating the Highway Code as a reference book. Read it
          straight through — yes, all of it — at least once. Then read it again, focusing on the rules you found
          surprising. Almost every multiple-choice question is testing a specific Highway Code rule.
        </p>

        <h2>Step 2: Practise multi-choice mocks under exam conditions</h2>
        <p>
          Once you've read the Highway Code, take your first{" "}
          <T slug="driving-theory">Driving Theory mock test</T>. Do it in one sitting, with a timer, and don't
          look anything up. Mark it, read every explanation — including for the questions you got right by
          guessing — and write down the rules you didn't know.
        </p>
        <p>
          Repeat with a fresh mock every 1–2 days. By mock 5 you should be scoring 43 or better; by mock 10 you
          should be hitting 47 or better. If you're not, slow down and revise the topics where you keep losing
          marks.
        </p>

        <h2>Step 3: Don't ignore hazard perception</h2>
        <p>
          More learners pass the multiple-choice and fail hazard perception than the other way around. The skill
          is unique to this test and you cannot ace it without practice. Watch the official DVSA sample clips, then
          rehearse with{" "}
          <T slug="hazard-perception">our Hazard Perception practice tests</T>. Click once when you first spot the
          developing hazard, and a second time as it becomes more serious. Don't click rapidly or in a pattern —
          the system will flag you and zero the clip.
        </p>

        <h2>Step 4: Master the road signs</h2>
        <p>
          UK road signs follow a colour and shape system: red triangles warn, red circles prohibit, blue circles
          give a positive instruction, blue rectangles give information on motorways, and green rectangles give
          information on primary routes. Learn this taxonomy first, then drill the specifics with our{" "}
          <T slug="road-signs">Road Signs practice tests</T>.
        </p>

        <h2>Step 5: On test day</h2>
        <ul>
          <li>Arrive 15–20 minutes early. Late arrivals lose their fee.</li>
          <li>Bring your provisional licence — without it you cannot sit the test.</li>
          <li>Read every multiple-choice question twice. The DVSA loves the words "should" and "must".</li>
          <li>Flag any question you're not sure about and come back to it — never leave a blank.</li>
          <li>For hazard perception, sit forward, breathe normally and don't blink during clips.</li>
        </ul>

        <h2>Common reasons learners fail (and how to avoid them)</h2>
        <p>
          The most common cause of failure is rushing the multiple-choice section. Many candidates finish in 25 of
          their 57 minutes, hand in early, and discover they misread two or three questions. Use all the time the
          DVSA gives you — flag, review, and only submit when you've checked every flagged question.
        </p>
        <p>
          The second most common cause is hazard perception inexperience. The format is genuinely odd, and your
          first time should not be at the test centre.
        </p>

        <h2>How long should I revise?</h2>
        <p>
          Most learners need 20–30 hours spread over 3–6 weeks. That's roughly an hour a day for a month. Cramming
          the night before tends to backfire because hazard perception relies on calm focus, not memorised facts.
        </p>

        <h2>What about the practical test?</h2>
        <p>
          A theory pass certificate is valid for two years. Use that window to take lessons consistently and book
          your practical as soon as your instructor says you're ready. If you let the certificate expire, you'll
          have to retake the theory before you can sit the practical.
        </p>

        <h2>Start practising now</h2>
        <p>
          You can find every test mentioned in this guide on the{" "}
          <C slug="driving">UK Driving & Transport practice hub</C>. Every mock is free, scored instantly and
          comes with full explanations. Good luck — and remember, the people who pass first time are usually the
          ones who treat the theory test with the same seriousness as the practical.
        </p>
      </>
    ),
  },

  {
    slug: "life-in-the-uk-test-guide",
    title: "The Life in the UK Test: Complete 2026 Guide & Free Practice",
    description:
      "Everything you need to pass the Life in the UK Test in 2026: handbook chapters, key dates, exam format, booking, and free Life in the UK practice tests.",
    excerpt:
      "Sitting the Life in the UK Test for ILR or citizenship? Here's the full handbook breakdown plus the dates and facts that come up most.",
    datePublished: "2026-01-18",
    author: "UK Test Hub Team",
    readingMinutes: 11,
    category: "Citizenship",
    tags: ["life in the uk", "citizenship", "ILR"],
    hero: heroCitizenship,
    body: () => (
      <>
        <p>
          The Life in the UK Test is the gateway exam for both Indefinite Leave to Remain (ILR) and British
          citizenship. It's a 24-question, 45-minute computer-based test, sat at one of around 30 approved centres
          in the UK. The pass mark is 75% — at least 18 correct answers.
        </p>

        <h2>What is the Life in the UK Test?</h2>
        <p>
          The Home Office launched the test in 2005 to ensure new permanent residents have a basic understanding of
          British history, values, government and traditions. Every question is drawn directly from the official
          handbook, <em>Life in the United Kingdom: A Guide for New Residents</em>. No outside knowledge is
          required and no outside knowledge will help.
        </p>

        <h2>The five chapters you must know</h2>
        <ol>
          <li><strong>The values and principles of the UK</strong> — democracy, the rule of law, individual liberty, tolerance, and respect.</li>
          <li><strong>What is the UK</strong> — the four nations, capital cities, devolution, currency, and population.</li>
          <li><strong>A long and illustrious history</strong> — from Stone Age Britain to the present day.</li>
          <li><strong>A modern, thriving society</strong> — culture, sports, leisure, religion, and notable Britons.</li>
          <li><strong>The UK government, the law and your role</strong> — Parliament, the courts, voting, and civic responsibility.</li>
        </ol>

        <h2>Dates that come up most often</h2>
        <ul>
          <li><strong>43 AD</strong> — Roman invasion of Britain.</li>
          <li><strong>1066</strong> — Battle of Hastings; Norman conquest.</li>
          <li><strong>1215</strong> — Magna Carta signed at Runnymede.</li>
          <li><strong>1534</strong> — Act of Supremacy; Henry VIII becomes head of the Church of England.</li>
          <li><strong>1707</strong> — Act of Union joins England, Wales and Scotland.</li>
          <li><strong>1801</strong> — Ireland joined; United Kingdom of Great Britain and Ireland formed.</li>
          <li><strong>1832</strong> — Reform Act expands the vote.</li>
          <li><strong>1928</strong> — Equal voting rights for women aged 21+.</li>
          <li><strong>1948</strong> — NHS founded; Empire Windrush arrives.</li>
          <li><strong>1973</strong> — UK joins the European Economic Community.</li>
          <li><strong>2020</strong> — UK formally leaves the European Union.</li>
        </ul>

        <h2>Tips to pass first time</h2>
        <p>
          Read the official handbook end-to-end at least twice. After the first read, take a{" "}
          <T slug="life-in-the-uk">Life in the UK practice test</T> to find your weak chapters. Re-read those
          chapters, then take another mock. Repeat until you're consistently scoring 22 or higher out of 24.
        </p>
        <p>
          Make a one-page timeline of UK monarchs from William the Conqueror onwards. Spending 20 minutes on this
          will save you hours of confusion when revising the history chapter.
        </p>
        <p>
          Don't waste time memorising trivia that isn't in the handbook. Strategy beats memorisation: focus on
          what the handbook actually emphasises (the values, the institutions, the dates above) rather than every
          minor cultural reference.
        </p>

        <h2>Booking and on the day</h2>
        <p>
          Book through gov.uk only — never through third-party sites. The fee is £50. You'll need two pieces of
          ID: one with a photo (passport, BRP or driving licence) and one with your current address (utility bill
          or bank statement, less than three months old). Arrive 30 minutes early.
        </p>

        <h2>What if I fail?</h2>
        <p>
          You can retake as many times as you need. Each retake costs £50 and you must wait at least seven days
          between attempts. If you fail, the centre tells you which chapters you struggled with — focus your
          re-revision there.
        </p>

        <h2>After the pass</h2>
        <p>
          Your pass certificate is valid indefinitely. You can use it for ILR and later for citizenship without
          retaking. For citizenship you'll also need to demonstrate English at CEFR B1 — usually with an approved
          English test or a degree taught in English.
        </p>

        <h2>Start practising</h2>
        <p>
          Visit the <C slug="citizenship">UK Citizenship & Life practice hub</C> for unlimited free Life in the UK
          mock tests, plus quizzes on UK laws, geography and citizenship rights. If you're also working on your
          English, our <B slug="ielts-tips-for-beginners">IELTS guide</B> covers the most popular B1 route.
        </p>
      </>
    ),
  },

  {
    slug: "top-uk-road-signs-explained",
    title: "Top UK Road Signs Explained (With Free Practice Test)",
    description:
      "Learn the UK road signs system: warning, regulatory, information and direction signs. Decode shapes and colours, plus free road signs practice tests.",
    excerpt:
      "UK road signs aren't random — they follow a strict shape and colour system. Learn the rules and you'll never confuse them again.",
    datePublished: "2026-01-22",
    author: "UK Test Hub Team",
    readingMinutes: 8,
    category: "Driving",
    tags: ["road signs", "highway code", "driving theory"],
    hero: heroDriving,
    body: () => (
      <>
        <p>
          UK road signs look daunting at first — there are over 200 in the official Highway Code — but they all
          follow a consistent system. Once you understand the shape and colour rules, you can correctly interpret
          a sign you've never seen before.
        </p>

        <h2>The four sign families</h2>
        <ul>
          <li><strong>Warning signs</strong> — usually red triangles with black symbols on a white background. They alert you to hazards ahead.</li>
          <li><strong>Regulatory signs</strong> — circles. Red circles prohibit (no entry, no overtaking, speed limits). Blue circles give a positive instruction (turn left, keep right).</li>
          <li><strong>Information signs</strong> — rectangles. Blue on motorways, green on primary routes, white on minor routes, brown for tourist information.</li>
          <li><strong>Direction signs</strong> — also rectangles. Same colour code as information signs.</li>
        </ul>

        <h2>Warning signs you must know</h2>
        <p>Red triangle, point upwards. Common ones:</p>
        <ul>
          <li>T-junction ahead (a vertical line meeting a horizontal one)</li>
          <li>Roundabout ahead (three curved arrows)</li>
          <li>Steep hill (a slope with a percentage)</li>
          <li>Two-way traffic (two arrows pointing in opposite directions)</li>
          <li>Slippery road (a car with curved skid marks)</li>
        </ul>
        <p>
          Two notable exceptions: the <strong>Stop</strong> sign is a red octagon (the only octagonal sign in the
          UK) and the <strong>Give Way</strong> sign is an inverted red triangle. Both signal junctions and you
          must obey them precisely.
        </p>

        <h2>Regulatory signs you must know</h2>
        <p>
          A red circle with a number is a maximum speed limit. A blue circle with a number is a minimum speed
          limit. A red circle with a single diagonal line says no overtaking. A red circle with a black motorbike
          says no motorcycles. The pattern is consistent: red circle = "do not", blue circle = "you must".
        </p>

        <h2>Motorway and primary route signs</h2>
        <p>
          Blue rectangular signs appear on motorways and motorway slip roads. Green rectangular signs appear on
          primary A-roads. White signs appear on minor roads. If you see a sign with a brown background and a
          symbol (a castle, a steam train), it's pointing to a tourist attraction.
        </p>

        <h2>Road markings count too</h2>
        <p>
          A double white line with the solid line on your side means no overtaking. A single broken white line
          marks a normal lane. Yellow zig-zags mean no stopping (usually outside schools). Red routes (single or
          double red lines) appear in central London and mean no stopping at any time.
        </p>

        <h2>How signs are tested in the theory exam</h2>
        <p>
          The DVSA Driving Theory Test contains around 5–8 sign questions out of 50, and a similar proportion in
          the Motorcycle Theory Test. Questions either show you the sign and ask its meaning, or describe a
          situation and ask which sign you'd see. Either way, knowing the family system makes them easy.
        </p>

        <h2>Practise with our free road signs tests</h2>
        <p>
          The fastest way to lock in road sign knowledge is rapid-fire repetition. Try our{" "}
          <T slug="road-signs">free Road Signs practice tests</T>. Each mock is 24 questions and takes about 10
          minutes — perfect for your morning commute or coffee break. For full theory exam practice, head to the{" "}
          <C slug="driving">Driving & Transport hub</C>.
        </p>

        <h2>Final tips</h2>
        <p>
          Don't memorise signs in isolation. When you next walk or drive somewhere, name every sign you pass.
          Real-world reps build pattern recognition far faster than flashcards. By the time you sit your theory
          test, the signs should feel familiar — not like a quiz.
        </p>
      </>
    ),
  },

  {
    slug: "ielts-tips-for-beginners",
    title: "IELTS Tips for Beginners: How to Reach Band 6.5 in 2026",
    description:
      "A complete IELTS guide for beginners: format, scoring, study plan, plus practical Listening, Reading, Writing and Speaking tips to reach Band 6.5.",
    excerpt:
      "New to IELTS? Here's how to go from your first practice test to a confident Band 6.5 in 8–12 weeks.",
    datePublished: "2026-01-25",
    author: "UK Test Hub Team",
    readingMinutes: 12,
    category: "English",
    tags: ["IELTS", "english", "language learning"],
    hero: heroEnglish,
    body: () => (
      <>
        <p>
          IELTS — the International English Language Testing System — is the most widely accepted English test for
          UK university and visa purposes. Most undergraduate degrees require Band 6.5 overall with no skill below
          6.0. This guide walks beginners through the format, scoring, and the practice habits that actually move
          your band score up.
        </p>

        <h2>The two versions of IELTS</h2>
        <p>
          <strong>IELTS Academic</strong> is for university entry and professional registration. <strong>IELTS
          General Training</strong> is for UK work visas, immigration and secondary school applications. The
          Listening and Speaking modules are identical; the Reading and Writing modules differ.
        </p>

        <h2>How IELTS is scored</h2>
        <p>
          Each of the four skills (Listening, Reading, Writing, Speaking) is graded on a 0–9 band scale. Your
          overall score is the average of the four, rounded to the nearest 0.5. So 6, 6, 6.5 and 7 averages 6.375
          and rounds up to 6.5.
        </p>

        <h2>Listening (30 minutes + 10 to transfer answers)</h2>
        <p>
          Four sections, 40 questions, each recording played once. The recordings get progressively harder. To
          improve fast:
        </p>
        <ul>
          <li>Listen to BBC Radio 4 podcasts daily — same accent and register as IELTS.</li>
          <li>Practise predicting answers from context before they're spoken.</li>
          <li>Watch your spelling — wrong spelling is wrong, even if you heard it correctly.</li>
        </ul>

        <h2>Reading (60 minutes, 40 questions)</h2>
        <p>
          Three long passages in Academic, or three sections in General Training. Time pressure is the biggest
          challenge — you have 90 seconds per question, and you need 30+ correct for Band 7.
        </p>
        <ul>
          <li>Skim each passage in 2–3 minutes before answering.</li>
          <li>Don't read every word — IELTS rewards speed and scanning.</li>
          <li>For True/False/Not Given, only use information from the passage.</li>
        </ul>

        <h2>Writing (60 minutes, two tasks)</h2>
        <p>
          Task 1 (20 minutes) is a chart, graph or letter (Academic vs General). Task 2 (40 minutes) is an essay.
          Task 2 is worth twice as much, so always do it second only if you've left enough time.
        </p>
        <ul>
          <li>Memorise 5 reusable Task 2 structures so you don't waste planning time.</li>
          <li>Aim for 280 words on Task 2 (the minimum is 250 — going under loses marks).</li>
          <li>Use a wide range of grammar — conditionals, passives, modal verbs.</li>
          <li>Don't memorise model essays. Examiners spot them and dock you for it.</li>
        </ul>

        <h2>Speaking (11–14 minutes, three parts)</h2>
        <p>
          Part 1 is a friendly chat, Part 2 is a 1–2 minute monologue with 1 minute prep, Part 3 is a discussion
          on abstract themes from Part 2.
        </p>
        <ul>
          <li>Speak at length — short answers cap your fluency band.</li>
          <li>Use linking phrases ("on the other hand", "what's more", "in contrast").</li>
          <li>It's fine to say "let me think for a second" — it's natural English.</li>
          <li>Record yourself and listen back. You'll hear fillers you don't notice live.</li>
        </ul>

        <h2>An 8-week study plan</h2>
        <p>
          Weeks 1–2: take a diagnostic mock to find your weakest skill. Read about IELTS scoring criteria and
          listen to 30 minutes of English daily.
        </p>
        <p>
          Weeks 3–5: drill your weakest skill 4 days a week, with one full mock test on Saturdays.
        </p>
        <p>
          Weeks 6–7: alternate full mocks with focused weak-skill work. Get one piece of writing graded by an
          expert — feedback you can't give yourself is gold.
        </p>
        <p>
          Week 8: taper. Two full mocks, light review, lots of sleep. Don't try to learn anything new in the final
          three days.
        </p>

        <h2>How long is IELTS valid?</h2>
        <p>
          Two years from your test date. Most UK visa categories require an in-date certificate at the point of
          application.
        </p>

        <h2>Start practising for free</h2>
        <p>
          Take a free <T slug="ielts">IELTS practice test</T> right now to get your baseline. Or, if you need a
          different exam, the <C slug="english">English Language Tests hub</C> covers TOEFL, ESOL and grammar
          drills too. Pair this with our <B slug="how-to-study-for-exams-fast">study tips guide</B> for a complete
          plan.
        </p>
      </>
    ),
  },

  {
    slug: "gcse-maths-revision-guide",
    title: "GCSE Maths Revision Guide 2026: Topics, Tips & Free Mocks",
    description:
      "Complete GCSE Maths revision guide for 2026: foundation vs higher tier, key topics, exam technique and free GCSE Maths practice papers.",
    excerpt:
      "Aiming for a grade 7 or above in GCSE Maths? Here's the topic checklist, exam strategy and practice plan that work.",
    datePublished: "2026-02-02",
    author: "UK Test Hub Team",
    readingMinutes: 10,
    category: "Education",
    tags: ["GCSE", "maths", "revision"],
    hero: heroEducation,
    body: () => (
      <>
        <p>
          GCSE Maths is the only subject most pupils have to retake until they pass at grade 4 — which is exactly
          why the pressure feels so high. The good news: the syllabus is finite, the exam style is predictable,
          and consistent practice reliably moves grades up. Here's the playbook.
        </p>

        <h2>Foundation tier vs higher tier</h2>
        <p>
          Foundation tier covers grades 1–5. Higher tier covers grades 4–9. You sit one or the other, not both.
          Foundation is appropriate if you're confidently aiming for a 4 or 5; higher is essential if you want a
          grade 7, 8 or 9 (no foundation paper can award above a 5).
        </p>

        <h2>The six syllabus areas (AQA, Edexcel, OCR — all the same)</h2>
        <ol>
          <li><strong>Number</strong> — fractions, decimals, percentages, standard form, surds.</li>
          <li><strong>Algebra</strong> — linear and quadratic equations, sequences, simultaneous equations, graphs.</li>
          <li><strong>Ratio, proportion and rates of change</strong> — direct and inverse proportion, growth, compound interest.</li>
          <li><strong>Geometry and measures</strong> — angle rules, Pythagoras, trigonometry, area, volume.</li>
          <li><strong>Probability</strong> — tree diagrams, mutually exclusive events, conditional probability.</li>
          <li><strong>Statistics</strong> — averages, scatter graphs, cumulative frequency, box plots.</li>
        </ol>

        <h2>Higher tier topics that gatekeep grade 7+</h2>
        <p>
          If you can't do these confidently, grade 7 is out of reach: completing the square, the quadratic formula,
          algebraic fractions, vectors, circle theorems, sine and cosine rule, and proof by counter-example. Drill
          these specifically before broader revision.
        </p>

        <h2>The exam structure</h2>
        <p>
          Three papers, each 1 hour 30 minutes, each worth 80 marks. Paper 1 is non-calculator; Papers 2 and 3 are
          calculator. The total is 240 marks, scaled to determine your grade.
        </p>

        <h2>Exam technique that wins marks</h2>
        <ul>
          <li><strong>Show your method</strong> — most questions award method marks even if your final answer is wrong.</li>
          <li><strong>Don't leave blanks</strong> — try something. Wrong attempts often pick up a mark; blanks always score zero.</li>
          <li><strong>Underline what's asked</strong> — many marks are lost answering the wrong question.</li>
          <li><strong>Check units</strong> — answers in cm² when the question asked m² lose all the marks.</li>
          <li><strong>Round only at the end</strong> — premature rounding loses accuracy marks.</li>
        </ul>

        <h2>A 12-week revision plan</h2>
        <p>
          Weeks 1–4: topic-by-topic, work through your weakest areas first. 30 minutes a day is plenty.
        </p>
        <p>
          Weeks 5–8: alternate topic drills with full past papers. Mark them yourself with the official mark
          scheme — examiner thinking is a skill in itself.
        </p>
        <p>
          Weeks 9–11: full past papers under exam conditions. Aim for 2 a week minimum. Treat your error log
          (questions you got wrong) as your most valuable revision resource.
        </p>
        <p>
          Week 12: taper. Light revision, plenty of sleep, no all-nighters.
        </p>

        <h2>How long should I revise per day?</h2>
        <p>
          Steady wins. 45–60 minutes a day for 3 months beats 6 hours a day for 2 weeks every time. Your brain
          needs sleep to consolidate — overnight gaps are part of the learning, not a break from it.
        </p>

        <h2>Try a free GCSE Maths mock</h2>
        <p>
          Get started with our <T slug="gcse-maths">free GCSE Maths practice tests</T>, or browse the full{" "}
          <C slug="education">Education & School hub</C> for 11+, GCSE English and SATs practice. Pair this with
          our <B slug="how-to-study-for-exams-fast">how to study fast</B> guide for the techniques top students use.
        </p>
      </>
    ),
  },

  {
    slug: "cscs-test-practice-guide",
    title: "CSCS Test Practice Guide 2026 (Operatives & Specialist)",
    description:
      "How to pass the CSCS Health, Safety and Environment Test in 2026: syllabus, pass mark, booking and free CSCS practice questions.",
    excerpt:
      "The CSCS test pass mark is 47/50 — there's no room to wing it. Here's how to prepare in a single weekend.",
    datePublished: "2026-02-08",
    author: "UK Test Hub Team",
    readingMinutes: 9,
    category: "Professional",
    tags: ["CSCS", "construction", "health and safety"],
    hero: heroProfessional,
    body: () => (
      <>
        <p>
          The CSCS card is your passport to a UK construction site. To get one, you need to pass the CITB Health,
          Safety and Environment (HS&E) Test, also known as the CSCS test. The pass mark is brutal — 47 out of 50
          on the operatives test — and the test only takes 45 minutes. There's no room to wing it.
        </p>

        <h2>What card do I need?</h2>
        <p>
          The most common cards are:
        </p>
        <ul>
          <li><strong>Green Labourer card</strong> — for general construction work. Requires the operatives HS&E Test.</li>
          <li><strong>Blue Skilled Worker card</strong> — for trades like bricklaying or plastering. Same operatives test.</li>
          <li><strong>Gold Supervisor card</strong> — requires the Specialist HS&E Test plus an NVQ Level 3 or 4.</li>
          <li><strong>Black Manager card</strong> — Managers and Professionals HS&E Test plus an NVQ Level 6 or 7.</li>
        </ul>

        <h2>What's in the operatives HS&E Test?</h2>
        <p>
          50 multiple-choice questions in 45 minutes. The pass mark is 47/50 — yes, you can only afford 3 wrong.
          Topics include:
        </p>
        <ul>
          <li>General responsibilities (under the Health and Safety at Work Act 1974)</li>
          <li>Accident reporting and first aid</li>
          <li>Personal protective equipment (PPE)</li>
          <li>Working at height</li>
          <li>Manual handling</li>
          <li>Hazardous substances (COSHH)</li>
          <li>Noise and vibration</li>
          <li>Plant and equipment</li>
          <li>Fire prevention and control</li>
          <li>Environmental awareness</li>
        </ul>

        <h2>Tips to pass first time</h2>
        <p>
          Don't underestimate the test. Many experienced site workers fail because they answered from instinct
          rather than the official CITB material. Stick to what the test wants you to say, not what you'd actually
          do on a site.
        </p>
        <p>
          Memorise the limits: anyone working at 2 metres or more is working at height. Lifting more than 25 kg
          alone is generally unacceptable. Noise above 85 dB requires hearing protection. These specific numbers
          come up almost every test.
        </p>
        <p>
          Practise behavioural case studies. The test now includes scenario questions — you watch a short video
          clip and answer questions about what the worker should do. The right answer is always the most cautious.
        </p>

        <h2>Booking your CSCS test</h2>
        <p>
          Book through citb.co.uk only — never use unofficial booking sites which charge a markup. The fee is
          around £22.50. You can book a slot at most Pearson VUE test centres.
        </p>

        <h2>What if I fail?</h2>
        <p>
          You can rebook immediately, but you'll pay the fee again. Use the result printout — it tells you which
          topic areas you got wrong — to focus your revision before you retake.
        </p>

        <h2>After the pass</h2>
        <p>
          You'll receive a CSCS card application form. Apply within 2 years of your test pass, with proof of your
          qualification (NVQ, SVQ or apprenticeship certificate) for cards above green. Cards are valid for up to
          5 years and renewal requires a fresh test pass.
        </p>

        <h2>Start practising</h2>
        <p>
          Try our <T slug="cscs">free CSCS practice questions</T> covering every operatives test topic. For other
          professional certifications including SIA, SERU TfL and Food Hygiene, head to the{" "}
          <C slug="professional">Professional Certification hub</C>. If you're a TfL driver, our{" "}
          <B slug="seru-tfl-test-guide">SERU TfL guide</B> walks you through that exam too.
        </p>
      </>
    ),
  },

  {
    slug: "seru-tfl-test-guide",
    title: "SERU TfL Test Guide 2026: How to Pass First Time (Free Mocks)",
    description:
      "Complete SERU TfL test guide for 2026: 36 questions, 80% pass mark, syllabus, booking and free SERU practice tests for London private hire drivers.",
    excerpt:
      "The SERU TfL test trips up well-prepared drivers because of its wording. Here's how to read the questions correctly first time.",
    datePublished: "2026-02-12",
    author: "UK Test Hub Team",
    readingMinutes: 10,
    category: "Professional",
    tags: ["SERU", "TfL", "private hire", "London"],
    hero: heroProfessional,
    body: () => (
      <>
        <p>
          Since October 2021, every new and renewing private hire driver in London has had to pass the SERU TfL
          assessment — Safety, Equality and Regulatory Understanding. It's a 36-question, 1-hour test with a pass
          mark of 30 out of 36 (about 83%). Get less than 30 right and you can't drive private hire in London.
        </p>

        <h2>What does SERU cover?</h2>
        <p>
          The TfL syllabus has six topics. The number of questions in each topic is roughly proportional:
        </p>
        <ul>
          <li><strong>Safety and safeguarding</strong> — protecting passengers, especially vulnerable adults and children.</li>
          <li><strong>Equality and disability awareness</strong> — Equality Act 2010, assistance dogs, accessible service.</li>
          <li><strong>The driver, the operator and the passenger</strong> — roles, responsibilities and the legal relationship between them.</li>
          <li><strong>Driving standards and roadworthiness</strong> — vehicle condition, MOT, insurance.</li>
          <li><strong>Notifying TfL</strong> — what you must report (medical conditions, criminal convictions, address changes) and how soon.</li>
          <li><strong>Map reading</strong> — basic A–Z navigation. Not the Knowledge — far simpler.</li>
        </ul>

        <h2>Why drivers fail SERU</h2>
        <p>
          Most failures come down to wording. SERU questions test whether you know exactly what TfL says, not what
          would feel reasonable on the road. For example:
        </p>
        <ul>
          <li>"Driver" and "operator" are different — never use them interchangeably.</li>
          <li>"Private hire" and "taxi" are different — black cabs are taxis; minicabs and Uber are private hire.</li>
          <li>"Pre-booked" is the only legal way private hire passengers can travel — you cannot accept a hail or wait at a rank.</li>
        </ul>

        <h2>Key facts to memorise</h2>
        <ul>
          <li><strong>Notify TfL within 7 days</strong> of any change of name, address, conviction or relevant medical condition.</li>
          <li><strong>Assistance dogs travel free</strong>, regardless of size or breed. Refusing is a criminal offence.</li>
          <li><strong>Wheelchair users must be carried</strong> at the same fare as anyone else, with no extra charge.</li>
          <li><strong>You must keep your booking confirmation</strong> from your operator for the entire journey.</li>
          <li><strong>Vehicles must display TfL roundel discs</strong> at the front and rear at all times.</li>
        </ul>

        <h2>Tips to pass first time</h2>
        <p>
          Read every question twice. SERU often phrases questions in the negative ("Which of the following is
          NOT…?") and many candidates miss the "NOT".
        </p>
        <p>
          Practise with mocks specifically designed for SERU. Generic UK driving theory questions won't cover the
          TfL-specific regulations. Our <T slug="seru">SERU TfL practice tests</T> mirror the real format with
          identical wording style.
        </p>
        <p>
          Aim for 33+ in your mocks before booking the real test. The 30/36 pass mark leaves no margin and the
          stress of the real test typically drops your score 1–2 marks below your mock average.
        </p>

        <h2>Booking and re-sits</h2>
        <p>
          Book through TfL only. The test is online, taken in your own home with a webcam (Pearson VUE
          OnVue-style), or at an approved TfL centre. The fee is included in your licence application.
        </p>
        <p>
          If you fail, you can re-sit after a short waiting period, but repeated failures may delay your licence.
          One pass is good for the duration of your licence — you don't have to retake at every renewal.
        </p>

        <h2>Start practising</h2>
        <p>
          Take a free <T slug="seru">SERU TfL practice test</T> now, and explore the full{" "}
          <C slug="professional">Professional Certification hub</C> for related exams like CSCS and SIA. If you
          drive other vehicles too, our <B slug="how-to-pass-driving-theory-test">Driving Theory guide</B> may help.
        </p>
      </>
    ),
  },

  {
    slug: "nhs-numeracy-test-tips",
    title: "NHS Numeracy Test Tips: Drug Calculations Made Simple (2026)",
    description:
      "Pass NHS numeracy assessments with confidence. Drug calculation formulas, percentage shortcuts, and free NHS numeracy practice tests for 2026.",
    excerpt:
      "Drug calculations cause more NHS interview failures than anything else. Here's the formula and the shortcuts you need.",
    datePublished: "2026-02-15",
    author: "UK Test Hub Team",
    readingMinutes: 8,
    category: "NHS",
    tags: ["NHS", "numeracy", "drug calculations"],
    hero: heroNhs,
    body: () => (
      <>
        <p>
          NHS recruitment uses numeracy assessments at multiple stages — at application, at interview, and as part
          of the NMC CBT for nurses. They're not designed to catch you out, but they reward speed and accuracy
          under pressure. This guide covers the four calculation types you'll see most.
        </p>

        <h2>Drug calculations: the universal formula</h2>
        <p>
          Whatever the question, drug calculations come down to one formula:
        </p>
        <p>
          <strong>(Required dose ÷ Stock dose) × Stock volume = Volume to give</strong>
        </p>
        <p>
          Example: A patient is prescribed 75 mg of pethidine. Stock vials contain 100 mg in 2 ml. How much do you
          give? (75 ÷ 100) × 2 = 1.5 ml.
        </p>

        <h2>IV infusion rate (drops per minute)</h2>
        <p>
          <strong>(Volume × Drop factor) ÷ Time in minutes = Drops per minute</strong>
        </p>
        <p>
          Example: 1000 ml of saline over 8 hours, drop factor 20. (1000 × 20) ÷ 480 = 41.6, round to 42 drops per
          minute.
        </p>

        <h2>mg per kg dosing for paediatrics</h2>
        <p>
          <strong>Required dose per kg × Weight in kg = Total dose</strong>
        </p>
        <p>
          Example: A child weighing 18 kg needs paracetamol at 15 mg/kg. 15 × 18 = 270 mg.
        </p>

        <h2>Percentages</h2>
        <p>
          Two shortcuts that save time:
        </p>
        <ul>
          <li>10% is just dividing by 10. 25% is half of 50%. 75% is 50% + 25%.</li>
          <li>To find what percentage A is of B, do (A ÷ B) × 100.</li>
        </ul>

        <h2>Common pitfalls</h2>
        <ul>
          <li><strong>Decimal places</strong> — 0.25 mg is very different from 2.5 mg. Always sense-check.</li>
          <li><strong>Unit conversion</strong> — 1 g = 1000 mg, 1 mg = 1000 micrograms (mcg). Convert before calculating.</li>
          <li><strong>Time conversion</strong> — IV rates are usually in minutes. Convert hours to minutes first.</li>
          <li><strong>Rounding</strong> — round only at the end, and only to the nearest whole drop or millilitre as the question requires.</li>
        </ul>

        <h2>Calculator or no calculator?</h2>
        <p>
          The NMC CBT does not allow calculators. Many local NHS trust assessments do allow one. Always check the
          rules in your invitation letter — and practise both with and without so you're ready either way.
        </p>

        <h2>Mental maths shortcuts</h2>
        <p>
          Memorise the times tables up to 12, learn to halve and double quickly, and practise dividing by 10 and
          100 by moving the decimal point. These three skills cover 80% of NHS calculation questions.
        </p>

        <h2>Practice plan</h2>
        <p>
          Aim for 20 minutes a day for two weeks. Take one full mock every other day, and use the alternating days
          to drill any specific calculation type you got wrong. By day 14 you should be answering most questions
          inside 60 seconds.
        </p>

        <h2>Try a free NHS numeracy mock</h2>
        <p>
          Take our <T slug="nhs-numeracy">free NHS Numeracy practice test</T> now to baseline your score. The full{" "}
          <C slug="nhs">NHS & Healthcare hub</C> also covers literacy, values-based recruitment and the NMC CBT
          for overseas nurses.
        </p>
      </>
    ),
  },

  {
    slug: "uk-general-knowledge-quiz-guide",
    title: "UK General Knowledge Quiz Guide: Topics, Trivia & Daily Practice",
    description:
      "Boost your UK general knowledge with daily quizzes covering history, geography, sport, culture and slang. Free practice quizzes for British trivia fans.",
    excerpt:
      "Pub quiz champion, citizenship candidate, or just curious? Here's the UK general knowledge crash course.",
    datePublished: "2026-02-20",
    author: "UK Test Hub Team",
    readingMinutes: 8,
    category: "Fun",
    tags: ["general knowledge", "trivia", "uk culture"],
    hero: heroFun,
    body: () => (
      <>
        <p>
          Whether you're prepping for a pub quiz, brushing up before the Life in the UK Test, or just enjoy
          trivia, UK general knowledge is one of the most rewarding subjects to revise. The country has 2,000
          years of recorded history, four distinct nations, and a culture that punches well above its
          population's weight. Here's a crash course.
        </p>

        <h2>UK geography essentials</h2>
        <ul>
          <li>The UK comprises England, Scotland, Wales and Northern Ireland. Capital cities: London, Edinburgh, Cardiff, Belfast.</li>
          <li>The longest river is the Severn (220 miles); the largest lake is Lough Neagh in Northern Ireland.</li>
          <li>Ben Nevis (1,345 m) is the highest mountain; Snowdon and Scafell Pike are the highest in Wales and England.</li>
          <li>The UK has 14 national parks. The first was the Peak District (1951).</li>
        </ul>

        <h2>UK history milestones</h2>
        <ul>
          <li>1066 — Battle of Hastings, Norman conquest under William the Conqueror.</li>
          <li>1215 — Magna Carta limits royal power.</li>
          <li>1666 — Great Fire of London.</li>
          <li>1707 — Act of Union creates Great Britain.</li>
          <li>1837–1901 — Victorian era; British Empire at its height.</li>
          <li>1948 — NHS founded under Aneurin Bevan; Windrush arrives.</li>
          <li>2012 — London hosts the Olympics for a record third time.</li>
          <li>2022 — Queen Elizabeth II dies; Charles III ascends to the throne.</li>
        </ul>

        <h2>British sport</h2>
        <ul>
          <li>Football: the FA Cup is the world's oldest national football competition (1871).</li>
          <li>Cricket: The Ashes is contested between England and Australia since 1882.</li>
          <li>Rugby: the Six Nations involves England, Scotland, Wales, Ireland, France and Italy.</li>
          <li>Tennis: Wimbledon, founded 1877, is the oldest of the four Grand Slams.</li>
        </ul>

        <h2>British culture and traditions</h2>
        <ul>
          <li>Bonfire Night (5 November) commemorates the failed Gunpowder Plot of 1605.</li>
          <li>Burns Night (25 January) celebrates the Scottish poet Robert Burns.</li>
          <li>St George's Day (23 April), St Andrew's Day (30 November), St David's Day (1 March) and St Patrick's Day (17 March) honour each nation's patron saint.</li>
          <li>Afternoon tea, the Sunday roast, fish and chips, and a strong queue culture are all distinctively British.</li>
        </ul>

        <h2>UK government basics</h2>
        <ul>
          <li>Parliament has two chambers: the elected House of Commons and the appointed House of Lords.</li>
          <li>The Prime Minister leads the government from 10 Downing Street.</li>
          <li>General elections must take place at least every 5 years.</li>
          <li>You must be 18+ to vote in general elections; 16+ in Scottish and Welsh elections.</li>
        </ul>

        <h2>Tips for pub quiz domination</h2>
        <ul>
          <li>Read a daily news source — current affairs come up constantly.</li>
          <li>Watch one panel show a week (QI, Pointless) — the writers pull from the same trivia pool.</li>
          <li>Build a "team brain" — every member specialises in 2–3 subjects so you cover everything.</li>
        </ul>

        <h2>Try a free quiz</h2>
        <p>
          Test yourself with our <T slug="daily">free UK General Knowledge Daily quiz</T> — fresh questions every
          24 hours. For more lighthearted fun, try the <T slug="how-british">How British Are You?</T> quiz, or
          browse the full <C slug="fun">Fun & Viral Quizzes hub</C>. If trivia leads you towards taking the real
          citizenship exam, our <B slug="life-in-the-uk-test-guide">Life in the UK guide</B> walks you through it.
        </p>
      </>
    ),
  },

  {
    slug: "how-to-study-for-exams-fast",
    title: "How to Study for Exams Fast: 9 Evidence-Based Techniques",
    description:
      "Study smarter, not longer. Nine evidence-based techniques — from active recall to spaced repetition — that help you pass UK exams faster in 2026.",
    excerpt:
      "Cramming wastes time. These nine evidence-based techniques are the fastest way to pass any exam — UK or international.",
    datePublished: "2026-02-25",
    author: "UK Test Hub Team",
    readingMinutes: 10,
    category: "Education",
    tags: ["study tips", "revision", "exam preparation"],
    hero: heroEducation,
    body: () => (
      <>
        <p>
          You don't need to study harder. You need to study differently. Decades of cognitive science research
          point to a small set of techniques that consistently outperform the way most students revise. Here are
          nine that work — backed by evidence and tested by millions of UK exam candidates.
        </p>

        <h2>1. Active recall</h2>
        <p>
          Test yourself instead of re-reading notes. The act of pulling a fact out of your memory — even if you
          fail — strengthens that memory more than any amount of passive re-reading. This is why{" "}
          <B slug="how-to-pass-driving-theory-test">mock tests work so well for driving theory</B> and every other
          exam.
        </p>

        <h2>2. Spaced repetition</h2>
        <p>
          Don't revisit topics every day. Revisit them at increasing intervals — 1 day, 3 days, 7 days, 14 days.
          Each successful recall extends the interval. Apps like Anki are built on this principle, but a paper
          flashcard system works equally well.
        </p>

        <h2>3. Interleaving</h2>
        <p>
          Mix topics within a single revision session rather than blocking them (algebra Monday, geometry Tuesday).
          Interleaving feels harder in the moment but produces dramatically better exam performance. Your brain
          learns to identify which technique a question requires — a skill blocked practice doesn't develop.
        </p>

        <h2>4. The Feynman technique</h2>
        <p>
          Pretend to teach the topic to a 12-year-old. Use simple words, no jargon. Where you stumble is exactly
          where your understanding is shallow. Go back, fill the gap, and try again. This works for any subject.
        </p>

        <h2>5. Past papers, not new content</h2>
        <p>
          Once you've covered the syllabus, every additional hour is better spent on past papers than on new
          material. Past papers teach you the exam, not just the subject — and the exam is what's being tested.
        </p>

        <h2>6. Sleep is revision</h2>
        <p>
          Memory consolidation happens during deep sleep. An all-nighter destroys retention. Aim for 7–9 hours
          consistently in the run-up to exams. Cutting sleep to gain study time is a net loss every time.
        </p>

        <h2>7. The 50/10 rhythm</h2>
        <p>
          Work for 50 minutes, then take a 10-minute break. Use the break properly — stand up, stretch, look out a
          window. Don't scroll your phone. After 3–4 cycles, take a longer 30-minute break. This rhythm matches
          your brain's natural attention cycle and is far more sustainable than 4-hour grinds.
        </p>

        <h2>8. Distributed practice over massed practice</h2>
        <p>
          Six 1-hour sessions on six different days will always beat one 6-hour session on a single day. The forgetting
          and re-learning between sessions is what builds durable memory. Cramming feels productive but the
          knowledge evaporates within a week.
        </p>

        <h2>9. Energy management, not time management</h2>
        <p>
          Track when you're sharpest. Most people have 2–3 hours of peak focus a day, usually in the morning. Use
          those hours for the hardest material. Save easier review for the post-lunch dip.
        </p>

        <h2>Putting it all together: a sample week</h2>
        <ul>
          <li><strong>Mon</strong> — 50 minutes new material, 50 minutes past paper, 25 minutes flashcards.</li>
          <li><strong>Tue</strong> — Same structure, different topic.</li>
          <li><strong>Wed</strong> — Full mock test under exam conditions; 25 minutes review of mistakes.</li>
          <li><strong>Thu</strong> — Topic mix (interleave); flashcards.</li>
          <li><strong>Fri</strong> — Full mock; rest evening.</li>
          <li><strong>Sat</strong> — Catch-up day; review your error log.</li>
          <li><strong>Sun</strong> — Off. Sleep, walk, see family. Genuinely off.</li>
        </ul>

        <h2>Apply this to any UK exam</h2>
        <p>
          These techniques work for every exam in our library — from{" "}
          <C slug="driving">Driving Theory</C> to <C slug="education">GCSE</C>,{" "}
          <C slug="english">IELTS</C>, <C slug="career">aptitude tests</C>, and{" "}
          <C slug="nhs">NHS recruitment</C>. Pick your exam, take a baseline mock today, and start applying the
          rhythm above tomorrow. You'll be amazed how much faster you progress.
        </p>
      </>
    ),
  },
];

export const getPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);

export const getAllPosts = () =>
  [...blogPosts].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));

export const getRelatedPosts = (slug: string, n = 3) =>
  getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, n);
