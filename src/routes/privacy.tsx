import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — UK Test Hub" },
      {
        name: "description",
        content:
          "How UK Test Hub collects, uses and protects your personal data in line with UK GDPR and the Data Protection Act 2018, including Google Analytics and Google AdSense.",
      },
      { property: "og:title", content: "Privacy Policy — UK Test Hub" },
      {
        property: "og:description",
        content: "Our commitment to your privacy under UK GDPR.",
      },
    ,
      { property: "og:url", content: "https://www.uktesthub.com/privacy" }
    ],
    links: [{ rel: "canonical", href: "https://www.uktesthub.com/privacy" }],
  }),
  component: PrivacyPage,
});

function openSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("uktesthub:open-cookie-settings"));
  }
}

function PrivacyPage() {
  return (
    <PageLayout
      title="Privacy Policy"
      intro="Last updated: May 2026. This policy explains how UK Test Hub handles your personal data, including how we use Google Analytics and Google AdSense."
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
          <strong>Contact data</strong> — name and email address if you message
          us or submit feedback.
        </li>
        <li>
          <strong>Cookies and similar technologies</strong> — see our{" "}
          <Link to="/cookies">Cookie Policy</Link>.
        </li>
      </ul>

      <h2>3. How we use your data</h2>
      <ul>
        <li>To operate and improve the website and quizzes</li>
        <li>To respond to your enquiries</li>
        <li>To measure traffic and improve content (analytics)</li>
        <li>To show advertising where consent is given</li>
        <li>To detect and prevent abuse or fraud</li>
      </ul>

      <h2>4. Legal basis</h2>
      <p>
        We process data under UK GDPR on the basis of your consent (cookies,
        advertising), legitimate interests (security, fraud prevention) and to
        perform a contract (responding to enquiries).
      </p>

      <h2>5. Sharing your data</h2>
      <p>
        We share limited data with trusted service providers including Google
        Analytics, Google AdSense and our hosting provider. We never sell your
        personal data.
      </p>

      <h2>6. Advertising and Google AdSense</h2>
      <p>
        UK Test Hub may use <strong>Google AdSense</strong> to display adverts
        on the website. Third-party vendors, including Google, may use cookies,
        web beacons or similar technologies to serve adverts based on a user's
        previous visits to this website or other websites.
      </p>
      <p>
        Google's use of advertising cookies enables Google and its partners to
        serve ads to UK Test Hub users based on their visits to our site and/or
        other sites on the internet.
      </p>
      <h3>Personalised and non-personalised ads</h3>
      <p>
        Where you have given consent for advertising cookies, you may see{" "}
        <strong>personalised ads</strong> based on your interests. If you do
        not consent, you may still see <strong>non-personalised ads</strong>,
        which are based only on the page content and your approximate location.
        Non-personalised ads may still use a limited set of cookies or
        identifiers for fraud prevention, frequency capping and aggregated
        reporting.
      </p>
      <h3>Third-party ad vendors</h3>
      <p>
        Google and its certified third-party advertising partners may collect
        and process data as described in{" "}
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">
          Google's Advertising Policies
        </a>{" "}
        and{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
          Privacy Policy
        </a>
        .
      </p>
      <h3>Managing your choices</h3>
      <p>
        You can accept, reject or change your cookie choices at any time using{" "}
        <button
          type="button"
          onClick={openSettings}
          className="font-semibold text-coral underline-offset-2 hover:underline"
        >
          Cookie Settings
        </button>{" "}
        in the footer, or via your browser settings. See our{" "}
        <Link to="/cookies">Cookie Policy</Link> for full details.
      </p>

      <h2>7. Cookies and consent</h2>
      <p>
        Google Analytics only runs if you accept analytics cookies, and Google
        AdSense advertising cookies only run if you accept advertising cookies.
        No third-party analytics or advertising scripts load before you make a
        choice. You can change your preferences at any time using{" "}
        <button
          type="button"
          onClick={openSettings}
          className="font-semibold text-coral underline-offset-2 hover:underline"
        >
          Cookie Settings
        </button>{" "}
        in the footer.
      </p>

      <h2>8. Data retention</h2>
      <p>
        We retain enquiry emails for up to 24 months. Anonymised analytics data
        may be retained for longer. Advertising data retention follows Google's
        published retention windows for AdSense.
      </p>

      <h2>9. Your rights</h2>
      <p>
        Under UK GDPR you have the right to access, correct, delete, restrict
        or object to processing of your personal data, and to data portability.
        Contact us to exercise any right. You may also complain to the
        Information Commissioner's Office (ICO) at{" "}
        <a href="https://ico.org.uk" target="_blank" rel="noopener">ico.org.uk</a>.
      </p>

      <h2>10. International transfers</h2>
      <p>
        Some providers (including Google) may process data outside the UK. We
        rely on UK Adequacy Regulations or Standard Contractual Clauses where
        applicable.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The "Last updated" date
        above will reflect any changes.
      </p>
    </PageLayout>
  );
}
