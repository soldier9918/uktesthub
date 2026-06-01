import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";

export const Route = createFileRoute("/admin-kb20/")({
  head: () => ({ meta: [{ title: "Admin — UK Test Hub" }, { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" }] }),
  component: () => (
    <AdminGate>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the question bank, mocks, reports, ads, SEO, and analytics.
        </p>

        <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Content
        </h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <Tile to="/admin-kb20/categories" title="Categories & Questions"
            desc="Browse every category, expand to see sub-topics with question counts, types and image stats." />
          <Tile to="/admin-kb20/mocks" title="Mock Test Manager"
            desc="Browse all topics and 45 mocks per topic. Disable or enable individual mocks." />
          <Tile to="/admin-kb20/validator" title="Question Bank Validator"
            desc="Find duplicates, missing explanations, broken correct answers, missing images. Click any finding to jump to the question." />
          <Tile to="/admin-kb20/blank-options-health" title="Blank Options Health"
            desc="Scan every dropdown / drag-drop blank question across all topics for malformed options (JSON-key or template leaks). Preview and commit repairs." />
          <Tile to="/admin-kb20/search" title="Search Questions"
            desc="Find every question containing a word or phrase. Filter by category and topic, click to reveal answers." />
          <Tile to="/admin-kb20/similar" title="Similar Questions"
            desc="Find duplicate or near-duplicate questions and regenerate any of them as a brand-new unique question with AI." />
          <Tile to="/admin-kb20/category-check" title="Category Check"
            desc="Flag AI-regenerated questions containing off-topic terms (e.g. cars/car parks in non-driving topics) for review." />
          <Tile to="/admin-kb20/reports" title="Reported Questions"
            desc="Review user-reported issues, mark fixed, jump to the question editor." />
          <Tile to="/admin-kb20/questions" title="Edit questions & images"
            desc="Reword any question, change correct answers, upload replacement images." />
          <Tile to="/admin-kb20/bulk-edit" title="Bulk find & replace"
            desc="Run find-and-replace across an entire topic, or strip non-Latin / control characters in one click." />
          <Tile to="/admin-kb20/csv-import" title="CSV Import → GitHub"
            desc="Upload a CSV, preview changes, and commit directly to GitHub main. The static JSON files are the source of truth. Includes rollback." />
          <Tile to="/admin-kb20/csv-export" title="Bulk CSV Export"
            desc="Download every topic's CSV in one ZIP, by category, or as a single combined file. Round-trips through CSV Import." />
          <Tile to="/admin-kb20/import-export" title="Import / Export (legacy)"
            desc="Export topic JSON or download a validation report. (Legacy override-based import — use CSV Import instead.)" />
          <Tile to="/admin-kb20/images" title="Image Asset Manager"
            desc="Upload images, see orphans, copy URLs, and delete unused files." />
        </div>

        <h2 className="mt-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Growth & monetisation
        </h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <Tile to="/admin-kb20/seo" title="SEO Manager"
            desc="Override per-page title, description, OG image. Configure sitewide defaults." />
          <Tile to="/admin-kb20/analytics" title="Analytics Dashboard"
            desc="Page views, quiz starts and completions, top pages and drop-off rates." />
          <Tile to="/admin-kb20/ga-analytics" title="GA4 Analytics (Live)"
            desc="Live realtime active users, pageviews, 24h and 30d trends pulled directly from Google Analytics 4." />
          <Tile to="/admin-kb20/ads" title="AdSense Manager"
            desc="Toggle ad slots, set AdSense slot IDs, hide ads sitewide for review mode." />
        </div>

        <h2 className="mt-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Operations
        </h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <Tile to="/admin-kb20/system" title="System Health"
            desc="Build version, route probes, sitemap status and recent worker errors." />
          <Tile to="/admin-kb20/diagnostics" title="Diagnostics"
            desc="Bank stats, missing images and orphan assets." />
          <Tile to="/admin-kb20/users" title="Users"
            desc="Everyone who's signed up — email, attempts, role." />
          <Tile to="/admin-kb20/security" title="Security Settings"
            desc="Admin email allowlist and the activity log." />
        </div>
      </main>
    </AdminGate>
  ),
});

function Tile({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-border bg-card p-5 hover:border-coral/40 hover:shadow-soft"
    >
      <div className="font-semibold">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </Link>
  );
}
