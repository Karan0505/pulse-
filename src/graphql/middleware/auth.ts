import { GraphQLContext } from '../../interfaces/context';
import { UnauthorizedError, ForbiddenError } from '../../errors';

export const requireAuth = (context: GraphQLContext) => {
  if (!context.currentUser) {
    throw new UnauthorizedError('You must be logged in to perform this action');
  }
  return context.currentUser;
};

export const requireRole = (context: GraphQLContext, allowedRoles: string[]) => {
  const user = requireAuth(context);
  if (!allowedRoles.includes(user.roleName)) {
    throw new ForbiddenError(`Action restricted to roles: ${allowedRoles.join(', ')}`);
  }
  return user;
};

export const requirePermission = (context: GraphQLContext, permission: string) => {
  const user = requireAuth(context);
  if (user.roleName === 'ADMIN') return user; // Admin bypass
  if (!user.permissions.includes(permission)) {
    throw new ForbiddenError(`Missing required permission: ${permission}`);
  }
  return user;
};
