import { BlogRepository } from '../repositories/BlogRepository';
import { validateInput, CreateBlogSchema, UpdateBlogSchema } from '../validators';
import { NotFoundError, ForbiddenError } from '../errors';
import { RedisService } from '../redis/client';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';
import { BlogStatus } from '@prisma/client';
import { pubsub } from '../events/pubsub';
import { PubSubTriggers } from '../constants';

export class BlogService {
  public static async createBlog(authorId: string, input: any) {
    const validated = validateInput(CreateBlogSchema, input);
    const slug = validated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const blog = await BlogRepository.create({
      title: validated.title,
      slug,
      content: validated.content,
      excerpt: validated.excerpt,
      coverImage: validated.coverImage,
      status: BlogStatus.DRAFT,
      author: { connect: { id: authorId } },
      category: { connect: { id: validated.categoryId } },
      organization: validated.organizationId ? { connect: { id: validated.organizationId } } : undefined,
      team: validated.teamId ? { connect: { id: validated.teamId } } : undefined,
      tags: validated.tagIds ? { connect: validated.tagIds.map((id) => ({ id })) } : undefined,
    });

    await RedisService.delPattern('blogs:*');

    ActivityLogRepository.log({
      userId: authorId,
      action: 'CREATE_BLOG',
      entity: 'Blog',
      entityId: blog.id,
    });

    return blog;
  }

  public static async getBlogById(id: string) {
    const cacheKey = `blog:${id}`;
    const cached = await RedisService.get(cacheKey);
    if (cached) return cached;

    const blog = await BlogRepository.findById(id);
    if (!blog) throw new NotFoundError('Blog post not found');

    await BlogRepository.incrementViewCount(id);
    await RedisService.set(cacheKey, blog, 300); // 5 min TTL
    return blog;
  }

  public static async getBlogs(filter: { page?: number; limit?: number; categoryId?: string; search?: string; status?: BlogStatus }) {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filter.status) where.status = filter.status;
    if (filter.categoryId) where.categoryId = filter.categoryId;
    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { content: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const { blogs, total } = await BlogRepository.findMany({ skip, take: limit, where });
    return {
      blogs,
      pageInfo: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public static async updateBlog(userId: string, input: any) {
    const validated = validateInput(UpdateBlogSchema, input);
    const existing = await BlogRepository.findById(validated.id);

    if (!existing) throw new NotFoundError('Blog post not found');
    if (existing.authorId !== userId) throw new ForbiddenError('Only the author can update this blog');

    const updated = await BlogRepository.update(validated.id, {
      title: validated.title,
      content: validated.content,
      excerpt: validated.excerpt,
      coverImage: validated.coverImage,
      status: validated.status as BlogStatus,
      category: validated.categoryId ? { connect: { id: validated.categoryId } } : undefined,
    });

    await RedisService.del(`blog:${validated.id}`);
    await RedisService.delPattern('blogs:*');

    return updated;
  }

  public static async deleteBlog(userId: string, id: string) {
    const existing = await BlogRepository.findById(id);
    if (!existing) throw new NotFoundError('Blog post not found');
    if (existing.authorId !== userId) throw new ForbiddenError('Only the author can delete this blog');

    await BlogRepository.delete(id);
    await RedisService.del(`blog:${id}`);
    await RedisService.delPattern('blogs:*');

    return true;
  }
}
