import { prisma } from '../prisma/client';
import { Organization, Prisma } from '@prisma/client';

export class OrganizationRepository {
  public static async findById(id: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { id },
      include: { owner: true, members: true, teams: true, blogs: true },
    });
  }

  public static async findBySlug(slug: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { slug },
      include: { owner: true, members: true, teams: true },
    });
  }

  public static async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    return prisma.organization.create({
      data,
      include: { owner: true },
    });
  }

  public static async update(id: string, data: Prisma.OrganizationUpdateInput): Promise<Organization> {
    return prisma.organization.update({
      where: { id },
      data,
      include: { owner: true, members: true },
    });
  }

  public static async delete(id: string): Promise<Organization> {
    return prisma.organization.delete({ where: { id } });
  }

  public static async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput;
  }): Promise<{ organizations: Organization[]; total: number }> {
    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy || { createdAt: 'desc' },
        include: { owner: true, _count: { select: { members: true, teams: true } } },
      }),
      prisma.organization.count({ where: params.where }),
    ]);
    return { organizations, total };
  }
}
