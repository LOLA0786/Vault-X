import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { EncryptionService } from '@/lib/encryption';
import { Button } from '@/components/ui/button';

import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernGrid } from '@/components/ui/modern-layout';
import { SecurityBadge, SecurityStatus, EncryptionIndicator } from '@/components/ui/security-badge';
import { Sidebar } from '@/components/ui/sidebar';
import { ModernHeader } from '@/components/ui/modern-header';
import { Footer } from '@/components/ui/footer';
import { Container } from '@/components/ui/container';
import { PageTransition } from '@/components/ui/page-transition';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import {
  Bot,
  Plus,
  Trash2,
  Shield,
  Lock,
  Clock,
  Brain,
  ArrowRight,
  Sparkles,
  Fingerprint,
  ShieldCheck,
  MessageSquare,
  Activity,
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  FolderOpen,
  History,
  Settings
} from 'lucide-react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AgentCreationForm } from '@/components/agent-creation-form';
import { AiAgent } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { GridLoading } from '@/components/ui/modern-loading';

type AgentWithDecrypted = AiAgent & {
  decryptedDescription: string;
  decryptedSystemPrompt: string;
};

// Mobile Agents Component
function MobileAgents({
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
    if (tab === 'chat') {
      setLocation('/chat');
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
                            variant={'agents' === item.id ? "default" : "ghost"}
                            className="w-full justify-start text-sm font-medium"
                            onClick={() => {
                              handleTabChange(item.id);
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
                AI Agents
              </h1>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
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
            const isActive = 'agents' === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => handleTabChange(item.id)}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0 ${
                  isActive 
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
                        variant="ghost"
                        className="justify-start h-12"
                        onClick={() => handleTabChange(item.id)}
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

export default function AgentsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
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
    if (tab === 'chat') {
      setLocation('/chat');
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

  const { data: agents = [], isLoading } = useQuery<AiAgent[]>({
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

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const response = await fetch(`/api/ai-agents/${agentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/ai-agents/user', user?.id] });
        toast({
          title: "Agent deleted",
          description: "The AI agent has been permanently removed",
        });
        setAgentToDelete(null);
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete the agent",
        variant: "destructive",
      });
    }
  };

  const handleAgentCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/ai-agents/user', user?.id] });
    setIsCreateDialogOpen(false);
  };

  const renderContent = () => {
    return (
      <div className="w-full p-4 lg:p-6">
        <div className="space-y-6 lg:space-y-8">
          {/* Modern Agents Header */}
          <ModernCard variant="gradient" className="overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-emerald-500/10" />
            <ModernCardContent className="relative p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                      AI Agents
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      Create and manage your private, encrypted AI assistants
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <SecurityStatus status="encrypted" message={`${agents.length} agents encrypted`} />
                  <SecurityBadge variant="secure" size="lg" animated>
                    Privacy Protected
                  </SecurityBadge>
                </div>
              </div>

              {/* Agent Stats */}
              <ModernGrid cols={4} gap="md" responsive>
                <ModernCard variant="glass" hover="scale">
                  <ModernCardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{agents.length}</p>
                    <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                  </ModernCardContent>
                </ModernCard>

                <ModernCard variant="glass" hover="scale">
                  <ModernCardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">100%</p>
                    <p className="text-sm font-medium text-muted-foreground">Encrypted</p>
                  </ModernCardContent>
                </ModernCard>

                <ModernCard variant="glass" hover="scale">
                  <ModernCardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">AI</p>
                    <p className="text-sm font-medium text-muted-foreground">Powered</p>
                  </ModernCardContent>
                </ModernCard>

                <ModernCard variant="glass" hover="scale">
                  <ModernCardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">24/7</p>
                    <p className="text-sm font-medium text-muted-foreground">Available</p>
                  </ModernCardContent>
                </ModernCard>
              </ModernGrid>
            </ModernCardContent>
          </ModernCard>

          {/* Create Agent Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Your AI Agents</h2>
              <p className="text-lg text-muted-foreground">Manage your private, encrypted AI assistants</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="premium" size="lg" className="group shadow-xl">
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Agent
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <AgentCreationForm onCreated={handleAgentCreated} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Agents Grid */}
          {isLoading ? (
            <GridLoading count={6} cols={3} />
          ) : processedAgents.length === 0 ? (
            <ModernCard variant="glass" className="text-center">
              <ModernCardContent className="p-16">
                <div className="w-32 h-32 bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 dark:from-violet-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Bot className="w-16 h-16 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">No AI agents yet</h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                  Create your first AI agent to start having secure, encrypted conversations. All agent data is protected with client-side encryption.
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  variant="premium"
                  size="xl"
                  className="group shadow-2xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Agent
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </ModernCardContent>
            </ModernCard>
          ) : (
            <ModernGrid cols={3} gap="lg" responsive>
              {processedAgents.map((agent) => (
                <ModernCard key={agent.id} variant="elevated" hover="lift" interactive className="group">
                  <ModernCardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                          <Bot className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <ModernCardTitle className="text-xl font-bold text-foreground">{agent.name}</ModernCardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <EncryptionIndicator isEncrypted={true} showLabel={false} size="sm" />
                            <span className="text-sm text-muted-foreground font-medium">Encrypted</span>
                          </div>
                        </div>
                      </div>
                      <SecurityBadge variant="encrypted" size="sm" animated>
                        Private
                      </SecurityBadge>
                    </div>
                  </ModernCardHeader>

                  <ModernCardContent className="space-y-6">
                    <ModernCardDescription className="line-clamp-3 text-base leading-relaxed">
                      {agent.decryptedDescription}
                    </ModernCardDescription>

                    <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Created {new Date(agent.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">AES-256</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <Button
                        variant="premium"
                        size="lg"
                        className="w-full group"
                        onClick={() => setLocation('/chat')}
                      >
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Start Chat
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAgentToDelete(agent.id)}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Agent
                      </Button>
                    </div>
                  </ModernCardContent>
                </ModernCard>
              ))}
            </ModernGrid>
          )}

          {/* Security Notice */}
          <ModernCard variant="premium">
            <ModernCardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-security-500 to-security-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-foreground mb-2">Privacy & Security</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    All AI agents are encrypted with your personal encryption key. Agent descriptions, system prompts, and conversation history are never accessible to our servers.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-3 w-3" />
                      <span>Client-side Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Zero-Knowledge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      <span>AES-256 Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={!!agentToDelete} onOpenChange={() => setAgentToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete AI Agent</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this AI agent? This action cannot be undone and all encrypted data will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => agentToDelete && handleDeleteAgent(agentToDelete)}
                  className="bg-danger-600 hover:bg-danger-700"
                >
                  Delete Permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileAgents renderContent={renderContent} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        <Sidebar
          activeTab="agents"
          onTabChange={handleTabChange}
          className="fixed h-full w-64 bg-sidebar text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground"
        />

        <div className="flex-1 ml-64 flex flex-col min-h-screen bg-background text-foreground">
          {/* Modern Header */}
          <ModernHeader
            title="AI Agents"
            subtitle="Create and manage your private, encrypted AI assistants"
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