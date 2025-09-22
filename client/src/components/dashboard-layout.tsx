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
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import { useAuth } from '@/hooks/use-auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MobileThemeToggle } from '@/components/ui/mobile-theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Footer } from '@/components/ui/footer';

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
    { id: 'vault', label: 'Vault', icon: FolderOpen },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'key-info', label: 'Info', icon: Lock },
  ];

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => item.id === activeTab);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  // Main navigation items for bottom nav (most important ones)
  const bottomNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vault', label: 'Vault', icon: FolderOpen },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'agents', label: 'Agents', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
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

            <div className="flex items-center space-x-3">
              <PrivateVaultLogo
                size="sm"
                animated={true}
                className="w-8 h-8 drop-shadow-md"
              />
              <h1 className="text-lg font-semibold text-foreground">
                {getCurrentPageTitle()}
              </h1>
            </div>
          </div>

          {/* Mobile Logout Button */}
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
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
                  {navItems.filter(item => !bottomNavItems.find(bItem => bItem.id === item.id)).map((item) => {
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

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setLocation(`/${tab === 'dashboard' ? '' : tab}`);
  };

  return (
    <>
      {/* Mobile Layout - Visible on small screens */}
      <div className="block lg:hidden min-h-screen bg-background">
        <MobileDashboardLayout
          activeTab={activeTab}
          onTabChange={handleTabChange}
        >
          {children}
        </MobileDashboardLayout>
      </div>

      {/* Desktop Layout - Visible on large screens */}
      <div className="hidden lg:block min-h-screen bg-background">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <div className="ml-64 overflow-hidden bg-background text-foreground">
            <main className="flex-1 flex flex-col min-h-screen">
              <div className="flex-1 w-full overflow-y-auto">
                {children}
              </div>

              {/* Footer */}
              <Footer />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}