import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { listAllTopics } from "@/data/mocks";

type TopicEntry = { topic: string; bankCount: number; mockCount: number };

const topics: TopicEntry[] = listAllTopics()
  .map((t) => ({
    topic: t.topic,
    bankCount: t.mocks.reduce((n, m) => n + (m.questionCount ?? 0), 0),
    mockCount: t.mocks.length,
  }))
  .sort((a, b) => a.topic.localeCompare(b.topic));

export const Route = createFileRoute("/admin-kb20/questions/")({
  head: () => ({ meta: [{ title: "Question Bank Browser — UK Test Hub" }, { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" }] }),
  component: () => (
    <AdminGate>
      <TopicsIndex />
    </AdminGate>
  ),
});

function TopicsIndex() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold">Question Bank Browser</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Browse and edit every question across all topics ({topics.length} topics).
      </p>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <li key={t.topic}>
            <Link
              to="/admin-kb20/questions/$topic"
              params={{ topic: t.topic }}
              className="block rounded-xl border border-border bg-card p-4 hover:border-coral/40 hover:shadow-soft"
            >
              <div className="font-medium">{t.topic}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t.bankCount} questions · {t.mockCount} mocks
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
