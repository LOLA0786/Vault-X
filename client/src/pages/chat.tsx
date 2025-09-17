import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { EncryptionService } from '@/lib/encryption';
import { GrokService, type ChatMessage } from '@/lib/grok';
import { extractPdfText } from '@/lib/pdf-utils';
import { type EncryptedFile, type AiAgent } from '@shared/schema';

// Layout Components
import { Sidebar } from '@/components/ui/sidebar';
import { ModernHeader } from '@/components/ui/modern-header';
import { Footer } from '@/components/ui/footer';
import { Container } from '@/components/ui/container';
import { PageTransition } from '@/components/ui/page-transition';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Modern UI Components
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernGrid, ModernContainer, ModernStack } from '@/components/ui/modern-layout';
import { ModernInput } from '@/components/ui/modern-input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SecurityBadge, EncryptionIndicator } from '@/components/ui/security-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

// Icons
import { 
  Bot, 
  User, 
  Send, 
  Shield, 
  Menu, 
  LogOut,
  FileText,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  MessageSquare,
  Zap,
  Home,
  History,
  Settings,
  Key,
  LayoutDashboard
} from 'lucide-react';

// Extended type with decrypted fields
type AgentWithDecrypted = AiAgent & {
  decryptedDescription: string;
  decryptedSystemPrompt: string;
};

interface ChatPageProps {
  sessionId?: string;
  onNewSession?: (sessionId: string) => void;
}

// Mobile Chat Component
function MobileChat({ 
  renderContent 
}: { 
  renderContent: () => React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleTabChange = (tab: string) => {
    if (tab === 'dashboard') {
      setLocation('/');
      return;
    }
    if (tab === 'vault') {
      setLocation('/vault');
      return;
    }
    if (tab === 'agents') {
      setLocation('/agents');
      return;
    }
    if (tab === 'history') {
      setLocation('/history');
      return;
    }
    if (tab === 'settings') {
      setLocation('/settings');
      return;
    }
    if (tab === 'key-info') {
      setLocation('/key-info');
      return;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full bg-sidebar">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Shield className="text-white h-5 w-5" />
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-sidebar-foreground">Private Vault</h1>
                        <p className="text-xs text-sidebar-foreground/70">Your Secure AI Assistant</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Menu */}
                  <nav className="flex-1 p-4">
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                        onClick={() => {
                          handleTabChange('dashboard');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                        onClick={() => {
                          handleTabChange('vault');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 7H21L19 2H5L3 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        File Vault
                      </Button>
                      <Button
                        variant="default"
                        className="w-full justify-start bg-primary text-primary-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <MessageSquare className="mr-3 h-5 w-5" />
                        AI Assistant
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                        onClick={() => {
                          handleTabChange('agents');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Bot className="mr-3 h-5 w-5" />
                        AI Agents
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                        onClick={() => {
                          handleTabChange('history');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <History className="mr-3 h-5 w-5" />
                        Chat History
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                        onClick={() => {
                          handleTabChange('settings');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Settings className="mr-3 h-5 w-5" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                        onClick={() => {
                          handleTabChange('key-info');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Key className="mr-3 h-5 w-5" />
                        How it works
                      </Button>
                    </div>
                  </nav>
                  
                  {user && (
                    <div className="mt-auto p-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-sidebar-foreground truncate">
                          {user.email}
                        </span>
                        <Button variant="ghost" size="sm" onClick={logout}>
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MessageSquare className="text-white h-4 w-4" />
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                AI Chat
              </h1>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={logout}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 pb-4">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
}

export default function ChatPage({ sessionId, onNewSession }: ChatPageProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Track URL session ID changes
  const [urlSessionId, setUrlSessionId] = useState<string | null>(null);
  
  // Update URL session ID when location changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionFromUrl = urlParams.get('session');
    setUrlSessionId(sessionFromUrl);
  }, [location]);

  const effectiveSessionId = sessionId || urlSessionId;

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [localSessionId, setLocalSessionId] = useState<string | undefined>(effectiveSessionId || undefined);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentWithDecrypted | null>(null);
  const [showFilesPanel, setShowFilesPanel] = useState(false);
  const [showAgentsPanel, setShowAgentsPanel] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);

  const handleTabChange = (tab: string) => {
    if (tab === 'dashboard') {
      setLocation('/');
      return;
    }
    if (tab === 'vault') {
      setLocation('/vault');
      return;
    }
    if (tab === 'agents') {
      setLocation('/agents');
      return;
    }
    if (tab === 'history') {
      setLocation('/history');
      return;
    }
    if (tab === 'settings') {
      setLocation('/settings');
      return;
    }
    if (tab === 'key-info') {
      setLocation('/key-info');
      return;
    }
  };

  // Data fetching
  const { data: files = [] } = useQuery<EncryptedFile[]>({
    queryKey: ['/api/files/user', user?.id],
    enabled: !!user?.id,
  });

  const { data: agents = [] } = useQuery<AiAgent[]>({
    queryKey: ['/api/ai-agents/user', user?.id],
    enabled: !!user?.id,
  });

  // Process agents to include decrypted content
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    messagesRef.current = messages;
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    try {
      inputRef.current?.focus();
    } catch (e) {}
  }, []);

  // Load chat history
  useEffect(() => {
    // Clear messages when navigating to a new session
    if (effectiveSessionId && effectiveSessionId !== localSessionId) {
      setMessages([]);
      setLocalSessionId(effectiveSessionId);
    }

    const currentId = effectiveSessionId || localSessionId;
    
    if (currentId) {
      loadChatHistory(currentId);
      return;
    }

    // Clear messages if no session ID and try to restore from localStorage
    setMessages([]);
    try {
      const keyUser = `pv-chat-${user?.id ?? 'anon'}`;
      const stored = localStorage.getItem(keyUser);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatMessage[];
        parsed.forEach(m => { if (m.timestamp) m.timestamp = new Date(m.timestamp); });
        setMessages(parsed);
      }
    } catch (e) {
      // ignore
    }
  }, [effectiveSessionId, localSessionId, user?.id, location, urlSessionId]);

  const loadChatHistory = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}`);
      if (!response.ok) {
        setMessages([]);
        return;
      }
      const session = await response.json();

      if (!session.encryptedHistory) {
        setMessages([]);
        return;
      }

      try {
        const decryptedHistoryJson = EncryptionService.decrypt(session.encryptedHistory);
        const historyMessages = JSON.parse(decryptedHistoryJson) as ChatMessage[];
        historyMessages.forEach(msg => {
          if (msg.timestamp) {
            msg.timestamp = new Date(msg.timestamp);
          }
        });
        setMessages(historyMessages);
      } catch (err) {
        console.error('Failed to decrypt history:', err);
        setMessages([]);
        
        if (!sessionStorage.getItem(`key-mismatch-warned-${sessionId}`)) {
          toast({
            title: 'Chat History Unavailable',
            description: 'This chat was encrypted with a different key. Starting a new conversation.',
            variant: 'default',
          });
          sessionStorage.setItem(`key-mismatch-warned-${sessionId}`, 'true');
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
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

      if (currentSessionId) {
        const titleToUpdate = toSave[0]?.content ? (toSave[0].content.substring(0, 50) + (toSave[0].content.length > 50 ? '...' : '')) : undefined;
        
        const response = await fetch(`/api/chat-sessions/${currentSessionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encryptedHistory, title: titleToUpdate }),
        });

        if (response.ok) {
          onNewSession?.(currentSessionId);
          // Invalidate chat sessions query to refresh the history page
          queryClient.invalidateQueries({ queryKey: ['/api/chat-sessions/user', user?.id] });
        }
      } else {
        const firstContent = toSave[0]?.content;
        const title = firstContent ? (firstContent.substring(0, 50) + (firstContent.length > 50 ? '...' : '')) : 'New Chat';
        
        const response = await fetch('/api/chat-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            title,
            encryptedHistory,
            agentId: selectedAgent?.id
          }),
        });

        if (response.ok) {
          const newSession = await response.json();
          setLocalSessionId(newSession.id);
          onNewSession?.(newSession.id);
          
          // Invalidate chat sessions query to refresh the history page
          queryClient.invalidateQueries({ queryKey: ['/api/chat-sessions/user', user?.id] });
          
          try {
            localStorage.setItem(`pv-chat-session-${user?.id ?? 'anon'}`, newSession.id);
            localStorage.removeItem(`pv-chat-${user?.id ?? 'anon'}`);
          } catch (e) {}
        }
      }
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !user) return;
    
    const userMessage: ChatMessage = { role: 'user', content: inputValue, timestamp: new Date() };
    const newMessages = [...messagesRef.current, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      let fileContent = '';
      let fileName = '';
      
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
      
      const sanitizeMarkdown = (s: string) => {
        try {
          return s
            .replace(/\*{1,3}(.+?)\*{1,3}/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setLocalSessionId(undefined);
    setSelectedFileId(null);
    if (user?.id) {
      localStorage.removeItem(`pv-chat-session-${user.id}`);
    }
    localStorage.removeItem('pv-chat-session');
    toast({ title: 'New chat started', description: 'Fresh conversation ready' });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied', description: 'Message copied to clipboard' });
  };

  const renderContent = () => {
    return (
      <ModernContainer className="h-full py-2 sm:py-6">
        <ModernGrid cols={1} className="h-full">
          {/* Main Chat Interface */}
          <ModernCard variant="glass" className="flex flex-col h-full min-h-[500px] sm:min-h-[600px]">
            {/* Chat Header */}
            <ModernCardHeader className="border-b border-border/50 p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <ModernCardTitle className="text-lg sm:text-xl truncate">
                      {selectedAgent ? selectedAgent.name : 'AI Assistant'}
                    </ModernCardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {selectedAgent ? selectedAgent.decryptedDescription : 'Your private, encrypted AI assistant'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <SecurityBadge variant="encrypted" size="sm" animated className="hidden sm:flex">
                    End-to-End Encrypted
                  </SecurityBadge>
                  <SecurityBadge variant="encrypted" size="sm" animated className="flex sm:hidden">
                    Encrypted
                  </SecurityBadge>
                  <Button variant="ghost" size="sm" onClick={startNewChat} className="px-2 sm:px-3">
                    <RefreshCw className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">New Chat</span>
                  </Button>
                </div>
              </div>
            </ModernCardHeader>

            {/* Control Panels */}
            <div className="border-b border-border/50 bg-muted/20">
              <ModernStack spacing="sm" className="p-2 sm:p-4">
                {/* Files Panel */}
                <ModernCard variant="glass" className="transition-all duration-200">
                  <div 
                    className="flex items-center justify-between p-2 sm:p-3 cursor-pointer touch-manipulation"
                    onClick={() => setShowFilesPanel(!showFilesPanel)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">Files ({files.length})</span>
                      {selectedFileId && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          1 selected
                        </Badge>
                      )}
                    </div>
                    {showFilesPanel ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
                  </div>
                  
                  {showFilesPanel && (
                    <ModernCardContent className="pt-0 p-2 sm:p-3">
                      {files.length === 0 ? (
                        <p className="text-xs sm:text-sm text-muted-foreground text-center py-3 sm:py-4">
                          No files uploaded. Go to File Vault to upload files.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {files.map((file) => (
                            <div
                              key={file.id}
                              className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 border touch-manipulation ${
                                selectedFileId === file.id
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-muted/50 hover:bg-muted border-border/50 hover:border-border'
                              }`}
                              onClick={() => setSelectedFileId(selectedFileId === file.id ? null : file.id)}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="h-4 w-4 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs sm:text-sm font-medium truncate">{file.fileName}</p>
                                  <p className="text-xs opacity-70">
                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ModernCardContent>
                  )}
                </ModernCard>

                {/* Agents Panel */}
                <ModernCard variant="glass" className="transition-all duration-200">
                  <div 
                    className="flex items-center justify-between p-2 sm:p-3 cursor-pointer touch-manipulation"
                    onClick={() => setShowAgentsPanel(!showAgentsPanel)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <Bot className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base truncate">AI Agents ({processedAgents.length})</span>
                      {selectedAgent && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs hidden sm:inline-flex">
                          {selectedAgent.name}
                        </Badge>
                      )}
                    </div>
                    {showAgentsPanel ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
                  </div>
                  
                  {showAgentsPanel && (
                    <ModernCardContent className="pt-0 p-2 sm:p-3">
                      {processedAgents.length === 0 ? (
                        <p className="text-xs sm:text-sm text-muted-foreground text-center py-3 sm:py-4">
                          No AI agents created. Go to AI Agents to create one.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          <div
                            className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 border touch-manipulation ${
                              !selectedAgent
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted/50 hover:bg-muted border-border/50 hover:border-border'
                            }`}
                            onClick={() => setSelectedAgent(null)}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Sparkles className="h-4 w-4 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium">Default Assistant</p>
                                <p className="text-xs opacity-70">General purpose AI</p>
                              </div>
                            </div>
                          </div>
                          {processedAgents.map((agent) => (
                            <div
                              key={agent.id}
                              className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 border touch-manipulation ${
                                selectedAgent?.id === agent.id
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-muted/50 hover:bg-muted border-border/50 hover:border-border'
                              }`}
                              onClick={() => setSelectedAgent(agent)}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Bot className="h-4 w-4 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs sm:text-sm font-medium truncate">{agent.name}</p>
                                  <p className="text-xs opacity-70 line-clamp-1">
                                    {agent.decryptedDescription}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ModernCardContent>
                  )}
                </ModernCard>
              </ModernStack>
            </div>

            {/* Messages Area */}
            <ModernCardContent className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-8 sm:py-16 px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900/30 dark:to-purple-800/30 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                    <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
                    Start a conversation
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed">
                    Ask questions, upload files, or choose an AI agent to get started
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                    <div className="text-center p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors touch-manipulation">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-medium">Encrypted</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors touch-manipulation">
                      <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-medium">Private</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors touch-manipulation">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-medium">Fast</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div key={index} className="flex gap-2 sm:gap-4 group px-2 sm:px-0">
                      {message.role === 'assistant' && (
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-border flex-shrink-0 mt-1">
                          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                            <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${message.role === 'user' ? 'ml-auto' : ''}`}>
                        <div className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm transition-all duration-200 hover:shadow-md touch-manipulation ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-auto' 
                            : 'bg-muted/50 text-foreground border border-border/50'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <div className="flex items-center justify-between mt-2 sm:mt-3">
                            <span className="text-xs opacity-70">
                              {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyMessage(message.content)}
                                className="h-6 w-6 p-0 touch-manipulation"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {message.role === 'user' && (
                        <Avatar className="w-10 h-10 border-2 border-border flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </ModernCardContent>

            {/* Input Area */}
            <div className="border-t border-border/50 bg-muted/20 p-3 sm:p-6">
              <div className="flex gap-2 sm:gap-3">
                <Textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  disabled={isLoading}
                  className="flex-1 min-h-[50px] sm:min-h-[60px] max-h-32 resize-none rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/20 text-sm sm:text-base touch-manipulation"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  variant="premium"
                  size="lg"
                  className="px-4 sm:px-6 h-[50px] sm:h-[60px] min-w-[50px] sm:min-w-[60px] touch-manipulation"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-center mt-3 sm:mt-4 text-xs text-muted-foreground">
                <EncryptionIndicator isEncrypted={true} showLabel={true} size="sm" />
                <span className="ml-2 text-xs sm:text-sm">Messages are encrypted before sending</span>
              </div>
            </div>
          </ModernCard>
        </ModernGrid>
      </ModernContainer>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileChat renderContent={renderContent} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        <Sidebar 
          activeTab="chat" 
          onTabChange={handleTabChange}
          className="fixed h-full w-64 bg-sidebar text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground"
        />

        <div className="flex-1 ml-64 flex flex-col min-h-screen bg-background text-foreground">
          {/* Modern Header */}
          <ModernHeader
            title="AI Chat"
            subtitle="Secure, encrypted conversations with your AI assistant"
            user={user ? { email: user.email } : undefined}
            onLogout={logout}
            showSearch={false}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-hidden bg-background text-foreground">
            <PageTransition>
              {renderContent()}
            </PageTransition>
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}