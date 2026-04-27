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
import type { Quiz } from "@/data/quizzes";
import { AdSlot } from "./AdSlot";
import { RoadSign } from "./RoadSign";

type Mode = "practice" | "exam";

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
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

  const score = useMemo<number>(
    () =>
      answers.reduce<number>(
        (acc, a, i) => (a === quiz.questions[i].correctAnswer ? acc + 1 : acc),
        0,
      ),
    [answers, quiz.questions],
  );
  const percent = Math.round((score / quiz.questions.length) * 100);
  const passed = percent >= quiz.passMark;

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

  const choose = (i: number) => {
    const next = [...answers];
    next[current] = i;
    setAnswers(next);
    if (mode === "practice") {
      const r = [...revealed];
      r[current] = true;
      setRevealed(r);
    }
  };

  const goNext = () => {
    if (current < quiz.questions.length - 1) setCurrent((c) => c + 1);
    else setFinished(true);
  };

  const showAdBreak = mode === "exam" && current > 0 && current % 4 === 0;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Question <span className="font-semibold text-foreground">{current + 1}</span> of{" "}
          {quiz.questions.length}
        </div>
        {mode === "exam" && (
          <div className="flex items-center gap-2 rounded-full bg-navy px-3 py-1.5 text-sm font-semibold text-navy-foreground">
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
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-gradient-coral transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {showAdBreak && <AdSlot size="in-feed" className="mb-6" />}

      {/* Question card */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
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
            const isCorrect = q.correctAnswer === i;
            let stateClass =
              "border-border bg-background hover:border-coral hover:bg-accent/40";
            if (isRevealed) {
              if (isCorrect) stateClass = "border-success bg-success/10 text-foreground";
              else if (isSelected && !isCorrect)
                stateClass = "border-destructive bg-destructive/10 text-foreground";
              else stateClass = "border-border bg-background opacity-70";
            } else if (isSelected) {
              stateClass = "border-coral bg-accent/60";
            }
            return (
              <button
                key={i}
                onClick={() => !isRevealed && choose(i)}
                disabled={isRevealed}
                className={`flex items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all ${stateClass}`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-sm md:text-base">{opt}</span>
                {isRevealed && isCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                )}
                {isRevealed && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </button>
            );
          })}
        </div>

        {isRevealed && (
          <div className="mt-5 rounded-2xl border border-border bg-muted/50 p-4 text-sm">
            <span className="font-semibold text-foreground">Explanation: </span>
            <span className="text-muted-foreground">{q.explanation}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <Link
            to="/quiz/$slug"
            params={{ slug: quiz.slug }}
            onClick={(e) => {
              e.preventDefault();
              setFinished(true);
            }}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Finish early
          </Link>
          <button
            onClick={goNext}
            disabled={selected === null}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-coral px-5 py-2.5 text-sm font-semibold text-coral-foreground shadow-coral transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            {current === quiz.questions.length - 1 ? "Finish" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
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
          <span className="rounded-full bg-muted px-3 py-1 font-medium">
            {quiz.difficulty}
          </span>
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

function Results({
  quiz,
  answers,
  score,
  percent,
  passed,
  onRetry,
}: {
  quiz: Quiz;
  answers: (number | null)[];
  score: number;
  percent: number;
  passed: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
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

      <AdSlot size="rectangle" />

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
        <h3 className="font-display text-xl font-semibold">Review your answers</h3>
        <ol className="mt-5 space-y-4">
          {quiz.questions.map((q, i) => {
            const a = answers[i];
            const correct = a === q.correctAnswer;
            return (
              <li key={q.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-start gap-3">
                  {correct ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{i + 1}. {q.question}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Correct: </span>
                      {q.options[q.correctAnswer]}
                      {!correct && a !== null && (
                        <>
                          {" · "}
                          <span className="text-destructive">Your answer: {q.options[a]}</span>
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
