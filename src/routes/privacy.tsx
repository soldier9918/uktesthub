import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — UK Test Hub" },
      {
        name: "description",
        content:
          "How UK Test Hub collects, uses and protects your personal data in line with UK GDPR and the Data Protection Act 2018.",
      },
      { property: "og:title", content: "Privacy Policy — UK Test Hub" },
      {
        property: "og:description",
        content: "Our commitment to your privacy under UK GDPR.",
      },
    ],
  links: [{ rel: "canonical", href: "https://www.uktesthub.com/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageLayout
      title="Privacy Policy"
      intro="Last updated: April 2026. This policy explains how UK Test Hub handles your personal data."
    >
      <h2>1. Who we are</h2>
      <p>
        UK Test Hub ("we", "us", "our") operates this website. We are the data
        controller for personal data collected through this site. Contact:{" "}
        <a href="mailto:support@uktesthub.com">support@uktesthub.com</a>.
      </p>

      <h2>2. What data we collect</h2>
      <ul>
        <li>
          <strong>Usage data</strong> — pages visited, quizzes attempted,
          device type, browser, approximate location (city/country) via your IP.
        </li>
        <li>
          <strong>Contact data</strong> — name and email address if you
          message us or submit feedback.
        </li>
        <li>
          <strong>Cookies</strong> — see our <a href="/cookies">Cookie Policy</a>.
        </li>
      </ul>

      <h2>3. How we use your data</h2>
      <ul>
        <li>To operate and improve the website and quizzes</li>
        <li>To respond to your enquiries</li>
        <li>To show relevant advertising (where consent is given)</li>
        <li>To detect and prevent abuse or fraud</li>
      </ul>

      <h2>4. Legal basis</h2>
      <p>
        We process data under UK GDPR on the basis of your consent (cookies,
        marketing), legitimate interests (analytics, security) and to perform a
        contract (responding to enquiries).
      </p>

      <h2>5. Sharing your data</h2>
      <p>
        We share limited data with trusted service providers including Google
        Analytics, Google AdSense and our hosting provider. We never sell your
        personal data.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We retain enquiry emails for up to 24 months. Anonymised analytics data
        may be retained for longer.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Under UK GDPR you have the right to access, correct, delete, restrict
        or object to processing of your personal data, and to data portability.
        Contact us to exercise any right. You may also complain to the
        Information Commissioner's Office (ICO) at{" "}
        <a href="https://ico.org.uk" target="_blank" rel="noopener">ico.org.uk</a>.
      </p>

      <h2>8. International transfers</h2>
      <p>
        Some providers may process data outside the UK. We rely on UK
        Adequacy Regulations or Standard Contractual Clauses where applicable.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The "Last updated" date
        above will reflect any changes.
      </p>
    </PageLayout>
  );
}
