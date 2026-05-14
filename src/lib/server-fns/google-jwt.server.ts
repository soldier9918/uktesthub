// Server-only helper: mints a Google OAuth2 access token using a refresh
// token previously stored via the OAuth flow (see ga-oauth.* routes).
import { supabaseAdmin } from "@/integrations/supabase/client.server";

let cached: { token: string; expiresAt: number } | null = null;

export async function getGoogleAccessToken(_scope: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.expiresAt - 60 > now) return cached.token;

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_OAUTH_CLIENT_ID or GOOGLE_OAUTH_CLIENT_SECRET");
  }

  const { data: row, error } = await supabaseAdmin
    .from("ga_oauth_tokens")
    .select("refresh_token")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(`Failed to load OAuth token: ${error.message}`);
  if (!row?.refresh_token) {
    throw new Error("NOT_CONNECTED: Google Analytics is not connected. Click 'Connect Google Analytics' to authorize.");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: row.refresh_token,
      grant_type: "refresh_token",
    }).toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token refresh failed: ${res.status} ${text}`);
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: json.access_token, expiresAt: now + json.expires_in };
  return json.access_token;
}

// HMAC-SHA256 signed state for OAuth round-trip (browser → Google → callback).
async function hmacKey(): Promise<CryptoKey> {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}
function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function b64urlDecode(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function signOAuthState(userId: string): Promise<string> {
  const payload = `${userId}.${Math.floor(Date.now() / 1000)}`;
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${b64url(new TextEncoder().encode(payload))}.${b64url(sig)}`;
}

export async function verifyOAuthState(state: string): Promise<{ userId: string } | null> {
  const [pB64, sigB64] = state.split(".");
  if (!pB64 || !sigB64) return null;
  const payload = new TextDecoder().decode(b64urlDecode(pB64));
  const key = await hmacKey();
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    b64urlDecode(sigB64).buffer as ArrayBuffer,
    new TextEncoder().encode(payload),
  );
  if (!ok) return null;
  const [userId, tsStr] = payload.split(".");
  const ts = Number(tsStr);
  if (!userId || !ts) return null;
  if (Math.floor(Date.now() / 1000) - ts > 600) return null; // 10 min
  return { userId };
}
