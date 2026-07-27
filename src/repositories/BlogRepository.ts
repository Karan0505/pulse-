import { prisma } from '../prisma/client';
import { Blog, Prisma } from '@prisma/client';

export class BlogRepository {
  public static async findById(id: string): Promise<Blog | null> {
    return prisma.blog.findUnique({
      where: { id },
      include: { author: true, category: true, tags: true, comments: true, organization: true, team: true },
    });
  }

  public static async findBySlug(slug: string): Promise<Blog | null> {
    return prisma.blog.findUnique({
      where: { slug },
      include: { author: true, category: true, tags: true, comments: true },
    });
  }

  public static async create(data: Prisma.BlogCreateInput): Promise<Blog> {
    return prisma.blog.create({
      data,
      include: { author: true, category: true, tags: true },
    });
  }

  public static async update(id: string, data: Prisma.BlogUpdateInput): Promise<Blog> {
    return prisma.blog.update({
      where: { id },
      data,
      include: { author: true, category: true, tags: true },
    });
  }

  public static async delete(id: string): Promise<Blog> {
    return prisma.blog.delete({ where: { id } });
  }

  public static async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BlogWhereInput;
    orderBy?: Prisma.BlogOrderByWithRelationInput;
  }): Promise<{ blogs: Blog[]; total: number }> {
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy || { createdAt: 'desc' },
        include: { author: true, category: true, tags: true },
      }),
      prisma.blog.count({ where: params.where }),
    ]);
    return { blogs, total };
  }

  public static async incrementViewCount(id: string): Promise<Blog> {
    return prisma.blog.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }
}
