import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Section, Eyebrow } from "@/components/ui/section";
import { FeatureList } from "@/components/marketing/feature-list";

export const metadata = {
  title: "Features — Pulse",
  description: "Production-grade features across categories — all included from day one.",
};

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Section className="pb-10 pt-20 text-center md:pt-28 flex flex-col items-center">
          <Eyebrow>FEATURE PACKED</Eyebrow>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Everything Built-In
          </h1>
          <p className="mt-4 max-w-xl font-body text-base text-text-muted">
            Production-grade features across categories — all included from day one.
          </p>
        </Section>
        <FeatureList />
      </main>
      <Footer />
    </>
  );
}
