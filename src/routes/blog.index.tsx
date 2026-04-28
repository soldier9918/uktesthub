import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { getAllPosts } from "@/data/blog";
import { pageMeta } from "@/lib/seo";
import { Home, ChevronRight, ArrowRight, Clock } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageMeta({
      title: "Blog — UK Test Hub | Free UK Exam Guides & Study Tips",
      description:
        "Free guides, tips and study plans for UK exams: Driving Theory, Life in the UK, IELTS, GCSE, CSCS, NHS, SERU TfL and more. Updated for 2026.",
      path: "/blog",
    }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = getAllPosts();
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
            <span className="text-navy-foreground">Blog</span>
          </nav>
          <h1 className="mt-5 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight md:text-6xl">
            UK Test Hub Blog
          </h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-coral" />
          <p className="mt-4 max-w-2xl text-base text-navy-foreground/85 md:text-lg">
            Free guides, tips and study plans for every UK test we cover.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <AdSlot size="leaderboard" className="mb-10" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
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
                <h2 className="mt-2 font-display text-lg font-bold leading-tight text-foreground">
                  {p.title}
                </h2>
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
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
