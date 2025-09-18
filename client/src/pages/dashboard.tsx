import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernContainer, ModernGrid, ModernStack } from '@/components/ui/modern-layout';
import { StatCard, StatsGrid } from '@/components/ui/modern-stats';
import { ModernFileUpload } from '@/components/ui/modern-file-upload';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/ui/sidebar';


import { KeyManagement } from '@/components/key-management';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import {
  FileText,
  MessageSquare,
  Shield,
  User,
  LogOut,
  MoreVertical,
  Trash2,
  Download,
  Bot,
  Menu,
  LayoutDashboard,
  FolderOpen,
  History,
  Settings,
  Lock
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { type EncryptedFile, type ChatSession, type AiAgent } from '@shared/schema';
import { EncryptionService } from '@/lib/encryption';
import KeyInfo from './key-info';
import { Footer } from '@/components/ui/footer';
import { Container } from '@/components/ui/container';
import { PageTransition } from '@/components/ui/page-transition';
import AdminDashboard from './admin-dashboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ModernHeader } from '@/components/ui/modern-header';

// Mobile Dashboard Component
function MobileDashboard({
  activeTab,
  onTabChange,
  renderContent
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  renderContent: () => React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getCurrentPageTitle = () => {
    return activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
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
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex flex-col h-full bg-sidebar">
                  {/* Mobile Sidebar Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <PrivateVaultLogo
                        size="sm"
                        animated={true}
                        className="drop-shadow-lg"
                      />
                      <div>
                        <h1 className="text-lg font-bold text-sidebar-foreground">Private Vault</h1>
                        <p className="text-xs text-sidebar-foreground/70">Your Secure AI Assistant</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 overflow-y-auto py-4">
                    <div className="px-3 space-y-1">
                      {[
                        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'vault', label: 'File Vault', icon: FolderOpen },
                        { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
                        { id: 'agents', label: 'AI Agents', icon: Bot },
                        { id: 'history', label: 'Chat History', icon: History },
                        { id: 'settings', label: 'Settings', icon: Settings },
                        { id: 'key-info', label: 'How it works', icon: Lock },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={activeTab === item.id ? "default" : "ghost"}
                            className="w-full justify-start text-sm font-medium"
                            onClick={() => {
                              onTabChange(item.id);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <Icon className="mr-3 h-4 w-4" />
                            {item.label}
                          </Button>
                        );
                      })}
                    </div>
                  </nav>

                  {/* Mobile Sidebar Footer */}
                  <div className="mt-auto p-4 border-t border-border">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sidebar-foreground/80">Encryption Active</span>
                      </div>
                      <div className="text-xs text-sidebar-foreground/60 flex items-center">
                        <Lock className="w-3 h-3 mr-1" />
                        AES-256 Client-side
                      </div>
                      {user && (
                        <div className="pt-2 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-sidebar-foreground truncate max-w-[150px]">
                              {user.email}
                            </span>
                            <Button variant="ghost" size="sm" onClick={logout}>
                              <LogOut className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center space-x-3">
              <PrivateVaultLogo
                size="sm"
                animated={true}
                className="drop-shadow-md"
              />
              <h1 className="text-lg font-semibold text-foreground">
                {getCurrentPageTitle()}
              </h1>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 pb-20 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'vault', label: 'Vault', icon: FolderOpen },
            { id: 'chat', label: 'Chat', icon: MessageSquare },
            { id: 'agents', label: 'Agents', icon: Bot },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0 ${isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium truncate">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                )}
              </Button>
            );
          })}

          {/* More menu for additional items */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs font-medium">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-4">More Options</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'history', label: 'Chat History', icon: History },
                    { id: 'settings', label: 'Settings', icon: Settings },
                    { id: 'key-info', label: 'How it works', icon: Lock },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className="justify-start h-12"
                        onClick={() => onTabChange(item.id)}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Footer - Hidden on mobile to save space */}
      <div className="hidden">
        <Footer />
      </div>
    </div>
  );
}

export default function Dashboard({ initialTab }: { initialTab?: string }) {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');

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
  };  // React Query hooks
  const { data: chatSessions = [], refetch: refetchChatSessions } = useQuery<ChatSession[]>({
    queryKey: ['/api/chat-sessions/user', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/chat-sessions/user/${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch chat sessions');
      return response.json();
    },
  });

  useEffect(() => {
    if (activeTab === 'history' && user?.id) {
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

  const handleFileUploaded = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/files/user', user?.id] });
  };



  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, { method: 'DELETE' });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/files/user', user?.id] });
        toast({ title: "File deleted", description: "The file has been permanently removed from your vault" });
      }
    } catch (error) {
      toast({ title: "Delete failed", description: "Failed to delete the file", variant: "destructive" });
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

      toast({ title: "File downloaded", description: "File has been decrypted and downloaded" });
    } catch (error) {
      toast({ title: "Download failed", description: "Failed to decrypt and download the file", variant: "destructive" });
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
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Important: Backup your encryption key</div>
                  <div className="text-sm">Before logging out, export your encryption key so you can import it when you log back in.</div>
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button onClick={handleBannerExportKey} size="sm" variant="outline">Export Key</Button>
                      <Button onClick={() => setShowImportKeyBanner(s => !s)} size="sm">
                        {showImportKeyBanner ? 'Cancel' : 'Import Key'}
                      </Button>
                    </div>
                    {showImportKeyBanner && (
                      <div className="flex items-center gap-2">
                        <input
                          className="flex-1 px-2 py-1 rounded border border-input bg-background text-foreground"
                          placeholder="Paste exported key here"
                          value={bannerImportKey}
                          onChange={(e) => setBannerImportKey(e.target.value)}
                        />
                        <Button size="sm" onClick={handleBannerImportKey}>Import</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <ModernFileUpload onFileUploaded={handleFileUploaded} />

            <ModernCard variant="elevated" hover="lift">
              <ModernCardHeader>
                <ModernCardTitle>Your Files</ModernCardTitle>
                <ModernCardDescription>Encrypted files stored in your vault</ModernCardDescription>
              </ModernCardHeader>
              <ModernCardContent>
                {files.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <p>No files uploaded yet</p>
                    <p className="text-sm">Upload your first file to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
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
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteFile(file.id)} className="text-red-600">
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
              </ModernCardContent>
            </ModernCard>
          </div>
        );
      case 'chat':
        // Redirect to the new modern chat page
        setLocation('/chat');
        return null;

      case 'history':
        return (
          <ModernCard variant="elevated">
            <ModernCardHeader>
              <ModernCardTitle>Chat History</ModernCardTitle>
              <ModernCardDescription>Your encrypted conversation history</ModernCardDescription>
            </ModernCardHeader>
            <ModernCardContent>
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
                        setLocation(`/chat?session=${session.id}`);
                      }}
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
            </ModernCardContent>
          </ModernCard>
        );

      case 'settings':
        return <KeyManagement />;

      case 'key-info':
        return <KeyInfo />;

      case 'admin':
        return <AdminDashboard />;

      default:
        return (
          <ModernContainer className="py-8">
            <ModernStack spacing="xl">
              {/* Welcome Section */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                  Welcome to Your Private Vault
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Your secure, encrypted AI assistant with client-side privacy protection
                </p>
              </div>

              {/* Quick Stats */}
              <StatsGrid cols={3}>
                <StatCard
                  title="Encrypted Files"
                  value={files.length}
                  description="Files secured with AES-256"
                  icon={<FileText />}
                  variant="gradient"
                  trend={{
                    value: files.length > 0 ? 12 : 0,
                    label: "vs last month",
                    direction: files.length > 0 ? 'up' : 'neutral'
                  }}
                />

                <StatCard
                  title="Security Level"
                  value="Maximum"
                  description="Client-side encryption active"
                  icon={<Shield />}
                  variant="security"
                />

                <StatCard
                  title="AI Agents"
                  value={agents.length}
                  description="Private assistants ready"
                  icon={<Bot />}
                  variant="premium"
                  trend={{
                    value: agents.length > 0 ? 5 : 0,
                    label: "new this week",
                    direction: agents.length > 0 ? 'up' : 'neutral'
                  }}
                />
              </StatsGrid>
              {/* Main Content Grid */}
              <ModernGrid cols={2} gap="xl" responsive>
                <div className="space-y-6">
                  <ModernFileUpload onFileUploaded={handleFileUploaded} />

                  {/* Quick Actions */}
                  <ModernCard variant="glass" hover="glow">
                    <ModernCardHeader>
                      <ModernCardTitle className="text-xl">Quick Actions</ModernCardTitle>
                      <ModernCardDescription>
                        Get started with your secure AI assistant
                      </ModernCardDescription>
                    </ModernCardHeader>
                    <ModernCardContent>
                      <ModernGrid cols={2} gap="md">
                        <Button
                          variant="premium"
                          size="lg"
                          onClick={() => setLocation('/chat')}
                          className="h-16 flex-col gap-2"
                        >
                          <MessageSquare className="h-5 w-5" />
                          Start Chat
                        </Button>
                        <Button
                          variant="security"
                          size="lg"
                          onClick={() => setActiveTab('agents')}
                          className="h-16 flex-col gap-2"
                        >
                          <Bot className="h-5 w-5" />
                          Create Agent
                        </Button>
                      </ModernGrid>
                    </ModernCardContent>
                  </ModernCard>
                </div>
                <ModernCard variant="elevated" hover="lift">
                  <ModernCardHeader>
                    <ModernCardTitle className="text-xl">Recent Files</ModernCardTitle>
                    <ModernCardDescription>Your encrypted file vault</ModernCardDescription>
                  </ModernCardHeader>
                  <ModernCardContent>
                    {files.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-lg font-medium">No files uploaded yet</p>
                        <p className="text-sm">Upload your first file to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {files.slice(0, 3).map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-border hover:bg-muted/30 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 rounded-xl flex items-center justify-center">
                                <FileText className="text-red-600 h-6 w-6" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{file.fileName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              <Shield className="w-3 h-3 mr-1" />
                              Encrypted
                            </Badge>
                          </div>
                        ))}
                        {files.length > 3 && (
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setActiveTab('vault')}
                            className="w-full mt-4"
                          >
                            View All {files.length} Files
                          </Button>
                        )}
                      </div>
                    )}
                  </ModernCardContent>
                </ModernCard>
              </ModernGrid>
            </ModernStack>
          </ModernContainer>
        );
    }
  };
  const handleTabChange = (tab: string) => {
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

  useEffect(() => {
    const path = location.replace(/^\//, '');
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
        break;
    }
  }, [location]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileDashboard
          activeTab={activeTab}
          onTabChange={handleTabChange}
          renderContent={renderContent}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          className="fixed h-full w-64 bg-sidebar text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground"
        />

        <div className="flex-1 ml-64 flex flex-col min-h-screen bg-background text-foreground">
          {/* Modern Header */}
          <ModernHeader
            title={activeTab === 'dashboard' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            subtitle="Manage your private AI assistant and encrypted files"
            user={user ? { email: user.email } : undefined}
            onLogout={logout}
            showSearch={false}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-background text-foreground">
            <Container size="xl" padding="lg" className="py-6">
              <PageTransition>
                {renderContent()}
              </PageTransition>
            </Container>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}