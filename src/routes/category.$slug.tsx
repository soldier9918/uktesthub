import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { BookmarkButton } from "@/components/BookmarkButton";
import { CategoryIcon, accentClasses } from "@/components/CategoryIcon";
import { getCategory, categories } from "@/data/categories";
import { categorySeo } from "@/data/category-seo";
import { TOTAL_MOCKS_PER_TOPIC, QUESTIONS_PER_MOCK, listMockSlots } from "@/data/mocks";
import { Home, ChevronRight, ArrowRight, BookOpen } from "lucide-react";
import { pageMeta, faqSchema, breadcrumbSchema } from "@/lib/seo";

// Topic-specific background images (falls back to category hero when no entry).
import imgLifeUk from "@/assets/blog/50-life-in-the-uk-questions-you-must-know.jpg";
import imgBritCit from "@/assets/blog/british-citizenship-test-questions-2026.jpg";
import imgUkCit from "@/assets/blog/uk-citizenship-test-guide-pass-first-time.jpg";
import imgUkGen from "@/assets/blog/uk-general-knowledge-quiz-guide.jpg";
import imgDriving from "@/assets/blog/driving-theory-test-uk-complete-guide.jpg";
import imgRoadSigns from "@/assets/blog/complete-uk-road-signs-reference.jpg";
import imgHazard from "@/assets/blog/uk-hazard-perception-test-tips.jpg";

const topicImage: Record<string, string> = {
  "life-in-the-uk": imgLifeUk,
  "british-citizenship": imgBritCit,
  "uk-laws-rights": imgUkCit,
  "uk-geography": imgUkGen,
  "driving-theory": imgDriving,
  "road-signs": imgRoadSigns,
  "hazard-perception": imgHazard,
  "motorcycle-theory": imgDriving,
};

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
          <h1 className="mt-5 font-sans font-black uppercase leading-[0.95] tracking-tight text-6xl md:text-7xl lg:text-8xl">
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
                Choose a guide or jump into a test
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Read the guide on the left for tips and exam info, or start
                practising on the right. Each test has{" "}
                {TOTAL_MOCKS_PER_TOPIC} mock papers, with {QUESTIONS_PER_MOCK}{" "}
                questions and full explanations.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {category.topics.flatMap((t: { slug: string; title: string }) => {
                const slots = listMockSlots(t.slug);
                const available = slots.filter((s) => s.available).length;
                const bgImage = topicImage[t.slug] ?? category.heroImage;
                return [
                  // GUIDE CARD (left column)
                  <Link
                    key={`${t.slug}-guide`}
                    to="/guide/$slug"
                    params={{ slug: t.slug }}
                    aria-label={`Read the ${t.title} guide`}
                    className="group relative flex h-[260px] flex-col overflow-hidden rounded-2xl shadow-soft ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
                  >
                    <img
                      src={bgImage}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/75 to-white/40" />
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1a1d24]/95 via-[#1a1d24]/70 to-transparent" />

                    <div className="relative z-10 flex h-full flex-col justify-between p-6">
                      <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-coral shadow-md ring-1 ring-black/5">
                          <BookOpen className="h-6 w-6" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-coral">
                            Test Guide
                          </p>
                          <h3 className="mt-1 font-display text-xl font-extrabold leading-tight text-foreground drop-shadow-sm">
                            {t.title} Guide
                          </h3>
                          <p className="mt-1 text-xs font-medium text-foreground/70">
                            Format, tips and how to pass first time
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-white">
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">
                          ~7 min read
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-coral group-hover:gap-2.5 transition-all">
                          Read guide
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>,

                  // PRACTICE TEST CARD (right column)
                  <div key={`${t.slug}-test`} className="relative">
                    <div className="absolute right-3 top-3 z-20">
                      <BookmarkButton topicSlug={t.slug} className="bg-white/90 shadow-md backdrop-blur ring-1 ring-black/5" />
                    </div>
                    <Link
                      to="/topic/$slug"
                      params={{ slug: t.slug }}
                      aria-label={`Open ${t.title} — ${TOTAL_MOCKS_PER_TOPIC} free mock tests`}
                      className="group relative flex h-[260px] flex-col overflow-hidden rounded-2xl shadow-soft ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
                    >
                      <img
                        src={bgImage}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/75 to-white/40" />
                      <div aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1a1d24]/95 via-[#1a1d24]/70 to-transparent" />

                      <div className="relative z-10 flex h-full flex-col justify-between p-6">
                        <div className="flex items-start gap-4">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-coral shadow-md ring-1 ring-black/5">
                            <CategoryIcon name={category.icon} className="h-7 w-7" />
                          </span>
                          <div className="min-w-0 pr-10">
                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-coral">
                              Practice Test
                            </p>
                            <h3 className="mt-1 font-display text-xl font-extrabold leading-tight text-foreground drop-shadow-sm">
                              {t.title}
                            </h3>
                            <p className="mt-1 text-xs font-medium text-foreground/70">
                              {TOTAL_MOCKS_PER_TOPIC} mock tests · {QUESTIONS_PER_MOCK} questions each
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] font-bold uppercase tracking-[0.14em] tabular-nums text-white/85">
                            {available} of {TOTAL_MOCKS_PER_TOPIC} ready
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-coral px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all group-hover:gap-2.5 group-hover:bg-coral/90">
                            Start
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>,
                ];
              })}
            </div>
          </div>

          <aside className="space-y-6 lg:self-start">
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
            <AdSlot size="rectangle" />
          </aside>
        </div>

        {/* SEO long-form content */}
        {seo && (
          <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_280px]">
            <article className="max-w-none">
              {/* Eyebrow */}
              <span className="inline-flex items-center rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-coral">
                About this exam
              </span>

              {/* H2 */}
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                About the {category.title} tests
              </h2>
              <div className="mt-3 h-1 w-16 rounded-full bg-coral" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                ~8 min read · Updated April 2026
              </p>

              {/* Lead intro */}
              <div className="mt-6 space-y-5">
                {seo.intro.map((p, i) => (
                  <p
                    key={i}
                    className="text-lg leading-relaxed text-muted-foreground md:text-xl"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* Numbered sections */}
              <div className="mt-12 space-y-12">
                {seo.sections.map((s, i) => (
                  <div key={i} className="border-t border-border pt-8">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-sm font-bold tabular-nums text-coral">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground md:text-[1.75rem]">
                        {s.heading}
                      </h3>
                    </div>
                    <div className="mt-5 space-y-4">
                      {s.body.map((b, j) => (
                        <p
                          key={j}
                          className="text-base leading-[1.75] text-foreground/85 md:text-[17px]"
                        >
                          {b}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-12 rounded-2xl border border-border bg-card p-6 md:p-8">
                <p className="font-display text-base font-semibold text-foreground md:text-lg">
                  Ready to start?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {category.topics.slice(0, 3).map((t: { slug: string; title: string }, i: number) => (
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
              </div>
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
