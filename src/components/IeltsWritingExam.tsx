import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Clock, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  IELTS_WRITING_PROMPTS,
  pickRandomSet,
  type WritingQuestionSet,
  type WritingTask,
  type WritingVariant,
} from "@/data/english/ielts-writing-prompts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CheckCircle2, AlertTriangle, ListChecks, BookOpen, ChevronDown } from "lucide-react";
import {
  markIeltsWriting,
  type IeltsMarkingResult,
  type IeltsTaskFeedback,
  type IeltsCriterion,
} from "@/lib/ielts-writing.functions";

type Props = {
  level: string;
  onExit: () => void;
};

const TOTAL_SECONDS = 60 * 60;

function countWords(s: string): number {
  const trimmed = s.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function storageKey(level: string, variant: WritingVariant, setId: string, task: 1 | 2) {
  return `uk-test-hub:ielts-writing:${level}:${variant}:${setId}:t${task}`;
}

export function IeltsWritingExam({ level, onExit }: Props) {
  const [variant, setVariant] = useState<WritingVariant | null>(null);
  const [questionSet, setQuestionSet] = useState<WritingQuestionSet | null>(null);
  const [phase, setPhase] = useState<"picker" | "exam" | "marking" | "results">("picker");
  const [task1Answer, setTask1Answer] = useState("");
  const [task2Answer, setTask2Answer] = useState("");
  const [activeTab, setActiveTab] = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [result, setResult] = useState<IeltsMarkingResult | null>(null);
  const [markError, setMarkError] = useState<string | null>(null);
  const mark = useServerFn(markIeltsWriting);
  const submittedRef = useRef(false);

  function startWithVariant(v: WritingVariant) {
    const set = pickRandomSet(v);
    setVariant(v);
    setQuestionSet(set);
    // Restore any saved drafts for this exact set
    try {
      setTask1Answer(localStorage.getItem(storageKey(level, v, set.id, 1)) ?? "");
      setTask2Answer(localStorage.getItem(storageKey(level, v, set.id, 2)) ?? "");
    } catch {
      /* ignore */
    }
    setTimeLeft(TOTAL_SECONDS);
    setActiveTab(1);
    setPhase("exam");
  }

  // Persist drafts
  useEffect(() => {
    if (phase !== "exam" || !variant || !questionSet) return;
    try {
      localStorage.setItem(storageKey(level, variant, questionSet.id, 1), task1Answer);
    } catch {
      /* ignore */
    }
  }, [task1Answer, phase, variant, questionSet, level]);

  useEffect(() => {
    if (phase !== "exam" || !variant || !questionSet) return;
    try {
      localStorage.setItem(storageKey(level, variant, questionSet.id, 2), task2Answer);
    } catch {
      /* ignore */
    }
  }, [task2Answer, phase, variant, questionSet, level]);

  // Countdown
  useEffect(() => {
    if (phase !== "exam") return;
    if (timeLeft <= 0) {
      void submit();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  async function submit() {
    if (submittedRef.current || !variant || !questionSet) return;
    submittedRef.current = true;
    setPhase("marking");
    setMarkError(null);
    try {
      const res = await mark({
        data: {
          variant,
          task1: { prompt: questionSet.task1.prompt, answer: task1Answer || "(no answer submitted)" },
          task2: { prompt: questionSet.task2.prompt, answer: task2Answer || "(no answer submitted)" },
        },
      });
      setResult(res);
      setPhase("results");
      // Clear drafts now that the attempt is complete
      try {
        localStorage.removeItem(storageKey(level, variant, questionSet.id, 1));
        localStorage.removeItem(storageKey(level, variant, questionSet.id, 2));
      } catch {
        /* ignore */
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "AI_GATEWAY_ERROR";
      const friendly =
        msg === "RATE_LIMIT"
          ? "Marking is busy right now. Please try again in a moment."
          : msg === "PAYMENT_REQUIRED"
            ? "Marking credits have run out. Please contact the site owner."
            : "Couldn't mark your answers right now. Please try again.";
      setMarkError(friendly);
      submittedRef.current = false;
      setPhase("exam");
    }
  }

  if (phase === "picker") {
    return <VariantPicker onPick={startWithVariant} onExit={onExit} level={level} />;
  }

  if (phase === "marking") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
        <h2 className="mt-6 text-2xl font-semibold">Reviewing your IELTS Writing…</h2>
        <p className="mt-2 text-muted-foreground">
          Your Task 1 and Task 2 answers are being reviewed using IELTS-style writing criteria,
          including task response, organisation, vocabulary and grammar.
        </p>
        <p className="mt-2 text-muted-foreground">
          This usually takes 20–40 seconds. Your feedback will include an estimated practice band,
          strengths, common mistakes and improvement tips.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Important note: This is an independent practice estimate only. Official IELTS Writing
          scores are awarded by trained IELTS examiners.
        </p>
      </div>
    );
  }

  if (phase === "results" && result && questionSet && variant) {
    return (
      <ResultsScreen
        result={result}
        questionSet={questionSet}
        variant={variant}
        task1Answer={task1Answer}
        task2Answer={task2Answer}
        onRetry={() => {
          submittedRef.current = false;
          setResult(null);
          setTask1Answer("");
          setTask2Answer("");
          setPhase("picker");
        }}
        onExit={onExit}
      />
    );
  }

  // Exam phase
  if (!questionSet || !variant) return null;
  const task1Words = countWords(task1Answer);
  const task2Words = countWords(task2Answer);
  const activeTask: WritingTask =
    activeTab === 1 ? questionSet.task1 : questionSet.task2;
  const activeAnswer = activeTab === 1 ? task1Answer : task2Answer;
  const setActiveAnswer = activeTab === 1 ? setTask1Answer : setTask2Answer;
  const activeWords = activeTab === 1 ? task1Words : task2Words;
  const lowTime = timeLeft < 5 * 60;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">
            IELTS Writing Exam · {variant === "academic" ? "Academic" : "General Training"}
          </h1>
          <p className="text-sm text-muted-foreground">
            2 tasks · 60 minutes · {level.toUpperCase()} level
          </p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-lg ${
            lowTime ? "border-destructive text-destructive" : ""
          }`}
        >
          <Clock className="h-4 w-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {markError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Marking failed</AlertTitle>
          <AlertDescription>{markError}</AlertDescription>
        </Alert>
      )}

      <div className="mb-4 inline-flex rounded-lg border bg-muted/40 p-1">
        <button
          onClick={() => setActiveTab(1)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 1 ? "bg-background shadow" : "text-muted-foreground"
          }`}
        >
          Task 1 · 20 min · ≥150 words {task1Words > 0 && `(${task1Words})`}
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 2 ? "bg-background shadow" : "text-muted-foreground"
          }`}
        >
          Task 2 · 40 min · ≥250 words {task2Words > 0 && `(${task2Words})`}
        </button>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <p className="whitespace-pre-wrap text-base leading-relaxed">{activeTask.prompt}</p>
          {activeTask.table && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    {activeTask.table.headers.map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeTask.table.rows.map((row, i) => (
                    <tr key={i} className="border-b">
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Write at least {activeTask.minWords} words.
          </p>
        </CardContent>
      </Card>

      <Textarea
        value={activeAnswer}
        onChange={(e) => setActiveAnswer(e.target.value)}
        placeholder={`Type your Task ${activeTab} answer here…`}
        className="min-h-[400px] font-serif text-base leading-relaxed"
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span
          className={
            activeWords < activeTask.minWords
              ? "text-amber-600 dark:text-amber-500"
              : "text-emerald-600 dark:text-emerald-500"
          }
        >
          Words: {activeWords} / {activeTask.minWords} min
          {activeWords < activeTask.minWords && " — below target"}
        </span>
        <span className="text-muted-foreground">
          Drafts are saved locally as you type.
        </span>
      </div>

      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <Button variant="outline" onClick={onExit}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Exit exam
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Trivial confirmation — drafts already saved live.
              const ok =
                typeof window === "undefined"
                  ? true
                  : window.confirm("Your draft is already auto-saved. Continue writing?");
              void ok;
            }}
          >
            Save draft
          </Button>
          {activeTab === 1 ? (
            <Button onClick={() => setActiveTab(2)}>
              Next: Task 2 →
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (
                  typeof window !== "undefined" &&
                  !window.confirm(
                    "Finish and submit both tasks for marking and feedback? You won't be able to edit after this.",
                  )
                )
                  return;
                void submit();
              }}
            >
              Finish &amp; Mark
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function VariantPicker({
  onPick,
  onExit,
  level,
}: {
  onPick: (v: WritingVariant) => void;
  onExit: () => void;
  level: string;
}) {
  const acadCount = IELTS_WRITING_PROMPTS.academic.length;
  const genCount = IELTS_WRITING_PROMPTS.general.length;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <button
        onClick={onExit}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="text-3xl font-bold tracking-tight">Choose your IELTS Writing test</h1>
      <p className="mt-2 text-muted-foreground">
        IELTS Writing is different for Academic and General Training. Pick the version that
        matches the exam you are preparing for ({level.toUpperCase()} level).
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => onPick("academic")}>
          <CardHeader>
            <CardTitle>IELTS Academic Writing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Task 1 = describe visual data (chart, table, graph). Task 2 = discursive essay.
              Best for university or professional registration.
            </p>
            <p className="text-xs text-muted-foreground">
              {acadCount} question set{acadCount === 1 ? "" : "s"} available.
            </p>
            <Button className="w-full">Start Academic Writing</Button>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => onPick("general")}>
          <CardHeader>
            <CardTitle>IELTS General Training Writing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Task 1 = write a letter (formal, semi-formal or informal). Task 2 = discursive essay.
              Best for migration or work in an English-speaking country.
            </p>
            <p className="text-xs text-muted-foreground">
              {genCount} question set{genCount === 1 ? "" : "s"} available.
            </p>
            <Button className="w-full">Start General Training Writing</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CriterionRow({ label, band }: { label: string; band: number }) {
  return (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-b-0">
      <span>{label}</span>
      <span className="font-mono font-semibold">Band {band.toFixed(1)}</span>
    </div>
  );
}

function CriterionDetail({ label, criterion }: { label: string; criterion: IeltsCriterion }) {
  return (
    <div className="border-b py-3 last:border-b-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="font-mono text-sm font-semibold">Band {criterion.band.toFixed(1)}</span>
      </div>
      {criterion.explanation && (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{criterion.explanation}</p>
      )}
    </div>
  );
}

function TaskScoreCard({
  title,
  words,
  task,
  band,
  task1Label,
  modelAnswerTitle,
  commonMistakesTitle,
}: {
  title: string;
  words: number;
  task: IeltsTaskFeedback;
  band: number;
  task1Label?: string;
  modelAnswerTitle: string;
  commonMistakesTitle: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="font-mono text-lg">Band {band.toFixed(1)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-xs text-muted-foreground">{words} words written</p>
        <CriterionDetail
          label={task1Label ?? "Task Response"}
          criterion={task.taskResponse}
        />
        <CriterionDetail label="Coherence & Cohesion" criterion={task.coherenceCohesion} />
        <CriterionDetail label="Lexical Resource" criterion={task.lexicalResource} />
        <CriterionDetail
          label="Grammatical Range & Accuracy"
          criterion={task.grammaticalRange}
        />
        {task.summary && (
          <p className="mt-3 rounded-md bg-muted/40 p-3 text-sm leading-relaxed">{task.summary}</p>
        )}

        {task.commonMistakes.length > 0 && (
          <Collapsible className="mt-3">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> {commonMistakesTitle}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 rounded-md border bg-muted/30 p-3">
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {task.commonMistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {task.modelAnswer && (
          <Collapsible className="mt-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> {modelAnswerTitle}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 rounded-md border bg-muted/30 p-3">
              <p className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                {task.modelAnswer}
              </p>
              <p className="mt-2 text-xs italic text-muted-foreground">
                Sample answer for practice reference. Many strong answers are possible.
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}

function BulletCard({
  title,
  items,
  icon,
  tone,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  tone: "good" | "improve" | "next";
}) {
  if (items.length === 0) return null;
  const toneClass =
    tone === "good"
      ? "border-emerald-500/30 bg-emerald-500/5"
      : tone === "improve"
        ? "border-amber-500/30 bg-amber-500/5"
        : "border-primary/30 bg-primary/5";
  return (
    <Card className={toneClass}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ResultsScreen({
  result,
  questionSet,
  variant,
  task1Answer,
  task2Answer,
  onRetry,
  onExit,
}: {
  result: IeltsMarkingResult;
  questionSet: WritingQuestionSet;
  variant: WritingVariant;
  task1Answer: string;
  task2Answer: string;
  onRetry: () => void;
  onExit: () => void;
}) {
  const t1Words = useMemo(() => countWords(task1Answer), [task1Answer]);
  const t2Words = useMemo(() => countWords(task2Answer), [task2Answer]);
  const task1Label = variant === "academic" ? "Task Achievement" : "Task Achievement";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Your Writing Practice is Complete</h1>
      <p className="mt-2 text-muted-foreground">
        You have completed your IELTS-style Writing practice test. Review your estimated practice
        band and the feedback below to plan what to work on next.
      </p>

      <Card className="my-6 border-primary/40 bg-primary/5">
        <CardContent className="py-6 text-center">
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Estimated IELTS Writing Band Score
          </p>
          <p className="mt-2 font-mono text-5xl font-bold">
            Band {result.overallBand.toFixed(1)} / 9
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            IELTS {variant === "academic" ? "Academic" : "General Training"} Writing · Task 2 weighted ×2
          </p>
          {result.overallFeedback && (
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed">
              {result.overallFeedback}
            </p>
          )}
        </CardContent>
      </Card>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your estimated band score is for practice and self-review only. Official IELTS Writing
          scores are awarded by trained IELTS examiners. UK Test Hub is not affiliated with IELTS,
          the British Council, IDP, Cambridge, or any official test provider.
        </AlertDescription>
      </Alert>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <BulletCard
          title="What went well"
          items={result.whatWentWell}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          tone="good"
        />
        <BulletCard
          title="What to improve"
          items={result.whatToImprove}
          icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
          tone="improve"
        />
        <BulletCard
          title="Recommended next steps"
          items={result.nextSteps}
          icon={<ListChecks className="h-4 w-4 text-primary" />}
          tone="next"
        />
      </div>

      {(result.whyThisScore || result.howToReachNextBand) && (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {result.whyThisScore && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Why this score?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{result.whyThisScore}</p>
              </CardContent>
            </Card>
          )}
          {result.howToReachNextBand && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">How to reach the next band</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{result.howToReachNextBand}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <TaskScoreCard
          title="Task 1"
          words={t1Words}
          task={result.task1}
          band={result.task1Band}
          task1Label={task1Label}
          modelAnswerTitle="View Task 1 model answer"
          commonMistakesTitle="Task 1 common mistakes"
        />
        <TaskScoreCard
          title="Task 2"
          words={t2Words}
          task={result.task2}
          band={result.task2Band}
          modelAnswerTitle="View Task 2 model answer"
          commonMistakesTitle="Task 2 common mistakes"
        />
      </div>

      <div className="mt-8 space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Task 1 — your answer</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t1Words} words</p>
          <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-sm">
            {questionSet.task1.prompt}
          </p>
          <Textarea
            readOnly
            value={task1Answer}
            className="mt-2 min-h-[200px] font-serif"
          />
        </section>
        <section>
          <h2 className="text-xl font-semibold">Task 2 — your answer</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t2Words} words</p>
          <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-sm">
            {questionSet.task2.prompt}
          </p>
          <Textarea
            readOnly
            value={task2Answer}
            className="mt-2 min-h-[200px] font-serif"
          />
        </section>
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button variant="outline" onClick={onExit}>
          Back to test page
        </Button>
        <Button onClick={onRetry}>Try another IELTS Writing exam</Button>
      </div>
    </div>
  );
}

