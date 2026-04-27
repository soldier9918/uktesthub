import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — UK Test Hub" },
      {
        name: "description",
        content:
          "The terms and conditions governing your use of UK Test Hub, including acceptable use, intellectual property and liability.",
      },
      { property: "og:title", content: "Terms and Conditions — UK Test Hub" },
      {
        property: "og:description",
        content: "The terms that apply when you use UK Test Hub.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageLayout
      title="Terms and Conditions"
      intro="Last updated: April 2026. By using UK Test Hub you agree to these terms."
    >
      <h2>1. About these terms</h2>
      <p>
        These terms govern your use of the UK Test Hub website. If you do not
        agree, please do not use the site.
      </p>

      <h2>2. Use of the service</h2>
      <p>
        You may use UK Test Hub for personal, non-commercial exam practice. You
        agree not to misuse the service, attempt to gain unauthorised access,
        scrape content at scale, or interfere with its operation.
      </p>

      <h2>3. Educational purpose only</h2>
      <p>
        Our content is provided for study and practice purposes. It is not a
        substitute for official exam materials or professional advice. See our{" "}
        <a href="/disclaimer">Disclaimer</a>.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        All content on this site — text, design, code and graphics — is owned
        by UK Test Hub or our licensors and is protected by copyright. You may
        not republish or redistribute content without written permission.
      </p>

      <h2>5. User submissions</h2>
      <p>
        If you submit feedback, reports or suggestions, you grant us a
        worldwide, royalty-free licence to use them to improve the service.
      </p>

      <h2>6. Advertising</h2>
      <p>
        UK Test Hub displays third-party advertising. We are not responsible
        for the content of external advertisements or linked sites.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, UK Test Hub is not liable for
        any indirect or consequential loss arising from your use of the
        service. Nothing in these terms excludes liability that cannot lawfully
        be excluded under English law.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the site
        constitutes acceptance of the updated terms.
      </p>

      <h2>9. Governing law</h2>
      <p>
        These terms are governed by the laws of England and Wales. The courts
        of England and Wales have exclusive jurisdiction.
      </p>
    </PageLayout>
  );
}
