import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { QuizRunner } from "@/components/QuizRunner";
import { getQuiz, getQuizzesByCategory, type Quiz } from "@/data/quizzes";
import { getCategory, findTopic } from "@/data/categories";
import { listMockSlots } from "@/data/mocks";
import { captureMockBaseUrl } from "@/lib/mock-base-url";
import { breadcrumbSchema } from "@/lib/seo";


export const Route = createFileRoute("/quiz/$slug")({
  loader: async ({ params }) => {
    // During SSR, set the absolute base URL used for fetching public/mocks/*.json
    captureMockBaseUrl();
    const quiz = await getQuiz(params.slug);
    if (!quiz) {
      // Some published runtimes can serve /mocks/*.json to browsers while not
      // allowing SSR to fetch those same static assets. Let the browser load
      // real mock tests instead of returning a false 404 from the server.
      if (/-mock-\d+$/.test(params.slug)) return { quiz: null, slug: params.slug };
      throw notFound();
    }
    return { quiz, slug: params.slug };
  },
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">
        Couldn’t load this mock test
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error instanceof Error ? error.message : "Please try again in a moment."}
      </p>
      <Link to="/" className="mt-6 inline-block text-coral hover:underline">
        Back to home
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">Mock test not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        It may have been moved or isn’t available yet.
      </p>
      <Link to="/" className="mt-6 inline-block text-coral hover:underline">
        Back to home
      </Link>
    </div>
  ),
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
    const topicSlug = slug.replace(/-mock-\d+$/, "");
    const found = topicSlug !== slug ? findTopic(topicSlug) : null;
    const scripts: Array<{ type: "application/ld+json"; children: string }> = [
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
    ];
    if (found) {
      scripts.push(
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: found.category.title, url: `/category/${found.category.slug}` },
          { name: found.topic.title, url: `/topic/${found.topic.slug}` },
          { name: q.quizTitle, url: `/quiz/${slug}` },
        ]),
      );
    }
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
      scripts,
    };
  },
  component: QuizPage,
});

function QuizPage() {
  const { quiz, slug } = Route.useLoaderData();
  if (!quiz) return <ClientMockQuizPage slug={slug} />;
  return <QuizContent quiz={quiz} />;
}

function ClientMockQuizPage({ slug }: { slug: string }) {
  const [quiz, setQuiz] = useState<Quiz | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    void getQuiz(slug).then((loaded) => {
      if (active) setQuiz(loaded ?? null);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (quiz === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-xl px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Loading mock test…</h1>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (quiz === null) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-xl px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Mock test not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            It may have been moved or isn’t available yet.
          </p>
          <Link to="/" className="mt-6 inline-block text-coral hover:underline">
            Back to home
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return <QuizContent quiz={quiz} />;
}

function QuizContent({ quiz }: { quiz: Quiz }) {
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
