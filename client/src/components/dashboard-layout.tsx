import { useState } from 'react';
import { useLocation } from 'wouter';
import { Sidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  Bot,
  History,
  Settings,
  Lock
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Mobile Dashboard Layout Component
function MobileDashboardLayout({ 
  children, 
  activeTab, 
  onTabChange 
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vault', label: 'File Vault', icon: FolderOpen },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'history', label: 'Chat History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'key-info', label: 'How it works', icon: Lock },
  ];

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => item.id === activeTab);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
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
                  {/* Mobile Sidebar Header */}
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

                  {/* Mobile Navigation */}
                  <nav className="flex-1 overflow-y-auto py-4">
                    <div className="px-3 space-y-1">
                      {navItems.map((item) => {
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
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sidebar-foreground/80">Encryption Active</span>
                      </div>
                      <div className="text-xs text-sidebar-foreground/60 flex items-center">
                        <Lock className="w-3 h-3 mr-1" />
                        AES-256 Client-side
                      </div>
                      {user && (
                        <div className="pt-2 border-t border-border">
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
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="text-white h-4 w-4" />
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                {getCurrentPageTitle()}
              </h1>
            </div>
          </div>

          {/* Mobile User Menu */}
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

      {/* Mobile Content */}
      <main className="pb-4">
        {children}
      </main>
    </div>
  );
}

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setLocation(`/${tab === 'dashboard' ? '' : tab}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileDashboardLayout
          activeTab={activeTab}
          onTabChange={handleTabChange}
        >
          {children}
        </MobileDashboardLayout>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          className="fixed h-full w-64 bg-sidebar text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground"
        />

        <div className="flex-1 ml-64 overflow-hidden bg-background text-foreground">
          <main className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 w-full min-h-0 overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}