import { supabase } from "@/integrations/supabase/client";
import { trackGAEvent } from "./analytics-ga";

const SESSION_KEY = "uk-test-hub:session-id";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let s = sessionStorage.getItem(SESSION_KEY);
    if (!s) {
      s = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, s);
    }
    return s;
  } catch {
    return "no-storage";
  }
}

type EventType =
  | "page_view"
  | "quiz_start"
  | "quiz_complete"
  | "quiz_abandon"
  | "question_answered";

type EventInput = {
  event_type: EventType;
  topic_slug?: string | null;
  mock_slug?: string | null;
  question_id?: string | null;
  path?: string | null;
  metadata?: Record<string, unknown>;
};

/** Records an event. Best-effort, fire-and-forget. */
export async function trackEvent(input: EventInput) {
  if (typeof window === "undefined") return;
  // Mirror to GA4 (no-op when analytics consent is not granted).
  if (input.event_type !== "page_view") {
    trackGAEvent(input.event_type, {
      topic_slug: input.topic_slug ?? undefined,
      mock_slug: input.mock_slug ?? undefined,
      path: input.path ?? window.location.pathname,
    });
  }
  try {
    const { data: u } = await supabase.auth.getUser();
    await supabase.from("quiz_events").insert([{
      event_type: input.event_type,
      topic_slug: input.topic_slug ?? null,
      mock_slug: input.mock_slug ?? null,
      question_id: input.question_id ?? null,
      path: input.path ?? window.location.pathname,
      session_id: getSessionId(),
      user_id: u?.user?.id ?? null,
      metadata: (input.metadata ?? null) as never,
    }]);
  } catch {
    // ignore
  }
}
