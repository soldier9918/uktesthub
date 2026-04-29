// Curated gallery of UK road signs grouped by Highway Code category.
// Each `type` matches a key in src/components/RoadSign.tsx so the SVG renders.
// Sources: gov.uk Highway Code traffic signs PDF, bookmygarage.com sign guide,
// hdsdrivingschool.co.uk traffic signs reference.

export type SignItem = { type: string; label: string };
export type SignGroup = {
  title: string;
  intro: string;
  signs: SignItem[];
};

export const ROAD_SIGN_GROUPS: SignGroup[] = [
  {
    title: "Signs giving orders",
    intro:
      "Mostly circular. A red ring or red circle prohibits — you must not. A solid blue circle gives a positive instruction — you must.",
    signs: [
      { type: "stop", label: "Stop and give way" },
      { type: "giveWay", label: "Give way to traffic on major road" },
      { type: "noEntry", label: "No entry for vehicular traffic" },
      { type: "noVehicles", label: "No vehicles" },
      { type: "noMotorVehicles", label: "No motor vehicles" },
      { type: "noOvertaking", label: "No overtaking" },
      { type: "noUTurn", label: "No U-turns" },
      { type: "noLeftTurn", label: "No left turn" },
      { type: "noRightTurn", label: "No right turn" },
      { type: "noPedestrians", label: "No pedestrians" },
      { type: "noCycling", label: "No cycling" },
      { type: "noGoodsOver", label: "No goods vehicles over 7.5T" },
      { type: "noWaiting", label: "No waiting" },
      { type: "noStopping", label: "No stopping (clearway)" },
      { type: "weightLimit", label: "Maximum weight limit" },
      { type: "heightLimit", label: "Maximum height" },
      { type: "widthLimit", label: "Maximum width" },
    ],
  },
  {
    title: "Speed limit signs",
    intro:
      "Red ring around a number = the maximum speed in mph. The white circle with a single diagonal black line means national speed limit applies (60 single carriageway / 70 dual & motorway for cars).",
    signs: [
      { type: "speed20", label: "20 mph limit" },
      { type: "speed30", label: "30 mph limit" },
      { type: "speed40", label: "40 mph limit" },
      { type: "speed50", label: "50 mph limit" },
      { type: "speed60", label: "60 mph limit" },
      { type: "speed70", label: "70 mph limit" },
      { type: "nationalSpeedLimit", label: "National speed limit applies" },
      { type: "minSpeed30", label: "Minimum speed 30 mph" },
      { type: "endMinSpeed", label: "End of minimum speed" },
      { type: "endOfRestrictions", label: "End of all restrictions" },
    ],
  },
  {
    title: "Compulsory instructions (blue circles)",
    intro:
      "A solid blue circle gives an order you must obey — usually a direction you must follow or the type of user permitted.",
    signs: [
      { type: "turnLeft", label: "Turn left ahead" },
      { type: "turnRight", label: "Turn right ahead" },
      { type: "keepLeft", label: "Keep left" },
      { type: "keepRight", label: "Keep right" },
      { type: "aheadOnly", label: "Ahead only" },
      { type: "aheadLeft", label: "Ahead or turn left" },
      { type: "miniRoundabout", label: "Mini-roundabout" },
      { type: "passEitherSide", label: "Vehicles may pass either side" },
      { type: "busLane", label: "With-flow bus lane" },
      { type: "cycleRoute", label: "Route for pedal cycles only" },
      { type: "pedestriansOnly", label: "Pedestrian zone" },
    ],
  },
  {
    title: "Warning signs",
    intro:
      "Red equilateral triangles, point up. They warn you of a hazard ahead — slow down, look, prepare to react. Give way is the one exception, an inverted triangle.",
    signs: [
      { type: "tJunction", label: "T-junction" },
      { type: "staggeredJunction", label: "Staggered junction" },
      { type: "crossroadsWarning", label: "Crossroads" },
      { type: "roundaboutWarning", label: "Roundabout" },
      { type: "bendRight", label: "Bend to the right" },
      { type: "bendLeft", label: "Bend to the left" },
      { type: "doubleBend", label: "Double bend (first to the left)" },
      { type: "roadNarrows", label: "Road narrows on both sides" },
      { type: "roadNarrowsRight", label: "Road narrows on the right" },
      { type: "twoWayTraffic", label: "Two-way traffic" },
      { type: "oppositesPriority", label: "Priority over oncoming traffic" },
      { type: "uneven", label: "Uneven road" },
      { type: "hump", label: "Hump bridge" },
      { type: "steepHillUp", label: "Steep hill upwards" },
      { type: "steepHillDownward", label: "Steep hill downwards" },
      { type: "slipperyRoad", label: "Slippery road" },
      { type: "fallingRocks", label: "Falling or fallen rocks" },
      { type: "wildAnimals", label: "Wild animals" },
      { type: "cattle", label: "Cattle" },
      { type: "pedestrianCrossing", label: "Pedestrian crossing ahead" },
      { type: "schoolWarning", label: "Children — school crossing" },
      { type: "cyclistsAhead", label: "Cycle route ahead" },
      { type: "trafficSignals", label: "Traffic signals ahead" },
      { type: "levelCrossingGate", label: "Level crossing with barrier" },
      { type: "levelCrossingNoGate", label: "Level crossing without barrier" },
      { type: "tramsCrossing", label: "Trams crossing" },
      { type: "lowFlyingAircraft", label: "Low-flying aircraft" },
      { type: "sideWinds", label: "Side winds" },
      { type: "fordDip", label: "Ford" },
      { type: "queuesLikely", label: "Queues likely ahead" },
    ],
  },
  {
    title: "Road works",
    intro:
      "Temporary signs at roadworks use red triangles for warnings and yellow rectangles for diversion routes. They override permanent signs while the works are in place.",
    signs: [
      { type: "roadWorksAhead", label: "Road works" },
      { type: "loosCh", label: "Loose chippings" },
      { type: "diversion", label: "Diversion route" },
    ],
  },
  {
    title: "Information & direction signs",
    intro:
      "Rectangles inform. Background colour tells you the road class at a glance: blue = motorway, green = primary A-road, white = non-primary, brown = tourist destination.",
    signs: [
      { type: "motorwayBegins", label: "Start of motorway" },
      { type: "endOfMotorway", label: "End of motorway" },
      { type: "primaryRoute", label: "Primary route (A-road)" },
      { type: "nonPrimaryRoute", label: "Non-primary route (B-road)" },
      { type: "ringRoad", label: "Ring road" },
      { type: "touristSign", label: "Tourist destination" },
      { type: "hospital", label: "Hospital with A&E" },
      { type: "parking", label: "Parking" },
      { type: "cameraEnforcement", label: "Speed camera enforcement" },
    ],
  },
];
