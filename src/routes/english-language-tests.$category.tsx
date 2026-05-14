import { useEffect, useState, type ComponentType } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookA,
  BookOpen,
  BookText,
  Brackets,
  Briefcase,
  ChevronRight,
  Clock,
  Coffee,
  Headphones,
  Home,
  Landmark,
  Lock,
  Mic,
  PenLine,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  englishCategories,
  type EnglishCategory,
  getEnglishCategory,
  ENGLISH_TYPE_LABELS,
} from "@/data/english/categories";
import {
  countReadyEnglishMocks,
  listEnglishMockSlots,
} from "@/data/english/mocks";
import { breadcrumbSchema } from "@/lib/seo";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Award,
  BookA,
  BookOpen,
  Brackets,
  Briefcase,
  Coffee,
  Headphones,
  Landmark,
  Mic,
  PenLine,
  Sparkles,
  TrendingUp,
};

const ACCENT: Record<EnglishCategory["colourTheme"], string> = {
  coral: "bg-coral/10 text-coral border-coral/20",
  navy: "bg-navy/10 text-navy border-navy/20",
  gold: "bg-gold/10 text-gold border-gold/20",
  success: "bg-success/10 text-success border-success/20",
};

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
  const skillCategories = englishCategories.filter((c) => c.type === "skill");
  const levelCategories = englishCategories.filter((c) => c.type === "cefr-level");
  const topicCategories = englishCategories.filter((c) => c.type === "topic");

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

        {/* Practice categories */}
        <section className="mt-8 space-y-8" aria-labelledby="practice-categories">
          <div>
            <h2 id="practice-categories" className="font-display text-xl font-bold">
              Choose a practice category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with a skill area first, or jump straight into the full {cat.shortTitle} mock tests below.
            </p>
          </div>

          <CategoryGroup
            title={`${cat.shortTitle} skills`}
            items={skillCategories}
          />
          <CategoryGroup title="CEFR levels" items={levelCategories} compact />
          <CategoryGroup title="English topics" items={topicCategories} compact />
        </section>

        {/* Mock cards */}
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">Full {cat.shortTitle} mock tests</h2>
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

function CategoryGroup({
  title,
  items,
  compact = false,
}: {
  title: string;
  items: EnglishCategory[];
  compact?: boolean;
}) {
  return (
    <div>
      <h3 className="font-display text-base font-bold">{title}</h3>
      <ul className={`mt-3 grid gap-3 ${compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
        {items.map((item) => (
          <li key={item.slug}>
            <PracticeCategoryCard cat={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PracticeCategoryCard({ cat }: { cat: EnglishCategory }) {
  const Icon = ICONS[cat.icon] ?? BookOpen;
  const title = cat.slug === "listening" ? "Listening / Hearing Practice" : cat.title;

  return (
    <Link
      to="/english-language-tests/$category"
      params={{ category: cat.slug }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-elevated"
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${ACCENT[cat.colourTheme]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h4 className="font-display text-sm font-bold leading-tight text-foreground group-hover:text-coral">
            {title}
          </h4>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {cat.totalMockTests} mocks · {cat.questionsPerMockTest} questions each
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{cat.description}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-semibold text-coral">
        Open category <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
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
