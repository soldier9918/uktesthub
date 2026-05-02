#!/usr/bin/env python3
"""Rebalance mock test files so each individual mock matches the configured
type weights from scripts/topic-requirements.json.

For topics whose bank lacks certain required types, we synthesize them
deterministically from existing questions:
  * dropdown_blanks/drag_drop_blanks <-> mcq (interchangeable)
  * mcq -> true_false (statement form using correct option)
  * mcq -> multiple_response (combine 2 correct-style options)
  * mcq -> image_question (only when an image_url field exists; otherwise skip)

Only topics flagged as non-compliant by the audit are rewritten.
"""
import json
import os
import random
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MOCKS_DIR = ROOT / "src" / "data" / "mocks"
REQ_PATH = ROOT / "scripts" / "topic-requirements.json"

REQ = json.loads(REQ_PATH.read_text())

# Topics that the audit flagged as non-compliant.
TARGET_TOPICS = [
    "grammar", "nhs-literacy", "toefl", "uk-geography", "uk-laws-rights",
    "ph-hmrc-tax-check", "ph-london-regulations", "ph-passenger-safety",
    "esol", "verbal", "logical",
]

QUESTIONS_PER_MOCK = 24


def norm_type(t):
    if not t:
        return "multiple_choice"
    return t.replace("-", "_").replace("mcq", "multiple_choice")


def target_counts(weights, total=QUESTIONS_PER_MOCK):
    """Compute integer counts per type that sum to `total`, using largest-
    remainder rounding."""
    raw = {t: w * total for t, w in weights.items()}
    floors = {t: int(v) for t, v in raw.items()}
    remainder = total - sum(floors.values())
    # distribute remainder by largest fractional part (then by weight desc, then name)
    order = sorted(
        weights.keys(),
        key=lambda t: (-(raw[t] - floors[t]), -weights[t], t),
    )
    for t in order[:remainder]:
        floors[t] += 1
    return floors


# ---------- Synthesis helpers ----------

def mcq_to_true_false(mcq, idx):
    """Convert MCQ -> true/false statement using the correct option."""
    correct = mcq["options"][mcq["correctAnswer"]]
    q = mcq["question"].rstrip(" ?.")
    # Build statement form
    statement = f"Statement: {q} — {correct}."
    return {
        "id": f"{mcq['id']}-tf{idx}",
        "type": "true_false",
        "question": statement,
        "correctAnswer": True,
        "explanation": mcq.get("explanation", ""),
    }


def mcq_to_false_tf(mcq, idx):
    """Convert MCQ -> false statement using a wrong option."""
    wrong_idx = next((i for i in range(len(mcq["options"])) if i != mcq["correctAnswer"]), 0)
    wrong = mcq["options"][wrong_idx]
    correct = mcq["options"][mcq["correctAnswer"]]
    q = mcq["question"].rstrip(" ?.")
    statement = f"Statement: {q} — {wrong}."
    return {
        "id": f"{mcq['id']}-tff{idx}",
        "type": "true_false",
        "question": statement,
        "correctAnswer": False,
        "explanation": f"The correct answer is: {correct}. {mcq.get('explanation', '')}".strip(),
    }


def mcq_to_multi_response(mcq, partner, idx):
    """Combine two MCQs into a multi-response: pick the correct option from
    each plus 2 distractors, mark the two correct ones."""
    a_correct = mcq["options"][mcq["correctAnswer"]]
    b_correct = partner["options"][partner["correctAnswer"]]
    a_wrong = next((o for i, o in enumerate(mcq["options"]) if i != mcq["correctAnswer"]), "None of the above")
    b_wrong = next((o for i, o in enumerate(partner["options"]) if i != partner["correctAnswer"]), "None of the above")
    options = [a_correct, a_wrong, b_correct, b_wrong]
    correct_idx = [0, 2]
    return {
        "id": f"{mcq['id']}-mr{idx}",
        "type": "multiple_response",
        "question": f"Select all correct statements relating to: {mcq['question'].rstrip(' ?.')}",
        "options": options,
        "correctAnswers": correct_idx,
        "explanation": (mcq.get("explanation") or "") + " " + (partner.get("explanation") or ""),
    }


def dropdown_to_mcq(dd, idx):
    """Convert a dropdown_blanks question to an MCQ asking which word fills the blank."""
    blank = dd["blanks"][0] if dd.get("blanks") else None
    if not blank:
        return None
    sentence = re.sub(r"\{\{\d+\}\}", "_____", dd["template"])
    return {
        "id": f"{dd['id']}-mc{idx}",
        "type": "multiple_choice",
        "question": f"Choose the word or phrase that best completes the sentence: \"{sentence}\"",
        "options": list(blank["options"]),
        "correctAnswer": blank["correctIndex"],
        "explanation": dd.get("explanation", ""),
    }


def dropdown_to_drag_drop(dd, idx):
    out = dict(dd)
    out["type"] = "drag_drop_blanks"
    out["id"] = f"{dd['id']}-dd{idx}"
    return out


def dropdown_to_true_false(dd, idx):
    blank = dd["blanks"][0] if dd.get("blanks") else None
    if not blank:
        return None
    correct = blank["options"][blank["correctIndex"]]
    sentence = re.sub(r"\{\{\d+\}\}", correct, dd["template"])
    return {
        "id": f"{dd['id']}-tf{idx}",
        "type": "true_false",
        "question": f"Statement: \"{sentence}\" — this sentence is grammatically correct.",
        "correctAnswer": True,
        "explanation": dd.get("explanation", ""),
    }


def mcq_to_dropdown(mcq, idx):
    """Turn MCQ into a dropdown_blanks (single blank) where the question becomes a
    sentence and options become the dropdown choices."""
    q = mcq["question"].rstrip(" ?.")
    template = f"The correct answer to the question \"{q}\" is {{{{0}}}}."
    return {
        "id": f"{mcq['id']}-db{idx}",
        "type": "dropdown_blanks",
        "prompt": "Select the correct option",
        "template": template,
        "blanks": [{
            "options": list(mcq["options"]),
            "correctIndex": mcq["correctAnswer"],
        }],
        "explanation": mcq.get("explanation", ""),
    }


def mcq_to_drag_drop(mcq, idx):
    base = mcq_to_dropdown(mcq, idx)
    base["type"] = "drag_drop_blanks"
    base["id"] = f"{mcq['id']}-ddd{idx}"
    return base


def mcq_to_image_question(mcq, idx):
    """If an MCQ already has an image, mark it as image_question; else skip
    (returns None)."""
    if not mcq.get("image"):
        return None
    out = dict(mcq)
    out["type"] = "image_question"
    out["id"] = f"{mcq['id']}-img{idx}"
    return out


def mcq_to_hot_spot(mcq, idx):
    return None  # cannot synthesize without coords


def mcq_to_numeric(mcq, idx):
    return None  # avoid invalid numeric questions


# ---------- Bank synthesis ----------

def synthesize_bank(topic, bank, weights):
    """Return a per-type dict of available questions large enough to assemble
    45 mocks. Synthesize missing types from existing ones."""
    by_type = defaultdict(list)
    for q in bank:
        by_type[norm_type(q.get("type"))].append(q)

    needed_per_mock = target_counts(weights)
    NEED_TOTAL = {t: c * 45 + 5 for t, c in needed_per_mock.items()}  # +buffer

    rng = random.Random(f"{topic}-synth")

    src_mcq = list(by_type.get("multiple_choice", []))
    src_dd = list(by_type.get("dropdown_blanks", []))
    src_drag = list(by_type.get("drag_drop_blanks", []))
    rng.shuffle(src_mcq)
    rng.shuffle(src_dd)
    rng.shuffle(src_drag)

    def topup(t):
        have = len(by_type[t])
        need = NEED_TOTAL.get(t, 0)
        if have >= need:
            return
        deficit = need - have
        idx = 0
        while len(by_type[t]) < need:
            new_q = None
            if t == "multiple_choice":
                if src_dd:
                    new_q = dropdown_to_mcq(src_dd[idx % len(src_dd)], idx)
                elif src_drag:
                    new_q = dropdown_to_mcq(src_drag[idx % len(src_drag)], idx)
            elif t == "dropdown_blanks":
                if src_dd:
                    base = src_dd[idx % len(src_dd)]
                    new_q = dict(base)
                    new_q["id"] = f"{base['id']}-dup{idx}"
                elif src_mcq:
                    new_q = mcq_to_dropdown(src_mcq[idx % len(src_mcq)], idx)
            elif t == "drag_drop_blanks":
                if src_dd:
                    new_q = dropdown_to_drag_drop(src_dd[idx % len(src_dd)], idx)
                elif src_drag:
                    base = src_drag[idx % len(src_drag)]
                    new_q = dict(base)
                    new_q["id"] = f"{base['id']}-dup{idx}"
                elif src_mcq:
                    new_q = mcq_to_drag_drop(src_mcq[idx % len(src_mcq)], idx)
            elif t == "true_false":
                if src_mcq:
                    base = src_mcq[idx % len(src_mcq)]
                    new_q = mcq_to_true_false(base, idx) if idx % 2 == 0 else mcq_to_false_tf(base, idx)
                elif src_dd:
                    new_q = dropdown_to_true_false(src_dd[idx % len(src_dd)], idx)
            elif t == "multiple_response":
                if len(src_mcq) >= 2:
                    a = src_mcq[idx % len(src_mcq)]
                    b = src_mcq[(idx + 1) % len(src_mcq)]
                    new_q = mcq_to_multi_response(a, b, idx)
            elif t == "image_question":
                if src_mcq:
                    new_q = mcq_to_image_question(src_mcq[idx % len(src_mcq)], idx)
            elif t == "hot_spot":
                new_q = None
            elif t == "numeric_entry":
                new_q = None
            idx += 1
            if new_q is None:
                # Cannot synthesize — fall back to duplicating something we have.
                if by_type[t]:
                    base = by_type[t][idx % len(by_type[t])]
                    new_q = dict(base)
                    new_q["id"] = f"{base['id']}-dup{idx}"
                else:
                    # As a last resort produce a generic mcq stub.
                    if src_mcq:
                        new_q = dropdown_to_mcq if False else dict(src_mcq[idx % len(src_mcq)])
                        new_q["id"] = f"{new_q['id']}-fb{idx}"
                    else:
                        break
            by_type[t].append(new_q)
            if idx > deficit * 5:
                break

    for t in needed_per_mock:
        topup(t)

    return by_type


def rebuild_topic(topic):
    path = MOCKS_DIR / f"{topic}.json"
    data = json.loads(path.read_text())
    if data.get("version") != 2:
        print(f"[skip] {topic} is not v2")
        return
    weights = REQ[topic]["weights"]
    needed = target_counts(weights)
    by_type = synthesize_bank(topic, data["bank"], weights)

    # Build a unified bank with stable IDs (dedup).
    seen_ids = set()
    new_bank = []
    for t, items in by_type.items():
        for q in items:
            qid = q.get("id")
            if not qid or qid in seen_ids:
                qid = f"{topic[:3]}-{t[:3]}-{len(new_bank):05d}"
                q["id"] = qid
            seen_ids.add(qid)
            new_bank.append(q)

    # For each mock, deterministically pick `needed[t]` questions per type.
    rng_master = random.Random(f"{topic}-master")
    # Pre-shuffle pools per type with a seed, then advance index per mock
    pools = {t: [q for q in by_type[t]] for t in needed}
    for t in pools:
        random.Random(f"{topic}-{t}").shuffle(pools[t])

    cursors = {t: 0 for t in needed}
    new_mocks = []
    for m in data["mocks"]:
        mn = m["mockNumber"]
        question_ids = []
        for t, count in needed.items():
            for _ in range(count):
                pool = pools[t]
                q = pool[cursors[t] % len(pool)]
                cursors[t] += 1
                question_ids.append(q["id"])
        # Shuffle within the mock for variety, with a stable seed
        rng = random.Random(f"{topic}-mock-{mn}")
        rng.shuffle(question_ids)
        new_mocks.append({
            "mockNumber": mn,
            "title": m["title"],
            "questionIds": question_ids,
        })

    out = {
        "version": 2,
        "topic": data["topic"],
        "bank": new_bank,
        "mocks": new_mocks,
    }
    path.write_text(json.dumps(out, indent=2))
    print(f"[ok] {topic}: bank {len(data['bank'])} -> {len(new_bank)}, mocks {len(new_mocks)}, target {needed}")


def audit():
    issues = 0
    for topic in TARGET_TOPICS:
        path = MOCKS_DIR / f"{topic}.json"
        data = json.loads(path.read_text())
        weights = REQ[topic]["weights"]
        needed = target_counts(weights)
        bank = {q["id"]: q for q in data["bank"]}
        for m in data["mocks"][:3]:
            qs = [bank[i] for i in m["questionIds"] if i in bank]
            c = Counter(norm_type(q.get("type")) for q in qs)
            for t, exp in needed.items():
                if abs(c.get(t, 0) - exp) > 1:
                    print(f"  AUDIT FAIL {topic} mock {m['mockNumber']}: {dict(c)} vs {needed}")
                    issues += 1
                    break
    if issues == 0:
        print("AUDIT PASS")


if __name__ == "__main__":
    for t in TARGET_TOPICS:
        rebuild_topic(t)
    audit()
