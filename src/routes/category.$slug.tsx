import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { CategoryIcon, accentClasses } from "@/components/CategoryIcon";
import { getCategory, categories } from "@/data/categories";
import { categorySeo } from "@/data/category-seo";
import { TOTAL_MOCKS_PER_TOPIC, QUESTIONS_PER_MOCK, listMockSlots } from "@/data/mocks";
import { Home, ChevronRight, ArrowRight } from "lucide-react";
import { pageMeta, faqSchema, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData, params }) => {
    const c = loaderData?.category;
    const slug = params?.slug ?? "";
    if (!c) return { meta: [{ title: "Category — UK Test Hub" }] };
    const seo = categorySeo[c.slug];
    const title = seo?.title ?? `${c.title} Practice Tests — UK Test Hub`;
    const description = seo?.description ?? c.description;
    const base = pageMeta({
      title,
      description,
      path: `/category/${slug}`,
      image: c.heroImage,
    });
    const scripts = [
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: c.title, url: `/category/${slug}` },
      ]),
    ];
    if (seo?.faqs?.length) scripts.push(faqSchema(seo.faqs));
    return { ...base, scripts };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const seo = categorySeo[category.slug];

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-deep text-navy-foreground">
        <img
          src={category.heroImage}
          alt={category.title}
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
            <span className="text-navy-foreground">{category.title}</span>
          </nav>

          <div className="mt-6 flex items-center gap-4">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-elevated ${accentClasses[category.accent]}`}
            >
              <CategoryIcon name={category.icon} className="h-7 w-7" />
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              Practice Hub
            </span>
          </div>
          <h1 className="mt-5 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight md:text-6xl">
            {category.title}
          </h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-coral" />
          <p className="mt-4 max-w-2xl text-base text-navy-foreground/85 md:text-lg">
            {category.description}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <AdSlot size="leaderboard" className="mb-10" />

        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="border-b border-border pb-3">
              <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                Choose a test
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Each test below has {TOTAL_MOCKS_PER_TOPIC} mock papers, with{" "}
                {QUESTIONS_PER_MOCK} questions and full explanations.
              </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {category.topics.map((t) => {
                const slots = listMockSlots(t.slug);
                const available = slots.filter((s) => s.available).length;
                return (
                  <Link
                    key={t.slug}
                    to="/topic/$slug"
                    params={{ slug: t.slug }}
                    aria-label={`Open ${t.title} — ${TOTAL_MOCKS_PER_TOPIC} free mock tests`}
                    className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-elevated"
                  >
                    <div>
                      <div className="flex items-start gap-4">
                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accentClasses[category.accent]}`}
                        >
                          <CategoryIcon name={category.icon} className="h-6 w-6" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-display text-lg font-bold leading-tight text-foreground">
                            {t.title}
                          </h3>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {TOTAL_MOCKS_PER_TOPIC} mock tests · {QUESTIONS_PER_MOCK} questions each
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                        {available} of {TOTAL_MOCKS_PER_TOPIC} ready
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-coral group-hover:gap-2 transition-all">
                        Start {t.title}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="space-y-6">
            <AdSlot size="rectangle" />
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-base font-semibold">
                Other categories
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {categories
                  .filter((c) => c.slug !== category.slug)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link
                        to="/category/$slug"
                        params={{ slug: c.slug }}
                        className="text-muted-foreground hover:text-coral"
                      >
                        {c.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* SEO long-form content */}
        {seo && (
          <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_280px]">
            <article className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-semibold prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-6 prose-h3:text-lg prose-a:text-coral prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground">
              <h2>About the {category.title} tests</h2>
              {seo.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              {seo.sections.map((s, i) => (
                <div key={i}>
                  <h3>{s.heading}</h3>
                  {s.body.map((b, j) => (
                    <p key={j}>{b}</p>
                  ))}
                </div>
              ))}

              <p>
                Ready to start?{" "}
                {category.topics.slice(0, 3).map((t, i) => (
                  <span key={t.slug}>
                    <Link
                      to="/topic/$slug"
                      params={{ slug: t.slug }}
                      className="font-semibold text-coral hover:underline"
                    >
                      Take the {t.title}
                    </Link>
                    {i < Math.min(2, category.topics.length - 1) ? ", " : "."}
                  </span>
                ))}
              </p>
            </article>
            <aside className="hidden lg:block">
              <AdSlot size="skyscraper" />
            </aside>
          </section>
        )}

        <AdSlot size="in-feed" className="my-12" />

        {/* FAQ */}
        {seo?.faqs?.length ? (
          <section className="mt-4">
            <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
              Frequently asked questions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quick answers about the {category.title} exam in 2026.
            </p>
            <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
              {seo.faqs.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-display text-base font-semibold text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                    <span>{f.q}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-coral transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
