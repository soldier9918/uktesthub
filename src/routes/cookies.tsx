import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — UK Test Hub" },
      {
        name: "description",
        content:
          "How UK Test Hub uses cookies and similar technologies. Manage your cookie preferences.",
      },
      { property: "og:title", content: "Cookie Policy — UK Test Hub" },
      {
        property: "og:description",
        content: "Details on the cookies we use and how to control them.",
      },
    ],
  links: [{ rel: "canonical", href: "https://www.uktesthub.com/cookies" }],
  }),
  component: CookiePage,
});

function CookiePage() {
  return (
    <PageLayout
      title="Cookie Policy"
      intro="Last updated: April 2026. This page explains the cookies and similar technologies used on UK Test Hub, and how to control them."
    >
      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help the site remember your preferences and measure
        how it's used. We also use similar technologies such as local
        storage to save your quiz progress on your device.
      </p>

      <h2>2. Cookies we use</h2>

      <h3>Strictly necessary</h3>
      <p>
        These keep the site working — for example remembering your cookie
        preferences and your quiz progress. They cannot be disabled.
      </p>

      <h3>Analytics</h3>
      <p>
        We use Google Analytics to understand how visitors use UK Test Hub
        so we can improve it. Analytics cookies are only set with your
        consent and the data we receive is aggregated.
      </p>

      <h3>Advertising</h3>
      <p>
        We use Google AdSense to show advertisements that help fund the
        site. With your consent, these cookies may personalise the ads you
        see based on your interests.
      </p>

      <h2>3. Managing cookies</h2>
      <p>
        You can change your cookie preferences at any time using the cookie
        banner on the site. You can also block or delete cookies in your
        browser settings, though disabling strictly necessary cookies may
        affect site functionality (for example, your quiz progress will not
        be saved).
      </p>

      <h3>Doing this in your browser</h3>
      <ul>
        <li>
          <strong>Chrome:</strong> Settings → Privacy and security → Cookies
          and other site data.
        </li>
        <li>
          <strong>Safari:</strong> Settings → Privacy → Manage Website Data.
        </li>
        <li>
          <strong>Firefox:</strong> Settings → Privacy & Security → Cookies
          and Site Data.
        </li>
        <li>
          <strong>Edge:</strong> Settings → Cookies and site permissions.
        </li>
      </ul>

      <h2>4. Third-party cookies</h2>
      <p>
        Some cookies are set by third parties (Google Analytics, Google
        AdSense). These providers have their own privacy policies, which we
        encourage you to read.
      </p>

      <h2>5. Updates to this policy</h2>
      <p>
        We may update this policy from time to time. The "Last updated"
        date above reflects the most recent revision.
      </p>

      <h2>6. More information</h2>
      <p>
        Visit{" "}
        <a href="https://ico.org.uk/your-data-matters/online/cookies/" target="_blank" rel="noopener">
          ico.org.uk
        </a>{" "}
        for independent guidance on cookies in the UK. For details on what
        personal data we hold, see our <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </PageLayout>
  );
}
