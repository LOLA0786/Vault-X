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
import { type EncryptedFile, type ChatSession } from '@shared/schema';
import { EncryptionService } from '@/lib/encryption';
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

  const { data: files = [] } = useQuery<EncryptedFile[]>({
    queryKey: ['/api/files/user', user?.id],
    enabled: !!user?.id,
  });

  const { data: chatSessions = [] } = useQuery<ChatSession[]>({
    queryKey: ['/api/chat-sessions/user', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      console.log('[Dashboard Debug] Fetching chat sessions for user:', user?.id);
      const response = await fetch(`/api/chat-sessions/user/${user?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat sessions');
      }
      const data = await response.json();
      console.log('[Dashboard Debug] Fetched chat sessions:', data);
      return data;
    }
  });

  const handleFileUploaded = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/files/user', user?.id] });
  };

  const handleNewChatSession = (sessionId: string) => {
    setActiveChatSession(sessionId);
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
            <FileUpload onFileUploaded={handleFileUploaded} />
            
            <Card>
              <CardHeader>
                <CardTitle>Your Files</CardTitle>
                <CardDescription>Encrypted files stored in your vault</CardDescription>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <p>No files uploaded yet</p>
                    <p className="text-sm">Upload your first file to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                        data-testid={`file-item-${file.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
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
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => {
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
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="text-secondary h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">AI Conversations</p>
                      <p className="text-2xl font-bold text-foreground" data-testid="chat-count">
                        {chatSessions.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
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
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No files uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {files.slice(0, 3).map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
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

            <ChatInterface onNewSession={handleNewChatSession} />
          </div>
        );
    }
  };

  const handleTabChange = (tab: string) => {
    // Use client-side navigation for known routes
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
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        className="fixed h-full bg-sidebar text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground"
      />

      <div className="flex-1 ml-64 overflow-hidden bg-background text-foreground">
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
        <div className="p-6 overflow-y-auto bg-background text-foreground" style={{ height: 'calc(100vh - 88px)' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
