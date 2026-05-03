import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Moon, Sun, User as UserIcon, LogOut, LayoutDashboard, Heart, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav: { label: string; to: string; slug?: string }[] = [
  { label: "Home", to: "/" },
  { label: "Driving", to: "/category/$slug", slug: "driving" },
  { label: "UK Life", to: "/category/$slug", slug: "citizenship" },
  { label: "English", to: "/category/$slug", slug: "english" },
  { label: "IT & Tech", to: "/category/$slug", slug: "education" },
  { label: "Taxi & Private Hire", to: "/category/$slug", slug: "taxi-private-hire" },
  { label: "Professional", to: "/category/$slug", slug: "professional" },
  { label: "NHS", to: "/category/$slug", slug: "nhs" },
  { label: "Articles", to: "/blog" },
];

export function SiteHeader() {
  const [isDark, setIsDark] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background">
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
                activeProps={{ className: "text-foreground after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-coral" }}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.label}
                to={item.to as "/"}
                className="relative px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground"
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-foreground after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-coral" }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-foreground/70 transition-colors hover:bg-muted hover:text-foreground md:inline-flex">
            <Search className="h-4.5 w-4.5" />
          </button>
          <button type="button" onClick={toggleTheme} aria-label="Toggle dark mode"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-foreground/70 transition-colors hover:bg-muted hover:text-foreground md:inline-flex">
            {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {loading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold hover:bg-muted">
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline max-w-[120px] truncate">{user.email}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/bookmarks" })}>
                  <Heart className="mr-2 h-4 w-4" /> Bookmarks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/account" })}>
                  <Settings className="mr-2 h-4 w-4" /> Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/signin" className="inline-flex items-center justify-center rounded-xl bg-coral px-5 py-2.5 text-sm font-semibold text-coral-foreground shadow-coral transition-transform hover:-translate-y-0.5">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
