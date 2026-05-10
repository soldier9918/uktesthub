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
          className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-2xl border border-border bg-white p-3 text-center text-black shadow-elevated [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-coral">
            What it means
          </span>
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-1">
            <h3 className="font-display text-sm font-extrabold leading-tight text-black">
              {sign.name}
            </h3>
            <div className="h-0.5 w-6 rounded-full bg-coral" />
            <p className="text-[11px] leading-snug text-black">
              {sign.meaning}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-black/60">
            <RotateCw className="h-3 w-3" /> Tap to flip back
          </span>
        </span>
      </button>
    </div>
  );
}
