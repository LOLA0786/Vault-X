import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Paperclip, Send, Bot, User, Shield, Lock } from 'lucide-react';
import { GeminiService, type ChatMessage } from '@/lib/gemini';
import { EncryptionService } from '@/lib/encryption';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { type EncryptedFile } from '@shared/schema';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  sessionId?: string;
  onNewSession?: (sessionId: string) => void;
}

export function ChatInterface({ sessionId, onNewSession }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: files = [] } = useQuery<EncryptedFile[]>({
    queryKey: ['/api/files/user', user?.id],
    enabled: !!user?.id,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat history if sessionId provided
    if (sessionId) {
      loadChatHistory(sessionId);
    }
  }, [sessionId]);

  const loadChatHistory = async (id: string) => {
    try {
      const response = await fetch(`/api/chat-sessions/${id}`);
      if (response.ok) {
        const session = await response.json();
        if (session.encryptedHistory) {
          const decryptedHistory = EncryptionService.decrypt(session.encryptedHistory);
          const history: ChatMessage[] = JSON.parse(decryptedHistory);
          setMessages(history);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveChatHistory = async (newMessages: ChatMessage[]) => {
    if (!user || newMessages.length === 0) return;

    try {
      const encryptedHistory = EncryptionService.encrypt(JSON.stringify(newMessages));
      
      if (sessionId) {
        // Update existing session
        await fetch(`/api/chat-sessions/${sessionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encryptedHistory }),
        });
      } else {
        // Create new session
        const title = newMessages[0]?.content.slice(0, 50) + '...' || 'New Chat';
        const response = await fetch('/api/chat-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            title,
            encryptedHistory,
          }),
        });
        
        if (response.ok) {
          const newSession = await response.json();
          onNewSession?.(newSession.id);
        }
      }
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !user) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      let fileContent = '';
      let fileName = '';

      // If a file is selected, decrypt it for AI processing
      if (selectedFileId) {
        const selectedFile = files.find(f => f.id === selectedFileId);
        if (selectedFile) {
          try {
            fileContent = EncryptionService.decryptFile(selectedFile.encryptedData);
            fileName = selectedFile.fileName;
          } catch (error) {
            throw new Error('Failed to decrypt selected file');
          }
        }
      }

      // Send to Gemini
      const aiResponse = await GeminiService.sendMessage(
        inputValue,
        fileContent,
        fileName,
        messages
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      
      // Save encrypted chat history
      await saveChatHistory(updatedMessages);
      
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat error",
        description: (error as Error).message || "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">AI Assistant</CardTitle>
        <CardDescription>
          Ask questions about your uploaded files - all processing happens locally
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 space-y-4 mb-6 max-h-96 overflow-y-auto" data-testid="chat-messages">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="text-center">
                <Bot className="w-8 h-8 mx-auto mb-2" />
                <p>Start a conversation with your AI assistant</p>
                <p className="text-sm">Upload files and ask questions about them</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
                data-testid={`message-${message.role}-${index}`}
              >
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md rounded-lg px-4 py-2",
                    message.role === 'user'
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-gray-600">AI Assistant</span>
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Private
                      </Badge>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {message.timestamp?.toLocaleTimeString()}
                    {message.role === 'assistant' && ' • File decrypted locally'}
                  </p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File Selection */}
        {files.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference File (Optional)
            </label>
            <select
              value={selectedFileId || ''}
              onChange={(e) => setSelectedFileId(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
              data-testid="file-select"
            >
              <option value="">No file selected</option>
              {files.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.fileName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Message Input */}
        <div className="flex space-x-3">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Ask a question about your files..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="pr-10"
                data-testid="chat-input"
              />
              {selectedFileId && (
                <div className="absolute right-2 top-2">
                  <Paperclip className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <Lock className="w-3 h-3 mr-1 text-secondary" />
              Your files are decrypted locally before AI processing
            </p>
          </div>
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-6"
            data-testid="send-button"
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
