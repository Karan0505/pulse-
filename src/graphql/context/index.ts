import { Request, Response } from 'express';
import { GraphQLContext, AuthUser } from '../../interfaces/context';
import { JWTService } from '../../auth/jwt';
import { createDataLoaders } from '../../loaders';
import { prisma } from '../../prisma/client';

export const createContext = async ({ req, res }: { req: Request; res: Response }): Promise<GraphQLContext> => {
  let currentUser: AuthUser | null = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = JWTService.verifyAccessToken(token);

    if (payload) {
      // Fetch permissions for the role
      const role = await prisma.role.findUnique({
        where: { id: payload.roleId },
        include: { permissions: true },
      });

      const permissions = role ? role.permissions.map((p) => `${p.action}:${p.resource}`) : [];

      currentUser = {
        ...payload,
        permissions,
      };
    }
  }

  return {
    req,
    res,
    currentUser,
    loaders: createDataLoaders(),
  };
};
