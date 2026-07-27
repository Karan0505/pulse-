"use client";

import { useQuery } from "@apollo/client/react";
import { GET_FEATURES } from "@/lib/graphql/queries";
import {
  Zap,
  Shield,
  BarChart3,
  Users,
  Globe,
  Bot,
  Sparkles,
  LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "lightning-fast": Zap,
  "enterprise-security": Shield,
  "real-time-analytics": BarChart3,
  "team-collaboration": Users,
  "global-scale": Globe,
  "ai-powered": Bot,
};

type Feature = {
  id: string;
  title: string;
  slug: string;
  summary: string;
};

export function FeatureGrid() {
  const { data, loading } = useQuery<{ features: Feature[] }>(GET_FEATURES);

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {loading &&
        Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-canvas-raised" />
        ))}

      {data?.features.map((f) => {
        const Icon = icons[f.slug] ?? Zap;
        return (
          <div
            key={f.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-canvas-line bg-canvas-raised/40 p-6 backdrop-blur-sm transition-all duration-500 ease-out hover:border-[#FFB454]/60 hover:bg-canvas-raised hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,180,84,0.25)] cursor-pointer"
          >
            {/* Shimmer Light Sweep across card on hover */}
            <div className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-1000 ease-out group-hover:left-full group-hover:opacity-100" />

            {/* Glowing Golden Radial Background */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#FFB454]/15 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div>
              <div className="flex items-center justify-between">
                {/* Glowing Badge Icon with Pulse Ring */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFB454]/10 border border-[#FFB454]/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#FFB454] group-hover:border-[#FFB454] group-hover:shadow-[0_0_20px_rgba(255,180,84,0.6)]">
                  <Icon className="h-6 w-6 text-[#FFB454] transition-colors duration-500 group-hover:text-canvas" strokeWidth={2} />
                  
                  {/* Outer Pulsing Ring */}
                  <span className="absolute -inset-1 rounded-xl bg-[#FFB454]/30 opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100 group-hover:scale-125" />
                </div>

                <Sparkles className="h-4 w-4 text-[#FFB454] opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100" />
              </div>

              {/* Title & Content */}
              <h3 className="mt-6 font-display text-lg font-semibold text-text-primary transition-colors duration-300 group-hover:text-[#FFB454]">
                {f.title}
              </h3>

              <p className="mt-2.5 font-body text-sm text-text-muted leading-relaxed transition-colors duration-300 group-hover:text-text-primary/90">
                {f.summary}
              </p>
            </div>

            {/* Animated Bottom Pulse Progress Line */}
            <div className="mt-6 h-0.5 w-0 bg-gradient-to-r from-[#FFB454] to-amber-300 transition-all duration-500 ease-out group-hover:w-full" />
          </div>
        );
      })}
    </div>
  );
}
