## Plan

1. Update the Google button behavior on **Sign up** and **Sign in** to use the Cloud Google OAuth flow instead of the current direct auth client call.
2. Keep email/password signup and signin unchanged.
3. Route successful Google auth back to the app/dashboard using the existing redirect behavior.
4. Show the existing inline error message if Google sign-in fails.
5. Verify there are no remaining direct Google OAuth calls in the signup/signin pages.

## Technical detail

- Replace `supabase.auth.signInWithOAuth({ provider: "google" })` in `src/routes/signup.tsx` and `src/routes/signin.tsx` with the generated Cloud OAuth helper call.
- This requires the auth integration module to exist; if it is missing, run the social auth configuration step first, then import the helper.
- Do not change email/password auth, page layout, or backend tables.