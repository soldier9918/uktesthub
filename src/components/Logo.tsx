import { Link } from "@tanstack/react-router";
import logoSrc from "@/assets/uktesthub-logo.png";

type Props = {
  variant?: "dark" | "light";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
};

export function Logo({ variant = "dark", showTagline = true, size = "md" }: Props) {
  const text = variant === "dark" ? "text-foreground" : "text-navy-foreground";
  const sub = variant === "dark" ? "text-muted-foreground" : "text-navy-foreground/70";
  const flagSize = size === "lg" ? "h-16 w-16" : size === "sm" ? "h-10 w-10" : "h-14 w-14";
  const wordSize = size === "lg" ? "text-2xl md:text-3xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-3 rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-muted/40 px-3 py-2 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-md dark:ring-white/5"
    >
      <span className="flex items-center justify-center rounded-xl bg-gradient-to-br from-navy/5 to-coral/10 p-1 ring-1 ring-border/50">
        <img src={logoSrc} alt="UK Test Hub" className={`${flagSize} object-contain drop-shadow-sm transition-transform group-hover:scale-105`} />
      </span>

      <span className="leading-none">
        <span className="flex items-center gap-1.5">
          <span className={`font-display font-extrabold tracking-tight ${text} ${wordSize}`}>
            UK TEST HUB
          </span>
          <span className="rounded-md bg-coral px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-coral-foreground">
            Pro
          </span>
        </span>
        {showTagline && (
          <span className={`mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] ${sub}`}>
            Pass your test first time
          </span>
        )}
      </span>
    </Link>
  );
}
