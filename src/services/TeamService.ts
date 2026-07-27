import { TeamRepository } from '../repositories/TeamRepository';
import { OrganizationRepository } from '../repositories/OrganizationRepository';
import { validateInput, CreateTeamSchema, UpdateTeamSchema } from '../validators';
import { NotFoundError } from '../errors';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';

export class TeamService {
  public static async createTeam(userId: string, input: any) {
    const validated = validateInput(CreateTeamSchema, input);
    const org = await OrganizationRepository.findById(validated.organizationId);
    if (!org) throw new NotFoundError('Organization not found');

    const team = await TeamRepository.create({
      name: validated.name,
      description: validated.description,
      organization: { connect: { id: validated.organizationId } },
      members: { connect: [{ id: userId }] },
    });

    ActivityLogRepository.log({
      userId,
      action: 'CREATE_TEAM',
      entity: 'Team',
      entityId: team.id,
    });

    return team;
  }

  public static async getTeamById(id: string) {
    const team = await TeamRepository.findById(id);
    if (!team) throw new NotFoundError('Team not found');
    return team;
  }

  public static async getTeams(organizationId?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where = organizationId ? { organizationId } : {};

    const { teams, total } = await TeamRepository.findMany({ skip, take: limit, where });
    return {
      teams,
      pageInfo: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public static async updateTeam(userId: string, input: any) {
    const validated = validateInput(UpdateTeamSchema, input);
    const team = await TeamRepository.findById(validated.id);
    if (!team) throw new NotFoundError('Team not found');

    return TeamRepository.update(validated.id, {
      name: validated.name,
      description: validated.description,
    });
  }
}
