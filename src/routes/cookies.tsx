import { createFileRoute } from "@tanstack/react-router";
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
  }),
  component: CookiePage,
});

function CookiePage() {
  return (
    <PageLayout
      title="Cookie Policy"
      intro="Last updated: April 2026. This page explains the cookies and similar technologies used on UK Test Hub."
    >
      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help the site remember your preferences and measure how
        it's used.
      </p>

      <h2>Cookies we use</h2>
      <h3>Strictly necessary</h3>
      <p>
        These keep the site working — for example remembering your cookie
        preferences. They cannot be disabled.
      </p>
      <h3>Analytics</h3>
      <p>
        We use Google Analytics to understand how visitors use UK Test Hub so
        we can improve it. These cookies are only set with your consent.
      </p>
      <h3>Advertising</h3>
      <p>
        We use Google AdSense to show advertisements that help fund the site.
        With your consent, these cookies may personalise the ads you see.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can change your cookie preferences at any time using the cookie
        banner. You can also block or delete cookies in your browser settings,
        though this may affect site functionality.
      </p>

      <h2>More information</h2>
      <p>
        Visit{" "}
        <a href="https://ico.org.uk/your-data-matters/online/cookies/" target="_blank" rel="noopener">
          ico.org.uk
        </a>{" "}
        for independent guidance on cookies in the UK.
      </p>
    </PageLayout>
  );
}
