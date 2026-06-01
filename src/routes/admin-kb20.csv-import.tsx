import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminGate } from "@/components/AdminGate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/categories";
import {
  previewCsvImport,
  commitCsvImport,
  rollbackImport,
  listImportHistory,
} from "@/lib/admin/csv-import.functions";

export const Route = createFileRoute("/admin-kb20/csv-import")({
  head: () => ({
    meta: [
      { title: "CSV Import — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <CsvImportPage />
    </AdminGate>
  ),
});

type PreviewResult = Awaited<ReturnType<typeof previewCsvImport>>;

function CsvImportPage() {
  const allTopics = useMemo(
    () =>
      categories
        .flatMap((c) => c.topics.map((t) => ({ slug: t.slug, title: t.title, cat: c.title })))
        .sort((a, b) => a.slug.localeCompare(b.slug)),
    [],
  );
  const [topic, setTopic] = useState(allTopics[0]?.slug ?? "");
  const [filename, setFilename] = useState<string>("");
  const [csvText, setCsvText] = useState<string>("");
  const [mode, setMode] = useState<"patch" | "replace">("patch");
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [commitResult, setCommitResult] = useState<{
    commitUrl: string;
    commitSha: string;
    postCommitWarning?: string | null;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const previewFn = useServerFn(previewCsvImport);
  const commitFn = useServerFn(commitCsvImport);
  const rollbackFn = useServerFn(rollbackImport);
  const listFn = useServerFn(listImportHistory);
  const qc = useQueryClient();

  const previewMutation = useMutation({
    mutationFn: () => previewFn({ data: { topic, csvText, mode } }),
    onSuccess: (data) => {
      setPreview(data);
      setErrorMsg(null);
      setCommitResult(null);
    },
    onError: (e: Error) => setErrorMsg(e.message),
  });

  const commitMutation = useMutation({
    mutationFn: () => commitFn({
      data: {
        topic,
        csvText,
        filename: filename || "upload.csv",
        mode: ((preview as { mode?: "patch" | "replace" } | null)?.mode ?? mode),
        expectedSha: (preview as { existingSha?: string } | null)?.existingSha,
      },
    }),
    onSuccess: (data) => {
      setCommitResult({
        commitUrl: data.commitUrl,
        commitSha: data.commitSha,
        postCommitWarning: data.postCommitWarning ?? null,
      });
      setErrorMsg(null);
      setPreview(null);
      setCsvText("");
      setFilename("");
      qc.invalidateQueries({ queryKey: ["import-history"] });
    },
    onError: (e: Error) => setErrorMsg(e.message),
  });

  const rollbackMutation = useMutation({
    mutationFn: (historyId: string) => rollbackFn({ data: { historyId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["import-history"] }),
    onError: (e: Error) => setErrorMsg(e.message),
  });

  const history = useQuery({
    queryKey: ["import-history"],
    queryFn: () => listFn({ data: { limit: 50 } }),
  });

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFilename(f.name);
    setCsvText(await f.text());
    setPreview(null);
    setCommitResult(null);
    setErrorMsg(null);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">CSV Import → GitHub</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Uploads commit directly to <code>main</code> on <code>soldier9918/uktesthub</code>. The
        static <code>public/mocks/&lt;topic&gt;.json</code> file becomes the source of truth.
      </p>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">1. Pick topic + upload CSV</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setPreview(null);
            }}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            {allTopics.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.cat} — {t.title} ({t.slug})
              </option>
            ))}
          </select>
          <input type="file" accept=".csv,text/csv" onChange={onFile} className="text-sm" />
          <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Mode</span>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value as "patch" | "replace");
                setPreview(null);
              }}
              className="bg-transparent text-sm"
            >
              <option value="patch">Patch (blanks ignored)</option>
              <option value="replace">Full replacement (blanks clear fields)</option>
            </select>
          </label>
          <Button
            onClick={() => previewMutation.mutate()}
            disabled={!csvText || previewMutation.isPending}
          >
            {previewMutation.isPending ? "Previewing…" : "Preview changes"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Expected columns:{" "}
          <code>id, type, question, options (|-separated), correctAnswer, correctAnswers, explanation, image, imageAlt</code>
        </p>
      </section>

      {errorMsg && (
        <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}

      {commitResult && (
        <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
          Committed:{" "}
          <a
            href={commitResult.commitUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono underline"
          >
            {commitResult.commitSha.slice(0, 7)}
          </a>{" "}
          — auto-deploy will pick this up in ~1–2 minutes.
          {commitResult.postCommitWarning && (
            <div className="mt-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-amber-800">
              ⚠ {commitResult.postCommitWarning}
            </div>
          )}
        </div>
      )}

      {preview && (
        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          {(() => {
            const blocked = (preview.validation?.errors.length ?? 0) > 0;
            return (
          <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">2. Preview</h2>
            <Button
              onClick={() => commitMutation.mutate()}
              disabled={commitMutation.isPending || blocked}
              title={blocked ? "Fix validation errors before committing." : undefined}
            >
              {commitMutation.isPending ? "Committing…" : blocked ? "Blocked by errors" : "Commit to GitHub"}
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Badge variant="secondary">Mode: {preview.mode ?? mode}</Badge>
            <Badge variant="secondary">Branch: {preview.branch ?? "main"}</Badge>
            <Badge variant="secondary">File: {preview.filePath}</Badge>
            <Badge variant="secondary">CSV rows: {preview.rowCount}</Badge>
            <Badge variant="secondary">Existing: {preview.oldBankSize}</Badge>
            <Badge variant="secondary">After: {preview.newBankSize}</Badge>
            <Badge variant="secondary">Mocks: {preview.oldMockCount} → {preview.newMockCount}</Badge>
            <Badge
              className={
                preview.unusedQuestionCount === 0
                  ? "bg-emerald-500/20 text-emerald-700"
                  : "bg-amber-500/20 text-amber-700"
              }
            >
              Unused: {preview.unusedQuestionCount}
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-700">Added: {preview.diff.addedCount}</Badge>
            <Badge className="bg-amber-500/20 text-amber-700">Changed: {preview.diff.changedCount}</Badge>
            <Badge className="bg-rose-500/20 text-rose-700">Removed: {preview.diff.removedCount}</Badge>
          </div>

          {preview.validation && preview.validation.errors.length > 0 && (
            <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs">
              <div className="mb-1 font-semibold text-destructive">
                {preview.validation.errors.length} blocking issue{preview.validation.errors.length === 1 ? "" : "s"} — fix before commit:
              </div>
              <ul className="max-h-40 space-y-0.5 overflow-auto">
                {preview.validation.errors.slice(0, 40).map((e, i) => (
                  <li key={i}>• {e.id ? `[${e.id}] ` : ""}{e.message}</li>
                ))}
                {preview.validation.errors.length > 40 && (
                  <li>… and {preview.validation.errors.length - 40} more</li>
                )}
              </ul>
            </div>
          )}

          {preview.parseErrors.length > 0 && (
            <ul className="mt-3 max-h-32 space-y-1 overflow-auto rounded-lg bg-muted/40 p-3 text-xs">
              {preview.parseErrors.map((e, i) => (
                <li key={i} className="text-amber-700">{e}</li>
              ))}
            </ul>
          )}

          {preview.diff.changed.length > 0 && (
            <details className="mt-4" open>
              <summary className="cursor-pointer font-semibold">
                Changed ({preview.diff.changedCount})
              </summary>
              <div className="mt-2 space-y-3 text-xs">
                {preview.diff.changed.map((c) => (
                  <div key={c.id} className="rounded-lg border border-border p-3">
                    <div className="mb-2 font-mono text-xs text-muted-foreground">{c.id}</div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <div className="mb-1 text-xs font-semibold text-rose-700">Before</div>
                        <pre className="overflow-auto rounded bg-muted/40 p-2">
                          {JSON.stringify(c.before, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-semibold text-emerald-700">After</div>
                        <pre className="overflow-auto rounded bg-muted/40 p-2">
                          {JSON.stringify(c.after, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}

          {preview.diff.added.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">
                Added ({preview.diff.addedCount})
              </summary>
              <pre className="mt-2 max-h-80 overflow-auto rounded bg-muted/40 p-3 text-xs">
                {JSON.stringify(preview.diff.added, null, 2)}
              </pre>
            </details>
          )}
          </>
            );
          })()}
        </section>
      )}

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Import history</h2>
        {history.isLoading && <p className="mt-2 text-sm text-muted-foreground">Loading…</p>}
        {history.data && history.data.rows.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">No imports yet.</p>
        )}
        {history.data && history.data.rows.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-2 pr-3">When</th>
                  <th className="py-2 pr-3">Topic</th>
                  <th className="py-2 pr-3">File</th>
                  <th className="py-2 pr-3">Rows</th>
                  <th className="py-2 pr-3">Commit</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3"></th>
                </tr>
              </thead>
              <tbody>
                {history.data.rows.map((r) => (
                  <tr key={r.id} className="border-t border-border align-top">
                    <td className="py-2 pr-3 text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs">{r.topic}</td>
                    <td className="py-2 pr-3 text-xs">{r.filename ?? "—"}</td>
                    <td className="py-2 pr-3 text-xs">{r.row_count ?? "—"}</td>
                    <td className="py-2 pr-3">
                      {r.commit_url ? (
                        <a
                          href={r.commit_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs underline"
                        >
                          {String(r.commit_sha ?? "").slice(0, 7)}
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <Badge
                        variant="secondary"
                        className={
                          r.status === "committed"
                            ? "bg-emerald-500/20 text-emerald-700"
                            : r.status === "failed"
                              ? "bg-rose-500/20 text-rose-700"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="py-2 pr-3">
                      {r.status === "committed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={rollbackMutation.isPending}
                          onClick={() => {
                            if (confirm(`Roll back ${r.topic} to the state before this import?`)) {
                              rollbackMutation.mutate(r.id);
                            }
                          }}
                        >
                          Rollback
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
