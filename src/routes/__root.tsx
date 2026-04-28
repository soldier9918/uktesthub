import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "UK Test Hub" },
      {
        name: "description",
        content:
          "Free UK practice tests: Driving Theory, Life in the UK, IELTS, GCSE, CSCS, NHS, SERU TfL and more. Realistic mock exams with instant results and explanations.",
      },
      { name: "author", content: "UK Test Hub" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "UK Test Hub" },
      { name: "twitter:title", content: "UK Test Hub" },
      { name: "description", content: "UK Test Hub Pro is a premium web application for UK and international English exam preparation." },
      { property: "og:description", content: "UK Test Hub Pro is a premium web application for UK and international English exam preparation." },
      { name: "twitter:description", content: "UK Test Hub Pro is a premium web application for UK and international English exam preparation." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/60rsF7o22RT0wrreDJWyLhTs1UL2/social-images/social-1777326990566-76124a84-9ddf-45ab-8599-9bc2e87067d0.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/60rsF7o22RT0wrreDJWyLhTs1UL2/social-images/social-1777326990566-76124a84-9ddf-45ab-8599-9bc2e87067d0.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
