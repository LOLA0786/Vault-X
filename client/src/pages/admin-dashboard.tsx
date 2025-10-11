import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

// Modern UI Components
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernContainer } from '@/components/ui/modern-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sidebar } from '@/components/ui/sidebar';
import { Footer } from '@/components/ui/footer';
import { PageTransition } from '@/components/ui/page-transition';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import { MobileThemeToggle } from '@/components/ui/mobile-theme-toggle';
import { getNavigationItems } from '@/components/ui/modern-navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Database, ArrowLeft, Menu, Lock, LogOut, DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { User, Payment, UserSubscription } from '@shared/schema';

// Mobile Admin Dashboard Component
function MobileAdminDashboard({
  users,
  payments,
  subscriptions,
  loading,
  formatDate,
  onNavigate
}: {
  users: User[];
  payments: Payment[];
  subscriptions: UserSubscription[];
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <ModernCardTitle className="text-sm font-medium">Total Revenue</ModernCardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </ModernCardHeader>
              <ModernCardContent>
                <div className="text-2xl font-bold">
                  ₹{payments
                    .filter(p => p.status === 'completed')
                    .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time revenue
                </p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard>
              <ModernCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <ModernCardTitle className="text-sm font-medium">Active Plans</ModernCardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </ModernCardHeader>
              <ModernCardContent>
                <div className="text-2xl font-bold">
                  {subscriptions.filter(s => s.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Paid subscriptions
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
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant={user.currentPlan === 'free' ? 'outline' : 'default'}>
                            {user.currentPlan || 'free'}
                          </Badge>
                          <Badge
                            variant={user.planStatus === 'active' ? 'default' : 'secondary'}
                            className={user.planStatus === 'active' ? 'bg-green-600 text-xs' : 'text-xs'}
                          >
                            {user.planStatus || 'active'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Registered: {formatDate(user.createdAt)}
                        </div>
                        {user.subscriptionEndDate && (
                          <div className="text-xs text-muted-foreground">
                            Expires: {formatDate(user.subscriptionEndDate)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden sm:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Billing</TableHead>
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
                            <TableCell>
                              <Badge variant={user.currentPlan === 'free' ? 'outline' : 'default'}>
                                {user.currentPlan || 'free'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={user.planStatus === 'active' ? 'default' : 'secondary'}
                                className={user.planStatus === 'active' ? 'bg-green-600' : ''}
                              >
                                {user.planStatus || 'active'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {user.billingPeriod || 'N/A'}
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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch users
      const usersResponse = await fetch(`/api/admin/users?adminEmail=${user?.email}`);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }

      // Fetch all payments
      const paymentsResponse = await fetch(`/api/admin/payments?adminEmail=${user?.email}`);
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData);
      }

      // Fetch all subscriptions
      const subscriptionsResponse = await fetch(`/api/admin/subscriptions?adminEmail=${user?.email}`);
      if (subscriptionsResponse.ok) {
        const subscriptionsData = await subscriptionsResponse.json();
        setSubscriptions(subscriptionsData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
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
    user?.email !== "lolasolution27@gmail.com") {
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
            payments={payments}
            subscriptions={subscriptions}
            loading={loading}
            formatDate={formatDate}
            onNavigate={handleNavigation}
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block min-h-screen bg-background text-foreground">
          {/* Sidebar - Outside any transform containers */}
          <Sidebar activeTab="admin" onTabChange={handleNavigation} />

          {/* Main Content */}
          <div className="ml-64 flex flex-col">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                      <ModernCardTitle className="text-sm font-medium">Total Revenue</ModernCardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </ModernCardHeader>
                    <ModernCardContent>
                      <div className="text-2xl font-bold">
                        ₹{payments
                          .filter(p => p.status === 'completed')
                          .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                          .toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        From {payments.filter(p => p.status === 'completed').length} payments
                      </p>
                    </ModernCardContent>
                  </ModernCard>

                  <ModernCard>
                    <ModernCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <ModernCardTitle className="text-sm font-medium">Active Subscriptions</ModernCardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </ModernCardHeader>
                    <ModernCardContent>
                      <div className="text-2xl font-bold">
                        {subscriptions.filter(s => s.status === 'active').length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Active paid plans
                      </p>
                    </ModernCardContent>
                  </ModernCard>

                  <ModernCard>
                    <ModernCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <ModernCardTitle className="text-sm font-medium">Monthly Revenue</ModernCardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </ModernCardHeader>
                    <ModernCardContent>
                      <div className="text-2xl font-bold">
                        ₹{payments
                          .filter(p => {
                            const paymentDate = new Date(p.createdAt);
                            const now = new Date();
                            return p.status === 'completed' &&
                              paymentDate.getMonth() === now.getMonth() &&
                              paymentDate.getFullYear() === now.getFullYear();
                          })
                          .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                          .toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This month
                      </p>
                    </ModernCardContent>
                  </ModernCard>
                </div>

                {/* Tabbed Content */}
                <Tabs defaultValue="users" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                  </TabsList>

                  {/* Users Tab */}
                  <TabsContent value="users">
                    <ModernCard>
                      <ModernCardHeader>
                        <ModernCardTitle>Registered Users</ModernCardTitle>
                        <ModernCardDescription>
                          All users registered in the system with their plan details
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
                                  <TableHead>Current Plan</TableHead>
                                  <TableHead>Plan Status</TableHead>
                                  <TableHead>Billing Period</TableHead>
                                  <TableHead>Subscription End</TableHead>
                                  <TableHead>Registered</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {users.map((user) => (
                                  <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                      <div className="flex items-center gap-2">
                                        <span className="truncate max-w-[200px]">{user.email}</span>
                                        {(user.email === "Lolasolution27@gmail.com" || user.email === "lolasolution27@gmail.com") && (
                                          <Badge variant="secondary">Admin</Badge>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={user.currentPlan === 'free' ? 'outline' : 'default'}>
                                        {user.currentPlan || 'free'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={user.planStatus === 'active' ? 'default' : 'secondary'}
                                        className={user.planStatus === 'active' ? 'bg-green-600' : ''}
                                      >
                                        {user.planStatus || 'active'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {user.billingPeriod || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      {user.subscriptionEndDate ? formatDate(user.subscriptionEndDate) : 'N/A'}
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
                  </TabsContent>

                  {/* Payments Tab */}
                  <TabsContent value="payments">
                    <ModernCard>
                      <ModernCardHeader>
                        <ModernCardTitle>Payment History</ModernCardTitle>
                        <ModernCardDescription>
                          All payment transactions in the system
                        </ModernCardDescription>
                      </ModernCardHeader>
                      <ModernCardContent>
                        {loading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-2">Loading payments...</span>
                          </div>
                        ) : payments.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No payments found
                          </div>
                        ) : (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>User Email</TableHead>
                                  <TableHead>Plan</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Payment ID</TableHead>
                                  <TableHead>Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {payments.map((payment) => {
                                  const user = users.find(u => u.id === payment.userId);
                                  return (
                                    <TableRow key={payment.id}>
                                      <TableCell className="font-medium">
                                        <span className="truncate max-w-[200px]">
                                          {user?.email || payment.userId.slice(0, 8) + '...'}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant="outline">
                                          {payment.planName || payment.planId || 'N/A'}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="font-semibold">
                                        {payment.currency} {parseFloat(payment.amount).toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          variant={payment.status === 'completed' ? 'default' : 'secondary'}
                                          className={payment.status === 'completed' ? 'bg-green-600' : ''}
                                        >
                                          {payment.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="font-mono text-xs">
                                        {payment.razorpayPaymentId?.slice(0, 12) || 'Pending'}...
                                      </TableCell>
                                      <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(payment.createdAt)}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </ModernCardContent>
                    </ModernCard>
                  </TabsContent>

                  {/* Subscriptions Tab */}
                  <TabsContent value="subscriptions">
                    <ModernCard>
                      <ModernCardHeader>
                        <ModernCardTitle>Active Subscriptions</ModernCardTitle>
                        <ModernCardDescription>
                          All subscription records in the system
                        </ModernCardDescription>
                      </ModernCardHeader>
                      <ModernCardContent>
                        {loading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-2">Loading subscriptions...</span>
                          </div>
                        ) : subscriptions.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No subscriptions found
                          </div>
                        ) : (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>User Email</TableHead>
                                  <TableHead>Plan</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Billing Period</TableHead>
                                  <TableHead>Start Date</TableHead>
                                  <TableHead>End Date</TableHead>
                                  <TableHead>Auto Renew</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {subscriptions.map((subscription) => {
                                  const user = users.find(u => u.id === subscription.userId);
                                  return (
                                    <TableRow key={subscription.id}>
                                      <TableCell className="font-medium">
                                        <span className="truncate max-w-[200px]">
                                          {user?.email || subscription.userId.slice(0, 8) + '...'}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant="default">
                                          {subscription.planName}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          variant={subscription.status === 'active' ? 'default' : 'secondary'}
                                          className={subscription.status === 'active' ? 'bg-green-600' : ''}
                                        >
                                          {subscription.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {subscription.billingPeriod}
                                      </TableCell>
                                      <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(subscription.startDate)}
                                      </TableCell>
                                      <TableCell className="text-sm text-muted-foreground">
                                        {subscription.endDate ? formatDate(subscription.endDate) : 'N/A'}
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant={subscription.autoRenew ? 'default' : 'outline'}>
                                          {subscription.autoRenew ? 'Yes' : 'No'}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </ModernCardContent>
                    </ModernCard>
                  </TabsContent>
                </Tabs>
              </ModernContainer>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
