import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { RequireAuth } from "@/components/RequireAuth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const SHOW_MORE_LIMIT = 5;

type Attempt = {
  id: string;
  topic_slug: string;
  mock_slug: string;
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  completed_at: string;
};

type Progress = {
  mock_slug: string;
  topic_slug: string | null;
  current_index: number;
  updated_at: string;
};

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "My dashboard — UK Test Hub" }, { name: "robots", content: "noindex, nofollow" },
      { property: "og:url", content: "https://www.uktesthub.com/dashboard" }
    ] , links: [{ rel: "canonical", href: "https://www.uktesthub.com/dashboard" }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <RequireAuth>
        <DashboardInner />
      </RequireAuth>
      <SiteFooter />
    </div>
  ),
});

function DashboardInner() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [displayName, setDisplayName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [showAllProgress, setShowAllProgress] = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [showAllAttempts, setShowAllAttempts] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: a }, { data: p }, { data: prof }] = await Promise.all([
        supabase
          .from("quiz_attempts")
          .select("id,topic_slug,mock_slug,score,total,percent,passed,completed_at")
          .order("completed_at", { ascending: false })
          .limit(50),
        supabase
          .from("quiz_progress")
          .select("mock_slug,topic_slug,current_index,updated_at")
          .order("updated_at", { ascending: false }),
        supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
      ]);
      setAttempts((a as Attempt[]) ?? []);
      setProgress((p as Progress[]) ?? []);
      setDisplayName(prof?.display_name ?? user.email ?? "");
      setLoading(false);
    })();
  }, [user]);

  const stats = useMemo(() => {
    if (!attempts.length) return { count: 0, avg: 0, passRate: 0, streak: 0 };
    const avg = Math.round(attempts.reduce((s, a) => s + Number(a.percent), 0) / attempts.length);
    const passRate = Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100);
    // streak: consecutive days with at least 1 attempt, ending today or yesterday
    const days = new Set(attempts.map((a) => new Date(a.completed_at).toISOString().slice(0, 10)));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (days.has(key)) streak++;
      else if (i > 0) break;
    }
    return { count: attempts.length, avg, passRate, streak };
  }, [attempts]);

  const bestByTopic = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of attempts) {
      const cur = m.get(a.topic_slug) ?? 0;
      if (Number(a.percent) > cur) m.set(a.topic_slug, Number(a.percent));
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [attempts]);

  const visibleProgress = showAllProgress ? progress : progress.slice(0, SHOW_MORE_LIMIT);
  const visibleBestByTopic = showAllTopics ? bestByTopic : bestByTopic.slice(0, SHOW_MORE_LIMIT);
  const visibleAttempts = showAllAttempts ? attempts : attempts.slice(0, SHOW_MORE_LIMIT);

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-12 text-sm text-muted-foreground">Loading your dashboard…</div>;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome back, {displayName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your progress across UK Test Hub.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/account" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">Account</Link>
          <Link to="/bookmarks" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">Bookmarks</Link>
        </div>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tests taken" value={stats.count} />
        <StatCard label="Average score" value={`${stats.avg}%`} />
        <StatCard label="Pass rate" value={`${stats.passRate}%`} />
        <StatCard label="Day streak" value={stats.streak} />
      </section>

      {progress.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold">Resume in progress</h2>
            {progress.length > SHOW_MORE_LIMIT && (
              <button
                onClick={() => setShowAllProgress((v) => !v)}
                className="shrink-0 rounded-md border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted"
              >
                {showAllProgress ? "Show less" : "Show all"}
              </button>
            )}
          </div>
          <ul className="mt-3 grid gap-2">
            {visibleProgress.map((p) => (
              <li key={p.mock_slug} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                <div className="text-sm">
                  <div className="font-semibold">{p.mock_slug}</div>
                  <div className="text-xs text-muted-foreground">Question {p.current_index + 1} • last updated {new Date(p.updated_at).toLocaleDateString()}</div>
                </div>
                <Link to="/quiz/$slug" params={{ slug: p.mock_slug }} className="rounded-md bg-coral px-3 py-1.5 text-sm font-semibold text-coral-foreground">
                  Resume
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold">Best score per topic</h2>
          {bestByTopic.length > SHOW_MORE_LIMIT && (
            <button
              onClick={() => setShowAllTopics((v) => !v)}
              className="shrink-0 rounded-md border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted"
            >
              {showAllTopics ? "Show less" : "Show all"}
            </button>
          )}
        </div>
        {bestByTopic.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No attempts yet — finish a test to see your stats.</p>
        ) : (
          <ul className="mt-3 space-y-2">
              {visibleBestByTopic.map(([topic, pct]) => (
                <li key={topic}>
                  <div className="flex justify-between text-sm">
                    <Link to="/topic/$slug" params={{ slug: topic }} className="font-medium hover:underline">{topic}</Link>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-coral" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">Recent attempts</h2>
        {attempts.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No attempts yet.</p>
        ) : (
          <>
            <div className="mt-3 overflow-x-auto rounded-lg border border-border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Test</th>
                    <th className="px-3 py-2">Score</th>
                    <th className="px-3 py-2">%</th>
                    <th className="px-3 py-2">Result</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllAttempts ? attempts : attempts.slice(0, SHOW_MORE_LIMIT)).map((a) => (
                    <tr key={a.id} className="border-t border-border">
                      <td className="px-3 py-2 text-muted-foreground">{new Date(a.completed_at).toLocaleDateString()}</td>
                      <td className="px-3 py-2 font-medium">{a.mock_slug}</td>
                      <td className="px-3 py-2">{a.score}/{a.total}</td>
                      <td className="px-3 py-2">{Number(a.percent).toFixed(0)}%</td>
                      <td className="px-3 py-2">
                        <span className={a.passed ? "text-emerald-700" : "text-destructive"}>
                          {a.passed ? "Pass" : "Fail"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Link to="/quiz/$slug" params={{ slug: a.mock_slug }} className="text-coral hover:underline">Retake</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {attempts.length > SHOW_MORE_LIMIT && (
              <button
                onClick={() => setShowAllAttempts((v) => !v)}
                className="mt-3 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
              >
                {showAllAttempts ? "Show less" : "Show all"}
              </button>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}