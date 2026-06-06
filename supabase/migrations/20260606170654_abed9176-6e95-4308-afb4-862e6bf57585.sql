
UPDATE public.question_overrides
SET options = '["The Enlightenment", "The Industrial Revolution", "The Reformation", "The Romantic movement"]'::jsonb,
    updated_at = now()
WHERE topic='life-in-the-uk' AND question_id='litu-mc-0009';

UPDATE public.question_overrides
SET options = '["Members of the Scottish Parliament (MSPs)", "Peers", "Councillors", "Civil servants"]'::jsonb,
    updated_at = now()
WHERE topic='life-in-the-uk' AND question_id='litu-mc-0016';

UPDATE public.question_overrides
SET options = '["To protest against all government decisions", "To respect the rights and freedoms of others", "To serve in the armed forces when asked", "To attend a local council meeting once a year"]'::jsonb,
    updated_at = now()
WHERE topic='british-citizenship' AND question_id='bc-mc-0084';

UPDATE public.question_overrides
SET options = jsonb_set(
  options,
  '{}'::text[],
  to_jsonb(array(SELECT CASE WHEN opt = 'A Firm Booking village' THEN 'A firm booking' ELSE opt END
                 FROM jsonb_array_elements_text(options) WITH ORDINALITY AS t(opt, ord) ORDER BY ord))
)
WHERE topic='abta-travel-agent' AND question_id='ata-mc-0425';
