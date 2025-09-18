import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl border p-6 pr-8 shadow-2xl transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground shadow-lg",
        success: "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-900 shadow-emerald-500/20 dark:border-emerald-800 dark:from-emerald-950 dark:to-green-950 dark:text-emerald-100",
        destructive: "border-red-200 bg-gradient-to-r from-red-50 to-rose-50 text-red-900 shadow-red-500/20 dark:border-red-800 dark:from-red-950 dark:to-rose-950 dark:text-red-100",
        warning: "border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-900 shadow-amber-500/20 dark:border-amber-800 dark:from-amber-950 dark:to-yellow-950 dark:text-amber-100",
        info: "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 shadow-blue-500/20 dark:border-blue-800 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

const ToastAction = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-lg p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
))
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

// Enhanced toast with icon
interface ModernToastProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  showIcon?: boolean;
}

const ModernToast = React.forwardRef<HTMLDivElement, ModernToastProps>(
  ({ className, variant, title, description, action, onClose, showIcon = true, ...props }, ref) => {
    const getIcon = () => {
      switch (variant) {
        case 'success':
          return <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        case 'destructive':
          return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        case 'warning':
          return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        case 'info':
          return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        default:
          return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      }
    }

    return (
      <Toast ref={ref} className={className} variant={variant} {...props}>
        <div className="flex items-start space-x-3">
          {showIcon && (
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
          )}
          <div className="flex-1 space-y-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
        {onClose && (
          <ToastClose onClick={onClose} />
        )}
      </Toast>
    )
  }
)
ModernToast.displayName = "ModernToast"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  Toast,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
  ModernToast,
}