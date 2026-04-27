import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { Logo } from "./Logo";

type StaticLink = { label: string; to: string };
type CategoryLink = { label: string; to: "/category/$slug"; params: { slug: string } };
type TopicLink = { label: string; to: "/topic/$slug"; params: { slug: string } };
type FooterLink = StaticLink | CategoryLink | TopicLink;

const popularTests: FooterLink[] = [
  { label: "Driving Theory Test", to: "/topic/$slug", params: { slug: "driving-theory" } },
  { label: "Life in the UK Test", to: "/topic/$slug", params: { slug: "life-in-the-uk" } },
  { label: "SERU TfL Test", to: "/topic/$slug", params: { slug: "seru" } },
  { label: "IELTS Practice", to: "/topic/$slug", params: { slug: "ielts" } },
  { label: "ESOL Practice", to: "/topic/$slug", params: { slug: "esol" } },
  { label: "11+ Practice", to: "/topic/$slug", params: { slug: "eleven-plus" } },
  { label: "CSCS Card Test", to: "/topic/$slug", params: { slug: "cscs" } },
  { label: "SIA Security Test", to: "/topic/$slug", params: { slug: "sia" } },
];

const company: StaticLink[] = [
  { label: "About Us", to: "/about" },
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
              Subscribe for exam updates and tips
            </p>
            <form
              className="mt-3 flex max-w-md gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-navy-foreground placeholder:text-navy-foreground/40 focus:border-coral focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-coral px-5 py-3 text-sm font-semibold text-coral-foreground shadow-coral transition-transform hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
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
          <strong className="font-semibold text-navy-foreground">not affiliated with</strong>{" "}
          DVSA, TfL, the UK Government, IELTS, ESOL, CSCS, SIA, the NHS or any
          examination board unless explicitly stated. All trademarks and brand
          names belong to their respective owners and are used for reference only.
        </div>
      </div>

      <div className="mt-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-navy-foreground/60 md:flex-row md:items-center md:px-6">
          <div>© 2026 UK Test Hub. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy" className="hover:text-coral">Privacy</Link>
            <Link to="/cookies" className="hover:text-coral">Cookies</Link>
            <Link to="/terms" className="hover:text-coral">Terms</Link>
            <Link to="/sitemap" className="hover:text-coral">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
