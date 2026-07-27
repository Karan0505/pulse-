import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export const UpdateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatarUrl: z.string().url('Invalid URL format').optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

export const CreateBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  organizationId: z.string().optional(),
  teamId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const UpdateBlogSchema = z.object({
  id: z.string().min(1, 'Blog ID is required'),
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  categoryId: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  tagIds: z.array(z.string()).optional(),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

export const UpdateCategorySchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

export const CreateOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name is required'),
  logoUrl: z.string().url().optional(),
});

export const UpdateOrganizationSchema = z.object({
  id: z.string().min(1, 'Organization ID is required'),
  name: z.string().min(2).optional(),
  logoUrl: z.string().url().optional(),
});

export const CreateTeamSchema = z.object({
  name: z.string().min(2, 'Team name is required'),
  description: z.string().optional(),
  organizationId: z.string().min(1, 'Organization ID is required'),
});

export const UpdateTeamSchema = z.object({
  id: z.string().min(1, 'Team ID is required'),
  name: z.string().min(2).optional(),
  description: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const AskAISchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  conversationId: z.string().optional(),
});

export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorMessages = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Validation Error: ${errorMessages}`);
  }
  return result.data;
};
