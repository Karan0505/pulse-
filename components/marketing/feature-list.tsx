"use client";

import React from "react";
import { Section } from "@/components/ui/section";
import {
  Code2,
  Layout,
  Palette,
  Server,
  Database,
  Cpu,
  Zap,
  RefreshCw,
  Layers,
  FileCode,
  Box,
  Workflow,
  ShieldCheck,
  Lock,
  Gauge,
  Bell,
  Users,
  BarChart3,
  Bot,
  Sparkles,
  LineChart,
} from "lucide-react";

type FeatureCardData = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

type FeatureCategoryData = {
  id: string;
  title: string;
  accentColor: string;
  iconColor: string;
  hoverBorder: string;
  hoverText: string;
  hoverIconBg: string;
  lineGradient: string;
  cards: FeatureCardData[];
};

const categories: FeatureCategoryData[] = [
  {
    id: "frontend",
    title: "Front-End Stack",
    accentColor: "bg-[#FFB454]",
    iconColor: "text-[#FFB454] bg-[#FFB454]/10 border-[#FFB454]/20",
    hoverBorder: "hover:border-[#FFB454]/60 hover:shadow-[0_15px_35px_-10px_rgba(255,180,84,0.25)]",
    hoverText: "group-hover:text-[#FFB454]",
    hoverIconBg: "group-hover:bg-[#FFB454] group-hover:border-[#FFB454] group-hover:text-canvas group-hover:shadow-[0_0_20px_rgba(255,180,84,0.6)]",
    lineGradient: "from-[#FFB454] to-amber-300",
    cards: [
      {
        title: "Next.js 14 & React 18",
        description: "Edge rendering, server components, and dynamic client side hydration for sub-100ms instant UI response times.",
        icon: Layout,
      },
      {
        title: "TypeScript & HTML5/CSS3",
        description: "Strict type-checking, semantic layout structure, and modular component design system architectures out of the box.",
        icon: Code2,
      },
      {
        title: "Tailwind & CSS Modules",
        description: "Utility-first responsive styling, glassmorphism, dynamic theme tokens, and smooth keyframe micro-animations.",
        icon: Palette,
      },
    ],
  },
  {
    id: "backend",
    title: "Back-End Stack",
    accentColor: "bg-[#FFB454]",
    iconColor: "text-[#FFB454] bg-[#FFB454]/10 border-[#FFB454]/20",
    hoverBorder: "hover:border-[#FFB454]/60 hover:shadow-[0_15px_35px_-10px_rgba(255,180,84,0.25)]",
    hoverText: "group-hover:text-[#FFB454]",
    hoverIconBg: "group-hover:bg-[#FFB454] group-hover:border-[#FFB454] group-hover:text-canvas group-hover:shadow-[0_0_20px_rgba(255,180,84,0.6)]",
    lineGradient: "from-[#FFB454] to-amber-300",
    cards: [
      {
        title: "Node.js & Express",
        description: "High-throughput asynchronous non-blocking event loop execution engine for enterprise REST & GraphQL API services.",
        icon: Server,
      },
      {
        title: "GraphQL & Subscriptions",
        description: "Schema-first API layer with automated code generation, real-time WebSocket subscriptions, and query resolvers.",
        icon: Cpu,
      },
      {
        title: "Prisma ORM & PostgreSQL / Redis",
        description: "Type-safe database access with automated migrations, schema diffing, multi-layer query caching, and connection pooling.",
        icon: Database,
      },
    ],
  },
  {
    id: "performance",
    title: "Performance",
    accentColor: "bg-[#FFB454]",
    iconColor: "text-[#FFB454] bg-[#FFB454]/10 border-[#FFB454]/20",
    hoverBorder: "hover:border-[#FFB454]/60 hover:shadow-[0_15px_35px_-10px_rgba(255,180,84,0.25)]",
    hoverText: "group-hover:text-[#FFB454]",
    hoverIconBg: "group-hover:bg-[#FFB454] group-hover:border-[#FFB454] group-hover:text-canvas group-hover:shadow-[0_0_20px_rgba(255,180,84,0.6)]",
    lineGradient: "from-[#FFB454] to-amber-300",
    cards: [
      {
        title: "Edge Rendering",
        description: "Deploy your app to 300+ edge locations globally for sub-10ms first-byte response times with Next.js edge runtime.",
        icon: Zap,
      },
      {
        title: "Smart Caching",
        description: "Multi-layer caching with Redis, Apollo cache normalization, and Next.js ISR. Serve stale-while-revalidate instantly.",
        icon: RefreshCw,
      },
      {
        title: "Code Splitting",
        description: "Automatic code splitting with dynamic imports, lazy loading, and route-level bundles for optimal TTI.",
        icon: Layers,
      },
    ],
  },
  {
    id: "devex",
    title: "Developer Experience",
    accentColor: "bg-[#FFB454]",
    iconColor: "text-[#FFB454] bg-[#FFB454]/10 border-[#FFB454]/20",
    hoverBorder: "hover:border-[#FFB454]/60 hover:shadow-[0_15px_35px_-10px_rgba(255,180,84,0.25)]",
    hoverText: "group-hover:text-[#FFB454]",
    hoverIconBg: "group-hover:bg-[#FFB454] group-hover:border-[#FFB454] group-hover:text-canvas group-hover:shadow-[0_0_20px_rgba(255,180,84,0.6)]",
    lineGradient: "from-[#FFB454] to-amber-300",
    cards: [
      {
        title: "GraphQL First",
        description: "Type-safe GraphQL API with code generation, schema stitching, and a full resolver structure including subscriptions.",
        icon: FileCode,
      },
      {
        title: "Prisma ORM",
        description: "Type-safe database access with auto-migration, schema diffing, and support for PostgreSQL, MySQL, SQLite, MongoDB.",
        icon: Box,
      },
      {
        title: "CI/CD Ready",
        description: "Pre-configured GitHub Actions workflows, Docker containers, and one-click deployment to Vercel or AWS.",
        icon: Workflow,
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    accentColor: "bg-[#FFB454]",
    iconColor: "text-[#FFB454] bg-[#FFB454]/10 border-[#FFB454]/20",
    hoverBorder: "hover:border-[#FFB454]/60 hover:shadow-[0_15px_35px_-10px_rgba(255,180,84,0.25)]",
    hoverText: "group-hover:text-[#FFB454]",
    hoverIconBg: "group-hover:bg-[#FFB454] group-hover:border-[#FFB454] group-hover:text-canvas group-hover:shadow-[0_0_20px_rgba(255,180,84,0.6)]",
    lineGradient: "from-[#FFB454] to-amber-300",
    cards: [
      {
        title: "JWT & OAuth",
        description: "Industry-standard JWT authentication with refresh token rotation and OAuth 2.0 for Google and GitHub.",
        icon: ShieldCheck,
      },
      {
        title: "RBAC",
        description: "Granular role-based access control with Admin, Editor, and Viewer roles at every layer of the stack.",
        icon: Lock,
      },
      {
        title: "Rate Limiting",
        description: "Built-in rate limiting per IP and per user with configurable thresholds and exponential backoff.",
        icon: Gauge,
      },
    ],
  },
  {
    id: "realtime",
    title: "Real-Time",
    accentColor: "bg-[#FFB454]",
    iconColor: "text-[#FFB454] bg-[#FFB454]/10 border-[#FFB454]/20",
    hoverBorder: "hover:border-[#FFB454]/60 hover:shadow-[0_15px_35px_-10px_rgba(255,180,84,0.25)]",
    hoverText: "group-hover:text-[#FFB454]",
    hoverIconBg: "group-hover:bg-[#FFB454] group-hover:border-[#FFB454] group-hover:text-canvas group-hover:shadow-[0_0_20px_rgba(255,180,84,0.6)]",
    lineGradient: "from-[#FFB454] to-amber-300",
    cards: [
      {
        title: "Live Notifications",
        description: "GraphQL subscriptions push real-time notifications to connected clients with zero polling overhead.",
        icon: Bell,
      },
      {
        title: "Presence System",
        description: "Track who's online in your team with WebSocket-based presence indicators and activity signals.",
        icon: Users,
      },
      {
        title: "Live Analytics",
        description: "Dashboards that update in real-time as events come in — no manual refresh needed.",
        icon: BarChart3,
      },
    ],
  },
  {
    id: "ai",
    title: "AI & Intelligence",
    accentColor: "bg-[#FFB454]",
    iconColor: "text-[#FFB454] bg-[#FFB454]/10 border-[#FFB454]/20",
    hoverBorder: "hover:border-[#FFB454]/60 hover:shadow-[0_15px_35px_-10px_rgba(255,180,84,0.25)]",
    hoverText: "group-hover:text-[#FFB454]",
    hoverIconBg: "group-hover:bg-[#FFB454] group-hover:border-[#FFB454] group-hover:text-canvas group-hover:shadow-[0_0_20px_rgba(255,180,84,0.6)]",
    lineGradient: "from-[#FFB454] to-amber-300",
    cards: [
      {
        title: "AI Assistant",
        description: "Integrated ChatGPT-powered assistant with streaming responses, chat history, and context-aware suggestions.",
        icon: Bot,
      },
      {
        title: "Content Generation",
        description: "AI-powered blog post drafting, email generation, and summarization powered by the OpenAI API.",
        icon: Sparkles,
      },
      {
        title: "Predictive Insights",
        description: "Machine learning models analyze your analytics data to surface actionable growth opportunities.",
        icon: LineChart,
      },
    ],
  },
];

export function FeatureList() {
  return (
    <Section className="pb-24 pt-4">
      <div className="space-y-14">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-6">
            {/* Category Header with Colored Accent Bar */}
            <div className="flex items-center gap-3">
              <div className={`h-1 w-8 rounded-full ${cat.accentColor}`} />
              <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">
                {cat.title}
              </h2>
            </div>

            {/* 3-Column Cards Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cat.cards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div
                    key={i}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-canvas-line bg-canvas-raised/40 p-6 backdrop-blur-sm transition-all duration-500 ease-out hover:bg-canvas-raised hover:-translate-y-1.5 cursor-pointer ${cat.hoverBorder}`}
                  >
                    {/* Light Shimmer Sweep across card on hover */}
                    <div className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-1000 ease-out group-hover:left-full group-hover:opacity-100" />

                    <div>
                      {/* Icon Badge Box with Vibrant Color Fill & Glow on Hover */}
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border ${cat.iconColor} transition-all duration-500 group-hover:scale-110 ${cat.hoverIconBg}`}
                      >
                        <Icon className="h-6 w-6 transition-colors duration-500" />
                      </div>

                      {/* Title with Highlight Color on Hover */}
                      <h3
                        className={`mt-5 font-display text-base font-semibold text-text-primary transition-colors duration-300 ${cat.hoverText}`}
                      >
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2.5 font-body text-xs leading-relaxed text-text-muted transition-colors duration-300 group-hover:text-text-primary/90">
                        {card.description}
                      </p>
                    </div>

                    {/* Expanding Bottom Progress Line on Hover */}
                    <div
                      className={`mt-6 h-0.5 w-0 bg-gradient-to-r ${cat.lineGradient} transition-all duration-500 ease-out group-hover:w-full`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
