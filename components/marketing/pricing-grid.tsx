"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import clsx from "clsx";
import { Check } from "lucide-react";
import { GET_PRICING } from "@/lib/graphql/queries";
import { Section } from "@/components/ui/section";
import { SmokeButton } from "@/components/ui/smoke-button";

type Tier = {
  id: string;
  name: string;
  price: number;
  cadence: string;
  tagline: string;
  limits: string;
  features: string[];
  cta: string;
  highlighted: boolean;
};

export function PricingGrid() {
  const { data, loading } = useQuery<{ pricingTiers: Tier[] }>(GET_PRICING);

  return (
    <Section className="pt-8">
      <div className="grid gap-6 md:grid-cols-3">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-96 animate-pulse rounded-2xl bg-canvas-raised" />
          ))}
        {data?.pricingTiers.map((tier) => (
          <div
            key={tier.id}
            className={clsx(
              "flex flex-col rounded-2xl border p-8",
              tier.highlighted
                ? "border-accent bg-canvas-raised shadow-[0_0_0_1px_var(--accent)]"
                : "border-canvas-line bg-canvas"
            )}
          >
            {tier.highlighted && (
              <span className="mb-4 inline-block w-fit rounded-full bg-accent px-3 py-1 font-mono text-xs font-medium text-canvas">
                Most popular
              </span>
            )}
            <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
            <p className="mt-2 font-body text-sm text-text-muted">{tier.tagline}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold">
                {tier.price === 0 ? "Free" : `$${tier.price}`}
              </span>
              {tier.price !== 0 && (
                <span className="font-body text-sm text-text-muted">/ {tier.cadence}</span>
              )}
            </div>
            <p className="mt-1 font-mono text-xs text-text-muted">{tier.limits}</p>

            <ul className="mt-6 flex-1 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 font-body text-sm text-text-primary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-pulse" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-center">
              <SmokeButton
                href={
                  tier.cta.toLowerCase().includes("talk") ||
                  tier.cta.toLowerCase().includes("contact") ||
                  tier.cta.toLowerCase().includes("trial") ||
                  tier.id === "scale" ||
                  tier.id === "team"
                    ? "/contact"
                    : "/signup"
                }
                variant={tier.highlighted ? "primary" : "secondary"}
                className="w-full text-center"
              >
                {tier.cta}
              </SmokeButton>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
