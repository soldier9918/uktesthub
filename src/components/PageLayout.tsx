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
        <section className="border-b border-border bg-gradient-to-b from-navy/5 to-transparent">
          <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
            <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">
              {title}
            </h1>
            {intro && (
              <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
                {intro}
              </p>
            )}
          </div>
        </section>
        <article className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
          <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-semibold prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-6 prose-h3:text-lg prose-a:text-coral prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
