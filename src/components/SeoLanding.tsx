import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export type FaqItem = { q: string; a: string };
export type RelatedTest = { slug: string; title: string };

export type SeoLandingProps = {
  h1: string;
  intro: string;
  topicSlug: string;
  categorySlug: string;
  categoryTitle: string;
  /** Long-form sections, total ~1200–1300 words */
  sections: { heading: string; body: ReactNode }[];
  faqs: FaqItem[];
  relatedTests: RelatedTest[];
  relatedCategories?: { slug: string; title: string }[];
};

export function SeoLanding({
  h1,
  intro,
  topicSlug,
  categorySlug,
  categoryTitle,
  sections,
  faqs,
  relatedTests,
  relatedCategories,
}: SeoLandingProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-navy-deep text-navy-foreground">
          <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
            <h1 className="font-display font-extrabold uppercase leading-tight tracking-tight text-4xl md:text-6xl">
              {h1}
            </h1>
            <div className="mt-3 h-1 w-16 rounded-full bg-coral" />
            <p className="mt-5 max-w-2xl text-base text-navy-foreground/80 md:text-lg">
              {intro}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-coral text-white hover:bg-coral/90">
                <Link to="/topic/$slug" params={{ slug: topicSlug }}>
                  ▶ Start Practice
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10">
                <Link to="/category/$slug" params={{ slug: categorySlug }}>
                  Browse {categoryTitle}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <article className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
          <div className="blog-article">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.body}
              </section>
            ))}

            <h2>Frequently asked questions</h2>
            <Accordion type="single" collapsible className="not-prose">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-base font-semibold">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <h2>Related practice tests</h2>
            <ul>
              {relatedTests.map((t) => (
                <li key={t.slug}>
                  <Link to="/topic/$slug" params={{ slug: t.slug }}>
                    {t.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/category/$slug" params={{ slug: categorySlug }}>
                  All {categoryTitle} tests
                </Link>
              </li>
            </ul>

            {relatedCategories && relatedCategories.length > 0 && (
              <>
                <h2>Related categories</h2>
                <ul>
                  {relatedCategories.map((c) => (
                    <li key={c.slug}>
                      <Link to="/category/$slug" params={{ slug: c.slug }}>
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="not-prose mt-10 rounded-lg border border-border bg-muted/40 p-6 text-center">
              <p className="mb-4 text-lg font-semibold">
                Ready to test yourself?
              </p>
              <Button asChild size="lg" className="bg-coral text-white hover:bg-coral/90">
                <Link to="/topic/$slug" params={{ slug: topicSlug }}>
                  ▶ Start Practice — Mock 1
                </Link>
              </Button>
            </div>

            <p className="mt-10 text-sm text-muted-foreground">
              UK Test Hub provides practice-style questions designed to reflect
              common exam formats. We are not affiliated with any official body
              or examining authority.
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export const buildSeoMeta = (opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
}) => {
  const url = `https://www.uktesthub.com${opts.path}`;
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      ...(opts.image ? [{ property: "og:image", content: opts.image }] : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: opts.title },
      { name: "twitter:description", content: opts.description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
};

export const buildFaqAndArticleSchemas = (opts: {
  title: string;
  description: string;
  path: string;
  faqs: FaqItem[];
  image?: string;
}) => {
  const url = `https://www.uktesthub.com${opts.path}`;
  return [
    {
      type: "application/ld+json" as const,
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: opts.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    },
    {
      type: "application/ld+json" as const,
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: opts.title,
        description: opts.description,
        author: { "@type": "Organization", name: "UK Test Hub" },
        publisher: {
          "@type": "Organization",
          name: "UK Test Hub",
          logo: {
            "@type": "ImageObject",
            url: "https://www.uktesthub.com/favicon.png",
          },
        },
        mainEntityOfPage: url,
        url,
        ...(opts.image ? { image: opts.image } : {}),
      }),
    },
  ];
};
