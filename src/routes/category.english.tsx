import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Home,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { englishTests, type TestConfig } from "@/data/english/categories";
import { breadcrumbSchema } from "@/lib/seo";

const ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Users,
  BookOpen,
  ShieldCheck,
};

const ACCENT: Record<TestConfig["colourTheme"], string> = {
  coral: "bg-coral/10 text-coral border-coral/20",
  navy: "bg-navy/10 text-navy border-navy/20",
  gold: "bg-gold/10 text-gold border-gold/20",
  success: "bg-success/10 text-success border-success/20",
};

const TITLE =
  "English Language Tests | IELTS, ESOL, TOEFL & SELT Practice | UK Test Hub";
const DESC =
  "Free English language practice — IELTS, ESOL, TOEFL and SELT mock tests with study guides and CEFR level practice.";
const URL = "https://www.uktesthub.com/category/english";

export const Route = createFileRoute("/category/english")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "English Language Tests", url: "/category/english" },
      ]),
    ],
  }),
  component: EnglishCategoryPage,
});

function EnglishCategoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">English Language Tests</span>
        </nav>

        <header className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-coral">
            Category
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-5xl">
            English Language Tests
          </h1>
          <p className="mt-3 max-w-3xl text-base text-muted-foreground md:text-lg">
            Choose the English test you want to practise. Each test has skill-based
            practice (Listening, Reading, Writing, Speaking) split by CEFR level,
            with 45 mock tests and 24 questions each.
          </p>
        </header>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {englishTests.map((t) => (
            <li key={t.slug}>
              <TestCard test={t} />
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Independent practice:</strong>{" "}
          UK Test Hub is an independent practice and study website. Always
          check the official test provider or GOV.UK guidance before booking a
          real exam or using a qualification for an application.
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function TestCard({ test }: { test: TestConfig }) {
  const Icon = ICONS[test.icon] ?? BookOpen;
  return (
    <Link
      to="/english-language-tests/$test"
      params={{ test: test.slug }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-elevated"
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${ACCENT[test.colourTheme]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold leading-tight group-hover:text-coral">
            {test.tagline}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {test.skills.length} skill area{test.skills.length === 1 ? "" : "s"} · 45 mocks × 24 questions per level
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{test.description}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-coral">
        Open {test.shortTitle} practice <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
