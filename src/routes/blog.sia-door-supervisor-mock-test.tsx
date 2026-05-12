import { createFileRoute } from "@tanstack/react-router";
import {
  SeoLanding,
  buildSeoMeta,
  buildFaqAndArticleSchemas,
  type FaqItem,
} from "@/components/SeoLanding";

const PATH = "/blog/sia-door-supervisor-mock-test";
const TITLE = "SIA Door Supervisor Mock Test — Free Practice Questions";
const DESCRIPTION =
  "Free SIA Door Supervisor mock test with practice-style questions on conflict management, physical intervention, the law and licensing. Instant explanations.";

const faqs: FaqItem[] = [
  {
    q: "What is the SIA Door Supervisor test?",
    a: "It is the multiple-choice exam that comes at the end of the SIA-licence-linked Door Supervisor qualification. Passing it is required before you can apply for an SIA front-line licence to work in pubs, clubs and venues across the UK.",
  },
  {
    q: "How many questions are in the SIA Door Supervisor exam?",
    a: "Each unit has its own multiple-choice exam — typically between 30 and 60 questions per unit. You must pass every unit to be awarded the qualification.",
  },
  {
    q: "What is the pass mark for the SIA Door Supervisor test?",
    a: "Most awarding bodies set the pass mark at around 70% per unit, although it can vary slightly. Our practice tests use the same threshold so you know when you are ready.",
  },
  {
    q: "Can I retake the SIA Door Supervisor exam if I fail?",
    a: "Yes. Training providers allow resits, usually after a short waiting period and for an additional fee. Use practice tests between attempts to find your weak topics.",
  },
  {
    q: "Is this SIA mock test official?",
    a: "No. UK Test Hub is independent of the SIA and the awarding bodies. Our questions are practice-style and designed to reflect common SIA Door Supervisor exam formats.",
  },
  {
    q: "How long is an SIA Door Supervisor licence valid?",
    a: "An SIA front-line Door Supervisor licence is valid for three years from the date of issue. After that you must complete the Door Supervisor Top-Up training and renew.",
  },
];

export const Route = createFileRoute("/blog/sia-door-supervisor-mock-test")({
  head: () => ({
    ...buildSeoMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
    scripts: buildFaqAndArticleSchemas({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      faqs,
    }),
  }),
  component: SiaDoorLanding,
});

function SiaDoorLanding() {
  return (
    <SeoLanding
      h1="SIA Door Supervisor Mock Test"
      intro="Free, exam-style SIA Door Supervisor practice questions covering conflict management, physical intervention, the law, drugs awareness and licensing — with full explanations."
      topicSlug="sia-door-supervisor"
      categorySlug="security"
      categoryTitle="Security & Door Supervision"
      faqs={faqs}
      relatedTests={[
        { slug: "sia-cctv", title: "SIA CCTV Operator Test" },
        { slug: "sia-close-protection", title: "SIA Close Protection Test" },
        { slug: "sia-top-up", title: "SIA Door Supervisor Top-Up Test" },
        { slug: "first-aid", title: "First Aid Theory" },
        { slug: "fire-safety", title: "Fire Safety Awareness" },
        { slug: "gdpr-awareness", title: "GDPR Awareness" },
      ]}
      relatedCategories={[
        { slug: "professional", title: "Professional & Workplace" },
        { slug: "hospitality", title: "Hospitality & Catering" },
      ]}
      sections={[
        {
          heading: "What is the SIA Door Supervisor exam?",
          body: (
            <p>
              The SIA Door Supervisor qualification is the licence-linked
              course you must complete before applying for an SIA front-line
              Door Supervisor licence in the UK. The qualification combines
              classroom learning, practical assessment of physical
              intervention skills, and a series of multiple-choice exams.
              Each exam covers a specific unit of the syllabus, and you must
              pass every one before the awarding body certifies you. Door
              Supervisor work is now one of the most regulated entry-level
              security roles in the country, and the exam is intentionally
              detailed to make sure that anyone working a door understands
              both the law and the practical responsibilities of keeping
              people safe.
            </p>
          ),
        },
        {
          heading: "Topics covered in the SIA Door Supervisor exam",
          body: (
            <>
              <p>
                The SIA Door Supervisor syllabus is built around four core
                themes. Most candidates pass the units on the law and on
                conflict management more easily than the units that involve
                practical decision-making, so it pays to know what is in each
                one:
              </p>
              <ul>
                <li>
                  <strong>Working in the private security industry</strong> —
                  the role of the SIA, licence types, the Private Security
                  Industry Act 2001, standards of behaviour and the law
                  around use of force.
                </li>
                <li>
                  <strong>Conflict management</strong> — how aggression
                  develops, communication and de-escalation skills, body
                  language, calming and reasoning techniques, and reporting
                  incidents.
                </li>
                <li>
                  <strong>Physical intervention</strong> — when force is
                  lawful, the SIA's approved disengagement and escorting
                  techniques, positional asphyxia, and post-incident
                  procedures.
                </li>
                <li>
                  <strong>Door supervision specifics</strong> — drugs and
                  weapons awareness, searching, queue management, ejecting
                  customers safely, working with the police, fire safety,
                  emergency procedures and licensing law (including the
                  Licensing Act 2003).
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "How the SIA Door Supervisor exam is scored",
          body: (
            <p>
              Each unit is sat as a closed-book multiple-choice paper, usually
              on paper at your training centre, with one mark per question
              and no negative marking. You typically need around 70% to pass
              each unit, and you have to pass all of them to be awarded the
              qualification. There is no overall combined score — failing one
              unit means you have to resit that unit on its own. That is
              actually good news, because it means you can focus your
              practice on the topics that are weakest. The most common
              borderline unit is conflict management, where the answers
              often look similar and you have to read the scenario carefully
              to choose the option that best reflects best practice.
            </p>
          ),
        },
        {
          heading: "How to use this SIA mock test",
          body: (
            <ol>
              <li>
                <strong>Begin in practice mode.</strong> Each question shows
                the correct answer plus a plain-English explanation as soon
                as you submit, so you build understanding rather than just
                memorising answers.
              </li>
              <li>
                <strong>Drill weak topics.</strong> If you keep losing marks
                on physical intervention or licensing law, repeat those
                blocks until you can answer them quickly and consistently.
              </li>
              <li>
                <strong>Switch to exam mode.</strong> Once you score above
                85% in practice, do a full timed mock under exam conditions.
                That tells you whether you can actually perform when the
                clock is ticking and a tutor is in the room.
              </li>
              <li>
                <strong>Review your wrong answers.</strong> Every wrong
                answer is a free lesson — read the explanation slowly and
                make a note of why the trap option was tempting.
              </li>
            </ol>
          ),
        },
        {
          heading: "Tips for passing the SIA Door Supervisor exam",
          body: (
            <ul>
              <li>
                <strong>Read the question, then re-read it.</strong> Many
                wrong answers come from candidates spotting a familiar word
                and rushing.
              </li>
              <li>
                <strong>Spot "always" and "never".</strong> Absolute words
                are usually a sign that an answer is wrong — door
                supervision is rarely black and white.
              </li>
              <li>
                <strong>Default to de-escalation.</strong> Where a scenario
                offers both a calm communication option and a physical
                response, the calm option is almost always the correct
                exam answer.
              </li>
              <li>
                <strong>Know the licensing basics.</strong> Age limits,
                drink-driving limits, the four licensing objectives and what
                a Designated Premises Supervisor does are easy marks if you
                memorise them.
              </li>
              <li>
                <strong>Sleep before the exam.</strong> The course is
                front-loaded with intense days of training — sit the test
                rested, not exhausted.
              </li>
            </ul>
          ),
        },
        {
          heading: "What to expect after you pass",
          body: (
            <p>
              When all the units are passed and your practical assessment is
              signed off, your training provider issues a certificate and
              uploads your result to the SIA portal. From there you apply
              for your front-line Door Supervisor licence directly via the
              SIA, providing identity documents, paying the licence fee and
              undergoing a criminality check. The licence is valid for three
              years, after which you complete the Door Supervisor Top-Up
              training and renew. Many newly qualified door supervisors also
              choose to take the SIA CCTV Operator and Close Protection
              qualifications to broaden the work they can take on.
            </p>
          ),
        },
      ]}
    />
  );
}
