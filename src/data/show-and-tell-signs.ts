import type { SignFlipCardData } from "@/components/SignFlipCard";

// Populated as the user uploads sign images (in batches of 5, up to 19 total).
// Images live in: public/road-signs/show-and-tell/sign-XX.png
export const SHOW_AND_TELL_SIGNS: SignFlipCardData[] = [
  {
    id: "01",
    image: "/road-signs/show-and-tell/sign-01.png",
    name: "Quayside or river bank",
    meaning:
      "Warning: the road ends at a quayside, dock edge or unprotected river bank. Slow right down — there is a risk of driving straight into the water.",
  },
  {
    id: "02",
    image: "/road-signs/show-and-tell/sign-02.png",
    name: "Uneven road",
    meaning:
      "Warning: the road surface ahead is uneven, with bumps or hollows. Reduce speed to keep control of your vehicle and avoid damage to the suspension.",
  },
  {
    id: "03",
    image: "/road-signs/show-and-tell/sign-03.png",
    name: "Slippery road",
    meaning:
      "Warning: the road ahead is likely to be slippery, especially when wet. Ease off the accelerator, leave a bigger gap and avoid harsh braking or steering.",
  },
  {
    id: "04",
    image: "/road-signs/show-and-tell/sign-04.png",
    name: "Low-flying aircraft or sudden aircraft noise",
    meaning:
      "Warning: low-flying aircraft cross the road ahead, often near an airfield. Be ready for sudden loud noise so it does not startle you while driving.",
  },
  {
    id: "05",
    image: "/road-signs/show-and-tell/sign-05.png",
    name: "Other danger (see plate)",
    meaning:
      "General warning: there is a hazard ahead that doesn't have its own specific sign. Always read the plate underneath — it explains exactly what the danger is.",
  },
];
