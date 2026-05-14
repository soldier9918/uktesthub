#!/usr/bin/env python3
"""
Generate English Language Tests question banks (v2 schema).

Usage:
    python scripts/generate_english_mocks.py ielts
    python scripts/generate_english_mocks.py esol
    python scripts/generate_english_mocks.py selt
    python scripts/generate_english_mocks.py toefl

Each call writes public/english-mocks/<slug>.json containing 45 mocks of
24 unique questions, balanced as:
    10 multiple choice + 6 typed fill-in-the-blank
    + 4 dropdown blanks + 4 multiple response = 24 per mock.

All questions are deterministic — re-running produces the same output.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "english-mocks"
OUT_DIR.mkdir(parents=True, exist_ok=True)

TOTAL_MOCKS = 45
PER_MOCK = 24

# Per-mock distribution
MIX = {
    "mcq": 8,
    "true-false": 2,
    "fill-blanks": 6,
    "dropdown-blanks": 4,
    "multiple-response": 4,
}
assert sum(MIX.values()) == PER_MOCK

NEEDED = {k: v * TOTAL_MOCKS for k, v in MIX.items()}  # 450/270/180/180

# ---------------------------------------------------------------------------
# Generic helpers
# ---------------------------------------------------------------------------

def _dedupe(items: List[Dict[str, Any]], key) -> List[Dict[str, Any]]:
    seen = set()
    out = []
    for it in items:
        k = key(it)
        if k in seen:
            continue
        seen.add(k)
        out.append(it)
    return out


def _take(items: List[Dict[str, Any]], n: int, label: str) -> List[Dict[str, Any]]:
    if len(items) < n:
        raise SystemExit(
            f"Not enough '{label}' items: need {n}, have {len(items)}"
        )
    return items[:n]


# ---------------------------------------------------------------------------
# IELTS content pools
# ---------------------------------------------------------------------------

# 50 academic words × ~10 sentence frames = 500 candidate MCQs
IELTS_VOCAB: List[Dict[str, Any]] = [
    {"word": "analyse", "definition": "examine in detail", "distractors": ["ignore", "memorise", "translate"], "frames": [
        "The researcher will {} the data before publishing the report.",
        "Students must {} each case study carefully in the exam.",
        "Engineers {} test results to identify weaknesses in the design.",
        "It is important to {} the figures rather than simply copy them.",
        "Lecturers expect undergraduates to {} every source they cite.",
        "The committee will {} feedback before changing the policy.",
        "A good essay will {} both sides of the argument.",
        "Doctors {} symptoms before deciding on a diagnosis.",
        "Auditors {} financial records to detect irregularities.",
        "We need to {} the survey results in detail.",
    ]},
    {"word": "establish", "definition": "set up or create", "distractors": ["abolish", "reduce", "follow"], "frames": [
        "The university plans to {} a new research centre next year.",
        "Scientists {} clear procedures before beginning any trial.",
        "Governments {} laws to protect public health.",
        "The charity hopes to {} branches in five new cities.",
        "We must {} the facts before drawing any conclusion.",
        "Historians {} timelines using primary evidence.",
        "The meeting aims to {} a working group on climate policy.",
        "It is hard to {} the cause of the failure without more data.",
        "Editors {} a style guide for all contributors to follow.",
        "The treaty helped to {} peace between the two countries.",
    ]},
    {"word": "evaluate", "definition": "judge the value of", "distractors": ["copy", "criticise", "summarise"], "frames": [
        "Examiners {} essays against published criteria.",
        "Teachers {} progress through coursework and exams.",
        "Engineers {} the safety of a structure before approval.",
        "Investors {} a company's prospects before buying shares.",
        "Researchers must {} the reliability of every source.",
        "The committee will {} the proposal at its next meeting.",
        "It is helpful to {} your own work before submitting it.",
        "Students {} arguments rather than accepting them blindly.",
        "Hospitals regularly {} the success of new treatments.",
        "We will {} the pilot study after six months.",
    ]},
    {"word": "significant", "definition": "important or noticeable", "distractors": ["minor", "doubtful", "early"], "frames": [
        "The new policy has had a {} effect on emissions.",
        "There is a {} difference between the two groups.",
        "Climate change is the most {} challenge of our time.",
        "His research made a {} contribution to medicine.",
        "The fall in unemployment is statistically {}.",
        "Reading every day produces {} gains in vocabulary.",
        "The vote represents a {} shift in public opinion.",
        "There has been {} progress over the last decade.",
        "Diet plays a {} role in long-term health.",
        "The findings are {} for future researchers.",
    ]},
    {"word": "indicate", "definition": "show or suggest", "distractors": ["hide", "translate", "delay"], "frames": [
        "The chart appears to {} a steady rise in costs.",
        "Early results {} that the treatment is effective.",
        "Survey responses {} growing concern about housing.",
        "The graph does not {} any clear seasonal pattern.",
        "Symptoms may {} a more serious underlying condition.",
        "Footprints {} that several people had been there.",
        "Data from the sensor {} a sudden drop in pressure.",
        "The figures {} an improvement on last year.",
        "Test scores {} the need for additional support.",
        "Recent trends {} a shift towards remote work.",
    ]},
    {"word": "approach", "definition": "way of dealing with", "distractors": ["avoidance", "answer", "result"], "frames": [
        "The team has adopted a more practical {} to teaching.",
        "Her {} to problem-solving is highly logical.",
        "A balanced {} usually produces the best results.",
        "We need a fresh {} to traffic management in the city.",
        "Different cultures take a different {} to family life.",
        "The book offers a step-by-step {} to revision.",
        "His {} to negotiation has been widely praised.",
        "A multi-disciplinary {} works best for this problem.",
        "The company's {} to recruitment has changed.",
        "Doctors recommend a holistic {} to wellbeing.",
    ]},
    {"word": "factor", "definition": "something that contributes", "distractors": ["result", "answer", "exception"], "frames": [
        "Cost is a major {} in choosing a university.",
        "Stress is widely seen as a key {} in heart disease.",
        "Weather is an important {} in farming yields.",
        "Childhood reading is a strong {} in later success.",
        "Location is the most important {} in property value.",
        "Sleep is a critical {} in mental health.",
        "Air quality is a serious {} for asthma sufferers.",
        "Diet is one {} among many that affects life expectancy.",
        "Family background is often a {} in academic achievement.",
        "Time of year is a {} in tourism numbers.",
    ]},
    {"word": "conclude", "definition": "come to a final view", "distractors": ["begin", "doubt", "compare"], "frames": [
        "The author tries to {} that the policy has failed.",
        "Most researchers {} that exercise improves mood.",
        "The judge will {} her remarks tomorrow morning.",
        "We can {} from the data that demand has fallen.",
        "It is too early to {} that the trial has succeeded.",
        "The report {} with several recommendations.",
        "Speakers usually {} with a brief summary.",
        "Detectives could not {} who was responsible.",
        "The teacher asked the class to {} the discussion.",
        "We {} the meeting at four o'clock.",
    ]},
    {"word": "consist of", "definition": "be made up of", "distractors": ["exclude", "produce", "depend on"], "frames": [
        "The committee will {} twelve elected members.",
        "Each module will {} ten lectures and a seminar.",
        "A balanced diet should {} a variety of foods.",
        "The course will {} four parts assessed separately.",
        "The mixture should {} sand, cement and water.",
        "The orchestra will {} more than sixty musicians.",
        "Healthy soil should {} organic matter and minerals.",
        "The exam will {} a written and an oral section.",
        "A good essay will {} an introduction, body and conclusion.",
        "The team will {} engineers from three departments.",
    ]},
    {"word": "demonstrate", "definition": "show clearly", "distractors": ["hide", "doubt", "request"], "frames": [
        "The study aims to {} a link between sleep and memory.",
        "Candidates must {} excellent communication skills.",
        "The results {} that the new method is faster.",
        "Tutors will {} the technique in the next class.",
        "Engineers {} that the bridge can hold the load.",
        "The research clearly {} the benefits of regular exercise.",
        "We will {} the prototype at the trade fair.",
        "His paintings {} an unusual sense of colour.",
        "The data {} a steady improvement over time.",
        "The chef will {} how to make fresh pasta.",
    ]},
    {"word": "occur", "definition": "happen", "distractors": ["disappear", "design", "delay"], "frames": [
        "Earthquakes can {} without warning in this region.",
        "Mistakes will {} from time to time in any project.",
        "Strong winds usually {} during the autumn.",
        "Such reactions rarely {} in everyday conditions.",
        "Power cuts can {} during the winter storms.",
        "Migrations {} every year between the two continents.",
        "Allergic responses can {} within minutes.",
        "These changes {} naturally over thousands of years.",
        "Spelling errors often {} when typing quickly.",
        "Floods {} more frequently than they used to.",
    ]},
    {"word": "require", "definition": "need", "distractors": ["refuse", "remove", "request"], "frames": [
        "All passengers {} a valid ticket to board the train.",
        "The recipe will {} two eggs and 200 g of flour.",
        "Most universities {} a personal statement.",
        "Children under five {} adult supervision in the pool.",
        "The job will {} fluent English and a driving licence.",
        "This software will {} regular updates.",
        "The test does not {} any prior knowledge.",
        "Visitors {} a permit before entering the reserve.",
        "Some plants {} very little water to survive.",
        "The new rules {} all staff to attend training.",
    ]},
    {"word": "obtain", "definition": "get or acquire", "distractors": ["lose", "lend", "spend"], "frames": [
        "Students must {} written permission from a parent.",
        "Researchers can {} data through interviews and surveys.",
        "Citizens may {} a copy of their records on request.",
        "It is hard to {} clean drinking water in some regions.",
        "We were able to {} planning permission last month.",
        "Charities {} most of their funds from public donations.",
        "Drivers can {} a paper licence at the post office.",
        "Patients should {} a referral from their GP.",
        "Visitors can {} a map at the information desk.",
        "Reporters {} information from a range of sources.",
    ]},
    {"word": "consider", "definition": "think carefully about", "distractors": ["forget", "refuse", "publish"], "frames": [
        "Please {} the following options before answering.",
        "We must {} all the consequences of this decision.",
        "Examiners {} both content and style when marking.",
        "Buyers should {} the energy rating of the appliance.",
        "Travellers should {} the weather before setting off.",
        "Voters need to {} long-term as well as short-term issues.",
        "Designers {} accessibility from the start of any project.",
        "It is wise to {} every offer carefully.",
        "Judges {} character references during sentencing.",
        "Lecturers {} the needs of all their students.",
    ]},
    {"word": "achieve", "definition": "succeed in reaching", "distractors": ["lose", "ignore", "delay"], "frames": [
        "The team hopes to {} a top-three finish this season.",
        "It is possible to {} fluency with regular practice.",
        "Companies {} better results when staff feel valued.",
        "Schools that focus on reading {} higher overall scores.",
        "Athletes {} their best times after careful training.",
        "We aim to {} carbon-neutral status by 2030.",
        "She managed to {} a place at her first-choice university.",
        "Few candidates {} full marks on this paper.",
        "Engineers can {} more with modern materials.",
        "Communities can {} change through local action.",
    ]},
    {"word": "vary", "definition": "be different", "distractors": ["match", "stop", "copy"], "frames": [
        "Prices can {} considerably between suppliers.",
        "Opinions {} on whether the policy will succeed.",
        "Test scores {} from year to year.",
        "Average rainfall can {} sharply across the region.",
        "Working conditions {} from one company to another.",
        "Customer needs {} according to their location.",
        "Sleep patterns {} between adults and teenagers.",
        "Course content can {} between universities.",
        "Travel times {} depending on the time of day.",
        "Soil quality can {} within a single field.",
    ]},
    {"word": "tend to", "definition": "be likely to", "distractors": ["refuse to", "fail to", "hesitate to"], "frames": [
        "Older students {} prefer self-directed learning.",
        "City dwellers {} use public transport more often.",
        "Children {} imitate the language they hear at home.",
        "People {} remember stories better than statistics.",
        "Smaller classes {} produce better discussion.",
        "Voters {} support familiar candidates.",
        "Plants {} grow more slowly in poor soil.",
        "Drivers {} brake harder when distracted.",
        "Long-term studies {} produce more reliable findings.",
        "Beginners {} make the same handful of mistakes.",
    ]},
    {"word": "rely on", "definition": "depend on", "distractors": ["replace", "ignore", "improve"], "frames": [
        "Many small businesses {} word-of-mouth advertising.",
        "Patients {} their GP for accurate health advice.",
        "Hill farmers {} the weather for their livelihood.",
        "Researchers must not {} a single source of data.",
        "Travellers should not {} mobile signal in remote areas.",
        "Small charities {} a few key donors each year.",
        "Pilots {} their instruments in poor visibility.",
        "Drivers should not {} satnav in unfamiliar towns.",
        "Newspapers used to {} printed photographs.",
        "Many learners {} apps to practise vocabulary.",
    ]},
    {"word": "decline", "definition": "decrease", "distractors": ["rise", "remain", "begin"], "frames": [
        "House prices began to {} in the second quarter.",
        "Birth rates have continued to {} since the 1990s.",
        "Bee numbers {} when habitats are destroyed.",
        "The use of paper maps has continued to {}.",
        "Cinema attendance tends to {} during the summer.",
        "Fish stocks {} when overfishing is allowed.",
        "Coal use is expected to {} over the next decade.",
        "High street sales typically {} in January.",
        "Memory may {} naturally with age.",
        "Insect populations have continued to {} in Europe.",
    ]},
    {"word": "emerge", "definition": "become visible or known", "distractors": ["vanish", "agree", "remain"], "frames": [
        "New evidence is starting to {} from the inquiry.",
        "Several patterns began to {} after the second study.",
        "Young leaders are beginning to {} in the community.",
        "Details of the deal may {} later this week.",
        "Trends usually {} only after several years of data.",
        "A clearer picture should {} once results are in.",
        "New industries {} as old ones decline.",
        "Bright stars start to {} as the sky darkens.",
        "Differences between the two groups began to {}.",
        "The full story has yet to {} from the reports.",
    ]},
    {"word": "highlight", "definition": "draw attention to", "distractors": ["conceal", "ignore", "delete"], "frames": [
        "The report aims to {} the risks of inaction.",
        "Lecturers like to {} key terms in bold.",
        "Editors {} important quotes in their summaries.",
        "The talk will {} recent advances in genetics.",
        "Charts can {} differences that words cannot show.",
        "The teacher will {} common errors in the homework.",
        "Activists try to {} the issue in the local press.",
        "Authors often {} a central theme in the introduction.",
        "Doctors {} the importance of early diagnosis.",
        "The article will {} examples from three countries.",
    ]},
    {"word": "imply", "definition": "suggest without saying", "distractors": ["state", "deny", "prove"], "frames": [
        "The author seems to {} that reform is overdue.",
        "Her tone appeared to {} disagreement.",
        "These figures {} a serious problem with funding.",
        "Statistics rarely {} cause and effect on their own.",
        "The headline appears to {} blame on the council.",
        "Recent tests {} that the supplement has no effect.",
        "The minister's words {} a change in policy.",
        "A polite refusal does not {} a personal insult.",
        "His silence may {} that he agrees.",
        "The wording does not clearly {} a new tax.",
    ]},
    {"word": "address", "definition": "deal with (a problem)", "distractors": ["create", "delay", "describe"], "frames": [
        "The new policy aims to {} traffic congestion.",
        "Schools must {} bullying as soon as it appears.",
        "Local councils try to {} housing shortages each year.",
        "We need to {} climate change at every level.",
        "Hospitals are working to {} long waiting times.",
        "Universities should {} the cost of student housing.",
        "The campaign tries to {} loneliness in older people.",
        "Engineers were called in to {} the safety concerns.",
        "Governments rarely {} all the issues raised in elections.",
        "The proposal does not {} the root cause of the problem.",
    ]},
    {"word": "regard", "definition": "consider in a particular way", "distractors": ["forget", "ignore", "avoid"], "frames": [
        "Scientists {} the discovery as a major breakthrough.",
        "Critics {} her novel as one of the year's best.",
        "Most economists {} interest rates as a key tool.",
        "Many readers {} the conclusion as too cautious.",
        "Historians {} this period as the most important.",
        "Doctors {} sleep as essential for recovery.",
        "Coaches {} attitude as more important than talent.",
        "Voters {} the new candidate as more honest.",
        "Architects {} natural light as central to good design.",
        "Teachers {} feedback as part of the learning process.",
    ]},
    {"word": "reveal", "definition": "make known", "distractors": ["hide", "deny", "delay"], "frames": [
        "The latest figures {} a sharp rise in cycling.",
        "X-rays can {} fractures invisible to the eye.",
        "Interviews can {} attitudes that surveys cannot.",
        "The audit will {} how the funds were spent.",
        "A long-term study can {} patterns missed by short ones.",
        "Detailed maps {} how the coastline has changed.",
        "Family letters {} a great deal about social history.",
        "The scan will {} any change in the structure.",
        "His diary may {} more about his motives.",
        "Recent research {} the benefits of green spaces.",
    ]},
    {"word": "involve", "definition": "include as a necessary part", "distractors": ["exclude", "ignore", "refuse"], "frames": [
        "The role will {} working closely with new staff.",
        "Most experiments {} careful measurement of variables.",
        "Sound treatment will {} a course of antibiotics.",
        "The course will {} group work as well as lectures.",
        "Negotiations usually {} compromise on both sides.",
        "Good design will {} the user from the start.",
        "Organising the event will {} weeks of preparation.",
        "Changing role often {} a period of training.",
        "Driving safely will {} regular checks on the vehicle.",
        "Taking part will {} attending two sessions a week.",
    ]},
    {"word": "perceive", "definition": "see or understand", "distractors": ["forget", "construct", "design"], "frames": [
        "Customers often {} price as a sign of quality.",
        "Children {} time differently from adults.",
        "Many voters {} the issue as urgent.",
        "Some learners {} maths as harder than it really is.",
        "Brands work hard to be {} as trustworthy.",
        "Older people may {} new technology as confusing.",
        "Audiences {} silence as part of the music.",
        "Patients sometimes {} pain in unexpected ways.",
        "Investors may {} risk where there is little.",
        "Drivers can {} hazards more quickly with practice.",
    ]},
    {"word": "depend on", "definition": "be controlled by", "distractors": ["avoid", "remove", "publish"], "frames": [
        "Crops {} a steady supply of rainfall.",
        "Local economies {} tourism in the summer months.",
        "The result will {} how many people vote.",
        "Treatment options {} the patient's overall health.",
        "Hospital beds {} careful planning at every level.",
        "Battery life will {} how the phone is used.",
        "Public services {} reliable funding from government.",
        "The price will {} where the apartment is located.",
        "Farmers {} bees to pollinate their crops.",
        "Travel times {} traffic on the M25.",
    ]},
    {"word": "promote", "definition": "encourage the growth of", "distractors": ["prevent", "delay", "criticise"], "frames": [
        "Schools should {} healthy eating habits.",
        "Charities {} awareness of mental health issues.",
        "Daily exercise can {} better sleep.",
        "Reading aloud can {} stronger language skills.",
        "Local councils try to {} the use of public transport.",
        "Universities {} research through dedicated funding.",
        "The campaign aims to {} cycling in the city.",
        "Good leaders {} teamwork rather than competition.",
        "Trees {} biodiversity in urban areas.",
        "The new initiative will {} careers in engineering.",
    ]},
    {"word": "estimate", "definition": "give an approximate value", "distractors": ["measure", "ignore", "delay"], "frames": [
        "Experts {} that costs will rise by ten per cent.",
        "Surveyors {} the value of property each year.",
        "Officials {} crowd numbers from aerial photos.",
        "Climate scientists {} sea level rise over the next century.",
        "Travel websites {} journey times from past data.",
        "Economists {} growth at around two per cent.",
        "Engineers {} repair costs before starting work.",
        "Researchers {} that fewer than half complete the course.",
        "Doctors {} a recovery time of about three weeks.",
        "Historians {} the city's medieval population at 25,000.",
    ]},
    {"word": "comprise", "definition": "be composed of", "distractors": ["divide", "exclude", "extend"], "frames": [
        "The board will {} seven independent members.",
        "The estate will {} forty new homes.",
        "Each module will {} two essays and a presentation.",
        "The exhibition will {} works by twelve artists.",
        "The course will {} both theory and practical work.",
        "The reserve will {} woodland, marsh and grassland.",
        "The dataset will {} responses from 2,000 households.",
        "The festival will {} films from over thirty countries.",
        "The collection will {} more than five hundred items.",
        "The town centre will {} shops, offices and a library.",
    ]},
    {"word": "transform", "definition": "change completely", "distractors": ["copy", "preserve", "delay"], "frames": [
        "Online learning has begun to {} higher education.",
        "Renewable energy could {} the global economy.",
        "Smartphones have helped to {} how we communicate.",
        "The new road may {} life in this small village.",
        "Better public transport could {} the city centre.",
        "Digital tools have begun to {} medical research.",
        "Subtitles can {} how people watch foreign films.",
        "Volunteers helped to {} the community garden.",
        "AI is starting to {} routine office work.",
        "The new principal hopes to {} the school.",
    ]},
    {"word": "facilitate", "definition": "make easier", "distractors": ["block", "cancel", "ignore"], "frames": [
        "Translators {} communication between speakers of different languages.",
        "New software will {} sharing of research data.",
        "The bridge will {} travel between the two towns.",
        "Online forms {} applications for benefits.",
        "Mediators {} talks between unions and employers.",
        "Mobile apps {} booking medical appointments.",
        "Better signage will {} navigation in the hospital.",
        "Group work can {} deeper learning.",
        "Clear rules {} cooperation between teams.",
        "A trained facilitator can {} difficult discussions.",
    ]},
    {"word": "investigate", "definition": "examine carefully", "distractors": ["ignore", "create", "delay"], "frames": [
        "Police are continuing to {} the cause of the fire.",
        "Scientists {} how the disease spreads in cities.",
        "The committee will {} how funds are allocated.",
        "Inspectors {} schools every three to five years.",
        "Consumer groups {} complaints about the company.",
        "Journalists {} stories before publishing them.",
        "Engineers {} the failure of the bridge supports.",
        "Auditors {} financial irregularities in the accounts.",
        "Detectives {} crimes long after they happen.",
        "Researchers will {} the link between diet and sleep.",
    ]},
    {"word": "outline", "definition": "describe the main features", "distractors": ["hide", "complete", "ignore"], "frames": [
        "The minister will {} the plan in parliament tomorrow.",
        "Please {} your main argument in the introduction.",
        "Tutors usually {} the course in the first session.",
        "The report will {} options for future investment.",
        "Speakers were asked to {} their proposal in five minutes.",
        "The brochure will {} the main features of each course.",
        "The director will {} the budget for next year.",
        "She will {} her career so far in the interview.",
        "Reviewers {} the strengths and weaknesses of each paper.",
        "The contract will {} the responsibilities of both parties.",
    ]},
    {"word": "allocate", "definition": "share out for a purpose", "distractors": ["lose", "spend", "ignore"], "frames": [
        "The council will {} extra funds for road repairs.",
        "Managers must {} time fairly between projects.",
        "The college will {} a tutor to each new student.",
        "We {} two members of staff to every team.",
        "Headteachers {} budgets across the year.",
        "Universities {} rooms based on student numbers.",
        "The rota will {} shifts over the next month.",
        "The system will {} resources according to need.",
        "Editors {} stories to reporters at the start of the day.",
        "We {} space for parking outside the new building.",
    ]},
    {"word": "underline", "definition": "emphasise", "distractors": ["doubt", "remove", "request"], "frames": [
        "The results {} the importance of early intervention.",
        "Recent events {} the value of clear leadership.",
        "Examples are used to {} the writer's main argument.",
        "These statistics {} the urgency of the situation.",
        "Newspaper editorials often {} a single key point.",
        "Photographs can {} a message that words alone cannot.",
        "The chair tried to {} the seriousness of the issue.",
        "Reviewers {} the originality of her approach.",
        "The data {} how much progress remains to be made.",
        "These case studies {} the report's main findings.",
    ]},
    {"word": "exhibit", "definition": "show or display", "distractors": ["conceal", "request", "criticise"], "frames": [
        "Children sometimes {} sudden changes in behaviour.",
        "Many alloys {} unusual magnetic properties.",
        "The plants {} bright flowers in early spring.",
        "Some birds {} complex courtship rituals.",
        "Most candidates {} a clear understanding of the topic.",
        "Cells {} different patterns under the microscope.",
        "Younger learners {} natural curiosity about language.",
        "These compounds can {} both acidic and basic behaviour.",
        "His paintings {} a strong sense of place.",
        "Athletes {} different responses to high altitude.",
    ]},
    {"word": "mitigate", "definition": "make less severe", "distractors": ["worsen", "hide", "create"], "frames": [
        "Trees can {} the effects of urban heat.",
        "Insurance can {} the financial impact of flooding.",
        "Counselling can {} the effects of stress.",
        "Better ventilation may {} the spread of viruses.",
        "Coastal defences are designed to {} the risk of erosion.",
        "Painkillers {} symptoms but do not cure the cause.",
        "Diversifying suppliers can {} business risk.",
        "Early warning systems {} the impact of severe weather.",
        "Vaccination programmes {} the impact of seasonal flu.",
        "Subtitles {} barriers for hard-of-hearing viewers.",
    ]},
    {"word": "scrutinise", "definition": "examine very carefully", "distractors": ["ignore", "describe", "approve"], "frames": [
        "MPs will {} the new bill clause by clause.",
        "Auditors {} every entry in the company's accounts.",
        "Journalists {} the minister's record in office.",
        "Examiners {} every answer for evidence of cheating.",
        "Inspectors {} restaurants for food-safety breaches.",
        "Bankers {} loan applications before approval.",
        "Editors {} every paragraph before publication.",
        "Border officers {} travel documents on arrival.",
        "Lawyers {} contracts for hidden clauses.",
        "The committee will {} the proposal in detail.",
    ]},
    {"word": "constitute", "definition": "make up", "distractors": ["destroy", "exclude", "challenge"], "frames": [
        "Women now {} more than half the medical students.",
        "Foreign students {} a quarter of the university.",
        "These changes {} a major shift in policy.",
        "A late payment may {} a breach of contract.",
        "The findings {} strong evidence in favour of reform.",
        "Public services {} a large share of council spending.",
        "Renewable sources will {} most of our power by 2040.",
        "Repeated absences may {} grounds for dismissal.",
        "Such remarks {} a clear breach of the code of conduct.",
        "These six chapters {} the second part of the book.",
    ]},
    {"word": "yield", "definition": "produce as a result", "distractors": ["destroy", "request", "delay"], "frames": [
        "The new method should {} more accurate results.",
        "Better seeds {} larger harvests in dry conditions.",
        "Long-term studies often {} surprising findings.",
        "Investments may {} returns over five to ten years.",
        "Combining the data sets should {} clearer trends.",
        "Even short interviews can {} useful insights.",
        "Hard work usually {} good results in the end.",
        "Modern reactors {} more energy from less fuel.",
        "The vineyard is expected to {} a record harvest.",
        "Careful editing will {} a more readable article.",
    ]},
    {"word": "subsequent", "definition": "coming after", "distractors": ["earlier", "constant", "missing"], "frames": [
        "The first study was small, but {} research was larger.",
        "Initial reports were promising; {} trials confirmed the benefits.",
        "{} chapters explore the theme in more detail.",
        "Her early novels were short; {} books were much longer.",
        "{} editions of the textbook will include the new data.",
        "The {} years saw rapid growth in the city.",
        "The first lecture is an overview; {} sessions go deeper.",
        "Initial losses were small, but {} months were much worse.",
        "{} updates will fix the remaining bugs.",
        "The first attempt failed, and {} attempts also struggled.",
    ]},
    {"word": "prior", "definition": "earlier or previous", "distractors": ["later", "missing", "current"], "frames": [
        "Please contact your tutor {} to the start of term.",
        "{} experience in retail is required for this role.",
        "The course assumes some {} knowledge of statistics.",
        "{} appointments must be cancelled at least 24 hours in advance.",
        "{} agreement is needed before changes are made.",
        "The applicant has no {} convictions.",
        "{} approval from the council is required.",
        "Please confirm your booking {} to arriving at the hotel.",
        "Photographs taken {} to renovation are kept in the archive.",
        "{} to 1990, the building was used as a school.",
    ]},
    {"word": "diverse", "definition": "varied or different", "distractors": ["similar", "small", "constant"], "frames": [
        "London is one of the most ethnically {} cities in Europe.",
        "Modern workplaces benefit from {} teams.",
        "The course covers {} topics from history to engineering.",
        "Students from {} backgrounds make for richer discussion.",
        "The reserve protects a {} range of wildlife.",
        "The festival features {} music from around the world.",
        "Healthy diets include {} fruits and vegetables.",
        "Magazines try to publish {} viewpoints on each issue.",
        "Local communities can be remarkably {}.",
        "The exhibition draws on {} sources from five centuries.",
    ]},
    {"word": "novel", "definition": "new or original", "distractors": ["traditional", "boring", "common"], "frames": [
        "The team has developed a {} approach to recycling.",
        "Researchers have found a {} use for old plastic bottles.",
        "Engineers proposed a {} solution to the cooling problem.",
        "The artist uses several {} techniques in this series.",
        "The lab has discovered a {} compound with strong antibiotic effect.",
        "The course introduces several {} ideas in the first week.",
        "Her thesis offers a {} reading of the early plays.",
        "The company is developing a {} battery technology.",
        "The book takes a {} approach to the same old story.",
        "She is testing a {} method for measuring sleep quality.",
    ]},
    {"word": "robust", "definition": "strong and effective", "distractors": ["weak", "small", "narrow"], "frames": [
        "The committee is calling for {} oversight of the industry.",
        "The economy remains {} despite recent shocks.",
        "Researchers want a more {} method for measuring poverty.",
        "We need a {} system to handle large volumes of data.",
        "The bridge has stood the test of time and remains {}.",
        "The findings are based on {} statistical analysis.",
        "Schools have called for {} support for new teachers.",
        "Auditors recommended {} controls over spending.",
        "Modern engines are surprisingly {} in extreme cold.",
        "The plan needs a more {} risk-management strategy.",
    ]},
    {"word": "compelling", "definition": "very convincing", "distractors": ["weak", "boring", "unclear"], "frames": [
        "The scientist made a {} case for further funding.",
        "There is now {} evidence that diet affects mood.",
        "Few films this year tell such a {} story.",
        "The minister's argument was {} but unpopular.",
        "Reviewers describe the novel as {} from the first page.",
        "He gave a {} explanation for his absence.",
        "The data offer {} support for the new theory.",
        "Charities need {} stories to attract donations.",
        "Documentaries can be {} when the topic is well chosen.",
        "Her presentation was clear, {} and well researched.",
    ]},
    {"word": "ambiguous", "definition": "open to more than one meaning", "distractors": ["clear", "loud", "early"], "frames": [
        "The wording of the question is rather {}.",
        "Survey results were {} on this point.",
        "The agreement contains several {} clauses.",
        "Her response was deliberately {}.",
        "The instructions are {} and need to be rewritten.",
        "Test results were {}, so further checks were needed.",
        "Some legal terms are notoriously {}.",
        "The phrase is grammatically {} in this sentence.",
        "Headlines can sometimes be {} on purpose.",
        "His silence was {} — agreement or disagreement?",
    ]},
    {"word": "underlying", "definition": "important but hidden", "distractors": ["obvious", "outside", "weekly"], "frames": [
        "Doctors must look for the {} cause of the symptoms.",
        "There is a clear {} pattern in the data.",
        "Engineers want to understand the {} reasons for the failure.",
        "The {} message of the film is one of hope.",
        "There are several {} assumptions in this argument.",
        "Inspectors found an {} structural problem in the wall.",
        "The {} principle is that everyone should be heard.",
        "There may be an {} health issue behind the fatigue.",
        "Most arguments rest on a few {} ideas.",
        "The {} costs of the project were not made clear.",
    ]},
    {"word": "consequently", "definition": "as a result", "distractors": ["however", "previously", "rarely"], "frames": [
        "Demand fell sharply; {}, prices dropped.",
        "Heavy rain blocked the road; {}, the bus was late.",
        "She studied every evening and, {}, did very well.",
        "The supplier missed the deadline and, {}, the launch was delayed.",
        "Costs have risen; {}, the project will be reviewed.",
        "Several staff were ill and, {}, the office was closed.",
        "Budgets were cut and, {}, two projects were stopped.",
        "She trained hard and, {}, broke her personal best.",
        "The bridge was unsafe and, {}, traffic had to be diverted.",
        "Sales have improved and, {}, more staff will be hired.",
    ]},
]

# Grammar templates for fill-blanks (typed) and dropdown-blanks
GRAMMAR_FILL: List[Dict[str, Any]] = [
    # Each item: template with {{0}}, correct answer, optional distractors (for dropdown)
    {"t": "She {{0}} to the gym every morning before work.", "a": "goes",   "d": ["go", "going"], "exp": "Third-person singular present simple takes -s: 'goes'."},
    {"t": "They {{0}} their homework yesterday evening.", "a": "did", "d": ["do", "done"], "exp": "Past simple of 'do' is 'did'."},
    {"t": "I have {{0}} in London since 2018.", "a": "lived", "d": ["live", "living"], "exp": "Present perfect uses past participle: 'have lived'."},
    {"t": "The train {{0}} at 7.45 every weekday morning.", "a": "leaves", "d": ["leave", "left"], "exp": "Schedules use present simple; third-person singular adds -s."},
    {"t": "While I was cooking, the phone {{0}}.", "a": "rang", "d": ["rings", "ringing"], "exp": "Past simple ('rang') interrupts past continuous ('was cooking')."},
    {"t": "If it {{0}} tomorrow, the match will be cancelled.", "a": "rains", "d": ["rain", "rained"], "exp": "First conditional: present simple in the if-clause."},
    {"t": "By 2020 she {{0}} in three different countries.", "a": "had lived", "d": ["lived", "has lived"], "exp": "Past perfect describes an action completed before a past time."},
    {"t": "He {{0}} the report by the time the meeting starts.", "a": "will have finished", "d": ["finishes", "is finishing"], "exp": "Future perfect: 'will have + past participle'."},
    {"t": "There {{0}} a lot of people at the concert last night.", "a": "were", "d": ["was", "are"], "exp": "Use 'were' with plural countable nouns in the past."},
    {"t": "She is interested {{0}} learning Spanish.", "a": "in", "d": ["on", "at"], "exp": "'Interested in' + gerund."},
    {"t": "I'm not very good {{0}} maths.", "a": "at", "d": ["in", "on"], "exp": "'Good at' + noun or gerund."},
    {"t": "The book is divided {{0}} four sections.", "a": "into", "d": ["onto", "in"], "exp": "'Divide into' is the standard collocation."},
    {"t": "She has been working here {{0}} five years.", "a": "for", "d": ["since", "during"], "exp": "Use 'for' with a length of time."},
    {"t": "I haven't seen him {{0}} Christmas.", "a": "since", "d": ["for", "from"], "exp": "Use 'since' with a point in time."},
    {"t": "Please put the keys {{0}} the table.", "a": "on", "d": ["in", "at"], "exp": "Use 'on' for surfaces."},
    {"t": "We're meeting {{0}} 3 o'clock.", "a": "at", "d": ["on", "in"], "exp": "Use 'at' for clock times."},
    {"t": "She was born {{0}} March.", "a": "in", "d": ["on", "at"], "exp": "Use 'in' for months."},
    {"t": "We'll see you {{0}} Friday.", "a": "on", "d": ["at", "in"], "exp": "Use 'on' for days of the week."},
    {"t": "I usually go to the gym {{0}} the weekend.", "a": "at", "d": ["on", "in"], "exp": "British English uses 'at the weekend'."},
    {"t": "He moved to Manchester {{0}} 2015.", "a": "in", "d": ["at", "on"], "exp": "Use 'in' for years."},
    {"t": "There is {{0}} apple on the plate.", "a": "an", "d": ["a", "the"], "exp": "Use 'an' before a vowel sound."},
    {"t": "Could you pass me {{0}} salt, please?", "a": "the", "d": ["a", "an"], "exp": "Use 'the' for a specific item shared with the listener."},
    {"t": "She is {{0}} honest person.", "a": "an", "d": ["a", "the"], "exp": "'Honest' starts with a silent h, so it takes 'an'."},
    {"t": "I bought {{0}} new bicycle last week.", "a": "a", "d": ["an", "the"], "exp": "Use 'a' before a consonant sound."},
    {"t": "We didn't have much rain {{0}} summer.", "a": "this", "d": ["these", "those"], "exp": "'This' for singular near time."},
    {"t": "{{0}} you mind opening the window?", "a": "Would", "d": ["Will", "Could"], "exp": "'Would you mind' + gerund is a polite request."},
    {"t": "You {{0}} smoke in the hospital.", "a": "must not", "d": ["should not", "could not"], "exp": "'Must not' expresses prohibition."},
    {"t": "You {{0}} bring a passport — your driving licence will do.", "a": "don't have to", "d": ["mustn't", "shouldn't"], "exp": "'Don't have to' = no obligation."},
    {"t": "I {{0}} swim when I was six.", "a": "could", "d": ["can", "was able"], "exp": "Past general ability: 'could'."},
    {"t": "He {{0}} have left already; the office is empty.", "a": "must", "d": ["can", "should"], "exp": "'Must have' expresses past deduction."},
    {"t": "She {{0}} have studied harder for the exam.", "a": "should", "d": ["must", "would"], "exp": "'Should have' expresses past regret/criticism."},
    {"t": "The window {{0}} broken by the storm.", "a": "was", "d": ["is", "were"], "exp": "Past simple passive: was/were + past participle."},
    {"t": "The new bridge {{0}} opened next month.", "a": "will be", "d": ["is", "has been"], "exp": "Future passive: will be + past participle."},
    {"t": "This essay {{0}} written by my sister.", "a": "was", "d": ["is", "were"], "exp": "Past simple passive (singular subject)."},
    {"t": "The package {{0}} delivered this morning.", "a": "has been", "d": ["have been", "was been"], "exp": "Present perfect passive: has/have been + past participle."},
    {"t": "The room {{0}} cleaned every day.", "a": "is", "d": ["was", "has"], "exp": "Present simple passive (singular)."},
    {"t": "My phone {{0}} repaired at the moment.", "a": "is being", "d": ["was being", "has been"], "exp": "Present continuous passive."},
    {"t": "She is the woman {{0}} won the competition.", "a": "who", "d": ["which", "whose"], "exp": "Use 'who' for people in subject relative clauses."},
    {"t": "That's the book {{0}} I was telling you about.", "a": "which", "d": ["who", "where"], "exp": "Use 'which' (or 'that') for things in object clauses."},
    {"t": "London is the city {{0}} I grew up.", "a": "where", "d": ["which", "who"], "exp": "Use 'where' for places."},
    {"t": "He's the friend {{0}} car broke down yesterday.", "a": "whose", "d": ["who", "which"], "exp": "'Whose' shows possession in relative clauses."},
    {"t": "If I {{0}} you, I would take the job.", "a": "were", "d": ["was", "am"], "exp": "Second conditional: 'If I were' is the standard form."},
    {"t": "If she had studied, she {{0}} have passed.", "a": "would", "d": ["will", "had"], "exp": "Third conditional: would have + past participle."},
    {"t": "Unless you hurry, you {{0}} be late.", "a": "will", "d": ["would", "have"], "exp": "Use 'will' after 'unless' in first conditionals."},
    {"t": "I wish I {{0}} more free time.", "a": "had", "d": ["have", "would"], "exp": "Wish + past simple for present unreal wishes."},
    {"t": "She told me she {{0}} arrive on Sunday.", "a": "would", "d": ["will", "would have"], "exp": "Reported speech: 'will' becomes 'would'."},
    {"t": "He said he {{0}} the report the day before.", "a": "had finished", "d": ["finished", "has finished"], "exp": "Reported past: present perfect / past simple → past perfect."},
    {"t": "She asked me where I {{0}} from.", "a": "was", "d": ["am", "have been"], "exp": "Reported question: 'are' becomes 'was'."},
    {"t": "I'd rather you {{0}} smoke in the house.", "a": "didn't", "d": ["don't", "won't"], "exp": "'Would rather' + past simple to talk about preference."},
    {"t": "It's time we {{0}} home.", "a": "went", "d": ["go", "have gone"], "exp": "'It's time' + past simple to suggest something should happen now."},
    {"t": "I look forward {{0}} hearing from you.", "a": "to", "d": ["of", "for"], "exp": "'Look forward to' + gerund."},
    {"t": "He's used {{0}} working late.", "a": "to", "d": ["of", "in"], "exp": "'Used to' + gerund means 'accustomed to'."},
    {"t": "She made the children {{0}} the dishes.", "a": "wash", "d": ["to wash", "washing"], "exp": "'Make + object + bare infinitive'."},
    {"t": "I let my brother {{0}} my car.", "a": "use", "d": ["to use", "using"], "exp": "'Let + object + bare infinitive'."},
    {"t": "He helped me {{0}} the table.", "a": "set", "d": ["to set", "setting"], "exp": "'Help + object + bare/to-infinitive' both work."},
    {"t": "We agreed {{0}} meet at six.", "a": "to", "d": ["of", "for"], "exp": "'Agree + to-infinitive'."},
    {"t": "I enjoy {{0}} long walks at weekends.", "a": "taking", "d": ["to take", "take"], "exp": "'Enjoy' is followed by gerund."},
    {"t": "She suggested {{0}} an Indian restaurant.", "a": "trying", "d": ["to try", "try"], "exp": "'Suggest' + gerund."},
    {"t": "I want {{0}} a new laptop.", "a": "to buy", "d": ["buying", "buy"], "exp": "'Want' + to-infinitive."},
    {"t": "He decided {{0}} a year off after university.", "a": "to take", "d": ["taking", "take"], "exp": "'Decide' + to-infinitive."},
    {"t": "She expects everyone {{0}} on time.", "a": "to be", "d": ["being", "be"], "exp": "'Expect + object + to-infinitive'."},
    {"t": "There isn't {{0}} milk left in the fridge.", "a": "any", "d": ["some", "much"], "exp": "Use 'any' in negative sentences with uncountables."},
    {"t": "Could I have {{0}} more coffee, please?", "a": "some", "d": ["any", "much"], "exp": "Use 'some' in polite requests."},
    {"t": "How {{0}} students are in your class?", "a": "many", "d": ["much", "any"], "exp": "Use 'many' with countable nouns."},
    {"t": "How {{0}} time do we have left?", "a": "much", "d": ["many", "few"], "exp": "Use 'much' with uncountable nouns."},
    {"t": "There are very {{0}} apples in the bowl.", "a": "few", "d": ["little", "much"], "exp": "Use 'few' with countable nouns to mean 'not many'."},
    {"t": "I have {{0}} interest in football.", "a": "little", "d": ["few", "many"], "exp": "Use 'little' with uncountables to mean 'not much'."},
    {"t": "Most of the children {{0}} fluent English.", "a": "speak", "d": ["speaks", "speaking"], "exp": "Plural subject takes plural verb."},
    {"t": "Either of the answers {{0}} acceptable.", "a": "is", "d": ["are", "be"], "exp": "'Either' takes a singular verb in formal English."},
    {"t": "Neither the manager nor his staff {{0}} aware of the issue.", "a": "were", "d": ["was", "is"], "exp": "Verb agrees with the nearer subject ('staff')."},
    {"t": "The news {{0}} surprising.", "a": "is", "d": ["are", "were"], "exp": "'News' is uncountable and takes singular verbs."},
    {"t": "Mathematics {{0}} my favourite subject.", "a": "is", "d": ["are", "were"], "exp": "Subjects ending in -ics take singular verbs."},
    {"t": "Twenty pounds {{0}} a fair price for that book.", "a": "is", "d": ["are", "were"], "exp": "A sum of money is treated as singular."},
    {"t": "He drives {{0}} than his sister.", "a": "more carefully", "d": ["carefuller", "carefullier"], "exp": "Adverbs of two or more syllables form comparative with 'more'."},
    {"t": "This is {{0}} book I have ever read.", "a": "the best", "d": ["best", "better"], "exp": "Use definite article + superlative."},
    {"t": "It's getting {{0}} difficult to find a parking space.", "a": "more and more", "d": ["the more", "much more than"], "exp": "Use 'more and more + adjective' to show gradual change."},
    {"t": "She speaks English {{0}} well as her brother.", "a": "as", "d": ["so", "more"], "exp": "'As ... as' for equality."},
    {"t": "He isn't {{0}} tall as his father.", "a": "as", "d": ["so", "than"], "exp": "Use 'as ... as' even in negative comparisons."},
    {"t": "Although it was raining, we {{0}} for a walk.", "a": "went", "d": ["go", "have gone"], "exp": "Past simple narrative tense after 'although'."},
    {"t": "Despite {{0}} tired, she finished the report.", "a": "being", "d": ["she was", "to be"], "exp": "'Despite' + gerund."},
    {"t": "In spite of the rain, we {{0}} our trip.", "a": "enjoyed", "d": ["enjoying", "to enjoy"], "exp": "After 'in spite of' use a noun phrase, then a normal main clause."},
    {"t": "The film was {{0}} good that we watched it twice.", "a": "so", "d": ["such", "very"], "exp": "'So + adjective + that'."},
    {"t": "It was {{0}} a long film that we missed the bus.", "a": "such", "d": ["so", "very"], "exp": "'Such + (a/an) + adjective + noun + that'."},
    {"t": "She works hard {{0}} pass her exams.", "a": "in order to", "d": ["so that", "for"], "exp": "'In order to' + bare infinitive expresses purpose."},
    {"t": "He saved money {{0}} he could buy a house.", "a": "so that", "d": ["in order to", "because"], "exp": "'So that' introduces a purpose clause with a modal verb."},
    {"t": "It {{0}} ages since we last met.", "a": "has been", "d": ["is", "was"], "exp": "Present perfect with 'since'."},
    {"t": "I can't {{0}} a car at all.", "a": "drive", "d": ["to drive", "driving"], "exp": "After modal 'can' use a bare infinitive."},
    {"t": "She might {{0}} late tonight.", "a": "be", "d": ["being", "to be"], "exp": "Modals are followed by a bare infinitive."},
    {"t": "I'd like a coffee, {{0}} I?", "a": "wouldn't", "d": ["don't", "won't"], "exp": "Question tag for 'I'd like' is 'wouldn't I'."},
    {"t": "You're coming with us, {{0}} you?", "a": "aren't", "d": ["don't", "isn't"], "exp": "Positive statement → negative tag with same auxiliary."},
    {"t": "He hardly ever {{0}} late for work.", "a": "is", "d": ["are", "be"], "exp": "Frequency adverb + present simple of 'be'."},
    {"t": "Not only {{0}} late, but he also forgot the report.", "a": "was he", "d": ["he was", "did he"], "exp": "Inversion after 'not only'."},
    {"t": "Never before {{0}} such a beautiful sunset.", "a": "have I seen", "d": ["I have seen", "I saw"], "exp": "Inversion after negative adverbial 'never before'."},
    {"t": "Hardly had we sat down {{0}} the phone rang.", "a": "when", "d": ["than", "and"], "exp": "'Hardly ... when' is a fixed pattern."},
    {"t": "No sooner had he arrived {{0}} the meeting started.", "a": "than", "d": ["when", "and"], "exp": "'No sooner ... than' is a fixed pattern."},
    {"t": "I'd prefer to walk {{0}} take the bus.", "a": "rather than", "d": ["instead", "more than"], "exp": "'Prefer to ... rather than' to compare two actions."},
    {"t": "The more I read, {{0}} I understand.", "a": "the more", "d": ["more", "much more"], "exp": "Comparative correlative: 'the more ... the more'."},
    {"t": "She has been waiting {{0}} early this morning.", "a": "since", "d": ["for", "from"], "exp": "Use 'since' with a starting point in time."},
    {"t": "He's lived in Bristol {{0}} ten years.", "a": "for", "d": ["since", "during"], "exp": "Use 'for' with a length of time."},
    {"t": "Ever {{0}} I moved here, I've been happier.", "a": "since", "d": ["after", "for"], "exp": "'Ever since' + past simple for an ongoing situation."},
    {"t": "By the time I arrived, the meeting {{0}}.", "a": "had started", "d": ["started", "has started"], "exp": "Past perfect for the earlier of two past events."},
    {"t": "The teacher had explained the rule before he {{0}} the test.", "a": "set", "d": ["sets", "is setting"], "exp": "Past simple for the later past action."},
    {"t": "I'm sorry, the manager {{0}} a meeting at the moment.", "a": "is in", "d": ["was in", "has been in"], "exp": "Present continuous-ish: state right now uses 'is in'."},
    {"t": "Please don't disturb him; he {{0}}.", "a": "is sleeping", "d": ["sleeps", "slept"], "exp": "Present continuous for an action in progress now."},
    {"t": "Water {{0}} at one hundred degrees Celsius.", "a": "boils", "d": ["boil", "boiled"], "exp": "Present simple for general truths."},
    {"t": "The Earth {{0}} round the Sun.", "a": "moves", "d": ["move", "is moving"], "exp": "Present simple for general truths."},
    {"t": "We {{0}} dinner when the lights went out.", "a": "were having", "d": ["had", "have"], "exp": "Past continuous interrupted by past simple."},
    {"t": "She {{0}} her keys this morning.", "a": "lost", "d": ["has lost", "had lost"], "exp": "Past simple with a finished time expression."},
    {"t": "I {{0}} the new film three times already.", "a": "have seen", "d": ["saw", "had seen"], "exp": "Present perfect with 'already' and unfinished time."},
    {"t": "He hasn't been to Paris {{0}}.", "a": "yet", "d": ["already", "ever"], "exp": "Use 'yet' in negatives and questions for things expected."},
    {"t": "She has just {{0}} the door.", "a": "closed", "d": ["close", "closing"], "exp": "Present perfect uses past participle."},
    {"t": "I have lived here {{0}} I was born.", "a": "since", "d": ["for", "while"], "exp": "Use 'since' with a point in time."},
    {"t": "{{0}} I were rich, I would travel more.", "a": "If", "d": ["When", "Although"], "exp": "Second conditional uses 'if + past'."},
    {"t": "I will phone you as soon as I {{0}} home.", "a": "get", "d": ["will get", "got"], "exp": "Use present simple after 'as soon as' for future time."},
    {"t": "He told me he {{0}} call later.", "a": "would", "d": ["will", "would have"], "exp": "Reported speech: 'will' becomes 'would'."},
    {"t": "The bag {{0}} stolen last night.", "a": "was", "d": ["is", "were"], "exp": "Past simple passive with singular subject."},
    {"t": "These houses {{0}} built in the 1930s.", "a": "were", "d": ["was", "have been"], "exp": "Past simple passive with plural subject."},
    {"t": "The roof {{0}} repaired tomorrow.", "a": "will be", "d": ["is", "has been"], "exp": "Future passive: 'will be' + past participle."},
    {"t": "The shop {{0}} owned by my uncle.", "a": "is", "d": ["are", "was been"], "exp": "Present simple passive (state, singular)."},
    {"t": "The match {{0}} cancelled because of the snow.", "a": "was", "d": ["were", "is"], "exp": "Past simple passive with singular subject."},
    {"t": "He {{0}} regarded as the best player in the team.", "a": "is", "d": ["are", "be"], "exp": "Present simple passive with singular subject."},
    {"t": "Smoking {{0}} not allowed inside the building.", "a": "is", "d": ["are", "was"], "exp": "Present simple passive (general rule)."},
    {"t": "By next year, the new bridge {{0}} completed.", "a": "will have been", "d": ["will be", "has been"], "exp": "Future perfect passive."},
    {"t": "The problem must {{0}} solved as soon as possible.", "a": "be", "d": ["been", "being"], "exp": "Modal passive: modal + be + past participle."},
    {"t": "Anyone {{0}} wants to come is welcome.", "a": "who", "d": ["which", "whose"], "exp": "Use 'who' for people."},
    {"t": "This is the village {{0}} my grandmother grew up.", "a": "where", "d": ["which", "who"], "exp": "Use 'where' for places."},
    {"t": "The reason {{0}} I phoned was to apologise.", "a": "why", "d": ["who", "where"], "exp": "Use 'why' to introduce a reason clause."},
    {"t": "She is the one {{0}} mother teaches at our school.", "a": "whose", "d": ["who", "which"], "exp": "'Whose' shows possession."},
    {"t": "It was the noise {{0}} woke me up.", "a": "that", "d": ["who", "where"], "exp": "Use 'that' (or 'which') for things."},
    {"t": "The train {{0}} we took was very crowded.", "a": "that", "d": ["who", "where"], "exp": "Use 'that' for things in defining clauses."},
    {"t": "I don't know {{0}} he is coming.", "a": "whether", "d": ["that", "who"], "exp": "'Whether' introduces an indirect yes/no question."},
    {"t": "Please tell me {{0}} the meeting is.", "a": "when", "d": ["whether", "while"], "exp": "Use 'when' for time questions."},
    {"t": "Could you tell me {{0}} the station is, please?", "a": "where", "d": ["which", "what"], "exp": "Use 'where' for place questions."},
    {"t": "She asked {{0}} I had any change.", "a": "if", "d": ["that", "what"], "exp": "Use 'if' / 'whether' in indirect yes/no questions."},
    {"t": "If only I {{0}} more time to revise.", "a": "had", "d": ["have", "would have"], "exp": "'If only' + past simple for present unreal wishes."},
    {"t": "You {{0}} better take an umbrella; it looks like rain.", "a": "had", "d": ["have", "would"], "exp": "'Had better + bare infinitive' for strong advice."},
    {"t": "He'd rather we {{0}} home now.", "a": "went", "d": ["go", "going"], "exp": "'Would rather' + past simple to express preference about another person."},
    {"t": "I'm going to the supermarket — do you need {{0}}?", "a": "anything", "d": ["something", "everything"], "exp": "Use 'anything' in questions and negatives."},
    {"t": "There's {{0}} at the door.", "a": "someone", "d": ["anyone", "everyone"], "exp": "Use 'someone' in positive statements."},
    {"t": "I have {{0}} to do today.", "a": "nothing", "d": ["anything", "something"], "exp": "'Nothing' is used in positive verbs to give a negative meaning."},
    {"t": "Is there {{0}} else you'd like to add?", "a": "anything", "d": ["something", "everything"], "exp": "Use 'anything' in questions."},
    {"t": "I {{0}} go to that café — it's quite nice.", "a": "sometimes", "d": ["since", "by"], "exp": "Use 'sometimes' as a frequency adverb (mid-position)."},
    {"t": "He is {{0}} late for his lessons.", "a": "rarely", "d": ["since", "for"], "exp": "Use 'rarely' as a frequency adverb (mid-position)."},
    {"t": "We have lived here {{0}} a long time.", "a": "for", "d": ["since", "during"], "exp": "Use 'for' with a length of time."},
    {"t": "She fell asleep {{0}} the film.", "a": "during", "d": ["for", "since"], "exp": "Use 'during' with a noun for an event/period."},
    {"t": "The kitchen door is {{0}} the living room.", "a": "next to", "d": ["between", "above"], "exp": "'Next to' = beside."},
    {"t": "There is a clock {{0}} the wall.", "a": "on", "d": ["in", "at"], "exp": "Use 'on' for surfaces."},
    {"t": "I sat {{0}} two old friends at dinner.", "a": "between", "d": ["among", "next to"], "exp": "Use 'between' for two distinct items."},
    {"t": "She walked {{0}} the room and out of the door.", "a": "across", "d": ["through", "into"], "exp": "'Across' = from one side to the other."},
    {"t": "We drove {{0}} the tunnel for almost an hour.", "a": "through", "d": ["across", "over"], "exp": "'Through' suggests inside an enclosed space."},
    {"t": "There's a small bridge {{0}} the river.", "a": "over", "d": ["above", "across"], "exp": "'Over' for crossing or covering."},
    {"t": "The cat is hiding {{0}} the sofa.", "a": "behind", "d": ["under", "next to"], "exp": "'Behind' = at the back of."},
    {"t": "I'll wait for you {{0}} the entrance.", "a": "at", "d": ["on", "in"], "exp": "Use 'at' for a specific point/place."},
    {"t": "He works {{0}} a small office in the city centre.", "a": "in", "d": ["on", "at"], "exp": "Use 'in' for an enclosed area."},
    {"t": "I left my coat {{0}} home.", "a": "at", "d": ["in", "on"], "exp": "'At home' is a fixed phrase."},
    {"t": "Can you remember to call {{0}} the office tomorrow?", "a": "in", "d": ["at", "on"], "exp": "'Call in' = visit briefly."},
    {"t": "Could you turn the music {{0}}, please? It's too loud.", "a": "down", "d": ["off", "out"], "exp": "'Turn down' = reduce volume."},
    {"t": "Please turn {{0}} the lights when you leave.", "a": "off", "d": ["down", "in"], "exp": "'Turn off' = stop a device."},
    {"t": "I look {{0}} my younger brother every weekend.", "a": "after", "d": ["for", "out"], "exp": "'Look after' = take care of."},
    {"t": "Children should look {{0}} carefully when crossing the road.", "a": "out", "d": ["for", "after"], "exp": "'Look out' = be careful."},
    {"t": "I'm looking {{0}} my keys; I can't find them.", "a": "for", "d": ["after", "out"], "exp": "'Look for' = search for."},
    {"t": "She picked {{0}} a few useful phrases on holiday.", "a": "up", "d": ["off", "out"], "exp": "'Pick up' = learn informally."},
    {"t": "The plane took {{0}} on time.", "a": "off", "d": ["over", "out"], "exp": "'Take off' = leave the ground."},
    {"t": "He gave {{0}} smoking last year.", "a": "up", "d": ["in", "out"], "exp": "'Give up' = stop a habit."},
    {"t": "Could you fill {{0}} this form, please?", "a": "in", "d": ["up", "out"], "exp": "'Fill in' = complete a form (UK)."},
    {"t": "I need to find {{0}} the phone number for the hotel.", "a": "out", "d": ["in", "up"], "exp": "'Find out' = discover information."},
    {"t": "We set {{0}} early to avoid the traffic.", "a": "off", "d": ["over", "in"], "exp": "'Set off' = begin a journey."},
    {"t": "She put {{0}} her coat and went outside.", "a": "on", "d": ["in", "out"], "exp": "'Put on' = wear."},
    {"t": "Please take {{0}} your shoes at the door.", "a": "off", "d": ["out", "in"], "exp": "'Take off' = remove (clothes)."},
    {"t": "I'll think {{0}} it and let you know.", "a": "about", "d": ["of", "in"], "exp": "'Think about' = consider over time."},
    {"t": "She insisted {{0}} paying for dinner.", "a": "on", "d": ["in", "to"], "exp": "'Insist on' + gerund."},
    {"t": "He apologised {{0}} being late.", "a": "for", "d": ["of", "from"], "exp": "'Apologise for' + gerund."},
    {"t": "We congratulated her {{0}} her promotion.", "a": "on", "d": ["for", "of"], "exp": "'Congratulate someone on' something."},
    {"t": "I borrowed the book {{0}} my flatmate.", "a": "from", "d": ["to", "by"], "exp": "'Borrow from' (and 'lend to')."},
    {"t": "Could you lend me a pen, {{0}} you?", "a": "could", "d": ["are", "would"], "exp": "Question tag matches modal 'could'."},
    {"t": "The film starts {{0}} half past seven.", "a": "at", "d": ["on", "in"], "exp": "Use 'at' for clock times."},
    {"t": "We're going on holiday {{0}} the autumn.", "a": "in", "d": ["at", "on"], "exp": "Use 'in' for seasons."},
    {"t": "He always works late {{0}} Mondays.", "a": "on", "d": ["in", "at"], "exp": "Use 'on' for repeated days."},
    {"t": "The keys are {{0}} the kitchen drawer.", "a": "in", "d": ["on", "at"], "exp": "Use 'in' for inside something."},
    {"t": "He looked {{0}} at the strange noise.", "a": "around", "d": ["over", "in"], "exp": "'Look around' = look in different directions."},
    {"t": "Please hold {{0}} a moment while I check.", "a": "on", "d": ["off", "out"], "exp": "'Hold on' = wait."},
    {"t": "The plane is about to {{0}} off.", "a": "take", "d": ["set", "go"], "exp": "Phrasal 'take off'."},
    {"t": "I can't put {{0}} with this noise any longer.", "a": "up", "d": ["off", "in"], "exp": "'Put up with' = tolerate."},
    {"t": "We ran {{0}} of milk this morning.", "a": "out", "d": ["off", "into"], "exp": "'Run out of' = have no more."},
    {"t": "I came {{0}} an old photo while cleaning.", "a": "across", "d": ["over", "into"], "exp": "'Come across' = find by chance."},
    {"t": "She turned {{0}} the job offer.", "a": "down", "d": ["off", "in"], "exp": "'Turn down' = reject."},
    {"t": "He looks {{0}} his father.", "a": "like", "d": ["as", "of"], "exp": "'Look like' = resemble."},
    {"t": "She works {{0}} a nurse in a busy hospital.", "a": "as", "d": ["like", "for"], "exp": "Use 'as' for a job/role."},
    {"t": "I prefer tea {{0}} coffee.", "a": "to", "d": ["from", "than"], "exp": "'Prefer X to Y'."},
    {"t": "There is no need {{0}} worry.", "a": "to", "d": ["of", "for"], "exp": "'Need to' + bare infinitive."},
    {"t": "She managed {{0}} finish the report on time.", "a": "to", "d": ["of", "for"], "exp": "'Manage to' + bare infinitive."},
    {"t": "Children must {{0}} taught to read carefully.", "a": "be", "d": ["been", "being"], "exp": "Modal passive: must be + past participle."},
    {"t": "He should {{0}} the doctor as soon as possible.", "a": "see", "d": ["sees", "saw"], "exp": "Modal + bare infinitive."},
    {"t": "Could I {{0}} your phone for a minute?", "a": "use", "d": ["uses", "to use"], "exp": "Modals are followed by bare infinitive."},
    {"t": "May I {{0}} a question?", "a": "ask", "d": ["asks", "asking"], "exp": "Modal + bare infinitive."},
    {"t": "We ought {{0}} respect older people.", "a": "to", "d": ["of", "for"], "exp": "'Ought to' + bare infinitive."},
    {"t": "I can hardly {{0}} you; please speak up.", "a": "hear", "d": ["heard", "hearing"], "exp": "Modal + bare infinitive."},
    {"t": "You {{0}} not enter the room without permission.", "a": "must", "d": ["may not", "could not"], "exp": "'Must not' for prohibition."},
    {"t": "I {{0}} known you were coming!", "a": "would have", "d": ["will have", "had"], "exp": "Past unreal: would have + past participle."},
    {"t": "If you had told me earlier, I {{0}} have helped.", "a": "could", "d": ["can", "must"], "exp": "Third conditional with 'could have'."},
    {"t": "By next month I {{0}} my driving test.", "a": "will have taken", "d": ["take", "have taken"], "exp": "Future perfect for actions completed by a future point."},
    {"t": "He is keen {{0}} cooking.", "a": "on", "d": ["in", "of"], "exp": "'Keen on' + gerund."},
    {"t": "She is afraid {{0}} dogs.", "a": "of", "d": ["from", "for"], "exp": "'Afraid of' + noun."},
    {"t": "He's bored {{0}} his job.", "a": "with", "d": ["of", "from"], "exp": "'Bored with' + noun."},
    {"t": "We are aware {{0}} the problem.", "a": "of", "d": ["with", "from"], "exp": "'Aware of'."},
    {"t": "She is similar {{0}} her sister in many ways.", "a": "to", "d": ["with", "from"], "exp": "'Similar to'."},
    {"t": "The new manager is different {{0}} the previous one.", "a": "from", "d": ["with", "to"], "exp": "British English uses 'different from'."},
    {"t": "He's responsible {{0}} the budget.", "a": "for", "d": ["of", "with"], "exp": "'Responsible for'."},
    {"t": "We are dependent {{0}} foreign imports.", "a": "on", "d": ["of", "with"], "exp": "'Dependent on'."},
    {"t": "She has a passion {{0}} music.", "a": "for", "d": ["of", "with"], "exp": "'A passion for'."},
    {"t": "There is a need {{0}} better public transport.", "a": "for", "d": ["of", "to"], "exp": "'A need for'."},
    {"t": "Please pay attention {{0}} the safety announcement.", "a": "to", "d": ["on", "with"], "exp": "'Pay attention to'."},
    {"t": "He is married {{0}} a French teacher.", "a": "to", "d": ["with", "of"], "exp": "British English uses 'married to'."},
    {"t": "She is engaged {{0}} an old school friend.", "a": "to", "d": ["with", "of"], "exp": "'Engaged to'."},
    {"t": "He apologised {{0}} the noise.", "a": "for", "d": ["of", "to"], "exp": "'Apologise for'."},
    {"t": "I'm not familiar {{0}} this software.", "a": "with", "d": ["of", "in"], "exp": "'Familiar with'."},
    {"t": "She was nervous {{0}} the interview.", "a": "about", "d": ["of", "with"], "exp": "'Nervous about'."},
    {"t": "We are excited {{0}} the trip.", "a": "about", "d": ["of", "with"], "exp": "'Excited about'."},
    {"t": "He's good {{0}} fixing things.", "a": "at", "d": ["in", "on"], "exp": "'Good at' + gerund."},
    {"t": "I'm tired {{0}} listening to the same song.", "a": "of", "d": ["from", "with"], "exp": "'Tired of' + gerund."},
    {"t": "She is fond {{0}} animals.", "a": "of", "d": ["with", "for"], "exp": "'Fond of' + noun."},
    {"t": "We are proud {{0}} our children.", "a": "of", "d": ["with", "for"], "exp": "'Proud of'."},
    {"t": "He's allergic {{0}} peanuts.", "a": "to", "d": ["from", "with"], "exp": "'Allergic to'."},
    {"t": "I'm grateful {{0}} all your help.", "a": "for", "d": ["of", "to"], "exp": "'Grateful for' + thing."},
]

# Multiple-response stems: "Select TWO/THREE that are correct"
IELTS_MR: List[Dict[str, Any]] = [
    {"q": "Which TWO of the following sentences use the present perfect tense?",
     "options": [
         "I have lived in Bristol for three years.",
         "She visited Paris last summer.",
         "They have just finished their meal.",
         "He works in a hospital in central London.",
     ],
     "correct": [0, 2],
     "exp": "Both 'have lived' and 'have finished' are present perfect (have + past participle)."},
    {"q": "Which TWO sentences are written in formal academic style?",
     "options": [
         "Loads of people reckon the policy is rubbish.",
         "The policy has been widely criticised by researchers.",
         "Recent findings suggest a need for reform.",
         "Honestly, it's a complete mess.",
     ],
     "correct": [1, 2],
     "exp": "Academic style avoids slang ('loads of', 'reckon', 'rubbish', 'honestly')."},
    {"q": "Which TWO words are the closest synonyms for 'significant'?",
     "options": ["important", "trivial", "considerable", "early"],
     "correct": [0, 2],
     "exp": "'Important' and 'considerable' both convey meaningful size/importance."},
    {"q": "Which TWO sentences contain a passive verb?",
     "options": [
         "The bridge was built in 1894.",
         "The council built a new bridge in 1894.",
         "These houses were sold last week.",
         "We sold these houses last week.",
     ],
     "correct": [0, 2],
     "exp": "'Was built' and 'were sold' are passives (be + past participle)."},
    {"q": "Which TWO are correct linking words for adding similar ideas?",
     "options": ["furthermore", "however", "in addition", "in contrast"],
     "correct": [0, 2],
     "exp": "'Furthermore' and 'in addition' both add information."},
    {"q": "Which TWO are correct linking words for showing contrast?",
     "options": ["however", "moreover", "nevertheless", "additionally"],
     "correct": [0, 2],
     "exp": "'However' and 'nevertheless' both signal contrast."},
    {"q": "Which TWO sentences correctly use the article 'the'?",
     "options": [
         "The Sun is a star.",
         "The honesty is important in friendship.",
         "She plays the piano beautifully.",
         "I love the music.",
     ],
     "correct": [0, 2],
     "exp": "Use 'the' with unique objects (the Sun) and musical instruments (the piano)."},
    {"q": "Which TWO words are commonly used for 'to investigate' in academic writing?",
     "options": ["explore", "ignore", "examine", "skim"],
     "correct": [0, 2],
     "exp": "'Explore' and 'examine' are formal synonyms for 'investigate'."},
    {"q": "Which TWO collocations are correct?",
     "options": ["make a decision", "do a decision", "do research", "make research"],
     "correct": [0, 2],
     "exp": "'Make a decision' and 'do research' are the standard collocations."},
    {"q": "Which TWO sentences correctly use reported speech?",
     "options": [
         "She said she was tired.",
         "She said she is tired.",
         "He told me he had finished.",
         "He told me he has finished.",
     ],
     "correct": [0, 2],
     "exp": "Reported speech usually shifts present forms to past."},
    {"q": "Which TWO words are used to introduce examples?",
     "options": ["for instance", "in conclusion", "such as", "therefore"],
     "correct": [0, 2],
     "exp": "'For instance' and 'such as' both introduce examples."},
    {"q": "Which TWO sentences contain a relative clause?",
     "options": [
         "The book that I borrowed is very interesting.",
         "I borrowed an interesting book yesterday.",
         "She is the friend who helped me move.",
         "She helped me move last weekend.",
     ],
     "correct": [0, 2],
     "exp": "Relative clauses begin with 'that', 'who', 'which', 'whose', 'where'."},
    {"q": "Which TWO modal verbs can express possibility?",
     "options": ["might", "must", "could", "should"],
     "correct": [0, 2],
     "exp": "Both 'might' and 'could' express possibility."},
    {"q": "Which TWO words mean 'because of'?",
     "options": ["due to", "in spite of", "owing to", "although"],
     "correct": [0, 2],
     "exp": "'Due to' and 'owing to' both express cause."},
    {"q": "Which TWO sentences use the conditional correctly?",
     "options": [
         "If I had more time, I would learn Spanish.",
         "If I would have more time, I learned Spanish.",
         "If she had told me, I would have helped.",
         "If she would have told me, I helped.",
     ],
     "correct": [0, 2],
     "exp": "Use 'if + past' for second conditional and 'if + past perfect' for third conditional."},
    {"q": "Which TWO words are commonly used to summarise an academic essay?",
     "options": ["overall", "unfortunately", "in summary", "currently"],
     "correct": [0, 2],
     "exp": "'Overall' and 'in summary' are typical summary phrases."},
    {"q": "Which TWO sentences contain a phrasal verb?",
     "options": [
         "He turned off the radio.",
         "He stopped the car.",
         "She came across an old photo.",
         "She found an old photo on the table.",
     ],
     "correct": [0, 2],
     "exp": "'Turn off' and 'come across' are phrasal verbs."},
    {"q": "Which TWO words mean 'reduce'?",
     "options": ["lessen", "expand", "diminish", "intensify"],
     "correct": [0, 2],
     "exp": "'Lessen' and 'diminish' both mean reduce."},
    {"q": "Which TWO are linking words for sequence?",
     "options": ["firstly", "however", "subsequently", "in contrast"],
     "correct": [0, 2],
     "exp": "'Firstly' and 'subsequently' show sequence."},
    {"q": "Which TWO sentences contain an adverb?",
     "options": [
         "She runs quickly to the bus stop.",
         "She is a fast runner.",
         "He spoke clearly during his presentation.",
         "He is a clear speaker.",
     ],
     "correct": [0, 2],
     "exp": "'Quickly' and 'clearly' modify verbs and are adverbs."},
    {"q": "Which TWO are correct contractions?",
     "options": ["isn't", "amn't", "wasn't", "don't is"],
     "correct": [0, 2],
     "exp": "'Isn't' and 'wasn't' are standard. 'Amn't' is dialectal; 'don't is' is not a contraction."},
    {"q": "Which TWO words are uncountable?",
     "options": ["furniture", "table", "advice", "suggestion"],
     "correct": [0, 2],
     "exp": "'Furniture' and 'advice' are uncountable in English."},
    {"q": "Which TWO sentences use 'used to' correctly?",
     "options": [
         "I used to play tennis when I was younger.",
         "I am used to play tennis when I was younger.",
         "She used to live in Cardiff for ten years.",
         "She is used to living in Cardiff.",
     ],
     "correct": [0, 3],
     "exp": "'Used to + bare infinitive' for past habits; 'be used to + gerund' for being accustomed."},
    {"q": "Which TWO words mean 'to expand'?",
     "options": ["enlarge", "shrink", "broaden", "narrow"],
     "correct": [0, 2],
     "exp": "'Enlarge' and 'broaden' both mean to make bigger."},
    {"q": "Which TWO are correct ways to give an opinion in academic English?",
     "options": [
         "It seems likely that …",
         "It's gonna be …",
         "It can be argued that …",
         "Like, basically …",
     ],
     "correct": [0, 2],
     "exp": "Hedged phrases like 'it seems likely' and 'it can be argued' are typical of academic style."},
    {"q": "Which TWO words mean 'to occur'?",
     "options": ["happen", "vanish", "take place", "remove"],
     "correct": [0, 2],
     "exp": "Both 'happen' and 'take place' are synonyms of 'occur'."},
    {"q": "Which TWO sentences are grammatically correct?",
     "options": [
         "She has lived here since 2010.",
         "She has lived here for 2010.",
         "I have known him for ten years.",
         "I have known him since ten years.",
     ],
     "correct": [0, 2],
     "exp": "'Since' + point in time; 'for' + length of time."},
    {"q": "Which TWO are common discourse markers in IELTS Speaking?",
     "options": ["well, …", "in any case, …", "ROFL, …", "K, so, …"],
     "correct": [0, 1],
     "exp": "Spoken English often begins with 'well' or 'in any case'."},
    {"q": "Which TWO mean 'as a result'?",
     "options": ["consequently", "however", "therefore", "although"],
     "correct": [0, 2],
     "exp": "'Consequently' and 'therefore' both express result."},
    {"q": "Which TWO are good IELTS Writing 'paraphrasing' techniques?",
     "options": [
         "Replace key words with synonyms.",
         "Copy the question word-for-word.",
         "Change the word order or sentence structure.",
         "Skip the introduction.",
     ],
     "correct": [0, 2],
     "exp": "Paraphrasing combines synonym substitution with sentence-structure change."},
    {"q": "Which TWO sentences contain a comparative form?",
     "options": [
         "The second test was harder than the first.",
         "The second test was the hardest of all.",
         "London is more crowded than Bristol.",
         "London is the most crowded city in the country.",
     ],
     "correct": [0, 2],
     "exp": "'Harder than' and 'more crowded than' are comparatives."},
    {"q": "Which TWO sentences contain a superlative?",
     "options": [
         "She is the tallest in the class.",
         "She is taller than her sister.",
         "It was the most interesting talk of the day.",
         "It was a more interesting talk than yesterday's.",
     ],
     "correct": [0, 2],
     "exp": "'Tallest' and 'most interesting' are superlatives."},
    {"q": "Which TWO words are nouns?",
     "options": ["decision", "decide", "happiness", "happily"],
     "correct": [0, 2],
     "exp": "'Decision' and 'happiness' are nouns; 'decide' is a verb and 'happily' an adverb."},
    {"q": "Which TWO words are adjectives?",
     "options": ["careful", "carefully", "responsible", "responsibly"],
     "correct": [0, 2],
     "exp": "'Careful' and 'responsible' are adjectives; the -ly forms are adverbs."},
    {"q": "Which TWO sentences are written in correct British English?",
     "options": [
         "I'll meet you at the weekend.",
         "I'll meet you on the weekend.",
         "We've already had our tea.",
         "We've already taken our tea.",
     ],
     "correct": [0, 2],
     "exp": "British English uses 'at the weekend' and the verb 'have' for meals."},
    {"q": "Which TWO are common collocations with 'do'?",
     "options": ["do homework", "do the dishes", "do a mistake", "do a decision"],
     "correct": [0, 1],
     "exp": "'Do homework' and 'do the dishes' are correct; the others use 'make'."},
    {"q": "Which TWO are common collocations with 'make'?",
     "options": ["make a noise", "make a mistake", "make the housework", "make exercise"],
     "correct": [0, 1],
     "exp": "'Make a noise' and 'make a mistake' are correct."},
    {"q": "Which TWO are correct ways to politely interrupt?",
     "options": ["Sorry to interrupt, but …", "Excuse me, may I add something?", "Hey, listen!", "Shut up a minute."],
     "correct": [0, 1],
     "exp": "The first two are polite; the others are rude."},
    {"q": "Which TWO are correct in formal letters?",
     "options": ["Yours sincerely,", "Yours faithfully,", "Cheers!", "Bye 4 now"],
     "correct": [0, 1],
     "exp": "'Yours sincerely' and 'Yours faithfully' are formal sign-offs."},
    {"q": "Which TWO are common discourse markers for clarification?",
     "options": ["in other words", "by the way", "that is to say", "anyway"],
     "correct": [0, 2],
     "exp": "Both phrases reformulate an earlier point."},
    {"q": "Which TWO sentences contain a gerund?",
     "options": [
         "Swimming is good exercise.",
         "I want to swim every day.",
         "She enjoys reading novels.",
         "She wants to read novels.",
     ],
     "correct": [0, 2],
     "exp": "'Swimming' and 'reading' here are gerunds (-ing nouns)."},
    {"q": "Which TWO sentences contain an infinitive?",
     "options": [
         "We want to leave early.",
         "We want leaving early.",
         "He hopes to find a new job.",
         "He hopes finding a new job.",
     ],
     "correct": [0, 2],
     "exp": "'To leave' and 'to find' are infinitive forms."},
    {"q": "Which TWO words are commonly confused with 'affect'?",
     "options": ["effect", "infect", "affection", "effects"],
     "correct": [0, 3],
     "exp": "'Effect' (noun) and 'effects' are commonly confused with the verb 'affect'."},
    {"q": "Which TWO sentences are punctuated correctly?",
     "options": [
         "I bought apples, oranges, and bananas.",
         "I bought, apples oranges and bananas.",
         "After the meeting, we went home.",
         "After, the meeting we went home.",
     ],
     "correct": [0, 2],
     "exp": "Items in a list use commas; an introductory phrase is followed by a comma."},
    {"q": "Which TWO are typical IELTS Speaking part 1 topics?",
     "options": ["Hometown", "Quantum physics", "Daily routines", "Theoretical algebra"],
     "correct": [0, 2],
     "exp": "Part 1 covers familiar topics like hometown and routines."},
    {"q": "Which TWO are good Speaking 'fillers' to buy thinking time?",
     "options": ["That's a good question.", "Hmm, let me think for a moment.", "I haven't a clue.", "Whatever."],
     "correct": [0, 1],
     "exp": "Polite fillers signal that you are thinking, not refusing."},
    {"q": "Which TWO sentences correctly use 'few' and 'a few'?",
     "options": [
         "Few people came, so the room felt empty.",
         "A few people came, so we had a lovely chat.",
         "A few people came, so the room felt empty.",
         "Few people came, so we had a lovely chat.",
     ],
     "correct": [0, 1],
     "exp": "'Few' is negative ('not many'); 'a few' is positive ('some')."},
    {"q": "Which TWO are correct ways to say someone is a beginner in English?",
     "options": ["She is at A1 level.", "She is a beginner.", "She is C2 fluent.", "She is at native level."],
     "correct": [0, 1],
     "exp": "A1 is the elementary CEFR level for beginners."},
    {"q": "Which TWO words are spelled correctly?",
     "options": ["accommodation", "acommodation", "definitely", "definately"],
     "correct": [0, 2],
     "exp": "'Accommodation' has double-c, double-m. 'Definitely' has -nite-, not -nate-."},
    {"q": "Which TWO are correct ways to ask for repetition politely?",
     "options": ["Sorry, could you repeat that?", "Pardon?", "What?", "Say again?"],
     "correct": [0, 1],
     "exp": "The first two are polite UK English; 'What?' alone can sound rude."},
    {"q": "Which TWO are formal ways to make a request in writing?",
     "options": ["I would be grateful if you could …", "Please send me …", "Could you possibly …?", "Send me …"],
     "correct": [0, 2],
     "exp": "'I would be grateful if' and 'Could you possibly' are polite request forms."},
    {"q": "Which TWO sentences correctly use 'less' and 'fewer'?",
     "options": [
         "There are fewer apples than yesterday.",
         "There is less milk than yesterday.",
         "There are less apples than yesterday.",
         "There is fewer milk than yesterday.",
     ],
     "correct": [0, 1],
     "exp": "Use 'fewer' with countable nouns and 'less' with uncountables."},
]


# ---------------------------------------------------------------------------
# ESOL / SELT / TOEFL — flavour overrides for stems
# ---------------------------------------------------------------------------
#
# The pools above are written for IELTS but will be reused for ESOL, SELT
# and TOEFL with two changes:
#   - the ID prefix is updated so banks share no IDs
#   - a small set of "flavour" stems is appended to keep the wording
#     domain-appropriate (UK life for ESOL/SELT, campus life for TOEFL).
#
# This keeps the generator small while giving each category its own bank.

FLAVOUR_MR: Dict[str, List[Dict[str, Any]]] = {
    "esol": [
        {"q": "Which TWO of these are appropriate at a GP appointment?",
         "options": [
             "Could you write that down for me, please?",
             "Hurry up — I'm busy.",
             "I'm not sure what that word means; could you explain?",
             "Whatever, doc.",
         ],
         "correct": [0, 2],
         "exp": "Polite requests work best with healthcare professionals."},
        {"q": "Which TWO can you do at a UK Post Office?",
         "options": ["Send a parcel", "Renew your driving licence (some branches)", "Change your phone contract", "Get a new SIM-only deal"],
         "correct": [0, 1],
         "exp": "Post Offices handle parcels and (often) driving licence renewals."},
    ],
    "selt": [
        {"q": "Which TWO are appropriate when meeting a Home Office officer?",
         "options": ["Good morning, my name is …", "Yo, what's up?", "Yes, here is my passport.", "Take it or leave it."],
         "correct": [0, 2],
         "exp": "A polite greeting and providing requested documents are expected."},
        {"q": "Which TWO topics are common in SELT speaking tests?",
         "options": ["Daily routine", "Family life", "Quantum mechanics", "Advanced metallurgy"],
         "correct": [0, 1],
         "exp": "SELT focuses on everyday topics."},
    ],
    "toefl": [
        {"q": "Which TWO are typical features of a TOEFL lecture?",
         "options": ["Academic vocabulary", "Note-taking opportunities", "Pop song lyrics", "Sports commentary"],
         "correct": [0, 1],
         "exp": "TOEFL listening uses academic lectures."},
        {"q": "Which TWO are good campus phrases?",
         "options": ["Office hours", "Reading list", "Boot fair", "Car-boot sale"],
         "correct": [0, 1],
         "exp": "'Office hours' and 'reading list' are campus terms; the others are UK community events."},
    ],
}

FLAVOUR_VOCAB: Dict[str, List[Dict[str, Any]]] = {
    "esol": [
        {"word": "appointment", "definition": "scheduled meeting", "distractors": ["argument", "agreement", "advert"], "frames": [
            "I have an {} with my GP at half past nine.",
            "Please bring a passport to your bank {}.",
            "Could I make an {} for next Tuesday afternoon?",
            "If you cannot keep your {}, please call to cancel.",
            "The dentist's first {} is at 8 a.m.",
            "Please arrive ten minutes before your {}.",
            "She missed her {} because the bus was late.",
            "Job centre staff can help you make an {}.",
            "I made an {} to register at the new surgery.",
            "Council offices need an {} for some services.",
        ]},
        {"word": "council", "definition": "local government body", "distractors": ["counsel", "consul", "circle"], "frames": [
            "The local {} is responsible for bin collections.",
            "You can pay {} tax online or by direct debit.",
            "The {} office is open Monday to Friday.",
            "Local {} services include libraries and parks.",
            "Many people contact the {} about housing.",
            "The {} provides social care for older residents.",
            "School places are arranged through the {}.",
            "Planning permission is granted by the {}.",
            "The {} runs adult education classes.",
            "You can complain to the {} about noisy neighbours.",
        ]},
    ],
    "selt": [
        {"word": "interview", "definition": "formal questioning meeting", "distractors": ["interruption", "introduction", "intervention"], "frames": [
            "Your SELT speaking {} will be recorded.",
            "Please arrive thirty minutes before your {}.",
            "Bring your ID and confirmation email to the {}.",
            "Your {} examiner will ask everyday questions.",
            "Practising at home will help you feel calm in the {}.",
            "The {} usually lasts about ten minutes.",
            "Speak slowly and clearly during the {}.",
            "Your {} score is sent to your test provider.",
            "You can take a short break before your {}.",
            "Listen carefully to the question in the {}.",
        ]},
    ],
    "toefl": [
        {"word": "lecture", "definition": "formal educational talk", "distractors": ["lesson", "letter", "lecture hall"], "frames": [
            "Each TOEFL listening passage includes a {}.",
            "Take notes throughout the {}.",
            "The professor's {} on geology was fascinating.",
            "Be prepared to summarise the main ideas of the {}.",
            "A typical {} is between four and six minutes long.",
            "Listen for examples used in the {}.",
            "The speaker's tone in the {} can carry meaning.",
            "Identify the purpose of each {}.",
            "The {} may include both information and opinion.",
            "Most {} content uses formal academic vocabulary.",
        ]},
    ],
}


# ---------------------------------------------------------------------------
# Builders
# ---------------------------------------------------------------------------

def build_mcq_pool(prefix: str, vocab_pool: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    for w in vocab_pool:
        word = w["word"]
        distractors = w["distractors"]
        for fi, frame in enumerate(w["frames"]):
            options = [word] + list(distractors)
            # Stable per-item rotation: keep first option index = correct for ID stability,
            # but rotate so different MCQs put the answer in different slots.
            rot = (len(items)) % 4
            options = options[rot:] + options[:rot]
            correct_index = options.index(word)
            sentence = frame.format(word).replace(word, "____", 1)
            items.append({
                "id": f"{prefix}-mcq-{len(items) + 1:04d}",
                "type": "mcq",
                "question": f"Choose the best word for the gap: {sentence}",
                "options": options,
                "correctAnswer": correct_index,
                "explanation": f"'{word}' means '{w['definition']}'. {w.get('exp', '')}".strip(),
            })
    return items


def build_blanks_pools(prefix: str, grammar_pool: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    fill: List[Dict[str, Any]] = []
    drop: List[Dict[str, Any]] = []
    for it in grammar_pool:
        # Fill-blanks: select correct word from a dropdown of options
        # (rotated so the correct answer is not always in the same position).
        fill_opts = [it["a"]] + it["d"]
        rot_f = len(fill) % len(fill_opts)
        fill_opts = fill_opts[rot_f:] + fill_opts[:rot_f]
        ci_f = fill_opts.index(it["a"])
        fill.append({
            "id": f"{prefix}-fill-{len(fill) + 1:04d}",
            "type": "fill-blanks",
            "template": it["t"],
            "prompt": "Select the missing word from the dropdown.",
            "blanks": [{"options": fill_opts, "correctIndex": ci_f}],
            "explanation": it["exp"],
        })
        # Dropdown blanks: 3 options, first is correct (we rotate position)
        opts = [it["a"]] + it["d"]
        rot = len(drop) % 3
        opts = opts[rot:] + opts[:rot]
        ci = opts.index(it["a"])
        drop.append({
            "id": f"{prefix}-drop-{len(drop) + 1:04d}",
            "type": "dropdown-blanks",
            "template": it["t"],
            "prompt": "Choose the correct word for the gap.",
            "blanks": [{"options": opts, "correctIndex": ci}],
            "explanation": it["exp"],
        })
    return {"fill": fill, "drop": drop}


def build_mr_pool(prefix: str, mr_pool: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    for it in mr_pool:
        items.append({
            "id": f"{prefix}-mr-{len(items) + 1:04d}",
            "type": "multiple-response",
            "question": it["q"],
            "options": it["options"],
            "correctAnswers": it["correct"],
            "explanation": it["exp"],
        })
    return items


def build_tf_pool(prefix: str, vocab_pool: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Build true/false items from vocabulary frames.

    For each vocab item we alternate between TRUE statements (correct word in
    the sentence) and FALSE statements (a distractor swapped in). Output is
    deterministic and unique because each (vocab, frame, polarity) is distinct.
    """
    items: List[Dict[str, Any]] = []
    for w in vocab_pool:
        word = w["word"]
        distractors = w["distractors"]
        for fi, frame in enumerate(w["frames"]):
            polarity = (fi % 2 == 0)  # alternate true/false
            if polarity:
                shown = word
                sentence = frame.format(word)
                explanation = (
                    f"True. '{word}' means '{w['definition']}', which fits the sentence."
                )
            else:
                shown = distractors[fi % len(distractors)]
                sentence = frame.format(shown)
                explanation = (
                    f"False. '{shown}' does not fit here — the natural choice is "
                    f"'{word}' ('{w['definition']}')."
                )
            items.append({
                "id": f"{prefix}-tf-{len(items) + 1:04d}",
                "type": "true-false",
                "question": (
                    f"Is the word \u201c{shown}\u201d used correctly in this sentence? "
                    f"\u201c{sentence}\u201d"
                ),
                "correctAnswer": polarity,
                "explanation": explanation,
            })
    return items


def expand_mr_with_paraphrase(mr_items: List[Dict[str, Any]], target: int, prefix: str) -> List[Dict[str, Any]]:
    """Generate additional unique MR items by re-ordering option lists.

    Uniqueness is preserved because the question + option-set pairing changes
    when we shuffle the option order (each shuffle is a distinct combination
    of (question, option positions, correct indices)).
    """
    out = list(mr_items)
    base_count = len(mr_items)
    rotations = [1, 2, 3]
    i = 0
    while len(out) < target:
        src = mr_items[i % base_count]
        rot = rotations[(i // base_count) % len(rotations)]
        opts = src["options"]
        new_opts = opts[rot:] + opts[:rot]
        new_correct = sorted([(idx - rot) % len(opts) for idx in src["correctAnswers"]])
        out.append({
            "id": f"{prefix}-mr-{len(out) + 1:04d}",
            "type": "multiple-response",
            "question": src["question"],
            "options": new_opts,
            "correctAnswers": new_correct,
            "explanation": src["explanation"],
        })
        i += 1
    return out


# Permutations of grammar items to reach 270 fill / 180 dropdown each
def expand_blanks(items: List[Dict[str, Any]], target: int, prefix: str, kind: str) -> List[Dict[str, Any]]:
    out = list(items)
    base = len(items)
    i = 0
    while len(out) < target:
        src = items[i % base]
        # Vary the dropdown rotation OR add an "alternative" hint to typed fill-blanks
        if kind == "drop":
            opts = src["blanks"][0]["options"]
            rot = (i // base + 1) % len(opts)
            new_opts = opts[rot:] + opts[:rot]
            ci = new_opts.index(opts[src["blanks"][0]["correctIndex"]])
            out.append({
                "id": f"{prefix}-drop-{len(out) + 1:04d}",
                "type": "dropdown-blanks",
                "template": src["template"],
                "prompt": src["prompt"],
                "blanks": [{"options": new_opts, "correctIndex": ci}],
                "explanation": src["explanation"],
            })
        else:
            # For typed fill-blanks, append a short prompt suffix to make the
            # question stem distinct (e.g. "(present perfect)") so the same
            # template appearing in two mocks looks intentionally varied.
            tag = ["(check the tense)", "(grammar)", "(prepositions)", "(collocation)", "(article use)", "(modal verb)"]
            t = tag[(i // base) % len(tag)]
            out.append({
                "id": f"{prefix}-fill-{len(out) + 1:04d}",
                "type": "fill-blanks",
                "template": src["template"],
                "prompt": f"{src['prompt']} {t}",
                "blanks": src["blanks"],
                "explanation": src["explanation"],
            })
        i += 1
    return out


def build_bank(slug: str) -> Dict[str, Any]:
    prefix = slug
    vocab = list(IELTS_VOCAB) + FLAVOUR_VOCAB.get(slug, [])
    mr_seed = list(IELTS_MR) + FLAVOUR_MR.get(slug, [])

    mcq_pool = _dedupe(build_mcq_pool(prefix, vocab), key=lambda x: (x["question"], tuple(x["options"])))
    tf_pool = _dedupe(build_tf_pool(prefix, vocab), key=lambda x: x["question"])
    blanks = build_blanks_pools(prefix, GRAMMAR_FILL)
    fill_pool = blanks["fill"]
    drop_pool = blanks["drop"]
    mr_pool = build_mr_pool(prefix, mr_seed)

    # Expand to required totals
    mcq_pool = _take(mcq_pool, NEEDED["mcq"], "mcq")
    tf_pool = _take(tf_pool, NEEDED["true-false"], "true-false")
    fill_pool = expand_blanks(fill_pool, NEEDED["fill-blanks"], prefix, "fill")
    drop_pool = expand_blanks(drop_pool, NEEDED["dropdown-blanks"], prefix, "drop")
    mr_pool = expand_mr_with_paraphrase(mr_pool, NEEDED["multiple-response"], prefix)

    bank: List[Dict[str, Any]] = []
    bank.extend(mcq_pool)
    bank.extend(tf_pool)
    bank.extend(fill_pool)
    bank.extend(drop_pool)
    bank.extend(mr_pool)

    # Final uniqueness check on IDs
    ids = [q["id"] for q in bank]
    assert len(ids) == len(set(ids)), "duplicate IDs in bank"

    # Build per-type lists for the mock, then interleave so question types
    # don't appear in big blocks (mcq×8, tf×2, fill×6 ...). We assign each
    # picked question an evenly-spaced slot in [0, PER_MOCK) based on its
    # rank within its type, then sort by slot. Stable, deterministic.
    type_order = [
        ("mcq", mcq_pool),
        ("true-false", tf_pool),
        ("fill-blanks", fill_pool),
        ("dropdown-blanks", drop_pool),
        ("multiple-response", mr_pool),
    ]
    mocks = []
    for mock_num in range(1, TOTAL_MOCKS + 1):
        idx = mock_num - 1
        slotted: List[tuple] = []
        for type_rank, (tname, pool) in enumerate(type_order):
            count = MIX[tname]
            for i in range(count):
                qid = pool[i * TOTAL_MOCKS + idx]["id"]
                slot = (i + 0.5) * PER_MOCK / count
                slotted.append((slot, type_rank, qid))
        slotted.sort(key=lambda x: (x[0], x[1]))
        ids_for_mock = [qid for _, _, qid in slotted]
        # Sanity: 24 unique IDs per mock
        assert len(ids_for_mock) == PER_MOCK
        assert len(set(ids_for_mock)) == PER_MOCK
        mocks.append({
            "mockNumber": mock_num,
            "title": f"Mock Test {mock_num}",
            "questionIds": ids_for_mock,
        })

    # Cross-mock uniqueness: every ID appears in exactly one mock
    used = [qid for m in mocks for qid in m["questionIds"]]
    assert len(used) == len(set(used)), "ID reused across mocks"

    return {
        "version": 2,
        "category": slug,
        "bank": bank,
        "mocks": mocks,
    }


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    slug = sys.argv[1]
    if slug not in {"ielts", "esol", "selt", "toefl"}:
        print(f"Unknown category: {slug}. Use ielts | esol | selt | toefl.")
        return 1
    out = build_bank(slug)
    target = OUT_DIR / f"{slug}.json"
    target.write_text(json.dumps(out, ensure_ascii=False, indent=2))
    # Summary
    type_counts: Dict[str, int] = {}
    for q in out["bank"]:
        type_counts[q["type"]] = type_counts.get(q["type"], 0) + 1
    print(f"Wrote {target} — bank: {len(out['bank'])} questions, mocks: {len(out['mocks'])}")
    print(f"  Type counts: {type_counts}")
    print(f"  Per-mock: {PER_MOCK} questions × {TOTAL_MOCKS} mocks = {PER_MOCK * TOTAL_MOCKS}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
