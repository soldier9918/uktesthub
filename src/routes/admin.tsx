import { createFileRoute, notFound } from "@tanstack/react-router";

// /admin is not a real route — return a 404 to avoid disclosing any admin surface.
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  beforeLoad: () => {
    throw notFound();
  },
  component: () => null,
});
