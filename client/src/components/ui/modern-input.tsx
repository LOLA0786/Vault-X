import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const modernInputVariants = cva(
  "flex w-full rounded-xl border bg-background px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default: "border-border hover:border-border-hover focus:border-primary/50 shadow-sm hover:shadow-md focus:shadow-lg",
        filled: "bg-muted border-transparent hover:bg-muted/80 focus:bg-background focus:border-primary/50 shadow-sm hover:shadow-md focus:shadow-lg",
        outlined: "border-2 border-border hover:border-primary/30 focus:border-primary shadow-sm hover:shadow-md focus:shadow-lg",
        ghost: "border-transparent bg-transparent hover:bg-muted/50 focus:bg-background focus:border-border",
      },
      inputSize: {
        sm: "h-9 px-3 py-2 text-xs rounded-lg",
        md: "h-11 px-4 py-3 text-sm rounded-xl",
        lg: "h-12 px-5 py-3.5 text-base rounded-xl",
      }
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
)

export interface ModernInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof modernInputVariants> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({ className, variant, inputSize, type, icon, rightIcon, ...props }, ref) => {
    if (icon || rightIcon) {
      return (
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              modernInputVariants({ variant, inputSize }),
              icon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(modernInputVariants({ variant, inputSize }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
ModernInput.displayName = "ModernInput"

export { ModernInput, modernInputVariants }