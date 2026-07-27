import { UserRepository } from '../repositories/UserRepository';
import { PasswordService } from '../auth/password';
import { JWTService, TokenPayload } from '../auth/jwt';
import { prisma } from '../prisma/client';
import { RedisService } from '../redis/client';
import { EmailService } from './EmailService';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';
import { UnauthorizedError, ValidationError, ConflictError, NotFoundError, ForbiddenError } from '../errors';
import { validateInput, SignupSchema, LoginSchema, ResetPasswordSchema } from '../validators';
import { v4 as uuidv4 } from 'uuid';
import { UserStatus } from '@prisma/client';

export class AuthService {
  public static async signup(input: any, ipAddress?: string, userAgent?: string) {
    const validated = validateInput(SignupSchema, input);

    const existingUser = await UserRepository.findByEmail(validated.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Default to MEMBER role
    let role = await prisma.role.findUnique({ where: { name: 'MEMBER' } });
    if (!role) {
      role = await prisma.role.create({
        data: { name: 'MEMBER', description: 'Standard member role' },
      });
    }

    const passwordHash = await PasswordService.hash(validated.password);

    const user = await UserRepository.create({
      email: validated.email,
      passwordHash,
      firstName: validated.firstName,
      lastName: validated.lastName,
      status: UserStatus.ACTIVE,
      role: { connect: { id: role.id } },
    });

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: role.name,
      organizationId: user.organizationId,
    };

    const accessToken = JWTService.signAccessToken(tokenPayload);
    const refreshToken = JWTService.signRefreshToken(tokenPayload);

    // Save refresh token
    const tokenHash = await PasswordService.hash(refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Send Welcome Email
    EmailService.sendWelcomeEmail(user.email, user.firstName);

    // Log Activity
    ActivityLogRepository.log({
      userId: user.id,
      action: 'USER_SIGNUP',
      entity: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  public static async login(input: any, ipAddress?: string, userAgent?: string) {
    const validated = validateInput(LoginSchema, input);

    const user = await UserRepository.findByEmail(validated.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await PasswordService.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenError('Your account has been suspended');
    }

    const roleName = (user as any).role?.name || 'MEMBER';
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName,
      organizationId: user.organizationId,
    };

    const accessToken = JWTService.signAccessToken(tokenPayload);
    const refreshToken = JWTService.signRefreshToken(tokenPayload);

    const tokenHash = await PasswordService.hash(refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: uuidv4(),
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    ActivityLogRepository.log({
      userId: user.id,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  public static async refreshToken(refreshToken: string) {
    const payload = JWTService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await UserRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const roleName = (user as any).role?.name || 'MEMBER';
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName,
      organizationId: user.organizationId,
    };

    const newAccessToken = JWTService.signAccessToken(tokenPayload);
    const newRefreshToken = JWTService.signRefreshToken(tokenPayload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  public static async forgotPassword(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Return success to avoid email enumeration
      return true;
    }

    const resetToken = uuidv4();
    const tokenHash = await PasswordService.hash(resetToken);

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await EmailService.sendPasswordResetEmail(user.email, resetToken);
    return true;
  }

  public static async resetPassword(input: any) {
    const validated = validateInput(ResetPasswordSchema, input);

    // Simplified token lookup for demo
    const resetRecord = await prisma.passwordReset.findFirst({
      where: { isUsed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!resetRecord) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const newPasswordHash = await PasswordService.hash(validated.newPassword);

    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash: newPasswordHash },
    });

    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { isUsed: true },
    });

    return true;
  }
}
