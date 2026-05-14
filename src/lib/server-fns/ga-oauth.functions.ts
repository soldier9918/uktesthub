import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { signOAuthState } from "./google-jwt.server";

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

async function requireAdmin(accessToken: string) {
  const { data: userRes, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !userRes?.user) throw new Error("Unauthorized");
  const { data: roleRow } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userRes.user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!roleRow) throw new Error("Forbidden");
  return userRes.user.id;
}

export const getGaConnectionStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ accessToken: z.string().min(20).max(4096) }).parse(d))
  .handler(async ({ data }) => {
    try {
      await requireAdmin(data.accessToken);
    } catch {
      return { connected: false, email: null as string | null };
    }
    const { data: row } = await supabaseAdmin
      .from("ga_oauth_tokens")
      .select("google_email, refresh_token")
      .eq("id", 1)
      .maybeSingle();
    return { connected: !!row?.refresh_token, email: row?.google_email ?? null };
  });

export const getGaOAuthStartUrl = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      accessToken: z.string().min(20).max(4096),
      origin: z.string().url(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const userId = await requireAdmin(data.accessToken);
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    if (!clientId) throw new Error("Missing GOOGLE_OAUTH_CLIENT_ID");
    const state = await signOAuthState(userId);
    const redirectUri = `${data.origin}/api/admin/ga-oauth/callback`;
    const url =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: SCOPE,
        access_type: "offline",
        prompt: "consent",
        include_granted_scopes: "true",
        state,
      }).toString();
    return { url };
  });

export const disconnectGaOAuth = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ accessToken: z.string().min(20).max(4096) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    await supabaseAdmin.from("ga_oauth_tokens").delete().eq("id", 1);
    return { ok: true };
  });
