import * as React from "react"
import { cn } from "@/lib/utils"
import { Shield, Bot, FileText, MessageSquare } from "lucide-react"

interface ModernLoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  text?: string;
}

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'avatar' | 'button';
}

export function ModernLoading({ 
  className, 
  size = 'md', 
  variant = 'spinner',
  text 
}: ModernLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  if (variant === 'spinner') {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div className={cn(
          "border-4 border-primary/20 border-t-primary rounded-full animate-spin",
          sizeClasses[size]
        )} />
        {text && (
          <p className="text-sm text-muted-foreground font-medium animate-pulse">
            {text}
          </p>
        )}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        {text && (
          <span className="ml-4 text-sm text-muted-foreground font-medium">
            {text}
          </span>
        )}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div className={cn(
          "bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse shadow-lg",
          sizeClasses[size]
        )}>
          <Shield className="w-full h-full p-2 text-white" />
        </div>
        {text && (
          <p className="text-sm text-muted-foreground font-medium">
            {text}
          </p>
        )}
      </div>
    )
  }

  return null
}

export function LoadingSkeleton({ className, variant = 'card' }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="rounded-2xl bg-muted h-48 w-full mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-8 bg-muted rounded w-full"></div>
        </div>
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className={cn("animate-pulse space-y-2", className)}>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="h-4 bg-muted rounded w-4/6"></div>
      </div>
    )
  }

  if (variant === 'avatar') {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="w-12 h-12 bg-muted rounded-full"></div>
      </div>
    )
  }

  if (variant === 'button') {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-11 bg-muted rounded-xl w-full"></div>
      </div>
    )
  }

  return null
}

// Full page loading component
export function FullPageLoading({ message = "Loading your private vault..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="text-center space-y-8 max-w-md mx-auto p-8">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600 rounded-3xl mx-auto opacity-20 animate-ping"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
            Private Vault
          </h2>
          <p className="text-muted-foreground font-medium">
            {message}
          </p>
        </div>

        {/* Loading Indicator */}
        <ModernLoading variant="dots" />

        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground bg-muted/30 rounded-full px-4 py-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>AES-256 Encryption Active</span>
        </div>
      </div>
    </div>
  )
}

// Grid loading for cards
export function GridLoading({ 
  count = 6, 
  cols = 3,
  className 
}: { 
  count?: number; 
  cols?: number;
  className?: string;
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn(
      "grid gap-6",
      gridCols[cols as keyof typeof gridCols],
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeleton key={i} variant="card" />
      ))}
    </div>
  )
}