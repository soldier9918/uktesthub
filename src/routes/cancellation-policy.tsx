import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IndependentDisclaimer } from "@/components/IndependentDisclaimer";

const TITLE = "Cancellation Policy | UK Test Hub";
const DESCRIPTION =
  "How to cancel a UK Test Hub subscription, what happens to your access after cancelling, and what stays saved on your account.";
const URL = "https://www.uktesthub.com/cancellation-policy";

export const Route = createFileRoute("/cancellation-policy")({
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
  component: CancellationPolicyPage,
});

function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold">Cancellation Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 26 February 2026</p>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-display text-lg font-bold">Cancel at any time</h2>
            <p className="mt-2">
              You can cancel a subscription whenever you like. Sign in, open{" "}
              <Link to="/account" className="font-semibold text-coral hover:underline">
                My Account
              </Link>{" "}
              and choose <strong>Cancel Subscription</strong> or <strong>Manage Billing</strong>.
              No phone call or email is needed, and there is no cancellation fee.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">What happens to your access</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                Your subscription stays active until the end of the period you have already
                paid for. You keep full access, with no advertisements, until then.
              </li>
              <li>Your subscription is not renewed after that date.</li>
              <li>
                Once it ends, your account returns to Free Practice: the first three mock
                tests in every topic, with advertisements.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">Your progress is kept</h2>
            <p className="mt-2">
              Cancelling does not delete anything. Your test history, best scores, bookmarks
              and incorrect-answer review stay on your account, so everything is there if
              you subscribe again later.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">Changing plan instead</h2>
            <p className="mt-2">
              If you need a different topic rather than a cancellation, Exam Pro subscribers
              can schedule a topic change that starts at the next renewal. If you need more
              than one topic, you can upgrade to Premium All Access instead.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">Failed payments</h2>
            <p className="mt-2">
              If a renewal payment cannot be collected, we mark the subscription as past due
              while the payment is retried. If it still cannot be collected, the
              subscription ends and your account returns to Free Practice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">Refunds</h2>
            <p className="mt-2">
              Cancelling stops future payments; it does not automatically refund a payment
              already taken. Please see our{" "}
              <Link to="/refund-policy" className="font-semibold text-coral hover:underline">
                Refund Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">Deleting your account</h2>
            <p className="mt-2">
              You can ask us to delete your account and data at any time through our{" "}
              <Link to="/contact" className="font-semibold text-coral hover:underline">
                contact page
              </Link>
              . Cancel any active subscription first so no further payment is taken.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <IndependentDisclaimer />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
