import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { getAllPosts } from "@/data/blog";
import { pageMeta } from "@/lib/seo";
import { Home, ChevronRight, ArrowRight, Clock, Search, X } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageMeta({
      title: "Study Guides — UK Test Hub | Free UK Exam Guides & Study Plans",
      description:
        "Free guides, tips and study plans for UK tests, licences and exams: Driving Theory, Life in the UK, IELTS, GCSE, CSCS, NHS, SERU TfL and more. Updated for 2026.",
      path: "/blog",
    }),
  component: BlogIndex,
});

// Order + friendly section titles for the existing post categories
const CATEGORY_SECTIONS: { key: string; title: string; slug: string }[] = [
  { key: "Driving", title: "Driving & Transport", slug: "driving-transport" },
  { key: "Taxi & Private Hire", title: "Taxi & Private Hire (TfL/SERU)", slug: "taxi-private-hire" },
  { key: "Citizenship", title: "Life in the UK & Citizenship", slug: "citizenship" },
  { key: "English", title: "English & IELTS", slug: "english-ielts" },
  { key: "Education", title: "Education & Exams", slug: "education-exams" },
  { key: "Professional", title: "Professional & Trade (CSCS)", slug: "professional-trade" },
  { key: "NHS", title: "NHS & Healthcare", slug: "nhs-healthcare" },
  { key: "Fun", title: "General Knowledge & Fun", slug: "general-knowledge" },
];

type Post = ReturnType<typeof getAllPosts>[number];

function PostCard({ p }: { p: Post }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: p.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-elevated"
    >
      <div className="aspect-[16/9] overflow-hidden bg-muted">
        <img
          src={p.hero}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-coral">
          {p.category}
        </span>
        <h3 className="mt-2 font-display text-lg font-bold leading-tight text-foreground">
          {p.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {p.readingMinutes} min read
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-coral">
            Read article <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function BlogIndex() {
  const posts = getAllPosts();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const isSearching = q.length > 0;

  const filtered = useMemo(() => {
    if (!isSearching) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [posts, q, isSearching]);

  const grouped = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const p of posts) {
      const arr = map.get(p.category) ?? [];
      arr.push(p);
      map.set(p.category, arr);
    }
    return CATEGORY_SECTIONS
      .map((s) => ({ ...s, posts: map.get(s.key) ?? [] }))
      .filter((s) => s.posts.length > 0);
  }, [posts]);

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <SiteHeader />
      <section className="bg-navy-deep text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-foreground/80">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-coral">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-navy-foreground">Study Guides</span>
          </nav>
          <h1 className="mt-5 font-sans font-black uppercase leading-[0.95] tracking-tight text-6xl md:text-7xl lg:text-8xl">
            UK Test Hub Study Guides
          </h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-coral" />
          <p className="mt-4 max-w-2xl text-base text-navy-foreground/85 md:text-lg">
            Free guides, tips and study plans for UK tests, licences and exams.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <AdSlot size="leaderboard" className="mb-10" />

        {/* Search bar */}
        <div className="mb-8">
          <label htmlFor="guides-search" className="sr-only">
            Search study guides
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="guides-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides by title, topic or category…"
              className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-12 text-base text-foreground shadow-soft outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category jump nav (hidden when searching) */}
        {!isSearching && grouped.length > 1 && (
          <div className="mb-10 flex flex-wrap gap-2">
            {grouped.map((s) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition hover:border-coral hover:text-coral"
              >
                {s.title}
              </a>
            ))}
          </div>
        )}

        {isSearching ? (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {filtered.length} {filtered.length === 1 ? "result" : "results"} for “{query}”
              </h2>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-sm font-semibold text-coral hover:underline"
              >
                Clear search
              </button>
            </div>
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <p className="text-base text-muted-foreground">
                  No guides match your search. Try a different keyword.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                  <PostCard key={p.slug} p={p} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <div className="space-y-16">
            {grouped.map((s) => (
              <section key={s.slug} id={s.slug} className="scroll-mt-24">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
                      {s.title}
                    </h2>
                    <div className="mt-2 h-1 w-12 rounded-full bg-coral" />
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.posts.length} {s.posts.length === 1 ? "guide" : "guides"}
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {s.posts.map((p) => (
                    <PostCard key={p.slug} p={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
