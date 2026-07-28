"use client";

import { useQuery } from "@apollo/client/react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { GET_WEEKLY_THROUGHPUT } from "@/lib/graphql/queries";

type Day = { day: string; merges: number; incidents: number };

export function ThroughputChart() {
  const { data, loading } = useQuery<{ weeklyThroughput: Day[] }>(GET_WEEKLY_THROUGHPUT, {
    pollInterval: 3000,
  });

  if (loading) {
    return (
      <div className="rounded-2xl border border-canvas-line bg-canvas-raised p-5 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-4 w-36 rounded bg-canvas-line/60" />
          <div className="flex gap-4">
            <div className="h-3 w-16 rounded bg-canvas-line/50" />
            <div className="h-3 w-16 rounded bg-canvas-line/50" />
          </div>
        </div>
        <div className="h-56 flex items-end justify-between gap-3 pt-6">
          {[40, 75, 50, 85, 60, 45, 30].map((h, i) => (
            <div key={i} className="w-full flex flex-col justify-end h-full">
              <div className="w-full rounded-t bg-canvas-line/40" style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-canvas-line bg-canvas-raised p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Weekly throughput</h3>
        <div className="flex items-center gap-4 font-mono text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" /> merges
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-danger" /> incidents
          </span>
        </div>
      </div>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data?.weeklyThroughput}>
            <CartesianGrid stroke="var(--canvas-line)" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="var(--text-muted)"
              tick={{ fontSize: 12, fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "var(--canvas-line)" }}
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-muted)"
              tick={{ fontSize: 12, fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: "var(--canvas)",
                border: "1px solid var(--canvas-line)",
                borderRadius: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--text-primary)" }}
            />
            <Bar dataKey="merges" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Line
              type="monotone"
              dataKey="incidents"
              stroke="var(--danger)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--danger)" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
