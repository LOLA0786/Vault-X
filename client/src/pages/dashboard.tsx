import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard-layout';
import { DashboardOverview } from '@/components/dashboard-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SecurityBadge, SecurityStatus, SecurityIcon, EncryptionIndicator } from '@/components/ui/security-badge';
import { FileUpload } from '@/components/file-upload';
import { ChatInterface } from '@/components/chat-interface-with-agents';
import { KeyManagement } from '@/components/key-management';
import {
  FileText,
  MessageSquare,
  Shield,
  MoreVertical,
  Trash2,
  Download,
  Lock,
  Eye,
  Database,
  Key,
  Clock,
  ArrowRight,
  HardDrive
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
      const response = await fetch(`/api/chat-sessions/user/${user?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat sessions');
      }
      return response.json();
    }
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setLocation(`/${tab === 'dashboard' ? '' : tab}`);
  };

  const handleFileUploaded = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/files/user', user?.id] });
  };

  const handleNewChatSession = (sessionId: string) => {
    setActiveChatSession(sessionId);
    queryClient.invalidateQueries({ queryKey: ['/api/chat-sessions/user', user?.id] });
  };

  const handleDeleteChatSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/chat-sessions/user', user?.id] });
        toast({
          title: "Chat session deleted",
          description: "The chat session has been permanently removed from your history",
        });
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete the chat session",
        variant: "destructive",
      });
    }
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
          <div className="h-full w-full overflow-y-auto p-6">
            <div className="space-y-8">
            {/* Vault Header */}
            <div className="bg-gradient-to-br from-security-50 to-primary-50 dark:from-slate-800 dark:to-slate-700 border border-security-200 dark:border-slate-600 rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <SecurityIcon type="database" size="lg" />
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Secure File Vault</h1>
                    <p className="text-base text-muted-foreground">End-to-end encrypted document storage</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <SecurityStatus status="encrypted" message={`${files.length} files encrypted`} />
                  <SecurityBadge variant="secure" size="lg" animated>
                    Vault Active
                  </SecurityBadge>
                </div>
              </div>

              {/* Security Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card variant="professional">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                        <HardDrive className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{files.length}</p>
                        <p className="text-sm text-muted-foreground">Files Stored</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="professional">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-security-500 to-security-600 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">100%</p>
                        <p className="text-sm text-muted-foreground">Encrypted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="professional">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg flex items-center justify-center">
                        <Key className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">AES-256</p>
                        <p className="text-sm text-muted-foreground">Encryption</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="professional">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">Zero</p>
                        <p className="text-sm text-muted-foreground">Knowledge</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <FileUpload onFileUploaded={handleFileUploaded} />

            <Card variant="professional">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <SecurityIcon type="database" size="md" />
                      Your Encrypted Files
                    </CardTitle>
                    <CardDescription className="text-base">Secure files stored in your private vault</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground font-medium">{files.length} files</span>
                    <SecurityBadge variant="encrypted" size="md" animated>
                      All Encrypted
                    </SecurityBadge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Database className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">No files uploaded yet</h3>
                    <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
                      Upload your first file to get started with secure, encrypted storage.
                    </p>
                    <SecurityBadge variant="secure" size="lg" animated>
                      Ready for Secure Upload
                    </SecurityBadge>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="group flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FileText className="text-white h-7 w-7" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-base font-semibold text-foreground">{file.fileName}</p>
                              <EncryptionIndicator isEncrypted={true} showLabel={false} size="md" />
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Uploaded {new Date(file.uploadedAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-security-600" />
                                <span className="text-security-600 font-medium">AES-256 Encrypted</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <SecurityBadge variant="encrypted" size="md" animated>
                            Secured
                          </SecurityBadge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                              <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download & Decrypt
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-danger-600"
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
          <div className="h-full w-full overflow-y-auto p-6">
            <div className="space-y-8">
            <div className="bg-gradient-to-br from-security-50 to-primary-50 dark:from-slate-800 dark:to-slate-700 border border-security-200 dark:border-slate-600 rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <SecurityIcon type="bot" size="lg" />
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Chat History</h1>
                    <p className="text-base text-muted-foreground">Your encrypted conversation archive</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <SecurityStatus status="encrypted" message={`${chatSessions.length} sessions encrypted`} />
                  <SecurityBadge variant="secure" size="lg" animated>Privacy Protected</SecurityBadge>
                </div>
              </div>
            </div>

            <Card variant="professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <SecurityIcon type="bot" size="md" />
                  Encrypted Chat History
                </CardTitle>
                <CardDescription className="text-base">Your private conversations with AI agents</CardDescription>
              </CardHeader>
              <CardContent>
                {chatSessions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">No chat history yet</h3>
                    <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
                      Start a conversation with an AI agent to see your encrypted chat history here.
                    </p>
                    <Button
                      onClick={() => handleTabChange('chat')}
                      variant="security"
                    >
                      Start New Chat
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatSessions.map((session) => (
                      <div
                        key={session.id}
                        className="group flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <MessageSquare className="text-white h-7 w-7" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-base font-semibold text-foreground">{session.title}</p>
                              <EncryptionIndicator isEncrypted={true} showLabel={false} size="md" />
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Created {new Date(session.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-security-600" />
                                <span className="text-security-600 font-medium">End-to-End Encrypted</span>
                              </div>
                              {session.agentId && (
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  <span>Custom Agent</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <SecurityBadge variant="encrypted" size="md" animated>
                            Private
                          </SecurityBadge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveChatSession(session.id);
                              handleTabChange('chat');
                            }}
                          >
                            Continue
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                              <DropdownMenuItem onClick={() => {
                                setActiveChatSession(session.id);
                                handleTabChange('chat');
                              }}>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Continue Chat
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteChatSession(session.id)}
                                className="text-danger-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Session
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
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-security-50 to-primary-50 dark:from-slate-800 dark:to-slate-700 border border-security-200 dark:border-slate-600 rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <SecurityIcon type="key" size="lg" />
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Security Settings</h1>
                    <p className="text-base text-muted-foreground">Manage your encryption keys and preferences</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <SecurityStatus status="secure" message="All systems secure" />
                  <SecurityBadge variant="secure" size="lg" animated>Protected</SecurityBadge>
                </div>
              </div>
            </div>

            <KeyManagement />
          </div>
        );

      default:
        return (
          <DashboardOverview
            filesCount={files.length}
            chatSessionsCount={chatSessions.length}
            onNavigate={handleTabChange}
          />
        );
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </DashboardLayout>
  );
}