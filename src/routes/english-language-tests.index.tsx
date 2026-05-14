import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Users,
  BookOpen,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Award,
  Headphones,
  PenLine,
  Mic,
  Brackets,
  BookA,
  Coffee,
  Briefcase,
  Landmark,
  Search,
  ArrowRight,
  BookText,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  englishCategories,
  ENGLISH_TYPE_LABELS,
  type EnglishCategory,
  type EnglishCategoryType,
} from "@/data/english/categories";
import { breadcrumbSchema } from "@/lib/seo";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Users,
  BookOpen,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Award,
  Headphones,
  PenLine,
  Mic,
  Brackets,
  BookA,
  Coffee,
  Briefcase,
  Landmark,
};

const ACCENT: Record<EnglishCategory["colourTheme"], string> = {
  coral: "bg-coral/10 text-coral border-coral/20",
  navy: "bg-navy/10 text-navy border-navy/20",
  gold: "bg-gold/10 text-gold border-gold/20",
  success: "bg-success/10 text-success border-success/20",
};

const TYPE_ORDER: EnglishCategoryType[] = [
  "test-type",
  "cefr-level",
  "skill",
  "topic",
];

const PAGE_TITLE =
  "English Language Tests | Free IELTS, ESOL, TOEFL & SELT Practice | UK Test Hub";
const PAGE_DESC =
  "Practise IELTS, ESOL, TOEFL, SELT and CEFR English levels with free mock tests, study guides and skill-based practice.";
const PAGE_URL = "https://www.uktesthub.com/english-language-tests";

export const Route = createFileRoute("/english-language-tests/")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "English Language Tests", url: "/english-language-tests" },
      ]),
    ],
  }),
  component: EnglishLandingPage,
});

type Filter = "all" | EnglishCategoryType;

function EnglishLandingPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return englishCategories.filter((c) => {
      if (filter !== "all" && c.type !== filter) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.shortTitle.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const grouped = useMemo(() => {
    const map = new Map<EnglishCategoryType, EnglishCategory[]>();
    for (const t of TYPE_ORDER) map.set(t, []);
    for (const c of visible) map.get(c.type)!.push(c);
    return map;
  }, [visible]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-coral/5 to-background">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-coral">
              English Language Tests
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight md:text-5xl">
              Free English practice for every level and test
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
              Practise IELTS, ESOL, TOEFL, SELT and CEFR English levels with
              free mock tests, study guides and skill-based practice. Each
              category has 45 mock tests with 24 questions each.
            </p>

            {/* Filter tabs */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {(["all", ...TYPE_ORDER] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    filter === f
                      ? "border-coral bg-coral text-white"
                      : "border-border bg-card text-foreground hover:border-coral/40"
                  }`}
                >
                  {f === "all" ? "All" : ENGLISH_TYPE_LABELS[f]}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="mt-4 flex max-w-md items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-soft">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search English practice categories…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Search English practice categories"
              />
            </div>
          </div>
        </section>

        {/* Sections */}
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          {TYPE_ORDER.map((type) => {
            const items = grouped.get(type) ?? [];
            if (items.length === 0) return null;
            return (
              <section key={type} className="mb-12">
                <h2 className="font-display text-2xl font-bold">
                  {ENGLISH_TYPE_LABELS[type]}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {sectionSubtitle(type)}
                </p>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((c) => (
                    <li key={c.slug}>
                      <CategoryCard cat={c} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          {visible.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              No categories match your search.
            </p>
          )}

          {/* Disclaimer */}
          <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            <strong className="text-foreground">Independent practice:</strong>{" "}
            UK Test Hub is an independent practice and study website. Always
            check official test provider or government guidance before booking
            a real exam or using a qualification for an application.
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function sectionSubtitle(t: EnglishCategoryType): string {
  switch (t) {
    case "test-type":
      return "Practise by exam: IELTS, ESOL, TOEFL and SELT.";
    case "cefr-level":
      return "Practise by CEFR level from beginner (A1) to proficient (C2).";
    case "skill":
      return "Build a specific skill: listening, reading, writing or speaking.";
    case "topic":
      return "Focus on a real-life topic, from grammar to UK life English.";
  }
}

function CategoryCard({ cat }: { cat: EnglishCategory }) {
  const Icon = ICONS[cat.icon] ?? BookOpen;
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-elevated">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${ACCENT[cat.colourTheme]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold leading-tight">
            {cat.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {cat.totalMockTests} mocks · {cat.questionsPerMockTest} questions each
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{cat.description}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <Link
          to="/english-language-tests/$category"
          params={{ category: cat.slug }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-coral px-3 py-2 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-coral/90"
        >
          Start Practice <ArrowRight className="h-4 w-4" />
        </Link>
        {cat.studyGuideSlug && (
          <Link
            to="/blog/$slug"
            params={{ slug: cat.studyGuideSlug }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy/20 bg-navy/5 px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy/10"
          >
            <BookText className="h-4 w-4" /> Read Study Guide
          </Link>
        )}
      </div>
    </div>
  );
}
