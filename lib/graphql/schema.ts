import { makeExecutableSchema } from "@graphql-tools/schema";
import { getSavedBlogs } from "@/lib/blog-registry";
import {
  features,
  pricingTiers,
  blogPosts,
  projects,
  activityFeed,
  analyticsSummary,
  weeklyThroughput,
  teamMembers,
  notifications,
} from "./mock-data";

const typeDefs = /* GraphQL */ `
  type Feature {
    id: ID!
    title: String!
    slug: String!
    summary: String!
    detail: String!
  }

  type PricingTier {
    id: ID!
    name: String!
    price: Int!
    cadence: String!
    tagline: String!
    limits: String!
    features: [String!]!
    cta: String!
    highlighted: Boolean!
  }

  type BlogPost {
    id: ID!
    slug: String!
    title: String!
    excerpt: String!
    author: String!
    date: String!
    readMinutes: Int!
    tag: String!
    body: [String!]!
  }

  type Project {
    id: ID!
    name: String!
    description: String
    createdAt: String!
  }

  type ActivityEvent {
    id: ID!
    type: String!
    actor: String!
    detail: String!
    repo: String!
    time: String!
    createdAt: String
  }

  type AnalyticsSummary {
    openPRs: Int!
    avgReviewHours: Float!
    deploysThisWeek: Int!
    incidentsThisWeek: Int!
    activeMembers: Int!
  }

  type ThroughputDay {
    day: String!
    merges: Int!
    incidents: Int!
  }

  type TeamMember {
    id: ID!
    name: String!
    role: String!
    team: String!
    status: String!
    load: Int!
  }

  type Notification {
    id: ID!
    title: String!
    body: String!
    time: String!
    read: Boolean!
  }

  type AuthPayload {
    token: String!
    userEmail: String!
  }

  type AssistantMessage {
    id: ID!
    role: String!
    content: String!
  }

  type Query {
    features: [Feature!]!
    pricingTiers: [PricingTier!]!
    blogPosts: [BlogPost!]!
    blogPost(slug: String!): BlogPost
    projects: [Project!]!
    activityFeed(repo: String): [ActivityEvent!]!
    analyticsSummary: AnalyticsSummary!
    weeklyThroughput: [ThroughputDay!]!
    teamMembers: [TeamMember!]!
    notifications: [Notification!]!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    signup(email: String!, password: String!): AuthPayload!
    requestPasswordReset(email: String!): Boolean!
    markNotificationRead(id: ID!): Notification!
    addNotification(title: String!, body: String!): Notification!
    addProject(name: String!, description: String): Project!
    addActivityEvent(type: String!, actor: String!, detail: String!, repo: String!): ActivityEvent!
    updateActivityEvent(id: ID!, type: String, actor: String, detail: String, repo: String): ActivityEvent!
    deleteActivityEvent(id: ID!): Boolean!
    deleteProject(name: String!): Boolean!
    inviteMember(email: String!, role: String!): TeamMember!
    sendAssistantMessage(content: String!): AssistantMessage!
  }
`;

function getSavedProjects() {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("pulse_projects_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }
  return projects;
}

function getSavedActivityFeed() {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("pulse_activity_feed_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }
  return activityFeed;
}

function getSavedNotifications() {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("pulse_notifications_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }
  return notifications;
}

function saveNotifications(list: any[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("pulse_notifications_data", JSON.stringify(list));
    } catch (e) {}
  }
}

function computeDynamicAnalytics() {
  const feed = getSavedActivityFeed();

  const mergesCount = feed.filter((e: any) => e.type === "merge").length;
  const reviewsCount = feed.filter((e: any) => e.type === "review" || e.type === "comment").length;
  const deploysCount = feed.filter((e: any) => e.type === "deploy").length;
  const incidentsCount = feed.filter((e: any) => e.type === "incident").length;

  return {
    openPRs: reviewsCount > 0 ? reviewsCount : 4,
    avgReviewHours: reviewsCount > 0 ? Math.round((3.5 + (reviewsCount % 4) * 0.7) * 10) / 10 : 4.5,
    deploysThisWeek: deploysCount > 0 ? deploysCount : 12,
    incidentsThisWeek: incidentsCount,
    activeMembers: teamMembers.length,
  };
}

function computeDynamicThroughput() {
  const feed = getSavedActivityFeed();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const dayCounts: Record<string, { merges: number; incidents: number }> = {
    Mon: { merges: 2, incidents: 0 },
    Tue: { merges: 4, incidents: 0 },
    Wed: { merges: 3, incidents: 0 },
    Thu: { merges: 5, incidents: 0 },
    Fri: { merges: 4, incidents: 0 },
    Sat: { merges: 1, incidents: 0 },
    Sun: { merges: 1, incidents: 0 },
  };

  feed.forEach((item: any, idx: number) => {
    const dayKey = days[idx % days.length];
    if (item.type === "merge" || item.type === "deploy") {
      dayCounts[dayKey].merges += 2;
    } else if (item.type === "incident") {
      dayCounts[dayKey].incidents += 1;
    }
  });

  return days.map((day) => ({
    day,
    merges: dayCounts[day].merges,
    incidents: dayCounts[day].incidents,
  }));
}

const resolvers = {
  Query: {
    features: () => features,
    pricingTiers: () => pricingTiers,
    blogPosts: async () => {
      return getSavedBlogs();
    },
    blogPost: async (_: unknown, { slug }: { slug: string }) => {
      const blogs = getSavedBlogs();
      return blogs.find((p: any) => p.slug === slug) ?? null;
    },
    projects: () => getSavedProjects(),
    activityFeed: (_: unknown, { repo }: { repo?: string }) => {
      const feed = getSavedActivityFeed();
      if (repo && repo !== "all") {
        return feed.filter((item: any) => item.repo === repo);
      }
      return feed;
    },
    analyticsSummary: () => computeDynamicAnalytics(),
    weeklyThroughput: () => computeDynamicThroughput(),
    teamMembers: () => teamMembers,
    notifications: () => getSavedNotifications(),
  },
  Mutation: {
    login: (_: unknown, { email }: { email: string }) => ({
      token: "mock-jwt-token",
      userEmail: email,
    }),
    signup: (_: unknown, { email }: { email: string }) => ({
      token: "mock-jwt-token",
      userEmail: email,
    }),
    requestPasswordReset: () => true,
    markNotificationRead: (_: unknown, { id }: { id: string }) => {
      let currentList = getSavedNotifications();
      const n = currentList.find((item: any) => item.id === id);
      if (n) {
        n.read = true;
        saveNotifications(currentList);
      }
      return n;
    },
    addNotification: (_: unknown, { title, body }: { title: string; body: string }) => {
      let currentList = getSavedNotifications();
      const newNotif = {
        id: `n-${Date.now()}`,
        title,
        body,
        time: "Just now",
        read: false,
      };
      currentList = [newNotif, ...currentList];
      saveNotifications(currentList);
      notifications.unshift(newNotif);
      return newNotif;
    },
    addProject: (_: unknown, { name, description }: { name: string; description?: string }) => {
      let currentProjects = getSavedProjects();
      const existing = currentProjects.find((p: any) => p.name.toLowerCase() === name.toLowerCase());
      if (existing) return existing;

      const newProj = {
        id: `p-${Date.now()}`,
        name,
        description: description || "Custom Project Repository",
        createdAt: new Date().toISOString().split("T")[0],
      };
      currentProjects = [newProj, ...currentProjects];
      projects.unshift(newProj);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("pulse_projects_data", JSON.stringify(currentProjects));
        } catch (e) {}
      }
      return newProj;
    },
    addActivityEvent: (_: unknown, { type, actor, detail, repo }: { type: string; actor: string; detail: string; repo: string }) => {
      let currentProjects = getSavedProjects();
      if (!currentProjects.some((p: any) => p.name.toLowerCase() === repo.toLowerCase())) {
        const newProj = {
          id: `p-${Date.now()}`,
          name: repo,
          description: "Project repository",
          createdAt: new Date().toISOString().split("T")[0],
        };
        currentProjects = [newProj, ...currentProjects];
        projects.unshift(newProj);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("pulse_projects_data", JSON.stringify(currentProjects));
          } catch (e) {}
        }
      }

      let currentFeed = getSavedActivityFeed();
      const newEvent = {
        id: `a-${Date.now()}`,
        type,
        actor,
        detail,
        repo,
        time: "Just now",
        createdAt: new Date().toISOString(),
      };
      currentFeed = [newEvent, ...currentFeed];
      activityFeed.unshift(newEvent);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("pulse_activity_feed_data", JSON.stringify(currentFeed));
        } catch (e) {}
      }
      return newEvent;
    },
    updateActivityEvent: (
      _: unknown,
      { id, type, actor, detail, repo }: { id: string; type?: string; actor?: string; detail?: string; repo?: string }
    ) => {
      let currentFeed = getSavedActivityFeed();
      const idx = currentFeed.findIndex((e: any) => e.id === id);
      if (idx !== -1) {
        if (type) currentFeed[idx].type = type;
        if (actor) currentFeed[idx].actor = actor;
        if (detail) currentFeed[idx].detail = detail;
        if (repo) currentFeed[idx].repo = repo;

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("pulse_activity_feed_data", JSON.stringify(currentFeed));
          } catch (e) {}
        }
        return currentFeed[idx];
      }
      throw new Error("Event not found");
    },
    deleteActivityEvent: (_: unknown, { id }: { id: string }) => {
      let currentFeed = getSavedActivityFeed();
      const filtered = currentFeed.filter((e: any) => e.id !== id);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("pulse_activity_feed_data", JSON.stringify(filtered));
        } catch (e) {}
      }
      return true;
    },
    deleteProject: (_: unknown, { name }: { name: string }) => {
      let currentProjects = getSavedProjects();
      const filteredProjects = currentProjects.filter((p: any) => p.name.toLowerCase() !== name.toLowerCase());
      let currentFeed = getSavedActivityFeed();
      const filteredFeed = currentFeed.filter((e: any) => e.repo.toLowerCase() !== name.toLowerCase());

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("pulse_projects_data", JSON.stringify(filteredProjects));
          localStorage.setItem("pulse_activity_feed_data", JSON.stringify(filteredFeed));
        } catch (e) {}
      }
      return true;
    },
    inviteMember: (_: unknown, { email, role }: { email: string; role: string }) => ({
      id: `m${teamMembers.length + 1}`,
      name: email.split("@")[0],
      role,
      team: "Unassigned",
      status: "invited",
      load: 0,
    }),
    sendAssistantMessage: (_: unknown, { content }: { content: string }) => ({
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: buildAssistantReply(content),
    }),
  },
};

function buildAssistantReply(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("ship") || q.includes("deploy") || q.includes("this week")) {
    return [
      `**${analyticsSummary.deploysThisWeek} deploys** shipped this week across your connected repos, with **${analyticsSummary.incidentsThisWeek} incident** along the way.`,
      "",
      "Most recent activity:",
      ...activityFeed.slice(0, 3).map((e) => `- **${e.actor}** ${e.detail} _(${e.repo}, ${e.time})_`),
    ].join("\n");
  }

  if (q.includes("block") || q.includes("stuck") || q.includes("stall")) {
    return [
      `There are **${analyticsSummary.openPRs} open PRs** right now, averaging **${analyticsSummary.avgReviewHours}h** to first review.`,
      "",
      "If any of these are sitting past that average, they're worth a nudge in `#pulse-web` or `#pulse-api`.",
    ].join("\n");
  }

  if (q.includes("load") || q.includes("overload") || q.includes("burnout")) {
    const high = teamMembers.filter((m) => m.load > 80);
    return [
      high.length
        ? `**${high.map((m) => m.name).join(", ")}** ${high.length > 1 ? "are" : "is"} running above 80% load this week.`
        : "Nobody is above 80% load this week — team load looks balanced.",
      "",
      "Worth raising in your next 1:1 if this has been climbing for more than a week.",
    ].join("\n");
  }

  if (q.includes("incident")) {
    return [
      "**1 incident** this week: elevated error rate on `/events` in `pulse-api`, first flagged 41 minutes ago.",
      "",
      "It's since been resolved — timeline and root cause are in the Activity tab.",
    ].join("\n");
  }

  return [
    `I can answer questions about your team's activity, review load, deploys and incidents — try asking **"what shipped this week"** or **"who's blocked right now"**.`,
    "",
    `_This is a mock response — the real Pulse Assistant reads your live event feed._`,
  ].join("\n");
}

export const schema = makeExecutableSchema({ typeDefs, resolvers });
