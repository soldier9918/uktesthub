import { Link } from "@tanstack/react-router";
import { ROAD_SIGN_PAGES } from "@/data/road-sign-gallery";
import { ROAD_MARKING_PAGES } from "@/data/road-markings-gallery";

const MOTORWAY_RULES: {
  heading: string;
  paras?: string[];
  blocks?: { text: string; images?: { src: string; alt: string }[] }[];
  images?: { src: string; alt: string }[];
}[] = [
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
  },
  {
    heading: "5. Lane discipline (Rules 265–266)",
    paras: [
      "On a motorway with three or more lanes, the right-hand lane MUST NOT be used (except in prescribed circumstances) if you are driving any vehicle drawing a trailer; a goods vehicle over 3.5 tonnes; a goods vehicle over 7.5 tonnes; or a passenger vehicle constructed or adapted to carry more than eight seated passengers in addition to the driver where a speed limiter is fitted.",
      "Approaching a junction, look well ahead for signals or signs — direction signs may be placed over the road. If you need to change lanes, do so in good time. At some junctions a lane may lead directly off the motorway; only get in that lane if you wish to go in the direction shown overhead.",
    ],
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
  },
];

export function RoadSignsReferenceBody() {
  return (
    <>
      <p>
        This article covers the full UK road sign system and the 100 signs the
        DVSA tests most often. Every mock test on UK Test Hub draws from this
        same bank — pair this reference with our{" "}
        <Link to="/topic/$slug" params={{ slug: "road-signs" }} className="font-semibold text-coral hover:underline">
          free Road Signs practice tests
        </Link>{" "}
        for the fastest route to a confident pass.
      </p>

      <div className="not-prose my-6 flex flex-col gap-3 rounded-2xl border border-coral/30 bg-coral/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-coral">
            New · Interactive
          </p>
          <p className="mt-1 font-display text-base font-bold text-foreground">
            Try the Show &amp; Tell road signs board
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap any sign — the card flips to reveal what it means.
          </p>
        </div>
        <Link
          to="/blog/$slug"
          params={{ slug: "show-and-tell-road-signs" }}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-coral-foreground shadow-soft transition hover:opacity-90"
        >
          Open the board →
        </Link>
      </div>

      <h2>The signing system</h2>
      <p>
        There are three basic types of traffic sign: signs that give orders,
        signs that warn, and signs that give information. Each type has a
        different shape. A further guide to the function of a sign is its
        colour. All triangular signs are red.
      </p>

      <div className="not-prose mt-8 grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden>
            <circle cx="50" cy="50" r="40" fill="none" stroke="#0c2340" strokeWidth="7" />
          </svg>
          <p className="mt-3 font-display text-lg font-bold text-navy-deep">Circles</p>
          <p className="text-sm text-muted-foreground">give orders</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden>
            <polygon points="50,12 92,86 8,86" fill="none" stroke="#0c2340" strokeWidth="7" strokeLinejoin="round" />
          </svg>
          <p className="mt-3 font-display text-lg font-bold text-navy-deep">Triangles</p>
          <p className="text-sm text-muted-foreground">warn</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden>
            <rect x="10" y="22" width="80" height="56" rx="8" fill="none" stroke="#0c2340" strokeWidth="7" />
          </svg>
          <p className="mt-3 font-display text-lg font-bold text-navy-deep">Rectangles</p>
          <p className="text-sm text-muted-foreground">inform</p>
        </div>
      </div>

      <div className="not-prose mt-10 grid gap-6 md:grid-cols-2">
        <div className="flex items-start gap-4">
          <svg viewBox="0 0 100 100" className="h-16 w-16 shrink-0" aria-hidden>
            <circle cx="50" cy="50" r="40" fill="#1f78d1" stroke="#0c2340" strokeWidth="6" />
          </svg>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Blue circles</strong> generally give a mandatory instruction such as "turn left", or indicate a route available only to particular classes of traffic, e.g. buses and cycles only.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <svg viewBox="0 0 100 100" className="h-16 w-16 shrink-0" aria-hidden>
            <circle cx="50" cy="50" r="40" fill="none" stroke="#d62828" strokeWidth="10" />
          </svg>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Red rings or circles</strong> tell you what you must not do, e.g. must not exceed 30mph, no vehicles over the height shown may proceed.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <svg viewBox="0 0 100 100" className="h-16 w-20 shrink-0" aria-hidden>
            <rect x="8" y="22" width="84" height="56" rx="8" fill="#1f78d1" stroke="#0c2340" strokeWidth="5" />
          </svg>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Blue rectangles</strong> are used for information signs except on motorways, where blue is used for direction signs.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <svg viewBox="0 0 100 100" className="h-16 w-20 shrink-0" aria-hidden>
            <rect x="8" y="22" width="84" height="56" rx="8" fill="#0a6b3b" stroke="#0c2340" strokeWidth="5" />
          </svg>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Green rectangles</strong> are used for direction signs on primary routes.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <svg viewBox="0 0 100 100" className="h-16 w-20 shrink-0" aria-hidden>
            <rect x="8" y="22" width="84" height="56" rx="8" fill="#ffffff" stroke="#0c2340" strokeWidth="5" />
          </svg>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">White rectangles</strong> are used for direction signs on non-primary routes, or for plates used in combination with warning and regulatory signs.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <svg viewBox="0 0 100 100" className="h-16 w-16" aria-hidden>
              <polygon points="30,8 70,8 92,30 92,70 70,92 30,92 8,70 8,30" fill="#d62828" stroke="#ffffff" strokeWidth="4" />
              <text x="50" y="58" textAnchor="middle" fontSize="22" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#ffffff">STOP</text>
            </svg>
            <svg viewBox="0 0 100 100" className="h-16 w-16" aria-hidden>
              <polygon points="8,14 92,14 50,92" fill="#ffffff" stroke="#d62828" strokeWidth="8" strokeLinejoin="round" />
              <text x="50" y="38" textAnchor="middle" fontSize="13" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#0c2340">GIVE</text>
              <text x="50" y="54" textAnchor="middle" fontSize="13" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#0c2340">WAY</text>
            </svg>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            There are a few exceptions to the shape and colour rules, to give certain signs greater prominence. Examples are the <strong className="text-foreground">"STOP"</strong> and <strong className="text-foreground">"GIVE WAY"</strong> signs.
          </p>
        </div>
      </div>

      <p className="text-sm italic text-muted-foreground">
        The words "must" or "must not", when used in the descriptions that follow, refer to legal requirements that have to be obeyed.
      </p>

      {/* SIGN SHAPES EXPLAINED */}
      <h2>Circular road signs</h2>
      <p>
        Circular road signs give orders that you must follow by law, which is why they're often called <strong>regulatory signs</strong>.
      </p>
      <p>
        Circles with a red border tell you what you <strong>must not</strong> do, while blue circles usually give a positive instruction — something you <strong>must</strong> do.
      </p>
      <p>
        Every circular sign is mandatory and has to be obeyed. Some carry a diagonal red line through the symbol to make the prohibition clearer.
      </p>
      <p>
        Common red circles include <em>no U-turns</em> and <em>no entry</em>. Common blue circles include <em>turn left ahead</em> and <em>proceed right only</em>.
      </p>

      <h2>Triangular road signs</h2>
      <p>
        Triangular signs are warning signs. They alert you to something ahead — a change in the road layout, a junction, or a hazard you need to prepare for.
      </p>
      <p>They always have a red border to flag the risk and tell you to slow down and look.</p>

      <h2>Rectangular road signs</h2>
      <p>
        Rectangular signs inform you, and most direction signs use this shape. The colour tells you what kind of road you're on.
      </p>
      <p><strong>Blue rectangles</strong> give information on motorways and can also describe the nature of other roads.</p>
      <p><strong>Green rectangles</strong> direct you along primary routes, such as A-roads.</p>
      <p>
        <strong>White rectangles</strong> direct you on minor roads or point you toward parking. Smaller white plates often sit beneath a triangular or circular sign — for example, to apply a specific speed limit. White rectangles are also used as the base for larger information signs that mix text with smaller triangular or circular symbols.
      </p>
      <p>Rectangular signs also mark bus lanes and congestion charge zones.</p>
      <p><strong>Brown rectangles</strong> direct drivers to tourist attractions and facilities.</p>
      <p><strong>Yellow rectangles</strong> generally relate to traffic routing through roadworks.</p>

      {/* OFFICIAL ROAD SIGNS REFERENCE */}
      <h2>Every UK road sign — Highway Code reference</h2>
      <p>
        These are the official traffic sign plates from the Department for Transport's <em>Highway Code: Traffic signs</em> publication — the same artwork the DVSA uses in your theory test. Study them in groups, not as isolated images.
      </p>

      {ROAD_SIGN_PAGES.map((p) => (
        <div key={p.src} className="not-prose mt-12 border-t border-border pt-8">
          <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">{p.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{p.intro}</p>
          <figure className="mt-6 overflow-hidden rounded-2xl border border-border bg-white p-3 md:p-6">
            <img src={p.src} alt={p.alt} loading="lazy" width={1103} height={2067} className="mx-auto block h-auto w-full max-w-4xl" />
          </figure>
        </div>
      ))}

      <p className="mt-8 text-xs text-muted-foreground">
        Source: Department for Transport, <em>The Highway Code — Traffic signs</em> (
        <a href="https://assets.publishing.service.gov.uk/media/68f8d5c5ec6267c615ed8f99/the-highway-code-traffic-signs.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral">download the official PDF</a>
        ). Reproduced for educational purposes under Open Government Licence v3.0.
      </p>

      {/* Numbered SEO sections */}
      <h2>The shape-and-colour code</h2>
      <p>Triangular signs warn — they tell you something is ahead. Circular signs order — they give you a command you must obey. Rectangular signs inform — speed limits, route information, parking rules.</p>
      <p>Red borders mean prohibition (you must not). Blue circles mean compulsion (you must). Green rectangles mean primary route information. Brown rectangles indicate tourist destinations.</p>

      <h2>The signs that catch people out</h2>
      <p>The 'no entry' sign (red circle with white horizontal bar) versus 'no vehicles' (red circle, blank white centre). The national speed limit sign (white circle with diagonal black line) — many candidates think this means 'end of speed limit'.</p>
      <p>Octagonal STOP signs are the only octagonal signs on UK roads — and the only signs you must legally come to a complete stop at, even if the road is clear.</p>

      <h2>Road markings as signs</h2>
      <p>Markings on the road are also tested. White lines down the centre: short broken = hazard ahead, long broken = warning of hazard, double white = no overtaking unless one line is broken on your side.</p>
      <p>Yellow lines at the kerb: single = restricted parking (times on a sign), double = no parking at any time. Zigzag yellow lines outside a school = no parking or stopping.</p>

      <div className="not-prose mt-10 space-y-10">
        {ROAD_MARKING_PAGES.map((p) => (
          <div key={p.src}>
            <h4 className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">{p.title}</h4>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{p.intro}</p>
            <figure className="mt-4 overflow-hidden rounded-2xl border border-border bg-white p-3 md:p-6">
              <img src={p.src} alt={p.alt} loading="lazy" width={882} height={1654} className="mx-auto block h-auto w-full max-w-3xl" />
            </figure>
          </div>
        ))}
      </div>

      <h2>Motorway and direction signs</h2>
      <p>Blue background = motorway. Green background = primary A-road route. White background = non-primary routes. Brown = tourist. The colour tells you the road class without reading the destination.</p>
      <p>Motorway lane signs and matrix signs: red X means lane closed (do not enter); amber speed limit means temporary mandatory limit; arrow with red ring means leave this lane.</p>

      {/* Highway Code motorway rules */}
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
        The Highway Code gives a full set of rules for motorway driving (rules 253–274). Many of these rules also apply to other high-speed roads. The summary below pulls together the key sections you'll be tested on.
      </p>

      <div className="not-prose mt-8 space-y-8">
        {MOTORWAY_RULES.map((sub) => {
          const blocks =
            sub.blocks ??
            (sub.paras ?? []).map((t, idx) => ({
              text: t,
              images: idx === 0 && sub.images ? sub.images : [],
            }));
          return (
            <div key={sub.heading}>
              <h4 className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">{sub.heading}</h4>
              <div className="mt-3 space-y-6">
                {blocks.map((b, k) => (
                  <div key={k} className="space-y-4">
                    <p className="text-base leading-[1.75] text-foreground/85 md:text-[17px]">{b.text}</p>
                    {b.images && b.images.length > 0 ? (
                      <div className={b.images.length > 1 ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : "grid grid-cols-1 gap-4"}>
                        {b.images.map((img) => (
                          <figure key={img.src} className="overflow-hidden rounded-xl border border-border bg-white p-2">
                            <img src={img.src} alt={img.alt} loading="lazy" className="mx-auto block h-auto w-full" />
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

      <h2>Study tips</h2>
      <p>Don't try to memorise individual signs. Learn the system first (shape + colour = meaning) then drill the specific signs that don't follow the rule (STOP, give way, no entry, national speed limit).</p>
      <p>Use free flashcard apps for the 30 most-tested signs in the final week. Then take three full mocks under timed conditions to lock everything in.</p>

      <h2>Warning signs to know cold</h2>
      <p>Triangular warning signs cover most of the marks. The most-tested examples: 'school crossing patrol' (children walking, sometimes with the lollipop-stick variant), 'T-junction', 'staggered junction', 'roundabout ahead', 'level crossing with barrier', 'level crossing without barrier or gate', 'crossroads', 'two-way traffic', 'risk of grounding' (humpback bridge or steep ramp), and 'falling rocks'.</p>
      <p>Memorise these as a set: every triangular sign points up; the only triangle that points down is the give-way sign, which is in a class of its own. If you see a triangle, slow down, scan and prepare to react.</p>

      <h2>Order signs and prohibitions</h2>
      <p>Circular signs with red borders prohibit. Common examples: 'no entry' (red circle, white horizontal bar), 'no overtaking' (two cars, red one on the right), 'no motor vehicles', 'no vehicles over X tonnes', 'no waiting', 'no stopping' (clearway — solid red disc with blue cross).</p>
      <p>Blue circles compel. 'Turn left ahead', 'mini roundabout', 'pedestrian zone', 'cycle route only', 'tram route'. The Highway Code wording 'must' indicates a legal order, while 'should' is advisory — only signs in red and blue circles carry legal force.</p>

      <h2>Information, motorway and temporary signs</h2>
      <p>Rectangular signs inform. White with black border: regulations on parking. Green: primary route information. Blue: motorway information including service distances and lane closures. Brown: tourist destinations.</p>
      <p>Temporary signs at roadworks use yellow backgrounds with black borders — they override permanent signs while the works are in place. Variable matrix signs above motorway lanes show real-time speed limits and lane closures (red X = lane closed; do not enter).</p>

      <h2>Road markings to learn alongside the signs</h2>
      <p>Road markings are tested with the same weight as signs. Across the carriageway: a single broken white line = give way (slow down and prepare to stop); double broken white lines = give way at a junction; a solid white STOP line = legal stop required.</p>
      <p>Along the carriageway: short broken centre line = hazard ahead; long broken = warning of hazard; double white line with a solid line on your side = no overtaking unless safe and the broken line is on your side.</p>
      <p>Yellow lines at the kerb: single = restricted parking (check the times on the nearby plate); double = no waiting at any time; double red = no stopping at any time on a Red Route. Zigzag yellow lines outside a school zone forbid stopping or parking even briefly.</p>

      <p>
        Ready to put it into practice? Take the{" "}
        <Link to="/topic/$slug" params={{ slug: "road-signs" }} className="font-semibold text-coral hover:underline">
          free Road Signs practice tests
        </Link>
        {" "}— each mock is 24 questions with full answer explanations.
      </p>
    </>
  );
}
