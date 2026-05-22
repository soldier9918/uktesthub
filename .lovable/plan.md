## Goal
On `/quiz/*` pages, FAQ answers are currently inside a Radix Accordion (collapsed by default). The answer text is not in the rendered HTML until a user clicks, so crawlers and AdSense reviewers see only the questions.

## Change
In `src/components/QuizRunner.tsx` (lines 1068–1084), replace the `Accordion`/`AccordionItem`/`AccordionTrigger`/`AccordionContent` block with a plain, always-rendered list:

```tsx
{intro.faqs && intro.faqs.length > 0 && (
  <div className="mt-8">
    <h3 className="font-display text-lg font-bold md:text-xl">Frequently asked questions</h3>
    <dl className="mt-3 space-y-4">
      {intro.faqs.map((f) => (
        <div key={f.q} className="border-b border-border pb-4 last:border-b-0">
          <dt className="text-sm font-semibold text-foreground md:text-base">{f.q}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">{f.a}</dd>
        </div>
      ))}
    </dl>
  </div>
)}
```

Also remove the now-unused `Accordion*` imports from the top of `QuizRunner.tsx` if they aren't used elsewhere in the file.

## Why
- Answer text is in initial SSR HTML — visible to Googlebot and AdSense crawlers.
- Existing `faqSchema(intro.faqs)` JSON-LD already emitted in `quiz.$slug.tsx` stays in sync.
- No data changes; `mock-intros.ts` FAQ content is unchanged.

## Files
- `src/components/QuizRunner.tsx` — replace accordion block; clean up imports.
