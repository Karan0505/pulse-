"use client";

import { useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { GET_ACTIVITY_FEED } from "@/lib/graphql/queries";
import { GitMerge, MessageSquare, Rocket, TriangleAlert } from "lucide-react";

type Event = {
  id: string;
  type: string;
  actor: string;
  detail: string;
  repo: string;
  time: string;
};

const iconFor: Record<string, typeof GitMerge> = {
  merge: GitMerge,
  review: MessageSquare,
  comment: MessageSquare,
  deploy: Rocket,
  incident: TriangleAlert,
};

const colorFor: Record<string, string> = {
  merge: "text-pulse",
  review: "text-accent",
  comment: "text-accent",
  deploy: "text-pulse",
  incident: "text-danger",
};

function FeedItem({
  e,
  index,
  total,
  scrollYProgress,
}: {
  e: Event;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const Icon = iconFor[e.type] ?? GitMerge;

  // Staggered horizontal scroll-driven ranges for each item (1st, 2nd, 3rd...)
  const step = 0.85 / Math.max(total, 1);
  const start = index * step;
  const end = Math.min(1, start + step * 1.4);

  const x = useTransform(scrollYProgress, [start, end], [-60, 0]);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const scale = useTransform(scrollYProgress, [start, end], [0.94, 1]);

  return (
    <motion.li
      style={{ x, opacity, scale }}
      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-canvas/40"
    >
      <div className="mt-0.5 relative flex items-center justify-center">
        <Icon className={`h-4 w-4 shrink-0 ${colorFor[e.type] ?? "text-text-muted"}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-sm text-text-primary">
          <span className="font-medium">{e.actor}</span> {e.detail}
        </p>
        <p className="mt-0.5 font-mono text-xs text-text-muted">
          {e.repo} · {e.time}
        </p>
      </div>
    </motion.li>
  );
}

export function LiveFeedPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, loading } = useQuery<{ activityFeed: Event[] }>(GET_ACTIVITY_FEED, {
    pollInterval: 8000,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "start 0.25"],
  });

  const feedItems = data?.activityFeed.slice(0, 5) ?? [];

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-canvas-line bg-canvas-raised p-2 shadow-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-canvas-line px-4 py-3 bg-canvas/40">
        <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
          pulse-api / activity
        </span>
        <span className="flex items-center gap-1.5 font-mono text-xs text-pulse">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pulse" />
          live
        </span>
      </div>
      <ul className="divide-y divide-canvas-line">
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="h-16 animate-pulse px-4 py-3 bg-canvas-line/20" />
          ))}
        {!loading &&
          feedItems.map((e, i) => (
            <FeedItem
              key={e.id}
              e={e}
              index={i}
              total={feedItems.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
      </ul>
    </div>
  );
}
