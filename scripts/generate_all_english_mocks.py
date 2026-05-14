#!/usr/bin/env python3
"""Generate all (test, skill, level) English mock banks.

Writes public/english-mocks/{test}/{skill}/{level}.json for each of the
79 valid triples. Reuses build_bank() from generate_english_mocks.py with
a unique prefix per triple so question IDs don't collide.

Adds a light skill-flavoured prefix to MCQ stems so the same template reads
naturally for listening/reading/writing/speaking practice.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_english_mocks import build_bank, OUT_DIR  # type: ignore

# Mirror src/data/english/categories.ts
FOUR_SKILLS = ["listening", "reading", "writing", "speaking"]
ALL_LEVELS = ["a1", "a2", "b1", "b2", "c1", "c2"]

TRIPLES = []
for test in ["ielts", "esol", "toefl"]:
    for skill in FOUR_SKILLS:
        for lvl in ALL_LEVELS:
            TRIPLES.append((test, skill, lvl))
# SELT
for lvl in ["a1", "a2", "b1"]:
    TRIPLES.append(("selt", "speaking-listening", lvl))
for lvl in ["b1", "b2", "c1", "c2"]:
    TRIPLES.append(("selt", "four-skills", lvl))

SKILL_LABEL = {
    "listening": "Listening",
    "reading": "Reading",
    "writing": "Writing",
    "speaking": "Speaking",
    "speaking-listening": "Speaking & Listening",
    "four-skills": "Four Skills",
}
LEVEL_LABEL = {
    "a1": "A1",
    "a2": "A2",
    "b1": "B1",
    "b2": "B2",
    "c1": "C1",
    "c2": "C2",
}

SKILL_STEM_PREFIX = {
    "listening": "You hear this in a conversation. ",
    "reading": "You read this in a short text. ",
    "writing": "Choose the best wording for this sentence. ",
    "speaking": "Choose the most natural reply. ",
    "speaking-listening": "You hear or say this in everyday English. ",
    "four-skills": "",
}


def flavour_bank(bank: list, skill: str, level: str) -> None:
    prefix = SKILL_STEM_PREFIX.get(skill, "")
    lvl_tag = f" [{LEVEL_LABEL[level]}]"
    for q in bank:
        if q["type"] == "mcq":
            if prefix and not q["question"].startswith(prefix):
                q["question"] = prefix + q["question"]
            q["question"] = q["question"] + lvl_tag
        elif q["type"] in ("multiple-response", "true-false"):
            q["question"] = q["question"] + lvl_tag


def main() -> int:
    written = 0
    for test, skill, level in TRIPLES:
        prefix = f"{test}-{skill}-{level}"
        data = build_bank(test)  # base content per test type
        # Re-key IDs so they're unique per triple
        id_map = {}
        for i, q in enumerate(data["bank"], 1):
            old = q["id"]
            # type segment kept for readability
            seg = q["type"].split("-")[0]
            new_id = f"{prefix}-{seg}-{i:04d}"
            id_map[old] = new_id
            q["id"] = new_id
        for m in data["mocks"]:
            m["questionIds"] = [id_map[qid] for qid in m["questionIds"]]
        flavour_bank(data["bank"], skill, level)

        out = {
            "version": 2,
            "test": test,
            "skill": skill,
            "level": level,
            "bank": data["bank"],
            "mocks": data["mocks"],
        }
        target = OUT_DIR / test / skill / f"{level}.json"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(out, ensure_ascii=False))
        written += 1
        print(f"  wrote {target.relative_to(OUT_DIR.parent.parent)}")
    print(f"Done — {written} bank files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
