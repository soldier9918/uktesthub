import { createFileRoute } from "@tanstack/react-router";
import {
  SeoLanding,
  buildSeoMeta,
  buildFaqAndArticleSchemas,
  type FaqItem,
} from "@/components/SeoLanding";

const PATH = "/blog/life-in-the-uk-test-practice";
const TITLE = "Life in the UK Test Practice — Free Mock Questions 2026";
const DESCRIPTION =
  "Free Life in the UK test practice with exam-style questions on history, government, law and culture. Instant explanations and a complete revision guide.";

const faqs: FaqItem[] = [
  {
    q: "What is the Life in the UK test?",
    a: "It is a 24-question multiple-choice exam taken at a registered Life in the UK test centre. You must pass it to apply for British citizenship or for indefinite leave to remain in the UK.",
  },
  {
    q: "What is the pass mark for the Life in the UK test?",
    a: "You need 18 out of 24 correct answers — that is 75%. The test lasts 45 minutes and the questions come from the official 'Life in the United Kingdom: A Guide for New Residents' handbook.",
  },
  {
    q: "How much does the Life in the UK test cost?",
    a: "The current Home Office fee is £50. You book it online through the official Life in the UK test booking service and choose a registered test centre near you.",
  },
  {
    q: "How long is the Life in the UK test pass valid?",
    a: "There is no expiry date on the pass certificate, although you must keep your pass notification letter safe — you will need it when you apply for citizenship or settlement.",
  },
  {
    q: "Is this Life in the UK practice test official?",
    a: "No. UK Test Hub is independent of the Home Office. Our questions are practice-style and designed to reflect the format and topics of the official Life in the UK test.",
  },
  {
    q: "How long should I revise for the Life in the UK test?",
    a: "Most candidates need 15 to 30 hours of revision. Read the official handbook at least twice, then practise consistently with mock tests until you score above 22 out of 24 every time.",
  },
];

export const Route = createFileRoute("/blog/life-in-the-uk-test-practice")({
  head: () => ({
    ...buildSeoMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
    scripts: buildFaqAndArticleSchemas({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      faqs,
    }),
  }),
  component: LifeUkLanding,
});

function LifeUkLanding() {
  return (
    <SeoLanding
      h1="Life in the UK Test Practice"
      intro="Free, exam-style Life in the UK test questions covering British history, government, law, traditions and culture — with a clear explanation on every answer."
      topicSlug="life-in-the-uk"
      categorySlug="citizenship"
      categoryTitle="UK Citizenship & Life"
      faqs={faqs}
      relatedTests={[
        { slug: "british-citizenship", title: "British Citizenship Practice" },
        { slug: "uk-laws-rights", title: "UK Laws & Rights Quiz" },
        { slug: "uk-geography", title: "UK Geography Test" },
      ]}
      relatedCategories={[
        { slug: "english", title: "English Language Tests" },
        { slug: "education", title: "Education & School" },
      ]}
      sections={[
        {
          heading: "What is the Life in the UK test?",
          body: (
            <p>
              The Life in the UK test is the knowledge exam set by the Home
              Office for anyone applying for British citizenship or
              indefinite leave to remain. It is one part of a wider
              application — you also need to meet the English language
              requirement and the residency rules — but it is the part most
              people are most nervous about. The test is taken on a
              computer at a registered Life in the UK test centre, lasts
              45 minutes, and gives you 24 multiple-choice questions drawn
              from the official handbook, "Life in the United Kingdom: A
              Guide for New Residents". You need 18 correct to pass. There
              are no trick questions, no essays, and no oral component, but
              the pass mark is high enough that solid revision is essential.
            </p>
          ),
        },
        {
          heading: "What's in the Life in the UK handbook?",
          body: (
            <>
              <p>
                Almost every test question maps directly onto a passage of
                the official handbook. Knowing how the handbook is
                structured makes revision much more efficient:
              </p>
              <ul>
                <li>
                  <strong>The values and principles of the UK</strong> — the
                  rule of law, individual liberty, tolerance and respect.
                </li>
                <li>
                  <strong>What is the UK?</strong> — the four nations,
                  capitals, flags, geography and the Crown Dependencies and
                  Overseas Territories.
                </li>
                <li>
                  <strong>A long and illustrious history</strong> — from
                  prehistoric Britain through the Romans, the Anglo-Saxons,
                  the Tudors, the Industrial Revolution, the World Wars and
                  modern Britain.
                </li>
                <li>
                  <strong>A modern, thriving society</strong> — population,
                  religion, customs, sport, art, music, literature and
                  national days.
                </li>
                <li>
                  <strong>The UK government, the law and your role</strong> —
                  Parliament, devolved governments, elections, the courts,
                  paying tax, jury service and getting involved in your
                  community.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "How the test is scored",
          body: (
            <p>
              You sit at a touch-screen terminal and answer 24 questions in
              45 minutes. Most are straightforward multiple-choice — pick
              one correct answer from four — but you will also see "true or
              false" questions and "select two correct answers" questions,
              which trip people up if they are not used to the format. You
              get your result on the day, in the form of a pass or fail
              notification letter. There is no scoring breakdown by topic,
              and no chance to see which questions you got wrong. If you
              fail, you have to wait at least seven days and pay the full
              fee again to rebook. That makes preparation very high value:
              the cost of one well-spent week of revision is much smaller
              than the cost of a second test attempt and the delay to your
              application.
            </p>
          ),
        },
        {
          heading: "How to revise for the Life in the UK test",
          body: (
            <ol>
              <li>
                <strong>Read the official handbook end to end.</strong> Don't
                skip the early history chapters — they appear in nearly
                every test.
              </li>
              <li>
                <strong>Take a baseline mock test</strong> in practice mode.
                It tells you which topics you actually understand and which
                you only think you do.
              </li>
              <li>
                <strong>Make notes by date and reign.</strong> Many wrong
                answers come from confusing kings, queens, prime ministers
                or war dates.
              </li>
              <li>
                <strong>Practise daily for 20 to 30 minutes</strong> in the
                two weeks before your test. Little and often beats one
                marathon study session.
              </li>
              <li>
                <strong>Sit a full timed mock</strong> the day before — if
                you score 22 or more, you are ready.
              </li>
            </ol>
          ),
        },
        {
          heading: "Tips for passing the Life in the UK test first time",
          body: (
            <ul>
              <li>
                <strong>Bring the right ID.</strong> If your photo ID and
                proof of address don't match exactly the names in your
                booking, the centre will refuse to let you sit the test —
                and the fee is non-refundable.
              </li>
              <li>
                <strong>Read each question twice.</strong> The 45-minute
                timer is generous, so there is no excuse for misreading
                under pressure.
              </li>
              <li>
                <strong>Memorise lists.</strong> The four UK nations and
                capitals, the patron saints and their days, the order of
                Henry VIII's wives, the dates of the World Wars — these
                come up again and again.
              </li>
              <li>
                <strong>Don't leave any blanks.</strong> An unanswered
                question is a guaranteed wrong answer. A guess is at least a
                25% chance of being right.
              </li>
              <li>
                <strong>Stay off forums the night before.</strong> Confusion
                from rumoured "real" questions causes more failures than it
                prevents.
              </li>
            </ul>
          ),
        },
        {
          heading: "What happens after you pass",
          body: (
            <p>
              When you pass, the centre prints a pass notification letter
              there and then. Keep it safe — the Home Office requires it
              when you submit your citizenship or settlement application,
              and it cannot be reissued. The pass does not expire, so you
              can apply at any point in the future once you also meet the
              residency and English language requirements. Many candidates
              go on to take their British citizenship application
              immediately after passing, while the handbook content is
              still fresh in their minds. Revisit our other UK practice
              tests on government, law and rights to keep that knowledge
              warm for the citizenship ceremony and life beyond it.
            </p>
          ),
        },
      ]}
    />
  );
}
