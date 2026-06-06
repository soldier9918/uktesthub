import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/seru-tfl")({
  head: () => ({
    meta: [
      { title: "SERU TfL Test Practice — Free Mock | UK Test Hub" },
      {
        name: "description",
        content:
          "Free practice for the Transport for London SERU (Safety, Equality and Regulatory Understanding) assessment for private hire drivers. Mock questions and explanations.",
      },
      { property: "og:title", content: "SERU TfL Test Practice" },
      {
        property: "og:description",
        content:
          "Prepare for the TfL SERU assessment with realistic mock questions.",
      }, { property: "og:url", content: "https://www.uktesthub.com/seru-tfl" }
    ],
  links: [{ rel: "canonical", href: "https://www.uktesthub.com/seru-tfl" }],
  }),
  component: SeruPage,
});

function SeruPage() {
  return (
    <PageLayout
      title="SERU TfL Test Practice"
      intro="Prepare for the Transport for London SERU (Safety, Equality and Regulatory Understanding) assessment for private hire drivers."
    >
      <p>
        <Link to="/topic/$slug" params={{ slug: "seru" }}>
          ▶ Choose from 45 free SERU TfL mock tests
        </Link>
      </p>

      <h2>About the SERU assessment</h2>
      <p>
        The SERU assessment is a Transport for London requirement for private
        hire drivers in London. It covers safety, equality, regulatory
        understanding, passenger protection and the responsibilities that come
        with the licence, all based on the PHV Driver's Handbook. TfL treats
        SERU as a competency assessment rather than a simple percentage-pass
        paper, and uses multiple-choice and missing-word / sentence-completion
        style questions.
      </p>

      <h2>What's tested</h2>
      <ul>
        <li>Safety — safeguarding, passenger safety, vehicle safety and roadworthiness</li>
        <li>Equality — protected characteristics, reasonable adjustments and the Equality Act 2010</li>
        <li>Regulatory understanding — TfL licensing rules, notification duties, insurance and MOT for hire and reward</li>
        <li>Passenger protection — assistance dogs, wheelchair accessibility, vulnerable passengers and reporting concerns</li>
        <li>Driver conduct — professional behaviour, lost property, fares and routes</li>
      </ul>

      <h2>Our practice target</h2>
      <p>
        Each of our mocks is a 24-question SERU practice mock with a practice
        target of 75%. This target is set for mock tests only — it gives you a
        safety margin so you walk into the real assessment with confidence.
      </p>


      <h2>How to prepare</h2>
      <ol>
        <li>Read TfL's official PHV Driver's Handbook</li>
        <li>Complete our mock test in <strong>practice mode</strong> for instant explanations</li>
        <li>Re-take in <strong>exam mode</strong> against the timer</li>
      </ol>

      <p>
        Browse all{" "}
        <Link to="/category/$slug" params={{ slug: "taxi-private-hire" }}>
          taxi & private hire tests
        </Link>{" "}
        — including SERU, Topographical, PHV Licence, ULEZ and Congestion Charge.
      </p>

      <p className="text-sm text-muted-foreground">
        UK Test Hub is not affiliated with Transport for London. SERU is a
        trademark of TfL and used here for reference only.
      </p>
    </PageLayout>
  );
}
