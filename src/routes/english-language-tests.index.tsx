import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  BookText,
  GraduationCap,
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

const PAGE_TITLE =
  "English Language Tests | Free IELTS, ESOL, TOEFL & SELT Practice | UK Test Hub";
const PAGE_DESC =
  "Practise IELTS, ESOL, TOEFL and SELT-style English mock tests free. Skill-based practice (Listening, Reading, Writing, Speaking) split by CEFR level.";
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

function EnglishLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="border-b border-border bg-gradient-to-b from-coral/5 to-background">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-coral">
              English Language Tests
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight md:text-5xl">
              Free English practice — IELTS, ESOL, TOEFL & SELT
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
              Choose the English test you want to practise. Each test is broken
              down by skill (Listening, Reading, Writing, Speaking) and CEFR
              level. Every level gives you 45 mock tests with 24 questions each.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <ul className="grid gap-4 sm:grid-cols-2">
            {englishTests.map((t) => (
              <li key={t.slug}>
                <TestCard test={t} />
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            <strong className="text-foreground">Independent practice:</strong>{" "}
            UK Test Hub is an independent practice and study website. Always
            check the official test provider or GOV.UK guidance before booking
            a real exam or using a qualification for an application.
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function TestCard({ test }: { test: TestConfig }) {
  const Icon = ICONS[test.icon] ?? BookOpen;
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-elevated">
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${ACCENT[test.colourTheme]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold leading-tight">
            {test.tagline}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {test.skills.length} skill area{test.skills.length === 1 ? "" : "s"} · 45 mocks × 24 questions per level
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{test.description}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <Link
          to="/english-language-tests/$test"
          params={{ test: test.slug }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-coral px-3 py-2 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-coral/90"
        >
          Start Practice <ArrowRight className="h-4 w-4" />
        </Link>
        {test.studyGuideSlug && (
          <Link
            to="/blog/$slug"
            params={{ slug: test.studyGuideSlug }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy/20 bg-navy/5 px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy/10"
          >
            <BookText className="h-4 w-4" /> Study Guide
          </Link>
        )}
      </div>
    </div>
  );
}
