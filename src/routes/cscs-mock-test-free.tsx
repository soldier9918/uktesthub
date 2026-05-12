import { createFileRoute, redirect } from "@tanstack/react-router";

// Permanent (301) redirect to the new /blog/ URL.
export const Route = createFileRoute("/cscs-mock-test-free")({
  beforeLoad: () => {
    throw redirect({
      to: "/blog/cscs-mock-test-free",
      statusCode: 301,
    });
  },
});
