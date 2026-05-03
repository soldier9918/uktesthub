import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getRecentServerLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) return { logs: [], error: "Forbidden" as string | null };
    const { data, error } = await supabase
      .from("runtime_logs")
      .select("id,level,message,context,created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return { logs: [], error: error.message };
    return { logs: data ?? [], error: null as string | null };
  });
