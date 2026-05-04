import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  selected?: string;
  onSelect: (path: string) => void;
  onClose: () => void;
};

let cachedInventory: string[] | null = null;
let cachedUsage: Record<string, number> | null = null;

async function loadData(): Promise<{ inventory: string[]; usage: Record<string, number> }> {
  if (cachedInventory && cachedUsage) {
    return { inventory: cachedInventory, usage: cachedUsage };
  }
  const [invRes, useRes] = await Promise.all([
    fetch("/mocks/image-inventory.json"),
    fetch("/mocks/image-usage.json"),
  ]);
  cachedInventory = (await invRes.json()) as string[];
  cachedUsage = useRes.ok ? ((await useRes.json()) as Record<string, number>) : {};
  return { inventory: cachedInventory, usage: cachedUsage };
}

function folderOf(path: string): string {
  // "/road-signs/foo.png" -> "road-signs"
  // "/quiz-images/driving-theory/x.png" -> "quiz-images/driving-theory"
  const parts = path.split("/").filter(Boolean);
  if (parts.length <= 1) return "other";
  if (parts[0] === "quiz-images" && parts.length >= 3) return `${parts[0]}/${parts[1]}`;
  return parts[0];
}

function prettyFolder(f: string): string {
  return f
    .split("/")
    .pop()!
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fileName(path: string): string {
  return path.split("/").pop() ?? path;
}

export function ImagePicker({ selected, onSelect, onClose }: Props) {
  const [inventory, setInventory] = useState<string[]>([]);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState<string>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadData()
      .then(({ inventory, usage }) => {
        setInventory(inventory);
        setUsage(usage);
      })
      .finally(() => setLoading(false));
  }, []);

  const folders = useMemo(() => {
    const set = new Set<string>();
    for (const p of inventory) set.add(folderOf(p));
    return Array.from(set).sort();
  }, [inventory]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inventory.filter((p) => {
      if (folder !== "all" && folderOf(p) !== folder) return false;
      if (q && !p.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [inventory, folder, query]);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-auto bg-black/60 p-4">
      <div className="w-full max-w-5xl rounded-xl bg-card p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold">Browse images</h3>
            <p className="text-xs text-muted-foreground">
              {loading ? "Loading…" : `${filtered.length} of ${inventory.length} images`}
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

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search filename… (e.g. width, bend, roundabout)"
            className="sm:max-w-xs"
            autoFocus
          />
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
              {filtered.map((path) => {
                const isSel = path === selected;
                const count = usage[path] ?? 0;
                return (
                  <button
                    key={path}
                    type="button"
                    onClick={() => {
                      onSelect(path);
                      onClose();
                    }}
                    className={`group flex flex-col rounded-lg border p-2 text-left transition hover:border-primary hover:shadow-sm ${
                      isSel ? "border-primary ring-2 ring-primary" : "border-border"
                    }`}
                    title={path}
                  >
                    <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded bg-white">
                      <img
                        src={path}
                        alt=""
                        loading="lazy"
                        className="max-h-full max-w-full object-contain p-1"
                      />
                    </div>
                    <div className="mt-2 truncate text-xs font-medium" title={fileName(path)}>
                      {fileName(path)}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-1">
                      <span className="truncate text-[10px] text-muted-foreground">
                        {folderOf(path)}
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

        <div className="mt-4 flex justify-end">
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
