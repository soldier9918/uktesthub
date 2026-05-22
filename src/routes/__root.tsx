import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";


import appCss from "../styles.css?url";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { StickyAdSlot } from "@/components/AdSlot";
import { AuthProvider } from "@/lib/auth-context";
import { PageViewTracker } from "@/components/PageViewTracker";
import { CookieConsent } from "@/components/CookieConsent";

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
      { name: "author", content: "UK Test Hub" },
      { name: "google-site-verification", content: "5MXOtpExyGc2s5q9kWcw8S2VkkU15G4xIogsw8LoICk" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "UK Test Hub" },
      { name: "twitter:card", content: "summary_large_image" },
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
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700;800;900&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png?v=5" },
      { rel: "shortcut icon", type: "image/png", href: "/favicon.png?v=5" },
      { rel: "apple-touch-icon", href: "/favicon.png?v=5" },
    ],
    scripts: [
      organizationSchema(),
      websiteSchema(),
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
        <meta name="google-adsense-account" content="ca-pub-7445296424475191" />
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
  useEffect(() => {
    // Google Funding Choices — IAB TCF v2.2 certified consent message (CMP)
    // for AdSense in the UK/EEA. The actual message UI is configured in the
    // AdSense > Privacy & messaging dashboard; this loader makes it appear
    // and registers window.__tcfapi.
    if (!document.querySelector('script[data-fc-loader]')) {
      const fc = document.createElement('script');
      fc.async = true;
      fc.src = 'https://fundingchoicesmessages.google.com/i/pub-7445296424475191?ers=1';
      fc.setAttribute('data-fc-loader', '1');
      document.head.appendChild(fc);
      const fcPresent = document.createElement('script');
      fcPresent.text = "(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe');iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';iframe.style.display = 'none';iframe.name = 'googlefcPresent';document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();";
      document.head.appendChild(fcPresent);
    }
    // AdSense loader (separate from the CMP loader).
    if (!document.querySelector('script[data-adsense-loader]')) {
      const s = document.createElement('script');
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7445296424475191';
      s.setAttribute('data-adsense-loader', '1');
      document.head.appendChild(s);
    }
  }, []);

  return (
    <AuthProvider>
      <PageViewTracker />
      <Outlet />
      <StickyAdSlot />
      <CookieConsent />
    </AuthProvider>
  );
}
