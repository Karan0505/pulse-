"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export function InitialLoader() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Increment counter smoothly from 0 to 100
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
          }, 200);
          return 100;
        }
        const diff = 100 - prev;
        const inc = Math.max(2, Math.min(Math.floor(Math.random() * 6 + 4), Math.ceil(diff / 2)));
        return Math.min(100, prev + inc);
      });
    }, 24);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="minimal-preloader"
          initial={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: "-100%",
            transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0b0e14] text-white select-none overflow-hidden"
        >
          {/* Subtle Ambient Background Glow */}
          <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-[#FFB454]/10 blur-[100px]" />

          {/* Minimal Compact Counter Container */}
          <div className="relative flex flex-col items-center space-y-4">
            {/* Small Brand Header */}
            <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-text-muted">
              <Zap className="h-4 w-4 text-[#FFB454] fill-[#FFB454]/20 animate-pulse" />
              <span>PULSE</span>
            </div>

            {/* Small Elegant Percentage Counter */}
            <div className="font-mono text-3xl md:text-4xl font-bold tracking-tight text-[#FFB454]">
              {progress}%
            </div>

            {/* Thin Glowing Line Progress Bar */}
            <div className="relative h-1 w-48 overflow-hidden rounded-full bg-[#1c222e]">
              <motion.div
                className="h-full bg-[#FFB454] shadow-[0_0_12px_#FFB454]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.05 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
