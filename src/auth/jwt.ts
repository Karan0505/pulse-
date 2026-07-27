import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface TokenPayload {
  userId: string;
  email: string;
  roleId: string;
  roleName: string;
  organizationId?: string | null;
}

export class JWTService {
  public static signAccessToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: config.jwt.accessExpiresIn as any,
    };
    return jwt.sign(payload, config.jwt.accessSecret, options);
  }

  public static signRefreshToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as any,
    };
    return jwt.sign(payload, config.jwt.refreshSecret, options);
  }

  public static verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
    } catch {
      return null;
    }
  }

  public static verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
    } catch {
      return null;
    }
  }
}
