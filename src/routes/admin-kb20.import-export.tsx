import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { categories } from "@/data/categories";
import { loadTopicFileForAdmin } from "@/data/mocks";
import { validateTopicBank, type Finding } from "@/lib/admin/validator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin-kb20/import-export")({
  head: () => ({
    meta: [
      { title: "Import / Export — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <ImportExport />
    </AdminGate>
  ),
});

type AnyQ = Record<string, unknown> & { id?: string };

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ImportExport() {
  const { user } = useAuth();
  const allTopics = useMemo(
    () => categories.flatMap((c) => c.topics.map((t) => ({ slug: t.slug, title: t.title, cat: c.title }))),
    [],
  );
  const [topic, setTopic] = useState(allTopics[0]?.slug ?? "");

  // Import state
  const [parsed, setParsed] = useState<{ topic: string; bank: AnyQ[] } | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const exportTopic = async () => {
    const file = await loadTopicFileForAdmin(topic);
    if (!file) {
      setMessage("Topic file not found.");
      return;
    }
    downloadJson(`${topic}.json`, file);
  };

  const downloadValidation = async () => {
    const file = await loadTopicFileForAdmin(topic);
    if (!file) return;
    const bank: AnyQ[] =
      (file as { version?: number }).version === 2
        ? ((file as { bank: AnyQ[] }).bank ?? [])
        : ((file as { tests: { questions: AnyQ[] }[] }).tests ?? []).flatMap(
            (t) => t.questions ?? [],
          );
    const inv = await fetch("/mocks/image-inventory.json").then((r) => r.json()).catch(() => []);
    const out = validateTopicBank(topic, bank, new Set<string>(inv as string[]));
    downloadJson(`${topic}-validation.json`, out);
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    setParsed(null);
    setFindings([]);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text) as { topic?: string; bank?: AnyQ[]; version?: number };
      if (!json.topic || !Array.isArray(json.bank)) {
        setMessage("File must contain { topic, bank: [...] }");
        return;
      }
      const inv = await fetch("/mocks/image-inventory.json").then((r) => r.json()).catch(() => []);
      const f = validateTopicBank(json.topic, json.bank, new Set<string>(inv as string[]));
      setParsed({ topic: json.topic, bank: json.bank });
      setFindings(f);
    } catch (err) {
      setMessage(`Could not parse JSON: ${(err as Error).message}`);
    }
  };

  const commit = async () => {
    if (!parsed) return;
    const blockers = findings.filter((f) =>
      f.rule === "invalid-correct-answer" || f.rule === "unknown-type" || f.rule === "duplicate-id",
    );
    if (blockers.length > 0) {
      setMessage(`Refusing to import: ${blockers.length} blocking issues. Fix and re-upload.`);
      return;
    }
    setBusy(true);
    setMessage(null);
    const rows = parsed.bank
      .filter((q) => q.id)
      .map((q) => ({
        topic: parsed.topic,
        question_id: String(q.id),
        question: ((q.question as string | undefined) ?? null) as string | null,
        options: (q.options as unknown) as import("@/integrations/supabase/types").Json,
        correct_answer:
          (q.correctAnswer !== undefined
            ? q.correctAnswer
            : q.correctAnswers !== undefined
              ? q.correctAnswers
              : null) as import("@/integrations/supabase/types").Json,
        explanation: ((q.explanation as string | undefined) ?? null) as string | null,
        image: ((q.image as string | undefined) ?? null) as string | null,
        image_alt: ((q.imageAlt as string | undefined) ?? null) as string | null,
        updated_by: user?.id ?? null,
      }));
    // Chunk to avoid payload limits
    const chunkSize = 200;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const slice = rows.slice(i, i + chunkSize);
      const { error } = await supabase
        .from("question_overrides")
        .upsert(slice, { onConflict: "topic,question_id" });
      if (error) {
        setBusy(false);
        setMessage(`Import failed at row ${i}: ${error.message}`);
        return;
      }
    }
    setBusy(false);
    setMessage(`Imported ${rows.length} question overrides for ${parsed.topic}.`);
    setParsed(null);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Import / Export</h1>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Export topic</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Download the full bank + mocks file as JSON, or a validation report only.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            {allTopics.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.cat} — {t.title}
              </option>
            ))}
          </select>
          <button onClick={exportTopic} className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted">
            Download topic JSON
          </button>
          <button onClick={downloadValidation} className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted">
            Download validation report
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Import question overrides</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a v2 bank file (<code>{`{ topic, bank: [...] }`}</code>). Each entry with an id is upserted into <code>question_overrides</code> and applied immediately without redeploy.
        </p>
        <input
          type="file"
          accept="application/json,.json"
          onChange={onFile}
          className="mt-3 block w-full text-sm"
        />

        {parsed && (
          <div className="mt-4">
            <p className="text-sm">
              Topic: <span className="font-semibold">{parsed.topic}</span> · {parsed.bank.length} questions parsed · {findings.length} findings
            </p>
            {findings.length > 0 && (
              <ul className="mt-2 max-h-48 space-y-1 overflow-auto rounded-lg bg-muted/40 p-3 text-xs">
                {findings.slice(0, 50).map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Badge variant="secondary">{f.rule}</Badge>
                    <span className="text-muted-foreground">{f.message}</span>
                  </li>
                ))}
                {findings.length > 50 && <li>… and {findings.length - 50} more</li>}
              </ul>
            )}
            <button
              onClick={commit}
              disabled={busy}
              className="mt-3 rounded-xl bg-gradient-coral px-4 py-2 text-sm font-semibold text-coral-foreground disabled:opacity-50"
            >
              {busy ? "Importing…" : "Commit import"}
            </button>
          </div>
        )}

        {message && (
          <p className="mt-3 rounded-xl border border-border bg-muted/40 p-3 text-sm">{message}</p>
        )}
      </section>
    </main>
  );
}
