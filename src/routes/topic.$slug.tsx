import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { CategoryIcon, accentClasses } from "@/components/CategoryIcon";
import { findTopic } from "@/data/categories";
import { listMockSlots, QUESTIONS_PER_MOCK } from "@/data/mocks";
import { Home, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/topic/$slug")({
  loader: ({ params }) => {
    const found = findTopic(params.slug);
    if (!found) throw notFound();
    return { category: found.category, topic: found.topic };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Topic — UK Test Hub" }] };
    const { category, topic } = loaderData;
    const title = `${topic.title} — 45 Free Mock Tests — UK Test Hub`;
    const description = `Practice the ${topic.title} with 45 free mock tests, each containing ${QUESTIONS_PER_MOCK} questions with explanations.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: category.heroImage },
      ],
    };
  },
  component: TopicPage,
});

function useMockProgress(slugs: string[]) {
  const [scores, setScores] = useState<Record<string, number>>({});
  useEffect(() => {
    const out: Record<string, number> = {};
    for (const s of slugs) {
      try {
        const v = localStorage.getItem(`uk-test-hub:best:${s}`);
        if (v != null)
          out[s] = Math.max(0, Math.min(QUESTIONS_PER_MOCK, parseInt(v, 10) || 0));
      } catch {
        // ignore
      }
    }
    setScores(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugs.join("|")]);
  return scores;
}

function MockCard({
  slug,
  title,
  available,
  best,
}: {
  slug: string;
  title: string;
  available: boolean;
  best: number;
}) {
  const pct = Math.round((best / QUESTIONS_PER_MOCK) * 100);
  const inner = (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card px-5 py-4 shadow-soft transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-coral/40 group-hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-bold leading-tight text-foreground">
          {title}
        </h3>
        {!available && (
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Soon
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-coral transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
          {best} / {QUESTIONS_PER_MOCK}
        </span>
      </div>
    </div>
  );

  if (!available) {
    return <div className="group cursor-not-allowed opacity-70">{inner}</div>;
  }
  return (
    <Link to="/quiz/$slug" params={{ slug }} className="group block">
      {inner}
    </Link>
  );
}

function TopicPage() {
  const { category, topic } = Route.useLoaderData();
  const slots = listMockSlots(topic.slug);
  const slugs = slots.map((s) => s.slug);
  const scores = useMockProgress(slugs);
  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <SiteHeader />

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
              <CategoryIcon name={category.icon} className="h-7 w-7" />
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              45 Mock Tests
            </span>
          </div>
          <h1 className="mt-5 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight md:text-6xl">
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
              title={`Test ${s.mockNumber}`}
              available={s.available}
              best={scores[s.slug] ?? 0}
            />
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
