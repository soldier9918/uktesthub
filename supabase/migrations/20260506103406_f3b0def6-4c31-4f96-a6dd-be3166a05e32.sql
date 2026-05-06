
CREATE TABLE public.similarity_suppressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_a text NOT NULL,
  qid_a text NOT NULL,
  topic_b text NOT NULL,
  qid_b text NOT NULL,
  pair_key text GENERATED ALWAYS AS (
    LEAST(topic_a || '::' || qid_a, topic_b || '::' || qid_b) || '||' ||
    GREATEST(topic_a || '::' || qid_a, topic_b || '::' || qid_b)
  ) STORED,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX similarity_suppressions_pair_key_idx
  ON public.similarity_suppressions(pair_key);

ALTER TABLE public.similarity_suppressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read suppressions"
  ON public.similarity_suppressions FOR SELECT
  USING (true);

CREATE POLICY "Admins manage suppressions"
  ON public.similarity_suppressions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.question_regenerations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  question_id text NOT NULL,
  source_question jsonb NOT NULL,
  generated_question jsonb NOT NULL,
  similarity_max numeric,
  attempts integer NOT NULL DEFAULT 1,
  needs_review boolean NOT NULL DEFAULT false,
  model text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX question_regenerations_topic_qid_idx
  ON public.question_regenerations(topic, question_id);
CREATE INDEX question_regenerations_needs_review_idx
  ON public.question_regenerations(needs_review) WHERE needs_review = true;

ALTER TABLE public.question_regenerations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read regenerations"
  ON public.question_regenerations FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert regenerations"
  ON public.question_regenerations FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update regenerations"
  ON public.question_regenerations FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete regenerations"
  ON public.question_regenerations FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
