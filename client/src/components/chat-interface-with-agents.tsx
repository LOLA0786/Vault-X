import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Paperclip, Send, Bot, User, Shield, Lock, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { GrokService, type ChatMessage } from '@/lib/grok';
import { EncryptionService } from '@/lib/encryption';
import { extractPdfText } from '@/lib/pdf-utils';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { type EncryptedFile, type AiAgent } from '@shared/schema';
import { cn } from '@/lib/utils';
import { AgentList } from './agent-list';

// Extended type with decrypted fields
type AgentWithDecrypted = AiAgent & {
  decryptedDescription: string;
  decryptedSystemPrompt: string;
};

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
  const [selectedAgent, setSelectedAgent] = useState<AgentWithDecrypted | null>(null);
  const [decryptedFileContent, setDecryptedFileContent] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const [sidebarWidth, setSidebarWidth] = useState<number>(480);
  const [isDragging, setIsDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: files = [] } = useQuery<EncryptedFile[]>({
    queryKey: ['/api/files/user', user?.id],
    enabled: !!user?.id,
  });

  const { data: agents = [], isLoading: isAgentsLoading } = useQuery<AiAgent[]>({
    queryKey: ['/api/ai-agents/user', user?.id],
    enabled: !!user?.id,
  });

  // Decrypt and process agent data
  const processedAgents: AgentWithDecrypted[] = agents.map(agent => {
    try {
      const decryptedDescription = EncryptionService.decrypt(agent.encryptedDescription);
      const decryptedSystemPrompt = EncryptionService.decrypt(agent.encryptedSystemPrompt);
      return {
        ...agent,
        decryptedDescription,
        decryptedSystemPrompt
      } as AgentWithDecrypted;
    } catch (error) {
      console.error('Failed to decrypt agent data:', error);
      return {
        ...agent,
        decryptedDescription: 'Failed to decrypt description',
        decryptedSystemPrompt: ''
      } as AgentWithDecrypted;
    }
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

        let content: string;
        if (selectedFile.fileType === 'application/pdf' || selectedFile.fileName.endsWith('.pdf')) {
          const pdfBytes = EncryptionService.decryptFileToUint8Array(selectedFile.encryptedData);
          content = await extractPdfText(pdfBytes);
        } else {
          content = EncryptionService.decryptFile(selectedFile.encryptedData);
        }
        
        // Truncate preview for UI display (but keep full content for AI processing)
        setDecryptedFileContent(content.substring(0, 1000) + (content.length > 1000 ? '...' : ''));
      } catch (error) {
        console.error('Failed to decrypt file:', error);
        setDecryptedFileContent('Failed to decrypt file content');
        toast({
          title: 'Decryption Failed',
          description: 'Could not decrypt the selected file',
          variant: 'destructive',
        });
      }
    };
    showDecrypted();
  }, [selectedFileId, files, toast]);

  // Persist and restore sidebar width
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pv-chat-sidebar-width');
      if (stored) setSidebarWidth(Number(stored));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('pv-chat-sidebar-width', String(sidebarWidth));
    } catch (e) {}
  }, [sidebarWidth]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      const newWidth = e.clientX;
      // enforce min/max widths
      const min = 220;
      const max = Math.max(360, window.innerWidth - 480);
      const clamped = Math.max(min, Math.min(newWidth, max));
      setSidebarWidth(clamped);
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // keep ref in sync so sendMessage reads latest messages
  messagesRef.current = messages;
  }, [messages]);

  // Auto-focus the textarea so first-time users can start typing immediately
  useEffect(() => {
    try {
      inputRef.current?.focus();
    } catch (e) {}
  }, []);

  // Persist messages locally while there is no server session id
  useEffect(() => {
    const currentSession = localSessionId || sessionId;
    if (!currentSession) {
      try {
  const keyUser = `pv-chat-${user?.id ?? 'anon'}`;
  const keyGlobal = `pv-chat-draft`;
  localStorage.setItem(keyUser, JSON.stringify(messages));
  localStorage.setItem(keyGlobal, JSON.stringify(messages));
      } catch (e) {
        // ignore storage errors
      }
    }
  }, [messages, localSessionId, sessionId, user?.id]);

  // Load chat history on mount: prefer server session, otherwise restore local draft
  useEffect(() => {
    // keep localSessionId in sync if parent provides a sessionId
    if (sessionId && sessionId !== localSessionId) setLocalSessionId(sessionId);

    // Try to restore persisted session id (user-specific then global)
    try {
      const sessionKeyUser = `pv-chat-session-${user?.id ?? 'anon'}`;
      const sessionKeyGlobal = `pv-chat-session`;
      const persistedUserSession = localStorage.getItem(sessionKeyUser);
      const persistedGlobalSession = localStorage.getItem(sessionKeyGlobal);
      const restoredSession = persistedUserSession || persistedGlobalSession;
      if (restoredSession && !localSessionId) {
        setLocalSessionId(restoredSession);
      }
    } catch (e) {
      // ignore
    }

    const currentId = sessionId || localSessionId || localStorage.getItem(`pv-chat-session-${user?.id ?? 'anon'}`) || localStorage.getItem('pv-chat-session');
    if (currentId) {
      loadChatHistory(currentId);
      return;
    }

    // No server session: try to restore from localStorage drafts (user-specific then global)
    try {
      const keyUser = `pv-chat-${user?.id ?? 'anon'}`;
      const keyGlobal = `pv-chat-draft`;
      const stored = localStorage.getItem(keyUser) || localStorage.getItem(keyGlobal);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatMessage[];
        parsed.forEach(m => { if (m.timestamp) m.timestamp = new Date(m.timestamp); });
        setMessages(parsed);
      }
    } catch (e) {
      // ignore
    }
  }, [sessionId, localSessionId, user?.id]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const loadChatHistory = async (sessionId: string) => {
    try {
      console.log('[Chat Debug] Loading chat history for session:', sessionId);
      const response = await fetch(`/api/chat-sessions/${sessionId}`);
      if (!response.ok) {
        console.error('[Chat Debug] Failed to load session:', response.status);
        // If session doesn't exist, start fresh
        setMessages([]);
        return;
      }
      const session = await response.json();
      console.log('[Chat Debug] Session loaded (id):', session.id);

      if (!session.encryptedHistory) {
        console.warn('[Chat Debug] Session has no encryptedHistory');
        setMessages([]);
        return;
      }

      console.log('[Chat Debug] Encrypted history length:', String(session.encryptedHistory).length);
      try {
        const decryptedHistoryJson = EncryptionService.decrypt(session.encryptedHistory);
        const historyMessages = JSON.parse(decryptedHistoryJson) as ChatMessage[];
        console.log('[Chat Debug] Parsed history messages count:', historyMessages.length);
        // Convert string dates back to Date objects
        historyMessages.forEach(msg => {
          if (msg.timestamp) {
            msg.timestamp = new Date(msg.timestamp);
          }
        });
        setMessages(historyMessages);
      } catch (err) {
        console.error('[Chat Debug] Failed to decrypt history:', err);
        console.log('[Chat Debug] This chat was encrypted with a different key. Starting fresh conversation.');
        
        // Clear the old encrypted history and start fresh
        setMessages([]);
        
        // Show a user-friendly message only once per session
        if (!sessionStorage.getItem(`key-mismatch-warned-${sessionId}`)) {
          toast({
            title: 'Chat History Unavailable',
            description: 'This chat was encrypted with a different key. Starting a new conversation.',
            variant: 'default',
          });
          sessionStorage.setItem(`key-mismatch-warned-${sessionId}`, 'true');
        }
        
        // Don't prevent new messages from being sent - just start with empty history
      }
    } catch (error) {
      console.error('[Chat Debug] Error loading chat history:', error);
      // Always ensure we can start fresh even if there are errors
      setMessages([]);
    }
  };

  const saveChatHistory = async (msgs?: ChatMessage[]) => {
    try {
      const toSave = msgs ?? messages;
      if (!user || toSave.length === 0) return;

      const messagesJson = JSON.stringify(toSave);
      const encryptedHistory = EncryptionService.encrypt(messagesJson);

      const currentSessionId = localSessionId || sessionId;
      console.log('[Chat Debug] Saving chat history with current key');

      if (currentSessionId) {
        // Update existing session
        const titleToUpdate = toSave[0]?.content ? (toSave[0].content.substring(0, 50) + (toSave[0].content.length > 50 ? '...' : '')) : undefined;
        
        console.log('[Chat Debug] Updating session:', currentSessionId);
        console.log('[Chat Debug] Encrypted history length:', encryptedHistory.length);
        console.log('[Chat Debug] Title to update:', titleToUpdate);
        
        const response = await fetch(`/api/chat-sessions/${currentSessionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encryptedHistory, title: titleToUpdate }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update session: ${response.status} ${response.statusText}`);
        } else {
          onNewSession?.(currentSessionId);
        }
      } else {
        // Create new session on the server and persist the id locally
  const firstContent = toSave[0]?.content;
  const title = firstContent ? (firstContent.substring(0, 50) + (firstContent.length > 50 ? '...' : '')) : 'New Chat';
        const requestData = {
          userId: user.id,
          title,
          encryptedHistory,
          agentId: selectedAgent?.id
        };

        const response = await fetch('/api/chat-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const newSession = await response.json();
          console.log('[Chat Debug] New session created:', newSession);
          setLocalSessionId(newSession.id);
          onNewSession?.(newSession.id);
          try {
            localStorage.setItem(`pv-chat-session-${user?.id ?? 'anon'}`, newSession.id);
            localStorage.setItem('pv-chat-session', newSession.id);
            localStorage.removeItem(`pv-chat-${user?.id ?? 'anon'}`);
            localStorage.removeItem('pv-chat-draft');
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

  const startFreshConversation = () => {
    console.log('[Chat Debug] Starting fresh conversation');
    setMessages([]);
    setLocalSessionId(undefined);
    // Clear any stored session references
    if (user?.id) {
      localStorage.removeItem(`pv-chat-session-${user.id}`);
    }
    localStorage.removeItem('pv-chat-session');
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !user) return;
    console.log('[Chat Debug] User object:', user);
    
  const userMessage: ChatMessage = { role: 'user', content: inputValue, timestamp: new Date() };
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
      
      // Get system prompt from selected agent if available
      let systemPrompt = undefined;
      if (selectedAgent) {
        systemPrompt = selectedAgent.decryptedSystemPrompt;
      }
      
      const aiResponse = await GrokService.sendMessage(
        inputValue,
        fileContent,
        fileName,
        newMessages,
        systemPrompt
      );
      
      // Sanitize simple Markdown (bold/italic/code) so UI shows plain text
      const sanitizeMarkdown = (s: string) => {
        try {
          return s
            // remove bold/italic markers **bold**, *italic*, ___
            .replace(/\*{1,3}(.+?)\*{1,3}/g, '$1')
            // remove inline code `code`
            .replace(/`([^`]+)`/g, '$1')
            // remove fenced code blocks code
            .replace(/([\s\S]*?)/g, '$1');
        } catch (e) {
          return s;
        }
      };

      const aiResponseSanitized = sanitizeMarkdown(aiResponse);

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponseSanitized,
        timestamp: new Date(),
      };
      
  const updatedMessages = [...newMessages, aiMessage];
  setMessages(updatedMessages);

  // Save chat history after updating with AI response (pass latest messages to avoid stale state)
  await saveChatHistory(updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get AI response',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectFile = (fileId: string) => {
    setSelectedFileId(fileId === selectedFileId ? null : fileId);
  };

  const handleAgentSelect = (agent: AgentWithDecrypted | null) => {
    setSelectedAgent(agent);
    // If changing agent in middle of conversation, make it clear to user
    if (messages.length > 0) {
      toast({
        title: agent ? `Switched to ${agent.name}` : 'Using default AI assistant',
        description: 'Your next message will use the selected AI agent',
      });
    }
  };
  

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-shrink-0 px-4 py-3 border-b bg-card">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">AI Chat</h1>
            <p className="text-sm text-muted-foreground">Ask questions and get AI assistance</p>
          </div>
          {selectedAgent && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Bot className="h-3 w-3" />
              {selectedAgent.name}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 flex w-full min-h-0 relative">
        {/* Floating expand button when sidebar is collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="absolute top-2 left-2 z-20 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 border-2 border-background"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Left sidebar - files and agents (responsive) */}
        <aside
          className={`relative bg-card flex-shrink-0 flex-col transition-all duration-150 ${
            collapsed ? 'w-0 border-0 overflow-hidden' : 'border-r'
          } hidden lg:flex`}
          style={{ width: collapsed ? 0 : sidebarWidth }}
        >
          {!collapsed && (
            <div className="flex items-center justify-end px-2 py-1">
              <button
                onClick={() => setCollapsed(true)}
                aria-label="Collapse sidebar"
                className="p-1 rounded hover:bg-muted"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="mb-8">
              {!collapsed && <h3 className="text-xl font-semibold mb-6">Files</h3>}
              <div className="space-y-4 max-h-72 overflow-y-auto">
                {files.length === 0 ? (
                  !collapsed && <p className="text-sm text-muted-foreground">No files uploaded</p>
                ) : (
                  files.map((file) => (
                    <div
                      key={file.id}
                      className={`text-base p-4 rounded-xl cursor-pointer transition-colors ${
                        selectedFileId === file.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => selectFile(file.id)}
                    >
                      {!collapsed && (
                        <>
                          <div className="font-medium truncate text-sm">{file.fileName}</div>
                          <div className="text-xs opacity-70 mt-2">
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t pt-8">
              <AgentList
                onSelectAgent={handleAgentSelect}
                selectedAgentId={selectedAgent?.id}
              />
            </div>
          </div>
          {/* draggable divider */}
          <div
            onMouseDown={() => setIsDragging(true)}
            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-border"
            style={{ transform: 'translateX(0.5px)' }}
          />
        </aside>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-h-0 h-full">
          <header className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center justify-between px-4 py-3 border-b bg-card gap-3 lg:gap-0">
            <div className="flex items-center space-x-3">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <div className="text-base font-medium text-foreground">{selectedAgent ? selectedAgent.name : 'AI Assistant'}</div>
                <div className="text-xs text-muted-foreground">{selectedAgent ? selectedAgent.decryptedDescription : 'Private assistant'}</div>
              </div>
            </div>

            <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => {
                    // Reset local draft and do not create an empty server session yet
                    setMessages([]);
                    setLocalSessionId(undefined);
                    try { localStorage.removeItem(`pv-chat-session-${user?.id ?? 'anon'}`); localStorage.removeItem('pv-chat-session'); localStorage.removeItem(`pv-chat-${user?.id ?? 'anon'}`); localStorage.removeItem('pv-chat-draft'); } catch (e) {}
                    onNewSession?.(null as any);
                    toast({ title: 'New chat started', description: 'Fresh conversation ready' });
                  }}
                  title="Start a new conversation (helps resolve decryption issues)"
                  className="w-full sm:w-auto"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    New Chat
                  </Button>
                  {processedAgents.length > 0 && (
                    <select
                      value={selectedAgent?.id || ''}
                      onChange={(e) => {
                        const id = e.target.value || null;
                        const agent = processedAgents.find(a => a.id === id) || null;
                        handleAgentSelect(agent);
                      }}
                      className="w-full sm:w-auto px-3 py-2 border rounded-lg text-sm bg-background border-input text-foreground"
                    >
                      <option value="">Default Assistant</option>
                      {processedAgents.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  )}
                </div>
            </div>
          </header>

          {/* Mobile Files & Agents Section */}
          <div className="lg:hidden border-b bg-muted/30">
            <div className="px-4 py-3">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-foreground">
                  <span>Files & AI Agents</span>
                  <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-3 space-y-4">
                  {/* Mobile Files */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Files</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {files.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No files uploaded</p>
                      ) : (
                        files.map((file) => (
                          <div
                            key={file.id}
                            className={`text-sm p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedFileId === file.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                            onClick={() => selectFile(file.id)}
                          >
                            <div className="font-medium truncate">{file.fileName}</div>
                            <div className="text-xs opacity-70 mt-1">
                              {file.fileType} • {new Date(file.uploadedAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Mobile Agents */}
                  {processedAgents.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">AI Agents</h4>
                      <div className="space-y-2">
                        {processedAgents.map((agent) => (
                          <div
                            key={agent.id}
                            className={`text-sm p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedAgent?.id === agent.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                            onClick={() => handleAgentSelect(agent)}
                          >
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-xs opacity-70 mt-1 line-clamp-2">
                              {agent.decryptedDescription}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </details>
            </div>
          </div>

          <section className="flex-1 overflow-y-auto px-4 py-4 space-y-4" data-testid="chat-messages">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Bot className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" />
                  <p className="text-xl font-medium mb-2">Start a conversation with {selectedAgent ? selectedAgent.name : 'your AI assistant'}</p>
                  <p className="text-sm mt-2">Upload files and ask questions — everything is processed locally.</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="flex items-end gap-3" data-testid={`message-${message.role}-${index}`}>
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <Bot className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <div className={cn(
                    'max-w-[75%] px-4 py-3 rounded-lg break-words',
                    message.role === 'user'
                      ? 'ml-auto bg-primary text-white rounded-bl-lg rounded-tl-lg rounded-tr-lg'
                      : 'mr-auto bg-muted text-foreground rounded-br-lg rounded-tr-lg rounded-tl-lg'
                  )}>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-60 mt-2 text-right">
                      {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
                      {message.role === 'assistant' && ' • File decrypted locally'}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </section>

          <div className="flex-shrink-0 border-t px-4 py-3 bg-card">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Textarea
                  ref={inputRef}
                  placeholder={`Ask a question... (Using ${selectedAgent ? selectedAgent.name : 'Assistant'})`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="min-h-[50px] max-h-24 resize-none"
                  data-testid="chat-input"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Lock className="w-3 h-3 mr-1 text-primary" />
                    Your files and agent prompts are decrypted locally before AI processing
                  </div>
                  <div className="flex items-center space-x-3">
                    {selectedFileId && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Paperclip className="w-4 h-4" />
                        <span>File attached</span>
                      </div>
                    )}
                    <Button onClick={sendMessage} disabled={!inputValue.trim() || isLoading} size="lg">
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}