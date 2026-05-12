import { createFileRoute, redirect } from "@tanstack/react-router";

// Permanent (301) redirect to the new /blog/ URL.
export const Route = createFileRoute("/driving-theory-test-questions")({
  beforeLoad: () => {
    throw redirect({
      to: "/blog/driving-theory-test-questions",
      statusCode: 301,
    });
  },
});
