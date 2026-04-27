import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { CategoryIcon, accentClasses } from "@/components/CategoryIcon";
import { categories } from "@/data/categories";
import { getDailyQuiz, getFeaturedQuizzes } from "@/data/quizzes";
import { ArrowRight, Clock, ListChecks, Sparkles, Trophy, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UK Test Hub — Free UK Practice Tests & Mock Exams" },
      {
        name: "description",
        content:
          "Free UK practice tests: Driving Theory, Life in the UK, IELTS, GCSE, CSCS, aptitude tests and more. Realistic mock exams with explanations — pass first time.",
      },
      { property: "og:title", content: "UK Test Hub — Free UK Practice Tests & Mock Exams" },
      {
        property: "og:description",
        content:
          "Free mock tests for UK Driving Theory, Life in the UK, IELTS, GCSE, CSCS, aptitude tests & more.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const daily = getDailyQuiz();
  const featured = getFeaturedQuizzes();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-navy-foreground">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 20%, white 1px, transparent 1px), radial-gradient(circle at 75% 80%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> 100% free · No sign-up
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Pass your UK <span className="text-coral">tests</span>
              <br />
              <span className="text-gold">first time.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-navy-foreground/80 md:text-xl">
              Free, realistic mock exams for Driving Theory, Life in the UK, IELTS,
              GCSE, CSCS and more — with instant explanations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/category/$slug"
                params={{ slug: "driving" }}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-coral px-6 py-3.5 text-sm font-semibold text-coral-foreground shadow-coral transition-transform hover:-translate-y-0.5"
              >
                Start practising <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/quiz/$slug"
                params={{ slug: "driving-theory-mock-1" }}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-navy-foreground backdrop-blur transition-colors hover:bg-white/20"
              >
                Take a mock exam
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6 text-sm">
              <div>
                <dt className="text-navy-foreground/60">Categories</dt>
                <dd className="font-display text-2xl font-bold">{categories.length}</dd>
              </div>
              <div>
                <dt className="text-navy-foreground/60">Mock tests</dt>
                <dd className="font-display text-2xl font-bold">10+</dd>
              </div>
              <div>
                <dt className="text-navy-foreground/60">Pass rate</dt>
                <dd className="font-display text-2xl font-bold">94%</dd>
              </div>
            </dl>
          </div>

          {/* Daily quiz card in hero */}
          <Link
            to="/quiz/$slug"
            params={{ slug: daily.slug }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md transition-transform hover:-translate-y-1 md:p-8"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-gold text-gold-foreground">
                  <Zap className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                  Daily Challenge
                </span>
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold leading-tight md:text-3xl">
                {daily.quizTitle}
              </h2>
              <p className="mt-2 text-sm text-navy-foreground/75">{daily.description}</p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-sm">
              <span className="flex items-center gap-3 text-navy-foreground/70">
                <span className="inline-flex items-center gap-1"><ListChecks className="h-4 w-4" /> {daily.questions.length} Qs</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {Math.round(daily.timeLimit / 60)} min</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-coral">
                Play <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 md:px-6">
        <AdSlot size="leaderboard" className="mt-10" />

        {/* BENTO: Categories + featured */}
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold">Choose your test</h2>
              <p className="mt-1 text-muted-foreground">
                Practice tests across the UK's most-searched exams.
              </p>
            </div>
          </div>

          <div className="mt-8 grid auto-rows-[180px] grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {/* Big featured tile */}
            <Link
              to="/category/$slug"
              params={{ slug: categories[0].slug }}
              className="group relative col-span-1 row-span-2 flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-coral p-6 text-coral-foreground shadow-coral transition-transform hover:-translate-y-1 md:col-span-2"
            >
              <div
                aria-hidden
                className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl"
              />
              <div className="relative">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
                  <Trophy className="h-3 w-3" /> Most popular
                </span>
                <h3 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
                  Driving Theory<br />Mock Tests
                </h3>
                <p className="mt-2 max-w-sm text-sm opacity-90">
                  DVSA-style practice with explanations — exactly like the real thing.
                </p>
              </div>
              <span className="relative inline-flex items-center gap-1.5 text-sm font-semibold">
                Explore tests <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            {categories.slice(1).map((c, i) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-coral hover:shadow-elevated ${
                  i === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentClasses[c.accent]}`}>
                    <CategoryIcon name={c.icon} className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-coral" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold leading-tight">{c.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <AdSlot size="leaderboard" className="my-12" />

        {/* FEATURED TESTS */}
        <section>
          <h2 className="font-display text-3xl font-bold">Featured mock exams</h2>
          <p className="mt-1 text-muted-foreground">
            Hand-picked tests to get you exam-ready fast.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((q) => (
              <li key={q.slug}>
                <Link
                  to="/quiz/$slug"
                  params={{ slug: q.slug }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-coral hover:shadow-elevated"
                >
                  <span className="self-start rounded-full bg-coral/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-coral">
                    {q.difficulty}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold leading-tight">
                    {q.quizTitle}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <ListChecks className="h-3.5 w-3.5" /> {q.questions.length} Qs
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {Math.round(q.timeLimit / 60)} min
                    </span>
                  </div>
                  <div className="mt-auto pt-5">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral">
                      Start test <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* TOPIC PRACTICE (SEO) */}
        <section className="mt-16 rounded-3xl border border-border bg-gradient-card p-6 md:p-10">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Practice by topic</h2>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            Jump straight into a specific topic. Every link below is its own page,
            updated with fresh questions.
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div key={c.slug}>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-coral">
                  {c.title}
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {c.topics.map((t) => (
                    <li key={t.slug}>
                      <Link
                        to="/category/$slug"
                        params={{ slug: c.slug }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {t.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* WHY US */}
        <section className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            {
              t: "Realistic exam feel",
              d: "Timed exam mode mirrors real DVSA, Home Office and exam-board tests.",
            },
            {
              t: "Learn as you practice",
              d: "Practice mode shows the correct answer and explanation instantly.",
            },
            {
              t: "Always free",
              d: "Every test on UK Test Hub is free — no sign-up, no paywall.",
            },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-display text-lg font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
