import { createFileRoute } from "@tanstack/react-router";
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
      { property: "og:title", content: "Feedback — UK Test Hub" },
      {
        property: "og:description",
        content: "Tell us what's working and what we can improve.",
      },
    ],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  return (
    <PageLayout
      title="Feedback"
      intro="We build UK Test Hub for our learners. Tell us what's working, what's not, and what you'd like to see next."
    >
      <h2>Send us your thoughts</h2>
      <p>
        Email{" "}
        <a href="mailto:feedback@uktesthub.co.uk">feedback@uktesthub.co.uk</a>
        . Useful things to include:
      </p>
      <ul>
        <li>Which test or feature you're using</li>
        <li>What you liked or found difficult</li>
        <li>Ideas for new quizzes or categories</li>
        <li>Bugs or visual issues (with screenshots if possible)</li>
      </ul>

      <h2>Feature requests</h2>
      <p>
        Want a new exam covered, dark mode, progress tracking or printable
        revision sheets? Let us know — popular requests get prioritised.
      </p>

      <h2>Thanks for helping us improve</h2>
      <p>
        Every message is read by a real person on the team. We genuinely
        appreciate the time you take to help us make UK Test Hub better.
      </p>
    </PageLayout>
  );
}
