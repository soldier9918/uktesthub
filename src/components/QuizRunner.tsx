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
  List,
  Volume2,
  VolumeX,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { sounds, useSoundMuted } from "@/lib/quiz-sounds";
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
import { getCategory, getTopicDisplayTitle } from "@/data/categories";
import { TOTAL_MOCKS_PER_TOPIC, buildRandomExamQuiz } from "@/data/mocks";
import { buildRandomEnglishExamQuiz } from "@/data/english/mocks";
import type { LevelSlug, SkillSlug, TestSlug } from "@/data/english/categories";
import { IeltsWritingExam } from "./IeltsWritingExam";
import { getMockIntro } from "@/data/mock-intros";
import { getPerMockIntro, getRelatedGuide } from "@/data/per-mock-intros";
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

type ExamConfig = {
  topicSlug: string;
  count: number;
  timeLimitSec: number;
  passMarkPct: number;
  passScore: number;
  title: string;
  description: string;
  heading: string;
  intro: string[];
  buttonLabel: string;
  passLabel?: string;
  timeLabel?: string;
  kind?: "topic" | "english";
  english?: { test: TestSlug; skill: SkillSlug; level: LevelSlug };
};

const EXAM_CONFIGS: Record<string, ExamConfig> = {
  "driving-theory": {
    topicSlug: "driving-theory",
    count: 50,
    timeLimitSec: 57 * 60,
    passMarkPct: 86,
    passScore: 43,
    title: "Driving Theory Exam",
    description:
      "Official-style practice — 50 unique questions, 57 minutes. Pass mark 43/50.",
    heading: "Driving Theory Exam Mode",
    intro: [
      "Get ready for a realistic UK Driving Theory Test practice exam. This exam mode is designed to feel like the real test, helping you practise under proper timed conditions before test day.",
      "You will answer 50 multiple-choice questions and have 57 minutes to complete the exam. To pass, you need to score at least 43 out of 50.",
      "This is a fresh exam every time, with questions randomly selected from our Driving Theory question bank, so you can keep practising and improving your score.",
    ],
    buttonLabel: "Start Driving Theory Exam",
  },
  "life-in-the-uk": {
    topicSlug: "life-in-the-uk",
    count: 24,
    timeLimitSec: 45 * 60,
    passMarkPct: 75,
    passScore: 18,
    title: "Life in the UK Exam",
    description:
      "Official-style practice — 24 unique questions, 45 minutes. Pass mark 18/24 (75%).",
    heading: "Life in the UK Exam Mode",
    intro: [
      "Practise with a realistic Life in the UK Test exam format before your official test day.",
      "You will answer 24 questions and have 45 minutes to complete the test. To pass, you need to score 75% or higher, which means getting at least 18 out of 24 questions correct.",
      "This exam mode is designed to help you practise under timed conditions, improve your confidence, and prepare for topics from the Life in the UK handbook, including British history, government, laws, values, traditions, and everyday life in the UK.",
    ],
    buttonLabel: "Start Life in the UK Exam",
  },
  seru: {
    topicSlug: "seru",
    count: 36,
    timeLimitSec: 45 * 60,
    passMarkPct: 60,
    passScore: 22,
    title: "SERU Exam",
    description:
      "TfL SERU-style assessment — 36 unique questions, 45 minutes. Pass mark 60%.",
    heading: "SERU Exam Mode",
    intro: [
      "Practise with a realistic TfL SERU assessment-style test for London private hire drivers.",
      "You will answer 36 questions under timed exam conditions. To pass, you need to score 60% or higher, which means getting at least 22 questions correct.",
      "This exam mode helps you prepare for key topics from the TfL Private Hire Driver Handbook, including passenger safety, safeguarding, equality, disability awareness, driver responsibilities, licensing rules, and professional conduct.",
    ],
    buttonLabel: "Start SERU Exam",
    passLabel: "60%",
    timeLabel: "Timed SERU-style practice",
  },
  "cscs-operative": {
    topicSlug: "cscs-operative",
    count: 50,
    timeLimitSec: 45 * 60,
    passMarkPct: 90,
    passScore: 45,
    title: "CSCS Operative Exam",
    description:
      "CITB HSE-style exam — 50 unique questions, 45 minutes. Pass mark 45/50.",
    heading: "CSCS Operative Exam Mode",
    intro: [
      "Practise with a realistic CSCS Operative Health, Safety and Environment test format before your real test.",
      "You will answer 50 multiple-choice questions and have 45 minutes to complete the exam. To pass, you need to score at least 45 out of 50.",
      "This exam mode is designed to help you practise under timed conditions and build confidence across key construction safety topics, including site hazards, working safely, health and welfare, high-risk activities, and environmental awareness.",
    ],
    buttonLabel: "Start CSCS Operative Exam",
  },
  "cscs-gold": {
    topicSlug: "cscs-gold",
    count: 50,
    timeLimitSec: 45 * 60,
    passMarkPct: 90,
    passScore: 45,
    title: "CSCS Gold Card Exam",
    description:
      "CITB HSE-style exam — 50 unique questions, 45 minutes. Pass mark 45/50.",
    heading: "CSCS Gold Card Exam Mode",
    intro: [
      "Practise with a realistic CSCS Gold Card Health, Safety and Environment test format before your real test.",
      "You will answer 50 multiple-choice questions and have 45 minutes to complete the exam. To pass, you need to score at least 45 out of 50.",
      "This exam mode is designed to help supervisors and skilled construction workers practise under timed conditions and build confidence across key construction safety topics, including site hazards, supervision, working safely, health and welfare, high-risk activities, and environmental awareness.",
    ],
    buttonLabel: "Start CSCS Gold Exam",
  },
  ielts: {
    topicSlug: "ielts",
    count: 40,
    timeLimitSec: 60 * 60,
    passMarkPct: 60,
    passScore: 24,
    title: "IELTS Exam",
    description:
      "Realistic IELTS-style English practice — 40 questions, 60 minutes. Band score 0–9.",
    heading: "IELTS Exam Mode",
    intro: [
      "Practise with a realistic IELTS-style English test designed to help you prepare for the real exam.",
      "IELTS tests your English skills across Listening, Reading, Writing and Speaking. In the real IELTS test, candidates complete Listening, Reading and Writing on the same day, while Speaking may be taken on the same day or within 7 days before or after the test.",
      "This exam mode helps you practise under timed conditions, improve your English exam technique, and build confidence before test day.",
      "IELTS test format includes: Listening — 40 questions, around 30 minutes; Reading — 40 questions, 60 minutes; Writing — 2 tasks, 60 minutes; Speaking — 3 parts, 11–14 minutes.",
      "IELTS does not have a fixed pass mark. Your result is given as a band score from 0 to 9, depending on your performance.",
    ],
    buttonLabel: "Start IELTS Exam Mode",
    passLabel: "Band 0–9 (no fixed pass mark)",
    timeLabel: "Timed IELTS-style practice",
  },
};

const IELTS_SKILL_LABEL: Record<string, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

const IELTS_SKILL_FORMAT: Record<
  string,
  { count: number; timeLimitSec: number; timeLabel: string }
> = {
  listening: { count: 40, timeLimitSec: 30 * 60, timeLabel: "40 questions · ~30 minutes" },
  reading: { count: 40, timeLimitSec: 60 * 60, timeLabel: "40 questions · 60 minutes" },
  writing: { count: 2, timeLimitSec: 60 * 60, timeLabel: "2 writing tasks · 60 minutes" },
  speaking: { count: 40, timeLimitSec: 14 * 60, timeLabel: "Timed IELTS Speaking-style practice" },
};

const IELTS_LEVELS = new Set(["a1", "a2", "b1", "b2", "c1", "c2"]);

function buildIeltsEnglishConfig(
  skill: string,
  level: string,
): ExamConfig | undefined {
  const fmt = IELTS_SKILL_FORMAT[skill];
  const skillLabel = IELTS_SKILL_LABEL[skill];
  if (!fmt || !skillLabel || !IELTS_LEVELS.has(level)) return undefined;
  const levelLabel = level.toUpperCase();
  const isWriting = skill === "writing";
  const intro = isWriting
    ? [
        "Practise with a realistic IELTS Writing test format before your real exam.",
        "You will complete 2 writing tasks in 60 minutes. We recommend spending around 20 minutes on Task 1 and 40 minutes on Task 2, just like the real IELTS test format.",
        "For Task 1, you will write at least 150 words. For Task 2, you will write at least 250 words.",
        "This mode helps you practise your timing, structure, grammar, vocabulary and written fluency for IELTS Academic or General Training.",
        "Writing Exam Mode includes: 2 writing tasks, 60 minutes, word count tracker, and IELTS-style self-check guidance with an AI-estimated band score on finish.",
      ]
    : [
        "Practise with a realistic IELTS-style English test designed to help you prepare for the real exam.",
        "IELTS tests your English skills across Listening, Reading, Writing and Speaking. In the real IELTS test, candidates complete Listening, Reading and Writing on the same day, while Speaking may be taken on the same day or within 7 days before or after the test.",
        "This exam mode helps you practise under timed conditions, improve your English exam technique, and build confidence before test day.",
        "IELTS test format includes: Listening — 40 questions, around 30 minutes; Reading — 40 questions, 60 minutes; Writing — 2 tasks, 60 minutes; Speaking — 3 parts, 11–14 minutes.",
        "IELTS does not have a fixed pass mark. Your result is given as a band score from 0 to 9, depending on your performance.",
      ];
  return {
    topicSlug: `ielts-${skill}-${level}`,
    count: fmt.count,
    timeLimitSec: fmt.timeLimitSec,
    passMarkPct: 60,
    passScore: Math.ceil(fmt.count * 0.6),
    title: isWriting
      ? `IELTS Writing ${levelLabel} Exam`
      : `IELTS ${skillLabel} ${levelLabel} Exam`,
    description: isWriting
      ? `IELTS Writing practice — 2 tasks, 60 minutes. Estimated band score 0–9 with AI feedback.`
      : `Realistic IELTS-style ${skillLabel} practice — ${fmt.count} questions. Band score 0–9.`,
    heading: `IELTS ${skillLabel} Exam Mode`,
    intro,
    buttonLabel: isWriting ? "Start IELTS Writing Exam" : "Start IELTS Exam Mode",
    passLabel: "Band 0–9 (no fixed pass mark)",
    timeLabel: fmt.timeLabel,
    kind: "english",
    english: {
      test: "ielts" as TestSlug,
      skill: skill as SkillSlug,
      level: level as LevelSlug,
    },
  };
}

function getExamConfig(topic: string): ExamConfig | undefined {
  const direct = EXAM_CONFIGS[topic];
  if (direct) return direct;
  const m = /^ielts-(listening|reading|writing|speaking)-(a1|a2|b1|b2|c1|c2)$/.exec(
    topic,
  );
  if (m) return buildIeltsEnglishConfig(m[1], m[2]);
  return undefined;
}


export function QuizRunner({ quiz: rawQuiz }: { quiz: Quiz }) {
  const overrides = useOverrides();
  const baseQuiz = useMemo(
    () => (overrides ? applyOverrides(rawQuiz, overrides) : rawQuiz),
    [rawQuiz, overrides],
  );
  // For Driving Theory, "Exam mode" swaps to a freshly randomised 50-question
  // exam (57 min, pass 43/50). All other topics + Practice mode keep the
  // original mock as-is.
  const [examOverride, setExamOverride] = useState<Quiz | null>(null);
  const quiz = examOverride ?? baseQuiz;
  const [mode, setMode] = useState<Mode | null>(null);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState<string | null>(null);
  const [examIntroShown, setExamIntroShown] = useState(false);
  const [writingActive, setWritingActive] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    Array(rawQuiz.questions.length).fill(null),
  );
  const [revealed, setRevealed] = useState<boolean[]>(
    Array(rawQuiz.questions.length).fill(false),
  );
  const [timeLeft, setTimeLeft] = useState(rawQuiz.timeLimit);
  const [finished, setFinished] = useState(false);

  // Re-initialise question state when the active quiz length / timeLimit
  // changes (e.g. user enters or leaves a 50-question Driving Theory exam).
  useEffect(() => {
    setCurrent(0);
    setAnswers(Array(quiz.questions.length).fill(null));
    setRevealed(Array(quiz.questions.length).fill(false));
    setTimeLeft(quiz.timeLimit);
    setFinished(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.slug, quiz.questions.length, quiz.timeLimit]);

  const examConfig = getExamConfig(baseQuiz.topic);

  async function handleSelectMode(m: Mode) {
    if (m === "exam" && examConfig) {
      setExamIntroShown(true);
      return;
    }
    setExamOverride(null);
    setMode(m);
  }

  async function handleStartExam() {
    if (!examConfig) return;
    // IELTS Writing uses a dedicated typed-answer flow with AI marking.
    if (examConfig.english?.skill === "writing") {
      setExamIntroShown(false);
      setWritingActive(true);
      return;
    }
    setExamLoading(true);
    setExamError(null);
    try {
      const opts = {
        count: examConfig.count,
        timeLimitSec: examConfig.timeLimitSec,
        passMarkPct: examConfig.passMarkPct,
        title: examConfig.title,
        description: examConfig.description,
      };
      const exam =
        examConfig.kind === "english" && examConfig.english
          ? await buildRandomEnglishExamQuiz(
              examConfig.english.test,
              examConfig.english.skill,
              examConfig.english.level,
              opts,
            )
          : await buildRandomExamQuiz(examConfig.topicSlug, opts);
      if (!exam) {
        setExamError("Couldn't load the exam questions. Please try again.");
        setExamLoading(false);
        return;
      }
      setExamOverride(exam);
    } catch {
      setExamError("Couldn't load the exam questions. Please try again.");
      setExamLoading(false);
      return;
    }
    setExamLoading(false);
    setExamIntroShown(false);
    setMode("exam");
  }


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

  // Always start a quiz fresh at question 1. If the user previously left a
  // quiz half way through, any saved progress is cleared on entry so they
  // restart from the beginning rather than resuming.
  useEffect(() => {
    if (!user) {
      setProgressLoaded(true);
      return;
    }
    let cancelled = false;
    supabase
      .from("quiz_progress")
      .delete()
      .eq("mock_slug", quiz.slug)
      .then(() => {
        if (!cancelled) setProgressLoaded(true);
      });
    return () => { cancelled = true; };
  }, [user, mode, quiz.slug]);


  // Debounced live save while quiz is in progress (practice mode only)
  useEffect(() => {
    if (!user || finished || mode !== "practice") return;
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
    sounds.fanfare(percent >= quiz.passMark);
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


  if (writingActive && examConfig?.english?.skill === "writing") {
    return (
      <IeltsWritingExam
        level={examConfig.english.level}
        onExit={() => {
          setWritingActive(false);
          setExamIntroShown(false);
          setMode(null);
        }}
      />
    );
  }

  if (examIntroShown && examConfig) {
    return (
      <ExamIntroScreen
        config={examConfig}
        onStart={handleStartExam}
        onBack={() => setExamIntroShown(false)}
        loading={examLoading}
        error={examError}
      />
    );
  }

  if (!mode)
    return (
      <ModeSelect
        quiz={baseQuiz}
        examConfig={examConfig}
        examLoading={examLoading}
        examError={examError}
        onSelect={handleSelectMode}
      />
    );

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
          setExamOverride(null);
          setExamIntroShown(false);
          // The reset useEffect re-initialises question state when the
          // active quiz switches back to the base mock.
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
    if (mode === "exam") sounds.click();
  };

  const reveal = (answerOverride?: Answer) => {
    if (mode !== "practice") return;
    const r = [...revealed];
    r[current] = true;
    setRevealed(r);
    const ans = answerOverride !== undefined ? answerOverride : answers[current] ?? null;
    if (isCorrect(q, ans)) sounds.correct();
    else sounds.wrong();
  };


  const goNext = () => {
    if (mode === "exam") sounds.next();
    if (current < quiz.questions.length - 1) setCurrent((c) => c + 1);
    else setFinished(true);
  };

  const showAdBreak = mode === "exam" && current > 0 && current % 4 === 0;




  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Question <span className="font-semibold text-foreground">{current + 1}</span> of{" "}
          {quiz.questions.length}
        </div>
        <div className="order-last w-full text-center text-sm font-bold text-foreground sm:order-none sm:w-auto sm:flex-1 sm:px-4">
          {getTopicDisplayTitle((quiz as { topicSlug?: string }).topicSlug ?? quiz.topic)}
        </div>
        <div className="flex items-center gap-3">
          <MuteToggle />
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
              reveal(i);
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
              reveal(i);
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
              reveal(i);
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
              reveal(id);
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
            {mode === "practice" && answered && !isRevealed && (
              <button
                onClick={() => reveal()}
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
            stateClass = "border-navy bg-navy/10";
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

function ModeSelect({
  quiz,
  examConfig,
  examLoading,
  examError,
  onSelect,
}: {
  quiz: Quiz;
  examConfig: ExamConfig | undefined;
  examLoading: boolean;
  examError: string | null;
  onSelect: (m: Mode) => void;
}) {
  const hasRealExam = Boolean(examConfig);
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
            disabled={examLoading}
            className="group cursor-pointer rounded-2xl border-2 border-[#15803d] bg-gradient-to-br from-[#22c55e] to-[#15803d] p-5 text-left text-white shadow-[0_6px_14px_-6px_rgba(34,197,94,0.7)] ring-1 ring-white/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="font-display text-lg font-semibold">Practice mode</div>
            <p className="mt-1 text-sm opacity-90">
              {hasRealExam
                ? `Work through this mock's ${quiz.questions.length} questions with instant feedback and explanations. No timer.`
                : "Instant feedback and explanations after every question. No timer."}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
              Start practice <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          <button
            onClick={() => onSelect("exam")}
            disabled={examLoading}
            className="group cursor-pointer rounded-2xl border-2 border-[#c81e2c] bg-gradient-to-br from-[#ff5a5f] to-[#c81e2c] p-5 text-left text-white shadow-[0_6px_14px_-6px_rgba(255,90,95,0.7)] ring-1 ring-white/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="font-display text-lg font-semibold">
              {examConfig ? "Exam mode — official-style practice" : "Exam mode"}
            </div>
            <p className="mt-1 text-sm opacity-90">
              {examConfig
                ? `${examConfig.count} unique random questions · ${Math.round(examConfig.timeLimitSec / 60)} minutes · Pass ${examConfig.passLabel ?? `${examConfig.passScore}/${examConfig.count}`}. Fresh set every time.`
                : "Timed practice that helps simulate test-day conditions. Results shown at the end with full review."}
            </p>
            {examConfig && (
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                <span className="rounded-full bg-white/15 px-2 py-0.5">{examConfig.count} Qs</span>
                <span className="rounded-full bg-white/15 px-2 py-0.5">{Math.round(examConfig.timeLimitSec / 60)} min</span>
                <span className="rounded-full bg-white/15 px-2 py-0.5">Pass {examConfig.passLabel ?? `${examConfig.passScore}/${examConfig.count}`}</span>
              </div>
            )}
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
              {examLoading ? "Loading exam…" : "Start exam"}
              {!examLoading && (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </span>
            {examError && (
              <p className="mt-2 rounded-lg bg-white/15 px-2 py-1 text-xs">{examError}</p>
            )}
          </button>
        </div>
      </div>


      {quiz.slug.includes("-mock-") && <MockStartIntro quiz={quiz} />}
    </div>
  );
}

function MockStartIntro({ quiz }: { quiz: Quiz }) {
  const intro = getMockIntro(quiz.topic, quiz.quizTitle);
  const mockMatch = /-mock-(\d+)$/.exec(quiz.slug);
  const mockNumber = mockMatch ? parseInt(mockMatch[1], 10) : null;
  const perMock = mockNumber ? getPerMockIntro(quiz.topic, mockNumber) : undefined;
  const relatedGuide = getRelatedGuide(quiz.topic);

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[MockStartIntro] lookup", {
      quizSlug: quiz.slug,
      resolvedTopicSlug: quiz.topic,
      mockNumber,
      perMockFound: Boolean(perMock),
      availablePerMockKeys: Object.keys(
        (await import("@/data/per-mock-intros")).PER_MOCK_INTROS ?? {},
      ),
    });
  }

  const difficultyClasses: Record<string, string> = {
    Beginner: "bg-[#15803d]/10 text-[#15803d] border-[#15803d]/30",
    Intermediate: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    "Exam-ready": "bg-[#c81e2c]/10 text-[#c81e2c] border-[#c81e2c]/30",
  };

  const aboutText = perMock?.covers ?? intro.description;
  const topics = perMock?.topicsIncluded?.length ? perMock.topicsIncluded : intro.topics;
  const whoForText = perMock?.whoFor ?? intro.whoFor;

  // Merge mock-specific FAQs (first) with topic-level FAQs, deduped by question.
  const mergedFaqs = (() => {
    const list: { q: string; a: string }[] = [];
    const seen = new Set<string>();
    for (const f of perMock?.faqs ?? []) {
      const k = f.q.trim().toLowerCase();
      if (!seen.has(k)) { seen.add(k); list.push(f); }
    }
    for (const f of intro.faqs ?? []) {
      const k = f.q.trim().toLowerCase();
      if (!seen.has(k)) { seen.add(k); list.push(f); }
    }
    return list;
  })();

  return (
    <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-xl font-bold md:text-2xl">About this mock</h2>
        {perMock && (
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              difficultyClasses[perMock.difficulty] ?? ""
            }`}
          >
            Difficulty: {perMock.difficulty}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-foreground md:text-base">
        {aboutText}
      </p>

      <div className="mt-6">
        <h3 className="font-display text-base font-semibold">Topics included</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground md:text-base">
          {topics.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      {perMock && perMock.commonMistakes.length > 0 && (
        <div className="mt-6">
          <h3 className="font-display text-base font-semibold">
            Common mistakes in this mock
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground md:text-base">
            {perMock.commonMistakes.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-display text-base font-semibold">Who this mock is for</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
          {whoForText}
        </p>
      </div>

      {relatedGuide && (
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
          <span className="font-semibold text-foreground">
            Related revision guide:
          </span>{" "}
          <a
            href={relatedGuide.href}
            className="text-coral underline-offset-2 hover:underline"
          >
            {relatedGuide.label}
          </a>{" "}
          — {relatedGuide.intro.replace(/^Read the [^—]+\s*/, "")}
        </p>
      )}

      <h2 className="mt-10 font-display text-xl font-bold md:text-2xl">How to practise</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#15803d]/30 bg-[#15803d]/5 p-4">
          <h3 className="font-display text-base font-semibold text-[#15803d]">
            How to use Practice mode
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            Practice mode shows the correct answer and an explanation after every question, with
            no timer. Use it the first time you sit a topic, when you want to learn as you go, or
            when you're targeting a specific weak area.
          </p>
        </div>
        <div className="rounded-2xl border border-[#c81e2c]/30 bg-[#c81e2c]/5 p-4">
          <h3 className="font-display text-base font-semibold text-[#c81e2c]">
            How to use Exam mode
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            Exam mode runs the full mock against the clock, hides explanations until the end, and
            shows your overall score at the end with a question-by-question review. Use it once
            you feel confident — it's timed exam-style practice for test-day familiarity.
          </p>
        </div>
      </div>

      {mergedFaqs.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-lg font-bold md:text-xl">Frequently asked questions</h3>
          <dl className="mt-3 space-y-4">
            {mergedFaqs.map((f) => (
              <div key={f.q} className="border-b border-border pb-4 last:border-b-0">
                <dt className="text-sm font-semibold text-foreground md:text-base">{f.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}

function ExamIntroScreen({
  config,
  onStart,
  onBack,
  loading,
  error,
}: {
  config: ExamConfig;
  onStart: () => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}) {
  const minutes = Math.round(config.timeLimitSec / 60);
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          {config.heading}
        </h1>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          {config.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-muted/30 p-5">
          <h2 className="font-display text-base font-semibold text-foreground">
            Exam Mode includes
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral/10 text-xs font-bold text-coral">
                {config.count}
              </span>
              <span>{config.count} questions</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral/10 text-xs font-bold text-coral">
                {minutes}
              </span>
              <span>{config.timeLabel ?? `${minutes} minutes`}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral/10 text-xs font-bold text-coral">
                {config.passScore}
              </span>
              <span>{config.passLabel ?? `${config.passScore}/${config.count} pass mark`}</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onBack}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={onStart}
            disabled={loading}
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-[#c81e2c] bg-gradient-to-br from-[#ff5a5f] to-[#c81e2c] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_14px_-6px_rgba(255,90,95,0.7)] ring-1 ring-white/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading exam…" : config.buttonLabel}
            {!loading && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
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
        <ResultsCtas quiz={quiz} onRetry={onRetry} />
      </div>

      <EnglishCefrCard quiz={quiz} answers={answers} score={score} percent={percent} />

      <NextStepsPanel quiz={quiz} />

      <div className="rounded-3xl border border-border bg-card p-4 shadow-soft md:p-6">
        <h3 className="font-display text-xl font-semibold">Review your answers</h3>
        <ol className="mt-4 space-y-3">
          {quiz.questions.map((q, i) => (
            <li key={q.id}>
              <ReviewCard q={q} a={answers[i]} index={i} />
            </li>
          ))}
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

// ---------- Exam-mode review card ----------

type ReviewOption = {
  label: string;
  isCorrect: boolean;
  isSelected: boolean;
};

function buildReviewOptions(q: Question, a: Answer): ReviewOption[] | null {
  if (isMcq(q) || isImage(q)) {
    const sel = typeof a === "number" ? a : -1;
    return q.options.map((label, idx) => ({
      label,
      isCorrect: idx === q.correctAnswer,
      isSelected: idx === sel,
    }));
  }
  if (isTrueFalse(q)) {
    const sel = typeof a === "number" ? a : -1;
    return ["True", "False"].map((label, idx) => ({
      label,
      isCorrect: (idx === 1) === q.correctAnswer,
      isSelected: idx === sel,
    }));
  }
  if (isMultiResponse(q)) {
    const sel = Array.isArray(a) ? (a as number[]) : [];
    const correctSet = new Set(q.correctAnswers);
    return q.options.map((label, idx) => ({
      label,
      isCorrect: correctSet.has(idx),
      isSelected: sel.includes(idx),
    }));
  }
  return null;
}

function statusFor(q: Question, a: Answer): {
  tone: "success" | "destructive" | "warning" | "muted";
  icon: typeof CheckCircle2;
  message: string;
} {
  const answered = isAnswered(q, a);
  const correct = isCorrect(q, a);
  if (!answered) {
    return {
      tone: "muted",
      icon: HelpCircle,
      message: "You did not answer this question. The correct answer is highlighted in green.",
    };
  }
  if (correct) {
    const msg = isMultiResponse(q)
      ? "You selected all the correct answers."
      : "You selected the correct answer.";
    return { tone: "success", icon: CheckCircle2, message: msg };
  }
  if (isMultiResponse(q)) {
    const sel = Array.isArray(a) ? (a as number[]) : [];
    const correctSet = new Set(q.correctAnswers);
    const anyCorrectPicked = sel.some((i) => correctSet.has(i));
    const anyWrongPicked = sel.some((i) => !correctSet.has(i));
    if (anyCorrectPicked && !anyWrongPicked) {
      return {
        tone: "warning",
        icon: AlertCircle,
        message: "You missed one or more correct answers. All correct answers are highlighted in green.",
      };
    }
  }
  return {
    tone: "destructive",
    icon: XCircle,
    message: "Your answer was incorrect. The correct answer is highlighted in green.",
  };
}

function OptionRow({
  letter,
  label,
  isCorrect,
  isSelected,
}: {
  letter?: string;
  label: string;
  isCorrect: boolean;
  isSelected: boolean;
}) {
  const wrongSelected = isSelected && !isCorrect;
  const base =
    "flex items-center gap-2.5 rounded-lg border p-2 md:p-2.5 transition-colors";
  const tone = isCorrect
    ? "border-success bg-success/10"
    : wrongSelected
      ? "border-destructive bg-destructive/10"
      : "border-border bg-background";
  const chipTone = isCorrect
    ? "bg-success text-success-foreground"
    : wrongSelected
      ? "bg-destructive text-destructive-foreground"
      : "bg-muted text-muted-foreground";
  return (
    <div className={`${base} ${tone}`}>
      {letter && (
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${chipTone}`}
        >
          {letter}
        </span>
      )}
      <span className="flex-1 text-sm leading-snug">{label}</span>
      <div className="flex shrink-0 flex-row items-center gap-2">
        {isSelected && (
          <span
            className={`rounded-full px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide ${
              isCorrect
                ? "bg-success/20 text-success"
                : "bg-destructive/20 text-destructive"
            }`}
          >
            Your answer
          </span>
        )}
        {isCorrect && <CheckCircle2 className="h-4 w-4 text-success" />}
        {wrongSelected && <XCircle className="h-4 w-4 text-destructive" />}
      </div>
    </div>
  );
}

function ReviewCard({ q, a, index }: { q: Question; a: Answer; index: number }) {
  const answered = isAnswered(q, a);
  const correct = isCorrect(q, a);
  const status = statusFor(q, a);

  const headerTone = !answered
    ? "border-muted-foreground/30 bg-muted/30"
    : correct
      ? "border-success/30 bg-success/5"
      : "border-destructive/30 bg-destructive/5";

  const badgeTone = !answered
    ? "bg-muted text-muted-foreground"
    : correct
      ? "bg-success text-success-foreground"
      : "bg-destructive text-destructive-foreground";

  const badgeText = !answered ? "Not answered" : correct ? "Correct" : "Incorrect";
  const BadgeIcon = !answered ? HelpCircle : correct ? CheckCircle2 : XCircle;

  const standardOptions = buildReviewOptions(q, a);

  const statusToneClass =
    status.tone === "success"
      ? "border-success/30 bg-success/10 text-success"
      : status.tone === "destructive"
        ? "border-destructive/30 bg-destructive/10 text-destructive"
        : status.tone === "warning"
          ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
          : "border-border bg-muted/40 text-muted-foreground";

  return (
    <div className={`rounded-xl border p-3 md:p-4 ${headerTone}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Question {index + 1}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeTone}`}
        >
          <BadgeIcon className="h-3 w-3" />
          {badgeText}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold leading-snug text-foreground md:text-base">
        {describeQuestion(q)}
      </p>

      <div className="mt-3 space-y-1.5">
        {standardOptions ? (
          standardOptions.map((opt, idx) => (
            <OptionRow
              key={idx}
              letter={String.fromCharCode(65 + idx)}
              label={opt.label}
              isCorrect={opt.isCorrect}
              isSelected={opt.isSelected}
            />
          ))
        ) : (
          <FallbackReview q={q} a={a} />
        )}
      </div>

      <div
        className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs font-medium md:text-sm ${statusToneClass}`}
      >
        <status.icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>{status.message}</span>
      </div>

      {q.explanation && (
        <div className="mt-2 rounded-lg border border-border bg-muted/40 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Explanation
          </div>
          <p className="mt-1 text-xs leading-relaxed text-foreground md:text-sm">{q.explanation}</p>
        </div>
      )}
    </div>
  );
}

function FallbackReview({ q, a }: { q: Question; a: Answer }) {
  // Fill-blanks / drag-drop / numeric / hot-spot
  if (isFillBlanks(q) || isDragDrop(q)) {
    const userArr = Array.isArray(a) ? (a as number[]) : [];
    return (
      <div className="space-y-1.5">
        {q.blanks.map((b, i) => {
          const userIdx = userArr[i] ?? -1;
          const userAnswered = userIdx >= 0;
          const isRight = userIdx === b.correctIndex;
          return (
            <div key={i} className="space-y-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Blank {i + 1}
              </div>
              <OptionRow
                label={b.options[b.correctIndex]}
                isCorrect={true}
                isSelected={userAnswered && isRight}
              />
              {userAnswered && !isRight && (
                <OptionRow
                  label={b.options[userIdx]}
                  isCorrect={false}
                  isSelected={true}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
  if (isNumeric(q)) {
    const correctLabel = `${q.correctAnswer}${q.unit ? ` ${q.unit}` : ""}`;
    const userAnswered = typeof a === "string" && a.trim() !== "";
    const right = isCorrect(q, a);
    return (
      <div className="space-y-2">
        <OptionRow label={correctLabel} isCorrect={true} isSelected={userAnswered && right} />
        {userAnswered && !right && (
          <OptionRow label={a as string} isCorrect={false} isSelected={true} />
        )}
      </div>
    );
  }
  if (isHotSpot(q)) {
    const correctSpot = q.spots.find((s) => s.id === q.correctSpotId);
    const correctLabel = correctSpot?.label ?? q.correctSpotId;
    const userAnswered = typeof a === "string" && a.length > 0;
    const right = a === q.correctSpotId;
    const userLabel = userAnswered
      ? q.spots.find((s) => s.id === a)?.label ?? (a === "__miss__" ? "Outside any region" : (a as string))
      : "";
    return (
      <div className="space-y-2">
        <OptionRow label={correctLabel} isCorrect={true} isSelected={userAnswered && right} />
        {userAnswered && !right && (
          <OptionRow label={userLabel} isCorrect={false} isSelected={true} />
        )}
      </div>
    );
  }
  return null;
}



function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function parseMockNumber(slug: string): { topicSlug: string; mockNumber: number | null } {
  const match = /-mock-(\d+)$/.exec(slug);
  if (!match) return { topicSlug: slug, mockNumber: null };
  return {
    topicSlug: slug.replace(/-mock-\d+$/, ""),
    mockNumber: parseInt(match[1], 10),
  };
}

function ResultsCtas({ quiz, onRetry }: { quiz: Quiz; onRetry: () => void }) {
  const fallbackTopic =
    (quiz as { topic?: string }).topic ?? parseMockNumber(quiz.slug).topicSlug;
  const { mockNumber } = parseMockNumber(quiz.slug);
  const nextNum =
    mockNumber && mockNumber < TOTAL_MOCKS_PER_TOPIC ? mockNumber + 1 : null;
  const nextSlug = nextNum ? `${fallbackTopic}-mock-${nextNum}` : null;

  return (
    <div className="mt-7 flex flex-wrap justify-center gap-3">
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-muted"
      >
        <RotateCcw className="h-4 w-4" /> Retake test
      </button>
      <Link
        to="/topic/$slug"
        params={{ slug: fallbackTopic }}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-muted"
      >
        <List className="h-4 w-4" /> All mock tests
      </Link>
      {nextSlug && (
        <Link
          to="/quiz/$slug"
          params={{ slug: nextSlug }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-coral px-5 py-2.5 text-sm font-semibold text-coral-foreground shadow-coral"
        >
          Next mock test (Mock {nextNum}) <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function MuteToggle() {
  const [muted, toggle] = useSoundMuted();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      title={muted ? "Unmute sounds" : "Mute sounds"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}

function NextStepsPanel({ quiz }: { quiz: Quiz }) {
  const fallbackTopic =
    (quiz as { topic?: string }).topic ?? parseMockNumber(quiz.slug).topicSlug;
  const category = getCategory(quiz.category);
  const related =
    category?.topics.filter((t) => t.slug !== fallbackTopic).slice(0, 6) ?? [];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold">Keep going</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Lock in what you've learned with the topic guide and the next mock.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            to="/guide/$slug"
            params={{ slug: fallbackTopic }}
            className="inline-flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            Read the study guide <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/topic/$slug"
            params={{ slug: fallbackTopic }}
            className="inline-flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            All 45 mocks for this topic <ArrowRight className="h-4 w-4" />
          </Link>
          {category && (
            <Link
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="inline-flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted"
            >
              {category.title} category <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-display text-lg font-semibold">Related practice tests</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Other tests in {category?.title ?? "this category"} students often try next.
          </p>
          <ul className="mt-4 space-y-2">
            {related.map((t) => (
              <li key={t.slug}>
                <Link
                  to="/topic/$slug"
                  params={{ slug: t.slug }}
                  className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  <span>{t.title}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================
// English CEFR result card — shown after English mock tests
// ============================================================

const CEFR_ORDER = ["a1", "a2", "b1", "b2", "c1", "c2"] as const;
type CefrLevel = (typeof CEFR_ORDER)[number];

const CEFR_GRADIENT: Record<CefrLevel, string> = {
  a1: "bg-[linear-gradient(140deg,oklch(0.68_0.14_220)_0%,oklch(0.48_0.14_225)_55%,oklch(0.28_0.11_230)_100%)]",
  a2: "bg-[linear-gradient(140deg,oklch(0.38_0.18_260)_0%,oklch(0.25_0.15_262)_55%,oklch(0.14_0.10_265)_100%)]",
  b1: "bg-[linear-gradient(140deg,oklch(0.42_0.20_320)_0%,oklch(0.30_0.17_330)_55%,oklch(0.20_0.13_345)_100%)]",
  b2: "bg-[linear-gradient(140deg,oklch(0.72_0.17_75)_0%,oklch(0.55_0.17_60)_55%,oklch(0.36_0.14_50)_100%)]",
  c1: "bg-[linear-gradient(140deg,oklch(0.56_0.20_45)_0%,oklch(0.40_0.18_38)_55%,oklch(0.24_0.13_32)_100%)]",
  c2: "bg-[linear-gradient(140deg,oklch(0.34_0.20_22)_0%,oklch(0.22_0.16_18)_55%,oklch(0.12_0.11_15)_100%)]",
};

const CEFR_LABEL: Record<CefrLevel, string> = {
  a1: "A1 — Beginner",
  a2: "A2 — Elementary",
  b1: "B1 — Intermediate",
  b2: "B2 — Upper-Intermediate",
  c1: "C1 — Advanced",
  c2: "C2 — Proficient",
};

const CEFR_BLURB: Record<CefrLevel, string> = {
  a1: "You can understand and use simple, everyday words and phrases.",
  a2: "You can handle short, routine exchanges about familiar topics.",
  b1: "You can deal with most situations on familiar matters and express opinions.",
  b2: "You can interact fluently and write clear, detailed text on a wide range of topics.",
  c1: "You can use English flexibly and effectively for academic, social and professional purposes.",
  c2: "You can understand virtually everything you read or hear and express yourself precisely.",
};

const TYPE_LABEL: Record<string, string> = {
  mcq: "Multiple choice",
  "true-false": "True / False",
  "fill-blanks": "Fill the blanks",
  "dropdown-blanks": "Dropdown blanks",
  "multiple-response": "Multiple response",
};

function parseEnglishSlug(
  slug: string,
): { test: string; skill: string; level: CefrLevel; mockNumber: number } | null {
  // english-{test}-{skill}-{level}-mock-{n}
  const m = /^english-([a-z]+)-([a-z-]+)-(a1|a2|b1|b2|c1|c2)-mock-(\d+)$/.exec(slug);
  if (!m) return null;
  return {
    test: m[1],
    skill: m[2],
    level: m[3] as CefrLevel,
    mockNumber: parseInt(m[4], 10),
  };
}

function EnglishCefrCard({
  quiz,
  answers,
  score,
  percent,
}: {
  quiz: Quiz;
  answers: Answer[];
  score: number;
  percent: number;
}) {
  const parsed = parseEnglishSlug(quiz.slug);
  if (!parsed) return null;
  const { test, skill, level, mockNumber } = parsed;

  // Per-type breakdown
  const breakdown = new Map<string, { correct: number; total: number }>();
  quiz.questions.forEach((q, i) => {
    const t = q.type ?? "mcq";
    const cur = breakdown.get(t) ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (isCorrect(q, answers[i])) cur.correct += 1;
    breakdown.set(t, cur);
  });

  // Estimate level
  const idx = CEFR_ORDER.indexOf(level);
  let estimated: CefrLevel = level;
  let nextStepLabel = "";
  let nextLevelForLink: CefrLevel | null = null;

  if (percent >= 85 && idx < CEFR_ORDER.length - 1) {
    estimated = CEFR_ORDER[idx + 1];
    nextLevelForLink = CEFR_ORDER[idx + 1];
    nextStepLabel = `Strong result — you're ready to try ${CEFR_LABEL[nextLevelForLink].split(" — ")[0]}.`;
  } else if (percent >= 60) {
    estimated = level;
    nextStepLabel = `Solid effort — keep practising at ${CEFR_LABEL[level].split(" — ")[0]} to lock it in.`;
  } else if (idx > 0) {
    estimated = CEFR_ORDER[idx - 1];
    nextLevelForLink = CEFR_ORDER[idx - 1];
    nextStepLabel = `Try ${CEFR_LABEL[nextLevelForLink].split(" — ")[0]} first to build confidence.`;
  } else {
    estimated = level;
    nextStepLabel = "Keep practising at A1 — small steps every day make a big difference.";
  }

  const nextMockNum = mockNumber < 45 ? mockNumber + 1 : null;

  return (
    <section
      className={`overflow-hidden rounded-3xl border border-white/10 p-6 text-white shadow-elevated md:p-8 ${CEFR_GRADIENT[estimated]}`}
      aria-label="Estimated English level"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Your estimated English level
          </p>
          <h3 className="mt-2 font-display text-4xl font-bold md:text-5xl">
            {CEFR_LABEL[estimated]}
          </h3>
          <p className="mt-2 max-w-xl text-sm text-white/85 md:text-base">
            {CEFR_BLURB[estimated]}
          </p>
        </div>
        <div className="rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/75">
            This mock
          </div>
          <div className="mt-1 font-display text-3xl font-bold">
            {score} / {quiz.questions.length}
          </div>
          <div className="text-sm text-white/80">{percent}%</div>
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-white/90">{nextStepLabel}</p>

      {breakdown.size > 0 && (
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from(breakdown.entries()).map(([type, v]) => {
            const pct = Math.round((v.correct / v.total) * 100);
            return (
              <div
                key={type}
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm backdrop-blur-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white">
                    {TYPE_LABEL[type] ?? type}
                  </span>
                  <span className="text-white/85">
                    {v.correct}/{v.total}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {nextLevelForLink && (
          <Link
            to="/english-language-tests/$test/$skill/$level"
            params={{ test, skill, level: nextLevelForLink }}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-foreground shadow hover:bg-white/90"
          >
            Practise {CEFR_LABEL[nextLevelForLink].split(" — ")[0]}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        {nextMockNum && (
          <Link
            to="/english-language-tests/$test/$skill/$level/mock-test{-$num}"
            params={{ test, skill, level, num: String(nextMockNum) }}
            className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            Try Mock {nextMockNum}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        <Link
          to="/english-language-tests/$test/$skill/$level"
          params={{ test, skill, level }}
          className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-transparent px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          All {CEFR_LABEL[level].split(" — ")[0]} mocks
        </Link>
      </div>

      <p className="mt-5 text-xs text-white/65">
        Estimated level based on this mock — not an official CEFR assessment.
      </p>
    </section>
  );
}
