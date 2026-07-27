import DataLoader from 'dataloader';
import { prisma } from '../prisma/client';
import { User, Role, Organization, Team, Category, Tag } from '@prisma/client';

export interface DataLoaders {
  userLoader: DataLoader<string, User | null>;
  roleLoader: DataLoader<string, Role | null>;
  organizationLoader: DataLoader<string, Organization | null>;
  teamLoader: DataLoader<string, Team | null>;
  categoryLoader: DataLoader<string, Category | null>;
  tagLoader: DataLoader<string, Tag | null>;
}

export const createDataLoaders = (): DataLoaders => {
  const userLoader = new DataLoader<string, User | null>(async (userIDs) => {
    const users = await prisma.user.findMany({
      where: { id: { in: [...userIDs] } },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));
    return userIDs.map((id) => userMap.get(id) || null);
  });

  const roleLoader = new DataLoader<string, Role | null>(async (roleIDs) => {
    const roles = await prisma.role.findMany({
      where: { id: { in: [...roleIDs] } },
      include: { permissions: true },
    });
    const roleMap = new Map(roles.map((r) => [r.id, r]));
    return roleIDs.map((id) => roleMap.get(id) || null);
  });

  const organizationLoader = new DataLoader<string, Organization | null>(async (orgIDs) => {
    const orgs = await prisma.organization.findMany({
      where: { id: { in: [...orgIDs] } },
    });
    const orgMap = new Map(orgs.map((o) => [o.id, o]));
    return orgIDs.map((id) => orgMap.get(id) || null);
  });

  const teamLoader = new DataLoader<string, Team | null>(async (teamIDs) => {
    const teams = await prisma.team.findMany({
      where: { id: { in: [...teamIDs] } },
    });
    const teamMap = new Map(teams.map((t) => [t.id, t]));
    return teamIDs.map((id) => teamMap.get(id) || null);
  });

  const categoryLoader = new DataLoader<string, Category | null>(async (catIDs) => {
    const categories = await prisma.category.findMany({
      where: { id: { in: [...catIDs] } },
    });
    const catMap = new Map(categories.map((c) => [c.id, c]));
    return catIDs.map((id) => catMap.get(id) || null);
  });

  const tagLoader = new DataLoader<string, Tag | null>(async (tagIDs) => {
    const tags = await prisma.tag.findMany({
      where: { id: { in: [...tagIDs] } },
    });
    const tagMap = new Map(tags.map((t) => [t.id, t]));
    return tagIDs.map((id) => tagMap.get(id) || null);
  });

  return {
    userLoader,
    roleLoader,
    organizationLoader,
    teamLoader,
    categoryLoader,
    tagLoader,
  };
};
