import { createFileRoute } from "@tanstack/react-router";

const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://www.uktesthub.com/sitemap.xml`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(robotsTxt, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
