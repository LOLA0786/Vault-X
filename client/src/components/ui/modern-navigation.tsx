import * as React from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "./button"
import { Badge } from "./badge"
import { 
  LayoutDashboard, 
  FolderOpen, 
  MessageSquare, 
  Bot, 
  History, 
  Settings, 
  Lock,
  Shield,
  ChevronRight,
  Zap,
  DollarSign,
  ShieldCheck
} from "lucide-react"

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  isNew?: boolean;
  description?: string;
}

interface ModernNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
  variant?: 'sidebar' | 'horizontal' | 'compact';
  showLabels?: boolean;
  showBadges?: boolean;
}

const defaultNavItems: NavigationItem[] = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    description: 'Overview and quick actions'
  },
  { 
    id: 'vault', 
    label: 'File Vault', 
    icon: FolderOpen,
    description: 'Encrypted file storage'
  },
  { 
    id: 'chat', 
    label: 'AI Assistant', 
    icon: MessageSquare,
    description: 'Chat with AI agents'
  },
  { 
    id: 'agents', 
    label: 'AI Agents', 
    icon: Bot,
    description: 'Manage AI assistants'
  },
  { 
    id: 'history', 
    label: 'Chat History', 
    icon: History,
    description: 'Previous conversations'
  },
  { 
    id: 'pricing', 
    label: 'Pricing', 
    icon: DollarSign,
    description: 'View pricing plans'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings,
    description: 'App configuration'
  },
  { 
    id: 'key-info', 
    label: 'Security Info', 
    icon: Lock,
    description: 'How encryption works'
  },
]

// Helper function to get navigation items based on user
export function getNavigationItems(user: any): NavigationItem[] {
  const isAdmin = user?.email === 'Lolasolution27@gmail.com' || user?.email === "lolasolution27@gmail.com";
  console.log('ModernNavigation - User email:', user?.email);
  console.log('ModernNavigation - Is admin:', isAdmin);
  
  const adminItem: NavigationItem = {
    id: 'admin', 
    label: 'Admin Dashboard', 
    icon: ShieldCheck,
    description: 'System administration'
  };

  return isAdmin ? [...defaultNavItems, adminItem] : defaultNavItems;
}

// Export NavigationItem type for use in other components
export type { NavigationItem };

export function ModernNavigation({ 
  activeTab, 
  onTabChange, 
  className,
  variant = 'sidebar',
  showLabels = true,
  showBadges = true
}: ModernNavigationProps) {
  const { user } = useAuth();
  const navigationItems = getNavigationItems(user);

  if (variant === 'horizontal') {
    return (
      <nav className={cn("flex items-center space-x-1 p-1 bg-muted/30 rounded-2xl", className)}>
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-background shadow-lg text-foreground" 
                  : "hover:bg-background/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {showLabels && <span className="ml-2">{item.label}</span>}
              {showBadges && item.badge && (
                <Badge 
                  variant={item.isNew ? "default" : "secondary"} 
                  className="ml-2 h-5 text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          )
        })}
      </nav>
    )
  }

  if (variant === 'compact') {
    return (
      <nav className={cn("flex flex-col space-y-1", className)}>
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative w-12 h-12 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
              {isActive && (
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
              )}
              {showBadges && item.badge && !isActive && (
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                >
                  {typeof item.badge === 'number' && item.badge > 9 ? '9+' : item.badge}
                </Badge>
              )}
            </Button>
          )
        })}
      </nav>
    )
  }

  // Perfect sidebar variant
  return (
    <nav className={cn("space-y-1", className)}>
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id
        
        return (
          <div key={item.id} className="relative group">
            {/* Perfect Active Indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-primary via-primary to-primary/80 shadow-lg shadow-primary/30" />
            )}
            
            <Button
              variant="ghost"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('ModernNavigation button clicked for:', item.id, 'isActive:', isActive, 'user:', user?.email);
                onTabChange(item.id);
              }}
              disabled={false}
              className={cn(
                "w-full justify-start text-sm font-medium rounded-xl transition-all duration-200 group-hover:translate-x-0.5 cursor-pointer h-11 px-3",
                isActive
                  ? "bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 text-primary hover:from-primary/20 hover:via-primary/15 hover:to-primary/8 shadow-sm border border-primary/10 font-semibold"
                  : "hover:bg-muted/60 hover:text-foreground text-muted-foreground hover:shadow-sm"
              )}
            >
              <Icon className={cn(
                "mr-3 h-4 w-4 transition-all duration-200 flex-shrink-0", 
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              
              {showLabels && (
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    <div className="flex items-center space-x-1 ml-2">
                      {showBadges && item.badge && (
                        <Badge 
                          variant={item.isNew ? "default" : "secondary"} 
                          className={cn(
                            "h-4 text-xs px-1.5 font-medium",
                            item.isNew && "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white animate-pulse"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {isActive && (
                        <ChevronRight className="h-3 w-3 text-primary/70" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Button>
          </div>
        )
      })}
      
      {/* Perfect Security Status */}
      <div className="mt-6 mx-1 p-3 rounded-xl bg-gradient-to-br from-emerald-50/80 via-emerald-50/60 to-emerald-100/80 dark:from-emerald-950/40 dark:via-emerald-950/30 dark:to-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800/40">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Encryption Active</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400 mb-1">
          <Shield className="w-3 h-3 flex-shrink-0" />
          <span className="font-medium">AES-256 Client-side</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Zap className="w-3 h-3 flex-shrink-0" />
          <span>Zero-Knowledge</span>
        </div>
      </div>
    </nav>
  )
}

// Breadcrumb navigation component
export function ModernBreadcrumb({ 
  items, 
  className 
}: { 
  items: Array<{ label: string; href?: string; active?: boolean }>; 
  className?: string;
}) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <span
            className={cn(
              "transition-colors duration-200",
              item.active 
                ? "text-foreground font-semibold" 
                : "text-muted-foreground hover:text-foreground cursor-pointer"
            )}
          >
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  )
}