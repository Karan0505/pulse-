"use client";

import { useState } from "react";
import { Video, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function CalendlyBooking() {
  const [isOpen, setIsOpen] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-canvas-line bg-canvas-raised p-6 md:p-8 shadow-2xl transition-all">
      {/* Full Width Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-pulse animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-pulse">
              30 Min Free Call
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold text-text-primary flex items-center gap-3">
            <Video className="h-7 w-7 text-accent shrink-0" />
            Book 30-Min Free Intro Call
          </h2>
          <p className="mt-1.5 font-body text-sm text-text-muted">
            Click &apos;Schedule 30-Min Call&apos; to view available dates &amp; time slots via Calendly.
          </p>
        </div>

        <div>
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen) setIframeLoading(true);
            }}
            className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-body text-sm font-semibold text-canvas transition-all hover:opacity-90 shadow-lg shrink-0"
          >
            <CalendarIcon className="h-4 w-4" />
            {isOpen ? "Hide Schedule Calendar" : "Schedule 30-Min Call"}
          </button>
        </div>
      </div>

      {/* Official Live Calendly Web Embed (karanparmar552003/30min) */}
      {isOpen && (
        <div className="mt-8 border-t border-canvas-line pt-0 overflow-hidden rounded-2xl border border-canvas-line bg-canvas p-1 relative shadow-2xl min-h-[700px] animate-in fade-in slide-in-from-top-4 duration-300">
          {iframeLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-canvas-raised p-8 animate-pulse space-y-6">
              <div className="flex items-center gap-2 text-accent font-mono text-xs font-semibold">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading Calendly Calendar...
              </div>
              <Skeleton className="h-8 w-64" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
              <Skeleton className="h-80 w-full max-w-3xl" />
            </div>
          )}
          <iframe
            onLoad={() => setIframeLoading(false)}
            src="https://calendly.com/karanparmar552003/30min?embed_type=Inline"
            width="100%"
            height="700"
            frameBorder="0"
            title="Select a Date & Time - Calendly"
            className="w-full h-[700px] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
