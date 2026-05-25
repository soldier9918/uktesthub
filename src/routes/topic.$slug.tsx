import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { getTest } from "@/data/english/categories";
import { SiteHeader } from "@/components/SiteHeader";
import { BackToAllTests } from "@/components/BackToAllTests";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { BookmarkButton } from "@/components/BookmarkButton";
import { CategoryIcon, accentClasses } from "@/components/CategoryIcon";
import { findTopic } from "@/data/categories";
import { listMockSlots, QUESTIONS_PER_MOCK } from "@/data/mocks";
import { Home, ChevronRight, ArrowRight, Clock } from "lucide-react";
import { IndependentDisclaimer } from "@/components/IndependentDisclaimer";
import { breadcrumbSchema } from "@/lib/seo";
import { LEGACY_SLUG_REDIRECTS } from "@/data/slug-redirects";

export const Route = createFileRoute("/topic/$slug")({
  loader: ({ params }) => {
    const canonical = LEGACY_SLUG_REDIRECTS[params.slug];
    if (canonical) throw redirect({ to: "/topic/$slug", params: { slug: canonical } });
    if (getTest(params.slug)) {
      throw redirect({
        to: "/english-language-tests/$test",
        params: { test: params.slug },
      });
    }
    const found = findTopic(params.slug);
    if (!found) throw notFound();
    return { category: found.category, topic: found.topic };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Topic — UK Test Hub" }] };
    const { category, topic } = loaderData;
    const slug = params?.slug ?? topic.slug;
    const withSuffix = `${topic.title} Practice Test | UK Test Hub`;
    const title = withSuffix.length <= 60 ? withSuffix : `${topic.title} | UK Test Hub`;
    const description = `Practise ${topic.title} with free mock tests — ${QUESTIONS_PER_MOCK} questions per mock with instant results and explanations.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: category.heroImage },
        { property: "og:url", content: `https://www.uktesthub.com/topic/${slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `https://www.uktesthub.com/topic/${slug}` }],
      scripts: [
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: category.title, url: `/category/${category.slug}` },
          { name: topic.title, url: `/topic/${slug}` },
        ]),
      ],
    };
  },
  component: TopicPage,
});



function MockCard({
  slug,
  mockNumber,
  available,
}: {
  slug: string;
  mockNumber: number;
  available: boolean;
}) {
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    if (!available) return;
    try {
      const raw = localStorage.getItem(`uk-test-hub:best:${slug}`);
      const n = raw ? parseInt(raw, 10) : 0;
      if (n > 0) setBestScore(n);
    } catch {
      // ignore
    }
  }, [slug, available]);

  const percent =
    bestScore != null ? Math.min(100, Math.round((bestScore / QUESTIONS_PER_MOCK) * 100)) : 0;

  const inner = (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-card p-4 shadow-soft transition-all ${
        available
          ? "border-coral/30 hover:-translate-y-0.5 hover:border-coral hover:shadow-elevated"
          : "border-border opacity-75"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-foreground">
          Mock Test {mockNumber}
        </h3>
        {!available && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Soon
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {QUESTIONS_PER_MOCK} questions ·{" "}
        <Clock className="inline h-3 w-3" /> ~{QUESTIONS_PER_MOCK} min
      </p>

      {available && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-muted-foreground">
              {bestScore != null ? "Best score" : "Not attempted yet"}
            </span>
            {bestScore != null && (
              <span className="text-coral">
                {bestScore}/{QUESTIONS_PER_MOCK} · {percent}%
              </span>
            )}
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-coral transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3">
        {available ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-coral px-3 py-1.5 text-xs font-semibold text-white">
            {bestScore != null ? "Retake test" : "Start test"}{" "}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            Coming soon
          </span>
        )}
      </div>
    </div>
  );

  if (!available) return <div className="cursor-not-allowed">{inner}</div>;
  return (
    <Link to="/quiz/$slug" params={{ slug }} className="group block h-full">
      {inner}
    </Link>
  );
}

function TopicPage() {
  const { category, topic } = Route.useLoaderData();
  const slots = listMockSlots(topic.slug);
  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <SiteHeader />
      <BackToAllTests />

      <section className="relative overflow-hidden bg-navy-deep text-navy-foreground">
        <img
          src={category.heroImage}
          alt={topic.title}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-navy-deep/85 via-navy-deep/65 to-navy-deep/30"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-foreground/80">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-coral">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="hover:text-coral"
            >
              {category.title}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-navy-foreground">{topic.title}</span>
          </nav>

          <div className="mt-6 flex items-center gap-4">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-elevated ${accentClasses[category.accent]}`}
            >
              <CategoryIcon name={category.icon} className="h-10 w-10" />
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              45 Mock Tests
            </span>
            <BookmarkButton topicSlug={topic.slug} className="bg-white/10 text-white hover:bg-white/20" />
          </div>
          <h1 className="mt-5 font-sans font-black uppercase leading-[0.95] tracking-tight text-6xl md:text-7xl lg:text-8xl">
            {topic.title}
          </h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-coral" />
          <p className="mt-4 max-w-2xl text-base text-navy-foreground/85 md:text-lg">
            Choose a mock test below. Each test has {QUESTIONS_PER_MOCK} questions
            with detailed explanations. Your best score is saved on this device.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <AdSlot size="leaderboard" className="mb-10" />

        <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
          <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
            {topic.title}
          </h2>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {availableCount} of {slots.length} available
          </span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((s) => (
            <MockCard
              key={s.slug}
              slug={s.slug}
              mockNumber={s.mockNumber}
              available={s.available}
            />
          ))}
        </div>
        <IndependentDisclaimer />
      </main>

      <SiteFooter />
    </div>
  );
}
