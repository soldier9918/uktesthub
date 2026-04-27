import { Link } from "@tanstack/react-router";

const popularTests: { label: string; to: string; params?: Record<string, string> }[] = [
  { label: "Driving Theory Test", to: "/category/$slug", params: { slug: "driving" } },
  { label: "Life in the UK Test", to: "/category/$slug", params: { slug: "citizenship" } },
  { label: "SERU TfL Test", to: "/seru-tfl" },
  { label: "IELTS Practice", to: "/category/$slug", params: { slug: "english" } },
  { label: "ESOL Practice", to: "/category/$slug", params: { slug: "english" } },
  { label: "11+ Practice", to: "/category/$slug", params: { slug: "education" } },
  { label: "CSCS Card Test", to: "/category/$slug", params: { slug: "professional" } },
  { label: "SIA Security Test", to: "/category/$slug", params: { slug: "professional" } },
];

const company = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "FAQ", to: "/faq" },
  { label: "Sitemap", to: "/sitemap" },
];

const legal = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Cookie Policy", to: "/cookies" },
  { label: "Terms and Conditions", to: "/terms" },
  { label: "Disclaimer", to: "/disclaimer" },
  { label: "Accessibility Statement", to: "/accessibility" },
];

const support = [
  { label: "Help Centre", to: "/help" },
  { label: "Report a Question", to: "/report" },
  { label: "Feedback", to: "/feedback" },
  { label: "Exam Updates", to: "/exam-updates" },
];

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; to: string; params?: Record<string, string> }[];
}) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5 text-sm text-navy-foreground/75">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              // @ts-expect-error – mixed static + dynamic links use the same component
              to={item.to}
              // @ts-expect-error – params only present on dynamic routes
              params={item.params}
              className="transition-colors hover:text-coral"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-navy text-navy-foreground">
      {/* Brand + blurb */}
      <div className="mx-auto max-w-7xl px-4 pt-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="font-display text-2xl font-bold">
                UK Test <span className="text-gold">Hub</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-navy-foreground/75">
              UK Test Hub helps learners practise for UK mock tests including
              Driving Theory, Life in the UK, SERU TfL, IELTS, ESOL, CSCS, SIA
              and more. Free practice questions, mock exams, instant results
              and explanations.
            </p>
          </div>

          <div className="md:col-span-8">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <FooterColumn title="Popular Tests" items={popularTests} />
              <FooterColumn title="Company" items={company} />
              <FooterColumn title="Legal" items={legal} />
              <FooterColumn title="Support" items={support} />
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-xs leading-relaxed text-navy-foreground/70">
          <strong className="font-semibold text-navy-foreground">Disclaimer:</strong>{" "}
          UK Test Hub is an independent practice platform. We are{" "}
          <strong className="font-semibold text-navy-foreground">not affiliated with</strong>{" "}
          the DVSA, TfL, the UK Government, IELTS, ESOL, CSCS, SIA, the NHS or
          any examination board unless explicitly stated. All trademarks and
          brand names belong to their respective owners and are used for
          reference only.
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-navy-foreground/60 md:flex-row md:items-center md:px-6">
          <div>© 2026 UK Test Hub. All rights reserved.</div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
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
