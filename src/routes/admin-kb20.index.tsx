import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";

export const Route = createFileRoute("/admin-kb20/")({
  head: () => ({ meta: [{ title: "Admin — UK Test Hub" }, { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" }] }),
  component: () => (
    <AdminGate>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the question bank, mocks, reports, and system health.
        </p>

        <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Phase 1
        </h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <Tile to="/admin-kb20/mocks" title="Mock Test Manager"
            desc="Browse all topics and 45 mocks per topic. Disable or enable individual mocks." />
          <Tile to="/admin-kb20/validator" title="Question Bank Validator"
            desc="Find duplicates, missing explanations, broken correct answers, missing images." />
          <Tile to="/admin-kb20/reports" title="Reported Questions"
            desc="Review user-reported issues, mark fixed, jump to the question editor." />
          <Tile to="/admin-kb20/import-export" title="Import / Export"
            desc="Export topic JSON or download a validation report. Upload bank files to apply overrides." />
          <Tile to="/admin-kb20/system" title="System Health"
            desc="Build version, route probes, sitemap status and recent worker errors." />
          <Tile to="/admin-kb20/diagnostics" title="Diagnostics"
            desc="Bank stats, missing images and orphan assets." />
          <Tile to="/admin-kb20/questions" title="Edit questions & images"
            desc="Reword any question, change correct answers, upload replacement images." />
          <Tile to="/admin-kb20/users" title="Users"
            desc="Everyone who's signed up — email, attempts, role." />
        </div>

        <h2 className="mt-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Phase 2 (planned)
        </h2>
        <ul className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
          <li>· Image Asset Manager (uploads, orphan cleanup)</li>
          <li>· SEO Manager (per-page meta, FAQ schema, sitemap rules)</li>
          <li>· Blog Manager (drafts, featured, internal links)</li>
          <li>· Analytics Dashboard (pageviews, quiz starts, drop-off)</li>
          <li>· User Progress Dashboard (pass/fail, last active)</li>
          <li>· AdSense Manager (slot toggles, preview without ads)</li>
          <li>· Security Settings (allowlist, activity logs)</li>
        </ul>
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
