import { createFileRoute, Link } from "@tanstack/react-router";
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
  links: [{ rel: "canonical", href: "https://www.uktesthub.com/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageLayout
      title="About UK Test Hub"
      intro="We're an independent practice platform built to help people across the UK pass their exams with confidence — for free, on any device, with no sign-up required."
    >
      <h2>Our story</h2>
      <p>
        UK Test Hub started with a simple frustration: most UK exam practice
        sites were either expensive, riddled with adverts that broke the
        learning flow, or built on out-of-date content. We thought learners
        deserved better — a calm, modern place to revise that respects their
        time.
      </p>
      <p>
        Today the site covers eight major exam areas with hundreds of mock
        tests, all free to use and continually refreshed by our small team
        of educators and developers based in the UK.
      </p>

      <h2>Our mission</h2>
      <p>
        We believe quality exam preparation should be a right, not a
        privilege. Whether you're learning to drive, sitting the Life in the
        UK Test, applying for a CSCS card or improving your English for
        IELTS, UK Test Hub gives you the same high-quality practice
        questions and explanations that paid platforms charge for.
      </p>

      <h2>What makes us different</h2>
      <ul>
        <li>
          <strong>No paywalls.</strong> Every mock test, every question and
          every explanation is free, forever.
        </li>
        <li>
          <strong>No sign-up.</strong> Open the site, pick a topic, start
          practising. We don't ask for an email to get started.
        </li>
        <li>
          <strong>Modern, accessible design.</strong> Fast, responsive, and
          built to WCAG 2.2 AA standards so it works for everyone.
        </li>
        <li>
          <strong>Real explanations.</strong> Each answer is followed by a
          plain-English explanation — not just a tick or a cross.
        </li>
        <li>
          <strong>UK-focused.</strong> All content is written specifically
          for UK exams, with UK terminology, units and context.
        </li>
      </ul>

      <h2>How we build our questions</h2>
      <p>
        Our questions are written by editors who specialise in each subject
        area. We start from the official syllabus or guidance — for example,
        the Highway Code for driving, the Home Office handbook for Life in
        the UK, or CITB's published outcomes for CSCS. Each question is
        reviewed for clarity, factual accuracy and relevance before it
        reaches the site.
      </p>
      <p>
        We deliberately match the format and difficulty of the real test so
        your practice score is a meaningful predictor of your real-test
        performance.
      </p>

      <h2>Editorial standards</h2>
      <ul>
        <li>Every question is reviewed against current published guidance.</li>
        <li>Reader reports are triaged within 2 working days.</li>
        <li>Major regulatory changes trigger a full topic refresh.</li>
        <li>
          We publish a monthly{" "}
          <Link to="/exam-updates">Exam Updates</Link> log so you can see
          what's changed.
        </li>
      </ul>

      <h2>Our values</h2>
      <ul>
        <li>
          <strong>Accessible.</strong> Free, fast, mobile-friendly, screen-reader-friendly.
        </li>
        <li>
          <strong>Honest.</strong> We don't pretend to be the official exam
          provider, and we don't oversell our results.
        </li>
        <li>
          <strong>Practical.</strong> Every feature has to earn its place by
          helping you pass.
        </li>
      </ul>

      <h2>Who we are</h2>
      <p>
        UK Test Hub is run by a small team of educators and developers based
        in the UK. We're not affiliated with any government body or
        examination board. Our content is researched from publicly available
        materials and reviewed regularly to stay accurate.
      </p>

      <h2>Looking ahead</h2>
      <p>
        Over the next year we're focused on broadening coverage (more NHS
        and trade-skills exams), adding optional progress tracking for users
        who want it, and translating key revision material into community
        languages.
      </p>

      <h2>Get in touch</h2>
      <p>
        Have feedback, a question to suggest, or spotted an error?{" "}
        <Link to="/contact">Contact us</Link> — we read every message.
      </p>
    </PageLayout>
  );
}
