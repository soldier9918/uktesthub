#!/usr/bin/env python3
"""Parse REQUIREMENTS.xlsx into scripts/topic-requirements.json.

The spreadsheet drives the entire generation pipeline. Re-run this whenever
the spreadsheet changes.
"""
import json
import re
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
XLSX = ROOT / "REQUIREMENTS.xlsx"
OUT = Path(__file__).resolve().parent / "topic-requirements.json"

# Map "Category" column values from the sheet to our existing category slugs in
# src/data/categories.ts. Anything not listed here is kept as a slugified
# version of the spreadsheet category name.
CATEGORY_SLUGS = {
    "Driving": "driving",
    "Citizenship": "citizenship",
    "English": "english",
    "Education": "education",
    "Career": "career",
    "Professional": "professional",
    "NHS": "nhs",
    "Taxi & Private Hire": "taxi-private-hire",
    "Security": "security",
    "Hospitality": "hospitality",
    "Construction": "construction",
    "Finance": "finance",
    "IT & Tech": "it-tech",
    "Healthcare Entry": "healthcare-entry",
    "Teaching": "teaching",
    "Legal": "legal",
    "Military & Emergency": "military-emergency",
    "Maritime & Aviation": "maritime-aviation",
    "Government": "government",
}

# Spelling fixes for known topic-slug typos in the spreadsheet.
TOPIC_SLUG_FIXES = {
    "motorcyclce-theory": "motorcycle-theory",
}

WEIGHT_RE = re.compile(r"([a-zA-Z_]+)\s*\[\s*(\d+)\s*%\s*\]")
TOPIC_TITLE_RE = re.compile(r"\{\s*slug:\s*\"([^\"]+)\"\s*,\s*title:\s*\"([^\"]+)\"")


def parse_weights(cell: str) -> dict[str, float]:
    out: dict[str, float] = {}
    for kind, pct in WEIGHT_RE.findall(cell or ""):
        out[kind.strip()] = int(pct) / 100.0
    return out


def load_known_titles() -> dict[str, str]:
    cats = ROOT / "src" / "data" / "categories.ts"
    if not cats.exists():
        return {}
    text = cats.read_text(encoding="utf-8")
    return {slug: title for slug, title in TOPIC_TITLE_RE.findall(text)}


def humanise_slug(slug: str) -> str:
    # Special-case common acronyms so they stay uppercase.
    upper = {"uk", "nhs", "ielts", "esol", "toefl", "gcse", "cscs", "sia",
             "seru", "sjt", "tfl", "phv", "ph", "ulez", "hgv", "lgv",
             "cv", "it", "dbs", "gdpr", "hmrc", "qts", "nmc", "cbt", "cpr",
             "vat", "uk-eu", "ks1", "ks2", "ks3", "iqa", "eqa", "ipaf", "pasma"}
    parts = slug.split("-")
    out = []
    for p in parts:
        if p.lower() in upper:
            out.append(p.upper())
        else:
            out.append(p[:1].upper() + p[1:])
    return " ".join(out)


def main() -> None:
    if not XLSX.exists():
        print(f"missing {XLSX}", file=sys.stderr)
        # fall back to /tmp upload
        alt = Path("/tmp/REQUIREMENTS.xlsx")
        if alt.exists():
            xlsx = alt
        else:
            sys.exit(1)
    else:
        xlsx = XLSX

    df = pd.read_excel(xlsx, sheet_name="Sheet1", header=0)
    # First col is "Category", second is "Topic", third is the weighting cell.
    df = df.rename(columns={
        df.columns[0]: "category",
        df.columns[1]: "topic",
        df.columns[2]: "weights",
        df.columns[3]: "totalMocks",
        df.columns[4]: "totalQs",
        df.columns[6]: "poolSize",
    })

    known_titles = load_known_titles()
    out: dict[str, dict] = {}
    for _, row in df.iterrows():
        cat = row.get("category")
        topic = row.get("topic")
        if not isinstance(cat, str) or not isinstance(topic, str):
            continue
        if cat.strip().lower() == "requirements*":
            break  # we've hit the requirements notes section
        topic_slug = TOPIC_SLUG_FIXES.get(topic.strip(), topic.strip())
        weights = parse_weights(str(row.get("weights", "")))
        if not weights:
            continue
        # Normalise weights to sum to 1.0 (handles rounding in the sheet).
        total = sum(weights.values())
        if total > 0:
            weights = {k: round(v / total, 4) for k, v in weights.items()}
        out[topic_slug] = {
            "category": CATEGORY_SLUGS.get(cat.strip(), cat.strip().lower().replace(" ", "-")),
            "categoryLabel": cat.strip(),
            "title": known_titles.get(topic_slug) or humanise_slug(topic_slug),
            "weights": weights,
            "totalMocks": int(row.get("totalMocks", 45) or 45),
            "questionsPerMock": int((row.get("totalQs", 1080) or 1080) // (row.get("totalMocks", 45) or 45)),
            "poolSize": int(row.get("poolSize", 650) or 650),
        }

    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print(f"wrote {OUT} with {len(out)} topics")


if __name__ == "__main__":
    main()
