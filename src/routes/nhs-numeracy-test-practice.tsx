import { createFileRoute, redirect } from "@tanstack/react-router";

// Permanent (301) redirect to the new /blog/ URL.
export const Route = createFileRoute("/nhs-numeracy-test-practice")({
  beforeLoad: () => {
    throw redirect({
      to: "/blog/$slug",
      params: { slug: "nhs-numeracy-test-practice" },
      statusCode: 301,
    });
  },
});
