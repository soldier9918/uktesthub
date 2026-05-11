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
  {
    id: "53",
    image: "/road-signs/show-and-tell/sign-53.png",
    name: "London bus stop",
    meaning:
      "Marks a London bus stop. Buses stop here automatically — do not park or wait in the marked area.",
  },
  {
    id: "54",
    image: "/road-signs/show-and-tell/sign-54.png",
    name: "Request bus stop",
    meaning:
      "Buses only stop here if signalled by passengers waiting at the stop or by passengers on board.",
  },
  {
    id: "55",
    image: "/road-signs/show-and-tell/sign-55.png",
    name: "With-flow bus lane",
    meaning:
      "Start of a with-flow bus lane that may also be used by local buses, taxis and pedal cycles during its hours of operation.",
  },
  {
    id: "56",
    image: "/road-signs/show-and-tell/sign-56.png",
    name: "With-flow cycle lane",
    meaning:
      "Start of a with-flow cycle lane reserved for pedal cycles. Other vehicles must not enter the lane during its hours of operation.",
  },
  {
    id: "57",
    image: "/road-signs/show-and-tell/sign-57.png",
    name: "Lane reserved for bus, cycles and taxis",
    meaning:
      "Nearside lane ahead is reserved for local buses, pedal cycles and taxis during its hours of operation.",
  },
  {
    id: "58",
    image: "/road-signs/show-and-tell/sign-58.png",
    name: "Lane reserved for cycles",
    meaning:
      "Nearside lane ahead is reserved for pedal cycles during its hours of operation.",
  },
  {
    id: "59",
    image: "/road-signs/show-and-tell/sign-59.png",
    name: "Contraflow bus lane",
    meaning:
      "Buses travel in the opposite direction in the lane shown — be aware of buses approaching from ahead.",
  },
  {
    id: "60",
    image: "/road-signs/show-and-tell/sign-60.png",
    name: "Contraflow cycle lane",
    meaning:
      "Pedal cycles travel in the opposite direction in the lane shown — be aware of cyclists approaching from ahead.",
  },
  {
    id: "61",
    image: "/road-signs/show-and-tell/sign-61.png",
    name: "Parking",
    meaning:
      "Parking place. Used on its own or with a plate showing restrictions or the type of vehicle that may park.",
  },
  {
    id: "62",
    image: "/road-signs/show-and-tell/sign-62.png",
    name: "Goods vehicles plate",
    meaning:
      "Plate used with another sign to show that it applies to goods vehicles (lorries).",
  },
  {
    id: "63",
    image: "/road-signs/show-and-tell/sign-63.png",
    name: "Cars plate",
    meaning:
      "Plate used with another sign to show that it applies to cars (and similar light vehicles).",
  },
  {
    id: "64",
    image: "/road-signs/show-and-tell/sign-64.png",
    name: "Vehicles being towed away",
    meaning:
      "Warning that vehicles parked illegally in the area may be removed (towed away).",
  },
  {
    id: "65",
    image: "/road-signs/show-and-tell/sign-65.png",
    name: "Motorcycles plate",
    meaning:
      "Plate used with another sign to show that it applies to solo motorcycles.",
  },
  {
    id: "66",
    image: "/road-signs/show-and-tell/sign-66.png",
    name: "Cycle parking",
    meaning:
      "Parking place reserved for pedal cycles.",
  },
  {
    id: "67",
    image: "/road-signs/show-and-tell/sign-67.png",
    name: "Coach parking",
    meaning:
      "Parking place reserved for coaches and buses.",
  },
  {
    id: "68",
    image: "/road-signs/show-and-tell/sign-68.png",
    name: "Coach photostop",
    meaning:
      "Tourist coaches may stop here briefly between 10 am and 4 pm to allow passengers to take photographs.",
  },
  {
    id: "69",
    image: "/road-signs/show-and-tell/sign-69.png",
    name: "Goods vehicle check point",
    meaning:
      "Lane-direction sign: lorries must keep to the left lane for a goods vehicle check point ½ mile ahead. Other vehicles use the right lane.",
  },
  {
    id: "70",
    image: "/road-signs/show-and-tell/sign-70.png",
    name: "Restricted entry ahead",
    meaning:
      "Advance warning that entry to the road named (here High Street) is restricted ½ mile ahead.",
  },
  {
    id: "71",
    image: "/road-signs/show-and-tell/sign-71.png",
    name: "Low bridge ahead",
    meaning:
      "Advance warning of a low bridge with a maximum headroom (here 4.4 m / 14′ 6″) 2 miles ahead.",
  },
  {
    id: "72",
    image: "/road-signs/show-and-tell/sign-72.png",
    name: "Weight limit with diversion",
    meaning:
      "Advance warning of a weight limit on a road ahead, with a suggested alternative route for vehicles over the limit.",
  },
  {
    id: "73",
    image: "/road-signs/show-and-tell/sign-73.png",
    name: "Unsuitable for motor vehicles",
    meaning:
      "The road or route ahead is unsuitable for motor vehicles — typically a narrow lane or unmade track.",
  },
  {
    id: "74",
    image: "/road-signs/show-and-tell/sign-74.png",
    name: "Countdown markers",
    meaning:
      "Countdown markers at the exit from a motorway or primary route. Each bar represents 100 yards to the start of the slip road.",
  },
  {
    id: "75",
    image: "/road-signs/show-and-tell/sign-75.png",
    name: "Depth gauge",
    meaning:
      "Depth gauge at a ford or flooded section of road, showing the depth of water in feet and metres.",
  },
  {
    id: "76",
    image: "/road-signs/show-and-tell/sign-76.png",
    name: "Hospital — no A&E",
    meaning:
      "Direction sign to a hospital that does not have an Accident and Emergency department.",
  },
  {
    id: "77",
    image: "/road-signs/show-and-tell/sign-77.png",
    name: "Hospital with A&E (not 24 hrs)",
    meaning:
      "Direction sign to a hospital with an Accident and Emergency department that is not open 24 hours a day.",
  },
  {
    id: "78",
    image: "/road-signs/show-and-tell/sign-78.png",
    name: "Police speed check area",
    meaning:
      "Warning that police speed-check equipment is in use in the area ahead. Check your speed and keep within the limit.",
  },
  {
    id: "79",
    image: "/road-signs/show-and-tell/sign-79.png",
    name: "Entrance (IN)",
    meaning:
      "Entrance to a car park or other facility — vehicles enter here.",
  },
  {
    id: "80",
    image: "/road-signs/show-and-tell/sign-80.png",
    name: "Exit (OUT)",
    meaning:
      "Exit from a car park or other facility — vehicles leave here.",
  },
  {
    id: "81",
    image: "/road-signs/show-and-tell/sign-81.png",
    name: "No exit",
    meaning:
      "There is no exit from the road or area beyond this sign — used to warn drivers that the route is a dead end.",
  },
  {
    id: "82",
    image: "/road-signs/show-and-tell/sign-82.png",
    name: "No entry (information)",
    meaning:
      "Informational sign indicating that there is no entry from this point — vehicles should not enter.",
  },
  {
    id: "83",
    image: "/road-signs/show-and-tell/sign-83.png",
    name: "Tourist information point",
    meaning:
      "Direction sign to a tourist information point where visitors can get maps, leaflets and local advice.",
  },
  {
    id: "84",
    image: "/road-signs/show-and-tell/sign-84.png",
    name: "Vehicle testing station",
    meaning:
      "Direction sign to a vehicle testing (MOT) station authorised to test vehicles for roadworthiness.",
  },
  {
    id: "85",
    image: "/road-signs/show-and-tell/sign-85.png",
    name: "Motorcycle test centre",
    meaning:
      "Direction sign to a motorcycle test centre where the practical motorcycle test is carried out.",
  },
  {
    id: "86",
    image: "/road-signs/show-and-tell/sign-86.png",
    name: "Traffic enforcement camera",
    meaning:
      "Traffic enforcement cameras are in use in the area — they may detect speeding, red-light or bus-lane offences.",
  },
  {
    id: "87",
    image: "/road-signs/show-and-tell/sign-87.png",
    name: "Speed camera with limit",
    meaning:
      "Speed cameras are in use to enforce the speed limit shown (here 30 mph). Keep within the limit.",
  },
  {
    id: "88",
    image: "/road-signs/show-and-tell/sign-88.png",
    name: "Home zone entry",
    meaning:
      "Entry to a Home Zone — a residential area where pedestrians and cyclists have priority. Drive very slowly and give way to people on foot.",
  },
  {
    id: "89",
    image: "/road-signs/show-and-tell/sign-89.png",
    name: "Home zone ends",
    meaning:
      "End of a Home Zone — normal driving conditions resume and pedestrians no longer have priority over vehicles.",
  },
  {
    id: "90",
    image: "/road-signs/show-and-tell/sign-90.png",
    name: "Traffic calmed area",
    meaning:
      "Entry to a traffic-calmed area where traffic-calming features such as humps, chicanes or narrowings are in use.",
  },
  {
    id: "91",
    image: "/road-signs/show-and-tell/sign-91.png",
    name: "Route for buses and cycles only",
    meaning:
      "Route reserved for use by local buses and pedal cycles only. Other vehicles must not enter.",
  },
  {
    id: "92",
    image: "/road-signs/show-and-tell/sign-92.png",
    name: "Route for trams only",
    meaning:
      "Route reserved for trams only. Other vehicles must not enter.",
  },
  {
    id: "93",
    image: "/road-signs/show-and-tell/sign-93.png",
    name: "Route for pedal cycles only",
    meaning:
      "Route reserved for pedal cycles only. Other vehicles must not enter.",
  },
  {
    id: "94",
    image: "/road-signs/show-and-tell/sign-94.png",
    name: "Cyclists dismount",
    meaning:
      "Plate advising cyclists to dismount and push their bicycles, usually at the end of a cycle route or at a hazard.",
  },
  {
    id: "95",
    image: "/road-signs/show-and-tell/sign-95.png",
    name: "Tram speed limit",
    meaning:
      "Mandatory maximum speed limit for trams (here 30 mph). Diamond-shaped signs apply to trams only.",
  },
  {
    id: "96",
    image: "/road-signs/show-and-tell/sign-96.png",
    name: "Tourist information",
    meaning:
      "Symbol indicating a tourist information point or office where visitors can get advice and leaflets.",
  },
  {
    id: "97",
    image: "/road-signs/show-and-tell/sign-97.png",
    name: "Tourist attraction",
    meaning:
      "Brown sign with a white symbol (here a castle) directing you to a tourist attraction or place of historic interest.",
  },
  {
    id: "98",
    image: "/road-signs/show-and-tell/sign-98.png",
    name: "Lane control ahead",
    meaning:
      "Advance warning that overhead lane control signals are in use ahead — watch for signals showing which lanes are open or closed.",
  },
  {
    id: "99",
    image: "/road-signs/show-and-tell/sign-99.png",
    name: "One way",
    meaning:
      "Traffic on this road flows in one direction only, in the direction of the arrow. Do not drive against the arrow.",
  },
  {
    id: "100",
    image: "/road-signs/show-and-tell/sign-100.png",
    name: "Two-way traffic — give priority to oncoming vehicles",
    meaning:
      "Road narrows ahead with two-way traffic. You must give priority to oncoming vehicles (red arrow) before proceeding.",
  },
  {
    id: "101",
    image: "/road-signs/show-and-tell/sign-101.png",
    name: "No through road",
    meaning:
      "The road ahead is a dead end (cul-de-sac) with no exit for vehicles. You'll need to turn around to leave.",
  },
  {
    id: "102",
    image: "/road-signs/show-and-tell/sign-102.png",
    name: "No through road on side road",
    meaning:
      "The side road branching off ahead is a dead end with no through route for vehicles.",
  },
  {
    id: "103",
    image: "/road-signs/show-and-tell/sign-103.png",
    name: "Escape lane ahead",
    meaning:
      "An escape lane (with a gravel or sand arrester bed) is ahead — for vehicles that have lost their brakes on a steep downhill.",
  },
  {
    id: "104",
    image: "/road-signs/show-and-tell/sign-104.png",
    name: "Dual carriageway ahead",
    meaning:
      "The road ahead becomes a dual carriageway with a central reservation separating the two directions of traffic.",
  },
  {
    id: "105",
    image: "/road-signs/show-and-tell/sign-105.png",
    name: "Dual carriageway for ½ mile",
    meaning:
      "Advance information that a dual carriageway begins in half a mile — be ready for two lanes in your direction with a central reservation.",
  },
  {
    id: "106",
    image: "/road-signs/show-and-tell/sign-106.png",
    name: "Single track road with passing places",
    meaning:
      "The road ahead is single track. Use the marked passing places to let oncoming vehicles through or to allow following traffic to overtake.",
  },
  {
    id: "107",
    image: "/road-signs/show-and-tell/sign-107.png",
    name: "Lane gained on the left",
    meaning:
      "An additional lane is added on the left ahead — traffic in your lane continues; the new lane provides extra capacity.",
  },
  {
    id: "108",
    image: "/road-signs/show-and-tell/sign-108.png",
    name: "Lane closed ahead (right-hand lane)",
    meaning:
      "The right-hand lane is closed ahead. Move into one of the open lanes in good time.",
  },
  {
    id: "109",
    image: "/road-signs/show-and-tell/sign-109.png",
    name: "Lane closed (merge in turn)",
    meaning:
      "The left-hand lane is closed ahead — merge in turn with traffic in the open lanes in good time.",
  },
  {
    id: "110",
    image: "/road-signs/show-and-tell/sign-110.png",
    name: "Lane destinations with bus exception",
    meaning:
      "Shows which lanes lead to which destinations at the junction ahead. The 'Except buses' plate means the left-turn restriction does not apply to buses.",
  },
  {
    id: "111",
    image: "/road-signs/show-and-tell/sign-111.png",
    name: "Lane destinations — ahead or right",
    meaning:
      "At the junction ahead, the left lane is for traffic going straight on and the right lane is for turning right.",
  },
  {
    id: "112",
    image: "/road-signs/show-and-tell/sign-112.png",
    name: "Lane destinations — left or right",
    meaning:
      "At the junction ahead, the left lane is for turning left or going ahead and the right lane is for turning right.",
  },
  {
    id: "113",
    image: "/road-signs/show-and-tell/sign-113.png",
    name: "Bus lane on road at junction",
    meaning:
      "There is a bus lane on the road being joined at the junction ahead. The arrow shows the direction of bus traffic.",
  },
  {
    id: "114",
    image: "/road-signs/show-and-tell/sign-114.png",
    name: "Cycle lane on road at junction",
    meaning:
      "There is a cycle lane on the road being joined at the junction ahead. The arrow shows the direction of cycle traffic.",
  },
  {
    id: "115",
    image: "/road-signs/show-and-tell/sign-115.png",
    name: "Bus and cycle lane",
    meaning:
      "There is a lane reserved for buses and pedal cycles on the road being joined at the junction ahead.",
  },
  {
    id: "116",
    image: "/road-signs/show-and-tell/sign-116.png",
    name: "Congestion charging zone",
    meaning:
      "Entering a congestion charging zone — drivers must pay a daily charge to drive within the zone during operating hours.",
  },
  {
    id: "117",
    image: "/road-signs/show-and-tell/sign-117.png",
    name: "Ahead only",
    meaning:
      "Mandatory instruction to proceed straight ahead. You must not turn left or right.",
  },
  {
    id: "118",
    image: "/road-signs/show-and-tell/sign-118.png",
    name: "Turn left",
    meaning:
      "Mandatory instruction to turn left ahead. You must follow the direction shown by the arrow.",
  },
  {
    id: "119",
    image: "/road-signs/show-and-tell/sign-119.png",
    name: "Turn left ahead",
    meaning:
      "Mandatory instruction that you must turn left at the junction ahead.",
  },
  {
    id: "120",
    image: "/road-signs/show-and-tell/sign-120.png",
    name: "Keep left",
    meaning:
      "Vehicles must pass to the left of the sign — typically used at islands, bollards or refuges.",
  },
  {
    id: "121",
    image: "/road-signs/show-and-tell/sign-121.png",
    name: "Vehicles may pass either side",
    meaning:
      "Vehicles may pass either side of the sign to reach the same destination — typically used at islands or obstructions.",
  },
  {
    id: "122",
    image: "/road-signs/show-and-tell/sign-122.png",
    name: "Mini-roundabout",
    meaning:
      "Mini-roundabout ahead — give way to traffic from the immediate right and proceed around the central marking in a clockwise direction.",
  },
  {
    id: "123",
    image: "/road-signs/show-and-tell/sign-123.png",
    name: "One-way traffic",
    meaning:
      "Traffic on this road flows in one direction only, in the direction of the arrow.",
  },
  {
    id: "124",
    image: "/road-signs/show-and-tell/sign-124.png",
    name: "Maximum speed limit",
    meaning:
      "Mandatory maximum speed limit in miles per hour (here 40 mph). You must not exceed this speed.",
  },
  {
    id: "125",
    image: "/road-signs/show-and-tell/sign-125.png",
    name: "National speed limit applies",
    meaning:
      "The national speed limit applies on this road — 60 mph for cars on single carriageways and 70 mph on dual carriageways and motorways (lower limits for some vehicles).",
  },
  {
    id: "126",
    image: "/road-signs/show-and-tell/sign-126.png",
    name: "Minimum speed",
    meaning:
      "Mandatory minimum speed limit (here 30 mph). You must not drive slower than this speed unless it is unsafe to do so.",
  },
  {
    id: "127",
    image: "/road-signs/show-and-tell/sign-127.png",
    name: "End of minimum speed",
    meaning:
      "End of the minimum speed limit shown. The minimum speed restriction no longer applies.",
  },
  {
    id: "128",
    image: "/road-signs/show-and-tell/sign-128.png",
    name: "20 mph zone",
    meaning:
      "Entry to a 20 mph zone — a 20 mph speed limit applies throughout the area, usually with traffic-calming measures such as humps or chicanes.",
  },
  {
    id: "129",
    image: "/road-signs/show-and-tell/sign-129.png",
    name: "End of 30 mph zone",
    meaning:
      "End of the 30 mph speed limit zone. The previous speed restriction no longer applies — the national speed limit or next posted limit takes over.",
  },
  {
    id: "130",
    image: "/road-signs/show-and-tell/sign-130.png",
    name: "Speed camera area",
    meaning:
      "Warning of speed camera enforcement of the posted limit (here 50 mph). Orange dots indicate camera markings — keep within the limit.",
  },
  {
    id: "131",
    image: "/road-signs/show-and-tell/sign-131.png",
    name: "No waiting",
    meaning:
      "No waiting at any time. You must not stop to wait or park, though you may stop briefly to set down or pick up passengers.",
  },
  {
    id: "132",
    image: "/road-signs/show-and-tell/sign-132.png",
    name: "End of loading area",
    meaning:
      "End of a designated loading area. Loading and unloading restrictions of the zone you are leaving no longer apply beyond this sign.",
  },
  {
    id: "133",
    image: "/road-signs/show-and-tell/sign-133.png",
    name: "Permit holders only parking",
    meaning:
      "Parking reserved exclusively for vehicles displaying a valid permit. Other vehicles must not park here.",
  },
  {
    id: "134",
    image: "/road-signs/show-and-tell/sign-134.png",
    name: "Resident permit holders only",
    meaning:
      "Parking restricted to residents holding the permit zones shown (e.g. A, B, C). Vehicles without the correct resident permit must not park here.",
  },
  {
    id: "135",
    image: "/road-signs/show-and-tell/sign-135.png",
    name: "Loading only",
    meaning:
      "Bay reserved for loading and unloading goods only. Vehicles must not wait beyond the time needed to load or unload.",
  },
  {
    id: "136",
    image: "/road-signs/show-and-tell/sign-136.png",
    name: "Voucher parking",
    meaning:
      "Voucher parking only during the times shown (here Mon–Sat 9 am–6 pm), with a 2 hour maximum stay. Display a valid parking voucher.",
  },
  {
    id: "137",
    image: "/road-signs/show-and-tell/sign-137.png",
    name: "Disabled badge holders only",
    meaning:
      "Parking reserved for vehicles displaying a valid Blue Badge. Other vehicles must not park here.",
  },
  {
    id: "138",
    image: "/road-signs/show-and-tell/sign-138.png",
    name: "Have you paid and displayed?",
    meaning:
      "Reminder in pay-and-display parking areas to buy a ticket and display it clearly inside the windscreen before leaving the vehicle.",
  },
  {
    id: "139",
    image: "/road-signs/show-and-tell/sign-139.png",
    name: "Disc zone parking",
    meaning:
      "Parking disc zone — during the times shown (Mon–Sat 8 am–6 pm) you may park for 30 minutes maximum with a parking disc displayed. No return within 1 hour.",
  },
  {
    id: "140",
    image: "/road-signs/show-and-tell/sign-140.png",
    name: "Controlled parking zone",
    meaning:
      "Entry to a controlled parking zone — waiting restrictions apply during the times shown. Parking is only permitted in marked bays.",
  },
  {
    id: "141",
    image: "/road-signs/show-and-tell/sign-141.png",
    name: "Voucher parking zone",
    meaning:
      "Entry to a voucher parking zone — during the times shown (Mon–Sat 9 am–6 pm) parking is permitted only with a valid voucher displayed, with a 2 hour maximum stay.",
  },
  {
    id: "142",
    image: "/road-signs/show-and-tell/sign-142.png",
    name: "End of controlled parking zone",
    meaning:
      "End of the controlled parking zone — the waiting restrictions of the zone you are leaving no longer apply beyond this sign.",
  },
  {
    id: "143",
    image: "/road-signs/show-and-tell/sign-143.png",
    name: "Goods vehicle restricted zone",
    meaning:
      "Entry to a zone where goods vehicles over the weight shown (here 5 tonnes) must not load or unload during the times indicated.",
  },
  {
    id: "144",
    image: "/road-signs/show-and-tell/sign-144.png",
    name: "End of goods vehicle zone",
    meaning:
      "End of the goods vehicle restricted zone — the loading restrictions for vehicles over the stated weight no longer apply beyond this sign.",
  },
  {
    id: "145",
    image: "/road-signs/show-and-tell/sign-145.png",
    name: "Parking partly on verge or footway",
    meaning:
      "Vehicles may park partly on the verge or footway in the area shown. Take care not to obstruct pedestrians.",
  },
  {
    id: "146",
    image: "/road-signs/show-and-tell/sign-146.png",
    name: "End of partly on verge parking",
    meaning:
      "End of the area where vehicles may park partly on the verge or footway. Beyond this point parking partly on the verge is not permitted.",
  },
  {
    id: "147",
    image: "/road-signs/show-and-tell/sign-147.png",
    name: "Parking wholly on verge or footway",
    meaning:
      "Vehicles may park wholly on the verge or footway in the area shown. Avoid blocking pedestrian access.",
  },
  {
    id: "148",
    image: "/road-signs/show-and-tell/sign-148.png",
    name: "End of wholly on verge parking",
    meaning:
      "End of the area where vehicles may park wholly on the verge or footway. Beyond this point parking on the verge or footway is not permitted.",
  },
  {
    id: "149",
    image: "/road-signs/show-and-tell/sign-149.png",
    name: "No stopping except buses",
    meaning:
      "No stopping during the times shown (here 7 am–7 pm) except for buses. Other vehicles must not stop, even briefly.",
  },
  {
    id: "150",
    image: "/road-signs/show-and-tell/sign-150.png",
    name: "Bus stand — no stopping",
    meaning:
      "Bus stand: no stopping during the times shown (here 7 am–7 pm) except for buses using the stand. Other vehicles must not stop here.",
  },
  {
    id: "151",
    image: "/road-signs/show-and-tell/sign-151.png",
    name: "STOP",
    meaning:
      "You must stop completely at the line and give way to traffic on the major road. Only move off when it is safe to do so.",
  },
  {
    id: "152",
    image: "/road-signs/show-and-tell/sign-152.png",
    name: "Give way",
    meaning:
      "Give way to traffic on the major road. Slow down and be prepared to stop if necessary; only proceed when there is a safe gap.",
  },
  {
    id: "153",
    image: "/road-signs/show-and-tell/sign-153.png",
    name: "No right turn",
    meaning:
      "Right turn prohibited. You must not turn right at the junction or entrance ahead.",
  },
  {
    id: "154",
    image: "/road-signs/show-and-tell/sign-154.png",
    name: "No left turn",
    meaning:
      "Left turn prohibited. You must not turn left at the junction or entrance ahead.",
  },
  {
    id: "155",
    image: "/road-signs/show-and-tell/sign-155.png",
    name: "No U-turns",
    meaning:
      "U-turns are not permitted. You must not turn the vehicle around to face the opposite direction at this point.",
  },
  {
    id: "156",
    image: "/road-signs/show-and-tell/sign-156.png",
    name: "Give priority to oncoming vehicles",
    meaning:
      "Give priority to vehicles coming from the opposite direction at the narrow section ahead. The red arrow shows oncoming traffic with right of way; you must wait until the road is clear.",
  },
  {
    id: "157",
    image: "/road-signs/show-and-tell/sign-157.png",
    name: "No entry for vehicular traffic",
    meaning:
      "No entry for vehicular traffic. You must not drive past this sign — it usually marks the wrong-way end of a one-way street.",
  },
  {
    id: "158",
    image: "/road-signs/show-and-tell/sign-158.png",
    name: "No vehicles",
    meaning:
      "No vehicles of any kind permitted beyond this sign (except pedal cycles being pushed). Often used at the entrance to pedestrian areas.",
  },
  {
    id: "159",
    image: "/road-signs/show-and-tell/sign-159.png",
    name: "Pedestrian zone — no vehicles except for loading",
    meaning:
      "Entry to a pedestrian zone. No vehicles permitted except goods vehicles loading or unloading at the times shown on the plate.",
  },
  {
    id: "160",
    image: "/road-signs/show-and-tell/sign-160.png",
    name: "Pedestrian zone — loading restrictions",
    meaning:
      "Pedestrian zone with no motor vehicles except for loading. The yellow plate shows additional no-waiting restrictions (here at any time).",
  },
  {
    id: "161",
    image: "/road-signs/show-and-tell/sign-161.png",
    name: "End of pedestrian zone",
    meaning:
      "End of the pedestrian zone — the vehicle restrictions of the pedestrian zone you are leaving no longer apply beyond this sign.",
  },
  {
    id: "162",
    image: "/road-signs/show-and-tell/sign-162.png",
    name: "No motor vehicles",
    meaning:
      "No motor vehicles permitted beyond this sign. Pedal cycles and other non-motorised users may still pass.",
  },
  {
    id: "163",
    image: "/road-signs/show-and-tell/sign-163.png",
    name: "No cars",
    meaning:
      "No cars permitted beyond this sign. Other vehicles such as motorcycles, buses or goods vehicles may still pass unless restricted by other signs.",
  },
  {
    id: "164",
    image: "/road-signs/show-and-tell/sign-164.png",
    name: "No motorcycles",
    meaning:
      "No solo motorcycles permitted beyond this sign. Other vehicles may still pass unless restricted by other signs.",
  },
  {
    id: "165",
    image: "/road-signs/show-and-tell/sign-165.png",
    name: "No goods vehicles over maximum gross weight shown",
    meaning:
      "Goods vehicles over the maximum gross weight shown (here 7.5 tonnes) are prohibited beyond this sign.",
  },
  {
    id: "166",
    image: "/road-signs/show-and-tell/sign-166.png",
    name: "End of goods vehicle restriction",
    meaning:
      "End of the restriction on goods vehicles. The weight limit shown previously no longer applies beyond this sign.",
  },
  {
    id: "167",
    image: "/road-signs/show-and-tell/sign-167.png",
    name: "No articulated vehicles",
    meaning:
      "Articulated vehicles are prohibited beyond this sign. Other vehicles may still pass unless restricted by other signs.",
  },
  {
    id: "168",
    image: "/road-signs/show-and-tell/sign-168.png",
    name: "No horse-drawn vehicles",
    meaning:
      "Horse-drawn vehicles are prohibited beyond this sign.",
  },
  {
    id: "169",
    image: "/road-signs/show-and-tell/sign-169.png",
    name: "No ridden or accompanied horses",
    meaning:
      "Ridden or accompanied horses are prohibited beyond this sign.",
  },
  {
    id: "170",
    image: "/road-signs/show-and-tell/sign-170.png",
    name: "No vehicles towing a caravan or trailer",
    meaning:
      "Vehicles towing a caravan or trailer are prohibited beyond this sign.",
  },
  {
    id: "171",
    image: "/road-signs/show-and-tell/sign-171.png",
    name: "No vehicles carrying explosives",
    meaning:
      "Vehicles carrying explosives are prohibited beyond this sign.",
  },
  {
    id: "172",
    image: "/road-signs/show-and-tell/sign-172.png",
    name: "No pedestrians",
    meaning:
      "Pedestrians are prohibited beyond this sign — typically used at the entrance to motorways, tunnels and other roads where walking is not permitted.",
  },
];
