import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useEntitlement } from "@/lib/subscription/use-entitlement";
import { FREE_MOCKS_PER_TOPIC } from "@/lib/subscription/plans";
import { topicTitle } from "@/lib/subscription/topics";
import { trackEvent } from "@/lib/analytics";

/**
 * Shown under a results screen to free users: the next mock test in this topic
 * is part of the paid question bank.
 */
export function ResultsUpgradeCard({ topicSlug }: { topicSlug: string }) {
  const { entitlement, loading } = useEntitlement();

  useEffect(() => {
    if (loading || entitlement.isPaid) return;
    void trackEvent({
      event_type: "upgrade_prompt_view",
      topic_slug: topicSlug,
      metadata: { source: "results" },
    });
  }, [loading, entitlement.isPaid, topicSlug]);

  if (loading || entitlement.isPaid) return null;
  const title = topicTitle(topicSlug) || "this topic";

  return (
    <div className="mt-8 rounded-2xl border border-coral/30 bg-coral/5 p-5">
      <div className="flex items-center gap-2.5">
        <Lock className="h-5 w-5 text-coral" />
        <h3 className="font-display text-base font-bold">Keep going with all 45 mock tests</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        You have free access to mock tests 1 to {FREE_MOCKS_PER_TOPIC} in {title}. Unlock the full
        question bank, remove advertisements and review every question you got wrong.
      </p>
      <Link
        to="/pricing"
        onClick={() =>
          void trackEvent({
            event_type: "upgrade_prompt_click",
            topic_slug: topicSlug,
            metadata: { source: "results" },
          })
        }
        className="mt-4 inline-block rounded-lg bg-coral px-4 py-2 text-sm font-semibold text-white hover:bg-coral/90"
      >
        View plans from £14.99 a month
      </Link>
    </div>
  );
}
