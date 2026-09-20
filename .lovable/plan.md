# Make the Stripe webhook live

The Stripe webhook handler already exists in the project at `/api/public/stripe-webhook` (signature verification, event-type filtering and duplicate-event protection are all in place). The currently published site does not include it yet — it deploys with the next site publish.

## Steps

1. **Publish the site** — clicking Update in the publish dialog puts the webhook live at:
   `https://www.uktesthub.com/api/public/stripe-webhook`
   (also reachable at `https://uk-test-mastery.lovable.app/api/public/stripe-webhook`; the www address is the canonical one to register with Stripe).
2. **Add the Stripe secrets securely** — I will request these through the secure secret prompt, never in chat:
   - `STRIPE_SECRET_KEY` (test mode secret key)
   - `STRIPE_WEBHOOK_SECRET` (signing secret for this endpoint)
   - `STRIPE_PRICE_EXAM_PRO_MONTHLY`, `STRIPE_PRICE_PREMIUM_MONTHLY`, `STRIPE_PRICE_PREMIUM_ANNUAL`
3. **Register the endpoint in Stripe** (Developers → Webhooks):
   - Endpoint URL: `https://www.uktesthub.com/api/public/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `invoice.paid`
4. **Verify** — send a test event from the Stripe dashboard and confirm the handler receives it (HTTP 200, no signature error), then run a test-mode checkout end to end.

## Notes

- Nothing changes on the existing site: URLs, content, SEO and design are untouched; this only makes the new subscription plumbing reachable.
- Until the secrets are stored, the webhook responds but cannot verify signatures, so no subscription access can be granted — this is by design.
