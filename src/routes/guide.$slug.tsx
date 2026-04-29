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
import { ROAD_MARKING_PAGES } from "@/data/road-markings-gallery";

// Render simple inline markdown-style links: [text](/url)
function renderInlineLinks(text: string) {
  const parts: (string | { label: string; href: string })[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    parts.push({ label: m[1], href: m[2] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.map((p, i) =>
    typeof p === "string" ? (
      <span key={i}>{p}</span>
    ) : (
      <Link key={i} to={p.href} className="font-semibold text-coral underline underline-offset-4 hover:text-coral/80">
        {p.label}
      </Link>
    ),
  );
}

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
                  {renderInlineLinks(p)}
                </p>
              ))}
            </div>


            {/* THE SIGNING SYSTEM (only on road-signs guide) */}
            {topic.slug === "road-signs" ? (
              <section className="mt-12 rounded-3xl border border-border bg-white p-6 md:p-10">
                <h2 className="font-sans text-4xl font-black tracking-tight md:text-5xl" style={{ color: "#1f78d1", fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif' }}>
                  The signing system
                </h2>
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

            {/* SIGN SHAPES EXPLAINED */}
            {topic.slug === "road-signs" ? (
              <section className="mt-12 space-y-10">
                {/* Circular */}
                <div>
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                    Circular road signs
                  </h3>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                    <p>
                      Circular road signs give orders that you must follow by
                      law, which is why they're often called{" "}
                      <strong className="text-foreground">regulatory signs</strong>.
                    </p>
                    <p>
                      Circles with a red border tell you what you{" "}
                      <strong className="text-foreground">must not</strong> do,
                      while blue circles usually give a positive instruction —
                      something you{" "}
                      <strong className="text-foreground">must</strong> do.
                    </p>
                    <p>
                      Every circular sign is mandatory and has to be obeyed.
                      Some carry a diagonal red line through the symbol to make
                      the prohibition clearer.
                    </p>
                    <p>
                      Common red circles include <em>no U-turns</em> and{" "}
                      <em>no entry</em>. Common blue circles include{" "}
                      <em>turn left ahead</em> and <em>proceed right only</em>.
                    </p>
                  </div>
                </div>

                {/* Triangular */}
                <div className="border-t border-border pt-10">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                    Triangular road signs
                  </h3>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                    <p>
                      Triangular signs are warning signs. They alert you to
                      something ahead — a change in the road layout, a
                      junction, or a hazard you need to prepare for.
                    </p>
                    <p>
                      They always have a red border to flag the risk and tell
                      you to slow down and look.
                    </p>
                  </div>
                </div>

                {/* Rectangular */}
                <div className="border-t border-border pt-10">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                    Rectangular road signs
                  </h3>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                    <p>
                      Rectangular signs inform you, and most direction signs
                      use this shape. The colour tells you what kind of road
                      you're on.
                    </p>
                    <p>
                      <strong className="text-foreground">Blue rectangles</strong>{" "}
                      give information on motorways and can also describe the
                      nature of other roads.
                    </p>
                    <p>
                      <strong className="text-foreground">Green rectangles</strong>{" "}
                      direct you along primary routes, such as A-roads.
                    </p>
                    <p>
                      <strong className="text-foreground">White rectangles</strong>{" "}
                      direct you on minor roads or point you toward parking.
                      Smaller white plates often sit beneath a triangular or
                      circular sign — for example, to apply a specific speed
                      limit. White rectangles are also used as the base for
                      larger information signs that mix text with smaller
                      triangular or circular symbols.
                    </p>
                    <p>
                      Rectangular signs also mark bus lanes and congestion
                      charge zones.
                    </p>
                    <p>
                      <strong className="text-foreground">Brown rectangles</strong>{" "}
                      direct drivers to tourist attractions and facilities.
                    </p>
                    <p>
                      <strong className="text-foreground">Yellow rectangles</strong>{" "}
                      generally relate to traffic routing through roadworks.
                    </p>
                  </div>
                </div>
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

                    {/* Highway Code motorway rules — appears right after "Motorway and direction signs" */}
                    {topic.slug === "road-signs" && s.heading === "Motorway and direction signs" ? (
                      <div className="mt-8 space-y-8">
                        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                          The Highway Code gives a full set of rules for motorway driving (rules 253–274). Many of these rules also apply to other high-speed roads. The summary below pulls together the key sections you'll be tested on.
                        </p>

                        {[
                          {
                            heading: "1. General (Rules 253–254)",
                            paras: [
                              "Prohibited vehicles. Motorways MUST NOT be used by pedestrians, holders of provisional motorcycle or car licences, riders of motorcycles under 50 cc, cyclists, horse riders, certain slow-moving vehicles and those carrying oversized loads (except by special permission), agricultural vehicles, and powered wheelchairs or mobility scooters.",
                              "Provisional car licence holders MUST NOT drive on the motorway unless they are accompanied by a DVSA Approved Driving Instructor and are driving a car displaying red L plates (or D plates in Wales) fitted with dual controls.",
                              "Traffic on motorways usually travels faster than on other roads, so you have less time to react. Use your mirrors earlier and look much further ahead than you would on other roads.",
                            ],
                          },
                          {
                            heading: "2. Motorway signals (Rules 255–258)",
                            blocks: [
                              {
                                text: "Signs and signals warn you of hazards ahead — incidents, fog, spillages or road workers on the carriageway you may not yet see. A single sign or signal can display advice, restrictions and warnings for all lanes, while lane-specific signs apply to individual lanes.",
                                images: [
                                  { src: "/motorway-rules/01-amber-obstruction.png", alt: "Overhead motorway gantry sign showing amber arrows directing traffic to the right with a red 50 mph limit and the word 'Obstruction'" },
                                  { src: "/motorway-rules/02-amber-60-roadworks.png", alt: "Motorway gantry showing four amber 60 mph roundels above lanes with a blue overhead direction sign for The North, Birmingham and Solihull on the M42" },
                                ],
                              },
                              {
                                text: "Amber flashing lights warn of a hazard ahead. Reduce your speed, be prepared for the hazard, and only increase speed when you pass a signal that is no longer flashing, or a sign showing the national speed limit or the word 'END', and you are sure it is safe to do so.",
                                images: [
                                  { src: "/motorway-rules/03-queue-caution.png", alt: "Amber matrix sign over the motorway showing the message 'QUEUE CAUTION'" },
                                ],
                              },
                              {
                                text: "Red flashing light signals and a red 'X' on a sign identify a closed lane in which people, stopped vehicles or other hazards are present. You MUST follow the signs in advance to move safely to an open lane and MUST NOT drive in a closed lane until a sign shows a speed limit or 'END'. Where the left lane is closed at an exit slip road, the exit cannot be used.",
                                images: [
                                  { src: "/motorway-rules/04-stranded-vehicle.png", alt: "Motorway gantry sign showing a red X over the left lane, amber arrows over the other lanes, a red 40 mph limit and the words 'Stranded vehicle'" },
                                  { src: "/motorway-rules/05-lane-closed-incident.png", alt: "Overhead motorway gantry showing the message 'LANE CLOSED FOR INCIDENT ACCESS' with a red X above the left lane and red 40 mph limits above the other lanes" },
                                ],
                              },
                              {
                                text: "Where red flashing light signals close all lanes shown on a sign, the road is closed. You MUST NOT go beyond the sign in any lane, or use the hard shoulder to pass the closure, unless directed by a police or traffic officer. These closures are enforced by the police.",
                                images: [
                                  { src: "/motorway-rules/06-road-closed-stop.png", alt: "Motorway road-closure signs: red Xs with 'STOP Road closed', and a black sign with white lane symbols and red flashing lights" },
                                ],
                              },
                            ],
                          },
                          {
                            heading: "3. Joining the motorway (Rule 259)",
                            paras: [
                              "You normally join from a slip road on the left or from an adjoining motorway. Give priority to traffic already on the motorway, check the traffic and match your speed to fit safely into the left-hand lane.",
                              "Do not cross solid white lines that separate lanes, and do not use the hard shoulder. If the slip road continues as an extra lane, stay in it. Remain in the left-hand lane long enough to adjust to the speed of traffic before considering overtaking.",
                            ],
                            images: [],
                          },
                          {
                            heading: "4. On the motorway (Rules 260–263)",
                            paras: [
                              "When you can see well ahead and conditions are good, drive at a steady cruising speed within the speed limit that you and your vehicle can handle safely. Keep a safe distance from the vehicle in front and increase the gap on wet, icy or foggy roads.",
                              "You MUST NOT exceed a speed limit displayed within a red circle, or the maximum limit for the road and your vehicle. Speed limits are enforced by the police.",
                              "The monotony of motorway driving can make you sleepy. Make sure you are fit to drive and take regular breaks — service areas are provided along motorways for this purpose, and refreshment and rest facilities may also be reached from motorway exits.",
                              "Unless directed by a police or traffic officer, you MUST NOT reverse along any part of a motorway (including slip roads, hard shoulders and emergency areas), cross the central reservation, or drive against the traffic flow. If you have missed your exit, carry on to the next one.",
                              "Keep in the left lane unless overtaking, and return to the left when it is safe. Be aware of emergency services, traffic officers, recovery workers and others stopped on the hard shoulder or in an emergency area — if it is safe, move into the adjacent lane to give them more room.",
                            ],
                            images: [],
                          },
                          {
                            heading: "5. Lane discipline (Rules 265–266)",
                            paras: [
                              "On a motorway with three or more lanes, the right-hand lane MUST NOT be used (except in prescribed circumstances) if you are driving any vehicle drawing a trailer; a goods vehicle over 3.5 tonnes; a goods vehicle over 7.5 tonnes; or a passenger vehicle constructed or adapted to carry more than eight seated passengers in addition to the driver where a speed limiter is fitted.",
                              "Approaching a junction, look well ahead for signals or signs — direction signs may be placed over the road. If you need to change lanes, do so in good time. At some junctions a lane may lead directly off the motorway; only get in that lane if you wish to go in the direction shown overhead.",
                            ],
                            images: [],
                          },
                          {
                            heading: "6. Overtaking and the hard shoulder (Rules 267–269)",
                            paras: [
                              "Overtake only on the right, and only when it is safe and legal. Check your mirrors, judge speeds carefully, make sure the lane you'll join is clear ahead and behind, and take a quick sideways glance into the blind spot. Watch for fast traffic coming up behind, especially motorcyclists. Signal in good time, move out, and don't cut in on the vehicle you've overtaken.",
                              "Do not overtake on the left, or move to a lane on your left to overtake. In congested conditions where adjacent lanes are moving at similar speeds, you may keep up with traffic in your lane even if it means passing traffic in the lane to your right — but do not weave in and out of lanes.",
                              "Hard shoulder. Where present, you MUST NOT use the hard shoulder except in an emergency or if directed to do so by the police, traffic officers or a traffic sign. On some motorways the hard shoulder is opened as an extra lane during congestion: a red 'X' or blank sign above means you MUST NOT use it, while a speed limit shown above means it is open as a running lane.",
                            ],
                            images: [
                              { src: "/motorway-rules/07-hard-shoulder-must-not-use.png", alt: "Diagram of a motorway with the hard shoulder marked with a red X and the words 'MUST NOT use'" },
                              { src: "/motorway-rules/08-hard-shoulder-blank-signs.png", alt: "Diagram of a motorway gantry with blank black signs above each lane, indicating the hard shoulder must not be used" },
                              { src: "/motorway-rules/09-hard-shoulder-red-x-50.png", alt: "Diagram showing a red X above the hard shoulder and 50 mph limits above the running lanes — hard shoulder must not be used" },
                              { src: "/motorway-rules/10-hard-shoulder-running-lane-60.png", alt: "Diagram showing 60 mph limits above all four lanes including the hard shoulder, with a green tick marked 'CAN use' — hard shoulder open as a running lane" },
                            ],
                          },
                          {
                            heading: "7. Stopping (Rules 270–272)",
                            paras: [
                              "Emergency areas are located along motorways with no hard shoulder, or where the hard shoulder is used as an extra lane, and MUST only be used in an emergency. They are marked by blue signs with an orange SOS telephone symbol and may have orange surfacing.",
                              "You MUST NOT stop on any carriageway, emergency area, hard shoulder, slip road, central reservation or verge except in an emergency, when told to do so by the police or traffic officers, or when directed by an emergency sign or red flashing light signals. Do not stop on any part of a motorway to make or receive mobile phone calls, except in an emergency.",
                              "You MUST NOT pick up or set down anyone, or walk on a motorway, except in an emergency.",
                            ],
                            images: [
                              { src: "/motorway-rules/11-emergency-area.png", alt: "Photograph of a motorway emergency area marked with orange surfacing on the left, with a car parked safely off the running lanes" },
                              { src: "/motorway-rules/12-sos-300yds.png", alt: "Blue motorway sign with an orange SOS telephone symbol and the text '300 yds' indicating the distance to the next emergency area" },
                            ],
                          },
                          {
                            heading: "8. Leaving the motorway (Rules 273–274)",
                            paras: [
                              "Unless signs show that a lane leads directly off the motorway, you will normally leave by a slip road on your left. Watch for the signs that tell you you're getting near your exit, move into the left-hand lane well before you reach it, signal left in good time and reduce your speed on the slip road as needed.",
                              "On leaving the motorway or using a link road between motorways, your speed may be higher than you realise — 50 mph can feel like 30 mph. Check your speedometer and adjust accordingly. Some slip roads and link roads have sharp bends, so slow down.",
                            ],
                            images: [],
                          },
                        ].map((sub) => {
                          const blocks =
                            "blocks" in sub && sub.blocks
                              ? sub.blocks
                              : (sub.paras ?? []).map((t, idx) => ({
                                  text: t,
                                  images:
                                    idx === 0 && "images" in sub && sub.images
                                      ? sub.images
                                      : [],
                                }));
                          return (
                            <div key={sub.heading}>
                              <h4 className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
                                {sub.heading}
                              </h4>
                              <div className="mt-3 space-y-6">
                                {blocks.map((b, k) => (
                                  <div key={k} className="space-y-4">
                                    <p className="text-base leading-[1.75] text-foreground/85 md:text-[17px]">
                                      {b.text}
                                    </p>
                                    {b.images && b.images.length > 0 ? (
                                      <div
                                        className={
                                          b.images.length > 1
                                            ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                                            : "grid grid-cols-1 gap-4"
                                        }
                                      >
                                        {b.images.map((img) => (
                                          <figure
                                            key={img.src}
                                            className="overflow-hidden rounded-xl border border-border bg-white p-2"
                                          >
                                            <img
                                              src={img.src}
                                              alt={img.alt}
                                              loading="lazy"
                                              className="mx-auto block h-auto w-full"
                                            />
                                          </figure>
                                        ))}
                                      </div>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}

                    {/* Road markings official reference — appears right after "Road markings as signs" */}
                    {topic.slug === "road-signs" && s.heading === "Road markings as signs" ? (
                      <div className="mt-10 space-y-10">
                        {ROAD_MARKING_PAGES.map((p) => (
                          <div key={p.src}>
                            <h4 className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
                              {p.title}
                            </h4>
                            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                              {p.intro}
                            </p>
                            <figure className="mt-4 overflow-hidden rounded-2xl border border-border bg-white p-3 md:p-6">
                              <img
                                src={p.src}
                                alt={p.alt}
                                loading="lazy"
                                width={882}
                                height={1654}
                                className="mx-auto block h-auto w-full max-w-3xl"
                              />
                            </figure>
                          </div>
                        ))}
                      </div>
                    ) : null}
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
