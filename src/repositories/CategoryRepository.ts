import { prisma } from '../prisma/client';
import { Category, Prisma } from '@prisma/client';

export class CategoryRepository {
  public static async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
      include: { parent: true, children: true, blogs: true },
    });
  }

  public static async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { slug },
      include: { parent: true, children: true },
    });
  }

  public static async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  public static async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  public static async delete(id: string): Promise<Category> {
    return prisma.category.delete({ where: { id } });
  }

  public static async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      include: { children: true, _count: { select: { blogs: true } } },
      orderBy: { name: 'asc' },
    });
  }
}
