import { createFileRoute, Link } from "@tanstack/react-router";
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
  links: [{ rel: "canonical", href: "https://www.uktesthub.com/report" }],
  }),
  component: ReportPage,
});

function ReportPage() {
  return (
    <PageLayout
      title="Report a Question"
      intro="Help us keep UK Test Hub accurate. If you spot a question that looks wrong, unclear or out of date, please tell us — reader reports are one of the most valuable ways we improve."
    >
      <h2>When to report a question</h2>
      <ul>
        <li>The "correct" answer doesn't match official guidance.</li>
        <li>The question wording is ambiguous or misleading.</li>
        <li>A typo, formatting error or broken image.</li>
        <li>The content is out of date after a rule or syllabus change.</li>
      </ul>

      <h2>How to report</h2>
      <p>
        Email{" "}
        <a href="mailto:reports@uktesthub.co.uk">reports@uktesthub.co.uk</a>{" "}
        with the following details:
      </p>
      <ul>
        <li>The quiz title and category (or the URL).</li>
        <li>The question number or full question text.</li>
        <li>What you believe is wrong.</li>
        <li>A reliable source backing up the correction (where possible).</li>
        <li>A screenshot if it helps explain the issue.</li>
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

      <h2>Tracking changes</h2>
      <p>
        Notable updates are summarised in our{" "}
        <Link to="/exam-updates">Exam Updates</Link> log so the wider
        community can see what's changed.
      </p>

      <h2>Thank you</h2>
      <p>
        Reader reports are one of the most valuable ways we keep UK Test
        Hub reliable. Thank you for taking the time.
      </p>
    </PageLayout>
  );
}
