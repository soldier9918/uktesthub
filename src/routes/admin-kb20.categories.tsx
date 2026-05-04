import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/categories";
import { listAllTopics, loadTopicFileForAdmin } from "@/data/mocks";

export const Route = createFileRoute("/admin-kb20/categories")({
  head: () => ({
    meta: [
      { title: "Categories Browser — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <CategoriesBrowser />
    </AdminGate>
  ),
});

type TopicStats = {
  total: number;
  withImage: number;
  byType: Record<string, number>;
  loading: boolean;
};

function CategoriesBrowser() {
  const manifest = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of listAllTopics()) {
      map.set(
        t.topic,
        t.mocks.reduce((n, m) => n + (m.questionCount ?? 0), 0),
      );
    }
    return map;
  }, []);

  const [search, setSearch] = useState("");
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, TopicStats>>({});

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return categories;
    return categories
      .map((c) => ({
        ...c,
        topics: c.topics.filter(
          (t) =>
            c.title.toLowerCase().includes(s) ||
            t.title.toLowerCase().includes(s) ||
            t.slug.toLowerCase().includes(s),
        ),
      }))
      .filter(
        (c) =>
          c.topics.length > 0 ||
          c.title.toLowerCase().includes(s) ||
          c.slug.toLowerCase().includes(s),
      );
  }, [search]);

  async function loadTopicStats(topic: string) {
    if (stats[topic] && !stats[topic].loading) return;
    setStats((s) => ({
      ...s,
      [topic]: { total: 0, withImage: 0, byType: {}, loading: true },
    }));
    const file = await loadTopicFileForAdmin(topic);
    if (!file) {
      setStats((s) => ({
        ...s,
        [topic]: { total: 0, withImage: 0, byType: {}, loading: false },
      }));
      return;
    }
    const bank =
      (file as { version?: number; bank?: unknown[] }).version === 2
        ? ((file as { bank: Record<string, unknown>[] }).bank ?? [])
        : ((file as { tests: { questions: Record<string, unknown>[] }[] }).tests ?? []).flatMap(
            (t) => t.questions,
          );
    let withImage = 0;
    const byType: Record<string, number> = {};
    for (const q of bank as Record<string, unknown>[]) {
      const type = ((q.type as string) || "mcq").replace(/_/g, "-");
      byType[type] = (byType[type] || 0) + 1;
      if (typeof q.image === "string" && q.image) withImage += 1;
    }
    setStats((s) => ({
      ...s,
      [topic]: { total: bank.length, withImage, byType, loading: false },
    }));
  }

  useEffect(() => {
    if (!openCat) return;
    const cat = categories.find((c) => c.slug === openCat);
    if (!cat) return;
    cat.topics.forEach((t) => loadTopicStats(t.slug));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCat]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between gap-2">
        <div>
          <Link to="/admin-kb20" className="text-xs text-muted-foreground hover:underline">
            ← Admin home
          </Link>
          <h1 className="font-display text-2xl font-bold">Categories & Questions</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categories ·{" "}
            {categories.reduce((n, c) => n + c.topics.length, 0)} sub-topics
          </p>
        </div>
        <Input
          placeholder="Search category or topic…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <ul className="mt-6 space-y-3">
        {filtered.map((cat) => {
          const expanded = openCat === cat.slug;
          const totalQs = cat.topics.reduce(
            (n, t) => n + (manifest.get(t.slug) ?? 0),
            0,
          );
          return (
            <li key={cat.slug} className="rounded-xl border border-border bg-card">
              <button
                type="button"
                className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/40"
                onClick={() => setOpenCat(expanded ? null : cat.slug)}
              >
                <div className="flex-1">
                  <div className="font-semibold">{cat.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {cat.topics.length} topics · {totalQs} questions in bank ·{" "}
                    <code>{cat.slug}</code>
                  </div>
                </div>
                <Badge variant="outline">{expanded ? "Hide" : "Show"} topics</Badge>
              </button>

              {expanded && (
                <div className="border-t border-border p-3">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {cat.topics.map((t) => {
                      const st = stats[t.slug];
                      return (
                        <li
                          key={t.slug}
                          className="rounded-lg border border-border bg-background p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="font-medium truncate">{t.title}</div>
                              <code className="text-[10px] text-muted-foreground">
                                {t.slug}
                              </code>
                            </div>
                            <div className="flex shrink-0 gap-1">
                              <Button asChild size="sm" variant="outline" className="h-7">
                                <Link
                                  to="/admin-kb20/questions/$topic"
                                  params={{ topic: t.slug }}
                                >
                                  Browse
                                </Link>
                              </Button>
                              <Button asChild size="sm" variant="outline" className="h-7">
                                <a
                                  href={`/topic/${t.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Open public topic page"
                                >
                                  Live
                                </a>
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1 text-[11px]">
                            {st?.loading && (
                              <span className="text-muted-foreground">Loading…</span>
                            )}
                            {st && !st.loading && (
                              <>
                                <Badge variant="secondary">{st.total} questions</Badge>
                                <Badge
                                  variant={st.withImage > 0 ? "default" : "outline"}
                                  className={
                                    st.withImage > 0
                                      ? "bg-emerald-600 text-white hover:bg-emerald-600/90"
                                      : ""
                                  }
                                >
                                  {st.withImage} with images
                                </Badge>
                                {Object.entries(st.byType)
                                  .sort((a, b) => b[1] - a[1])
                                  .map(([type, n]) => (
                                    <Badge key={type} variant="outline">
                                      {type}: {n}
                                    </Badge>
                                  ))}
                                {st.withImage > 0 && (
                                  <Link
                                    to="/admin-kb20/questions/$topic"
                                    params={{ topic: t.slug }}
                                    className="ml-1 text-coral underline"
                                  >
                                    View images →
                                  </Link>
                                )}
                              </>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
