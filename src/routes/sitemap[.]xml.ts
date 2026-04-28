import { createFileRoute } from "@tanstack/react-router";

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.uktesthub.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.uktesthub.com/category/driving</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.uktesthub.com/category/citizenship</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.uktesthub.com/category/english</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.uktesthub.com/category/education</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.uktesthub.com/category/career</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.uktesthub.com/category/professional</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.uktesthub.com/category/nhs</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.uktesthub.com/category/fun</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.uktesthub.com/about</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.uktesthub.com/contact</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.uktesthub.com/faq</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.uktesthub.com/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://www.uktesthub.com/cookies</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://www.uktesthub.com/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://www.uktesthub.com/disclaimer</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://www.uktesthub.com/accessibility</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://www.uktesthub.com/sitemap</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>
  <url><loc>https://www.uktesthub.com/help</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://www.uktesthub.com/report</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>
  <url><loc>https://www.uktesthub.com/feedback</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>
  <url><loc>https://www.uktesthub.com/exam-updates</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>
</urlset>`;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(sitemapXml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});