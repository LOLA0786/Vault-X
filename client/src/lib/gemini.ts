import { GoogleGenAI } from '@google/genai';

// Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro
const genai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'your_gemini_api_key_here'
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
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      const systemPrompt = `You are a helpful AI assistant that can analyze and answer questions about user-uploaded files. 
                           You maintain user privacy and security. Be concise but thorough in your responses.
                           ${fileContent ? `The user has shared a file named "${fileName}" with the following content:` : ''}`;

      // Build conversation context
      let conversationContext = '';
      if (conversationHistory.length > 0) {
        conversationContext = conversationHistory.map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n\n') + '\n\n';
      }

      const fullPrompt = systemPrompt + '\n\n' + 
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