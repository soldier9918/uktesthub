## 1. Fix strange Study Guides images
AI-generated images frequently contain garbled fake text and distorted humans. Rather than auditing each of the 51 images one-by-one, I'll **regenerate all 51** with stricter prompts that ban both:
- "no text, words, letters, numbers, signage, posters, captions, watermarks, or writing of any kind"
- "no people, no faces, no hands, no human figures"

Each post gets a topic-specific scene built from **objects / environments only** (e.g. NHS numeracy → calculator, syringe, IV drip, blank notepad on a clinical desk; Driving theory → steering wheel, gear stick, dashboard close-up; Life in the UK → Union Jack fabric, vintage map, stamps, teacup; CSCS → hard hat, hi-vis vest, blueprints; SERU → London cab badge mockup with no text, A-Z map, route plotter; IELTS → blank notebook, pen, headphones, globe). Style stays consistent: editorial photography, soft natural light, shallow depth of field, 16:9, UK setting.

- Output: overwrite the existing 51 files in `src/assets/blog/` (same filenames so `src/data/blog.tsx` imports keep working — no code changes needed).
- Run in parallel batches via `imagegen--generate_image` (fast tier).
- After generation, do a visual QA spot-check on a sample (~6 images covering each category) and regenerate any that still show text or people.

If you'd rather I only regenerate a specific list of bad ones (please share the slugs), say so — otherwise I'll do all 51 to guarantee a clean set.

## 2. "Browse All Categories" button under Popular Categories
Edit `src/routes/index.tsx` only. After the categories grid closes (line 330, before `</section>` on 331), insert a centered CTA block:

```tsx
<div className="mt-12 flex justify-center">
  <a
    href="https://www.uktesthub.com/all-tests"
    className="group inline-flex items-center gap-3 rounded-2xl bg-coral px-10 py-5 font-display text-base font-bold uppercase tracking-[0.18em] text-coral-foreground shadow-coral transition-transform hover:-translate-y-0.5 md:text-lg"
  >
    Browse All Categories
    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
  </a>
</div>
```

Note: you specified the absolute URL `https://www.uktesthub.com/all-tests`, so it'll be a plain `<a href>` (external-style). The internal `/all-tests` route already exists, but I'll honor the URL you gave. If you'd prefer an internal `<Link to="/all-tests">` for instant client-side nav and preloading, tell me and I'll switch it.

## Out of scope
- Changing post content, slugs, categories, or the Study Guides page layout.
- Touching the existing `/all-tests` route.