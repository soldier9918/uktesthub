import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { categories } from "@/data/categories";
import { listMockSlots, TOTAL_MOCKS_PER_TOPIC } from "@/data/mocks";
import { supabase } from "@/integrations/supabase/client";
import { useMockOverrides, invalidateMockOverridesCache } from "@/lib/admin/mock-status";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin-kb20/mocks")({
  head: () => ({
    meta: [
      { title: "Mock Test Manager — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <MocksManager />
    </AdminGate>
  ),
});

function MocksManager() {
  const { user } = useAuth();
  const { rows, refresh } = useMockOverrides();
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const disabledSet = useMemo(
    () => new Set(rows.filter((r) => r.disabled).map((r) => r.mock_slug)),
    [rows],
  );

  const allTopics = useMemo(
    () =>
      categories.flatMap((c) =>
        c.topics.map((t) => ({ ...t, category: c.title, categorySlug: c.slug })),
      ),
    [],
  );
  const topics = useMemo(
    () =>
      filter
        ? allTopics.filter(
            (t) =>
              t.title.toLowerCase().includes(filter.toLowerCase()) ||
              t.category.toLowerCase().includes(filter.toLowerCase()),
          )
        : allTopics,
    [allTopics, filter],
  );

  const toggle = async (topicSlug: string, mockSlug: string, disabled: boolean) => {
    await supabase.from("mock_overrides").upsert(
      { topic_slug: topicSlug, mock_slug: mockSlug, disabled, updated_by: user?.id },
      { onConflict: "topic_slug,mock_slug" },
    );
    invalidateMockOverridesCache();
    void refresh();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Mock Test Manager</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {allTopics.length} topics · {TOTAL_MOCKS_PER_TOPIC} mocks per topic ·{" "}
        {disabledSet.size} disabled
      </p>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter topics or categories…"
        className="mt-4 w-full max-w-md rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      <div className="mt-6 space-y-2">
        {topics.map((t) => {
          const slots = listMockSlots(t.slug);
          const disabledCount = slots.filter((s) => disabledSet.has(s.slug)).length;
          const isOpen = openTopic === t.slug;
          return (
            <div key={t.slug} className="rounded-xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setOpenTopic(isOpen ? null : t.slug)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-muted/40"
              >
                <div>
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.category}</div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary">{slots.length} mocks</Badge>
                  {disabledCount > 0 && (
                    <Badge variant="destructive">{disabledCount} disabled</Badge>
                  )}
                  <span className="text-muted-foreground">{isOpen ? "▾" : "▸"}</span>
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2 text-left">Mock</th>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-right">Questions</th>
                        <th className="px-4 py-2 text-right">Status</th>
                        <th className="px-4 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map((s) => {
                        const isDisabled = disabledSet.has(s.slug);
                        return (
                          <tr key={s.slug} className="border-t border-border/60">
                            <td className="px-4 py-2 font-mono text-xs">{s.mockNumber}</td>
                            <td className="px-4 py-2">
                              <Link
                                to="/quiz/$slug"
                                params={{ slug: s.slug }}
                                className="hover:underline"
                              >
                                {s.title}
                              </Link>
                            </td>
                            <td className="px-4 py-2 text-right">{s.questionsCount}</td>
                            <td className="px-4 py-2 text-right">
                              {isDisabled ? (
                                <Badge variant="destructive">Disabled</Badge>
                              ) : (
                                <Badge variant="secondary">Active</Badge>
                              )}
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => toggle(t.slug, s.slug, !isDisabled)}
                                className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold hover:bg-muted"
                              >
                                {isDisabled ? "Enable" : "Disable"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
