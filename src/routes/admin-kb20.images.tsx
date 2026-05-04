import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/AdminGate";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { logAdminAction } from "@/lib/admin/audit";
import { toast } from "sonner";

type StorageItem = {
  name: string;
  publicUrl: string;
  size?: number;
  mimetype?: string;
  updatedAt?: string;
  used: boolean;
};

export const Route = createFileRoute("/admin-kb20/images")({
  head: () => ({
    meta: [
      { title: "Image Asset Manager — Admin — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: () => (
    <AdminGate>
      <ImagesManager />
    </AdminGate>
  ),
});

const BUCKET = "question-images";

function ImagesManager() {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [referenced, setReferenced] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "orphan" | "used">("all");
  const fileInput = useRef<HTMLInputElement | null>(null);

  const load = async () => {
    setLoading(true);
    // Pull referenced image paths from question overrides + public asset list.
    const [{ data: overrides }, invRes] = await Promise.all([
      supabase.from("question_overrides").select("image"),
      fetch("/mocks/image-inventory.json").then((r) => r.json()).catch(() => []),
    ]);
    const refs = new Set<string>();
    for (const row of overrides ?? []) {
      const img = (row as { image?: string | null }).image;
      if (img) refs.add(normalise(img));
    }
    for (const p of invRes as string[]) refs.add(normalise(p));
    setReferenced(refs);

    const { data: list, error } = await supabase.storage.from(BUCKET).list("", {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) {
      toast.error(`Failed to list bucket: ${error.message}`);
      setLoading(false);
      return;
    }
    const out: StorageItem[] = (list ?? [])
      .filter((f) => f.name && !f.name.endsWith("/"))
      .map((f) => {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
        return {
          name: f.name,
          publicUrl: data.publicUrl,
          size: (f as { metadata?: { size?: number } }).metadata?.size,
          mimetype: (f as { metadata?: { mimetype?: string } }).metadata?.mimetype,
          updatedAt: (f as { updated_at?: string }).updated_at,
          used: refs.has(normalise(data.publicUrl)) || refs.has(`/${f.name}`),
        };
      });
    setItems(out);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      if (filter === "orphan" && it.used) return false;
      if (filter === "used" && !it.used) return false;
      if (q && !it.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, search, filter]);

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    let uploaded = 0;
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, "_")}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type });
      if (error) {
        toast.error(`${file.name}: ${error.message}`);
      } else {
        uploaded++;
      }
    }
    if (uploaded > 0) {
      await logAdminAction("images.upload", undefined, { count: uploaded });
      toast.success(`Uploaded ${uploaded} file(s)`);
      void load();
    }
  };

  const onDelete = async (name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    if (error) {
      toast.error(error.message);
    } else {
      await logAdminAction("images.delete", name);
      toast.success("Deleted");
      void load();
    }
  };

  const orphanCount = items.filter((i) => !i.used).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/admin-kb20" className="text-sm text-muted-foreground hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Image Asset Manager</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} files in bucket "{BUCKET}" · {orphanCount} unused
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => onUpload(e.target.files)}
        />
        <Button onClick={() => fileInput.current?.click()}>Upload images…</Button>
        <Input
          placeholder="Search filename…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        >
          <option value="all">All</option>
          <option value="used">Used</option>
          <option value="orphan">Orphans</option>
        </select>
        <Button variant="outline" onClick={() => load()}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((it) => (
            <li key={it.name} className="group relative rounded-xl border border-border bg-card p-2">
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-white">
                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                <img
                  src={it.publicUrl}
                  alt={it.name}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
                {!it.used && (
                  <Badge variant="secondary" className="absolute right-1 top-1">
                    orphan
                  </Badge>
                )}
              </div>
              <div className="mt-2 truncate text-xs font-mono">{it.name}</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                {it.mimetype ?? "image"} · {it.size ? `${Math.round(it.size / 1024)} KB` : "?"}
              </div>
              <div className="mt-2 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(it.publicUrl)}
                  className="text-[11px] text-muted-foreground hover:text-foreground hover:underline"
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(it.name)}
                  className="text-[11px] text-destructive hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="col-span-full rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              No images match these filters.
            </li>
          )}
        </ul>
      )}
    </main>
  );
}

function normalise(u: string): string {
  try {
    const url = new URL(u);
    return url.pathname;
  } catch {
    return u.startsWith("/") ? u : `/${u}`;
  }
}
