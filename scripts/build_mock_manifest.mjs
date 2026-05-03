#!/usr/bin/env node
// Build-time only: scan public/mocks/*.json and emit a tiny metadata manifest.
// The manifest is bundled at runtime; the full question files stay as static assets.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const mocksDir = join(root, "public", "mocks");
const outFile = join(root, "src", "data", "mocks", "manifest.json");

const files = readdirSync(mocksDir).filter((f) => f.endsWith(".json"));
const manifest = {};

for (const file of files) {
  let data;
  try {
    data = JSON.parse(readFileSync(join(mocksDir, file), "utf8"));
  } catch (e) {
    console.warn(`[mock-manifest] skip ${file}: ${e.message}`);
    continue;
  }
  if (!data || typeof data.topic !== "string") continue;
  const topic = data.topic;

  let mocks = [];
  if (data.version === 2 && Array.isArray(data.mocks) && Array.isArray(data.bank)) {
    const bankIds = new Set(data.bank.map((q) => q.id));
    mocks = data.mocks.map((m) => ({
      mockNumber: m.mockNumber,
      slug: `${topic}-mock-${m.mockNumber}`,
      title: m.title,
      questionCount: (m.questionIds || []).filter((id) => bankIds.has(id)).length,
    }));
  } else if (Array.isArray(data.tests)) {
    mocks = data.tests.map((t) => ({
      mockNumber: t.mockNumber,
      slug: t.slug ?? `${topic}-mock-${t.mockNumber}`,
      title: t.title,
      questionCount: Array.isArray(t.questions) ? t.questions.length : 0,
    }));
  } else {
    continue;
  }

  mocks.sort((a, b) => a.mockNumber - b.mockNumber);
  manifest[topic] = { topic, file, mocks };
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(manifest));
const totalMocks = Object.values(manifest).reduce((n, t) => n + t.mocks.length, 0);
console.log(
  `[mock-manifest] wrote ${outFile} — ${Object.keys(manifest).length} topics, ${totalMocks} mocks`,
);
