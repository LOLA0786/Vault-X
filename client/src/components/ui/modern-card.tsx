import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const modernCardVariants = cva(
  "rounded-2xl border bg-card text-card-foreground transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default: "shadow-sm hover:shadow-lg border-border/50 hover:border-border",
        elevated: "shadow-lg hover:shadow-2xl transform hover:-translate-y-1 border-border/30",
        glass: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl",
        gradient: "bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 border-border/30 shadow-lg hover:shadow-xl",
        security: "bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-700/30 shadow-lg shadow-emerald-500/10",
        premium: "bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-violet-900/20 border-violet-200/50 dark:border-violet-700/30 shadow-lg shadow-violet-500/10",
      },
      size: {
        sm: "p-4",
        md: "p-6", 
        lg: "p-8",
        xl: "p-10",
      },
      hover: {
        none: "",
        lift: "hover:transform hover:-translate-y-2 hover:shadow-2xl",
        glow: "hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/10",
        scale: "hover:scale-[1.02] hover:shadow-xl",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hover: "none",
    },
  }
)

export interface ModernCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modernCardVariants> {
  interactive?: boolean;
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant, size, hover, interactive = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        modernCardVariants({ variant, size, hover }),
        interactive && "cursor-pointer select-none",
        className
      )}
      {...props}
    />
  )
)
ModernCard.displayName = "ModernCard"

const ModernCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 pb-4", className)}
    {...props}
  />
))
ModernCardHeader.displayName = "ModernCardHeader"

const ModernCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-tight tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
ModernCardTitle.displayName = "ModernCardTitle"

const ModernCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
ModernCardDescription.displayName = "ModernCardDescription"

const ModernCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
ModernCardContent.displayName = "ModernCardContent"

const ModernCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
ModernCardFooter.displayName = "ModernCardFooter"

export { 
  ModernCard, 
  ModernCardHeader, 
  ModernCardFooter, 
  ModernCardTitle, 
  ModernCardDescription, 
  ModernCardContent,
  modernCardVariants 
}