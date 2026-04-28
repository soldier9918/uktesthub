// Shared SEO helpers + JSON-LD builders for UK Test Hub.
// All structured data follows schema.org conventions and is injected via
// route head().scripts as application/ld+json.

export const SITE_URL = "https://www.uktesthub.com";
export const SITE_NAME = "UK Test Hub";

export const canonical = (path: string) => {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_URL}${path}`;
};

type LdScript = {
  type: "application/ld+json";
  children: string;
};

const ld = (data: unknown): LdScript => ({
  type: "application/ld+json",
  children: JSON.stringify(data),
});

export const organizationSchema = (): LdScript =>
  ld({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    sameAs: [],
    description:
      "Free UK practice tests for Driving Theory, Life in the UK, IELTS, GCSE, CSCS, NHS, SERU TfL and more.",
  });

export const websiteSchema = (): LdScript =>
  ld({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });

export const faqSchema = (faqs: { q: string; a: string }[]): LdScript =>
  ld({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

export const breadcrumbSchema = (
  items: { name: string; url: string }[],
): LdScript =>
  ld({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : canonical(it.url),
    })),
  });

export const articleSchema = (post: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
}): LdScript =>
  ld({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    image: post.image,
    mainEntityOfPage: canonical(`/blog/${post.slug}`),
    url: canonical(`/blog/${post.slug}`),
  });

// Convenience to build the meta+canonical scaffold for any page.
export const pageMeta = (opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}) => {
  const { title, description, path, image, type = "website" } = opts;
  const url = canonical(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      ...(image
        ? [
            { property: "og:image", content: image },
            { name: "twitter:image", content: image },
          ]
        : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
};
