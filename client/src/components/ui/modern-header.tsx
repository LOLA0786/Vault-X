import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  User,
  LogOut,
  Settings,
  Shield,
  Bell,
  Search
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ModernInput } from "./modern-input"

interface ModernHeaderProps {
  title?: string;
  subtitle?: string;
  user?: {
    email: string;
    name?: string;
  };
  onLogout?: () => void;
  showSearch?: boolean;
  className?: string;
}

export function ModernHeader({
  title = "Dashboard",
  subtitle,
  user,
  onLogout,
  showSearch = false,
  className
}: ModernHeaderProps) {
  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section - Title */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Center Section - Search (optional) */}
        {showSearch && (
          <div className="flex-1 max-w-md mx-8">
            <ModernInput
              variant="filled"
              placeholder="Search..."
              icon={<Search className="h-4 w-4" />}
              className="w-full"
            />
          </div>
        )}

        {/* Right Section - Logout Button */}
        <div className="flex items-center">
          {user && onLogout && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>


      </div>
    </header>
  )
}

// Simplified header for pages that don't need full functionality
export function SimpleHeader({
  title,
  subtitle,
  className
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}