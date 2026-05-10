import { useState } from "react";
import { RotateCw } from "lucide-react";

export type SignFlipCardData = {
  id: string;
  image: string; // /road-signs/show-and-tell/sign-XX.png
  name: string;
  meaning: string;
};

export function SignFlipCard({ sign }: { sign: SignFlipCardData }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="[perspective:1200px]">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? `${sign.name}. Tap to flip back to the sign image.`
            : `Road sign. Tap to reveal what it means.`
        }
        className="group relative block aspect-square w-full rounded-2xl outline-none transition-transform duration-[600ms] [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* FRONT */}
        <span
          className="absolute inset-0 flex flex-col items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-soft [backface-visibility:hidden] group-hover:shadow-elevated"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Tap to reveal
          </span>
          <img
            src={sign.image}
            alt=""
            loading="lazy"
            className="max-h-[70%] w-auto max-w-[85%] object-contain"
          />
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-coral">
            <RotateCw className="h-3 w-3" /> Flip
          </span>
        </span>

        {/* BACK */}
        <span
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-5 text-center text-black shadow-elevated [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-coral">
            What it means
          </span>
          <h3 className="mt-2 font-display text-base font-extrabold leading-tight text-black md:text-lg">
            {sign.name}
          </h3>
          <div className="my-2 h-0.5 w-8 rounded-full bg-coral" />
          <p className="text-xs leading-snug text-black md:text-sm">
            {sign.meaning}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-black/60">
            <RotateCw className="h-3 w-3" /> Tap to flip back
          </span>
        </span>
      </button>
    </div>
  );
}
