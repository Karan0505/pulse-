import { PrismaClient, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Permissions
  const permissionsData = [
    { action: 'manage', resource: 'all', description: 'Super admin full access' },
    { action: 'create', resource: 'blog', description: 'Create blog posts' },
    { action: 'update', resource: 'blog', description: 'Update blog posts' },
    { action: 'delete', resource: 'blog', description: 'Delete blog posts' },
    { action: 'read', resource: 'blog', description: 'Read blog posts' },
    { action: 'manage', resource: 'organization', description: 'Manage organization' },
    { action: 'manage', resource: 'team', description: 'Manage teams' },
    { action: 'use', resource: 'ai', description: 'Access AI features' },
    { action: 'read', resource: 'analytics', description: 'View analytics' },
  ];

  const permissions = [];
  for (const p of permissionsData) {
    const perm = await prisma.permission.upsert({
      where: { action_resource: { action: p.action, resource: p.resource } },
      update: {},
      create: p,
    });
    permissions.push(perm);
  }

  // 2. Roles: ADMIN, EDITOR, VIEWER
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrator with full system & management privileges',
      permissions: { connect: permissions.map((p) => ({ id: p.id })) },
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: 'EDITOR' },
    update: {},
    create: {
      name: 'EDITOR',
      description: 'Editor with access to create, edit, and publish content',
      permissions: {
        connect: permissions
          .filter((p) => ['blog', 'ai', 'analytics'].includes(p.resource) && p.action !== 'manage')
          .map((p) => ({ id: p.id })),
      },
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: 'VIEWER' },
    update: {},
    create: {
      name: 'VIEWER',
      description: 'Viewer with read-only access to feeds and analytics',
      permissions: {
        connect: permissions
          .filter((p) => p.action === 'read')
          .map((p) => ({ id: p.id })),
      },
    },
  });

  // 3. Demo Users for all 3 Roles
  const commonPasswordHash = await bcrypt.hash('PulsePassword123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pulsebackend.com' },
    update: {},
    create: {
      email: 'admin@pulsebackend.com',
      passwordHash: commonPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      isEmailVerified: true,
      status: UserStatus.ACTIVE,
      role: { connect: { id: adminRole.id } },
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@pulsebackend.com' },
    update: {},
    create: {
      email: 'editor@pulsebackend.com',
      passwordHash: commonPasswordHash,
      firstName: 'Editor',
      lastName: 'User',
      isEmailVerified: true,
      status: UserStatus.ACTIVE,
      role: { connect: { id: editorRole.id } },
    },
  });

  const viewerUser = await prisma.user.upsert({
    where: { email: 'viewer@pulsebackend.com' },
    update: {},
    create: {
      email: 'viewer@pulsebackend.com',
      passwordHash: commonPasswordHash,
      firstName: 'Viewer',
      lastName: 'User',
      isEmailVerified: true,
      status: UserStatus.ACTIVE,
      role: { connect: { id: viewerRole.id } },
    },
  });

  // 4. Organization & Team
  const org = await prisma.organization.upsert({
    where: { slug: 'pulse-corp' },
    update: {},
    create: {
      name: 'Pulse Corp',
      slug: 'pulse-corp',
      owner: { connect: { id: adminUser.id } },
      members: { connect: [{ id: adminUser.id }, { id: editorUser.id }, { id: viewerUser.id }] },
    },
  });

  await prisma.team.upsert({
    where: { id: 'default-team-eng' },
    update: {},
    create: {
      id: 'default-team-eng',
      name: 'Engineering',
      description: 'Core engineering team',
      organization: { connect: { id: org.id } },
      members: { connect: [{ id: adminUser.id }, { id: editorUser.id }, { id: viewerUser.id }] },
    },
  });

  // 5. Default Categories
  const categoryNames = ['Engineering', 'Architecture', 'AI & Machine Learning', 'Security', 'DevOps'];
  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, description: `${name} news and updates` },
    });
  }

  console.log('✅ Seeding completed successfully!');
  console.log('👑 ADMIN User : admin@pulsebackend.com / PulsePassword123!');
  console.log('✍️ EDITOR User: editor@pulsebackend.com / PulsePassword123!');
  console.log('👁️ VIEWER User: viewer@pulsebackend.com / PulsePassword123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
