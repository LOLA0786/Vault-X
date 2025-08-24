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
  Database,
  Eye,
  Zap,
  ChevronRight,
  Home,
  User,
  LogOut,
  ArrowRight,
  Sparkles,
  Fingerprint,
  ShieldCheck,
  Activity
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SecurityBadge, SecurityIcon } from "./security-badge";

interface SidebarProps {
  className?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: { email: string } | null;
  onLogout?: () => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Security Dashboard',
    icon: Home,
    description: 'Overview & status',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500'
  },
  {
    id: 'vault',
    label: 'Secure Vault',
    icon: Database,
    description: 'Encrypted storage',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500'
  },
  {
    id: 'chat',
    label: 'AI Assistant',
    icon: MessageSquare,
    description: 'Private AI chat',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500'
  },
  {
    id: 'history',
    label: 'Chat Archive',
    icon: History,
    description: 'Encrypted history',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500'
  },
  {
    id: 'agents',
    label: 'AI Agents',
    icon: Bot,
    description: 'Custom assistants',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500'
  },
  {
    id: 'settings',
    label: 'Security Settings',
    icon: Settings,
    description: 'Key management',
    color: 'text-gray-500',
    bgColor: 'bg-gray-500'
  }
];

const securityFeatures = [
  {
    icon: Lock,
    label: 'AES-256 Encryption',
    status: 'Active',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500'
  },
  {
    icon: Eye,
    label: 'Zero-Knowledge',
    status: 'Enabled',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500'
  },
  {
    icon: Shield,
    label: 'Enterprise Security',
    status: 'Maximum',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500'
  }
];

export function Sidebar({ className, activeTab, onTabChange, user, onLogout }: SidebarProps) {
  return (
    <div className={cn(
      "w-64 h-full flex-shrink-0",
      "bg-gradient-to-b from-sidebar-background to-sidebar-background text-sidebar-foreground",
      "border-r border-sidebar-border flex flex-col shadow-2xl shadow-black/10 dark:shadow-black/50 backdrop-blur-md",
      className
    )}>
      {/* Enhanced Header */}
      <div className="flex-shrink-0 p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-security-500 to-security-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-2 w-2 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Vault-X</h1>
            <p className="text-xs text-muted-foreground">Enterprise Security</p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-sidebar-accent bg-opacity-50 rounded-lg p-3 border border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">Authenticated</p>
              </div>
              {onLogout && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onLogout}
                  className="hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full justify-start gap-3 h-12 px-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary-500/20 to-primary-600/20 border border-primary-500 border-opacity-30 text-sidebar-foreground shadow-lg shadow-primary-500/25"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent hover:bg-opacity-50 border border-transparent"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                isActive
                  ? "bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg"
                  : "bg-sidebar-accent bg-opacity-50 group-hover:shadow-md"
              )}>
                <IconComponent className={cn(
                  "h-4 w-4 transition-all duration-200",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-sidebar-foreground"
                )} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-70">{item.description}</div>
              </div>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-primary-400" />
              )}
            </Button>
          );
        })}
      </nav>

      {/* Security Status */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent bg-opacity-50 rounded-lg p-4 border border-sidebar-border">
          <div className="flex items-center gap-3 mb-4">
            <SecurityIcon type="shield" size="sm" />
            <div>
              <h4 className="text-sm font-semibold text-sidebar-foreground">Security Status</h4>
              <p className="text-xs text-muted-foreground">All systems secure</p>
            </div>
          </div>

          <div className="space-y-2">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center bg-opacity-20",
                      `bg-${feature.bgColor}`
                    )}>
                      <IconComponent className={cn("h-3 w-3", feature.color)} />
                    </div>
                    <span className="text-xs text-muted-foreground">{feature.label}</span>
                  </div>
                  <SecurityBadge variant="secure" size="sm" showIcon={false}>
                    {feature.status}
                  </SecurityBadge>
                </div>
              );
            })}
          </div>

          {/* Security Indicators */}
          <div className="mt-4 pt-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-3 w-3" />
                <span>Client-side</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" />
                <span>Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <ThemeToggle />
      </div>
    </div>
  );
}
