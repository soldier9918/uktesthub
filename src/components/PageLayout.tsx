import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-navy-deep text-navy-foreground">
          <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              {title}
            </h1>
            <div className="mt-3 h-1 w-16 rounded-full bg-coral" />
            {intro && (
              <p className="mt-5 max-w-2xl text-base text-navy-foreground/80 md:text-lg">
                {intro}
              </p>
            )}
          </div>
        </section>
        <article className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
          <div className="blog-article">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
