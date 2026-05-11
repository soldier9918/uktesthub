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
  {
    id: "29",
    image: "/road-signs/show-and-tell/sign-29.png",
    name: "Fog warning",
    meaning:
      "Matrix sign warning of fog ahead. Reduce speed, switch on dipped headlights and use fog lights if visibility drops below 100 m.",
  },
  {
    id: "30",
    image: "/road-signs/show-and-tell/sign-30.png",
    name: "End",
    meaning:
      "End of a previously displayed message or restriction (such as a temporary speed limit) on a matrix sign.",
  },
  {
    id: "31",
    image: "/road-signs/show-and-tell/sign-31.png",
    name: "Hazardous goods route (HR)",
    meaning:
      "Plate indicating a route to be used by vehicles carrying hazardous goods. Other vehicles may also use it.",
  },
  {
    id: "32",
    image: "/road-signs/show-and-tell/sign-32.png",
    name: "Tourist attraction (steam railway)",
    meaning:
      "Brown tourist sign pointing to a nearby visitor attraction — here a steam railway 300 yards ahead.",
  },
  {
    id: "33",
    image: "/road-signs/show-and-tell/sign-33.png",
    name: "Lorry parking with toilets",
    meaning:
      "Direction sign to a lorry park with toilet facilities, 1 mile ahead. The arrow shows the route to follow.",
  },
  {
    id: "34",
    image: "/road-signs/show-and-tell/sign-34.png",
    name: "Park and Ride 300 yds",
    meaning:
      "Advance direction sign to a Park and Ride site 300 yards ahead — leave your car and continue into town by bus.",
  },
  {
    id: "35",
    image: "/road-signs/show-and-tell/sign-35.png",
    name: "Park and Ride direction",
    meaning:
      "Direction sign pointing the way to a Park and Ride car park served by a bus link into the town centre.",
  },
  {
    id: "36",
    image: "/road-signs/show-and-tell/sign-36.png",
    name: "Long stay / short stay parking",
    meaning:
      "Parking direction sign showing the routes to long-stay and short-stay car parks.",
  },
  {
    id: "37",
    image: "/road-signs/show-and-tell/sign-37.png",
    name: "Lane open (green arrow)",
    meaning:
      "Overhead lane signal: green downward arrow means the lane below is open and you may use it.",
  },
  {
    id: "38",
    image: "/road-signs/show-and-tell/sign-38.png",
    name: "Lane closed (red X)",
    meaning:
      "Overhead lane signal: red X means the lane below is closed. Move out of it as soon as it is safe.",
  },
  {
    id: "39",
    image: "/road-signs/show-and-tell/sign-39.png",
    name: "Move to adjacent lane",
    meaning:
      "Overhead signal: move into the lane indicated by the diagonal white arrow because the current lane is closing ahead.",
  },
  {
    id: "40",
    image: "/road-signs/show-and-tell/sign-40.png",
    name: "Lorry route",
    meaning:
      "Direction sign showing the route lorries should follow to reach numbered roads (here A33 and M1).",
  },
  {
    id: "41",
    image: "/road-signs/show-and-tell/sign-41.png",
    name: "Taxi rank",
    meaning:
      "Taxi rank — parking reserved for the indicated number of taxis (here 3). Other vehicles must not stop here.",
  },
  {
    id: "42",
    image: "/road-signs/show-and-tell/sign-42.png",
    name: "Shared route — pedestrians and cyclists",
    meaning:
      "Route shared by pedestrians and cyclists with no separation. Cyclists must give way to pedestrians.",
  },
  {
    id: "43",
    image: "/road-signs/show-and-tell/sign-43.png",
    name: "Segregated route — pedestrians and cyclists",
    meaning:
      "Separate paths for pedestrians and cyclists, divided by a white line. Keep to the side shown for your mode.",
  },
  {
    id: "44",
    image: "/road-signs/show-and-tell/sign-44.png",
    name: "Tramway — look both ways",
    meaning:
      "Warning at a tramway crossing: trams can approach from either direction — look both ways before crossing.",
  },
  {
    id: "45",
    image: "/road-signs/show-and-tell/sign-45.png",
    name: "Bus lane — look right",
    meaning:
      "Warning at a contraflow bus lane: buses may be approaching from the right, against the normal traffic flow.",
  },
  {
    id: "46",
    image: "/road-signs/show-and-tell/sign-46.png",
    name: "Start of motorway",
    meaning:
      "Start of a motorway (here the M62) and its regulations. Certain vehicles and road users are prohibited.",
  },
  {
    id: "47",
    image: "/road-signs/show-and-tell/sign-47.png",
    name: "End of motorway",
    meaning:
      "End of motorway regulations. Motorway rules no longer apply beyond this point.",
  },
  {
    id: "48",
    image: "/road-signs/show-and-tell/sign-48.png",
    name: "End of bus lane",
    meaning:
      "End of a bus lane — the lane is no longer reserved for buses and may be used by all traffic.",
  },
  {
    id: "49",
    image: "/road-signs/show-and-tell/sign-49.png",
    name: "End of cycle route",
    meaning:
      "End of a cycle route or facility. Cyclists should rejoin the main carriageway or follow other signs.",
  },
  {
    id: "50",
    image: "/road-signs/show-and-tell/sign-50.png",
    name: "Cycle route",
    meaning:
      "Route recommended for pedal cycles. Other vehicles are usually prohibited.",
  },
  {
    id: "51",
    image: "/road-signs/show-and-tell/sign-51.png",
    name: "Bus stop",
    meaning:
      "Marks a bus stop. Do not park here — buses need clear access for passengers boarding and alighting.",
  },
  {
    id: "52",
    image: "/road-signs/show-and-tell/sign-52.png",
    name: "Tram stop",
    meaning:
      "Marks a tram stop. Be aware of trams and passengers crossing the road to reach or leave the stop.",
  },
];
