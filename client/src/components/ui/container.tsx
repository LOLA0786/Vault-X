import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const containerVariants = cva(
  "mx-auto w-full",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md", 
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        full: "max-w-full",
      },
      padding: {
        none: "",
        sm: "px-4 sm:px-6",
        md: "px-4 sm:px-6 lg:px-8",
        lg: "px-6 sm:px-8 lg:px-12",
      },
    },
    defaultVariants: {
      size: "xl",
      padding: "md",
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, ...props }, ref) => {
    return (
      <div
        className={cn(containerVariants({ size, padding, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Container.displayName = "Container";

export { Container, containerVariants };