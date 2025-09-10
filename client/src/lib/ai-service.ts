// Unified AI service interface and factory
import { GeminiService } from './gemini';
import { grokService } from './grok';

export interface AIService {
  generateResponse(prompt: string, systemPrompt?: string): Promise<string>;
  generateStreamResponse(
    prompt: string, 
    systemPrompt?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string>;
  sendMessage(
    message: string, 
    fileContent?: string, 
    fileName?: string,
    conversationHistory?: any[],
    systemPrompt?: string
  ): Promise<string>;
  isInitialized(): boolean;
}

// Create a wrapper for GeminiService to match the interface
class GeminiServiceWrapper implements AIService {
  async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
    // GeminiService doesn't have this method, so we'll use sendMessage
    return await GeminiService.sendMessage(prompt, undefined, undefined, [], systemPrompt);
  }

  async generateStreamResponse(
    prompt: string, 
    systemPrompt?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    // GeminiService doesn't have streaming, so we'll use regular response
    return await this.generateResponse(prompt, systemPrompt);
  }

  async sendMessage(
    message: string, 
    fileContent?: string, 
    fileName?: string,
    conversationHistory: any[] = [],
    systemPrompt?: string
  ): Promise<string> {
    return await GeminiService.sendMessage(message, fileContent, fileName, conversationHistory, systemPrompt);
  }

  isInitialized(): boolean {
    // GeminiService doesn't have this method, assume it's always initialized
    return true;
  }
}

const geminiServiceWrapper = new GeminiServiceWrapper();

export const createAIService = (): AIService => {
  const provider = import.meta.env.VITE_AI_PROVIDER || 'grok';
  
  switch (provider.toLowerCase()) {
    case 'grok':
      return grokService;
    case 'gemini':
      return geminiServiceWrapper;
    default:
      console.warn(`Unknown AI provider: ${provider}, falling back to Grok`);
      return grokService;
  }
};

export const aiService = createAIService();