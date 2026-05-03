import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";

type AnyMockFile = {
  topic?: string;
  version?: number;
  bank?: unknown[];
  tests?: { questions: unknown[] }[];
  mocks?: unknown[];
};

const modules = import.meta.glob<AnyMockFile>("../data/mocks/*.json", {
  eager: true,
  import: "default",
});

type TopicEntry = { topic: string; bankCount: number; mockCount: number };

const topics: TopicEntry[] = Object.values(modules)
  .filter((f): f is AnyMockFile => !!f && typeof f.topic === "string")
  .map((f) => {
    const bankCount = Array.isArray(f.bank)
      ? f.bank.length
      : Array.isArray(f.tests)
        ? f.tests.reduce((n, t) => n + (t.questions?.length ?? 0), 0)
        : 0;
    const mockCount = Array.isArray(f.mocks)
      ? f.mocks.length
      : Array.isArray(f.tests)
        ? f.tests.length
        : 0;
    return { topic: f.topic!, bankCount, mockCount };
  })
  .sort((a, b) => a.topic.localeCompare(b.topic));

export const Route = createFileRoute("/admin/questions/")({
  head: () => ({ meta: [{ title: "Question Bank Browser — UK Test Hub" }] }),
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
              to="/admin/questions/$topic"
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
