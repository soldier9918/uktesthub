import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEntitlement } from "@/lib/subscription/use-entitlement";
import { createBillingPortalSession } from "@/lib/subscription/subscription.functions";

function formatDate(value: string | null | undefined) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Friendly amber notice shown while a payment is being retried. Access is still
 * open during the retry window, so the wording reassures and points at billing.
 * No provider error detail is ever surfaced here.
 */
export function PaymentWarning({ className = "" }: { className?: string }) {
  const { entitlement, subscription, loading } = useEntitlement();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (loading) return null;
  if (subscription?.status !== "past_due" || !entitlement.isPaid) return null;

  const until = formatDate(entitlement.periodEnd);

  async function openPortal() {
    setBusy(true);
    setErr(null);
    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;
      if (!accessToken) throw new Error("Please sign in again to continue.");
      const res = await createBillingPortalSession({
        data: { accessToken, origin: window.location.origin, returnPath: "/account" },
      });
      if (res.url) window.location.href = res.url;
      else setErr("The billing page is unavailable right now. Please try again shortly.");
    } catch {
      setErr("The billing page is unavailable right now. Please try again shortly.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 ${className}`}
      role="status"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-display text-sm font-bold text-amber-900">
            We couldn&rsquo;t take your last payment
          </p>
          <p className="text-xs text-amber-800">
            Your access stays open while we try again{until ? ` until ${until}` : ""}. Please update
            your card so nothing is interrupted.
          </p>
          {err && <p className="mt-1 text-xs text-amber-900">{err}</p>}
        </div>
      </div>
      <Button
        onClick={openPortal}
        disabled={busy}
        className="bg-amber-600 text-white hover:bg-amber-700"
      >
        {busy ? "Opening…" : "Manage billing"}
      </Button>
    </div>
  );
}
