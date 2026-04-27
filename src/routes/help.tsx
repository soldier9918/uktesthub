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
      intro="Step-by-step guides to get the most out of UK Test Hub — from your first practice question to interpreting your final score."
    >
      <h2>Getting started in under a minute</h2>
      <ol>
        <li>Open the <Link to="/">homepage</Link>.</li>
        <li>Pick the category that matches your exam.</li>
        <li>Select a topic (for example, "Driving Theory Test").</li>
        <li>Choose any of the 45 mock tests on the topic page.</li>
        <li>Answer 24 questions and review your results at the end.</li>
      </ol>

      <h2>Choosing the right test</h2>
      <p>
        Not sure which topic to pick? Start with the broadest test for your
        exam (e.g. "Life in the UK Test" rather than a sub-topic). Once you
        know your weak areas, use the specific topic tests to drill down.
      </p>
      <ul>
        <li><strong>Learning to drive?</strong> Driving Theory + Hazard Perception + Road Signs.</li>
        <li><strong>Settling in the UK?</strong> Life in the UK Test, then UK Laws & Rights.</li>
        <li><strong>Sitting IELTS?</strong> Begin with full IELTS Practice, then Grammar drills for weak spots.</li>
        <li><strong>Working on a building site?</strong> CSCS Card Test (Operative or Specialist as required).</li>
      </ul>

      <h2>Practice mode vs Exam mode</h2>
      <ul>
        <li>
          <strong>Practice mode</strong> — instant feedback and a written
          explanation after every question. No timer. Best for learning.
        </li>
        <li>
          <strong>Exam mode</strong> — timed, real-test feel. Results and
          full review shown at the end. Best when you're close to your
          exam date.
        </li>
      </ul>

      <h2>Tips for effective practice</h2>
      <ul>
        <li>Short, frequent sessions beat long cramming. Aim for 15–20 minutes daily.</li>
        <li>Always read the explanation, even when you got the answer right.</li>
        <li>Re-take any test where you scored below 80% within 24 hours.</li>
        <li>Mix practice mode and exam mode in the final week before your test.</li>
        <li>Don't memorise answers — focus on understanding the rule behind each question.</li>
      </ul>

      <h2>Understanding your results</h2>
      <p>
        Your score is the number of correct answers out of total questions.
        Each topic lists its own pass mark, mirroring the official exam
        wherever possible. Your <strong>best score</strong> for each mock
        test is shown on the topic page so you can track improvement.
      </p>

      <h2>Saving progress</h2>
      <p>
        Your best score for each mock test is saved in your browser's local
        storage. Because we don't require accounts, this means progress is
        per-device. Clearing your browser's site data will reset your scores.
      </p>

      <h2>Using the site on mobile</h2>
      <p>
        UK Test Hub is fully responsive and works on any modern phone or
        tablet. For an app-like experience, add the site to your home
        screen — it'll launch full-screen and feel like a native app.
      </p>

      <h2>Common issues & fixes</h2>
      <ul>
        <li>
          <strong>Quiz won't load:</strong> refresh the page. If it still
          won't load, check your internet connection.
        </li>
        <li>
          <strong>Score didn't save:</strong> private/incognito browsing
          blocks local storage. Use a normal browser window to retain
          progress.
        </li>
        <li>
          <strong>Question looks wrong:</strong> please{" "}
          <Link to="/report">report it</Link> with the quiz title and
          question number.
        </li>
      </ul>

      <h2>Accessibility help</h2>
      <p>
        UK Test Hub is built to WCAG 2.2 AA. Every quiz works with keyboard
        navigation and screen readers. If you hit a barrier, please tell us
        on the <Link to="/accessibility">Accessibility</Link> page.
      </p>

      <h2>Still need help?</h2>
      <p>
        Visit our <Link to="/faq">FAQ</Link> for short answers, or{" "}
        <Link to="/contact">contact us</Link> directly — a real person will
        reply.
      </p>
    </PageLayout>
  );
}
