import { createFileRoute } from "@tanstack/react-router";
import {
  SeoLanding,
  buildSeoMeta,
  buildFaqAndArticleSchemas,
  type FaqItem,
} from "@/components/SeoLanding";

const PATH = "/blog/uk-road-signs-test";
const TITLE = "UK Road Signs Test — Free Practice Quiz with Answers";
const DESCRIPTION =
  "Free UK road signs test with practice-style questions and explanations. Learn warning, regulatory, informational and road marking signs ready for your driving theory test.";

const faqs: FaqItem[] = [
  {
    q: "How many road signs are in the UK?",
    a: "There are over 200 road signs in the official Highway Code, grouped into warning, regulatory, informational, direction and road works categories, plus road markings.",
  },
  {
    q: "Are road signs in the driving theory test?",
    a: "Yes. Road and traffic signs are one of the 14 categories in the multiple-choice section of the UK driving theory test, and you can expect several sign questions in any given test.",
  },
  {
    q: "What do triangular road signs mean?",
    a: "Triangular signs with a red border are warning signs — they tell you about a hazard ahead such as a bend, a junction, animals, a low bridge or roadworks.",
  },
  {
    q: "What do circular road signs mean?",
    a: "Circular signs are regulatory. Red circles tell you what you must not do (no entry, no overtaking, speed limits). Blue circles tell you what you must do (turn left, pass either side, mini-roundabout).",
  },
  {
    q: "Is this road signs test official?",
    a: "No. UK Test Hub is independent of the DVSA. Our questions are practice-style and designed to reflect common UK road sign formats so you can prepare with confidence.",
  },
  {
    q: "How can I memorise UK road signs quickly?",
    a: "Group them by shape and colour, learn the meaning of each shape (triangle = warning, circle = order, rectangle = information), then drill mock tests until the meaning comes faster than the picture does.",
  },
];

export const Route = createFileRoute("/blog/uk-road-signs-test")({
  head: () => ({
    ...buildSeoMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
    scripts: buildFaqAndArticleSchemas({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      faqs,
    }),
  }),
  component: RoadSignsLanding,
});

function RoadSignsLanding() {
  return (
    <SeoLanding
      h1="UK Road Signs Test — Free Practice"
      intro="Free, exam-style UK road signs practice questions with explanations — covering warning triangles, regulatory circles, motorway gantries, road markings and more."
      topicSlug="road-signs"
      categorySlug="driving"
      categoryTitle="Driving & Transport"
      faqs={faqs}
      relatedTests={[
        { slug: "driving-theory", title: "Driving Theory Test" },
        { slug: "hazard-perception", title: "Hazard Perception Test" },
        { slug: "motorcycle-theory", title: "Motorcycle Theory Test" },
      ]}
      relatedCategories={[
        { slug: "taxi-private-hire", title: "Taxi & Private Hire" },
        { slug: "career", title: "Career & Job Tests" },
      ]}
      sections={[
        {
          heading: "Why UK road signs matter",
          body: (
            <p>
              UK road signs are designed to give you instant information at
              a glance — often when you have only a second or two to react.
              Knowing them is not just a theory-test box to tick; it is one
              of the most important real-world driving skills you will ever
              learn. The UK uses an internationally consistent system based
              on shape and colour, which means you can decode any sign by
              its design even before you read the symbol or text. Once you
              understand the system, the hundreds of individual signs in
              the Highway Code stop feeling overwhelming and start to feel
              like a logical alphabet of the road.
            </p>
          ),
        },
        {
          heading: "The four main types of UK road sign",
          body: (
            <>
              <p>
                Every road sign you will ever meet in the UK falls into one
                of a small number of design families. Learn the family,
                and you have already done half the work:
              </p>
              <ul>
                <li>
                  <strong>Warning signs</strong> — triangular, with a red
                  border and white background. They warn of a hazard ahead:
                  bends, junctions, slippery road, children crossing,
                  cattle, level crossings, low bridges and so on.
                </li>
                <li>
                  <strong>Regulatory signs</strong> — circular. Red circles
                  prohibit something (no entry, no overtaking, no waiting,
                  speed limits, weight limits). Blue circles command
                  something (turn left, keep left, mini-roundabout, pass
                  either side, contraflow bus lane).
                </li>
                <li>
                  <strong>Informational and direction signs</strong> —
                  rectangular. Blue rectangles are for motorways, green
                  rectangles for primary routes (the A-road network), and
                  white rectangles for non-primary routes. Brown signs
                  indicate tourist destinations.
                </li>
                <li>
                  <strong>Road works signs</strong> — yellow background,
                  used to mark temporary works, diversions and reduced
                  speed limits.
                </li>
              </ul>
              <p>
                Octagonal STOP signs and inverted-triangle GIVE WAY signs
                are the only common exceptions to the shape rules — and
                that is deliberate, so you can recognise them even if they
                are partly obscured by snow, leaves or vandalism.
              </p>
            </>
          ),
        },
        {
          heading: "Road markings count too",
          body: (
            <p>
              Road markings are the silent partner of road signs. They
              extend, repeat or override what a sign says, and many theory
              test questions test markings rather than signs. Solid white
              lines down the middle of the road must not be crossed unless
              specific exceptions apply. Yellow box junctions must not be
              entered until your exit is clear. Zigzag lines at pedestrian
              crossings forbid stopping or overtaking. Triangles painted on
              the road ahead of give-way junctions warn you in advance, and
              "SLOW" markings do the same for hazards. Spend revision time
              on road markings as well as standing signs — they make up a
              meaningful share of the marks available in any signs-focused
              quiz.
            </p>
          ),
        },
        {
          heading: "Tricky UK road signs to watch for",
          body: (
            <ul>
              <li>
                <strong>National speed limit applies</strong> — a white
                circle with a black diagonal line. Many learners confuse
                this with "no speed limit" or "end of restriction".
              </li>
              <li>
                <strong>End of motorway</strong> — a blue rectangle with
                three diagonal slashes. Easy to mistake for "no through
                road".
              </li>
              <li>
                <strong>Quayside or river bank</strong> — a warning sign
                showing a car driving into water. Comes up more often in
                quizzes than you would expect.
              </li>
              <li>
                <strong>Blue motorway gantry signs</strong> with red
                crosses or speed limits — these are mandatory on smart
                motorways and ignoring them carries a fine.
              </li>
              <li>
                <strong>Tourist information</strong> — brown and white
                signs share their shape with direction signs but never
                indicate the road network itself.
              </li>
            </ul>
          ),
        },
        {
          heading: "How to revise UK road signs",
          body: (
            <ol>
              <li>
                <strong>Start with shape and colour rules.</strong> Once
                those are fixed in your head, an unfamiliar sign is rarely
                truly unfamiliar.
              </li>
              <li>
                <strong>Use flashcards or our practice quiz.</strong>
                Repetition is the best teacher for this kind of visual
                memory.
              </li>
              <li>
                <strong>Walk through the Highway Code section on signs</strong>
                end to end. The official illustrations are the same ones
                used in your theory test.
              </li>
              <li>
                <strong>Notice signs in real life.</strong> Every walk and
                drive becomes free revision once you start reading the
                signs around you.
              </li>
              <li>
                <strong>Sit a full timed quiz.</strong> Speed matters in the
                real test — the answer needs to be obvious within a couple
                of seconds.
              </li>
            </ol>
          ),
        },
        {
          heading: "From road signs to driving confidence",
          body: (
            <p>
              Mastering road signs is one of those quiet wins that pays
              dividends for a lifetime. In the short term, it shores up
              your driving theory test result. In the medium term, it
              speeds up the practical test, because instructors notice
              learners who read signs quickly and react smoothly. And in
              the long term, it makes you a calmer, safer driver who
              reads the road instead of reacting to it. Use this practice
              test alongside our wider Driving Theory and Hazard Perception
              tests, and you will arrive at your real exam with the kind
              of automatic recognition that makes signs feel like second
              nature.
            </p>
          ),
        },
      ]}
    />
  );
}
