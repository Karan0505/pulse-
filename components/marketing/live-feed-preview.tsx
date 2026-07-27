"use client";

import { useQuery } from "@apollo/client/react";
import { motion } from "framer-motion";
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

export function LiveFeedPreview() {
  const { data, loading } = useQuery<{ activityFeed: Event[] }>(GET_ACTIVITY_FEED, {
    pollInterval: 8000,
  });

  return (
    <div className="rounded-2xl border border-canvas-line bg-canvas-raised p-2">
      <div className="flex items-center justify-between border-b border-canvas-line px-4 py-3">
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
          Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="h-16 animate-pulse px-4 py-3" />
          ))}
        {data?.activityFeed.slice(0, 5).map((e, i) => {
          const Icon = iconFor[e.type] ?? GitMerge;
          return (
            <motion.li
              key={e.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-start gap-3 px-4 py-3"
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${colorFor[e.type] ?? "text-text-muted"}`} />
              <div className="min-w-0">
                <p className="truncate font-body text-sm text-text-primary">
                  <span className="font-medium">{e.actor}</span> {e.detail}
                </p>
                <p className="mt-0.5 font-mono text-xs text-text-muted">
                  {e.repo} · {e.time}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
