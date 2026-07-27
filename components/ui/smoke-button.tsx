"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";

type SmokeButtonProps = {
  children: string;
  hoverText?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  icon?: React.ReactNode;
};

export function SmokeButton({
  children,
  href,
  onClick,
  className,
  variant = "primary",
  icon,
}: SmokeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const textString = typeof children === "string" ? children : String(children);
  const primaryLetters = textString.split("");

  const buttonInner = (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={clsx(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full font-body text-sm font-medium transition-all duration-300 cursor-pointer select-none px-6 py-2.5",
        variant === "primary" &&
          "bg-[#FFB454] text-canvas shadow-[0_4px_20px_rgba(255,180,84,0.35)] hover:shadow-[0_8px_30px_rgba(255,180,84,0.6)] hover:scale-[1.03]",
        variant === "secondary" &&
          "bg-canvas-raised border border-canvas-line text-text-primary hover:border-[#FFB454]/60 hover:bg-canvas-raised/90 hover:scale-[1.03] hover:shadow-[0_4px_20px_rgba(255,180,84,0.2)]",
        variant === "outline" &&
          "border border-canvas-line text-text-muted hover:text-text-primary hover:border-[#FFB454] hover:scale-[1.03]",
        className
      )}
    >
      {/* Smoke particle ambient glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.25, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-0 rounded-full bg-[#FFB454]/30 blur-md"
          />
        )}
      </AnimatePresence>

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && (
          <span className="shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
            {icon}
          </span>
        )}

        {!mounted ? (
          <span className="inline-block">{textString}</span>
        ) : (
          /* Staggered Alternating Letter Roll (Even -> UP, Odd -> DOWN) */
          <span
            suppressHydrationWarning
            className="relative inline-flex items-center justify-center overflow-hidden"
          >
            {primaryLetters.map((char, i) => {
              const delay = i * 28; // 28ms staggered wave delay per letter
              const isUp = i % 2 === 0; // Even index (0,2,4) goes UP; Odd index (1,3,5) goes DOWN

              return (
                <span
                  key={i}
                  suppressHydrationWarning
                  className="relative inline-block overflow-hidden"
                >
                  {/* 1st Letter: Even moves UP, Odd moves DOWN */}
                  <span
                    suppressHydrationWarning
                    className={clsx(
                      "inline-block transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]",
                      isUp ? "group-hover:-translate-y-full" : "group-hover:translate-y-full"
                    )}
                    style={{ transitionDelay: `${delay}ms` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>

                  {/* 2nd Letter (Exact Match): Even comes from BELOW, Odd comes from ABOVE */}
                  <span
                    suppressHydrationWarning
                    className={clsx(
                      "absolute left-0 top-0 inline-block transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 text-inherit font-semibold",
                      isUp ? "translate-y-full" : "-translate-y-full"
                    )}
                    style={{ transitionDelay: `${delay}ms` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                </span>
              );
            })}
          </span>
        )}
      </span>
    </div>
  );

  if (href) {
    return <Link href={href}>{buttonInner}</Link>;
  }

  return buttonInner;
}
