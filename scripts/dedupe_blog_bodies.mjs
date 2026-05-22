#!/usr/bin/env bun
// One-off: remove duplicated body block that appears after the generic
// "What to do on test day" section in every affected blog post.
import fs from "node:fs";

const path = "src/data/blog.tsx";
const src = fs.readFileSync(path, "utf8");
const lines = src.split("\n");

const out = [];
let i = 0;
let removed = 0;
let posts = 0;

while (i < lines.length) {
  const line = lines[i];
  out.push(line);

  if (line.includes("<h2>What to do on test day</h2>")) {
    // Copy lines until we close the paragraph that follows this h2.
    i++;
    while (i < lines.length) {
      out.push(lines[i]);
      const done = lines[i].trim() === "</p>";
      i++;
      if (done) break;
    }
    // Now skip everything up to (but not including) the closing `</>` of the
    // body fragment. That's the duplicated body + duplicated disclaimer.
    let skipped = 0;
    while (i < lines.length && lines[i].trim() !== "</>") {
      i++;
      skipped++;
    }
    if (skipped > 0) {
      posts++;
      removed += skipped;
    }
    continue;
  }
  i++;
}

fs.writeFileSync(path, out.join("\n"));
console.log(`Posts deduped: ${posts}`);
console.log(`Lines removed: ${removed}`);
