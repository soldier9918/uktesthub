/**
 * Client-side entitlement state. Used ONLY for what the interface shows —
 * the authoritative check for paid questions happens on the server.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { getPaymentMode } from "./subscription.functions";
import {
  entitlementFromRow,
  FREE_ENTITLEMENT,
  canAccessMock,
  type Entitlement,
  type SubscriptionRow,
} from "./entitlement";

type EntitlementState = {
  entitlement: Entitlement;
  subscription: SubscriptionRow | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const EntitlementContext = createContext<EntitlementState>({
  entitlement: FREE_ENTITLEMENT,
  subscription: null,
  loading: true,
  refresh: async () => {},
});

const COLUMNS =
  "plan_code,status,topic_slug,scheduled_topic_slug,billing_interval,current_period_start,current_period_end,cancel_at_period_end,cancelled_at,provider_customer_id,provider_subscription_id";

/** Cached for the session: the payment mode the server is configured for. */
let modePromise: Promise<"test" | "live"> | null = null;
async function paymentMode(): Promise<"test" | "live"> {
  modePromise ??= getPaymentMode()
    .then((r) => r.mode)
    .catch(() => "test" as const);
  return modePromise;
}

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    // Only records created in the mode the server is running in count — a
    // sandbox subscription never grants access on a live site, or vice versa.
    const mode = await paymentMode();
    const { data } = await supabase
      .from("subscriptions")
      .select(COLUMNS)
      .eq("user_id", user.id)
      .eq("stripe_mode", mode)
      .maybeSingle();
    setSubscription((data as SubscriptionRow | null) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    void load();
  }, [authLoading, load]);

  return (
    <EntitlementContext.Provider
      value={{
        entitlement: entitlementFromRow(subscription),
        subscription,
        loading: authLoading || loading,
        refresh: load,
      }}
    >
      {children}
    </EntitlementContext.Provider>
  );
}

export const useEntitlement = () => useContext(EntitlementContext);

/** Convenience helper for lock icons and upgrade prompts. */
export function useMockAccess(topicSlug: string, mockNumber: number) {
  const { entitlement, loading } = useEntitlement();
  return {
    loading,
    unlocked: canAccessMock(entitlement, topicSlug, mockNumber),
    entitlement,
  };
}
