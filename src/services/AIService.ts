import { AIRepository } from '../repositories/AIRepository';
import { validateInput, AskAISchema } from '../validators';
import { v4 as uuidv4 } from 'uuid';

export class AIService {
  public static async askAI(userId: string, input: any) {
    const validated = validateInput(AskAISchema, input);
    const conversationId = validated.conversationId || uuidv4();

    // Simulated LLM generation (pluggable with Gemini / OpenAI / Anthropic)
    const simulatedResponse = `AI Response for prompt: "${validated.prompt}". Processing completed successfully with high accuracy metrics.`;
    const simulatedTokens = Math.floor(validated.prompt.length * 1.3) + 50;

    const saved = await AIRepository.saveInteraction({
      userId,
      conversationId,
      prompt: validated.prompt,
      response: simulatedResponse,
      tokensUsed: simulatedTokens,
      model: 'gemini-3.6-flash',
    });

    return {
      historyItem: saved,
      conversationId,
    };
  }

  public static async getConversationHistory(conversationId: string) {
    return AIRepository.findByConversationId(conversationId);
  }

  public static async getUserAIHistory(userId: string) {
    return AIRepository.findByUserId(userId);
  }
}
