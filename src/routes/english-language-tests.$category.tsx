import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, BookText, ChevronRight, Home, Clock, Lock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getEnglishCategory,
  ENGLISH_TYPE_LABELS,
} from "@/data/english/categories";
import {
  countReadyEnglishMocks,
  listEnglishMockSlots,
} from "@/data/english/mocks";
import { breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/english-language-tests/$category")({
  loader: ({ params }) => {
    const cat = getEnglishCategory(params.category);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "English Practice — UK Test Hub" }] };
    const { cat } = loaderData;
    const title = `${cat.title} | Free English Mock Tests | UK Test Hub`;
    const description = `Practise ${cat.shortTitle} with ${cat.totalMockTests} free mock tests, each containing ${cat.questionsPerMockTest} questions with explanations.`;
    const url = `https://www.uktesthub.com/english-language-tests/${params.category}`;
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
          { name: "English Language Tests", url: "/english-language-tests" },
          { name: cat.title, url: `/english-language-tests/${cat.slug}` },
        ]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">Category not found</h1>
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
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const slots = listEnglishMockSlots(cat.slug);
  const [readyCount, setReadyCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    void countReadyEnglishMocks(cat.slug).then((n) => {
      if (active) setReadyCount(n);
    });
    return () => {
      active = false;
    };
  }, [cat.slug]);

  const ready = readyCount ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/english-language-tests" className="hover:text-foreground">
            English Language Tests
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{cat.shortTitle}</span>
        </nav>

        {/* Header */}
        <header className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-coral">
            {ENGLISH_TYPE_LABELS[cat.type as keyof typeof ENGLISH_TYPE_LABELS]}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">{cat.title}</h1>
          <p className="mt-3 max-w-3xl text-base text-muted-foreground">{cat.description}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            <strong className="text-foreground">{ready} of {cat.totalMockTests} ready</strong> ·{" "}
            {cat.questionsPerMockTest} questions per test · multiple-choice with explanations
          </p>
        </header>

        {/* Study guide link */}
        {cat.studyGuideSlug && (
          <Link
            to="/blog/$slug"
            params={{ slug: cat.studyGuideSlug }}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-navy/20 bg-navy/5 px-4 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy/10"
          >
            <BookText className="h-4 w-4" /> Read the {cat.shortTitle} study guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}

        {/* Mock cards */}
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">Mock tests</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((s, i) => {
              const isReady = readyCount !== null && i < ready;
              const pending = readyCount === null;
              return (
                <li key={s.mockNumber}>
                  <MockCard
                    categorySlug={cat.slug}
                    mockNumber={s.mockNumber}
                    questions={cat.questionsPerMockTest}
                    state={pending ? "loading" : isReady ? "ready" : "soon"}
                  />
                </li>
              );
            })}
          </ul>
        </section>

        {/* Disclaimer */}
        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Independent practice:</strong>{" "}
          UK Test Hub is an independent practice and study website. Always
          check official test provider or government guidance before booking a
          real exam or using a qualification for an application.
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function MockCard({
  categorySlug,
  mockNumber,
  questions,
  state,
}: {
  categorySlug: string;
  mockNumber: number;
  questions: number;
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
        {questions} questions · <Clock className="inline h-3 w-3" /> ~{questions} min
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
      to="/english-language-tests/$category/mock-test-$num"
      params={{ category: categorySlug, num: String(mockNumber) }}
      className="group block h-full"
    >
      {inner}
    </Link>
  );
}
