import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { useEntitlement } from "@/lib/subscription/use-entitlement";
import { PLAN_PRICES, planLabel } from "@/lib/subscription/plans";
import { topicTitle } from "@/lib/subscription/topics";
import { trackEvent } from "@/lib/analytics";
import { trackGAEvent } from "@/lib/analytics-ga";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [
      { title: "Subscription confirmed — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Your UK Test Hub subscription is confirmed and your practice material is unlocked.",
      },
      { property: "og:title", content: "Subscription confirmed — UK Test Hub" },
      { property: "og:description", content: "Your UK Test Hub subscription is confirmed." },
      { property: "og:url", content: "https://www.uktesthub.com/checkout/success" },
    ],
    links: [{ rel: "canonical", href: "https://www.uktesthub.com/checkout/success" }],
  }),
  component: CheckoutSuccessPage,
});

/**
 * Confirmation screen only. Access is granted by the verified payment webhook —
 * this page simply waits for the confirmed subscription to appear.
 */
function CheckoutSuccessPage() {
  const { entitlement, loading, refresh } = useEntitlement();
  const [waited, setWaited] = useState(0);
  const conversionSent = useRef(false);

  useEffect(() => {
    if (entitlement.isPaid || waited > 12) return;
    const t = window.setTimeout(() => {
      setWaited((n) => n + 1);
      void refresh();
    }, 2500);
    return () => window.clearTimeout(t);
  }, [entitlement.isPaid, refresh, waited]);

  // Conversion is reported only once the payment is confirmed on our side.
  useEffect(() => {
    if (!entitlement.isPaid || conversionSent.current) return;
    if (entitlement.plan === "free") return;
    conversionSent.current = true;
    const value = PLAN_PRICES[entitlement.plan];
    trackGAEvent("purchase", {
      currency: "GBP",
      value,
      items: [{ item_id: entitlement.plan, item_name: planLabel(entitlement.plan), price: value }],
    });
    void trackEvent({
      event_type: "purchase",
      path: "/checkout/success",
      metadata: { plan: entitlement.plan, value, currency: "GBP" },
    });
  }, [entitlement.isPaid, entitlement.plan]);

  const pending = !entitlement.isPaid;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        {pending ? (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-coral" />
            <h1 className="mt-5 font-display text-2xl font-bold">
              Confirming your payment…
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {waited > 12
                ? "This is taking longer than usual. Your payment may still be processing — refresh this page in a moment, or check your account page."
                : "This usually takes just a few seconds. Please keep this page open."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline">
                <Link to="/account">Go to my account</Link>
              </Button>
              {loading ? null : (
                <Button onClick={() => void refresh()}>Check again</Button>
              )}
            </div>
          </>
        ) : (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-coral" />
            <h1 className="mt-5 font-display text-3xl font-bold">You’re all set</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your <strong>{planLabel(entitlement.plan)}</strong> subscription is active
              {entitlement.topicSlug ? <> for {topicTitle(entitlement.topicSlug)}</> : null}. All
              your mock tests are unlocked and adverts are switched off.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-coral text-white hover:bg-coral/90">
                <Link
                  to={entitlement.topicSlug ? "/topic/$slug" : "/all-tests"}
                  params={entitlement.topicSlug ? { slug: entitlement.topicSlug } : undefined}
                >
                  Start practising
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard">View my dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/account">Manage my plan</Link>
              </Button>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
