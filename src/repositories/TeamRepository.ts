import { prisma } from '../prisma/client';
import { Team, Prisma } from '@prisma/client';

export class TeamRepository {
  public static async findById(id: string): Promise<Team | null> {
    return prisma.team.findUnique({
      where: { id },
      include: { organization: true, members: true, blogs: true },
    });
  }

  public static async create(data: Prisma.TeamCreateInput): Promise<Team> {
    return prisma.team.create({
      data,
      include: { organization: true },
    });
  }

  public static async update(id: string, data: Prisma.TeamUpdateInput): Promise<Team> {
    return prisma.team.update({
      where: { id },
      data,
      include: { organization: true, members: true },
    });
  }

  public static async delete(id: string): Promise<Team> {
    return prisma.team.delete({ where: { id } });
  }

  public static async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithRelationInput;
  }): Promise<{ teams: Team[]; total: number }> {
    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy || { createdAt: 'desc' },
        include: { organization: true, _count: { select: { members: true } } },
      }),
      prisma.team.count({ where: params.where }),
    ]);
    return { teams, total };
  }
}
