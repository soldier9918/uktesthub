import { createFileRoute } from "@tanstack/react-router";
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
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "Is UK Test Hub really free?",
    a: "Yes. All our practice tests and mock exams are free to use. The site is supported by advertising.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account is required to take a practice test. You can start any quiz instantly.",
  },
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
    a: "We review and refresh our questions regularly to reflect the latest published syllabuses and rule changes.",
  },
  {
    q: "Can I use UK Test Hub on my phone?",
    a: "Yes. The platform is fully responsive and works on mobile, tablet and desktop.",
  },
  {
    q: "How do I report an incorrect question?",
    a: "Use our Report a Question page. We typically review and act on reports within a few working days.",
  },
];

function FaqPage() {
  return (
    <PageLayout
      title="Frequently Asked Questions"
      intro="Quick answers to the questions we get asked most often."
    >
      {faqs.map((f) => (
        <div key={f.q}>
          <h2>{f.q}</h2>
          <p>{f.a}</p>
        </div>
      ))}
    </PageLayout>
  );
}
