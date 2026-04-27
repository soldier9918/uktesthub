import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a Question — UK Test Hub" },
      {
        name: "description",
        content:
          "Spotted an incorrect answer or unclear question? Report it to UK Test Hub and we'll review it.",
      },
      { property: "og:title", content: "Report a Question — UK Test Hub" },
      {
        property: "og:description",
        content: "Help us keep UK Test Hub accurate by reporting issues.",
      },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  return (
    <PageLayout
      title="Report a Question"
      intro="Help us keep UK Test Hub accurate. If you think a question or answer is wrong, please tell us."
    >
      <h2>How to report</h2>
      <p>
        Email{" "}
        <a href="mailto:reports@uktesthub.co.uk">reports@uktesthub.co.uk</a>{" "}
        with the following details:
      </p>
      <ul>
        <li>The quiz title (and category)</li>
        <li>The question number or full question text</li>
        <li>What you believe is wrong</li>
        <li>A reliable source backing up the correction (where possible)</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>We acknowledge your report within 2 working days.</li>
        <li>
          Our editors review the question against the latest official
          materials.
        </li>
        <li>If a correction is needed, we update the question on the site.</li>
        <li>
          We'll let you know the outcome — and credit you in our changelog
          if you'd like.
        </li>
      </ol>

      <h2>Thank you</h2>
      <p>
        Reader reports are one of the most valuable ways we keep UK Test Hub
        reliable. Thank you for taking the time.
      </p>
    </PageLayout>
  );
}
