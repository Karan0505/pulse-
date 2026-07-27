import { gql } from "@apollo/client";

export const GET_FEATURES = gql`
  query GetFeatures {
    features {
      id
      title
      slug
      summary
      detail
    }
  }
`;

export const GET_PRICING = gql`
  query GetPricing {
    pricingTiers {
      id
      name
      price
      cadence
      tagline
      limits
      features
      cta
      highlighted
    }
  }
`;

export const GET_BLOG_POSTS = gql`
  query GetBlogPosts {
    blogPosts {
      id
      slug
      title
      excerpt
      author
      date
      readMinutes
      tag
    }
  }
`;

export const GET_BLOG_POST = gql`
  query GetBlogPost($slug: String!) {
    blogPost(slug: $slug) {
      id
      slug
      title
      excerpt
      author
      date
      readMinutes
      tag
      body
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      createdAt
    }
  }
`;

export const GET_ACTIVITY_FEED = gql`
  query GetActivityFeed($repo: String) {
    activityFeed(repo: $repo) {
      id
      type
      actor
      detail
      repo
      time
      createdAt
    }
  }
`;

export const ADD_PROJECT = gql`
  mutation AddProject($name: String!, $description: String) {
    addProject(name: $name, description: $description) {
      id
      name
      description
      createdAt
    }
  }
`;

export const ADD_ACTIVITY_EVENT = gql`
  mutation AddActivityEvent($type: String!, $actor: String!, $detail: String!, $repo: String!) {
    addActivityEvent(type: $type, actor: $actor, detail: $detail, repo: $repo) {
      id
      type
      actor
      detail
      repo
      time
      createdAt
    }
  }
`;

export const GET_ANALYTICS_SUMMARY = gql`
  query GetAnalyticsSummary {
    analyticsSummary {
      openPRs
      avgReviewHours
      deploysThisWeek
      incidentsThisWeek
      activeMembers
    }
  }
`;

export const GET_WEEKLY_THROUGHPUT = gql`
  query GetWeeklyThroughput {
    weeklyThroughput {
      day
      merges
      incidents
    }
  }
`;

export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers {
    teamMembers {
      id
      name
      role
      team
      status
      load
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      title
      body
      time
      read
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userEmail
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
      userEmail
    }
  }
`;

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      id
      read
    }
  }
`;

export const ADD_NOTIFICATION = gql`
  mutation AddNotification($title: String!, $body: String!) {
    addNotification(title: $title, body: $body) {
      id
      title
      body
      time
      read
    }
  }
`;

export const INVITE_MEMBER = gql`
  mutation InviteMember($email: String!, $role: String!) {
    inviteMember(email: $email, role: $role) {
      id
      name
      role
      team
      status
      load
    }
  }
`;

export const SEND_ASSISTANT_MESSAGE = gql`
  mutation SendAssistantMessage($content: String!) {
    sendAssistantMessage(content: $content) {
      id
      role
      content
    }
  }
`;

export const UPDATE_ACTIVITY_EVENT = gql`
  mutation UpdateActivityEvent($id: ID!, $type: String, $actor: String, $detail: String, $repo: String) {
    updateActivityEvent(id: $id, type: $type, actor: $actor, detail: $detail, repo: $repo) {
      id
      type
      actor
      detail
      repo
      time
    }
  }
`;

export const DELETE_ACTIVITY_EVENT = gql`
  mutation DeleteActivityEvent($id: ID!) {
    deleteActivityEvent(id: $id)
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($name: String!) {
    deleteProject(name: $name)
  }
`;
