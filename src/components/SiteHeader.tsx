import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Moon, Sun, User as UserIcon, LogOut, LayoutDashboard, Heart, Settings, Menu, X } from "lucide-react";
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
  { label: "Study Guides", to: "/blog" },
];

export function SiteHeader() {
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-gradient-to-r from-[#06172e] via-[#0a2540] to-[#06172e] text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Logo variant="light" />

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.slug ? (
              <Link
                key={item.label}
                to={item.to as "/category/$slug"}
                params={{ slug: item.slug }}
                className="relative px-3 py-2 text-sm font-semibold uppercase tracking-wider text-white/75 transition-colors hover:text-white"
                activeProps={{ className: "!text-white after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:bg-gradient-to-r after:from-amber-300 after:via-coral after:to-amber-300" }}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.label}
                to={item.to as "/"}
                className="relative px-3 py-2 text-sm font-semibold uppercase tracking-wider text-white/75 transition-colors hover:text-white"
                activeOptions={{ exact: true }}
                activeProps={{ className: "!text-white after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:bg-gradient-to-r after:from-amber-300 after:via-coral after:to-amber-300" }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center text-white/70 transition-colors hover:bg-white/10 hover:text-white md:inline-flex">
            <Search className="h-4.5 w-4.5" />
          </button>

          {loading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-10 items-center gap-2 border border-white/15 bg-white/5 px-3 text-sm font-semibold text-white hover:bg-white/10">
                <UserIcon className="h-4 w-4" />
                <span className="hidden xl:inline max-w-[140px] truncate">{user.email}</span>
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
            <Link to="/signin" className="inline-flex items-center justify-center whitespace-nowrap bg-gradient-to-br from-[#ff5a5f] to-[#c81e2c] px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_8px_20px_-8px_rgba(255,90,95,0.7)] ring-1 ring-white/20 transition-transform hover:-translate-y-0.5">
              Sign in
            </Link>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#06172e] lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 md:px-6">
            <div className="mb-2 flex items-center gap-2 border-b border-white/10 pb-2">
              <button
                type="button"
                aria-label="Search"
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
              >
                <Search className="h-4 w-4" /> Search
              </button>
            </div>
            {nav.map((item) =>
              item.slug ? (
                <Link
                  key={item.label}
                  to={item.to as "/category/$slug"}
                  params={{ slug: item.slug }}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-white/80 hover:bg-white/10 hover:text-white"
                  activeProps={{ className: "bg-white/10 text-white" }}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.label}
                  to={item.to as "/"}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-white/80 hover:bg-white/10 hover:text-white"
                  activeOptions={{ exact: true }}
                  activeProps={{ className: "bg-white/10 text-white" }}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
