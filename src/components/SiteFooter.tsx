import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import logoSrc from "@/assets/uktesthub-logo.png";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/", Icon: Instagram },
  { label: "YouTube", href: "https://www.youtube.com/", Icon: Youtube },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/",
    Icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3a8.5 8.5 0 0 1-4.5-1.4v6.65a6.25 6.25 0 1 1-6.25-6.25c.34 0 .67.03 1 .09v3.16a3.16 3.16 0 1 0 2.25 3.03V3h3z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/",
    Icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M12 2a10 10 0 0 0-3.64 19.32c-.09-.78-.17-1.97.04-2.82.18-.74 1.18-4.7 1.18-4.7s-.3-.6-.3-1.49c0-1.4.81-2.45 1.82-2.45.86 0 1.27.65 1.27 1.42 0 .86-.55 2.16-.84 3.36-.24 1 .51 1.82 1.5 1.82 1.8 0 3.18-1.9 3.18-4.63 0-2.42-1.74-4.11-4.22-4.11-2.88 0-4.57 2.16-4.57 4.39 0 .87.33 1.81.75 2.32.08.1.1.19.07.29-.08.34-.27 1.1-.31 1.25-.05.21-.16.25-.37.15-1.39-.65-2.26-2.68-2.26-4.31 0-3.5 2.55-6.72 7.34-6.72 3.85 0 6.85 2.74 6.85 6.41 0 3.83-2.42 6.91-5.77 6.91-1.13 0-2.19-.59-2.55-1.28l-.69 2.64c-.25.97-.93 2.18-1.39 2.92A10 10 0 1 0 12 2z" />
      </svg>
    ),
  },
];

type StaticLink = { label: string; to: string };
type CategoryLink = { label: string; to: "/category/$slug"; params: { slug: string } };
type TopicLink = { label: string; to: "/topic/$slug"; params: { slug: string } };
type FooterLink = StaticLink | CategoryLink | TopicLink;

const popularTests: FooterLink[] = [
  { label: "SERU TfL Test", to: "/topic/$slug", params: { slug: "seru" } },
  { label: "Topographical Test", to: "/topic/$slug", params: { slug: "topographical" } },
  { label: "PHV Licence Test", to: "/topic/$slug", params: { slug: "phv-licence" } },
  { label: "Congestion Charge", to: "/topic/$slug", params: { slug: "congestion-charge" } },
  { label: "ULEZ Quiz", to: "/topic/$slug", params: { slug: "ulez" } },
  { label: "Driving Theory Test", to: "/topic/$slug", params: { slug: "driving-theory" } },
  { label: "Life in the UK Test", to: "/topic/$slug", params: { slug: "life-in-the-uk" } },
  { label: "IELTS Practice", to: "/topic/$slug", params: { slug: "ielts" } },
];

const company: StaticLink[] = [
  { label: "About Us", to: "/about" },
  { label: "All Tests", to: "/all-tests" },
  { label: "Study Guides", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
  { label: "FAQ", to: "/faq" },
  { label: "Sitemap", to: "/sitemap" },
];

const support: StaticLink[] = [
  { label: "Help Centre", to: "/help" },
  { label: "Report a Question", to: "/report" },
  { label: "Feedback", to: "/feedback" },
  { label: "Exam Updates", to: "/exam-updates" },
];

const legal: StaticLink[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Cookie Policy", to: "/cookies" },
  { label: "Terms and Conditions", to: "/terms" },
  { label: "Disclaimer", to: "/disclaimer" },
  { label: "Accessibility Statement", to: "/accessibility" },
];

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-navy-foreground">
        {title}
      </h4>
      <ul className="mt-5 space-y-3 text-sm text-navy-foreground/70">
        {items.map((item) => (
          <li key={item.label}>
            {"params" in item ? (
              <Link
                to={item.to as "/category/$slug"}
                params={item.params as { slug: string }}
                className="transition-colors hover:text-coral"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                to={item.to as "/about"}
                className="transition-colors hover:text-coral"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy-deep text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 pt-16 md:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <FooterColumn title="Popular Tests" items={popularTests} />
              <FooterColumn title="Company" items={company} />
              <FooterColumn title="Support" items={support} />
              <FooterColumn title="Legal" items={legal} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <Logo variant="light" />
            <p className="mt-5 text-sm text-navy-foreground/70">
              Free, independent UK practice tests with instant feedback —
              no account required.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-navy-foreground/80 transition-colors hover:border-coral hover:text-coral"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-5 text-xs leading-relaxed text-navy-foreground/65">
          <strong className="font-semibold text-navy-foreground">Disclaimer:</strong>{" "}
          UK Test Hub is an independent practice platform. We are{" "}
          <strong className="font-semibold text-navy-foreground">not affiliated</strong>{" "}
          with any official exam body, government department, regulator or
          test provider — including the DVSA, TfL, the UK Government, the
          Home Office, IELTS, ESOL, CSCS, SIA, the NHS or any examination
          board. All trademarks and brand names belong to their respective
          owners and are used for reference only. All questions are for
          practice and revision purposes only. For support, contact{" "}
          <a href="mailto:support@uktesthub.com" className="underline hover:text-coral">support@uktesthub.com</a>.
        </div>
      </div>

      <div className="mt-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 text-xs text-navy-foreground/60 md:flex-row md:items-center md:px-6">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="UK Test Hub" className="h-10 w-10 object-contain drop-shadow-sm" />
            <span>© 2026 UK Test Hub. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy" className="hover:text-coral">Privacy</Link>
            <Link to="/cookies" className="hover:text-coral">Cookies</Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("uktesthub:open-cookie-settings"))}
              className="hover:text-coral"
            >
              Cookie Settings
            </button>
            <Link to="/terms" className="hover:text-coral">Terms</Link>
            <Link to="/sitemap" className="hover:text-coral">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
