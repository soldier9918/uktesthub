import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { IndependentDisclaimer } from "@/components/IndependentDisclaimer";
import { useAuth } from "@/lib/auth-context";
import { useEntitlement } from "@/lib/subscription/use-entitlement";
import { topicTitle } from "@/lib/subscription/topics";
import { trackEvent } from "@/lib/analytics";
import { FREE_MOCKS_PER_TOPIC } from "@/lib/subscription/plans";

/** Shown instead of the questions when a mock test is not included in the visitor's plan. */
export function LockedMockScreen({
  topicSlug,
  mockNumber,
}: {
  topicSlug: string;
  mockNumber: number;
}) {
  const { user } = useAuth();
  const { entitlement } = useEntitlement();
  const title = topicTitle(topicSlug) || "this topic";
  const wrongTopic = entitlement.isPaid && !entitlement.allTopics;

  useEffect(() => {
    void trackEvent({
      event_type: "upgrade_prompt_view",
      topic_slug: topicSlug,
      metadata: { source: "locked_test_page", mock: mockNumber },
    });
  }, [topicSlug, mockNumber]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link
          to="/topic/$slug"
          params={{ slug: topicSlug }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-coral hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all {title} mock tests
        </Link>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/10">
            <Lock className="h-6 w-6 text-coral" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold md:text-3xl">
            {title} — Mock Test {mockNumber}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            {wrongTopic ? (
              <>
                Your Exam Pro plan covers {topicTitle(entitlement.topicSlug)}. Upgrade to
                Premium All Access to practise every topic, or schedule a topic change from
                your account so {title} starts at your next renewal.
              </>
            ) : (
              <>
                Mock tests 1 to {FREE_MOCKS_PER_TOPIC} in {title} are free for everyone. This
                one is part of the full question bank, included with Exam Pro and Premium All
                Access.
              </>
            )}
          </p>

          <ul className="mt-5 space-y-2 text-sm">
            {[
              `All 45 ${title} mock tests`,
              "No advertisements",
              "Progress and best scores saved across your devices",
              "Review and retry every question you got wrong",
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-coral text-white hover:bg-coral/90"
              onClick={() =>
                void trackEvent({
                  event_type: "upgrade_prompt_click",
                  topic_slug: topicSlug,
                  metadata: { source: "locked_test_page", mock: mockNumber },
                })
              }
            >
              <Link to="/pricing">View plans from £14.99 a month</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/topic/$slug" params={{ slug: topicSlug }}>
                Try a free mock test
              </Link>
            </Button>
            {!user && (
              <Button asChild variant="ghost">
                <Link to="/signin">Sign in</Link>
              </Button>
            )}
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            Cancel anytime. Access continues to the end of the period you have paid for — see
            our{" "}
            <Link to="/cancellation-policy" className="underline hover:text-coral">
              cancellation policy
            </Link>
            .
          </p>
        </div>

        <IndependentDisclaimer />
      </main>
      <SiteFooter />
    </div>
  );
}
