import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { EncryptionService } from '@/lib/encryption';
import { Button } from '@/components/ui/button';

import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { SecurityBadge, SecurityStatus, EncryptionIndicator } from '@/components/ui/security-badge';
import { Sidebar } from '@/components/ui/sidebar';
import { ModernHeader } from '@/components/ui/modern-header';
import { Footer } from '@/components/ui/footer';
import { Container } from '@/components/ui/container';
import { PageTransition } from '@/components/ui/page-transition';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import { MobileThemeToggle } from '@/components/ui/mobile-theme-toggle';
import { getNavigationItems } from '@/components/ui/modern-navigation';
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
  LogOut,
  LayoutDashboard,
  FolderOpen
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
  const navigationItems = getNavigationItems(user);

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
    if (tab === 'pricing') {
      setLocation('/pricing');
      return;
    }
    if (tab === 'key-info') {
      setLocation('/key-info');
      return;
    }
    if (tab === 'admin') {
      setLocation('/admin');
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
                      {navigationItems.map((item) => {
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

                    {/* Theme Toggle */}
                    <div className="px-3 pt-2 border-t border-border/30">
                      <MobileThemeToggle />
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

            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <PrivateVaultLogo
                size="sm"
                animated={true}
                className="drop-shadow-md flex-shrink-0"
              />
              <h1 className="text-lg font-semibold text-foreground truncate">
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border">
        <div className="flex items-center justify-around px-1 py-2">
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
                className={`flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-0 flex-1 max-w-[80px] ${isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-xs font-medium truncate leading-tight">{item.label}</span>
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
                className="flex flex-col items-center gap-1 h-auto py-2 px-2 text-muted-foreground hover:text-foreground min-w-0 flex-1 max-w-[80px]"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-xs font-medium truncate leading-tight">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-4">More Options</h3>
                <div className="grid grid-cols-2 gap-2">
                  {navigationItems.filter(item =>
                    !['dashboard', 'vault', 'chat', 'agents'].includes(item.id)
                  ).map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="justify-start h-12 text-sm"
                        onClick={() => handleTabChange(item.id)}
                      >
                        <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
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
    if (tab === 'pricing') {
      setLocation('/pricing');
      return;
    }
    if (tab === 'key-info') {
      setLocation('/key-info');
      return;
    }
    if (tab === 'admin') {
      setLocation('/admin');
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
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
                <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0">
                    <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                      AI Agents
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-1 sm:mt-2 leading-relaxed">
                      Create and manage your private, encrypted AI assistants
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <SecurityStatus status="encrypted" message={`${agents.length} agents encrypted`} />
                  <SecurityBadge variant="secure" size="lg" animated>
                    Privacy Protected
                  </SecurityBadge>
                </div>
              </div>

              {/* Agent Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <ModernCard variant="glass" hover="scale">
                  <ModernCardContent className="p-3 sm:p-4 lg:p-6 text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                      <Bot className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{agents.length}</p>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Agents</p>
                  </ModernCardContent>
                </ModernCard>

                <ModernCard variant="glass" hover="scale">
                  <ModernCardContent className="p-3 sm:p-4 lg:p-6 text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">100%</p>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Encrypted</p>
                  </ModernCardContent>
                </ModernCard>

                <ModernCard variant="glass" hover="scale">
                  <ModernCardContent className="p-3 sm:p-4 lg:p-6 text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                      <Brain className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">AI</p>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Powered</p>
                  </ModernCardContent>
                </ModernCard>

                <ModernCard variant="glass" hover="scale">
                  <ModernCardContent className="p-3 sm:p-4 lg:p-6 text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                      <Activity className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">24/7</p>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Available</p>
                  </ModernCardContent>
                </ModernCard>
              </div>
            </ModernCardContent>
          </ModernCard>

          {/* Create Agent Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Your AI Agents</h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Manage your private, encrypted AI assistants</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="premium" size="lg" className="group shadow-xl w-full sm:w-auto">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="hidden sm:inline">Create New Agent</span>
                  <span className="sm:hidden">Create Agent</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
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
              <ModernCardContent className="p-8 sm:p-12 lg:p-16">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 dark:from-violet-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl">
                  <Bot className="w-12 h-12 sm:w-16 sm:h-16 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">No AI agents yet</h3>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed px-4 sm:px-0">
                  Create your first AI agent to start having secure, encrypted conversations. All agent data is protected with client-side encryption.
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  variant="premium"
                  size="xl"
                  className="group shadow-2xl w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="hidden sm:inline">Create Your First Agent</span>
                  <span className="sm:hidden">Create First Agent</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </ModernCardContent>
            </ModernCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {processedAgents.map((agent) => (
                <ModernCard key={agent.id} variant="elevated" hover="lift" interactive className="group">
                  <ModernCardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                          <Bot className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <ModernCardTitle className="text-lg sm:text-xl font-bold text-foreground truncate">{agent.name}</ModernCardTitle>
                          <div className="flex items-center gap-2 mt-1 sm:mt-2">
                            <EncryptionIndicator isEncrypted={true} showLabel={false} size="sm" />
                            <span className="text-xs sm:text-sm text-muted-foreground font-medium">Encrypted</span>
                          </div>
                        </div>
                      </div>
                      <SecurityBadge variant="encrypted" size="sm" animated className="self-start sm:self-center">
                        Private
                      </SecurityBadge>
                    </div>
                  </ModernCardHeader>

                  <ModernCardContent className="space-y-4 sm:space-y-6">
                    <ModernCardDescription className="line-clamp-3 text-sm sm:text-base leading-relaxed break-words">
                      {agent.decryptedDescription}
                    </ModernCardDescription>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-muted-foreground bg-muted/30 rounded-xl p-2 sm:p-3 gap-2 sm:gap-0">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">Created {new Date(agent.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-emerald-600 font-semibold">AES-256</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:gap-3 pt-2">
                      <Button
                        variant="premium"
                        size="lg"
                        className="w-full group"
                        onClick={() => setLocation('/chat')}
                      >
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Start Chat
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAgentToDelete(agent.id)}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Delete Agent
                      </Button>
                    </div>
                  </ModernCardContent>
                </ModernCard>
              ))}
            </div>
          )}

          {/* Security Notice */}
          <ModernCard variant="premium">
            <ModernCardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-security-500 to-security-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2">Privacy & Security</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                    All AI agents are encrypted with your personal encryption key. Agent descriptions, system prompts, and conversation history are never accessible to our servers.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-3 w-3 flex-shrink-0" />
                      <span>Client-side Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3 flex-shrink-0" />
                      <span>Zero-Knowledge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3 flex-shrink-0" />
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
      <div className="hidden lg:block min-h-screen bg-background text-foreground">
        {/* Sidebar - Outside any transform containers */}
        <Sidebar
          activeTab="agents"
          onTabChange={handleTabChange}
        />

        {/* Main Content */}
        <div className="ml-64 flex flex-col min-h-screen bg-background text-foreground">
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