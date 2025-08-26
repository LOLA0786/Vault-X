import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Paperclip, Send, Bot, User, Shield, Lock } from 'lucide-react';
import { GeminiService, type ChatMessage } from '@/lib/gemini';
import { EncryptionService } from '@/lib/encryption';
import { extractPdfText } from '@/lib/pdf-utils';
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
  // prefer an externally-provided sessionId, otherwise keep a local session id
  const [localSessionId, setLocalSessionId] = useState<string | undefined>(sessionId);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [decryptedFileContent, setDecryptedFileContent] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: files = [] } = useQuery<EncryptedFile[]>({
    queryKey: ['/api/files/user', user?.id],
    enabled: !!user?.id,
  });

  // Decrypt and show file content when a file is selected
  useEffect(() => {
    const showDecrypted = async () => {
      if (!selectedFileId) {
        setDecryptedFileContent('');
        return;
      }
      const selectedFile = files.find(f => f.id === selectedFileId);
      if (!selectedFile) {
        setDecryptedFileContent('');
        return;
      }
      try {
        const key = EncryptionService.getStoredKey();
        console.log('[Decrypt Debug] File:', selectedFile);
        console.log('[Decrypt Debug] Key:', key);
        if (selectedFile.fileType === 'application/pdf' || selectedFile.fileName.endsWith('.pdf')) {
          const pdfBytes = EncryptionService.decryptFileToUint8Array(selectedFile.encryptedData);
          console.log('[Decrypt Debug] PDF Bytes:', pdfBytes);
          const text = await extractPdfText(pdfBytes);
          setDecryptedFileContent(text);
        } else {
          const text = EncryptionService.decryptFile(selectedFile.encryptedData);
          setDecryptedFileContent(text);
        }
      } catch (err) {
        setDecryptedFileContent('Failed to decrypt or parse file.');
        console.error('[Decrypt Debug] Error:', err);
      }
    };
    showDecrypted();
  }, [selectedFileId, files]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  // keep ref in sync so event handlers can read latest messages
  messagesRef.current = messages;
  }, [messages]);

  // Auto-focus the input so first-time users can start typing immediately
  useEffect(() => {
    try {
      inputRef.current?.focus();
    } catch (e) {}
  }, []);

  useEffect(() => {
    // Load chat history if sessionId or localSessionId provided
    const idToLoad = sessionId || localSessionId;
    if (idToLoad) {
      loadChatHistory(idToLoad);
    }
    // eslint-disable-next-line
  }, [sessionId, localSessionId]);

  // Keep localSessionId in sync if parent provides a sessionId
  useEffect(() => {
    if (sessionId && sessionId !== localSessionId) setLocalSessionId(sessionId);
  }, [sessionId, localSessionId]);

  const loadChatHistory = async (id: string) => {
    try {
      const response = await fetch(`/api/chat-sessions/${id}`);
      if (response.ok) {
        const session = await response.json();
        console.log('[Chat Debug] Loaded session from server:', session.id);
        if (session.encryptedHistory) {
          console.log('[Chat Debug] Encrypted history length:', String(session.encryptedHistory).length);
          const decryptedHistory = EncryptionService.decrypt(session.encryptedHistory);
          const history: ChatMessage[] = JSON.parse(decryptedHistory);
          console.log('[Chat Debug] Parsed history messages count:', history.length);
          // Normalize timestamps
          history.forEach(msg => { if (msg.timestamp) msg.timestamp = new Date(msg.timestamp); });
          setMessages(history);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveChatHistory = async (newMessages: ChatMessage[]) => {
    if (!user) {
      console.warn('[Chat Debug] No user available, skipping saveChatHistory');
      return;
    }
    if (newMessages.length === 0) {
      console.warn('[Chat Debug] No messages to save, skipping saveChatHistory');
      return;
    }
    try {
      console.log('[Chat Debug] Saving chat history for user:', user.id);
      console.log('[Chat Debug] Message count:', newMessages.length);
      
      const encryptedHistory = EncryptionService.encrypt(JSON.stringify(newMessages));
      if (!encryptedHistory || encryptedHistory.length === 0) {
        console.warn('[Chat Debug] Encrypted history is empty, aborting save');
        return;
      }
      console.log('[Chat Debug] Encrypted history length:', encryptedHistory.length);
      
      const currentSessionId = sessionId || localSessionId;

      if (currentSessionId) {
        // Update existing session
        console.log('[Chat Debug] Updating existing session:', currentSessionId);
        // Include a friendly title (preview of first message) when updating session
        const titleToUpdate = newMessages[0]?.content ? (newMessages[0].content.slice(0, 50) + (newMessages[0].content.length > 50 ? '...' : '')) : undefined;
        const response = await fetch(`/api/chat-sessions/${currentSessionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encryptedHistory, title: titleToUpdate }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('[Chat Debug] Failed to update session:', errorData);
          throw new Error(`Failed to update session: ${response.status} ${response.statusText}`);
        } else {
          console.log('[Chat Debug] Session updated successfully');
          // Notify parent so session list / titles can refresh
          onNewSession?.(currentSessionId);
        }
  } else {
        // Create new session
  const firstContent = newMessages[0]?.content;
  const title = firstContent ? (firstContent.slice(0, 50) + (firstContent.length > 50 ? '...' : '')) : 'New Chat';
        console.log('[Chat Debug] Creating new session with title:', title);
        
        const requestData = {
          userId: String(user.id || ''),
          title: String(title || 'New Chat'),
          encryptedHistory: String(encryptedHistory),
        };
        console.log('[Chat Debug] Request data:', JSON.stringify(requestData, null, 2));
        
  const response = await fetch('/api/chat-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
        
        if (response.ok) {
          const newSession = await response.json();
          console.log('[Chat Debug] New session created:', newSession);
          // Use local session id so this component starts using the session immediately
          setLocalSessionId(newSession.id);
          onNewSession?.(newSession.id);
          try {
            localStorage.setItem(`pv-chat-session-${user?.id ?? 'anon'}`, newSession.id);
            localStorage.setItem('pv-chat-session', newSession.id);
          } catch (e) {}
        } else {
          const errorData = await response.json();
          console.error('[Chat Debug] Failed to create session:', errorData);
          throw new Error(`Failed to create session: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('[Chat Debug] Failed to save chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !user) return;
    console.log('[Chat Debug] User object:', user);
    
  const userMessage: ChatMessage = { role: 'user', content: inputValue, timestamp: new Date() };
  // Build newMessages from the ref to avoid stale closures
  const newMessages = [...messagesRef.current, userMessage];
  setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    try {
      let fileContent = '';
      let fileName = '';
      // If a file is selected, decrypt and extract text for AI processing
      if (selectedFileId) {
        const selectedFile = files.find(f => f.id === selectedFileId);
        if (selectedFile) {
          try {
            fileName = selectedFile.fileName;
            if (selectedFile.fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
              const pdfBytes = EncryptionService.decryptFileToUint8Array(selectedFile.encryptedData);
              fileContent = await extractPdfText(pdfBytes);
            } else {
              fileContent = EncryptionService.decryptFile(selectedFile.encryptedData);
            }
          } catch (error) {
            throw new Error('Failed to decrypt or parse selected file');
          }
        }
      }
      // Send to Gemini (pass the latest messages array to avoid stale state)
      const aiResponse = await GeminiService.sendMessage(
        inputValue,
        fileContent,
        fileName,
        newMessages
      );
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      // Save encrypted chat history (pass latest array)
      await saveChatHistory(updatedMessages);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Chat error',
        description: (error as Error).message || 'Failed to get AI response',
        variant: 'destructive',
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">AI Assistant</CardTitle>
          <div>
            <Button size="sm" variant="ghost" onClick={() => {
              // Start a fresh local draft — do not create an empty server session yet.
              setMessages([]);
              setLocalSessionId(undefined);
              try { localStorage.removeItem(`pv-chat-session-${user?.id ?? 'anon'}`); localStorage.removeItem('pv-chat-session'); localStorage.removeItem(`pv-chat-${user?.id ?? 'anon'}`); localStorage.removeItem('pv-chat-draft'); } catch (e) {}
              onNewSession?.(undefined as unknown as string);
              toast({ title: 'New chat started' });
            }}>New Chat</Button>
          </div>
        </div>
        <CardDescription>
          Ask questions about your uploaded files - all processing happens locally
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Decrypted file preview */}
        {selectedFileId && decryptedFileContent && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Decrypted File Content Preview</label>
            <div className="border rounded bg-gray-50 p-2 text-xs max-h-40 overflow-y-auto whitespace-pre-wrap" style={{ fontFamily: 'monospace' }}>
              {decryptedFileContent}
            </div>
          </div>
        )}
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
                    {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
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
                ref={inputRef}
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
