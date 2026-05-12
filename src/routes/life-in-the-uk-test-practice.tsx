import { createFileRoute, redirect } from "@tanstack/react-router";

// Permanent (301) redirect to the new /blog/ URL.
export const Route = createFileRoute("/life-in-the-uk-test-practice")({
  beforeLoad: () => {
    throw redirect({
      to: "/blog/$slug",
      params: { slug: "life-in-the-uk-test-practice" },
      statusCode: 301,
    });
  },
});
