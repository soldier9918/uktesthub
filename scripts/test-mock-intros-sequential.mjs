#!/usr/bin/env node
/**
 * Sequential import test for the mock-intros importer.
 *
 * Simulates three back-to-back CSV imports (topic A, then B, then C) and
 * asserts that every previously-imported topic survives each subsequent
 * import. Exercises the same merge + serialize + reparse round-trip the
 * server functions use, but without needing GitHub or auth.
 *
 * This is the regression test for the "imports wipe other topics" bug.
 *
 * Usage: node scripts/test-mock-intros-sequential.mjs
 */

import assert from "node:assert/strict";

// --- minimal copies of the importer's merge + JSON-roundtrip helpers ---

function jsonToIntrosMap(intros) {
  const out = {};
  for (const [topic, byMock] of Object.entries(intros)) {
    out[topic] = {};
    for (const [m, v] of Object.entries(byMock)) {
      const n = Number(m);
      if (Number.isInteger(n)) out[topic][n] = v;
    }
  }
  return out;
}

function serialize(intros, related) {
  const sortedIntros = {};
  for (const t of Object.keys(intros).sort()) {
    const byMock = intros[t] ?? {};
    const nums = Object.keys(byMock).map(Number).filter(Number.isInteger).sort((a,b)=>a-b);
    const inner = {};
    for (const n of nums) inner[String(n)] = byMock[n];
    sortedIntros[t] = inner;
  }
  const sortedRel = {};
  for (const t of Object.keys(related).sort()) sortedRel[t] = related[t];
  return JSON.stringify({ intros: sortedIntros, related: sortedRel }, null, 2) + "\n";
}

function parseFile(content) {
  const p = JSON.parse(content);
  return { intros: p.intros ?? {}, related: p.related ?? {} };
}

function applyRows(current, rows, mode, affectedTopics) {
  const next = {};
  for (const [t, byMock] of Object.entries(current)) next[t] = { ...byMock };
  if (mode === "replace") {
    for (const t of affectedTopics) next[t] = {};
  }
  for (const r of rows) {
    if (!next[r.topicSlug]) next[r.topicSlug] = {};
    next[r.topicSlug][r.mock] = r.intro;
  }
  return next;
}

function safetyCheck(current, next) {
  const cur = new Set(Object.keys(current));
  const nx = new Set(Object.keys(next));
  const dropped = [];
  for (const t of cur) if (!nx.has(t)) dropped.push(t);
  if (dropped.length > 0) {
    throw new Error(`SAFETY FAIL: would drop topics: ${dropped.join(", ")}`);
  }
}

// --- test fixture ---

function makeRows(topic, n = 3) {
  const rows = [];
  for (let i = 1; i <= n; i++) {
    rows.push({
      topicSlug: topic,
      mock: i,
      intro: {
        difficulty: "Beginner",
        covers: `${topic} mock ${i} covers`,
        commonMistakes: [`mistake-${i}-a`, `mistake-${i}-b`],
      },
    });
  }
  return rows;
}

function simulateImport(currentFileContent, rows, mode = "patch") {
  // 1. Parse the LIVE file (this is the bug-fix: merge base is the file).
  const live = parseFile(currentFileContent);
  const current = jsonToIntrosMap(live.intros);
  // 2. Merge.
  const affected = new Set(rows.map(r => r.topicSlug));
  const next = applyRows(current, rows, mode, affected);
  // 3. Safety check.
  safetyCheck(current, next);
  // 4. Re-serialize -> the new file content.
  return serialize(next, live.related);
}

// --- run the scenario ---

function listTopics(content) {
  return Object.keys(parseFile(content).intros).sort();
}

console.log("Sequential import test\n----------------------");

let file = JSON.stringify({ intros: {}, related: {} }, null, 2) + "\n";
console.log("Step 0: empty file. Topics:", listTopics(file));

// Step 1: import topic A
file = simulateImport(file, makeRows("topic-a", 3));
console.log("Step 1: imported topic-a. Topics:", listTopics(file));
assert.deepEqual(listTopics(file), ["topic-a"]);

// Step 2: import topic B
file = simulateImport(file, makeRows("topic-b", 3));
console.log("Step 2: imported topic-b. Topics:", listTopics(file));
assert.deepEqual(listTopics(file), ["topic-a", "topic-b"], "topic-a must survive topic-b import");

// Step 3: import topic C
file = simulateImport(file, makeRows("topic-c", 3));
console.log("Step 3: imported topic-c. Topics:", listTopics(file));
assert.deepEqual(listTopics(file), ["topic-a", "topic-b", "topic-c"], "a + b must survive c import");

// Step 4: confirm intros for A still match what we imported
const parsed = parseFile(file);
assert.equal(parsed.intros["topic-a"]["1"].covers, "topic-a mock 1 covers");
assert.equal(parsed.intros["topic-b"]["2"].covers, "topic-b mock 2 covers");
assert.equal(parsed.intros["topic-c"]["3"].covers, "topic-c mock 3 covers");

// Step 5: re-importing topic A in replace mode wipes only A, not B or C.
file = simulateImport(file, makeRows("topic-a", 2), "replace");
const after = parseFile(file).intros;
assert.deepEqual(Object.keys(after).sort(), ["topic-a", "topic-b", "topic-c"]);
assert.equal(Object.keys(after["topic-a"]).length, 2, "replace-mode A is 2 mocks");
assert.equal(Object.keys(after["topic-b"]).length, 3, "B untouched");
assert.equal(Object.keys(after["topic-c"]).length, 3, "C untouched");
console.log("Step 5: replace-mode on A leaves B and C intact ✓");

// Step 6: BUG REGRESSION — simulate the old behaviour where the merge base
// was a STALE snapshot lacking topic-b. The safety check must block.
console.log("\nStep 6: regression — stale base lacking topic-b must be blocked");
const staleBase = JSON.stringify({
  intros: { "topic-a": parseFile(file).intros["topic-a"] },
  related: {},
}, null, 2) + "\n";
let blocked = false;
try {
  // Pretend we're applying topic-d on top of staleBase, then comparing
  // against the LIVE file (which has a, b, c). The safety check compares
  // current (parsed from live file) against next (built from stale).
  // We simulate by giving simulateImport the LIVE file but applying
  // rows that don't touch b/c — that's the *correct* path and must pass.
  // To prove the safety check works, run it manually with a hand-crafted
  // mismatch:
  const liveCurrent = jsonToIntrosMap(parseFile(file).intros);
  const buggyNext = jsonToIntrosMap(parseFile(staleBase).intros);
  // add topic-d to the buggy next
  buggyNext["topic-d"] = { 1: { difficulty: "Beginner", covers: "d", commonMistakes: ["x"] } };
  safetyCheck(liveCurrent, buggyNext);
} catch (e) {
  blocked = true;
  console.log("  blocked as expected:", e.message);
}
assert.ok(blocked, "safety check MUST block a stale-base merge");

console.log("\n✅ All sequential import assertions passed.");
