import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — UK Test Hub" },
      {
        name: "description",
        content:
          "Get in touch with UK Test Hub. Email us with questions, feedback, partnership enquiries or to report an error in a practice test.",
      },
      { property: "og:title", content: "Contact UK Test Hub" },
      {
        property: "og:description",
        content: "Reach the UK Test Hub team — we read every message.",
      }, { property: "og:url", content: "https://www.uktesthub.com/contact" }
    ],
  links: [{ rel: "canonical", href: "https://www.uktesthub.com/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageLayout
      title="Contact Us"
      intro="We'd love to hear from you. Whether it's feedback, a partnership or a question correction, get in touch below."
    >
      <h2>General enquiries</h2>
      <p>
        Email: <a href="mailto:support@uktesthub.com">support@uktesthub.com</a>
      </p>

      <h2>Report an issue with a question</h2>
      <p>
        Spotted something wrong? Please use our{" "}
        <a href="/report">Report a Question</a> page so we can fix it quickly.
      </p>

      <h2>Press &amp; partnerships</h2>
      <p>
        For media or partnership opportunities, email{" "}
        <a href="mailto:support@uktesthub.com">support@uktesthub.com</a>.
      </p>

      <h2>Response times</h2>
      <p>
        We aim to respond to all messages within 2 working days. Please note we
        cannot offer official exam guidance — for that, refer to the relevant
        examination board.
      </p>
    </PageLayout>
  );
}
