import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { AdminGate } from "@/components/AdminGate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { categories } from "@/data/categories";
import {
  previewMockIntrosImport,
  commitMockIntrosImport,
  rollbackMockIntrosImport,
  listMockIntrosImportHistory,
} from "@/lib/admin/mock-intros-import.functions";

export const Route = createFileRoute("/admin-kb20/mock-intros-import")({
  head: () => ({
    meta: [
      { title: "Mock Intros CSV Import — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <MockIntrosImportPage />
    </AdminGate>
  ),
});

type PreviewResult = Awaited<ReturnType<typeof previewMockIntrosImport>>;

const SAMPLE_SINGLE = `mock,difficulty,covers,common_mistakes,topics_included,who_this_mock_is_for,faq_question_1,faq_answer_1
1,Beginner,"Mock 1 covers foundation road signs and basic safe behaviour.","Rushing signs | Missing key words | Confusing sign shapes","Foundation road signs|Basic safe driving behaviour|Speed awareness|Reading road markings|First-look hazard recognition","Mock 1 suits learners starting their revision who want to build confidence with the basics.","What is Mock 1 best for?","Mock 1 is a beginner-level checkpoint focused on foundation signs and safe behaviour."
`;

const SAMPLE_MULTI = `topic_slug,mock,difficulty,covers,common_mistakes,topics_included,who_this_mock_is_for
driving-theory,4,Beginner,"Mock 4 focuses on lane discipline and parking awareness.","Misreading lane discipline | Forgetting parking checks","Lane discipline and road positioning|Parking awareness and safety checks|Essential road signs|Safe vehicle control|Early-stage learner driver decisions","Mock 4 suits early-stage learners building confidence with lane discipline."
life-in-the-uk,1,Beginner,"Life in the UK Mock 1 covers history and geography.","Mixing up monarchs | Confusing dates",,"For ILR/citizenship applicants starting their revision."
`;

function MockIntrosImportPage() {
  const allTopics = useMemo(() => {
    const bySlug = new Map<string, { slug: string; title: string; cats: string[] }>();
    for (const c of categories) {
      for (const t of c.topics) {
        const existing = bySlug.get(t.slug);
        if (existing) {
          if (!existing.cats.includes(c.title)) existing.cats.push(c.title);
        } else {
          bySlug.set(t.slug, { slug: t.slug, title: t.title, cats: [c.title] });
        }
      }
    }
    return Array.from(bySlug.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  const [topic, setTopic] = useState(allTopics[0]?.slug ?? "");
  const [topicPickerOpen, setTopicPickerOpen] = useState(false);
  const selectedTopic = allTopics.find((t) => t.slug === topic);
  const [filename, setFilename] = useState<string>("");
  const [csvText, setCsvText] = useState<string>("");
  const [mode, setMode] = useState<"patch" | "replace">("patch");
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [commitResult, setCommitResult] = useState<{
    commitUrl: string;
    commitSha: string;
    rowCount: number;
    affectedTopics: string[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const previewFn = useServerFn(previewMockIntrosImport);
  const commitFn = useServerFn(commitMockIntrosImport);
  const rollbackFn = useServerFn(rollbackMockIntrosImport);
  const listFn = useServerFn(listMockIntrosImportHistory);
  const qc = useQueryClient();

  const history = useQuery({
    queryKey: ["mock-intros-history"],
    queryFn: () => listFn({ data: { limit: 30 } }),
  });

  const previewMutation = useMutation({
    mutationFn: async () => {
      const res = await previewFn({
        data: { topicSlug: topic || undefined, csvText, mode },
      });
      return res;
    },
    onSuccess: (res) => {
      setPreview(res);
      setErrorMsg(res.error ?? null);
      setCommitResult(null);
    },
    onError: (e: Error) => {
      setErrorMsg(e.message);
      setPreview(null);
    },
  });

  const commitMutation = useMutation({
    mutationFn: async () => {
      return commitFn({
        data: {
          topicSlug: topic || undefined,
          csvText,
          filename: filename || "pasted.csv",
          expectedSha: preview?.existingSha,
          mode,
        },
      });
    },
    onSuccess: (res) => {
      setCommitResult({
        commitUrl: res.commitUrl,
        commitSha: res.commitSha,
        rowCount: res.rowCount,
        affectedTopics: res.affectedTopics,
      });
      setErrorMsg(null);
      setPreview(null);
      qc.invalidateQueries({ queryKey: ["mock-intros-history"] });
    },
    onError: (e: Error) => setErrorMsg(e.message),
  });

  const rollbackMutation = useMutation({
    mutationFn: async (vars: { historyId: string; force?: boolean }) =>
      rollbackFn({ data: vars }),
    onSuccess: () => {
      setErrorMsg(null);
      qc.invalidateQueries({ queryKey: ["mock-intros-history"] });
    },
    onError: (e: Error) => setErrorMsg(e.message),
  });

  async function onFileChosen(file: File | null) {
    if (!file) return;
    const text = await file.text();
    setFilename(file.name);
    setCsvText(text);
    setPreview(null);
    setCommitResult(null);
    setErrorMsg(null);
  }

  const hasTopicCol = /^|,\s*topic_slug\s*(,|$)/im.test(csvText.split("\n", 1)[0] ?? "");

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 text-sm text-muted-foreground">
        <Link to="/admin-kb20" className="hover:underline">← Admin</Link>
      </div>
      <h1 className="font-display text-2xl font-bold">Mock Intros CSV Import → GitHub</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload a CSV of per-mock <em>difficulty</em>, <em>“What this mock covers”</em> and{" "}
        <em>“Common mistakes”</em> for any topic. Commits to{" "}
        <code className="rounded bg-muted px-1">src/data/per-mock-intros.ts</code> on GitHub{" "}
        <code className="rounded bg-muted px-1">main</code>.
      </p>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">CSV format</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Required columns: <code>mock</code>, <code>difficulty</code>, <code>covers</code>,{" "}
          <code>common_mistakes</code>. Add a <code>topic_slug</code> column to import across
          multiple topics in one file (the dropdown below is ignored when the column is present).
          <br />
          <code>difficulty</code> = <em>Beginner</em>, <em>Intermediate</em>, or{" "}
          <em>Exam-ready</em>. <code>mock</code> = integer 1–45.{" "}
          <code>common_mistakes</code> = pipe (<code>|</code>) separated bullets.
        </p>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-medium">Show sample CSVs</summary>
          <div className="mt-2 space-y-3">
            <div>
              <div className="text-xs font-semibold text-muted-foreground">Single topic</div>
              <pre className="mt-1 overflow-x-auto rounded bg-muted p-3 text-xs">{SAMPLE_SINGLE}</pre>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground">All topics in one CSV</div>
              <pre className="mt-1 overflow-x-auto rounded bg-muted p-3 text-xs">{SAMPLE_MULTI}</pre>
            </div>
          </div>
        </details>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">1. Topic (single-topic CSVs only)</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Ignored when the CSV contains a <code>topic_slug</code> column.
        </p>
        <div className="mt-3">
          <Popover open={topicPickerOpen} onOpenChange={setTopicPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between sm:w-[420px]">
                {selectedTopic
                  ? `${selectedTopic.title} — ${selectedTopic.slug}`
                  : "Pick a topic…"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[420px] p-0">
              <Command>
                <CommandInput placeholder="Search topic…" />
                <CommandList>
                  <CommandEmpty>No topic found.</CommandEmpty>
                  <CommandGroup>
                    {allTopics.map((t) => (
                      <CommandItem
                        key={t.slug}
                        value={`${t.title} ${t.slug} ${t.cats.join(" ")}`}
                        onSelect={() => {
                          setTopic(t.slug);
                          setTopicPickerOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            topic === t.slug ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <span className="flex-1">{t.title}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {t.cats.join(", ")} · {t.slug}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">2. Upload or paste CSV</h2>
        <div className="mt-3 flex flex-col gap-3">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => onFileChosen(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <textarea
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              setPreview(null);
              setCommitResult(null);
            }}
            placeholder="…or paste CSV text here"
            className="h-48 w-full rounded-md border border-input bg-background p-3 font-mono text-xs"
          />
          {hasTopicCol && (
            <Badge variant="secondary" className="w-fit">
              topic_slug column detected — multi-topic mode
            </Badge>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="text-sm font-medium">Mode:</div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={mode === "patch"}
              onChange={() => setMode("patch")}
            />
            Patch (merge with existing rows)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={mode === "replace"}
              onChange={() => setMode("replace")}
            />
            Replace (wipe affected topics first)
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setErrorMsg(null);
              previewMutation.mutate();
            }}
            disabled={!csvText.trim() || previewMutation.isPending}
          >
            {previewMutation.isPending ? "Previewing…" : "Preview changes"}
          </Button>
          <Button
            variant="default"
            onClick={() => commitMutation.mutate()}
            disabled={
              !preview ||
              !!preview.error ||
              preview.rowCount === 0 ||
              commitMutation.isPending
            }
          >
            {commitMutation.isPending ? "Committing…" : "Commit to GitHub"}
          </Button>
        </div>
      </section>

      {errorMsg && (
        <div className="mt-4 whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}

      {preview && !preview.error && (
        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Preview</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">Rows: {preview.rowCount}</Badge>
            <Badge variant="secondary">Added: {preview.diff.addedCount}</Badge>
            <Badge variant="secondary">Changed: {preview.diff.changedCount}</Badge>
            <Badge variant="secondary">Unchanged: {preview.diff.unchangedCount}</Badge>
            <Badge variant="secondary">Mode: {preview.mode}</Badge>
            {preview.hasTopicColumn && <Badge variant="secondary">multi-topic</Badge>}
          </div>
          {preview.affectedTopics.length > 0 && (
            <div className="mt-3 text-xs text-muted-foreground">
              Affected topics: {preview.affectedTopics.join(", ")}
            </div>
          )}
          {preview.parseErrors.length > 0 && (
            <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              <div className="font-semibold">Parse / validation issues ({preview.parseErrors.length})</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {preview.parseErrors.slice(0, 50).map((e, i) => (
                  <li key={i}>
                    {e.csvLine ? <span className="font-mono">row {e.csvLine}: </span> : null}
                    {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {preview.diff.rows.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="border-b border-border text-left">
                  <tr>
                    <th className="py-2 pr-4">Topic</th>
                    <th className="py-2 pr-4">Mock</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.diff.rows.map((r, i) => (
                    <tr key={i} className="border-b border-border/40">
                      <td className="py-1.5 pr-4 font-mono">{r.topicSlug}</td>
                      <td className="py-1.5 pr-4">{r.mock}</td>
                      <td className="py-1.5 pr-4">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5",
                            r.status === "added" && "bg-emerald-500/15 text-emerald-700",
                            r.status === "changed" && "bg-amber-500/15 text-amber-700",
                            r.status === "unchanged" && "bg-muted text-muted-foreground",
                          )}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {commitResult && (
        <section className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <h2 className="font-semibold text-emerald-700">Committed ✓</h2>
          <p className="mt-1 text-sm">
            {commitResult.rowCount} row(s) across{" "}
            {commitResult.affectedTopics.join(", ") || "no topics"} pushed to{" "}
            <code className="rounded bg-background/60 px-1">main</code>.
          </p>
          <a
            href={commitResult.commitUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-medium text-emerald-700 underline"
          >
            View commit {commitResult.commitSha.slice(0, 7)} on GitHub →
          </a>
        </section>
      )}

      <section className="mt-8 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Recent imports</h2>
        {history.isLoading && <p className="mt-2 text-sm text-muted-foreground">Loading…</p>}
        {history.data?.error && (
          <p className="mt-2 text-sm text-destructive">{history.data.error}</p>
        )}
        {history.data?.rows && history.data.rows.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">No imports yet.</p>
        )}
        {history.data?.rows && history.data.rows.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="border-b border-border text-left">
                <tr>
                  <th className="py-2 pr-4">When</th>
                  <th className="py-2 pr-4">File</th>
                  <th className="py-2 pr-4">Topics</th>
                  <th className="py-2 pr-4">Rows</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Commit</th>
                  <th className="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.data.rows.map((r) => (
                  <tr key={r.id} className="border-b border-border/40 align-top">
                    <td className="py-1.5 pr-4 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="py-1.5 pr-4 font-mono">{r.filename}</td>
                    <td className="py-1.5 pr-4">{r.affected_topics.join(", ") || "—"}</td>
                    <td className="py-1.5 pr-4">{r.row_count ?? "—"}</td>
                    <td className="py-1.5 pr-4">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5",
                          r.status === "committed" && "bg-emerald-500/15 text-emerald-700",
                          r.status === "rolled_back" && "bg-amber-500/15 text-amber-700",
                          r.status === "failed" && "bg-destructive/15 text-destructive",
                        )}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-1.5 pr-4">
                      {r.commit_url ? (
                        <a
                          href={r.commit_url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          {String(r.commit_sha ?? "").slice(0, 7)}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-1.5 pr-4">
                      {r.status === "committed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={rollbackMutation.isPending}
                          onClick={() => rollbackMutation.mutate({ historyId: r.id })}
                        >
                          Rollback
                        </Button>
                      )}
                      {(r.status === "rolled_back" || r.status === "failed") && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={rollbackMutation.isPending}
                          onClick={() =>
                            rollbackMutation.mutate({ historyId: r.id, force: true })
                          }
                        >
                          Force rollback
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
