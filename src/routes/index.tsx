import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  ListChecks,
  Crown,
  CheckCircle2,
  FileCheck,
  Timer,
  CalendarCheck,
  ShieldCheck,
  TrendingUp,
  Smartphone,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { CategoryIcon, accentClasses } from "@/components/CategoryIcon";
import { UnionJack } from "@/components/UnionJack";
import { categories } from "@/data/categories";
import { getDailyQuiz, getQuiz } from "@/data/quizzes";

import heroUk from "@/assets/hero-uk.jpg";
import featDriving from "@/assets/feat-driving.jpg";
import featFlag from "@/assets/feat-flag.jpg";
import featTowerBridge from "@/assets/feat-tower-bridge.jpg";
import featRoadSigns from "@/assets/feat-road-signs.jpg";
import featHeadphones from "@/assets/feat-headphones.jpg";
import featCalculator from "@/assets/feat-calculator.jpg";
import bandGuard from "@/assets/band-guard.png";
import bandPostbox from "@/assets/band-postbox.png";
import bandSkyline from "@/assets/band-skyline.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UK Test Hub — Pass Your UK Tests First Time" },
      {
        name: "description",
        content:
          "Free UK practice tests: Driving Theory, Life in the UK, IELTS, GCSE, CSCS, NHS, SERU TfL and more. Realistic mock exams with instant results and explanations.",
      },
      { property: "og:title", content: "UK Test Hub — Pass Your UK Tests First Time" },
      {
        property: "og:description",
        content:
          "Free mock tests for UK Driving Theory, Life in the UK, IELTS, GCSE, CSCS, NHS & more.",
      },
      { property: "og:image", content: heroUk },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

const featured = [
  { slug: "driving-theory-mock-1", title: "Driving Theory Mock Test 1", img: featDriving, mostPopular: true, btn: "coral" as const },
  { slug: "life-in-the-uk-mock-1", title: "Life in the UK Test 2026", img: featFlag, btn: "royal" as const },
  { slug: "ielts-grammar-starter", title: "IELTS Listening Practice", img: featHeadphones, btn: "navy" as const },
  { slug: "gcse-maths-warmup", title: "11+ Maths Practice Test", img: featCalculator, btn: "coral" as const },
  { slug: "uk-geography-quick", title: "UK Geography Test", img: featTowerBridge, btn: "royal" as const },
  { slug: "road-signs-essentials", title: "Road Signs Test", img: featRoadSigns, btn: "navy" as const },
];

const btnClass: Record<"coral" | "royal" | "navy", string> = {
  coral: "bg-coral text-coral-foreground hover:brightness-110",
  royal: "bg-royal text-royal-foreground hover:brightness-110",
  navy: "bg-navy text-navy-foreground hover:brightness-110",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center gap-3">
        <Crown className="h-5 w-5 text-royal" />
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-[0.18em] text-foreground md:text-3xl">
          {children}
        </h2>
        <Crown className="h-5 w-5 text-royal" />
      </div>
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-coral" />
    </div>
  );
}

function HomePage() {
  const daily = getDailyQuiz();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-deep text-navy-foreground">
        <img
          src={heroUk}
          alt="Big Ben at dusk with the Union Jack"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-navy-deep/70 via-navy-deep/55 to-navy-deep/20"
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="font-display font-semibold uppercase tracking-[0.25em] text-navy-foreground/80 text-5xl">
              Pass your
            </p>
            <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              UK Tests
              <br />
              <span className="text-coral">First Time</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-navy-foreground/85 md:text-lg">
              Real exam questions. Mock tests. Instant results.
              <br />
              Study anytime, anywhere.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/category/$slug"
                params={{ slug: "driving" }}
                className="inline-flex items-center gap-2 rounded-xl bg-coral px-7 py-4 text-sm font-bold uppercase tracking-wider text-coral-foreground shadow-coral transition-transform hover:-translate-y-0.5"
              >
                Start Practice <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/quiz/$slug"
                params={{ slug: "driving-theory-mock-1" }}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-wider text-navy-foreground backdrop-blur transition-colors hover:bg-white/15"
              >
                Take a Mock Test
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-navy-foreground/85">
              {[
                { icon: CheckCircle2, label: "1000+ Questions" },
                { icon: FileCheck, label: "Real Exam Format" },
                { icon: Timer, label: "Instant Results" },
                { icon: CalendarCheck, label: "Updated for 2026" },
              ].map((s) => (
                <li key={s.label} className="inline-flex items-center gap-2">
                  <s.icon className="h-4 w-4 text-coral" />
                  <span className="font-medium">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Daily Challenge floating card */}
          <Link
            to="/quiz/$slug"
            params={{ slug: daily.slug }}
            className="group relative block overflow-hidden rounded-3xl border border-white/15 bg-navy-deep/80 p-6 shadow-elevated backdrop-blur-md transition-transform hover:-translate-y-1 md:p-7"
          >
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-4 w-4 text-gold" />
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-navy-foreground">
                Daily Challenge
              </span>
            </div>
            <div className="mt-6 flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/40">
                <UnionJack className="h-full w-full" />
              </span>
              <div className="text-sm leading-snug text-navy-foreground/90">
                Can you score{" "}
                <span className="font-display text-2xl font-extrabold text-navy-foreground">
                  {daily.questions.length}/{daily.questions.length}
                </span>
                <br />
                on today&rsquo;s
                <br />
                <span className="font-semibold text-navy-foreground">
                  UK Knowledge Quiz?
                </span>
              </div>
            </div>
            <span className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-5 py-3 text-sm font-bold text-coral-foreground shadow-coral transition-transform group-hover:-translate-y-0.5">
              Start Daily Quiz <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 md:px-6">
        <AdSlot size="leaderboard" className="mt-10" />

        {/* POPULAR CATEGORIES */}
        <section className="mt-16">
          <SectionTitle>Popular Categories</SectionTitle>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => {
              const isCoral = c.accent === "coral";
              return (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-card to-card/60 p-7 text-center shadow-soft ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-1.5 hover:border-coral/40 hover:shadow-elevated"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
                  />
                  <span
                    className={`mb-5 flex h-24 w-24 items-center justify-center rounded-3xl p-2 shadow-inner transition-transform duration-300 group-hover:scale-105 ${accentClasses[c.accent]}`}
                  >
                    <CategoryIcon
                      name={c.icon}
                      alt={c.title}
                      className="h-full w-full object-contain drop-shadow-sm"
                    />
                  </span>
                  <h3 className="font-display text-base font-bold leading-tight text-foreground">
                    {c.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">
                    {c.short}
                  </p>
                  <span
                    className={`mt-5 inline-flex w-full items-center justify-center rounded-xl border-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      isCoral
                        ? "border-coral/30 text-coral group-hover:bg-coral group-hover:text-coral-foreground"
                        : "border-royal/30 text-royal group-hover:bg-royal group-hover:text-royal-foreground"
                    }`}
                  >
                    {c.topics.length}+ Tests
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <AdSlot size="leaderboard" className="my-14" />

        {/* FEATURED MOCK TESTS */}
        <section>
          <div className="flex items-end justify-between gap-4">
            <SectionTitle>Featured Mock Tests</SectionTitle>
          </div>
          <div className="mt-3 text-right">
            <Link
              to="/category/$slug"
              params={{ slug: "driving" }}
              className="inline-flex items-center gap-1 text-sm font-semibold text-coral hover:underline"
            >
              View all tests <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {featured.map((f) => {
              const q = getQuiz(f.slug);
              if (!q) return null;
              return (
                <li key={f.slug}>
                  <Link
                    to="/quiz/$slug"
                    params={{ slug: f.slug }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:border-coral/40 hover:shadow-elevated"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={f.img}
                        alt={f.title}
                        loading="lazy"
                        width={800}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {f.mostPopular && (
                        <span className="absolute left-3 top-3 rounded-md bg-coral px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-coral-foreground shadow-coral">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-display text-sm font-bold leading-tight text-foreground">
                        {f.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <ListChecks className="h-3 w-3" /> {q.questions.length} Questions
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {Math.round(q.timeLimit / 60)} Mins
                        </span>
                      </div>
                      <span
                        className={`mt-4 inline-flex w-full items-center justify-center rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-transform group-hover:-translate-y-0.5 ${btnClass[f.btn]}`}
                      >
                        Start Test
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* TOPIC PRACTICE */}
        <section className="mt-20 rounded-3xl border border-border bg-gradient-card p-6 md:p-10">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Practice by topic
          </h2>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            Jump straight into a specific topic. Every link below is its own
            page, updated with fresh questions.
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
      </main>

      {/* WHY US BAND with Beefeater + Post box */}
      <section className="relative mt-20 overflow-hidden bg-navy-deep text-navy-foreground">
        <img
          src={bandGuard}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-2 left-0 hidden h-[110%] w-auto md:block"
        />
        <img
          src={bandPostbox}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-2 right-0 hidden h-[110%] w-auto md:block"
        />
        <div className="relative mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4 md:px-6 md:py-14">
          {[
            { icon: ShieldCheck, t: "Real Exam Experience", d: "Questions based on real exam standards." },
            { icon: Timer, t: "Instant Results", d: "Get results and explanations instantly." },
            { icon: TrendingUp, t: "Track Progress", d: "Monitor your scores and improve over time." },
            { icon: Smartphone, t: "Study Anywhere", d: "Mobile friendly and responsive design." },
          ].map((f) => (
            <div key={f.t} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <f.icon className="h-4.5 w-4.5 text-coral" />
              </span>
              <div>
                <h3 className="font-display text-sm font-bold leading-tight">{f.t}</h3>
                <p className="mt-1 text-xs text-navy-foreground/70">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UK PRIDE STRIP */}
      <section className="relative overflow-hidden bg-royal/10">
        <img
          src={bandSkyline}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full object-cover object-bottom opacity-30"
        />
        <div className="relative mx-auto flex max-w-5xl items-center gap-5 px-4 py-10 md:px-6">
          <span className="flex h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
            <UnionJack className="h-full w-full" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground md:text-xl">
              Proudly helping learners across the UK and worldwide
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Free practice questions, mock exams, instant results and detailed explanations.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
