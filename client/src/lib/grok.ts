export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export class GrokService {
  private static apiKey = import.meta.env.VITE_GROK_API_KEY;
  private static apiUrl = 'https://api.x.ai/v1/chat/completions';

  static async sendMessage(
    message: string, 
    fileContent?: string, 
    fileName?: string,
    conversationHistory: ChatMessage[] = [],
    systemPrompt?: string
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Grok API key is missing. Please set VITE_GROK_API_KEY in your .env file.');
    }

    console.log('[Grok Debug] API Key present:', !!this.apiKey);
    console.log('[Grok Debug] API Key starts with:', this.apiKey?.substring(0, 10) + '...');

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

      const requestBody = {
        model: 'grok-2-1212',
        messages: [
          {
            role: 'system',
            content: effectiveSystemPrompt
          },
          ...conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: 'user',
            content: fileContent ? `File: ${fileName}\n\n${fileContent}\n\nQuestion: ${message}` : message
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        stream: false
      };

      console.log('[Grok Debug] Making request to:', this.apiUrl);
      console.log('[Grok Debug] Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody)
      });

      console.log('[Grok Debug] Response status:', response.status, response.statusText);
      console.log('[Grok Debug] Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const responseText = await response.text();
        console.log('[Grok Debug] Error response body:', responseText);
        
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          console.log('[Grok Debug] Response is not JSON');
        }
        
        throw new Error(`Grok API error: ${response.status} ${response.statusText} - ${(errorData as any).error?.message || responseText || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('Grok API error:', error);
      throw new Error('Failed to get AI response: ' + (error as Error).message);
    }
  }

  static async summarizeFile(fileContent: string, fileName: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Grok API key is missing. Please set VITE_GROK_API_KEY in your .env file.');
    }

    try {
      const prompt = `You are a helpful assistant that provides concise summaries of documents. Focus on key points and main themes.\n\nPlease provide a concise summary of this file "${fileName}":\n\n${fileContent}`;

      const requestBody = {
        model: 'grok-2-1212',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides concise summaries of documents. Focus on key points and main themes.'
          },
          {
            role: 'user',
            content: `Please provide a concise summary of this file "${fileName}":\n\n${fileContent}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
        stream: false
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Grok API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No summary generated';
    } catch (error) {
      console.error('Grok API error:', error);
      throw new Error('Failed to summarize file: ' + (error as Error).message);
    }
  }
}