## Root cause

`src/data/mocks/index.ts` uses:

```ts
const modules = import.meta.glob<MockFile>("./*.json", { eager: true, import: "default" });
```

That eagerly bundles **all 115 JSON files (~55MB, ~96k questions)** into the Worker bundle. Every request boots the Worker, parses the giant module graph, and walks the bank/mocks expansion in `expandV2` — which trips Cloudflare error 1102. `src/routes/admin.questions.index.tsx` does the same eager glob on `../data/mocks/*.json`. `src/data/quizzes.ts` also re-exports a large static `quizzes` array, but the mock glob is the dominant cost.

Secondary issues:
- `quiz.$slug.tsx`, `topic.$slug.tsx`, `category.$slug.tsx`, `guide.$slug.tsx` import from `@/data/mocks`, which transitively pulls the entire bundle in for SSR even when only metadata is needed.
- `sitemap[.]xml.ts` is fine (uses categories + blog only), but it currently inherits the bundle through the shared module graph.

## Goal

Move mock JSONs to `public/mocks/` so they're served as **static assets** (no Worker work). Replace the eager glob with a tiny build-time **metadata manifest** plus per-mock **lazy fetch**.

## Plan

### 1. Move mock data out of the bundle
- `git mv src/data/mocks/*.json public/mocks/` (115 files). Keep `src/data/mocks/index.ts` as the API surface only.
- Files become reachable at `/mocks/<topic>.json` as static assets (Cloudflare serves these directly, never hits the Worker).

### 2. Generate a metadata manifest at build time
- New script `scripts/build_mock_manifest.mjs`:
  - Reads every `public/mocks/*.json` from disk (Node, build-time only).
  - Emits `src/data/mocks/manifest.json` containing **only metadata**:
    ```json
    {
      "driving-theory": {
        "topic": "driving-theory",
        "mocks": [
          { "mockNumber": 1, "slug": "driving-theory-mock-1", "title": "Test 1", "questionCount": 24 }
        ]
      }
    }
    ```
  - No question text, options, or explanations — keeps manifest small (~tens of KB total).
- Wire into `package.json` `prebuild` and `predev` scripts so it always runs before Vite.

### 3. Refactor `src/data/mocks/index.ts`
- Delete the `import.meta.glob` block and all the `byTopic` / `bySlug` Maps populated at module load.
- Import `manifest.json` (small JSON, safe to bundle).
- Export:
  - `listMockSlots(topicSlug)` — reads from manifest only (synchronous, used by category/topic/guide pages).
  - `TOTAL_MOCKS_PER_TOPIC`, `QUESTIONS_PER_MOCK` — unchanged.
  - **New async** `loadMockBySlug(slug): Promise<MockTest | undefined>`:
    - Looks up topic from manifest by slug.
    - `fetch("/mocks/<topic>.json")` with an in-memory `Map<topic, Promise<MockFile>>` cache so the same topic file is fetched once per process/tab.
    - Runs the existing `expandV2` / V1 normalisation **only for the requested mock**, not for the whole topic up-front (cheap — single topic file is ≤1MB worst case).
  - Keep `mockToQuiz` and `rawToQuestion` unchanged — they already work per-mock.
- Remove the synchronous `getMockBySlug` / `getMocksByTopic` exports (or keep them as throwing stubs for type compat then delete usages).

### 4. Make quiz loading lazy
- `src/data/quizzes.ts` `getQuiz` becomes `async getQuiz(slug)`:
  - Static quizzes: still resolved synchronously from the in-file array (small, safe).
  - Mock slugs: `await loadMockBySlug(slug)` → `mockToQuiz(...)`.
- `src/routes/quiz.$slug.tsx` `loader`:
  - `loader: async ({ params }) => { const quiz = await getQuiz(params.slug); if (!quiz) throw notFound(); return { quiz }; }`
  - Add `errorComponent` and `notFoundComponent` (TanStack requirement when a loader exists) for graceful failure if the JSON 404s or fails to parse.
- `QuizRunner` already accepts a `Quiz` prop; no changes needed.

### 5. Pages that only need metadata
- `category.$slug.tsx`, `topic.$slug.tsx`, `guide.$slug.tsx`, `all-tests.tsx`, `quiz.$slug.tsx` (related-mocks block) all use `listMockSlots(...)` — that now reads from the manifest only. No change to call sites; they automatically stop pulling question content into the bundle.

### 6. Admin question browser
- `src/routes/admin.questions.index.tsx` currently `import.meta.glob`s every JSON eagerly. Replace with manifest read (just topic + counts).
- `src/routes/admin.questions.$topic.tsx` — change to `loader` that does `await fetch("/mocks/<topic>.json")` for the requested topic only. Add error/notFound boundaries.

### 7. Sitemap / SEO
- `src/routes/sitemap[.]xml.ts` already uses categories + blog only — confirmed safe. We additionally enumerate mock slugs from the **manifest** (cheap) instead of the full bank. No question text touched.

### 8. Caching
- Static mock JSONs get long-lived cache headers automatically from Cloudflare's static asset handler (immutable + filename-versioned via Vite is unnecessary because contents are stable; we'll set `Cache-Control: public, max-age=3600, stale-while-revalidate=86400` via `public/_headers`).
- In-memory `Map<topic, Promise<MockFile>>` in `src/data/mocks/index.ts` deduplicates concurrent fetches within a single Worker invocation / browser tab.

### 9. Error handling
- `loadMockBySlug` wraps fetch + JSON.parse in try/catch and returns `undefined` on failure; `quiz.$slug` loader throws `notFound()` so the route's `notFoundComponent` renders a friendly "Mock test unavailable, try another" UI with a link back to the topic page.

### 10. Cleanup
- Remove the eager `import.meta.glob` everywhere.
- Verify no other file imports a `.json` from `src/data/mocks/` directly (none currently do besides the index).
- Build: bundle should drop from ~55MB of JSON to a few tens of KB manifest.

## Files touched

- **Move**: `src/data/mocks/*.json` → `public/mocks/*.json`
- **New**: `scripts/build_mock_manifest.mjs`, `src/data/mocks/manifest.json` (generated), `public/_headers`
- **Edit**: `src/data/mocks/index.ts`, `src/data/quizzes.ts`, `src/routes/quiz.$slug.tsx`, `src/routes/admin.questions.index.tsx`, `src/routes/admin.questions.$topic.tsx`, `package.json` (prebuild/predev hooks)
- **Verify** (no edits expected): `category.$slug.tsx`, `topic.$slug.tsx`, `guide.$slug.tsx`, `all-tests.tsx`, `sitemap[.]xml.ts`

## Outcome

- Worker boot no longer parses 55MB of JSON → fixes Error 1102.
- Homepage / category / topic / guide pages render from a small manifest only.
- Quiz pages fetch a single ≤1MB topic JSON on demand, cached by Cloudflare + in-memory.
- Architecture scales linearly with topics added, not with total question count.
