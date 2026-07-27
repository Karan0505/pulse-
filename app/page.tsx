import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PulseWaveform } from "@/components/marketing/pulse-waveform";
import { Section, Eyebrow } from "@/components/ui/section";
import { SmokeButton } from "@/components/ui/smoke-button";
import { LiveFeedPreview } from "@/components/marketing/live-feed-preview";
import { ArrowRight } from "lucide-react";

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
            <Eyebrow>Live, not lagging</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              The feed updates the moment something happens.
            </h2>
            <p className="mt-4 max-w-md font-body text-text-muted">
              No end-of-day digest, no waiting for a nightly sync. A merge, a
              review, a deploy or an incident lands in the feed within
              seconds — subscriptions keep every open dashboard current.
            </p>
            <Link
              href="/features"
              className="mt-6 inline-flex items-center gap-2 font-body text-sm font-medium text-accent"
            >
              See every feature <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <LiveFeedPreview />
        </Section>

        <Section className="border-t border-canvas-line/70 text-center">
          <Eyebrow>Get started</Eyebrow>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Eight members, free, forever.
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body text-text-muted">
            Connect a repository and see your team&apos;s first pulse feed in
            under five minutes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SmokeButton href="/signup" variant="primary">
              Start free
            </SmokeButton>
            <SmokeButton href="/pricing" variant="secondary">
              See pricing
            </SmokeButton>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
