import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — UK Test Hub" },
      {
        name: "description",
        content:
          "How UK Test Hub uses cookies, the categories we set, and how to change your choices using Cookie Settings.",
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
        Cookies are small text files stored on your device when you visit a website.
        They help the site work, remember your preferences and measure how it's used.
        We also use similar technologies such as <strong>localStorage</strong> to save
        your quiz progress on your device.
      </p>

      <h2>2. The cookie categories we use</h2>

      <h3>Strictly necessary cookies</h3>
      <p>
        Always on. Required for site security, login, admin protection and core
        functionality (for example, remembering your cookie choices and saving your
        quiz progress on your device). These cannot be disabled.
      </p>

      <h3>Analytics cookies</h3>
      <p>
        Optional. We use <strong>Google Analytics 4</strong> to understand how
        visitors use UK Test Hub so we can improve it. The Google Analytics script is
        only loaded if you accept analytics cookies. If you reject them, no GA script
        loads and no events are sent.
      </p>

      <h3>Advertising cookies</h3>
      <p>
        Optional. Reserved for future <strong>Google AdSense</strong> and
        personalised advertising. No advertising scripts are loaded unless you accept
        advertising cookies. There are currently no live ads on UK Test Hub.
      </p>

      <h3>Functional cookies</h3>
      <p>
        Optional. Used for preferences such as theme, saved settings and progress
        features. These help personalise your experience but are not required for the
        site to function.
      </p>

      <h2>3. Changing your choices</h2>
      <p>
        You can change your preferences any time using{" "}
        <button
          type="button"
          onClick={openSettings}
          className="font-semibold text-coral underline-offset-2 hover:underline"
        >
          Cookie Settings
        </button>{" "}
        in the footer. You can also block or delete cookies in your browser settings,
        though disabling strictly necessary cookies may affect site functionality
        (for example, your quiz progress will not be saved).
      </p>

      <h3>Doing this in your browser</h3>
      <ul>
        <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data.</li>
        <li><strong>Safari:</strong> Settings → Privacy → Manage Website Data.</li>
        <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data.</li>
        <li><strong>Edge:</strong> Settings → Cookies and site permissions.</li>
      </ul>

      <h2>4. Third-party cookies</h2>
      <p>
        Some optional cookies are set by third parties (Google Analytics, and in
        future Google AdSense). These providers have their own privacy policies,
        which we encourage you to read.
      </p>

      <h2>5. Updates to this policy</h2>
      <p>
        We may update this policy from time to time. The "Last updated" date above
        reflects the most recent revision.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about cookies on UK Test Hub? Email{" "}
        <a href="mailto:support@uktesthub.com">support@uktesthub.com</a>. For
        information about the personal data we hold, see our{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </PageLayout>
  );
}
