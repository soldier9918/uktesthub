import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Home } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getSkill,
  getTest,
  LEVEL_DESCRIPTION,
  LEVEL_LABEL,
  LEVEL_SHORT,
  type LevelSlug,
  type SkillConfig,
  type TestConfig,
} from "@/data/english/categories";
import { breadcrumbSchema } from "@/lib/seo";

// Blue → Red premium gradient blend across CEFR levels (A1 easiest → C2 hardest).
const LEVEL_BG: Record<LevelSlug, string> = {
  // A1 — bright sky / cyan blue
  a1: "bg-[linear-gradient(140deg,oklch(0.55_0.15_230)_0%,oklch(0.38_0.13_225)_55%,oklch(0.22_0.10_220)_100%)] border-white/10",
  // A2 — deep royal indigo
  a2: "bg-[linear-gradient(140deg,oklch(0.36_0.18_275)_0%,oklch(0.24_0.14_272)_55%,oklch(0.15_0.10_270)_100%)] border-white/10",
  // B1 — teal / orangey-blue transition
  b1: "bg-[linear-gradient(140deg,oklch(0.50_0.13_185)_0%,oklch(0.34_0.11_170)_55%,oklch(0.22_0.10_140)_100%)] border-white/10",
  // B2 — warm amber / orange
  b2: "bg-[linear-gradient(140deg,oklch(0.62_0.16_80)_0%,oklch(0.42_0.15_60)_55%,oklch(0.26_0.12_50)_100%)] border-white/10",
  // C1 — dark orange / ember
  c1: "bg-[linear-gradient(140deg,oklch(0.50_0.19_45)_0%,oklch(0.34_0.16_38)_55%,oklch(0.22_0.13_32)_100%)] border-white/10",
  // C2 — deep crimson red
  c2: "bg-[linear-gradient(140deg,oklch(0.42_0.22_25)_0%,oklch(0.28_0.18_22)_55%,oklch(0.17_0.13_20)_100%)] border-white/10",
};

const LEVEL_ACCENT: Record<LevelSlug, string> = {
  a1: "text-[oklch(0.92_0.10_225)]",
  a2: "text-[oklch(0.85_0.12_280)]",
  b1: "text-[oklch(0.90_0.11_180)]",
  b2: "text-[oklch(0.92_0.13_80)]",
  c1: "text-[oklch(0.88_0.14_45)]",
  c2: "text-[oklch(0.86_0.15_25)]",
};

export const Route = createFileRoute(
  "/english-language-tests/$test/$skill/",
)({
  loader: ({ params }) => {
    const test = getTest(params.test);
    if (!test) throw notFound();
    const skill = getSkill(test, params.skill);
    if (!skill) throw notFound();
    return { test, skill };
  },
  head: ({ loaderData, params }) => {
    const test = loaderData?.test;
    const skill = loaderData?.skill;
    if (!test || !skill) return { meta: [{ title: "English Practice" }] };
    const title = `${test.shortTitle} ${skill.title} | Free ${test.shortTitle}-style Practice | UK Test Hub`;
    const description = `${test.shortTitle}-style ${skill.shortTitle.toLowerCase()} practice across ${skill.levels.length} CEFR levels. 45 mock tests × 24 questions each.`;
    const url = `https://www.uktesthub.com/english-language-tests/${params.test}/${params.skill}`;
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
        ]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">Skill not found</h1>
      <Link to="/category/english" className="mt-4 inline-block text-coral hover:underline">
        Back to English Language Tests
      </Link>
    </div>
  ),
  component: SkillPage,
});

function SkillPage() {
  const { test, skill } = Route.useLoaderData();
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
          <Link
            to="/english-language-tests/$test"
            params={{ test: test.slug }}
            className="hover:text-foreground"
          >
            {test.shortTitle}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{skill.shortTitle}</span>
        </nav>

        <header className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-coral">
            {test.shortTitle} · {skill.shortTitle}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
            {test.shortTitle} {skill.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-muted-foreground">
            {skill.description} Choose a CEFR level to start the {skill.levels.length === 1 ? "level" : "levels"}.
          </p>
        </header>

        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">Choose a CEFR level</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {skill.levels.map((l: LevelSlug) => (
              <li key={l}>
                <LevelCard test={test} skill={skill} level={l} />
              </li>
            ))}
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

function LevelCard({
  test,
  skill,
  level,
}: {
  test: TestConfig;
  skill: SkillConfig;
  level: LevelSlug;
}) {
  return (
    <Link
      to="/english-language-tests/$test/$skill/$level"
      params={{ test: test.slug, skill: skill.slug, level }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 text-white shadow-elevated transition-all hover:-translate-y-1 hover:shadow-2xl ${LEVEL_BG[level]}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.18),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-14 -bottom-14 h-48 w-48 rounded-full bg-white/5 blur-2xl"
      />

      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center justify-center rounded-lg bg-white/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/15">
          {LEVEL_SHORT[level]}
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${LEVEL_ACCENT[level]}`}>
          45 mocks
        </span>
      </div>

      <h3 className="relative mt-3 font-display text-lg font-bold leading-tight text-white">
        {LEVEL_LABEL[level]}
      </h3>
      <p className="relative mt-1 line-clamp-3 text-xs leading-relaxed text-white/75">
        {LEVEL_DESCRIPTION[level]}
      </p>

      <div className="relative mt-auto flex items-center justify-end pt-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-transform group-hover:translate-x-0.5">
          Open level <ArrowRight className="h-4 w-4" />
        </span>
      </div>

      <div aria-hidden className="pointer-events-none absolute left-5 right-5 top-[60%] h-px bg-white/10" />
    </Link>
  );
}
