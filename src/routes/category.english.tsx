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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { englishTests, type TestConfig } from "@/data/english/categories";
import { categorySeo } from "@/data/category-seo";
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

        <HowMockTestsWork />

        <YourEnglishLevelSection />

        <EnglishSeoContent />

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

function HowMockTestsWork() {
  const types = [
    {
      icon: ListChecks,
      title: "Multiple choice",
      body: "Pick the single best answer. Click an option — in practice mode it reveals the correct answer and an explanation right away.",
    },
    {
      icon: CheckCircle2,
      title: "True / False",
      body: "Decide whether the statement is true or false. One click to answer.",
    },
    {
      icon: TypeIcon,
      title: "Fill the blanks",
      body: "Choose the right word for each gap from a small list. Tap the option for each blank — you can change your mind before checking.",
    },
    {
      icon: MousePointerClick,
      title: "Dropdown blanks",
      body: "Same idea as fill the blanks, but each gap has a dropdown menu. Open the menu and pick the best word.",
    },
    {
      icon: ListChecks,
      title: "Multiple response",
      body: "More than one answer can be correct. Tick every option you think is right, then press Check.",
    },
  ];
  return (
    <section className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-coral">
        How it works
      </p>
      <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">
        How to take the mock tests
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
        Each mock has 24 questions and a mix of question styles. You can take
        every mock in two ways:
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-muted/30 p-4">
          <h3 className="font-display text-base font-bold">Practice mode</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            No timer. Answer a question, then reveal the correct answer and a
            short explanation before moving on. Best for learning.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-muted/30 p-4">
          <h3 className="font-display text-base font-bold">Exam mode</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Timed run-through, one minute per question. Answers are revealed
            only at the end — closest to a real exam feel.
          </p>
        </div>
      </div>

      <h3 className="mt-7 font-display text-lg font-bold">
        The question types you’ll see
      </h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {types.map((t) => {
          const Icon = t.icon;
          return (
            <li
              key={t.title}
              className="rounded-2xl border border-border bg-background p-4"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-coral/10 text-coral">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-display text-sm font-bold">{t.title}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Tip:</strong> Use the{" "}
        <em>Previous</em> and <em>Next</em> buttons to move between questions.
        In practice mode, the <em>Reveal</em> / <em>Check answer</em> button
        shows you the correct answer for the current question. The pass mark
        is 75% — but treat the score as a learning signal, not a verdict.
      </div>
    </section>
  );
}

function YourEnglishLevelSection() {
  const levels: Array<{ code: string; name: string; bg: string; blurb: string }> = [
    {
      code: "A1",
      name: "Beginner",
      bg: "bg-[linear-gradient(140deg,oklch(0.68_0.14_220)_0%,oklch(0.48_0.14_225)_55%,oklch(0.28_0.11_230)_100%)]",
      blurb: "Simple, everyday words and phrases.",
    },
    {
      code: "A2",
      name: "Elementary",
      bg: "bg-[linear-gradient(140deg,oklch(0.38_0.18_260)_0%,oklch(0.25_0.15_262)_55%,oklch(0.14_0.10_265)_100%)]",
      blurb: "Short, routine exchanges on familiar topics.",
    },
    {
      code: "B1",
      name: "Intermediate",
      bg: "bg-[linear-gradient(140deg,oklch(0.42_0.20_320)_0%,oklch(0.30_0.17_330)_55%,oklch(0.20_0.13_345)_100%)]",
      blurb: "Most situations on familiar matters; opinions.",
    },
    {
      code: "B2",
      name: "Upper-Intermediate",
      bg: "bg-[linear-gradient(140deg,oklch(0.72_0.17_75)_0%,oklch(0.55_0.17_60)_55%,oklch(0.36_0.14_50)_100%)]",
      blurb: "Fluent interaction and clear, detailed text.",
    },
    {
      code: "C1",
      name: "Advanced",
      bg: "bg-[linear-gradient(140deg,oklch(0.56_0.20_45)_0%,oklch(0.40_0.18_38)_55%,oklch(0.24_0.13_32)_100%)]",
      blurb: "Flexible English for academic and work contexts.",
    },
    {
      code: "C2",
      name: "Proficient",
      bg: "bg-[linear-gradient(140deg,oklch(0.34_0.20_22)_0%,oklch(0.22_0.16_18)_55%,oklch(0.12_0.11_15)_100%)]",
      blurb: "Understand virtually everything; precise expression.",
    },
  ];

  return (
    <section className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-coral">
            New
          </p>
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Your English level
          </h2>
        </div>
      </div>

      <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
        At the end of every English mock test we show you an{" "}
        <strong className="text-foreground">estimated CEFR level</strong> based
        on how you scored — A1 (Beginner) all the way to C2 (Proficient). You
        also get a per-question-type breakdown so you can see which styles
        tripped you up.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {levels.map((l) => (
          <div
            key={l.code}
            className={`rounded-2xl border border-white/10 p-4 text-white shadow-soft ${l.bg}`}
          >
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold">{l.code}</span>
              <span className="text-sm text-white/85">{l.name}</span>
            </div>
            <p className="mt-1 text-xs text-white/85">{l.blurb}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-7 font-display text-lg font-bold">
        How the estimate is calculated
      </h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        <li>
          <strong className="text-foreground">85% or higher</strong> on the
          level you sat — you’re ready to try the next CEFR level up.
        </li>
        <li>
          <strong className="text-foreground">60% to 84%</strong> — keep
          practising at the same level to lock it in. We’ll suggest the next
          mock.
        </li>
        <li>
          <strong className="text-foreground">Below 60%</strong> — try the
          level below first to build confidence, then come back.
        </li>
      </ul>

      <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-xs text-muted-foreground">
        Estimated level is based on your score in a single mock test — it’s a
        helpful learning signal, not an official CEFR assessment. Take a few
        mocks at different levels to get a clearer picture of where you sit.
      </div>
    </section>
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


function EnglishSeoContent() {
  const seo = categorySeo.english;
  if (!seo) return null;
  return (
    <section className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-coral">
        Background
      </p>
      <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">
        About English language tests in the UK
      </h2>

      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
        {seo.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-8 space-y-7">
        {seo.sections.map((s) => (
          <article key={s.heading}>
            <h3 className="font-display text-lg font-bold text-foreground md:text-xl">
              {s.heading}
            </h3>
            <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </article>
        ))}
      </div>

      {seo.faqs.length > 0 && (
        <>
          <h3 className="mt-8 font-display text-lg font-bold text-foreground md:text-xl">
            Frequently asked questions
          </h3>
          <Accordion type="single" collapsible className="mt-3">
            {seo.faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-semibold md:text-base">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground md:text-base">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </section>
  );
}
