import { createFileRoute } from "@tanstack/react-router";
import { blogPosts } from "@/data/blog";

const staticUrls = [
  ["/", "daily", "1.0"],
  ["/category/driving", "weekly", "0.9"],
  ["/category/citizenship", "weekly", "0.9"],
  ["/category/english", "weekly", "0.9"],
  ["/category/education", "weekly", "0.9"],
  ["/category/career", "weekly", "0.9"],
  ["/category/professional", "weekly", "0.9"],
  ["/category/nhs", "weekly", "0.9"],
  ["/category/fun", "weekly", "0.9"],
  ["/category/taxi-private-hire", "weekly", "1.0"],
  ["/blog", "weekly", "0.8"],
  ["/all-tests", "weekly", "0.9"],
  ["/about", "monthly", "0.6"],
  ["/contact", "monthly", "0.6"],
  ["/faq", "monthly", "0.6"],
  ["/privacy", "yearly", "0.3"],
  ["/cookies", "yearly", "0.3"],
  ["/terms", "yearly", "0.3"],
  ["/disclaimer", "yearly", "0.3"],
  ["/accessibility", "yearly", "0.3"],
  ["/sitemap", "monthly", "0.4"],
  ["/help", "monthly", "0.5"],
  ["/report", "monthly", "0.4"],
  ["/feedback", "monthly", "0.4"],
  ["/exam-updates", "weekly", "0.6"],
] as const;

const urls = [
  ...staticUrls.map(
    ([p, cf, pr]) =>
      `  <url><loc>https://www.uktesthub.com${p}</loc><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`,
  ),
  ...blogPosts.map(
    (post) =>
      `  <url><loc>https://www.uktesthub.com/blog/${post.slug}</loc><lastmod>${post.dateModified ?? post.datePublished}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
  ),
].join("\n");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
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