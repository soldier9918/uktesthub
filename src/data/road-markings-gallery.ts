// Official UK road markings reference pages, from the Department for Transport
// "Highway Code — Road markings" pages. Reproduced under Open Government Licence v3.0.

export type MarkingPage = {
  src: string;
  title: string;
  intro: string;
  alt: string;
};

export const ROAD_MARKING_PAGES: MarkingPage[] = [
  {
    src: "/road-markings/page-01.png",
    title: "Across & along the carriageway",
    intro:
      "White lines painted across the road tell you where to stop or give way — at signals, STOP signs, level crossings and roundabouts. Lines running along the road separate lanes and warn of hazards: edge lines, centre lines, hazard warning lines, double white lines and lane lines.",
    alt: "UK road markings — stop lines, give way lines at roundabouts, edge line, centre line, hazard warning line, double white lines and lane lines",
  },
  {
    src: "/road-markings/page-02.png",
    title: "Along the edge of the carriageway",
    intro:
      "Yellow lines along the kerb show waiting restrictions: double yellow means no waiting at any time, single yellow means no waiting during the times shown on nearby plates. Red lines on London Red Routes are stricter — double red always means no stopping at any time, and red boxes restrict parking and loading further.",
    alt: "UK road markings — single and double yellow waiting restriction lines, red route single and double red lines with parking and loading boxes",
  },
  {
    src: "/road-markings/page-03.png",
    title: "On the kerb & other road markings",
    intro:
      "Yellow marks on the kerb show loading restrictions, used together with black-and-white time plates. White 'Loading Only' bays mark where loading is permitted. Other markings include school keep-clear zigzags, give-way triangles, reserved parking bays, bus stops, bus lanes, box junctions, KEEP CLEAR markings and lane destination arrows.",
    alt: "UK road markings — loading restriction kerb marks, loading bay, school keep clear zigzags, give way triangle, doctor parking bay, bus stop, bus lane, box junction, keep clear, lane destination arrows",
  },
];
