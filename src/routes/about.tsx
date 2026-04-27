import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — UK Test Hub" },
      {
        name: "description",
        content:
          "UK Test Hub is an independent practice platform offering free mock tests for Driving Theory, Life in the UK, IELTS, ESOL, CSCS, SIA and more.",
      },
      { property: "og:title", content: "About UK Test Hub" },
      {
        property: "og:description",
        content:
          "Learn about UK Test Hub — our mission to help learners pass UK exams with free, high-quality mock tests.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageLayout
      title="About UK Test Hub"
      intro="We're an independent practice platform built to help people across the UK pass their exams with confidence — for free."
    >
      <h2>Our mission</h2>
      <p>
        UK Test Hub exists to make exam preparation fair, accessible and
        stress-free. Whether you're learning to drive, sitting the Life in the
        UK Test, applying for a CSCS card or improving your English for IELTS,
        we provide free, high-quality practice questions with clear
        explanations.
      </p>

      <h2>What we offer</h2>
      <ul>
        <li>Mock tests modelled on the latest exam formats</li>
        <li>Practice mode with instant feedback and detailed explanations</li>
        <li>Timed exam mode that mirrors the real test experience</li>
        <li>Coverage across driving, citizenship, English, careers and trades</li>
        <li>No sign-up required — just start practising</li>
      </ul>

      <h2>Who we are</h2>
      <p>
        UK Test Hub is run by a small team of educators and developers based in
        the UK. We're not affiliated with any government body or examination
        board. Our content is researched from publicly available materials and
        reviewed regularly to stay accurate.
      </p>

      <h2>Get in touch</h2>
      <p>
        Have feedback, a question to suggest, or spotted an error?{" "}
        <a href="/contact">Contact us</a> — we read every message.
      </p>
    </PageLayout>
  );
}
