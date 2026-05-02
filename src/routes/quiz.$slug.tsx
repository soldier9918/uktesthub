import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { QuizRunner } from "@/components/QuizRunner";
import { getQuiz, getQuizzesByCategory } from "@/data/quizzes";
import { getCategory } from "@/data/categories";
import { listMockSlots } from "@/data/mocks";


export const Route = createFileRoute("/quiz/$slug")({
  loader: ({ params }) => {
    const quiz = getQuiz(params.slug);
    if (!quiz) throw notFound();
    return { quiz };
  },
  head: ({ loaderData, params }) => {
    const q = loaderData?.quiz;
    const slug = params?.slug ?? "";
    if (!q) return { meta: [{ title: "Quiz — UK Test Hub" }] };
    const title = `${q.quizTitle} — Free Practice — UK Test Hub`;
    const description = q.description;
    const url = `https://www.uktesthub.com/quiz/${slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Quiz",
            name: q.quizTitle,
            about: q.description,
            educationalLevel: q.difficulty,
            numberOfQuestions: q.questions.length,
          }),
        },
      ],
    };
  },
  component: QuizPage,
});

function QuizPage() {
  const { quiz } = Route.useLoaderData();
  const category = getCategory(quiz.category);
  const isMock = quiz.slug.includes("-mock-");

  type RelatedItem = { slug: string; title: string; subtitle: string };

  let related: RelatedItem[] = [];
  let sectionTitle = `More in ${category?.title ?? ""}`;

  if (isMock) {
    sectionTitle = "More mock tests";
    related = listMockSlots(quiz.topic)
      .filter((m) => m.available && m.slug !== quiz.slug)
      .slice(0, 8)
      .map((m) => ({
        slug: m.slug,
        title: `Mock Test ${m.mockNumber}`,
        subtitle: `${m.questionsCount} Qs`,
      }));
  } else {
    related = getQuizzesByCategory(quiz.category)
      .filter((q) => q.slug !== quiz.slug)
      .slice(0, 8)
      .map((q) => ({
        slug: q.slug,
        title: q.quizTitle,
        subtitle: `${q.questions.length} Qs · ${Math.round(q.timeLimit / 60)} min`,
      }));
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-3 py-2 md:px-6 md:py-3">
        <QuizRunner key={quiz.slug} quiz={quiz} />

        <AdSlot size="leaderboard" className="mt-8" />

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold">{sectionTitle}</h2>
            <ul className="mt-4 grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <li key={r.slug} className="h-full">
                  <Link
                    to="/quiz/$slug"
                    params={{ slug: r.slug }}
                    className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-4 hover:border-coral/40 hover:shadow-soft"
                  >
                    <div className="line-clamp-2 font-medium leading-tight">
                      {r.title}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {r.subtitle}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
