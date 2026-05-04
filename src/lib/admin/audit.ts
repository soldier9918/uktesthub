import { supabase } from "@/integrations/supabase/client";

/** Records an admin action. Best-effort; never throws. */
export async function logAdminAction(
  action: string,
  target?: string,
  detail?: Record<string, unknown>,
) {
  try {
    const { data: u } = await supabase.auth.getUser();
    await supabase.from("admin_audit_log").insert([{
      actor_user_id: u?.user?.id ?? null,
      actor_email: u?.user?.email ?? null,
      action,
      target: target ?? null,
      detail: (detail ?? null) as never,
    }]);
  } catch {
    // ignore
  }
}
