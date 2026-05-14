import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Clock, Home, Lock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getSkill,
  getTest,
  LEVEL_LABEL,
  LEVEL_SHORT,
  hasLevel,
  type LevelSlug,
} from "@/data/english/categories";
import {
  countReadyEnglishMocks,
  listEnglishMockSlots,
} from "@/data/english/mocks";
import { breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute(
  "/english-language-tests/$test/$skill/$level/",
)({
  loader: ({ params }) => {
    const test = getTest(params.test);
    if (!test) throw notFound();
    const skill = getSkill(test, params.skill);
    if (!skill) throw notFound();
    if (!hasLevel(skill, params.level)) throw notFound();
    return { test, skill, level: params.level as LevelSlug };
  },
  head: ({ loaderData, params }) => {
    const test = loaderData?.test;
    const skill = loaderData?.skill;
    const level = loaderData?.level;
    if (!test || !skill || !level) {
      return { meta: [{ title: "English Practice" }] };
    }
    const title = `${test.shortTitle} ${skill.title} - ${LEVEL_SHORT[level]} | UK Test Hub`;
    const description = `Practise ${LEVEL_SHORT[level]}-level ${test.shortTitle}-style ${skill.shortTitle.toLowerCase()} questions. 45 mock tests with 24 questions each.`;
    const url = `https://www.uktesthub.com/english-language-tests/${params.test}/${params.skill}/${params.level}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
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
        ]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">Level not found</h1>
      <Link to="/category/english" className="mt-4 inline-block text-coral hover:underline">
        Back to English Language Tests
      </Link>
    </div>
  ),
  component: LevelPage,
});

function LevelPage() {
  const { test, skill, level } = Route.useLoaderData();
  const slots = listEnglishMockSlots();
  const [readyCount, setReadyCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    void countReadyEnglishMocks(test.slug, skill.slug, level).then((n) => {
      if (active) setReadyCount(n);
    });
    return () => {
      active = false;
    };
  }, [test.slug, skill.slug, level]);

  const ready = readyCount ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/category/english" className="hover:text-foreground">English Language Tests</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/english-language-tests/$test" params={{ test: test.slug }} className="hover:text-foreground">
            {test.shortTitle}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to="/english-language-tests/$test/$skill"
            params={{ test: test.slug, skill: skill.slug }}
            className="hover:text-foreground"
          >
            {skill.shortTitle}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{LEVEL_SHORT[level]}</span>
        </nav>

        <header className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-coral">
            {test.shortTitle} · {skill.shortTitle} · {LEVEL_SHORT[level]}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
            {test.shortTitle} {skill.title} — {LEVEL_LABEL[level]}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-muted-foreground">
            Practise {LEVEL_SHORT[level]}-level {test.shortTitle}-style{" "}
            {skill.shortTitle.toLowerCase()} questions. Each mock test contains
            24 unique multiple-choice questions with explanations.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <strong className="text-foreground">{ready} of 45 ready</strong> · 24 questions per test
          </p>
        </header>

        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">Mock tests</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((s, i) => {
              const isReady = readyCount !== null && i < ready;
              const pending = readyCount === null;
              return (
                <li key={s.mockNumber}>
                  <MockCard
                    testSlug={test.slug}
                    skillSlug={skill.slug}
                    level={level}
                    mockNumber={s.mockNumber}
                    state={pending ? "loading" : isReady ? "ready" : "soon"}
                  />
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Independent practice:</strong>{" "}
          UK Test Hub is an independent practice and study website. This is{" "}
          {test.shortTitle}-style practice, not an official {test.shortTitle} exam.
          Always check the official test provider or GOV.UK guidance before
          booking a real exam.
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function MockCard({
  testSlug,
  skillSlug,
  level,
  mockNumber,
  state,
}: {
  testSlug: string;
  skillSlug: string;
  level: LevelSlug;
  mockNumber: number;
  state: "ready" | "soon" | "loading";
}) {
  const inner = (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-card p-4 shadow-soft transition-all ${
        state === "ready"
          ? "border-coral/30 hover:-translate-y-0.5 hover:border-coral hover:shadow-elevated"
          : "border-border opacity-75"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold">Mock Test {mockNumber}</h3>
        {state === "soon" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
            <Lock className="h-3 w-3" /> Soon
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        24 questions · <Clock className="inline h-3 w-3" /> ~24 min
      </p>
      <div className="mt-3">
        {state === "ready" ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-coral px-3 py-1.5 text-xs font-semibold text-white">
            Start test <ArrowRight className="h-3.5 w-3.5" />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            {state === "loading" ? "Checking…" : "Coming soon"}
          </span>
        )}
      </div>
    </div>
  );

  if (state !== "ready") return inner;
  return (
    <Link
      to="/english-language-tests/$test/$skill/$level/mock-test{-$num}"
      params={{
        test: testSlug,
        skill: skillSlug,
        level,
        num: String(mockNumber),
      }}
      className="group block h-full"
    >
      {inner}
    </Link>
  );
}
