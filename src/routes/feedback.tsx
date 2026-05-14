import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — UK Test Hub" },
      {
        name: "description",
        content:
          "Share your feedback, ideas and feature requests with the UK Test Hub team.",
      },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Feedback — UK Test Hub" },
      {
        property: "og:description",
        content: "Tell us what's working and what we can improve.",
      }, { property: "og:url", content: "https://www.uktesthub.com/feedback" }
    ],
  links: [{ rel: "canonical", href: "https://www.uktesthub.com/feedback" }],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  return (
    <PageLayout
      title="Feedback"
      intro="We build UK Test Hub for our learners. Tell us what's working, what's not, and what you'd like to see next — every message is read by a real person on the team."
    >
      <h2>Send us your thoughts</h2>
      <p>
        Email{" "}
        <a href="mailto:support@uktesthub.com">support@uktesthub.com</a>
        . Useful things to include:
      </p>
      <ul>
        <li>Which test or feature you're using.</li>
        <li>What you liked or found difficult.</li>
        <li>Ideas for new quizzes or categories.</li>
        <li>Bugs or visual issues (with screenshots if possible).</li>
        <li>The device and browser you're using.</li>
      </ul>

      <h2>Feature requests</h2>
      <p>
        Want a new exam covered, dark mode, progress tracking or printable
        revision sheets? Let us know — popular requests get prioritised.
      </p>

      <h2>What we don't handle here</h2>
      <ul>
        <li>
          Errors in specific questions — please use{" "}
          <Link to="/report">Report a Question</Link> instead.
        </li>
        <li>
          Accessibility barriers — please email{" "}
          <a href="mailto:support@uktesthub.com">support@uktesthub.com</a> so we can prioritise a fix.
        </li>
        <li>
          Press or partnership enquiries —{" "}
          <Link to="/contact">contact us</Link> directly.
        </li>
      </ul>

      <h2>Response times</h2>
      <p>
        We aim to acknowledge feedback within 5 working days. We can't
        always reply individually to every suggestion, but everything is
        read and logged.
      </p>

      <h2>Thanks for helping us improve</h2>
      <p>
        We genuinely appreciate the time you take to help us make UK Test
        Hub better — keep it coming.
      </p>
    </PageLayout>
  );
}
