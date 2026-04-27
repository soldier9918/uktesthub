import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility Statement — UK Test Hub" },
      {
        name: "description",
        content:
          "How UK Test Hub works to make our exam practice platform accessible to everyone, in line with WCAG 2.2 AA guidelines.",
      },
      { property: "og:title", content: "Accessibility Statement — UK Test Hub" },
      {
        property: "og:description",
        content: "Our commitment to building an accessible exam practice platform.",
      },
    ],
  }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  return (
    <PageLayout
      title="Accessibility Statement"
      intro="We're committed to making UK Test Hub usable by as many people as possible, including those with disabilities."
    >
      <h2>Our approach</h2>
      <p>
        UK Test Hub is built to meet the{" "}
        <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener">
          Web Content Accessibility Guidelines (WCAG) 2.2 at AA level
        </a>
        . We design with semantic HTML, sufficient colour contrast, keyboard
        navigation and screen-reader support in mind.
      </p>

      <h2>Features that help</h2>
      <ul>
        <li>Responsive layouts that work on any screen size</li>
        <li>Keyboard navigation across all quizzes and pages</li>
        <li>High-contrast text and large, legible typography</li>
        <li>Descriptive link text and clear page structure</li>
        <li>Alternative text on meaningful images</li>
      </ul>

      <h2>Known issues</h2>
      <p>
        Some legacy quiz images may lack detailed alt text. We're working to
        replace these and welcome feedback on any barriers you encounter.
      </p>

      <h2>Reporting accessibility problems</h2>
      <p>
        If you experience any accessibility issues, please email{" "}
        <a href="mailto:accessibility@uktesthub.co.uk">
          accessibility@uktesthub.co.uk
        </a>
        . We aim to respond within 5 working days.
      </p>

      <h2>Enforcement</h2>
      <p>
        If you're unhappy with our response, you can contact the Equality
        Advisory and Support Service (EASS) at{" "}
        <a href="https://www.equalityadvisoryservice.com" target="_blank" rel="noopener">
          equalityadvisoryservice.com
        </a>
        .
      </p>
    </PageLayout>
  );
}
