"use client";

import { useRef, createContext, useContext, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import clsx from "clsx";

// Shared Context to coordinate sequential scroll animation across elements
const ScrollSectionContext = createContext<MotionValue<number> | null>(null);

export function ScrollTextSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.25"],
  });

  return (
    <ScrollSectionContext.Provider value={scrollYProgress}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </ScrollSectionContext.Provider>
  );
}

interface ScrollTextFillProps {
  text: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
  accentColor?: string;
  seqRange?: [number, number];
}

function SingleWord({
  children,
  progress,
  range,
  accentColor = "rgba(255, 255, 255, 1)",
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accentColor?: string;
}) {
  // Smooth single-layer opacity & color transition (NO absolute positioning or double-layer overlap)
  const opacity = useTransform(progress, range, [0.22, 1]);
  const color = useTransform(progress, range, [
    "rgba(156, 163, 175, 0.35)",
    accentColor,
  ]);

  return (
    <motion.span
      style={{ opacity, color }}
      className="inline-block mr-[0.25em] font-medium select-none"
    >
      {children}
    </motion.span>
  );
}

export function ScrollTextFill({
  text,
  className,
  as: Component = "p",
  accentColor,
  seqRange = [0, 1],
}: ScrollTextFillProps) {
  const sectionProgress = useContext(ScrollSectionContext);
  const localRef = useRef<HTMLElement>(null);

  const { scrollYProgress: fallbackProgress } = useScroll({
    target: localRef,
    offset: ["start 0.85", "start 0.3"],
  });

  const activeProgress = sectionProgress || fallbackProgress;

  const words = text.split(" ");
  const [seqStart, seqEnd] = seqRange;
  const totalSeqDuration = seqEnd - seqStart;

  return (
    <Component
      ref={localRef as any}
      className={clsx("flex flex-wrap leading-relaxed", className)}
    >
      {words.map((word, i) => {
        const wordStart = seqStart + (i / words.length) * totalSeqDuration;
        const wordEnd = wordStart + (1 / words.length) * totalSeqDuration;
        return (
          <SingleWord
            key={i}
            progress={activeProgress}
            range={[wordStart, wordEnd]}
            accentColor={accentColor}
          >
            {word}
          </SingleWord>
        );
      })}
    </Component>
  );
}
