#!/usr/bin/env node
// One-time: merge question_overrides rows into public/mocks/<topic>.json
// so the static JSON files become the source of truth.

import fs from "node:fs";
import path from "node:path";

const overridesPath = process.argv[2] || "/tmp/migrate/overrides.jsonl";
const mocksDir = path.resolve("public/mocks");

const overrides = fs
  .readFileSync(overridesPath, "utf8")
  .split("\n")
  .filter((l) => l.trim().length > 0)
  .map((l) => JSON.parse(l));
console.log(`Loaded ${overrides.length} overrides`);

const byTopic = new Map();
for (const o of overrides) {
  if (!byTopic.has(o.topic)) byTopic.set(o.topic, []);
  byTopic.get(o.topic).push(o);
}

function applyOverrideToQuestion(q, o) {
  const next = { ...q };
  const hasContent =
    o.question != null ||
    Array.isArray(o.options) ||
    o.correct_answer != null ||
    o.explanation != null ||
    o.type != null;
  if (o.type != null) next.type = o.type;
  if (o.question != null) {
    if ("template" in next && !("question" in next)) next.template = o.question;
    else if ("prompt" in next && !("question" in next)) next.prompt = o.question;
    else next.question = o.question;
  }
  if (Array.isArray(o.options)) next.options = o.options;
  if (o.correct_answer != null) {
    const t = next.type;
    if ((t === "multiple-response" || t === "multiple_response") && Array.isArray(o.correct_answer)) {
      next.correctAnswers = o.correct_answer;
      delete next.correctAnswer;
    } else {
      next.correctAnswer = o.correct_answer;
      if (!Array.isArray(o.correct_answer)) delete next.correctAnswers;
    }
  }
  if (o.explanation != null) next.explanation = o.explanation;
  if (o.image != null) {
    next.image = o.image;
  } else if (hasContent) {
    delete next.image;
    if (next.type === "image_question" || next.type === "image-question") next.type = "mcq";
  }
  if (o.image_alt != null) next.imageAlt = o.image_alt;
  else if (hasContent && o.image == null) delete next.imageAlt;
  return next;
}

let topicsProcessed = 0;
let questionsPatched = 0;
let questionsDisabled = 0;
let questionsNotFound = 0;

for (const [topic, list] of byTopic) {
  const filePath = path.join(mocksDir, `${topic}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`SKIP ${topic}: file not found`);
    continue;
  }
  const file = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const isV2 = file.version === 2 && Array.isArray(file.bank);

  // Build map of question id -> reference into the file
  const byId = new Map();
  if (isV2) {
    file.bank.forEach((q, idx) => byId.set(String(q.id), { container: file.bank, idx }));
  } else if (Array.isArray(file.tests)) {
    for (const test of file.tests) {
      (test.questions ?? []).forEach((q, idx) => {
        if (q.id) byId.set(String(q.id), { container: test.questions, idx });
      });
    }
  }

  const disabledIds = new Set();
  for (const o of list) {
    const ref = byId.get(String(o.question_id));
    if (!ref) {
      questionsNotFound++;
      continue;
    }
    if (o.disabled) {
      disabledIds.add(String(o.question_id));
      questionsDisabled++;
      continue;
    }
    ref.container[ref.idx] = applyOverrideToQuestion(ref.container[ref.idx], o);
    questionsPatched++;
  }

  // Drop disabled questions
  if (disabledIds.size > 0) {
    if (isV2) {
      file.bank = file.bank.filter((q) => !disabledIds.has(String(q.id)));
      if (Array.isArray(file.mocks)) {
        file.mocks = file.mocks.map((m) => ({
          ...m,
          questionIds: (m.questionIds ?? []).filter((id) => !disabledIds.has(String(id))),
        }));
      }
    } else if (Array.isArray(file.tests)) {
      for (const t of file.tests) {
        t.questions = (t.questions ?? []).filter((q) => !disabledIds.has(String(q.id)));
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(file, null, 2) + "\n");
  topicsProcessed++;
}

console.log(JSON.stringify({
  topicsProcessed,
  questionsPatched,
  questionsDisabled,
  questionsNotFound,
}, null, 2));
