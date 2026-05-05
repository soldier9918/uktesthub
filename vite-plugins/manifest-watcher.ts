import { spawn } from "node:child_process";
import { resolve } from "node:path";
import type { Plugin, ViteDevServer } from "vite";

/**
 * Watches public/ image folders and regenerates the mock image manifest
 * whenever an image is added, removed, or renamed. New images appear in the
 * Image Picker without restarting the dev server.
 */
export function manifestWatcher(): Plugin {
  const root = process.cwd();
  const script = resolve(root, "scripts/build_mock_manifest.mjs");
  const watchedDirs = ["road-signs", "road-markings", "motorway-rules", "quiz-images"].map((d) =>
    resolve(root, "public", d),
  );
  const imageRe = /\.(png|jpe?g|webp|svg)$/i;

  let running = false;
  let queued = false;
  let server: ViteDevServer | null = null;

  function rebuild() {
    if (running) {
      queued = true;
      return;
    }
    running = true;
    const child = spawn(process.execPath, [script], { stdio: "inherit" });
    child.on("exit", () => {
      running = false;
      // Notify clients so the picker can refetch.
      server?.ws.send({ type: "custom", event: "image-inventory:updated" });
      if (queued) {
        queued = false;
        rebuild();
      }
    });
  }

  function isWatched(file: string) {
    if (!imageRe.test(file)) return false;
    return watchedDirs.some((d) => file.startsWith(d));
  }

  return {
    name: "lovable-manifest-watcher",
    apply: "serve",
    configureServer(s) {
      server = s;
      for (const d of watchedDirs) s.watcher.add(d);
      const handler = (file: string) => {
        if (isWatched(file)) rebuild();
      };
      s.watcher.on("add", handler);
      s.watcher.on("unlink", handler);
      s.watcher.on("change", handler);
    },
  };
}
