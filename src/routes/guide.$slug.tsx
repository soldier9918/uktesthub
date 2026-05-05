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


            {/* Full visual reference moved to a dedicated long-form blog article */}
            {topic.slug === "road-signs" ? (
              <div className="mt-10 rounded-2xl border border-coral/30 bg-coral/5 p-6 md:p-8">
                <span className="inline-flex items-center rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-coral">
                  Full visual reference
                </span>
                <h2 className="mt-3 font-display text-xl font-extrabold tracking-tight text-foreground md:text-2xl">
                  The Complete UK Road Signs Reference
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                  Every shape, colour, official Highway Code plate, motorway rule and road marking — all in one long-form article.
                </p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: "complete-uk-road-signs-reference" }}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-coral px-5 py-3 text-sm font-semibold text-white shadow-elevated transition-all hover:gap-3"
                >
                  Read the full road signs reference
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
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
                  .filter((t: { slug: string; title: string }) => t.slug !== topic.slug)
                  .map((t: { slug: string; title: string }) => (
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
