import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { ModernNavigation } from "./modern-navigation";

interface SidebarProps {
  className?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ className, activeTab, onTabChange }: SidebarProps) {
  return (
    <div className={cn(
      "w-64 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-r border-border/50 flex flex-col h-screen",
      "shadow-2xl shadow-black/5 dark:shadow-black/40 backdrop-blur-xl",
      className
    )}>
      {/* Modern Header */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600 text-white shadow-xl">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              Private Vault
            </h1>
            <p className="text-sm text-muted-foreground font-medium">Your Secure AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Modern Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <ModernNavigation 
          activeTab={activeTab} 
          onTabChange={onTabChange}
          variant="sidebar"
          showLabels={true}
          showBadges={true}
        />
      </div>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-border/30">
        <ThemeToggle />
      </div>
    </div>
  );
}
