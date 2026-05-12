import { createFileRoute } from "@tanstack/react-router";
import {
  SeoLanding,
  buildSeoMeta,
  buildFaqAndArticleSchemas,
  type FaqItem,
} from "@/components/SeoLanding";

const PATH = "/driving-theory-test-questions";
const TITLE = "Driving Theory Test Questions — Free 2026 UK Practice";
const DESCRIPTION =
  "Free UK driving theory test questions with explanations. Practice-style questions covering road signs, hazard perception topics, alertness, attitude and vehicle handling.";

const faqs: FaqItem[] = [
  {
    q: "What is in the UK driving theory test?",
    a: "The UK car driving theory test has two parts: 50 multiple-choice questions and a hazard perception video test. You must pass both parts in the same sitting to pass the theory test.",
  },
  {
    q: "What is the pass mark for the driving theory test?",
    a: "For cars, the multiple-choice pass mark is 43 out of 50 (86%) and the hazard perception pass mark is 44 out of 75. You must pass both parts.",
  },
  {
    q: "How long is the multiple-choice section?",
    a: "You have 57 minutes to answer 50 multiple-choice questions, so you have just over a minute per question — more than enough if you have practised.",
  },
  {
    q: "How long is the theory test pass certificate valid?",
    a: "Two years from the date you pass. If you don't pass your practical driving test within those two years, you will have to take and pass the theory test again.",
  },
  {
    q: "Is this driving theory practice test official?",
    a: "No. UK Test Hub is independent of the DVSA. Our questions are practice-style and designed to reflect the format and topics of the official UK driving theory test.",
  },
  {
    q: "How many practice questions should I do before the test?",
    a: "Most learners feel ready after consistently scoring 47 or higher on three or four full 50-question mock tests, with all the weak topics revisited.",
  },
];

export const Route = createFileRoute("/driving-theory-test-questions")({
  head: () => ({
    ...buildSeoMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
    scripts: buildFaqAndArticleSchemas({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      faqs,
    }),
  }),
  component: DrivingTheoryLanding,
});

function DrivingTheoryLanding() {
  return (
    <SeoLanding
      h1="Driving Theory Test Questions — Free Practice"
      intro="Free, exam-style UK driving theory test questions with full explanations — covering alertness, attitude, vehicle handling, motorway rules, road signs and hazard awareness."
      topicSlug="driving-theory"
      categorySlug="driving"
      categoryTitle="Driving & Transport"
      faqs={faqs}
      relatedTests={[
        { slug: "road-signs", title: "Road Signs Test" },
        { slug: "hazard-perception", title: "Hazard Perception Test" },
        { slug: "motorcycle-theory", title: "Motorcycle Theory Test" },
      ]}
      relatedCategories={[
        { slug: "taxi-private-hire", title: "Taxi & Private Hire" },
        { slug: "career", title: "Career & Job Tests" },
      ]}
      sections={[
        {
          heading: "What is the UK driving theory test?",
          body: (
            <p>
              The UK driving theory test is the knowledge exam every learner
              has to pass before booking a practical driving test. It is run
              by the Driver and Vehicle Standards Agency (DVSA) and is taken
              on a computer at an official theory test centre. The test has
              two equally important parts: a multiple-choice section that
              checks how well you know the rules of the road and the Highway
              Code, and a hazard perception section that checks how quickly
              you spot developing hazards on the road. You have to pass both
              parts in the same sitting — passing one and failing the other
              means starting from scratch. The good news is that the theory
              test is very predictable, and well-prepared learners pass first
              time the vast majority of the time.
            </p>
          ),
        },
        {
          heading: "Topics covered in the multiple-choice questions",
          body: (
            <>
              <p>
                The 50 multiple-choice questions are pulled from a fixed bank
                of 14 categories. The DVSA publishes a revision question
                bank, and our practice tests follow the same structure so
                you can target your weakest areas:
              </p>
              <ul>
                <li>Alertness — concentration, observation, anticipation</li>
                <li>
                  Attitude — courtesy, tailgating, priority and other road
                  users
                </li>
                <li>
                  Safety and your vehicle — tyres, lights, fluids, security
                  and the environment
                </li>
                <li>
                  Safety margins — stopping distances, weather, ice, fog and
                  rain
                </li>
                <li>Hazard awareness — recognising risks before they develop</li>
                <li>
                  Vulnerable road users — pedestrians, cyclists, horse
                  riders, motorcyclists, children
                </li>
                <li>Other types of vehicle — lorries, buses, trams</li>
                <li>
                  Vehicle handling — country roads, weather, speed and
                  cornering
                </li>
                <li>
                  Motorway rules — joining, leaving, lane discipline,
                  smart motorways
                </li>
                <li>Rules of the road — speed limits, signals, parking</li>
                <li>Road and traffic signs — warning, regulatory, informational</li>
                <li>
                  Documents — licence, MOT, insurance, V5C and tax
                </li>
                <li>
                  Incidents, accidents and emergencies — first aid basics,
                  reporting, breakdown procedure
                </li>
                <li>Vehicle loading — towing, roof loads, passengers</li>
              </ul>
            </>
          ),
        },
        {
          heading: "How the multiple-choice scoring works",
          body: (
            <p>
              You get 50 questions, 57 minutes, and you need 43 correct to
              pass. The questions are presented one at a time and you can
              flag a question to come back to it before finishing. There is
              no negative marking, so always answer everything — even a
              guess has a 25% chance of being right. The DVSA mixes easy and
              hard questions throughout, so don't panic if you hit a tough
              one early; the average difficulty across the whole paper is
              very fair if you have done the revision. Most learners who
              fail the multiple-choice fail by one or two marks, almost
              always because they hadn't practised the document, motorway
              and stopping distance topics.
            </p>
          ),
        },
        {
          heading: "How to revise for the multiple-choice test",
          body: (
            <ol>
              <li>
                <strong>Read the Highway Code</strong> end-to-end at least
                once. It is the source of every right answer.
              </li>
                <li>
                <strong>Take a baseline mock</strong> in practice mode to see
                where you stand without studying.
              </li>
              <li>
                <strong>Drill weak categories</strong> until you can answer
                them quickly and confidently.
              </li>
              <li>
                <strong>Sit a full 50-question mock</strong> against the
                clock at least twice in the week before your test.
              </li>
              <li>
                <strong>Memorise the awkward facts</strong> — typical
                stopping distances, MOT and insurance rules, and the
                meaning of less common road signs.
              </li>
            </ol>
          ),
        },
        {
          heading: "How to prepare for the hazard perception clips",
          body: (
            <p>
              The hazard perception part of the test plays you 14 short
              video clips of real road situations. Thirteen contain one
              developing hazard, and one clip contains two. You score up to
              5 marks per hazard, and the earlier you click as the hazard
              develops the more marks you score. You lose marks for
              clicking too early or in a regular pattern that looks like
              gaming the system, so the trick is to click as soon as
              something goes from a "potential hazard" to a "developing
              hazard" — for example, the moment a parked car indicates to
              pull out, not when you first spot the parked car. Practise on
              video clips, watch the road well ahead, and develop the habit
              of one calm, deliberate click per developing hazard.
            </p>
          ),
        },
        {
          heading: "Common mistakes that cause a fail",
          body: (
            <ul>
              <li>
                <strong>Skipping the boring topics.</strong> Documents,
                vehicle loading and the environment are nobody's favourite,
                but they reliably appear in every test.
              </li>
              <li>
                <strong>Misreading negative questions.</strong> "Which of
                these is NOT…" trips many candidates up. Slow down on those
                ones.
              </li>
              <li>
                <strong>Clicking like a maniac on hazards.</strong> Multiple
                rapid clicks on a clip can score you zero on that clip.
              </li>
              <li>
                <strong>Not knowing stopping distances.</strong> They appear
                in almost every theory test and they reward straight
                memorisation.
              </li>
              <li>
                <strong>Leaving revision until the night before.</strong>
                Spread your practice over a couple of weeks so the rules
                stick.
              </li>
            </ul>
          ),
        },
      ]}
    />
  );
}
