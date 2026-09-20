import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IndependentDisclaimer } from "@/components/IndependentDisclaimer";

const TITLE = "Refund Policy | UK Test Hub";
const DESCRIPTION =
  "When UK Test Hub issues refunds on practice subscriptions, your 14-day cancellation rights, and how to request a refund.";
const URL = "https://www.uktesthub.com/refund-policy";

export const Route = createFileRoute("/refund-policy")({
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
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold">Refund Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 26 February 2026</p>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-display text-lg font-bold">Try before you pay</h2>
            <p className="mt-2">
              The first three mock tests in every topic are free and always available, so you
              can see exactly what our practice material is like before subscribing.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">Your 14-day right to cancel</h2>
            <p className="mt-2">
              Under UK consumer law you normally have 14 days to change your mind about a
              digital service. Because access begins immediately when you subscribe, you
              agree to the service starting straight away. If you contact us within 14 days
              of a payment and have made only limited use of the paid material, we will
              refund that payment in full.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">After 14 days</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                Monthly plans: we do not refund part-used months. Cancel before your next
                renewal to avoid the following payment.
              </li>
              <li>
                Annual plans: if you cancel within 14 days we refund in full. After that, we
                may refund the remaining unused full months at our discretion.
              </li>
              <li>
                Duplicate or accidental payments are always refunded in full.
              </li>
              <li>
                Technical faults: if a fault on our side prevented you from using your plan
                and we could not fix it, we will refund the affected period.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">Exam results</h2>
            <p className="mt-2">
              We are an independent practice website. Our material is for revision and
              practice only, and we cannot guarantee any exam result, pass, job or licence.
              Refunds are not issued on the basis of an exam result.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">How to request a refund</h2>
            <p className="mt-2">
              Contact us through our{" "}
              <Link to="/contact" className="font-semibold text-coral hover:underline">
                contact page
              </Link>{" "}
              using the email address on your account, and tell us the date of the payment
              and the reason for your request. We aim to reply within 3 working days.
              Approved refunds are returned by Stripe to your original payment method,
              usually within 5 to 10 working days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">Related pages</h2>
            <p className="mt-2">
              <Link to="/subscription-terms" className="font-semibold text-coral hover:underline">
                Subscription Terms
              </Link>{" "}
              ·{" "}
              <Link to="/cancellation-policy" className="font-semibold text-coral hover:underline">
                Cancellation Policy
              </Link>{" "}
              ·{" "}
              <Link to="/privacy" className="font-semibold text-coral hover:underline">
                Privacy Policy
              </Link>
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
