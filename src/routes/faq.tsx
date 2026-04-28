import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Frequently Asked Questions | UK Test Hub" },
      {
        name: "description",
        content:
          "Answers to common questions about UK Test Hub's mock exams, practice mode, accounts, fees and exam coverage.",
      },
      { property: "og:title", content: "UK Test Hub — FAQ" },
      {
        property: "og:description",
        content: "Common questions about using UK Test Hub for exam practice.",
      },
    ],
  links: [{ rel: "canonical", href: "https://www.uktesthub.com/faq" }],
  }),
  component: FaqPage,
});

type Faq = { q: string; a: React.ReactNode };

const groups: { title: string; items: Faq[] }[] = [
  {
    title: "Getting started",
    items: [
      {
        q: "Is UK Test Hub really free?",
        a: "Yes. All our practice tests and mock exams are free to use. The site is supported by advertising and we have no plans to introduce paywalls.",
      },
      {
        q: "Do I need to create an account?",
        a: "No account is required to take a practice test. Just pick a category, choose a topic and start.",
      },
      {
        q: "Where do I start if I'm new?",
        a: (
          <>
            Open the <Link to="/">homepage</Link>, pick the category that
            matches your exam (e.g. Driving, English, NHS), then choose a
            topic. We recommend taking your first mock test in practice mode
            so you see the explanation after each question.
          </>
        ),
      },
      {
        q: "How many mock tests are there per topic?",
        a: "Each topic has 45 mock tests, with 24 questions per test. That gives you a long-term revision plan for any single exam.",
      },
    ],
  },
  {
    title: "About our content",
    items: [
      {
        q: "Are the questions identical to the real exam?",
        a: "No. Our questions are written to match the style, format and difficulty of official tests, but they are not the actual exam questions.",
      },
      {
        q: "Are you affiliated with the DVSA, Home Office or any exam board?",
        a: "No. UK Test Hub is an independent practice platform. We are not affiliated with the DVSA, TfL, the UK Government, IELTS, ESOL, CSCS, SIA, the NHS or any examination board.",
      },
      {
        q: "How often is content updated?",
        a: (
          <>
            We review and refresh our questions regularly to reflect the
            latest published syllabuses and rule changes. See our{" "}
            <Link to="/exam-updates">Exam Updates</Link> log for the latest
            changes.
          </>
        ),
      },
      {
        q: "How do I report an incorrect question?",
        a: (
          <>
            Use our <Link to="/report">Report a Question</Link> page. We
            typically review and act on reports within a few working days.
          </>
        ),
      },
    ],
  },
  {
    title: "Practice & exam modes",
    items: [
      {
        q: "What's the difference between practice mode and exam mode?",
        a: "Practice mode shows you the correct answer and explanation after each question, with no timer. Exam mode is timed and only shows results at the end — closer to the real test experience.",
      },
      {
        q: "Is there a pass mark?",
        a: "Each topic lists its own pass mark, which mirrors the official exam where one exists. The pass mark is shown on your result screen.",
      },
      {
        q: "Are my scores saved?",
        a: "Your best score for each mock test is saved in your browser's local storage. Clearing your browser data will reset progress.",
      },
    ],
  },
  {
    title: "Account, privacy & data",
    items: [
      {
        q: "Do you store my personal data?",
        a: (
          <>
            We don't require accounts, so we don't hold names, emails or
            passwords. We use cookies for analytics and advertising — see
            our <Link to="/privacy">Privacy Policy</Link> and{" "}
            <Link to="/cookies">Cookie Policy</Link> for full details.
          </>
        ),
      },
      {
        q: "Can I delete my data?",
        a: "Quiz progress is stored only in your browser. Clearing your browser's site data for UK Test Hub removes everything we hold about your activity.",
      },
    ],
  },
  {
    title: "Technical & device",
    items: [
      {
        q: "Can I use UK Test Hub on my phone?",
        a: "Yes. The platform is fully responsive and works on mobile, tablet and desktop browsers.",
      },
      {
        q: "Is there an app?",
        a: "Not yet. The website is designed to feel app-like in a mobile browser, and you can add it to your home screen on iOS or Android for a one-tap launcher.",
      },
      {
        q: "Does it work offline?",
        a: "Most pages need a connection. We're exploring offline support for completed mock tests in a future update.",
      },
      {
        q: "Which browsers do you support?",
        a: "The latest two versions of Chrome, Edge, Safari and Firefox on both desktop and mobile.",
      },
    ],
  },
  {
    title: "Exams & results",
    items: [
      {
        q: "Will UK Test Hub guarantee I pass?",
        a: "No site can guarantee a pass — but consistent practice with realistic mock tests is one of the most reliable ways to prepare. Use our content alongside the official guidance for your exam.",
      },
      {
        q: "Where do I book the real exam?",
        a: "Always book through the official provider — for example gov.uk for driving theory and Life in the UK, or your awarding body for CSCS, SIA, IELTS and others.",
      },
      {
        q: "I haven't found a question I'm looking for. Can you add it?",
        a: (
          <>
            Yes — please send your suggestion via{" "}
            <Link to="/feedback">Feedback</Link>. Popular requests are
            prioritised.
          </>
        ),
      },
    ],
  },
];

function FaqPage() {
  return (
    <PageLayout
      title="Frequently Asked Questions"
      intro="Quick answers to the questions we get asked most often. Can't find what you need? Drop us a message via the Contact page."
    >
      {groups.map((group) => (
        <section key={group.title}>
          <h2>{group.title}</h2>
          {group.items.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>
      ))}

      <h2>Still need help?</h2>
      <p>
        Visit the <Link to="/help">Help Centre</Link> for step-by-step
        guides, or <Link to="/contact">contact us</Link> directly.
      </p>
    </PageLayout>
  );
}
