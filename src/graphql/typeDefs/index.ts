export const typeDefs = `#graphql
  scalar DateTime
  scalar JSON

  enum UserStatus {
    ACTIVE
    INACTIVE
    SUSPENDED
    PENDING
  }

  enum BlogStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  enum NotificationType {
    SYSTEM
    BLOG_COMMENT
    TEAM_INVITE
    ORGANIZATION_UPDATE
    GENERAL
  }

  type PageInfo {
    page: Int!
    limit: Int!
    totalCount: Int!
    totalPages: Int!
  }

  type Permission {
    id: ID!
    action: String!
    resource: String!
    description: String
  }

  enum RoleName {
    ADMIN
    EDITOR
    VIEWER
  }

  type Role {
    id: ID!
    name: String!
    description: String
    permissions: [Permission!]!
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    avatarUrl: String
    isEmailVerified: Boolean!
    status: UserStatus!
    role: Role!
    organization: Organization
    teams: [Team!]!
    blogs: [Blog!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    user: User!
    accessToken: String!
    refreshToken: String!
  }

  type RefreshPayload {
    accessToken: String!
    refreshToken: String!
  }

  type Organization {
    id: ID!
    name: String!
    slug: String!
    logoUrl: String
    owner: User!
    members: [User!]!
    teams: [Team!]!
    blogs: [Blog!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Team {
    id: ID!
    name: String!
    description: String
    organization: Organization!
    members: [User!]!
    blogs: [Blog!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    parent: Category
    children: [Category!]!
    blogs: [Blog!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Tag {
    id: ID!
    name: String!
    slug: String!
    blogs: [Blog!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Comment {
    id: ID!
    content: String!
    blog: Blog!
    author: User!
    parent: Comment
    replies: [Comment!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Blog {
    id: ID!
    title: String!
    slug: String!
    content: String!
    excerpt: String
    coverImage: String
    status: BlogStatus!
    author: User!
    category: Category!
    organization: Organization
    team: Team
    tags: [Tag!]!
    comments: [Comment!]!
    viewCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Notification {
    id: ID!
    userId: ID!
    title: String!
    message: String!
    type: NotificationType!
    isRead: Boolean!
    link: String
    createdAt: DateTime!
  }

  type ActivityLog {
    id: ID!
    userId: ID
    action: String!
    entity: String!
    entityId: String
    details: JSON
    ipAddress: String
    userAgent: String
    createdAt: DateTime!
    user: User
  }

  type AnalyticsMetrics {
    userCount: Int!
    blogCount: Int!
    orgCount: Int!
    teamCount: Int!
  }

  type AIHistory {
    id: ID!
    userId: ID!
    conversationId: String!
    prompt: String!
    response: String!
    tokensUsed: Int!
    model: String!
    createdAt: DateTime!
  }

  type AIResponse {
    historyItem: AIHistory!
    conversationId: String!
  }

  # Paginated Responses
  type UserConnection {
    users: [User!]!
    pageInfo: PageInfo!
  }

  type BlogConnection {
    blogs: [Blog!]!
    pageInfo: PageInfo!
  }

  type OrganizationConnection {
    organizations: [Organization!]!
    pageInfo: PageInfo!
  }

  type TeamConnection {
    teams: [Team!]!
    pageInfo: PageInfo!
  }

  # Input Types
  input SignupInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    avatarUrl: String
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  input CreateBlogInput {
    title: String!
    content: String!
    excerpt: String
    coverImage: String
    categoryId: ID!
    organizationId: ID
    teamId: ID
    tagIds: [ID!]
  }

  input UpdateBlogInput {
    id: ID!
    title: String
    content: String
    excerpt: String
    coverImage: String
    categoryId: ID
    status: BlogStatus
    tagIds: [ID!]
  }

  input CreateCategoryInput {
    name: String!
    description: String
    parentId: ID
  }

  input UpdateCategoryInput {
    id: ID!
    name: String
    description: String
    parentId: ID
  }

  input CreateOrganizationInput {
    name: String!
    logoUrl: String
  }

  input UpdateOrganizationInput {
    id: ID!
    name: String
    logoUrl: String
  }

  input CreateTeamInput {
    name: String!
    description: String
    organizationId: ID!
  }

  input UpdateTeamInput {
    id: ID!
    name: String
    description: String
  }

  input AskAIInput {
    prompt: String!
    conversationId: String
  }

  # Queries
  type Query {
    me: User
    users(page: Int, limit: Int, search: String): UserConnection!
    user(id: ID!): User
    
    blogs(page: Int, limit: Int, categoryId: ID, search: String, status: BlogStatus): BlogConnection!
    blog(id: ID!): Blog
    blogBySlug(slug: String!): Blog
    
    categories: [Category!]!
    category(id: ID!): Category
    
    organizations(page: Int, limit: Int): OrganizationConnection!
    organization(id: ID!): Organization
    
    teams(organizationId: ID, page: Int, limit: Int): TeamConnection!
    team(id: ID!): Team
    
    notifications: [Notification!]!
    activityLogs(limit: Int): [ActivityLog!]!
    analytics: AnalyticsMetrics!
    aiHistory(conversationId: String): [AIHistory!]!
  }

  # Mutations
  type Mutation {
    # Auth
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken(token: String!): RefreshPayload!
    forgotPassword(email: String!): Boolean!
    resetPassword(token: String!, newPassword: String!): Boolean!
    
    # User Profile
    updateProfile(input: UpdateProfileInput!): User!
    changePassword(input: ChangePasswordInput!): Boolean!
    
    # Blogs
    createBlog(input: CreateBlogInput!): Blog!
    updateBlog(input: UpdateBlogInput!): Blog!
    deleteBlog(id: ID!): Boolean!
    
    # Categories
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(input: UpdateCategoryInput!): Category!
    
    # Organizations
    createOrganization(input: CreateOrganizationInput!): Organization!
    updateOrganization(input: UpdateOrganizationInput!): Organization!
    
    # Teams
    createTeam(input: CreateTeamInput!): Team!
    updateTeam(input: UpdateTeamInput!): Team!
    
    # Notifications
    markNotificationRead(id: ID!): Notification!
    
    # AI Module
    askAI(input: AskAIInput!): AIResponse!
  }

  # Subscriptions
  type Subscription {
    notificationCreated: Notification!
    activityLogCreated: ActivityLog!
    analyticsUpdated: AnalyticsMetrics!
    userStatusChanged: User!
  }
`;
