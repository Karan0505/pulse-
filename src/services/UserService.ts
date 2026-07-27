import { UserRepository } from '../repositories/UserRepository';
import { NotFoundError, ValidationError } from '../errors';
import { validateInput, UpdateProfileSchema, ChangePasswordSchema } from '../validators';
import { PasswordService } from '../auth/password';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';

export class UserService {
  public static async getUserById(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  public static async updateProfile(userId: string, input: any) {
    const validated = validateInput(UpdateProfileSchema, input);
    const updated = await UserRepository.update(userId, validated);

    ActivityLogRepository.log({
      userId,
      action: 'UPDATE_PROFILE',
      entity: 'User',
      entityId: userId,
    });

    return updated;
  }

  public static async changePassword(userId: string, input: any) {
    const validated = validateInput(ChangePasswordSchema, input);
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await PasswordService.compare(validated.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new ValidationError('Current password is incorrect');
    }

    const newPasswordHash = await PasswordService.hash(validated.newPassword);
    await UserRepository.update(userId, { passwordHash: newPasswordHash });

    ActivityLogRepository.log({
      userId,
      action: 'CHANGE_PASSWORD',
      entity: 'User',
      entityId: userId,
    });

    return true;
  }

  public static async getUsers(pagination: { page?: number; limit?: number; search?: string }) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (pagination.search) {
      where.OR = [
        { firstName: { contains: pagination.search, mode: 'insensitive' } },
        { lastName: { contains: pagination.search, mode: 'insensitive' } },
        { email: { contains: pagination.search, mode: 'insensitive' } },
      ];
    }

    const { users, total } = await UserRepository.findMany({ skip, take: limit, where });
    return {
      users,
      pageInfo: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
