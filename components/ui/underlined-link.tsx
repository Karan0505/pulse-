"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface UnderlinedLinkProps {
  href: string;
  children: string;
  className?: string;
}

export function UnderlinedLink({ href, children, className }: UnderlinedLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Split text into characters for 1-by-1 staggered animation
  const letters = Array.from(children);

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "group inline-flex w-fit items-end font-mono text-xs font-semibold uppercase tracking-widest text-white cursor-pointer select-none pb-1",
        className
      )}
    >
      {/* Contiguous flex row (gap-0) ensuring ONE unbroken continuous underline */}
      <div className="inline-flex items-end gap-0">
        {/* Letters + contiguous line segments */}
        {letters.map((char, i) => (
          <span key={i} className="inline-flex flex-col items-center">
            {/* Letter */}
            <motion.span
              animate={
                isHovered
                  ? {
                      y: [0, -10, 0],
                      opacity: [1, 0.4, 1],
                    }
                  : { y: 0, opacity: 1 }
              }
              transition={{
                duration: 0.35,
                delay: i * 0.022,
                ease: "easeInOut",
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0\u00A0" : char}
            </motion.span>

            {/* Seamless 0-gap Underline Segment */}
            <motion.span
              animate={
                isHovered
                  ? {
                      y: [0, -6, 0],
                      opacity: [1, 0.5, 1],
                    }
                  : { y: 0, opacity: 1 }
              }
              transition={{
                duration: 0.35,
                delay: i * 0.022,
                ease: "easeInOut",
              }}
              className="mt-1.5 h-[1.5px] w-full bg-white block"
            />
          </span>
        ))}

        {/* Small gap spacer before arrow with continuous line segment */}
        <span className="inline-flex flex-col items-center">
          <span className="inline-block px-1 opacity-0">&nbsp;</span>
          <motion.span
            animate={
              isHovered
                ? {
                    y: [0, -6, 0],
                    opacity: [1, 0.5, 1],
                  }
                : { y: 0, opacity: 1 }
            }
            transition={{
              duration: 0.35,
              delay: letters.length * 0.022,
              ease: "easeInOut",
            }}
            className="mt-1.5 h-[1.5px] w-full bg-white block"
          />
        </span>

        {/* Arrow with continuous line segment */}
        <span className="inline-flex flex-col items-center">
          <div className="relative flex h-4 w-4 items-center justify-center overflow-hidden">
            <motion.div
              animate={
                isHovered
                  ? {
                      x: [0, 16, -16, 0],
                      opacity: [1, 0, 0, 1],
                    }
                  : { x: 0, opacity: 1 }
              }
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="h-3.5 w-3.5 text-white" />
            </motion.div>
          </div>

          {/* Underline segment directly under Arrow */}
          <motion.span
            animate={
              isHovered
                ? {
                    y: [0, -6, 0],
                    opacity: [1, 0.5, 1],
                  }
                : { y: 0, opacity: 1 }
            }
            transition={{
              duration: 0.35,
              delay: (letters.length + 1) * 0.022,
              ease: "easeInOut",
            }}
            className="mt-1.5 h-[1.5px] w-full bg-white block"
          />
        </span>
      </div>
    </Link>
  );
}
