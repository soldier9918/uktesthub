import { createFileRoute } from "@tanstack/react-router";
import {
  SeoLanding,
  buildSeoMeta,
  buildFaqAndArticleSchemas,
  type FaqItem,
} from "@/components/SeoLanding";

const PATH = "/topographical-test-london";
const TITLE = "Topographical Test London — Free Practice Questions & Routes";
const DESCRIPTION =
  "Free Topographical Assessment practice for London private hire drivers. Practice-style map reading, route planning and place-finding questions with explanations.";

const faqs: FaqItem[] = [
  {
    q: "What is the Topographical test?",
    a: "The Topographical Skills Assessment is a TfL-approved test that London private hire driver applicants must pass. It checks that you can read a London street map, identify postcodes and landmarks, and plan a sensible route from A to B without using sat nav.",
  },
  {
    q: "How long is the Topographical test?",
    a: "Most TfL-approved Topographical assessments give you around 75 minutes to complete five sections, including six route-planning questions and a series of map and index questions.",
  },
  {
    q: "What is the pass mark for the Topographical test?",
    a: "You typically need to score 60% or higher overall, and you must pass each section. The exact pass mark and section weighting can vary by approved test centre, so always check with your provider.",
  },
  {
    q: "Can I use a sat nav in the Topographical test?",
    a: "No. The whole point of the assessment is to prove you can plan and follow a route using a paper map, the A–Z index, postcodes and points of compass — not a sat nav.",
  },
  {
    q: "Is this Topographical test official?",
    a: "No. UK Test Hub is independent of TfL. Our questions are practice-style and designed to reflect common Topographical Assessment formats so you can prepare with confidence before your real test.",
  },
  {
    q: "How long should I revise for the Topographical test?",
    a: "Most candidates need 10 to 20 hours of focused practice — long enough to learn the A–Z index system, become comfortable with London postcodes and build a fast, repeatable route-planning method.",
  },
];

export const Route = createFileRoute("/topographical-test-london")({
  head: () => ({
    ...buildSeoMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
    scripts: buildFaqAndArticleSchemas({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      faqs,
    }),
  }),
  component: TopographicalLanding,
});

function TopographicalLanding() {
  return (
    <SeoLanding
      h1="Topographical Test London Practice"
      intro="Free practice-style Topographical Assessment questions for London private hire drivers — map reading, postcodes, route planning and points of compass with explanations."
      topicSlug="topographical"
      categorySlug="taxi-private-hire"
      categoryTitle="Taxi & Private Hire"
      faqs={faqs}
      relatedTests={[
        { slug: "seru", title: "SERU TfL Mock Test" },
        { slug: "phv-licence", title: "PHV Licence Knowledge Test" },
        { slug: "ph-london-regulations", title: "London Private Hire Regulations" },
        { slug: "congestion-charge", title: "Congestion Charge Quiz" },
        { slug: "ulez", title: "ULEZ Quiz" },
        { slug: "ph-passenger-safety", title: "Passenger Safety Quiz" },
      ]}
      relatedCategories={[
        { slug: "driving", title: "Driving & Transport" },
      ]}
      sections={[
        {
          heading: "What is the Topographical test?",
          body: (
            <p>
              The Topographical Skills Assessment is one of the gateway
              requirements TfL puts in front of every new London private hire
              driver applicant. The idea is simple: even in the age of sat
              nav, a licensed driver should be able to read a London street
              map, find an address from a postcode, and plan a sensible route
              between two points without electronic help. The assessment is
              delivered by approved test centres around London under
              TfL-defined rules, and although the centre and the booking
              process can vary, the structure of the test is consistent. You
              get a London map booklet, an A–Z style index, a route-planning
              worksheet, and a fixed amount of time to complete five
              connected sections.
            </p>
          ),
        },
        {
          heading: "What is in the Topographical Assessment?",
          body: (
            <>
              <p>
                The exam is split into clearly defined sections. Knowing what
                is in each one — and how long to spend on it — is the single
                biggest predictor of a first-time pass:
              </p>
              <ul>
                <li>
                  <strong>Map reading</strong> — locate streets, landmarks
                  and postcodes on a London map and use the index to find
                  page and grid references quickly.
                </li>
                <li>
                  <strong>Compass and direction</strong> — work out the
                  direction of one place from another using the eight points
                  of the compass.
                </li>
                <li>
                  <strong>Route planning</strong> — plan six routes from a
                  given pickup to a destination, listing every road in order
                  and noting any one-way streets, no-entry points and
                  restricted turns.
                </li>
                <li>
                  <strong>Index and reference work</strong> — use the index
                  alphabetically and accurately, including streets that share
                  the same name in different boroughs.
                </li>
                <li>
                  <strong>Highway Code basics</strong> — a small number of
                  questions on signs, road markings and London-specific
                  restrictions you would meet on a real fare.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "How to plan a Topographical route step by step",
          body: (
            <ol>
              <li>
                <strong>Find both addresses on the map.</strong> Use the
                index to get the page and grid for the pickup, then for the
                destination. Mark them lightly.
              </li>
              <li>
                <strong>Pick the obvious main road first.</strong> Don't try
                to be clever with shortcuts — examiners are looking for a
                safe, logical route, not the shortest one.
              </li>
              <li>
                <strong>Trace the route in pencil.</strong> Follow the line
                with your pen and write down each road name as you cross
                it.
              </li>
              <li>
                <strong>Watch for one-way streets and no-entries.</strong>
                London has many — going the wrong way down one is an
                automatic mark loss.
              </li>
              <li>
                <strong>Double-check the final turn.</strong> Most marks are
                lost on the last few roads, where it is easy to slip into a
                restricted street near the destination.
              </li>
            </ol>
          ),
        },
        {
          heading: "How to revise for the Topographical test",
          body: (
            <p>
              Successful candidates almost always combine three things. First,
              they spend a few hours just getting fluent with the A–Z index —
              looking up streets, noting page and grid references, and
              repeating until it feels mechanical. Second, they learn the
              shape of London by postcode: knowing that EC is the City, WC is
              Holborn and Covent Garden, SW is Chelsea/Wandsworth, E is the
              East End, and so on, lets you orient yourself before you even
              open the map. Third, they practise full route plans against the
              clock, using realistic pickup and destination pairs of the kind
              that come up in a real assessment. Our practice-style questions
              are written with that progression in mind, so you can move from
              quick map drills into full timed routes as your confidence
              grows.
            </p>
          ),
        },
        {
          heading: "Tips for passing the Topographical test first time",
          body: (
            <ul>
              <li>
                <strong>Bring two pens and a pencil.</strong> A pencil is
                essential for sketching the route before you commit to the
                final answer.
              </li>
              <li>
                <strong>Write neatly.</strong> If the examiner cannot read
                your road name, you will not get the mark.
              </li>
              <li>
                <strong>Manage your time per section.</strong> Don't spend
                40 minutes perfecting the first route and run out of time on
                section 5.
              </li>
              <li>
                <strong>Check restrictions twice.</strong> Bus gates, no-left
                turns and bridge weight limits are common trap features in
                Topographical questions.
              </li>
              <li>
                <strong>Stay calm.</strong> The test is designed to be
                passable. Steady, methodical work beats rushed brilliance
                every time.
              </li>
            </ul>
          ),
        },
        {
          heading: "Common Topographical mistakes to avoid",
          body: (
            <p>
              The biggest reasons candidates have to rebook are usually
              avoidable. Misreading the index — picking up "King Street W6"
              instead of "King Street EC2" — sends you to completely the
              wrong place. Skipping the one-way arrows on a map costs marks
              even when the rest of the route is correct. Forgetting to write
              the A road number where the worksheet asks for it is another
              easy mark to lose. And running out of time on the final section
              is the single most common cause of a fail. Our practice tests
              deliberately drill these traps so you build the right habits
              long before exam day.
            </p>
          ),
        },
      ]}
    />
  );
}
