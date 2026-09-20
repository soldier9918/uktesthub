import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/cancelled")({
  head: () => ({
    meta: [
      { title: "Checkout cancelled — UK Test Hub" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Your checkout was cancelled and no payment was taken. Free practice is still available.",
      },
      { property: "og:title", content: "Checkout cancelled — UK Test Hub" },
      { property: "og:description", content: "No payment was taken." },
      { property: "og:url", content: "https://www.uktesthub.com/checkout/cancelled" },
    ],
    links: [{ rel: "canonical", href: "https://www.uktesthub.com/checkout/cancelled" }],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold">Checkout cancelled</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          No payment was taken and nothing has changed on your account. You can carry on with
          the free mock tests whenever you like.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-coral text-white hover:bg-coral/90">
            <Link to="/pricing">Back to plans</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/all-tests">Practise for free</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  ),
});
