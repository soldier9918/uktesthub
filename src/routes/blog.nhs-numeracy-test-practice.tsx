import { createFileRoute } from "@tanstack/react-router";
import {
  SeoLanding,
  buildSeoMeta,
  buildFaqAndArticleSchemas,
  type FaqItem,
} from "@/components/SeoLanding";

const PATH = "/nhs-numeracy-test-practice";
const TITLE = "NHS Numeracy Test Practice — Free Mock Questions with Answers";
const DESCRIPTION =
  "Free NHS numeracy test practice with exam-style drug calculation, conversion and percentage questions. Instant explanations and a full revision guide.";

const faqs: FaqItem[] = [
  {
    q: "What is the NHS numeracy test?",
    a: "It is a maths assessment used by NHS trusts during recruitment for clinical and many non-clinical roles. It checks that you can do everyday workplace calculations — drug dosages, conversions, percentages and ratios — accurately and under time pressure.",
  },
  {
    q: "What is the pass mark for the NHS numeracy test?",
    a: "The pass mark varies by trust and by role, but most NHS numeracy assessments require around 70% to 80% correct answers. For nursing roles involving drug calculations, the pass mark is often 100% on the medication maths section.",
  },
  {
    q: "How long is the NHS numeracy test?",
    a: "Most NHS numeracy tests last 20 to 30 minutes. Some trusts allow longer for candidates with reasonable adjustments — always ask the recruitment team if you need this.",
  },
  {
    q: "Can I use a calculator on the NHS numeracy test?",
    a: "It depends on the role. Many tests allow a basic on-screen calculator; some clinical drug calculation papers do not. Always check the instructions you are sent before the test.",
  },
  {
    q: "Is this NHS numeracy practice test official?",
    a: "No. UK Test Hub is independent of the NHS. Our questions are practice-style and designed to reflect common NHS numeracy assessment formats.",
  },
  {
    q: "How can I improve my numeracy quickly?",
    a: "Drill mental arithmetic daily — fractions, decimals, percentages and unit conversions. Then practise full timed mock tests so you build speed and accuracy together.",
  },
];

export const Route = createFileRoute("/nhs-numeracy-test-practice")({
  head: () => ({
    ...buildSeoMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
    scripts: buildFaqAndArticleSchemas({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      faqs,
    }),
  }),
  component: NhsNumeracyLanding,
});

function NhsNumeracyLanding() {
  return (
    <SeoLanding
      h1="NHS Numeracy Test Practice"
      intro="Free, exam-style NHS numeracy practice questions covering drug dosage maths, conversions, percentages, ratios and shift calculations — with full explanations."
      topicSlug="nhs-numeracy"
      categorySlug="nhs"
      categoryTitle="NHS & Healthcare"
      faqs={faqs}
      relatedTests={[
        { slug: "nhs-literacy", title: "NHS Literacy Test" },
        { slug: "nhs-values", title: "NHS Values-Based Recruitment" },
        { slug: "nmc-cbt", title: "NMC CBT (Nurses)" },
      ]}
      relatedCategories={[
        { slug: "career", title: "Career & Job Tests" },
        { slug: "education", title: "Education & School" },
      ]}
      sections={[
        {
          heading: "What is the NHS numeracy test?",
          body: (
            <p>
              The NHS numeracy test is a short, focused maths assessment used
              by NHS trusts and healthcare providers as part of their
              recruitment process. You will most often meet it when applying
              for clinical roles like Healthcare Assistant, Nurse Associate,
              Nurse, Midwife, Paramedic, Pharmacy Technician or Operating
              Department Practitioner — but many administrative, finance and
              estates roles also use a numeracy assessment. The exam looks
              simple on the surface, but it is designed to check both
              accuracy and speed: in a clinical setting a tiny calculation
              error can have real-world consequences, so the NHS expects you
              to be quick, careful and consistent.
            </p>
          ),
        },
        {
          heading: "What's in the NHS numeracy test?",
          body: (
            <>
              <p>
                The exact mix varies between trusts and roles, but almost
                every NHS numeracy assessment will draw from these topics:
              </p>
              <ul>
                <li>
                  <strong>Drug calculations</strong> — working out doses
                  from a prescription, how many tablets to give, how many
                  millilitres of a liquid to draw up, infusion rates in
                  millilitres per hour and drops per minute.
                </li>
                <li>
                  <strong>Unit conversions</strong> — milligrams to grams,
                  micrograms to milligrams, millilitres to litres, kilograms
                  to grams, time conversions and 24-hour clock arithmetic.
                </li>
                <li>
                  <strong>Percentages and ratios</strong> — calculating
                  percentage strengths, percentage of a total, ratios for
                  diluting solutions and reading data from simple tables.
                </li>
                <li>
                  <strong>Fractions and decimals</strong> — adding,
                  subtracting, multiplying and dividing simple fractions and
                  decimals without losing accuracy.
                </li>
                <li>
                  <strong>Time and shift planning</strong> — calculating
                  shift lengths, breaks, totals over a week and rota
                  scheduling problems.
                </li>
                <li>
                  <strong>Reading information from charts</strong> — picking
                  values from observation charts, fluid balance charts and
                  simple bar or line graphs.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "How the NHS numeracy test is scored",
          body: (
            <p>
              You will normally sit the test online before your interview,
              or in person at the trust on assessment day. Each question is
              worth one mark, there is no negative marking, and your final
              score is given as a percentage. For most non-clinical roles
              the pass mark sits between 70% and 80%. For clinical roles —
              especially those involving medication administration — many
              trusts expect 100% on the drug-calculation section. That
              isn't unfair: in real practice you cannot afford to give 90%
              of the right dose. The test is timed, so the second pressure
              point is the clock. Building both accuracy and speed is the
              key to passing first time, and the only way to do that is
              regular practice.
            </p>
          ),
        },
        {
          heading: "Drug calculation formulas you must know",
          body: (
            <ul>
              <li>
                <strong>Dose required = (What you want ÷ What you have) × What it's in.</strong>
                The classic NMC dose formula. If a patient needs 75mg and
                each tablet has 25mg, you give (75 ÷ 25) × 1 = 3 tablets.
              </li>
              <li>
                <strong>Liquid dose = (What you want ÷ What you have) × Volume.</strong>
                If you need 60mg of a drug that comes as 80mg in 5ml, you
                draw up (60 ÷ 80) × 5 = 3.75ml.
              </li>
              <li>
                <strong>Infusion in ml/hour</strong> = total volume ÷ time
                in hours. A 1000ml bag over 8 hours runs at 125ml/hour.
              </li>
              <li>
                <strong>Drops per minute</strong> = (volume × drop factor) ÷
                (time in minutes). The standard giving set drop factor in
                most NHS calculations is 20 drops/ml for clear fluids.
              </li>
            </ul>
          ),
        },
        {
          heading: "How to revise for the NHS numeracy test",
          body: (
            <ol>
              <li>
                <strong>Take a baseline mock test</strong> in practice mode.
                You need to know what you actually score under timed
                conditions, not what you think you'll score.
              </li>
              <li>
                <strong>Drill conversions until they are automatic.</strong>
                Mistakes in micrograms versus milligrams cause more failed
                tests than any other error.
              </li>
              <li>
                <strong>Memorise the dose formulas.</strong> Don't try to
                derive them in the exam — just plug the numbers in.
              </li>
              <li>
                <strong>Practise without a calculator first,</strong> then
                with one. Mental arithmetic confidence stops careless
                mistakes when the calculator is allowed.
              </li>
              <li>
                <strong>Sit full timed mocks</strong> until you score
                consistently above the pass mark with at least five minutes
                to spare.
              </li>
            </ol>
          ),
        },
        {
          heading: "Tips for passing on the day",
          body: (
            <p>
              Read every question all the way to the end before reaching
              for the calculator — many NHS numeracy questions hide the
              real maths in the last sentence. Always write the units next
              to your working so you don't accidentally answer in
              milligrams when the question wanted grams. If a calculation
              looks suspiciously easy or suspiciously hard, slow down and
              double-check the numbers — clinical maths rarely produces
              very neat results, but very ugly results often signal a unit
              conversion error. And if you finish with time to spare,
              recheck the drug calculation questions first; they are the
              ones that carry the highest risk of disqualification on a
              clinical role. Combine that habit with consistent practice
              on this site and you will walk into the test confident,
              calm and ready to hit the pass mark.
            </p>
          ),
        },
      ]}
    />
  );
}
