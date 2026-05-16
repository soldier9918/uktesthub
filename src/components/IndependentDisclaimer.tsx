// Site-wide disclaimer reminding visitors that UK Test Hub is an independent
// practice site and is not affiliated with any official exam body. Drop into
// topic, guide and quiz pages for new topics that mention real qualifications.
export function IndependentDisclaimer() {
  return (
    <section
      aria-label="Independent site disclaimer"
      className="mt-10 rounded-2xl border border-border bg-muted/40 p-5 text-xs leading-relaxed text-muted-foreground md:text-sm"
    >
      <p className="font-semibold uppercase tracking-wider text-foreground">
        Independent practice site
      </p>
      <p className="mt-2">
        UK Test Hub is an independent practice and study website. We are not
        affiliated with GOV.UK, DVSA, Department for Transport, SQA, ETS,
        Pearson, GMAC, NHS or any official exam body. Questions are
        practice-style only — always check the official test provider or
        government guidance before booking a real exam or relying on a
        qualification for an application.
      </p>
    </section>
  );
}
