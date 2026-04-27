import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { QuizRunner } from "@/components/QuizRunner";
import { getQuiz, getQuizzesByCategory } from "@/data/quizzes";
import { getCategory } from "@/data/categories";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/quiz/$slug")({
  loader: ({ params }) => {
    const quiz = getQuiz(params.slug);
    if (!quiz) throw notFound();
    return { quiz };
  },
  head: ({ loaderData }) => {
    const q = loaderData?.quiz;
    if (!q) return { meta: [{ title: "Quiz — UK Test Hub" }] };
    const title = `${q.quizTitle} — Free Practice — UK Test Hub`;
    const description = q.description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
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

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          {category && (
            <>
              <Link to="/category/$slug" params={{ slug: category.slug }} className="hover:text-foreground">
                {category.title}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/topic/$slug" params={{ slug: quiz.topic }} className="hover:text-foreground">
                {category.topics.find((t) => t.slug === quiz.topic)?.title ?? quiz.topic}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="line-clamp-1 text-foreground">{quiz.quizTitle}</span>
        </nav>

        <AdSlot size="leaderboard" className="mb-8" />

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <QuizRunner quiz={quiz} />
          </div>
          <aside className="space-y-6">
            <div className="sticky top-20 space-y-6">
              <AdSlot size="rectangle" />
              {related.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-display text-base font-semibold">More in {category?.title}</h3>
                  <ul className="mt-3 space-y-3 text-sm">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          to="/quiz/$slug"
                          params={{ slug: r.slug }}
                          className="block rounded-lg p-2 -m-2 hover:bg-muted"
                        >
                          <div className="font-medium">{r.quizTitle}</div>
                          <div className="text-xs text-muted-foreground">
                            {r.questions.length} Qs · {Math.round(r.timeLimit / 60)} min
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
