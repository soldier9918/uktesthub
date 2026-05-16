import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  BookText,
  ChevronRight,
  Headphones,
  Home,
  Mic,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { BackToAllTests } from "@/components/BackToAllTests";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getTest,
  type SkillConfig,
  type SkillSlug,
  type TestConfig,
} from "@/data/english/categories";
import { breadcrumbSchema } from "@/lib/seo";

const ICONS: Record<string, LucideIcon> = {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
};

// Premium dark gradient per skill — distinct hue per skill area.
const SKILL_BG: Record<SkillSlug, string> = {
  // Listening — indigo / violet
  listening:
    "bg-[linear-gradient(140deg,oklch(0.34_0.15_280)_0%,oklch(0.24_0.12_278)_55%,oklch(0.16_0.08_275)_100%)] border-white/10",
  // Reading — emerald / teal
  reading:
    "bg-[linear-gradient(140deg,oklch(0.38_0.13_175)_0%,oklch(0.27_0.10_170)_55%,oklch(0.17_0.07_168)_100%)] border-white/10",
  // Writing — amber / gold
  writing:
    "bg-[linear-gradient(140deg,oklch(0.46_0.15_70)_0%,oklch(0.34_0.13_60)_55%,oklch(0.22_0.10_50)_100%)] border-white/10",
  // Speaking — rose / magenta
  speaking:
    "bg-[linear-gradient(140deg,oklch(0.42_0.18_15)_0%,oklch(0.30_0.15_10)_55%,oklch(0.20_0.11_8)_100%)] border-white/10",
  // SELT Speaking & Listening — rose-violet blend
  "speaking-listening":
    "bg-[linear-gradient(140deg,oklch(0.40_0.16_340)_0%,oklch(0.28_0.13_335)_55%,oklch(0.18_0.09_330)_100%)] border-white/10",
  // SELT Four Skills — deep indigo
  "four-skills":
    "bg-[linear-gradient(140deg,oklch(0.34_0.14_260)_0%,oklch(0.23_0.11_258)_55%,oklch(0.15_0.08_255)_100%)] border-white/10",
};

const SKILL_ACCENT: Record<SkillSlug, string> = {
  listening: "text-[oklch(0.85_0.10_290)]",
  reading: "text-[oklch(0.86_0.11_165)]",
  writing: "text-[oklch(0.88_0.12_75)]",
  speaking: "text-[oklch(0.86_0.10_20)]",
  "speaking-listening": "text-[oklch(0.86_0.10_340)]",
  "four-skills": "text-[oklch(0.85_0.10_260)]",
};

export const Route = createFileRoute("/english-language-tests/$test/")({
  loader: ({ params }) => {
    const test = getTest(params.test);
    if (!test) throw notFound();
    return { test };
  },
  head: ({ loaderData, params }) => {
    const test = loaderData?.test;
    if (!test) return { meta: [{ title: "English Practice — UK Test Hub" }] };
    const title = `${test.tagline} | Free ${test.shortTitle}-style Practice | UK Test Hub`;
    const description = `${test.shortTitle}-style practice with skill-based mock tests (Listening, Reading, Writing, Speaking) across CEFR levels. 45 mock tests × 24 questions per level.`;
    const url = `https://www.uktesthub.com/english-language-tests/${params.test}`;
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
        ]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">Test not found</h1>
      <Link to="/category/english" className="mt-4 inline-block text-coral hover:underline">
        Back to English Language Tests
      </Link>
    </div>
  ),
  component: TestOverviewPage,
});

function TestOverviewPage() {
  const { test } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/category/english" className="hover:text-foreground">
            English Language Tests
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{test.shortTitle}</span>
        </nav>

        <header className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-coral">
            {test.shortTitle}-style Practice
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
            {test.tagline}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-muted-foreground">
            {test.description}
          </p>
        </header>

        {test.studyGuideSlug && (
          <Link
            to="/blog/$slug"
            params={{ slug: test.studyGuideSlug }}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-navy/20 bg-navy/5 px-4 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy/10"
          >
            <BookText className="h-4 w-4" /> Read the {test.shortTitle} study guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}

        {test.slug === "selt" && <SeltNotice />}

        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">
            Choose a {test.shortTitle} skill
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a skill to see the available CEFR levels.
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {test.skills.map((s: SkillConfig) => (
              <li key={s.slug}>
                <SkillCard test={test} skill={s} />
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Independent practice:</strong>{" "}
          UK Test Hub is an independent practice and study website. This is{" "}
          {test.shortTitle}-style practice, not an official {test.shortTitle} exam.
          Always check the official test provider or GOV.UK guidance before
          booking a real exam or using a qualification for an application.
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SeltNotice() {
  return (
    <div className="mt-6 rounded-2xl border border-success/30 bg-success/5 p-4 text-sm text-foreground">
      <strong>SELT for UK visa & citizenship:</strong> Secure English Language
      Tests (SELT) are commonly required for UK visa, settlement and
      citizenship applications. UK Test Hub is not a Home Office-approved
      provider. Always check{" "}
      <a
        href="https://www.gov.uk/english-language"
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-dotted underline-offset-2 hover:text-coral"
      >
        GOV.UK
      </a>{" "}
      for the official list of approved tests and providers.
    </div>
  );
}

function SkillCard({ test, skill }: { test: TestConfig; skill: SkillConfig }) {
  const Icon = ICONS[skill.icon] ?? BookOpen;
  return (
    <Link
      to="/english-language-tests/$test/$skill"
      params={{ test: test.slug, skill: skill.slug }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 text-white shadow-elevated transition-all hover:-translate-y-1 hover:shadow-2xl ${SKILL_BG[skill.slug]}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.18),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-white/5 blur-2xl"
      />

      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/15">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${SKILL_ACCENT[skill.slug]}`}>
            {test.shortTitle} Skill
          </p>
          <h3 className="mt-0.5 font-display text-lg font-bold leading-tight text-white">
            {test.shortTitle} {skill.title}
          </h3>
          <p className="mt-0.5 text-xs text-white/70">
            {skill.levels.length} CEFR level{skill.levels.length === 1 ? "" : "s"} · 45 mocks × 24 questions
          </p>
        </div>
      </div>

      <p className="relative mt-3 text-sm leading-relaxed text-white/80">{skill.description}</p>

      <div className="relative mt-auto flex items-center justify-end pt-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-transform group-hover:translate-x-0.5">
          Choose level <ArrowRight className="h-4 w-4" />
        </span>
      </div>

      <div aria-hidden className="pointer-events-none absolute left-5 right-5 top-[58%] h-px bg-white/10" />
    </Link>
  );
}
