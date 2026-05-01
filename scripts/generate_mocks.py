#!/usr/bin/env python3
"""
Generate mock tests for UK Test Hub topics using Lovable AI Gateway.

Resumable: writes per-topic JSON incrementally. Safe to interrupt and re-run.
Each topic file is src/data/mocks/<topic-slug>.json
  { topic, tests: [ { slug, topic, mockNumber, title, questions: [...] } ] }
"""

import json
import os
import sys
import time
import argparse
import requests
from pathlib import Path

GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions"
MODEL = "google/gemini-3-flash-preview"
ROOT = Path(__file__).resolve().parent.parent
MOCKS_DIR = ROOT / "src" / "data" / "mocks"
QUESTIONS_PER_MOCK = 24
TOTAL_MOCKS_PER_TOPIC = 45

# (topic_slug, topic_title, category_slug, system_prompt_subject)
TOPICS = [
    ("driving-theory", "Driving Theory Test", "driving",
     "official UK DVSA Driving Theory Test for car drivers (Highway Code, road safety, vehicle handling, hazard awareness, alertness, attitude, road signs)"),
    ("hazard-perception", "Hazard Perception Test", "driving",
     "the UK Hazard Perception Test (developing hazards, anticipating road dangers, scanning techniques, response timing)"),
    ("road-signs", "Road Signs Test", "driving",
     "UK road signs, traffic signals and road markings (warning signs, regulatory signs, information signs, motorway signs, road markings)"),
    ("motorcycle-theory", "Motorcycle Theory Test", "driving",
     "the UK DVSA Motorcycle Theory Test (Highway Code for motorcyclists, motorcycle safety, protective equipment, riding techniques)"),

    ("life-in-the-uk", "Life in the UK Test", "citizenship",
     "the official Life in the UK Test (UK history, traditions, government, law, geography, culture) based on the official handbook"),
    ("british-citizenship", "British Citizenship Practice", "citizenship",
     "British citizenship knowledge (Westminster system, monarchy, devolved governments, naturalisation requirements, British values)"),
    ("uk-laws-rights", "UK Laws & Rights Quiz", "citizenship",
     "UK laws and citizen rights (criminal vs civil law, employment rights, consumer rights, courts, the police, voting rights)"),
    ("uk-geography", "UK Geography Test", "citizenship",
     "UK geography (countries of the UK, capital cities, rivers, mountains, counties, islands, landmarks, regions)"),

    ("ielts", "IELTS Practice", "english",
     "IELTS Academic English (reading comprehension, vocabulary in context, grammar, sentence completion, paraphrasing)"),
    ("esol", "ESOL Practice", "english",
     "UK ESOL (English for Speakers of Other Languages) at Entry 3 / Level 1 — everyday English, reading and grammar"),
    ("toefl", "TOEFL Practice", "english",
     "TOEFL English (academic vocabulary, grammar, reading comprehension, idioms)"),
    ("grammar", "Grammar & Vocabulary", "english",
     "English grammar and vocabulary (tenses, prepositions, articles, collocations, synonyms, common confusions)"),

    ("eleven-plus", "11+ Exam Practice", "education",
     "the UK 11+ entrance exam (verbal reasoning, non-verbal reasoning, English comprehension, mental maths) for ages 10-11"),
    ("gcse-maths", "GCSE Maths", "education",
     "GCSE Maths (Foundation/Higher tier) — number, algebra, ratio, geometry, probability, statistics"),
    ("gcse-english", "GCSE English", "education",
     "GCSE English Language and Literature (reading comprehension, grammar, punctuation, literary techniques, poetry)"),
    ("sats", "SATs KS1 / KS2", "education",
     "UK SATs (Key Stage 1 and Key Stage 2) covering English (SPaG, reading) and Maths"),

    ("numerical", "Numerical Reasoning", "career",
     "graduate-level numerical reasoning aptitude tests (percentages, ratios, data interpretation from tables and charts, currency conversion)"),
    ("verbal", "Verbal Reasoning", "career",
     "graduate verbal reasoning tests (true / false / cannot say from short passages, vocabulary, comprehension)"),
    ("logical", "Logical Reasoning", "career",
     "logical and abstract reasoning tests (pattern recognition, syllogisms, sequences, deductive reasoning)"),
    ("sjt", "Situational Judgement", "career",
     "workplace Situational Judgement Tests (choose the most and least effective response to realistic scenarios)"),

    ("cscs", "CSCS Card Test", "professional",
     "the UK CSCS Health, Safety and Environment test for construction operatives (PPE, working at height, manual handling, hazardous substances, fire safety, site rules)"),
    ("sia", "SIA Security Test", "professional",
     "the UK SIA Door Supervisor / Security Guard licence test (legislation, conflict management, physical intervention awareness, emergency procedures)"),
    ("seru", "SERU TfL Assessment", "professional",
     "the Transport for London SERU assessment for Private Hire drivers (safety, equality, regulatory requirements, customer service in London)"),
    ("food-hygiene", "Food Hygiene Level 2", "professional",
     "Food Hygiene Level 2 for catering (food safety, cross-contamination, temperature control, personal hygiene, allergens, HACCP)"),
    ("first-aid", "First Aid Theory", "professional",
     "Emergency First Aid at Work theory (DRABC primary survey, CPR, choking, bleeding, shock, burns, fractures, recovery position)"),
    ("fire-safety", "Fire Safety Awareness", "professional",
     "UK Fire Safety Awareness training (Regulatory Reform (Fire Safety) Order 2005, fire triangle, classes of fire A-F, extinguisher types and colours, evacuation procedures, fire wardens, fire doors, risk assessment, alarm systems, PEEPs)"),
    ("manual-handling", "Manual Handling", "professional",
     "UK Manual Handling training (Manual Handling Operations Regulations 1992, TILE/LITE assessment, safe lifting techniques, kinetic lifting, MSDs, pushing/pulling, team lifts, mechanical aids, employer/employee duties)"),
    ("health-safety-awareness", "Health & Safety Awareness", "professional",
     "UK Health & Safety Awareness (Health and Safety at Work Act 1974, HSE, RIDDOR, COSHH, risk assessment 5 steps, PPE hierarchy of control, accident reporting, employer/employee duties, signage)"),
    ("gdpr-awareness", "GDPR Awareness", "professional",
     "UK GDPR and Data Protection Act 2018 awareness (7 principles, lawful bases, data subject rights, ICO, breach notification 72 hours, DPIA, DPO, special category data, data processor vs controller, retention)"),

    ("nhs-numeracy", "NHS Numeracy Test", "nhs",
     "the NHS numeracy test for healthcare roles (drug calculations, fluid balances, percentages, ratios, units, basic arithmetic)"),
    ("nhs-literacy", "NHS Literacy Test", "nhs",
     "the NHS literacy test (reading comprehension, spelling, grammar, summarising clinical information)"),
    ("nhs-values", "NHS Values-Based Recruitment", "nhs",
     "NHS Values-Based Recruitment scenarios (compassion, respect, dignity, duty of candour, working as a team)"),
    ("nmc-cbt", "NMC CBT (Nurses)", "nhs",
     "the NMC Computer-Based Test for nurses (clinical practice, professionalism, evidence-based care, safeguarding, infection control)"),

    ("how-british", "How British Are You?", "fun",
     "fun trivia about everyday British life (tea, queueing, weather small-talk, biscuits, slang, sitcoms, royal trivia)"),
    ("uk-slang", "UK Slang Quiz", "fun",
     "British slang and regional expressions (Cockney, Scouse, Geordie, Yorkshire, modern British slang)"),
    ("daily", "General Knowledge Daily", "fun",
     "general knowledge with a British flavour (history, geography, sport, music, film, science, royal family)"),
]

QUESTION_TOOL = {
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
                                "minItems": 4,
                                "maxItems": 4,
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


def call_ai(api_key: str, system: str, user: str, retries: int = 3):
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "tools": [QUESTION_TOOL],
        "tool_choice": {"type": "function", "function": {"name": "submit_mock_test"}},
    }
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
                timeout=120,
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
            data = r.json()
            tool_calls = data["choices"][0]["message"].get("tool_calls") or []
            if not tool_calls:
                raise RuntimeError("no tool_calls in response")
            args = json.loads(tool_calls[0]["function"]["arguments"])
            qs = args.get("questions") or []
            if len(qs) != QUESTIONS_PER_MOCK:
                raise RuntimeError(f"expected {QUESTIONS_PER_MOCK} questions, got {len(qs)}")
            return qs
        except Exception as e:  # noqa: BLE001
            last_err = e
            print(f"  ! attempt {attempt + 1} failed: {e}")
            time.sleep(5 * (attempt + 1))
    raise RuntimeError(f"call_ai failed: {last_err}")


def load_existing(topic_slug: str):
    path = MOCKS_DIR / f"{topic_slug}.json"
    if not path.exists():
        return {"topic": topic_slug, "tests": []}
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def save(topic_slug: str, payload: dict):
    MOCKS_DIR.mkdir(parents=True, exist_ok=True)
    path = MOCKS_DIR / f"{topic_slug}.json"
    payload["tests"].sort(key=lambda t: t["mockNumber"])
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


def generate_topic(api_key: str, topic_slug: str, topic_title: str, subject: str,
                   start: int, end: int, delay: float):
    payload = load_existing(topic_slug)
    done_nums = {t["mockNumber"] for t in payload["tests"]}
    print(f"\n=== {topic_slug} ({topic_title}) ===")
    print(f"   already have {len(done_nums)} mocks")

    system = (
        f"You are an expert exam writer for {subject}. "
        "Write realistic UK-context multiple-choice questions in clear, plain English. "
        "Each question must have exactly 4 distinct plausible options, one correct answer "
        "(by 0-based index), and a concise 1–2 sentence explanation. "
        "Never repeat the exact same question across mocks. Vary topics within the subject. "
        "Use UK English spelling. Do not include images, references to images, or audio."
    )

    for n in range(start, end + 1):
        if n in done_nums:
            continue
        prompt = (
            f"Generate mock test #{n} for the {topic_title}. "
            f"Produce exactly {QUESTIONS_PER_MOCK} unique multiple-choice questions. "
            "Mix easy, medium and harder questions across the test. "
            "Cover a variety of sub-topics."
        )
        try:
            print(f"  - mock #{n}: requesting…")
            qs = call_ai(api_key, system, prompt)
            payload["tests"].append({
                "slug": f"{topic_slug}-mock-{n}",
                "topic": topic_slug,
                "mockNumber": n,
                "title": f"{topic_title} Test {n}",
                "questions": qs,
            })
            save(topic_slug, payload)
            print(f"    ✓ saved ({len(qs)} qs)")
            time.sleep(delay)
        except Exception as e:  # noqa: BLE001
            print(f"    × failed: {e}", file=sys.stderr)
            # keep going; rerun later to fill gaps


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--topics", nargs="*", help="topic slugs to generate (default: all)")
    p.add_argument("--start", type=int, default=1)
    p.add_argument("--end", type=int, default=TOTAL_MOCKS_PER_TOPIC)
    p.add_argument("--delay", type=float, default=1.5)
    args = p.parse_args()

    api_key = os.environ.get("LOVABLE_API_KEY")
    if not api_key:
        print("LOVABLE_API_KEY env var not set", file=sys.stderr)
        sys.exit(1)

    selected = TOPICS
    if args.topics:
        wanted = set(args.topics)
        selected = [t for t in TOPICS if t[0] in wanted]
        if not selected:
            print(f"no matching topics: {args.topics}", file=sys.stderr)
            sys.exit(1)

    for topic_slug, topic_title, _cat, subject in selected:
        generate_topic(api_key, topic_slug, topic_title, subject,
                       args.start, args.end, args.delay)


if __name__ == "__main__":
    main()
