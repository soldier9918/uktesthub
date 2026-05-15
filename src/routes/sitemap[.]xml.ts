import { createFileRoute } from "@tanstack/react-router";
import { blogPosts } from "@/data/blog";
import { categories } from "@/data/categories";
import { englishTests, allEnglishLevelTriples } from "@/data/english/categories";
import mockIndex from "@/data/mocks/mock-index.json";

const BASE = "https://www.uktesthub.com";

type Freq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

interface Entry {
  path: string;
  changefreq?: Freq;
  priority?: string;
  lastmod?: string;
}

// Static, hand-curated indexable pages. Excludes admin, auth, account,
// dashboard, bookmarks, report, feedback, robots.txt and sitemap.xml itself.
const staticEntries: Entry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/all-tests", changefreq: "weekly", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/help", changefreq: "monthly", priority: "0.5" },
  { path: "/exam-updates", changefreq: "weekly", priority: "0.6" },
  { path: "/sitemap", changefreq: "monthly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/disclaimer", changefreq: "yearly", priority: "0.3" },
  { path: "/accessibility", changefreq: "yearly", priority: "0.3" },
];

// Per-topic SEO landing pages that exist as their own routes.
const seoLandings: Entry[] = [
  "/seru-test-practice",
  "/seru-tfl",
  "/topographical-test-london",
  "/sia-door-supervisor-mock-test",
  "/cscs-mock-test-free",
  "/driving-theory-test-questions",
  "/life-in-the-uk-test-practice",
  "/uk-road-signs-test",
  "/nhs-numeracy-test-practice",
].map((path) => ({ path, changefreq: "weekly" as Freq, priority: "0.9" }));

const categoryEntries: Entry[] = categories.map((c) => ({
  path: `/category/${c.slug}`,
  changefreq: "weekly",
  priority: "0.9",
}));

const topicEntries: Entry[] = categories.flatMap((c) =>
  c.topics.flatMap<Entry>((t) => [
    { path: `/topic/${t.slug}`, changefreq: "weekly", priority: "0.7" },
    { path: `/guide/${t.slug}`, changefreq: "monthly", priority: "0.7" },
  ]),
);

const blogEntries: Entry[] = blogPosts.map((p) => ({
  path: `/blog/${p.slug}`,
  changefreq: "monthly",
  priority: "0.7",
  lastmod: p.dateModified ?? p.datePublished,
}));

// All quiz mocks across every topic. Each /quiz/{slug}-mock-{n} now renders
// a topic-specific title, description and self-canonical (see quiz.$slug.tsx),
// so all 5,130 are safe to include for indexing.
const mocks = mockIndex as Record<string, number[]>;
const quizEntries: Entry[] = Object.entries(mocks).flatMap(([topic, nums]) =>
  nums.map<Entry>((n) => ({
    path: `/quiz/${topic}-mock-${n}`,
    changefreq: "monthly",
    priority: "0.6",
  })),
);

const englishEntries: Entry[] = [
  { path: "/english-language-tests", changefreq: "weekly", priority: "0.9" },
  { path: "/category/english", changefreq: "weekly", priority: "0.9" },
  ...englishTests.map<Entry>((t) => ({
    path: `/english-language-tests/${t.slug}`,
    changefreq: "weekly",
    priority: "0.8",
  })),
  ...englishTests.flatMap<Entry>((t) =>
    t.skills.map<Entry>((s) => ({
      path: `/english-language-tests/${t.slug}/${s.slug}`,
      changefreq: "weekly",
      priority: "0.7",
    })),
  ),
  ...allEnglishLevelTriples().map<Entry>(({ test, skill, level }) => ({
    path: `/english-language-tests/${test}/${skill}/${level}`,
    changefreq: "weekly",
    priority: "0.6",
  })),
];

// Every English mock test page (45 per level triple).
const englishMockEntries: Entry[] = allEnglishLevelTriples().flatMap(
  ({ test, skill, level }) =>
    Array.from({ length: 45 }, (_, i) => i + 1).map<Entry>((n) => ({
      path: `/english-language-tests/${test}/${skill}/${level}/mock-test-${n}`,
      changefreq: "monthly",
      priority: "0.5",
    })),
);


const allEntries: Entry[] = [
  ...staticEntries,
  ...seoLandings,
  ...categoryEntries,
  ...topicEntries,
  ...blogEntries,
  ...quizEntries,
  ...englishEntries,
];

const renderUrl = (e: Entry) =>
  [
    "  <url>",
    `    <loc>${BASE}${e.path}</loc>`,
    e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
    e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
    e.priority ? `    <priority>${e.priority}</priority>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...allEntries.map(renderUrl),
  "</urlset>",
].join("\n");

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
