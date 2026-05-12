import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { Logo } from "./Logo";
import logoSrc from "@/assets/uktesthub-logo.png";

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
            <div className="mt-6 flex gap-2">
              {[Facebook, Twitter, Youtube, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-navy-foreground/80 transition-colors hover:bg-coral hover:text-coral-foreground"
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
