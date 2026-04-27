import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { categories } from "@/data/categories";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-coral text-coral-foreground shadow-coral">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            UK Test <span className="text-coral">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "text-foreground bg-muted" }}
            >
              {c.title.split(" & ")[0]}
            </Link>
          ))}
        </nav>

        <Link
          to="/quiz/$slug"
          params={{ slug: "general-knowledge-daily" }}
          className="hidden rounded-xl bg-gradient-coral px-4 py-2 text-sm font-semibold text-coral-foreground shadow-coral transition-transform hover:-translate-y-0.5 md:inline-flex"
        >
          Daily Quiz
        </Link>
      </div>
    </header>
  );
}
