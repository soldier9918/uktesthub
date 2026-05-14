import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyOAuthState } from "@/lib/server-fns/google-jwt.server";

export const Route = createFileRoute("/api/admin/ga-oauth/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const err = url.searchParams.get("error");
        if (err) return html(`OAuth error: ${escape(err)}`);
        if (!code || !state) return html("Missing code or state.");

        const verified = await verifyOAuthState(state);
        if (!verified) return html("Invalid or expired state.");

        const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
        if (!clientId || !clientSecret) return html("Server is missing Google OAuth credentials.");

        const redirectUri = `${url.origin}/api/admin/ga-oauth/callback`;
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
          }).toString(),
        });
        if (!tokenRes.ok) {
          const t = await tokenRes.text();
          return html(`Token exchange failed: ${escape(t.slice(0, 400))}`);
        }
        const tokenJson = (await tokenRes.json()) as {
          refresh_token?: string;
          access_token: string;
          scope?: string;
        };
        if (!tokenJson.refresh_token) {
          return html(
            "Google did not return a refresh token. Revoke this app's access at https://myaccount.google.com/permissions and try connecting again.",
          );
        }

        // Fetch the Google account email for display
        let email: string | null = null;
        try {
          const ui = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenJson.access_token}` },
          });
          if (ui.ok) email = ((await ui.json()) as { email?: string }).email ?? null;
        } catch {
          /* ignore */
        }

        const { error: upErr } = await supabaseAdmin.from("ga_oauth_tokens").upsert({
          id: 1,
          refresh_token: tokenJson.refresh_token,
          scope: tokenJson.scope ?? null,
          google_email: email,
          updated_by: verified.userId,
          updated_at: new Date().toISOString(),
        });
        if (upErr) return html(`Failed to save token: ${escape(upErr.message)}`);

        return new Response(
          `<html><body style="font-family:system-ui;padding:2rem;text-align:center">
            <h1>Google Analytics connected</h1>
            <p>You can close this tab and return to the dashboard.</p>
            <script>setTimeout(function(){location.href="/admin-kb20/ga-analytics"},1500)</script>
          </body></html>`,
          { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
        );
      },
    },
  },
});

function html(msg: string) {
  return new Response(
    `<html><body style="font-family:system-ui;padding:2rem"><h1>Google Analytics</h1><p>${msg}</p><p><a href="/admin-kb20/ga-analytics">Back to dashboard</a></p></body></html>`,
    { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
