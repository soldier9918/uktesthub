## Problem

When you click **Fix all (complete)** on `uk-laws-rights` (a Citizenship topic, not Driving), every regenerated question comes out about cars, motorways, learner drivers, etc.

## Root cause

In `src/lib/server-fns/similarity.functions.ts`, the complete-regeneration server function uses a hardcoded `SCENARIO_ANGLES` list (lines 408–417) that is entirely driving-focused:

```
"urban street with parked cars",
"rural country lane",
"motorway in heavy traffic",
"night-time driving in poor visibility",
"wet weather and slippery roads",
"approaching a busy junction",
"near a school or pedestrian area",
"with a learner driver or new licence holder",
```

On every attempt the handler does:
```
const angle = SCENARIO_ANGLES[(attempt - 1) % SCENARIO_ANGLES.length];
...
- Frame the scenario around: ${angle}.
```

So every prompt — regardless of topic — instructs the model to "frame the scenario around motorway in heavy traffic" etc. This forces driving content into UK Laws & Rights (and every other non-driving topic).

The "rewrite" path (`regenerateQuestion`) does not have this bug — only the **complete** path does.

## Fix

Make scenario angles category-aware instead of hardcoded driving.

1. Replace the single `SCENARIO_ANGLES` constant with a map keyed by category slug, with a generic fallback. Driving keeps its current list. Other categories get neutral angles appropriate to their domain (e.g. UK citizenship: "everyday life in the UK", "interacting with public services", "workplace rights scenario", "historical context", etc.). Categories without a curated list use a generic set like "everyday real-world scenario", "workplace context", "edge case the textbook glosses over", "common misconception", "practical application".

2. The handler already receives `categoryTitle`. Pass `category` (slug) too — the caller (`admin-kb20.similar.tsx`) already knows it. Update the `inputValidator` shape and both call sites in `admin-kb20.similar.tsx` (single regen + bulk fix).

3. Pick the angle from the map: `(SCENARIO_ANGLES_BY_CATEGORY[data.category] ?? GENERIC_ANGLES)[(attempt - 1) % list.length]`.

4. Tighten the system prompt slightly so the model anchors on the topic. Current prompt already says `You write UK exam practice questions for "${categoryTitle} — ${topicTitle}"`, but adding an explicit guard like "Do NOT introduce driving, vehicles, or road scenarios unless the topic is about driving" prevents drift when the category is something like Citizenship/English/NHS.

## Files to change

- `src/lib/server-fns/similarity.functions.ts` — replace `SCENARIO_ANGLES`, accept `category`, anti-drift line in system prompt.
- `src/routes/admin-kb20.similar.tsx` — pass `category` slug into both `completeRegenerateQuestion` call sites (single + bulk).

## What this does NOT change

- `regenerateQuestion` (rewrite mode) — already topic-grounded, no driving leakage.
- The diagnostics scanner, overrides table, or any UI behaviour outside the prompt construction.

## Note on already-broken UK Laws & Rights overrides

Any car-themed questions that were already written into `question_overrides` for `uk-laws-rights` will remain there until regenerated. After this fix, re-running **Fix all (complete)** on that topic will replace them with on-topic questions. If you'd like, I can also add a one-off cleanup step that deletes the bad overrides so the original questions reappear before regenerating — let me know.
