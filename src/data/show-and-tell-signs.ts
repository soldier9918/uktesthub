import type { SignFlipCardData } from "@/components/SignFlipCard";

// Populated as the user uploads sign images (in batches, up to 19 total).
// Images live in: public/road-signs/show-and-tell/sign-XX.png
export const SHOW_AND_TELL_SIGNS: SignFlipCardData[] = [
  {
    id: "01",
    image: "/road-signs/show-and-tell/sign-01.png",
    name: "Cattle grid",
    meaning:
      "Warning: a cattle grid crosses the road ahead. Slow down — the metal bars can be slippery, especially when wet.",
  },
  {
    id: "02",
    image: "/road-signs/show-and-tell/sign-02.png",
    name: "Agricultural vehicles",
    meaning:
      "Warning: slow-moving agricultural vehicles such as tractors are likely to be on or crossing the road. Be ready to slow down or stop.",
  },
  {
    id: "03",
    image: "/road-signs/show-and-tell/sign-03.png",
    name: "Ford ahead",
    meaning:
      "Warning: a ford (shallow river or stream crossing) ahead. Check the depth gauge and drive through slowly in a low gear.",
  },
  {
    id: "04",
    image: "/road-signs/show-and-tell/sign-04.png",
    name: "Try your brakes",
    meaning:
      "Plate sign found just after a ford or water splash: test your brakes gently to dry them out before continuing at normal speed.",
  },
  {
    id: "05",
    image: "/road-signs/show-and-tell/sign-05.png",
    name: "Risk of ice",
    meaning:
      "Warning: the road ahead may be icy or slippery. Drive smoothly at low speed — avoid harsh braking, steering or acceleration.",
  },
  {
    id: "06",
    image: "/road-signs/show-and-tell/sign-06.png",
    name: "Quayside or river bank",
    meaning:
      "Warning: the road runs alongside a quay, dock or river bank with no barrier. Drive slowly and keep well clear of the edge.",
  },
  {
    id: "07",
    image: "/road-signs/show-and-tell/sign-07.png",
    name: "Risk of flooding",
    meaning:
      "Warning: the road ahead is liable to flooding, often after heavy rain or near rivers. Slow down and be ready to stop or turn back.",
  },
  {
    id: "08",
    image: "/road-signs/show-and-tell/sign-08.png",
    name: "Uneven road",
    meaning:
      "Warning: the road surface ahead is uneven with bumps or dips. Reduce speed to keep control and avoid jolting the vehicle.",
  },
  {
    id: "09",
    image: "/road-signs/show-and-tell/sign-09.png",
    name: "Soft verges",
    meaning:
      "Warning: the verges at the side of the road are soft and may give way under a vehicle's weight. Avoid pulling onto them, especially in wet weather.",
  },
  {
    id: "10",
    image: "/road-signs/show-and-tell/sign-10.png",
    name: "Slippery road",
    meaning:
      "Warning: the road surface ahead may be slippery. Reduce speed and avoid harsh braking, steering or acceleration.",
  },
  {
    id: "11",
    image: "/road-signs/show-and-tell/sign-11.png",
    name: "Road hump",
    meaning:
      "Warning: a road hump or series of humps ahead, used to slow traffic. Reduce speed before reaching them to keep control and comfort.",
  },
  {
    id: "12",
    image: "/road-signs/show-and-tell/sign-12.png",
    name: "Low-flying aircraft",
    meaning:
      "Warning: low-flying aircraft or sudden aircraft noise ahead, usually near an airfield. Stay alert as the noise can be startling.",
  },
  {
    id: "13",
    image: "/road-signs/show-and-tell/sign-13.png",
    name: "Low-flying helicopters",
    meaning:
      "Warning: low-flying helicopters or sudden helicopter noise ahead. Be ready for unexpected noise that could distract you or other road users.",
  },
  {
    id: "14",
    image: "/road-signs/show-and-tell/sign-14.png",
    name: "Falling or fallen rocks",
    meaning:
      "Warning: risk of rocks falling onto the road, or fallen rocks already on the carriageway. Reduce speed and watch the road surface ahead.",
  },
  {
    id: "15",
    image: "/road-signs/show-and-tell/sign-15.png",
    name: "No vehicles",
    meaning:
      "Prohibition: no vehicles of any kind allowed (except pedal cycles being pushed). Often used for pedestrian-only areas.",
  },
  {
    id: "16",
    image: "/road-signs/show-and-tell/sign-16.png",
    name: "Other danger",
    meaning:
      "Warning: a hazard ahead not covered by other signs. A plate beneath usually describes the danger — slow down and be ready to react.",
  },
  {
    id: "17",
    image: "/road-signs/show-and-tell/sign-17.png",
    name: "Fire station ahead",
    meaning:
      "Plate with red lights at a fire station: stop when the lights show, as fire engines may be leaving to attend an emergency.",
  },
  {
    id: "18",
    image: "/road-signs/show-and-tell/sign-18.png",
    name: "Side winds",
    meaning:
      "Warning: strong crosswinds likely on the road ahead, often on exposed bridges or open country. Grip the wheel firmly and reduce speed.",
  },
  {
    id: "19",
    image: "/road-signs/show-and-tell/sign-19.png",
    name: "Military vehicles",
    meaning:
      "Warning: slow-moving military vehicles, such as tanks, may be on or crossing the road ahead. Be ready to slow down or stop.",
  },
  {
    id: "20",
    image: "/road-signs/show-and-tell/sign-20.png",
    name: "Steep hill downwards",
    meaning:
      "Warning: steep descent ahead. Select a low gear before the hill to control speed and avoid overusing the brakes.",
  },
  {
    id: "21",
    image: "/road-signs/show-and-tell/sign-21.png",
    name: "Services",
    meaning:
      "Direction sign to motorway service area or roadside services. Blue arrow points the way to fuel, food and rest facilities.",
  },
  {
    id: "22",
    image: "/road-signs/show-and-tell/sign-22.png",
    name: "Keep apart 2 chevrons",
    meaning:
      "Keep at least a two-chevron gap from the vehicle in front. Helps drivers judge a safe following distance on high-speed roads.",
  },
  {
    id: "23",
    image: "/road-signs/show-and-tell/sign-23.png",
    name: "Check your distance",
    meaning:
      "Reminder plate, often used with chevron markings, to check the gap from the vehicle ahead and drop back if too close.",
  },
  {
    id: "24",
    image: "/road-signs/show-and-tell/sign-24.png",
    name: "Variable speed limit (50 mph)",
    meaning:
      "Electronic sign showing a temporary mandatory speed limit (here 50 mph), often used for congestion or roadworks on motorways.",
  },
  {
    id: "25",
    image: "/road-signs/show-and-tell/sign-25.png",
    name: "Lane diversion arrow",
    meaning:
      "Matrix sign on a motorway gantry: move from your lane in the direction of the arrow because the lane ahead is closed.",
  },
  {
    id: "26",
    image: "/road-signs/show-and-tell/sign-26.png",
    name: "Lanes available",
    meaning:
      "Matrix sign showing which lanes are open ahead. Vertical lines indicate lanes you may continue to use.",
  },
  {
    id: "27",
    image: "/road-signs/show-and-tell/sign-27.png",
    name: "Leave the motorway",
    meaning:
      "Red flashing matrix sign: leave the motorway at the next exit because of an incident or closure ahead.",
  },
  {
    id: "28",
    image: "/road-signs/show-and-tell/sign-28.png",
    name: "Lane closed (red X)",
    meaning:
      "Red X on an overhead gantry: the lane below is closed. Move out of it as soon as it is safe — do not drive under a red X.",
  },
];
