import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IndependentDisclaimer } from "@/components/IndependentDisclaimer";
import { Button } from "@/components/ui/button";
import { TopicPicker } from "@/components/subscription/TopicPicker";
import { useCheckout } from "@/lib/subscription/use-checkout";
import { useEntitlement } from "@/lib/subscription/use-entitlement";
import {
  EXAM_PRO_FEATURES,
  FREE_FEATURES,
  PREMIUM_FEATURES,
  planLabel,
} from "@/lib/subscription/plans";
import { topicTitle } from "@/lib/subscription/topics";

const TITLE = "Pricing — Practice Plans | UK Test Hub";
const DESCRIPTION =
  "Compare UK Test Hub practice plans: free mock tests in every topic, Exam Pro for one topic at £14.99 a month, or Premium All Access for everything from £16.67 a month billed annually.";
const URL = "https://www.uktesthub.com/pricing";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: PricingPage,
});

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm text-foreground/90">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [topicSlug, setTopicSlug] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const { start, busyPlan, error } = useCheckout();
  const { entitlement } = useEntitlement();

  const premiumPlan = annual ? "premium_annual" : "premium_monthly";
  // Paying customers never see a checkout button: plan changes must happen on the
  // subscription they already have, so a second one can't be created.
  const paid = entitlement.isPaid;
  const currentPlan = entitlement.plan;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <header className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Choose Your Practice Plan
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Start free with the first three mock tests in every topic. Upgrade when you
            want the full question bank, ad-free practice and progress saved across your
            devices.
          </p>
        </header>

        {entitlement.isPaid && (
          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-coral/30 bg-coral/5 px-4 py-3 text-center text-sm">
            You are subscribed to <strong>{planLabel(entitlement.plan)}</strong>
            {entitlement.topicSlug ? <> for {topicTitle(entitlement.topicSlug)}</> : null}.{" "}
            <Link to="/account" className="font-bold text-coral hover:underline">
              Manage your plan
            </Link>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-sm font-semibold ${annual ? "text-muted-foreground" : "text-foreground"}`}>
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            aria-label="Switch between monthly and annual billing"
            onClick={() => setAnnual((v) => !v)}
            className={`relative h-7 w-14 rounded-full border border-border transition-colors ${annual ? "bg-coral" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all ${annual ? "left-8" : "left-1"}`}
            />
          </button>
          <span className={`text-sm font-semibold ${annual ? "text-foreground" : "text-muted-foreground"}`}>
            Annual <span className="text-coral">Save 33%</span>
          </span>
        </div>

        {error && (
          <p className="mx-auto mt-6 max-w-xl rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Free Practice */}
          <section className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold">Free Practice</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try every topic before you decide.
            </p>
            <p className="mt-4 font-display text-4xl font-bold">£0</p>
            <p className="text-xs text-muted-foreground">No card required</p>
            <FeatureList items={FREE_FEATURES} />
            <div className="mt-auto pt-6">
              {paid ? (
                <Button className="w-full" variant="outline" disabled>
                  Included in your plan
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/all-tests">Start practising free</Link>
                </Button>
              )}
            </div>
          </section>

          {/* Exam Pro */}
          <section className="relative flex flex-col rounded-2xl border-2 border-coral bg-card p-6 shadow-elevated">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-coral px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Most Popular
            </span>
            <h2 className="font-display text-xl font-bold">Exam Pro</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Everything for the one exam you are sitting.
            </p>
            <p className="mt-4 font-display text-4xl font-bold">
              £14.99 <span className="text-base font-semibold text-muted-foreground">/ month</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Renews monthly until cancelled. Cancel anytime.
            </p>
            <FeatureList items={EXAM_PRO_FEATURES} />
            <div className="mt-auto space-y-3 pt-6">
              {paid ? (
                currentPlan === "exam_pro" ? (
                  <>
                    <Button className="w-full" disabled>
                      Current plan
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      This is the plan you are subscribed to. Change your topic or upgrade from your{" "}
                      <Link to="/account" className="font-semibold text-coral hover:underline">
                        account page
                      </Link>
                      .
                    </p>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/account">Manage your plan</Link>
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      You are on {planLabel(currentPlan)}, which already includes every topic. Any plan
                      change is made on your existing subscription from your account page.
                    </p>
                  </>
                )
              ) : (
                <>
                  {showPicker && <TopicPicker value={topicSlug} onChange={setTopicSlug} />}
                  <Button
                    className="w-full bg-coral text-white hover:bg-coral/90"
                    disabled={busyPlan === "exam_pro"}
                    onClick={() => {
                      if (!showPicker || !topicSlug) {
                        setShowPicker(true);
                        return;
                      }
                      void start("exam_pro", topicSlug);
                    }}
                  >
                    {busyPlan === "exam_pro"
                      ? "Opening secure checkout…"
                      : showPicker && topicSlug
                        ? `Subscribe — ${topicTitle(topicSlug)}`
                        : "Choose your topic"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Your chosen topic stays fixed for the billing period. You can schedule a
                    change that starts at your next renewal.
                  </p>
                </>
              )}
            </div>
          </section>

          {/* Premium All Access */}
          <section className="relative flex flex-col rounded-2xl border border-border bg-card p-6">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-xs font-bold uppercase tracking-wide text-background">
              Best Value
            </span>
            <h2 className="font-display text-xl font-bold">Premium All Access</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every test topic on the site, with no adverts.
            </p>
            {annual ? (
              <>
                <p className="mt-4 font-display text-4xl font-bold">
                  £199.99 <span className="text-base font-semibold text-muted-foreground">/ year</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Works out at £16.67 a month. Renews annually until cancelled.
                </p>
              </>
            ) : (
              <>
                <p className="mt-4 font-display text-4xl font-bold">
                  £24.99 <span className="text-base font-semibold text-muted-foreground">/ month</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Renews monthly until cancelled. Cancel anytime.
                </p>
              </>
            )}
            <FeatureList items={PREMIUM_FEATURES} />
            <div className="mt-auto pt-6">
              {paid ? (
                currentPlan === premiumPlan ? (
                  <>
                    <Button className="w-full" disabled>
                      Current plan
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      This is the plan you are subscribed to.{" "}
                      <Link to="/account" className="font-semibold text-coral hover:underline">
                        Manage it on your account page
                      </Link>
                      .
                    </p>
                  </>
                ) : currentPlan === "premium_monthly" && annual ? (
                  <>
                    <Button asChild className="w-full bg-coral text-white hover:bg-coral/90">
                      <Link to="/account" search={{ change: "premium_annual" } as never}>
                        Switch to annual
                      </Link>
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Your existing subscription moves to annual billing. You will see the credit for
                      your unused time, the amount due today and your new renewal date before anything
                      is charged.
                    </p>
                  </>
                ) : currentPlan === "exam_pro" ? (
                  <>
                    <Button asChild className="w-full bg-coral text-white hover:bg-coral/90">
                      <Link to="/account">Upgrade to Premium</Link>
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Your existing subscription is switched over on your account page — you only pay
                      the difference for the rest of your current period.
                    </p>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/account">Manage your plan</Link>
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Plan changes are made on the subscription you already have, so you are never
                      charged for two.
                    </p>
                  </>
                )
              ) : (
                <Button
                  className="w-full"
                  disabled={busyPlan === premiumPlan}
                  onClick={() => void start(premiumPlan)}
                >
                  {busyPlan === premiumPlan
                    ? "Opening secure checkout…"
                    : annual
                      ? "Subscribe annually"
                      : "Subscribe monthly"}
                </Button>
              )}
            </div>
          </section>
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-coral" />
          Payments are processed securely by Stripe. We never see or store your card details.
        </p>

        {/* Comparison */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Compare the plans</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-bold">Feature</th>
                  <th className="px-4 py-3 font-bold">Free Practice</th>
                  <th className="px-4 py-3 font-bold">Exam Pro</th>
                  <th className="px-4 py-3 font-bold">Premium All Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["First 3 mock tests in every topic", "Yes", "Yes", "Yes"],
                  ["All mock tests in one chosen topic", "No", "Yes", "Yes"],
                  ["All mock tests in every topic", "No", "No", "Yes"],
                  ["Answer explanations", "Yes", "Yes", "Yes"],
                  ["Timed exam mode", "Yes", "Yes", "Yes"],
                  ["Advert-free", "No", "Yes", "Yes"],
                  ["Progress saved across devices", "No", "Yes", "Yes"],
                  ["Test history and best scores", "On this device", "Yes", "Yes"],
                  ["Review incorrect answers", "Limited", "Yes", "Yes"],
                  ["Bookmark questions", "No", "Yes", "Yes"],
                  ["Price", "£0", "£14.99 / month", "£24.99 / month or £199.99 / year"],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-3 font-semibold">{row[0]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row[1]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row[2]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Subscription questions</h2>
          <div className="mt-4 space-y-4">
            {[
              [
                "Do I need an account to practise?",
                "No. The first three mock tests in every topic are open to everyone. You only need an account to subscribe, and to keep your progress across devices.",
              ],
              [
                "Can I change my Exam Pro topic?",
                "Yes. Your topic stays fixed for the billing period you have paid for, and you can schedule a different topic to start at your next renewal from your account page.",
              ],
              [
                "How do I cancel?",
                "Cancel at any time from Manage Billing in your account. Your access continues until the end of the period you have already paid for, then your account returns to Free Practice with your progress intact.",
              ],
              [
                "Will my progress disappear if I stop subscribing?",
                "No. Your test history, best scores and bookmarks stay on your account.",
              ],
              [
                "Is there a free trial?",
                "There is no free trial, and no one-off passes. The free tier is permanent, so you can try three full mock tests in any topic before subscribing.",
              ],
            ].map(([q, a]) => (
              <details key={q} className="rounded-xl border border-border bg-card p-4">
                <summary className="cursor-pointer font-display font-bold">{q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <Link to="/subscription-terms" className="inline-flex items-center gap-1.5 hover:text-coral">
            <Lock className="h-3.5 w-3.5" /> Subscription Terms
          </Link>
          <Link to="/cancellation-policy" className="hover:text-coral">
            Cancellation Policy
          </Link>
          <Link to="/refund-policy" className="hover:text-coral">
            Refund Policy
          </Link>
        </div>

        <div className="mt-8">
          <IndependentDisclaimer />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
