#!/usr/bin/env python3
"""For every question typed `image_question` (or referencing 'this image/sign'
in its wording) that has no real `image` URL, fold the existing
`imageDescription` into the question text and convert the question into a
plain `multiple_choice`. Idempotent: questions already converted are skipped.
"""
import json
import os
import glob
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOCKS = os.path.join(ROOT, "src", "data", "mocks")
PUBLIC = os.path.join(ROOT, "public")

KEYWORDS = [
    "this sign", "this picture", "this image", "this road sign",
    "this blue", "this red", "this warning sign", "this circular sign",
    "this mandatory", "this prohibition", "this hazard sign",
    "this diagram", "this illustration", "depicted in", "shown in this",
    "shown above", "shown here", "pictured", "illustrated below",
    "the sign above", "the sign shown", "in this image", "in this diagram",
    "in this picture",
]

MARK = "__rewritten_from_image__"


def needs_rewrite(q):
    if q.get(MARK):
        return False
    t = (q.get("type") or "").replace("_", "-")
    txt = (q.get("question") or "").lower()
    is_img_type = t == "image-question"
    refs_image = any(k in txt for k in KEYWORDS)
    if not (is_img_type or refs_image):
        return False
    img = q.get("image")
    if img:
        # Real file present — keep as image_question.
        if img.startswith("/") and os.path.exists(os.path.join(PUBLIC, img.lstrip("/"))):
            return False
        # http(s) image — assume valid
        if img.startswith("http"):
            return False
    return True


def rewrite_question(q):
    desc = (q.get("imageDescription") or q.get("imageAlt") or "").strip()
    original_q = (q.get("question") or "").strip()
    if not desc:
        # Replace "this/the X sign/image" with a generic noun so it stops referring to a missing image.
        new_q = original_q
        for k in [
            "this blue circular sign", "this circular sign", "this mandatory blue sign",
            "this warning sign", "this prohibition sign", "this road sign", "this sign",
            "this image", "this picture", "this diagram", "this illustration",
            "the sign above", "the sign shown", "shown above", "shown here",
        ]:
            new_q = re.sub(re.escape(k), "the described sign", new_q, flags=re.IGNORECASE)
    else:
        # Compose: "<Description>. <Original question without 'this' references>"
        cleaned = original_q
        replacements = [
            (r"this (mandatory blue|blue circular|red triangular|yellow|warning|prohibition|circular|mandatory|hazard|safety)? ?sign", "the sign"),
            (r"this image", "the image"),
            (r"this picture", "the picture"),
            (r"this diagram", "the diagram"),
            (r"this illustration", "the illustration"),
            (r"the sign above", "the sign"),
            (r"the sign shown( above| here| below)?", "the sign"),
            (r"shown (above|here|below)", ""),
            (r"depicted in (this|the) (image|diagram|picture|illustration)", "described"),
            (r"in (this|the) (image|diagram|picture|illustration)", ""),
            (r"pictured (above|here|below)?", ""),
        ]
        for pat, rep in replacements:
            cleaned = re.sub(pat, rep, cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        if not cleaned.endswith("?") and not cleaned.endswith("."):
            cleaned += "?"
        # Make sure description ends with a period.
        d = desc.rstrip(" .") + "."
        # Capitalise first letter
        d = d[0].upper() + d[1:]
        new_q = f"{d} {cleaned[0].upper()}{cleaned[1:]}"

    new = dict(q)
    new["question"] = new_q
    new["type"] = "multiple_choice"
    new[MARK] = True
    # Drop image-only fields so the loader doesn't think it's still an image question
    new.pop("image", None)
    new.pop("imageAlt", None)
    new.pop("imageDescription", None)
    return new


def process_file(fp):
    with open(fp) as f:
        data = json.load(f)
    changed = 0
    if data.get("version") == 2:
        for i, q in enumerate(data.get("bank", [])):
            if needs_rewrite(q):
                data["bank"][i] = rewrite_question(q)
                changed += 1
    else:
        for t in data.get("tests", []):
            for i, q in enumerate(t.get("questions", [])):
                if needs_rewrite(q):
                    t["questions"][i] = rewrite_question(q)
                    changed += 1
    if changed:
        with open(fp, "w") as f:
            json.dump(data, f, indent=2)
    return changed


def main():
    files = sorted(glob.glob(os.path.join(MOCKS, "*.json")))
    total = 0
    for fp in files:
        c = process_file(fp)
        if c:
            print(f"  {os.path.basename(fp)}: {c}")
            total += c
    print(f"Total questions rewritten: {total}")


if __name__ == "__main__":
    main()
