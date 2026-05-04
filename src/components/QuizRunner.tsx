import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import type {
  Quiz,
  Question,
  MCQQuestion,
  FillBlanksQuestion,
  TrueFalseQuestion,
  MultipleResponseQuestion,
  NumericEntryQuestion,
  ImageQuestion,
  HotSpotQuestion,
  DragDropBlanksQuestion,
} from "@/data/quizzes";
import { AdSlot } from "./AdSlot";
import { RoadSign } from "./RoadSign";
import { ReportQuestionButton } from "./ReportQuestionButton";
import { useOverrides, applyOverrides } from "@/lib/overrides";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { trackEvent } from "@/lib/analytics";

type Mode = "practice" | "exam";
// Answer shapes per question type:
// - MCQ / image / true-false: number index (true=1, false=0 for true-false)
// - fill-blanks / drag-drop-blanks: number[]  (-1 = unset)
// - multiple-response: number[]  (selected indices)
// - numeric-entry: string (raw input; parsed at check time)
// - hot-spot: string (clicked spot id)
type Answer = number | number[] | string | null;

// ---------- type guards ----------
function isMcq(q: Question): q is MCQQuestion {
  return !q.type || q.type === "mcq";
}
function isFillBlanks(q: Question): q is FillBlanksQuestion {
  return q.type === "fill-blanks";
}
function isDragDrop(q: Question): q is DragDropBlanksQuestion {
  return q.type === "drag-drop-blanks";
}
function isTrueFalse(q: Question): q is TrueFalseQuestion {
  return q.type === "true-false";
}
function isMultiResponse(q: Question): q is MultipleResponseQuestion {
  return q.type === "multiple-response";
}
function isNumeric(q: Question): q is NumericEntryQuestion {
  return q.type === "numeric-entry";
}
function isImage(q: Question): q is ImageQuestion {
  return q.type === "image-question";
}
function isHotSpot(q: Question): q is HotSpotQuestion {
  return q.type === "hot-spot";
}

function isAnswered(q: Question, a: Answer): boolean {
  if (a === null) return false;
  if (isFillBlanks(q) || isDragDrop(q)) {
    return Array.isArray(a) && a.length === q.blanks.length && a.every((v) => v >= 0);
  }
  if (isMultiResponse(q)) return Array.isArray(a) && a.length > 0;
  if (isNumeric(q)) return typeof a === "string" && a.trim() !== "";
  if (isHotSpot(q)) return typeof a === "string" && a.length > 0;
  return typeof a === "number";
}

function isCorrect(q: Question, a: Answer): boolean {
  if (a === null) return false;
  if (isFillBlanks(q) || isDragDrop(q)) {
    if (!Array.isArray(a)) return false;
    return q.blanks.every((b, i) => a[i] === b.correctIndex);
  }
  if (isMultiResponse(q)) {
    if (!Array.isArray(a)) return false;
    const sel = [...a].sort();
    const want = [...q.correctAnswers].sort();
    return sel.length === want.length && sel.every((v, i) => v === want[i]);
  }
  if (isTrueFalse(q)) {
    return typeof a === "number" && (a === 1) === q.correctAnswer;
  }
  if (isNumeric(q)) {
    if (typeof a !== "string") return false;
    const n = parseFloat(a);
    if (Number.isNaN(n)) return false;
    const tol = q.tolerance ?? 0;
    return Math.abs(n - q.correctAnswer) <= tol;
  }
  if (isHotSpot(q)) return a === q.correctSpotId;
  if (isImage(q)) return typeof a === "number" && a === q.correctAnswer;
  if (isMcq(q)) return typeof a === "number" && a === q.correctAnswer;
  return false;
}

export function QuizRunner({ quiz: rawQuiz }: { quiz: Quiz }) {
  const overrides = useOverrides();
  const quiz = useMemo(
    () => (overrides ? applyOverrides(rawQuiz, overrides) : rawQuiz),
    [rawQuiz, overrides],
  );
  const [mode, setMode] = useState<Mode | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    Array(quiz.questions.length).fill(null),
  );
  const [revealed, setRevealed] = useState<boolean[]>(
    Array(quiz.questions.length).fill(false),
  );
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);
  const [finished, setFinished] = useState(false);

  // Deep-link support: /quiz/<slug>#q5 jumps straight to question 5 in
  // practice mode. Used by the admin to verify a specific bank question.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = /^#q(\d+)$/i.exec(window.location.hash);
    if (!m) return;
    const slot = parseInt(m[1], 10);
    if (!Number.isFinite(slot)) return;
    const idx = Math.max(0, Math.min(quiz.questions.length - 1, slot - 1));
    setCurrent(idx);
    setMode((prev) => prev ?? "practice");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track quiz_start when the user picks a mode for the first time.
  useEffect(() => {
    if (!mode) return;
    void trackEvent({
      event_type: "quiz_start",
      topic_slug: (quiz as { topicSlug?: string }).topicSlug ?? null,
      mock_slug: quiz.slug,
      metadata: { mode },
    });
  }, [mode, quiz]);
  useEffect(() => {
    if (mode !== "exam" || finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [mode, timeLeft, finished]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [current, finished, mode]);

  const score = useMemo<number>(
    () =>
      answers.reduce<number>(
        (acc, a, i) => (isCorrect(quiz.questions[i], a) ? acc + 1 : acc),
        0,
      ),
    [answers, quiz.questions],
  );
  const percent = Math.round((score / quiz.questions.length) * 100);
  const passed = percent >= quiz.passMark;

  const { user } = useAuth();
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Restore in-progress quiz from DB for signed-in users
  useEffect(() => {
    if (!user || progressLoaded) return;
    let cancelled = false;
    supabase
      .from("quiz_progress")
      .select("current_index,answers")
      .eq("mock_slug", quiz.slug)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data && Array.isArray((data as { answers?: unknown }).answers)) {
          const restored = (data as { answers: Answer[] }).answers;
          if (restored.length === quiz.questions.length) {
            setAnswers(restored);
            setCurrent(Math.min((data as { current_index: number }).current_index ?? 0, quiz.questions.length - 1));
          }
        }
        setProgressLoaded(true);
      });
    return () => { cancelled = true; };
  }, [user, quiz.slug, quiz.questions.length, progressLoaded]);

  // Debounced live save while quiz is in progress
  useEffect(() => {
    if (!user || finished || mode === null) return;
    const t = setTimeout(() => {
      supabase
        .from("quiz_progress")
        .upsert(
          [{
            user_id: user.id,
            mock_slug: quiz.slug,
            topic_slug: (quiz as { topicSlug?: string }).topicSlug ?? quiz.slug,
            current_index: current,
            answers: answers as unknown as import("@/integrations/supabase/types").Json,
            updated_at: new Date().toISOString(),
          }],
          { onConflict: "user_id,mock_slug" },
        )
        .then(() => {});
    }, 800);
    return () => clearTimeout(t);
  }, [user, finished, mode, current, answers, quiz]);

  useEffect(() => {
    if (!finished) return;
    void trackEvent({
      event_type: "quiz_complete",
      topic_slug: (quiz as { topicSlug?: string }).topicSlug ?? null,
      mock_slug: quiz.slug,
      metadata: { score, total: quiz.questions.length, percent },
    });
    try {
      const key = `uk-test-hub:best:${quiz.slug}`;
      const prev = parseInt(localStorage.getItem(key) ?? "0", 10) || 0;
      if (score > prev) localStorage.setItem(key, String(score));
    } catch {
      // ignore
    }
    if (user) {
      const total = quiz.questions.length;
      const pct = Math.round((score / total) * 100);
      supabase.from("quiz_attempts").insert({
        user_id: user.id,
        topic_slug: (quiz as { topicSlug?: string }).topicSlug ?? quiz.slug,
        mock_slug: quiz.slug,
        score, total, percent: pct,
        passed: pct >= quiz.passMark,
      }).then(() => {});
      supabase.from("quiz_progress").delete().eq("mock_slug", quiz.slug).then(() => {});
    }
  }, [finished, score, quiz, user]);

  if (!mode) return <ModeSelect quiz={quiz} onSelect={setMode} />;

  if (finished) {
    return (
      <Results
        quiz={quiz}
        answers={answers}
        score={score}
        percent={percent}
        passed={passed}
        onRetry={() => {
          setMode(null);
          setCurrent(0);
          setAnswers(Array(quiz.questions.length).fill(null));
          setRevealed(Array(quiz.questions.length).fill(false));
          setTimeLeft(quiz.timeLimit);
          setFinished(false);
        }}
      />
    );
  }

  const q = quiz.questions[current];
  const selected = answers[current];
  const isRevealed = mode === "practice" && revealed[current];
  const answered = isAnswered(q, selected);

  const setAnswer = (a: Answer) => {
    const next = [...answers];
    next[current] = a;
    setAnswers(next);
  };

  const reveal = () => {
    if (mode !== "practice") return;
    const r = [...revealed];
    r[current] = true;
    setRevealed(r);
  };

  const goNext = () => {
    if (current < quiz.questions.length - 1) setCurrent((c) => c + 1);
    else setFinished(true);
  };

  const showAdBreak = mode === "exam" && current > 0 && current % 4 === 0;

  // For multi-step types we show an explicit "Check answer" button in practice.
  const needsExplicitCheck =
    isFillBlanks(q) ||
    isDragDrop(q) ||
    isMultiResponse(q) ||
    isNumeric(q);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Question <span className="font-semibold text-foreground">{current + 1}</span> of{" "}
          {quiz.questions.length}
        </div>
        <div className="flex items-center gap-3">
          <ReportQuestionButton
            questionId={String(q.id)}
            topicSlug={(quiz as { topicSlug?: string }).topicSlug ?? quiz.slug}
            mockSlug={quiz.slug}
          />
          {mode === "exam" && (
            <div className="flex items-center gap-2 rounded-full bg-navy px-3 py-1 text-sm font-semibold text-navy-foreground">
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          )}
          {mode === "practice" && (
            <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
              Practice mode
            </span>
          )}
        </div>
      </div>

      {showAdBreak && <AdSlot size="in-feed" className="mb-3" />}

      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft md:p-5">
        {isMcq(q) && (
          <McqQuestionView
            q={q}
            selected={typeof selected === "number" ? selected : null}
            revealed={isRevealed}
            onSelect={(i) => {
              setAnswer(i);
              reveal();
            }}
          />
        )}
        {isImage(q) && (
          <ImageQuestionView
            q={q}
            selected={typeof selected === "number" ? selected : null}
            revealed={isRevealed}
            onSelect={(i) => {
              setAnswer(i);
              reveal();
            }}
          />
        )}
        {isTrueFalse(q) && (
          <TrueFalseView
            q={q}
            selected={typeof selected === "number" ? selected : null}
            revealed={isRevealed}
            onSelect={(i) => {
              setAnswer(i);
              reveal();
            }}
          />
        )}
        {isFillBlanks(q) && (
          <FillBlanksQuestionView
            q={q}
            selected={Array.isArray(selected) ? (selected as number[]) : null}
            revealed={isRevealed}
            onChange={(arr) => setAnswer(arr)}
          />
        )}
        {isDragDrop(q) && (
          <DragDropBlanksView
            q={q}
            selected={Array.isArray(selected) ? (selected as number[]) : null}
            revealed={isRevealed}
            onChange={(arr) => setAnswer(arr)}
          />
        )}
        {isMultiResponse(q) && (
          <MultipleResponseView
            q={q}
            selected={Array.isArray(selected) ? (selected as number[]) : null}
            revealed={isRevealed}
            onChange={(arr) => setAnswer(arr)}
          />
        )}
        {isNumeric(q) && (
          <NumericEntryView
            q={q}
            selected={typeof selected === "string" ? selected : null}
            revealed={isRevealed}
            onChange={(v) => setAnswer(v)}
          />
        )}
        {isHotSpot(q) && (
          <HotSpotView
            q={q}
            selected={typeof selected === "string" ? selected : null}
            revealed={isRevealed}
            onSelect={(id) => {
              setAnswer(id);
              reveal();
            }}
          />
        )}

        {isRevealed && (
          <div className="mt-3 rounded-xl border border-border bg-muted/50 p-3 text-sm">
            <span className="font-semibold text-foreground">Explanation: </span>
            <span className="text-muted-foreground">{q.explanation}</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex gap-2">
            {needsExplicitCheck && mode === "practice" && answered && !isRevealed && (
              <button
                onClick={reveal}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                Check answer
              </button>
            )}
            <button
              onClick={goNext}
              disabled={!answered}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-coral px-5 py-2.5 text-sm font-semibold text-coral-foreground shadow-coral transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {current === quiz.questions.length - 1 ? "Finish" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== Renderers ==============

function McqQuestionView({
  q,
  selected,
  revealed,
  onSelect,
}: {
  q: MCQQuestion;
  selected: number | null;
  revealed: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <>
      {q.signType && (
        <div className="mb-3">
          <RoadSign type={q.signType} title="Road sign" />
        </div>
      )}
      {q.image && (
        <img
          src={q.image}
          alt={q.imageAlt ?? ""}
          loading="lazy"
          className="mb-3 max-h-64 rounded-xl border border-border object-contain"
        />
      )}
      <h2 className="font-display text-base font-semibold leading-snug md:text-lg">
        {q.question}
      </h2>
      <OptionList
        options={q.options}
        selected={selected}
        correct={q.correctAnswer}
        revealed={revealed}
        onSelect={onSelect}
      />
    </>
  );
}

function ImageQuestionView({
  q,
  selected,
  revealed,
  onSelect,
}: {
  q: ImageQuestion;
  selected: number | null;
  revealed: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <>
      <img
        src={q.image}
        alt={q.imageAlt}
        loading="lazy"
        className="mb-3 max-h-72 rounded-xl border border-border object-contain"
      />
      <h2 className="font-display text-base font-semibold leading-snug md:text-lg">
        {q.question}
      </h2>
      <OptionList
        options={q.options}
        selected={selected}
        correct={q.correctAnswer}
        revealed={revealed}
        onSelect={onSelect}
      />
    </>
  );
}

function TrueFalseView({
  q,
  selected,
  revealed,
  onSelect,
}: {
  q: TrueFalseQuestion;
  selected: number | null;
  revealed: boolean;
  onSelect: (i: number) => void;
}) {
  const correctIdx = q.correctAnswer ? 1 : 0;
  return (
    <>
      {q.image && (
        <img
          src={q.image}
          alt={q.imageAlt ?? ""}
          loading="lazy"
          className="mb-3 max-h-64 rounded-xl border border-border object-contain"
        />
      )}
      <h2 className="font-display text-base font-semibold leading-snug md:text-lg">
        {q.question}
      </h2>
      <OptionList
        options={["False", "True"]}
        selected={selected}
        correct={correctIdx}
        revealed={revealed}
        onSelect={onSelect}
      />
    </>
  );
}

function OptionList({
  options,
  selected,
  correct,
  revealed,
  onSelect,
}: {
  options: string[];
  selected: number | null;
  correct: number;
  revealed: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="mt-3 grid gap-2">
      {options.map((opt, i) => {
        const isSelected = selected === i;
        const isCorrectOpt = correct === i;
        let stateClass =
          "border-border bg-background hover:border-coral hover:bg-accent/40";
        if (revealed) {
          if (isCorrectOpt) stateClass = "border-success bg-success/10 text-foreground";
          else if (isSelected && !isCorrectOpt)
            stateClass = "border-destructive bg-destructive/10 text-foreground";
          else stateClass = "border-border bg-background opacity-70";
        } else if (isSelected) {
          stateClass = "border-navy bg-navy/10";
        }
        return (
          <button
            key={i}
            onClick={() => !revealed && onSelect(i)}
            disabled={revealed}
            className={`flex items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${stateClass}`}
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="flex-1 text-sm">{opt}</span>
            {revealed && isCorrectOpt && (
              <CheckCircle2 className="h-5 w-5 text-success" />
            )}
            {revealed && isSelected && !isCorrectOpt && (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function MultipleResponseView({
  q,
  selected,
  revealed,
  onChange,
}: {
  q: MultipleResponseQuestion;
  selected: number[] | null;
  revealed: boolean;
  onChange: (next: number[]) => void;
}) {
  const sel = selected ?? [];
  const toggle = (i: number) => {
    if (revealed) return;
    onChange(sel.includes(i) ? sel.filter((v) => v !== i) : [...sel, i]);
  };
  return (
    <>
      <h2 className="font-display text-base font-semibold leading-snug md:text-lg">
        {q.question}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
      <div className="mt-3 grid gap-2">
        {q.options.map((opt, i) => {
          const isSelected = sel.includes(i);
          const isCorrectOpt = q.correctAnswers.includes(i);
          let stateClass =
            "border-border bg-background hover:border-coral hover:bg-accent/40";
          if (revealed) {
            if (isCorrectOpt) stateClass = "border-success bg-success/10";
            else if (isSelected) stateClass = "border-destructive bg-destructive/10";
            else stateClass = "border-border opacity-70";
          } else if (isSelected) {
            stateClass = "border-coral bg-accent/60";
          }
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              disabled={revealed}
              className={`flex items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${stateClass}`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                  isSelected ? "border-coral bg-coral text-coral-foreground" : "border-border bg-background"
                }`}
              >
                {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
              </span>
              <span className="flex-1 text-sm">{opt}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function NumericEntryView({
  q,
  selected,
  revealed,
  onChange,
}: {
  q: NumericEntryQuestion;
  selected: string | null;
  revealed: boolean;
  onChange: (v: string) => void;
}) {
  const value = selected ?? "";
  const correct =
    value !== "" &&
    !Number.isNaN(parseFloat(value)) &&
    Math.abs(parseFloat(value) - q.correctAnswer) <= (q.tolerance ?? 0);
  const borderClass = revealed
    ? correct
      ? "border-success bg-success/10"
      : "border-destructive bg-destructive/10"
    : "border-border focus:border-coral";
  return (
    <>
      <h2 className="font-display text-base font-semibold leading-snug md:text-lg">
        {q.question}
      </h2>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          step="any"
          value={value}
          disabled={revealed}
          onChange={(e) => onChange(e.target.value)}
          className={`w-40 rounded-xl border-2 bg-background px-3 py-2 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40 ${borderClass}`}
          placeholder="Enter a number"
        />
        {q.unit && <span className="text-sm font-medium text-muted-foreground">{q.unit}</span>}
      </div>
      {revealed && !correct && (
        <p className="mt-2 text-sm">
          Correct answer:{" "}
          <span className="font-semibold text-success">
            {q.correctAnswer}
            {q.unit ? ` ${q.unit}` : ""}
          </span>
        </p>
      )}
    </>
  );
}

function HotSpotView({
  q,
  selected,
  revealed,
  onSelect,
}: {
  q: HotSpotQuestion;
  selected: string | null;
  revealed: boolean;
  onSelect: (id: string) => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (revealed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const hit = q.spots.find(
      (s) => x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h,
    );
    onSelect(hit ? hit.id : "__miss__");
  };
  return (
    <>
      <h2 className="font-display text-base font-semibold leading-snug md:text-lg">
        {q.question}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">Click the correct area on the image.</p>
      <div
        className="relative mt-3 inline-block cursor-crosshair overflow-hidden rounded-xl border border-border"
        onClick={handleClick}
      >
        <img
          src={q.image}
          alt={q.imageAlt}
          loading="lazy"
          className="block max-h-80 w-auto select-none"
          draggable={false}
        />
        {revealed &&
          q.spots.map((s) => {
            const isCorrect = s.id === q.correctSpotId;
            const isClicked = s.id === selected;
            return (
              <div
                key={s.id}
                className={`absolute border-2 ${
                  isCorrect ? "border-success bg-success/20" : isClicked ? "border-destructive bg-destructive/20" : "border-transparent"
                }`}
                style={{
                  left: `${s.x * 100}%`,
                  top: `${s.y * 100}%`,
                  width: `${s.w * 100}%`,
                  height: `${s.h * 100}%`,
                }}
                title={s.label}
              />
            );
          })}
      </div>
    </>
  );
}

function FillBlanksQuestionView({
  q,
  selected,
  revealed,
  onChange,
}: {
  q: FillBlanksQuestion;
  selected: number[] | null;
  revealed: boolean;
  onChange: (next: number[]) => void;
}) {
  const values: number[] =
    selected && selected.length === q.blanks.length
      ? selected
      : Array(q.blanks.length).fill(-1);

  const parts = useMemo(() => {
    const out: Array<{ kind: "text"; text: string } | { kind: "blank"; index: number }> = [];
    const re = /\{\{(\d+)\}\}/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(q.template)) !== null) {
      if (m.index > last) out.push({ kind: "text", text: q.template.slice(last, m.index) });
      out.push({ kind: "blank", index: parseInt(m[1], 10) });
      last = m.index + m[0].length;
    }
    if (last < q.template.length) out.push({ kind: "text", text: q.template.slice(last) });
    return out;
  }, [q.template]);

  const setValue = (i: number, v: number) => {
    const next = [...values];
    next[i] = v;
    onChange(next);
  };

  return (
    <>
      <h2 className="font-display text-lg font-semibold leading-snug md:text-xl">
        {q.prompt ?? "Select the words from the dropdowns to complete the sentence."}
      </h2>
      <div className="mt-6 text-base leading-[2.4] md:text-lg md:leading-[2.6]">
        {parts.map((p, idx) => {
          if (p.kind === "text") return <span key={idx}>{p.text}</span>;
          const blank = q.blanks[p.index];
          if (!blank) return null;
          const value = values[p.index];
          const correctIdx = blank.correctIndex;
          let borderClass = "border-border focus:border-coral focus:ring-coral";
          if (revealed) {
            if (value === correctIdx) borderClass = "border-success bg-success/10";
            else borderClass = "border-destructive bg-destructive/10";
          } else if (value >= 0) {
            borderClass = "border-coral";
          }
          return (
            <select
              key={idx}
              value={value}
              disabled={revealed}
              onChange={(e) => setValue(p.index, parseInt(e.target.value, 10))}
              style={{ width: "auto", display: "inline-block" }}
              className={`mx-1 rounded-md border-2 bg-background px-2 py-1 text-sm font-medium align-middle focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed ${borderClass}`}
            >
              <option value={-1}>—</option>
              {blank.options.map((opt, i) => (
                <option key={i} value={i}>
                  {opt}
                </option>
              ))}
            </select>
          );
        })}
      </div>
      {revealed && <BlankResults q={q} values={values} />}
    </>
  );
}

function DragDropBlanksView({
  q,
  selected,
  revealed,
  onChange,
}: {
  q: DragDropBlanksQuestion;
  selected: number[] | null;
  revealed: boolean;
  onChange: (next: number[]) => void;
}) {
  // For now, render the same dropdown UI as fill-blanks (drag-drop on touch is
  // tricky); the data model is identical so swapping in true DnD later is safe.
  return (
    <FillBlanksQuestionView
      q={{ ...q, type: "fill-blanks" } as FillBlanksQuestion}
      selected={selected}
      revealed={revealed}
      onChange={onChange}
    />
  );
}

function BlankResults({
  q,
  values,
}: {
  q: { blanks: { options: string[]; correctIndex: number }[] };
  values: number[];
}) {
  return (
    <ul className="mt-5 space-y-1.5 text-sm">
      {q.blanks.map((b, i) => {
        const ok = values[i] === b.correctIndex;
        return (
          <li key={i} className="flex items-start gap-2">
            {ok ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 text-destructive" />
            )}
            <span className="text-muted-foreground">
              Blank {i + 1}:{" "}
              <span className="font-semibold text-foreground">
                {b.options[b.correctIndex]}
              </span>
              {!ok && values[i] >= 0 && (
                <>
                  {" "}
                  <span className="text-destructive">
                    (you chose: {b.options[values[i]]})
                  </span>
                </>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function ModeSelect({ quiz, onSelect }: { quiz: Quiz; onSelect: (m: Mode) => void }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
        <h1 className="font-display text-2xl font-bold md:text-3xl">{quiz.quizTitle}</h1>
        <p className="mt-2 text-muted-foreground">{quiz.description}</p>

        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-muted px-3 py-1 font-medium">
            {quiz.questions.length} questions
          </span>
          <span className="rounded-full bg-muted px-3 py-1 font-medium">
            {Math.round(quiz.timeLimit / 60)} min
          </span>
          {!quiz.slug.includes("-mock-") && (
            <span className="rounded-full bg-muted px-3 py-1 font-medium">
              {quiz.difficulty}
            </span>
          )}
          <span className="rounded-full bg-gold/20 px-3 py-1 font-medium text-foreground">
            Pass: {quiz.passMark}%
          </span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button
            onClick={() => onSelect("practice")}
            className="group rounded-2xl border-2 border-border bg-background p-5 text-left transition-all hover:-translate-y-0.5 hover:border-success hover:shadow-soft"
          >
            <div className="font-display text-lg font-semibold">Practice mode</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Instant feedback and explanations after every question. No timer.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-success">
              Start practice <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          <button
            onClick={() => onSelect("exam")}
            className="group rounded-2xl border-2 border-coral bg-gradient-coral p-5 text-left text-coral-foreground shadow-coral transition-all hover:-translate-y-0.5"
          >
            <div className="font-display text-lg font-semibold">Exam mode</div>
            <p className="mt-1 text-sm opacity-90">
              Timed, real-test feel. Results shown at the end with full review.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
              Start exam <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function describeQuestion(q: Question): string {
  if (isFillBlanks(q) || isDragDrop(q)) {
    return q.template.replace(/\{\{(\d+)\}\}/g, (_, n) => {
      const b = q.blanks[parseInt(n, 10)];
      return b ? `[${b.options[b.correctIndex]}]` : "___";
    });
  }
  if (isHotSpot(q) || isImage(q) || isTrueFalse(q) || isMultiResponse(q) || isNumeric(q) || isMcq(q)) {
    return q.question;
  }
  return "";
}

function answerSummary(q: Question, a: Answer): { correct: string; chosen?: string } {
  if (isFillBlanks(q) || isDragDrop(q)) {
    const correct = q.blanks.map((b) => b.options[b.correctIndex]).join(" / ");
    if (Array.isArray(a)) {
      const chosen = q.blanks
        .map((b, i) => ((a as number[])[i] >= 0 ? b.options[(a as number[])[i]] : "—"))
        .join(" / ");
      return { correct, chosen };
    }
    return { correct };
  }
  if (isMultiResponse(q)) {
    const correct = q.correctAnswers.map((i) => q.options[i]).join(", ");
    if (Array.isArray(a)) {
      const chosen = (a as number[]).map((i) => q.options[i]).join(", ") || "—";
      return { correct, chosen };
    }
    return { correct };
  }
  if (isTrueFalse(q)) {
    const correct = q.correctAnswer ? "True" : "False";
    if (typeof a === "number") return { correct, chosen: a === 1 ? "True" : "False" };
    return { correct };
  }
  if (isNumeric(q)) {
    const correct = `${q.correctAnswer}${q.unit ? ` ${q.unit}` : ""}`;
    if (typeof a === "string" && a !== "") return { correct, chosen: a };
    return { correct };
  }
  if (isHotSpot(q)) {
    const c = q.spots.find((s) => s.id === q.correctSpotId);
    const correct = c?.label ?? q.correctSpotId;
    if (typeof a === "string") {
      const chosen = q.spots.find((s) => s.id === a)?.label ?? (a === "__miss__" ? "Outside any region" : a);
      return { correct, chosen };
    }
    return { correct };
  }
  if (isImage(q) || isMcq(q)) {
    const correct = q.options[q.correctAnswer];
    if (typeof a === "number") return { correct, chosen: q.options[a] };
    return { correct };
  }
  return { correct: "" };
}

function Results({
  quiz,
  answers,
  score,
  percent,
  passed,
  onRetry,
}: {
  quiz: Quiz;
  answers: Answer[];
  score: number;
  percent: number;
  passed: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div
        className={`overflow-hidden rounded-3xl border p-8 text-center shadow-elevated ${
          passed
            ? "border-success/30 bg-success/10"
            : "border-destructive/30 bg-destructive/10"
        }`}
      >
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            passed ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
          }`}
        >
          {passed ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
        </div>
        <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
          {passed ? "You passed!" : "Not quite there"}
        </h2>
        <p className="mt-1 text-muted-foreground">{quiz.quizTitle}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Score" value={`${score} / ${quiz.questions.length}`} />
          <Stat label="Percentage" value={`${percent}%`} />
          <Stat label="Pass mark" value={`${quiz.passMark}%`} />
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-coral px-5 py-2.5 text-sm font-semibold text-coral-foreground shadow-coral"
          >
            <RotateCcw className="h-4 w-4" /> Retry test
          </button>
          <Link
            to="/category/$slug"
            params={{ slug: quiz.category }}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            More tests <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
        <h3 className="font-display text-xl font-semibold">Review your answers</h3>
        <ol className="mt-5 space-y-4">
          {quiz.questions.map((q, i) => {
            const a = answers[i];
            const correct = isCorrect(q, a);
            const summary = answerSummary(q, a);
            return (
              <li key={q.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-start gap-3">
                  {correct ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{i + 1}. {describeQuestion(q)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Correct: </span>
                      {summary.correct}
                      {!correct && summary.chosen && (
                        <>
                          {" · "}
                          <span className="text-destructive">Your answer: {summary.chosen}</span>
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{q.explanation}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background/70 p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
