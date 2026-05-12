import { createFileRoute, redirect } from "@tanstack/react-router";

// Permanent (301) redirect to the new /blog/ URL.
export const Route = createFileRoute("/uk-road-signs-test")({
  beforeLoad: () => {
    throw redirect({
      to: "/blog/$slug",
      params: { slug: "uk-road-signs-test" },
      statusCode: 301,
    });
  },
});
