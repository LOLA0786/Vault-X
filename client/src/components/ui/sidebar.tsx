import { ModernNavigation } from "./modern-navigation";
import { PrivateVaultLogo } from "./private-vault-logo";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { createPortal } from "react-dom";
import { Button } from "./button";
import { LogOut } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();

  // Only render on desktop
  if (typeof window === 'undefined' || window.innerWidth < 1024) {
    return null;
  }

  const sidebarContent = (
    <div
      className="bg-gradient-to-b from-slate-50/95 via-white/95 to-slate-50/95 dark:from-slate-950/95 dark:via-slate-900/95 dark:to-slate-950/95 backdrop-blur-xl border-r border-border/40 flex flex-col shadow-2xl shadow-black/10 dark:shadow-black/50"
      style={{
        position: 'fixed',
        left: '0px',
        top: '0px',
        height: '100vh',
        width: '280px',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Perfect Header */}
      <div className="px-6 py-5 border-b border-border/20">
        <div className="flex items-center space-x-3">
          <PrivateVaultLogo
            size="md"
            animated={true}
            className="drop-shadow-lg flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent leading-tight">
              Private Vault
            </h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">Your Secure AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Perfect Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ModernNavigation
          activeTab={activeTab}
          onTabChange={onTabChange}
          variant="sidebar"
          showLabels={true}
          showBadges={true}
        />
      </div>

      {/* Perfect Footer */}
      <div className="px-4 py-3 border-t border-border/20 bg-gradient-to-r from-muted/30 to-muted/20 space-y-3">
        <ThemeToggle />
        
        {/* Logout Button */}
        {user && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );

  // Render sidebar as portal to document body to avoid any containing block issues
  return createPortal(sidebarContent, document.body);
}
