import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { CategoryIcon, accentClasses } from "@/components/CategoryIcon";
import { getCategory } from "@/data/categories";
import { getQuizzesByCategory } from "@/data/quizzes";
import { Clock, ListChecks, Gauge, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.category;
    if (!c) return { meta: [{ title: "Category — UK Test Hub" }] };
    const title = `${c.title} Practice Tests — UK Test Hub`;
    const description = c.description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const quizzes = getQuizzesByCategory(category.slug);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-gradient-hero text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="flex items-center gap-4">
            <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accentClasses[category.accent]}`}>
              <CategoryIcon name={category.icon} className="h-7 w-7" />
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Category
            </span>
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold md:text-5xl">{category.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-navy-foreground/80">{category.description}</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <AdSlot size="leaderboard" className="mb-10" />

        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="font-display text-2xl font-bold">Available tests</h2>
            <p className="mt-1 text-muted-foreground">
              All tests are free. Switch between Practice and Exam mode anytime.
            </p>

            {quizzes.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                <p className="text-muted-foreground">
                  More tests coming soon for this category.
                </p>
              </div>
            ) : (
              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {quizzes.map((q) => (
                  <li key={q.slug}>
                    <Link
                      to="/quiz/$slug"
                      params={{ slug: q.slug }}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-coral hover:shadow-elevated"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-coral/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-coral">
                          {q.difficulty}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold leading-tight">
                        {q.quizTitle}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {q.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <ListChecks className="h-3.5 w-3.5" /> {q.questions.length} Qs
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {Math.round(q.timeLimit / 60)} min
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Gauge className="h-3.5 w-3.5" /> {q.passMark}% to pass
                        </span>
                      </div>
                      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-coral">
                        Start test <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <h2 className="mt-14 font-display text-2xl font-bold">Topics in {category.title}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {category.topics.map((t) => (
                <li
                  key={t.slug}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium"
                >
                  {t.title}
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-6">
            <AdSlot size="rectangle" />
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-base font-semibold">Other categories</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {(["driving", "citizenship", "english", "education", "career", "professional", "fun"] as const)
                  .filter((s) => s !== category.slug)
                  .map((s) => {
                    const c = getCategory(s)!;
                    return (
                      <li key={s}>
                        <Link
                          to="/category/$slug"
                          params={{ slug: s }}
                          className="text-muted-foreground hover:text-coral"
                        >
                          {c.title}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
