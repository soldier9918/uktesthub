import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — UK Test Hub" },
      {
        name: "description",
        content:
          "How UK Test Hub uses cookies, including Google Analytics and Google AdSense, the categories we set, and how to change your choices.",
      },
      { property: "og:title", content: "Cookie Policy — UK Test Hub" },
      {
        property: "og:description",
        content: "Details on the cookies we use and how to control them.",
      }, { property: "og:url", content: "https://www.uktesthub.com/cookies" }
    ],
    links: [{ rel: "canonical", href: "https://www.uktesthub.com/cookies" }],
  }),
  component: CookiePage,
});

function openSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("uktesthub:open-cookie-settings"));
  }
}

function CookiePage() {
  return (
    <PageLayout
      title="Cookie Policy"
      intro="Last updated: May 2026. This page explains the cookies UK Test Hub uses, the categories you can choose, and how to update your preferences at any time."
    >
      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help the site work, remember your preferences and measure
        how it's used. We also use similar technologies such as{" "}
        <strong>localStorage</strong> to save your quiz progress on your device.
      </p>

      <h2>2. How UK Test Hub uses cookies</h2>
      <p>
        We use cookies to keep the site secure, remember your cookie choices,
        save your quiz progress, understand how visitors use the site, and — if
        you give consent — to display relevant advertising. No optional
        analytics or advertising cookies are loaded until you accept them.
      </p>

      <h2>3. Necessary cookies</h2>
      <p>
        Always on. Required for site security, login, admin protection and
        core functionality (for example, remembering your cookie choices and
        saving your quiz progress). These cannot be disabled.
      </p>

      <h2>4. Analytics cookies</h2>
      <p>
        Optional. Help us understand how visitors use UK Test Hub so we can
        improve it. Loaded only after you accept analytics cookies.
      </p>

      <h2>5. Advertising cookies</h2>
      <p>
        Optional. Used by Google AdSense and certified third-party ad vendors
        to deliver and measure ads. Loaded only after you accept advertising
        cookies.
      </p>

      <h2>6. Google Analytics</h2>
      <p>
        We use <strong>Google Analytics 4</strong> to measure traffic and
        improve the site. The GA script is only loaded if you accept analytics
        cookies. If you reject them, no GA script loads and no events are sent.
      </p>

      <h2>7. Google AdSense</h2>
      <p>
        UK Test Hub may use <strong>Google AdSense</strong> to display adverts.
        Google and certified third-party vendors may use cookies, web beacons
        and similar technologies to:
      </p>
      <ul>
        <li>
          Serve <strong>personalised ads</strong> based on your previous visits
          to this website or other websites — only where you have given
          advertising consent.
        </li>
        <li>
          Serve <strong>non-personalised ads</strong> based on the page content
          and approximate location. These may still use a limited set of
          cookies or identifiers for fraud prevention, frequency capping and
          aggregated reporting.
        </li>
        <li>Measure ad performance and prevent invalid traffic.</li>
      </ul>
      <p>
        See{" "}
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">
          How Google uses advertising cookies
        </a>
        . You can manage personalised ads across Google services at{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener">
          adssettings.google.com
        </a>
        .
      </p>

      <h2>8. Managing cookie preferences</h2>
      <p>
        You can change your preferences any time using{" "}
        <button
          type="button"
          onClick={openSettings}
          className="font-semibold text-coral underline-offset-2 hover:underline"
        >
          Cookie Settings
        </button>{" "}
        in the footer.
      </p>

      <h2>9. Browser controls</h2>
      <p>
        You can also block or delete cookies directly in your browser, though
        disabling strictly necessary cookies may affect site functionality
        (for example, your quiz progress will not be saved).
      </p>
      <ul>
        <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data.</li>
        <li><strong>Safari:</strong> Settings → Privacy → Manage Website Data.</li>
        <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data.</li>
        <li><strong>Edge:</strong> Settings → Cookies and site permissions.</li>
      </ul>

      <h2>10. Contact</h2>
      <p>
        Questions about cookies on UK Test Hub? Email{" "}
        <a href="mailto:support@uktesthub.com">support@uktesthub.com</a>. For
        information about the personal data we hold, see our{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </PageLayout>
  );
}
