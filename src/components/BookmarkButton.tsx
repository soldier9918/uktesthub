import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export function BookmarkButton({ topicSlug, className = "" }: { topicSlug: string; className?: string }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("bookmarks").select("id").eq("topic_slug", topicSlug).maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, topicSlug]);

  if (!user) {
    return (
      <Link to="/signin" title="Sign in to bookmark"
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted ${className}`}>
        <Heart className="h-4 w-4" />
      </Link>
    );
  }

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    if (saved) {
      await supabase.from("bookmarks").delete().eq("topic_slug", topicSlug);
      setSaved(false);
    } else {
      await supabase.from("bookmarks").insert({ user_id: user.id, topic_slug: topicSlug });
      setSaved(true);
    }
    setBusy(false);
  };

  return (
    <button onClick={toggle} disabled={busy} aria-label={saved ? "Remove bookmark" : "Save bookmark"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${saved ? "bg-coral/10 text-coral" : "text-muted-foreground hover:bg-muted"} ${className}`}>
      <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
