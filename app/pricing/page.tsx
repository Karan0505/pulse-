import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Section, Eyebrow } from "@/components/ui/section";
import { PricingGrid } from "@/components/marketing/pricing-grid";

export const metadata = {
  title: "Pricing — Pulse",
  description: "Simple per-member pricing for Pulse.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section className="pb-4 pt-20 text-center md:pt-28">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Priced per member, not per repository.
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-body text-text-muted">
            Connect as many repos as you like on every paid plan. You only
            pay for the people reading the feed.
          </p>
        </Section>
        <PricingGrid />
      </main>
      <Footer />
    </>
  );
}
