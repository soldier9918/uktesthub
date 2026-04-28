import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — UK Test Hub" },
      {
        name: "description",
        content:
          "The terms and conditions that govern your use of UK Test Hub, an independent UK exam practice platform.",
      },
      { property: "og:title", content: "Terms and Conditions — UK Test Hub" },
      {
        property: "og:description",
        content: "Terms governing your use of UK Test Hub.",
      },
    ],
  links: [{ rel: "canonical", href: "https://www.uktesthub.com/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageLayout
      title="Terms and Conditions"
      intro="Last updated: April 2026. By using UK Test Hub you agree to these terms. Please read them carefully."
    >
      <h2>1. Acceptance of terms</h2>
      <p>
        These Terms and Conditions ("Terms") form a legal agreement between
        you and UK Test Hub ("we", "us", "our"). By accessing or using the
        UK Test Hub website you agree to be bound by these Terms and our{" "}
        <Link to="/privacy">Privacy Policy</Link>. If you do not agree,
        please do not use the site.
      </p>

      <h2>2. Eligibility & accounts</h2>
      <p>
        UK Test Hub does not require an account to use most features. Where
        a feature does require registration, you confirm that the
        information you provide is accurate and that you are at least 13
        years old (or have parental consent).
      </p>

      <h2>3. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the site for any unlawful purpose or in breach of UK law.</li>
        <li>Attempt to scrape, copy or republish our content at scale.</li>
        <li>Bypass, disable or interfere with security features.</li>
        <li>Upload malware or otherwise damage the site or its users.</li>
        <li>Misrepresent UK Test Hub as the official exam provider.</li>
      </ul>

      <h2>4. Intellectual property</h2>
      <p>
        All content on UK Test Hub — questions, explanations, design,
        graphics, code and branding — is owned by UK Test Hub or licensed
        to us. You may use the site for personal, non-commercial revision.
        You may not redistribute, sell or otherwise commercially exploit
        our content without prior written permission.
      </p>

      <h2>5. User-generated content</h2>
      <p>
        If you submit feedback, question reports or other content, you
        grant us a non-exclusive, worldwide, royalty-free licence to use it
        to operate and improve the service. You confirm you have the right
        to share what you submit.
      </p>

      <h2>6. Third-party content & links</h2>
      <p>
        UK Test Hub may link to third-party websites (for example, official
        exam booking pages). We are not responsible for the content,
        accuracy or availability of those sites.
      </p>

      <h2>7. Advertising</h2>
      <p>
        The site is supported by advertising. We may display adverts from
        third-party networks such as Google AdSense. We are not responsible
        for the content of adverts shown on our pages.
      </p>

      <h2>8. Disclaimers & warranties</h2>
      <p>
        UK Test Hub is provided on an "as is" and "as available" basis. We
        make no warranties — express or implied — about completeness,
        accuracy, reliability or fitness for a particular purpose. Our
        practice tests are designed to help you prepare; we cannot
        guarantee a pass in any official examination. Always consult the
        official provider for the current syllabus.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, UK Test Hub will not be
        liable for any indirect, incidental, special or consequential
        losses arising from your use of the site, including (but not
        limited to) loss of data, exam outcomes, profits or opportunity.
        Nothing in these Terms limits liability for death, personal injury
        caused by negligence, or fraud.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        You agree to indemnify and hold UK Test Hub harmless from any
        claims, losses or damages arising from your breach of these Terms
        or your misuse of the site.
      </p>

      <h2>11. Changes to the service</h2>
      <p>
        We may add, change or remove features, content or topics at any
        time. The site may occasionally be unavailable for maintenance or
        for reasons beyond our control.
      </p>

      <h2>12. Changes to these terms</h2>
      <p>
        We may update these Terms from time to time. The "Last updated"
        date at the top of this page reflects the most recent revision.
        Continued use of the site after changes means you accept the
        revised Terms.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws of England and Wales. Any
        dispute will be subject to the exclusive jurisdiction of the
        courts of England and Wales.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these Terms? <Link to="/contact">Contact us</Link>{" "}
        and we'll get back to you.
      </p>
    </PageLayout>
  );
}
