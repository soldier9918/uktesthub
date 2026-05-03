import { createFileRoute, redirect } from "@tanstack/react-router";

// Old admin path is now a decoy — silently redirect to homepage.
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
