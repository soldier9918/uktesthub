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
          flipped ? `${sign.name}. Tap to flip back to the sign image.` : `Road sign. Tap to reveal what it means.`
        }
        className="group relative block aspect-square w-full rounded-2xl outline-none transition-transform duration-[600ms] [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* FRONT */}
        <span className="absolute inset-0 flex flex-col items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-soft [backface-visibility:hidden] group-hover:shadow-elevated">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Tap to reveal
          </span>
          <img src={sign.image} alt="" loading="lazy" className="max-h-[70%] w-auto max-w-[85%] object-contain" />
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-coral">
            <RotateCw className="h-3 w-3" /> Flip
          </span>
        </span>

        {/* BACK */}
        <span
          className="absolute inset-0 flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-white px-2 py-2 text-center text-black shadow-elevated [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <span className="text-[9px] font-semibold uppercase tracking-wider leading-none text-coral">
            What it means
          </span>
          <h3 className="m-0 mt-1 text-[11px] font-bold leading-none text-black">{sign.name}</h3>
          <p className="mt-1 text-[10.5px] leading-[1.15] text-black">{sign.meaning}</p>
          <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[9px] font-semibold uppercase tracking-wider leading-none text-black/60">
            <RotateCw className="h-3 w-3" /> Tap to flip back
          </span>
        </span>
      </button>
    </div>
  );
}
