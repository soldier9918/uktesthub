import { Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-1">
          <h3 className="font-display text-xl font-bold">
            UK Test <span className="text-gold">Hub</span>
          </h3>
          <p className="mt-3 text-sm text-navy-foreground/70">
            Free practice tests and mock exams for UK Driving Theory, Life in the UK,
            IELTS, GCSE, CSCS, aptitude tests and more — pass first time.
          </p>
        </div>

        {categories.slice(0, 3).map((c) => (
          <div key={c.slug}>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
              {c.title}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-navy-foreground/75">
              {c.topics.map((t) => (
                <li key={t.slug}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="hover:text-coral"
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-navy-foreground/60 md:px-6">
          © {new Date().getFullYear()} UK Test Hub. Free UK exam practice — driving theory,
          Life in the UK, IELTS, GCSE, aptitude tests, CSCS, SIA, food hygiene & more.
          Not affiliated with the DVSA, Home Office or any examination body.
        </div>
      </div>
    </footer>
  );
}
