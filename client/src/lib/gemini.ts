import { GoogleGenAI } from '@google/genai';

// Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log('[Gemini] Using API key:', apiKey);
if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  // Warn at module load if missing
  // eslint-disable-next-line no-console
  console.warn('Gemini API key is missing or not set in .env as VITE_GEMINI_API_KEY');
}
const genai = new GoogleGenAI({
  apiKey: apiKey || ''
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export class GeminiService {
  static async sendMessage(
    message: string, 
    fileContent?: string, 
    fileName?: string,
    conversationHistory: ChatMessage[] = [],
    systemPrompt?: string
  ): Promise<string> {
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.');
    }
    try {
      const defaultSystemPrompt = `You are a helpful AI assistant that can analyze and answer questions about user-uploaded files. 
                           You maintain user privacy and security. Be concise but thorough in your responses.
                           ${fileContent ? `The user has shared a file named "${fileName}" with the following content:` : ''}`;

      // Use custom system prompt if provided, otherwise use default
      const effectiveSystemPrompt = systemPrompt || defaultSystemPrompt;

      // Build conversation context
      let conversationContext = '';
      if (conversationHistory.length > 0) {
        conversationContext = conversationHistory.map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n\n') + '\n\n';
      }

      const fullPrompt = effectiveSystemPrompt + '\n\n' + 
        (conversationContext ? `Previous conversation:\n${conversationContext}` : '') +
        (fileContent ? `File content: ${fileContent}\n\nUser question: ${message}` : `User question: ${message}`);

      const response = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      return response.text || 'No response generated';
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to get AI response: ' + (error as Error).message);
    }
  }

  static async summarizeFile(fileContent: string, fileName: string): Promise<string> {
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.');
    }
    try {
      const prompt = `You are a helpful assistant that provides concise summaries of documents. Focus on key points and main themes.\n\nPlease provide a concise summary of this file "${fileName}":\n\n${fileContent}`;

      const response = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || 'No summary generated';
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to summarize file: ' + (error as Error).message);
    }
  }
}