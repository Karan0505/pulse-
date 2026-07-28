import { LucideIcon } from "lucide-react";
import clsx from "clsx";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  loading,
}: {
  label: string;
  value: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  tone?: "default" | "danger" | "pulse";
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-canvas-line bg-canvas-raised p-5 space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 rounded bg-canvas-line/60" />
          <div className="h-4 w-4 rounded-full bg-canvas-line/60" />
        </div>
        <div className="h-8 w-16 rounded bg-canvas-line/80" />
      </div>
    );
  }

  const labelLower = label.toLowerCase();
  const isTimer = labelLower.includes("time") || labelLower.includes("timer");
  const isDeploy = labelLower.includes("deploy");
  const isMember = labelLower.includes("member");
  const isPR = labelLower.includes("pr");
  const isIncident = labelLower.includes("incident");

  const colorClass = clsx(
    "h-4 w-4 transition-colors duration-300",
    tone === "danger" && "text-danger",
    tone === "pulse" && "text-pulse",
    tone === "default" && "text-accent"
  );

  return (
    <div className="group rounded-2xl border border-canvas-line bg-canvas-raised p-5 transition-all duration-300 hover:border-canvas-line/80 hover:bg-canvas-raised/80">
      {/* Keyframe Styles for smooth custom animations without rewind */}
      <style jsx>{`
        @keyframes stopwatchSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .group:hover .stopwatch-arrow {
          animation: stopwatchSpin 0.6s ease-in-out forwards;
        }

        @keyframes realRocketLaunch {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          12% {
            transform: translate(-1px, 1px) rotate(-3deg);
          }
          24% {
            transform: translate(1px, -1px) rotate(3deg);
          }
          36% {
            transform: translate(-1.5px, -1.5px) rotate(-2deg);
          }
          62% {
            transform: translate(24px, -24px) rotate(0deg);
            opacity: 0;
          }
          67% {
            transform: translate(-22px, 22px) rotate(0deg);
            opacity: 0;
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
        }
        .group:hover .rocket-container {
          animation: realRocketLaunch 0.85s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes flameFlicker {
          0%,
          100% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.4) translate(-2px, 2px);
          }
        }
        .group:hover .rocket-flame {
          animation: flameFlicker 0.12s infinite ease-in-out;
        }

        @keyframes alertShake {
          0%,
          100% {
            transform: rotate(0deg);
          }
          20% {
            transform: rotate(-12deg);
          }
          40% {
            transform: rotate(12deg);
          }
          60% {
            transform: rotate(-8deg);
          }
          80% {
            transform: rotate(8deg);
          }
        }
        .group:hover .alert-svg {
          animation: alertShake 0.5s ease-in-out;
        }

        @keyframes prMergeCommit {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          65% {
            transform: translate(-12px, -12px);
            opacity: 1;
          }
          80% {
            transform: translate(-12px, -12px);
            opacity: 0;
          }
          100% {
            transform: translate(0, 0);
            opacity: 0;
          }
        }
        .group:hover .pr-commit-dot {
          animation: prMergeCommit 0.75s ease-in-out forwards;
        }
      `}</style>

      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-text-muted">{label}</span>

        {/* 1. AVG REVIEW TIME: Stopwatch SVG with non-rewinding 360° arrow rotation */}
        {isTimer && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={colorClass}
          >
            {/* Top knob & stem */}
            <line x1="10" x2="14" y1="2" y2="2" />
            <line x1="12" x2="12" y1="2" y2="6" />
            {/* Outer clock circle */}
            <circle cx="12" cy="14" r="8" />
            {/* Inner arrow / hand rotating 360° without rewind */}
            <line
              x1="12"
              y1="14"
              x2="15"
              y2="11"
              className="stopwatch-arrow"
              style={{ transformOrigin: "12px 14px" }}
            />
          </svg>
        )}

        {/* 2. DEPLOYS: Real Rocket Launch SVG with engine rumble, tail flame flare & space launch */}
        {isDeploy && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={clsx(colorClass, "rocket-container overflow-visible")}
          >
            {/* Rocket Main Body & Wings */}
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />

            {/* Thruster Tail Flame (zoomed in 2nd image): Engine fire ignition flicker & glow */}
            <g className="rocket-flame origin-[4px_17px]">
              <path
                d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
                className="transition-colors duration-300 group-hover:stroke-amber-400 group-hover:fill-amber-400/40"
              />
              {/* Extra Fire Thrust Lines */}
              <path
                d="M2 22l3-3M1 18l3-1M6 23l-1-3"
                className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:stroke-amber-500"
                strokeWidth="1.5"
              />
            </g>
          </svg>
        )}

        {/* 3. TOTAL MEMBERS: Users SVG with 3 crystal clear, perfectly spaced members (Left X=6, Center X=14, Right X=22) */}
        {isMember && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 28 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={clsx(
              "h-4 w-5 transition-colors duration-300 overflow-visible",
              tone === "danger" && "text-danger",
              tone === "pulse" && "text-pulse",
              tone === "default" && "text-accent"
            )}
          >
            {/* Center Member (Main) */}
            <circle cx="14" cy="6" r="3.2" />
            <path d="M9.5 21v-2a4 4 0 0 1 9 0v2" />

            {/* Right Member */}
            <circle cx="22" cy="7" r="2.8" />
            <path d="M26 21v-1.5a3 3 0 0 0-3-3h-2" />

            {/* Left Member (3rd Member that slides in smoothly from left on hover) */}
            <g className="transition-all duration-300 ease-out opacity-0 -translate-x-3 scale-75 origin-left group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100">
              <circle cx="6" cy="7" r="2.8" />
              <path d="M2 21v-1.5a3 3 0 0 1 3-3h2" />
            </g>
          </svg>
        )}

        {/* 4. OPEN PRS: GitPullRequest SVG with animated Pull Request commit merge animation */}
        {isPR && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={clsx(colorClass, "overflow-visible")}
          >
            {/* Main Branch Line (Left) */}
            <line x1="6" x2="6" y1="9" y2="21" />

            {/* Main Branch Target Node (Top Left) - Flashes & Expands when PR merges */}
            <circle
              cx="6"
              cy="6"
              r="3"
              className="transition-transform duration-300 group-hover:scale-125 group-hover:stroke-amber-400"
            />

            {/* PR Source Node (Bottom Right) - Pulses on hover */}
            <circle
              cx="18"
              cy="18"
              r="3"
              className="transition-transform duration-300 group-hover:scale-110 group-hover:stroke-amber-400"
            />

            {/* Connecting PR Branch Curve Line */}
            <path
              d="M13 6h3a2 2 0 0 1 2 2v7"
              className="transition-all duration-300 group-hover:stroke-amber-400 group-hover:stroke-[2.5]"
            />

            {/* Traveling Commit Node: Slides from PR branch up into Main Branch on hover */}
            <circle
              cx="18"
              cy="18"
              r="2"
              fill="currentColor"
              className="pr-commit-dot text-amber-400 opacity-0"
            />
          </svg>
        )}

        {/* 5. INCIDENTS: TriangleAlert SVG with warning shake & pulse */}
        {isIncident && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={clsx(colorClass, "alert-svg")}
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" x2="12" y1="9" y2="13" className="transition-opacity duration-300 group-hover:animate-pulse" />
            <line x1="12" x2="12.01" y1="17" y2="17" />
          </svg>
        )}

        {/* Fallback for any other custom icon */}
        {!isTimer && !isDeploy && !isMember && !isPR && !isIncident && (
          <Icon className={clsx(colorClass, "transition-transform duration-300 group-hover:scale-110")} />
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
