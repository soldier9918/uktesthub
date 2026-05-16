// Map of deprecated topic slugs → current canonical slug.
// Used by topic / guide / quiz routes to issue 301-style redirects so
// any old inbound links keep working and crawlers consolidate signals
// onto a single URL per topic.
export const LEGACY_SLUG_REDIRECTS: Record<string, string> = {
  "forklift-theory": "forklift-flt-theory-test",
  // Phase 1 expansion: support the alternative URLs from the topic
  // expansion brief that map to existing canonical topics.
  "gre-practice-test": "gre-practice",
  "gmat-practice-test": "gmat-practice",
};
