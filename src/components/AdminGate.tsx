import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function AdminGate({ children }: { children: ReactNode }) {
  const { loading, user, isAdmin } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/admin-kb20/login" });
  }, [loading, user, nav]);

  if (loading) {
    return <Centered>Loading…</Centered>;
  }
  if (!user) return <Centered>Redirecting…</Centered>;
  if (!isAdmin) {
    return (
      <Centered>
        <p className="font-semibold">Not an admin</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account ({user.email}) doesn't have the admin role.
        </p>
        <Button className="mt-4" onClick={() => supabase.auth.signOut()}>
          Sign out
        </Button>
      </Centered>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="border-b border-border bg-muted/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-xs">
          <nav className="flex items-center gap-3">
            <Link to="/admin-kb20" className="font-semibold hover:underline">
              Admin
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/admin-kb20/diagnostics" className="hover:underline">
              Diagnostics
            </Link>
            <Link to="/admin-kb20/questions" className="hover:underline">
              Questions
            </Link>
            <Link to="/admin-kb20/users" className="hover:underline">
              Users
            </Link>
          </nav>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{user.email}</span>
            <button
              className="underline"
              onClick={() => supabase.auth.signOut()}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
      {children}
      <SiteFooter />
    </div>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-md px-4 py-16 text-center">{children}</div>
      <SiteFooter />
    </div>
  );
}
