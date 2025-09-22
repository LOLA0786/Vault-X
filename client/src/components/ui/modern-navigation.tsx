import * as React from "react"
import { cn } from "@/lib/utils"
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
  Crown
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
    label: 'Pricing Plans', 
    icon: Crown,
    description: 'Subscription options',
    isNew: true
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

export function ModernNavigation({ 
  activeTab, 
  onTabChange, 
  className,
  variant = 'sidebar',
  showLabels = true,
  showBadges = true
}: ModernNavigationProps) {
  if (variant === 'horizontal') {
    return (
      <nav className={cn("flex items-center space-x-1 p-1 bg-muted/30 rounded-2xl", className)}>
        {defaultNavItems.map((item) => {
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
        {defaultNavItems.map((item) => {
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

  // Default sidebar variant
  return (
    <nav className={cn("space-y-2", className)}>
      {defaultNavItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id
        
        return (
          <div key={item.id} className="relative group">
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r bg-gradient-to-b from-primary to-primary/70 shadow-lg shadow-primary/50" />
            )}
            <Button
              variant={isActive ? "default" : "ghost"}
              size="lg"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full justify-start text-base font-semibold rounded-2xl transition-all duration-300 group-hover:translate-x-1",
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:from-primary/15 hover:to-primary/10 shadow-lg border border-primary/20"
                  : "hover:bg-muted/50 hover:text-foreground text-muted-foreground hover:shadow-md"
              )}
            >
              <Icon className={cn(
                "mr-3 h-5 w-5 transition-colors duration-300", 
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {showLabels && (
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {showBadges && item.badge && (
                      <Badge 
                        variant={item.isNew ? "default" : "secondary"} 
                        className={cn(
                          "ml-2 h-5 text-xs",
                          item.isNew && "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white animate-pulse"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </Button>
          </div>
        )
      })}
      
      {/* Security Status */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse" />
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Encryption Active</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400">
          <Shield className="w-3 h-3" />
          <span className="font-medium">AES-256 Client-side</span>
        </div>
        <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
          <Zap className="w-3 h-3" />
          <span>Zero-Knowledge Architecture</span>
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