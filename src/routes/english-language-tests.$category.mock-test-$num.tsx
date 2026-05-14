import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { QuizRunner } from "@/components/QuizRunner";
import { getEnglishCategory } from "@/data/english/categories";
import { loadEnglishMockBySlug } from "@/data/english/mocks";
import { captureMockBaseUrl } from "@/lib/mock-base-url";
import type { Quiz } from "@/data/quizzes";
import { breadcrumbSchema } from "@/lib/seo";

// ENGLISH_TOTAL_MOCKS is re-exported here implicitly via mocks import.
// Use a literal max via getEnglishCategory's totalMockTests instead.

export const Route = createFileRoute(
  "/english-language-tests/$category/mock-test-$num",
)({
  loader: async ({ params }) => {
    captureMockBaseUrl();
    const cat = getEnglishCategory(params.category);
    if (!cat) throw notFound();
    const num = parseInt(params.num, 10);
    if (!Number.isFinite(num) || num < 1 || num > cat.totalMockTests) {
      throw notFound();
    }
    const quiz = await loadEnglishMockBySlug(cat.slug, num);
    // Don't 404 on missing bank — the client will show a friendly state.
    return { cat, num, quiz: quiz ?? null };
  },
  head: ({ loaderData, params }) => {
    const cat = loaderData?.cat;
    const num = loaderData?.num ?? params.num;
    const title = cat
      ? `${cat.shortTitle} Mock Test ${num} | Free English Practice | UK Test Hub`
      : "English Mock Test — UK Test Hub";
    const description = cat
      ? `${cat.shortTitle} mock test ${num} — ${cat.questionsPerMockTest} multiple-choice questions with answers and explanations.`
      : "Free English language mock test.";
    const url = `https://www.uktesthub.com/english-language-tests/${params.category}/mock-test-${params.num}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: cat
        ? [
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "English Language Tests", url: "/english-language-tests" },
              { name: cat.title, url: `/english-language-tests/${cat.slug}` },
              {
                name: `Mock Test ${num}`,
                url: `/english-language-tests/${cat.slug}/mock-test-${num}`,
              },
            ]),
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">Mock test not found</h1>
      <Link to="/english-language-tests" className="mt-4 inline-block text-coral hover:underline">
        Back to English Language Tests
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error instanceof Error ? error.message : "Please try again."}
      </p>
    </div>
  ),
  component: EnglishMockPage,
});

function EnglishMockPage() {
  const { cat, num, quiz: ssrQuiz } = Route.useLoaderData();
  const [quiz, setQuiz] = useState<Quiz | null | undefined>(ssrQuiz);

  // If SSR couldn't reach the static asset, retry on the client.
  useEffect(() => {
    if (quiz !== null) return;
    let active = true;
    void loadEnglishMockBySlug(cat.slug, num).then((q) => {
      if (active) setQuiz(q ?? null);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat.slug, num]);

  if (quiz) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-3 py-2 md:px-6 md:py-3">
          <QuizRunner key={`${cat.slug}-${num}`} quiz={quiz} />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/english-language-tests/$category"
              params={{ category: cat.slug }}
              className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-coral/40"
            >
              Back to {cat.shortTitle}
            </Link>
            {num < cat.totalMockTests && (
              <Link
                to="/english-language-tests/$category/mock-test-$num"
                params={{ category: cat.slug, num: String(num + 1) }}
                className="rounded-lg bg-coral px-3 py-2 text-sm font-semibold text-white hover:bg-coral/90"
              >
                Next mock test →
              </Link>
            )}
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">
          {cat.shortTitle} Mock Test {num} — Coming soon
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We’re writing {cat.questionsPerMockTest} unique questions for this
          mock test. It will appear here as soon as it’s ready.
        </p>
        <Link
          to="/english-language-tests/$category"
          params={{ category: cat.slug }}
          className="mt-6 inline-block rounded-lg bg-coral px-4 py-2 text-sm font-semibold text-white hover:bg-coral/90"
        >
          Back to {cat.shortTitle}
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

