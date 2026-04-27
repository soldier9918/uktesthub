import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Centre — UK Test Hub" },
      {
        name: "description",
        content:
          "Get help using UK Test Hub. Guidance on practice mode, exam mode, scoring, mobile use and account-free access.",
      },
      { property: "og:title", content: "Help Centre — UK Test Hub" },
      {
        property: "og:description",
        content: "Guides and support for using UK Test Hub.",
      },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  return (
    <PageLayout
      title="Help Centre"
      intro="Quick guides to get the most out of UK Test Hub."
    >
      <h2>Getting started</h2>
      <p>
        Head to the <Link to="/">homepage</Link> and pick a category. You can
        start any quiz instantly — no sign-up required.
      </p>

      <h2>Practice mode vs Exam mode</h2>
      <ul>
        <li>
          <strong>Practice mode</strong> — instant feedback and a written
          explanation after every question. No timer.
        </li>
        <li>
          <strong>Exam mode</strong> — timed, real-test feel. Results and full
          review shown at the end.
        </li>
      </ul>

      <h2>How is my score calculated?</h2>
      <p>
        Your score is the number of correct answers out of total questions.
        Each quiz lists its own pass mark.
      </p>

      <h2>Using the site on mobile</h2>
      <p>
        UK Test Hub is fully responsive. Everything works on a phone, tablet
        or desktop browser.
      </p>

      <h2>Saving progress</h2>
      <p>
        Quiz progress is held in your browser session. We don't store quiz
        results to your account because no account is required.
      </p>

      <h2>Still need help?</h2>
      <p>
        Visit our <Link to="/faq">FAQ</Link> or{" "}
        <Link to="/contact">contact us</Link>.
      </p>
    </PageLayout>
  );
}
