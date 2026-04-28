import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { QuizRunner } from "@/components/QuizRunner";
import { getQuiz, getQuizzesByCategory } from "@/data/quizzes";
import { getCategory } from "@/data/categories";


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
  const related = getQuizzesByCategory(quiz.category)
    .filter((q) => q.slug !== quiz.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
        <QuizRunner quiz={quiz} />

        <AdSlot size="leaderboard" className="mt-12" />

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold">More in {category?.title}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/quiz/$slug"
                    params={{ slug: r.slug }}
                    className="block rounded-2xl border border-border bg-card p-4 hover:border-coral/40 hover:shadow-soft"
                  >
                    <div className="font-medium leading-tight">{r.quizTitle}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {r.questions.length} Qs · {Math.round(r.timeLimit / 60)} min
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
