import { createFileRoute, redirect } from "@tanstack/react-router";

// Permanent (301) redirect to the new /blog/ URL.
export const Route = createFileRoute("/topographical-test-london")({
  beforeLoad: () => {
    throw redirect({
      to: "/blog/topographical-test-london",
      statusCode: 301,
    });
  },
});
