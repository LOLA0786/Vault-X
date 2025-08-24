import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const gridVariants = cva(
  "grid w-full",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
        12: "grid-cols-4 md:grid-cols-6 lg:grid-cols-12",
      },
      gap: {
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
    },
    defaultVariants: {
      cols: 1,
      gap: "md",
    },
  }
);

const gridItemVariants = cva(
  "w-full",
  {
    variants: {
      span: {
        1: "col-span-1",
        2: "col-span-2",
        3: "col-span-3",
        4: "col-span-4",
        6: "col-span-6",
        12: "col-span-12",
        full: "col-span-full",
      },
    },
    defaultVariants: {
      span: 1,
    },
  }
);

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  responsive?: boolean;
}

export interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, responsive = true, ...props }, ref) => {
    return (
      <div
        className={cn(gridVariants({ cols, gap, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Grid.displayName = "Grid";

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, span, ...props }, ref) => {
    return (
      <div
        className={cn(gridItemVariants({ span, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GridItem.displayName = "GridItem";

export { Grid, GridItem, gridVariants, gridItemVariants };