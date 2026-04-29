// Official UK road sign reference pages, sourced from the
// Department for Transport "Highway Code — Traffic signs" PDF.
// Reproduced under Open Government Licence v3.0.
// Source: https://assets.publishing.service.gov.uk/media/68f8d5c5ec6267c615ed8f99/the-highway-code-traffic-signs.pdf

export type SignPage = {
  src: string;
  title: string;
  intro: string;
  alt: string;
};

export const ROAD_SIGN_PAGES: SignPage[] = [
  {
    src: "/road-signs/page-1.png",
    title: "Signs giving orders",
    intro:
      "Mostly circular. Signs with red circles are mostly prohibitive — you must not. Plates below signs qualify their message. Includes STOP, give way, no entry, no overtaking, no left/right turns and the no-U-turn sign.",
    alt: "UK road signs giving orders — STOP, give way, speed limits, no entry, no overtaking, no turns and weight/height/width restrictions",
  },
  {
    src: "/road-signs/page-2.png",
    title: "Signs giving orders — continued",
    intro:
      "No waiting and no stopping (clearway). Signs with blue circles but no red border mostly give positive instructions: ahead only, turn left/right, keep left, mini-roundabout, minimum speed, bus and cycle lanes.",
    alt: "UK road signs — no waiting, no stopping, ahead only, turn left/right, keep left, mini-roundabout, minimum speed, bus and cycle lanes",
  },
  {
    src: "/road-signs/page-3.png",
    title: "Warning signs",
    intro:
      "Mostly triangular with a red border, point up. They warn of a hazard ahead — slow down and look. Includes junctions, bends, road narrowing, roundabouts, two-way traffic, slippery road, steep hills, traffic signals and level crossings.",
    alt: "UK warning signs — junctions, bends, roundabouts, road narrowing, slippery road, steep hills, traffic signals, level crossings",
  },
  {
    src: "/road-signs/page-4.png",
    title: "Warning signs — continued",
    intro:
      "School crossing patrol, pedestrians in road, zebra crossing, overhead electric cables, restricted headroom, sharp deviation, light signals, wild animals, cattle, horses, cycle route ahead, ice, queues, hump bridge, ford, side winds and risk of grounding.",
    alt: "UK warning signs continued — school crossing, pedestrians, zebra, headroom, animals, ice, queues, hump bridge, ford",
  },
  {
    src: "/road-signs/page-5.png",
    title: "Direction signs — motorways and primary routes",
    intro:
      "Mostly rectangular. Blue backgrounds = motorway. Green backgrounds = primary A-road. The colour tells you the road class at a glance. Downward arrows mean 'get in lane'.",
    alt: "UK direction signs — motorway blue panels and primary route green panels with junction information",
  },
  {
    src: "/road-signs/page-6.png",
    title: "Non-primary routes & other direction signs",
    intro:
      "Black borders on white = non-primary and local routes. Brown panels = tourist destinations and attractions. Yellow diversion symbols (square / triangle / diamond / circle) match emergency diversion routes for motorway closures.",
    alt: "UK direction signs — non-primary B-roads, brown tourist signs, picnic sites, parking, cycle and pedestrian routes, diversion symbols",
  },
  {
    src: "/road-signs/page-7.png",
    title: "Information signs",
    intro:
      "All rectangular. Includes controlled parking and congestion zones, motorway start/end, lane indications, variable speed limits with cameras, motorway countdown markers and service area signs.",
    alt: "UK information signs — controlled zones, congestion charging, motorway start/end, lane indications, variable speed cameras, countdown markers",
  },
  {
    src: "/road-signs/page-8.png",
    title: "Information signs continued & road works",
    intro:
      "Hospital with A&E, tourist information, Home Zone, camera enforcement, plus road works signs. At road works, temporary signs use yellow backgrounds with black borders and override permanent signs while works are in place.",
    alt: "UK information and road works signs — hospital, tourist info, road works, loose chippings, lane closures, mandatory speed limits at works",
  },
];
