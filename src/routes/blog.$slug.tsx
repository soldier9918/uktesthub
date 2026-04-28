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
          { name: "Blog", url: "/blog" },
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
            <Link to="/blog" className="hover:text-coral">Blog</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-navy-foreground">{post.category}</span>
          </nav>
          <h1 className="mt-5 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight md:text-5xl">
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
        <article
          className="
            prose prose-lg prose-slate max-w-none
            prose-headings:font-display prose-headings:tracking-tight prose-headings:text-navy-deep
            prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-3xl prose-h2:font-extrabold prose-h2:uppercase prose-h2:leading-tight
            prose-h2:relative prose-h2:pl-4 prose-h2:border-l-4 prose-h2:border-coral
            prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-xl prose-h3:font-bold
            prose-p:my-5 prose-p:leading-[1.85] prose-p:text-foreground/85 prose-p:text-[1.0625rem]
            prose-a:text-coral prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-navy-deep prose-strong:font-semibold
            prose-ul:my-6 prose-ul:space-y-2 prose-ol:my-6 prose-ol:space-y-2
            prose-li:leading-relaxed prose-li:text-foreground/85 prose-li:marker:text-coral
            prose-blockquote:border-l-4 prose-blockquote:border-coral prose-blockquote:bg-accent/40
            prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:not-italic
            prose-blockquote:font-medium prose-blockquote:text-foreground
            first-letter:font-display first-letter:text-5xl first-letter:font-extrabold
            first-letter:text-coral first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:mt-1
          "
        >
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
