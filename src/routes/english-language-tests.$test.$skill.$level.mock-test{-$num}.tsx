import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { QuizRunner } from "@/components/QuizRunner";
import {
  getSkill,
  getTest,
  hasLevel,
  LEVEL_SHORT,
  type LevelSlug,
} from "@/data/english/categories";
import { loadEnglishMock } from "@/data/english/mocks";
import { captureMockBaseUrl } from "@/lib/mock-base-url";
import type { Quiz } from "@/data/quizzes";
import { breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute(
  "/english-language-tests/$test/$skill/$level/mock-test{-$num}",
)({
  loader: async ({ params }) => {
    captureMockBaseUrl();
    const test = getTest(params.test);
    if (!test) throw notFound();
    const skill = getSkill(test, params.skill);
    if (!skill) throw notFound();
    if (!hasLevel(skill, params.level)) throw notFound();
    const level = params.level as LevelSlug;
    const num = parseInt(params.num ?? "", 10);
    if (!Number.isFinite(num) || num < 1 || num > 45) throw notFound();
    const quiz = await loadEnglishMock(test.slug, skill.slug, level, num);
    return { test, skill, level, num, quiz: quiz ?? null };
  },
  head: ({ loaderData, params }) => {
    const test = loaderData?.test;
    const skill = loaderData?.skill;
    const level = loaderData?.level;
    const num = loaderData?.num ?? params.num;
    const title =
      test && skill && level
        ? `${test.shortTitle} ${skill.shortTitle} ${LEVEL_SHORT[level]} — Mock Test ${num} | UK Test Hub`
        : "English Mock Test — UK Test Hub";
    const description =
      test && skill && level
        ? `${test.shortTitle}-style ${skill.shortTitle.toLowerCase()} mock test ${num} at ${LEVEL_SHORT[level]} level — 24 questions with explanations.`
        : "Free English language mock test.";
    const url = `https://www.uktesthub.com/english-language-tests/${params.test}/${params.skill}/${params.level}/mock-test-${params.num}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts:
        test && skill && level
          ? [
              breadcrumbSchema([
                { name: "Home", url: "/" },
                { name: "English Language Tests", url: "/category/english" },
                { name: test.tagline, url: `/english-language-tests/${test.slug}` },
                {
                  name: `${test.shortTitle} ${skill.shortTitle}`,
                  url: `/english-language-tests/${test.slug}/${skill.slug}`,
                },
                {
                  name: LEVEL_SHORT[level],
                  url: `/english-language-tests/${test.slug}/${skill.slug}/${level}`,
                },
                {
                  name: `Mock Test ${num}`,
                  url: `/english-language-tests/${test.slug}/${skill.slug}/${level}/mock-test-${num}`,
                },
              ]),
            ]
          : [],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">Mock test not found</h1>
      <Link to="/category/english" className="mt-4 inline-block text-coral hover:underline">
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
  const { test, skill, level, num, quiz: ssrQuiz } = Route.useLoaderData();
  const [quiz, setQuiz] = useState<Quiz | null | undefined>(ssrQuiz);

  useEffect(() => {
    if (quiz !== null) return;
    let active = true;
    void loadEnglishMock(test.slug, skill.slug, level, num).then((q) => {
      if (active) setQuiz(q ?? null);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test.slug, skill.slug, level, num]);

  if (quiz) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-3 py-2 md:px-6 md:py-3">
          <QuizRunner key={`${test.slug}-${skill.slug}-${level}-${num}`} quiz={quiz} />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/english-language-tests/$test/$skill/$level"
              params={{ test: test.slug, skill: skill.slug, level }}
              className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-coral/40"
            >
              Back to {test.shortTitle} {skill.shortTitle} {LEVEL_SHORT[level]}
            </Link>
            {num < 45 && (
              <Link
                to="/english-language-tests/$test/$skill/$level/mock-test{-$num}"
                params={{
                  test: test.slug,
                  skill: skill.slug,
                  level,
                  num: String(num + 1),
                }}
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
          {test.shortTitle} {skill.shortTitle} {LEVEL_SHORT[level]} — Mock Test {num} — Coming soon
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We’re writing 24 unique questions for this mock test. It will appear
          here as soon as it’s ready.
        </p>
        <Link
          to="/english-language-tests/$test/$skill/$level"
          params={{ test: test.slug, skill: skill.slug, level }}
          className="mt-6 inline-block rounded-lg bg-coral px-4 py-2 text-sm font-semibold text-white hover:bg-coral/90"
        >
          Back to {test.shortTitle} {skill.shortTitle} {LEVEL_SHORT[level]}
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
