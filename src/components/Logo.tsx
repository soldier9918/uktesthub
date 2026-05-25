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
  const flagSize = size === "lg" ? "h-16 w-16" : size === "sm" ? "h-10 w-10" : "h-12 w-12";
  const wordSize = size === "lg" ? "text-2xl md:text-3xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <Link
      to="/"
      className="group inline-flex shrink-0 items-center gap-2 px-1 py-1 transition-all hover:-translate-y-0.5"
    >
      <span className="flex items-center justify-center">
        <img src={logoSrc} alt="UK Test Hub" className={`${flagSize} object-contain drop-shadow-sm transition-transform group-hover:scale-105`} />
      </span>

      <span className="leading-none">
        <span className="flex items-center gap-1.5">
          <span className={`tracking-[0.04em] whitespace-nowrap ${text} ${wordSize}`} style={{ fontFamily: '"Nunito", system-ui, sans-serif', fontWeight: 900 }}>
            UK TEST HUB
          </span>
        </span>
        {showTagline && (
          <span className={`mt-1 block whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] ${sub}`}>
            Pass your test first time
          </span>
        )}
      </span>
    </Link>
  );
}
