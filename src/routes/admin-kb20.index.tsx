import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";

export const Route = createFileRoute("/admin-kb20/")({
  head: () => ({ meta: [{ title: "Admin — UK Test Hub" }] }),
  component: () => (
    <AdminGate>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage questions, images, and run diagnostics.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/admin-kb20/diagnostics"
            className="rounded-xl border border-border bg-card p-5 hover:border-coral/40 hover:shadow-soft"
          >
            <div className="font-semibold">Diagnostics panel</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Bank stats, missing images, orphan assets, recent runtime logs.
            </p>
          </Link>
          <Link
            to="/admin-kb20/questions"
            className="rounded-xl border border-border bg-card p-5 hover:border-coral/40 hover:shadow-soft"
          >
            <div className="font-semibold">Edit questions & images</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Reword any question, change correct answers, upload replacement images.
            </p>
          </Link>
        </div>
      </main>
    </AdminGate>
  ),
});
