import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { TopicPicker } from "@/components/subscription/TopicPicker";
import { supabase } from "@/integrations/supabase/client";
import { useEntitlement } from "@/lib/subscription/use-entitlement";
import { planLabel, RENEWAL_COPY } from "@/lib/subscription/plans";
import { topicTitle } from "@/lib/subscription/topics";
import {
  cancelSubscription,
  createBillingPortalSession,
  resumeSubscription,
  scheduleTopicChange,
} from "@/lib/subscription/subscription.functions";

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const STATUS_COPY: Record<string, string> = {
  free: "Free Practice",
  active: "Active",
  past_due: "Payment failed — please update your card",
  cancelled: "Cancelled — access continues until the end of your paid period",
  expired: "Expired",
  incomplete: "Payment not completed",
};

/** Plan, renewal, topic change, billing portal and cancellation. */
export function SubscriptionPanel() {
  const { entitlement, subscription, refresh } = useEntitlement();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const status = subscription?.status ?? "free";
  const periodEnd = formatDate(entitlement.periodEnd);
  const cancelling = entitlement.isPaid && entitlement.cancelAtPeriodEnd;
  const statusText = cancelling
    ? periodEnd
      ? `Cancels on ${periodEnd} — access continues until then`
      : "Cancels at the end of your paid period"
    : (STATUS_COPY[status] ?? status);

  async function token() {
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (!accessToken) throw new Error("Please sign in again to continue.");
    return accessToken;
  }

  async function openPortal() {
    setBusy("portal");
    setErr(null);
    setMsg(null);
    try {
      const res = await createBillingPortalSession({
        data: { accessToken: await token(), origin: window.location.origin, returnPath: "/account" },
      });
      if (res.url) window.location.href = res.url;
      else setErr(res.error ?? "The billing portal is unavailable right now.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  async function saveTopicChange() {
    if (!newTopic) return setErr("Please choose a test topic first.");
    setBusy("topic");
    setErr(null);
    setMsg(null);
    try {
      const res = await scheduleTopicChange({ data: { accessToken: await token(), topicSlug: newTopic } });
      if (res.ok) {
        setMsg(
          `Your topic will change to ${topicTitle(newTopic)} at your next renewal${
            periodEnd ? ` on ${periodEnd}` : ""
          }. Your current topic stays unlocked until then.`,
        );
        setNewTopic(null);
        await refresh();
      } else setErr(res.error ?? "The topic change could not be saved.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  async function doCancel() {
    setBusy("cancel");
    setErr(null);
    setMsg(null);
    try {
      const res = await cancelSubscription({ data: { accessToken: await token() } });
      if (res.ok) {
        setConfirmCancel(false);
        setMsg(
          `Your subscription is cancelled. You keep full access until${
            periodEnd ? ` ${periodEnd}` : " the end of your paid period"
          }, then your account returns to Free Practice with your progress intact.`,
        );
        await refresh();
      } else setErr(res.error ?? "The cancellation could not be completed.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  async function doResume() {
    setBusy("resume");
    setErr(null);
    setMsg(null);
    try {
      const res = await resumeSubscription({ data: { accessToken: await token() } });
      if (res.ok) {
        setMsg("Your subscription is active again and will renew as normal.");
        await refresh();
      } else setErr(res.error ?? "The subscription could not be resumed.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-border bg-card p-5">
      <h2 className="font-display text-lg font-bold">Subscription</h2>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Plan</dt>
          <dd className="mt-0.5 font-semibold">{planLabel(entitlement.plan)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Status</dt>
          <dd className="mt-0.5 font-semibold">{STATUS_COPY[status] ?? status}</dd>
        </div>
        {entitlement.plan === "exam_pro" && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Unlocked topic
            </dt>
            <dd className="mt-0.5 font-semibold">
              {entitlement.topicSlug ? topicTitle(entitlement.topicSlug) : "Not chosen yet"}
            </dd>
          </div>
        )}
        {periodEnd && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {entitlement.cancelAtPeriodEnd ? "Access ends" : "Next renewal"}
            </dt>
            <dd className="mt-0.5 font-semibold">{periodEnd}</dd>
          </div>
        )}
      </dl>

      {entitlement.isPaid && entitlement.plan !== "free" && (
        <p className="mt-3 text-xs text-muted-foreground">
          {RENEWAL_COPY[entitlement.plan as keyof typeof RENEWAL_COPY]}
        </p>
      )}

      {entitlement.scheduledTopicSlug && (
        <p className="mt-3 rounded-md bg-muted px-3 py-2 text-sm">
          Scheduled topic change: <strong>{topicTitle(entitlement.scheduledTopicSlug)}</strong>{" "}
          from your next renewal.
        </p>
      )}

      {msg && (
        <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</p>
      )}
      {err && (
        <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {!entitlement.isPaid && (
          <Button asChild className="bg-coral text-white hover:bg-coral/90">
            <Link to="/pricing">See plans and subscribe</Link>
          </Button>
        )}
        {entitlement.isPaid && entitlement.plan === "exam_pro" && (
          <Button asChild className="bg-coral text-white hover:bg-coral/90">
            <Link to="/pricing">Upgrade to Premium All Access</Link>
          </Button>
        )}
        {(entitlement.isPaid || subscription?.provider_customer_id) && (
          <Button variant="outline" onClick={openPortal} disabled={busy === "portal"}>
            {busy === "portal" ? "Opening…" : "Manage billing"}
          </Button>
        )}
        {entitlement.isPaid && !entitlement.cancelAtPeriodEnd && (
          <Button variant="ghost" onClick={() => setConfirmCancel(true)}>
            Cancel subscription
          </Button>
        )}
      </div>

      {confirmCancel && (
        <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-sm">
            You will keep full access until{periodEnd ? ` ${periodEnd}` : " the end of your paid period"},
            then your account returns to Free Practice. Your progress, best scores and bookmarks are
            kept.
          </p>
          <div className="mt-3 flex gap-3">
            <Button variant="destructive" onClick={doCancel} disabled={busy === "cancel"}>
              {busy === "cancel" ? "Cancelling…" : "Yes, cancel"}
            </Button>
            <Button variant="outline" onClick={() => setConfirmCancel(false)}>
              Keep my subscription
            </Button>
          </div>
        </div>
      )}

      {entitlement.isPaid && entitlement.plan === "exam_pro" && (
        <div className="mt-6 border-t border-border pt-5">
          <h3 className="font-display text-base font-bold">Change topic at next renewal</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your topic stays the same for the period you have paid for. Choose a new topic and it
            takes effect at your next renewal.
          </p>
          <div className="mt-3">
            <TopicPicker value={newTopic} onChange={setNewTopic} />
          </div>
          <Button className="mt-3" onClick={saveTopicChange} disabled={busy === "topic"}>
            {busy === "topic" ? "Saving…" : "Schedule topic change"}
          </Button>
        </div>
      )}

      <p className="mt-5 text-xs text-muted-foreground">
        <Link to="/subscription-terms" className="underline hover:text-coral">
          Subscription Terms
        </Link>
        {" · "}
        <Link to="/cancellation-policy" className="underline hover:text-coral">
          Cancellation Policy
        </Link>
        {" · "}
        <Link to="/refund-policy" className="underline hover:text-coral">
          Refund Policy
        </Link>
      </p>
    </section>
  );
}
