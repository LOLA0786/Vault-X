import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  LayoutDashboard, 
  FolderOpen, 
  MessageSquare, 
  History, 
  Settings,
  Lock,
  Bot,
  ShieldCheck
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  className?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ className, activeTab, onTabChange }: SidebarProps) {
  const { user } = useAuth();
  const isAdmin = user?.email === 'Lolasolution27@gmail.com';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vault', label: 'File Vault', icon: FolderOpen },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'history', label: 'Chat History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'key-info', label: 'How it works', icon: Lock },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck }] : []),
  ];

  return (
  <div className={cn("w-64 bg-sidebar text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground shadow-lg border-r border-border flex flex-col h-screen", className)}>
      <div className="p-6">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground dark:text-sidebar-foreground">Private Vault</h1>
            <p className="text-xs text-sidebar-foreground/70 dark:text-sidebar-foreground/70">Your Secure AI Assistant</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto">
        <div className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-sm font-medium text-sidebar-foreground dark:text-sidebar-foreground",
                  activeTab === item.id
                    ? "text-primary bg-blue-50 dark:bg-sidebar-accent dark:text-sidebar-primary-foreground"
                    : "hover:text-foreground hover:bg-accent dark:hover:text-foreground dark:hover:bg-accent"
                )}
                onClick={() => onTabChange(item.id)}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Security Status & Theme Toggle */}
      <div className="mt-auto p-4 border-t border-gray-200 bg-white dark:bg-gray-900">
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Encryption Active</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <Lock className="w-3 h-3 mr-1" />
            AES-256 Client-side
          </p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
