import { useMemo, useState } from "react";
import JSZip from "jszip";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/categories";
import { loadTopicFileForAdmin } from "@/data/mocks";
import {
  buildTopicCsv,
  buildCombinedCsv,
  downloadBlob,
  type AnyTopicFile,
} from "@/lib/admin/csv-export";

export const Route = createFileRoute("/admin-kb20/csv-export")({
  head: () => ({
    meta: [
      { title: "Bulk CSV Export — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <BulkCsvExportPage />
    </AdminGate>
  ),
});

type LoadError = { category: string; topic: string; error: string };

function stamp() {
  return new Date().toISOString().slice(0, 10);
}

function BulkCsvExportPage() {
  const allCategories = useMemo(() => categories.map((c) => ({ slug: c.slug, title: c.title, topics: c.topics })), []);
  const [categorySlug, setCategorySlug] = useState<string>(allCategories[0]?.slug ?? "");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<LoadError[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function loadAll(
    scope: { category: string; title: string; topics: { slug: string; title: string }[] }[],
  ): Promise<{ ok: { category: string; topic: string; file: AnyTopicFile }[]; failed: LoadError[] }> {
    const flat = scope.flatMap((c) =>
      c.topics.map((t) => ({ category: c.category, topic: t.slug })),
    );
    setProgress({ done: 0, total: flat.length });
    const ok: { category: string; topic: string; file: AnyTopicFile }[] = [];
    const failed: LoadError[] = [];
    let done = 0;
    for (const entry of flat) {
      try {
        const file = await loadTopicFileForAdmin(entry.topic);
        if (!file) {
          failed.push({ category: entry.category, topic: entry.topic, error: "file not found" });
        } else {
          ok.push({ category: entry.category, topic: entry.topic, file: file as AnyTopicFile });
        }
      } catch (e) {
        failed.push({ category: entry.category, topic: entry.topic, error: (e as Error).message });
      }
      done++;
      setProgress({ done, total: flat.length });
    }
    return { ok, failed };
  }

  function scopeFor(mode: "all" | "category") {
    if (mode === "all") {
      return allCategories.map((c) => ({ category: c.slug, title: c.title, topics: c.topics }));
    }
    const c = allCategories.find((x) => x.slug === categorySlug);
    return c ? [{ category: c.slug, title: c.title, topics: c.topics }] : [];
  }

  async function exportZip(mode: "all" | "category") {
    setBusy(true);
    setErrors([]);
    setMessage(null);
    try {
      const scope = scopeFor(mode);
      const { ok, failed } = await loadAll(scope);
      const zip = new JSZip();
      const manifest: string[] = ["category,topic,slug,question_count,filename"];
      for (const e of ok) {
        const { csv, count } = buildTopicCsv(e.file);
        const filename = `${e.category}/${e.topic}.csv`;
        zip.file(filename, csv);
        manifest.push(`"${e.category}","${e.topic}","${e.topic}",${count},"${filename}"`);
      }
      zip.file("MANIFEST.csv", manifest.join("\n"));
      const blob = await zip.generateAsync({ type: "blob" });
      const name =
        mode === "all"
          ? `uktesthub-csv-export-${stamp()}.zip`
          : `uktesthub-${categorySlug}-csv-${stamp()}.zip`;
      downloadBlob(name, blob);
      setErrors(failed);
      setMessage(`Exported ${ok.length} topic CSVs${failed.length ? ` (${failed.length} failed)` : ""}.`);
    } catch (e) {
      setMessage(`Export failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  async function exportCombined() {
    setBusy(true);
    setErrors([]);
    setMessage(null);
    try {
      const scope = scopeFor("all");
      const { ok, failed } = await loadAll(scope);
      const { csv, count } = buildCombinedCsv(ok);
      const blob = new Blob([csv], { type: "text/csv" });
      downloadBlob(`uktesthub-all-questions-${stamp()}.csv`, blob);
      setErrors(failed);
      setMessage(`Exported ${count} questions across ${ok.length} topics${failed.length ? ` (${failed.length} failed)` : ""}.`);
    } catch (e) {
      setMessage(`Export failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  const totalTopics = allCategories.reduce((n, c) => n + c.topics.length, 0);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Bulk CSV Export</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Download every topic's question bank as CSV — round-trip-compatible with the CSV importer.
        Sources from GitHub <code>main</code> (the same source CSV import writes to).
      </p>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Export all topics</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {allCategories.length} categories · {totalTopics} topics. Produces a ZIP with one
          <code className="mx-1">&lt;category&gt;/&lt;topic&gt;.csv</code> per topic, plus a top-level
          <code className="mx-1">MANIFEST.csv</code>.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={() => exportZip("all")} disabled={busy}>
            {busy ? "Working…" : `Download all topics as ZIP (${totalTopics})`}
          </Button>
          <Button variant="outline" onClick={exportCombined} disabled={busy}>
            Download one combined CSV (all questions)
          </Button>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Export a single category</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
            disabled={busy}
          >
            {allCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title} ({c.topics.length})
              </option>
            ))}
          </select>
          <Button onClick={() => exportZip("category")} disabled={busy || !categorySlug}>
            Download category ZIP
          </Button>
        </div>
      </section>

      {progress && (
        <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3 text-sm">
          Loading topics… {progress.done} / {progress.total}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {message && (
        <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
          {message}
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
          <div className="mb-2 font-semibold">Skipped topics ({errors.length})</div>
          <ul className="max-h-60 space-y-1 overflow-auto text-xs">
            {errors.map((e, i) => (
              <li key={i} className="flex flex-wrap gap-2">
                <Badge variant="secondary">{e.category}</Badge>
                <code>{e.topic}</code>
                <span className="text-muted-foreground">— {e.error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
