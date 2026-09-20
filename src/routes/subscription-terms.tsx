import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IndependentDisclaimer } from "@/components/IndependentDisclaimer";

const TITLE = "Subscription Terms | UK Test Hub";
const DESCRIPTION =
  "The terms that apply to UK Test Hub practice subscriptions: what each plan includes, billing and renewal, cancellation, and how your access works.";
const URL = "https://www.uktesthub.com/subscription-terms";

export const Route = createFileRoute("/subscription-terms")({
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
  component: SubscriptionTermsPage,
});

function SubscriptionTermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold">Subscription Terms</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 26 February 2026</p>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-display text-lg font-bold">1. What we provide</h2>
            <p className="mt-2">
              UK Test Hub provides independent practice material: mock tests, practice
              questions, answer explanations and revision guides. We are an independent
              practice website and are not affiliated with, endorsed by or connected to any
              government body, awarding organisation, examining board or official test
              provider. Our material is for practice and revision only. We do not provide
              official tests, certificates or qualifications, and we do not guarantee any
              exam result, pass, job, licence or other outcome.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">2. Plans</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                <strong>Free Practice (£0)</strong> — the first three mock tests in every
                test topic, with advertisements. No account or payment is required.
              </li>
              <li>
                <strong>Exam Pro (£14.99 per month)</strong> — unlimited access to every
                mock test within one test topic you select, plus the first three free mock
                tests in all other topics, with no advertisements.
              </li>
              <li>
                <strong>Premium All Access (£24.99 per month, or £199.99 per year)</strong> —
                unlimited access to every mock test in every topic, with no advertisements.
              </li>
            </ul>
            <p className="mt-2">
              We may add, improve or retire individual practice material at any time as
              official guidance changes. Paid plans include material added during your
              subscription.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">3. Accounts</h2>
            <p className="mt-2">
              You need a UK Test Hub account to subscribe. You are responsible for keeping
              your login details secure and for activity under your account. Subscriptions
              are for one person’s personal use. Sharing an account, or downloading or
              redistributing our material, is not permitted.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">4. Billing and renewal</h2>
            <p className="mt-2">
              Payments are processed by Stripe. Prices include VAT where applicable. Monthly
              plans renew every month and annual plans renew every year, automatically, on
              the same payment method, until you cancel. Access is granted once your payment
              is confirmed by our payment provider.
            </p>
            <p className="mt-2">
              If a payment fails, your subscription is marked as past due while the payment
              is retried. If it cannot be collected, your subscription ends and your account
              returns to Free Practice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">5. Exam Pro topic selection</h2>
            <p className="mt-2">
              You choose your topic when you subscribe. That topic stays fixed for the
              billing period you have paid for. You may schedule a different topic from your
              account page, and it takes effect at your next renewal. Choosing a new topic
              does not extend access to your previous topic.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">6. Cancellation</h2>
            <p className="mt-2">
              You can cancel at any time from Manage Billing in your account. Your access
              continues until the end of the period you have already paid for, and it is not
              renewed after that. See our{" "}
              <Link to="/cancellation-policy" className="font-semibold text-coral hover:underline">
                Cancellation Policy
              </Link>{" "}
              and{" "}
              <Link to="/refund-policy" className="font-semibold text-coral hover:underline">
                Refund Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">7. Price changes</h2>
            <p className="mt-2">
              If we change the price of a plan, we will tell you by email before the change
              applies to your renewal, so you can cancel if you prefer not to continue.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">8. Acceptable use</h2>
            <p className="mt-2">
              We may suspend or end a subscription that is used to copy, scrape, resell or
              publish our material, or where an account is shared. Where we end a
              subscription for this reason, we may refund any unused full billing period at
              our discretion.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">9. Contact and your rights</h2>
            <p className="mt-2">
              Questions about your subscription? Use our{" "}
              <Link to="/contact" className="font-semibold text-coral hover:underline">
                contact page
              </Link>
              . Nothing in these terms affects your statutory rights as a consumer in the
              United Kingdom. How we handle your data is set out in our{" "}
              <Link to="/privacy" className="font-semibold text-coral hover:underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/cookies" className="font-semibold text-coral hover:underline">
                Cookie Policy
              </Link>
              .
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
