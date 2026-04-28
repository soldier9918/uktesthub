import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import type { Quiz, Question, FillBlanksQuestion } from "@/data/quizzes";
import { AdSlot } from "./AdSlot";
import { RoadSign } from "./RoadSign";

type Mode = "practice" | "exam";
// MCQ answer: number index. Fill-blanks answer: array of dropdown indices (-1 = unset).
type Answer = number | number[] | null;

function isFillBlanks(q: Question): q is FillBlanksQuestion {
  return q.type === "fill-blanks";
}

function isAnswered(q: Question, a: Answer): boolean {
  if (a === null) return false;
  if (isFillBlanks(q)) {
    return Array.isArray(a) && a.length === q.blanks.length && a.every((v) => v >= 0);
  }
  return typeof a === "number";
}

function isCorrect(q: Question, a: Answer): boolean {
  if (a === null) return false;
  if (isFillBlanks(q)) {
    if (!Array.isArray(a)) return false;
    return q.blanks.every((b, i) => a[i] === b.correctIndex);
  }
  return typeof a === "number" && a === q.correctAnswer;
}

export function QuizRunner({ quiz }: { quiz: Quiz }) {
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

  // Timer (exam mode only)
  useEffect(() => {
    if (mode !== "exam" || finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [mode, timeLeft, finished]);

  // Scroll to top whenever the question changes or we enter results.
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

  // Persist best score per quiz slug so category page progress bars fill.
  useEffect(() => {
    if (!finished) return;
    try {
      const key = `uk-test-hub:best:${quiz.slug}`;
      const prev = parseInt(localStorage.getItem(key) ?? "0", 10) || 0;
      if (score > prev) localStorage.setItem(key, String(score));
    } catch {
      // ignore
    }
  }, [finished, score, quiz.slug]);

  if (!mode) {
    return <ModeSelect quiz={quiz} onSelect={setMode} />;
  }

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
  const progress = ((current + 1) / quiz.questions.length) * 100;

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
  const answered = isAnswered(q, selected);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Top bar */}
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Question <span className="font-semibold text-foreground">{current + 1}</span> of{" "}
          {quiz.questions.length}
        </div>
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

      {/* Progress */}
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-gradient-coral transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {showAdBreak && <AdSlot size="in-feed" className="mb-4" />}

      {/* Question card */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-soft md:p-7">
        {isFillBlanks(q) ? (
          <FillBlanksQuestionView
            q={q}
            selected={Array.isArray(selected) ? selected : null}
            revealed={isRevealed}
            onChange={(arr) => setAnswer(arr)}
          />
        ) : (
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

        {isRevealed && (
          <div className="mt-5 rounded-2xl border border-border bg-muted/50 p-4 text-sm">
            <span className="font-semibold text-foreground">Explanation: </span>
            <span className="text-muted-foreground">{q.explanation}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setFinished(true)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Finish early
          </button>
          <div className="flex gap-2">
            {isFillBlanks(q) && mode === "practice" && answered && !isRevealed && (
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

function McqQuestionView({
  q,
  selected,
  revealed,
  onSelect,
}: {
  q: Extract<Question, { type?: "mcq" }>;
  selected: number | null;
  revealed: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <>
      {q.signType && (
        <div className="mb-6">
          <RoadSign type={q.signType} title="Road sign" />
        </div>
      )}
      <h2 className="font-display text-xl font-semibold leading-snug md:text-2xl">
        {q.question}
      </h2>
      <div className="mt-6 grid gap-3">
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectOpt = q.correctAnswer === i;
          let stateClass =
            "border-border bg-background hover:border-coral hover:bg-accent/40";
          if (revealed) {
            if (isCorrectOpt) stateClass = "border-success bg-success/10 text-foreground";
            else if (isSelected && !isCorrectOpt)
              stateClass = "border-destructive bg-destructive/10 text-foreground";
            else stateClass = "border-border bg-background opacity-70";
          } else if (isSelected) {
            stateClass = "border-coral bg-accent/60";
          }
          return (
            <button
              key={i}
              onClick={() => !revealed && onSelect(i)}
              disabled={revealed}
              className={`flex items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all ${stateClass}`}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-sm md:text-base">{opt}</span>
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
  // Init array of -1 for each blank.
  const values: number[] =
    selected && selected.length === q.blanks.length
      ? selected
      : Array(q.blanks.length).fill(-1);

  // Split template "Foo {{0}} bar {{1}} end" into alternating text/blank parts.
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
      <p className="mt-6 text-base leading-[2.4] md:text-lg md:leading-[2.6]">
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
              className={`mx-1 inline-block rounded-md border-2 bg-background px-2 py-1 text-sm font-medium align-baseline focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed ${borderClass}`}
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
      </p>
      {revealed && (
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
      )}
    </>
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
  if (isFillBlanks(q)) {
    // Render template with chosen-correct words inline.
    return q.template.replace(/\{\{(\d+)\}\}/g, (_, n) => {
      const b = q.blanks[parseInt(n, 10)];
      return b ? `[${b.options[b.correctIndex]}]` : "___";
    });
  }
  return q.question;
}

function answerSummary(q: Question, a: Answer): { correct: string; chosen?: string } {
  if (isFillBlanks(q)) {
    const correct = q.blanks.map((b) => b.options[b.correctIndex]).join(" / ");
    if (Array.isArray(a)) {
      const chosen = q.blanks
        .map((b, i) => (a[i] >= 0 ? b.options[a[i]] : "—"))
        .join(" / ");
      return { correct, chosen };
    }
    return { correct };
  }
  const correct = q.options[q.correctAnswer];
  if (typeof a === "number") return { correct, chosen: q.options[a] };
  return { correct };
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
        <p className="mt-1 text-muted-foreground">
          {quiz.quizTitle}
        </p>
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
