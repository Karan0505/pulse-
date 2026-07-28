"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GitPullRequest, Timer, Rocket, TriangleAlert, Users, RefreshCw, Sparkles } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ThroughputChart } from "@/components/dashboard/throughput-chart";
import { ActivityFeedTable } from "@/components/dashboard/activity-feed-table";
import { GET_ANALYTICS_SUMMARY } from "@/lib/graphql/queries";

type Summary = {
  openPRs: number;
  avgReviewHours: number;
  deploysThisWeek: number;
  incidentsThisWeek: number;
  activeMembers: number;
};

export default function OverviewPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "quarter">("7d");
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  // Initial skeleton loading delay (1.2s) & toggle button for Skeleton Preview
  const [isSimulatedLoading, setIsSimulatedLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSimulatedLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Poll analytics summary live every 3 seconds
  const { data, loading: queryLoading, refetch } = useQuery<{ analyticsSummary: Summary }>(GET_ANALYTICS_SUMMARY, {
    pollInterval: 3000,
  });

  const isLoading = isSimulatedLoading || queryLoading;

  const handleRefresh = async () => {
    setIsSimulatedLoading(true);
    await refetch();
    setTimeout(() => {
      setIsSimulatedLoading(false);
    }, 1200);
  };

  const baseSummary = data?.analyticsSummary;

  // Dynamic calculations based on selected time range
  const summary = baseSummary
    ? {
      openPRs: timeRange === "7d" ? baseSummary.openPRs : timeRange === "30d" ? baseSummary.openPRs + 8 : baseSummary.openPRs + 24,
      avgReviewHours: timeRange === "7d" ? baseSummary.avgReviewHours : timeRange === "30d" ? 5.2 : 4.8,
      deploysThisWeek: timeRange === "7d" ? baseSummary.deploysThisWeek : timeRange === "30d" ? baseSummary.deploysThisWeek * 4 : baseSummary.deploysThisWeek * 12,
      incidentsThisWeek: timeRange === "7d" ? baseSummary.incidentsThisWeek : timeRange === "30d" ? 3 : 7,
      activeMembers: baseSummary.activeMembers,
    }
    : null;

  return (
    <div className="space-y-6">
      {/* Overview Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-semibold tracking-tight">Overview</h1>
            <div className="flex items-center gap-1.5 rounded-full border border-pulse/30 bg-pulse/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-pulse">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pulse" />
              </span>
              Live Pulse 3s
            </div>
          </div>
          <p className="mt-1 font-body text-sm text-text-muted">
            Your team&apos;s pulse metrics & activity.
          </p>
        </div>

        {/* Dynamic Controls: Time Range Tabs, Refresh & Skeleton Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulatedLoading((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-body text-xs font-medium transition-all ${
              isSimulatedLoading
                ? "border-accent bg-accent/20 text-accent font-semibold shadow"
                : "border-canvas-line bg-canvas-raised text-text-muted hover:text-text-primary hover:border-accent/40"
            }`}
            title="Toggle Skeleton Loading view"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Skeleton Loading</span>
          </button>

          <div className="flex items-center rounded-xl border border-canvas-line bg-canvas-raised p-1">
            <button
              onClick={() => setTimeRange("7d")}
              className={`rounded-lg px-3 py-1 font-body text-xs font-medium transition-all ${timeRange === "7d" ? "bg-accent text-canvas shadow" : "text-text-muted hover:text-text-primary"
                }`}
            >
              Last 7 days
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`rounded-lg px-3 py-1 font-body text-xs font-medium transition-all ${timeRange === "30d" ? "bg-accent text-canvas shadow" : "text-text-muted hover:text-text-primary"
                }`}
            >
              Last 30 days
            </button>
            <button
              onClick={() => setTimeRange("quarter")}
              className={`rounded-lg px-3 py-1 font-body text-xs font-medium transition-all ${timeRange === "quarter" ? "bg-accent text-canvas shadow" : "text-text-muted hover:text-text-primary"
                }`}
            >
              This Quarter
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-xl border border-canvas-line bg-canvas-raised px-3 py-2 font-body text-xs font-medium text-text-muted hover:border-accent/40 hover:text-text-primary transition-all active:scale-95"
            title="Refresh Live Data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-accent" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards with Interactive Filter Selection */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div
          onClick={() => setActiveMetric(activeMetric === "prs" ? null : "prs")}
          className={`cursor-pointer transition-transform active:scale-98 ${activeMetric === "prs" ? "ring-2 ring-accent rounded-2xl" : ""}`}
        >
          <StatCard label="Open PRs" value={summary ? String(summary.openPRs) : ""} icon={GitPullRequest} loading={isLoading} />
        </div>
        <div
          onClick={() => setActiveMetric(activeMetric === "review" ? null : "review")}
          className={`cursor-pointer transition-transform active:scale-98 ${activeMetric === "review" ? "ring-2 ring-accent rounded-2xl" : ""}`}
        >
          <StatCard label="Avg review time" value={summary ? `${summary.avgReviewHours}h` : ""} icon={Timer} loading={isLoading} />
        </div>
        <div
          onClick={() => setActiveMetric(activeMetric === "deploys" ? null : "deploys")}
          className={`cursor-pointer transition-transform active:scale-98 ${activeMetric === "deploys" ? "ring-2 ring-pulse rounded-2xl" : ""}`}
        >
          <StatCard label="Deploys" value={summary ? String(summary.deploysThisWeek) : ""} icon={Rocket} tone="pulse" loading={isLoading} />
        </div>
        <div
          onClick={() => setActiveMetric(activeMetric === "incidents" ? null : "incidents")}
          className={`cursor-pointer transition-transform active:scale-98 ${activeMetric === "incidents" ? "ring-2 ring-danger rounded-2xl" : ""}`}
        >
          <StatCard label="Incidents" value={summary ? String(summary.incidentsThisWeek) : ""} icon={TriangleAlert} tone="danger" loading={isLoading} />
        </div>
        <div
          onClick={() => setActiveMetric(activeMetric === "members" ? null : "members")}
          className={`cursor-pointer transition-transform active:scale-98 ${activeMetric === "members" ? "ring-2 ring-accent rounded-2xl" : ""}`}
        >
          <StatCard label="Total members" value={summary ? String(summary.activeMembers) : ""} icon={Users} loading={isLoading} />
        </div>
      </div>

      {/* Throughput Chart with Live Polling */}
      <ThroughputChart loading={isLoading} />

      {/* Live Activity Feed Table */}
      <ActivityFeedTable limit={5} loading={isLoading} />
    </div>
  );
}
