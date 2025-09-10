import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/ui/sidebar';
import { FileUpload } from '@/components/file-upload';
import { ChatInterface } from '@/components/chat-interface-with-agents';
import { KeyManagement } from '@/components/key-management';
import { 
  FileText, 
  MessageSquare, 
  Shield, 
  User, 
  LogOut, 
  MoreVertical,
  Trash2,
  Download,
  Bot
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { type EncryptedFile, type ChatSession, type AiAgent } from '@shared/schema';
import { EncryptionService } from '@/lib/encryption';
import KeyInfo from './key-info';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Dashboard({ initialTab }: { initialTab?: string }) {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');
  const [activeChatSession, setActiveChatSession] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showImportKeyBanner, setShowImportKeyBanner] = useState(false);
  const [bannerImportKey, setBannerImportKey] = useState('');

  const handleBannerExportKey = () => {
    try {
      const exportedKey = EncryptionService.exportKey();
      const blob = new Blob([exportedKey], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-vault-encryption-key.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: 'Key exported', description: 'Store your encryption key backup in a safe place' });
    } catch (err) {
      toast({ title: 'Export failed', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const handleBannerImportKey = () => {
    if (!bannerImportKey.trim()) {
      toast({ title: 'Invalid key', description: 'Please paste a valid key', variant: 'destructive' });
      return;
    }

    try {
      EncryptionService.importKey(bannerImportKey.trim());
      setBannerImportKey('');
      setShowImportKeyBanner(false);
      toast({ title: 'Key imported', description: 'Your encryption key has been restored' });
      queryClient.invalidateQueries({ queryKey: ['/api/chat-sessions/user', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/files/user', user?.id] });
    } catch (err) {
      toast({ title: 'Import failed', description: 'Invalid encryption key format', variant: 'destructive' });
    }
  };

  // Use React Query for chat sessions like files and agents
  const { data: chatSessions = [], refetch: refetchChatSessions } = useQuery<ChatSession[]>({
    queryKey: ['/api/chat-sessions/user', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      console.log('[Dashboard Debug] React Query fetching chat sessions...');
      const response = await fetch(`/api/chat-sessions/user/${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch chat sessions');
      const data = await response.json();
      console.log('[Dashboard Debug] React Query loaded chat sessions:', data.length, 'sessions');
      return data;
    },
  });

  // Refetch chat sessions when history tab is accessed
  useEffect(() => {
    if (activeTab === 'history' && user?.id) {
      console.log('[Dashboard Debug] History tab accessed, refetching sessions...');
      refetchChatSessions();
    }
  }, [activeTab, user?.id, refetchChatSessions]);

  const { data: files = [] } = useQuery<EncryptedFile[]>({
    queryKey: ['/api/files/user', user?.id],
    enabled: !!user?.id,
  });

  const { data: agents = [] } = useQuery<AiAgent[]>({
    queryKey: ['/api/ai-agents/user', user?.id],
    enabled: !!user?.id,
  });

  // Chat sessions are loaded on-demand when the history tab is active

  const handleFileUploaded = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/files/user', user?.id] });
  };

  const handleNewChatSession = (sessionId: string) => {
    setActiveChatSession(sessionId);
    // Invalidate chat sessions query to refresh the list
    queryClient.invalidateQueries({ queryKey: ['/api/chat-sessions/user', user?.id] });
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/files/user', user?.id] });
        toast({
          title: "File deleted",
          description: "The file has been permanently removed from your vault",
        });
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete the file",
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = async (file: EncryptedFile) => {
    try {
      const decryptedData = EncryptionService.decryptFile(file.encryptedData);
      const blob = new Blob([decryptedData], { type: file.fileType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "File downloaded",
        description: "File has been decrypted and downloaded",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to decrypt and download the file",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'vault':
        return (
          <div className="space-y-6">
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-800 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                </div>
                <div>
                  <div className="font-semibold">Important: Backup your encryption key</div>
                  <div className="text-sm">Before logging out, export your encryption key so you can import it when you log back in. Without the original key, previously encrypted chat sessions and files cannot be decrypted.</div>
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button onClick={handleBannerExportKey} size="sm" variant="outline">Export Key</Button>
                      <Button onClick={() => setShowImportKeyBanner(s => !s)} size="sm">{showImportKeyBanner ? 'Cancel' : 'Import Key'}</Button>
                    </div>
                    {showImportKeyBanner && (
                      <div className="flex items-center gap-2">
                        <input className="flex-1 px-2 py-1 rounded border border-input bg-background text-foreground" placeholder="Paste exported key here" value={bannerImportKey} onChange={(e) => setBannerImportKey(e.target.value)} />
                        <Button size="sm" onClick={handleBannerImportKey}>Import</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <FileUpload onFileUploaded={handleFileUploaded} />
            
            <Card>
              <CardHeader>
                <CardTitle>Your Files</CardTitle>
                <CardDescription>Encrypted files stored in your vault</CardDescription>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <p>No files uploaded yet</p>
                    <p className="text-sm">Upload your first file to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                        data-testid={`file-item-${file.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                            <FileText className="text-red-600 h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{file.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="w-3 h-3 mr-1 text-green-600" />
                            Encrypted
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" data-testid={`file-menu-${file.id}`}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
        
      case 'chat':
        return (
          <div className="h-full">
            <ChatInterface 
              sessionId={activeChatSession || undefined} 
              onNewSession={handleNewChatSession}
            />
          </div>
        );
        
      case 'history':
        console.log('[Dashboard Debug] Rendering history tab, chatSessions:', chatSessions.length, 'sessions');
        return (
          <Card>
            <CardHeader>
              <CardTitle>Chat History</CardTitle>
              <CardDescription>Your encrypted conversation history</CardDescription>
            </CardHeader>
            <CardContent>
              {chatSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                  <p>No chat history yet</p>
                  <p className="text-sm">Start a conversation to see your history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chatSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted"
                      onClick={() => {
                        console.log('[Dashboard] History clicked, sessionId:', session.id);
                        setActiveChatSession(session.id);
                        setActiveTab('chat');
                      }}
                      data-testid={`chat-session-${session.id}`}
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{session.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Encrypted
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case 'settings':
        return <KeyManagement />;

      case 'key-info':
        return <KeyInfo />;
        
      default:
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-primary h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Encrypted Files</p>
                      <p className="text-2xl font-bold text-foreground" data-testid="file-count">
                        {files.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* AI Conversations stats removed from dashboard per UX request */}
              
              <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Shield className="text-accent h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Security Level</p>
                        <p className="text-xl font-bold text-foreground">Maximum</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                        <Bot className="text-violet-600 h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">AI Agents</p>
                        <p className="text-2xl font-bold text-foreground" data-testid="agent-count">
                          {agents.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FileUpload onFileUploaded={handleFileUploaded} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Files</CardTitle>
                  <CardDescription>Your encrypted file vault</CardDescription>
                </CardHeader>
                <CardContent>
                  {files.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No files uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {files.slice(0, 3).map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                              <FileText className="text-red-600 h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{file.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="w-3 h-3 mr-1 text-green-600" />
                            Encrypted
                          </Badge>
                        </div>
                      ))}
                      {files.length > 3 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setActiveTab('vault')}
                          className="w-full mt-3"
                        >
                          View All Files
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat interface removed from dashboard landing; use Chat tab in sidebar */}
          </div>
        );
    }
  };

  const handleTabChange = (tab: string) => {
    // Use client-side navigation for known routes
    if (tab === 'dashboard') {
      setLocation('/');
      setActiveTab('dashboard');
      return;
    }
    if (tab === 'agents') {
      setLocation('/agents');
      return;
    }
    if (tab === 'vault') {
      setLocation('/vault');
      setActiveTab('vault');
      return;
    }
    if (tab === 'chat') {
      setLocation('/chat');
      setActiveTab('chat');
      return;
    }
    if (tab === 'history') {
      setLocation('/history');
      setActiveTab('history');
      return;
    }
    if (tab === 'settings') {
      setLocation('/settings');
      setActiveTab('settings');
      return;
    }
    if (tab === 'key-info') {
      setLocation('/key-info');
      setActiveTab('key-info');
      return;
    }
    setActiveTab(tab);
  };

  // Keep activeTab in sync with URL path on initial load / location changes
  useEffect(() => {
    const path = location.replace(/^\//, ''); // remove leading slash
    switch (path) {
      case '':
      case 'dashboard':
        setActiveTab('dashboard');
        break;
      case 'vault':
      case 'files':
        setActiveTab('vault');
        break;
      case 'chat':
        setActiveTab('chat');
        break;
      case 'history':
        setActiveTab('history');
        break;
      case 'agents':
        setActiveTab('agents');
        break;
      case 'settings':
        setActiveTab('settings');
        break;
      case 'key-info':
        setActiveTab('key-info');
        break;
      default:
        // keep existing activeTab
        break;
    }
  }, [location]);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        className="fixed h-full bg-sidebar text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground"
      />

  <div className="flex-1 ml-80 overflow-hidden bg-background text-foreground">
        {/* Header */}
        <header className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground capitalize">
                {activeTab === 'dashboard' ? 'Dashboard' : activeTab}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your private AI assistant and encrypted files
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="text-white h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground" data-testid="user-email">
                  {user?.email}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                data-testid="logout-button"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6 overflow-y-auto bg-background text-foreground">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
