import { createFileRoute } from "@tanstack/react-router";
import {
  SeoLanding,
  buildSeoMeta,
  buildFaqAndArticleSchemas,
  type FaqItem,
} from "@/components/SeoLanding";

const PATH = "/blog/seru-test-practice";
const TITLE = "SERU Test Practice — Free Mock Questions for TfL Drivers";
const DESCRIPTION =
  "Free SERU test practice for London private hire drivers. Practice-style questions on safeguarding, the Equality Act, TfL rules and passenger safety with full explanations.";

const faqs: FaqItem[] = [
  {
    q: "What is the SERU test?",
    a: "SERU stands for Safety, Equality and Regulatory Understanding. It is an assessment that Transport for London uses for new private hire driver applicants in London, covering safety, equality, regulatory understanding and passenger protection, based on the PHV Driver's Handbook.",
  },
  {
    q: "How many questions are in the SERU assessment?",
    a: "TfL does not publish a fixed question count and treats SERU as a competency assessment rather than a simple percentage-pass paper. Expect a mix of multiple-choice and missing-word / sentence-completion questions drawn from the PHV Driver's Handbook, covering safety, equality and regulatory understanding.",
  },
  {
    q: "How can I prepare for SERU for free?",
    a: "Read the official TfL SERU candidate guide, then work through our free practice-style questions in practice mode to get instant explanations. When you are scoring above 90%, switch to exam mode to simulate timed pressure.",
  },
  {
    q: "How long does the SERU assessment take?",
    a: "The Transport for London (TfL) SERU exam has a strict time limit of 45 minutes. However, you should expect to be at the testing centre for about 50 to 60 minutes in total, as the session includes a brief introduction and a few practice questions before the timer officially starts.",
  },
  {
    q: "What happens if I fail SERU?",
    a: "If you do not pass on the first attempt, TfL allows you to rebook another SERU appointment. There is a fee for each attempt, so most drivers prepare thoroughly with practice tests before booking.",
  },
  {
    q: "Is this SERU practice test official?",
    a: "No. UK Test Hub is independent and not affiliated with TfL. Our questions are practice-style and designed to reflect common SERU topics so you can prepare with confidence.",
  },
];

export const Route = createFileRoute("/blog/seru-test-practice")({
  head: () => ({
    ...buildSeoMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
    scripts: buildFaqAndArticleSchemas({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      faqs,
    }),
  }),
  component: SeruLanding,
});

function SeruLanding() {
  return (
    <SeoLanding
      h1="SERU Test Practice"
      intro="Free, exam-style SERU practice questions for London private hire drivers — covering safeguarding, equality, TfL rules and passenger safety, with full explanations."
      topicSlug="seru"
      categorySlug="taxi-private-hire"
      categoryTitle="Taxi & Private Hire"
      faqs={faqs}
      relatedTests={[
        { slug: "topographical", title: "Topographical Assessment Practice" },
        { slug: "phv-licence", title: "PHV Licence Knowledge Test" },
        { slug: "ph-safeguarding", title: "Safeguarding Awareness Practice" },
        { slug: "ph-english", title: "Private Hire English Practice" },
        { slug: "ulez", title: "ULEZ Quiz" },
        { slug: "congestion-charge", title: "Congestion Charge Quiz" },
      ]}
      relatedCategories={[
        { slug: "driving", title: "Driving & Transport" },
        { slug: "security", title: "Security & Door Supervision" },
      ]}
      sections={[
        {
          heading: "What is the SERU assessment?",
          body: (
            <p>
              The SERU (Safety, Equality and Regulatory Understanding)
              assessment is a knowledge check Transport for London introduced
              for new private hire driver applicants in London. It is designed
              to make sure every newly licensed driver fully understands their
              responsibilities — not just the Highway Code, but how to keep
              passengers safe, treat them fairly, and follow the rules that
              come with holding a TfL private hire driver licence. SERU is
              taken in person at a TfL assessment centre and consists of
              structured scenario-based questions delivered by an assessor.
              Many drivers find that, although the topics are familiar, the
              format is unlike a typical multiple-choice driving theory test,
              which is why focused practice with realistic SERU-style
              questions makes such a difference.
            </p>
          ),
        },
        {
          heading: "What topics does SERU cover?",
          body: (
            <>
              <p>
                The SERU syllabus is broad, but the questions all fall under a
                few clear themes. Knowing these themes inside out is the most
                efficient way to revise:
              </p>
              <ul>
                <li>
                  <strong>Safeguarding</strong> — recognising signs of child
                  sexual exploitation, modern slavery, vulnerability and
                  domestic abuse, and knowing exactly who to report concerns
                  to.
                </li>
                <li>
                  <strong>Equality Act 2010</strong> — protected
                  characteristics, the duty not to discriminate, reasonable
                  adjustments and the legal duty to carry assistance dogs at
                  no extra charge.
                </li>
                <li>
                  <strong>Disability awareness</strong> — communicating with
                  passengers who have hearing, sight, mobility or hidden
                  disabilities, and how to load wheelchairs safely.
                </li>
                <li>
                  <strong>Driver and vehicle standards</strong> — keeping the
                  vehicle clean, roadworthy and properly insured for hire and
                  reward, displaying the correct identifiers and behaving
                  professionally at all times.
                </li>
                <li>
                  <strong>TfL licensing conditions</strong> — when to notify
                  TfL of medical changes, accidents, convictions, address
                  changes or vehicle changes, and how the booking and
                  pre-booking system must work.
                </li>
                <li>
                  <strong>Passenger safety and conduct</strong> — handling
                  difficult passengers, lost property, intoxication, route
                  deviation, fares disputes, and dealing with the police if
                  stopped.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "How the SERU assessment is scored",
          body: (
            <p>
              The official pass mark set by TfL is 60%. Our mock tests set a
              practice target of 75% — this is for mock tests only and gives
              you a safety margin so you are comfortable on the day. Because
              the real assessment is scenario-based, your answers need to be
              specific — saying "I would call someone" is not enough, you must
              say who you would call (for example, the police on 999 in an
              emergency, or TfL via the licensing email for non-urgent issues)
              and why. Practising with realistic SERU questions before your
              appointment helps you give the level of detail TfL is looking
              for.
            </p>
          ),
        },
        {
          heading: "How to use this SERU practice test",
          body: (
            <ol>
              <li>
                Start with <strong>practice mode</strong>. Each question shows
                the correct answer and a plain-English explanation as soon as
                you submit, so you learn as you go.
              </li>
              <li>
                Repeat the topics you find hardest — most candidates need extra
                time on safeguarding and the Equality Act before they feel
                confident.
              </li>
              <li>
                Switch to <strong>exam mode</strong> when you are consistently
                scoring above 90%. Exam mode hides feedback until the end and
                runs to a timer, which mirrors the pressure of being in front
                of a real TfL assessor.
              </li>
              <li>
                Read TfL's official SERU candidate guide alongside our
                practice tests — the two together give you both the wording
                TfL expects and the practice you need to recall it under
                pressure.
              </li>
            </ol>
          ),
        },
        {
          heading: "SERU revision tips that actually work",
          body: (
            <ul>
              <li>
                <strong>Learn the reporting routes by heart.</strong> Police
                999/101, NSPCC, Modern Slavery Helpline, TfL licensing email
                and your operator — knowing these cold scores quick easy
                marks.
              </li>
              <li>
                <strong>Use real-life examples.</strong> When the assessor
                asks how you would handle a vulnerable passenger, an answer
                that includes a brief, plausible example is stronger than a
                textbook definition.
              </li>
              <li>
                <strong>Slow down.</strong> Many candidates fail not because
                they don't know the answer, but because they rush and miss a
                step. Pause, think through the safeguarding, the legal duty
                and the practical action.
              </li>
              <li>
                <strong>Practise out loud.</strong> SERU is verbal, not
                multiple choice. Say your answers aloud as you revise so the
                wording feels natural on the day.
              </li>
            </ul>
          ),
        },
        {
          heading: "Common SERU mistakes to avoid",
          body: (
            <p>
              The most frequent reasons candidates have to rebook are also
              the easiest to fix with practice. Refusing — even unintentionally
              — to carry an assistance dog is an automatic fail under the
              Equality Act. Charging extra to a wheelchair user is another. So
              is a vague answer to a safeguarding question that doesn't name
              the right reporting route. Driver fitness and notification
              duties trip people up too: you must tell TfL within a defined
              window if you have an accident, gain a conviction, change
              address, or develop a medical condition that could affect
              driving. Our SERU practice questions deliberately include the
              same trap scenarios so you build the right reflexes before the
              real assessment.
            </p>
          ),
        },
      ]}
    />
  );
}
