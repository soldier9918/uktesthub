import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — UK Test Hub" },
      {
        name: "description",
        content:
          "UK Test Hub is an independent practice platform and is not affiliated with the DVSA, TfL, UK Government, IELTS, ESOL, CSCS, SIA, NHS or any exam board.",
      },
      { property: "og:title", content: "Disclaimer — UK Test Hub" },
      {
        property: "og:description",
        content:
          "Important information about UK Test Hub's independence and the limits of our content.",
      },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <PageLayout
      title="Disclaimer"
      intro="Important information about UK Test Hub and the content we publish."
    >
      <h2>Independent practice platform</h2>
      <p>
        UK Test Hub is an independent practice platform. We are{" "}
        <strong>not affiliated with</strong> the DVSA, Transport for London
        (TfL), the UK Government, IELTS, ESOL, CSCS, SIA, the NHS or any
        examination board, government department or awarding organisation,
        unless explicitly stated.
      </p>

      <h2>Trademarks</h2>
      <p>
        All trademarks, logos and brand names mentioned on this site are the
        property of their respective owners. They are used for reference and
        identification purposes only and do not imply endorsement.
      </p>

      <h2>No guarantee of results</h2>
      <p>
        Our practice tests are designed to help you prepare. We cannot
        guarantee a pass in any official examination. Always consult the
        official exam provider for the latest syllabus, rules and booking
        information.
      </p>

      <h2>Accuracy of content</h2>
      <p>
        We work hard to keep our questions and explanations accurate and
        up-to-date, but we make no warranty as to completeness or accuracy. If
        you spot an error, please <a href="/report">report it</a>.
      </p>

      <h2>External links</h2>
      <p>
        Where we link to external websites, we are not responsible for their
        content, security or privacy practices.
      </p>

      <h2>No professional advice</h2>
      <p>
        Content on UK Test Hub does not constitute legal, medical, financial
        or professional advice. Seek qualified professional advice where
        appropriate.
      </p>
    </PageLayout>
  );
}
