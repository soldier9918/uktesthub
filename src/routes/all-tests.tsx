import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, ListChecks, Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BookmarkButton } from "@/components/BookmarkButton";
import { categories } from "@/data/categories";
import { getQuizMeta } from "@/data/quizzes";

export const Route = createFileRoute("/all-tests")({
  head: () => ({
    meta: [
      {
        title:
          "All UK Mock Tests — Free Practice for DVSA, TfL, IELTS, CSCS, NMC & more | UK Test Hub",
      },
      {
        name: "description",
        content:
          "Browse every free UK mock test on UK Test Hub: Driving Theory, Life in the UK, IELTS, CSCS, SERU TfL, NMC CBT, SIA, ESOL, Numerical, Food Hygiene, First Aid and many more.",
      },
      {
        property: "og:title",
        content: "All UK Mock Tests — UK Test Hub",
      },
      {
        property: "og:description",
        content:
          "The full directory of UK practice tests in one place — DVSA, TfL, Home Office, IELTS, CSCS, NMC, SIA and more.",
      }, { property: "og:url", content: "https://www.uktesthub.com/all-tests" }
    ],
  }),
  component: AllTestsPage,
});

type TestType =
  | "Theory"
  | "Aptitude & Reasoning"
  | "Practical & Skills"
  | "Compliance & Safety"
  | "Language"
  | "Citizenship";

const CATEGORY_TYPE: Record<string, TestType> = {
  driving: "Theory",
  citizenship: "Citizenship",
  english: "Language",
  education: "Theory",
  career: "Aptitude & Reasoning",
  professional: "Compliance & Safety",
  nhs: "Aptitude & Reasoning",
  "taxi-private-hire": "Theory",
  security: "Compliance & Safety",
  hospitality: "Compliance & Safety",
  construction: "Compliance & Safety",
  finance: "Theory",
  "it-tech": "Theory",
  "healthcare-entry": "Theory",
  teaching: "Theory",
  legal: "Theory",
  "military-emergency": "Aptitude & Reasoning",
  "maritime-aviation": "Theory",
  government: "Aptitude & Reasoning",
  "hgv-logistics": "Practical & Skills",
  "care-social-work": "Compliance & Safety",
  "beauty-wellbeing": "Practical & Skills",
  "retail-customer-service": "Compliance & Safety",
  "animal-care": "Practical & Skills",
};

const TEST_TYPES: TestType[] = [
  "Theory",
  "Aptitude & Reasoning",
  "Practical & Skills",
  "Compliance & Safety",
  "Language",
  "Citizenship",
];

function AllTestsPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [activeType, setActiveType] = useState<TestType | "all">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount =
    (activeCat !== "all" ? 1 : 0) + (activeType !== "all" ? 1 : 0);

  const totalTests = useMemo(
    () => categories.reduce((n, c) => n + c.topics.length, 0),
    [],
  );

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => activeCat === "all" || c.slug === activeCat)
      .filter(
        (c) => activeType === "all" || CATEGORY_TYPE[c.slug] === activeType,
      )
      .map((c) => ({
        ...c,
        topics: c.topics.filter(
          (t) =>
            !q ||
            t.title.toLowerCase().includes(q) ||
            c.title.toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.topics.length > 0);
  }, [query, activeCat, activeType]);

  const matchedCount = filteredCategories.reduce(
    (n, c) => n + c.topics.length,
    0,
  );

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <SiteHeader />

      {/* HERO */}
      <section className="bg-navy-deep text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-coral">
            Test Directory
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-5xl">
            All UK Mock Tests
          </h1>
          <p className="mt-4 max-w-3xl text-base text-navy-foreground/80 md:text-lg">
            Every free practice test on UK Test Hub in one place — {totalTests}{" "}
            mock tests across Driving, Citizenship, English, Taxi &amp; Private
            Hire, NHS, Construction, Security and more. Pick a test to start
            instantly.
          </p>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="sticky top-0 z-20 border-b border-border bg-[#f7f5f0]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tests (e.g. SERU, IELTS, CSCS, Life in the UK)"
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-3 text-sm text-foreground shadow-soft outline-none focus:border-coral"
              />
            </label>
            <div className="text-xs font-semibold text-muted-foreground md:whitespace-nowrap">
              {matchedCount} of {totalTests} tests
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-muted md:whitespace-nowrap"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {filtersOpen && (
            <>
              <div className="mt-3">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All"
                    active={activeCat === "all"}
                    onClick={() => setActiveCat("all")}
                  />
                  {categories.map((c) => (
                    <FilterChip
                      key={c.slug}
                      label={c.title}
                      active={activeCat === c.slug}
                      onClick={() => setActiveCat(c.slug)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Type
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All types"
                    active={activeType === "all"}
                    onClick={() => setActiveType("all")}
                  />
                  {TEST_TYPES.map((t) => (
                    <FilterChip
                      key={t}
                      label={t}
                      active={activeType === t}
                      onClick={() => setActiveType(t)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* LISTING */}
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {filteredCategories.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
            <p className="font-display text-lg font-bold text-foreground">
              No tests match &ldquo;{query}&rdquo;
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different keyword or clear the filter.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {filteredCategories.map((c) => (
              <section key={c.slug}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-extrabold uppercase tracking-wide text-foreground md:text-2xl">
                      <span className="mr-3 inline-block h-1.5 w-8 rounded-full bg-coral align-middle" />
                      {c.title}
                    </h2>
                    <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                      {c.short}
                    </p>
                  </div>
                  <Link
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-coral hover:underline"
                  >
                    View category <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {c.topics.map((t) => {
                    const quiz = getQuizMeta(t.slug);
                    return (
                      <li key={t.slug} className="relative">
                        <div className="absolute right-2 top-2 z-10">
                          <BookmarkButton topicSlug={t.slug} />
                        </div>
                        <Link
                          to="/topic/$slug"
                          params={{ slug: t.slug }}
                          className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-elevated"
                        >
                          <div className="min-w-0 flex-1 pr-8">
                            <h3 className="font-display text-sm font-bold leading-tight text-foreground">
                              {t.title}
                            </h3>
                            {quiz && (
                              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                  <ListChecks className="h-3 w-3" />{" "}
                                  {quiz.questionCount} Qs
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3" />{" "}
                                  {Math.round(quiz.timeLimit / 60)} min
                                </span>
                              </div>
                            )}
                            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-coral opacity-0 transition-opacity group-hover:opacity-100">
                              View test <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}

      </main>

      <SiteFooter />
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? "border-coral bg-coral text-coral-foreground"
          : "border-border bg-card text-foreground/70 hover:border-coral/40 hover:text-coral"
      }`}
    >
      {label}
    </button>
  );
}
