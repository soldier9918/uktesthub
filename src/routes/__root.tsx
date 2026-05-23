import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";


import appCss from "../styles.css?url";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { StickyAdSlot } from "@/components/AdSlot";
import { AuthProvider } from "@/lib/auth-context";
import { PageViewTracker } from "@/components/PageViewTracker";
import { CookieConsent } from "@/components/CookieConsent";

const ADSENSE_CMP_BOOTSTRAP_SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7445296424475191";
const FUNDING_CHOICES_BOOTSTRAP_SRC = "https://fundingchoicesmessages.google.com/i/pub-7445296424475191?ers=1";
const GOOGLE_CMP_BOOTSTRAP_SCRIPT = `(function() {
  window.googlefc = window.googlefc || {};
  window.googlefc.controlledMessagingFunction = function(message) {
    message.proceed(true);
  };
  var loadAdsense = function() {
    if (document.querySelector('script[src^="${ADSENSE_CMP_BOOTSTRAP_SRC}"]')) return;
    var adsense = document.createElement('script');
    adsense.async = true;
    adsense.crossOrigin = 'anonymous';
    adsense.src = '${ADSENSE_CMP_BOOTSTRAP_SRC}';
    document.head.appendChild(adsense);
  };
  if (!document.querySelector('script[src^="${FUNDING_CHOICES_BOOTSTRAP_SRC}"]')) {
    var fundingChoices = document.createElement('script');
    fundingChoices.async = true;
    fundingChoices.src = '${FUNDING_CHOICES_BOOTSTRAP_SRC}';
    fundingChoices.onload = loadAdsense;
    fundingChoices.onerror = loadAdsense;
    document.head.appendChild(fundingChoices);
    window.setTimeout(loadAdsense, 2500);
  } else {
    loadAdsense();
  }
})();`;

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
      { name: "google-adsense-account", content: "ca-pub-7445296424475191" },
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
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700;800;900&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png?v=6" },
      { rel: "shortcut icon", type: "image/png", href: "/favicon.png?v=6" },
      { rel: "apple-touch-icon", href: "/favicon.png?v=6" },
    ],
    scripts: [organizationSchema(), websiteSchema()],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head suppressHydrationWarning>
        <script
          suppressHydrationWarning
          data-google-cmp-bootstrap="1"
          dangerouslySetInnerHTML={{ __html: GOOGLE_CMP_BOOTSTRAP_SCRIPT }}
        />
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
  return (
    <AuthProvider>
      <PageViewTracker />
      <Outlet />
      <StickyAdSlot />
      <CookieConsent />
    </AuthProvider>
  );
}
