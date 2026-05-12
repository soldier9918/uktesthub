import { createFileRoute, redirect } from "@tanstack/react-router";

// Permanent (301) redirect to the new /blog/ URL.
export const Route = createFileRoute("/seru-test-practice")({
  beforeLoad: () => {
    throw redirect({
      to: "/blog/seru-test-practice",
      statusCode: 301,
    });
  },
});
