import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { RequireAuth } from "@/components/RequireAuth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmarks — UK Test Hub" }, { name: "robots", content: "noindex, nofollow" },
      { property: "og:url", content: "https://www.uktesthub.com/bookmarks" }
    ] , links: [{ rel: "canonical", href: "https://www.uktesthub.com/bookmarks" }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <RequireAuth>
        <BookmarksInner />
      </RequireAuth>
      <SiteFooter />
    </div>
  ),
});

function BookmarksInner() {
  const { user } = useAuth();
  const [items, setItems] = useState<{ topic_slug: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("bookmarks").select("topic_slug,created_at").order("created_at", { ascending: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, [user]);

  const remove = async (topic: string) => {
    await supabase.from("bookmarks").delete().eq("topic_slug", topic);
    setItems((prev) => prev.filter((i) => i.topic_slug !== topic));
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">My bookmarks</h1>
      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No bookmarks yet. Tap the heart on any test to save it here.
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {items.map((b) => (
            <li key={b.topic_slug} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <Link to="/topic/$slug" params={{ slug: b.topic_slug }} className="font-semibold hover:underline">
                {b.topic_slug}
              </Link>
              <Button variant="ghost" size="sm" onClick={() => remove(b.topic_slug)}>Remove</Button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
