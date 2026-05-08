import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { invalidateOverrides, loadOverrides, type QuestionOverride } from "@/lib/overrides";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { ImagePicker } from "@/components/ImagePicker";

type SupportedType = "mcq" | "image_question" | "true_false" | "multiple_response";

const TYPE_LABEL: Record<SupportedType, string> = {
  mcq: "Multiple choice",
  image_question: "Image question",
  true_false: "True / False",
  multiple_response: "Multiple response",
};

function normaliseType(t: string | undefined | null): SupportedType {
  if (!t) return "mcq";
  const x = t.replace(/-/g, "_");
  if (x === "true_false") return "true_false";
  if (x === "multiple_response") return "multiple_response";
  if (x === "image_question") return "image_question";
  return "mcq";
}

type Props = {
  topic: string;
  questionId: string;
  defaults: {
    type?: string;
    question: string;
    options?: string[];
    correctAnswer?: number | number[] | boolean;
    correctAnswers?: number[];
    explanation?: string;
    image?: string;
    imageAlt?: string;
  };
  liveLink?: string;
  onClose: () => void;
  onSaved: () => void;
};

export function QuestionEditDialog({ topic, questionId, defaults, liveLink, onClose, onSaved }: Props) {
  const { user } = useAuth();
  const [existing, setExisting] = useState<QuestionOverride | null>(null);
  const [type, setType] = useState<SupportedType>(normaliseType(defaults.type));
  const [question, setQuestion] = useState(defaults.question);
  const [options, setOptions] = useState<string[]>(defaults.options ?? []);
  const [correct, setCorrect] = useState<number>(
    typeof defaults.correctAnswer === "number" ? defaults.correctAnswer : 0,
  );
  const [tfAnswer, setTfAnswer] = useState<boolean>(
    typeof defaults.correctAnswer === "boolean" ? defaults.correctAnswer : true,
  );
  const [multi, setMulti] = useState<number[]>(
    Array.isArray(defaults.correctAnswers)
      ? defaults.correctAnswers
      : Array.isArray(defaults.correctAnswer)
        ? (defaults.correctAnswer as number[])
        : [],
  );
  const [explanation, setExplanation] = useState(defaults.explanation ?? "");
  const [image, setImage] = useState<string>(defaults.image ?? "");
  const [imageAlt, setImageAlt] = useState<string>(defaults.imageAlt ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadOverrides().then((m) => {
      const o = m.get(`${topic}::${questionId}`);
      if (o) {
        setExisting(o);
        if (o.type) setType(normaliseType(o.type));
        if (o.question != null) setQuestion(o.question);
        if (Array.isArray(o.options)) setOptions(o.options);
        if (typeof o.correct_answer === "number") setCorrect(o.correct_answer);
        else if (typeof o.correct_answer === "boolean") setTfAnswer(o.correct_answer);
        else if (Array.isArray(o.correct_answer)) setMulti(o.correct_answer as number[]);
        if (o.explanation != null) setExplanation(o.explanation);
        if (o.image != null) setImage(o.image);
        if (o.image_alt != null) setImageAlt(o.image_alt);
      }
    });
  }, [topic, questionId]);

  const needsOptions = type === "mcq" || type === "image_question" || type === "multiple_response";
  const noAnswers = needsOptions && options.length === 0;

  const seedOptions = () => {
    setOptions(["", "", "", ""]);
    setCorrect(0);
    setMulti([]);
  };

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions([...options, ""]);
  };
  const removeOption = (i: number) => {
    if (options.length <= 2) return;
    const next = options.filter((_, j) => j !== i);
    setOptions(next);
    if (correct >= next.length) setCorrect(0);
    setMulti(multi.filter((m) => m !== i).map((m) => (m > i ? m - 1 : m)));
  };

  const changeType = (next: SupportedType) => {
    setType(next);
    if ((next === "mcq" || next === "image_question" || next === "multiple_response") && options.length < 2) {
      setOptions(["", "", "", ""]);
      setCorrect(0);
      setMulti([]);
    }
  };

  const upload = async (file: File) => {
    setBusy(true);
    setErr(null);
    const ext = file.name.split(".").pop() || "png";
    const path = `${topic}/${questionId}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("question-images")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      setBusy(false);
      return setErr(error.message);
    }
    const { data } = supabase.storage.from("question-images").getPublicUrl(path);
    setImage(data.publicUrl);
    setBusy(false);
  };

  const validate = (): string | null => {
    if (!question.trim()) return "Question text is required";
    if (type === "mcq" || type === "image_question") {
      if (options.length < 2) return "Add at least 2 options";
      if (options.some((o) => !o.trim())) return "All option texts must be filled";
      if (correct < 0 || correct >= options.length) return "Pick a correct answer";
    } else if (type === "multiple_response") {
      if (options.length < 2) return "Add at least 2 options";
      if (options.some((o) => !o.trim())) return "All option texts must be filled";
      if (multi.length === 0) return "Pick at least one correct answer";
    }
    return null;
  };

  const save = async () => {
    const v = validate();
    if (v) return setErr(v);
    setBusy(true);
    setErr(null);
    let correctAnswer: number | boolean | number[] | null = null;
    let optionsToSave: string[] | null = null;
    if (type === "mcq" || type === "image_question") {
      optionsToSave = options;
      correctAnswer = correct;
    } else if (type === "multiple_response") {
      optionsToSave = options;
      correctAnswer = multi.slice().sort((a, b) => a - b);
    } else if (type === "true_false") {
      correctAnswer = tfAnswer;
    }
    const payload = {
      topic,
      question_id: questionId,
      type,
      question,
      options: optionsToSave,
      correct_answer: correctAnswer,
      explanation: explanation || null,
      image: image || null,
      image_alt: imageAlt || null,
      updated_by: user?.id ?? null,
    };
    const { error } = await supabase
      .from("question_overrides")
      .upsert(payload, { onConflict: "topic,question_id" });
    setBusy(false);
    if (error) return setErr(error.message);
    invalidateOverrides();
    setSavedOk(true);
    onSaved();
  };

  const reset = async () => {
    if (!existing) return onClose();
    setBusy(true);
    const { error } = await supabase
      .from("question_overrides")
      .delete()
      .eq("topic", topic)
      .eq("question_id", questionId);
    setBusy(false);
    if (error) return setErr(error.message);
    invalidateOverrides();
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            Edit question {existing && <span className="text-xs text-emerald-700">(override active)</span>}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <p className="text-xs text-muted-foreground">{topic} · {questionId}</p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium">Question type</label>
            <select
              value={type}
              onChange={(e) => changeType(e.target.value as SupportedType)}
              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            >
              {(Object.keys(TYPE_LABEL) as SupportedType[]).map((t) => (
                <option key={t} value={t}>{TYPE_LABEL[t]}</option>
              ))}
            </select>
          </div>

          <label className="block text-sm font-medium">Question text</label>
          <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} />

          {noAnswers && (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">
              <p className="font-semibold text-amber-900">This question has no answers.</p>
              <p className="mt-1 text-amber-800">Add answer options below so it can be played in mocks.</p>
              <Button type="button" size="sm" className="mt-2" onClick={seedOptions}>
                Add 4 empty options
              </Button>
            </div>
          )}

          {(type === "mcq" || type === "image_question") && options.length > 0 && (
            <div>
              <label className="block text-sm font-medium">Options (select correct answer)</label>
              <div className="mt-1 space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={correct === i}
                      onChange={() => setCorrect(i)}
                    />
                    <span className="w-6 text-sm">{String.fromCharCode(65 + i)}.</span>
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const next = [...options];
                        next[i] = e.target.value;
                        setOptions(next);
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeOption(i)}
                      disabled={options.length <= 2}
                      title="Remove option"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                {options.length < 6 && (
                  <Button type="button" size="sm" variant="outline" onClick={addOption}>
                    + Add option
                  </Button>
                )}
              </div>
            </div>
          )}

          {type === "multiple_response" && options.length > 0 && (
            <div>
              <label className="block text-sm font-medium">Options (tick all correct answers)</label>
              <div className="mt-1 space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={multi.includes(i)}
                      onChange={(e) => {
                        if (e.target.checked) setMulti([...multi, i]);
                        else setMulti(multi.filter((m) => m !== i));
                      }}
                    />
                    <span className="w-6 text-sm">{String.fromCharCode(65 + i)}.</span>
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const next = [...options];
                        next[i] = e.target.value;
                        setOptions(next);
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeOption(i)}
                      disabled={options.length <= 2}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                {options.length < 6 && (
                  <Button type="button" size="sm" variant="outline" onClick={addOption}>
                    + Add option
                  </Button>
                )}
              </div>
            </div>
          )}

          {type === "true_false" && (
            <div>
              <label className="block text-sm font-medium">Correct answer</label>
              <div className="mt-1 flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={tfAnswer === true} onChange={() => setTfAnswer(true)} />
                  True
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={tfAnswer === false} onChange={() => setTfAnswer(false)} />
                  False
                </label>
              </div>
            </div>
          )}

          <label className="block text-sm font-medium">Explanation</label>
          <Textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2} />

          <div>
            <label className="block text-sm font-medium">Image</label>
            <div className="mt-1 flex items-center gap-3">
              {image && (
                <img src={image} alt="" className="h-24 w-24 rounded-md border border-border object-contain bg-white p-1" />
              )}
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL or browse/upload below"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPickerOpen(true)}
                  >
                    Browse images
                  </Button>
                </div>
                <Input
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Image alt text"
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="text-xs"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload(f);
                  }}
                />
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </div>

          {err && <p className="text-sm text-destructive">{err}</p>}
          {savedOk && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
              <p className="font-semibold text-emerald-800">Override saved.</p>
              <p className="mt-1 text-emerald-700">
                Browser/CDN caches may take a minute. Hard-refresh the live page to see the change.
              </p>
              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-semibold text-emerald-800 underline"
                >
                  Verify on live site →
                </a>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-2">
          <Button variant="ghost" onClick={reset} disabled={busy || !existing}>
            Reset to original
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={busy}>
              {savedOk ? "Close" : "Cancel"}
            </Button>
            {!savedOk && (
              <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save override"}</Button>
            )}
          </div>
        </div>
      </div>
      {pickerOpen && (
        <ImagePicker
          selected={image}
          onSelect={(p) => setImage(p)}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
