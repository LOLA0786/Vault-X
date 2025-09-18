import * as React from "react"
import { cn } from "@/lib/utils"

interface ModernLayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface ModernContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

interface ModernSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'muted';
}

interface ModernGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

const ModernLayout = React.forwardRef<HTMLDivElement, ModernLayoutProps>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn("min-h-screen bg-background text-foreground", className)}
    >
      {children}
    </div>
  )
)
ModernLayout.displayName = "ModernLayout"

const ModernContainer = React.forwardRef<HTMLDivElement, ModernContainerProps>(
  ({ children, className, size = 'lg' }, ref) => {
    const sizeClasses = {
      sm: "max-w-2xl",
      md: "max-w-4xl", 
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-full"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          sizeClasses[size],
          className
        )}
      >
        {children}
      </div>
    )
  }
)
ModernContainer.displayName = "ModernContainer"

const ModernSection = React.forwardRef<HTMLElement, ModernSectionProps>(
  ({ children, className, variant = 'default' }, ref) => {
    const variantClasses = {
      default: "bg-background",
      accent: "bg-muted/30",
      muted: "bg-muted/50"
    }

    return (
      <section
        ref={ref}
        className={cn(
          "py-12 lg:py-16",
          variantClasses[variant],
          className
        )}
      >
        {children}
      </section>
    )
  }
)
ModernSection.displayName = "ModernSection"

const ModernGrid = React.forwardRef<HTMLDivElement, ModernGridProps>(
  ({ children, className, cols = 3, gap = 'md', responsive = true }, ref) => {
    const colClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      12: "grid-cols-12"
    }

    const gapClasses = {
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-12"
    }

    const responsiveClasses = responsive ? {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
      12: "grid-cols-4 md:grid-cols-6 lg:grid-cols-12"
    } : colClasses

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          responsive ? responsiveClasses[cols] : colClasses[cols],
          gapClasses[gap],
          className
        )}
      >
        {children}
      </div>
    )
  }
)
ModernGrid.displayName = "ModernGrid"

const ModernStack = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'vertical' | 'horizontal';
}>(({ children, className, spacing = 'md', direction = 'vertical' }, ref) => {
  const spacingClasses = {
    sm: direction === 'vertical' ? 'space-y-2' : 'space-x-2',
    md: direction === 'vertical' ? 'space-y-4' : 'space-x-4',
    lg: direction === 'vertical' ? 'space-y-6' : 'space-x-6',
    xl: direction === 'vertical' ? 'space-y-8' : 'space-x-8'
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        direction === 'vertical' ? 'flex-col' : 'flex-row items-center',
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  )
})
ModernStack.displayName = "ModernStack"

export { 
  ModernLayout, 
  ModernContainer, 
  ModernSection, 
  ModernGrid, 
  ModernStack 
}