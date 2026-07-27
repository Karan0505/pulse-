import { Request, Response } from 'express';
import { TokenPayload } from '../auth/jwt';
import { DataLoaders } from '../loaders';

export interface AuthUser extends TokenPayload {
  permissions: string[];
}

export interface GraphQLContext {
  req: Request;
  res: Response;
  currentUser: AuthUser | null;
  loaders: DataLoaders;
}
