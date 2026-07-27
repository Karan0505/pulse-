import { prisma } from '../prisma/client';
import { AIHistory } from '@prisma/client';

export class AIRepository {
  public static async saveInteraction(data: {
    userId: string;
    conversationId: string;
    prompt: string;
    response: string;
    tokensUsed?: number;
    model?: string;
  }): Promise<AIHistory> {
    return prisma.aIHistory.create({
      data: {
        userId: data.userId,
        conversationId: data.conversationId,
        prompt: data.prompt,
        response: data.response,
        tokensUsed: data.tokensUsed || 0,
        model: data.model || 'gemini-3.6-flash',
      },
    });
  }

  public static async findByConversationId(conversationId: string): Promise<AIHistory[]> {
    return prisma.aIHistory.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  public static async findByUserId(userId: string, limit: number = 20): Promise<AIHistory[]> {
    return prisma.aIHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
