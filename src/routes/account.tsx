import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { RequireAuth } from "@/components/RequireAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — UK Test Hub" }, { name: "robots", content: "noindex, nofollow" },
      { property: "og:url", content: "https://www.uktesthub.com/account" }
    ] , links: [{ rel: "canonical", href: "https://www.uktesthub.com/account" }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <RequireAuth>
        <AccountInner />
      </RequireAuth>
      <SiteFooter />
    </div>
  ),
});

function AccountInner() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name,avatar_url").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        setDisplayName(data?.display_name ?? "");
        setAvatarUrl(data?.avatar_url ?? null);
      });
  }, [user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    if (!user) return;
    if (displayName.trim().length === 0 || displayName.length > 50) return setErr("Name must be 1–50 characters");
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ display_name: displayName.trim() }).eq("id", user.id);
    setBusy(false);
    if (error) return setErr(error.message);
    setMsg("Profile saved.");
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return setErr("Use JPG, PNG or WebP");
    if (file.size > 2 * 1024 * 1024) return setErr("Max 2 MB");
    setBusy(true); setErr(null);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { setBusy(false); return setErr(upErr.message); }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${pub.publicUrl}?t=${Date.now()}`;
    await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
    setAvatarUrl(url);
    setBusy(false);
    setMsg("Avatar updated.");
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    if (newPassword.length < 8) return setErr("Password must be at least 8 characters");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setBusy(false);
    if (error) return setErr(error.message);
    setNewPassword("");
    setMsg("Password updated.");
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Account</h1>
      <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>

      {msg && <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</p>}
      {err && <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-bold">Profile</h2>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
            {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : null}
          </div>
          <label className="cursor-pointer text-sm font-semibold text-coral hover:underline">
            Change avatar
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
          </label>
        </div>
        <form onSubmit={saveProfile} className="mt-4 space-y-3">
          <Input placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={50} />
          <Button type="submit" disabled={busy}>Save</Button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-bold">Change password</h2>
        <form onSubmit={changePassword} className="mt-3 space-y-3">
          <Input type="password" placeholder="New password (min 8)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Button type="submit" disabled={busy}>Update password</Button>
        </form>
      </section>

      <section className="mt-6">
        <Button variant="outline" onClick={async () => { await signOut(); nav({ to: "/" }); }}>
          Sign out
        </Button>
      </section>
    </main>
  );
}
