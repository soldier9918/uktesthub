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
import sectionCrown from "@/assets/section-crown.png";

export const Route = createFileRoute("/")({
  head: () => {
    const TITLE = "Free UK Mock Tests | UK Test Hub";
    const DESC =
      "Practise free UK mock tests for Driving Theory, Life in the UK, English, NHS, CSCS, Taxi and more with instant results.";
    const TWITTER_DESC = DESC;
    const OG_IMAGE = "https://www.uktesthub.com/og-uk-test-hub.jpg";
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESC },
        { property: "og:site_name", content: "UK Test Hub" },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESC },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://www.uktesthub.com/" },
        { property: "og:image", content: OG_IMAGE },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: "UK Test Hub free mock tests and study guides" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: TITLE },
        { name: "twitter:description", content: TWITTER_DESC },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: "https://www.uktesthub.com/" }],
    };
  },
  component: HomePage,
});

const featured: Array<{
  slug: string;
  title: string;
  img: string;
  questionCount: number;
  minutes: number;
  mostPopular?: boolean;
  btn: "coral" | "royal" | "navy";
}> = [
  { slug: "driving-theory-mock-1", title: "Driving Theory Mock Test 1", img: featDriving, questionCount: 24, minutes: 24, mostPopular: true, btn: "coral" },
  { slug: "life-in-the-uk-mock-1", title: "Life in the UK Test 2026", img: featFlag, questionCount: 24, minutes: 24, btn: "royal" },
  { slug: "ielts-grammar-starter", title: "IELTS Listening Practice", img: featHeadphones, questionCount: 24, minutes: 24, btn: "navy" },
  { slug: "gcse-maths-warmup", title: "11+ Maths Practice Test", img: featCalculator, questionCount: 24, minutes: 24, btn: "coral" },
  { slug: "uk-geography-quick", title: "UK Geography Test", img: featTowerBridge, questionCount: 24, minutes: 24, btn: "royal" },
  { slug: "road-signs-essentials", title: "Road Signs Test", img: featRoadSigns, questionCount: 24, minutes: 24, btn: "navy" },
];

const dailyQuizMeta = {
  slug: "general-knowledge-daily",
  questionCount: 10,
};

const btnClass: Record<"coral" | "royal" | "navy", string> = {
  coral: "bg-coral text-coral-foreground hover:brightness-110",
  royal: "bg-royal text-royal-foreground hover:brightness-110",
  navy: "bg-navy text-navy-foreground hover:brightness-110",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center gap-4">
        <img src={sectionCrown} alt="" aria-hidden className="h-12 w-12 shrink-0 object-contain" />
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-[0.18em] text-foreground md:text-3xl">
          {children}
        </h2>
        <img src={sectionCrown} alt="" aria-hidden className="h-12 w-12 shrink-0 object-contain" />
      </div>
      <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-coral" />
    </div>
  );
}

function HomePage() {
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
            <p className="mt-6 max-w-xl text-base text-navy-foreground/85 md:text-lg whitespace-pre-line">
              Practice-style questions. Mock tests. Instant results.
              {"\n"}Over <span className="font-bold text-[#d4af37]">96,000+</span> mock questions across <span className="font-bold text-[#d4af37]">110+</span> topics!
              {"\n"}Study anytime, anywhere.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#popular-categories"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("popular-categories")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  if (typeof history !== "undefined") {
                    history.replaceState(null, "", "#popular-categories");
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-coral px-7 py-4 text-sm font-bold uppercase tracking-wider text-coral-foreground shadow-coral transition-transform hover:-translate-y-0.5"
              >
                Start Practice <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/all-tests"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-wider text-navy-foreground backdrop-blur transition-colors hover:bg-white/15"
              >
                Browse All Tests
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-navy-foreground/85">
              {[
                { icon: CheckCircle2, label: "96,000+ Questions" },
                { icon: FileCheck, label: "Realistic Exam Format" },
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
          <aside className="relative lg:self-start lg:-mt-6">
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
                  { slug: "cscs-operative", label: "CSCS Tests" },
                  { slug: "nmc-cbt", label: "NMC CBT Tests" },
                  { slug: "sia-door-supervisor", label: "SIA Tests" },
                  { slug: "esol", label: "ESOL Tests" },
                  
                  
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
        <AdSlot size="leaderboard" />

        {/* POPULAR CATEGORIES */}
        <section id="popular-categories" className="mt-16 scroll-mt-24">
          <SectionTitle>Popular Categories</SectionTitle>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(() => {
              const themes: Record<string, { grad: string; ring: string; glow: string; iconGrad: string; eyebrow: string; chipBg: string; chipText: string; cta: string }> = {
                coral:   { grad: "from-[#7a0f1a] via-[#a01425] to-[#5b0812]", ring: "ring-white/10",  glow: "bg-[#ff6b6b]/30", iconGrad: "from-[#ff5a5f] to-[#c81e2c]", eyebrow: "text-[#fecaca]", chipBg: "bg-white/10 border-white/15", chipText: "text-white/85", cta: "text-[#fecaca]" },
                navy:    { grad: "from-[#0a2540] via-[#0d2c4f] to-[#061a30]", ring: "ring-white/10",  glow: "bg-[#3b82f6]/30", iconGrad: "from-[#3b82f6] to-[#1d4ed8]", eyebrow: "text-[#7dd3fc]", chipBg: "bg-white/10 border-white/15", chipText: "text-white/85", cta: "text-[#7dd3fc]" },
                gold:    { grad: "from-[#3a2a08] via-[#5a3f0d] to-[#2a1d05]", ring: "ring-amber-300/15", glow: "bg-amber-300/30", iconGrad: "from-[#fbbf24] to-[#b45309]", eyebrow: "text-amber-200", chipBg: "bg-white/10 border-white/15", chipText: "text-white/85", cta: "text-amber-200" },
                success: { grad: "from-[#06371f] via-[#0a4a2c] to-[#042818]", ring: "ring-emerald-300/15", glow: "bg-emerald-400/30", iconGrad: "from-[#34d399] to-[#047857]", eyebrow: "text-emerald-200", chipBg: "bg-white/10 border-white/15", chipText: "text-white/85", cta: "text-emerald-200" },
              };
              const CHIP_LIMIT = 3;
              return categories.map((c, idx) => {
                const th = themes[c.accent] ?? themes.coral;
                const isLastOrphan = idx === categories.length - 1 && categories.length % 4 === 1;
                const isLastOrphanMd = idx === categories.length - 1 && categories.length % 3 === 1;
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
                    className={`group relative flex h-full flex-col overflow-hidden border border-white/5 bg-gradient-to-br ${th.grad} p-5 text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)] ring-1 ${th.ring} transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-15px_rgba(0,0,0,0.7)] ${isLastOrphanMd ? "md:col-start-2" : ""} ${isLastOrphan ? "lg:col-start-2 lg:col-end-4" : ""}`}
                  >

                    <div aria-hidden className={`pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full ${th.glow} blur-3xl transition-opacity duration-300 group-hover:opacity-80`} />
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    <div className="relative flex items-start gap-3">
                      {c.icon === "Car" || c.icon === "Crown" || c.icon === "Languages" || c.icon === "GraduationCap" || c.icon === "School" || c.icon === "University" || c.icon === "Taxi" || c.icon === "Briefcase" || c.icon === "ShieldCheck" || c.icon === "HeartPulse" || c.icon === "ChefHat" || c.icon === "HardHat" || c.icon === "HardHatSafety" || c.icon === "Calculator" || c.icon === "Cpu" || c.icon === "Cloud" || c.icon === "Shield" || c.icon === "Plane" || c.icon === "Stethoscope" || c.icon === "BookOpen" || c.icon === "Scale" || c.icon === "Siren" || c.icon === "Landmark" || c.icon === "Truck" || c.icon === "HandHeart" || c.icon === "Scissors" || c.icon === "ShoppingBag" || c.icon === "PawPrint" || c.icon === "Sparkles" ? (
                        <CategoryIcon
                          name={c.icon}
                          alt={c.title}
                          className="h-20 w-20 shrink-0 object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:animate-bounce"
                        />
                      ) : (
                        <span className={`flex h-20 w-20 shrink-0 items-center justify-center bg-gradient-to-br ${th.iconGrad} text-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.55)] ring-1 ring-white/20 transition-transform duration-300 group-hover:animate-bounce`}>
                          <CategoryIcon
                            name={c.icon}
                            alt={c.title}
                            className="h-16 w-16 object-contain"
                          />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${th.eyebrow}`}>
                          Category
                        </p>
                        <h3 className="mt-0.5 font-display text-base font-extrabold leading-tight text-white md:text-lg">
                          {c.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/65">
                          {c.short}
                        </p>
                      </div>
                    </div>

                    <ul className="relative mt-4 flex flex-wrap gap-1.5">
                      {chips.map((label) => (
                        <li
                          key={label}
                          className={`border ${th.chipBg} px-2 py-0.5 text-[10px] font-semibold ${th.chipText} backdrop-blur-sm`}
                        >
                          {label}
                        </li>
                      ))}
                      {extraChips > 0 && (
                        <li className={`border border-white/20 bg-white/15 px-2 py-0.5 text-[10px] font-semibold ${th.eyebrow}`}>
                          +{extraChips}
                        </li>
                      )}
                    </ul>

                    <span className={`relative mt-auto pt-4 inline-flex items-center gap-1 self-start text-[11px] font-bold uppercase tracking-[0.18em] transition-all group-hover:gap-2 group-hover:text-white ${th.cta}`}>
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                );
              });
            })()}
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href="https://www.uktesthub.com/all-tests"
              className="group inline-flex items-center justify-center gap-3 whitespace-nowrap bg-gradient-to-br from-[#ff5a5f] to-[#c81e2c] px-10 py-5 font-display text-base font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_28px_-10px_rgba(255,90,95,0.75)] ring-1 ring-white/20 transition-transform hover:-translate-y-0.5 md:text-lg"
            >
              Browse All Categories
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </section>

        <AdSlot
          size="leaderboard"
          slotId="home-featured-top"
        />

        {/* FEATURED MOCK TESTS */}
        <section className="mt-16">
          <div className="flex flex-col items-center text-center">
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
                          <ListChecks className="h-3 w-3" /> {f.questionCount} Questions
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {f.minutes} Mins
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
        <section className="mt-20 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
          <div className="flex flex-col items-center text-center">
            <SectionTitle>Practice by Topic</SectionTitle>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Jump straight into a specific topic. Every link below is its own
              page, updated with fresh questions.
            </p>
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <div className="gap-x-8 sm:columns-2 [column-fill:_balance]">
                {categories.map((c) => (
                  <div key={c.slug} className="mb-8 break-inside-avoid">
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
                params={{ slug: dailyQuizMeta.slug }}
                className="group relative block overflow-hidden rounded-3xl border border-white/15 bg-navy-deep p-6 shadow-elevated transition-transform hover:-translate-y-1 md:p-7"
              >
                <div className="flex items-center justify-center gap-2">
                  <Crown className="h-4 w-4 text-gold" />
                  <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-navy-foreground">
                    Daily Challenge
                  </span>
                </div>
                <div className="mt-6 flex items-start gap-4">
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/40">
                    <UnionJack className="h-full w-full" />
                  </span>
                  <div className="text-sm leading-snug text-navy-foreground/90">
                    Can you score{" "}
                    <span className="font-display text-2xl font-extrabold text-navy-foreground">
                      {dailyQuizMeta.questionCount}/{dailyQuizMeta.questionCount}
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
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10 lg:p-12">
            <div className="flex flex-col items-center text-center">
              <SectionTitle>What is UK Test Hub?</SectionTitle>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                UK Test Hub is a free, independent practice platform built to
                help learners across Britain prepare for UK tests and
                assessments — no accounts, no paywalls, no surprises.
              </p>
            </div>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                We bring together every major test a person living, working
                or studying in the UK is likely to sit, and rebuild each one
                as a series of free, browser-based mock papers designed to
                reflect common exam formats. Whether you're seventeen and revising
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
                Every question is based on publicly available guidance and
                uses multiple-choice and case-study style formats similar to
                what you'll see at the test centre.
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
                values and principles, government, law and everyday life —
                designed to reflect common Life in the UK test structure
                (24 questions, 45 minutes). It's the test most people sit to
                settle (ILR) or naturalise as a British citizen, and we keep
                our content aligned with the current edition of the published
                handbook.
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
                  Workplace Compliance
                </Link>{" "}
                banks cover the everyday certifications British employers
                ask for — Food Hygiene, First Aid, Fire Safety, Manual
                Handling, Health & Safety Awareness and GDPR.
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
                Every mock on the site is designed to reflect common exam
                formats — a similar question structure where appropriate, a
                similar style of wording, a comparable difficulty curve and,
                where relevant, a comparable time limit. You can sit a full
                paper end to end, or dip into shorter topic-specific sets
                when you want to drill a single weak area in fifteen or
                twenty minutes.
              </p>
              <p>
                Tests are marked instantly the moment you finish. You see
                your score, your pass / fail status against the typical
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
              Why practice tests work
            </h3>
            <div className="mt-4 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Decades of cognitive-science research show that{" "}
                <strong className="text-foreground">retrieval practice</strong>{" "}
                — actively recalling answers under exam-like conditions — is
                one of the most effective ways to learn. Reading notes feels
                productive but rarely transfers to exam day. Mock tests
                expose gaps in your knowledge before they cost you marks,
                build familiarity with the question style, and reduce exam
                anxiety through repeated low-stakes exposure.
              </p>
              <p>
                <strong className="text-foreground">Spaced repetition</strong>{" "}
                — returning to the same weak topics across several short
                sessions — beats one long cram the night before. Twenty
                focused minutes a day for two weeks will almost always
                outperform a single five-hour Sunday session, because the
                act of forgetting and re-learning is what locks the answer
                into long-term memory. Sitting timed mocks under realistic
                conditions also matters: most people who fail a UK exam
                don't fail because they didn't know the material — they
                fail because they ran out of time, misread a question
                under pressure, or panicked at the first hard item.
                Practising the full paper end to end, with the clock
                running, makes test day feel familiar instead of frightening.
              </p>
            </div>

            <h3 className="mt-10 border-l-4 border-coral pl-4 font-display text-xl font-bold text-foreground md:text-2xl">
              Built for UK exams
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
                And it's free — genuinely free, supported by unobtrusive
                advertising rather than locked-down paid tiers.
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
                use our Construction & Trade bank before booking their CSCS
                card test, security staff revise for the SIA in our
                Security & Door Supervision section, and care workers
                brush up on safeguarding and food hygiene.
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
                { label: "CSCS & site safety", slug: "construction" as const },
                { label: "NHS numeracy & literacy", slug: "nhs" as const },
                { label: "Workplace compliance", slug: "professional" as const },
              ].map((item) => (
                <li key={item.slug}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: item.slug }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-coral/40 hover:bg-accent/40"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-coral" />
                    <span className="flex-1">{item.label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              to="/blog"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-coral hover:underline"
            >
              Read revision tips in our study guides
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Hidden AdSense slot before "How to Pass UK Tests First Time" */}
        <AdSlot size="leaderboard" />

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

        {/* Reserved ad slot before Latest Study Guides */}
        <AdSlot size="leaderboard" />

        {/* LATEST STUDY GUIDES */}
        <section className="mt-20">
          <div className="flex flex-col items-center text-center">
            <SectionTitle>Latest Study Guides</SectionTitle>
          </div>
          <div className="mt-3 text-right">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-coral hover:underline"
            >
              View all study guides <ArrowRight className="h-4 w-4" />
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
            { icon: ShieldCheck, t: "Real Exam Experience", d: "Practice-style questions based on publicly available exam guidance." },
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
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-100 to-sky-50">
        <img
          src={bandSkyline}
          alt="London skyline"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 w-full select-none object-contain object-bottom"
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 pb-40 pt-10 sm:pb-48 md:px-6 md:pb-56 md:pt-14 lg:pb-64">
          <div className="flex items-center gap-4 sm:gap-5">
            <span className="flex h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white sm:h-12 sm:w-12">
              <UnionJack className="h-full w-full" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold leading-tight text-foreground sm:text-lg md:text-xl">
                Proudly helping learners across the UK and worldwide
              </h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Free practice questions, mock exams, instant results and detailed explanations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
