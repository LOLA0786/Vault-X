import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

// Modern UI Components
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernGrid, ModernContainer, ModernStack } from '@/components/ui/modern-layout';
import { StatCard, StatsGrid } from '@/components/ui/modern-stats';
import { ModernHeader } from '@/components/ui/modern-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sidebar } from '@/components/ui/sidebar';
import { Footer } from '@/components/ui/footer';
import { Container } from '@/components/ui/container';
import { PageTransition } from '@/components/ui/page-transition';
import { SecurityBadge, EncryptionIndicator } from '@/components/ui/security-badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import { MobileThemeToggle } from '@/components/ui/mobile-theme-toggle';
import { getNavigationItems, type NavigationItem } from '@/components/ui/modern-navigation';

import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Activity, Database, ArrowLeft, Menu, Lock, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { User } from '@shared/schema';

// Mobile Admin Dashboard Component
function MobileAdminDashboard({
  users,
  loading,
  formatDate,
  onNavigate
}: {
  users: User[];
  loading: boolean;
  formatDate: (date: string | Date) => string;
  onNavigate: (tab: string) => void;
}) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigationItems = getNavigationItems(user);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
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
                        <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
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
                            variant={item.id === 'admin' ? "default" : "ghost"}
                            className="w-full justify-start text-sm font-medium"
                            onClick={() => {
                              if (item.id !== 'admin') {
                                onNavigate(item.id);
                              }
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
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">System Administration</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">Secure</span>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="flex-1 p-4">
        <ModernContainer className="space-y-6">
          {/* Mobile Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ModernCard>
              <ModernCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <ModernCardTitle className="text-sm font-medium">Total Users</ModernCardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </ModernCardHeader>
              <ModernCardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard>
              <ModernCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <ModernCardTitle className="text-sm font-medium">Active Today</ModernCardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </ModernCardHeader>
              <ModernCardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => {
                    const today = new Date();
                    const userDate = new Date(u.createdAt);
                    return userDate.toDateString() === today.toDateString();
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Users registered today
                </p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard className="sm:col-span-2 lg:col-span-1">
              <ModernCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <ModernCardTitle className="text-sm font-medium">System Status</ModernCardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </ModernCardHeader>
              <ModernCardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </ModernCardContent>
            </ModernCard>
          </div>

          {/* Mobile Users Table */}
          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle>Users</ModernCardTitle>
              <ModernCardDescription>
                Registered users in the system
              </ModernCardDescription>
            </ModernCardHeader>
            <ModernCardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found in the system
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mobile-friendly user cards */}
                  <div className="block sm:hidden space-y-3">
                    {users.map((user) => (
                      <div key={user.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">{user.email}</span>
                          {(user.email === "Lolasolution27@gmail.com" || user.email === "lolasolution27@gmail.com") && (
                            <Badge variant="secondary" className="text-xs">Admin</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>ID: {user.id.slice(0, 8)}...</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Active
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden sm:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>User ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registered</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <span className="truncate">{user.email}</span>
                                {(user.email === "Lolasolution27@gmail.com" || user.email === "lolasolution27@gmail.com") && (
                                  <Badge variant="secondary" className="flex-shrink-0">Admin</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{user.id.slice(0, 8)}...</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Active
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(user.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </ModernCardContent>
          </ModernCard>
        </ModernContainer>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users?adminEmail=${user?.email}`);
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to fetch users",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleNavigation = (tab: string) => {
    if (tab === 'dashboard') {
      setLocation('/');
    } else if (tab === 'pricing') {
      setLocation('/pricing');
    } else if (tab === 'settings') {
      setLocation('/settings');
    } else if (tab === 'chat') {
      setLocation('/chat');
    } else if (tab === 'agents') {
      setLocation('/agents');
    } else if (tab === 'history') {
      setLocation('/history');
    } else if (tab === 'key-info') {
      setLocation('/key-info');
    } else if (tab === 'vault') {
      setLocation('/vault');
    }
  };

  // Check admin permission
  if (user?.email !== 'Lolasolution27@gmail.com' && 
      user?.email !== "lolasolution27@gmail.com" && 
      user?.email !== "test11@gmail.com") {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <ModernCard className="w-full max-w-md mx-4">
            <ModernCardHeader>
              <ModernCardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Access Denied
              </ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent>
              <p className="text-muted-foreground mb-4">
                You don't have permission to access the admin dashboard.
              </p>
              <Button onClick={() => setLocation('/')} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </ModernCardContent>
          </ModernCard>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <MobileAdminDashboard
            users={users}
            loading={loading}
            formatDate={formatDate}
            onNavigate={handleNavigation}
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex min-h-screen">
          <Sidebar activeTab="admin" onTabChange={handleNavigation} />
          
          <div className="flex-1 flex flex-col">
            {/* Desktop Content */}
            <div className="flex-1 p-8">
              <ModernContainer className="max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Shield className="h-8 w-8 text-primary" />
                        Admin Dashboard
                      </h1>
                      <p className="text-muted-foreground mt-2">
                        Manage users and monitor system activity
                      </p>
                    </div>
                    <Button onClick={() => setLocation('/')} variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </div>
                </div>

                {/* Desktop Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <ModernCard>
                    <ModernCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <ModernCardTitle className="text-sm font-medium">Total Users</ModernCardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </ModernCardHeader>
                    <ModernCardContent>
                      <div className="text-2xl font-bold">{users.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Registered users in the system
                      </p>
                    </ModernCardContent>
                  </ModernCard>

                  <ModernCard>
                    <ModernCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <ModernCardTitle className="text-sm font-medium">Active Today</ModernCardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </ModernCardHeader>
                    <ModernCardContent>
                      <div className="text-2xl font-bold">
                        {users.filter(u => {
                          const today = new Date();
                          const userDate = new Date(u.createdAt);
                          return userDate.toDateString() === today.toDateString();
                        }).length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Users registered today
                      </p>
                    </ModernCardContent>
                  </ModernCard>

                  <ModernCard>
                    <ModernCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <ModernCardTitle className="text-sm font-medium">System Status</ModernCardTitle>
                      <Database className="h-4 w-4 text-muted-foreground" />
                    </ModernCardHeader>
                    <ModernCardContent>
                      <div className="text-2xl font-bold text-green-600">Online</div>
                      <p className="text-xs text-muted-foreground">
                        All systems operational
                      </p>
                    </ModernCardContent>
                  </ModernCard>
                </div>

                {/* Desktop Users Table */}
                <ModernCard>
                  <ModernCardHeader>
                    <ModernCardTitle>Registered Users</ModernCardTitle>
                    <ModernCardDescription>
                      All users registered in the PrivateVaultAI system
                    </ModernCardDescription>
                  </ModernCardHeader>
                  <ModernCardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading users...</span>
                      </div>
                    ) : users.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No users found in the system
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Email</TableHead>
                              <TableHead>User ID</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Registered</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <span className="truncate">{user.email}</span>
                                    {(user.email === "Lolasolution27@gmail.com" || user.email === "lolasolution27@gmail.com") && (
                                      <Badge variant="secondary">Admin</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm">{user.id.slice(0, 8)}...</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    Active
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(user.createdAt)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </ModernCardContent>
                </ModernCard>
              </ModernContainer>
            </div>
            
            <Footer />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
