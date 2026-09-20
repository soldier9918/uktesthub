import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { listPurchasableTopics } from "@/lib/subscription/topics";

type Props = {
  value: string | null;
  onChange: (slug: string) => void;
  label?: string;
};

/** Searchable list of the test topics an Exam Pro subscription can unlock. */
export function TopicPicker({ value, onChange, label = "Choose your test topic" }: Props) {
  const [query, setQuery] = useState("");
  const topics = useMemo(() => listPurchasableTopics(), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (t) => t.title.toLowerCase().includes(q) || t.group.toLowerCase().includes(q),
    );
  }, [query, topics]);

  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <Input
        className="mt-2"
        placeholder="Search test topics…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-border">
        {filtered.length === 0 && (
          <p className="px-3 py-4 text-sm text-muted-foreground">No test topics match that search.</p>
        )}
        {filtered.map((topic) => (
          <button
            key={topic.slug}
            type="button"
            onClick={() => onChange(topic.slug)}
            className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors ${
              value === topic.slug
                ? "bg-coral/10 font-bold text-coral"
                : "hover:bg-muted/60"
            }`}
          >
            <span>{topic.title}</span>
            <span className="text-xs text-muted-foreground">{topic.group}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
