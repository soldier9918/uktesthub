import { createFileRoute, Link } from "@tanstack/react-router";
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
      }, { property: "og:url", content: "https://www.uktesthub.com/disclaimer" }
    ],
  links: [{ rel: "canonical", href: "https://www.uktesthub.com/disclaimer" }],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <PageLayout
      title="Disclaimer"
      intro="Important information about UK Test Hub and the content we publish. Please read carefully before relying on any practice material."
    >
      <h2>1. Independent practice platform</h2>
      <p>
        UK Test Hub is an independent practice platform. We are{" "}
        <strong>not affiliated with</strong> the DVSA, Transport for London
        (TfL), the UK Government, IELTS, ESOL, CSCS, SIA, the NHS or any
        examination board, government department or awarding organisation,
        unless explicitly stated.
      </p>

      <h2>2. Trademarks</h2>
      <p>
        All trademarks, logos and brand names mentioned on this site are
        the property of their respective owners. They are used for
        reference and identification purposes only and do not imply
        endorsement.
      </p>

      <h2>3. No guarantee of results</h2>
      <p>
        Our practice tests are designed to help you prepare. We cannot
        guarantee a pass in any official examination. Always consult the
        official exam provider for the latest syllabus, rules and booking
        information.
      </p>

      <h2>4. Accuracy of content</h2>
      <p>
        We work hard to keep our questions and explanations accurate and
        up-to-date, but we make no warranty as to completeness or
        accuracy. Rules change, and small differences may exist between
        our content and the live exam.
      </p>
      <p>
        If you spot an error, please <Link to="/report">report it</Link>{" "}
        and we'll review it promptly.
      </p>

      <h2>5. External links</h2>
      <p>
        Where we link to external websites, we are not responsible for
        their content, security or privacy practices. Following an external
        link is at your own risk.
      </p>

      <h2>6. Advertising</h2>
      <p>
        UK Test Hub is supported by advertising. The presence of an advert
        on the site is not an endorsement of the advertiser, their product
        or their service.
      </p>

      <h2>7. No professional advice</h2>
      <p>
        Content on UK Test Hub does not constitute legal, medical,
        financial or professional advice. Seek qualified professional
        advice where appropriate.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, UK Test Hub is not liable
        for any loss or damage arising from reliance on content published
        on this site. See our <Link to="/terms">Terms and Conditions</Link>{" "}
        for full details.
      </p>
    </PageLayout>
  );
}
