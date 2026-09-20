import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useEntitlement } from "@/lib/subscription/use-entitlement";
import { trackEvent } from "@/lib/analytics";
import { topicTitle } from "@/lib/subscription/topics";

type Props = {
  open: boolean;
  onClose: () => void;
  topicSlug?: string | null;
  mockNumber?: number | null;
  /** Where the prompt appeared, used for analytics only. */
  source: "locked_test" | "after_free_mock" | "results" | "dashboard";
};

/** Upgrade prompt shown on locked tests, after free mocks and on results. */
export function UpgradeModal({ open, onClose, topicSlug, mockNumber, source }: Props) {
  const { user } = useAuth();
  const { entitlement } = useEntitlement();

  useEffect(() => {
    if (!open) return;
    void trackEvent({
      event_type: "upgrade_prompt_view",
      topic_slug: topicSlug ?? null,
      metadata: { source, mock: mockNumber ?? null },
    });
  }, [open, source, topicSlug, mockNumber]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const wrongTopic = entitlement.isPaid && !entitlement.allTopics;
  const heading = wrongTopic
    ? "This test is in a different topic"
    : mockNumber
      ? `Mock Test ${mockNumber} is part of the full question bank`
      : "Unlock the full question bank";

  const body = wrongTopic
    ? `Your Exam Pro plan covers ${topicTitle(entitlement.topicSlug)}. Upgrade to Premium All Access to practise every topic on the site, or schedule a topic change for your next renewal.`
    : `The first three mock tests in every topic are free. Subscribe to open all 45 mock tests${
        topicSlug ? ` in ${topicTitle(topicSlug)}` : ""
      }, remove adverts and save your progress across devices.`;

  const onUpgradeClick = () => {
    void trackEvent({
      event_type: "upgrade_prompt_click",
      topic_slug: topicSlug ?? null,
      metadata: { source, mock: mockNumber ?? null },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade your plan"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-coral/10">
          <Lock className="h-5 w-5 text-coral" />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold">{heading}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>

        <ul className="mt-4 space-y-2">
          {[
            "All 45 mock tests per topic",
            "No advertisements",
            "Progress, best scores and bookmarks saved to your account",
            "Review and retry every question you got wrong",
          ].map((item) => (
            <li key={item} className="flex gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="bg-coral text-white hover:bg-coral/90" onClick={onUpgradeClick}>
            <Link to="/pricing">{wrongTopic ? "See Premium All Access" : "View plans"}</Link>
          </Button>
          {!user && (
            <Button asChild variant="outline">
              <Link to="/signin">Sign in</Link>
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Not now
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Free practice always includes the first three mock tests in every topic. Cancel a
          subscription anytime — see our{" "}
          <Link to="/cancellation-policy" className="underline hover:text-coral">
            cancellation policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
