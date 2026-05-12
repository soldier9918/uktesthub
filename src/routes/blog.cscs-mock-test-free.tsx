import { createFileRoute } from "@tanstack/react-router";
import {
  SeoLanding,
  buildSeoMeta,
  buildFaqAndArticleSchemas,
  type FaqItem,
} from "@/components/SeoLanding";

const PATH = "/cscs-mock-test-free";
const TITLE = "CSCS Mock Test Free — Practice CSCS Health & Safety Questions";
const DESCRIPTION =
  "Free CSCS mock test with practice-style questions on health, safety and the environment for construction operatives. Instant explanations and full revision guide.";

const faqs: FaqItem[] = [
  {
    q: "What is the CSCS test?",
    a: "The CSCS Health, Safety and Environment Test is the touch-screen exam you must pass before applying for most CSCS cards in the UK construction industry. It checks that you understand the basics of working safely on site.",
  },
  {
    q: "How many questions are in the CSCS test?",
    a: "The Operative test has 50 questions and lasts 45 minutes. The Specialist and Supervisor/Manager tests have 50 questions plus extra knowledge sections, also under 45 minutes.",
  },
  {
    q: "What is the CSCS test pass mark?",
    a: "You need 47 out of 50 correct answers to pass — that is a pass mark of 94%. Three or more wrong answers is a fail, so the test is unforgiving and worth practising for.",
  },
  {
    q: "How long is a CSCS card valid?",
    a: "Most CSCS cards are valid for five years, but you must hold a current Health, Safety and Environment Test pass at the time of application or renewal. Some cards have shorter validity periods.",
  },
  {
    q: "Is this CSCS mock test official?",
    a: "No. UK Test Hub is independent and not affiliated with CITB or CSCS. Our questions are practice-style and designed to reflect common CSCS test formats.",
  },
  {
    q: "How long should I revise for the CSCS test?",
    a: "Most operatives need around 8 to 15 hours of practice to comfortably pass first time. Working through three to five full mock tests is usually enough to identify the weakest topics.",
  },
];

export const Route = createFileRoute("/cscs-mock-test-free")({
  head: () => ({
    ...buildSeoMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
    scripts: buildFaqAndArticleSchemas({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      faqs,
    }),
  }),
  component: CscsLanding,
});

function CscsLanding() {
  return (
    <SeoLanding
      h1="CSCS Mock Test — Free Practice"
      intro="Free, exam-style CSCS Health, Safety and Environment practice questions for construction operatives, with instant explanations on every answer."
      topicSlug="cscs-operative"
      categorySlug="construction"
      categoryTitle="Construction & Trades"
      faqs={faqs}
      relatedTests={[
        { slug: "cscs-gold", title: "CSCS Gold (Supervisor) Test" },
        { slug: "first-aid", title: "First Aid Theory" },
        { slug: "fire-safety", title: "Fire Safety Awareness" },
        { slug: "manual-handling", title: "Manual Handling Awareness" },
        { slug: "health-safety-awareness", title: "Health & Safety Awareness" },
      ]}
      relatedCategories={[
        { slug: "professional", title: "Professional & Workplace" },
        { slug: "career", title: "Career & Job Tests" },
      ]}
      sections={[
        {
          heading: "What is the CSCS test?",
          body: (
            <p>
              The CSCS Health, Safety and Environment (HS&E) Test is the
              touch-screen exam every construction worker in the UK has to
              pass before applying for almost any CSCS card. It is delivered
              on behalf of the Construction Skills Certification Scheme by
                CITB at testing centres across the country, and it exists for
              one reason: to make sure that anybody who steps onto a UK
              construction site understands the basic rules of working
              safely. The test focuses heavily on hazard awareness,
              site-specific risks and what to do when something goes wrong,
              rather than trade-specific knowledge — the trade competence
              comes from your NVQ or qualifications. There is one version of
              the test for operatives, one for specialists and one for
              supervisors and managers, and each version has the same
              demanding pass mark.
            </p>
          ),
        },
        {
          heading: "What's in the CSCS test?",
          body: (
            <>
              <p>
                The CSCS HS&E test draws its questions from the official
                "Health, Safety and Environment Test for Operatives and
                Specialists" revision materials. The questions are grouped
                into clear knowledge areas so you can prioritise revision:
              </p>
              <ul>
                <li>
                  <strong>General responsibilities</strong> — the law (HASAWA
                  1974, CDM 2015), accident reporting (RIDDOR), permits and
                  why your behaviour on site matters.
                </li>
                <li>
                  <strong>Health and welfare</strong> — health surveillance,
                  occupational health risks, mental wellbeing, manual
                  handling, vibration, noise and dust.
                </li>
                <li>
                  <strong>High-risk activities</strong> — working at height,
                  excavations, confined spaces, lifting operations, fire and
                  emergencies.
                </li>
                <li>
                  <strong>Environment</strong> — protecting waterways and
                  wildlife, waste segregation, dealing with spills,
                  environmental incident reporting.
                </li>
                <li>
                  <strong>Specialist activities</strong> (specialist tests
                  only) — additional questions specific to plant, demolition,
                  highway works, lifts, tunnelling and others.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "How the CSCS test is scored",
          body: (
            <p>
              The Operative HS&E test gives you 50 questions and 45 minutes.
              You need 47 correct out of 50 to pass — a pass mark of 94%.
              That sounds intimidating, but the questions are not
              deliberately tricky: most are common-sense health and safety
              once you have learned the official terminology. The Supervisor
              and Manager tests use the same 50 main questions but add
              behavioural case studies that test how you would respond to
              site situations as someone in charge. There is no negative
              marking, the questions are presented in a fixed order, and you
              get your result immediately at the end. If you fail, you can
              rebook straight away and resit at any approved testing centre.
            </p>
          ),
        },
        {
          heading: "How to use this CSCS mock test",
          body: (
            <ol>
              <li>
                <strong>Take a baseline test in practice mode.</strong> Don't
                worry about the score — you are mapping your weakest
                topics.
              </li>
              <li>
                <strong>Drill the weak knowledge areas.</strong> Most failed
                attempts come down to two or three topics, usually working
                at height, asbestos and electricity.
              </li>
              <li>
                <strong>Sit a full timed mock.</strong> 50 questions, 45
                minutes, no pausing. This is where you learn to manage the
                clock without panicking.
              </li>
              <li>
                <strong>Review every wrong answer.</strong> The official
                explanation usually contains the exact phrasing the real
                test uses, so reading it carefully sticks the answer in
                your memory.
              </li>
            </ol>
          ),
        },
        {
          heading: "Tips for passing CSCS first time",
          body: (
            <ul>
              <li>
                <strong>Watch out for "first aid" answers.</strong> The
                correct CSCS answer is almost always to make the area safe
                first, then call someone — not to wade in and help directly.
              </li>
              <li>
                <strong>Default to "stop work and report".</strong> If the
                scenario describes anything unsafe, the right answer is
                usually to stop, isolate and tell your supervisor.
              </li>
              <li>
                <strong>Know your PPE order.</strong> PPE is the last line of
                defence, not the first — questions often test whether you
                know to eliminate hazards before relying on PPE.
              </li>
              <li>
                <strong>Don't overthink the behavioural questions.</strong>
                Choose the option that protects people, follows the law and
                reports the issue.
              </li>
              <li>
                <strong>Practise on a touchscreen if you can.</strong> The
                real test uses a touch-screen interface, and that small
                difference can throw nervous candidates.
              </li>
            </ul>
          ),
        },
        {
          heading: "After you pass: getting your CSCS card",
          body: (
            <p>
              Passing the HS&E test is the gateway, not the destination. With
              a valid HS&E pass in hand, you apply for the right CSCS card
              for your role — Labourer, Skilled Worker, Specialist,
              Supervisor or Manager — through the official CSCS portal. Each
              card requires its own evidence: an NVQ at the right level for
              skilled cards, a CITB SSSTS or SMSTS for supervisors and
              managers. Cards are usually valid for five years. Treat the
              HS&E test as the standard you maintain across your career, not
              a one-off — it is renewed every time your card is, and the
              syllabus updates as the construction industry changes.
            </p>
          ),
        },
      ]}
    />
  );
}
