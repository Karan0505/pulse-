import { prisma } from '../prisma/client';

export class AnalyticsRepository {
  public static async getSystemMetrics(): Promise<{
    userCount: number;
    blogCount: number;
    orgCount: number;
    teamCount: number;
  }> {
    const [userCount, blogCount, orgCount, teamCount] = await Promise.all([
      prisma.user.count(),
      prisma.blog.count(),
      prisma.organization.count(),
      prisma.team.count(),
    ]);

    return {
      userCount,
      blogCount,
      orgCount,
      teamCount,
    };
  }

  public static async recordMetric(metricName: string, metricValue: number, metadata?: any): Promise<any> {
    return prisma.analytics.create({
      data: {
        metricName,
        metricValue,
        metadata,
      },
    });
  }
}
