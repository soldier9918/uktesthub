ALTER TABLE public.question_regenerations
  ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'rewrite',
  ADD COLUMN IF NOT EXISTS concept text,
  ADD COLUMN IF NOT EXISTS scope text NOT NULL DEFAULT 'topic';