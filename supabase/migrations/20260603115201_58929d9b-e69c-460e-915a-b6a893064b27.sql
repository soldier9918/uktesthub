
-- Create a separate table for publicly-readable site settings (ad toggles, AdSense client ID, meta defaults).
-- admin_settings will be locked down to admins only.

CREATE TABLE public.public_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT ON public.public_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.public_settings TO authenticated;
GRANT ALL ON public.public_settings TO service_role;

ALTER TABLE public.public_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read public settings"
ON public.public_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins manage public settings"
ON public.public_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing public-safe settings from admin_settings.
INSERT INTO public.public_settings (key, value, updated_at, updated_by)
SELECT key, value, updated_at, updated_by
FROM public.admin_settings
WHERE key IN (
  'hide_ads_globally',
  'preview_without_ads',
  'adsense_client_id',
  'default_meta_description',
  'default_og_image'
)
ON CONFLICT (key) DO NOTHING;

-- Lock down admin_settings: no more public read access.
DROP POLICY IF EXISTS "Anyone can read settings" ON public.admin_settings;
