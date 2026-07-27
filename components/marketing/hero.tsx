"use client";

import { motion } from "framer-motion";
import { PulseWaveform } from "./pulse-waveform";
import { SmokeButton } from "@/components/ui/smoke-button";

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-20 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-canvas-line px-3 py-1 font-mono text-xs text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-pulse" />
            Now watching 4,200+ repositories
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
        >
          Know how your team is really doing,{" "}
          <span className="text-accent">before</span> the retro.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-6 max-w-xl font-body text-lg text-text-muted"
        >
          Pulse turns your team&apos;s merges, reviews, deploys and incidents
          into one live feed — so you notice a stalled PR or an overloaded
          teammate in hours, not weeks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-9 flex flex-col gap-4 sm:flex-row"
        >
          {/* Primary Smoke Button with Particle Dissolve */}
          <SmokeButton
            href="/signup"
            variant="primary"
            hoverText="Claim Free Spot ⚡"
          >
            Start free — 8 members
          </SmokeButton>

          {/* Secondary Smoke Button with Particle Dissolve */}
          <SmokeButton
            href="/dashboard"
            variant="secondary"
            hoverText="Explore Live Feed 📊"
          >
            See a live dashboard
          </SmokeButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative mt-6 h-40 md:h-56"
      >
        <PulseWaveform variant="hero" className="h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-transparent" />
      </motion.div>
    </div>
  );
}
