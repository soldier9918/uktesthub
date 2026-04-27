import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/exam-updates")({
  head: () => ({
    meta: [
      { title: "Exam Updates — UK Test Hub" },
      {
        name: "description",
        content:
          "Latest changes to UK exams including Driving Theory, Life in the UK, IELTS, CSCS and more. Stay current before sitting your test.",
      },
      { property: "og:title", content: "Exam Updates — UK Test Hub" },
      {
        property: "og:description",
        content: "Stay informed about the latest changes to UK exams.",
      },
    ],
  }),
  component: ExamUpdatesPage,
});

const updates = [
  {
    date: "April 2026",
    title: "Highway Code refresh integrated",
    body: "Our driving theory bank has been updated to reflect the latest Highway Code amendments on hierarchy of road users and priority at junctions.",
  },
  {
    date: "March 2026",
    title: "New Life in the UK question pool",
    body: "We've added 50 new questions across British history, government and traditions to better mirror the official Life in the UK Test.",
  },
  {
    date: "February 2026",
    title: "IELTS Speaking topic packs",
    body: "Speaking Part 1, 2 and 3 sample topics expanded with model answers and band-descriptor notes.",
  },
  {
    date: "January 2026",
    title: "CSCS Operative Test refresh",
    body: "Health, safety and environment questions updated to align with the 2026 CITB syllabus.",
  },
];

function ExamUpdatesPage() {
  return (
    <PageLayout
      title="Exam Updates"
      intro="What's changed in UK exams — and what we've updated on UK Test Hub in response."
    >
      {updates.map((u) => (
        <div key={u.title}>
          <h2>{u.title}</h2>
          <p>
            <strong>{u.date}</strong> — {u.body}
          </p>
        </div>
      ))}

      <h2>Where official updates come from</h2>
      <p>
        We monitor announcements from the DVSA, Home Office, IELTS, CITB, SIA
        and other awarding bodies. Always confirm the latest details with the
        official provider before booking your test.
      </p>
    </PageLayout>
  );
}
