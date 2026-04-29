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
import { blogPosts } from "@/data/blog";
// (TestBadge removed)

const latestPosts = [...blogPosts]
  .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))
  .slice(0, 3);

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
          "Free mock tests for UK Driving Theory, Life in the UK, IELTS, GCSE, CSCS, NHS & more. Realistic exams with instant results.",
      },
      { property: "og:image", content: "/og-uk-test-hub.jpg" },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "800" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "UK Test Hub — Pass Your UK Tests First Time" },
      {
        name: "twitter:description",
        content:
          "Free mock tests for UK Driving Theory, Life in the UK, IELTS, GCSE, CSCS, NHS & more.",
      },
      { name: "twitter:image", content: "/og-uk-test-hub.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://www.uktesthub.com/" }],
  }),
  component: HomePage,
});

const featured: Array<{
  slug: string;
  title: string;
  img: string;
  mostPopular?: boolean;
  btn: "coral" | "royal" | "navy";
}> = [
  { slug: "driving-theory-mock-1", title: "Driving Theory Mock Test 1", img: featDriving, mostPopular: true, btn: "coral" },
  { slug: "life-in-the-uk-mock-1", title: "Life in the UK Test 2026", img: featFlag, btn: "royal" },
  { slug: "ielts-grammar-starter", title: "IELTS Listening Practice", img: featHeadphones, btn: "navy" },
  { slug: "gcse-maths-warmup", title: "11+ Maths Practice Test", img: featCalculator, btn: "coral" },
  { slug: "uk-geography-quick", title: "UK Geography Test", img: featTowerBridge, btn: "royal" },
  { slug: "road-signs-essentials", title: "Road Signs Test", img: featRoadSigns, btn: "navy" },
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
    <div
      className="min-h-screen bg-[#f7f5f0]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 50% at 0% 0%, rgba(1,33,105,0.07), transparent 60%), radial-gradient(ellipse 55% 45% at 100% 100%, rgba(200,16,46,0.07), transparent 60%), radial-gradient(ellipse 40% 30% at 100% 0%, rgba(200,16,46,0.04), transparent 60%), radial-gradient(ellipse 40% 30% at 0% 100%, rgba(1,33,105,0.05), transparent 60%)",
        backgroundAttachment: "fixed",
      }}
    >
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

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-6 md:px-6 md:pb-24 md:pt-8 lg:grid-cols-[1fr_280px] lg:items-center">
          <div>
            <p className="font-display font-semibold uppercase tracking-[0.25em] text-navy-foreground/80 text-5xl">
              Pass your
            </p>
            <h1 className="mt-3 font-sans text-7xl font-black uppercase leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">
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

          {/* Popular tests panel */}
          <aside className="relative hidden lg:block lg:self-start lg:-mt-6">
            <div className="rounded-2xl border border-white/15 bg-navy-deep/40 p-5 shadow-elevated backdrop-blur-md">
              <div className="border-b border-white/10 pb-3">
                <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-coral">
                  Popular Mock Tests
                </span>
              </div>
              <ul className="mt-3 space-y-0.5">
                {[
                  { slug: "seru", label: "SERU Tests" },
                  { slug: "driving-theory", label: "Driving Theory Tests" },
                  { slug: "life-in-the-uk", label: "Life in the UK Tests" },
                  { slug: "ielts", label: "IELTS Tests" },
                  { slug: "cscs", label: "CSCS Tests" },
                  { slug: "nmc", label: "NMC" },
                  { slug: "nmc-cbt", label: "CBT Tests" },
                  { slug: "sia", label: "SIA Tests" },
                  { slug: "esol", label: "ESOL Tests" },
                  
                  { slug: "logical-reasoning", label: "Logical Reasoning Tests" },
                  { slug: "food-hygiene", label: "Food Hygiene Tests" },
                  { slug: "first-aid", label: "First Aid Tests" },
                ].map((t) => (
                  <li key={t.label}>
                    <Link
                      to="/topic/$slug"
                      params={{ slug: t.slug }}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-navy-foreground/90 transition-colors hover:bg-white/10 hover:text-coral"
                    >
                      <span className="flex-1 truncate">{t.label}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-coral opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t border-white/10 pt-3">
                <Link
                  to="/all-tests"
                  className="group flex items-center justify-center gap-2 rounded-lg bg-coral px-4 py-2.5 text-center font-display text-sm font-bold uppercase tracking-[0.15em] text-coral-foreground shadow-coral transition-transform hover:-translate-y-0.5"
                >
                  Browse all tests
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 md:px-6">
        <AdSlot size="leaderboard" className="mt-10" />

        {/* POPULAR CATEGORIES */}
        <section className="mt-16">
          <SectionTitle>Popular Categories</SectionTitle>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => {
              const isCoral = c.accent === "coral";
              // Short labels for the chip row (keeps tiles visually distinct).
              const CHIP_LIMIT = 4;
              const chips = c.topics
                .slice(0, CHIP_LIMIT)
                .map((t) =>
                  t.title
                    .replace(/ Test$| Practice$| Quiz$| Exam$| Assessment$/i, "")
                    .replace(/^GCSE /, "GCSE ")
                    .trim(),
                );
              const extraChips = Math.max(0, c.topics.length - CHIP_LIMIT);
              return (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group flex h-full flex-col items-center rounded-2xl border border-border bg-card px-4 py-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-coral/40 hover:shadow-elevated"
                >
                  <CategoryIcon
                    name={c.icon}
                    alt={c.title}
                    className="mb-4 h-16 w-16 object-contain"
                  />
                  <div className="flex w-full flex-1 flex-col items-center">
                    <h3 className="font-display text-sm font-bold leading-tight text-foreground">
                      {c.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 min-h-[3.4em] text-[11px] leading-snug text-muted-foreground">
                      {c.short}
                    </p>
                    <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
                      {chips.map((label) => (
                        <li
                          key={label}
                          className="rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-foreground/80"
                        >
                          {label}
                        </li>
                      ))}
                      {extraChips > 0 && (
                        <li className="rounded-full border border-coral/40 bg-coral/10 px-2 py-0.5 text-[10px] font-semibold text-coral">
                          +{extraChips} more
                        </li>
                      )}
                    </ul>
                  </div>
                  <span
                    className={`mt-5 inline-flex items-center justify-center gap-1 rounded-md border px-4 py-1.5 text-[11px] font-bold transition-colors ${
                      isCoral
                        ? "border-coral/40 text-coral group-hover:bg-coral group-hover:text-coral-foreground"
                        : "border-royal/40 text-royal group-hover:bg-royal group-hover:text-royal-foreground"
                    }`}
                  >
                    Explore <ArrowRight className="h-3 w-3" />
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
                        className={`mt-auto inline-flex w-full items-center justify-center rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-transform group-hover:-translate-y-0.5 ${btnClass[f.btn]}`}
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
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Practice by topic
              </h2>
              <p className="mt-1 max-w-2xl text-muted-foreground">
                Jump straight into a specific topic. Every link below is its own
                page, updated with fresh questions.
              </p>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
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
            </div>

            <aside className="lg:sticky lg:top-24">
              <Link
                to="/quiz/$slug"
                params={{ slug: daily.slug }}
                className="group relative block overflow-hidden rounded-3xl border border-white/15 bg-navy-deep p-6 shadow-elevated transition-transform hover:-translate-y-1 md:p-7"
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
            </aside>
          </div>
        </section>

        {/* WHAT IS UK TEST HUB */}
        <section className="mt-20">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-coral">
                About the platform
              </span>
              <h2 className="mt-4 border-l-4 border-coral pl-4 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
                What is UK Test Hub?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                UK Test Hub is a free practice platform built to help learners
                across Britain pass official UK exams first time — no accounts,
                no paywalls, no surprises.
              </p>

              <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  We bring together every major test a person living, working
                  or studying in the UK is likely to sit, and rebuild each one
                  as a series of free, browser-based mock papers that mirror
                  the real exam format. Whether you're seventeen and revising
                  for the{" "}
                  <Link
                    to="/category/$slug"
                    params={{ slug: "driving" }}
                    className="font-medium text-coral hover:underline"
                  >
                    DVSA Driving Theory Test
                  </Link>
                  , a parent helping a child through the 11+, or an adult
                  applying for British citizenship, you can practise here for
                  free, on any device, without ever creating an account.
                </p>
              </div>

              <h3 className="mt-10 border-l-4 border-coral pl-4 font-display text-xl font-bold text-foreground md:text-2xl">
                What we cover
              </h3>
              <div className="mt-4 space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Our{" "}
                  <Link
                    to="/category/$slug"
                    params={{ slug: "driving" }}
                    className="font-medium text-coral hover:underline"
                  >
                    Driving section
                  </Link>{" "}
                  covers the DVSA car theory test, motorcycle theory, hazard
                  perception clips and the practical show-me / tell-me
                  questions, plus dedicated banks for LGV and PCV candidates.
                  Every question is mapped to the official DVSA learning
                  outcomes and uses the same multiple-choice and case-study
                  formats you'll see at the test centre.
                </p>
                <p>
                  The{" "}
                  <Link
                    to="/category/$slug"
                    params={{ slug: "citizenship" }}
                    className="font-medium text-coral hover:underline"
                  >
                    Life in the UK
                  </Link>{" "}
                  bank takes you through the full handbook — British history,
                  values and principles, government, law and everyday life — in
                  the same 24-question, 45-minute format used by the Home
                  Office. It's the test most people sit to settle (ILR) or
                  naturalise as a British citizen, and we keep it aligned with
                  the current edition of the official handbook.
                </p>
                <p>
                  For{" "}
                  <Link
                    to="/category/$slug"
                    params={{ slug: "english" }}
                    className="font-medium text-coral hover:underline"
                  >
                    IELTS, ESOL and other English language exams
                  </Link>
                  , we have practice for reading, listening, grammar and
                  vocabulary across A1 through C1 levels, suitable for
                  international students, healthcare professionals and visa
                  applicants. Our{" "}
                  <Link
                    to="/category/$slug"
                    params={{ slug: "education" }}
                    className="font-medium text-coral hover:underline"
                  >
                    Education
                  </Link>{" "}
                  section runs from 11+ verbal and non-verbal reasoning all
                  the way through to GCSE Maths, English and the sciences,
                  while our{" "}
                  <Link
                    to="/category/$slug"
                    params={{ slug: "career" }}
                    className="font-medium text-coral hover:underline"
                  >
                    Career
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/category/$slug"
                    params={{ slug: "professional" }}
                    className="font-medium text-coral hover:underline"
                  >
                    Professional
                  </Link>{" "}
                  banks cover everything from the CSCS Health, Safety and
                  Environment test and the SIA door-supervisor licence to
                  food hygiene, first aid and trade-specific assessments.
                  We also publish{" "}
                  <Link
                    to="/category/$slug"
                    params={{ slug: "nhs" }}
                    className="font-medium text-coral hover:underline"
                  >
                    NHS numeracy and literacy
                  </Link>{" "}
                  papers for healthcare candidates, and a{" "}
                  <Link
                    to="/category/$slug"
                    params={{ slug: "fun" }}
                    className="font-medium text-coral hover:underline"
                  >
                    Fun
                  </Link>{" "}
                  category of British general-knowledge quizzes for anyone
                  who just enjoys a good test.
                </p>
              </div>

              <h3 className="mt-10 border-l-4 border-coral pl-4 font-display text-xl font-bold text-foreground md:text-2xl">
                How our mock tests work
              </h3>
              <div className="mt-4 space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Every mock on the site is built to match the real exam as
                  closely as possible — the same number of questions, the same
                  style of wording, the same difficulty curve and, where
                  relevant, the same time limit. You can sit a full paper end
                  to end, or dip into shorter topic-specific sets when you
                  want to drill a single weak area in fifteen or twenty
                  minutes.
                </p>
                <p>
                  Tests are marked instantly the moment you finish. You see
                  your score, your pass / fail status against the official
                  pass mark, and a question-by-question breakdown with a
                  written explanation for every answer — including the wrong
                  ones, so you understand why a distractor is wrong as well
                  as why the correct option is right. Your best score on
                  each mock is saved locally on your device, so you can
                  watch yourself improve without ever needing to register.
                </p>
                <p>
                  Everything works on a phone, a tablet, a school Chromebook
                  or a desktop. There's no app to install, no email to
                  hand over, no trial that quietly turns into a subscription.
                  You open the page, you take the test, you learn from it,
                  and you come back when you're ready for the next one.
                </p>
              </div>

              <h3 className="mt-10 border-l-4 border-coral pl-4 font-display text-xl font-bold text-foreground md:text-2xl">
                Built for British learners
              </h3>
              <div className="mt-4 space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  UK Test Hub is written in British English, uses British
                  spellings and references British institutions — the DVSA,
                  the Home Office, Ofqual, the NHS, the awarding bodies
                  behind GCSE and A-level. Our questions use UK road signs,
                  UK currency, UK measurements and UK examples, because
                  practising on American or generic content is one of the
                  fastest ways to pick up bad habits before a UK exam.
                </p>
                <p>
                  Content is reviewed against the most recent published
                  specifications from each examining body, and we refresh
                  papers whenever a syllabus, handbook or code of practice
                  is updated. When the Highway Code changes, our hazard
                  perception and theory questions change with it. When the
                  Life in the UK handbook gets a new edition, we re-check
                  every question against the new chapters.
                </p>
                <p>
                  Accessibility matters too. The site is keyboard-navigable,
                  has strong colour contrast, scales properly on small
                  screens, and avoids the cluttered pop-ups and forced
                  sign-ups that make so many revision sites painful to use.
                  And it's free — genuinely free, forever, supported by
                  unobtrusive advertising rather than locked-down premium
                  tiers.
                </p>
              </div>

              <h3 className="mt-10 border-l-4 border-coral pl-4 font-display text-xl font-bold text-foreground md:text-2xl">
                Who uses UK Test Hub
              </h3>
              <div className="mt-4 space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Learner drivers and cab/taxi drivers make up the largest group — teenagers
                  preparing for their first theory test, chauffeurs and PHV drivers,
                  trainee LGV and PCV drivers building toward a professional licence.
                  In particular, private hire drivers preparing for the{" "}
                  <Link
                    to="/seru-tfl"
                    className="font-medium text-coral hover:underline"
                  >
                    TfL SERU assessment
                  </Link>{" "}
                  are one of our largest and fastest-growing audiences, using
                  our SERU mocks to drill safety, equality and regulatory
                  scenarios before sitting the real thing at a TfL test centre.
                  Alongside them, thousands of people each year use our
                  Life in the UK papers as part of their journey to
                  Indefinite Leave to Remain or British citizenship.
                </p>
                <p>
                  We're used by international students preparing for IELTS
                  and Cambridge English exams, by NHS candidates sitting
                  numeracy and literacy assessments before training, and
                  by GCSE and 11+ students who want extra timed practice
                  beyond what their school provides. Construction workers
                  use the CSCS bank before booking their card test, security
                  staff revise for the SIA, and care workers brush up on
                  safeguarding and food hygiene.
                </p>
                <p>
                  Teachers, tutors and parents use UK Test Hub as a free
                  homework resource, setting topic mocks for students and
                  reviewing the explanations together. And quite a few
                  people simply enjoy testing themselves on British history,
                  geography and trivia — which is exactly what our Fun
                  category is there for.
                </p>
              </div>

              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "GCSE & 11+", slug: "education" as const },
                  { label: "CSCS & SIA cards", slug: "career" as const },
                  { label: "NHS numeracy & literacy", slug: "nhs" as const },
                  { label: "Professional licensing", slug: "professional" as const },
                ].map((item) => (
                  <li key={item.slug}>
                    <Link
                      to="/category/$slug"
                      params={{ slug: item.slug }}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-coral/40 hover:bg-accent/40"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-coral" />
                      <span className="flex-1">{item.label}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-success">
                Why it works
              </span>
              <h3 className="mt-3 border-l-4 border-coral pl-4 font-display text-xl font-bold text-foreground md:text-2xl">
                Why Practice Tests Work
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Decades of cognitive-science research show that{" "}
                <strong className="text-foreground">retrieval practice</strong>{" "}
                — actively recalling answers under exam-like conditions — is
                one of the most effective ways to learn. Reading notes feels
                productive but rarely transfers to exam day.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Mock tests expose gaps in your knowledge before they cost you
                marks, build familiarity with the question style, and reduce
                exam anxiety through repeated low-stakes exposure.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Spaced repetition</strong>{" "}
                — returning to the same weak topics across several short
                sessions — beats one long cram the night before. Twenty
                focused minutes a day for two weeks will almost always
                outperform a single five-hour Sunday session, because the
                act of forgetting and re-learning is what locks the answer
                into long-term memory.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Sitting timed mocks under realistic conditions also matters.
                Most people who fail a UK exam don't fail because they
                didn't know the material — they fail because they ran out
                of time, misread a question under pressure, or panicked at
                the first hard item. Practising the full paper end to end,
                with the clock running, makes test day feel familiar
                instead of frightening.
              </p>
              <Link
                to="/blog"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-coral hover:underline"
              >
                Read revision tips on the blog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </section>

        <AdSlot size="leaderboard" className="mt-14" />

        {/* HOW TO PASS UK TESTS FIRST TIME */}
        <section className="mt-16">
          <SectionTitle>How to Pass UK Tests First Time</SectionTitle>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: "1. Start with a diagnostic mock",
                d: "Take a full mock test before revising. Your score map shows exactly which topics need the most work.",
              },
              {
                t: "2. Drill weak topics",
                d: "Use topic-specific practice tests to attack low-scoring areas in short, focused sessions of 15–20 minutes.",
              },
              {
                t: "3. Sit timed mocks weekly",
                d: "Recreate exam conditions with full-length timed mocks. Aim to consistently exceed the pass mark before booking.",
              },
              {
                t: "4. Review every wrong answer",
                d: "Read every explanation, not just the score. Understanding why an answer is wrong is what makes the next one right.",
              },
            ].map((c) => (
              <li
                key={c.t}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <h3 className="font-display text-sm font-bold text-foreground">
                  {c.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.d}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* LATEST FROM THE BLOG */}
        <section className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <SectionTitle>Latest from the Blog</SectionTitle>
          </div>
          <div className="mt-3 text-right">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-coral hover:underline"
            >
              View all articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {latestPosts.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:border-coral/40 hover:shadow-elevated"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <img
                      src={p.hero}
                      alt={p.title}
                      loading="lazy"
                      width={800}
                      height={450}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-coral">
                      {p.category}
                    </span>
                    <h3 className="mt-2 font-display text-base font-bold leading-snug text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {p.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-coral">
                      Read article <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
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
