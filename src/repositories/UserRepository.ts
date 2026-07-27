import { prisma } from '../prisma/client';
import { User, Prisma } from '@prisma/client';

export class UserRepository {
  public static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { role: { include: { permissions: true } }, organization: true, teams: true },
    });
  }

  public static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { role: { include: { permissions: true } }, organization: true },
    });
  }

  public static async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
      include: { role: { include: { permissions: true } } },
    });
  }

  public static async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
      include: { role: { include: { permissions: true } } },
    });
  }

  public static async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  public static async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy || { createdAt: 'desc' },
        include: { role: true, organization: true },
      }),
      prisma.user.count({ where: params.where }),
    ]);
    return { users, total };
  }
}
