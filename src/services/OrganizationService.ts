import { OrganizationRepository } from '../repositories/OrganizationRepository';
import { validateInput, CreateOrganizationSchema, UpdateOrganizationSchema } from '../validators';
import { NotFoundError, ForbiddenError } from '../errors';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';

export class OrganizationService {
  public static async createOrganization(ownerId: string, input: any) {
    const validated = validateInput(CreateOrganizationSchema, input);
    const slug = validated.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const org = await OrganizationRepository.create({
      name: validated.name,
      slug,
      logoUrl: validated.logoUrl,
      owner: { connect: { id: ownerId } },
      members: { connect: [{ id: ownerId }] },
    });

    ActivityLogRepository.log({
      userId: ownerId,
      action: 'CREATE_ORGANIZATION',
      entity: 'Organization',
      entityId: org.id,
    });

    return org;
  }

  public static async getOrganizationById(id: string) {
    const org = await OrganizationRepository.findById(id);
    if (!org) throw new NotFoundError('Organization not found');
    return org;
  }

  public static async getOrganizations(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const { organizations, total } = await OrganizationRepository.findMany({ skip, take: limit });
    return {
      organizations,
      pageInfo: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public static async updateOrganization(userId: string, input: any) {
    const validated = validateInput(UpdateOrganizationSchema, input);
    const org = await OrganizationRepository.findById(validated.id);
    if (!org) throw new NotFoundError('Organization not found');

    if (org.ownerId !== userId) {
      throw new ForbiddenError('Only the organization owner can update details');
    }

    return OrganizationRepository.update(validated.id, {
      name: validated.name,
      logoUrl: validated.logoUrl,
    });
  }
}
