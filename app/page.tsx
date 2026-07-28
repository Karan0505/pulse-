import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PulseWaveform } from "@/components/marketing/pulse-waveform";
import { Section, Eyebrow } from "@/components/ui/section";
import { LiveFeedPreview } from "@/components/marketing/live-feed-preview";
import { ScrollTextFill, ScrollTextSection } from "@/components/ui/scroll-text-fill";
import { UnderlinedLink } from "@/components/ui/underlined-link";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />

        <div className="border-y border-canvas-line/70 bg-canvas-raised/40 py-3">
          <PulseWaveform variant="divider" className="h-8 w-full opacity-60" />
        </div>

        <Section className="pt-16 text-center flex flex-col items-center">
          <Eyebrow>What makes us different</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Everything You Need, Nothing You Don&apos;t.
          </h2>
          <p className="mt-4 max-w-xl font-body text-base text-text-muted">
            A complete, production-ready SaaS platform crafted for modern engineering teams.
          </p>
          <div className="w-full text-left">
            <FeatureGrid />
          </div>
        </Section>

        <Section className="grid gap-12 border-t border-canvas-line/70 md:grid-cols-2 md:items-center">
          <div>
            <ScrollTextSection>
              <Eyebrow>Live, not lagging</Eyebrow>
              <ScrollTextFill
                as="h2"
                text="The feed updates the moment something happens."
                className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl text-text-primary"
                seqRange={[0, 0.38]}
              />
              <ScrollTextFill
                as="p"
                text="No end-of-day digest, no waiting for a nightly sync. A merge, a review, a deploy or an incident lands in the feed within seconds — subscriptions keep every open dashboard current."
                className="mt-4 max-w-md font-body text-base"
                accentColor="rgba(255, 255, 255, 0.95)"
                seqRange={[0.4, 1.0]}
              />
            </ScrollTextSection>

            {/* SEE EVERY FEATURE link in Accent Brown/Amber (#FFB454) as requested */}
            <UnderlinedLink href="/features" variant="accent" className="mt-8">
              SEE EVERY FEATURE
            </UnderlinedLink>
          </div>
          <LiveFeedPreview />
        </Section>

        <Section className="border-t border-canvas-line/70 text-center flex flex-col items-center">
          <Eyebrow>Get started</Eyebrow>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Eight members, free, forever.
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body text-text-muted">
            Connect a repository and see your team&apos;s first pulse feed in
            under five minutes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
            <UnderlinedLink href="/signup" variant="accent">
              START FREE
            </UnderlinedLink>
            <UnderlinedLink href="/pricing" variant="accent">
              SEE PRICING
            </UnderlinedLink>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
