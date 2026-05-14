import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Home,
  ListChecks,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  Type as TypeIcon,
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

type Theme = TestConfig["colourTheme"];

// Premium gradient cards — one bespoke palette per test, white text.
const CARD_BG: Record<Theme, string> = {
  // IELTS — deep crimson / British red
  coral:
    "bg-[linear-gradient(140deg,oklch(0.42_0.19_27)_0%,oklch(0.32_0.16_25)_55%,oklch(0.22_0.12_22)_100%)] border-white/10",
  // ESOL — deep navy / royal
  navy:
    "bg-[linear-gradient(140deg,oklch(0.28_0.11_265)_0%,oklch(0.20_0.09_265)_55%,oklch(0.13_0.07_265)_100%)] border-white/10",
  // TOEFL — emerald / forest
  gold:
    "bg-[linear-gradient(140deg,oklch(0.38_0.13_165)_0%,oklch(0.28_0.10_160)_55%,oklch(0.18_0.07_160)_100%)] border-white/10",
  // SELT — deep plum / aubergine
  success:
    "bg-[linear-gradient(140deg,oklch(0.36_0.14_315)_0%,oklch(0.26_0.11_310)_55%,oklch(0.17_0.08_305)_100%)] border-white/10",
};

const ICON_TILE: Record<Theme, string> = {
  coral: "bg-white/10 text-white ring-1 ring-white/15",
  navy: "bg-white/10 text-white ring-1 ring-white/15",
  gold: "bg-white/10 text-white ring-1 ring-white/15",
  success: "bg-white/10 text-white ring-1 ring-white/15",
};

const ACCENT_TEXT: Record<Theme, string> = {
  coral: "text-[oklch(0.88_0.10_45)]",
  navy: "text-[oklch(0.85_0.10_240)]",
  gold: "text-[oklch(0.88_0.12_150)]",
  success: "text-[oklch(0.88_0.10_320)]",
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
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 text-white shadow-elevated transition-all hover:-translate-y-1 hover:shadow-2xl ${CARD_BG[test.colourTheme]}`}
    >
      {/* Soft highlight shine */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.18),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-white/5 blur-2xl"
      />

      <div className="relative flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${ICON_TILE[test.colourTheme]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${ACCENT_TEXT[test.colourTheme]}`}>
            Practice Test
          </p>
          <h2 className="mt-0.5 font-display text-xl font-bold leading-tight text-white">
            {test.tagline}
          </h2>
          <p className="mt-1 text-xs text-white/70">
            45 mock tests · 24 questions each
          </p>
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-white/80">{test.description}</p>

      <div className="relative mt-auto flex items-center justify-between pt-5">
        <span className="text-xs font-medium uppercase tracking-wider text-white/60">
          {test.skills.length} skill area{test.skills.length === 1 ? "" : "s"}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-transform group-hover:translate-x-0.5">
          Start {test.shortTitle} Practice <ArrowRight className="h-4 w-4" />
        </span>
      </div>

      {/* Hairline divider line like the reference card */}
      <div aria-hidden className="pointer-events-none absolute left-6 right-6 top-[58%] h-px bg-white/10" />
    </Link>
  );
}

