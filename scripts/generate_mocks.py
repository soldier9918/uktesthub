#!/usr/bin/env python3
"""
Generate mock tests for UK Test Hub topics using Lovable AI Gateway.

Two pipelines live in this script:

  v1 (legacy "baked" mocks) — kept for back-compat:
      python scripts/generate_mocks.py legacy-mock --topics fire-safety

  v2 (question bank + rotation), spreadsheet-driven:
      python scripts/generate_mocks.py bank        --topic fire-safety
      python scripts/generate_mocks.py assemble    --topic fire-safety
      python scripts/generate_mocks.py validate    --topic fire-safety
      python scripts/generate_mocks.py migrate-legacy --topic fire-safety

Topic config comes from scripts/topic-requirements.json
(generated from REQUIREMENTS.xlsx by scripts/parse_requirements.py).

Per-topic file (v2): src/data/mocks/<topic-slug>.json
  {
    "version": 2, "topic": "...", "title": "...", "category": "...",
    "bank":  [ { id, type, ...question fields } ],
    "mocks": [ { mockNumber, title, questionIds: [...] } ]
  }

The bank generator is resumable: it tops up each type-bucket to its quota and
saves after every batch.
"""

import argparse
import hashlib
import json
import math
import os
import random
import sys
import time
from collections import Counter, defaultdict
from pathlib import Path

import requests

GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions"
MODEL = "google/gemini-3-flash-preview"
ROOT = Path(__file__).resolve().parent.parent
MOCKS_DIR = ROOT / "src" / "data" / "mocks"
REQS_PATH = ROOT / "scripts" / "topic-requirements.json"

QUESTIONS_PER_MOCK = 24
TOTAL_MOCKS_PER_TOPIC = 45
BATCH_SIZE = 12  # questions per AI call when filling the bank

# Spreadsheet types use snake_case; runtime + JSON files use the same
# snake_case (the loader normalises to hyphens). All 8 types live here.
SUPPORTED_TYPES = {
    "multiple_choice",
    "image_question",
    "true_false",
    "dropdown_blanks",
    "drag_drop_blanks",
    "multiple_response",
    "hot_spot",
    "numeric_entry",
}

# ---------------------------------------------------------------------------
# Topic subjects (used as the AI "subject" prompt). Falls back to the title
# from the spreadsheet if a slug isn't listed here.
# ---------------------------------------------------------------------------
TOPIC_SUBJECTS = {
    "driving-theory": "official UK DVSA Driving Theory Test for car drivers (Highway Code, road safety, vehicle handling, hazard awareness, alertness, attitude, road signs)",
    "hazard-perception": "the UK Hazard Perception Test (developing hazards, anticipating road dangers, scanning techniques, response timing)",
    "road-signs": "UK road signs, traffic signals and road markings (warning signs, regulatory signs, information signs, motorway signs, road markings)",
    "motorcycle-theory": "the UK DVSA Motorcycle Theory Test (Highway Code for motorcyclists, motorcycle safety, protective equipment, riding techniques)",
    "life-in-the-uk": "the official Life in the UK Test (UK history, traditions, government, law, geography, culture)",
    "british-citizenship": "British citizenship knowledge (Westminster system, monarchy, devolved governments, naturalisation, British values)",
    "uk-laws-rights": "UK laws and citizen rights (criminal vs civil law, employment rights, consumer rights, courts, the police, voting rights)",
    "uk-geography": "UK geography (countries of the UK, capital cities, rivers, mountains, counties, islands, landmarks, regions)",
    "fire-safety": "UK Fire Safety Awareness training (Regulatory Reform (Fire Safety) Order 2005, fire triangle, classes of fire A-F, extinguisher types and colours, evacuation procedures, fire wardens, fire doors, risk assessment, alarm systems, PEEPs)",
    "manual-handling": "UK Manual Handling training (Manual Handling Operations Regulations 1992, TILE/LITE assessment, safe lifting techniques, MSDs, mechanical aids, employer/employee duties)",
    "health-safety-awareness": "UK Health & Safety Awareness (HSWA 1974, HSE, RIDDOR, COSHH, risk assessment, PPE hierarchy of control, accident reporting, signage)",
    "gdpr-awareness": "UK GDPR and Data Protection Act 2018 awareness (7 principles, lawful bases, data subject rights, ICO, breach notification, DPIA, DPO, special category data, retention)",
    "cscs": "the UK CSCS Health, Safety and Environment test for construction operatives (PPE, working at height, manual handling, hazardous substances, fire safety, site rules)",
    "sia": "the UK SIA Door Supervisor / Security Guard licence test (legislation, conflict management, physical intervention awareness, emergency procedures)",
    "seru": "the Transport for London SERU assessment for Private Hire drivers (safety, equality, regulatory requirements, customer service in London)",
    "food-hygiene": "Food Hygiene Level 2 for catering (food safety, cross-contamination, temperature control, personal hygiene, allergens, HACCP)",
    "first-aid": "Emergency First Aid at Work theory (DRABC, CPR, choking, bleeding, shock, burns, fractures, recovery position)",
}


# ---------------------------------------------------------------------------
# Shared HTTP / AI helpers
# ---------------------------------------------------------------------------

def get_api_key():
    api_key = os.environ.get("LOVABLE_API_KEY")
    if not api_key:
        print("LOVABLE_API_KEY env var not set", file=sys.stderr)
        sys.exit(1)
    return api_key


def post_ai(api_key: str, body: dict, retries: int = 3):
    """POST to the gateway with retry/backoff. Returns parsed JSON."""
    last_err = None
    for attempt in range(retries):
        try:
            r = requests.post(
                GATEWAY,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=body,
                timeout=180,
            )
            if r.status_code == 429:
                wait = 30 * (attempt + 1)
                print(f"  ! rate-limited, sleeping {wait}s")
                time.sleep(wait)
                continue
            if r.status_code == 402:
                print("  ! 402 payment required — out of AI credits", file=sys.stderr)
                sys.exit(2)
            r.raise_for_status()
            return r.json()
        except Exception as e:  # noqa: BLE001
            last_err = e
            print(f"  ! attempt {attempt + 1} failed: {e}")
            time.sleep(5 * (attempt + 1))
    raise RuntimeError(f"post_ai failed: {last_err}")


# ---------------------------------------------------------------------------
# Per-type tool schemas (one per supported question type)
# ---------------------------------------------------------------------------

def _items_schema(qtype: str, batch_size: int) -> dict:
    """Return the JSON schema for an items array of a given question type."""
    if qtype == "multiple_choice":
        return {
            "type": "object",
            "properties": {
                "type": {"type": "string", "enum": ["multiple_choice"]},
                "question": {"type": "string", "minLength": 8, "maxLength": 400},
                "options": {
                    "type": "array",
                    "minItems": 4, "maxItems": 4,
                    "items": {"type": "string", "minLength": 1, "maxLength": 200},
                },
                "correctAnswer": {"type": "integer", "minimum": 0, "maximum": 3},
                "explanation": {"type": "string", "minLength": 8, "maxLength": 400},
            },
            "required": ["type", "question", "options", "correctAnswer", "explanation"],
        }

    if qtype == "true_false":
        return {
            "type": "object",
            "properties": {
                "type": {"type": "string", "enum": ["true_false"]},
                "question": {"type": "string", "minLength": 8, "maxLength": 400},
                "correctAnswer": {"type": "boolean"},
                "explanation": {"type": "string", "minLength": 8, "maxLength": 400},
            },
            "required": ["type", "question", "correctAnswer", "explanation"],
        }

    if qtype == "multiple_response":
        return {
            "type": "object",
            "properties": {
                "type": {"type": "string", "enum": ["multiple_response"]},
                "question": {"type": "string", "minLength": 8, "maxLength": 400},
                "options": {
                    "type": "array",
                    "minItems": 4, "maxItems": 6,
                    "items": {"type": "string", "minLength": 1, "maxLength": 200},
                },
                "correctAnswers": {
                    "type": "array",
                    "minItems": 2, "maxItems": 5,
                    "items": {"type": "integer", "minimum": 0, "maximum": 5},
                },
                "explanation": {"type": "string", "minLength": 8, "maxLength": 400},
            },
            "required": ["type", "question", "options", "correctAnswers", "explanation"],
        }

    if qtype == "numeric_entry":
        return {
            "type": "object",
            "properties": {
                "type": {"type": "string", "enum": ["numeric_entry"]},
                "question": {"type": "string", "minLength": 8, "maxLength": 400},
                "correctAnswer": {"type": "number"},
                "tolerance": {"type": "number"},
                "unit": {"type": "string", "maxLength": 20},
                "explanation": {"type": "string", "minLength": 8, "maxLength": 400},
            },
            "required": ["type", "question", "correctAnswer", "explanation"],
        }

    if qtype == "dropdown_blanks":
        return {
            "type": "object",
            "properties": {
                "type": {"type": "string", "enum": ["dropdown_blanks"]},
                "prompt": {"type": "string", "maxLength": 200},
                "template": {"type": "string", "minLength": 8, "maxLength": 500,
                             "description": "Sentence with placeholders {{0}}, {{1}}, etc."},
                "blanks": {
                    "type": "array",
                    "minItems": 1, "maxItems": 4,
                    "items": {
                        "type": "object",
                        "properties": {
                            "options": {
                                "type": "array",
                                "minItems": 3, "maxItems": 5,
                                "items": {"type": "string", "minLength": 1, "maxLength": 80},
                            },
                            "correctIndex": {"type": "integer", "minimum": 0, "maximum": 4},
                        },
                        "required": ["options", "correctIndex"],
                    },
                },
                "explanation": {"type": "string", "minLength": 8, "maxLength": 400},
            },
            "required": ["type", "template", "blanks", "explanation"],
        }

    if qtype == "drag_drop_blanks":
        # Same shape as dropdown_blanks; renderer differs.
        s = _items_schema("dropdown_blanks", batch_size)
        s["properties"]["type"]["enum"] = ["drag_drop_blanks"]
        return s

    if qtype == "image_question":
        return {
            "type": "object",
            "properties": {
                "type": {"type": "string", "enum": ["image_question"]},
                "question": {"type": "string", "minLength": 8, "maxLength": 400},
                "imageDescription": {
                    "type": "string", "minLength": 8, "maxLength": 300,
                    "description": "Detailed description so we can fetch / generate the image later.",
                },
                "imageAlt": {"type": "string", "minLength": 4, "maxLength": 200},
                "options": {
                    "type": "array",
                    "minItems": 4, "maxItems": 4,
                    "items": {"type": "string", "minLength": 1, "maxLength": 200},
                },
                "correctAnswer": {"type": "integer", "minimum": 0, "maximum": 3},
                "explanation": {"type": "string", "minLength": 8, "maxLength": 400},
            },
            "required": ["type", "question", "imageDescription", "imageAlt",
                         "options", "correctAnswer", "explanation"],
        }

    if qtype == "hot_spot":
        return {
            "type": "object",
            "properties": {
                "type": {"type": "string", "enum": ["hot_spot"]},
                "question": {"type": "string", "minLength": 8, "maxLength": 400},
                "imageDescription": {"type": "string", "minLength": 8, "maxLength": 300},
                "imageAlt": {"type": "string", "minLength": 4, "maxLength": 200},
                "spots": {
                    "type": "array",
                    "minItems": 2, "maxItems": 6,
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "string", "minLength": 1, "maxLength": 20},
                            "label": {"type": "string", "minLength": 1, "maxLength": 80},
                            "x": {"type": "number", "minimum": 0, "maximum": 1},
                            "y": {"type": "number", "minimum": 0, "maximum": 1},
                            "w": {"type": "number", "minimum": 0.02, "maximum": 1},
                            "h": {"type": "number", "minimum": 0.02, "maximum": 1},
                        },
                        "required": ["id", "label", "x", "y", "w", "h"],
                    },
                },
                "correctSpotId": {"type": "string", "minLength": 1, "maxLength": 20},
                "explanation": {"type": "string", "minLength": 8, "maxLength": 400},
            },
            "required": ["type", "question", "imageDescription", "imageAlt",
                         "spots", "correctSpotId", "explanation"],
        }

    raise ValueError(f"unknown question type: {qtype}")


def build_tool_for(qtype: str, batch_size: int) -> dict:
    return {
        "type": "function",
        "function": {
            "name": "submit_questions",
            "description": f"Submit a batch of {batch_size} unique '{qtype}' questions.",
            "parameters": {
                "type": "object",
                "properties": {
                    "questions": {
                        "type": "array",
                        "minItems": batch_size,
                        "maxItems": batch_size,
                        "items": _items_schema(qtype, batch_size),
                    }
                },
                "required": ["questions"],
            },
        },
    }


# ---------------------------------------------------------------------------
# Bank file IO
# ---------------------------------------------------------------------------

def bank_path(topic_slug: str) -> Path:
    return MOCKS_DIR / f"{topic_slug}.json"


def load_bank(topic_slug: str, title: str, category: str) -> dict:
    p = bank_path(topic_slug)
    if p.exists():
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            data = {}
        if data.get("version") == 2:
            data.setdefault("title", title)
            data.setdefault("category", category)
            data.setdefault("bank", [])
            data.setdefault("mocks", [])
            return data
    # Otherwise return a fresh skeleton (legacy v1 files are migrated separately).
    return {
        "version": 2,
        "topic": topic_slug,
        "title": title,
        "category": category,
        "bank": [],
        "mocks": [],
    }


def save_bank(topic_slug: str, payload: dict) -> None:
    MOCKS_DIR.mkdir(parents=True, exist_ok=True)
    p = bank_path(topic_slug)
    p.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def fingerprint(q: dict) -> str:
    """Stable hash for a question used for de-dup. Ignores id/order."""
    parts = [q.get("type", "")]
    if "question" in q:
        parts.append(q["question"].strip().lower())
    if "template" in q:
        parts.append(q["template"].strip().lower())
    if "options" in q and isinstance(q["options"], list):
        parts.append("|".join(o.strip().lower() for o in q["options"]))
    return hashlib.sha1("\u0001".join(parts).encode("utf-8")).hexdigest()


def next_id(topic_slug: str, existing_ids: set, qtype: str) -> str:
    prefix = "".join(w[0] for w in topic_slug.split("-"))[:4] or "q"
    type_short = {
        "multiple_choice": "mc",
        "true_false": "tf",
        "multiple_response": "mr",
        "numeric_entry": "ne",
        "dropdown_blanks": "db",
        "drag_drop_blanks": "dd",
        "image_question": "im",
        "hot_spot": "hs",
    }.get(qtype, "q")
    n = 1
    while True:
        candidate = f"{prefix}-{type_short}-{n:04d}"
        if candidate not in existing_ids:
            return candidate
        n += 1


# ---------------------------------------------------------------------------
# Quotas (how many of each type the bank should contain)
# ---------------------------------------------------------------------------

def compute_quotas(weights: dict, pool_size: int) -> dict:
    """Largest-remainder split of pool_size across weighted types."""
    totals = {t: pool_size * w for t, w in weights.items() if t in SUPPORTED_TYPES}
    base = {t: int(math.floor(v)) for t, v in totals.items()}
    remainder = pool_size - sum(base.values())
    fractional = sorted(
        ((totals[t] - base[t], t) for t in totals),
        reverse=True,
    )
    for _, t in fractional[:remainder]:
        base[t] += 1
    return base


def per_mock_counts(weights: dict, per_mock: int) -> dict:
    """Same largest-remainder split applied to a single mock."""
    totals = {t: per_mock * w for t, w in weights.items() if t in SUPPORTED_TYPES}
    base = {t: int(math.floor(v)) for t, v in totals.items()}
    remainder = per_mock - sum(base.values())
    fractional = sorted(
        ((totals[t] - base[t], t) for t in totals),
        reverse=True,
    )
    for _, t in fractional[:remainder]:
        base[t] += 1
    return base


# ---------------------------------------------------------------------------
# bank — fill the question bank for one topic
# ---------------------------------------------------------------------------

def cmd_bank(args):
    api_key = get_api_key()
    reqs = json.loads(REQS_PATH.read_text(encoding="utf-8"))
    if args.topic not in reqs:
        print(f"unknown topic: {args.topic}", file=sys.stderr)
        sys.exit(1)
    cfg = reqs[args.topic]
    title = cfg.get("title") or args.topic
    category = cfg.get("category", "")
    weights = cfg.get("weights", {})
    pool_size = int(cfg.get("poolSize") or 650)
    quotas = compute_quotas(weights, pool_size)

    payload = load_bank(args.topic, title, category)
    bank = payload["bank"]
    by_type = defaultdict(list)
    seen_fp = set()
    seen_ids = set()
    for q in bank:
        by_type[q.get("type")].append(q)
        seen_fp.add(fingerprint(q))
        if q.get("id"):
            seen_ids.add(q["id"])

    print(f"\n=== bank: {args.topic} ===")
    print(f"   pool_size={pool_size}  quotas={quotas}")
    print(f"   existing: " + ", ".join(f"{t}={len(by_type[t])}" for t in quotas))

    subject = TOPIC_SUBJECTS.get(args.topic, title)

    for qtype, target in quotas.items():
        have = len(by_type[qtype])
        need = target - have
        if need <= 0:
            print(f"   ✓ {qtype}: full ({have}/{target})")
            continue
        print(f"   → {qtype}: need {need} more (have {have}/{target})")

        while need > 0:
            batch = min(BATCH_SIZE, need)
            tool = build_tool_for(qtype, batch)
            system = (
                f"You are an expert exam writer for {subject}. "
                "Write realistic UK-context questions in clear, plain English. "
                "Use UK English spelling. Each question must have a concise 1–2 sentence "
                "explanation. Never repeat the same question. Vary sub-topics. "
                "Do not reference specific images you cannot describe."
            )
            avoid_lines = []
            sample_existing = by_type[qtype][-20:]
            for ex in sample_existing:
                if "question" in ex:
                    avoid_lines.append(f"- {ex['question'][:120]}")
                elif "template" in ex:
                    avoid_lines.append(f"- {ex['template'][:120]}")
            avoid_block = ("\n\nDO NOT repeat these recently-used questions:\n"
                           + "\n".join(avoid_lines)) if avoid_lines else ""
            user = (
                f"Generate exactly {batch} unique '{qtype}' questions for the {title}. "
                "Mix easy, medium and harder questions and cover a variety of sub-topics."
                + avoid_block
            )
            body = {
                "model": MODEL,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                "tools": [tool],
                "tool_choice": {"type": "function", "function": {"name": "submit_questions"}},
            }
            try:
                data = post_ai(api_key, body)
                tcs = data["choices"][0]["message"].get("tool_calls") or []
                if not tcs:
                    raise RuntimeError("no tool_calls in response")
                qs = json.loads(tcs[0]["function"]["arguments"]).get("questions") or []
            except Exception as e:  # noqa: BLE001
                print(f"     × batch failed: {e}", file=sys.stderr)
                time.sleep(5)
                continue

            added = 0
            for q in qs:
                fp = fingerprint(q)
                if fp in seen_fp:
                    continue
                seen_fp.add(fp)
                q["id"] = next_id(args.topic, seen_ids, qtype)
                seen_ids.add(q["id"])
                bank.append(q)
                by_type[qtype].append(q)
                added += 1
                need -= 1
                if need <= 0:
                    break
            save_bank(args.topic, payload)
            print(f"     + added {added}/{batch}, remaining {need}")
            time.sleep(args.delay)

    print(f"   ✓ bank done: {len(bank)} total questions")


# ---------------------------------------------------------------------------
# assemble — build 45 mock slots from the bank (no AI calls)
# ---------------------------------------------------------------------------

def cmd_assemble(args):
    reqs = json.loads(REQS_PATH.read_text(encoding="utf-8"))
    if args.topic not in reqs:
        print(f"unknown topic: {args.topic}", file=sys.stderr)
        sys.exit(1)
    cfg = reqs[args.topic]
    title = cfg.get("title") or args.topic
    category = cfg.get("category", "")
    weights = cfg.get("weights", {})
    per_mock = int(cfg.get("questionsPerMock") or QUESTIONS_PER_MOCK)
    total_mocks = int(cfg.get("totalMocks") or TOTAL_MOCKS_PER_TOPIC)

    payload = load_bank(args.topic, title, category)
    bank = payload["bank"]
    if not bank:
        print(f"empty bank for {args.topic}; run `bank` first", file=sys.stderr)
        sys.exit(1)

    by_type = defaultdict(list)
    for q in bank:
        by_type[q["type"]].append(q["id"])

    counts = per_mock_counts(weights, per_mock)
    print(f"\n=== assemble: {args.topic} ===")
    print(f"   per-mock counts: {counts} (sum={sum(counts.values())})")

    rng = random.Random(args.seed)

    # Round-robin queues per type so we exhaust the bank before reusing.
    queues = {}
    for t, ids in by_type.items():
        order = ids[:]
        rng.shuffle(order)
        queues[t] = order

    cursors = {t: 0 for t in queues}

    def take(t: str, n: int, exclude: set) -> list:
        """Take n distinct ids of type t, skipping anything in `exclude`."""
        out = []
        if t not in queues or not queues[t]:
            return out
        attempts = 0
        max_attempts = len(queues[t]) * 3
        while len(out) < n and attempts < max_attempts:
            qid = queues[t][cursors[t] % len(queues[t])]
            cursors[t] += 1
            attempts += 1
            if qid in exclude:
                continue
            out.append(qid)
            exclude.add(qid)
        return out

    mocks = []
    for n in range(1, total_mocks + 1):
        used = set()
        ids = []
        for qtype, count in counts.items():
            if count <= 0:
                continue
            picked = take(qtype, count, used)
            if len(picked) < count:
                # Fall back: pad with any remaining type to keep mock at length.
                for other in queues:
                    if other == qtype:
                        continue
                    extra = take(other, count - len(picked), used)
                    picked.extend(extra)
                    if len(picked) >= count:
                        break
            ids.extend(picked)

        # Final length guard.
        if len(ids) < per_mock:
            for other in queues:
                extra = take(other, per_mock - len(ids), used)
                ids.extend(extra)
                if len(ids) >= per_mock:
                    break
        ids = ids[:per_mock]

        # Shuffle question order within the mock (deterministic per mock).
        local = random.Random(args.seed + n)
        local.shuffle(ids)
        mocks.append({
            "mockNumber": n,
            "title": f"{title} Test {n}",
            "questionIds": ids,
        })

    payload["mocks"] = mocks
    save_bank(args.topic, payload)
    print(f"   ✓ assembled {len(mocks)} mocks")


# ---------------------------------------------------------------------------
# validate — report on a topic file
# ---------------------------------------------------------------------------

def cmd_validate(args):
    p = bank_path(args.topic)
    if not p.exists():
        print(f"no file at {p}", file=sys.stderr)
        sys.exit(1)
    data = json.loads(p.read_text(encoding="utf-8"))
    if data.get("version") != 2:
        print(f"file is not v2 (legacy baked) — run migrate-legacy first")
        sys.exit(1)
    bank = data.get("bank", [])
    mocks = data.get("mocks", [])

    type_counts = Counter(q.get("type") for q in bank)
    fp_counts = Counter(fingerprint(q) for q in bank)
    duplicates = [fp for fp, c in fp_counts.items() if c > 1]
    missing_explanation = [q.get("id") for q in bank if not q.get("explanation")]
    missing_image_alt = [
        q.get("id") for q in bank
        if q.get("type") in ("image_question", "hot_spot") and not q.get("imageAlt")
    ]
    missing_image_desc = [
        q.get("id") for q in bank
        if q.get("type") in ("image_question", "hot_spot")
        and not (q.get("imageDescription") or q.get("image"))
    ]

    bank_ids = {q.get("id") for q in bank}
    bad_refs = []
    intra_dups = []
    for m in mocks:
        ids = m.get("questionIds", [])
        if len(set(ids)) != len(ids):
            intra_dups.append(m.get("mockNumber"))
        for qid in ids:
            if qid not in bank_ids:
                bad_refs.append((m.get("mockNumber"), qid))

    print(f"\n=== validate: {args.topic} ===")
    print(f"   bank size: {len(bank)}")
    print(f"   types: {dict(type_counts)}")
    print(f"   mocks: {len(mocks)}  (target: {data.get('mocks') and TOTAL_MOCKS_PER_TOPIC})")
    print(f"   duplicate fingerprints: {len(duplicates)}")
    print(f"   missing explanation: {len(missing_explanation)}")
    print(f"   image questions missing alt: {len(missing_image_alt)}")
    print(f"   image questions missing source: {len(missing_image_desc)}")
    print(f"   intra-mock duplicates: {len(intra_dups)}")
    print(f"   bad question refs: {len(bad_refs)}")
    if duplicates:
        print(f"     dup fp samples: {duplicates[:3]}")
    if bad_refs:
        print(f"     bad ref samples: {bad_refs[:5]}")


# ---------------------------------------------------------------------------
# migrate-legacy — convert a v1 baked-mocks file into a v2 bank file
# ---------------------------------------------------------------------------

def cmd_migrate_legacy(args):
    p = bank_path(args.topic)
    if not p.exists():
        print(f"no file at {p}", file=sys.stderr)
        sys.exit(1)
    data = json.loads(p.read_text(encoding="utf-8"))
    if data.get("version") == 2:
        print(f"already v2: {args.topic}")
        return

    reqs = json.loads(REQS_PATH.read_text(encoding="utf-8"))
    cfg = reqs.get(args.topic, {})
    title = cfg.get("title") or args.topic
    category = cfg.get("category", "")

    bank = []
    seen_fp = set()
    seen_ids = set()
    for test in data.get("tests", []):
        for raw in test.get("questions", []):
            q = dict(raw)
            # Legacy questions are MCQ unless tagged otherwise.
            qtype = q.get("type") or "multiple_choice"
            if qtype == "mcq":
                qtype = "multiple_choice"
            elif qtype == "fill-blanks":
                qtype = "dropdown_blanks"
            q["type"] = qtype
            fp = fingerprint(q)
            if fp in seen_fp:
                continue
            seen_fp.add(fp)
            qid = next_id(args.topic, seen_ids, qtype)
            seen_ids.add(qid)
            q["id"] = qid
            bank.append(q)

    payload = {
        "version": 2,
        "topic": args.topic,
        "title": title,
        "category": category,
        "bank": bank,
        "mocks": [],
    }
    save_bank(args.topic, payload)
    print(f"   ✓ migrated {args.topic}: {len(bank)} unique questions in bank "
          f"(was {sum(len(t.get('questions', [])) for t in data.get('tests', []))} across "
          f"{len(data.get('tests', []))} mocks)")


# ---------------------------------------------------------------------------
# legacy-mock — original v1 baked-mocks generator (kept for back-compat)
# ---------------------------------------------------------------------------

LEGACY_TOOL = {
    "type": "function",
    "function": {
        "name": "submit_mock_test",
        "description": "Submit a mock test with exactly 24 unique multiple-choice questions.",
        "parameters": {
            "type": "object",
            "properties": {
                "questions": {
                    "type": "array",
                    "minItems": QUESTIONS_PER_MOCK,
                    "maxItems": QUESTIONS_PER_MOCK,
                    "items": {
                        "type": "object",
                        "properties": {
                            "question": {"type": "string", "minLength": 8, "maxLength": 400},
                            "options": {
                                "type": "array",
                                "minItems": 4, "maxItems": 4,
                                "items": {"type": "string", "minLength": 1, "maxLength": 200},
                            },
                            "correctAnswer": {"type": "integer", "minimum": 0, "maximum": 3},
                            "explanation": {"type": "string", "minLength": 8, "maxLength": 400},
                        },
                        "required": ["question", "options", "correctAnswer", "explanation"],
                    },
                }
            },
            "required": ["questions"],
        },
    },
}


def cmd_legacy_mock(args):
    api_key = get_api_key()
    reqs = json.loads(REQS_PATH.read_text(encoding="utf-8"))
    topics = args.topics or list(reqs.keys())
    for topic_slug in topics:
        cfg = reqs.get(topic_slug)
        if not cfg:
            print(f"unknown topic: {topic_slug}", file=sys.stderr)
            continue
        title = cfg.get("title") or topic_slug
        subject = TOPIC_SUBJECTS.get(topic_slug, title)
        p = bank_path(topic_slug)
        payload = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {"topic": topic_slug, "tests": []}
        if "tests" not in payload:
            payload = {"topic": topic_slug, "tests": []}
        done = {t["mockNumber"] for t in payload["tests"]}
        print(f"\n=== legacy-mock: {topic_slug} ({len(done)} done) ===")

        system = (
            f"You are an expert exam writer for {subject}. "
            "Write realistic UK-context multiple-choice questions in clear plain English. "
            "Each question must have exactly 4 distinct plausible options, one correct answer "
            "(0-based index), and a 1–2 sentence explanation. Use UK English spelling."
        )
        for n in range(args.start, args.end + 1):
            if n in done:
                continue
            user = (f"Generate mock test #{n} for the {title}. "
                    f"Produce exactly {QUESTIONS_PER_MOCK} unique multiple-choice questions.")
            body = {
                "model": MODEL,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                "tools": [LEGACY_TOOL],
                "tool_choice": {"type": "function", "function": {"name": "submit_mock_test"}},
            }
            try:
                data = post_ai(api_key, body)
                qs = json.loads(data["choices"][0]["message"]["tool_calls"][0]["function"]["arguments"])["questions"]
                payload["tests"].append({
                    "slug": f"{topic_slug}-mock-{n}",
                    "topic": topic_slug,
                    "mockNumber": n,
                    "title": f"{title} Test {n}",
                    "questions": qs,
                })
                payload["tests"].sort(key=lambda t: t["mockNumber"])
                p.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
                print(f"   ✓ mock #{n} saved")
                time.sleep(args.delay)
            except Exception as e:  # noqa: BLE001
                print(f"   × mock #{n} failed: {e}", file=sys.stderr)


# ---------------------------------------------------------------------------
# entry point
# ---------------------------------------------------------------------------

def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)

    p_bank = sub.add_parser("bank", help="Fill the per-type question bank for a topic")
    p_bank.add_argument("--topic", required=True)
    p_bank.add_argument("--delay", type=float, default=1.0)
    p_bank.set_defaults(func=cmd_bank)

    p_asm = sub.add_parser("assemble", help="Assemble 45 mocks from the bank (no AI)")
    p_asm.add_argument("--topic", required=True)
    p_asm.add_argument("--seed", type=int, default=42)
    p_asm.set_defaults(func=cmd_assemble)

    p_val = sub.add_parser("validate", help="Validate a topic's bank + mocks")
    p_val.add_argument("--topic", required=True)
    p_val.set_defaults(func=cmd_validate)

    p_mig = sub.add_parser("migrate-legacy", help="Convert v1 baked mocks into a v2 bank")
    p_mig.add_argument("--topic", required=True)
    p_mig.set_defaults(func=cmd_migrate_legacy)

    p_leg = sub.add_parser("legacy-mock", help="Original v1 mock generator")
    p_leg.add_argument("--topics", nargs="*")
    p_leg.add_argument("--start", type=int, default=1)
    p_leg.add_argument("--end", type=int, default=TOTAL_MOCKS_PER_TOPIC)
    p_leg.add_argument("--delay", type=float, default=1.5)
    p_leg.set_defaults(func=cmd_legacy_mock)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
