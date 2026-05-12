import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";
import { categories } from "@/data/categories";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap — UK Test Hub" },
      {
        name: "description",
        content:
          "Browse every page on UK Test Hub — categories, practice tests, support and legal pages.",
      },
      { property: "og:title", content: "UK Test Hub Sitemap" },
      {
        property: "og:description",
        content: "All pages and test categories on UK Test Hub.",
      },
    ],
  links: [{ rel: "canonical", href: "https://www.uktesthub.com/sitemap" }],
  }),
  component: SitemapPage,
});

function SitemapPage() {
  return (
    <PageLayout title="Sitemap" intro="Every page on UK Test Hub, in one place.">
      <h2>Test categories</h2>
      <ul>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link to="/category/$slug" params={{ slug: c.slug }}>
              {c.title}
            </Link>
          </li>
        ))}
      </ul>

      <h2>Company</h2>
      <ul>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/faq">FAQ</Link></li>
        <li><Link to="/sitemap">Sitemap</Link></li>
      </ul>

      <h2>Support</h2>
      <ul>
        <li><Link to="/help">Help Centre</Link></li>
        <li><Link to="/exam-updates">Exam Updates</Link></li>
      </ul>

      <h2>Legal</h2>
      <ul>
        <li><Link to="/privacy">Privacy Policy</Link></li>
        <li><Link to="/cookies">Cookie Policy</Link></li>
        <li><Link to="/terms">Terms and Conditions</Link></li>
        <li><Link to="/disclaimer">Disclaimer</Link></li>
        <li><Link to="/accessibility">Accessibility Statement</Link></li>
      </ul>
    </PageLayout>
  );
}
