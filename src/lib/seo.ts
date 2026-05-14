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
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@uktesthub.com",
    },
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

// Default fallback OG image (must always be an absolute URL).
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-uk-test-hub.jpg`;

// Resolve any image reference to an absolute URL on the canonical domain.
// Accepts absolute URLs (returned as-is), root-relative paths ("/foo.jpg"),
// or Vite asset URLs ("/assets/foo-abc.jpg") and returns a full https URL.
export const absoluteImageUrl = (image?: string): string => {
  if (!image) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  return `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

// Convenience to build the meta+canonical scaffold for any page.
export const pageMeta = (opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
}) => {
  const { title, description, path, image, imageAlt, type = "website" } = opts;
  const url = canonical(path);
  const ogImage = absoluteImageUrl(image);
  const ogImageAlt = imageAlt ?? title;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: ogImageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
  };
};
