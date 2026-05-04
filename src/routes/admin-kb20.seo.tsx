import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { logAdminAction } from "@/lib/admin/audit";
import { invalidateAdminSettings, loadAdminSettings, type AdminSettings } from "@/lib/admin/settings";
import { toast } from "sonner";
import { getAllPosts } from "@/data/blog";

type SeoRow = {
  path: string;
  title: string | null;
  description: string | null;
  og_image: string | null;
  noindex: boolean;
  updated_at: string;
};

export const Route = createFileRoute("/admin-kb20/seo")({
  head: () => ({
    meta: [
      { title: "SEO Manager — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <SeoManager />
    </AdminGate>
  ),
});

function SeoManager() {
  const [rows, setRows] = useState<SeoRow[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [articleSearch, setArticleSearch] = useState("");
  const [editing, setEditing] = useState<SeoRow | null>(null);

  const posts = useMemo(() => getAllPosts(), []);

  const load = async () => {
    setLoading(true);
    const [{ data }, s] = await Promise.all([
      supabase.from("page_seo_overrides").select("*").order("path"),
      loadAdminSettings(true),
    ]);
    setRows((data ?? []) as SeoRow[]);
    setSettings(s);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.path.toLowerCase().includes(q));
  }, [rows, search]);

  const startNew = () => {
    setEditing({
      path: "/",
      title: "",
      description: "",
      og_image: "",
      noindex: false,
      updated_at: new Date().toISOString(),
    });
  };

  const saveDefaults = async (next: Partial<AdminSettings>) => {
    if (!settings) return;
    const merged: AdminSettings = { ...settings, ...next };
    setSettings(merged);
    const updates = Object.entries(next).map(([key, value]) => ({
      key,
      value: value as never,
    }));
    const { error } = await supabase.from("admin_settings").upsert(updates);
    if (error) {
      toast.error(error.message);
    } else {
      invalidateAdminSettings();
      await logAdminAction("seo.defaults.update", undefined, next as Record<string, unknown>);
      toast.success("Saved");
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">SEO Manager</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Override page metadata and set sitewide defaults. Per-route overrides win over defaults.
      </p>

      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold">Site defaults</h2>
        {settings && (
          <div className="mt-3 space-y-3">
            <Field label="Default meta description">
              <Input
                value={settings.default_meta_description}
                onChange={(e) =>
                  setSettings({ ...settings, default_meta_description: e.target.value })
                }
                onBlur={() =>
                  saveDefaults({ default_meta_description: settings.default_meta_description })
                }
              />
            </Field>
            <Field label="Default Open Graph image URL">
              <Input
                value={settings.default_og_image}
                onChange={(e) => setSettings({ ...settings, default_og_image: e.target.value })}
                onBlur={() => saveDefaults({ default_og_image: settings.default_og_image })}
                placeholder="https://example.com/og.png"
              />
            </Field>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold">Articles (Blog)</h2>
          <Badge variant="secondary">{posts.length} posts</Badge>
          <Input
            placeholder="Filter title or slug…"
            value={articleSearch}
            onChange={(e) => setArticleSearch(e.target.value)}
            className="ml-auto max-w-xs"
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Click Edit SEO to override a post's title, description, or OG image. The override
          beats the page's built-in metadata.
        </p>
        <ul className="mt-3 divide-y divide-border">
          {posts
            .filter((p) => {
              const q = articleSearch.trim().toLowerCase();
              if (!q) return true;
              return (
                p.title.toLowerCase().includes(q) ||
                p.slug.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
              );
            })
            .map((p) => {
              const path = `/blog/${p.slug}`;
              const override = rows.find((r) => r.path === path);
              return (
                <li key={p.slug} className="flex items-start gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="font-mono text-xs text-muted-foreground">{path}</code>
                      {override && <Badge variant="secondary">override</Badge>}
                      {override?.noindex && <Badge variant="destructive">noindex</Badge>}
                      <Badge variant="outline" className="text-[10px]">
                        {p.category}
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm font-medium">{override?.title || p.title}</div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {override?.description || p.description}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setEditing(
                          override ?? {
                            path,
                            title: p.title,
                            description: p.description,
                            og_image: typeof p.hero === "string" ? p.hero : "",
                            noindex: false,
                            updated_at: new Date().toISOString(),
                          },
                        )
                      }
                    >
                      Edit SEO
                    </Button>
                    <a
                      href={path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center text-xs text-muted-foreground hover:underline"
                    >
                      View ↗
                    </a>
                  </div>
                </li>
              );
            })}
          {posts.length === 0 && (
            <li className="py-6 text-center text-sm text-muted-foreground">No articles found.</li>
          )}
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold">Per-route overrides</h2>
          <Input
            placeholder="Filter path…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={startNew} className="ml-auto">
            Add override
          </Button>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {filtered.map((r) => (
              <li key={r.path} className="flex items-start gap-3 py-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm">{r.path}</code>
                    {r.noindex && <Badge variant="destructive">noindex</Badge>}
                  </div>
                  {r.title && <div className="text-sm">{r.title}</div>}
                  {r.description && (
                    <div className="text-xs text-muted-foreground line-clamp-2">{r.description}</div>
                  )}
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditing(r)}>
                  Edit
                </Button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No overrides yet.
              </li>
            )}
          </ul>
        )}
      </section>

      {editing && (
        <SeoEditor
          row={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void load();
          }}
        />
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function SeoEditor({
  row,
  onClose,
  onSaved,
}: {
  row: SeoRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [path, setPath] = useState(row.path);
  const [title, setTitle] = useState(row.title ?? "");
  const [description, setDescription] = useState(row.description ?? "");
  const [ogImage, setOgImage] = useState(row.og_image ?? "");
  const [noindex, setNoindex] = useState(row.noindex);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!path.startsWith("/")) {
      toast.error("Path must start with /");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("page_seo_overrides").upsert(
      [{
        path,
        title: title || null,
        description: description || null,
        og_image: ogImage || null,
        noindex,
      }],
      { onConflict: "path" },
    );
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await logAdminAction("seo.upsert", path, { noindex });
    onSaved();
  };

  const remove = async () => {
    if (!confirm(`Delete override for ${path}?`)) return;
    const { error } = await supabase.from("page_seo_overrides").delete().eq("path", path);
    if (error) {
      toast.error(error.message);
      return;
    }
    await logAdminAction("seo.delete", path);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-xl bg-background p-6 shadow-xl">
        <h3 className="font-display text-lg font-semibold">Edit page SEO</h3>
        <div className="mt-4 space-y-3">
          <Field label="Path (e.g. /about)">
            <Input value={path} onChange={(e) => setPath(e.target.value)} />
          </Field>
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Meta description">
            <textarea
              className="w-full rounded-md border border-input bg-background p-2 text-sm"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field label="Open Graph image URL">
            <Input value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={noindex}
              onChange={(e) => setNoindex(e.target.checked)}
            />
            Hide from search engines (noindex)
          </label>
        </div>
        <div className="mt-4 flex justify-between gap-2">
          <Button variant="destructive" onClick={remove}>
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
