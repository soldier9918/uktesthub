import { createFileRoute, redirect } from "@tanstack/react-router";

// Permanent (301) redirect to the new /blog/ URL.
export const Route = createFileRoute("/sia-door-supervisor-mock-test")({
  beforeLoad: () => {
    throw redirect({
      to: "/blog/$slug",
      params: { slug: "sia-door-supervisor-mock-test" },
      statusCode: 301,
    });
  },
});
