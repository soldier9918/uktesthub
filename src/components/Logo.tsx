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
  const flagSize = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const wordSize = size === "lg" ? "text-2xl md:text-3xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <Link to="/" className="inline-flex items-center gap-2.5">
      <img src={logoSrc} alt="UK Test Hub" className={`${flagSize} object-contain`} />

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
