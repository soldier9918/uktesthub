
CREATE TABLE public.question_import_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  filename text,
  previous_json jsonb,
  new_json jsonb,
  commit_sha text,
  commit_url text,
  row_count integer,
  validation_log jsonb,
  error_log text,
  status text NOT NULL DEFAULT 'committed',
  rolled_back_at timestamptz,
  rolled_back_to_commit_sha text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_question_import_history_topic_created ON public.question_import_history (topic, created_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.question_import_history TO authenticated;
GRANT ALL ON public.question_import_history TO service_role;

ALTER TABLE public.question_import_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read import history"
  ON public.question_import_history FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert import history"
  ON public.question_import_history FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update import history"
  ON public.question_import_history FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
