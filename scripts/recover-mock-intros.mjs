#!/usr/bin/env node
/**
 * Recovery script: rebuilds src/data/per-mock-intros.json by replaying
 * every commit that touched src/data/per-mock-intros.ts.
 *
 * For each commit (oldest -> newest), parse PER_MOCK_INTROS out of the
 * file source and merge per-topic. Later commits overwrite earlier
 * versions of the same topic. The latest commit's mocks for a topic
 * are taken as authoritative.
 *
 * Usage:
 *   node scripts/recover-mock-intros.mjs            # dry-run report
 *   node scripts/recover-mock-intros.mjs --write    # also writes JSON
 */

import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const FILE_PATH = "src/data/per-mock-intros.ts";
const OUT_JSON = "src/data/per-mock-intros.json";

const WRITE = process.argv.includes("--write");

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8", maxBuffer: 1024 * 1024 * 200 });
}

// All commits that touched the file (chronological).
function listCommits() {
  const out = sh(`git log --all --reverse --format=%H -- ${FILE_PATH}`);
  return out.split("\n").map((s) => s.trim()).filter(Boolean);
}

function showFileAtCommit(sha) {
  try {
    return sh(`git show ${sha}:${FILE_PATH}`);
  } catch {
    return null;
  }
}

/**
 * Extract the PER_MOCK_INTROS object literal from a TS source string.
 * The serializer outputs a regular object literal where:
 *  - topic keys are JSON-quoted strings
 *  - mock keys are bare integers
 *  - values are emitted via JSON.stringify (so always valid JSON literals)
 * We strip the type annotation, then eval as JS.
 */
function parseIntros(src) {
  const marker = "export const PER_MOCK_INTROS";
  const idx = src.indexOf(marker);
  if (idx === -1) return null;
  // Find the first '{' after the marker.
  const braceStart = src.indexOf("{", idx);
  if (braceStart === -1) return null;
  // Walk braces to find the matching close.
  let depth = 0;
  let i = braceStart;
  let inStr = false;
  let strCh = "";
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") { i++; continue; }
      if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'") { inStr = true; strCh = c; continue; }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) return null;
  const objSrc = src.slice(braceStart, i + 1);
  try {
    // eslint-disable-next-line no-new-func
    return new Function(`return (${objSrc});`)();
  } catch (e) {
    return null;
  }
}

function parseRelated(src) {
  const marker = "export const RELATED_GUIDE_BY_TOPIC";
  const idx = src.indexOf(marker);
  if (idx === -1) return null;
  const braceStart = src.indexOf("{", idx);
  if (braceStart === -1) return null;
  let depth = 0;
  let inStr = false;
  let strCh = "";
  let i = braceStart;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") { i++; continue; }
      if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'") { inStr = true; strCh = c; continue; }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) return null;
  const objSrc = src.slice(braceStart, i + 1);
  try {
    return new Function(`return (${objSrc});`)();
  } catch {
    return null;
  }
}

function main() {
  const commits = listCommits();
  console.log(`Found ${commits.length} commits touching ${FILE_PATH}\n`);

  // Merge by topic, latest commit wins.
  const merged = {};                  // topicSlug -> { mockNum: intro }
  const lastSourceCommit = {};        // topicSlug -> sha
  const lastSourceMessage = {};       // topicSlug -> first line of commit msg
  let related = null;
  let relatedSource = null;
  const failures = [];

  for (const sha of commits) {
    const src = showFileAtCommit(sha);
    if (!src) { failures.push({ sha, reason: "could not read file" }); continue; }
    const obj = parseIntros(src);
    if (!obj || typeof obj !== "object") {
      failures.push({ sha, reason: "could not parse PER_MOCK_INTROS" });
      continue;
    }
    const msg = sh(`git log -1 --format=%s ${sha}`).trim();
    for (const [topic, byMock] of Object.entries(obj)) {
      if (!byMock || typeof byMock !== "object") continue;
      // Skip empty topic blocks (defensive).
      if (Object.keys(byMock).length === 0) continue;
      merged[topic] = byMock;
      lastSourceCommit[topic] = sha;
      lastSourceMessage[topic] = msg;
    }
    const rel = parseRelated(src);
    if (rel && Object.keys(rel).length > 0) {
      related = rel;
      relatedSource = sha;
    }
  }

  // Report.
  const topics = Object.keys(merged).sort();
  const totalMocks = Object.values(merged).reduce(
    (a, b) => a + Object.keys(b).length, 0,
  );

  console.log("=== DRY-RUN REPORT ===");
  console.log(`Total topics recovered: ${topics.length}`);
  console.log(`Total mock intros:      ${totalMocks}`);
  console.log(`Related guides:         ${related ? Object.keys(related).length : 0}` +
              (relatedSource ? ` (from ${relatedSource.slice(0,7)})` : ""));
  console.log(`Commits skipped:        ${failures.length}`);
  if (failures.length) {
    for (const f of failures.slice(0, 10)) {
      console.log(`  - ${f.sha.slice(0,7)} ${f.reason}`);
    }
  }

  // Compare against the categories list if available.
  let knownTopics = null;
  try {
    const catsSrc = sh(`git show HEAD:src/data/categories.ts`);
    const slugs = [...catsSrc.matchAll(/slug:\s*["']([a-z0-9-]+)["']/g)].map((m) => m[1]);
    knownTopics = new Set(slugs);
  } catch {}

  if (knownTopics) {
    const missing = [...knownTopics].filter((t) => !merged[t]).sort();
    const unknownInJson = topics.filter((t) => !knownTopics.has(t));
    console.log(`\nKnown topics (categories.ts): ${knownTopics.size}`);
    console.log(`Missing topics (no intros at all): ${missing.length}`);
    if (missing.length) console.log("  " + missing.join("\n  "));
    if (unknownInJson.length) {
      console.log(`\nTopics in JSON but not in categories.ts: ${unknownInJson.length}`);
      console.log("  " + unknownInJson.join("\n  "));
    }
  }

  console.log("\n=== PER-TOPIC SOURCE (latest commit used) ===");
  for (const t of topics) {
    const mocks = Object.keys(merged[t]).length;
    const sha = lastSourceCommit[t].slice(0, 7);
    console.log(`  ${t.padEnd(45)} ${String(mocks).padStart(3)} mocks  <- ${sha}`);
  }

  if (!WRITE) {
    console.log("\nDry-run only. Re-run with --write to emit the JSON file.");
    return;
  }

  const payload = {
    intros: {},
    related: related ?? {},
  };
  for (const t of topics) payload.intros[t] = merged[t];

  mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`\nWrote ${OUT_JSON} (${topics.length} topics, ${totalMocks} mocks).`);
}

main();
