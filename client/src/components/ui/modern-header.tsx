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

        {/* Right Section - User Menu */}
        <div className="flex items-center space-x-4">
          {/* Security Status */}
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
            <Shield className="w-3 h-3 mr-1" />
            Secure
          </Badge>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-border">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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