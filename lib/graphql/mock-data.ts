export const features = [
  {
    id: "f1",
    title: "Lightning Fast",
    slug: "lightning-fast",
    summary: "Built on Next.js 14 with edge rendering and smart caching for sub-100ms response times.",
    detail: "Built on Next.js 14 with edge rendering and smart caching for sub-100ms response times.",
  },
  {
    id: "f2",
    title: "Enterprise Security",
    slug: "enterprise-security",
    summary: "JWT auth, RBAC, OAuth providers, and industry-standard encryption out of the box.",
    detail: "JWT auth, RBAC, OAuth providers, and industry-standard encryption out of the box.",
  },
  {
    id: "f3",
    title: "Real-time Analytics",
    slug: "real-time-analytics",
    summary: "Live dashboards powered by GraphQL subscriptions and WebSockets.",
    detail: "Live dashboards powered by GraphQL subscriptions and WebSockets.",
  },
  {
    id: "f4",
    title: "Team Collaboration",
    slug: "team-collaboration",
    summary: "Presence indicators, activity feeds, and shared workspaces for distributed teams.",
    detail: "Presence indicators, activity feeds, and shared workspaces for distributed teams.",
  },
  {
    id: "f5",
    title: "Global Scale",
    slug: "global-scale",
    summary: "Multi-region deployment with Redis caching and CDN-optimized assets.",
    detail: "Multi-region deployment with Redis caching and CDN-optimized assets.",
  },
  {
    id: "f6",
    title: "AI-Powered",
    slug: "ai-powered",
    summary: "Integrated AI assistant with streaming responses and contextual intelligence.",
    detail: "Integrated AI assistant with streaming responses and contextual intelligence.",
  },
];

export const pricingTiers = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    cadence: "forever",
    tagline: "For a single team finding its footing.",
    limits: "Up to 8 members",
    features: [
      "Live pulse feed",
      "7-day activity history",
      "1 connected repository",
      "Community support",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    id: "team",
    name: "Team",
    price: 18,
    cadence: "per member / month",
    tagline: "For teams shipping every week and want to stay ahead of it.",
    limits: "Unlimited members",
    features: [
      "Everything in Starter",
      "Unlimited history",
      "Unlimited repositories",
      "Review latency tracking",
      "Custom alerts",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    highlighted: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 34,
    cadence: "per member / month",
    tagline: "For orgs running Pulse across many teams.",
    limits: "Unlimited members",
    features: [
      "Everything in Team",
      "Multi-team rollups",
      "Pulse Assistant",
      "SSO & audit logs",
      "Dedicated onboarding",
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];

export const blogPosts = [
  {
    id: "b1",
    slug: "measuring-review-latency",
    title: "What review latency actually tells you about a team",
    excerpt:
      "Time-to-merge is a noisy metric on its own. Here's the version that actually predicts burnout.",
    author: "Renu Kapoor",
    date: "2026-06-02",
    readMinutes: 6,
    tag: "Engineering",
    body: [
      "Most teams track time-to-merge because it's the easiest number to pull out of a git log. It's also, on its own, close to useless — a PR that sits for three days because everyone agreed to review it Friday afternoon looks identical in the data to a PR that's actively blocking someone.",
      "The signal that matters is time-to-first-response split from time-to-merge. The first tells you whether people feel unblocked quickly. The second tells you whether the review process itself is heavy. Teams that are healthy but slow have a short first number and a long second one. Teams that are quietly struggling have both numbers creeping up together.",
      "When we started surfacing the split instead of a single blended average, the conversation in retros changed immediately — from 'reviews are slow' to 'Priya's queue is the bottleneck, let's rebalance it', which is a conversation you can actually act on.",
    ],
  },
  {
    id: "b2",
    slug: "on-call-without-the-dread",
    title: "Redesigning on-call around a feed, not a pager",
    excerpt:
      "A pager tells you something is wrong. A feed tells you what's been wrong for a while and what's about to be.",
    author: "Dev Malhotra",
    date: "2026-05-18",
    readMinutes: 5,
    tag: "Reliability",
    body: [
      "Pager fatigue isn't really about volume — it's about context. Every alert arrives as an island: no history, no sense of whether this is the third time this week or the first time this year.",
      "We started keeping an incident timeline that stitches alerts, deploys and chat activity into one ordered record per incident. On-call engineers stopped opening five tabs to reconstruct what happened before deciding whether to escalate.",
      "The unexpected benefit was in postmortems. Half the timeline was already written, sourced, and linked — which meant the postmortem doc became a place to write conclusions, not archaeology.",
    ],
  },
  {
    id: "b3",
    slug: "the-1-1-that-starts-with-data",
    title: "The 1:1 that starts with data, not vibes",
    excerpt:
      "Load imbalance is invisible until someone burns out. Here's how we make it visible three weeks earlier.",
    author: "Renu Kapoor",
    date: "2026-04-30",
    readMinutes: 4,
    tag: "Management",
    body: [
      "Most managers find out someone is overloaded when that person tells them, which is usually several weeks after it started. By then the fix is damage control, not prevention.",
      "We built a simple weekly load signal: review volume, after-hours activity and on-call hours, normalized per person. It's not a performance score — it's a conversation starter.",
      "The best 1:1s we've observed now open with 'I noticed your load's been climbing for three weeks, what's going on' instead of a generic status check. It shifts the manager into the role of noticing, which is the part that's easy to miss when you're heads-down yourself.",
    ],
  },
  {
    id: "b4",
    slug: "why-we-built-pulse-assistant",
    title: "Why we built an assistant instead of another dashboard",
    excerpt:
      "Dashboards answer the question you thought to build a chart for. An assistant answers the one you actually have.",
    author: "Arjun Sethi",
    date: "2026-03-11",
    readMinutes: 5,
    tag: "Product",
    body: [
      "Every dashboard we shipped answered a question well — until someone asked a slightly different one, and had to wait for us to build a new chart.",
      "Pulse Assistant reads the same event feed the dashboards are built from, but lets you ask in plain language: 'what shipped to prod this week', 'who's been blocked longest right now', 'summarize yesterday's incident'.",
      "It's deliberately narrow. It answers from your team's actual data with links back to the source events — it doesn't speculate, and it says so when it doesn't have enough signal to answer confidently.",
    ],
  },
];

export const projects = [
  { id: "p1", name: "pulse-api", description: "Backend GraphQL API & microservices", createdAt: "2026-01-15" },
  { id: "p2", name: "pulse-web", description: "Next.js frontend application", createdAt: "2026-01-20" },
  { id: "p3", name: "pulse-assistant", description: "AI Assistant & LLM service", createdAt: "2026-02-01" },
];

const initialNow = Date.now();
export const activityFeed = [
  { id: "a1", type: "merge", actor: "Priya N.", detail: "merged #482 into main", repo: "pulse-api", time: "2m ago", createdAt: new Date(initialNow - 2 * 60 * 1000).toISOString() },
  { id: "a2", type: "review", actor: "Dev M.", detail: "requested changes on #479", repo: "pulse-web", time: "9m ago", createdAt: new Date(initialNow - 9 * 60 * 1000).toISOString() },
  { id: "a3", type: "deploy", actor: "CI", detail: "deployed pulse-api v2.14.0 to production", repo: "pulse-api", time: "22m ago", createdAt: new Date(initialNow - 22 * 60 * 1000).toISOString() },
  { id: "a4", type: "incident", actor: "PagerDuty", detail: "elevated error rate on /events endpoint", repo: "pulse-api", time: "41m ago", createdAt: new Date(initialNow - 41 * 60 * 1000).toISOString() },
  { id: "a5", type: "comment", actor: "Arjun S.", detail: "commented on #479", repo: "pulse-web", time: "1h ago", createdAt: new Date(initialNow - 60 * 60 * 1000).toISOString() },
  { id: "a6", type: "merge", actor: "Renu K.", detail: "merged #475 into main", repo: "pulse-assistant", time: "2h ago", createdAt: new Date(initialNow - 120 * 60 * 1000).toISOString() },
];

export const analyticsSummary = {
  openPRs: 14,
  avgReviewHours: 6.4,
  deploysThisWeek: 23,
  incidentsThisWeek: 1,
  activeMembers: 6,
};

export const weeklyThroughput = [
  { day: "Mon", merges: 12, incidents: 0 },
  { day: "Tue", merges: 18, incidents: 1 },
  { day: "Wed", merges: 9, incidents: 0 },
  { day: "Thu", merges: 21, incidents: 0 },
  { day: "Fri", merges: 15, incidents: 0 },
  { day: "Sat", merges: 3, incidents: 0 },
  { day: "Sun", merges: 2, incidents: 0 },
];


export const teamMembers = [
  { id: "m1", name: "Priya Nair", role: "Admin", team: "Platform", status: "active", load: 82 },
  { id: "m2", name: "Dev Malhotra", role: "Editor", team: "Platform", status: "active", load: 64 },
  { id: "m3", name: "Renu Kapoor", role: "Editor", team: "Web", status: "active", load: 47 },
  { id: "m4", name: "Arjun Sethi", role: "Viewer", team: "Web", status: "invited", load: 0 },
  { id: "m5", name: "Kabir Shah", role: "Editor", team: "Platform", status: "active", load: 91 },
  { id: "m6", name: "Meera Iyer", role: "Viewer", team: "Assistant", status: "active", load: 38 },
];

export const notifications = [
  { id: "n1", title: "PR #482 merged", body: "Priya merged into pulse-api/main", time: "2m ago", read: false },
  { id: "n2", title: "Incident resolved", body: "Error rate spike on /events is back to baseline", time: "38m ago", read: false },
  { id: "n3", title: "Kabir's load is high", body: "91% load for 3 weeks running — worth a check-in", time: "1h ago", read: false },
  { id: "n4", title: "Weekly digest ready", body: "23 deploys, 1 incident, 14 open PRs", time: "6h ago", read: true },
];
