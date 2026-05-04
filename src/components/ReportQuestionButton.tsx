import { useState } from "react";
import { Flag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

type Props = {
  questionId: string;
  topicSlug: string;
  mockSlug?: string;
};

const REASONS = [
  { value: "wrong-answer", label: "Wrong answer marked correct" },
  { value: "typo", label: "Typo or unclear wording" },
  { value: "broken-image", label: "Image missing or broken" },
  { value: "outdated", label: "Outdated information" },
  { value: "other", label: "Other" },
];

export function ReportQuestionButton({ questionId, topicSlug, mockSlug }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0].value);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.from("question_reports").insert({
      question_id: questionId,
      topic_slug: topicSlug,
      mock_slug: mockSlug ?? null,
      reason,
      details: details.trim() || null,
      reporter_user_id: user?.id ?? null,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setDetails("");
    }, 1500);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        title="Report a problem with this question"
      >
        <Flag className="h-3.5 w-3.5" />
        Report
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="font-display text-lg font-bold">Report this question</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              We'll review and fix it. Thanks for helping improve the bank.
            </p>

            {submitted ? (
              <p className="mt-4 rounded-xl bg-success/15 p-3 text-sm text-success">
                Report sent — thank you.
              </p>
            ) : (
              <>
                <label className="mt-4 block text-xs font-semibold">Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                >
                  {REASONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>

                <label className="mt-3 block text-xs font-semibold">Details (optional)</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value.slice(0, 1000))}
                  rows={4}
                  placeholder="Anything else we should know?"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />

                {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className="rounded-xl bg-gradient-coral px-4 py-2 text-sm font-semibold text-coral-foreground disabled:opacity-50"
                  >
                    {submitting ? "Sending…" : "Send report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
