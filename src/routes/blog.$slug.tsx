import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { getPostBySlug, getRelatedPosts } from "@/data/blog";
import { pageMeta, articleSchema, breadcrumbSchema } from "@/lib/seo";
import { Home, ChevronRight, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const slug = params?.slug ?? "";
    const post = getPostBySlug(slug);
    if (!post) return { meta: [{ title: "Article — UK Test Hub" }] };
    const base = pageMeta({
      title: `${post.title} — UK Test Hub`,
      description: post.description,
      path: `/blog/${slug}`,
      image: post.hero,
      type: "article",
    });
    return {
      ...base,
      scripts: [
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Study Guides", url: "/blog" },
          { name: post.title, url: `/blog/${slug}` },
        ]),
        articleSchema({ ...post, image: post.hero }),
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const post = getPostBySlug(slug);
  if (!post) return null;
  const related = getRelatedPosts(post.slug);
  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <SiteHeader />
      <section className="relative overflow-hidden bg-navy-deep text-navy-foreground">
        <img
          src={post.hero}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-navy-deep/85 via-navy-deep/65 to-navy-deep/30"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-foreground/80">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-coral">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/blog" className="hover:text-coral">Study Guides</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-navy-foreground">{post.category}</span>
          </nav>
          <h1 className="mt-5 font-display font-extrabold uppercase leading-tight tracking-tight md:text-5xl lg:text-6xl font-sans text-4xl">
            {post.title}
          </h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-coral" />
          <p className="mt-4 max-w-2xl text-base text-navy-foreground/85 md:text-lg">
            {post.excerpt}
          </p>
          <div className="mt-5 flex items-center gap-4 text-xs text-navy-foreground/70">
            <span>{post.author}</span>
            <span>·</span>
            <span>{new Date(post.datePublished).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingMinutes} min read</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <article className="blog-article">
          {post.body()}
        </article>

        <AdSlot size="in-feed" className="my-12" />

        {related.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
              Related articles
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-elevated"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    <img src={p.hero} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base font-bold leading-tight">{p.title}</h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-coral">
                      Read article <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
