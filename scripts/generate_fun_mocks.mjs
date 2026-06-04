#!/usr/bin/env node
// Generate public/mocks/{daily,how-british}.json — 45 mocks × 24 Qs each.
// Uses Lovable AI Gateway to author a 540-question bank per topic.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "mocks");

const API_KEY = process.env.LOVABLE_API_KEY;
if (!API_KEY) {
  console.error("Missing LOVABLE_API_KEY");
  process.exit(1);
}

const TOPICS = [
  {
    slug: "daily",
    title: "General Knowledge Daily",
    category: "fun",
    prefix: "gk",
    systemTone:
      "You are an expert quiz writer creating general knowledge multiple-choice questions for a UK adult audience. Mix categories evenly: world & UK history, geography, science & nature, sports, arts & literature, music, film & TV, food & drink, language, mathematics, technology, and famous people. Difficulty: pub-quiz level (mostly medium, some easy, some hard). Keep questions factually accurate, unambiguous, and self-contained (no images required). British English spelling.",
  },
  {
    slug: "how-british",
    title: "How British Are You?",
    category: "fun",
    prefix: "hb",
    systemTone:
      "You are an expert quiz writer creating light-hearted, fun multiple-choice questions about British culture, customs and quirks. Cover tea & food, queueing, weather, slang & idioms, polite phrases, British TV & comedy, pub culture, the seaside, royal family trivia, regional accents, biscuits, sandwiches, sport (football, cricket, rugby, tennis), bank holidays, classic British things (red buses, phone boxes, Sunday roast). Tone: warm, witty, never mocking. British English spelling. Each question must have ONE clearly best answer based on common British cultural knowledge.",
  },
];

const BANK_SIZE = 540;
const BATCH_SIZE = 30;
const MOCKS = 45;
const PER_MOCK = 24;

async function callAI(messages) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`AI ${res.status}: ${t.slice(0, 300)}`);
  }
  const json = await res.json();
  const txt = json.choices?.[0]?.message?.content ?? "";
  return JSON.parse(txt);
}

async function generateBatch(topic, batchIndex, existingQuestionsSample) {
  const sys = `${topic.systemTone}

Output STRICT JSON: { "questions": [ { "question": string, "options": [string,string,string,string], "correctAnswer": 0|1|2|3, "explanation": string } ] }
Rules:
- Exactly ${BATCH_SIZE} questions.
- Exactly 4 options each, all plausible, ONE correct.
- correctAnswer is the 0-based index of the correct option.
- Explanation: 1 short sentence (≤ 200 chars) explaining why the answer is correct.
- No duplicates of prior batches. No question references "image" or "above".
- Vary topic coverage across the batch — do not cluster.`;

  const userMsg = `Batch ${batchIndex + 1}. Produce ${BATCH_SIZE} fresh questions for "${topic.title}".
${
  existingQuestionsSample.length
    ? `Do NOT repeat or rephrase any of these recent questions:\n${existingQuestionsSample
        .slice(-40)
        .map((q, i) => `${i + 1}. ${q}`)
        .join("\n")}`
    : ""
}`;

  const data = await callAI([
    { role: "system", content: sys },
    { role: "user", content: userMsg },
  ]);
  const qs = Array.isArray(data?.questions) ? data.questions : [];
  return qs.filter(
    (q) =>
      q &&
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.options.every((o) => typeof o === "string" && o.trim()) &&
      Number.isInteger(q.correctAnswer) &&
      q.correctAnswer >= 0 &&
      q.correctAnswer <= 3 &&
      typeof q.explanation === "string",
  );
}

function buildMocks(bank, topicSlug) {
  // Round-robin distribution: each mock gets 24 questions, cycling through the bank.
  // 45 * 24 = 1080 = 540 * 2 → each question used exactly twice across the 45 mocks,
  // but offset so no single mock repeats a question.
  const mocks = [];
  for (let m = 0; m < MOCKS; m++) {
    const ids = [];
    for (let q = 0; q < PER_MOCK; q++) {
      const idx = (m * PER_MOCK + q) % bank.length;
      ids.push(bank[idx].id);
    }
    mocks.push({
      mockNumber: m + 1,
      title: `Mock ${m + 1}`,
      questionIds: ids,
    });
  }
  return mocks;
}

async function generateTopic(topic) {
  console.log(`\n=== ${topic.slug} ===`);
  const outPath = join(OUT_DIR, `${topic.slug}.json`);
  // Resume if file already exists with partial bank.
  let bank = [];
  if (existsSync(outPath)) {
    try {
      const existing = JSON.parse(readFileSync(outPath, "utf8"));
      if (Array.isArray(existing.bank)) bank = existing.bank;
      console.log(`Resuming with ${bank.length} existing questions`);
    } catch {}
  }
  const seen = new Set(bank.map((q) => q.question.toLowerCase().trim()));
  let batchIdx = Math.floor(bank.length / BATCH_SIZE);
  while (bank.length < BANK_SIZE) {
    const sample = bank.slice(-40).map((q) => q.question);
    let qs;
    try {
      qs = await generateBatch(topic, batchIdx, sample);
    } catch (e) {
      console.error(`Batch ${batchIdx} failed:`, e.message);
      await new Promise((r) => setTimeout(r, 4000));
      continue;
    }
    let added = 0;
    for (const q of qs) {
      const key = q.question.toLowerCase().trim();
      if (seen.has(key)) continue;
      seen.add(key);
      const n = bank.length + 1;
      const id = `${topic.slug}-${topic.prefix}-${String(n).padStart(4, "0")}`;
      bank.push({
        id,
        type: "mcq",
        question: q.question.trim(),
        explanation: q.explanation.trim(),
        options: q.options.map((o) => o.trim()),
        correctAnswer: q.correctAnswer,
      });
      added++;
      if (bank.length >= BANK_SIZE) break;
    }
    console.log(`Batch ${batchIdx + 1}: +${added} (total ${bank.length}/${BANK_SIZE})`);
    batchIdx++;
    // Persist progress every batch.
    if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
    const partial = {
      version: 2,
      topic: topic.slug,
      title: topic.title,
      category: topic.category,
      bank,
      mocks: buildMocks(bank.length >= BANK_SIZE ? bank : padBank(bank), topic.slug),
    };
    writeFileSync(outPath, JSON.stringify(partial, null, 2));
  }
  const finalDoc = {
    version: 2,
    topic: topic.slug,
    title: topic.title,
    category: topic.category,
    bank,
    mocks: buildMocks(bank, topic.slug),
  };
  writeFileSync(outPath, JSON.stringify(finalDoc, null, 2));
  console.log(`✔ wrote ${outPath} (${bank.length} bank, ${finalDoc.mocks.length} mocks)`);
}

function padBank(bank) {
  // For interim writes when bank not yet full — pad by cycling so buildMocks doesn't divide by 0.
  if (bank.length === 0) return [{ id: "placeholder" }];
  return bank;
}

(async () => {
  for (const t of TOPICS) {
    await generateTopic(t);
  }
})();
