import { createFileRoute } from "@tanstack/react-router";
import { blogPosts } from "@/data/blog";
import { categories } from "@/data/categories";

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
  ["/category/security", "weekly", "0.9"],
  ["/category/hospitality", "weekly", "0.8"],
  ["/category/construction", "weekly", "0.9"],
  ["/category/finance", "weekly", "0.8"],
  ["/category/it-tech", "weekly", "0.8"],
  ["/category/healthcare-entry", "weekly", "0.8"],
  ["/category/teaching", "weekly", "0.8"],
  ["/category/legal", "weekly", "0.8"],
  ["/category/military-emergency", "weekly", "0.8"],
  ["/category/maritime-aviation", "weekly", "0.7"],
  ["/category/government", "weekly", "0.8"],
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

const topicUrls = categories.flatMap((c) =>
  c.topics.flatMap((t) => [
    `  <url><loc>https://www.uktesthub.com/topic/${t.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    `  <url><loc>https://www.uktesthub.com/guide/${t.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
  ]),
);

const urls = [
  ...staticUrls.map(
    ([p, cf, pr]) =>
      `  <url><loc>https://www.uktesthub.com${p}</loc><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`,
  ),
  ...topicUrls,
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