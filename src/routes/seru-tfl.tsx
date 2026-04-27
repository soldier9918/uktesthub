import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/seru-tfl")({
  head: () => ({
    meta: [
      { title: "SERU TfL Test Practice — UK Test Hub" },
      {
        name: "description",
        content:
          "Free practice for the Transport for London SERU (Safety, Equality and Regulatory Understanding) assessment for private hire drivers.",
      },
      { property: "og:title", content: "SERU TfL Test Practice" },
      {
        property: "og:description",
        content:
          "Prepare for the TfL SERU assessment with mock questions and explanations.",
      },
    ],
  }),
  component: SeruPage,
});

function SeruPage() {
  return (
    <PageLayout
      title="SERU TfL Test Practice"
      intro="Get ready for the Transport for London SERU (Safety, Equality and Regulatory Understanding) assessment for private hire drivers."
    >
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

      <h2>Practice with us</h2>
      <p>
        We're expanding our SERU coverage. In the meantime, browse{" "}
        <Link to="/category/$slug" params={{ slug: "professional" }}>
          related professional tests
        </Link>{" "}
        or check{" "}
        <Link to="/exam-updates">Exam Updates</Link> for the latest changes.
      </p>

      <p className="text-sm text-muted-foreground">
        UK Test Hub is not affiliated with Transport for London. SERU is a
        trademark of TfL and used here for reference only.
      </p>
    </PageLayout>
  );
}
