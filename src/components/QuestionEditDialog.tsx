import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { invalidateOverrides, loadOverrides, type QuestionOverride } from "@/lib/overrides";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";

type Props = {
  topic: string;
  questionId: string;
  defaults: {
    question: string;
    options?: string[];
    correctAnswer?: number | number[] | boolean;
    explanation?: string;
    image?: string;
    imageAlt?: string;
  };
  /** Optional deep link to verify on the live site (e.g. /quiz/foo-mock-25#q5). */
  liveLink?: string;
  onClose: () => void;
  onSaved: () => void;
};

export function QuestionEditDialog({ topic, questionId, defaults, liveLink, onClose, onSaved }: Props) {
  const { user } = useAuth();
  const [existing, setExisting] = useState<QuestionOverride | null>(null);
  const [question, setQuestion] = useState(defaults.question);
  const [options, setOptions] = useState<string[]>(defaults.options ?? []);
  const [correct, setCorrect] = useState<number>(
    typeof defaults.correctAnswer === "number" ? defaults.correctAnswer : 0,
  );
  const [explanation, setExplanation] = useState(defaults.explanation ?? "");
  const [image, setImage] = useState<string>(defaults.image ?? "");
  const [imageAlt, setImageAlt] = useState<string>(defaults.imageAlt ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadOverrides().then((m) => {
      const o = m.get(`${topic}::${questionId}`);
      if (o) {
        setExisting(o);
        if (o.question != null) setQuestion(o.question);
        if (Array.isArray(o.options)) setOptions(o.options);
        if (typeof o.correct_answer === "number") setCorrect(o.correct_answer);
        if (o.explanation != null) setExplanation(o.explanation);
        if (o.image != null) setImage(o.image);
        if (o.image_alt != null) setImageAlt(o.image_alt);
      }
    });
  }, [topic, questionId]);

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

  const save = async () => {
    setBusy(true);
    setErr(null);
    const payload = {
      topic,
      question_id: questionId,
      question,
      options: options.length ? options : null,
      correct_answer: options.length ? correct : null,
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
          <label className="block text-sm font-medium">Question text</label>
          <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} />

          {options.length > 0 && (
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
                  </div>
                ))}
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
                <Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL or upload below"
                />
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
    </div>
  );
}
