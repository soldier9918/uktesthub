import { createFileRoute } from "@tanstack/react-router";

const robotsTxt = `User-agent: *
Allow: /

Disallow: /account
Disallow: /dashboard
Disallow: /bookmarks
Disallow: /signin
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /admin
Disallow: /admin-kb20

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
