import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ListAdminUsersSchema = z.object({
  accessToken: z.string().min(20).max(4096),
});

export type AdminUserRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  subscription_tier: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  provider: string | null;
  is_admin: boolean;
  attempts: number;
  best_percent: number | null;
  topics: string[];
};

export const listAdminUsers = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ListAdminUsersSchema.parse(data))
  .handler(async ({ data }): Promise<{ users: AdminUserRow[]; error: string | null }> => {
    if (!data?.accessToken) return { users: [], error: "Unauthorized" };

    // Verify the caller's token and resolve their user id
    const { data: userRes, error: userErr } = await supabaseAdmin.auth.getUser(data.accessToken);
    if (userErr || !userRes?.user) return { users: [], error: "Unauthorized" };
    const userId = userRes.user.id;

    // Confirm admin role
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return { users: [], error: "Forbidden" };

    // Fetch all auth users (paginate up to 1000 for now)
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (authErr) return { users: [], error: authErr.message };

    const ids = authData.users.map((u) => u.id);

    const [profilesRes, rolesRes, attemptsRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("id,display_name,avatar_url,subscription_tier").in("id", ids),
      supabaseAdmin.from("user_roles").select("user_id,role").eq("role", "admin").in("user_id", ids),
      supabaseAdmin.from("quiz_attempts").select("user_id,percent,topic_slug").in("user_id", ids),
    ]);

    const profiles = new Map((profilesRes.data ?? []).map((p) => [p.id, p]));
    const adminSet = new Set((rolesRes.data ?? []).map((r) => r.user_id));
    const attemptsByUser = new Map<string, { count: number; best: number; topics: Set<string> }>();
    for (const a of attemptsRes.data ?? []) {
      const cur = attemptsByUser.get(a.user_id) ?? { count: 0, best: 0, topics: new Set<string>() };
      cur.count += 1;
      const pct = Number(a.percent ?? 0);
      if (pct > cur.best) cur.best = pct;
      if (a.topic_slug) cur.topics.add(a.topic_slug);
      attemptsByUser.set(a.user_id, cur);
    }

    const users: AdminUserRow[] = authData.users.map((u) => {
      const p = profiles.get(u.id);
      const stats = attemptsByUser.get(u.id);
      return {
        id: u.id,
        email: u.email ?? null,
        display_name: p?.display_name ?? null,
        avatar_url: p?.avatar_url ?? null,
        subscription_tier: p?.subscription_tier ?? "free",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        email_confirmed_at: u.email_confirmed_at ?? null,
        provider: u.app_metadata?.provider ?? null,
        is_admin: adminSet.has(u.id),
        attempts: stats?.count ?? 0,
        best_percent: stats ? Math.round(stats.best) : null,
        topics: stats ? [...stats.topics].sort() : [],
      };
    });

    users.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    return { users, error: null };
  });
