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
      },
    ],
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
        <Link to="/quiz/$slug" params={{ slug: "seru-tfl-mock-1" }}>
          ▶ Start the SERU TfL Mock Test 1
        </Link>
      </p>

      <h2>About the SERU assessment</h2>
      <p>
        The SERU assessment is a Transport for London requirement for private
        hire drivers in London. It covers safety, equality, regulatory
        knowledge and the responsibilities that come with the licence.
      </p>

      <h2>What's tested</h2>
      <ul>
        <li>Safeguarding and passenger safety</li>
        <li>Equality and disability awareness</li>
        <li>The Equality Act 2010 in practice</li>
        <li>TfL licensing rules and conditions</li>
        <li>Vehicle and driver standards</li>
      </ul>

      <h2>How to prepare</h2>
      <ol>
        <li>Read TfL's official SERU guidance booklet</li>
        <li>Complete our mock test in <strong>practice mode</strong> for instant explanations</li>
        <li>Re-take in <strong>exam mode</strong> against the timer</li>
      </ol>

      <p>
        Browse all{" "}
        <Link to="/category/$slug" params={{ slug: "professional" }}>
          professional certification tests
        </Link>{" "}
        — including CSCS, SIA and First Aid.
      </p>

      <p className="text-sm text-muted-foreground">
        UK Test Hub is not affiliated with Transport for London. SERU is a
        trademark of TfL and used here for reference only.
      </p>
    </PageLayout>
  );
}
