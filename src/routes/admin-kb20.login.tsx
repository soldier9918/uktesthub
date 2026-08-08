import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/admin-kb20/login")({
  head: () => ({ meta: [{ title: "Admin Login — UK Test Hub" }, { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && isAdmin) nav({ to: "/admin-kb20" });
  }, [user, isAdmin, loading, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    const friendly = (msg: string) =>
      /failed to fetch|network|load failed/i.test(msg)
        ? "Couldn’t reach the sign-in service. Check your connection (or disable ad/tracker blockers for this site) and try again."
        : msg;
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin-kb20` },
      });
      setBusy(false);
      if (error) return setError(friendly(error.message));
      setInfo(
        "Account created. Ask the project owner to grant your account the admin role.",
      );
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setError(friendly(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="font-display text-2xl font-bold">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Restricted area. Only accounts with the admin role can edit questions.
        </p>
        {user && !isAdmin && (
          <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            Signed in as <b>{user.email}</b> — but this account is not an admin.{" "}
            <button
              className="underline"
              onClick={() => supabase.auth.signOut()}
            >
              Sign out
            </button>
          </div>
        )}
        <form onSubmit={submit} className="mt-6 space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm text-emerald-700">{info}</p>}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
          <button
            type="button"
            className="w-full text-xs text-muted-foreground hover:underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "Need an account? Create one"
              : "Already have an account? Sign in"}
          </button>
        </form>
        <p className="mt-6 text-xs text-muted-foreground">
          <Link to="/" className="underline">
            ← Back to site
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
