"use client";

import { motion } from "framer-motion";

/**
 * The signature element referenced throughout the design: an oscilloscope-
 * style trace that stands in for "team pulse". Used large in the hero and
 * as a slim divider between marketing sections instead of a plain hairline.
 */
export function PulseWaveform({
  className = "",
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "divider";
}) {
  const path =
    variant === "hero"
      ? "M0,60 L120,60 L150,60 L170,20 L190,100 L210,10 L230,60 L280,60 L310,60 L330,30 L350,90 L370,60 L900,60 L930,60 L950,25 L970,95 L990,60 L1200,60"
      : "M0,20 L200,20 L230,20 L245,4 L260,36 L275,20 L1200,20";

  const height = variant === "hero" ? 120 : 40;

  return (
    <svg
      viewBox={`0 0 1200 ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke="var(--canvas-line)"
        strokeWidth={variant === "hero" ? 1.5 : 1}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={variant === "hero" ? 2 : 1.25}
        strokeLinecap="round"
        strokeDasharray="140 1100"
        initial={{ strokeDashoffset: 1240 }}
        animate={{ strokeDashoffset: -1240 }}
        transition={{
          duration: variant === "hero" ? 5.5 : 7,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </svg>
  );
}
