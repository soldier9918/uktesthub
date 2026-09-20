import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Crown, Sparkles } from "lucide-react";
import { useEntitlement } from "@/lib/subscription/use-entitlement";
import { planLabel, FREE_MOCKS_PER_TOPIC } from "@/lib/subscription/plans";
import { topicTitle } from "@/lib/subscription/topics";
import { trackEvent } from "@/lib/analytics";

/** Dashboard banner: current plan for subscribers, upgrade prompt for everyone else. */
export function PlanBanner() {
  const { entitlement, loading } = useEntitlement();

  useEffect(() => {
    if (loading || entitlement.isPaid) return;
    void trackEvent({ event_type: "upgrade_prompt_view", metadata: { source: "dashboard" } });
  }, [loading, entitlement.isPaid]);

  if (loading) return null;

  if (entitlement.isPaid) {
    return (
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-coral/30 bg-coral/5 p-4">
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 text-coral" />
          <div>
            <p className="font-display text-sm font-bold">{planLabel(entitlement.plan)}</p>
            <p className="text-xs text-muted-foreground">
              {entitlement.allTopics
                ? "Every topic unlocked, ad-free."
                : `${entitlement.topicSlug ? topicTitle(entitlement.topicSlug) : "Your chosen topic"} fully unlocked, ad-free.`}
            </p>
          </div>
        </div>
        <Link
          to="/account"
          className="rounded-md border border-coral/40 px-3 py-2 text-sm font-semibold text-coral hover:bg-coral/10"
        >
          Manage subscription
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 p-4">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-coral" />
        <div>
          <p className="font-display text-sm font-bold">You are on Free Practice</p>
          <p className="text-xs text-muted-foreground">
            Mock tests 1 to {FREE_MOCKS_PER_TOPIC} in every topic are free. Unlock the full question
            bank and remove ads from £14.99 a month.
          </p>
        </div>
      </div>
      <Link
        to="/pricing"
        onClick={() =>
          void trackEvent({ event_type: "upgrade_prompt_click", metadata: { source: "dashboard" } })
        }
        className="rounded-md bg-coral px-3 py-2 text-sm font-semibold text-white hover:bg-coral/90"
      >
        See plans
      </Link>
    </div>
  );
}
