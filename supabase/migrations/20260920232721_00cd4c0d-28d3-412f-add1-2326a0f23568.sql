ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS stripe_mode text NOT NULL DEFAULT 'test';
ALTER TABLE public.billing_events ADD COLUMN IF NOT EXISTS stripe_mode text NOT NULL DEFAULT 'test';
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_stripe_mode_check CHECK (stripe_mode IN ('test','live'));
DROP INDEX IF EXISTS public.subscriptions_user_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_mode_key ON public.subscriptions (user_id, stripe_mode);
CREATE INDEX IF NOT EXISTS subscriptions_mode_idx ON public.subscriptions (stripe_mode);