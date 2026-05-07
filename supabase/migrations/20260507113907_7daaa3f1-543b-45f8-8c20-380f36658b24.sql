UPDATE public.question_overrides
SET question = trim(regexp_replace(question, '\s*[\[\(]\s*(image|picture|diagram|photo|sign shown|figure)[^\]\)]*[\]\)].*$', '', 'i'))
WHERE question ~* '\[\s*(image|picture|diagram|photo|figure)';