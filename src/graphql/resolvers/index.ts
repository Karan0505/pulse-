import { GraphQLContext } from '../../interfaces/context';
import { AuthService } from '../../services/AuthService';
import { UserService } from '../../services/UserService';
import { BlogService } from '../../services/BlogService';
import { OrganizationService } from '../../services/OrganizationService';
import { TeamService } from '../../services/TeamService';
import { CategoryService } from '../../services/CategoryService';
import { NotificationService } from '../../services/NotificationService';
import { AIService } from '../../services/AIService';
import { AnalyticsRepository } from '../../repositories/AnalyticsRepository';
import { ActivityLogRepository } from '../../repositories/ActivityLogRepository';
import { requireAuth, requireRole } from '../middleware/auth';
import { pubsub } from '../../events/pubsub';
import { PubSubTriggers } from '../../constants';

export const resolvers = {
  Query: {
    me: async (_: any, __: any, ctx: GraphQLContext) => {
      if (!ctx.currentUser) return null;
      return UserService.getUserById(ctx.currentUser.userId);
    },
    users: async (_: any, args: any, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return UserService.getUsers(args);
    },
    user: async (_: any, { id }: { id: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return UserService.getUserById(id);
    },

    blogs: async (_: any, args: any) => {
      return BlogService.getBlogs(args);
    },
    blog: async (_: any, { id }: { id: string }) => {
      return BlogService.getBlogById(id);
    },
    blogBySlug: async (_: any, { slug }: { slug: string }) => {
      const blog = await BlogService.getBlogs({ page: 1, limit: 1 });
      const found = blog.blogs.find((b) => b.slug === slug);
      return found || null;
    },

    categories: async () => {
      return CategoryService.getCategories();
    },
    category: async (_: any, { id }: { id: string }) => {
      return CategoryService.getCategoryById(id);
    },

    organizations: async (_: any, { page, limit }: any, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return OrganizationService.getOrganizations(page, limit);
    },
    organization: async (_: any, { id }: { id: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return OrganizationService.getOrganizationById(id);
    },

    teams: async (_: any, { organizationId, page, limit }: any, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return TeamService.getTeams(organizationId, page, limit);
    },
    team: async (_: any, { id }: { id: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return TeamService.getTeamById(id);
    },

    notifications: async (_: any, __: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      return NotificationService.getUserNotifications(user.userId);
    },
    activityLogs: async (_: any, { limit }: { limit?: number }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return ActivityLogRepository.findMany(limit || 50);
    },
    analytics: async (_: any, __: any, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return AnalyticsRepository.getSystemMetrics();
    },
    aiHistory: async (_: any, { conversationId }: { conversationId?: string }, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      if (conversationId) {
        return AIService.getConversationHistory(conversationId);
      }
      return AIService.getUserAIHistory(user.userId);
    },
  },

  Mutation: {
    signup: async (_: any, { input }: any, ctx: GraphQLContext) => {
      return AuthService.signup(input, ctx.req.ip, ctx.req.get('user-agent'));
    },
    login: async (_: any, { input }: any, ctx: GraphQLContext) => {
      return AuthService.login(input, ctx.req.ip, ctx.req.get('user-agent'));
    },
    refreshToken: async (_: any, { token }: { token: string }) => {
      return AuthService.refreshToken(token);
    },
    forgotPassword: async (_: any, { email }: { email: string }) => {
      return AuthService.forgotPassword(email);
    },
    resetPassword: async (_: any, args: any) => {
      return AuthService.resetPassword(args);
    },

    updateProfile: async (_: any, { input }: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      return UserService.updateProfile(user.userId, input);
    },
    changePassword: async (_: any, { input }: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      return UserService.changePassword(user.userId, input);
    },

    createBlog: async (_: any, { input }: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      return BlogService.createBlog(user.userId, input);
    },
    updateBlog: async (_: any, { input }: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      return BlogService.updateBlog(user.userId, input);
    },
    deleteBlog: async (_: any, { id }: { id: string }, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      return BlogService.deleteBlog(user.userId, id);
    },

    createCategory: async (_: any, { input }: any, ctx: GraphQLContext) => {
      requireRole(ctx, ['ADMIN', 'MANAGER']);
      return CategoryService.createCategory(input);
    },
    updateCategory: async (_: any, { input }: any, ctx: GraphQLContext) => {
      requireRole(ctx, ['ADMIN', 'MANAGER']);
      return CategoryService.getCategoryById(input.id);
    },

    createOrganization: async (_: any, { input }: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      return OrganizationService.createOrganization(user.userId, input);
    },
    updateOrganization: async (_: any, { input }: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      return OrganizationService.updateOrganization(user.userId, input);
    },

    createTeam: async (_: any, { input }: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      return TeamService.createTeam(user.userId, input);
    },
    updateTeam: async (_: any, { input }: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      return TeamService.updateTeam(user.userId, input);
    },

    markNotificationRead: async (_: any, { id }: { id: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return NotificationService.markRead(id);
    },

    askAI: async (_: any, { input }: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      return AIService.askAI(user.userId, input);
    },
  },

  Subscription: {
    notificationCreated: {
      subscribe: () => pubsub.asyncIterableIterator([PubSubTriggers.NOTIFICATION_CREATED]),
    },
    activityLogCreated: {
      subscribe: () => pubsub.asyncIterableIterator([PubSubTriggers.ACTIVITY_LOG_CREATED]),
    },
    analyticsUpdated: {
      subscribe: () => pubsub.asyncIterableIterator([PubSubTriggers.ANALYTICS_UPDATED]),
    },
    userStatusChanged: {
      subscribe: () => pubsub.asyncIterableIterator([PubSubTriggers.USER_STATUS_CHANGED]),
    },
  },

  // Type Resolvers using DataLoaders for N+1 performance optimization
  User: {
    role: async (parent: any, _: any, ctx: GraphQLContext) => {
      if (parent.role) return parent.role;
      return ctx.loaders.roleLoader.load(parent.roleId);
    },
    organization: async (parent: any, _: any, ctx: GraphQLContext) => {
      if (!parent.organizationId) return null;
      return ctx.loaders.organizationLoader.load(parent.organizationId);
    },
  },

  Blog: {
    author: async (parent: any, _: any, ctx: GraphQLContext) => {
      if (parent.author) return parent.author;
      return ctx.loaders.userLoader.load(parent.authorId);
    },
    category: async (parent: any, _: any, ctx: GraphQLContext) => {
      if (parent.category) return parent.category;
      return ctx.loaders.categoryLoader.load(parent.categoryId);
    },
    organization: async (parent: any, _: any, ctx: GraphQLContext) => {
      if (!parent.organizationId) return null;
      return ctx.loaders.organizationLoader.load(parent.organizationId);
    },
    team: async (parent: any, _: any, ctx: GraphQLContext) => {
      if (!parent.teamId) return null;
      return ctx.loaders.teamLoader.load(parent.teamId);
    },
  },

  Organization: {
    owner: async (parent: any, _: any, ctx: GraphQLContext) => {
      if (parent.owner) return parent.owner;
      return ctx.loaders.userLoader.load(parent.ownerId);
    },
  },

  Team: {
    organization: async (parent: any, _: any, ctx: GraphQLContext) => {
      if (parent.organization) return parent.organization;
      return ctx.loaders.organizationLoader.load(parent.organizationId);
    },
  },
};
