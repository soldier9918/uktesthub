import { Link } from "@tanstack/react-router";
import { Search, Moon } from "lucide-react";
import { Logo } from "./Logo";

const nav: { label: string; to: string; slug?: string }[] = [
  { label: "Home", to: "/" },
  { label: "Driving", to: "/category/$slug", slug: "driving" },
  { label: "UK Life", to: "/category/$slug", slug: "citizenship" },
  { label: "English", to: "/category/$slug", slug: "english" },
  { label: "Education", to: "/category/$slug", slug: "education" },
  { label: "Jobs", to: "/category/$slug", slug: "career" },
  { label: "Professional", to: "/category/$slug", slug: "professional" },
  { label: "NHS", to: "/category/$slug", slug: "nhs" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.slug ? (
              <Link
                key={item.label}
                to={item.to as "/category/$slug"}
                params={{ slug: item.slug }}
                className="relative px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground"
                activeProps={{
                  className:
                    "text-foreground after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-coral",
                }}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.label}
                to={item.to as "/"}
                className="relative px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground"
                activeOptions={{ exact: true }}
                activeProps={{
                  className:
                    "text-foreground after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-coral",
                }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-foreground/70 transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            aria-label="Toggle dark mode"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-foreground/70 transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
          >
            <Moon className="h-4.5 w-4.5" />
          </button>
          <Link
            to="/quiz/$slug"
            params={{ slug: "general-knowledge-daily" }}
            className="inline-flex items-center justify-center rounded-xl bg-coral px-5 py-2.5 text-sm font-semibold text-coral-foreground shadow-coral transition-transform hover:-translate-y-0.5"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
