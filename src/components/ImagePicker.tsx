import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  selected?: string;
  onSelect: (path: string) => void;
  onClose: () => void;
};

const STORAGE_BUCKET = "question-images";
const STORAGE_FOLDER_KEY = "storage/question-images";

type ImageItem = {
  path: string; // value passed back to onSelect (path or full URL)
  display: string; // URL used for <img src>
  source: "public" | "storage";
  folder: string;
};

function normalise(u: string): string {
  try {
    const url = new URL(u);
    return url.pathname;
  } catch {
    return u.startsWith("/") ? u : `/${u}`;
  }
}

async function loadData(): Promise<{ items: ImageItem[]; usage: Record<string, number> }> {
  const bust = `?v=${Date.now()}`;
  const [invRes, useRes, overridesRes, storageRes] = await Promise.all([
    fetch(`/mocks/image-inventory.json${bust}`, { cache: "no-store" }),
    fetch(`/mocks/image-usage.json${bust}`, { cache: "no-store" }),
    supabase.from("question_overrides").select("image"),
    supabase.storage.from(STORAGE_BUCKET).list("", {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    }),
  ]);

  const inventory = (await invRes.json()) as string[];
  const baseUsage = useRes.ok ? ((await useRes.json()) as Record<string, number>) : {};
  const usage: Record<string, number> = { ...baseUsage };
  const overrideImages = (overridesRes.data ?? []) as Array<{ image: string | null }>;
  for (const row of overrideImages) {
    if (row.image) {
      const key = normalise(row.image);
      usage[key] = (usage[key] ?? 0) + 1;
    }
  }

  const items: ImageItem[] = [];
  const seen = new Set<string>();

  // Public/manifest images.
  for (const p of inventory) {
    if (seen.has(p)) continue;
    seen.add(p);
    items.push({ path: p, display: p, source: "public", folder: folderOf(p) });
  }

  // Live Supabase Storage bucket entries.
  const files = storageRes.data ?? [];
  for (const f of files) {
    if (!f.name || f.name.endsWith("/")) continue;
    if (!/\.(png|jpe?g|webp|svg|gif)$/i.test(f.name)) continue;
    const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(f.name);
    const url = pub.publicUrl;
    if (seen.has(url)) continue;
    seen.add(url);
    items.push({
      path: url,
      display: url,
      source: "storage",
      folder: STORAGE_FOLDER_KEY,
    });
  }

  return { items, usage };
}

function folderOf(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (parts.length <= 1) return "other";
  if (parts[0] === "quiz-images" && parts.length >= 3) return `${parts[0]}/${parts[1]}`;
  return parts[0];
}

function prettyFolder(f: string): string {
  if (f === STORAGE_FOLDER_KEY) return "Storage (uploaded)";
  return f
    .split("/")
    .pop()!
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fileName(path: string): string {
  try {
    const url = new URL(path);
    return url.pathname.split("/").pop() ?? path;
  } catch {
    return path.split("/").pop() ?? path;
  }
}

export function ImagePicker({ selected, onSelect, onClose }: Props) {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [folder, setFolder] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  const refresh = useCallback(async (initial = false) => {
    if (initial) setLoading(true);
    else setRefreshing(true);
    try {
      const { items, usage } = await loadData();
      setItems(items);
      setUsage(usage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh(true);
    if (import.meta.hot) {
      const handler = () => void refresh();
      import.meta.hot.on("image-inventory:updated", handler);
      return () => {
        import.meta.hot?.off("image-inventory:updated", handler);
      };
    }
  }, [refresh]);

  const folders = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) set.add(it.folder);
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (folder !== "all" && it.folder !== folder) return false;
      if (q && !it.path.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, folder, query]);

  useEffect(() => {
    setPage(1);
  }, [folder, query, items]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-auto bg-black/60 p-4">
      <div className="w-full max-w-5xl rounded-xl bg-card p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold">Browse images</h3>
            <p className="text-xs text-muted-foreground">
              {loading ? "Loading…" : `${filtered.length} of ${items.length} images · page ${currentPage}/${totalPages}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Images uploaded through <strong className="text-foreground">Admin</strong> appear
          instantly. Images committed via <strong className="text-foreground">GitHub</strong> to{" "}
          <code className="rounded bg-background px-1">public/</code> appear after the next
          deploy/publish. Click <strong className="text-foreground">Refresh</strong> to re-check.
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search filename… (e.g. width, bend, roundabout)"
            className="sm:max-w-xs"
            autoFocus
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refresh()}
            disabled={refreshing || loading}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <div className="flex flex-wrap gap-1">
            <FolderChip active={folder === "all"} onClick={() => setFolder("all")}>
              All
            </FolderChip>
            {folders.map((f) => (
              <FolderChip key={f} active={folder === f} onClick={() => setFolder(f)}>
                {prettyFolder(f)}
              </FolderChip>
            ))}
          </div>
        </div>

        <div className="mt-4 max-h-[60vh] overflow-auto rounded-lg border border-border bg-background p-3">
          {loading ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Loading images…</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No images match.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {paginated.map((it) => {
                const isSel = it.path === selected;
                const usageKey = it.source === "storage" ? normalise(it.path) : it.path;
                const count = usage[usageKey] ?? 0;
                return (
                  <button
                    key={it.path}
                    type="button"
                    onClick={() => {
                      onSelect(it.path);
                      onClose();
                    }}
                    className={`group flex flex-col rounded-lg border p-2 text-left transition hover:border-primary hover:shadow-sm ${
                      isSel ? "border-primary ring-2 ring-primary" : "border-border"
                    }`}
                    title={it.path}
                  >
                    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded bg-white">
                      <img
                        src={it.display}
                        alt=""
                        loading="lazy"
                        className="max-h-full max-w-full object-contain p-1"
                      />
                      <Badge
                        variant={it.source === "storage" ? "default" : "secondary"}
                        className="absolute left-1 top-1 text-[9px]"
                      >
                        {it.source === "storage" ? "Uploaded" : "Public"}
                      </Badge>
                    </div>
                    <div className="mt-2 truncate text-xs font-medium" title={fileName(it.path)}>
                      {fileName(it.path)}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-1">
                      <span className="truncate text-[10px] text-muted-foreground">
                        {prettyFolder(it.folder)}
                      </span>
                      <Badge variant={count > 0 ? "secondary" : "outline"} className="text-[10px]">
                        Used {count}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function FolderChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
