import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { CategoryIcon, accentClasses } from "@/components/CategoryIcon";
import { findTopic } from "@/data/categories";
import { getTopicSeo } from "@/data/topic-seo";
import { listMockSlots, TOTAL_MOCKS_PER_TOPIC, QUESTIONS_PER_MOCK } from "@/data/mocks";
import { Home, ChevronRight, ArrowRight, BookOpen } from "lucide-react";
import { pageMeta, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { ROAD_SIGN_PAGES } from "@/data/road-sign-gallery";

export const Route = createFileRoute("/guide/$slug")({
  loader: ({ params }) => {
    const found = findTopic(params.slug);
    if (!found) throw notFound();
    return { category: found.category, topic: found.topic };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Test Guide — UK Test Hub" }] };
    const { category, topic } = loaderData;
    const slug = params?.slug ?? topic.slug;
    const seo = getTopicSeo(slug);
    const title =
      seo?.title ?? `${topic.title} Guide — Tips, Format & How to Pass — UK Test Hub`;
    const description =
      seo?.description ??
      `Free study guide for the ${topic.title}. Format, syllabus, study tips, common mistakes and FAQs, plus unlimited mock tests.`;
    const base = pageMeta({
      title,
      description,
      path: `/guide/${slug}`,
      image: category.heroImage,
    });
    const scripts = [
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: category.title, url: `/category/${category.slug}` },
        { name: `${topic.title} Guide`, url: `/guide/${slug}` },
      ]),
    ];
    if (seo?.faqs?.length) scripts.push(faqSchema(seo.faqs));
    return { ...base, scripts };
  },
  component: GuidePage,
});

function GuidePage() {
  const { category, topic } = Route.useLoaderData();
  const seo = getTopicSeo(topic.slug);
  const slots = listMockSlots(topic.slug);
  const available = slots.filter((s) => s.available).length;

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-deep text-navy-foreground">
        <img
          src={category.heroImage}
          alt={`${topic.title} guide`}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-navy-deep/85 via-navy-deep/65 to-navy-deep/30"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-foreground/80">
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
            <span className="text-navy-foreground">{topic.title} Guide</span>
          </nav>

          <div className="mt-6 flex items-center gap-4">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-elevated ${accentClasses[category.accent]}`}
            >
              <BookOpen className="h-7 w-7" />
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              Test Guide
            </span>
          </div>
          <h1 className="mt-5 font-sans font-black uppercase leading-[0.95] tracking-tight text-5xl md:text-6xl lg:text-7xl">
            {topic.title} Guide
          </h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-coral" />
          <p className="mt-4 max-w-2xl text-base text-navy-foreground/85 md:text-lg">
            {seo?.tagline ??
              `Everything you need to know about the ${topic.title} before you book.`}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <AdSlot size="leaderboard" className="mb-10" />

        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          {/* ARTICLE */}
          <article className="max-w-none">
            <span className="inline-flex items-center rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-coral">
              About this exam
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              About the {topic.title}
            </h2>
            <div className="mt-3 h-1 w-16 rounded-full bg-coral" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ~7 min read · Updated April 2026
            </p>

            {/* Lead intro */}
            <div className="mt-6 space-y-5">
              {(seo?.intro ?? [
                `The ${topic.title} is one of the tests we cover at UK Test Hub. Use the free mock papers below to build confidence with the real exam format.`,
              ]).map((p, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-muted-foreground md:text-xl"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* THE SIGNING SYSTEM (only on road-signs guide) */}
            {topic.slug === "road-signs" ? (
              <section className="mt-12 rounded-3xl border border-border bg-white p-6 md:p-10">
                <h2 className="font-sans text-4xl font-black tracking-tight md:text-5xl" style={{ color: "#1f78d1" }}>
                  The signing system
                </h2>
                <div className="mt-3 h-1 w-16 rounded-full bg-coral" />
                <p className="mt-4 max-w-3xl font-sans text-base font-bold leading-snug md:text-lg" style={{ color: "#0c2340" }}>
                  There are three basic types of traffic sign: signs that give
                  orders, signs that warn, and signs that give information. Each
                  type has a different shape. A further guide to the function of a
                  sign is its colour. All triangular signs are red.
                </p>

                {/* Shape primer */}
                <div className="mt-8 grid gap-6 sm:grid-cols-3">
                  {/* Circle */}
                  <div className="flex flex-col items-center text-center">
                    <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#0c2340" strokeWidth="7" />
                    </svg>
                    <p className="mt-3 font-display text-lg font-bold text-navy-deep">Circles</p>
                    <p className="text-sm text-muted-foreground">give orders</p>
                  </div>
                  {/* Triangle */}
                  <div className="flex flex-col items-center text-center">
                    <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden>
                      <polygon
                        points="50,12 92,86 8,86"
                        fill="none"
                        stroke="#0c2340"
                        strokeWidth="7"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-3 font-display text-lg font-bold text-navy-deep">Triangles</p>
                    <p className="text-sm text-muted-foreground">warn</p>
                  </div>
                  {/* Rectangle */}
                  <div className="flex flex-col items-center text-center">
                    <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden>
                      <rect x="10" y="22" width="80" height="56" rx="8" fill="none" stroke="#0c2340" strokeWidth="7" />
                    </svg>
                    <p className="mt-3 font-display text-lg font-bold text-navy-deep">Rectangles</p>
                    <p className="text-sm text-muted-foreground">inform</p>
                  </div>
                </div>

                {/* Colour rules */}
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-4">
                    <svg viewBox="0 0 100 100" className="h-16 w-16 shrink-0" aria-hidden>
                      <circle cx="50" cy="50" r="40" fill="#1f78d1" stroke="#0c2340" strokeWidth="6" />
                    </svg>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <strong className="text-foreground">Blue circles</strong> generally
                      give a mandatory instruction such as "turn left", or indicate a
                      route available only to particular classes of traffic, e.g. buses
                      and cycles only.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <svg viewBox="0 0 100 100" className="h-16 w-16 shrink-0" aria-hidden>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#d62828" strokeWidth="10" />
                    </svg>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <strong className="text-foreground">Red rings or circles</strong>{" "}
                      tell you what you must not do, e.g. must not exceed 30mph, no
                      vehicles over the height shown may proceed.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <svg viewBox="0 0 100 100" className="h-16 w-20 shrink-0" aria-hidden>
                      <rect x="8" y="22" width="84" height="56" rx="8" fill="#1f78d1" stroke="#0c2340" strokeWidth="5" />
                    </svg>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <strong className="text-foreground">Blue rectangles</strong> are
                      used for information signs except on motorways, where blue is
                      used for direction signs.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <svg viewBox="0 0 100 100" className="h-16 w-20 shrink-0" aria-hidden>
                      <rect x="8" y="22" width="84" height="56" rx="8" fill="#0a6b3b" stroke="#0c2340" strokeWidth="5" />
                    </svg>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <strong className="text-foreground">Green rectangles</strong> are
                      used for direction signs on primary routes.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <svg viewBox="0 0 100 100" className="h-16 w-20 shrink-0" aria-hidden>
                      <rect x="8" y="22" width="84" height="56" rx="8" fill="#ffffff" stroke="#0c2340" strokeWidth="5" />
                    </svg>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <strong className="text-foreground">White rectangles</strong> are
                      used for direction signs on non-primary routes, or for plates
                      used in combination with warning and regulatory signs.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex shrink-0 items-center gap-2">
                      {/* STOP octagon */}
                      <svg viewBox="0 0 100 100" className="h-16 w-16" aria-hidden>
                        <polygon
                          points="30,8 70,8 92,30 92,70 70,92 30,92 8,70 8,30"
                          fill="#d62828"
                          stroke="#ffffff"
                          strokeWidth="4"
                        />
                        <text
                          x="50"
                          y="58"
                          textAnchor="middle"
                          fontSize="22"
                          fontWeight="900"
                          fontFamily="system-ui, sans-serif"
                          fill="#ffffff"
                        >
                          STOP
                        </text>
                      </svg>
                      {/* GIVE WAY inverted triangle */}
                      <svg viewBox="0 0 100 100" className="h-16 w-16" aria-hidden>
                        <polygon
                          points="8,14 92,14 50,92"
                          fill="#ffffff"
                          stroke="#d62828"
                          strokeWidth="8"
                          strokeLinejoin="round"
                        />
                        <text
                          x="50"
                          y="38"
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="900"
                          fontFamily="system-ui, sans-serif"
                          fill="#0c2340"
                        >
                          GIVE
                        </text>
                        <text
                          x="50"
                          y="54"
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="900"
                          fontFamily="system-ui, sans-serif"
                          fill="#0c2340"
                        >
                          WAY
                        </text>
                      </svg>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      There are a few exceptions to the shape and colour rules, to
                      give certain signs greater prominence. Examples are the{" "}
                      <strong className="text-foreground">"STOP"</strong> and{" "}
                      <strong className="text-foreground">"GIVE WAY"</strong> signs.
                    </p>
                  </div>
                </div>

                <p className="mt-8 text-sm italic text-muted-foreground">
                  The words "must" or "must not", when used in the descriptions that
                  follow, refer to legal requirements that have to be obeyed.
                </p>
              </section>
            ) : null}

            {/* OFFICIAL ROAD SIGNS REFERENCE */}
            {topic.slug === "road-signs" ? (
              <section className="mt-12">
                <span className="inline-flex items-center rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-coral">
                  Official reference
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                  Every UK road sign — Highway Code reference
                </h2>
                <div className="mt-3 h-1 w-16 rounded-full bg-coral" />
                <p className="mt-3 max-w-3xl text-base text-muted-foreground md:text-lg">
                  These are the official traffic sign plates from the
                  Department for Transport's <em>Highway Code: Traffic signs</em>
                  {" "}publication — the same artwork the DVSA uses in your theory
                  test. Study them in groups, not as isolated images.
                </p>

                {ROAD_SIGN_PAGES.map((p) => (
                  <div key={p.src} className="mt-12 border-t border-border pt-8">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                      {p.intro}
                    </p>
                    <figure className="mt-6 overflow-hidden rounded-2xl border border-border bg-white p-3 md:p-6">
                      <img
                        src={p.src}
                        alt={p.alt}
                        loading="lazy"
                        width={1103}
                        height={2067}
                        className="mx-auto block h-auto w-full max-w-4xl"
                      />
                    </figure>
                  </div>
                ))}

                <p className="mt-8 text-xs text-muted-foreground">
                  Source: Department for Transport, <em>The Highway Code — Traffic signs</em>{" "}
                  (
                  <a
                    href="https://assets.publishing.service.gov.uk/media/68f8d5c5ec6267c615ed8f99/the-highway-code-traffic-signs.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-coral"
                  >
                    download the official PDF
                  </a>
                  ). Reproduced for educational purposes under Open Government Licence v3.0.
                </p>
              </section>
            ) : null}

            {/* Numbered sections */}
            {seo?.sections?.length ? (
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
            ) : null}

            {/* Road signs gallery moved above — see directly after the intro */}

            {/* CTA */}
            <div className="mt-12 rounded-2xl border border-border bg-card p-6 md:p-8">
              <p className="font-display text-base font-semibold text-foreground md:text-lg">
                Ready to start?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                You've read the guide — now put it into practice.{" "}
                {available} of {TOTAL_MOCKS_PER_TOPIC} mock papers ready, each with{" "}
                {QUESTIONS_PER_MOCK} questions and full explanations.
              </p>
              <Link
                to="/topic/$slug"
                params={{ slug: topic.slug }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-coral px-5 py-3 text-sm font-semibold text-white shadow-elevated transition-all hover:gap-3"
              >
                Start {topic.title}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="space-y-6 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-base font-semibold">
                Take the test
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                {TOTAL_MOCKS_PER_TOPIC} mock papers · {QUESTIONS_PER_MOCK} questions each
              </p>
              <Link
                to="/topic/$slug"
                params={{ slug: topic.slug }}
                className="mt-4 inline-flex w-full items-center justify-between gap-2 rounded-xl border border-coral/30 bg-coral/5 px-4 py-3 text-sm font-semibold text-coral hover:bg-coral/10"
              >
                Start {topic.title}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-base font-semibold">
                Other {category.title.toLowerCase()} tests
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {category.topics
                  .filter((t) => t.slug !== topic.slug)
                  .map((t) => (
                    <li key={t.slug}>
                      <Link
                        to="/guide/$slug"
                        params={{ slug: t.slug }}
                        className="text-muted-foreground hover:text-coral"
                      >
                        <CategoryIcon
                          name={category.icon}
                          className="mr-2 inline h-3.5 w-3.5 align-text-bottom"
                        />
                        {t.title} guide
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <AdSlot size="rectangle" />
          </aside>
        </div>

        <AdSlot size="in-feed" className="my-12" />

        {/* FAQ */}
        {seo?.faqs?.length ? (
          <section className="mt-4">
            <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
              Frequently asked questions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quick answers about the {topic.title} in 2026.
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
