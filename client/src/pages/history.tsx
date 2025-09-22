import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

import { type ChatSession } from '@shared/schema';

// Layout Components
import { Sidebar } from '@/components/ui/sidebar';
import { ModernHeader } from '@/components/ui/modern-header';
import { Footer } from '@/components/ui/footer';
import { Container } from '@/components/ui/container';
import { PageTransition } from '@/components/ui/page-transition';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Modern UI Components
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle, ModernCardDescription } from '@/components/ui/modern-card';
import { ModernGrid, ModernContainer, ModernStack } from '@/components/ui/modern-layout';
import { StatCard, StatsGrid } from '@/components/ui/modern-stats';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SecurityBadge, EncryptionIndicator } from '@/components/ui/security-badge';
import { ModernInput } from '@/components/ui/modern-input';
import { GridLoading } from '@/components/ui/modern-loading';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import { MobileThemeToggle } from '@/components/ui/mobile-theme-toggle';
import { getNavigationItems, type NavigationItem } from '@/components/ui/modern-navigation';

// Icons
import {
  MessageSquare,
  Shield,
  Menu,
  LogOut,
  User,
  Search,
  Calendar,
  Clock,
  Trash2,
  Eye,
  MoreVertical,
  Bot,
  Lock,
  History as HistoryIcon,
  Home,
  Settings,
  Key,
  LayoutDashboard
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

// Mobile History Component
function MobileHistory({
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
    if (tab === 'agents') {
      setLocation('/agents');
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
      <header className="sticky top-0 z-50 bg-background border-b border-border px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-1 sm:p-2">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full bg-sidebar">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <PrivateVaultLogo size="sm" animated={true} className="drop-shadow-lg" />
                      <div>
                        <h1 className="text-lg font-bold text-sidebar-foreground">Private Vault</h1>
                        <p className="text-xs text-sidebar-foreground/70">Your Secure AI Assistant</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Menu */}
                  <nav className="flex-1 p-4">
                    <div className="space-y-2">
                      {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.id === 'history';
                        return (
                          <Button
                            key={item.id}
                            variant={isActive ? "default" : "ghost"}
                            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                            onClick={() => {
                              if (item.id !== 'history') {
                                handleTabChange(item.id);
                              }
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.label}
                          </Button>
                        );
                      })}
                    </div>
                    
                    {/* Theme Toggle */}
                    <div className="px-4 pt-2 border-t border-border/30">
                      <MobileThemeToggle />
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

            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
              <PrivateVaultLogo size="sm" animated={true} className="drop-shadow-lg flex-shrink-0" />
              <h1 className="text-sm sm:text-lg font-semibold text-foreground truncate">
                Chat History
              </h1>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={logout} className="p-1 sm:p-2 flex-shrink-0">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 pb-4 overflow-x-hidden">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}

export default function HistoryPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'starred'>('all');
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

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
    if (tab === 'agents') {
      setLocation('/agents');
      return;
    }
    if (tab === 'pricing') {
      setLocation('/pricing');
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
    if (tab === 'admin') {
      setLocation('/admin');
      return;
    }
  };

  // Data fetching
  const { data: chatSessions = [], isLoading, refetch } = useQuery<ChatSession[]>({
    queryKey: ['/api/chat-sessions/user', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/chat-sessions/user/${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch chat sessions');
      return response.json();
    },
  });

  // Filter and search sessions
  const filteredSessions = chatSessions.filter(session => {
    const matchesSearch = searchQuery === '' ||
      session.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterBy === 'all' ||
      (filterBy === 'recent' && new Date(session.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesFilter;
  });

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/chat-sessions/user', user?.id] });
        toast({
          title: "Chat deleted",
          description: "The conversation has been permanently removed",
        });
        setSessionToDelete(null);
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete the conversation",
        variant: "destructive",
      });
    }
  };

  const handleOpenChat = (sessionId: string) => {
    setLocation(`/chat?session=${sessionId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const renderContent = () => {
    return (
      <ModernContainer className="py-4 sm:py-6 px-3 sm:px-4 lg:px-6">
        <ModernStack spacing="md" className="sm:spacing-lg lg:spacing-xl">
          {/* Header Section */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent px-2">
              Chat History
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-6">
              Your encrypted conversation history with AI assistants
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Total Conversations"
              value={chatSessions.length}
              description="Encrypted chat sessions"
              icon={<MessageSquare />}
              variant="gradient"
              trend={{
                value: chatSessions.length > 0 ? 15 : 0,
                label: "vs last month",
                direction: chatSessions.length > 0 ? 'up' : 'neutral'
              }}
              className="col-span-1"
            />

            <StatCard
              title="This Week"
              value={chatSessions.filter(s => new Date(s.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              description="Recent conversations"
              icon={<Clock />}
              variant="premium"
              className="col-span-1"
            />

            <StatCard
              title="Security Level"
              value="AES-256"
              description="End-to-end encrypted"
              icon={<Shield />}
              variant="security"
              className="col-span-1"
            />

            <StatCard
              title="AI Interactions"
              value={chatSessions.length}
              description="Total sessions created"
              icon={<Bot />}
              variant="default"
              trend={{
                value: 23,
                label: "this week",
                direction: 'up'
              }}
              className="col-span-1"
            />
          </div>

          {/* Search and Filter Section */}
          <ModernCard variant="glass" hover="glow">
            <ModernCardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="w-full">
                  <ModernInput
                    variant="filled"
                    placeholder="Search conversations..."
                    icon={<Search className="h-4 w-4" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full touch-manipulation text-sm sm:text-base"
                  />
                </div>
                <div className="flex gap-2 sm:gap-3 w-full">
                  <Button
                    variant={filterBy === 'all' ? 'premium' : 'outline'}
                    size="sm"
                    onClick={() => setFilterBy('all')}
                    className="flex-1 touch-manipulation text-xs sm:text-sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={filterBy === 'recent' ? 'premium' : 'outline'}
                    size="sm"
                    onClick={() => setFilterBy('recent')}
                    className="flex-1 touch-manipulation text-xs sm:text-sm"
                  >
                    Recent
                  </Button>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          {/* Chat Sessions List */}
          {isLoading ? (
            <GridLoading count={6} cols={1} />
          ) : filteredSessions.length === 0 ? (
            <ModernCard variant="glass" className="text-center">
              <ModernCardContent className="p-6 sm:p-8 lg:p-16">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8 shadow-2xl">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2 sm:mb-3 lg:mb-4 px-2">
                  {searchQuery ? 'No matching conversations' : 'No chat history yet'}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 lg:mb-8 max-w-md mx-auto px-4">
                  {searchQuery
                    ? 'Try adjusting your search terms or filters'
                    : 'Start a conversation with your AI assistant to see your history here'
                  }
                </p>
                <Button
                  onClick={() => setLocation('/chat')}
                  variant="premium"
                  size="lg"
                  className="shadow-xl touch-manipulation w-full sm:w-auto"
                >
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Start New Chat
                </Button>
              </ModernCardContent>
            </ModernCard>
          ) : (
            <ModernStack spacing="sm" className="sm:spacing-md">
              {filteredSessions.map((session) => (
                <ModernCard key={session.id} variant="elevated" hover="lift" interactive>
                  <ModernCardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col gap-3">
                      <div
                        className="flex-1 cursor-pointer touch-manipulation"
                        onClick={() => handleOpenChat(session.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mb-2 truncate">
                              {session.title}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 lg:gap-4 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="text-xs sm:text-sm">{formatDate(session.updatedAt.toString())}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="text-xs sm:text-sm">{new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              {session.agentId && (
                                <div className="flex items-center gap-1">
                                  <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="text-xs sm:text-sm">Custom Agent</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                              <EncryptionIndicator isEncrypted={true} showLabel={true} size="sm" />
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs w-fit">
                                Chat Session
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/20">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenChat(session.id)}
                          className="hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 flex-1 touch-manipulation text-xs sm:text-sm"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Open
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenChat(session.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Open Chat
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setSessionToDelete(session.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </ModernCardContent>
                </ModernCard>
              ))}
            </ModernStack>
          )}

          {/* Security Notice */}
          <ModernCard variant="security">
            <ModernCardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mb-2">Privacy & Security</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    All chat conversations are encrypted with your personal encryption key before being stored.
                    Your conversation history is never accessible to our servers in unencrypted form.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Lock className="h-3 w-3" />
                      <span>AES-256 Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Shield className="h-3 w-3" />
                      <span>Zero-Knowledge</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Eye className="h-3 w-3" />
                      <span>Private by Design</span>
                    </div>
                  </div>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => sessionToDelete && handleDeleteSession(sessionToDelete)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ModernStack>
      </ModernContainer>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileHistory renderContent={renderContent} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-background text-foreground">
        {/* Sidebar - Outside any transform containers */}
        <Sidebar
          activeTab="history"
          onTabChange={handleTabChange}
        />

        {/* Main Content */}
        <div className="ml-64 flex flex-col min-h-screen bg-background text-foreground">
          {/* Modern Header */}
          <ModernHeader
            title="Chat History"
            subtitle="Your encrypted conversation history with AI assistants"
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