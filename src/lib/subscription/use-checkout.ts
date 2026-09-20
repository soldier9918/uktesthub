import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { trackEvent } from "@/lib/analytics";
import { createCheckoutSession } from "./subscription.functions";
import type { PlanCode } from "./plans";

/**
 * Starts Stripe Checkout. An account is always required first — unsigned
 * visitors are sent to sign-up and returned to the pricing page afterwards.
 */
export function useCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const checkout = useServerFn(createCheckoutSession);
  const [busyPlan, setBusyPlan] = useState<PlanCode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(
    async (plan: Exclude<PlanCode, "free">, topicSlug?: string | null) => {
      setError(null);
      if (!user) {
        void navigate({ to: "/signup", search: { next: "/pricing" } as never });
        return;
      }
      setBusyPlan(plan);
      try {
        const { data } = await supabase.auth.getSession();
        const accessToken = data.session?.access_token;
        if (!accessToken) {
          setError("Your session has expired. Please sign in again.");
          return;
        }
        void trackEvent({ event_type: "begin_checkout", path: `/pricing/${plan}` });
        const result = await checkout({
          data: {
            accessToken,
            plan,
            topicSlug: topicSlug ?? null,
            origin: window.location.origin,
          },
        });
        if (result.url) {
          window.location.href = result.url;
          return;
        }
        setError(result.error ?? "Checkout could not be started. Please try again.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Checkout could not be started.");
      } finally {
        setBusyPlan(null);
      }
    },
    [checkout, navigate, user],
  );

  return { start, busyPlan, error, setError };
}
