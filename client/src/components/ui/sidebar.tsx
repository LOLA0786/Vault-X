import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  LayoutDashboard, 
  FolderOpen, 
  MessageSquare, 
  History, 
  Settings,
  Lock
} from "lucide-react";

interface SidebarProps {
  className?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ className, activeTab, onTabChange }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vault', label: 'File Vault', icon: FolderOpen },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'history', label: 'Chat History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn("w-64 bg-white shadow-lg border-r border-gray-200", className)}>
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Vault</h1>
            <p className="text-xs text-gray-500">Private & Secure</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-sm font-medium",
                  activeTab === item.id
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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

      {/* Security Status */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 bg-secondary rounded-full"></div>
          <span className="text-gray-600">Encryption Active</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 flex items-center">
          <Lock className="w-3 h-3 mr-1" />
          AES-256 Client-side
        </p>
      </div>
    </div>
  );
}
